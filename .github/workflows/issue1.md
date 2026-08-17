Créer `src/api/frankfurter.ts` avec les méthodes:
- `getLatestRates(base: string): Promise<Rate[]>`
- `getCurrencies(): Promise<Currency[]>`

Utiliser `fetch` pour les appels API. Gérer les erreurs réseau (404, 500, timeout) avec des messages clairs. Ajouter les types TypeScript pour les réponses API.

**API Frankfurter** : https://www.frankfurter.app/docs/

**Critères d'acceptation** :
- [ ] Les méthodes sont typées avec TypeScript.
- [ ] Les erreurs réseau sont gérées (pas de crash).
- [ ] Les réponses API sont validées.
- [ ] Un test unitaire est écrit pour `getLatestRates`.