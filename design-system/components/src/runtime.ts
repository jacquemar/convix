/**
 * Runtime glue for the Convix bundle.
 *
 * The bundle is a classic script: React 18 is NOT imported, it is read from `window.React`
 * (the design-system page and any consumer load it first). JSX compiles to
 * `React.createElement` against this binding.
 */
import type * as ReactTypes from 'react';

export const React = (window as unknown as { React: typeof ReactTypes }).React;

/** Joins class names, skipping falsy values. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Narrow no-break space — the French thousands separator. */
const NNBSP = ' ';

/**
 * Formats a raw keypad string ("3999.5") for display ("3 999,5").
 * Keeps a trailing separator while typing ("12," stays "12,").
 */
export function formatAmount(raw: string, decimalSeparator: ',' | '.' = ','): string {
  if (!raw) return '0';
  const [int, dec] = raw.split('.');
  const grouped = (int || '0').replace(/\B(?=(\d{3})+(?!\d))/g, decimalSeparator === ',' ? NNBSP : ',');
  return dec === undefined ? grouped : `${grouped}${decimalSeparator}${dec}`;
}

/**
 * Applies a keypad key to a raw amount string.
 * `raw` uses "." internally whatever the displayed separator.
 */
export function applyKey(raw: string, key: string, maxLength = 12): string {
  if (key === 'back') return raw.slice(0, -1);
  if (key === 'clear') return '';
  if (key === '.') {
    if (raw.includes('.')) return raw;
    return (raw || '0') + '.';
  }
  if (!/^\d$/.test(key) || raw.replace('.', '').length >= maxLength) return raw;
  const [, dec] = raw.split('.');
  if (dec !== undefined && dec.length >= 2) return raw; // two decimals max
  if (raw === '0') return key;
  return raw + key;
}
