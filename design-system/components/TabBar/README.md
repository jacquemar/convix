# TabBar

Barre de navigation basse sur `panel`, icônes seules, avec un FAB central lumineux pour le clavier.

**Le consommateur fournit** : `items` (`{ id, icon, label, primary? }`), `activeId`, `onChange`.

- Exactement un item `primary` (le FAB violet→orchid avec `glow-fab`) — c'est le seul contrôle lumineux de l'app.
- Onglet actif : `panel-ink` + point violet ; inactifs : `panel-muted`. Chaque item a un `label` (aria-label), même sans texte visible.
- 4 ou 5 destinations, jamais plus.
