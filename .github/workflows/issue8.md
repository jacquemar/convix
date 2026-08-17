Étendre `src/api/frankfurter.ts` pour supporter les taux historiques.

**Fonctionnalités** :
- Méthode `getHistoricalRates(base: string, quote: string, startDate: string, endDate: string): Promise<Rate[]>`.
- Validation des dates (format YYYY-MM-DD).
- Gestion des erreurs : dates invalides, période trop longue, devise non supportée.
- Cache des résultats (MMKV, durée 24h).

**Technique** :
- L'API Frankfurter supporte les plages de dates : `https://api.frankfurter.app/2026-01-01..2026-01-31?from=USD&to=EUR`.
- Limiter la période max à 1 an (limitation API).

**Critères d'acceptation** :
- [ ] La méthode retourne les taux historiques pour une paire de devises.
- [ ] Les erreurs sont gérées (dates invalides, devise inconnue).
- [ ] Le cache fonctionne (pas d'appel API redondant).
- [ ] Un test unitaire est écrit.