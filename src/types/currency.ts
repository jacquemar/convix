export type Currency = {
  code: string;       // "USD"
  name: string;       // "US Dollar"
  symbol: string;     // "$"
  flag: string;       // "🇺🇸"
};

export type Rate = {
  base: string;       // "USD"
  quote: string;      // "EUR"
  rate: number;       // 0.852
  date: string;       // "2026-08-16" (date du taux)
  cachedAt: string;   // "2026-08-16T10:30:00Z" (quand on a récupéré le taux)
};

export type Conversion = {
  amount: number;
  from: Currency;
  to: Currency;
  result: number;
  rate: Rate;
};

// Liste des devises supportées par l'API Frankfurter
export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "XOF", name: "West African CFA franc", symbol: "CFA", flag: "🇨🇮" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
];