"""Contrast helper: WCAG 2 relative luminance, with alpha compositing over a ground."""
import re, sys

def parse(c):
    c = c.strip()
    if c.startswith('#'):
        h = c[1:]
        if len(h) in (3, 4): h = ''.join(ch*2 for ch in h)
        r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
        a = int(h[6:8], 16)/255 if len(h) == 8 else 1.0
        return r, g, b, a
    m = re.match(r'rgba?\(([^)]+)\)', c)
    p = [float(x) for x in re.split(r'[ ,/]+', m.group(1).strip())]
    return p[0], p[1], p[2], (p[3] if len(p) > 3 else 1.0)

def over(fg, bg):
    r, g, b, a = parse(fg); R, G, B, _ = parse(bg)
    return '#%02x%02x%02x' % tuple(round(x*a + y*(1-a)) for x, y in ((r, R), (g, G), (b, B)))

def lum(c):
    r, g, b, _ = parse(c)
    def ch(v):
        v /= 255
        return v/12.92 if v <= 0.03928 else ((v+0.055)/1.055)**2.4
    return 0.2126*ch(r) + 0.7152*ch(g) + 0.0722*ch(b)

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi+0.05)/(lo+0.05)

if __name__ == '__main__':
    print(round(ratio(sys.argv[1], sys.argv[2]), 2))
