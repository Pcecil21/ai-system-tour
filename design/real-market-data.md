# Real market data — September 7, 2026

The user asked to replace simulated market data everywhere. Both homepage and Under the hood now use the same provider-hosted research chart. The Under the hood sector comparison is a provider-hosted S&P 500 constituent heatmap. The native FRED GS10 history remains unchanged: 264 monthly observations, January 2004–December 2025, labeled as historical Treasury yields.

## Data and display

- The asset selector maps to AMEX:SPY (SPDR S&P 500 ETF Trust), NASDAQ:IEF (iShares 7–10 Year Treasury Bond ETF), and AMEX:GLD (SPDR Gold Shares). Metadata, selected button, chart configuration, and source link change together.
- TradingView renders prices, OHLC, volume, moving averages, date ranges and adjustment controls inside its official Advanced Chart embed. Its configured 12-month view can choose daily bars; the chart itself labels the active interval. There is no local quote store or fabricated numeric fallback.
- The heatmap uses TradingView's SPX500 dataset, sector grouping, market-cap sizing and daily percentage-change coloring. Its toolbar supports other performance periods, relative volume and volatility. These are constituent observations, not the former invented six-sector basket, index contribution or a Blue Line portfolio.
- The site says real data, not guaranteed real-time data. Exchange delays apply, some views are end-of-day, and holidays/closed markets retain the latest available session. Attribution and provider notices remain visible. Actual observation timestamps, feed and adjustments are owned by the provider.

Official integration references:
- https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/
- https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/demos/technical-analysis/
- https://www.tradingview.com/widget-docs/widgets/heatmaps/stock-heatmap/
- https://www.tradingview.com/widget-docs/faq/data/
- https://www.ishares.com/us/products/239456/ishares-710-year-treasury-bond-etf

## Implementation and continuity

`src/marketFeeds.js` initializes official external embed scripts only when a panel approaches the viewport or its homepage disclosure opens. Native fund controls retain focus. A fresh container isolates each request; callbacks from obsolete requests cannot change current status. Frame titles, source links, timeout/error messaging, retry and no-JavaScript explanations are provided. An iframe load is called embedded, never proof of a fresh quote.

`scripts/update-market-panels.mjs` generates the same chart markup for both routes. `public/market-feeds.css` preserves the existing navy research composition and sets explicit responsive container heights. The surrounding brand, layout, photography, lake motion, native Treasury chart, service copy, catalog, navigation and contact destinations remain intact. No package dependency, account, credential, paid subscription, scheduled job, trade or portfolio connection was added.

The prior native renderer, data generator and its tests remain in source for recovery and are marked retired. They are not reachable from the production entry point or included in the built JS. The old fallback generator now fails explicitly and directs maintainers to the real-data generator, preventing accidental republication of synthetic values. The before snapshot is `../../real-market-data-before-20260907/`. All earlier uncommitted work is preserved.

The supported embed was chosen after source checks: Yahoo's unauthenticated endpoint returned 429; Nasdaq timed out; Stooq's CSV required additional access and its terms prohibit redistribution without consent. No downloaded or scraped market table is deployed. Official TradingView widgets allow the site to present provider data without copying it into the site's own dataset.

## Verification

Build and 56 unit tests pass, including nine new tests covering metadata, lazy initialization, closed disclosures, synchronized switching, failed loads, retry, obsolete callbacks, frame titles and absence of invented fallbacks. The remaining 47 prior tests are preserved, including retired prototype tests and eight native Treasury tests.

`../../real-market-browser-check.mjs` verifies actual provider rendering for all three funds in Chrome and WebKit, 320/390/768/1440 widths, responsive frame height, rapid fund switching, heatmap rendering, blocked-provider source fallback and no-JavaScript behavior. There are zero page errors in both engines. Screenshots were self-reviewed; they show real charts at desktop and phone sizes. No physical iPhone test or award-level score is claimed. The provider controls and current data remain external dependencies, so the local tests do not claim to certify the provider's calculations or future uptime.

Release identity and deployed verification are recorded in `../../real-market-release-notes.md` and the current HANDOFF.
