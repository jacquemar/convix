# ConversionPair

Les deux montants empilés, séparés par le `SwapButton` et un filet : le cœur de l'écran de conversion.

**Le consommateur fournit** : `from` et `to` (`{ flag, code, name, amount }`), `active` (le côté qui reçoit le clavier), `onActivate(side)` et `onSwap`. Le composant n'effectue aucun calcul : le parent convertit et passe les montants.

- Toucher une ligne l'active (caret + code en `accent`) ; le montant tapé reste attaché à sa devise lors d'une inversion.
- Montants bruts avec « . » comme séparateur interne ; l'affichage utilise `decimalSeparator` (« , » par défaut).
