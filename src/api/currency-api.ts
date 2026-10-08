/**
 * Source alternative pour les devises absentes de la BCE (NGN, GHS, MAD…) :
 * fawazahmed0/exchange-api — gratuite, sans clé, mise à jour quotidienne, historique par date.
 * Taux indicatifs agrégés, à présenter comme tels. Deux miroirs : jsDelivr puis Cloudflare Pages.
 */

export interface AltRateTable {
  /** Date des taux (YYYY-MM-DD). */
  date: string;
  /** Valeur de 1 EUR dans chaque devise, codes ISO en majuscules. */
  rates: Record<string, number>;
}

interface AltResponse {
  date: string;
  eur: Record<string, number>;
}

const TIMEOUT = 10000;

function mirrors(version: string): string[] {
  return [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${version}/v1/currencies/eur.json`,
    `https://${version}.currency-api.pages.dev/v1/currencies/eur.json`,
  ];
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Source alternative : HTTP ${response.status}`);
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchTable(version: string): Promise<AltRateTable> {
  let lastError: unknown;
  for (const url of mirrors(version)) {
    try {
      const data = await fetchJson<AltResponse>(url);
      const rates: Record<string, number> = {};
      for (const [code, value] of Object.entries(data.eur)) {
        if (typeof value === 'number' && value > 0) rates[code.toUpperCase()] = value;
      }
      return { date: data.date, rates };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Source alternative indisponible');
}

export const currencyApi = {
  /** Derniers taux publiés, base EUR. */
  latest: (): Promise<AltRateTable> => fetchTable('latest'),
  /** Taux d'une date passée (YYYY-MM-DD), base EUR. */
  onDate: (date: string): Promise<AltRateTable> => fetchTable(date),
};
