Ajouter un bouton **Swap** dans `ConverterScreen.tsx` pour inverser les devises source et cible.

**Fonctionnalités** :
- Le bouton est centré entre les deux sélecteurs de devises.
- Animation de rotation (180°) pour l'icône.
- Le montant est recalculé automatiquement après inversion.

**Critères d'acceptation** :
- [ ] Le bouton est cliquable et inverse les devises.
- [ ] L'animation est fluide (utiliser `react-native-reanimated`).
- [ ] Le montant est recalculé avec le nouveau taux.
- [ ] Le bouton est désactivé si aucune devise n'est sélectionnée.