"""Compiles tokens.json to src/theme/tokens.ts for the React Native app.

Conversions from the web tokens:
- colours: one flat object per theme, aliases (`{lilac}`) resolved, names camelCased;
- type styles: px strings to numbers, `em` letter-spacing to px, family + weight to the
  embedded font file name (Android picks the file by name, not by fontWeight);
- spacing, radius, size, blur: numbers; shadows: React Native `boxShadow` strings;
- motion: durations and curve from the README (they have no token in tokens.json).

Usage: python3 design-system/tools/build_rn_theme.py [tokens.json] [out.ts]
       python3 design-system/tools/build_rn_theme.py --check   (exit 1 if out.ts is stale)"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "tokens.json")
OUT = os.path.join(os.path.dirname(ROOT), "src", "theme", "tokens.ts")
ICONS_OUT = os.path.join(os.path.dirname(ROOT), "src", "assets", "icons.ts")

FONT_FILES = {
    "display": {300: "Unbounded_300Light", 400: "Unbounded_400Regular", 500: "Unbounded_500Medium", 600: "Unbounded_600SemiBold", 700: "Unbounded_700Bold"},
    "sans": {400: "Manrope_400Regular", 500: "Manrope_500Medium", 600: "Manrope_600SemiBold", 700: "Manrope_700Bold", 800: "Manrope_800ExtraBold"},
}
# Styles written in capitals (README, « Typographie ») and styles with tabular figures.
UPPERCASE = {"lockup", "sheet-title", "currency-label", "button-label"}
TABULAR = {"amount-xl", "amount-lg", "amount-md", "keypad-digit", "text-strong", "text-caption"}
MOTION = {"press": 120, "select": 200, "swap": 320, "caretBlink": 1100}
EASING = [0.2, 0.8, 0.2, 1]


def camel(name):
    head, *rest = name.split("-")
    return head + "".join(p[:1].upper() + p[1:] for p in rest)


def px(value):
    return float(value[:-2]) if value.endswith("px") else float(value)


def num(x):
    x = round(x, 3)
    return int(x) if x == int(x) else x


def build(tokens):
    themes = [t["id"] for t in tokens["color"]["themes"]]
    raw = {tok["name"]: tok["value"] for tok in tokens["color"]["tokens"]}

    def resolve(name, theme):
        v = raw[name]
        if isinstance(v, dict):
            v = v[theme]
        if v.startswith("{"):
            return resolve(v[1:-1], theme)
        return v

    colors = {th: {camel(n): resolve(n, th) for n in raw} for th in themes}

    used_fonts = set()
    type_styles = {}
    for group in tokens["type"]["groups"]:
        for s in group["styles"]:
            family = s.get("family", group["family"])
            weight = int(s["fontWeight"])
            font = FONT_FILES[family][weight]
            used_fonts.add(font)
            size = px(s["fontSize"])
            style = {"fontFamily": font, "fontSize": num(size), "lineHeight": num(px(s["lineHeight"]))}
            ls = s.get("letterSpacing")
            if ls:
                style["letterSpacing"] = num(float(ls[:-2]) * size) if ls.endswith("em") else num(px(ls))
            if s["name"] in UPPERCASE:
                style["textTransform"] = "uppercase"
            if s["name"] in TABULAR:
                style["fontVariant"] = ["tabular-nums"]
            type_styles[s["name"]] = style

    def scale(family, prefix):
        return {tok["name"][len(prefix):]: num(px(tok["value"])) for tok in tokens[family]["tokens"]}

    shadows = {th: {} for th in themes}
    for tok in tokens["shadow"]["tokens"]:
        for th in themes:
            v = tok["value"][th] if isinstance(tok["value"], dict) else tok["value"]
            shadows[th][camel(tok["name"])] = v

    return {
        "themes": themes,
        "colors": colors,
        "fonts": sorted(used_fonts),
        "type": type_styles,
        "space": scale("spacing", "space-"),
        "radius": scale("radius", "radius-"),
        "size": scale("size", "size-"),
        "blur": scale("blur", "blur-"),
        "shadows": shadows,
    }


def ts(value, indent=0):
    pad = "  " * indent
    if isinstance(value, dict):
        if not value:
            return "{}"
        items = []
        for k, v in value.items():
            key = k if k.replace("_", "").isalnum() and not k[0].isdigit() else json.dumps(k)
            items.append(f"{pad}  {key}: {ts(v, indent + 1)},")
        return "{\n" + "\n".join(items) + f"\n{pad}}}"
    if isinstance(value, list):
        return "[" + ", ".join(ts(v, indent) for v in value) + "]"
    if isinstance(value, str):
        return "'" + value.replace("'", "\\'") + "'"
    return json.dumps(value)


def render(t):
    lines = [
        "/**",
        " * GÉNÉRÉ par design-system/tools/build_rn_theme.py depuis design-system/tokens.json.",
        " * Ne pas éditer à la main : modifier le design system puis lancer `npm run tokens`.",
        " */",
        "",
        f"export const themeNames = {ts(t['themes'])} as const;",
        "export type ThemeName = (typeof themeNames)[number];",
        "",
        f"export const colors = {ts(t['colors'])} as const;",
        "export type ColorName = keyof (typeof colors)['night'];",
        "",
        "/** Fichiers de police à charger (noms exportés par @expo-google-fonts). */",
        f"export const fontFiles = {ts(t['fonts'])} as const;",
        "",
        f"export const typeStyles = {ts(t['type'])} as const;",
        "export type TypeStyleName = keyof typeof typeStyles;",
        "",
        f"export const space = {ts(t['space'])} as const;",
        "",
        f"export const radius = {ts(t['radius'])} as const;",
        "",
        f"export const size = {ts(t['size'])} as const;",
        "",
        f"export const blur = {ts(t['blur'])} as const;",
        "",
        "/** Valeurs `boxShadow` React Native, par thème. */",
        f"export const shadows = {ts(t['shadows'])} as const;",
        "",
        "/** Durées (ms) et courbe du README, section « Mouvement ». */",
        f"export const motion = {ts(MOTION)} as const;",
        f"export const motionEasing = {ts(EASING)} as const;",
        "",
    ]
    return "\n".join(lines)


def render_icons():
    """Icônes (24px, trait 1.75) et tracé du logo, repris des sources web du design system."""
    src = os.path.join(ROOT, "components", "src")
    icons = open(os.path.join(src, "icons.ts"), encoding="utf-8").read()
    brand = open(os.path.join(src, "brand.ts"), encoding="utf-8").read()
    body = "\n".join(l for l in (icons + "\n" + brand).splitlines() if not l.startswith("/**") and not l.startswith(" *"))
    return "/** GÉNÉRÉ par design-system/tools/build_rn_theme.py — icônes et logo du design system. */\n" + body.strip() + "\n"


def main(argv):
    check = "--check" in argv
    args = [a for a in argv if a != "--check"]
    src = args[0] if args else SRC
    out = args[1] if len(args) > 1 else OUT
    outputs = {out: render(build(json.load(open(src, encoding="utf-8")))), ICONS_OUT: render_icons()}
    if check:
        stale = [p for p, c in outputs.items() if not os.path.exists(p) or open(p, encoding="utf-8").read() != c]
        for p in stale:
            print(f"{p} n'est pas à jour : lancez `npm run tokens`.")
        return 1 if stale else 0
    for path, content in outputs.items():
        os.makedirs(os.path.dirname(path), exist_ok=True)
        open(path, "w", encoding="utf-8").write(content)
        print(f"écrit : {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
