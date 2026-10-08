# RateChip

Pastille de taux en direct : la paire, puis une flèche et un pourcentage de variation, et l'heure de mise à jour.

**Le consommateur fournit** : `base` (« 1 EUR »), `quote` (« 655,957 XOF »), `change` (pourcentage signé, optionnel) et `time` (« 11:30 », « parité fixe »…).

- Hausse en `rise` (sarcelle), baisse en `fall` (orange), toujours accompagnées de la flèche : la couleur n'est jamais seule porteuse du sens.
- Pour EUR ↔ XOF (parité fixe BCEAO), ne pas afficher de variation : passer `time: "parité fixe"`.
