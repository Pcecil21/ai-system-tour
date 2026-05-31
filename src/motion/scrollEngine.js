// scrollEngine.js — one scroll authority for the whole site.
//
// The cinematic system has several layers that all need to know "how far down the page are
// we?" (the light arc, scrubbed scenes, the WebGL canvas). If each added its own scroll
// listener they'd fight and jitter. So Lenis owns the smooth scroll, and GSAP's ScrollTrigger
// reads from Lenis — a single source of truth that every later unit hooks into.
//
// This is the canonical Lenis + GSAP integration (per Lenis docs): drive Lenis's animation
// frame from GSAP's ticker so the two never run on competing clocks.
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Initialize smooth scroll + the GSAP bridge. Returns the Lenis instance (for later units
// to control — e.g. scrolling to the moonrise finale), or null when motion is disabled.
export function initScrollEngine(guards) {
  // Reduced-motion (or any motion veto): do NOT smooth-scroll. Native scroll, content intact.
  // This is the AE1 contract at the engine level — the page must stay fully usable.
  if (!guards.motionEnabled) return null

  const lenis = new Lenis({
    // Gentle, premium feel — not a bouncy/gamey curve. Tuned further in later units.
    duration: 1.1,
    smoothWheel: true,
  })

  // ScrollTrigger recalculates on every Lenis scroll tick — keeps scrubbed scenes in sync.
  lenis.on('scroll', ScrollTrigger.update)

  // Single clock: GSAP's ticker advances Lenis (raf wants milliseconds; ticker gives seconds).
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  // Lenis manages its own smoothing, so disable GSAP's lag smoothing to avoid double-easing.
  gsap.ticker.lagSmoothing(0)

  return lenis
}
