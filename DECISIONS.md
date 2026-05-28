# Decisions

## 2026-04-13 — Tour site direction (post-CEO-review)

- **Decision**: Reduce the tour to a single-scroll hero + 3 outcome stories + (deferred) CTA. Cut the playbooks library, specialists library, memory section, and infrastructure lists from the main page; preserve them at `/inventory.html` for the curious.
- **Context**: Ran a SCOPE REDUCTION CEO review on the current site. Site was serving three audiences (family, prospects, peers) poorly by trying to serve them all. 110-agent inventory was dishonest — ~95 came from The Agency bulk import and are unused. No OG meta, no CTA, no analytics. 2-file sync (root + public) already caused one miss today.
- **Rationale**: RIA breakaway is the actual business priority; the site should not consume hours better spent on compliance manual / Fidelity setup / client transition. A sharp reduction delivers a credible portfolio piece in ~1 evening; expansion can come later once the RIA is live and needs a top-of-funnel.
- **Open items**:
  - CTA decision: **no CTA** until RIA is officially launched (pre-launch compliance stance)
  - Ship window: **SHIPPED 2026-04-13** — Pete overrode the hold and shipped live. Merge commit `acc4d53`.
  - 3 outcome stories: **SELECTED — #2 compliance manual, #5 trade rationale, #1 portfolio catch** (live; voice edit can happen in-place anytime)
  - Appendix page `/inventory.html` — **SHIPPED** — preserves full catalog
  - OG + Twitter meta + SVG favicon — **SHIPPED**
  - Delete root `index.html` after Vercel-only deploy is confirmed — **DONE 2026-05-27** (commit 18d8018)
  - Analytics — **DONE 2026-05-27** — Vercel Analytics script added to both public HTML pages (commit 68b5ebb); enable in Vercel dashboard to activate

## Story Candidates (for later selection — pick 3)

### 1. The portfolio catch
> Before: drift in a client portfolio went unnoticed until the next quarterly review — two or three months of misalignment before anyone saw it. Now: every morning, a scan runs across all 12 households, flags drift above threshold, and hands me a ranked list by 7am. I've caught issues in days instead of months.

### 2. The compliance manual that didn't eat my weekends
> Writing an RIA compliance manual from scratch is 80+ hours of solo grinding. Most breakaways put it off or pay $15K for a template. I drafted mine section by section with Claude as a research assistant that actually understood my custodian structure and the regs I care about. It got written in evenings — my family barely noticed.

### 3. The morning briefing
> I used to start each weekday sifting email, then calendar, then running a mental list of what to worry about. Forty-five minutes before I was oriented. Now a briefing lands at 7am: what's urgent, which client needs a callback, what's on my calendar, what deadlines are near. I walk in already knowing.

### 4. The board memo I actually enjoyed writing
> As president of the NSIA board, every meeting meant three hours reformatting notes into a presentable memo. Now meeting notes go in, a board-ready memo comes out — narrative, decisions, motions, action items, risks. I spend the hour on judgment, not formatting.

### 5. The trade rationale that doesn't sit in drafts
> A good trade rationale takes focused writing. I used to kick the can; rationales stacked up, compliance fell behind. Now a compliant note gets drafted from the trade details in under a minute. I review and sign. Nothing stacks up.

### 6. (bonus) The side builds that actually ship
> I had a dozen side tools in my head — an ice scheduler for the hockey board, a bond dashboard for NSIA, a portfolio monitor, a plumbing-acquisition research tool. None would have shipped because I couldn't carve out weekend build time. With Claude, I describe what I want and I'm running it Monday. Five of them are live.

## 2026-05-27 — Inventory honesty pass (post-/grill-with-docs)

- **Decision**: Reduce inventory page from 111 agents in 11 categories to 34 active agents in 6 categories. Remove the **Game & Spatial** category (26 agents: Unity, Unreal, Godot, Roblox, visionOS, XR) entirely from the page AND delete the underlying agent files from `~/.claude/agents/game-development/` and `~/.claude/agents/spatial-computing/`. Cut Design, Product, Project Mgmt, and Testing & QA categories entirely (0 historical invocations across all session logs). Keep Marketing (Content Creator, SEO, Social Media, Instagram, TikTok, Twitter Engager, App Store Optimizer, Carousel Growth Engine) and Paid Media (Ad Creative, Paid Social, Tracking & Measurement) trimmed for RIA + LaxVerse fit.
- **Context**: `/grill-with-docs` session pressure-tested every stat and category. Session-log analysis (grep across all `~/.claude/projects/**/*.jsonl`) showed zero invocations for marketing/paid-media agents and the entire game/spatial cohort — these were Agency bulk imports, not active tools.
- **Rationale**: A peer advisor reading the inventory would recognize the game/retail agents instantly and the inflated count would read as "Agency default roster." A specific, defensible count is more credible than an impressive one that fails 5-second scrutiny.
- **Open items**: None — shipped in commits `1bb4e93` (Game & Spatial cut), `d0e1e72` (full trim); agent files deleted via `rm -rf` 2026-05-27.

## 2026-05-27 — Stats and copy sharpening

- **Decision**: Replace bento stat "13 live connections" with no replacement (3 honest stats > 4 with one undefined). Update agent count "110+" → "34". Keep "75+ playbooks" (78 actual). Replace hero headline ("Modern wealth management, with AI on my side of the desk") with **"Force multiplier. Not robo-advisor."** Replace philosophy quote with **"I used to spend half my week on work that didn't require an advisor. I fixed that."** Sharpen all three outcome stories to read as first-person testimony with specific detail (custodian structure, six weeks of evenings, twelve households). Rewrite inventory intro for a peer-advisor audience (cut the "Claude is like ChatGPT" explainer).
- **Context**: Audit revealed the "13 live connections" stat had no clear definition — Pete could not explain what it counted when asked. Hero headline was using "modern wealth management" — generic fintech filler. Stories were reading as illustrative scenarios rather than testimony.
- **Rationale**: Honesty is the credibility floor for a fiduciary practice site. Numbers that can't be defended in 5 seconds undermine every other claim. Inferable details (six weeks, twelve households, custodian structure) flip stories from "plausible scenario" to "this guy actually did this."
- **Open items**: None — shipped in commits `626ef49`, `02a15a4`, `57ece9d`, `bd38f71`, `ba2a8c3`, `758da74`.

## 2026-05-28 — Editorial redesign (cream / olive / serif)

- **Decision**: Replace `public/index.html` entirely with a new editorial design featuring: cream paper palette (`#efeee8`), olive accent (`#5e6b2f`), ink (`#1a1c14`); Instrument Serif + Inter Tight + JetBrains Mono type stack; full-bleed hero with large display-weight typography; animated marquee ticker; `<flow-slot>` custom element for Google Flow video drag-and-drop placeholders throughout (hero reel 21:9, three story reels 4:5, deck of four 4:5 atmospheric reels); editorial stats layout; fixed-position nav with `mix-blend-mode:difference`; full footer with contact columns.
- **Context**: Pete dropped `AI Systems tour.zip` containing a redesigned `dist/index.html` plus a `flow-brief.md` with prompts for generating cinematic 35mm-aesthetic reels in Google Flow (Veo 3.1). All sharpened copy from the 2026-05-27 work was preserved in the new design.
- **Rationale**: Editorial design with warm analog imagery (fountain pens, leather folios, cream paper, Tudor homes, Kenilworth winter light) creates a calm, fiduciary, anti-fintech aesthetic that distinguishes the practice from neon/sci-fi AI tropes. The drag-and-drop video slots let Pete generate and swap reels without code changes.
- **Open items**:
  - Generate and host the eight Google Flow reels (hero + 3 story + 4 deck).
  - Decide on permanent video hosting (Vercel Blob / Cloudinary / R2) for the slot URLs.

## 2026-05-28 — Brand identity: Blue Line Advisors

- **Decision**: Position the site under **Blue Line Advisors**, the independent fiduciary RIA Pete will roll out in the future. Pete Cecil remains the named advisor and personal voice; firm identity throughout the site is Blue Line Advisors. Hero meta: "Est. 2025 · Fee-only fiduciary". Stack disclosure: Schwab (custodian) · RightCapital (planning) · Redtail (CRM).
- **Context**: Asked during the `/grill-with-docs` follow-up about hero meta and system tags. Pete chose to position the site forward to the future RIA rather than the prior practice name "Peter Cecil Financial Planning".
- **Rationale**: The site is a portfolio piece now and a top-of-funnel asset once the RIA launches — positioning under the future firm name avoids a rebrand later and starts building name recognition immediately.
- **Open items**:
  - All `Peter Cecil Financial Planning` references updated in `public/index.html` and `public/inventory.html` (commits `08c4af1`, `dd4702e`).
  - Confirm "RightCapital" is the correct vendor spelling (used in place of what Pete dictated as "Wright Capital").

## 2026-05-28 — Contact details and footer cleanup

- **Decision**: Add live contact details to the footer — `mailto:p.cecil@yahoo.com`, `tel:+18476249587`, cal.com (`https://cal.com/peter-cecil-ce0lud`), and LinkedIn (`linkedin.com/in/peter-cecil-20b5a415/`). Remove placeholder lines for fee schedule (PDF), Form ADV, CRD #, and street address.
- **Context**: Pre-launch compliance posture (no CTA on the page itself) but contact information is acceptable since it does not solicit. Pete chose to drop the fee schedule, CRD, and street-address fields rather than fill them.
- **Rationale**: Real contact details make the site usable as a portfolio reference; placeholder text would undermine credibility. The CTA-vs-contact distinction is preserved (no scheduling CTA on the page itself; the cal.com link lives only in the footer).
- **Open items**: None — shipped in commits `aa550c6`, `b09166b`, `113f097`.
