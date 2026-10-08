# Keypad

Le clavier numérique blanc en 3×4 : chiffres en `keypad-digit`, touche décimale et touche effacer violette (maintenir pour tout effacer).

**Le consommateur fournit** : `onKey(key)` et l'état du montant. Utiliser `Convix.applyKey(raw, key)` pour appliquer une touche (12 chiffres max, 2 décimales).

- Toujours sur `panel` blanc, y compris en thème nuit ; il chevauche le bas du `HeroCard` d'environ 92px.
- `decimalSeparator` affiche « , » par défaut ; la touche émet toujours « . ».
- `bindKeyboard` active le clavier physique (chiffres, `,` `.`, Retour arrière, Échap) sur desktop.
