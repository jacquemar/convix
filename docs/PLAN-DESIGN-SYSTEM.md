# Plan d'implémentation — Design system Convix dans l'app Expo

> Statut : décisions D1–D9 validées le 2026-10-08. Phases 0 à 9 implémentées sur `feat/design-system-integration` (non commité, non vérifié sur appareil).
> Écarts : pas d'écran « catalogue » de dev (Phase 4) ; pas de flou `expo-blur` (remplissage translucide, rendu identique iOS/Android).
> Base : `main` (681d1dc) + travail local non commité (navigation par onglets, splash) + PR #14 (`feat/design-system`).

---

## 1. État des lieux

### L'app aujourd'hui
| Élément | État |
|---|---|
| Stack | Expo 57, React Native 0.86, React 19, TypeScript strict, MMKV, React Navigation 7 (bottom-tabs), React Query (installé, non utilisé) |
| Écrans | `ConverterScreen` (saisie via clavier système, 2 cartes devise, résultat bleu), `FavoritesScreen`, `SettingsScreen` |
| Composants | `CurrencySelector` (overlay plein écran), `SwapButton` |
| Style | Couleurs en dur partout (`#007AFF`, `#1a1a1a`, `#2a2a2a`…), `isDark ? … : …` dans chaque style, emojis (drapeaux, onglets, titres) |
| Thème | `Appearance.setColorScheme` dans Réglages, **non persisté** |
| Données | `SUPPORTED_CURRENCIES` : 9 devises, noms en anglais, drapeaux emoji |
| Tests | `*.test.ts` présents mais **Jest n'est pas installé** : `npm test` n'existe pas |
| Travail local | Non commité : onglets (`App.tsx`), `expo-dev-client`, `expo-splash-screen`, retouches thème sombre |

### Le design system (PR #14)
- `tokens.json` : 31 couleurs (thèmes `night`/`day`), 11 styles typo (Unbounded + Manrope), espacements, rayons, ombres, tailles, flou.
- 19 composants **web (DOM)** : référence visuelle et comportementale, non utilisables en React Native.
- Assets : logo « C fendu », 19 icônes SVG, 12 drapeaux de référence.
- Utilitaires purs réutilisables tels quels : `applyKey`, `formatAmount`.

### Écarts importants entre le DS et l'app
1. **UX de saisie** : le DS remplace le clavier système par un `Keypad` maison sous un hero sombre ; l'app utilise un `TextInput`.
2. **Modèle de devises** : le DS gère une liste ordonnée « Vos devises » (les 2 premières = la paire) ; l'app a paire source/cible + favoris séparés.
3. **Navigation** : le DS dessine 5 onglets (Accueil, Devises, Convertir [FAB], Alertes, Réglages) ; l'app en a 3.
4. **⚠️ Données** : Frankfurter (BCE) **ne fournit ni XOF, ni NGN, ni GHS, ni MAD**. Le XOF est déjà dans l'app : sa conversion échoue aujourd'hui (`Taux non disponible`). Le DS met justement ces devises en tête.
5. **Décimales** : `CLAUDE.md` impose 2 décimales à l'affichage ; le DS affiche XOF et JPY sans décimales.
6. **Emojis** : interdits par le DS (voix, iconographie) ; utilisés partout dans l'app.

---

## 2. Décisions à prendre avant de coder

| # | Question | Recommandation |
|---|---|---|
| D1 | Onglets : les 5 du DS ou ceux de l'app ? | **3 onglets au style DS** : Devises (`globe`) · Convertir (FAB central) · Réglages (`settings`). Accueil et Alertes hors v1 (les alertes exigent notifications push + tâche de fond). |
| D2 | Devises africaines absentes de Frankfurter | **v1 : XOF (et XAF) par parité fixe** avec l'euro (1 EUR = 655,957 XOF/XAF), libellée « Parité fixe ». NGN/GHS/MAD : seulement avec une 2ᵉ source de taux (à choisir, voir §6) — hors v1 par défaut. |
| D3 | Favoris + paire → « Vos devises » | **Adopter le modèle du DS** : une liste ordonnée unique, migration des clés MMKV existantes. L'onglet Favoris disparaît au profit de « Devises ». |
| D4 | Thème par défaut | **Système**, avec `dark → night`, `light → day`. Choix Nuit / Jour / Système persisté dans MMKV. |
| D5 | Décimales d'affichage | **Unités ISO 4217** : 0 pour XOF, XAF, JPY, KRW… ; 2 pour les autres. Mettre à jour `CLAUDE.md`. Les taux restent à 4 décimales. |
| D6 | Drapeaux | **`circle-flags` (MIT), SVG embarqués localement** pour les seules devises supportées (hors ligne garanti). |
| D7 | Retour haptique au clavier | **Oui**, `expo-haptics`, impact léger, désactivable dans Réglages. |
| D8 | Avatar / micro (recherche vocale) dans le DS | **Non en v1** : pas de comptes utilisateur, pas de reconnaissance vocale. L'en-tête garde le lockup seul. |
| D9 | Générateur du thème RN | **Script Python dans `design-system/tools/`**, cohérent avec les générateurs existants (stdlib uniquement). |

---

## 3. Découpage en phases et PR

Une PR par phase (ou sous-phase), chacune fusionnable seule et sans casser l'app.

```
Phase 0  Préparation du dépôt            PR 0a, 0b, 0c
Phase 1  Fondations (thème, polices)     PR 1
Phase 2  Assets (icônes, logo, drapeaux) PR 2
Phase 3  Domaine & données               PR 3
Phase 4  Primitives & surfaces           PR 4
Phase 5  Composants convertisseur        PR 5
Phase 6  Listes & recherche              PR 6
Phase 7  Écrans & navigation             PR 7a, 7b, 7c
Phase 8  Contenu, accessibilité, motion  PR 8
Phase 9  QA, nettoyage, release          PR 9
```

---

### Phase 0 — Préparation du dépôt

**0a. Sauver le travail local** (branche `feat/navigation-tabs`)
- Normaliser d'abord les fins de ligne (le travail vient d'un PC Windows) : ajouter `.gitattributes` avec `* text=auto eol=lf`, puis `git add --renormalize .`.
- `git config core.fileMode false` (les fichiers copiés depuis NTFS sont en 755).
- Commit : onglets (`App.tsx`), `expo-dev-client`, `expo-splash-screen`, retouches thème. Vérifier que le diff réel (~377 lignes) ne contient que ces changements.

**0b. Fusionner la PR #14** (`feat/design-system`) dans `main`.

**0c. Outillage** (branche `chore/tooling`)
- Lire la doc Expo v57 versionnée (exigence de `AGENTS.md`) : `expo-font`, `expo-splash-screen`, `expo-blur`, `expo-haptics`, `react-native-svg`, `boxShadow` / `experimental_backgroundImage` sur la New Architecture.
- Installer Jest : `jest-expo`, `@types/jest`, script `"test": "jest"`. Faire passer les tests existants (ils appellent l'API réelle → les mocker ou les marquer « intégration »).
- Script `"typecheck": "tsc --noEmit"`.

**Critères** : `main` contient le DS + la navigation ; `npm test` et `npm run typecheck` fonctionnent.

---

### Phase 1 — Fondations : thème et polices (`feat/theme-foundation`)

**1.1 Générateur `design-system/tools/build_rn_theme.py`** → produit `src/theme/tokens.ts` (fichier généré, en-tête « ne pas éditer »).
Conversions à faire :
| Token web | Sortie React Native |
|---|---|
| Couleurs `night`/`day`, alias `{lilac}` | `colors.night.*`, `colors.day.*`, alias résolus ; `#rrggbbaa` conservé (supporté par RN) |
| Tokens hero (`hero-*`, `on-hero*`, `rise-hero`…) | `colors.hero.*` (identiques dans les deux thèmes) |
| Styles typo `"56px"`, `"-0.03em"` | `fontSize: 56`, `lineHeight: 60`, `letterSpacing: 56 × -0.03 = -1.68` |
| `fontFamily` + `fontWeight` | Nom de fichier de police chargé : `Unbounded_500Medium`, `Manrope_700Bold`… (sur Android, `fontWeight` seul ne choisit pas le fichier) |
| Labels display (capitales) | `textTransform: 'uppercase'` |
| Chiffres tabulaires | `fontVariant: ['tabular-nums']` |
| Espacements, rayons, tailles | nombres (`space[6] = 24`, `radius.xl = 40`, `size.key = 74`) |
| Ombres | chaînes `boxShadow` RN (`shadow.card.night`…) |
| Mouvement (README) | `motion.press = 120`, `motion.select = 200`, `motion.swap = 320`, `easing = Easing.bezier(.2,.8,.2,1)` |

- Ajouter au README du DS la commande de régénération ; un test Jest vérifie que `tokens.ts` est à jour (régénère en mémoire et compare).

**1.2 `src/theme/`**
- `ThemeProvider.tsx` : préférence `'system' | 'night' | 'day'` (MMKV, clé `theme_preference`), résolution via `useColorScheme()`, expose `{ name, colors, type, space, radius, size, shadow, motion }`.
- `useTheme()` ; `HeroScope` : sous-contexte qui remappe `ink → on-hero`, `ink-muted → on-hero-muted`, `line → hero-line`, `line-strong → hero-control-line`, `accent → lilac`, `rise/fall → *-hero` (équivalent de la classe `cvx-on-hero`).
- `PanelScope` : idem pour le clavier et la tab bar (`panel-ink`, `panel-muted`…).
- `Text.tsx` : `<Text variant="amount-xl" color="ink">` — seul point d'entrée typographique ; `maxFontSizeMultiplier` limité sur les montants et le clavier.

**1.3 Polices**
- `npx expo install @expo-google-fonts/unbounded @expo-google-fonts/manrope expo-font`.
- Charger seulement les graisses utilisées : Unbounded 400/500/600, Manrope 500/600/700.
- `SplashScreen.preventAutoHideAsync()` jusqu'au chargement des polices et de la préférence de thème (pas de flash de mauvais thème).

**1.4 Dépendances natives** : `react-native-svg`, `expo-blur`, `expo-haptics` (via `npx expo install`). Nouveau dev build EAS requis (`expo-dev-client` est déjà là).

**Critères** : un écran de démo caché affiche les 11 styles typo et les couleurs dans les deux thèmes ; changer le thème dans Réglages persiste après redémarrage.

---

### Phase 2 — Assets (`feat/brand-assets`)

**2.1 Icônes** : étendre `build_assets.py` pour émettre `src/components/ui/icons.ts` (chemins SVG). `Icon.tsx` dessine avec `react-native-svg` (`stroke` = couleur passée, `strokeWidth` 1.75, extrémités rondes), tailles 26 (tab bar) / 20 (contrôles) / 14 (chips). Props a11y : `accessibilityLabel` ou masqué si décoratif.

**2.2 Logo** : `AppIcon.tsx` (variantes `brand` / `dark`) à partir de `MARK_PATH` (`brand.ts`), dégradé `violet → orchid` en `LinearGradient` SVG.

**2.3 Icônes d'app et splash** (générées, pas dessinées à la main)
- Rasteriser `convix-app-icon.svg` (1024) → `assets/icon.png` ; Android adaptive : premier plan = marque blanche, arrière-plan = dégradé, monochrome = `convix-mark-white`. Outil : `npx @resvg/resvg-js-cli` (ou script Node `sharp`), commande notée dans le README.
- Splash : marque sur `hero-base` (`#17132a`) ; `app.json` → `backgroundColor` du splash et de l'adaptive icon.
- Favicon web depuis la même source.

**2.4 Drapeaux** : copier depuis `circle-flags` les SVG des devises supportées dans `assets/flags/` ; table `CURRENCY_COUNTRY` (`XOF → ci`, `EUR → eu`, `USD → us`…). `Flag.tsx` : disque + filet `line`, taille 36 par défaut, `accessibilityLabel` vide quand le nom est écrit à côté.

**Critères** : toutes les icônes, le logo et les drapeaux s'affichent nets en iOS et Android, dans les deux thèmes ; nouvelle icône d'app visible sur un dev build.

---

### Phase 3 — Domaine et données (`feat/currency-domain`)

**3.1 Type `Currency`** (`src/types/currency.ts`)
```ts
type Currency = {
  code: string;        // "XOF"
  name: string;        // "Franc CFA (BCEAO)" — français complet
  country: string;     // "ci" → drapeau
  decimals: 0 | 2;     // unités ISO 4217
  source: 'ecb' | 'peg';
};
```
Supprimer `flag` (emoji) et `symbol` si plus affiché (le DS n'affiche que le code ISO).

**3.2 Parité fixe XOF / XAF** : dans `currency.service.ts`, une couche `pegs` (`XOF: { anchor: 'EUR', rate: 655.957 }`). Pour `X → XOF` : taux `X → EUR` (Frankfurter) × 655,957 ; `EUR ↔ XOF` sans appel réseau. Le résultat porte un indicateur `kind: 'peg'` pour afficher « Parité fixe ». Tests unitaires couvrant EUR↔XOF, USD↔XOF, XOF↔XAF.

**3.3 Liste des devises** : les devises Frankfurter utiles (USD, EUR, GBP, CHF, CAD, CNY, JPY, AUD, DKK…) + XOF, XAF, ordre « local d'abord » (XOF, EUR, USD…). Noms en français.

**3.4 « Vos devises »** (D3) : `src/services/my-currencies.ts`
- Liste ordonnée persistée (`my_currencies`, minimum 2 éléments, les 2 premiers = paire).
- Migration au premier lancement : `[selected_source, selected_target, ...favorite_currencies]` dédoublonné, puis suppression des anciennes clés.
- Opérations : `add` (insère en position 2, comme le playground), `remove` (refusé sous 2), `swap`, `setPair`.

**3.5 Utilitaires montants** (`src/utils/amount.ts`) : porter `applyKey` et `formatAmount` du DS **à l'identique** + `decimals` par devise (pas de séparateur décimal pour XOF/JPY) ; `formatRate` (fr-FR, espace fine, `maximumFractionDigits` 4 si < 10, sinon 2) ; `formatChange` (`+0,42 %`, `−` typographique). Tests unitaires exhaustifs (le comportement du clavier en dépend).

**3.6 Fraîcheur et variation**
- `rateInfo(from, to)` → `{ rate, date, fetchedAt, kind: 'live' | 'cached' | 'peg' | 'unavailable', change24h? }`.
- Variation : taux de la veille via `getHistoricalRates` (déjà implémenté), mis en cache 24 h ; non affichée pour une parité fixe.
- Pas d'appel réseau à chaque frappe : le taux de la paire est chargé une fois, la conversion est calculée localement.

**3.7 Hors ligne** : conserver « Cache First → Network Refresh » ; exposer `isOffline` dans un hook `useRates(from, to)` (envisager React Query, déjà installé, avec MMKV comme cache persistant).

**Critères** : `EUR → XOF` donne 655,957 sans réseau ; tous les utilitaires sont testés ; migration des favoris vérifiée sur une installation existante.

---

### Phase 4 — Primitives et surfaces (`feat/ui-primitives`)

Dossier `src/components/ui/`. Chaque composant lit le thème, n'a aucune couleur en dur, et reprend l'API du DS (`components/index.d.ts`), adaptée à RN (`onPress` au lieu de `onClick`, pas de `className`).

| Composant | Points RN spécifiques |
|---|---|
| `Text` | (Phase 1) |
| `Icon`, `Flag`, `AppIcon` | (Phase 2) |
| `IconButton` | variantes `outline` / `glass` / `violet`, tailles 28/36/44, `hitSlop` pour garantir 44 px, `scale(.94)` à la pression |
| `Button` | `primary` (aplat `violet`, texte `on-violet`), `secondary`, `ghost` ; label en `button-label` capitales ; `block` |
| `Divider`, `SectionTitle` | filet `line` ; titre `sheet-title` |
| `Glass` | fond `glass` + `BlurView` (`expo-blur`, intensité ≈ `blur-glass` 18) + bordure `line-strong` ; repli sans flou sur Android si performance insuffisante |
| `HeroCard` | fond `hero-base` + deux halos radiaux (plum en haut à droite, indigo en bas) dessinés en **SVG `RadialGradient`** (rendu identique iOS/Android) ; `flushTop` ; `boxShadow` `shadow-card` ; enveloppe ses enfants dans `HeroScope` |
| `Sheet` | haut arrondi `radius-xl`, halo `sheet-glow`, poignée 72×3, titre centré, fondu bas optionnel (dégradé SVG) |
| `AppHeader` | `AppIcon` + lockup deux lignes « CONVIX / CONVERTISSEUR » ; slot `trailing` |

**Critères** : un écran « catalogue » (dev uniquement, derrière `__DEV__`) montre chaque composant dans ses états et les deux thèmes, à comparer avec `design-system/playground/`.

---

### Phase 5 — Composants du convertisseur (`feat/ui-converter`)

| Composant | Détails |
|---|---|
| `CurrencyAmount` | drapeau + code (`currency-label`, teinte `accent` si actif) + montant. **Ajustement** : `amount-xl` → `amount-lg` → `amount-md` selon la largeur mesurée (`onLayout` du conteneur + `onTextLayout`), avec repli par longueur (≤ 7 caractères = xl). Caret clignotant 1,1 s (`Animated`), coupé si « Réduire les animations ». `accessibilityLabel` « Euro : 632 ». Pressable pour activer le côté. |
| `SwapButton` | carré `glass` 36, rayon `radius-md`, icône `swap` 20 ; demi-tour cumulatif 320 ms, courbe du DS ; `accessibilityLabel` « Inverser les devises ». Remplace l'actuel `src/components/SwapButton.tsx`. |
| `ConversionPair` | deux `CurrencyAmount` + ligne milieu (swap + filet `hero-line`) ; `active`, `onActivate`, `onSwap` |
| `RateChip` | « 1 EUR = 655,957 XOF » + variation (icône `trend-up`/`trend-down` + `rise`/`fall`, jamais la couleur seule) + heure (`clock`) ; états « Parité fixe », « Taux indisponible », « Hors connexion » |
| `Keypad` | grille 3×4 (1-9, `,`, 0, effacer) sur `panel`, touches 74 px, filets `panel-line`, `panel-pressed` à la pression, chiffres `keypad-digit` ; appui long sur effacer = `clear` ; haptique (D7) ; touche décimale masquée/inactive si la devise active a 0 décimale ; chaque touche a un `accessibilityLabel` (« Effacer », « Virgule »). |
| `TabBar` | composant passé à `tabBar` de `@react-navigation/bottom-tabs` ; fond `panel`, hauteur 84 + safe area, icônes 26 (`panel-ink` actif / `panel-muted` inactif), FAB central 52 dégradé violet→orchid + `glow-fab` ; libellés a11y seulement (icônes seules à l'écran). |

**Petits écrans** : hero + clavier 4×74 + tab bar 84 + safe area ≈ 414 px hors hero. Sur un iPhone SE (667 px de haut), prévoir un mode compact (`size.key` 64, chevauchement réduit) déclenché par `useWindowDimensions`.

**Critères** : les comportements du playground `ConverterScreen.html` sont reproduits (saisie, bascule de côté, inversion, ajustement de taille).

---

### Phase 6 — Listes et recherche (`feat/ui-lists`)

- `CurrencyItem` : drapeau, nom en capitales, ligne meta (Manrope) ; actions `add` / `remove` / `none` (bouton rond `plus`/`minus` outline) ; `selected` (teinte `accent`) ; `disabled` (45 % + raison écrite, ex. « 2 devises minimum »).
- `CurrencyList` : basé sur `FlatList` (pas de `ScrollView` + `map`), `accessibilityRole="list"`.
- `SearchField` : `Glass`, hauteur 52, icône `search`, `radius-sm`, bouton effacer ; filtrage synchrone sur code + nom français + nom sans accents (supprimer le `setTimeout` actuel de `CurrencySelector`).

---

### Phase 7 — Écrans et navigation

**7a. Navigation et convertisseur** (`feat/screen-converter`)
- `src/navigation/` (prévu par `CLAUDE.md`) : `RootTabs` avec la `TabBar` maison ; onglets selon D1.
- `ConverterScreen` réécrit : `HeroCard` (flushTop) › `AppHeader` → `ConversionPair` → `RateChip` → poignée ; `Keypad` qui chevauche le hero d'environ 92 px avec `shadow-panel` ; plus de `TextInput` ni de clavier système.
- État : `raw` (chaîne brute avec « . »), `active: 'from' | 'to'`, paire = 2 premiers de « Vos devises ». Activation de l'autre côté = reprise de la valeur convertie comme nouvelle saisie (logique du playground).
- Toucher le code/drapeau d'un côté ouvre l'écran Devises pour remplacer cette devise.
- Bandeau hors ligne en haut (exigence `CLAUDE.md`), dans le style du DS (chip sur le hero, pas de jaune/rouge).

**7b. Écran Devises** (`feat/screen-currencies`) — remplace `FavoritesScreen` et `CurrencySelector`
- Hero court (`AppHeader`) → `Sheet` « VOS DEVISES » : liste `remove` (« Devise source », « Devise cible » pour les 2 premières) → `Divider` → « AJOUTER » + `SearchField` + liste `add`.
- Mode « choisir une devise » quand on arrive depuis le convertisseur (sélection au lieu d'ajout).

**7c. Réglages** (`feat/screen-settings`)
- Sections sur `sheet` : APPARENCE (Nuit / Jour / Système), DEVISE PAR DÉFAUT (via l'écran Devises, pas la liste complète inline), RETOUR HAPTIQUE, DONNÉES (Actualiser, Effacer le cache), À PROPOS (version depuis `expo-constants`, source des taux « Banque centrale européenne via Frankfurter », « Parité fixe BCEAO »).
- Remplacer `Alert` génériques par des messages conformes à la voix (« Taux actualisés. »).

**Critères** : plus aucune couleur en dur ni emoji dans `src/` (vérifié par une règle de lint, voir Phase 9).

---

### Phase 8 — Contenu, accessibilité, mouvement (`feat/a11y-content`)

- **Voix** : vouvoiement, capitales Unbounded pour titres/labels/boutons, verbes à l'infinitif, pas d'emoji ni de point d'exclamation, formats `fr-FR` (espace fine, `−`, `+0,42 %`).
- **Libellés centralisés** dans `src/i18n/fr.ts` (prépare l'anglais, voulu par le DS) — sans bibliothèque i18n pour l'instant.
- **Lecteurs d'écran** : `accessibilityRole`, `accessibilityLabel`, `accessibilityState` (sélectionné, désactivé) sur tous les contrôles ; montants annoncés avec la devise ; test VoiceOver + TalkBack sur le parcours principal.
- **Taille de texte** : `maxFontSizeMultiplier` sur montants, clavier et tab bar ; texte courant libre.
- **Animations réduites** : `AccessibilityInfo.isReduceMotionEnabled()` coupe caret, rotation du swap et animation du sheet.
- **Contrastes** : garantis par les tokens ; vérifier seulement les compositions (texte sur halos, sur flou).

---

### Phase 9 — QA, nettoyage, release (`chore/release-ds`)

- **Nettoyage** : supprimer `CurrencySelector.tsx`, l'ancien `SwapButton.tsx`, `FavoritesScreen.tsx`, `flag`/emoji dans les types et l'API (`frankfurter.ts` lignes ~210-235).
- **Garde-fous** : ESLint avec règle interdisant les littéraux de couleur (`#…`, `rgba(`) hors `src/theme/tokens.ts` ; test « tokens.ts à jour ».
- **Mise à jour de `CLAUDE.md`** : structure réelle, règle des décimales (D5), parité fixe, règles du DS (« toujours passer par `Text` et `useTheme` »), commande de régénération des tokens, commande APK à jour (`eas build`, `expo build:android` n'existe plus).
- **Matrice de test** : iOS + Android, petit écran (SE / 360×640) et grand, thèmes Nuit/Jour, hors ligne (mode avion), première installation vs migration, lecteur d'écran, texte agrandi.
- **Build** : dev build EAS → preview interne → validation visuelle écran par écran contre `design-system/playground/`.

---

## 4. Arborescence cible

```
src/
├── api/frankfurter.ts
├── services/currency.service.ts      # + parités fixes, rateInfo, variation 24h
├── services/my-currencies.ts         # liste ordonnée + migration
├── hooks/useRates.ts
├── utils/amount.ts                   # applyKey, formatAmount, formatRate, formatChange
├── theme/
│   ├── tokens.ts                     # GÉNÉRÉ depuis design-system/tokens.json
│   ├── ThemeProvider.tsx             # + HeroScope, PanelScope
│   └── fonts.ts
├── components/ui/                    # Text, Icon, Flag, AppIcon, Button, IconButton, Glass,
│                                     # HeroCard, Sheet, AppHeader, Divider, SectionTitle,
│                                     # CurrencyAmount, SwapButton, ConversionPair, RateChip,
│                                     # Keypad, TabBar, CurrencyItem, CurrencyList, SearchField
├── navigation/RootTabs.tsx
├── screens/ConverterScreen.tsx | CurrenciesScreen.tsx | SettingsScreen.tsx
├── i18n/fr.ts
└── types/currency.ts
assets/flags/*.svg                    # circle-flags, devises supportées uniquement
```

Note : `CLAUDE.md` demande des fichiers en `kebab-case`, mais les fichiers existants sont en `PascalCase`. Garder `PascalCase` pour les composants et écrans (cohérence avec l'existant) et corriger `CLAUDE.md`.

---

## 5. Estimation indicative

| Phase | Charge |
|---|---|
| 0 Préparation | 0,5 j |
| 1 Thème & polices | 1,5 j |
| 2 Assets | 1 j |
| 3 Domaine & données | 2 j |
| 4 Primitives & surfaces | 2 j |
| 5 Convertisseur | 2,5 j |
| 6 Listes | 1 j |
| 7 Écrans & navigation | 3 j |
| 8 Contenu & a11y | 1 j |
| 9 QA & release | 1,5 j |
| **Total** | **≈ 16 jours** |

Le chemin critique est 1 → 4 → 5 → 7a. Les phases 2 et 3 peuvent avancer en parallèle de la 1.

---

## 6. Risques et points ouverts

| Risque | Mitigation |
|---|---|
| Devises africaines hors BCE (NGN, GHS, MAD…) | v1 limitée à XOF/XAF par parité. Évaluer une 2ᵉ source (gratuite, sans clé, avec historique) avant de les ajouter ; afficher la source dans À propos. |
| Halos et flou : rendu différent iOS/Android, coût GPU | Halos en SVG (identiques partout) ; flou désactivable sur Android bas de gamme ; mesurer sur un appareil réel. |
| Ajustement automatique des montants en RN | Mesure `onLayout` + repli par longueur ; tests manuels avec montants longs (12 chiffres). |
| Hauteur d'écran (hero + clavier) | Mode compact sous ~700 px de haut. |
| Migration MMKV des utilisateurs existants | Migration idempotente + test Jest ; garder les anciennes clés une version avant suppression. |
| Divergence DS web ↔ composants RN | `tokens.json` comme seule source ; le web reste la référence visuelle ; toute évolution passe d'abord par le DS. |
| Tests actuels dépendants du réseau | Les isoler (mocks) en Phase 0c pour avoir une CI fiable. |

## 7. Hors périmètre v1

Onglets Accueil et Alertes, notifications push, recherche vocale, comptes / avatar, version anglaise (préparée, non traduite), widgets, graphiques d'historique.
