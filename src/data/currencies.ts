import type { Currency } from '../types/currency';

/** 1 EUR = 655,957 XOF / XAF (parités fixes BCEAO et BEAC). */
export const CFA_EUR_PARITY = 655.957;

/**
 * Devises prises en charge : les 30 publiées par la BCE (via Frankfurter), les francs CFA par
 * parité fixe, et des devises africaines / du Golfe absentes de la BCE (`alt`, taux indicatifs).
 * Ordre « local d'abord » (README du design system).
 */
export const CURRENCIES: Currency[] = [
  { code: 'XOF', name: 'Franc CFA (BCEAO)', country: 'ci', decimals: 0, peg: { anchor: 'EUR', rate: CFA_EUR_PARITY } },
  { code: 'XAF', name: 'Franc CFA (BEAC)', country: 'cm', decimals: 0, peg: { anchor: 'EUR', rate: CFA_EUR_PARITY } },
  { code: 'EUR', name: 'Euro', country: 'eu', decimals: 2 },
  { code: 'USD', name: 'Dollar américain', country: 'us', decimals: 2 },
  { code: 'NGN', name: 'Naira nigérian', country: 'ng', decimals: 2, alt: true },
  { code: 'GHS', name: 'Cedi ghanéen', country: 'gh', decimals: 2, alt: true },
  { code: 'MAD', name: 'Dirham marocain', country: 'ma', decimals: 2, alt: true },
  { code: 'GBP', name: 'Livre sterling', country: 'gb', decimals: 2 },
  { code: 'CHF', name: 'Franc suisse', country: 'ch', decimals: 2 },
  { code: 'CAD', name: 'Dollar canadien', country: 'ca', decimals: 2 },
  { code: 'CNY', name: 'Yuan chinois', country: 'cn', decimals: 2 },
  { code: 'JPY', name: 'Yen japonais', country: 'jp', decimals: 0 },
  { code: 'DZD', name: 'Dinar algérien', country: 'dz', decimals: 2, alt: true },
  { code: 'TND', name: 'Dinar tunisien', country: 'tn', decimals: 3, alt: true },
  { code: 'EGP', name: 'Livre égyptienne', country: 'eg', decimals: 2, alt: true },
  { code: 'GNF', name: 'Franc guinéen', country: 'gn', decimals: 0, alt: true },
  { code: 'CDF', name: 'Franc congolais', country: 'cd', decimals: 2, alt: true },
  { code: 'RWF', name: 'Franc rwandais', country: 'rw', decimals: 0, alt: true },
  { code: 'KES', name: 'Shilling kényan', country: 'ke', decimals: 2, alt: true },
  { code: 'UGX', name: 'Shilling ougandais', country: 'ug', decimals: 0, alt: true },
  { code: 'TZS', name: 'Shilling tanzanien', country: 'tz', decimals: 2, alt: true },
  { code: 'ETB', name: 'Birr éthiopien', country: 'et', decimals: 2, alt: true },
  { code: 'AOA', name: 'Kwanza angolais', country: 'ao', decimals: 2, alt: true },
  { code: 'MGA', name: 'Ariary malgache', country: 'mg', decimals: 2, alt: true },
  { code: 'MUR', name: 'Roupie mauricienne', country: 'mu', decimals: 2, alt: true },
  { code: 'CVE', name: 'Escudo cap-verdien', country: 'cv', decimals: 2, alt: true },
  { code: 'GMD', name: 'Dalasi gambien', country: 'gm', decimals: 2, alt: true },
  { code: 'AED', name: 'Dirham des Émirats', country: 'ae', decimals: 2, alt: true },
  { code: 'SAR', name: 'Riyal saoudien', country: 'sa', decimals: 2, alt: true },
  { code: 'ZAR', name: 'Rand sud-africain', country: 'za', decimals: 2 },
  { code: 'TRY', name: 'Livre turque', country: 'tr', decimals: 2 },
  { code: 'INR', name: 'Roupie indienne', country: 'in', decimals: 2 },
  { code: 'BRL', name: 'Réal brésilien', country: 'br', decimals: 2 },
  { code: 'AUD', name: 'Dollar australien', country: 'au', decimals: 2 },
  { code: 'NZD', name: 'Dollar néo-zélandais', country: 'nz', decimals: 2 },
  { code: 'DKK', name: 'Couronne danoise', country: 'dk', decimals: 2 },
  { code: 'SEK', name: 'Couronne suédoise', country: 'se', decimals: 2 },
  { code: 'NOK', name: 'Couronne norvégienne', country: 'no', decimals: 2 },
  { code: 'ISK', name: 'Couronne islandaise', country: 'is', decimals: 0 },
  { code: 'PLN', name: 'Zloty polonais', country: 'pl', decimals: 2 },
  { code: 'CZK', name: 'Couronne tchèque', country: 'cz', decimals: 2 },
  { code: 'HUF', name: 'Forint hongrois', country: 'hu', decimals: 2 },
  { code: 'RON', name: 'Leu roumain', country: 'ro', decimals: 2 },
  { code: 'ILS', name: 'Shekel israélien', country: 'il', decimals: 2 },
  { code: 'KRW', name: 'Won sud-coréen', country: 'kr', decimals: 0 },
  { code: 'HKD', name: 'Dollar de Hong Kong', country: 'hk', decimals: 2 },
  { code: 'SGD', name: 'Dollar de Singapour', country: 'sg', decimals: 2 },
  { code: 'THB', name: 'Baht thaïlandais', country: 'th', decimals: 2 },
  { code: 'MYR', name: 'Ringgit malaisien', country: 'my', decimals: 2 },
  { code: 'IDR', name: 'Roupie indonésienne', country: 'id', decimals: 2 },
  { code: 'PHP', name: 'Peso philippin', country: 'ph', decimals: 2 },
  { code: 'MXN', name: 'Peso mexicain', country: 'mx', decimals: 2 },
];

const BY_CODE = new Map(CURRENCIES.map((c) => [c.code, c]));

export function getCurrency(code: string): Currency | undefined {
  return BY_CODE.get(code);
}

export function isSupported(code: string): boolean {
  return BY_CODE.has(code);
}

/** Paire et liste proposées au premier lancement. */
export const DEFAULT_MY_CURRENCIES = ['XOF', 'EUR', 'USD'];

/** Recherche sur le code et le nom, insensible à la casse et aux accents. */
export function matchesQuery(currency: Currency, query: string): boolean {
  const needle = normalize(query.trim());
  if (!needle) return true;
  return normalize(currency.code).includes(needle) || normalize(currency.name).includes(needle);
}

function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
