import { describe, it, expect } from 'vitest'
import { STOPS, sampleArc, lerpHex, contrastRatio } from '../../src/motion/lightArc.js'

describe('lerpHex', () => {
  it('returns the endpoints at t=0 and t=1', () => {
    expect(lerpHex('#000000', '#ffffff', 0)).toBe('#000000')
    expect(lerpHex('#000000', '#ffffff', 1)).toBe('#ffffff')
  })
  it('returns the midpoint at t=0.5', () => {
    expect(lerpHex('#000000', '#ffffff', 0.5)).toBe('#808080')
  })
})

describe('sampleArc — no-jar rule', () => {
  it('dawn (progress 0) equals today’s site.css palette exactly', () => {
    const dawn = sampleArc(0)
    expect(dawn.paper).toBe('#efeee8')
    expect(dawn.ink).toBe('#1a1c14')
    expect(dawn.accent).toBe('#5e6b2f')
  })

  it('Covers AE4. night (progress 1) resolves to the final night stop', () => {
    const night = sampleArc(1)
    const last = STOPS[STOPS.length - 1]
    expect(night.paper).toBe(last.paper)
    expect(night.ink).toBe(last.ink)
  })

  it('clamps out-of-range progress', () => {
    expect(sampleArc(-0.5).paper).toBe(sampleArc(0).paper)
    expect(sampleArc(1.5).paper).toBe(sampleArc(1).paper)
  })

  it('warms perceptibly by golden hour (paper differs from dawn)', () => {
    expect(sampleArc(0.6).paper).not.toBe(sampleArc(0).paper)
  })
})

describe('legibility invariant (R13)', () => {
  it('ink-on-paper contrast stays comfortably readable at every keyframe stop', () => {
    for (const stop of STOPS) {
      const ratio = contrastRatio(stop.ink, stop.paper)
      // WCAG AA body text is 4.5:1; our editorial type is large, but hold a high bar anyway.
      expect(ratio).toBeGreaterThan(7)
    }
  })

  it('ink-on-paper contrast holds across the continuous sweep, not just at stops', () => {
    for (let p = 0; p <= 1.0001; p += 0.1) {
      const s = sampleArc(p)
      expect(contrastRatio(s.ink, s.paper)).toBeGreaterThan(7)
    }
  })
})
