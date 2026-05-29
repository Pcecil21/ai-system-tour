"""
Generate two commanding hero-image candidates for the client landing page.

GEMINI_API_KEY is read from the environment at run time (loaded from Laxverse/.env by the
shell that invokes this) — never hard-coded. Both candidates are warm and cream-compatible
so they sit under the site's cream gradient overlay without fighting the editorial palette,
with a calm tonal area for the dark headline. Saved to public/images/.
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
    "hero-client-a.jpg": (
        "A photorealistic, cinematic wide landscape photograph: the Lake Michigan North "
        "Shore shoreline near Kenilworth, Illinois at golden hour — calm water, a dramatic "
        "warm sky with soft layered clouds, a quiet shoreline path and a lone mature tree. "
        "Atmospheric, premium, serene but striking. Generous calm sky in the upper portion "
        "for a text overlay. Shot on Kodak Portra, 35mm, anamorphic, shallow depth of field, "
        "warm muted cream-and-olive tonality, subtle film grain. No text, no people, no logos."
    ),
    "hero-client-b.jpg": (
        "A photorealistic, cinematic photograph: the back of a man in a dark overcoat standing "
        "at a tall window in a warm wood-paneled study at golden hour, looking out over a "
        "tree-lined North Shore street with historic homes. Contemplative, premium, no "
        "identifiable face. Shallow depth of field, warm light with cream and olive tones, "
        "calm negative space on the left for a text overlay. Shot on Kodak Portra, 35mm, "
        "anamorphic, subtle film grain. No text, no logos, no watermarks."
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
