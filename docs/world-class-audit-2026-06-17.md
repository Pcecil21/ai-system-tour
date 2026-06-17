# World-Class Audit — Blue Line Advisors (ai-system-tour)

**Date:** 2026-06-17
**Auditor role:** Senior digital design strategist / creative director
**Reference class:** `Elite RIA / private wealth` (confirmed by Pete)
**Brand posture:** `aggressive` → **bold evolution** — replace the token *system* for private-wealth gravitas, **preserve the light-arc signature concept and the credibility block** (confirmed by Pete; the "full tabula rasa" option was explicitly declined)
**Build scope:** must-have + high-impact, each verified
**Repo:** `Archive/ai-system-tour` (live at ai-system-tour.vercel.app)
**Relationship to prior audit:** This is a *second, harder pass*. The 2026-06-16 audit (`marketing` + `editorial`) is fully built and live. This audit re-judges the same site against a more demanding bar — the best private-wealth/private-bank brands — and asks a different question: not "is this good editorial craft?" (it is) but **"does this read with the gravitas of money?"**

**Verdict in one line:** A warm, craft-class editorial site that is *under-systematized and under-weighted for the room it's now competing in* — it reads as a beautiful boutique, not yet as a place you'd hand your family's capital. The fix is gravitas through **system and restraint**, not a navy transplant.

---

## Executive summary

Judged as editorial craft, this site already wins (see the 2026-06-16 audit — that verdict stands). Judged against **elite private wealth** — Lombard Odier, Pictet, the boutique-RIA top tier — three gaps separate it from the class, and none of them is "add more craft":

1. **There is no design system underneath the design** (foundations, must-build first). The tokens define a palette, a type stack, and two easing curves — and nothing else. Every headline size is an ad-hoc inline `clamp()`; there is **no type scale, no spacing unit, no radius scale, no elevation scale, no motion tokens**. Elite sites read as *expensive* precisely because of rigorous spatial and typographic rhythm. You cannot evolve toward gravitas on a loose foundation — you'd just compound the looseness across a bolder surface. So the system gets tightened first (Phase 1.5), and every recommendation below inherits it.

2. **The register is too soft and too warm to read as "private wealth."** The cream/olive palette is genuinely differentiating — it is *not* beige-corporate, and that warmth is an asset I want to protect. But on its own it reads boutique-editorial, not authority. The benchmark move (Lombard Odier) is "understated authority" through a **deep, restrained dark register and extensive whitespace** — exclusivity signaled by *space and weight*, not decoration. Blue Line needs a second, darker authority register and far more silence — **without** transplanting the cold navy-sans skin, which would erase the warmth that makes it not-generic.

3. **The accent is decorative, not disciplined.** Olive currently sprinkles across stars, dots, plus-signs, and emphasis runs. Elite financial brands spend their one accent color **only on action and meaning** (CTAs, the live data point) and let everything else be ink-on-paper. Decorative accent reads "designed"; disciplined accent reads "considered."

The directorial through-line for this pass: **the calm, expensive, one-principal alternative to both the beige mega-RIA and the cold Swiss bank.** Keep the warm soul and the light-arc signature; deepen the bones, widen the silence, discipline the accent, tighten the type.

---

## What this repo already does at benchmark level (credit first — and what is now load-bearing to preserve)

Per the brand-lock-within-aggressive posture, these are not just "good" — they are the **signature that bold evolution must carry forward, not discard**:

- **The light-arc signature** (`src/motion/lightArc.js`) — scroll-driven day→night palette tween. This is a real, ownable concept; the prior audit verified the warm→cool bloom is intact. **Preserve.** Gravitas should deepen its end-states (a richer night), never remove it.
- **The credibility block** (`index.html:1149–1189`) — face + credential spine + placeholder disclosure anchor, built 2026-06-16. This is the single most trust-load-bearing unit on the page and aligns exactly with NN/g's "show the real people / upfront disclosure" findings ([NN/g — Trustworthiness](https://www.nngroup.com/articles/trustworthy-design/), re-verified). **Preserve; only re-skin it to the new tokens.**
- **The serif voice** — Instrument Serif as the headline language. It is the warm differentiator against Lombard Odier's contemporary-sans minimalism. **Keep the face** (swapping it is the highest-risk move available and was foreclosed by the "keep signature" decision); evolve its *treatment* (scale, tracking, measure), not its identity.
- **Performance + motion governance** — Lighthouse 0.98, one frozen capability snapshot (`src/motion/guards.js`), reduced-motion fully legible. The system tightening below must not regress this.

---

## Phase 1.5 — Foundations (the system before the parts; must build first)

### F1 — Install a real design-token system (type scale, spacing scale, radius, elevation, motion)

**The gap (verified in `public/site.css`).** `:root` defines color, three font stacks, and two easing curves. That is the *entire* system. There is no `--space-*` scale, no `--text-*` type scale, no `--radius-*`, no `--elevation-*`, no `--dur-*`. Consequences visible in the code: section padding is hand-typed (`5rem`, `6rem`) per section; every display size is a bespoke inline `clamp(...)` in `index.html`/`inventory.html`; radii are ad-hoc (`999px` pills, scattered values); there is no elevation language at all.

**The principle.** A defined, named scale — rather than per-element ad-hoc values — is what produces the *perceived precision* that reads as expensive. This is settled design-system convention: a modular type scale (a fixed ratio, e.g. ~1.25, generating named roles) and an **8-point spacing grid** (all spacing a multiple of a 4/8px base) are the standard mechanisms for rhythmic consistency. The eye reads the rhythm before it reads any single component, which is why this is the highest-leverage visual move on the site.

**How to implement (brand-lock; this is systematization, not a new identity).** In `public/site.css` `:root`, add:
- `--space-1 … --space-12` on an 8px base (4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160 …) and refactor the hand-typed section paddings to the nearest token.
- `--text-xs … --text-7xl` as a modular type scale (one ratio), each a `clamp()` *defined once* — then replace the inline per-element `clamp()`s in both HTML files with the token.
- `--radius-sm/md/lg/pill`, `--elevation-0/1/2` (elevation defined as restrained, low-spread shadows — gravitas, not Material drop-shadows), `--dur-fast/base/slow` paired with the existing easings.

**Effort / impact.** M effort (mechanical refactor across two files; the values are additive, the swap is find-replace) · ★★★ impact. **This is the foundation every rec below inherits — build it first, verify nothing shifted (visual diff), then proceed.**

**Risk.** A token refactor can silently shift layout. Mitigation: introduce tokens *equal to today's effective values first* (pure no-op refactor, screenshot-identical), then tune in M1/H1. Do not combine the refactor and the re-tune in one unverifiable step.

---

## Must-have

### M1 — Add a deep "authority" register and evolve the palette for gravitas (without going generic-navy)

**The pattern (benchmark-derived, fetch-verified).** Lombard Odier's site reads as "understated authority" through **deep navy/charcoal grounds, white/light-gray type, and an accent (green) reserved for CTAs — gold/earth tones appearing only in photography, never in UI** ([lombardodier.com](https://www.lombardodier.com/home.html), fetched). Exclusivity is signaled by *darkness, weight, and space*, not by ornament. The current Blue Line palette has one register (warm cream paper) and one dark moment (the `.security` block flips to ink). Elite sites use the **dark register as a deliberate gravitas instrument**, not a one-off.

**Why it fits THIS project — and the trap to avoid.** Blue Line's warmth is its differentiation; cloning Lombard Odier's cold navy-sans would erase exactly what makes it not the beige mega-RIA. So the move is **evolution, not transplant**: keep cream/ink/olive as the warm home register, and introduce a **second, deep register** — a richer, near-black ink ground (the existing `--ink #1a1c14` deepened and warmed toward a charcoal-espresso, not a corporate navy) — used intentionally for the highest-gravitas moments (hero foot, the security/fiduciary block, the close), so the page *modulates* between warmth and authority the way the light-arc already modulates dawn→night. Deepen the light-arc's night end-state to match. Net effect: the same brand, but it now has a low, serious register it can drop into — which is what "money" sounds like.

**How to implement (in stack).** In `site.css`: deepen/warm the dark tokens; add an explicit `--register-dark` ground + its on-color set; ensure contrast preservation (the light-arc's hard contrast rule must hold at the new night end). Apply the dark register to the existing dark sections and one or two new gravitas moments — re-skinning, not re-architecting.

**Effort / impact.** M effort · ★★★ impact (this is the single change that moves the *register* from boutique to private-wealth).

**Risk.** Overshooting into cold/corporate (the thing Pete was warned about). Guardrail: it must still feel *warm and analog* in the dark — espresso/charcoal, not slate/navy. Verify side-by-side against both the current site (warmth retained?) and a generic mega-RIA (didn't we become them?).

---

## High-impact

### H1 — Expand whitespace and vertical rhythm to elite-"curated" levels (exclusivity through space)

**The pattern.** Lombard Odier's defining move is **extensive whitespace** — "substantial breathing room… the site doesn't crowd information, suggesting access itself is privileged" (fetched). Dense reads corporate; spacious reads curated. This is the cheapest gravitas available and it falls directly out of F1.

**Why it fits.** Blue Line's section rhythm (`5rem`/`6rem` paddings, multiple stats/stories packed per viewport) is *efficient editorial*, not *curated wealth*. Fewer things per screen, more silence around each, larger section breaks — the content barely changes; the *pacing* does.

**How to implement.** Once F1's `--space-*` scale exists, step the major section paddings up (e.g. `5rem` → `--space-10/11`), increase the gap around the credibility block, hero foot, and close, and let the heaviest statements stand alone. Mobile keeps tighter steps of the same scale.

**Effort / impact.** S effort (token swaps on top of F1) · ★★ impact.

**Risk.** Over-airy = thin/empty rather than luxurious. Calibrate against the benchmark, not maximally.

### H2 — Discipline the accent: olive on action and meaning only

**The pattern.** Elite financial brands reserve their single accent for **CTAs and live/meaningful data** and let the rest be ink-on-paper (Lombard Odier: "accent colors minimal—primarily greens for CTAs… never in UI elements" decoratively). Restraint reads as confidence.

**Why it fits.** Olive (`--accent #5e6b2f`) currently appears as decorative stars (`.marquee-track .star`), badge dots, the stat `+`/plus glyphs, and scattered emphasis. Each is a small "designed" tell. Pulling olive back to **CTAs, the live data point, and one deliberate editorial accent** makes the remaining olive *mean* something — and makes the page read more expensive by doing less.

**How to implement.** Audit every `var(--accent)` use in both HTML files; demote decorative ones to ink/muted; keep action + meaning. This pairs with the prior audit's cursor-restraint logic (decisiveness shouldn't be decorated).

**Effort / impact.** S effort · ★★ impact.

**Risk.** Going too monochrome and losing the warm life. Keep the *editorial* accent moments (e.g. the italic-serif emphasis) — strip the *decorative* ones.

### H3 — Typographic gravitas: a tighter display scale and deliberate measure (within the existing serif)

**The pattern.** Private-wealth typography uses **generous, confident scale hierarchies with disciplined tracking and measure** — substantial weight/scale on headers, highly legible body, no ornament (Lombard Odier, fetched; reading-measure canon per [Butterick — Line length](https://practicaltypography.com/line-length.html), verified in the prior pass).

**Why it fits — and the constraint.** Instrument Serif is a light, slightly casual display face; it is the warm signature and **stays** (swapping it was foreclosed). The gravitas gain comes not from a new font but from F1's type scale applied with intent: **bigger, more confident jumps** between display roles, **tighter display tracking** (the serif currently runs near-default), and a **deliberate measure** at each role (display 18–24ch, lede ~46ch, body 60–66ch) so the page has clear typographic command rather than even-toned editorial flow.

**How to implement.** Use F1's `--text-*` roles; set per-role `letter-spacing`/`line-height` once; widen the scale ratio for display. No font change.

**Effort / impact.** S effort (on top of F1) · ★★ impact.

**Risk.** Over-tightening hurts legibility on the delicate serif. Verify at mobile sizes.

---

## Nice-to-have (report-only this run)

### N1 — Optional: a higher-contrast display serif *pairing* for the heaviest moments
The most-aggressive lever still compatible with "keep the signature" would be to *pair* Instrument Serif with a higher-contrast didone (e.g. for the single hero word / the close) for more private-wealth heft, keeping Instrument Serif as the connective voice. **Parked, not built** — it edges toward changing the signature and carries a real coherence risk; revisit only if M1+H3 don't deliver enough weight. **M effort · ★ impact.**

### N2 — Photography direction toward "quiet wealth"
Lombard Odier's imagery is "clients living their wealth quietly rather than displaying it" — understated, anti-stock. Blue Line's photography is already warm/analog; a future pass could tighten selection toward that restraint. Below the system work this run. **S–M effort · ★ impact.**

---

## Trends to avoid (negative control — BINDING on the build phase)

These are admired patterns that would actively *harm* this specific evolution. Building any of them is a failure, even if impressive in isolation:

- **Becoming the beige/navy mega-RIA.** The generic top-50 RIA look (stock boardroom photography, navy-and-gold corporate, "trusted since" badges — the Mercer/Mariner/Wealth-Enhancement center) is the gravity well this whole pass exists to escape. Gravitas must be earned through system, space, and restraint — **not** by adopting the corporate uniform.
- **Transplanting the cold Swiss-bank skin.** Lombard Odier is the *aesthetic anchor*, not a skin to copy. Cloning deep-navy + contemporary-sans + no-serif would erase Blue Line's warm, one-principal differentiation and make it a worse version of a bank. **Evolve the system toward their discipline; never wear their surface.**
- **Luxury-as-ostentation.** Gold everything, heavy gloss, gilded ornament. Elite reads as *restraint*; gilt reads as *aspiration*. Keep the accent disciplined (H2), not gilded.
- **(carried forward, still binding)** Cinematic scroll-jacking / pinned WebGL spectacle, and the everywhere-custom-cursor. The 2026-06-16 audit restrained these; the bold-evolution must not let new "gravitas" motion creep back into spectacle.

---

## Directorial statement

**Gravitas is a system and a silence, not a costume.**

Blue Line is already a beautiful editorial brand. What it is not yet is *expensive* — and in the elite-RIA room, expensive is the table stakes that converts. The route there is not louder craft and not a borrowed private-bank skin. It is: **build the system the design has been missing** (one type scale, one spatial grid, one elevation language), **give the brand a deep, warm register it can drop into** for the moments that carry the most trust, **widen the silence** around every important thing, and **spend the one accent only where it means something.**

Do that and Blue Line keeps everything that makes it rare — the warm cream, the light-arc, the one named human you can see — but now reads as the **calm, expensive, single-principal alternative** to both the beige mega-RIA and the cold Swiss bank. Same soul, deeper bones. That is the evolution the "keep the signature" decision asked for, executed against the hardest bar in the category.

---

### Reference set

| # | Source | What it grounds | Status |
|---|---|---|---|
| 1 | [Lombard Odier — Swiss Private Bank](https://www.lombardodier.com/home.html) | M1/H1/H2/H3 + negative control — elite "understated authority": deep register, extensive whitespace, accent on action only, no ornament | **Fetched & verified 2026-06-17** |
| 2 | [NN/g — Trustworthiness in Web Design: 4 Credibility Factors](https://www.nngroup.com/articles/trustworthy-design/) | Credit — credibility block / upfront disclosure (preserve) | **Fetched & re-verified 2026-06-17** |
| 3 | [Butterick — Practical Typography: Line length](https://practicaltypography.com/line-length.html) | H3 — reading-measure discipline | Verified (prior pass) |
| 4 | [web.dev — Best practices for fonts](https://web.dev/articles/font-best-practices) | Constraint — keep serif fast/preloaded through the re-skin | Verified (prior pass) |
| 5 | 8-point spacing grid + modular type scale | F1 — systematic spacing/type tokens | Established design-system convention (not a single-source claim) |

*Note: Material 3 and the designsystems.com spacing article were attempted as F1 sources but did not return fetchable body text (JS-rendered / 404); per this skill's no-unverifiable-citation rule, F1 is grounded on established convention rather than a fragile link, exactly as the prior pass dropped Stripe Press.*

---

## Build-time outcomes

*(Append-only. Populated during Phase 2+ — records what was built / reverted / deferred and why. The recommendations above are frozen and must not be edited up into.)*

### F1 Step A — token system installed (no-op refactor) · BUILT & VERIFIED 2026-06-17
- **What was built.** Added the full design-token vocabulary to `public/site.css` `:root` — `--space-*` (8px grid), `--text-*` (fluid modular type scale), `--radius-*`, `--elevation-*` (restrained warm-tinted), `--dur-*`. Migrated `index.html`'s structural section rhythm (13 declarations, desktop + mobile overrides) to `--space-*` tokens at **equal values**.
- **Scope refinement vs the approved brief (transparent).** The approved brief said "replace the inline `clamp()`s as a no-op." On execution I found that regularizing the 22 bespoke type `clamp()`s to a clean scale *cannot* be a no-op (a modular scale by definition changes the arbitrary values) — so forcing it here would smuggle visual change into a "no-op" step. I therefore installed the `--text-*` vocabulary **additively** (unused, zero visual effect) and left type migration to **H3**, where that regularization is the *intended, gated* change. Spacing — which *was* already 8pt-aligned — was migrated for real. Net: strictly safer, same foundation, no visual change. `inventory.html` structural migration deferred to when a gate touches it (tokens are shared, so it already inherits the vocabulary).
- **Verification.** Desktop full-page screenshot identical to baseline; computed `.intro` padding `80px 0 64px` (= original 5rem/4rem); `vite build` green; substitutions value-equal by construction.
- **Deferred / not done.** Type/radius/elevation/motion tokens defined but not yet consumed (by design — M1/H1/H3 adopt them). `inventory.html` spacing not yet migrated.

### M1 — deep warm authority register · BUILT & VERIFIED 2026-06-17 (via ce-frontend-design)
- **What was built.** Added a fixed `--register-dark` token set to `public/site.css` (espresso `#1c1810` ground, deepest `#120f08`, `--on-dark`, `--on-dark-muted`, `--accent-soft`, `--hairline-on-dark`) — a constant warm night, decoupled from the arc. Re-skinned `index.html`'s two serious moments to it: `.security` ground `var(--ink)`→`var(--register-dark)` + text→`var(--on-dark)`; `.finale` ground `#0e0f0a`→`var(--register-dark-deep)`. Warmed the light-arc dusk (0.78) + night (1.0) stops from cool-grey to warm taupe in `src/motion/lightArc.js`.
- **Deliberately NOT done (surgical restraint).** Did **not** touch `--ink` (the working body-text color, arc-tinted — nudging it is broad/risky for little gain). Did **not** re-skin the `.philosophy` dark scrim or the `#0a0a0a` reel/deck darks this gate — scoped to the two named moments; their coherence with the new register is checked in Phase 3.5.
- **Verification.** Desktop + mobile screenshots: `.security` and `.finale` read deep/warm/espresso (not navy); cream home register unchanged; credibility block + serif intact. Light-arc invariants held — **18/18 unit tests pass** (stop-0 == site.css, contrast preserved). `vite build` green.
- **Honest note.** A register change is intentionally subtle; the gravitas leap compounds with H1 (whitespace) + H3 (type).

### H1 + H2 + H3 — high-impact polish pass · BUILT & VERIFIED 2026-06-17 (batched per Pete)
- **H1 (whitespace) — BUILT.** Stepped `index.html` light-section rhythm up one notch via `--space-*`: `.intro`/`.stats`/`.three`/`.about-you` tops `--space-5xl`(80)→`--space-6xl`(96), bottoms normalized to `--space-5xl`(80); `.security` (the gravitas band) `--space-6xl`→`--space-7xl`(128) for symmetric drama. Mobile overrides left at their tighter step (not over-airy). Verified: computed `.intro` 96/80, `.security` 128; page reads curated, content still substantial, no thin/empty feel, no broken inter-section rhythm.
- **H2 (accent discipline) — BUILT.** Demoted decorative olive to neutral: `.marquee-track .star` `--accent`→`--dim` (computed `#a8a395`), `.story .badge .dot` `--accent`→`--muted` (computed `#7a7568`). Kept olive on action (CTAs) + meaning (data, editorial serif-italic emphasis). Verified off-olive at computed level.
- **H3 (typographic gravitas) — MINIMAL BUILD + PARTIAL DEFER (honest scope call).** On inspection the type is already at H3's target bar: the hero was *deliberately* sized down by a prior reviewer, display tracking is already tight (-.04em headlines), and the prior audit *credited* the reading measure. Force-regularizing the 22 bespoke clamps to the `--text-*` scale would remap deliberately-tuned values with real regression risk and no clear visual gain — so it was **not** done (don't change what isn't broken; a verified non-change beats an unverified change). **Built:** one safe tightening — `.finale-line` letter-spacing -.015em→-.022em (the loosest large serif) for a hair more command. **Deferred report-only:** broader `--text-*` adoption + measure widening — available as a focused future type pass if desired; the `--text-*` vocabulary remains installed for it.
- **Verification (all three).** Desktop + mobile full-page screenshots; `vite build` green; **18/18 unit tests pass**; home register, credibility block, serif voice, and light-arc signature all intact.

### Phase 3.5 — whole-surface coherence
- **Gestalt verdict.** The landing now reads as one coherent warm-authority brand: cream home register untouched, two deliberate espresso gravitas drops, less decorative olive, more curated air — cohering into the directorial vision (calm, expensive, warm) rather than a collage. No competing focal points, consistent spacing rhythm, single motion language.
- **Coherence items flagged (not regressions; scope edges):** (1) The `.philosophy` dark *photo-scrim* and any `#0a0a0a` reel/deck darks were not migrated to `--register-dark` (M1 scoped to the two named flat-dark moments); they don't clash (photo-scrims read differently from flat register bands) but a future pass could unify them to the espresso register. (2) `inventory.html` ("Under the hood") was **not** evolved this run — it inherits the shared tokens + warmed night arc but not the register re-skin, rhythm bump, or accent discipline; for full two-page brand coherence it should get the same evolution in a follow-up.

### inventory.html — cross-page coherence pass · BUILT & VERIFIED 2026-06-17 (resolves the Phase 3.5 flag)
- **What was built.** Propagated the landing's evolution to the "Under the hood" page: `footer` (its one flat-dark moment) re-skinned `var(--ink)`→`var(--register-dark)` espresso + `var(--on-dark)` text + more air (`--space-6xl 0 --space-xl`); `.section`/`.hero` rhythm tokenized to `--space-*`; the decorative `.infra-dot` demoted `--accent`→`--muted` (H2). The shared warmed night-arc + token system already applied.
- **Density-respecting scope call (deliberate).** Inventory is a *dense technical reference*, not a marketing surface — airing 43 `.section`s to 96px would hurt scannability. So the section rhythm was **tokenized at its current 80px** (system match, not a whitespace bump); only the dark footer gained air. Matched the **register + accent + token system** (the coherence that matters); let whitespace stay appropriate to page function. The `#security` band is a **photo-scrim** (`band-trust.jpg`), left as-is — consistent with leaving the landing's `.philosophy` scrim.
- **Verification.** Footer computed `rgb(28,24,16)` = `#1c1810` espresso + `--on-dark` text + `96/40` padding; `.infra-dot` `#7a7568`; full-page desktop screenshot shows no regression, warm cream technical register intact. `vite build` green. **Two-page brand now coherent.**
