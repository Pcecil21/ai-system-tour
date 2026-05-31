// Guards are the single safety contract every motion layer reads. If these are wrong,
// the whole cinematic system can strand content or jank a phone — so they get tested first.
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prefersReducedMotion, detectWebGL, deviceTier, createGuards } from '../../src/motion/guards.js'

// Small helpers to fake the browser capabilities the guards probe.
function mockMatchMedia(reduce) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query.includes('prefers-reduced-motion') ? reduce : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

function mockHardware({ cores, mem }) {
  Object.defineProperty(navigator, 'hardwareConcurrency', { value: cores, configurable: true })
  Object.defineProperty(navigator, 'deviceMemory', { value: mem, configurable: true })
}

// detectWebGL calls canvas.getContext('webgl'); jsdom returns null, so we stub it per-test.
function mockWebGL(supported) {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((type) =>
    supported && type.includes('webgl') ? {} : null
  )
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('prefersReducedMotion', () => {
  it('is true when the OS requests reduced motion', () => {
    mockMatchMedia(true)
    expect(prefersReducedMotion()).toBe(true)
  })
  it('is false when the OS does not request reduced motion', () => {
    mockMatchMedia(false)
    expect(prefersReducedMotion()).toBe(false)
  })
})

describe('detectWebGL', () => {
  it('is true when a webgl context is available', () => {
    mockWebGL(true)
    expect(detectWebGL()).toBe(true)
  })
  it('is false when no webgl context is available', () => {
    mockWebGL(false)
    expect(detectWebGL()).toBe(false)
  })
})

describe('deviceTier', () => {
  it('returns low for weak hardware', () => {
    mockHardware({ cores: 2, mem: 2 })
    expect(deviceTier()).toBe('low')
  })
  it('returns high for strong hardware', () => {
    mockHardware({ cores: 16, mem: 16 })
    expect(deviceTier()).toBe('high')
  })
})

describe('createGuards', () => {
  it('AE1: reduced-motion disables motion AND webgl regardless of capability', () => {
    mockMatchMedia(true)
    mockWebGL(true)
    mockHardware({ cores: 16, mem: 16 })
    const g = createGuards()
    expect(g.motionEnabled).toBe(false)
    expect(g.webglEnabled).toBe(false)
    expect(g.reducedMotion).toBe(true)
  })

  it('AE2: no-WebGL disables webgl but leaves motion enabled', () => {
    mockMatchMedia(false)
    mockWebGL(false)
    mockHardware({ cores: 16, mem: 16 })
    const g = createGuards()
    expect(g.motionEnabled).toBe(true)
    expect(g.webglEnabled).toBe(false)
  })

  it('AE2: a low-tier device disables webgl even with motion on', () => {
    mockMatchMedia(false)
    mockWebGL(true)
    mockHardware({ cores: 2, mem: 2 })
    const g = createGuards()
    expect(g.motionEnabled).toBe(true)
    expect(g.webglEnabled).toBe(false)
  })

  it('a capable device with motion on enables everything', () => {
    mockMatchMedia(false)
    mockWebGL(true)
    mockHardware({ cores: 16, mem: 16 })
    const g = createGuards()
    expect(g.motionEnabled).toBe(true)
    expect(g.webglEnabled).toBe(true)
  })
})
