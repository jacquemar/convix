/**
 * Montants : les valeurs circulent en chaînes brutes avec « . » comme séparateur
 * ("3999.5") ; l'affichage suit fr-FR ("3 999,5"). Portage de `applyKey` / `formatAmount`
 * du design system, avec les décimales propres à chaque devise.
 */

import type { Decimals } from '../types/currency';

/** Espace fine insécable : séparateur des milliers en français. */
export const NNBSP = '\u202F';
/** Signe moins typographique. */
export const MINUS = '\u2212';

export type KeypadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.' | 'back' | 'clear';

/** "3999.5" → "3 999,5". Garde le séparateur final pendant la saisie ("12." → "12,"). */
export function formatAmount(raw: string): string {
  if (!raw) return '0';
  const [int, dec] = raw.split('.');
  const grouped = (int || '0').replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
  return dec === undefined ? grouped : `${grouped},${dec}`;
}

/**
 * Applique une touche du clavier à un montant brut.
 * `decimals` : 0 pour une devise sans décimales (la virgule est alors ignorée).
 */
export function applyKey(raw: string, key: KeypadKey | string, decimals: Decimals = 2, maxLength = 12): string {
  if (key === 'back') return raw.slice(0, -1);
  if (key === 'clear') return '';
  if (key === '.') {
    if (decimals === 0 || raw.includes('.')) return raw;
    return (raw || '0') + '.';
  }
  if (!/^\d$/.test(key) || raw.replace('.', '').length >= maxLength) return raw;
  const [, dec] = raw.split('.');
  if (dec !== undefined && dec.length >= decimals) return raw;
  if (raw === '0') return key;
  return raw + key;
}

/** Nombre → montant brut arrondi aux décimales de la devise, sans zéros inutiles ("600.50" → "600.5"). */
export function toRaw(value: number, decimals: Decimals): string {
  if (!Number.isFinite(value) || value <= 0) return '0';
  const fixed = value.toFixed(decimals);
  return decimals === 0 ? fixed : fixed.replace(/\.?0+$/, '');
}

/** Montant brut → nombre. */
export function parseRaw(raw: string): number {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

/** Taux lisible : 4 décimales sous 10, 2 au-delà ("0,8523", "655,96"). */
export function formatRate(rate: number): string {
  return formatNumber(rate, rate < 10 ? 4 : 2);
}

/** Variation signée : "+0,42 %", "−1,05 %". */
export function formatChange(percent: number): string {
  const sign = percent >= 0 ? '+' : MINUS;
  return `${sign}${formatNumber(Math.abs(percent), 2, 2)}${NNBSP}%`;
}

/** Heure locale "11:30". */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Formatage fr-FR déterministe (indépendant d'Intl, absent ou incomplet sur certains moteurs). */
export function formatNumber(value: number, maxDecimals: number, minDecimals = 0): string {
  const fixed = value.toFixed(maxDecimals);
  let [int, dec = ''] = fixed.split('.');
  dec = dec.replace(/0+$/, '');
  while (dec.length < minDecimals) dec += '0';
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
  return dec ? `${grouped},${dec}` : grouped;
}
