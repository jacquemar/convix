"""Convix logo system — generated geometry (no font dependency).

The mark is the *split C*: a heavy elliptical C cut horizontally at its spine; the upper
half slides right and the lower half slides left. Two halves trading places = two
currencies being exchanged. The wordmark repeats the cut on its C and gives the X a
violet rising stroke (the exchange).
"""
import math, os

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "Logos")
VIOLET, ORCHID, INK, WHITE, HERO = "#7a45f0", "#c25ae8", "#19122e", "#ffffff", "#17132a"

def f(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")

def ring_half(cx, cy, rx, ry, t, a0, a1, dx, dy):
    """Closed path of an elliptical ring sector between angles a0→a1 (deg, math orientation,
    counter-clockwise, y up), stroke thickness t, translated by (dx, dy)."""
    irx, iry = rx - t, ry - t
    def pt(r_x, r_y, a):
        return cx + dx + r_x * math.cos(math.radians(a)), cy + dy - r_y * math.sin(math.radians(a))
    o0, o1 = pt(rx, ry, a0), pt(rx, ry, a1)
    i1, i0 = pt(irx, iry, a1), pt(irx, iry, a0)
    large = 1 if abs(a1 - a0) > 180 else 0
    # outer arc goes counter-clockwise in math terms = sweep-flag 0 in SVG (y down)
    return (f"M{f(o0[0])} {f(o0[1])}A{f(rx)} {f(ry)} 0 {large} 0 {f(o1[0])} {f(o1[1])}"
            f"L{f(i1[0])} {f(i1[1])}A{f(irx)} {f(iry)} 0 {large} 1 {f(i0[0])} {f(i0[1])}Z")

def split_c(cx, cy, rx, ry, t, opening=40, gap=2.6, slide=2.6):
    """Upper half (opening→180°) slides right, lower half (180°→360-opening) slides left."""
    upper = ring_half(cx, cy, rx, ry, t, opening, 180, +slide, -gap / 2)
    lower = ring_half(cx, cy, rx, ry, t, 180, 360 - opening, -slide, +gap / 2)
    return upper + lower

# ---------- Mark (64 grid) ----------
MARK_D = split_c(32.6, 32, 23, 22, 10, opening=38, gap=3.2, slide=3.2)

def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" width="{f(w)}" height="{f(h)}" '
            f'role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n')

GRAD = (f'<linearGradient id="cvx-g" x1="0" y1="0" x2="1" y2="1">'
        f'<stop offset="0" stop-color="#9a6bff"/><stop offset=".55" stop-color="{VIOLET}"/>'
        f'<stop offset="1" stop-color="{ORCHID}"/></linearGradient>')

def mark(fill):
    defs = f"<defs>{GRAD}</defs>" if fill == "url(#cvx-g)" else ""
    return svg(64, 64, f'{defs}<path fill="{fill}" d="{MARK_D}"/>', "Convix")

def app_icon(dark=False):
    s = 1024
    k = s / 64 * 0.62           # mark scale inside the tile (62% of the tile)
    off = (s - 64 * k) / 2
    if dark:
        bg = (f'<radialGradient id="cvx-glow" cx=".78" cy=".18" r=".75"><stop offset="0" stop-color="#6b2590"/>'
              f'<stop offset="1" stop-color="{HERO}" stop-opacity="0"/></radialGradient>')
        defs = f"<defs>{GRAD}{bg}</defs>"
        tile = (f'<rect width="{s}" height="{s}" rx="230" fill="{HERO}"/>'
                f'<rect width="{s}" height="{s}" rx="230" fill="url(#cvx-glow)"/>')
        ink = "url(#cvx-g)"
    else:
        hl = ('<radialGradient id="cvx-hl" cx=".22" cy=".12" r=".9"><stop offset="0" stop-color="#ffffff" stop-opacity=".38"/>'
              '<stop offset=".6" stop-color="#ffffff" stop-opacity="0"/></radialGradient>')
        tg = (f'<linearGradient id="cvx-t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9367ff"/>'
              f'<stop offset=".5" stop-color="{VIOLET}"/><stop offset="1" stop-color="{ORCHID}"/></linearGradient>')
        defs = f"<defs>{tg}{hl}</defs>"
        tile = (f'<rect width="{s}" height="{s}" rx="230" fill="url(#cvx-t)"/>'
                f'<rect width="{s}" height="{s}" rx="230" fill="url(#cvx-hl)"/>')
        ink = WHITE
    body = f'{defs}{tile}<path transform="translate({f(off)} {f(off)}) scale({f(k)})" fill="{ink}" d="{MARK_D}"/>'
    return svg(s, s, body, "Convix")

# ---------- Wordmark (cap height 40) ----------
H, T, S = 40.0, 8.6, 7.0       # cap height, stem, letter gap

def wordmark_parts():
    """Returns (paths_main, path_x_rise, width). Straight letters are strokes clipped to the cap band."""
    x = 0.0
    filled, strokes, rise = [], [], ""
    # C (split) — ellipse 46 x 40
    filled.append(split_c(x + 23, 20, 23, 20, T, opening=40, gap=2.4, slide=2.2))
    x += 46 - 6 + S             # C is open on the right: tuck the next letter in a little
    # O
    cx = x + 23   # O: full elliptical ring, outer + inner ellipse filled even-odd
    filled.append(f"M{f(cx-23)} 20A23 20 0 1 0 {f(cx+23)} 20A23 20 0 1 0 {f(cx-23)} 20Z"
                  f"M{f(cx-23+T)} 20A{f(23-T)} {f(20-T)} 0 1 1 {f(cx+23-T)} 20A{f(23-T)} {f(20-T)} 0 1 1 {f(cx-23+T)} 20Z")
    x += 46 + S
    # N — width 39
    w = 39
    strokes.append(f"M{f(x+T/2)} 60V0L{f(x+w-T/2)} 40V-20")
    x += w + S
    # V — width 44
    w = 44
    strokes.append(f"M{f(x+T*0.55)} -12L{f(x+w/2)} 46L{f(x+w-T*0.55)} -12")
    x += w + S - 1
    # I
    strokes.append(f"M{f(x+T/2)} -10V50")
    x += T + S
    # X — width 42: falling stroke in ink, rising stroke separate (accent)
    w = 42
    def diag(x0, y0, x1, y1, ext=14):
        dx, dy = x1 - x0, y1 - y0; L = math.hypot(dx, dy); ux, uy = dx / L, dy / L
        return f"M{f(x0-ux*ext)} {f(y0-uy*ext)}L{f(x1+ux*ext)} {f(y1+uy*ext)}"
    strokes.append(diag(x + T * 0.55, 0, x + w - T * 0.55, 40))
    rise = diag(x + T * 0.55, 40, x + w - T * 0.55, 0)
    x += w
    return filled, strokes, rise, x

def wordmark(ink, accent=None, title="Convix"):
    filled, strokes, rise, w = wordmark_parts()
    clip = f'<clipPath id="cvx-band"><rect x="-2" y="0" width="{f(w+4)}" height="{f(H)}"/></clipPath>'
    st = f'fill="none" stroke-width="{f(T)}" stroke-linejoin="miter" stroke-miterlimit="40" stroke-linecap="butt"'
    body = (f"<defs>{clip}</defs>"
            f'<path fill="{ink}" fill-rule="evenodd" d="{"".join(filled)}"/>'
            f'<g clip-path="url(#cvx-band)"><path {st} stroke="{ink}" d="{"".join(strokes)}"/>'
            f'<path {st} stroke="{accent or ink}" d="{rise}"/></g>')
    return svg(w, H, body, title), w

def lockup(ink, accent, dark):
    """App icon (56) + wordmark at cap 24, vertically centred."""
    wm_body, wm_w = wordmark(ink, accent)
    inner = wm_body.split(">", 1)[1].rsplit("</svg>", 1)[0].replace("<title>Convix</title>", "")
    icon = app_icon(dark=dark)
    icon_inner = icon.split(">", 1)[1].rsplit("</svg>", 1)[0].replace("<title>Convix</title>", "")
    icon_inner = icon_inner.replace('id="cvx-', 'id="cvx-i-').replace('url(#cvx-', 'url(#cvx-i-')
    sc = 24 / H
    W = 56 + 16 + wm_w * sc
    body = (f'<g transform="scale({f(56/1024)})">{icon_inner}</g>'
            f'<g transform="translate(72 {f((56-24)/2)}) scale({f(sc)})">{inner}</g>')
    return svg(W, 56, body, "Convix")

FILES = {
    "convix-mark-gradient.svg": mark("url(#cvx-g)"),
    "convix-mark-violet.svg": mark(VIOLET),
    "convix-mark-white.svg": mark(WHITE),
    "convix-mark-ink.svg": mark(INK),
    "convix-app-icon.svg": app_icon(False),
    "convix-app-icon-dark.svg": app_icon(True),
    "convix-wordmark-white.svg": wordmark(WHITE, "#b48cff")[0],
    "convix-wordmark-ink.svg": wordmark(INK, VIOLET)[0],
    "convix-wordmark-mono-white.svg": wordmark(WHITE)[0],
    "convix-wordmark-mono-ink.svg": wordmark(INK)[0],
    "convix-lockup-white.svg": lockup(WHITE, "#b48cff", dark=False),
    "convix-lockup-ink.svg": lockup(INK, VIOLET, dark=False),
}

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, body in FILES.items():
        with open(os.path.join(OUT, name), "w") as fh:
            fh.write(body)
        print(name, len(body))

# Bundle source: the mark path, so <AppIcon/> renders inline (gradient ids per instance).
with open(os.path.join(os.path.dirname(__file__), "..", "components", "src", "brand.ts"), "w") as fh:
    fh.write("/** Generated by tools/build_logo.py — the Convix split-C mark on a 64×64 grid. */\n"
             f"export const MARK_PATH = {MARK_D!r};\n".replace("'", '"'))
