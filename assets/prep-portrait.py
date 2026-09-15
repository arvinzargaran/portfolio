#!/usr/bin/env python3
"""Turn an original photo into assets/portrait.jpg.

Usage:  python3 assets/prep-portrait.py ~/Desktop/photo.jpg

Centre-crops to a square, resizes to 640x640 (2x the 320px display box),
strips EXIF, and writes a progressive JPEG. Colour is preserved in the file
on purpose - the page desaturates in CSS, so changing your mind later is a
one-line edit rather than a re-export.
"""
import sys, pathlib
from PIL import Image, ImageOps

SIZE = 640

def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = pathlib.Path(sys.argv[1]).expanduser()
    if not src.exists():
        sys.exit(f"no such file: {src}")

    out = pathlib.Path(__file__).with_name("portrait.jpg")
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    im = ImageOps.fit(im, (SIZE, SIZE), method=Image.LANCZOS, centering=(0.5, 0.4))
    im.save(out, quality=82, optimize=True, progressive=True)
    print(f"wrote {out} ({out.stat().st_size / 1024:.0f} KB, {SIZE}x{SIZE})")

if __name__ == "__main__":
    main()
