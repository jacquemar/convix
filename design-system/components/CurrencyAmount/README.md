# CurrencyAmount

Une ligne de conversion : drapeau, code ISO et montant en grands chiffres tabulaires, ajusté automatiquement à la largeur.

**Le consommateur fournit** : `flag`, `code`, `amount` (brut, « . » décimal), `name` (lu par les lecteurs d'écran), `active`, `onActivate`.

- La taille descend `amount-xl` → `amount-lg` → `amount-md` jusqu'à tenir dans la ligne (re-calculée au redimensionnement et au chargement d'Unbounded).
- Groupement des milliers par espace fine insécable en français : « 414 565 ».
- Ne pas tronquer un montant avec « … » : réduire la taille ou passer en notation compacte côté parent.
