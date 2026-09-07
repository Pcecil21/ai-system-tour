import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  ASSET_NAMES, PRICE_PERIODS, BREADTH_PERIOD_NAMES, SECTORS,
  getPriceSeries, getPriceSummary, getPriceGeometry, nearestPriceIndex,
  getBreadthSummary, getBreadthGeometry, formatObservationDate, formatReturn, getAssetAnalytics,
} from '../src/marketDemoData.js'
import { initMarketDemos } from '../src/marketDemo.js'

describe('illustrative market observations', () => {
  it('keeps candle envelopes and volume coherent with preserved closes', () => {
    for (const asset of Object.keys(ASSET_NAMES)) {
      const series = getPriceSeries(asset, '1y')
      series.forEach(point => {
        expect(point.low).toBeLessThanOrEqual(Math.min(point.open, point.value))
        expect(point.high).toBeGreaterThanOrEqual(Math.max(point.open, point.value))
        expect(point.volume).toBeGreaterThan(0)
        expect(Number.isInteger(point.volume)).toBe(true)
      })
      for (const period of Object.keys(PRICE_PERIODS)) {
        const geometry = getPriceGeometry(getPriceSeries(asset, period), { width: 272, height: 260 })
        geometry.points.forEach(point => {
          for (const key of ['openY', 'highY', 'lowY', 'sma5Y', 'sma13Y']) {
            if (point[key] === null) continue
            expect(point[key]).toBeGreaterThanOrEqual(geometry.bounds.top)
            expect(point[key]).toBeLessThanOrEqual(geometry.bounds.bottom)
          }
        })
      }
    }
  })

  it('uses preceding history for studies and excludes current volume from its baseline', () => {
    const year = getPriceSeries('gold', '1y')
    expect(year[3].sma5).toBeNull()
    expect(year[11].sma13).toBeNull()
    expect(year[12].relativeVolume).toBeNull()
    expect(year[4].sma5).toBeCloseTo(101.76)
    expect(getPriceSeries('gold', '1m')[0].sma13).toBe(year[47].sma13)
    const priorVolumes = year.slice(-14, -1).map(point => point.volume)
    expect(year.at(-1).relativeVolume).toBeCloseTo(year.at(-1).volume * 13 / priorVolumes.reduce((a, b) => a + b))
    expect(year.at(-1).sma5).toBeCloseTo(122.84)
  })

  it('matches independently calculated risk for the five-close gold window', () => {
    // Closes: 124.4, 122.8, 123.6, 121.5, 121.9. Sample SD of four log returns, annualized.
    const analytics = getAssetAnalytics('gold', '1m')
    expect(analytics.volatility).toBeCloseTo(8.4420644754, 8)
    expect(analytics.drawdown).toBeCloseTo(-2.3311897106, 8)
    expect(analytics.sma5).toBeCloseTo(122.84)
  })

  it('reconciles sector contribution and relative returns with the equal-weight benchmark', () => {
    const month = getBreadthSummary('1m')
    expect(month.benchmark).toBeCloseTo(5.6 / 6)
    expect(month.rows[0].rank).toBe(1)
    expect(month.rows[0].contribution).toBeCloseTo(.8)
    expect(month.rows[0].excess).toBeCloseTo(3.8666666667)
    expect(formatReturn(month.benchmark, 2)).toBe('+0.93%')
    for (const period of Object.keys(BREADTH_PERIOD_NAMES)) {
      const { rows, benchmark } = getBreadthSummary(period)
      expect(rows.reduce((sum, row) => sum + row.contribution, 0)).toBeCloseTo(benchmark)
      expect(rows.reduce((sum, row) => sum + row.excess, 0)).toBeCloseTo(0)
      expect(rows.toSorted((a, b) => b.value - a.value).map(row => row.rank)).toEqual([1, 2, 3, 4, 5, 6])
    }
  })
  it('keeps all assets fixed to the same 52 weekly dates and original index basis', () => {
    for (const asset of Object.keys(ASSET_NAMES)) {
      const series = getPriceSeries(asset, '1y')
      expect(series).toHaveLength(52)
      expect(series[0]).toMatchObject({ date: '2025-09-01', value: 100 })
      expect(series.at(-1).date).toBe('2026-08-24')
      series.slice(1).forEach((point, index) => {
        expect(Date.parse(point.date) - Date.parse(series[index].date)).toBe(7 * 86400000)
      })
      for (const [period, length] of Object.entries(PRICE_PERIODS)) {
        expect(getPriceSeries(asset, period)).toEqual(series.slice(-length))
      }
    }
  })

  it('calculates actual selected-window change and extrema, including a down window', () => {
    const goldMonth = getPriceSummary(getPriceSeries('gold', '1m'))
    expect(goldMonth.first.value).toBe(124.4)
    expect(goldMonth.last.value).toBe(121.9)
    expect(goldMonth.high).toBe(124.4)
    expect(goldMonth.low).toBe(121.5)
    expect(goldMonth.change).toBeCloseTo(-2.0096463)
    expect(formatReturn(goldMonth.change)).toBe('−2.0%')
    expect(formatReturn(getPriceSummary(getPriceSeries('equities', '1y')).change)).toBe('+19.8%')
    expect(formatReturn(-0.001)).toBe('0.0%')
    expect(formatObservationDate('2025-09-01')).toBe('Sep 1, 2025')
  })

  it('maps every point inside chart bounds and clamps pointer inspection', () => {
    for (const asset of Object.keys(ASSET_NAMES)) {
      for (const period of Object.keys(PRICE_PERIODS)) {
        const geometry = getPriceGeometry(getPriceSeries(asset, period))
        for (const point of geometry.points) {
          expect(point.x).toBeGreaterThanOrEqual(58)
          expect(point.x).toBeLessThanOrEqual(876)
          expect(point.y).toBeGreaterThan(22)
          expect(point.y).toBeLessThan(266)
        }
        expect(nearestPriceIndex(-500, geometry.points.length)).toBe(0)
        expect(nearestPriceIndex(2000, geometry.points.length)).toBe(geometry.points.length - 1)
        geometry.points.forEach((point, index) => expect(nearestPriceIndex(point.x, geometry.points.length)).toBe(index))
      }
    }
  })

  it('summarizes sector breadth and maps negative returns to the left of zero', () => {
    expect(getBreadthSummary('1d')).toMatchObject({ up: 3, down: 3 })
    expect(getBreadthSummary('1m')).toMatchObject({ up: 4, down: 2 })
    expect(getBreadthSummary('1y')).toMatchObject({ up: 5, down: 1 })
    for (const period of Object.keys(BREADTH_PERIOD_NAMES)) {
      const geometry = getBreadthGeometry(period)
      for (const row of geometry.rows) {
        expect(row.width).toBeGreaterThan(0)
        expect(row.x).toBeGreaterThan(174)
        expect(row.x + row.width).toBeLessThan(820)
        expect(row.value < 0 ? row.end < geometry.zero : row.end > geometry.zero).toBe(true)
      }
    }
  })

  it('keeps narrow-screen chart geometry and labels inside the actual viewport', () => {
    const price = getPriceGeometry(getPriceSeries('bonds', '3m'), { width: 272, height: 240 })
    expect(price.bounds).toEqual({ left: 46, right: 254, top: 22, bottom: 206 })
    price.points.forEach((point, index) => {
      expect(point.x).toBeLessThanOrEqual(254)
      expect(nearestPriceIndex(point.x, price.points.length, price.bounds)).toBe(index)
    })
    const breadth = getBreadthGeometry('1m', { width: 272, height: 280 })
    breadth.rows.forEach(row => {
      expect(row.x).toBeGreaterThan(112)
      expect(row.x + row.width).toBeLessThan(221)
      expect(row.y).toBeLessThan(240)
    })
  })

  it('rejects unknown selectors and returns independent observations', () => {
    expect(() => getPriceSeries('not-an-asset', '1y')).toThrow(RangeError)
    expect(() => getPriceSeries('equities', '2y')).toThrow(RangeError)
    expect(() => getBreadthSummary('now')).toThrow(RangeError)
    const series = getPriceSeries('equities', '1y')
    series[0].value = -999
    expect(getPriceSeries('equities', '1y')[0].value).toBe(100)
  })
})

const priceOutputs = ['asset-name', 'index-value', 'change', 'high', 'low', 'observation-date', 'observation-value', 'range-start', 'range-end', 'ohlc-open', 'ohlc-high', 'ohlc-low', 'ohlc-close', 'observation-volume']
const breadthOutputs = ['sector-name', 'sector-value', 'sector-period', 'market-up', 'market-down', 'sector-benchmark', 'selected-excess', 'selected-contribution', 'selected-rank']

beforeEach(() => {
  document.body.innerHTML = `
    <section data-market-chart>
      ${Object.keys(ASSET_NAMES).map(asset => `<button data-asset="${asset}" disabled>${asset}</button>`).join('')}
      ${Object.keys(PRICE_PERIODS).map(period => `<button data-period="${period}" disabled>${period}</button>`).join('')}
      <svg data-price-svg viewBox="0 0 900 300"></svg>
      <svg data-volume-svg></svg>
      <button data-chart-view="candles" aria-pressed="true" disabled>Candles</button>
      <button data-chart-view="line" aria-pressed="false" disabled>Line</button>
      <button data-average-toggle aria-pressed="true" disabled>Averages</button>
      <input type="range" min="0" step="1" data-price-scrubber disabled>
      ${priceOutputs.map(name => `<output data-${name}></output>`).join('')}
    </section>
    <section data-market-breadth>
      ${SECTORS.map(sector => `<button data-sector="${sector.id}" disabled>${sector.name}<span data-sector-return></span></button>`).join('')}
      ${Object.keys(BREADTH_PERIOD_NAMES).map(period => `<button data-breadth-period="${period}" disabled>${period}</button>`).join('')}
      <svg data-sector-svg viewBox="0 0 900 260"></svg>
      ${breadthOutputs.map(name => `<output data-${name}></output>`).join('')}
    </section>`
})

afterEach(() => vi.unstubAllGlobals())

describe('market demo controls', () => {
  it('preserves inspection and overlays when switching chart presentations', () => {
    initMarketDemos()
    expect(document.querySelector('[data-price-candles]').getAttribute('display')).toBe('inline')
    expect(document.querySelectorAll('[data-candle]')).toHaveLength(52)
    const scrubber = document.querySelector('[data-price-scrubber]')
    scrubber.value = '10'
    scrubber.dispatchEvent(new Event('input'))
    const date = document.querySelector('[data-observation-date]').textContent
    const point = getPriceSeries('equities', '1y')[10]
    expect(document.querySelector('[data-ohlc-open]').textContent).toBe(point.open.toFixed(2))
    expect(document.querySelector('[data-volume-bar="10"]').getAttribute('opacity')).toBe('1')
    document.querySelector('[data-average-toggle]').click()
    const line = document.querySelector('[data-chart-view="line"]')
    line.focus()
    line.click()
    expect(document.activeElement).toBe(line)
    expect(scrubber.value).toBe('10')
    expect(document.querySelector('[data-observation-date]').textContent).toBe(date)
    expect(document.querySelector('[data-price-candles]').getAttribute('display')).toBe('none')
    expect(document.querySelector('[data-price-line]').style.display).toBe('')
    expect([...document.querySelectorAll('[data-moving-average]')].every(path => path.getAttribute('display') === 'none')).toBe(true)
    document.querySelector('[data-asset="gold"]').click()
    expect(line.getAttribute('aria-pressed')).toBe('true')
    expect(document.querySelector('[data-moving-average]').getAttribute('display')).toBe('none')
    document.querySelector('[data-average-toggle]').click()
    expect(document.querySelector('[data-moving-average]').getAttribute('display')).toBe('inline')
  })
  it('initializes consistent accessible defaults and allows keyboard-range inspection', () => {
    initMarketDemos()
    expect(document.querySelectorAll(':disabled')).toHaveLength(0)
    expect(document.querySelector('[data-index-value]').textContent).toBe('119.8')
    expect(document.querySelector('[data-change]').textContent).toBe('+19.8%')
    const scrubber = document.querySelector('[data-price-scrubber]')
    expect(scrubber.max).toBe('51')
    expect(scrubber.value).toBe('51')
    scrubber.value = '0'
    scrubber.dispatchEvent(new Event('input'))
    expect(document.querySelector('[data-observation-value]').textContent).toBe('100.0')
    expect(scrubber.getAttribute('aria-valuetext')).toBe('Sep 1, 2025: 100.0 index points')
    expect(document.querySelector('[data-price-point]').getAttribute('cx')).toBe('58')
  })

  it('retains native button focus and selected asset when changing price periods', () => {
    initMarketDemos()
    document.querySelector('[data-asset="gold"]').click()
    const month = document.querySelector('[data-period="1m"]')
    month.focus()
    month.click()
    expect(document.activeElement).toBe(month)
    expect(document.querySelector('[data-asset="gold"]').getAttribute('aria-pressed')).toBe('true')
    expect(document.querySelectorAll('[data-period][aria-pressed="true"]')).toHaveLength(1)
    expect(document.querySelector('[data-change]').textContent).toBe('−2.0%')
    expect(document.querySelector('[data-change]').dataset.direction).toBe('down')
    expect(document.querySelector('[data-price-scrubber]').max).toBe('4')
    expect(document.querySelector('[data-range-start]').textContent).toBe('Jul 27, 2026')
  })

  it('uses distinct date and value tick labels for the smallest price window', () => {
    initMarketDemos()
    document.querySelector('[data-asset="bonds"]').click()
    document.querySelector('[data-period="1m"]').click()
    const labels = [...document.querySelectorAll('[data-price-svg] text')].map(label => label.textContent)
    expect(new Set(labels.slice(0, 5)).size).toBe(5)
    expect(labels.slice(5)).toEqual(['Jul 27', 'Aug 10', 'Aug 24'])
    expect(document.querySelector('[data-asset-name]').textContent).toBe('U.S. Treasuries')
    expect(document.querySelector('[data-price-svg]').getAttribute('aria-label')).toContain('Inspect an observation slider')
  })

  it('updates all sector returns and counts while preserving the selected sector', () => {
    initMarketDemos()
    expect(document.querySelector('[data-sector-value]').textContent).toBe('+4.8%')
    document.querySelector('[data-sector="healthcare"]').click()
    expect(document.querySelector('[data-sector-value]').textContent).toBe('−1.4%')
    document.querySelector('[data-breadth-period="1y"]').click()
    expect(document.querySelector('[data-sector-name]').textContent).toBe('Health care')
    expect(document.querySelector('[data-sector-value]').textContent).toBe('+6.2%')
    expect(document.querySelector('[data-sector-period]').textContent).toBe('1 year')
    expect(document.querySelector('[data-market-up]').textContent).toBe('5')
    expect(document.querySelector('[data-market-down]').textContent).toBe('1')
    expect(document.querySelector('[data-sector="healthcare"]').dataset.direction).toBe('up')
    expect(document.querySelector('[data-sector="energy"] [data-sector-return]').textContent).toBe('−4.8%')
    expect(document.querySelectorAll('[data-sector][aria-pressed="true"]')).toHaveLength(1)
    expect(document.querySelectorAll('[data-sector-svg] rect')).toHaveLength(6)
  })

  it('resizes without resetting the inspected point, period, or sector', () => {
    const resizeCallbacks = []
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback) { resizeCallbacks.push(callback) }
      observe() {}
    })
    initMarketDemos()
    document.querySelector('[data-asset="gold"]').click()
    document.querySelector('[data-period="1m"]').click()
    document.querySelector('[data-sector="energy"]').click()
    document.querySelector('[data-breadth-period="1y"]').click()
    const scrubber = document.querySelector('[data-price-scrubber]')
    scrubber.value = '1'
    scrubber.dispatchEvent(new Event('input'))
    const priceSvg = document.querySelector('[data-price-svg]')
    const breadthSvg = document.querySelector('[data-sector-svg]')
    for (const [svg, height] of [[priceSvg, 240], [breadthSvg, 280]]) {
      Object.defineProperties(svg, { clientWidth: { value: 272 }, clientHeight: { value: height } })
    }
    resizeCallbacks.forEach(callback => callback())
    expect(priceSvg.getAttribute('viewBox')).toBe('0 0 272 240')
    expect(breadthSvg.getAttribute('viewBox')).toBe('0 0 272 280')
    expect(scrubber.value).toBe('1')
    expect(document.querySelector('[data-observation-value]').textContent).toBe('122.8')
    expect(document.querySelector('[data-asset-name]').textContent).toBe('Gold')
    expect(document.querySelector('[data-sector-name]').textContent).toBe('Energy')
    expect(document.querySelector('[data-sector-value]').textContent).toBe('−4.8%')
    expect(document.querySelector('[data-sector-period]').textContent).toBe('1 year')
  })
})
