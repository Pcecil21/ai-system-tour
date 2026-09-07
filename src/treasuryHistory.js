import observations from './data/treasury-history.json' with { type: 'json' }

export const HISTORY_WINDOWS = { '1': 12, '5': 60, '22': 264 }
export const treasuryHistory = observations
export const monthLabel = date => new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))

export function historyWindow(years = '22') {
  return observations.slice(-(HISTORY_WINDOWS[years] || HISTORY_WINDOWS['22']))
}

export function historySummary(points) {
  const low = points.reduce((a, b) => a.value <= b.value ? a : b)
  const high = points.reduce((a, b) => a.value >= b.value ? a : b)
  return { low, high, first: points[0], last: points.at(-1), changeBps: Math.round((points.at(-1).value - points[0].value) * 100) }
}

// Every window shares a zero-to-six-percent yield axis. These are yields, not returns.
export function historyGeometry(points, { x = 44, y = 20, width = 800, height = 260 } = {}) {
  return points.map((point, index) => ({ ...point, x: x + width * index / (points.length - 1), y: y + height * (1 - point.value / 6) }))
}

export const linePath = points => points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')
export const mix = (a, b, t) => a + (b - a) * Math.min(1, Math.max(0, t))
export const smoothStep = t => { const p = Math.min(1, Math.max(0, t)); return p * p * (3 - 2 * p) }

export function journeyLine(points, progress, { width, height, family }) {
  const enter = smoothStep((progress - .12) / .25)
  const leave = smoothStep((progress - .66) / .26)
  return points.map((point, i) => {
    const fraction = i / (points.length - 1)
    const x = mix(fraction * width, point.x, enter)
    const y = mix(height * .535, point.y, enter)
    return { x: mix(x, family.x + family.width * fraction, leave), y: mix(y, family.y, leave) }
  })
}
