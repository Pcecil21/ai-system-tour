"""
optimize-images.py — shrink the heavy hero/about JPGs without visible quality loss.

Why: the full-bleed hero backgrounds and the about-desk photo shipped at ~2.7-3.3MB
each (near-lossless quality, 2752px wide). On cellular that's several seconds of blank
hero before the LCP paints. These images are only ever shown as backgrounds/contained
photos at <=~1480px display width, so 2400px @ quality 82 (progressive) is
indistinguishable on screen but a fraction of the bytes.

Safe to re-run: a file that's already within the width cap AND already small is treated
as previously-optimized and skipped, so re-running never re-compresses a JPEG a second
time (which would degrade quality for no size win). Originals are in git history if a
result ever looks off.

Usage:  python scripts/optimize-images.py
"""

import os
from PIL import Image, ImageOps

# (filename, max_width_px) — heroes are full-bleed (cap 2400 for high-DPI),
# the about photo is a contained <img> at most ~half the 1480px container (cap 2000).
TARGETS = [
    ("about-trading-desk.jpg", 2000),
    ("hero-client-a.jpg", 2400),
    ("hero-client-b.jpg", 2400),
    ("philosophy-beach.jpg", 2400),
    ("inv-hero-b.jpg", 2400),
]

QUALITY = 82  # visually lossless for photographic content at screen scale
# A file already within its width cap AND under this size is treated as already-optimized
# and skipped, so re-running the script can't generationally re-compress it.
ALREADY_OPTIMIZED_BYTES = 600 * 1024
IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images")


def optimize(filename, max_width):
    path = os.path.join(IMAGES_DIR, filename)
    before = os.path.getsize(path)
    img = Image.open(path)
    # Honor EXIF orientation up front: phone/camera JPEGs store rotation in metadata and
    # Pillow does NOT auto-apply it, so without this a portrait source would re-save sideways.
    img = ImageOps.exif_transpose(img)
    # Keep the color profile so a wide-gamut (P3/AdobeRGB) source isn't reinterpreted as sRGB.
    icc = img.info.get("icc_profile")
    if img.mode != "RGB":
        img = img.convert("RGB")
    w, h = img.size
    # Idempotence guard: already within the cap and already small => previously optimized.
    # Skip so a second run can't re-encode it (generational JPEG loss for no size win).
    if w <= max_width and before < ALREADY_OPTIMIZED_BYTES:
        print(f"{filename:28} {before//1024:>5}KB  (skip - already optimized)")
        return
    # Downscale only if the source is wider than we ever display it.
    if w > max_width:
        new_h = round(h * max_width / w)
        img = img.resize((max_width, new_h), Image.LANCZOS)
    # progressive + optimize give the best size for photographic JPEGs; carry the ICC profile.
    save_kwargs = {"quality": QUALITY, "optimize": True, "progressive": True}
    if icc:
        save_kwargs["icc_profile"] = icc
    img.save(path, "JPEG", **save_kwargs)
    after = os.path.getsize(path)
    pct = round((1 - after / before) * 100)
    print(f"{filename:28} {before//1024:>5}KB -> {after//1024:>4}KB  (-{pct}%)  {img.size}")


if __name__ == "__main__":
    total_before = total_after = 0
    for name, cap in TARGETS:
        p = os.path.join(IMAGES_DIR, name)
        total_before += os.path.getsize(p)
        optimize(name, cap)
        total_after += os.path.getsize(p)
    print(f"\nTOTAL: {total_before//1024}KB -> {total_after//1024}KB "
          f"(saved {(total_before - total_after)//1024}KB, "
          f"-{round((1 - total_after/total_before) * 100)}%)")
