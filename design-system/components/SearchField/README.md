# SearchField

Champ de recherche en verre avec loupe et micro, pour filtrer les devises par nom, code ou pays.

**Le consommateur fournit** : `value`, `onChange(value)`, `onVoice` (affiche le micro), `placeholder` (« Rechercher… »).

- Bordure `line-strong` (3:1) ; au focus, bordure `focus` + `focus-ring`.
- Filtrer côté client sur le nom, le code ISO et le pays ; ne pas exiger de validation.
