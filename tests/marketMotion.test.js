import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMarketMotion, priceTransition } from '../src/marketMotion.js'
import { getPriceGeometry, getPriceSeries } from '../src/marketDemoData.js'

let element, preference, frames, time, frameId, observer
beforeEach(() => {
  time = 0; frameId = 0; frames = new Map()
  element = document.createElement('div')
  element.getBoundingClientRect = () => ({ width: 342, top: 100, bottom: 380 })
  preference = new EventTarget()
  preference.matches = false
  vi.stubGlobal('matchMedia', () => preference)
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
  vi.spyOn(performance, 'now').mockImplementation(() => time)
  vi.stubGlobal('requestAnimationFrame', callback => { frames.set(++frameId, callback); return frameId })
  vi.stubGlobal('cancelAnimationFrame', id => frames.delete(id))
  vi.stubGlobal('IntersectionObserver', class { constructor(callback) { observer = callback } observe() {} })
})
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })
function tick(now) {
  time = now
  const pending = [...frames.values()]
  frames.clear()
  pending.forEach(callback => callback(now))
}

describe('finite market motion', () => {
  it('finishes at the exact selected state and schedules no idle frames', () => {
    const motion = createMarketMotion(element), draw = vi.fn()
    motion.run('plot', draw, 500)
    expect(draw).toHaveBeenLastCalledWith(0)
    tick(250); expect(draw).toHaveBeenLastCalledWith(.5)
    tick(500); expect(draw).toHaveBeenLastCalledWith(1)
    expect(frames.size).toBe(0)
  })

  it('cancels superseded frames without overwriting the latest selection', () => {
    const motion = createMarketMotion(element), old = vi.fn(), latest = vi.fn()
    motion.run('plot', old, 500)
    const obsolete = [...frames.values()][0]
    tick(100)
    motion.run('plot', latest, 500)
    obsolete(300)
    expect(old).toHaveBeenLastCalledWith(.2)
    expect(frames.size).toBe(1)
    tick(600)
    expect(latest).toHaveBeenLastCalledWith(1)
    expect(frames.size).toBe(0)
  })

  it('renders immediately for reduced motion and finishes in flight on preference change', () => {
    const motion = createMarketMotion(element), draw = vi.fn()
    preference.matches = true
    motion.run('plot', draw, 500)
    expect(draw.mock.calls).toEqual([[1]])
    expect(frames.size).toBe(0)
    preference.matches = false
    motion.run('plot', draw, 500)
    tick(100)
    preference.matches = true
    preference.dispatchEvent(new Event('change'))
    expect(draw).toHaveBeenLastCalledWith(1)
    expect(frames.size).toBe(0)
  })

  it('settles hidden/offscreen animations and reveals a chart only once', () => {
    const motion = createMarketMotion(element), draw = vi.fn()
    const reveal = vi.fn(() => motion.run('intro', draw, 500))
    motion.revealOnce(reveal)
    observer([{ isIntersecting: true }]); tick(100)
    observer([{ isIntersecting: false }])
    expect(draw).toHaveBeenLastCalledWith(1)
    expect(frames.size).toBe(0)
    observer([{ isIntersecting: true }])
    expect(reveal).toHaveBeenCalledTimes(1)
    motion.run('plot', draw, 500)
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    document.dispatchEvent(new Event('visibilitychange'))
    expect(draw).toHaveBeenLastCalledWith(1)
    expect(frames.size).toBe(0)
    element.getBoundingClientRect = () => ({ width: 342, top: -400, bottom: -100 })
    motion.run('plot', draw, 500)
    expect(frames.size).toBe(0)
  })

  it('retains polyline detail and bounds across rapid transitions of different lengths', () => {
    const long = getPriceGeometry(getPriceSeries('equities', '1y')).points
    const short = getPriceGeometry(getPriceSeries('gold', '1m')).points
    const transition = priceTransition(long, short)
    for (const [source, progress] of [[long, 0], [short, 1]]) {
      for (const point of source) {
        const result = transition(progress).find(item => Math.abs(item.x - point.x) < 1e-7)
        expect(result.y).toBeCloseTo(point.y, 6)
      }
    }
    let current = long
    for (let index = 0; index < 40; index++) {
      current = priceTransition(current, index % 2 ? long : short)(.4)
      expect(current.length).toBeLessThan(70)
      expect(current.every(point => Number.isFinite(point.y) && point.x >= 58 && point.x <= 876)).toBe(true)
    }
  })
})
