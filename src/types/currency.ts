export type Decimals = 0 | 2 | 3;

export type Currency = {
  code: string;        // "XOF" (ISO 4217)
  name: string;        // "Franc CFA (BCEAO)" — nom français complet
  country: string;     // "ci" → drapeau rond (src/assets/flags.ts)
  decimals: Decimals;  // unités mineures ISO 4217 : 0 pour XOF, JPY… ; 3 pour TND
  /** Absente des taux BCE : taux indicatif d'une source alternative (src/api/currency-api.ts). */
  alt?: true;
  /** Parité fixe : 1 `anchor` = `rate` unités de la devise (pas de taux BCE). */
  peg?: { anchor: string; rate: number };
};

export type Rate = {
  base: string;       // "USD"
  quote: string;      // "EUR"
  rate: number;       // 0.852
  date: string;       // "2026-08-16" (date du taux)
  cachedAt: string;   // "2026-08-16T10:30:00Z" (quand on a récupéré le taux)
};

/** Origine du taux : BCE (Frankfurter), parité fixe pure, ou source alternative indicative. */
export type RateSource = 'ecb' | 'peg' | 'alt';

/**
 * - `live` : taux récupéré il y a moins de 24 h ;
 * - `cached` : dernier taux connu, l'API est injoignable (hors connexion) ;
 * - `peg` : parité fixe pure (EUR ↔ XOF, XOF ↔ XAF), sans réseau.
 */
export type RateKind = 'live' | 'cached' | 'peg';

export type RateInfo = {
  from: string;
  to: string;
  /** Valeur de 1 `from` en `to`. */
  rate: number;
  source: RateSource;
  /** Date de publication du taux (YYYY-MM-DD), absente pour une parité pure. */
  date?: string;
  /** Moment où le taux a été récupéré (ISO), absent pour une parité pure. */
  fetchedAt?: string;
  kind: RateKind;
  /** Une des deux devises passe par une parité fixe. */
  pegged: boolean;
  /** Variation en % depuis la publication précédente, si connue. */
  change?: number;
};
