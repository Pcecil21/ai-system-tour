# Outcome — ai-system-tour

**Date:** 2026-05-28
**Owner:** Pete Cecil

## Open decisions
Forward-looking gaps the interview surfaced but did NOT resolve. These are the decisions still on the table the user explicitly deferred:
1. **CTA-flip trigger condition** — what specific state defines "RIA launched" and warrants promoting cal.com from footer link to page-level CTA (Form ADV filed? IL state registration approved? first client onboarded? custodian agreement signed?).
2. **Numeric performance thresholds** — currently signal-based only (peer DM; cal.com booking). No volume, frequency, or time-bound targets.
3. **Refresh cadence** — when the stats (75+/34/7AM), outcome stories, and inventory should be re-audited (quarterly? when underlying counts materially change? never until launch?).
4. **Governing advertising rule** — SEC Marketing Rule 206(4)-1 vs. Illinois state rules vs. belt-and-suspenders. Deferred to compliance counsel review before launch.
5. **"RightCapital" spelling confirmation** — used in place of the user's dictated "Wright Capital"; needs explicit confirm or correction.
6. **Permanent video hosting choice** — Vercel Blob / Cloudinary / R2 / other for the 8 Google Flow reel slot URLs.

## North star
A credible, honestly-scoped portfolio site for Blue Line Advisors that demonstrates how an AI-augmented advisory practice operates, in a warm editorial anti-fintech aesthetic — serving both peer advisors and prospective clients from a single page.

## Problem
Pete is preparing to launch Blue Line Advisors as an independent fiduciary RIA after breaking away from Cetera. He needs a public web surface that (a) gives peer advisors and the curious a credible look inside the AI-augmented practice approach without consuming hours that belong to the breakaway work itself, and (b) is ready to convert to a top-of-funnel asset for prospective clients once the RIA is officially launched.

## User / beneficiary
A single homepage serving **both audiences equally** *(deliberate reversal of the 2026-04-13 single-audience SCOPE REDUCTION; recorded 2026-05-28)*:
- **Peer advisors and breakaway-curious** — other RIAs and advisor-adjacent visitors evaluating the practice approach. Today's primary engagement signal.
- **Prospective clients (Kenilworth / North Shore)** — households who might one day hire Blue Line Advisors. Activated once the CTA-flip occurs.

Pete Cecil is the named advisor and personal voice; Blue Line Advisors is the firm identity.

## Shipped to date
- **SHIPPED 2026-04-13** — initial single-scroll homepage + 3 outcome stories + inventory appendix at `/inventory.html` (commit `acc4d53`, per DECISIONS.md).
- **SHIPPED 2026-05-27** — ship-loop pass: 15 commits adding ARIA tab widget, skip-to-content link, keyboard navigation, CSP / Permissions-Policy security headers, JSON-LD schemas (WebSite + CollectionPage), clean URLs, focus-visible styles, dark `color-scheme` (iterations 24–38, ending commit `afd300d`).
- **SHIPPED 2026-05-27** — inventory honesty pass: 111 → 34 active agents; bento stat 110+ → 34 (commits `1bb4e93`, `d0e1e72`).
- **SHIPPED 2026-05-27** — copy sharpening: removed "13 live connections" stat; new hero "Force multiplier. Not robo-advisor."; new philosophy quote; outcome stories rewritten as first-person testimony; inventory intro reframed for peer-advisor audience (commits `626ef49`, `02a15a4`, `57ece9d`, `bd38f71`, `ba2a8c3`, `758da74`).
- **SHIPPED 2026-05-28** — editorial redesign: cream/olive/serif palette, Instrument Serif + Inter Tight + JetBrains Mono type stack, `<flow-slot>` custom element for Google Flow video drag-and-drop (commit `d3891cf`).
- **SHIPPED 2026-05-28** — Blue Line Advisors brand identity across both pages; hero meta "Est. 2025 · Fee-only fiduciary"; stack disclosure "Schwab · RightCapital · Redtail" (commits `08c4af1`, `dd4702e`).
- **SHIPPED 2026-05-28** — contact details and footer cleanup: live `mailto:`, `tel:`, cal.com, LinkedIn; removed fee schedule / Form ADV / CRD / street address placeholders (commits `aa550c6`, `b09166b`, `113f097`).
- **SHIPPED 2026-05-28** — DECISIONS.md backfilled with 5 entries covering the 2026-05-27/28 work (commit `614edb7`).

## Success metric
- **Leading signal:** a peer DM (LinkedIn message, email, or referral mention) indicating the site landed with a fellow advisor.
- **Lagging signal:** cal.com intro bookings via the footer link, indicating the site converts interest to action.
- **TBD:** numeric thresholds, refresh cadence, and CTA-flip trigger condition — deliberately deferred pending real-world feedback and the pre-launch compliance review.

## Scope (in)
- Single-scroll homepage with editorial cream/olive/serif aesthetic.
- Hero ("Force multiplier. Not robo-advisor.") + three outcome stories (compliance manual, trade rationales, portfolio drift monitoring).
- Three defensible bento stats: 75+ playbooks, 34 specialists, 7AM briefing.
- Philosophy block.
- Inventory appendix at `/inventory` preserving 78 playbooks and 34 active agents.
- Eight Google Flow drag-and-drop video slots (1 hero + 3 story + 4 deck).
- Footer with live contact details (email, phone, cal.com, LinkedIn) and Blue Line Advisors firm identity.
- Vercel-only deploy from `public/`; OG meta, Twitter meta, canonical, JSON-LD, sitemap, security headers, clean URLs.

## Non-goals (out)
- **No page-level CTA** until the RIA is officially launched (cal.com link lives only in footer). *Reason: pre-launch compliance posture under current Cetera BD affiliation.*
- **No playbooks/specialists/memory/infrastructure lists on the main page** — these belong on `/inventory`. *Reason: 2026-04-13 SCOPE REDUCTION.*
- **No neon, sci-fi, glitch, or generic AI tropes.** *Reason: anti-fintech editorial aesthetic anchors the brand.*
- **No "Peter Cecil Financial Planning" branding** — replaced by Blue Line Advisors. *Reason: 2026-05-28 brand identity decision.*
- **No bulk-import or inflated counts** — every agent and stat must reflect real usage. *Reason: honesty constraint enforced 2026-05-27.*
- **No time investment beyond the minimum** to keep the site credible. *Reason: RIA breakaway work is the priority.*

## Constraints
- **Registration status today:** Pete is registered with Cetera (broker-dealer affiliation); breakaway in progress; post-breakaway firm will be **Illinois state-registered**.
- **Pre-launch compliance posture:** no soliciting language, no page-level CTA, contact info acceptable as it does not solicit.
- **Governing advertising rule:** TBD pending **compliance counsel review** before the CTA flip.
- **Time budget:** must not pull hours from compliance manual, custodian setup, or client transition work for the RIA breakaway.
- **Single source of truth:** Vercel-only deploy from `public/`; no root-level duplicate HTML.
- **Visual aesthetic:** warm/analog/editorial (fountain pens, leather folios, cream paper, Tudor homes, Kenilworth winter light).
- **Tech stack disclosure:** Schwab (custodian) · RightCapital (planning) · Redtail (CRM).

## Deliverable
A live two-page static site at `ai-system-tour.vercel.app`:
1. **`/`** — editorial homepage (hero, marquee, intro, stats, three stories, philosophy, eight Flow video slots, footer).
2. **`/inventory`** — full appendix of 78 playbooks and 34 agents.

## Definition of done

**Initial-ship phase DoD (2026-04-13):** MET.
- [x] Single-scroll hero published
- [x] Three outcome stories selected and live
- [x] Inventory appendix at `/inventory.html`
- [x] OG meta + Twitter meta + SVG favicon
- [x] Vercel Analytics script wired into both pages

**Honesty-pass DoD (2026-05-27):** MET.
- [x] Agent inventory trimmed to 34 across 6 categories
- [x] Three defensible bento stats (75+ / 34 / 7AM); indefensible "13 live connections" removed
- [x] Sharpened hero, philosophy, and outcome-story copy
- [x] Inventory intro reframed for peer-advisor audience
- [x] Ship-loop accessibility / SEO / security improvements (15 commits, iter 24–38)

**Editorial-redesign DoD (2026-05-28):** PARTIALLY MET.
- [x] New cream/olive/serif editorial design live
- [x] `<flow-slot>` drag-and-drop infrastructure live
- [ ] 8 Google Flow reels generated and hosted permanently
- [ ] Permanent video hosting choice made and slot URLs updated

**Brand-identity DoD (2026-05-28):** MET.
- [x] Blue Line Advisors firm identity across both pages
- [x] Stack disclosure: Schwab · RightCapital · Redtail
- [x] Hero meta: Est. 2025 · Fee-only fiduciary

**Contact-details DoD (2026-05-28):** MET.
- [x] `mailto:`, `tel:`, cal.com, LinkedIn live in footer
- [x] Placeholder lines removed (fee schedule, Form ADV, CRD, street address)

**Documentation DoD (2026-05-28):** MET.
- [x] DECISIONS.md backfilled with 5 entries covering 2026-05-27/28 work
- [x] OUTCOME.md written

**Open before fully done (operational):**
- [ ] Activate Vercel Analytics dashboard
- [ ] Confirm "RightCapital" spelling (vs. dictated "Wright Capital")

**Forward-looking DoD (post-RIA-launch):** NOT DOCUMENTED.
- [ ] CTA-flip trigger condition defined
- [ ] Performance thresholds defined (currently signal-based only)
- [ ] Refresh cadence defined
- [ ] Governing advertising rule confirmed by compliance counsel
- [ ] Page-level CTA introduced

## Confidence per section
- North star — **HIGH** (anchored to Blue Line Advisors brand, explicit audience, explicit aesthetic).
- User / beneficiary — **HIGH** (explicit user choice in 2026-05-28 interview; "both audiences" is a deliberate reversal of the earlier scope reduction, not an ambiguity).
- Success metric — **MED** (leading and lagging signals identified; numeric thresholds explicitly deferred — gap is by design, not by ignorance).
- Non-goals — **HIGH** (six non-goals each with a cited reason).
- Constraints — **MED** (registration status nailed; advertising rule explicitly deferred to compliance counsel).
- Definition of done — **HIGH** for all six shipped phases (every commit hash documented); **MED** for "open before fully done" (2 operational items); **LOW** for forward-looking (5 items, all gated on undefined RIA-launch state).

## Gaps not inferable from context
What the context layer and interview did NOT cover — these are NOT the same as "Open decisions" (forward decisions the user knows they'll need to make). These are things this pass flat-out could not extract:
- **No analytics baseline** — Vercel Analytics script is wired but the dashboard isn't activated; no historical engagement numbers exist to compare future signals against.
- **No documented review/approval workflow** for content changes — implicit assumption is Pete edits directly; no peer review or compliance pre-publication step recorded anywhere.
- **No backup or rollback strategy** for the Vercel deploy — git is the de facto rollback but is not documented as such.
- **No documented relationship between this site and broader Blue Line Advisors brand assets** (logo, color extensions, business cards, email signatures, social profiles) — the site stands alone; firm-wide brand-system docs do not exist.
- **No content lifecycle policy** for the outcome stories — no rule for when to retire a story, swap a new one in, or update underlying facts (e.g. "twelve households" will change as the practice grows).
