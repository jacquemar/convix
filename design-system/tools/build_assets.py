"""Convix icons (24px grid, 1.75 stroke, round caps) and circular flags (64px).

Icons are defined ONCE here: written as SVG asset files (fixed ink, since <img> cannot
inherit colour) and as src/icons.ts (currentColor) for the React bundle.
"""
import json, math, os

ROOT = os.path.join(os.path.dirname(__file__), "..")
INK = "#19122e"

def gear():
    """8-tooth gear outline + hub."""
    pts, n, ro, ri = [], 8, 9.2, 7.0
    for i in range(n * 4):
        a = math.pi * 2 * i / (n * 4) - math.pi / 2
        r = ro if (i % 4) in (0, 1) else ri
        # nudge so teeth are centred
        a += math.pi * 2 / (n * 8)
        pts.append((12 + r * math.cos(a), 12 + r * math.sin(a)))
    d = "M" + "L".join(f"{x:.2f} {y:.2f}" for x, y in pts) + "Z"
    return f'<path d="{d}"/><circle cx="12" cy="12" r="3"/>'

def star(cx, cy, ro, ri, rot=-90):
    p = []
    for i in range(10):
        r = ro if i % 2 == 0 else ri
        a = math.radians(rot + 36 * i)
        p.append(f"{cx + r*math.cos(a):.2f} {cy + r*math.sin(a):.2f}")
    return "M" + "L".join(p) + "Z"

DOTS = "".join(f'<circle cx="{x}" cy="{y}" r="1.25" fill="currentColor" stroke="none"/>'
               for y in (5, 10, 15) for x in (7, 12, 17)) + '<circle cx="12" cy="20" r="1.25" fill="currentColor" stroke="none"/>'

ICONS = {
    "home": '<path d="M4 10.4 12 4l8 6.4V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1Z"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z"/>',
    "keypad": DOTS,
    "bell": '<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15Z"/><path d="M10 21a2.2 2.2 0 0 0 4 0"/>',
    "settings": gear(),
    "swap": '<path d="M8 4v15.5"/><path d="M4.5 16 8 19.5l3.5-3.5"/><path d="M16 20V4.5"/><path d="M12.5 8 16 4.5 19.5 8"/>',
    "search": '<circle cx="10.75" cy="10.75" r="6.25"/><path d="m15.5 15.5 4.5 4.5"/>',
    "mic": '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/>',
    "plus": '<path d="M12 5.5v13"/><path d="M5.5 12h13"/>',
    "minus": '<path d="M5.5 12h13"/>',
    "backspace": '<path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7Z"/><path d="m11.5 9.5 5 5"/><path d="m16.5 9.5-5 5"/>',
    "trend-up": '<path d="M5 17 17 5"/><path d="M8.5 5H17v8.5"/>',
    "trend-down": '<path d="M5 7l12 12"/><path d="M17 10.5V19H8.5"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
    "star": f'<path d="{star(12, 12.6, 9, 3.9)}"/>',
    "refresh": '<path d="M19.5 12A7.5 7.5 0 0 1 6.2 16.8"/><path d="M4.5 12A7.5 7.5 0 0 1 17.8 7.2"/><path d="M18 3.5v4h-4"/><path d="M6 20.5v-4h4"/>',
    "chevron-right": '<path d="m9.5 6 6 6-6 6"/>',
    "close": '<path d="M6.5 6.5l11 11"/><path d="M17.5 6.5l-11 11"/>',
    "check": '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
}

def icon_svg(name, inner, ink=INK):
    body = inner.replace("currentColor", ink)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" '
            f'stroke="{ink}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'
            f'<title>{name}</title>{body}</svg>\n')

# ---------- Flags (64 grid, clipped to a disc) ----------
def flag(inner, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="{title}">'
            f'<title>{title}</title><defs><clipPath id="d"><circle cx="32" cy="32" r="32"/></clipPath></defs>'
            f'<g clip-path="url(#d)">{inner}</g></svg>\n')

def v3(a, b, c):  # vertical tricolour
    return f'<rect width="22" height="64" fill="{a}"/><rect x="21" width="22" height="64" fill="{b}"/><rect x="42" width="22" height="64" fill="{c}"/>'

def h3(a, b, c):
    return f'<rect width="64" height="22" fill="{a}"/><rect y="21" width="64" height="22" fill="{b}"/><rect y="42" width="64" height="22" fill="{c}"/>'

def us():
    s = 64 / 13
    stripes = "".join(f'<rect y="{i*s:.3f}" width="64" height="{s+0.05:.3f}" fill="{"#b22234" if i % 2 == 0 else "#ffffff"}"/>' for i in range(13))
    canton = f'<rect width="32" height="{7*s:.3f}" fill="#3c3b6e"/>'
    stars = "".join(f'<circle cx="{5 + c*6.4 + (3.2 if r % 2 else 0):.2f}" cy="{4.4 + r*5.6:.2f}" r="1.25" fill="#fff"/>'
                    for r in range(6) for c in range(4 if r % 2 else 5) if 5 + c*6.4 + (3.2 if r % 2 else 0) < 31)
    return stripes + canton + stars

def eu():
    stars = "".join(f'<path d="{star(32 + 17*math.cos(math.radians(30*i)), 32 + 17*math.sin(math.radians(30*i)), 3.3, 1.35)}" fill="#ffcc00"/>' for i in range(12))
    return '<rect width="64" height="64" fill="#003399"/>' + stars

def gb():
    return ('<rect width="64" height="64" fill="#012169"/>'
            '<path d="M0 0 64 64M64 0 0 64" stroke="#fff" stroke-width="12"/>'
            '<path d="M0 0 64 64M64 0 0 64" stroke="#c8102e" stroke-width="4"/>'
            '<path d="M32 0v64M0 32h64" stroke="#fff" stroke-width="20"/>'
            '<path d="M32 0v64M0 32h64" stroke="#c8102e" stroke-width="12"/>')

def ca():
    R = [(32, 14.5), (34.6, 19.6), (37.8, 18.2), (36.6, 26.4), (40.6, 22.6), (41.6, 25.4), (46.2, 24.6), (44.6, 30.2), (46.8, 31.2),
         (39.8, 37.4), (40.8, 40.4), (33.4, 39.2), (33.6, 47.5)]
    pts = R + [(64 - x, y) for x, y in reversed(R)]
    d = "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z"
    return f'<rect width="64" height="64" fill="#d52b1e"/><rect x="16" width="32" height="64" fill="#fff"/><path d="{d}" fill="#d52b1e"/>'

def gh():
    return h3("#ce1126", "#fcd116", "#006b3f") + f'<path d="{star(32, 33, 9.5, 3.8)}" fill="#000"/>'

def cn():
    small = "".join(f'<path d="{star(x, y, 2.6, 1.05, rot)}" fill="#ffde00"/>' for x, y, rot in
                    ((30, 11, -60), (35, 17, -80), (35, 25, -100), (30, 31, -120)))
    return f'<rect width="64" height="64" fill="#ee1c25"/><path d="{star(18, 21, 9, 3.6)}" fill="#ffde00"/>' + small

def ma():
    pts = []
    for i in range(5):
        a = math.radians(-90 + 144 * i)
        pts.append(f"{32 + 13*math.cos(a):.2f} {33 + 13*math.sin(a):.2f}")
    return f'<rect width="64" height="64" fill="#c1272d"/><path d="M{"L".join(pts)}Z" fill="none" stroke="#006233" stroke-width="2.6" stroke-linejoin="miter"/>'

FLAGS = {
    "us": ("États-Unis — USD", us()),
    "eu": ("Union européenne — EUR", eu()),
    "ci": ("Côte d'Ivoire — XOF", v3("#f77f00", "#ffffff", "#009e60")),
    "gb": ("Royaume-Uni — GBP", gb()),
    "ng": ("Nigeria — NGN", v3("#008751", "#ffffff", "#008751")),
    "gh": ("Ghana — GHS", gh()),
    "jp": ("Japon — JPY", '<rect width="64" height="64" fill="#fff"/><circle cx="32" cy="32" r="18" fill="#bc002d"/>'),
    "ca": ("Canada — CAD", ca()),
    "dk": ("Danemark — DKK", '<rect width="64" height="64" fill="#c8102e"/><path d="M20 0h8v64h-8z M0 28h64v8H0z" fill="#fff"/>'),
    "ch": ("Suisse — CHF", '<rect width="64" height="64" fill="#da291c"/><path d="M27 14h10v13h13v10H37v13H27V37H14V27h13z" fill="#fff"/>'),
    "cn": ("Chine — CNY", cn()),
    "ma": ("Maroc — MAD", ma()),
}

if __name__ == "__main__":
    for n, inner in ICONS.items():
        open(os.path.join(ROOT, "assets/Icons", f"{n}.svg"), "w").write(icon_svg(n, inner))
    for code, (title, inner) in FLAGS.items():
        open(os.path.join(ROOT, "assets/Flags", f"{code}.svg"), "w").write(flag(inner, title))
    # TS source for the bundle: icon name -> inner SVG markup (currentColor)
    ts = ("/** Generated by tools/build_assets.py — Convix icon set (24px grid, 1.75 stroke). */\n"
          "export const ICONS = " + json.dumps(ICONS, indent=2) + " as const;\n\n"
          "export type IconName = keyof typeof ICONS;\n")
    open(os.path.join(ROOT, "components", "src", "icons.ts"), "w").write(ts)
    print(len(ICONS), "icons,", len(FLAGS), "flags")
