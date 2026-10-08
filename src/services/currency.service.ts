import { frankfurterClient } from '../api/frankfurter';
import { currencyApi, type AltRateTable } from '../api/currency-api';
import { getCurrency } from '../data/currencies';
import { readJson, storage, writeJson } from '../storage/storage';
import type { RateInfo } from '../types/currency';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h
const RATES_PREFIX = 'rates_';
const CHANGE_PREFIX = 'change_';
const ALT_KEY = 'alt_rates';
const ALT_PREVIOUS_KEY = 'alt_rates_previous';
const LEGACY_PREFIX = 'rate_';

/** Tableau de taux stocké dans MMKV : 1 `base` = rates[code] code. */
interface StoredTable {
  base: string;
  date: string;
  fetchedAt: string;
  rates: Record<string, number>;
}

/**
 * Devise à interroger pour `code`, et facteur à appliquer :
 * 1 `code` = `factor` `quoted` (ex. 1 XOF = 1/655,957 EUR).
 */
function resolve(code: string): { quoted: string; factor: number; pegged: boolean } {
  const peg = getCurrency(code)?.peg;
  return peg ? { quoted: peg.anchor, factor: 1 / peg.rate, pegged: true } : { quoted: code, factor: 1, pegged: false };
}

function isFresh(table: { fetchedAt: string } | undefined): boolean {
  return !!table && Date.now() - new Date(table.fetchedAt).getTime() < CACHE_DURATION;
}

function previousDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export class CurrencyService {
  private static instance: CurrencyService;
  private inflight = new Map<string, Promise<StoredTable>>();

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  /**
   * Taux de `from` vers `to`. Cache First → Network Refresh :
   * cache de moins de 24 h, sinon réseau, sinon dernier taux connu (`kind: 'cached'`).
   * BCE quand les deux devises y sont (après parité), source alternative sinon.
   * Lève une erreur seulement si aucun taux n'a jamais été récupéré pour cette paire.
   */
  async getRateInfo(from: string, to: string, options: { force?: boolean } = {}): Promise<RateInfo> {
    const source = resolve(from);
    const target = resolve(to);
    const pegged = source.pegged || target.pegged;
    // 1 from = source.factor quotedFrom ; 1 quotedTo = 1/target.factor to.
    const pegFactor = source.factor / target.factor;
    const force = options.force ?? false;

    if (source.quoted === target.quoted) {
      return { from, to, rate: pegFactor, source: 'peg', kind: from === to ? 'live' : 'peg', pegged };
    }

    if (getCurrency(source.quoted)?.alt || getCurrency(target.quoted)?.alt) {
      return this.getAltRateInfo(from, to, source.quoted, target.quoted, pegFactor, pegged, force);
    }

    const { table, stale } = await this.load(RATES_PREFIX + source.quoted, force, () => this.fetchEcb(source.quoted));
    const ecbRate = table.rates[target.quoted];
    if (ecbRate === undefined) {
      throw new Error(`Taux non disponible pour ${from} → ${to}`);
    }
    const change = await this.getEcbChange(source.quoted, target.quoted, table.date).catch(() => undefined);
    return {
      from,
      to,
      rate: ecbRate * pegFactor,
      source: 'ecb',
      date: table.date,
      fetchedAt: table.fetchedAt,
      kind: stale ? 'cached' : 'live',
      pegged,
      change,
    };
  }

  private async getAltRateInfo(
    from: string,
    to: string,
    quotedFrom: string,
    quotedTo: string,
    pegFactor: number,
    pegged: boolean,
    force: boolean,
  ): Promise<RateInfo> {
    const { table, stale } = await this.load(ALT_KEY, force, () => this.fetchAlt());
    const cross = (rates: Record<string, number>) => {
      const a = quotedFrom === 'EUR' ? 1 : rates[quotedFrom];
      const b = quotedTo === 'EUR' ? 1 : rates[quotedTo];
      return a && b ? b / a : undefined;
    };
    const rate = cross(table.rates);
    if (rate === undefined) {
      throw new Error(`Taux non disponible pour ${from} → ${to}`);
    }
    const previous = await this.getAltPrevious(table.date).catch(() => undefined);
    const previousRate = previous && cross(previous.rates);
    return {
      from,
      to,
      rate: rate * pegFactor,
      source: 'alt',
      date: table.date,
      fetchedAt: table.fetchedAt,
      kind: stale ? 'cached' : 'live',
      pegged,
      change: previousRate ? (rate / previousRate - 1) * 100 : undefined,
    };
  }

  /** Conversion simple (utilitaire, l'écran calcule localement avec `getRateInfo`). */
  async convert(amount: number, from: string, to: string): Promise<number> {
    if (from === to) return amount;
    const { rate } = await this.getRateInfo(from, to);
    return Math.round(amount * rate * 10000) / 10000;
  }

  /** Force le rafraîchissement des taux utilisés par une devise. */
  async refresh(code: string): Promise<void> {
    const { quoted } = resolve(code);
    if (getCurrency(quoted)?.alt) {
      await this.load(ALT_KEY, true, () => this.fetchAlt());
    } else {
      await this.load(RATES_PREFIX + quoted, true, () => this.fetchEcb(quoted));
    }
  }

  /** Cache de moins de 24 h, sinon réseau, sinon cache périmé (`stale`). */
  private async load(key: string, force: boolean, fetcher: () => Promise<StoredTable>) {
    const cached = readJson<StoredTable>(key);
    if (cached && !force && isFresh(cached)) return { table: cached, stale: false };
    try {
      return { table: await this.once(key, fetcher), stale: false };
    } catch (error) {
      if (cached) return { table: cached, stale: true };
      throw error;
    }
  }

  /** Un seul appel réseau à la fois par clé ; le résultat est stocké. */
  private once(key: string, fetcher: () => Promise<StoredTable>): Promise<StoredTable> {
    const pending = this.inflight.get(key);
    if (pending) return pending;
    const request = fetcher()
      .then((table) => {
        writeJson(key, table);
        return table;
      })
      .finally(() => this.inflight.delete(key));
    this.inflight.set(key, request);
    return request;
  }

  private async fetchEcb(base: string): Promise<StoredTable> {
    const list = await frankfurterClient.getLatestRates(base);
    return {
      base,
      date: list[0]?.date ?? new Date().toISOString().slice(0, 10),
      fetchedAt: new Date().toISOString(),
      rates: Object.fromEntries(list.map((r) => [r.quote, r.rate])),
    };
  }

  private async fetchAlt(): Promise<StoredTable> {
    const table = await currencyApi.latest();
    return { base: 'EUR', date: table.date, fetchedAt: new Date().toISOString(), rates: table.rates };
  }

  /** Taux alternatifs de la veille de `date` (pour la variation), mis en cache. */
  private async getAltPrevious(date: string): Promise<AltRateTable> {
    const wanted = previousDay(date);
    const cached = readJson<AltRateTable>(ALT_PREVIOUS_KEY);
    if (cached?.date === wanted) return cached;
    const table = await currencyApi.onDate(wanted);
    writeJson(ALT_PREVIOUS_KEY, { ...table, date: wanted });
    return table;
  }

  /** Variation (%) entre la publication BCE `date` et la précédente, mise en cache par date. */
  private async getEcbChange(base: string, quote: string, date: string): Promise<number | undefined> {
    const key = `${CHANGE_PREFIX}${base}_${quote}`;
    const cached = readJson<{ date: string; change: number }>(key);
    if (cached?.date === date) return cached.change;

    const end = new Date(`${date}T00:00:00Z`);
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    const history = await frankfurterClient.getHistoricalRates(base, quote, start.toISOString().slice(0, 10), date);
    const sorted = history.filter((r) => r.date <= date).sort((a, b) => a.date.localeCompare(b.date));
    if (sorted.length < 2) return undefined;
    const last = sorted[sorted.length - 1].rate;
    const previous = sorted[sorted.length - 2].rate;
    const change = (last / previous - 1) * 100;
    writeJson(key, { date, change });
    return change;
  }

  /** Supprime les taux stockés (préférences et devises conservées). */
  clearCache(): void {
    for (const key of storage.getAllKeys()) {
      if (
        key.startsWith(RATES_PREFIX) ||
        key.startsWith(CHANGE_PREFIX) ||
        key.startsWith(LEGACY_PREFIX) ||
        key === ALT_KEY ||
        key === ALT_PREVIOUS_KEY
      ) {
        storage.remove(key);
      }
    }
    frankfurterClient.clearCache();
  }
}

export const currencyService = CurrencyService.getInstance();
