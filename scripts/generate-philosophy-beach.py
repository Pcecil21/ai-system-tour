"""
Generate a Kenilworth-beach background for the Philosophy section.

The Philosophy quote is signed "Kenilworth, IL · 2026" and currently sits over the
man-at-window image (hero-client-b.jpg). This swaps in an actual Lake Michigan beach
at Kenilworth so the place-line and the image agree.

It renders UNDER a heavy dark olive-black gradient (74%/60%/80%), so the image is read
as atmosphere, not detail — it wants tonal richness and a calm horizon, not bright sky.
Same Kodak-Portra / cream-olive treatment as the rest of the site so it sits in-palette.

GEMINI_API_KEY is read from the environment at run time (loaded from Laxverse/.env by the
shell that invokes this) — never hard-coded. Saved to public/images/.
"""
import os
import sys

from google import genai
from google.genai import types

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    sys.exit("GEMINI_API_KEY not set in environment — aborting (nothing printed).")

OUT_DIR = r"C:\Users\pceci\Claude\Projects\Archive\ai-system-tour\public\images"

CANDIDATES = {
    "philosophy-beach.jpg": (
        "A photorealistic, cinematic wide photograph: the Lake Michigan beach at "
        "Kenilworth, Illinois at the blue hour just after sunset — calm water meeting a "
        "quiet sandy shoreline, a low wooden breakwater receding into soft mist, bare "
        "winter trees along the bluff in the distance, a deep tranquil sky with the last "
        "warm band of light low on the horizon. Contemplative, premium, still. Rich "
        "shadow tonality that reads well under a dark overlay. Shot on Kodak Portra, 35mm, "
        "anamorphic, shallow depth of field, warm muted cream-and-olive tonality, subtle "
        "film grain. No text, no people, no boats, no logos, no watermarks."
    ),
}

client = genai.Client(api_key=API_KEY)

for filename, prompt in CANDIDATES.items():
    resp = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[prompt],
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"],
            image_config=types.ImageConfig(aspect_ratio="16:9", image_size="2K"),
        ),
    )
    saved = False
    for part in resp.parts:
        if getattr(part, "text", None):
            print(filename, "model note:", part.text[:200])
        elif getattr(part, "inline_data", None):
            part.as_image().save(os.path.join(OUT_DIR, filename))
            saved = True
            print("SAVED:", filename)
    if not saved:
        print("WARNING: no image returned for", filename)
