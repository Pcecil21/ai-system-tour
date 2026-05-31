"""
Animate Pete's real Kenilworth Beach moonrise photo into a short living reel.

Veo 3.1 image-to-video: the photo is the conditioning first frame, so the output keeps
the exact real scene (terrace, moonglade, the two figures) and just adds subtle motion —
shimmering reflection, gentle waves, a slow stroll. No invented content.

GEMINI_API_KEY is read from the environment at run time (loaded from Laxverse/.env by the
shell that invokes this) — never hard-coded.

Veo returns 16:9, so a portrait source comes back pillarboxed (black side bars). The
shipped clip is cropped back to clean portrait after this runs:
    ffmpeg -i public/videos/kenilworth-beach.mp4 -vf "crop=540:720:370:0" \
        -c:v libx264 -crf 22 -pix_fmt yuv420p -movflags +faststart -an \
        public/videos/kenilworth-beach-portrait.mp4
(Re-run cropdetect if the source aspect changes — the 540:720:370 box assumes a 3:4 photo.)

Usage:  python scripts/animate-beach-photo.py
"""
import os
import sys
import time
from pathlib import Path

from google import genai
from google.genai import types

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    sys.exit("GEMINI_API_KEY not set in environment — aborting.")

ROOT = Path(__file__).parent.parent
SRC = ROOT / "public" / "images" / "kenilworth-beach-src.jpg"
OUT = ROOT / "public" / "videos" / "kenilworth-beach.mp4"

# Motion-only prompt: describe what should MOVE, not the scene (the image already is the
# scene). Keep it gentle so the real photo isn't distorted.
PROMPT = (
    "Subtle, photoreal living motion on this real night photograph, locked-off camera, no "
    "zoom, no pan. The moon's golden reflection shimmers and ripples gently on the dark "
    "water; small waves roll in and break softly on the sand; the two people stroll slowly "
    "along the shoreline; a few leaves stir faintly in the lower-left foliage. Everything "
    "else stays perfectly still. Calm, quiet, cinematic; preserve the exact colors, "
    "framing, and grain of the original photo. No new objects, no text."
)


def main():
    if not SRC.exists():
        sys.exit(f"source photo not found: {SRC}")

    client = genai.Client(api_key=API_KEY)
    img = types.Image(image_bytes=SRC.read_bytes(), mime_type="image/jpeg")

    print(f"animating {SRC.name} -> {OUT.name}")
    operation = client.models.generate_videos(
        model="veo-3.1-fast-generate-preview",
        prompt=PROMPT,
        image=img,  # image-to-video conditioning
        config=types.GenerateVideosConfig(number_of_videos=1),
    )
    print(f"operation started: {operation.name}")
    print("polling (typically 1-3 min)...")

    poll = 0
    while not operation.done:
        time.sleep(10)
        poll += 1
        operation = client.operations.get(operation)
        print(f"  poll #{poll} ({poll*10}s elapsed)")
        if poll > 60:
            sys.exit("ERROR: generation timed out after 10 minutes")

    if not operation.response or not operation.response.generated_videos:
        sys.exit(f"ERROR: completed but no video returned: {operation}")

    video = operation.response.generated_videos[0]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    client.files.download(file=video.video)
    video.video.save(str(OUT))
    print(f"SAVED: {OUT} ({OUT.stat().st_size / (1024*1024):.2f} MB)")


if __name__ == "__main__":
    main()
