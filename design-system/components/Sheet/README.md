# Sheet

Bottom sheet sur `sheet` avec halo `sheet-glow`, coins hauts `radius-xl`, poignée fixe et titre centré en capitales.

**Le consommateur fournit** : `title`, le contenu (listes, `SearchField`, `SectionTitle`), une hauteur (élément flex ou hauteur explicite) pour que le corps défile, et `fade` pour les longues listes.

- Le corps défile sous la poignée ; `fade` estompe les ~140 derniers pixels visibles, comme la liste « Ajouter ».
- Blanc en thème jour, violet profond en thème nuit.
