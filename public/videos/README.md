# Video reels for the homepage

Drop the 8 Google Flow `.mp4` files into this directory using the exact filenames below. Once they're here, the `<flow-slot>` elements in `public/index.html` get a `src="/videos/<filename>"` attribute and the placeholders are replaced by the video.

---

## Master brief (paste once at the top of your Flow project)

> You are generating a series of short cinematic reels for the website of an independent financial advisor in Kenilworth, IL (Chicago's North Shore). The practice is small, fiduciary, calm, and quietly tech-forward — AI does the pattern work, the advisor does the people work. The visual world is warm, analog, and human: cream paper, fountain pens, leather folios, walnut desks, marble countertops, mature elms, Tudor and Prairie homes, late-fall and winter light. Never show screens, dashboards, code, charts, logos, faces, or text overlays. Never use neon, sci-fi, glitch, holograms, or generic "AI" tropes. Style: Kodak Portra / Vision3, 35mm or 50mm, anamorphic where noted, 24fps, shallow depth of field, observational and patient. Olive and cream-paper accents in the palette. Mood: confident, unhurried, understated.

Recommended Flow settings: **Veo 3.1**, no audio, 21:9 for the hero, 4:5 portrait for everything else.

---

## Filename map — 8 reels

### `hero.mp4` — 21:9 · 00:24 · hero reel
> Cinematic slow push-in on a fountain pen drafting on cream paper at golden hour; warm North Shore window light; a soft dissolve to a candid hand sliding a printed trade rationale into a leather folio; finish on the back of an advisor walking down a tree-lined Kenilworth sidewalk past Tudor and Prairie-style homes; shallow depth of field, Kodak Portra, anamorphic, 24fps.

### `story-01.mp4` — 4:5 · 00:08 · Story 01 (Compliance)
> Macro on a hand-typed compliance manual at 11pm; warm desk lamp, cup of black coffee, a fountain pen in the foreground; pages turning by themselves; calm, focused, unhurried; Kodak Vision3, 35mm, no people.

### `story-02.mp4` — 4:5 · 00:08 · Story 02 (Trading)
> Top-down shot of a printed trade ticket sliding across a wood desk, met by a hand with a black pen; signature in one stroke; cursor blinking on a screen in the background, blurred; quiet, deliberate, frictionless; 35mm film, anamorphic, late morning light.

### `story-03.mp4` — 4:5 · 00:08 · Story 03 (Monitoring)
> 6:55am, Kenilworth kitchen window, pale winter light through frost; a phone face-up on a marble counter; subtle motion as a notification list scrolls in; steam rising from a coffee mug; calm, observational, no people; shallow depth of field, 50mm.

### `deck-a.mp4` — 4:5 · 00:06 · Deck A (Place)
> Wide tracking shot down a quiet Kenilworth side street at dawn, autumn leaves on the sidewalk, mature elms arching overhead, historic homes set back from the road, soft fog; one second-floor window glowing warm; cinematic, melancholy but hopeful; 35mm.

### `deck-b.mp4` — 4:5 · 00:06 · Deck B (Paper)
> Hands shuffling printed quarterly statements on a walnut desk; sunlight in slats from venetian blinds; the rhythm of paper, no UI; warm and analog; macro, 50mm, very shallow DOF.

### `deck-c.mp4` — 4:5 · 00:06 · Deck C (Signal)
> A laptop screen reflected in a coffee shop window, abstracted into bokeh; a pulled focus reveals snow falling outside; no readable text on screen, only the reflection of falling snow; cinematic, contemplative; 35mm anamorphic.

### `deck-d.mp4` — 4:5 · 00:06 · Deck D (Trust)
> A handshake across a kitchen table, two coffee cups, soft afternoon light through linen curtains; only the hands are visible; warm, fiduciary, human; documentary feel; 35mm, 24fps.

---

## After all 8 files are in this directory

Tell Claude "wire the reels" and the `<flow-slot>` elements in `public/index.html` will get their `src="/videos/<filename>"` attributes. Then commit and push.

## Hosting note

These videos are served as **static assets** directly from Vercel's edge CDN — no Vercel Blob, no Cloudinary, no R2 token required. Same domain, automatic caching, no SDK. Total cost: free (within Vercel Hobby bandwidth).
