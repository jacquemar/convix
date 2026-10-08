import { useSyncExternalStore } from 'react';
import { DEFAULT_MY_CURRENCIES, isSupported } from '../data/currencies';
import { readJson, storage, writeJson } from '../storage/storage';

/**
 * Deux états indépendants :
 * - la **paire** du convertisseur (source, cible), choisie depuis le convertisseur ;
 * - **« Vos devises »** : favoris proposés en tête du choix de devise, gérés dans l'onglet Devises.
 * Réorganiser ou vider les favoris ne change jamais la paire.
 */
const LIST_KEY = 'my_currencies';
const PAIR_KEY = 'pair';
const LEGACY_SOURCE = 'selected_source_currency';
const LEGACY_TARGET = 'selected_target_currency';
const LEGACY_FAVORITES = 'favorite_currencies';

export type Side = 'from' | 'to';
export type Pair = readonly [from: string, to: string];

type Listener = () => void;

function clean(codes: unknown): string[] {
  if (!Array.isArray(codes)) return [];
  return [...new Set(codes.filter((c): c is string => typeof c === 'string' && isSupported(c)))];
}

/** Charge l'état ; migre l'ancien modèle (paire + favoris, puis liste dont les 2 premiers = paire). */
function load(): { list: string[]; pair: Pair } {
  const legacyPair = clean([storage.getString(LEGACY_SOURCE), storage.getString(LEGACY_TARGET)]);
  const legacyFavorites = clean(readJson<string[]>(LEGACY_FAVORITES));
  const savedList = readJson<string[]>(LIST_KEY);

  const list = savedList ? clean(savedList) : clean([...legacyPair, ...legacyFavorites, ...DEFAULT_MY_CURRENCIES]);

  let pair = clean(readJson<string[]>(PAIR_KEY));
  if (pair.length !== 2) pair = clean([...legacyPair, ...list, ...DEFAULT_MY_CURRENCIES]).slice(0, 2);

  writeJson(LIST_KEY, list);
  writeJson(PAIR_KEY, pair);
  [LEGACY_SOURCE, LEGACY_TARGET, LEGACY_FAVORITES].forEach((k) => storage.remove(k));
  return { list, pair: [pair[0], pair[1]] };
}

const listeners = new Set<Listener>();
let state = load();

function commit(next: Partial<typeof state>): void {
  state = { ...state, ...next };
  if (next.list) writeJson(LIST_KEY, state.list);
  if (next.pair) writeJson(PAIR_KEY, state.pair);
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** « Vos devises » (favoris). */
export const myCurrencies = {
  get: (): string[] => state.list,

  add(code: string): void {
    if (!isSupported(code) || state.list.includes(code)) return;
    commit({ list: [...state.list, code] });
  },

  remove(code: string): void {
    commit({ list: state.list.filter((c) => c !== code) });
  },

  subscribe,

  /** Recharge depuis le stockage (tests). */
  reload(): void {
    state = load();
    listeners.forEach((l) => l());
  },
};

/** Paire du convertisseur. */
export const pair = {
  get: (): Pair => state.pair,

  /** Choisit la devise d'un côté ; si elle est déjà de l'autre côté, inverse la paire. */
  set(side: Side, code: string): void {
    if (!isSupported(code)) return;
    const [from, to] = state.pair;
    if (side === 'from' ? code === from : code === to) return;
    if (side === 'from' ? code === to : code === from) return pair.swap();
    commit({ pair: side === 'from' ? [code, to] : [from, code] });
  },

  swap(): void {
    commit({ pair: [state.pair[1], state.pair[0]] });
  },

  subscribe,
};

export function useMyCurrencies(): string[] {
  return useSyncExternalStore(subscribe, myCurrencies.get, myCurrencies.get);
}

export function usePair(): Pair {
  return useSyncExternalStore(subscribe, pair.get, pair.get);
}
