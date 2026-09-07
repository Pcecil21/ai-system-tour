// RETIRED prototype: preserved for recovery; never imported by the active website.
// Production uses marketFeeds.js. These invented observations are not published.
const weeklyValues = {
  equities: [
    100, 101.1, 100.6, 102.3, 103.1, 102.5, 104.2, 103.6, 105.1, 104.4, 106.2, 105.7, 107.3,
    106.4, 108.1, 107.5, 106.2, 104.9, 103.4, 105.2, 106.8, 108.3, 107.6, 109.4, 110.1, 108.7,
    107.2, 109.1, 111.3, 110.5, 112.1, 111.7, 113.8, 112.6, 111.2, 113.4, 114.1, 113.6, 115.2,
    116.3, 114.7, 115.9, 117.4, 116.8, 118.2, 117.1, 116.4, 118.3, 117.6, 119.1, 118.4, 119.8,
  ],
  bonds: [
    100, 100.2, 100.1, 100.5, 100.3, 100.6, 100.8, 100.4, 100.7, 101.1, 100.9, 101.3, 101.5,
    101.1, 101.4, 101.7, 101.2, 100.9, 100.6, 100.8, 101.2, 101.5, 101.8, 102.1, 101.7, 101.9,
    102.2, 102.5, 102.1, 102.4, 102.7, 102.3, 102.5, 102.8, 103.1, 102.7, 102.9, 103.2, 103.5,
    103.1, 103.4, 103.6, 103.2, 103.5, 103.8, 103.4, 103.7, 104, 103.6, 103.9, 104.2, 104.1,
  ],
  gold: [
    100, 101.4, 102.7, 101.2, 103.5, 102.4, 104.6, 106.1, 104.2, 105.8, 107.3, 106.1, 108.9,
    107.4, 109.6, 111.2, 109.7, 112.1, 113.4, 111.6, 110.2, 112.8, 114.3, 112.5, 115.2, 116.8,
    114.9, 113.3, 115.6, 117.4, 116.1, 118.7, 120.2, 118.5, 121.3, 119.6, 122.4, 120.8, 119.2,
    121.7, 123.5, 122.1, 124.8, 123.2, 122.6, 125.1, 123.7, 124.4, 122.8, 123.6, 121.5, 121.9,
  ],
}

export const ASSET_NAMES = Object.freeze({ equities: 'U.S. equities', bonds: 'U.S. Treasuries', gold: 'Gold' })
export const ASSET_CODES = Object.freeze({ equities: 'BL-EQ', bonds: 'BL-UST', gold: 'BL-AU' })
export const PRICE_PERIODS = Object.freeze({ '1m': 5, '3m': 13, '1y': 52 })
export const BREADTH_PERIOD_NAMES = Object.freeze({ '1d': '1 day', '1m': '1 month', '1y': '1 year' })
export const SECTORS = Object.freeze([
  { id: 'technology', name: 'Technology', returns: { '1d': 1.2, '1m': 4.8, '1y': 18.6 } },
  { id: 'industrials', name: 'Industrials', returns: { '1d': 0.6, '1m': 2.7, '1y': 11.4 } },
  { id: 'healthcare', name: 'Health care', returns: { '1d': -0.4, '1m': -1.4, '1y': 6.2 } },
  { id: 'energy', name: 'Energy', returns: { '1d': -1.2, '1m': -3.2, '1y': -4.8 } },
  { id: 'financials', name: 'Financials', returns: { '1d': 0.4, '1m': 1.9, '1y': 13.1 } },
  { id: 'consumer', name: 'Consumer', returns: { '1d': -0.2, '1m': 0.8, '1y': 9.7 } },
].map(sector => Object.freeze({ ...sector, returns: Object.freeze(sector.returns) })))

const firstWeek = Date.UTC(2025, 8, 1)
const oneWeek = 7 * 24 * 60 * 60 * 1000
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
})

export function formatObservationDate(date) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`))
}

export function formatReturn(value, digits = 1) {
  const rounded = Number(value.toFixed(digits))
  const sign = rounded > 0 ? '+' : rounded < 0 ? '−' : ''
  return `${sign}${Math.abs(rounded).toFixed(digits)}%`
}

export function getPriceSeries(asset, period) {
  if (!Object.hasOwn(ASSET_NAMES, asset) || !Object.hasOwn(PRICE_PERIODS, period)) {
    throw new RangeError('Unknown illustrative asset or period')
  }
  const phase = Object.keys(ASSET_NAMES).indexOf(asset) + 1
  const volumeBase = { equities: 58e6, bonds: 22e6, gold: 31e6 }[asset]
  // Invented OHLC and activity around the preserved model closes, not exchange prints.
  const observations = weeklyValues[asset].map((value, index, values) => {
    const previous = values[Math.max(0, index - 1)]
    const open = Number((previous * (1 + Math.sin(index * 1.71 + phase) * .0035)).toFixed(2))
    const high = Number((Math.max(open, value) * (1 + .003 + Math.abs(Math.sin(index + phase)) * .007)).toFixed(2))
    const low = Number((Math.min(open, value) * (1 - .003 - Math.abs(Math.cos(index * 1.3 + phase)) * .007)).toFixed(2))
    const volume = Math.round(volumeBase * (.72 + Math.abs(Math.sin(index * .73 + phase)) * .52 + Math.abs(value / previous - 1) * 14))
    const average = length => index + 1 < length ? null : values.slice(index + 1 - length, index + 1).reduce((a, b) => a + b, 0) / length
    return { value, open, high, low, volume, sma5: average(5), sma13: average(13), date: new Date(firstWeek + index * oneWeek).toISOString().slice(0, 10) }
  })
  return observations.map((point, index) => ({ ...point, relativeVolume: index < 13 ? null : point.volume / (observations.slice(index - 13, index).reduce((sum, item) => sum + item.volume, 0) / 13) })).slice(-PRICE_PERIODS[period])
}

export function formatVolume(value) { return `${(value / 1e6).toFixed(1)}M` }

export function getAssetAnalytics(asset, period) {
  const series = getPriceSeries(asset, period)
  const latest = series.at(-1)
  const changes = series.slice(1).map((point, index) => Math.log(point.value / series[index].value))
  const mean = changes.reduce((sum, value) => sum + value, 0) / changes.length
  const volatility = Math.sqrt(changes.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (changes.length - 1)) * Math.sqrt(52) * 100
  let peak = series[0].value, drawdown = 0
  for (const point of series) { peak = Math.max(peak, point.value); drawdown = Math.min(drawdown, (point.value / peak - 1) * 100) }
  return { volatility, drawdown, sma5: latest.sma5, sma13: latest.sma13, relativeVolume: latest.relativeVolume, volume: latest.volume }
}

export function getPriceSummary(series) {
  const values = series.map(point => point.value)
  return {
    first: series[0],
    last: series.at(-1),
    high: Math.max(...values),
    low: Math.min(...values),
    change: (series.at(-1).value / series[0].value - 1) * 100,
  }
}

// Match the rendered size so text and strokes remain legible on a narrow phone.
export function getPriceGeometry(series, { width = 900, height = 300 } = {}) {
  const compact = width < 600
  const bounds = { left: compact ? 46 : 58, right: width - (compact ? 18 : 24), top: 22, bottom: height - 34 }
  const summary = getPriceSummary(series)
  const padding = Math.max((summary.high - summary.low) * 0.14, 0.5)
  const extent = series.flatMap(point => [point.low ?? point.value, point.high ?? point.value, point.sma5 ?? point.value, point.sma13 ?? point.value])
  const minimum = Math.floor(Math.min(...extent) - padding)
  const maximum = Math.ceil(Math.max(...extent) + padding)
  const y = value => bounds.bottom - (value - minimum) / (maximum - minimum) * (bounds.bottom - bounds.top)
  const points = series.map((point, index) => ({
    ...point,
    x: bounds.left + index / (series.length - 1) * (bounds.right - bounds.left),
    y: y(point.value),
    openY: y(point.open ?? point.value), highY: y(point.high ?? point.value), lowY: y(point.low ?? point.value),
    sma5Y: point.sma5 === null || point.sma5 === undefined ? null : y(point.sma5),
    sma13Y: point.sma13 === null || point.sma13 === undefined ? null : y(point.sma13),
  }))
  const line = points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ')
  return {
    width, height, bounds, points, line,
    area: `${line} L${bounds.right},${bounds.bottom} L${bounds.left},${bounds.bottom} Z`,
    ticks: Array.from({ length: 5 }, (_, index) => {
      const value = minimum + (maximum - minimum) * index / 4
      return { value, y: y(value) }
    }),
  }
}

export function nearestPriceIndex(x, pointCount, bounds = { left: 58, right: 876 }) {
  const ratio = (x - bounds.left) / (bounds.right - bounds.left)
  return Math.max(0, Math.min(pointCount - 1, Math.round(ratio * (pointCount - 1))))
}

export function getBreadthSummary(period) {
  if (!Object.hasOwn(BREADTH_PERIOD_NAMES, period)) throw new RangeError('Unknown illustrative breadth period')
  const benchmark = SECTORS.reduce((sum, sector) => sum + sector.returns[period], 0) / SECTORS.length
  const ranking = [...SECTORS].sort((a, b) => b.returns[period] - a.returns[period])
  const rows = SECTORS.map(sector => ({ id: sector.id, name: sector.name, value: sector.returns[period], excess: sector.returns[period] - benchmark, rank: ranking.findIndex(item => item.id === sector.id) + 1, contribution: sector.returns[period] / SECTORS.length }))
  return {
    rows, benchmark,
    up: rows.filter(row => row.value > 0).length,
    down: rows.filter(row => row.value < 0).length,
  }
}

export function getBreadthGeometry(period, { width = 900, height = 260 } = {}) {
  const { rows } = getBreadthSummary(period)
  const maxValue = Math.max(...rows.map(row => Math.abs(row.value)))
  const step = 10 ** Math.floor(Math.log10(maxValue)) / 2
  const limit = Math.ceil(maxValue * 1.15 / step) * step
  const compact = width < 600
  const left = compact ? 112 : 174
  const right = width - (compact ? 51 : 80)
  const zero = (left + right) / 2
  const x = value => zero + value / limit * (right - left) / 2
  return {
    width, height, compact, zero,
    ticks: [-limit, -limit / 2, 0, limit / 2, limit].map(value => ({ value, x: x(value) })),
    rows: rows.map((row, index) => ({
      ...row, y: 27 + index * (height - 90) / 5, x: Math.min(zero, x(row.value)),
      width: Math.abs(x(row.value) - zero), end: x(row.value),
    })),
  }
}
