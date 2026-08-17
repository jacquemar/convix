Créer `src/screens/FavoritesScreen.tsx` pour gérer les devises favorites.

**Fonctionnalités** :
- Liste des devises favorites (drapeau + code ISO + nom).
- Bouton pour ajouter/supprimer une devise des favoris.
- Réorganisation de la liste par glisser-déposer (optionnel).
- Persistance des favoris dans MMKV.

**Technique** :
- Utiliser `currencyService.getFavoriteCurrencies()` et `currencyService.toggleFavoriteCurrency()`.
- Afficher un message si aucun favori n'est enregistré.

**Critères d'acceptation** :
- [ ] L'écran est accessible depuis la navigation principale.
- [ ] Les favoris sont persistés après redémarrage de l'app.
- [ ] Le thème (clair/sombre) est respecté.
- [ ] Un message guide l'utilisateur s'il n'a pas de favoris.