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
