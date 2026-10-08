"""Build project/tokens.json for Convix and print a WCAG contrast report.

Two themes: `night` (the signature look — dark hero, white keypad panel, dark sheets)
and `day` (light canvas and sheets; the hero card stays dark in both).
"""
import json, os
from contrast import ratio, over

THEMES = [{"id": "night", "name": "Nuit"}, {"id": "day", "name": "Jour"}]

def c(name, night, day=None, usage=""):
    value = night if day is None else {"night": night, "day": day}
    return {"name": name, "value": value, "usage": usage}

COLORS = [
    # --- Canvas & sheets (theme-dependent) -------------------------------------------------
    c("canvas", "#0e0a1a", "#f1ecfb", "Fond de l'app derrière chaque écran. Nuit : violet quasi noir ; Jour : lavande pâle."),
    c("sheet", "#221a40", "#ffffff", "Bottom sheets et écrans de liste (Vos devises, Ajouter). En nuit, peint avec un halo radial `sheet-glow`."),
    c("sheet-glow", "#2c2474", "#ebe4fb", "Halo radial dans un sheet (indigo en nuit, brume lilas en jour). Décoratif uniquement."),
    c("ink", "#f6f3ff", "#19122e", "Texte et icônes principaux sur `canvas` et `sheet` (noms de devises, titres de section)."),
    c("ink-muted", "#b9aedb", "#5d5381", "Texte secondaire sur `canvas` et `sheet` : codes devise en liste, horodatage des taux, placeholders."),
    c("ink-faint", "#7f76a6", "#9a93b4", "Éléments désactivés et fondu de fin de liste uniquement. Sous 4.5:1 volontairement — jamais pour du texte à lire."),
    c("line", "#ffffff1f", "#19122e1a", "Filets séparateurs entre groupes de liste sur `canvas` et `sheet`. Décoratif : jamais seule limite d'un contrôle."),
    c("line-strong", "#7a71ad", "#8a82a8", "Bordure des contrôles sur `sheet` et `canvas` (champ de recherche, boutons ronds +/−) — 3:1 sur les deux fonds."),
    c("glass", "#ffffff12", "#19122e0d", "Remplissage translucide des contrôles posés sur `sheet` ou le hero (recherche, boutons icône)."),
    # --- Hero card (identical in both themes: the brand moment) ---------------------------
    c("hero-base", "#17132a", usage="Base de la carte hero du convertisseur et de l'en-tête, dans les deux thèmes."),
    c("hero-glow-plum", "#6b2590", usage="Halo radial en haut à droite du hero. Décoratif, seul `on-hero` / `on-hero-muted` s'y pose."),
    c("hero-glow-indigo", "#3a2399", usage="Halo radial bas du hero, derrière le bord haut du clavier."),
    c("on-hero", "#ffffff", usage="Montants, codes devise et lockup d'en-tête sur le hero (≥ 9:1 sur la base et les deux halos)."),
    c("on-hero-muted", "#c9bee8", usage="Texte secondaire sur le hero : ligne du taux, heure de mise à jour."),
    c("hero-line", "#ffffff24", usage="Filet entre les deux montants du hero. Décoratif."),
    c("hero-control-line", "#8a82bd", usage="Bordure des contrôles du hero (bouton swap, tuile avatar) — 3:1 sur `hero-base`."),
    # --- Keypad panel (white in both themes, as in the signature screen) -----------------
    c("panel", "#ffffff", usage="Le panneau clavier et la tab bar, blancs dans les deux thèmes."),
    c("panel-ink", "#1a1428", usage="Chiffres du clavier et icône active de la tab bar sur `panel`."),
    c("panel-muted", "#6e6789", usage="Icônes inactives de la tab bar sur `panel` (≥ 4.5:1)."),
    c("panel-line", "#ece8f4", usage="Lignes de grille entre les touches du clavier. Décoratif."),
    c("panel-pressed", "#f1ecfc", usage="État pressé d'une touche du clavier."),
    # --- Brand -------------------------------------------------------------------------------
    c("violet", "#7a45f0", usage="Violet Convix. Remplissages primaires (début du dégradé FAB, bouton primaire), touche effacer et accents actifs sur `panel` et `canvas` jour. Texte dessus : `on-violet`."),
    c("orchid", "#c25ae8", usage="Seconde teinte de marque : fin du dégradé FAB / icône d'app et halos. Jamais en texte sur fond clair."),
    c("lilac", "#c4a6ff", usage="Texte et icônes d'accent sur fonds sombres (`hero-base`, `sheet` nuit) : code sélectionné, liens. Jamais sur `panel` ni `sheet` jour."),
    c("on-violet", "#ffffff", usage="Texte et icônes sur un aplat `violet` ou le dégradé violet→orchid."),
    c("accent", "{lilac}", "{violet}", usage="Accent suivant le thème pour texte et icônes sur `canvas`/`sheet` : lilac en nuit, violet en jour."),
    c("focus", "#9b5cff", usage="Couleur de l'anneau de focus clavier : ≥ 3:1 sur `panel`, `hero-base`, `sheet` et `canvas` dans les deux thèmes."),
    # --- Rate movement (colour-blind safe: teal vs orange, always with an arrow) --------
    c("rise", "#5ee0c8", "#0b7363", "Taux en hausse — texte/icône sur `canvas` et `sheet`. Toujours avec la flèche montante."),
    c("fall", "#ffb36b", "#a54a00", "Taux en baisse — texte/icône sur `canvas` et `sheet`. Toujours avec la flèche descendante."),
    c("rise-hero", "#5ee0c8", usage="Taux en hausse sur le hero (deux thèmes). Avec la flèche."),
    c("fall-hero", "#ffb36b", usage="Taux en baisse sur le hero (deux thèmes). Avec la flèche."),
]

# Text/icon pairs that must hold (fg, ground, minimum) in EVERY theme.
PAIRS = [
    ("ink", "canvas", 4.5), ("ink", "sheet", 4.5), ("ink", "sheet-glow", 4.5),
    ("ink-muted", "canvas", 4.5), ("ink-muted", "sheet", 4.5), ("ink-muted", "sheet-glow", 4.5),
    ("accent", "canvas", 4.5), ("accent", "sheet", 4.5),
    ("line-strong", "sheet", 3), ("line-strong", "canvas", 3),
    ("on-hero", "hero-base", 4.5), ("on-hero", "hero-glow-plum", 4.5), ("on-hero", "hero-glow-indigo", 4.5),
    ("on-hero-muted", "hero-base", 4.5), ("on-hero-muted", "hero-glow-plum", 4.5), ("on-hero-muted", "hero-glow-indigo", 4.5),
    ("lilac", "hero-base", 4.5), ("hero-control-line", "hero-base", 3),
    ("panel-ink", "panel", 4.5), ("panel-muted", "panel", 4.5), ("violet", "panel", 3),
    ("on-violet", "violet", 4.5),
    ("focus", "panel", 3), ("focus", "hero-base", 3), ("focus", "sheet", 3), ("focus", "canvas", 3),
    ("rise", "canvas", 4.5), ("rise", "sheet", 4.5), ("fall", "canvas", 4.5), ("fall", "sheet", 4.5),
    ("rise-hero", "hero-base", 4.5), ("fall-hero", "hero-base", 4.5),
]

def resolve(name, theme, seen=()):
    t = next(t for t in COLORS if t["name"] == name)
    v = t["value"] if isinstance(t["value"], str) else t["value"].get(theme, t["value"]["night"])
    if v.startswith("{"):
        return resolve(v[1:-1], theme, seen + (name,))
    return v

def report():
    bad = 0
    for th in ("night", "day"):
        for fg, bg, need in PAIRS:
            g = resolve(bg, th)
            g_solid = over(g, resolve("canvas", th)) if len(g) == 9 else g
            f = resolve(fg, th)
            f_solid = over(f, g_solid) if len(f) == 9 else f
            r = ratio(f_solid, g_solid)
            flag = "OK " if r >= need else "LOW"
            if r < need: bad += 1
            print(f"{flag} {th:5s} {fg:18s} on {bg:16s} {r:5.2f} (need {need})")
    # rise vs fall must differ in lightness too (not hue alone)
    for th in ("night", "day"):
        print(f"rise/fall lightness ratio {th}: {ratio(resolve('rise', th), resolve('fall', th)):.2f}")
    return bad

TYPE = {
    "fonts": [],
    "families": {
        "display": "\"Unbounded\", \"Arial Black\", system-ui, sans-serif",
        "sans": "\"Manrope\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif",
    },
    "groups": [
        {"name": "Display", "family": "display",
         "note": "Unbounded — large, géométrique, ronde. Montants, lockup et tous les labels en capitales. Google Fonts (wght 300–700).",
         "styles": [
            {"name": "amount-xl", "fontSize": "56px", "lineHeight": "60px", "fontWeight": 500, "letterSpacing": "-0.03em",
             "sample": "632", "usage": "Montant actif sur le hero. Chiffres tabulaires ; passer en `amount-lg` au-delà de 7 caractères."},
            {"name": "amount-lg", "fontSize": "40px", "lineHeight": "44px", "fontWeight": 500, "letterSpacing": "-0.03em",
             "sample": "387 652", "usage": "Montants longs, montant converti quand la place manque."},
            {"name": "amount-md", "fontSize": "24px", "lineHeight": "28px", "fontWeight": 500, "letterSpacing": "-0.02em",
             "sample": "605,42", "usage": "Montants dans les listes et cartes de taux."},
            {"name": "keypad-digit", "fontSize": "24px", "lineHeight": "28px", "fontWeight": 400,
             "sample": "7 8 9", "usage": "Chiffres du clavier uniquement."},
            {"name": "lockup", "fontSize": "15px", "lineHeight": "16px", "fontWeight": 600, "letterSpacing": "0.01em",
             "sample": "CONVIX", "usage": "Titre d'app sur deux lignes à côté de l'icône, en capitales."},
            {"name": "sheet-title", "fontSize": "16px", "lineHeight": "20px", "fontWeight": 600, "letterSpacing": "0.01em",
             "sample": "VOS DEVISES", "usage": "Titres de sheet et de section, capitales, centrés dans les sheets."},
            {"name": "currency-label", "fontSize": "14px", "lineHeight": "20px", "fontWeight": 500, "letterSpacing": "0.01em",
             "sample": "DOLLAR AMÉRICAIN", "usage": "Noms de devises en liste et codes à côté des drapeaux, capitales."},
            {"name": "button-label", "fontSize": "13px", "lineHeight": "16px", "fontWeight": 600, "letterSpacing": "0.04em",
             "sample": "CONVERTIR", "usage": "Libellés de boutons, capitales."},
         ]},
        {"name": "Text", "family": "sans",
         "note": "Manrope — tout ce qui se lit en phrases : placeholders, taux, aide, réglages.",
         "styles": [
            {"name": "text-body", "fontSize": "15px", "lineHeight": "22px", "fontWeight": 500,
             "sample": "Taux mis à jour il y a 2 minutes.", "usage": "Texte courant, lignes de réglages, aide."},
            {"name": "text-strong", "fontSize": "15px", "lineHeight": "22px", "fontWeight": 700,
             "sample": "1 EUR = 655,957 XOF", "usage": "Taux et valeurs mises en avant dans le texte. Chiffres tabulaires."},
            {"name": "text-caption", "fontSize": "12px", "lineHeight": "16px", "fontWeight": 600, "letterSpacing": "0.02em",
             "sample": "Mis à jour · 11:30", "usage": "Horodatages, labels d'onglets, texte des chips."},
         ]},
    ],
}

SPACING = {"note": "Base 4px. Les écrans ont une gouttière de 24px (`space-6`).", "tokens": [
    {"name": "space-1", "value": "4px", "usage": "Écart icône–texte dans les chips."},
    {"name": "space-2", "value": "8px", "usage": "Intérieur des petits contrôles ; entre drapeau et code."},
    {"name": "space-3", "value": "12px", "usage": "Entre drapeau et nom en liste ; padding interne de la recherche."},
    {"name": "space-4", "value": "16px", "usage": "Entre lignes de liste ; padding des chips et blocs internes."},
    {"name": "space-6", "value": "24px", "usage": "Gouttière d'écran (gauche/droite) et padding du hero."},
    {"name": "space-8", "value": "32px", "usage": "Entre l'en-tête et le premier montant ; entre sections de sheet."},
    {"name": "space-12", "value": "48px", "usage": "Espace au-dessus d'un titre de sheet, après la poignée."},
]}

RADIUS = {"note": "Doux et généreux — le rayon grandit avec la surface ; les contrôles sont ronds.", "tokens": [
    {"name": "radius-sm", "value": "10px", "usage": "Champ de recherche, chips."},
    {"name": "radius-md", "value": "14px", "usage": "Bouton swap, tuile avatar, icône d'app à 40–48px."},
    {"name": "radius-lg", "value": "28px", "usage": "Panneau clavier et cartes internes."},
    {"name": "radius-xl", "value": "40px", "usage": "Carte hero et coins hauts des bottom sheets."},
    {"name": "radius-full", "value": "9999px", "usage": "Boutons ronds, drapeaux, FAB, poignée, pills."},
]}

SHADOW = {"note": "La profondeur vient de la lumière, pas d'ombres grises : halo violet sous le FAB, léger décollement du clavier.", "tokens": [
    {"name": "shadow-panel", "value": {"night": "0 -12px 40px #0e0a1a66", "day": "0 -8px 32px #3a239914"},
     "usage": "Le panneau clavier qui se détache du hero."},
    {"name": "shadow-card", "value": {"night": "0 24px 60px #00000080", "day": "0 18px 48px #3a23992e"},
     "usage": "Carte hero et sheets flottants."},
    {"name": "glow-fab", "value": "0 10px 28px #9b5cff8c, 0 0 0 1px #ffffff33 inset",
     "usage": "Le FAB central de la tab bar — seul contrôle lumineux."},
    {"name": "focus-ring", "value": "0 0 0 3px #9b5cff",
     "usage": "Focus clavier sur tous les contrôles (box-shadow, suit le rayon). Couleur = `focus`."},
]}

SIZE = {"note": "Tailles fixes des contrôles.", "tokens": [
    {"name": "size-icon", "value": "24px", "usage": "Taille d'icône par défaut (tab bar, micro)."},
    {"name": "size-flag", "value": "36px", "usage": "Drapeaux à côté des montants et en liste."},
    {"name": "size-control", "value": "36px", "usage": "Bouton swap, boutons ronds +/−."},
    {"name": "size-avatar", "value": "40px", "usage": "Tuile avatar et icône d'app dans l'en-tête."},
    {"name": "size-input", "value": "52px", "usage": "Hauteur du champ de recherche."},
    {"name": "size-key", "value": "74px", "usage": "Hauteur d'une touche du clavier (bien au-delà des 44px minimum)."},
    {"name": "size-fab", "value": "52px", "usage": "FAB central de la tab bar."},
    {"name": "size-tabbar", "value": "84px", "usage": "Hauteur de la tab bar, hors safe area."},
]}

BLUR = {"note": "Flou d'arrière-plan des contrôles en verre.", "tokens": [
    {"name": "blur-glass", "value": "18px", "usage": "backdrop-filter des contrôles `glass` sur le hero ou un sheet."},
]}

tokens = {
    "name": "Convix", "version": 1,
    "color": {"themes": THEMES, "tokens": COLORS},
    "type": TYPE, "spacing": SPACING, "radius": RADIUS, "shadow": SHADOW, "size": SIZE, "blur": BLUR,
}

if __name__ == "__main__":
    bad = report()
    out = os.path.join(os.path.dirname(__file__), "..", "tokens.json")
    with open(out, "w") as f:
        json.dump(tokens, f, indent=2, ensure_ascii=False)
    print("written", os.path.abspath(out), "| failing pairs:", bad)
