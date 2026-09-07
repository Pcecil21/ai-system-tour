// Generate both routes from the same real-data panel markup. No sample quotes.
import { readFile, writeFile } from 'node:fs/promises'

function panel(kind) {
  const price = kind === 'price'
  const name = price ? 'market-study' : 'breadth-study'
  return `<section class="market-demo market-live" id="${name}" data-market-feed="${kind}" aria-labelledby="${name}-title">
  <div class="market-shell">
    <div class="market-appbar"><span class="market-brand">Blue Line / ${price ? 'Market research' : 'Market participation'}</span><span class="market-demo-label">Real market data · exchange delays apply</span></div>
    <div class="market-overview">
      <div><p class="market-kicker" ${price ? 'data-feed-instrument' : ''}>${price ? 'SPY / SPDR S&P 500 ETF Trust · USD' : 'S&P 500 / Companies & sectors'}</p><h2 id="${name}-title" ${price ? 'data-feed-name' : ''}>${price ? 'U.S. equities' : 'Beneath the index.'}</h2><p class="market-subtitle">${price ? 'Actual prices. A longer perspective.' : 'See where market moves are concentrated.'}</p></div>
    </div>
    ${price ? `<div class="market-toolbar"><div class="market-button-group" role="group" aria-label="Choose a market instrument"><button type="button" data-market-asset="equities" aria-pressed="true" disabled>Equities <span>SPY</span></button><button type="button" data-market-asset="bonds" aria-pressed="false" disabled>Treasuries <span>IEF</span></button><button type="button" data-market-asset="gold" aria-pressed="false" disabled>Gold <span>GLD</span></button></div><p class="market-feed-hint">Explore dates, chart styles & indicators inside the chart.</p></div>` : '<p class="market-feed-hint">Select a company or sector to explore. Use the toolbar to change the measure.</p>'}
    <div class="market-feed-host" data-feed-host><p class="market-feed-placeholder">${price ? 'Explore the price history of a real traded fund.' : 'Explore real companies, grouped by sector.'}</p></div>
    <div class="market-feed-connection"><p data-feed-status role="status">The interactive view connects when you reach this section.</p><button type="button" data-feed-retry hidden>Reload chart</button></div>
    <p class="market-source-link"><a data-feed-source href="${price ? 'https://www.tradingview.com/symbols/AMEX-SPY/' : 'https://www.tradingview.com/heatmap/stock/'}" target="_blank" rel="noopener">${price ? 'Open SPY on TradingView ↗' : 'Open the heatmap on TradingView ↗'}</a></p>
    <details class="market-methodology"><summary>About this data</summary>
      ${price ? '<p>SPY, IEF and GLD are traded funds representing U.S. large-cap equities, 7–10 year Treasury bonds and gold. The chart shows fund share prices in U.S. dollars, with the selected interval, volume and indicators supplied by TradingView. These are market observations, not Blue Line portfolio results.</p><p>Use the chart’s date controls and crosshair to inspect history. The chart identifies its feed, interval and adjustment settings. A price change is not a total return with distributions reinvested; IEF’s share price is not a Treasury yield.</p>' : '<p>This TradingView heatmap shows S&P 500 constituents grouped by sector. Initially, tile size represents company market capitalization and color represents the one-day percentage price change. The toolbar identifies the measure currently displayed; use it to explore other periods and metrics.</p><p>Market capitalization is not the same as an index weight. This is market context, not a Blue Line portfolio, a recommended allocation or a measure of client performance.</p>'}
      <p>Market data updates through TradingView. Exchange delays apply, and the latest available observation may be from the previous trading session. If a feed is unavailable, use the source link above. <a href="https://www.tradingview.com/widget-docs/faq/data/" target="_blank" rel="noopener">Data availability and delays ↗</a></p>
    </details>
    <noscript><p class="market-feed-nojs">Enable JavaScript for the interactive market view, or use the TradingView link above to view its source.</p></noscript>
  </div>
</section>`
}

const inventoryFile = new URL('../inventory.html', import.meta.url)
const homeFile = new URL('../index.html', import.meta.url)
const inventory = await readFile(inventoryFile, 'utf8')
const home = await readFile(homeFile, 'utf8')
let count = 0
const updated = inventory.replace(/<section class="market-demo(?: market-live)?"[\s\S]*?<\/section>/g, () => panel(count++ === 0 ? 'price' : 'heatmap'))
if (count !== 2) throw new Error('Expected exactly two research panels; source left unchanged.')
const marker = /<!-- HOME_MARKET_STUDY_START -->[\s\S]*?<!-- HOME_MARKET_STUDY_END -->/
if (!marker.test(home)) throw new Error('Homepage study markers are missing.')
await writeFile(inventoryFile, updated)
await writeFile(homeFile, home.replace(marker, `<!-- HOME_MARKET_STUDY_START -->\n${panel('price')}\n    <!-- HOME_MARKET_STUDY_END -->`))
console.log('Updated both routes with provider-hosted market charts and source links.')
