"""Compiles tokens.json to tokens.css for web consumers (playground, Expo web).

Layout: `:root, [data-theme="night"]` holds the first theme's colours and shadows, one
`[data-theme="<id>"]` block per further theme, `:root` the spacing/radius/size/blur/font
variables, then one `.<style>` class per type style.
Usage: python3 tools/build_tokens_css.py tokens.json tokens.css"""
import json, sys

def main(src, out):
    t = json.load(open(src))
    themes = [th["id"] for th in t["color"]["themes"]]
    first = themes[0]
    def val(v, th):
        if isinstance(v, str): return v if th == first else None
        return v.get(th)
    def css(v):
        return f"var(--{v[1:-1]})" if v.startswith("{") else v
    blocks = {th: [] for th in themes}
    for fam in ("color", "shadow"):
        for tok in t.get(fam, {}).get("tokens", []):
            for th in themes:
                v = val(tok["value"], th)
                if v is None and th == first and isinstance(tok["value"], dict):
                    v = next(iter(tok["value"].values()))
                if v is not None: blocks[th].append(f"  --{tok['name']}: {css(v)};")
    lines = [f':root, [data-theme="{first}"] {{'] + blocks[first] + ["}"]
    for th in themes[1:]:
        lines += [f'[data-theme="{th}"] {{'] + blocks[th] + ["}"]
    root = []
    for fam, body in t.items():
        if fam in ("color", "type", "shadow", "name", "version"): continue
        for tok in body.get("tokens", []): root.append(f"  --{tok['name']}: {tok['value']};")
    for k, stack in t["type"]["families"].items(): root.append(f"  --font-{k}: {stack};")
    lines += [":root {"] + root + ["}"]
    for g in t["type"]["groups"]:
        for s in g["styles"]:
            fam = s.get("family", g["family"])
            decl = [f"font-family: var(--font-{fam})", f"font-size: {s['fontSize']}", f"line-height: {s['lineHeight']}", f"font-weight: {s['fontWeight']}"]
            if "letterSpacing" in s: decl.append(f"letter-spacing: {s['letterSpacing']}")
            lines.append(f".{s['name']} {{ {'; '.join(decl)}; }}")
    open(out, "w").write("\n".join(lines) + "\n")

main(*sys.argv[1:])
