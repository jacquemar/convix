Créer `src/screens/SettingsScreen.tsx` pour les paramètres de l'application.

**Fonctionnalités** :
- **Devise par défaut** : Sélectionner la devise source par défaut (ex: USD, EUR, XOF).
- **Thème** : Choix entre Clair, Sombre, ou Système (respecte les préférences OS).
- **Cache** : Bouton pour effacer le cache des taux.
- **À propos** : Version de l'app, lien vers la politique de confidentialité, crédits.

**Technique** :
- Utiliser `currencyService.setSelectedSourceCurrency()` pour la devise par défaut.
- Utiliser `Appearance.setColorScheme()` pour le thème.
- Utiliser `currencyService.clearCache()` pour effacer le cache.

**Critères d'acceptation** :
- [ ] L'écran est accessible depuis la navigation principale.
- [ ] Les paramètres sont persistés après redémarrage.
- [ ] Le thème (clair/sombre) est respecté.
- [ ] Effacer le cache fonctionne et affiche un feedback.