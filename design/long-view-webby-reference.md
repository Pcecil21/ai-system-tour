# The long view — September 6, 2026

## Brief

Audience: prospective founding families seeking an independent financial adviser. The opening must identify Pete and his work, establish a personal reason to care, and offer a direct conversation. The separate Under the hood page remains a detailed account of his tools and methods.

Preserve the cream/cobalt identity, original family/founder photographs, twenty-two years in Treasury options, fifteen founding families, Fall 2026 opening, all contact destinations, audited inventory content, and existing research controls/calculations. No new service, portfolio result, testimonial, or live-data claim.

Before renders: `../../webby-before-{desktop,phone}.png`; preceding full-page renders are `../../professional-top-after-*-full.png`. Initial source snapshot: `../../webby-before-source/`.

Strongest element: the original photograph and the personal meaning behind “A longer view.” Three visible weaknesses: the opening treated the photograph as a secondary block; similarly weighted sections offered little visual progression; working research screens were discoverable only through a small text link below the founder note.

## Research and direction

Official results checked:

- [2026 Best Visual Design — Aesthetic](https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-visual-design-aesthetic): Igloo Inc is the Webby winner; the same source lists Immersive Garden as the 2025 winner.
- [AW Portfolio](https://winners.webbyawards.com/2025/websites-and-mobile-sites/features-design/best-home-page/332383/aw-portfolio): 2025 Best Home Page Webby winner.
- [FOLLOW.ART](https://winners.webbyawards.com/2026/websites-and-mobile-sites/features-design/best-visual-design-function/383443/followart): 2026 Best Visual Design — Function Webby winner.

Inspected actual desktop and phone renders of Igloo and AW, plus scrolled views. Igloo's opening establishes its identity through one spatial subject. AW uses its line artwork, strongly contrasting type, and color consistently across responsive layouts. These are observations of the current sites, not a claim to have reconstructed their award submissions. FOLLOW.ART's live page returned a Cloudflare verification page; its [creator's case study](https://videinfra.com/work/follow-art) provided the primary account of branding and interaction. No attempt to bypass the security check. Saved reference evidence: `../../webby-references.json` and `../../webby-{igloo,aw,follow}-*.png`.

Considered three directions:

1. A spatial research room: dark first screen and analytical graphics throughout. Strong technical demonstration, but the first impression would obscure the family advisory purpose.
2. A typographic journal: dense rules, compact photography, and short editorial sections. Credible, but too close to the existing composition to materially improve recognition.
3. **The long view, selected:** original family photograph alongside an expressive serif opening; a personal note with restrained typography and a founder portrait; a darker working-research chapter; a cobalt invitation to talk. This offers contrast and motion while keeping the human service first.

The transferable benchmark is a specific visual idea developed through the entire page, controlled responsive typography, functional interaction, and careful finishing. No competitor assets or layouts are copied. No award-level score or award claim is made.

## Implementation

- Recompose `index.html`; retain its metadata, facts, contact/booking destinations and original photos.
- Replace the homepage stylesheet with a coherent page-scoped system. Shared site/inventory styles remain unchanged.
- Use local Newsreader for editorial headings and DM Sans for navigation/body/UI. Preload the new hero's italic face.
- Frame the actual lake horizon with a short entrance animation. Intro animation lasts at most 1.15 seconds; reduced motion shows the final state. No looping animation, scroll hijack, or custom cursor is added to the homepage.
- Reuse `marketDemoEntry.js`, its native SVG charts, calculations, accessible controls, and motion controller. The homepage shows the same first study with supplementary readouts inside the existing native disclosure. Data remains visibly simulated.
- Extend `scripts/update-market-fallback.mjs` to copy the regenerated canonical first panel into homepage markers. This keeps labels, controls, data and static geometry synchronized. Refresh with `node scripts/update-market-fallback.mjs` after changing the canonical study.
- Existing inventory source remains byte-identical to the before snapshot. Existing uncommitted work remains in place.

## Rendered self-review

No independent critic was used, following the user's sequential-task tool mapping. Reviewed desktop1440, tablet768, phone390, narrow320, whole page, and enlarged opening text.

First pass corrections: aligned the founder heading with its prose column; aligned the photographic rule with the actual crop's horizon; repaired the mobile “Care in the details” word spacing; compacted phone risk statistics without hiding information; retained word wrapping for enlarged text; placed secondary readouts in a disclosure to control the page's length.

The result creates distinct visual chapters and gives the site's strongest interactive work a visible place on the homepage. Authentic photography stays intact. Browser verification and deployment evidence are recorded in the root release notes and handoff.
