# Follow the blue line — September 7, 2026

The user approved the proposed horizon → market → family prototype after asking what creative risks we would take for an award entry. This implements that sequence on the existing site. It does not imply an award nomination, score or guarantee.

Audience: prospective founding families. Identify the adviser immediately, make his long perspective tangible, and keep a direct contact path available throughout. Preserve the original family and founder photographs, accurate practice facts, contact destinations, audited Under the hood content and existing research tools.

## Direction and review

The preceding editorial opening was polished but lacked an interaction specific to Blue Line. The new opening connects one blue line across three scenes: a quiet lake horizon, actual Treasury history, and the underline beside Pete's family photograph. The lake is conceptual artwork; the family photograph remains original. Navy, cream and cobalt connect the new opening with the existing page. Local Newsreader and DM Sans remain the type system.

On spacious desktops, normal document scrolling progresses through a sticky stage; chapter links provide direct navigation. The line moves between measured SVG positions. Phones, small viewports, enlarged content and reduced-motion settings use an ordinary vertical sequence. No scroll input is intercepted or locked. Contact remains in the sticky masthead. The original simulated research terminal remains functional inside a native disclosure below the founder letter.

Self-review followed the user's sequential task mapping. Actual Chrome and WebKit renders were checked at desktop and phone sizes, with full-page and enlarged text views. Corrections included wrapping the chart readout and statistics, moving mobile availability and controls into normal flow, and accounting for the actual sticky header height at anchor destinations. The line matches the history plot within 0.008 CSS pixels in the measured desktop renders. No independent critique or new numerical design score is claimed.

## Data

Source: Board of Governors of the Federal Reserve System, H.15, via [FRED GS10](https://fred.stlouisfed.org/series/GS10), downloaded September 7, 2026 from [FRED's observation table](https://fred.stlouisfed.org/data/GS10).

The fixed study contains 264 monthly observations, January 2004–December 2025. Units are percent; monthly averages of business days; not seasonally adjusted. It is the 10-year Treasury constant maturity yield, not bond price, portfolio performance or investment return. The window deliberately ends in December 2025. The series is public domain; the interface cites Federal Reserve/FRED. The 1-, 5- and 22-year controls select the trailing 12, 60 and 264 observations, all on the same 0–6% yield axis. Start-to-end change is in basis points. The full window starts at 4.15%, ends at 4.14%, and ranges from 0.62% to 5.11%.

Canonical observations: `src/data/treasury-history.json`. Public download: `/data/treasury-history.csv`. The source HTML table is retained outside the deployment at `../../horizon-treasury-source.txt`. Run `node scripts/update-history-fallback.mjs` after changing data/rendering. It refreshes the static accessible HTML/SVG and CSV. The pre-existing fictional terminal remains explicitly labeled and mathematically unchanged.

## Image and motion provenance

The opening is a generated still with a restrained optional WebGL texture treatment, not generated video or a photograph of a specific place. Created using the built-in image generation tool. Original PNG is saved in `design/horizon-journey-assets/lake-original.png`; deployed WebP is `public/images/long-view-lake.webp` (1672×941, 84,522 bytes). WebP encoding used ffmpeg/libwebp quality 86, without altering composition. The requested 2560×1440 output was actually returned at 1672×941.

Exact generation prompt:

> Use case: stylized-concept. Asset type: full-width cinematic website backdrop for Blue Line Advisors, an independent family financial advisory practice. Create a 2560x1440 landscape fine-art photograph-like scene of an immense freshwater lake at blue hour, seen from very low just above water, a perfectly level distant horizon at exactly 52 percent of the image height. Dark midnight navy water in the foreground with exquisitely resolved long low ripples and silver-blue highlights, restrained cobalt blue reflection near the horizon, distant faint low shoreline without recognizable landmarks. Upper half atmospheric deep blue sky fading to a very narrow luminous pale silver-blue band at the horizon, understated natural cloud texture. Beautiful quiet light, tactile water, cinematic analog film subtle grain, sophisticated editorial art direction. Keep upper left dark and calm for separately rendered white headline; middle and lower right offer delicate texture. Crop must remain convincing as a centered vertical mobile crop. No people, boats, buildings, sun disc, mountains, typography, lettering, graphs, interface, logos or watermark. This is conceptual atmospheric artwork, not a depiction of a specific real place. The water and actual horizontal horizon should be the subject, not an abstract gradient. Very controlled tonal range, luminous but not neon, no fantasy or sci-fi.

Water draws at at most about 30 frames/second, with device pixel ratio capped at 1.5. Pointer movement adds a small ripple; touch scrolling is native. A keyboard-accessible Pause water control stops the animation. Drawing stops outside the opening, when offscreen, when hidden, or with reduced motion. Image/context failures retain the still. Initial reduced-motion loading skips the WebGL enhancement. No new dependency, external media API or live market connection was added.

## Verification and continuity

47 unit tests pass, including sourced data invariants, windows, basis-point math, a consistent yield scale and morph endpoints. Browser evidence lives in `../../horizon-local-check.json` and `../../horizon-motion-local-check.json`. Before source: `../../horizon-before-source/`. The existing uncommitted work is preserved, with no commit, push or deleted asset. The production release record and final live evidence are linked from the root handoff.
