#!/usr/bin/env python3
"""
JokeMasti — original meme image generator.

Renders every meme in data/memes.json into:
  src/assets/img/memes/<slug>.webp        (1000x1250, full)
  src/assets/img/memes/<slug>-thumb.webp  (480x600, grid thumbnail)

Also renders the PWA icons, favicon and default social-share image.

All artwork is generated from primitive shapes + typography in this file.
Nothing is downloaded, traced or copied from third-party images.

Usage:  python3 scripts/generate_images.py
"""

import json
import math
import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "assets", "img", "memes")
ICON_OUT = os.path.join(ROOT, "src", "assets", "img")

W, H = 1000, 1250
THUMB = (480, 600)

FONT_DIR = "/usr/share/fonts/truetype/google-fonts"
F_BOLD = os.path.join(FONT_DIR, "Poppins-Bold.ttf")
F_MED = os.path.join(FONT_DIR, "Poppins-Medium.ttf")
F_REG = os.path.join(FONT_DIR, "Poppins-Regular.ttf")

for p in (F_BOLD, F_MED, F_REG):
    if not os.path.exists(p):
        sys.exit("Missing font: %s" % p)

# ---------------------------------------------------------------- palettes
# bg = canvas gradient (top, bottom), ink = main text, accent = shapes,
# soft = low-contrast shape fill, band = caption band colour.
PALETTES = {
    "mango":  {"bg": ("#FFE7B8", "#FFB55C"), "ink": "#3A2408", "accent": "#F2820C", "soft": "#FFD089", "band": "#2A1A06"},
    "chai":   {"bg": ("#F4E3CE", "#D8AC7C"), "ink": "#33210F", "accent": "#A9642B", "soft": "#EBCFAE", "band": "#2B1B0C"},
    "mint":   {"bg": ("#D8F5E6", "#8ED8B6"), "ink": "#0D2C20", "accent": "#12996A", "soft": "#B4E9D0", "band": "#0B241A"},
    "violet": {"bg": ("#E5DCFF", "#A48CF5"), "ink": "#1E1140", "accent": "#5F33D6", "soft": "#CBBBFB", "band": "#190E36"},
    "sunset": {"bg": ("#FFDCCB", "#FF9772"), "ink": "#3B1508", "accent": "#E64A19", "soft": "#FFC2A6", "band": "#2E1106"},
    "rose":   {"bg": ("#FFDCE8", "#F58AAE"), "ink": "#3D0E20", "accent": "#D62B62", "soft": "#FFBDD0", "band": "#320B1A"},
    "sky":    {"bg": ("#D6ECFF", "#7CB8F0"), "ink": "#0C2540", "accent": "#1668C4", "soft": "#B1DAFA", "band": "#091D33"},
    "lime":   {"bg": ("#EAF7C4", "#B7DE63"), "ink": "#23300A", "accent": "#6A9B12", "soft": "#D6EE96", "band": "#1B2607"},
    "night":  {"bg": ("#3A3556", "#191634"), "ink": "#FFFFFF", "accent": "#FFC94D", "soft": "#4C466E", "band": "#100E24"},
    "ice":    {"bg": ("#E2F2F6", "#9FD2E0"), "ink": "#0D2A31", "accent": "#0E7C93", "soft": "#C2E4EC", "band": "#0A2027"},
    "clay":   {"bg": ("#F3E2D4", "#D6A57C"), "ink": "#36210F", "accent": "#A5602A", "soft": "#E8CEB6", "band": "#2B1A0C"},
    "steel":  {"bg": ("#E4E8EE", "#A3AFC2"), "ink": "#151C27", "accent": "#3D5A80", "soft": "#C9D1DC", "band": "#111722"},
    "diya":   {"bg": ("#FFE9C2", "#F0A63C"), "ink": "#3A2306", "accent": "#C6440E", "soft": "#FFD494", "band": "#2A1904"},
    "holi":   {"bg": ("#FFE0F0", "#B692F0"), "ink": "#2B1040", "accent": "#E0357A", "soft": "#F3C8E6", "band": "#230D33"},
    "pine":   {"bg": ("#DDF0E2", "#7FBF95"), "ink": "#0F2A18", "accent": "#17693A", "soft": "#BCE2C8", "band": "#0B2013"},
}


def hx(c):
    c = c.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    a, b = hx(a) if isinstance(a, str) else a, hx(b) if isinstance(b, str) else b
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def font(path, size):
    return ImageFont.truetype(path, size)


def text_w(d, s, f):
    return d.textbbox((0, 0), s, font=f)[2]


def gradient(size, top, bottom):
    w, h = size
    img = Image.new("RGB", (1, h))
    px = img.load()
    for y in range(h):
        px[0, y] = mix(top, bottom, y / max(1, h - 1))
    return img.resize((w, h), Image.BILINEAR)


def rr(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


# ---------------------------------------------------------------- icons
# Each icon draws inside a square box (x, y, s) using accent + ink colours.
def _c(d, x, y, s, f, t=0.0, **kw):
    d.ellipse([x, y, x + s, y + t if t else y + s], fill=f, **kw)


def icon(name, d, x, y, s, pal):
    a, ink, soft = pal["accent"], pal["ink"], pal["soft"]
    light = "#FFFFFF"
    u = s / 100.0

    def X(v):
        return x + v * u

    def Y(v):
        return y + v * u

    def circ(cx, cy, r, fill):
        d.ellipse([X(cx - r), Y(cy - r), X(cx + r), Y(cy + r)], fill=fill)

    def box(x0, y0, x1, y1, fill, rad=0):
        if rad:
            rr(d, [X(x0), Y(y0), X(x1), Y(y1)], int(rad * u), fill=fill)
        else:
            d.rectangle([X(x0), Y(y0), X(x1), Y(y1)], fill=fill)

    def poly(pts, fill):
        d.polygon([(X(px), Y(py)) for px, py in pts], fill=fill)

    def ln(x0, y0, x1, y1, fill, w=6):
        d.line([X(x0), Y(y0), X(x1), Y(y1)], fill=fill, width=max(2, int(w * u)))

    n = name

    if n == "chai":
        box(20, 40, 68, 80, light, 10)
        box(24, 44, 64, 62, a)
        d.arc([X(62), Y(46), X(88), Y(72)], -80, 80, fill=light, width=max(3, int(7 * u)))
        box(12, 80, 80, 88, ink, 6)
        for i, sx in enumerate((30, 44, 58)):
            d.arc([X(sx - 6), Y(12 + i % 2 * 2), X(sx + 6), Y(36)], 200, 340, fill=soft, width=max(2, int(5 * u)))
    elif n == "box":
        poly([(14, 40), (50, 26), (86, 40), (50, 54)], soft)
        poly([(14, 40), (50, 54), (50, 90), (14, 74)], a)
        poly([(86, 40), (50, 54), (50, 90), (86, 74)], ink)
    elif n == "bag":
        box(20, 36, 80, 90, a, 10)
        d.arc([X(34), Y(16), X(66), Y(52)], 180, 360, fill=ink, width=max(3, int(8 * u)))
        box(20, 36, 80, 46, ink, 6)
    elif n == "radar":
        for r, col in ((40, soft), (27, a), (14, ink)):
            d.ellipse([X(50 - r), Y(50 - r), X(50 + r), Y(50 + r)], outline=col, width=max(3, int(7 * u)))
        circ(50, 50, 5, ink)
    elif n == "bulb":
        circ(50, 42, 27, a)
        circ(50, 42, 19, light)
        box(38, 66, 62, 76, ink, 4)
        box(42, 78, 58, 88, ink, 4)
    elif n == "bottle":
        box(42, 12, 58, 30, soft, 4)
        poly([(42, 30), (58, 30), (70, 48), (70, 88), (30, 88), (30, 48)], a)
        box(34, 56, 66, 78, light, 6)
    elif n == "trophy":
        poly([(30, 18), (70, 18), (66, 58), (34, 58)], a)
        d.arc([X(10), Y(18), X(40), Y(48)], 90, 270, fill=soft, width=max(3, int(8 * u)))
        d.arc([X(60), Y(18), X(90), Y(48)], 270, 90, fill=soft, width=max(3, int(8 * u)))
        box(44, 58, 56, 76, ink)
        box(30, 76, 70, 88, ink, 5)
    elif n == "chair":
        box(28, 14, 72, 58, a, 8)
        box(22, 58, 78, 70, ink, 6)
        box(26, 70, 34, 92, ink, 4)
        box(66, 70, 74, 92, ink, 4)
    elif n == "leaf":
        poly([(50, 12), (86, 46), (50, 90), (16, 46)], a)
        ln(50, 20, 50, 84, light, 5)
    elif n == "plate":
        circ(50, 52, 38, light)
        circ(50, 52, 28, soft)
        box(12, 26, 18, 78, ink, 3)
        box(82, 26, 88, 78, ink, 3)
    elif n == "clock":
        circ(50, 50, 40, light)
        d.ellipse([X(10), Y(10), X(90), Y(90)], outline=ink, width=max(3, int(8 * u)))
        ln(50, 50, 50, 26, a, 7)
        ln(50, 50, 70, 58, ink, 6)
    elif n == "battery":
        box(12, 34, 80, 70, ink, 8)
        box(18, 40, 40, 64, a, 4)
        box(82, 46, 90, 58, ink, 3)
    elif n == "pin":
        poly([(50, 92), (22, 46), (78, 46)], a)
        circ(50, 40, 30, a)
        circ(50, 40, 14, light)
    elif n == "laptop":
        box(20, 22, 80, 64, ink, 6)
        box(25, 27, 75, 59, soft)
        box(10, 66, 90, 76, a, 5)
    elif n == "moon":
        circ(52, 50, 38, soft)
        circ(68, 40, 32, None)
        d.ellipse([X(36), Y(8), X(100), Y(72)], fill=None)
        # crescent via overlay of bg-coloured circle
        circ(70, 38, 32, pal["bg"][1])
        circ(24, 22, 4, soft)
        circ(18, 74, 5, soft)
    elif n == "doc":
        box(24, 12, 76, 90, light, 6)
        for i in range(5):
            box(34, 28 + i * 12, 66 if i % 2 == 0 else 56, 33 + i * 12, soft if i else a, 3)
    elif n == "people":
        circ(34, 34, 15, a)
        circ(66, 34, 15, ink)
        d.pieslice([X(12), Y(50), X(56), Y(96)], 180, 360, fill=a)
        d.pieslice([X(44), Y(50), X(88), Y(96)], 180, 360, fill=ink)
    elif n == "phone":
        box(28, 8, 72, 92, ink, 10)
        box(33, 18, 67, 80, soft, 4)
        circ(50, 86, 4, soft)
    elif n in ("dog", "monkey"):
        big = n == "monkey"
        circ(24, 34, 18 if not big else 20, soft)
        circ(76, 34, 18 if not big else 20, soft)
        circ(50, 54, 34, a)
        circ(38, 48, 5, ink)
        circ(62, 48, 5, ink)
        circ(50, 62, 7, ink)
        d.arc([X(36), Y(60), X(64), Y(80)], 20, 160, fill=ink, width=max(3, int(6 * u)))
    elif n == "cat":
        poly([(18, 44), (26, 10), (46, 30)], a)
        poly([(82, 44), (74, 10), (54, 30)], a)
        circ(50, 56, 32, a)
        circ(38, 50, 5, ink)
        circ(62, 50, 5, ink)
        poly([(46, 60), (54, 60), (50, 66)], ink)
        for sx in (14, 86):
            ln(sx, 58, 50 + (sx - 50) * 0.35, 60, ink, 4)
    elif n == "cow":
        poly([(14, 34), (30, 18), (34, 40)], soft)
        poly([(86, 34), (70, 18), (66, 40)], soft)
        circ(50, 52, 34, a)
        circ(38, 46, 5, ink)
        circ(62, 46, 5, ink)
        d.ellipse([X(32), Y(58), X(68), Y(84)], fill=light)
        circ(42, 70, 4, ink)
        circ(58, 70, 4, ink)
    elif n == "bird":
        circ(46, 50, 30, ink)
        poly([(74, 46), (94, 52), (74, 58)], a)
        poly([(30, 46), (58, 52), (34, 68)], soft)
        circ(56, 40, 4, light)
    elif n == "diya":
        poly([(50, 14), (60, 40), (40, 40)], "#FFD24D")
        poly([(50, 22), (56, 40), (44, 40)], "#FF7A18")
        d.pieslice([X(16), Y(40), X(84), Y(88)], 0, 180, fill=a)
        box(10, 60, 90, 68, ink, 4)
    elif n == "sweet":
        circ(50, 54, 32, a)
        for dx, dy in ((-12, -10), (10, -14), (0, 6), (14, 8), (-14, 10)):
            circ(50 + dx, 54 + dy, 5, soft)
        box(14, 84, 86, 92, ink, 4)
    elif n == "colors":
        circ(36, 40, 24, a)
        circ(64, 40, 24, soft)
        circ(50, 66, 24, ink)
    elif n == "gift":
        box(16, 40, 84, 90, a, 8)
        box(16, 34, 84, 50, ink, 6)
        box(44, 34, 56, 90, soft)
        poly([(50, 34), (30, 14), (50, 24)], ink)
        poly([(50, 34), (70, 14), (50, 24)], ink)
    elif n == "sparkle":
        poly([(50, 6), (60, 42), (96, 52), (60, 62), (50, 98), (40, 62), (4, 52), (40, 42)], a)
        circ(80, 20, 7, soft)
    elif n == "kite":
        poly([(50, 8), (86, 46), (50, 92), (14, 46)], a)
        ln(50, 8, 50, 92, light, 4)
        ln(14, 46, 86, 46, light, 4)
        d.arc([X(30), Y(88), X(70), Y(128)], 200, 340, fill=ink, width=max(2, int(5 * u)))
    elif n == "heart":
        circ(34, 38, 22, a)
        circ(66, 38, 22, a)
        poly([(12, 44), (88, 44), (50, 92)], a)
    elif n == "chart":
        box(14, 60, 32, 90, soft, 4)
        box(40, 38, 58, 90, a, 4)
        box(66, 18, 84, 90, ink, 4)
    elif n == "mic":
        box(38, 10, 62, 58, a, 12)
        d.arc([X(26), Y(30), X(74), Y(76)], 0, 180, fill=ink, width=max(3, int(7 * u)))
        box(46, 72, 54, 88, ink, 3)
        box(32, 88, 68, 94, ink, 3)
    elif n == "printer":
        box(26, 12, 74, 34, soft, 4)
        box(12, 34, 88, 68, a, 8)
        box(26, 62, 74, 92, light, 4)
        for i in range(3):
            box(34, 70 + i * 8, 66, 74 + i * 8, soft, 2)
    elif n == "money":
        box(10, 28, 90, 76, a, 8)
        circ(50, 52, 16, light)
        box(18, 36, 24, 68, soft, 3)
        box(76, 36, 82, 68, soft, 3)
    elif n == "pencil":
        poly([(20, 84), (28, 58), (72, 14), (86, 28), (42, 72)], a)
        poly([(20, 84), (28, 58), (42, 72)], soft)
        poly([(20, 84), (32, 80), (24, 72)], ink)
    elif n == "book":
        box(18, 18, 82, 86, a, 6)
        box(46, 18, 54, 86, ink)
        box(24, 28, 44, 34, soft, 3)
        box(56, 28, 76, 34, soft, 3)
    elif n == "tiffin":
        for i, col in enumerate((soft, a, soft)):
            box(20, 34 + i * 18, 80, 50 + i * 18, col, 6)
        box(14, 28, 86, 36, ink, 4)
        d.arc([X(36), Y(6), X(64), Y(34)], 180, 360, fill=ink, width=max(3, int(7 * u)))
    elif n == "sun":
        circ(50, 50, 24, a)
        for i in range(8):
            ang = i * math.pi / 4
            ln(50 + math.cos(ang) * 34, 50 + math.sin(ang) * 34,
               50 + math.cos(ang) * 46, 50 + math.sin(ang) * 46, a, 7)
    elif n == "wifi":
        for r, col in ((44, soft), (30, a), (16, ink)):
            d.arc([X(50 - r), Y(50 - r + 10), X(50 + r), Y(50 + r + 10)], 200, 340, fill=col,
                  width=max(3, int(9 * u)))
        circ(50, 74, 6, ink)
    else:
        circ(50, 50, 34, a)


# ---------------------------------------------------------------- text
def fit_lines(d, lines, fpath, max_w, start, min_size=28, step=2):
    """Largest font size at which every line fits max_w."""
    size = start
    while size > min_size:
        f = font(fpath, size)
        if all(text_w(d, ln, f) <= max_w for ln in lines):
            return f
        size -= step
    return font(fpath, min_size)


def wrap(d, s, f, max_w):
    words, out, cur = s.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if text_w(d, t, f) <= max_w or not cur:
            cur = t
        else:
            out.append(cur)
            cur = w
    if cur:
        out.append(cur)
    return out


def draw_lines(d, lines, f, cx, top, fill, lh=1.14, align="center", shadow=None):
    asc, desc = f.getmetrics()
    step = int((asc + desc) * lh)
    y = top
    for ln in lines:
        w = text_w(d, ln, f)
        x = cx - w / 2 if align == "center" else cx
        if shadow:
            d.text((x + 3, y + 3), ln, font=f, fill=shadow)
        d.text((x, y), ln, font=f, fill=fill)
        y += step
    return y


def watermark(d, pal, w, h):
    f = font(F_MED, 27)
    s = "JokeMasti.com"
    tw = text_w(d, s, f)
    x, y = w - tw - 46, h - 62
    rr(d, [x - 20, y - 11, x + tw + 20, y + 45], 28, fill=mix(pal["band"], pal["bg"][1], 0.18))
    d.text((x, y), s, font=f, fill=mix("#FFFFFF", pal["bg"][0], 0.25))


# ---------------------------------------------------------------- templates
def t_classic(img, d, art, pal):
    top, bottom = art.get("top", ""), art.get("bottom", "")
    margin = 64
    maxw = W - margin * 2

    ftop = fit_lines(d, wrap(d, top, font(F_BOLD, 62), maxw), F_BOLD, maxw, 62, 34)
    tl = wrap(d, top, ftop, maxw)
    fbot = fit_lines(d, wrap(d, bottom, font(F_BOLD, 62), maxw), F_BOLD, maxw, 62, 34)
    bl = wrap(d, bottom, fbot, maxw)

    band_h = 40 + len(tl) * int(sum(ftop.getmetrics()) * 1.12)
    d.rectangle([0, 0, W, band_h], fill=hx(pal["band"]))
    draw_lines(d, tl, ftop, W / 2, 24, "#FFFFFF")

    bband_h = 40 + len(bl) * int(sum(fbot.getmetrics()) * 1.12)
    d.rectangle([0, H - bband_h, W, H], fill=hx(pal["band"]))
    draw_lines(d, bl, fbot, W / 2, H - bband_h + 22, "#FFFFFF")

    # centre art
    cy = (band_h + (H - bband_h)) / 2
    s = 430
    circ_r = 250
    d.ellipse([W / 2 - circ_r, cy - circ_r, W / 2 + circ_r, cy + circ_r], fill=hx(pal["soft"]))
    icon(art.get("icon", "sparkle"), d, W / 2 - s / 2, cy - s / 2, s, pal)


def t_quote(img, d, art, pal):
    lines = art.get("lines", [])
    footer = art.get("footer", "")
    margin = 70
    maxw = W - margin * 2

    s = 230
    d.ellipse([W / 2 - 160, 118, W / 2 + 160, 438], fill=hx(pal["soft"]))
    icon(art.get("icon", "sparkle"), d, W / 2 - s / 2, 278 - s / 2 + 0, s, pal)

    f = fit_lines(d, lines, F_BOLD, maxw, 96, 40)
    block_h = len(lines) * int(sum(f.getmetrics()) * 1.1)
    top = 520 + max(0, (300 - block_h) // 2)
    draw_lines(d, lines, f, W / 2, top, hx(pal["ink"]), lh=1.1)

    if footer:
        ff = font(F_MED, 36)
        fl = wrap(d, footer, ff, maxw)
        fy = H - 190 - (len(fl) - 1) * 46
        d.rounded_rectangle([margin - 14, fy - 24, W - margin + 14, fy + len(fl) * 46 + 14],
                            radius=28, fill=hx(pal["band"]))
        draw_lines(d, fl, ff, W / 2, fy - 6, "#FFFFFF", lh=1.15)


def t_twopanel(img, d, art, pal):
    panels = art.get("panels", [])[:2]
    half = H // 2
    margin = 58
    maxw = W - margin * 2 - 210

    for i, p in enumerate(panels):
        y0 = i * half
        if i == 1:
            d.rectangle([0, y0, W, H], fill=mix(pal["bg"][1], "#000000", 0.10))
        d.line([0, half, W, half], fill=hx(pal["band"]), width=6)

        s = 210
        cx, ccy = W - 168, y0 + half / 2
        d.ellipse([cx - 132, ccy - 132, cx + 132, ccy + 132], fill=hx(pal["soft"]))
        icon(art.get("icon", "sparkle"), d, cx - s / 2, ccy - s / 2, s, pal)

        lf = font(F_BOLD, 46)
        label = p.get("label", "")
        lw = text_w(d, label, lf)
        d.rounded_rectangle([margin, y0 + 96, margin + lw + 44, y0 + 96 + 74], radius=22,
                            fill=hx(pal["band"]))
        d.text((margin + 22, y0 + 108), label, font=lf, fill="#FFFFFF")

        cf = fit_lines(d, wrap(d, p.get("caption", ""), font(F_BOLD, 56), maxw), F_BOLD, maxw, 56, 30)
        cl = wrap(d, p.get("caption", ""), cf, maxw)
        draw_lines(d, cl, cf, margin, y0 + 208, hx(pal["ink"]), lh=1.14, align="left")


def t_convo(img, d, art, pal):
    msgs = art.get("messages", [])[:5]
    margin = 62
    bubble_max = W - margin * 2 - 150
    f = font(F_MED, 42)

    hdr = font(F_BOLD, 44)
    d.rounded_rectangle([margin, 70, W - margin, 168], radius=28, fill=hx(pal["band"]))
    s = 64
    icon(art.get("icon", "phone"), d, margin + 24, 86, s, {**pal, "accent": "#FFFFFF", "ink": "#FFFFFF",
                                                           "soft": mix(pal["band"], "#FFFFFF", 0.35),
                                                           "bg": pal["bg"]})
    d.text((margin + 116, 96), "JokeMasti Chat", font=hdr, fill="#FFFFFF")

    y = 210
    for m in msgs:
        right = m.get("side") == "right"
        lines = wrap(d, m.get("text", ""), f, bubble_max - 60)
        bw = max(text_w(d, ln, f) for ln in lines) + 60
        bh = len(lines) * int(sum(f.getmetrics()) * 1.14) + 42
        x0 = W - margin - bw if right else margin
        fill = hx(pal["accent"]) if right else (255, 255, 255)
        txt = "#FFFFFF" if right else hx(pal["ink"])
        d.rounded_rectangle([x0, y, x0 + bw, y + bh], radius=34, fill=fill)
        draw_lines(d, lines, f, x0 + 30, y + 20, txt, lh=1.14, align="left")
        y += bh + 26
        if y > H - 260:
            break


TEMPLATES = {"classic": t_classic, "quote": t_quote, "twopanel": t_twopanel, "convo": t_convo}


def render(meme):
    art = meme["art"]
    pal = PALETTES.get(art.get("palette"), PALETTES["mango"])
    img = gradient((W, H), *pal["bg"]).convert("RGB")
    d = ImageDraw.Draw(img)

    # subtle decorative confetti (deterministic from slug)
    seed = sum(ord(c) for c in meme["slug"])
    for i in range(14):
        a = (seed * (i + 3) * 37) % 1000 / 1000.0
        b = (seed * (i + 7) * 53) % 1000 / 1000.0
        r = 8 + ((seed + i * 13) % 16)
        cx, cy = a * W, b * H
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=mix(pal["bg"][0], pal["bg"][1], 0.5))

    TEMPLATES[art.get("template", "classic")](img, d, art, pal)
    watermark(d, pal, W, H)

    os.makedirs(OUT, exist_ok=True)
    full = os.path.join(OUT, meme["slug"] + ".webp")
    img.save(full, "WEBP", quality=82, method=6)
    img.resize(THUMB, Image.LANCZOS).save(
        os.path.join(OUT, meme["slug"] + "-thumb.webp"), "WEBP", quality=78, method=6)
    return full


# ---------------------------------------------------------------- brand assets
def brand_icon(size, maskable=False):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = int(size * 0.14) if maskable else 0
    inner = size - pad * 2
    g = gradient((inner, inner), "#FF8A4C", "#DB4410").convert("RGBA")
    mask = Image.new("L", (inner, inner), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, inner, inner],
                                           radius=int(inner * (0.5 if maskable else 0.24)), fill=255)
    img.paste(g, (pad, pad), mask)

    d = ImageDraw.Draw(img)
    cx = cy = size / 2
    r = inner * 0.30
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(255, 255, 255, 255), width=max(2, int(inner * 0.055)))
    er = inner * 0.035
    for ex in (cx - r * 0.40, cx + r * 0.40):
        d.ellipse([ex - er, cy - r * 0.34 - er, ex + er, cy - r * 0.34 + er], fill=(255, 255, 255, 255))
    d.arc([cx - r * 0.60, cy - r * 0.25, cx + r * 0.60, cy + r * 0.70], 15, 165,
          fill=(255, 255, 255, 255), width=max(2, int(inner * 0.06)))
    return img


def write_brand():
    os.makedirs(ICON_OUT, exist_ok=True)
    for s in (192, 512):
        brand_icon(s).save(os.path.join(ICON_OUT, "icon-%d.png" % s))
    brand_icon(512, maskable=True).save(os.path.join(ICON_OUT, "icon-maskable-512.png"))
    brand_icon(180).save(os.path.join(ICON_OUT, "apple-touch-icon.png"))
    brand_icon(64).resize((32, 32), Image.LANCZOS).save(os.path.join(ICON_OUT, "favicon-32.png"))

    # default OG image 1200x630
    img = gradient((1200, 630), "#FFE7B8", "#FF8A4C").convert("RGB")
    d = ImageDraw.Draw(img)
    for i in range(16):
        r = 10 + (i * 17) % 26
        cx, cy = (i * 173) % 1200, (i * 311) % 630
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=mix("#FFE7B8", "#FF8A4C", 0.45))
    logo = brand_icon(150)
    img.paste(logo, (86, 100), logo)
    d.text((262, 118), "JokeMasti", font=font(F_BOLD, 88), fill=hx("#3A2408"))
    d.text((266, 216), "Hasi Ka Daily Dose!", font=font(F_MED, 44), fill=hx("#7A3B10"))
    d.text((88, 330), "Hindi Jokes  •  Festival Wishes  •  WhatsApp Status", font=font(F_BOLD, 52),
           fill=hx("#3A2408"))
    d.rounded_rectangle([88, 440, 560, 536], radius=48, fill=hx("#2A1A06"))
    d.text((130, 462), "jokemasti.com", font=font(F_BOLD, 48), fill="#FFFFFF")
    img.save(os.path.join(ICON_OUT, "og-default.jpg"), "JPEG", quality=86, optimize=True)


def main():
    with open(os.path.join(ROOT, "data", "memes.json"), encoding="utf-8") as fh:
        memes = json.load(fh)
    for m in memes:
        render(m)
    write_brand()
    print("Rendered %d memes + brand assets -> %s" % (len(memes), OUT))


if __name__ == "__main__":
    main()
