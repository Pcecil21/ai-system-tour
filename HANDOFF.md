# Handoff — 2026-05-29

## Pick up here
- [ ] When the custodian is decided (Fidelity vs Schwab), change the one `custodian:` value in `public/config.js` — updates both pages.
- [ ] (Optional) Optimize image weights — hero/about photos are 2.8–3.3MB each (~38MB deploy); compress for faster first load.
- [ ] (Optional) Bolder motion still on the table: staggered item reveals + a hero "Ken-Burns" zoom (held back to verify visually first).
- [ ] `public/images/inv-hero-a.jpg` (unused estate hero candidate) is untracked — keep as a spare or delete.
- [ ] Playwright MCP was taken down this session — restart Claude Code to restore inline screenshot verification.

## Context
Major session: repositioned the client landing client-first (new hero, About-me trading bio, client-benefit reframe), reframed the "Under the hood" page around differentiation (speed/accuracy/thoroughness + the 10–20-person-firm capacity thesis + a most-advisors contrast), added cinematic photography + parallax + motion + a swappable Schwab custodian, and **launched live to Vercel** (ai-system-tour.vercel.app). 4 commits pushed to GitHub master (`acb02cd`→`0cccf85`). Real source: `Archive/ai-system-tour`.
