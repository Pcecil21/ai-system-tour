"""
Generate two "more commanding" hero-image candidates for the Under the Hood (inventory) page.

GEMINI_API_KEY is read from the environment at run time (loaded from Laxverse/.env by the
shell) — never hard-coded. Both candidates are warm and cream-compatible so the inventory
hero's existing dark headline still reads over the cream gradient. Saved to public/images/.
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
    "inv-hero-a.jpg": (
        "A photorealistic, cinematic wide photograph: a grand historic North Shore estate on "
        "Lake Michigan at golden hour — stately architecture, mature trees, long warm shadows, "
        "a dramatic layered sky. Premium and commanding, with generous calm sky in the upper "
        "portion for a text overlay. Shot on Kodak Portra, 35mm, anamorphic, warm muted "
        "cream-and-olive tonality, subtle film grain. No text, no people, no logos."
    ),
    "inv-hero-b.jpg": (
        "A photorealistic, cinematic photograph: the interior of a grand wood-paneled study and "
        "library at golden hour — tall shelves of books, a large partner's desk, warm lamplight, "
        "a shaft of window light with floating dust motes. Premium, contemplative, the 'engine "
        "room' of a serious practice, with a calm area for a text overlay. Shot on Kodak Portra, "
        "35mm, anamorphic, shallow depth of field, warm cream-and-olive tonality, subtle film "
        "grain. No text, no people, no logos."
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
