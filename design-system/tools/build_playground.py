"""Writes playground/<Component>.html + playground/index.html from tools/previews.py.

Each page loads tokens.css, components/bundle.css, React 18 UMD (jsDelivr, pinned) and
components/bundle.js, then renders one component. Open playground/index.html in a browser;
add ?theme=day to switch theme.
Usage: python3 tools/build_playground.py
"""
import html, json, os, sys

sys.path.insert(0, os.path.dirname(__file__))
from previews import PREVIEWS, DATA, FONTS, SCREEN_CSS  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "playground")
FLAGS = sorted(f[:-4] for f in os.listdir(os.path.join(ROOT, "assets", "Flags")) if f.endswith(".svg"))
REACT = ('<script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js"></script>\n'
         '<script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js"></script>')
THEME = ("<script>document.documentElement.dataset.theme = "
         "new URLSearchParams(location.search).get('theme') === 'day' ? 'day' : 'night';</script>")

def page(name, subtitle, script, extra_head=""):
    data = DATA.replace("__FLAGS__", json.dumps({c: f"../assets/Flags/{c}.svg" for c in FLAGS}))
    return (f'<!doctype html>\n<html lang="fr" data-theme="night">\n<head>\n<meta charset="utf-8">\n'
            f'<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            f'<title>{name} — Convix</title>\n{THEME}\n{FONTS}\n'
            f'<link rel="stylesheet" href="../tokens.css">\n<link rel="stylesheet" href="../components/bundle.css">\n'
            f'{REACT}\n<script src="../components/bundle.js"></script>\n{extra_head}</head>\n'
            f'<body>\n<!-- {html.escape(subtitle)} -->\n<div id="root"></div>\n<script>{data}{script}</script>\n</body>\n</html>\n')

def index(groups):
    rows = []
    for group, items in groups.items():
        links = "".join(f'<li><a href="{n}.html">{n}</a> <span>{html.escape(s)}</span> '
                        f'<a class="t" href="{n}.html?theme=day">jour</a></li>' for n, s in items)
        rows.append(f"<h2>{html.escape(group)}</h2><ul>{links}</ul>")
    return ('<!doctype html>\n<html lang="fr" data-theme="night">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Convix — playground</title>\n'
            f'{FONTS}\n<link rel="stylesheet" href="../tokens.css">\n<style>\n'
            'body { margin: 0; padding: 32px 24px; background: var(--canvas); color: var(--ink); font-family: var(--font-sans); }\n'
            'h1 { font-family: var(--font-display); font-weight: 600; margin: 0 0 8px; }\n'
            'h2 { font-family: var(--font-display); font-size: 14px; text-transform: uppercase; color: var(--ink-muted); margin: 32px 0 8px; }\n'
            'ul { list-style: none; padding: 0; margin: 0; } li { padding: 6px 0; border-bottom: 1px solid var(--line); }\n'
            'a { color: var(--accent); font-weight: 700; } span { color: var(--ink-muted); margin-left: 8px; } a.t { margin-left: 8px; font-weight: 500; }\n'
            '</style>\n</head>\n<body>\n<h1>Convix</h1>\n<p style="color:var(--ink-muted)">Composants du design system, thème nuit (lien « jour » pour le thème clair).</p>\n'
            + "".join(rows) + "\n</body>\n</html>\n")

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    groups = {}
    for name, (group, _h, subtitle, script) in PREVIEWS.items():
        extra = SCREEN_CSS if name == "ConverterScreen" else ""
        with open(os.path.join(OUT, f"{name}.html"), "w") as fh:
            fh.write(page(name, subtitle, script, extra))
        groups.setdefault(group, []).append((name, subtitle))
    with open(os.path.join(OUT, "index.html"), "w") as fh:
        fh.write(index(groups))
    print(len(PREVIEWS), "pages + index")
