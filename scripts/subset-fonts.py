#!/usr/bin/env python3
"""Genera los .woff2 de Inter y JetBrains Mono que sirve este catálogo.

No corre en el build ni en CI: se usa una vez por versión de la fuente, a mano,
y lo que produce se commitea en `assets/fonts/`. Existe para que esos binarios
se puedan volver a hacer igual, y para que quede escrito qué traen y por qué.

Necesita fonttools y brotli (`pip install fonttools brotli`). No son
dependencias del paquete: nadie que consuma Inox UI los necesita.

    python3 scripts/subset-fonts.py <fuentes> assets/fonts

`<fuentes>` es una carpeta con las dos descargas oficiales descomprimidas:

    <fuentes>/inter/    Inter-4.1.zip          github.com/rsms/inter/releases
    <fuentes>/jbmono/   JetBrainsMono-2.304.zip github.com/JetBrains/JetBrainsMono/releases

Por qué no los archivos de Google Fonts, que es de donde salían: su subset
«latin» no trae el signo del guaraní (U+20B2) ni las letras con tilde del
idioma guaraní, y un producto que muestra precios en Paraguay dibujaba ese
signo con la fuente que tuviera cada máquina.
"""
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

UNICODES = ",".join([
    "U+0020-007E",                       # ASCII
    "U+00A0-00FF",                       # Latin-1: acentos, ñ, ¿ ¡ ° × ·
    "U+0128-0129", "U+0168-0169",        # ĩ Ĩ ũ Ũ   — guaraní
    "U+1EBC-1EBD", "U+1EF8-1EF9",        # ẽ Ẽ ỹ Ỹ   — guaraní
    "U+0131", "U+0152-0153",             # ı Œ œ
    "U+02BB-02BC", "U+02C6", "U+02DA", "U+02DC",
    "U+0300-0304", "U+0308", "U+0329",   # combinables: g̃ es g + U+0303
    "U+2000-206F",                       # – — ‘ ’ “ ” • … y espacios finos
    "U+20AC", "U+20B2",                  # € ₲
    "U+2122",                            # ™
    "U+2190-2193",                       # ← ↑ → ↓
    "U+2212", "U+2215", "U+2248",        # − ∕ ≈
    "U+2713",                            # ✓
    "U+FEFF", "U+FFFD",
])

# Las mismas features que traían los archivos anteriores: cifras tabulares y
# proporcionales, fracciones, kerning y marcas. Lo demás (variantes de estilo)
# no se usa y pesa.
INTER = "calt,ccmp,dnom,frac,locl,numr,pnum,tnum,kern,mark,mkmk"

# JetBrains Mono sale de la variante NL —sin ligaduras de programación—: un
# dato se muestra como está guardado, y `->` no es una flecha.
MONO = "ccmp,locl,mark,mkmk"

JOBS = [
    ("inter/extras/ttf/Inter-Regular.ttf",           "Inter-Regular.woff2",         INTER),
    ("inter/extras/ttf/Inter-Medium.ttf",            "Inter-Medium.woff2",          INTER),
    ("inter/extras/ttf/Inter-SemiBold.ttf",          "Inter-SemiBold.woff2",        INTER),
    ("jbmono/fonts/ttf/JetBrainsMonoNL-Regular.ttf", "JetBrainsMono-Regular.woff2", MONO),
    ("jbmono/fonts/ttf/JetBrainsMonoNL-Medium.ttf",  "JetBrainsMono-Medium.woff2",  MONO),
]


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    sources, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    for src, name, features in JOBS:
        target = os.path.join(out, name)
        subset.main([
            os.path.join(sources, src),
            f"--unicodes={UNICODES}",
            f"--layout-features={features}",
            "--flavor=woff2",
            "--name-IDs=0,1,2,3,4,5,6,13,14",   # conserva copyright y licencia
            f"--output-file={target}",
        ])
        cmap = TTFont(target).getBestCmap()
        print(f"{name:30} {os.path.getsize(target):6} B  {len(cmap)} caracteres")


if __name__ == "__main__":
    main()
