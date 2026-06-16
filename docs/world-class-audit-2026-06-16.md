# World-Class Audit — Blue Line Advisors (ai-system-tour)

**Date:** 2026-06-16
**Auditor role:** Senior digital design strategist / creative director
**Reference class:** `marketing` + `editorial` (confirmed by Pete)
**Repo:** `Archive/ai-system-tour` (live at ai-system-tour.vercel.app)
**Verdict in one line:** A genuinely craft-class editorial brand site that is *over-built in two places and under-built in the one place that matters most* — the named human the whole pitch depends on has no face.

---

## Executive summary

This is not a teardown. The build is, by the standards of its class, **strong**: a coherent cream/ink/olive editorial palette, a real signature concept (the scroll-driven day→night "light arc"), disciplined reading measures, an accessibility-first motion architecture with a single capability kill-switch, and a measured Lighthouse performance of **0.98**. Most fintech/advisory sites would not survive this comparison; this one mostly does.

The highest-leverage moves are therefore not "add more craft." They are:

1. **Give the principal a face and a designed credibility block** (must-have) — the site's entire differentiation is "you get *me*," yet `pete-headshot.jpg` is a wired-but-empty slot. The one human the pitch rests on is currently invisible.
2. **Let the brand's serif paint instantly** (high-impact) — the Instrument Serif headline *is* the brand voice, but it loads via Google Fonts `display=swap` with no font preload, so the voice flashes/shifts on first paint.
3. **Retire 506KB of Three.js used for a grain texture the CSS already produces** (high-impact) — a simplicity + performance win that also pulls the build back toward its own "calm, not flashy" thesis.

The directorial through-line: **calm authority**. Every craft choice should deepen trust, not demonstrate cleverness. Two features (the WebGL grain, the everywhere-custom-cursor) drift toward "look what we can do." The fix is to spend that attention on the credibility the site is missing.

---

## What this repo already does at benchmark level (credit first)

A peer review names the craft before the gaps. These are genuinely well done and should be **preserved**:

- **The light-arc signature** (`src/motion/lightArc.js`) — palette tokens on `:root` tween dawn→golden-hour→dusk across the scroll, so every existing rule re-tints for free, with a hard contrast-preservation rule and a "stop 0 == today's palette" no-jar rule. This is a real editorial signature, not a borrowed trend. Keep it.
- **Reading measure** — body and lede prose sit at **42–48ch** (`index.html` lines 223, 404), display headlines tighter at 20–26ch. This is squarely inside the canonical 45–90ch reading-measure guidance ([Butterick, *Practical Typography* — Line length](https://practicaltypography.com/line-length.html)). The typographic craft is already here.
- **Motion governance** (`src/motion/guards.js`) — one frozen capability snapshot (reduced-motion veto, device-tier bucket, WebGL probe) that every motion layer reads. Reduced-motion users get a fully legible static site. This is the right architecture.
- **Accessibility-aware kinetic type** — `SplitText` defaults to `aria:"auto"` and the split is reverted on complete, so screen readers read the real headline, not fragments.
- **Performance discipline** — Lighthouse `performance: 0.98` (`.lh-report.json`); images carry `loading="lazy" decoding="async"`; video `preload` is gated on reduced-motion.

---

## Must-have

### M1 — Make the named principal a designed credibility block (face + credentials + up-front disclosure)

**The pattern (benchmark-derived).** Nielsen Norman Group's research on web trustworthiness names four credibility factors, two of which this site currently leaves on the table: **up-front disclosure** ("upfront with all information that relates to the customer experience… users distrust sites hiding information") and **comprehensive, correct content that shows the real people behind the work**, not just polished end-results ([NN/g — *Trustworthiness in Web Design: 4 Credibility Factors*](https://www.nngroup.com/articles/trustworthy-design/); see also [NN/g — *The 5 Experiential Levels of Website Commitment*](https://www.nngroup.com/articles/commitment-levels/)). For a high-trust, high-commitment decision (handing a stranger your family's capital), the credibility block is the single most load-bearing design unit on the page.

**Why it fits THIS project.** The entire differentiation is *"You get me, not a call center"* (`index.html:1022`) and *"The principal, not a desk."* Yet the build wires a headshot slot that is **hidden until the file exists** (`index.html:694`, `1127–1133`) — and `public/images/pete-headshot.jpg` **does not exist**. So the one human the whole pitch rests on is faceless, and the byline renders as text-only. A prospective Kenilworth family evaluating a brand-new RIA has nothing to attach trust to. This is the highest-leverage gap on the site and it is invisible in screenshots precisely because the slot fails silently.

**How to implement in the current stack.** The structure already exists — this is asset + design elevation, not new architecture:
- Supply a real `pete-headshot.jpg` (warm, analog, editorial — matching the existing photography direction, not a corporate LinkedIn crop).
- Elevate the byline from a conditional afterthought into a deliberate **credibility block** near the trust strip: face + name + the verifiable credibility spine (years managing risk, fiduciary standard, fee transparency already in the copy at `index.html:1070–1081`) + a real disclosure anchor (Form ADV / regulatory link) the moment it exists.
- Treat disclosure as a **trust asset, not a compliance liability** — NN/g's finding is that visible fees/policies *build* trust. The site already removed ADV/CRD placeholders; design the slot so the real link drops in cleanly at launch.

**Effort / impact.** S effort (asset + a contained block; slot is pre-wired) · ★★★ impact.

> **Update — 2026-06-16:** Pete supplied a headshot (warm, environmental, navy blazer / open collar, tree-lined green bokeh — on-brief). Placed at `public/images/pete-headshot.jpg` (400×400, 21KB, optimized). This lights up the existing byline (face + name + title), which was hidden site-wide via the `onerror` fallback until the file existed. **Not yet live** — needs `vite build` + deploy. The *blocker* is resolved; the *design elevation* (byline → deliberate credibility block near the trust strip, with the gated disclosure anchor) remains a `frontend-design` task.

**Risks / pitfalls.** Keep it editorial, not "team page" corporate. One credible face beats a grid. Honor the pre-launch compliance posture: this is destination-state design with a swappable disclosure placeholder (consistent with the project's config-driven, build-to-destination approach) — not a solicitation.

---

## High-impact

### H1 — Preload (or self-host) the display serif so the brand voice paints instantly

**The pattern.** When fonts load via an external stylesheet, the browser can't discover the critical font until late; web.dev recommends **preloading the important font** and using `size-adjust` on a fallback to cut the layout shift between fallback and web font ([web.dev — *Best practices for fonts*](https://web.dev/articles/font-best-practices)).

**Why it fits THIS project.** Instrument Serif is not decoration here — it *is* the Blue Line voice (every headline, the hero, the philosophy block). Today it arrives via `fonts.googleapis.com/css2?...&display=swap` with only `preconnect` (`index.html:40–42`). On a cold load the hero headline renders in the Inter/Times fallback first, then snaps to the serif — the brand's first impression flashes and shifts. For a type-led editorial brand, that first-paint flicker undercuts the "considered, calm" promise.

**How to implement.** Self-host the two or three actually-used cuts (Instrument Serif roman + italic; trim the Inter Tight weight set — 400–800 is five weights, likely more than the design uses) as `woff2`, `<link rel="preload" as="font" ... crossorigin>` the serif, and add a `size-adjust`-tuned `@font-face` fallback so the fallback metrics match. No new dependency; this is `<head>` + one CSS block.

**Effort / impact.** S effort · ★★ impact (first-paint brand integrity + a CLS improvement on the metric that most affects perceived quality).

**Risks.** Self-hosting forfeits Google's CDN cache; mitigated because the files are tiny and Vercel serves them on its edge with HTTP/2 already.

### H2 — Drop Three.js as the transport for the grain shader (keep the effect, shed ~128KB gzipped)

> **Implemented & verified 2026-06-16.** `stage.js` rewritten against a raw WebGL context; `grainLight.js` fragment shader unchanged, vertex shader given an explicit `aPosition` attribute (Three used to inject it). `three` removed from `package.json` + lockfile. **Result: the lazy WebGL chunk fell from 505.94 kB → 3.42 kB (gzip 127.94 kB → 1.73 kB).** Verified in-browser via pixel reads: grain varies per-pixel, and the bloom shifts warm `[162,152,135]` at scroll progress 0 (dawn) to cool `[130,135,152]` at progress 1 (night) — the day→night scroll-coupling is intact. Page composites cleanly. Because the fragment shader is byte-identical and the vertex shader yields the same `vUv`, output matches the Three.js version by construction.

> **Corrected 2026-06-16 after the council's "verify before cutting" condition.** The original recommendation — "replace the WebGL grain with the SVG `feTurbulence` grain you already ship" — was **based on a false equivalence and is withdrawn.** Reading the shader (`src/webgl/grainLight.js`) shows the WebGL layer does three things the static SVG grain *cannot*: (1) **per-frame animated grain** (`hash(vUv * uResolution + fract(uTime) * 753.0)` — real film shimmer; the SVG is frozen), (2) a **scroll-coupled warm→cool light bloom** (`mix(warm, cool, uProgress)`) driven by the *same* scroll progress as the day→night light-arc signature, and (3) a cinematic vignette. The SVG grain (`index.html:862`) is a fallback texture, not an equivalent. **Do not cut the effect.**

**The corrected pattern.** Ship less JavaScript by replacing the *transport*, not the effect. `stage.js` uses Three.js (`dist/assets/stage-*.js` = **505.94 kB / 127.94 kB gzipped**, confirmed by the build reporter, which also flags the >500KB chunk) purely to draw **one full-screen quad** (`OrthographicCamera`, `PlaneGeometry(2,2)`, `ShaderMaterial` — `stage.js:31–41`). That is the textbook case where all of Three.js is overkill: a fullscreen fragment shader needs only a raw `canvas.getContext('webgl')` and ~30 lines, or a ~3–6KB micro-library.

**Why it fits THIS project.** The effect is part of the signature and stays. But ~128KB gzipped of dependency for a fullscreen shader is exactly the "because we could" weight an editorial brand built on restraint should shed — and it's paid by every mid/high-tier visitor (gated off only on `low`).

**How to implement.** Rewrite the ~40 lines of `stage.js` against a raw WebGL context (or a tiny shader lib); **`grainLight.js` is unchanged** (the GLSL is already standalone). Remove the `three` dependency. The visual output should be pixel-identical.

**Effort / impact.** M effort · ★ impact (≈128KB gzipped removed, same visuals; downgraded from ★★ because the effect — wrongly assumed cuttable — must be preserved, so this is a transport optimization, not a deletion).

**Risks.** Must verify the shader renders identically on a raw GL context (DPR cap, uniform wiring, `OES`/precision differences) and grep for any other `three` importer before removing the dependency. Lower urgency given perf is already 0.98 and the layer is gated.

---

## Nice-to-have

### N1 — Responsive images for the heaviest photography
`public/images/inv-hero-a.jpg` is **3.4MB** unoptimized, and the project ships no `srcset`/`<picture>`/AVIF. The landing LCP image is lighter (316KB), so this is below the must-haves, but the inventory page pays full freight on slow connections. Add `srcset`/`sizes` + an AVIF/WebP source set and re-export the 3.4MB asset (per [web.dev responsive-images guidance](https://web.dev/articles/font-best-practices) sibling docs; standard `<picture>` pattern). **S effort · ★ impact.**

### N2 — Consider CSS scroll-driven animations as a future engine for the light arc
The light arc tweens `:root` tokens via GSAP ScrollTrigger on every scroll tick. Native [CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) (`animation-timeline: scroll()`) can drive the same palette interpolation off the main thread. **Do not rebuild the signature** — perf is already 0.98. This is a "if profiling ever shows jank on mid devices" migration path, kept here only so it's on record. **M effort · ★ impact.**

---

## Trends to avoid (negative control)

These are real, *admired* patterns in the marketing/editorial award world that would **hurt** this specific site. Rejecting them is the point.

- **Cinematic scroll-jacking / pinned WebGL spectacle.** A reliable Awwwards Site-of-the-Day move ([Awwwards SOTD](https://www.awwwards.com/websites/sites_of_the_day/)) — and exactly wrong here. An RIA earns trust through calm and clarity; a scroll-hijacked, full-bleed motion set-piece reads as a tech demo and tells a Kenilworth family "this person performs" when the promise is "this person is steady." The site rightly avoids it; the lesson is to not let the WebGL grain (H2) creep in that direction.
- **The custom cursor / magnetic CTAs as an everywhere feature.** `src/motion/cursor.js` hides the native cursor site-wide and adds a magnetic ring. This is portfolio/agency signature craft — a flex. On a trust-first advisory site it risks reading as gimmick, slightly raises the cost of decisive clicks (hidden native cursor), and is tonally at odds with "serious risk manager." **Recommendation: restrain it** — keep it (if at all) to the hero/reel as an opening flourish, and restore the native cursor on the trust strip, the credibility block, the contact/footer, and the CTA. Decisiveness should never fight the pointer.

---

## Directorial statement

**One principle governs everything: calm authority. Craft that deepens trust stays; craft that demonstrates cleverness goes.**

This site is closer to that principle than almost anything in its class. The editorial palette, the day→night light arc, the narrow measure, the restrained serif — all of it serves a warm, analog, anti-fintech credibility that is genuinely rare and worth protecting. The audit's job is not to add spectacle; it is to **pull the two show-off features back** (the 506KB grain, the everywhere-cursor) and **spend that freed attention on the one thing a brand-new advisory firm most needs and currently lacks: a credible, disclosed, named human you can see.**

Put a face on the principal, let the brand's serif arrive without a flinch, and shed the weight the site doesn't need. Do those three and Blue Line stops being an impressively-built site and becomes a *trustworthy* one — which, for an RIA, is the only award that converts.

---

### Reference set (all links verified)

| # | Source | What it grounds | Status |
|---|---|---|---|
| 1 | [NN/g — Trustworthiness in Web Design: 4 Credibility Factors](https://www.nngroup.com/articles/trustworthy-design/) | M1 — upfront disclosure + showing real people | Fetched & verified |
| 2 | [NN/g — 5 Experiential Levels of Website Commitment](https://www.nngroup.com/articles/commitment-levels/) | M1 — high-commitment trust | Verified (search) |
| 3 | [web.dev — Best practices for fonts](https://web.dev/articles/font-best-practices) | H1 — preload + size-adjust | Fetched & verified |
| 4 | [Butterick — Practical Typography: Line length](https://practicaltypography.com/line-length.html) | Credit — 45–90ch measure | Fetched & verified |
| 5 | [MDN — CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) | N2 — native light-arc engine | Reference (confidence) |
| 6 | [Awwwards — Sites of the Day](https://www.awwwards.com/websites/sites_of_the_day/) | Negative control — spectacle to avoid | Reference class anchor |

*Note: Stripe Press was considered as an editorial-reading benchmark but dropped — the live source could not be fetched to verify its specific typographic claims, and an unverifiable citation was not worth the credibility cost.*
