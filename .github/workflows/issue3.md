Créer `src/screens/ConverterScreen.tsx` avec :
- Un champ de saisie pour le montant (centré, grand).
- Deux sélecteurs de devises (source et cible).
- Un affichage du résultat (en gros, dominant visuellement).
- La date du taux utilisé (ex: "Updated today").

**Comportement** :
- Le calcul doit être **instantané** (pas d'appel API à chaque frappe).
- Utiliser `CurrencyService.convert()` pour les calculs.
- Afficher un indicateur de chargement si les taux ne sont pas encore chargés.

**Critères d'acceptation** :
- [ ] Le champ de saisie est centré et prend toute la largeur.
- [ ] Les sélecteurs de devises affichent le drapeau + code ISO.
- [ ] Le résultat est mis à jour en temps réel.
- [ ] Un indicateur "Hors connexion" est affiché si les données sont en cache.