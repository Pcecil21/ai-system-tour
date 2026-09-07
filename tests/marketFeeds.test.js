import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { MARKET_ASSETS, marketWidgetConfig, initMarketFeeds } from '../src/marketFeeds.js'

const panel = `<section data-market-feed="price"><h2 data-feed-name>U.S. equities</h2><p data-feed-instrument></p><button data-market-asset="equities" aria-pressed="true" disabled>Equities</button><button data-market-asset="gold" aria-pressed="false" disabled>Gold</button><div data-feed-host></div><p data-feed-status></p><a data-feed-source></a><button data-feed-retry hidden>Reload chart</button></section>`
const script = () => document.querySelector('[data-feed-host] script')
const config = () => JSON.parse(script().textContent)

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('IntersectionObserver', undefined)
  document.body.innerHTML = panel
})
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals() })

describe('provider-hosted market data', () => {
  it('maps all three controls to explicit traded funds and matching source links', () => {
    expect(Object.values(MARKET_ASSETS).map(x => x.symbol)).toEqual(['AMEX:SPY', 'NASDAQ:IEF', 'AMEX:GLD'])
    for (const [key, value] of Object.entries(MARKET_ASSETS)) {
      expect(marketWidgetConfig('price', key).symbol).toBe(value.symbol)
      expect(value.url).toContain(value.symbol.replace(':', '-'))
    }
    expect(marketWidgetConfig('heatmap')).toMatchObject({dataSource:'SPX500', blockColor:'change', blockSize:'market_cap_basic'})
    expect(() => marketWidgetConfig('price', 'bogus')).toThrow(RangeError)
    expect(() => marketWidgetConfig('bogus')).toThrow(RangeError)
  })
  it('never requests a chart while the homepage disclosure is closed', () => {
    document.body.innerHTML = `<details>${panel}</details>`
    initMarketFeeds()
    expect(script()).toBeNull()
    const details = document.querySelector('details')
    details.open = true
    details.dispatchEvent(new Event('toggle'))
    expect(config().symbol).toBe('AMEX:SPY')
  })
  it('lazy loads once when the panel approaches the viewport', () => {
    let intersect
    const disconnect = vi.fn()
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback) { intersect = callback }
      observe() {}
      disconnect() { disconnect() }
    })
    initMarketFeeds()
    expect(script()).toBeNull()
    intersect([{isIntersecting:true}])
    const first = script()
    intersect([{isIntersecting:true}])
    expect(script()).toBe(first)
    expect(disconnect).toHaveBeenCalled()
  })
  it('changes the instrument, source and chart together without moving button focus', () => {
    initMarketFeeds()
    const button = document.querySelector('[data-market-asset="gold"]')
    button.focus(); button.click()
    expect(document.activeElement).toBe(button)
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(config().symbol).toBe('AMEX:GLD')
    expect(document.querySelector('[data-feed-source]').href).toContain('AMEX-GLD')
    expect(document.querySelector('[data-feed-instrument]').textContent).toContain('GLD / SPDR Gold Shares')
    expect(document.querySelectorAll('script')).toHaveLength(1)
  })
  it('offers a real source on failure and retries without manufacturing a quote', () => {
    initMarketFeeds()
    script().dispatchEvent(new Event('error'))
    expect(document.querySelector('[data-market-feed]').dataset.feedState).toBe('unavailable')
    expect(document.querySelector('[data-feed-status]').textContent).toContain('could not connect')
    expect(document.querySelector('[data-feed-source]').href).toBe(MARKET_ASSETS.equities.url)
    document.querySelector('[data-feed-retry]').click()
    expect(document.querySelector('[data-market-feed]').dataset.feedState).toBe('loading')
    expect(document.querySelectorAll('script')).toHaveLength(1)
    vi.advanceTimersByTime(15000)
    expect(document.querySelector('[data-feed-status]').textContent).toContain('Taking longer')
  })
  it('ignores late failures from an obsolete instrument request', () => {
    initMarketFeeds()
    const oldScript = script()
    document.querySelector('[data-market-asset="gold"]').click()
    oldScript.dispatchEvent(new Event('error'))
    expect(document.querySelector('[data-market-feed]').dataset.feedState).toBe('loading')
    expect(config().symbol).toBe('AMEX:GLD')
  })
  it('titles provider frames and does not equate frame loading with a live quote', async () => {
    initMarketFeeds()
    const frame = document.createElement('iframe')
    document.querySelector('.tradingview-widget-container__widget').append(frame)
    await Promise.resolve()
    expect(frame.title).toBe('SPY market chart by TradingView')
    frame.dispatchEvent(new Event('load'))
    expect(document.querySelector('[data-market-feed]').dataset.feedState).toBe('embedded')
    expect(document.querySelector('[data-feed-status]').textContent).toContain('exchange delays apply')
    vi.advanceTimersByTime(16000)
    expect(document.querySelector('[data-market-feed]').dataset.feedState).toBe('embedded')
  })
  it('does not duplicate widgets on repeated initialization', () => {
    initMarketFeeds(); const first = script(); initMarketFeeds()
    expect(script()).toBe(first)
  })
  it('ships source links and no invented numeric fallback on either route', () => {
    for (const path of ['../index.html', '../inventory.html']) {
      const html = readFileSync(new URL(path, import.meta.url), 'utf8')
      const panels = html.match(/<section class="market-demo market-live"[\s\S]*?<\/section>/g)
      expect(panels.length).toBe(path.includes('inventory') ? 2 : 1)
      for (const markup of panels) {
        expect(markup).not.toMatch(/simulat|fictional|modeled|119\.8|data-index-value/i)
        expect(markup).toContain('data-feed-source')
        expect(markup).toContain('<noscript>')
        expect(markup).toContain('exchange delays apply')
      }
    }
    expect(readFileSync('src/marketDemoEntry.js', 'utf8')).not.toContain("'./marketDemo.js'")
  })
})
