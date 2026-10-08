# CurrencyItem

Ligne de liste de devise : drapeau, nom en capitales, ligne secondaire en Manrope et bouton rond +/−.

**Le consommateur fournit** : `flag`, `name`, `code`, `meta` (sinon le code), `action` (`add` | `remove` | `none`), `onAction`, `selected`, `disabled`. Envelopper les lignes dans `CurrencyList`.

- Bouton de 28px dessiné, zone tactile 44px ; son `aria-label` dit l'action et la devise (« Retirer Euro (EUR) »).
- `selected` : nom en `accent` + coche. `disabled` : `ink-faint`, action désactivée (taux indisponible).
