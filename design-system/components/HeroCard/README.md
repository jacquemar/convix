# HeroCard

La surface sombre signature de Convix : `hero-base` éclairé d'un halo `hero-glow-plum` en haut à droite et `hero-glow-indigo` en bas.

**Le consommateur fournit** : `children` (en-tête, paire de conversion, chip de taux) ; `flushTop` quand la carte touche le haut de l'écran.

- Identique dans les deux thèmes : c'est le moment de marque, il ne s'éclaircit jamais.
- Il redéfinit `--ink`, `--ink-muted`, `--line`, `--line-strong`, `--accent`, `--rise`, `--fall` vers leurs valeurs hero : tout composant Convix posé dedans se lit correctement sans prop.
- Un seul hero par écran. Ne pas y empiler de cartes blanches, hormis le `Keypad` qui le chevauche par le bas.
