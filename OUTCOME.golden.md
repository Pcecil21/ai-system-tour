# Outcome (GOLDEN) — ai-system-tour

## Open decisions (forward gaps for outcome-builder to probe)
1. **Single primary main-page audience** — peer advisors vs. prospective clients; precedence not declared.
2. **Measurable success thresholds** — none documented.
3. **CTA-flip trigger** — what state defines "RIA launched" (ADV filed? registration approved? first client onboarded?).
4. **Refresh cadence** — for stories, inventory counts, and stats.
5. **Compliance scope** — state vs. SEC registration, IARD/CRD status, advertising-rule constraints.
6. **Inventory-page success metric** — none defined.

## North Star  (one sentence)
A credible, honestly-scoped portfolio site for Blue Line Advisors that demonstrates how an AI-augmented advisory practice operates, in a warm editorial anti-fintech aesthetic.

## Target user / beneficiary
- **Now:** peer advisors and the "curious" — visitors evaluating the practice approach. The inventory page is explicitly framed for this audience after the 2026-05-27 rewrite ("rewrite inventory intro for a peer-advisor audience").
- **Post-launch:** prospective clients, once the RIA is officially launched and the CTA-flip is activated.
- Pete Cecil is the named advisor and personal voice throughout; **Blue Line Advisors** is the firm identity.

## Shipped to date (log)
- **SHIPPED 2026-04-13** — single-scroll hero + 3 outcome stories + appendix at `/inventory.html` live (commit `acc4d53`).
- **3 outcome stories selected** — #2 (compliance manual), #5 (trade rationale), #1 (portfolio catch).
- **OG + Twitter meta + SVG favicon** — shipped.
- **Root `index.html` deleted** after Vercel-only deploy confirmed — DONE 2026-05-27 (commit `18d8018`).
- **Vercel Analytics instrumentation** — script added to both pages 2026-05-27 (commit `68b5ebb`); dashboard activation still required to begin collecting data.
- **Inventory honesty pass** — 2026-05-27. Agent inventory reduced from 111 (in 11 categories) to 34 (in 6 categories); Game & Spatial category removed entirely from the page AND deleted from `~/.claude/agents/`; Design, Product, Project Mgmt, Testing & QA categories cut (0 historical invocations). Commits `1bb4e93`, `d0e1e72`.
- **Stats and copy sharpening** — 2026-05-27. Indefensible "13 live connections" stat removed; hero headline replaced with "Force multiplier. Not robo-advisor."; philosophy quote replaced with "I used to spend half my week on work that didn't require an advisor. I fixed that."; outcome stories rewritten as first-person testimony with specific detail (custodian structure, six weeks of evenings, twelve households). Commits `626ef49`, `02a15a4`, `57ece9d`, `bd38f71`, `ba2a8c3`, `758da74`.
- **Editorial redesign** — 2026-05-28. New cream/olive/serif palette (`#efeee8` paper, `#5e6b2f` olive, `#1a1c14` ink); Instrument Serif + Inter Tight + JetBrains Mono type stack; `<flow-slot>` custom element for Google Flow video drag-and-drop placeholders.
- **Brand identity** — 2026-05-28. Blue Line Advisors live across both pages; hero meta "Est. 2025 · Fee-only fiduciary"; stack disclosure "Schwab · RightCapital · Redtail". Commits `08c4af1`, `dd4702e`.
- **Live contact details** — 2026-05-28. `mailto:p.cecil@yahoo.com`, `tel:+18476249587`, cal.com (`https://cal.com/peter-cecil-ce0lud`), LinkedIn footer link. Placeholder lines (fee schedule, Form ADV, CRD #, street address) removed. Commits `aa550c6`, `b09166b`, `113f097`.
- **No CTA** on the main page until the RIA is officially launched (the cal.com link lives only in the footer, not as a page-level CTA).

## Success criteria (forward, measurable)
- **TBD** — performance thresholds (visitors / peer engagement / time-on-page); none documented.
- **TBD** — CTA-flip trigger condition once the RIA launches.
- **TBD** — inventory-page engagement or quality bar.

## Non-goals
- **No CTA** on the main page until the RIA is officially launched (pre-launch compliance posture).
- **No playbooks library, specialists library, memory section, or infrastructure lists on the main page** — these were cut and moved to `/inventory.html`.
- **Not a multi-audience site** — the 2026-04-13 reduction explicitly rejected serving family, prospects, and peers simultaneously.
- **Not a time sink** — must not consume hours that belong to compliance manual, Fidelity setup, or client transition for the RIA breakaway.
- **Not a dishonest inventory** — the original 110-agent count was bulk-import inflation; honesty is a stated and enforced constraint (verified 2026-05-27).
- **No neon, sci-fi, glitch, or generic AI tropes** in imagery — the redesign rationale explicitly defines the aesthetic as warm/analog/editorial to distinguish the practice from those tropes.
- **No "Peter Cecil Financial Planning" branding** — replaced by Blue Line Advisors across both pages.

## Key constraints
- **Pre-launch compliance posture** — no soliciting language, no page-level CTA, contact info acceptable only because it does not solicit.
- **Time budget** — the project should not exceed minimal investment relative to RIA breakaway priorities.
- **Single source of truth** — Vercel-only deploy from `public/`; the 2-file sync that caused a miss on 2026-04-13 was eliminated 2026-05-27.
- **Honesty / credibility** — agent counts, capability claims, and stats must reflect actual usage. Verified by session-log analysis (`grep` across `~/.claude/projects/**/*.jsonl`).
- **Brand identity** — firm name is Blue Line Advisors; Pete Cecil is the named advisor and personal voice.
- **Stack disclosure** — Schwab (custodian) · RightCapital (planning) · Redtail (CRM).
- **Visual aesthetic** — warm/analog/editorial: fountain pens, leather folios, cream paper, Tudor homes, Kenilworth winter light. Anti-fintech, anti-neon.

## Definition of done
**Initial-ship DoD (2026-04-13):** MET.
- Single-scroll hero, three outcome stories, inventory appendix, OG/Twitter meta, SVG favicon, Vercel Analytics wired, root duplicate removed.

**Honesty-pass DoD (2026-05-27):** MET.
- 34 defensible agents in 6 categories; 3 defensible bento stats; sharpened hero, philosophy, and outcome-story copy; inventory intro reframed for peer-advisor audience.

**Editorial-redesign DoD (2026-05-28):** PARTIALLY MET.
- Design shipped and live.
- Outstanding: generate the eight Google Flow reels (hero 21:9 + 3 story 4:5 + 4 deck 4:5) and choose permanent video hosting (Vercel Blob / Cloudinary / R2) for the slot URLs.

**Brand-identity DoD (2026-05-28):** MET across both pages.

**Contact-details DoD (2026-05-28):** MET. Footer placeholder lines removed.

**Open items for current production state:**
- Generate and host the 8 Flow reels.
- Activate Vercel Analytics in the dashboard (script is present).
- Confirm "RightCapital" is the correct vendor spelling (used in place of Pete's dictated "Wright Capital").

**Forward-looking DoD** (post-RIA-launch CTA flip): **not documented**.

## Confidence per section: HIGH / MED / LOW
- North Star — **MED-HIGH** (Blue Line Advisors brand identity and editorial aesthetic are now explicitly anchored in `DECISIONS.md`).
- Target user / beneficiary — **MED** (peer-advisor audience explicit for the inventory page; main-page audience implicit from contact + cal.com + redesign rationale, but never declared in a single line).
- Success criteria — **HIGH** for shipped items (commit hashes and dates recorded for every milestone); **LOW** for any forward-looking thresholds (none documented).
- Non-goals — **HIGH**.
- Key constraints — **HIGH**.
- Definition of done — **HIGH** for shipped phases; **MED** for the three named open items (reels, analytics activation, vendor spelling); **LOW** for next-phase (post-launch) DoD.

## Gaps you could NOT infer from the context layer
- **No CLAUDE.md, CONTEXT.md, AGENTS.md, or README.md** exists at the project root — `DECISIONS.md` is the sole context file.
- **No measurable success thresholds** (visitor counts, peer engagement, conversion targets, time-on-page). The project records ship state, not performance state.
- **No defined trigger or criteria for flipping the deferred CTA on** once the RIA launches (what state must the RIA be in? what content must change? what compliance gate must clear?).
- **No documented refresh cadence** for stories, inventory counts, copy, or stat updates as the practice evolves.
- **Single primary main-page audience** is implied but not declared in a single line — the page now points at peer advisors (inventory) and prospective clients (main page post-launch), but the precedence is not stated.
- **Compliance scope** — pre-launch posture is stated, but the specific governing rules (state vs. SEC registration, IARD/CRD status, advertising-rule constraints, testimonial restrictions) are not documented.
- **No success criteria for the inventory page specifically** — described as "preserved for the curious" with no engagement target or quality bar.
- **Google Flow reel quality bar / generation criteria** — the eight reel slots are designed and live, but the prompts, style guide, and approval criteria (which lived in `flow-brief.md` inside the zip) are not part of the documented context layer at the repo root.
