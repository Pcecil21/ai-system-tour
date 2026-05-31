---
date: 2026-05-31
topic: cinematic-scroll-film-redesign
---

# Award-Tier Cinematic Redesign — The Scroll-Film

## Summary

Reimagine the Blue Line Advisors site as an award-tier cinematic experience organized around one ownable concept: a **day→night light arc** that moves from golden-hour morning through dusk to a moonrise finale as the visitor scrolls. Full creative license — scroll-choreographed scenes, WebGL/shader depth, and freedom to overhaul the visual identity — disciplined so the spectacle reads premium and intentional, never tech-demo.

---

## Problem Frame

The site today is a strong, coherent editorial piece (cream/olive/serif, full-bleed photography, hairline-grid structure) with motion bolted on top — parallax, Ken-Burns, staggered reveals. It is *polished*. It is not *unforgettable*. A prospect's first three seconds register "tasteful advisor site," not "I've never seen anything like this." A peer advisor registers competence, not craft worth screenshotting.

For a one-person fiduciary practice whose entire pitch is "you get someone exceptional, not a call center," a merely-tasteful site under-sells the person behind it. The asset that would normally make a cinematic site expensive to fake — real footage, real photography across real light, a genuine sense of place — already exists here (the practice reels, the Kenilworth photography, the animated moonrise). What's missing is a concept that turns those assets into choreography instead of decoration, and the ambition to push the craft to a level juries and prospects both stop on.

The cost of staying put: the site keeps reading as one good template among many, and the "exceptional individual" claim lands softer than it should.

---

## Actors

- A1. Prospective client (founding family): the buyer. Affluent, evaluating whether this advisor is *for them*. Must feel premium trust and a sense of place — never "is this a gimmick?"
- A2. Peer advisor: secondary audience. Recognizes originality and craft; the site should read as something no other advisor has.
- A3. Pete (principal / brand owner): wants a showpiece he is proud to put his name and voice on; owns the trust line that the spectacle must not cross.

---

## Key Flows

- F1. The scroll-film journey
  - **Trigger:** Visitor lands on the homepage and begins scrolling.
  - **Actors:** A1, A2
  - **Steps:** Opening sequence establishes the world (dawn/golden hour) → scroll advances "time of day," with sections pinned and scroll-scrubbed so motion is tied to scroll position, not just fired on entry → palette, light, and mood shift scene to scene through day and dusk → the moonrise lands as the signature night moment → resolves into the contact/closing in full night.
  - **Outcome:** The visitor has moved through a continuous cinematic arc, the fiduciary message intact and legible throughout, and leaves with one image they remember.
  - **Covered by:** R1, R2, R3, R4, R7, R8, R9, R10

- F2. Cross-page cinematic transition
  - **Trigger:** Visitor follows the link from the homepage to the "Under the hood" inventory page.
  - **Actors:** A1, A2
  - **Steps:** The navigation animates as a deliberate transition (not a hard page load) → the inventory page carries the same art direction, motion language, and (if changed) identity system → the visitor never feels they left the experience.
  - **Outcome:** Two-page site reads as one continuous world.
  - **Covered by:** R11

---

## Requirements

**Concept & art direction**
- R1. The site is organized around a single signature concept: a **day→night light arc** keyed to scroll progress (morning → dusk → night). Every section's palette, lighting, and mood is a position on that arc.
- R2. The **visual identity is open to overhaul** — the current cream/olive/serif system is no longer locked. Any new or evolved identity must still read **premium and fiduciary** ("serious money is safe here"), not arcade or sci-fi.
- R3. The experience must be built on the existing real assets (practice reels, Kenilworth photography, the animated moonrise) as the cinematic spine, with freedom to generate or commission new assets where the arc needs them.

**Cinematic motion system**
- R4. Buttery momentum/smooth scrolling — the page glides rather than jumps — as the baseline feel.
- R5. Scenes are **scroll-scrubbed and/or pinned**: key animations are tied to scroll position (scrub), and at least the signature scenes hold ("pin") while their motion plays, rather than every reveal simply triggering on entry.
- R6. Kinetic typography on the primary headlines (e.g., masked/split-text reveals) as a craft signal, used where it serves the line — not on every block.
- R7. An intentional **opening sequence** that establishes the world before the visitor scrolls (a "curtain"/title-sequence moment), not an abrupt content dump.
- R8. Cinematic **transitions between sections** (dissolves/wipes/match-cuts in the art-direction language) replacing today's hard cuts.

**Experimental depth (in scope per principal override)**
- R9. WebGL/shader/3D depth is permitted and encouraged **where it raises the ceiling**: e.g., shader-based image/scene transitions, volumetric grain and light, multi-plane depth. Each use must clear the "reads premium, not tech-demo" bar.
- R10. A **custom cursor** and subtle interactive depth (magnetic/parallax response) are permitted within the same premium-restraint bar.

**Cross-page & signature**
- R11. The inventory ("Under the hood") page receives consistent art direction and motion language plus a **cinematic page transition** to/from the homepage, so the two pages read as one world.
- R12. The redesign establishes one **signature screenshot moment** — the moonrise is the leading candidate — that anchors the night end of the arc and is the thing people remember.

**Guardrails (the discipline that keeps it award-tier, not arcade)**
- R13. Trust and legibility are preserved throughout: the fiduciary message is readable at every point of the arc; spectacle never obscures content.
- R14. `prefers-reduced-motion` is honored — the experience degrades to a static, fully legible, still-beautiful version.
- R15. The experience stays smooth on a mid-range phone; where WebGL is unsupported or the device is constrained, it falls back gracefully to the non-WebGL cinematic layer.
- R16. Content, copy, and section order are unchanged — this is visual/experiential reinvention, not a messaging rewrite.

---

## Acceptance Examples

- AE1. **Covers R14.** Given a visitor with `prefers-reduced-motion: reduce`, when they load and scroll the site, then the light-arc and scrubbed animations are suppressed and the page presents as a static, legible, on-brand layout with no motion-induced discomfort.
- AE2. **Covers R15.** Given a mid-range phone with no/weak WebGL, when the visitor scrolls, then scrolling stays smooth (no jank), WebGL effects are scaled down or disabled, and the cinematic-but-non-WebGL layer carries the experience without broken visuals.
- AE3. **Covers R9, R13.** Given any WebGL effect in the design, when it is reviewed against the trust bar, then it is kept only if it reads as premium/cinematic (film-title-sequence energy) and cut if it reads as game/sci-fi spectacle.
- AE4. **Covers R1, R12.** Given a visitor scrolling top to bottom, when they reach the night end of the arc, then the moonrise moment lands as the visual climax and the closing/contact resolves in full night.

---

## Success Criteria

- Pete is proud to show the site unprompted — it functions as a portfolio-grade artifact of the practice.
- A prospective founding family's first reaction is premium trust and a sense of place, not "is this a gimmick?" — the trust line is never crossed.
- The result is a credible **Awwwards Site-of-the-Day contender** — a peer advisor or designer would recognize it as original craft, not a template.
- Downstream handoff is clean: `ce-plan` can sequence the build without having to invent the concept, the scope, the guardrails, or the success bar.

---

## Scope Boundaries

- No content or copy rewrite — the words stand.
- No new sections and no information-architecture restructure — the section set and order stand.
- Not the experimental lane *for its own sake*: WebGL/3D is in scope only where it clears the premium-trust bar (R9/R13), not as spectacle by default.
- Not a re-platform decision: whether a build step or specific libraries are introduced is a planning concern, not a product boundary here.

---

## Key Decisions

- Direction B (the scroll-film) over A (polish-only) and pure C (max spectacle): the day→night arc is the *concept* that makes the work award-tier rather than merely polished, and it is built from assets that already exist. Rationale: juries and prospects both reward a concept the motion serves; A adds none and C (alone) overshoots into the trust-risk lane.
- Experimental lane (WebGL/shaders/cursor/3D) pulled **into** scope at the principal's explicit direction, overriding the initial trust-conservative exclusion. Rationale: Pete chose maximum ceiling; the risk is managed by the premium-not-arcade bar rather than by exclusion.
- Visual identity is **open**, not locked to cream/olive/serif. Rationale: "absolute best" should not be constrained by the current palette if a stronger identity emerges; the constraint that remains is "premium/fiduciary," not a specific palette.
- Discipline reframed from "avoid spectacle" to "spectacle must read premium and intentional." Rationale: at this ceiling the failure mode is "tech demo," which attacks the exact trust that is Pete's differentiator.

---

## Dependencies / Assumptions

- The existing real assets (practice reels, Kenilworth photography, the animated moonrise) are available as the cinematic raw material, and the Veo/Gemini generation pipeline (`scripts/`) is available to produce new assets if the arc needs them.
- The site is currently a static single-page build with inline styles/scripts; introducing a motion/3D toolchain or build step is assumed acceptable and is a planning decision.
- "Premium/fiduciary" is the durable brand constraint even though the specific palette/type is open — assumed, not separately validated.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R3, R12][Needs design exploration] The animated moonrise currently lives in the **opening** reels (placed there this session). The arc concept wants it as the **night finale** signature. Reconcile: relocate it to the night end, keep a teaser up top, or both?
- [Affects R2][Needs design exploration] "Identity open" — does planning produce 2-3 alternate identity directions to choose from, or evolve the current cream/olive/serif toward its richest cinematic form as the default and only diverge if a clearly-stronger direction emerges?
- [Affects R4, R5, R9][Technical] Motion/3D toolchain and build approach (smooth-scroll, scroll-scrub/pin, WebGL layer) — library and tooling choices belong in planning.
- [Affects R15][Technical][Needs research] Concrete performance budget (LCP, frame stability targets) and the device tier at which WebGL is disabled — set during planning against real measurement.
- [Affects R11][Technical] Mechanism for the cross-page cinematic transition on a two-file static site — planning decision.
