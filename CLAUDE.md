# Convix - CLAUDE.md

## 📌 Conventions de Code
- **Nommage** :
  - Variables : `camelCase` (ex: `currencyList`).
  - Composants : `PascalCase` (ex: `CurrencySelector`).
  - Fichiers : `kebab-case` (ex: `currency.service.ts`).
- **Types** :
  - Toujours utiliser `TypeScript` (pas de `any`).
  - Exemple :
    ```typescript
    type Currency = {
      code: string;
      name: string;
      symbol: string;
    };
    ```
- **Commits** :
  - Format : `feat: add currency selector` ou `fix: offline mode crash`.
  - **Jamais** de commits génériques comme "update" ou "fix bug".

## 📌 Commandes Utiles
- Lancer le projet :
  ```bash
  npx expo start
  ```
- Builder une APK (pour tests) :
  ```bash
  npx expo build:android -t apk
  ```
- Lancer les tests (quand ils seront ajoutés) :
  ```bash
  npm test
  ```

## 📌 Règles Métier
- **Précision des calculs** :
  - Utiliser `number` avec **4 décimales max** pour les taux.
  - Arrondir le résultat final à **2 décimales** pour l'affichage.
- **Cache** :
  - Durée de validité : **24h**.
  - Stratégie : **Cache First → Network Refresh**.
- **Offline** :
  - Toujours afficher les **derniers taux connus** si l'API est indisponible.
  - Ajouter un indicateur "Hors connexion" en haut de l'écran.

## 📌 Points de Vigilance
- **Erreurs réseau** :
  - Ne **jamais** afficher l'erreur technique à l'utilisateur.
  - Exemple :
    ```typescript
    catch (error) {
      console.error(error);
      Alert.alert("Impossible de récupérer les taux. Vérifiez votre connexion.");
    }
    ```
- **Performances** :
  - Éviter les **re-renders inutiles** (utiliser `useMemo` et `useCallback`).
  - Ne pas faire d'appels API à chaque frappe clavier.

## 📌 Structure du Projet
```
src/
├── api/                # Appels API (Frankfurter)
├── services/           # Logique métier (conversion, cache)
├── storage/            # MMKV (stockage local)
├── hooks/              # Custom hooks (ex: useCurrency)
├── components/         # Composants réutilisables
├── screens/            # Écrans (ConverterScreen, HistoryScreen, etc.)
├── types/              # Types TypeScript
├── utils/              # Utilitaires (calculs, formatage)
└── navigation/         # React Navigation
```