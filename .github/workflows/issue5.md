Créer `src/screens/HistoryScreen.tsx` pour afficher l'évolution des taux de change.

**Fonctionnalités** :
- Sélection de la paire de devises (source → cible).
- Choix de la période : 7 jours, 30 jours, 3 mois, 1 an.
- Graphique linéaire interactif (utiliser `react-native-chart-kit` ou `victory-native`).
- Affichage des valeurs min/max/moyenne sur la période.
- Gestion des données indisponibles (API ne fournit pas assez d'historique).

**Technique** :
- Utiliser `frankfurterClient.getHistoricalRates()` pour récupérer les données.
- Mettre en cache les données historiques (MMKV, durée 24h).
- Animation d'entrée du graphique.

**Critères d'acceptation** :
- [ ] L'écran est accessible depuis la navigation principale.
- [ ] Le graphique s'affiche correctement pour les périodes disponibles.
- [ ] Les périodes non disponibles affichent un message clair.
- [ ] Le thème (clair/sombre) est respecté.