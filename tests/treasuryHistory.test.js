import { describe, expect, it } from 'vitest'
import { treasuryHistory, historyWindow, historySummary, historyGeometry, journeyLine, monthLabel } from '../src/treasuryHistory.js'

describe('Sourced Treasury history', () => {
  it('contains a complete, chronological monthly window, with finite yields', () => {
    expect(treasuryHistory).toHaveLength(264)
    treasuryHistory.forEach((point, i) => {
      expect(point.date).toBe(`${2004 + Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}-01`)
      expect(Number.isFinite(point.value)).toBe(true)
      expect(point.value).toBeGreaterThanOrEqual(0)
      expect(point.value).toBeLessThanOrEqual(6)
    })
  })
  it('retains the published endpoints, extrema and basis-point change', () => {
    const summary = historySummary(treasuryHistory)
    expect(summary.first).toEqual({ date: '2004-01-01', value: 4.15 })
    expect(summary.last).toEqual({ date: '2025-12-01', value: 4.14 })
    expect(summary.low).toEqual({ date: '2020-07-01', value: .62 })
    expect(summary.high.value).toBe(5.11)
    expect(summary.changeBps).toBe(-1)
  })
  it.each([['1', 12, '2025-01-01'], ['5', 60, '2021-01-01'], ['22', 264, '2004-01-01']])('selects %s trailing years without mutating the source', (years, length, first) => {
    const points = historyWindow(years)
    expect(points).toHaveLength(length)
    expect(points[0].date).toBe(first)
    expect(points.at(-1).date).toBe('2025-12-01')
    expect(points).not.toBe(treasuryHistory)
  })
  it('uses the same yield scale across windows', () => {
    const bounds = { x: 20, y: 10, width: 600, height: 300 }
    const long = historyGeometry(historyWindow('22'), bounds)
    const short = historyGeometry(historyWindow('1'), bounds)
    expect(long.at(-1)).toEqual(short.at(-1))
    expect(long.at(-1).y).toBeCloseTo(103)
    expect(short[0].x).toBe(20)
    expect(short.at(-1).x).toBe(620)
  })
  it('morphs to exact horizon, history and family endpoints', () => {
    const points = historyGeometry(treasuryHistory)
    const bounds = { width: 1440, height: 912, family: { x: 64, y: 400, width: 560 } }
    const horizon = journeyLine(points, 0, bounds), family = journeyLine(points, 1, bounds)
    expect(horizon.every(p => p.y === 912 * .535)).toBe(true)
    expect(horizon[0].x).toBe(0)
    expect(horizon.at(-1).x).toBe(1440)
    journeyLine(points, .49, bounds).forEach((point, i) => {
      expect(point.x).toBeCloseTo(points[i].x, 10)
      expect(point.y).toBeCloseTo(points[i].y, 10)
    })
    expect(family[0]).toEqual({ x: 64, y: 400 })
    expect(family.at(-1)).toEqual({ x: 624, y: 400 })
  })
  it('formats monthly observations without local timezone drift', () => {
    expect(monthLabel('2025-01-01')).toBe('Jan 2025')
  })
})
