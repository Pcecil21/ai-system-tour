# Site continuity

Updated September 7, 2026. Shared by Codex and Claude Code; read the current root HANDOFF first.

## Source and release

- The editable Git repository is `source/` inside the ai-system-tour workspace. The parent holds preserved experiments, screenshots, deploy stages, and verification evidence; it is not a Git repository.
- Active branch: `design/astra-refinement`. Implementation checkpoint: `1653650`, pushed to the branch of the same name. This supersedes historical notes saying the September work is uncommitted.
- Live homepage: https://ai-system-tour.vercel.app/ ; system tour: https://ai-system-tour.vercel.app/inventory . September 7 release: `dpl_45PU6fyKtxHgZ5a1A3y3ddXUNz37`.
- `design/real-market-data.md`, `design/horizon-journey.md`, and `design/client-clarity.md` explain the settled implementation. The parent `real-market-release-notes.md` records release verification; its last paragraph about Git predates the closeout checkpoint.

## Preserve the accepted direction

The user wants a professional, ambitious client site with strong imagery, motion, and sophisticated interactive information. The current journey moves from a lake scene through real Treasury history to the original family photograph. Founder and family photographs, working contact destinations, service copy, and the audited Under the hood inventory were preserved. The optional research panels should support the client story. Numerical design scores and award quality were not independently established for this release.

Do not reintroduce the removed non-work portfolio examples or turn the inventory back into a generic capabilities claim. Consult `CONTENT-INVENTORY.md` and the current inventory source for the audited facts. Fees, minimums, ideal-client specifics, and service cadence still require owner input; older drafts are not evidence. Domain and contact replacements were not supplied. Earlier custodian/disclosure follow-ups remain historical and need reinspection before any change.

## Real-data contract

- Both routes use official TradingView Advanced Chart embeds: AMEX:SPY, NASDAQ:IEF, and AMEX:GLD. The inventory heatmap uses the provider's S&P 500 constituent dataset.
- These are fund/constituent observations, not an advisory portfolio or client performance. Real data does not mean guaranteed real-time quotes. Keep fund names, provider attribution, delay notices, source links, and visible error/retry states.
- Native Treasury history is FRED GS10: 264 monthly observations, January 2004 through December 2025. It is a historical yield series, not a current quote or investment return. JSON and downloadable CSV are checked in.
- No synthetic quote fallback. Old prototype modules and tests remain for recovery but are outside the production entry point. `scripts/update-market-fallback.mjs` deliberately refuses to regenerate them; use `scripts/update-market-panels.mjs` for current market markup and `scripts/update-history-fallback.mjs` for native historical markup/CSV.

## Integration lessons

- A loaded iframe proves embedding, not quote availability or freshness. Describe that state honestly; provider timestamps remain the source of observation timing.
- Set explicit responsive host heights before using an autosizing third-party chart. Inspect both Chrome and WebKit and normalize their whitespace differences in browser assertions.
- Isolate each embed request in a fresh container. Ignore callbacks from superseded requests during fast instrument switching, and keep selection, metadata, and source links synchronized.
- Keep the homepage chart lazy until its native disclosure opens. Test blocked-provider and no-JavaScript paths as well as real provider rendering and controls.
- The supported widget avoided deploying scraped price tables. Recheck integration rights and supported APIs before replacing it with a downloaded dataset.

## Verification and maintenance

`npm run build` and `npm test` passed for the published implementation: 56 tests, including nine provider lifecycle tests and all 47 prior tests. Parent files `real-market-local-verification.json`, `real-market-live-verification.json`, `real-market-local-controls.json`, and `real-market-live-identity.json` record actual browser and deployed-asset checks. Chrome/WebKit covered 320/390/768/1440 widths, all funds, rapid switching, heatmap, provider failures, and disabled JavaScript; selected 22 served files matched the staged release by SHA-256. No physical iPhone or independent provider calculation certification was performed.

Vite scripts run from this repository. Parent browser helpers use the installed gstack Playwright package. Check server availability before reusing local ports 4173/5173. Rebuild and run checks appropriate to future changes; documentation-only closeout does not warrant redeployment.

Root HANDOFF stays local and uncommitted. The historical `HOMEPAGE-REVIEW.md` contains old preview access URLs and must remain local unless reviewed and sanitized. The parent's closeout archive preserves the previous long handoff. Shared files provide cross-tool continuity; native conversation history is separate.
