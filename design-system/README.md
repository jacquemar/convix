# Convix — Design System

Convix convertit une devise en une autre, vite, d'un pouce. L'interface tient en deux gestes : taper un montant sur un clavier blanc, lire la conversion sur une carte sombre éclairée de violet. Tout le système sert ce contraste : **un hero nuit, un clavier jour, une seule lueur.**

## Principes

1. **Le chiffre d'abord.** Le montant est l'élément le plus grand de l'écran (`amount-xl`, 56px). Rien ne lui fait concurrence : pas d'illustration, pas de bannière au-dessus du pli.
2. **Nuit dessus, jour dessous.** Le `HeroCard` reste sombre dans les deux thèmes ; le `Keypad` et la `TabBar` restent blancs (`panel`). Seuls `canvas` et `sheet` changent avec le thème.
3. **Une seule lueur.** La lumière (halos, `glow-fab`) est réservée au hero et au FAB clavier. Aucun autre contrôle ne brille, aucune ombre grise.
4. **Rond et large.** Unbounded en capitales pour les montants et les labels, rayons généreux, contrôles ronds.
5. **Local d'abord.** Franc CFA (XOF), euro, naira, cedi, dirham en tête de liste ; virgule décimale et espace fine pour les milliers.

## Voix et contenu

- **Vouvoyer**, en phrases courtes. « Vos devises », « Taux mis à jour il y a 2 minutes ».
- Les titres, labels de devises et boutons sont en **capitales** Unbounded : « VOS DEVISES », « AJOUTER », « CONVERTIR ». Le texte courant (Manrope) reste en casse normale.
- Boutons = un verbe à l'infinitif : « Convertir », « Actualiser », « Ajouter ». Jamais « OK » ou « Valider » seul.
- Noms de devises en français complet : « Dollar américain », « Franc CFA (BCEAO) », « Couronne danoise ». Codes ISO 4217 en trois lettres à côté du drapeau.
- Nombres au format `fr-FR` : `414 565`, `655,957`, `+0,42 %` (espace fine insécable avant `%`). Signe moins typographique « − ».
- Dire la fraîcheur d'un taux, jamais la cacher : « Mis à jour · 11:30 », « Taux indisponible », « Parité fixe » pour EUR ↔ XOF.
- Pas d'emoji, pas de point d'exclamation, pas de superlatifs (« le meilleur taux ! »).
- Interface prête pour l'anglais : garder les libellés courts pour qu'ils tiennent aussi en anglais (« YOUR CURRENCIES » ≈ « VOS DEVISES »).

## Couleur

- Fond d'app : `canvas`. Sheets et écrans de liste : `sheet`, peint avec un halo `sheet-glow`.
- Texte principal sur `canvas`/`sheet` : `ink` ; secondaire : `ink-muted` ; désactivé uniquement : `ink-faint`.
- Hero : base `hero-base`, halo `hero-glow-plum` en haut à droite, halo `hero-glow-indigo` en bas. Texte `on-hero`, secondaire `on-hero-muted`, filets `hero-line`, bordures de contrôles `hero-control-line`.
- Dans un `HeroCard`, ne référencez pas les tokens hero à la main : le composant remappe `--ink`, `--ink-muted`, `--line`, `--line-strong`, `--accent`, `--rise`, `--fall`. Ajoutez la classe `cvx-on-hero` (ou `cvx-on-panel`) à un conteneur maison pour le même effet.
- Clavier et tab bar : `panel`, chiffres `panel-ink`, icônes inactives `panel-muted`, grille `panel-line`, touche pressée `panel-pressed`.
- Marque : `violet` pour les aplats primaires et la touche effacer (texte dessus : `on-violet`) ; `orchid` seulement en fin de dégradé et dans les halos ; `lilac` pour les accents sur fonds sombres. Pour un accent qui suit le thème, utilisez `accent` (lilac la nuit, violet le jour).
- Le dégradé de marque va toujours de `violet` (haut-gauche) vers `orchid` (bas-droite) : FAB, icône d'app. Jamais de texte posé sur `orchid`.
- Variations de taux : `rise` (sarcelle) et `fall` (orange), sur le hero `rise-hero` / `fall-hero`. Toujours accompagnées de l'icône `trend-up` / `trend-down` — sarcelle et orange restent distinguables en daltonisme, la flèche garantit le sens.

## Typographie

- Deux familles Google Fonts : **Unbounded** (`display`, poids 300–700) et **Manrope** (`sans`, 400–800). Chargez `https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Unbounded:wght@300;400;500;600;700&display=swap` ; dans l'app mobile, embarquez les fichiers des deux familles (Expo : paquets `@expo-google-fonts`).
- Montants : `amount-xl` (montant actif), `amount-lg` puis `amount-md` quand il ne tient plus — `CurrencyAmount` descend seul. Toujours `font-variant-numeric: tabular-nums`.
- Clavier : `keypad-digit`. Lockup d'en-tête : `lockup`. Titres de sheet : `sheet-title`. Noms et codes de devises : `currency-label`. Boutons : `button-label`. Tous en capitales.
- Phrases (taux, aide, réglages, placeholders) : `text-body`, `text-strong` pour un taux mis en avant, `text-caption` pour horodatages et chips.

## Espace, rayons, tailles

- Base 4px. Gouttière d'écran et padding du hero : `space-6` (24px). Entre l'en-tête et le premier montant : `space-8`. Entre drapeau et texte : `space-3`.
- Rayons croissants avec la surface : `radius-sm` (recherche, chips) → `radius-md` (swap, avatar, FAB) → `radius-lg` (clavier) → `radius-xl` (hero, haut des sheets). Contrôles ronds et drapeaux : `radius-full`.
- Tailles fixes : drapeau `size-flag` 36, contrôle `size-control` 36, avatar `size-avatar` 40, champ `size-input` 52, touche `size-key` 74, FAB `size-fab` 52, tab bar `size-tabbar` 84. Toute cible tactile fait au moins 44px (les `IconButton` de 28px étendent leur zone).

## Profondeur et matière

- Pas d'ombre grise. `shadow-card` sous le hero et les sheets flottants, `shadow-panel` quand le clavier se détache du hero, `glow-fab` sous le FAB uniquement.
- Contrôles posés sur le hero ou un sheet : remplissage `glass` + `backdrop-filter: blur(var(--blur-glass))` + bordure `line-strong`.
- Composition de l'écran convertisseur : hero en haut (coins bas `radius-xl`), clavier qui le chevauche d'environ 92px, tab bar sur `panel` en bas. Une poignée `hero-line` de 72×3px annonce le clavier.

## États et accessibilité

- Focus clavier : `focus-ring` (3px de `focus`, ≥ 3:1 sur `panel`, `hero-base`, `sheet`, `canvas` dans les deux thèmes). Dans le clavier, l'anneau est intérieur.
- Pressé : `panel-pressed` sur les touches, `scale(.94)` sur les boutons ronds. Désactivé : opacité 45 % et une raison écrite à côté.
- Tous les couples texte/fond respectent 4.5:1 dans les deux thèmes (bordures de contrôles 3:1), sauf `ink-faint`, réservé au désactivé.
- Toute icône seule a un nom accessible ; les montants sont annoncés avec leur devise (« Euro : 632 »).

## Mouvement

- Durées : 120ms (pression), 200ms (couleur, sélection), 320ms (swap, sheet). Courbe `cubic-bezier(.2, .8, .2, 1)`.
- Le swap tourne d'un demi-tour ; le caret clignote à 1,1s ; le sheet monte depuis le bas.
- `prefers-reduced-motion` coupe le clignotement et les transitions.

## Iconographie

- Jeu maison (`assets/Icons`, composant `Icon`) : grille 24px, trait 1.75, extrémités rondes, tracé `currentColor`. 26px dans la tab bar, 20px dans les contrôles, 14px dans les chips.
- Drapeaux toujours ronds via `Flag` (filet `line`). Les fichiers `assets/Flags` sont des références simplifiées ; en production, servez un jeu complet de drapeaux ronds.
- Pas d'emoji, pas d'illustrations : la seule image de l'app est le drapeau.

## Logo

- La marque est le **C fendu** : deux moitiés de C qui glissent en sens inverse, comme deux devises échangées. Fichiers dans `assets/Logos` ; dans l'interface, utilisez `AppIcon`.
- Sur fond sombre : `convix-mark-gradient` ou `convix-mark-white` ; sur fond clair : `convix-mark-violet` ou `convix-mark-ink`. Wordmark : `convix-wordmark-white` / `convix-wordmark-ink` (X montant d'accent).
- Ne jamais recomposer le nom avec une police, refermer la fente, ombrer ou contourner la marque.

## Composants

`components/bundle.js` expose `window.Convix` (React 18, chargé avant). Hiérarchie type d'un écran :

`HeroCard` › `AppHeader` + `ConversionPair` (`CurrencyAmount` × 2 + `SwapButton`) + `RateChip` → `Keypad` → `TabBar`. Écran devises : `HeroCard` › `AppHeader` → `Sheet` › `CurrencyList` › `CurrencyItem` + `Divider` + `SectionTitle` + `SearchField`.

Utilitaires : `Convix.applyKey(raw, key)` applique une touche du clavier ; `Convix.formatAmount(raw)` formate « 3999.5 » en « 3 999,5 ». Les montants circulent en chaînes brutes avec « . » ; la conversion est faite par l'app, jamais par les composants.

**Ajouts intentionnels** (absents de l'écran de référence, nécessaires à l'app) : `RateChip` (fraîcheur et variation du taux), `Button` (onboarding, alertes, erreurs), `Divider`, `SectionTitle` et `CurrencyList` (structure des sheets), `IconButton` en variantes `glass`/`violet`, et le thème `day`.

## Dans le code (Next, Expo)

- `tokens.json` est la source : générez-en un objet de thème TypeScript (`night` / `day`) pour React Native, ou utilisez `tokens.css` tel quel sur le web (variables `--canvas`, `--ink`… et classes de type `.amount-xl`…).
- Le bundle sert de référence de rendu et de comportement ; les sources TypeScript sont dans `components/src/`.

## Ce dossier

Miroir versionné du design system Convix (artifact Design System) : tokens, brand book, logo, icônes, drapeaux et composants web de référence. Il n'est pas encore branché à l'app Expo — `src/` n'en importe rien.

```
design-system/
├── README.md              # ce brand book
├── tokens.json            # source de vérité : couleurs (night/day), typo, espace, rayons, ombres, tailles
├── tokens.css             # généré : variables CSS + classes de type (web, Expo web, playground)
├── assets/
│   ├── Logos/             # C fendu, icône d'app (1024), wordmark, lockups — SVG
│   ├── Icons/             # 19 icônes 24px, trait 1.75
│   └── Flags/             # drapeaux ronds de référence
├── components/
│   ├── bundle.js|css      # composants React (DOM) → window.Convix, React 18+ chargé avant
│   ├── index.d.ts         # API des composants
│   ├── src/               # sources TypeScript du bundle
│   └── <Composant>/README.md
├── playground/            # une page HTML par composant + ConverterScreen interactif
├── tools/                 # générateurs (Python 3, sans dépendance hors stdlib)
└── tsconfig.json          # TS des sources web (DOM), exclu du tsconfig de l'app
```

### Voir les composants

Ouvrir `design-system/playground/index.html` dans un navigateur (React 18 et les polices sont chargés depuis jsDelivr et Google Fonts). Ajouter `?theme=day` à l'URL d'une page pour le thème jour.

### Régénérer

```bash
cd design-system
python3 tools/build_tokens.py                        # tokens.json + rapport de contraste WCAG
python3 tools/build_tokens_css.py tokens.json tokens.css
python3 tools/build_logo.py                          # assets/Logos + components/src/brand.ts
python3 tools/build_assets.py                        # assets/Icons, assets/Flags + components/src/icons.ts
tools/build_bundle.sh                                # components/bundle.js (esbuild via npx)
python3 tools/build_playground.py                    # playground/
```

Modifier une couleur ou une taille : éditer `tools/build_tokens.py` (et non `tokens.json` à la main), relancer les deux premières commandes, vérifier que le rapport affiche `failing pairs: 0`.
