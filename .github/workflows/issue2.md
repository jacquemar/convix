Implémenter `src/services/currency.service.ts` avec les méthodes:
- `convert(amount: number, from: string, to: string): Promise<number>`
- `getRate(from: string, to: string): Promise<Rate>`

Utiliser MMKV pour le cache des taux. La stratégie est **Cache First → Network Refresh** (afficher les données en cache immédiatement, puis rafraîchir en arrière-plan).

**Fonctionnalités** :
- Cache des taux avec une durée de validité de **24h**.
- Gestion du mode offline (utiliser les derniers taux connus).
- Indicateur "Hors connexion" si les données sont en cache.

**Critères d'acceptation** :
- [ ] Les taux sont stockés dans MMKV avec une clé unique (ex: `USD_EUR`).
- [ ] La stratégie **Cache First** est respectée.
- [ ] Les erreurs réseau sont gérées (pas de crash).
- [ ] Un test unitaire est écrit pour `convert`.