"""
Generate the "About You" trading-desk photo for the Blue Line Advisors landing page.

The GEMINI_API_KEY is read from the environment at run time (loaded from Laxverse/.env
by the shell that invokes this) — it is never hard-coded or printed here. The script
produces a cinematic, faceless over-the-shoulder shot of a trader at a multi-monitor
desk that matches the site's cream/olive, Kodak-Portra aesthetic, and writes it to
public/images/about-trading-desk.jpg so the About section's image placeholder resolves.
"""
import os
import sys

from google import genai
from google.genai import types

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    sys.exit("GEMINI_API_KEY not set in environment — aborting (nothing printed).")

# Absolute output path — JPEG, because the Gemini image API returns JPEG bytes.
OUT = r"C:\Users\pceci\Claude\Projects\Archive\ai-system-tour\public\images\about-trading-desk.jpg"

PROMPT = (
    "A photorealistic, cinematic editorial photograph: an over-the-shoulder, "
    "three-quarter-back view of a male trader seated at a large multi-monitor "
    "trading desk — a wall of roughly sixteen to seventeen screens filled with "
    "U.S. Treasury options and interest-rate data, depth charts and order books "
    "glowing in a dark room. He is seen from behind so NO identifiable face is "
    "visible. Shot on Kodak Portra, 35mm, anamorphic lens, shallow depth of field, "
    "warm low-key lighting with amber and olive highlights against deep shadow, "
    "subtle film grain, a serious and contemplative mood — institutional but human. "
    "Quiet negative space in the composition. No text, no logos, no watermarks."
)

client = genai.Client(api_key=API_KEY)

# Default to the Pro image model per the skill guidance; 3:2 landscape to match the
# CSS aspect-ratio of the About figure, at 2K for a crisp hero-adjacent asset.
resp = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=[PROMPT],
    config=types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="3:2", image_size="2K"),
    ),
)

saved = False
for part in resp.parts:
    if getattr(part, "text", None):
        # Surface any model-side note (refusal, safety message) so failures aren't silent.
        print("model:", part.text[:300])
    elif getattr(part, "inline_data", None):
        part.as_image().save(OUT)
        saved = True
        print("SAVED:", OUT)

if not saved:
    sys.exit("No image returned by the model — see any 'model:' note above.")
