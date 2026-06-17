// lightArc.js — the day→night light arc. The signature concept of the redesign.
//
// As the visitor scrolls, the page's palette tweens through a day: dawn cream at the top,
// warming to golden hour mid-page, cooling to dusk as it approaches the (already dark)
// lower sections, which read as night. It works by interpolating the brand color tokens
// on :root, so every rule that already uses --paper / --ink / --accent re-tints for free.
//
// Two hard rules:
//   1. The dawn stop (progress 0) is EXACTLY today's site.css palette — an un-scrolled page
//      looks identical to before. Nothing jars.
//   2. Ink stays dark against a light paper at every stop, so text never loses contrast.

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Note: gsap.registerPlugin(ScrollTrigger) is called inside initLightArc (browser-only),
// NOT at module top level — so the pure color/sample helpers below stay import-safe for
// unit tests, which run in jsdom where ScrollTrigger can't initialize.

// Keyframe stops along the scroll (0 = top of page, 1 = bottom). Each carries the palette
// at that moment of "day". The light upper sections occupy roughly 0..0.65, so the
// perceptible warm→dim shift is concentrated there; the hardcoded-dark lower sections cover
// the rest and read as the night the arc has been leading toward.
//
// `at` must be ascending. The 0.0 stop equals site.css verbatim (the no-jar rule).
export const STOPS = [
  { at: 0.0,  paper: '#efeee8', paper2: '#e6e4d8', ink: '#1a1c14', ink2: '#3d3a34', muted: '#7a7568', accent: '#5e6b2f' }, // dawn (= today)
  { at: 0.22, paper: '#f4f2ea', paper2: '#eae7dc', ink: '#1a1c14', ink2: '#3d3a34', muted: '#7a7568', accent: '#5e6b2f' }, // morning — brightest
  { at: 0.42, paper: '#f1ece1', paper2: '#e7e1d2', ink: '#1d190f', ink2: '#403829', muted: '#837962', accent: '#646f2c' }, // midday
  { at: 0.60, paper: '#f3e7d2', paper2: '#e8d9be', ink: '#221d12', ink2: '#473f2c', muted: '#8a7f62', accent: '#74702c' }, // golden hour — warm
  { at: 0.78, paper: '#dad2c1', paper2: '#cdc4b0', ink: '#1a1c14', ink2: '#3d3a34', muted: '#6f6a5c', accent: '#5e6b2f' }, // dusk — warm-deep (M1: was cool-grey; warmed to match the espresso register)
  { at: 1.0,  paper: '#d0c6b2', paper2: '#c2b8a2', ink: '#1a1c14', ink2: '#3d3a34', muted: '#6a655a', accent: '#5e6b2f' }, // night — warm taupe deep (M1: was cool-grey #cfccc3)
]

const TOKENS = ['paper', 'paper2', 'ink', 'ink2', 'muted', 'accent']

// --- pure color helpers (exported for testing) ---

export function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export function rgbToHex(r, g, b) {
  const c = (n) => Math.round(n).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

export function lerpHex(a, b, t) {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t)
}

// Relative luminance (WCAG) — used to assert the legibility invariant in tests.
export function luminance(hex) {
  const srgb = hexToRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.4152 * srgb[2]
}

export function contrastRatio(a, b) {
  const la = luminance(a), lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

// Sample the palette at a scroll progress in [0,1]. Finds the bracketing stops and lerps
// each token between them. Returns an object keyed by token name.
export function sampleArc(progress) {
  const p = Math.max(0, Math.min(1, progress))
  let lo = STOPS[0], hi = STOPS[STOPS.length - 1]
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (p >= STOPS[i].at && p <= STOPS[i + 1].at) {
      lo = STOPS[i]; hi = STOPS[i + 1]; break
    }
  }
  const span = hi.at - lo.at || 1
  const t = (p - lo.at) / span
  const out = {}
  for (const token of TOKENS) out[token] = lerpHex(lo[token], hi[token], t)
  return out
}

// Write a sampled palette onto :root so every rule using the brand tokens re-tints.
function applyArc(palette) {
  const root = document.documentElement.style
  root.setProperty('--paper', palette.paper)
  root.setProperty('--paper-2', palette.paper2)
  root.setProperty('--ink', palette.ink)
  root.setProperty('--ink-2', palette.ink2)
  root.setProperty('--muted', palette.muted)
  root.setProperty('--accent', palette.accent)
}

// Wire the arc to scroll. Under reduced motion we snap to dawn (today's palette) and never
// attach a scroll handler — the page is exactly the static site it always was.
export function initLightArc(guards) {
  if (!guards.motionEnabled) {
    applyArc(sampleArc(0))
    return
  }
  gsap.registerPlugin(ScrollTrigger) // browser-only; safe to call again if already registered
  applyArc(sampleArc(0)) // start at dawn before first scroll tick
  ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => applyArc(sampleArc(self.progress)),
  })
}
