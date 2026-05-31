"""
Generate a single Veo 3.1 reel for the ai-system-tour homepage.

Usage:
    python generate-reel.py <slot-id>

Slot IDs match filenames in public/videos/: hero, story-01, story-02, story-03,
deck-a, deck-b, deck-c, deck-d.

Requires GEMINI_API_KEY in env (sourced from Laxverse/.env or wherever).
"""
import os
import sys
import time
from pathlib import Path
from google import genai
from google.genai import types

# Master style guide — prepended to every scene prompt
MASTER_BRIEF = (
    "Cinematic short reel for an independent financial advisor's website in Kenilworth, IL. "
    "Warm, analog, human aesthetic: cream paper, fountain pens, leather folios, walnut desks, "
    "marble countertops, mature elms, Tudor and Prairie homes, late-fall and winter light. "
    "NEVER show screens, dashboards, code, charts, logos, faces, or text overlays. "
    "NEVER use neon, sci-fi, glitch, holograms, or generic 'AI' tropes. "
    "Style: Kodak Portra / Vision3, 35mm or 50mm, anamorphic where noted, 24fps, "
    "shallow depth of field, observational and patient. Olive and cream-paper accents in palette. "
    "Mood: confident, unhurried, understated.\n\nScene: "
)

# Per-slot prompts and config — must match the flow-slot attributes in public/index.html
SLOTS = {
    "hero": {
        "prompt": "Cinematic slow push-in on a fountain pen drafting on cream paper at golden hour; warm North Shore window light; a soft dissolve to a candid hand sliding a printed trade rationale into a leather folio; finish on the back of an advisor walking down a tree-lined Kenilworth sidewalk past Tudor and Prairie-style homes; shallow depth of field, Kodak Portra, anamorphic, 24fps.",
        "aspect": "16:9",  # Veo doesn't support 21:9; container will crop
    },
    "beach": {
        "prompt": "A patient, almost-still cinematic wide shot looking straight out over the Lake Michigan beach at Kenilworth, Illinois at blue hour just after sunset; a broad sandy foreground in the lower third, gentle waves lapping the shore, calm open water stretching to a low horizon, the last warm band of light glowing on the water, a few bare winter trees small in the far distance; only the water and the light moving, everything else still; no people, no boats, no buildings. ABSOLUTELY NO lettering, words, signage, captions, subtitles, watermarks, or text of any kind anywhere in the frame. Kodak Portra, 35mm anamorphic, shallow depth of field, 24fps.",
        "aspect": "16:9",  # Veo doesn't support 21:9; container will crop
    },
    "story-01": {
        "prompt": "Macro on a hand-typed compliance manual at 11pm; warm desk lamp, cup of black coffee, a fountain pen in the foreground; pages turning by themselves; calm, focused, unhurried; Kodak Vision3, 35mm, no people.",
        "aspect": "9:16",  # Container crops to 4:5
    },
    "story-02": {
        "prompt": "Top-down shot of a printed trade ticket sliding across a wood desk, met by a hand with a black pen; signature in one stroke; cursor blinking on a screen in the background, blurred; quiet, deliberate, frictionless; 35mm film, anamorphic, late morning light.",
        "aspect": "9:16",
    },
    "story-03": {
        "prompt": "6:55am, Kenilworth kitchen window, pale winter light through frost; a phone face-up on a marble counter; subtle motion as a notification list scrolls in; steam rising from a coffee mug; calm, observational, no people; shallow depth of field, 50mm.",
        "aspect": "9:16",
    },
    "deck-a": {
        "prompt": "Wide tracking shot down a quiet Kenilworth side street at dawn, autumn leaves on the sidewalk, mature elms arching overhead, historic homes set back from the road, soft fog; one second-floor window glowing warm; cinematic, melancholy but hopeful; 35mm.",
        "aspect": "9:16",
    },
    "deck-b": {
        "prompt": "Hands shuffling printed quarterly statements on a walnut desk; sunlight in slats from venetian blinds; the rhythm of paper, no UI; warm and analog; macro, 50mm, very shallow depth of field.",
        "aspect": "9:16",
    },
    "deck-c": {
        "prompt": "A laptop screen reflected in a coffee shop window, abstracted into bokeh; a pulled focus reveals snow falling outside; no readable text on screen, only the reflection of falling snow; cinematic, contemplative; 35mm anamorphic.",
        "aspect": "9:16",
    },
    "deck-d": {
        "prompt": "A handshake across a kitchen table, two coffee cups, soft afternoon light through linen curtains; only the hands are visible; warm, fiduciary, human; documentary feel; 35mm, 24fps.",
        "aspect": "9:16",
    },
}


def generate(slot_id: str, model: str = "veo-3.1-fast-generate-preview"):
    if slot_id not in SLOTS:
        print(f"ERROR: unknown slot '{slot_id}'. Valid: {', '.join(SLOTS.keys())}")
        sys.exit(1)

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set in env")
        sys.exit(1)

    slot = SLOTS[slot_id]
    full_prompt = MASTER_BRIEF + slot["prompt"]
    out_path = Path(__file__).parent.parent / "public" / "videos" / f"{slot_id}.mp4"

    print(f"[{slot_id}] model: {model}")
    print(f"[{slot_id}] aspect: {slot['aspect']}")
    print(f"[{slot_id}] output: {out_path}")
    print(f"[{slot_id}] prompt: {slot['prompt'][:80]}...")
    print()

    client = genai.Client(api_key=api_key)

    print(f"[{slot_id}] starting generation...")
    operation = client.models.generate_videos(
        model=model,
        prompt=full_prompt,
        config=types.GenerateVideosConfig(
            aspect_ratio=slot["aspect"],
            number_of_videos=1,
        ),
    )

    print(f"[{slot_id}] operation started: {operation.name}")
    print(f"[{slot_id}] polling for completion (typically 1-3 min)...")

    poll_count = 0
    while not operation.done:
        time.sleep(10)
        poll_count += 1
        operation = client.operations.get(operation)
        print(f"[{slot_id}]   poll #{poll_count} ({poll_count*10}s elapsed)")
        if poll_count > 60:  # 10 minute cap
            print(f"[{slot_id}] ERROR: generation timed out after 10 minutes")
            sys.exit(1)

    if not operation.response or not operation.response.generated_videos:
        print(f"[{slot_id}] ERROR: operation completed but no video returned")
        print(f"[{slot_id}] operation: {operation}")
        sys.exit(1)

    generated_video = operation.response.generated_videos[0]
    print(f"[{slot_id}] generation complete — downloading...")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    client.files.download(file=generated_video.video)
    generated_video.video.save(str(out_path))

    size_mb = out_path.stat().st_size / (1024 * 1024)
    print(f"[{slot_id}] SAVED: {out_path} ({size_mb:.2f} MB)")
    return out_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate-reel.py <slot-id>")
        print(f"Slots: {', '.join(SLOTS.keys())}")
        sys.exit(1)
    generate(sys.argv[1])
