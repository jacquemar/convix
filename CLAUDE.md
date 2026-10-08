# Convix - CLAUDE.md

## 📌 Conventions de Code
- **Nommage** :
  - Variables : `camelCase` (ex: `currencyList`).
  - Composants et écrans : `PascalCase`, fichier du même nom (ex: `CurrencyItem.tsx`, `ConverterScreen.tsx`).
  - Autres fichiers : `kebab-case` (ex: `currency.service.ts`, `my-currencies.ts`).
- **Types** :
  - Toujours utiliser `TypeScript` (pas de `any`).
- **Commits** :
  - Format : `feat: add currency selector` ou `fix: offline mode crash`.
  - **Jamais** de commits génériques comme "update" ou "fix bug".

## 📌 Commandes Utiles
- Lancer le projet (dev build, `expo-dev-client`) :
  ```bash
  npx expo start
  ```
- Builder une APK de test :
  ```bash
  eas build --platform android --profile preview
  ```
- Tests unitaires / tests réseau (API Frankfurter réelle) :
  ```bash
  npm test
  npm run test:integration
  ```
- Régénérer le thème RN, les icônes et le logo depuis le design system :
  ```bash
  npm run tokens
  ```
- Régénérer l'icône d'app, le splash et le favicon : `node scripts/build-app-icons.mjs`.
- Mettre à jour les drapeaux (circle-flags) : `node scripts/fetch-flags.mjs`.

## 📌 Design system
- Source de vérité : `design-system/tokens.json` (voir `design-system/README.md`, le brand book).
  Les composants web de `design-system/components/` sont la **référence visuelle** ; l'app a ses
  propres composants React Native dans `src/components/ui/`.
- `src/theme/tokens.ts` et `src/assets/icons.ts` sont **générés** : ne jamais les éditer à la main.
- Aucune couleur en dur dans `src/` (un test le vérifie) : passer par `useTheme().colors`.
- Texte : toujours le composant `Text` de `src/theme` avec un `variant` du design system.
- Sur le hero, envelopper dans `HeroCard` (ou `HeroScope`) ; sur le clavier / la tab bar, `PanelScope`.
- Voix : vouvoiement, pas d'emoji, pas de point d'exclamation, verbes à l'infinitif sur les boutons.
  Libellés centralisés dans `src/i18n/fr.ts`.

## 📌 Règles Métier
- **Devises** : `src/data/currencies.ts`. Trois origines de taux :
  - BCE via Frankfurter (30 devises) ;
  - parité fixe : 1 EUR = 655,957 XOF / XAF, ces devises passent par l'euro ;
  - source alternative (`alt: true`, `src/api/currency-api.ts`, fawazahmed0/exchange-api) pour les devises
    absentes de la BCE (NGN, GHS, MAD…) : taux **indicatifs**, signalés comme tels à l'écran.
- **Paire et favoris sont indépendants** (`src/services/my-currencies.ts`) : la paire se choisit dans le
  convertisseur (toucher drapeau / code), « Vos devises » sont des favoris proposés en premier.
- **Précision des calculs** :
  - Taux : `number` complet, affiché avec 4 décimales sous 10, 2 au-delà.
  - Montants : décimales ISO 4217 de la devise (0 pour XOF, XAF, JPY, GNF… ; 3 pour TND ; 2 sinon).
- **Format** : fr-FR — espace fine pour les milliers, virgule décimale, `−` typographique.
- **Cache** : 24 h, stratégie **Cache First → Network Refresh**.
- **Offline** :
  - Toujours afficher les **derniers taux connus** si l'API est indisponible.
  - Indicateur « Hors connexion » en haut de l'écran (pastille de l'en-tête).

## 📌 Points de Vigilance
- **Erreurs réseau** : ne **jamais** afficher l'erreur technique à l'utilisateur ; `console.error` + message
  conforme à la voix (« Impossible de récupérer les taux. Vérifiez votre connexion. »).
- **Performances** :
  - Éviter les **re-renders inutiles** (`useMemo`, `useCallback`).
  - Ne pas faire d'appels API à chaque frappe : le taux de la paire est chargé une fois, la conversion est locale.

## 📌 Structure du Projet
```
src/
├── api/                # Frankfurter (BCE) et source alternative
├── assets/             # icons.ts (généré), flags.ts (circle-flags)
├── components/ui/      # Composants du design system (React Native)
├── data/               # Catalogue des devises
├── hooks/              # useRateInfo
├── i18n/               # Libellés français
├── navigation/         # Onglets : Devises · Convertir · Réglages
├── screens/            # ConverterScreen, CurrenciesScreen, SettingsScreen
├── services/           # Taux (cache, parité), « Vos devises »
├── storage/            # MMKV, préférences
├── theme/              # tokens.ts (généré), ThemeProvider, Text, polices, mouvement
├── types/              # Types TypeScript
└── utils/              # Montants : saisie clavier, formatage fr-FR
```
