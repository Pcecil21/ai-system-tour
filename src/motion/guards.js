// guards.js — the single capability/accessibility kill-switch.
//
// Every motion layer in the cinematic system (smooth scroll, the light arc, the WebGL
// canvas, the custom cursor) reads ONE set of guards from here instead of each re-checking
// the browser. That keeps the behavior consistent and gives us one place to reason about
// "should this device get the full experience, a reduced one, or none?"
//
// The rule the whole redesign hangs on: nothing here is ever *required* to see the content.
// If motion is off, the page is still a fully legible static site.

// True when the visitor has asked their OS for reduced motion (accessibility setting).
// We treat this as an absolute veto: reduced motion means no animation and no WebGL.
export function prefersReducedMotion() {
  // `?.` + `?? false` so this never throws in odd environments (older browsers, tests).
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

// True when the browser can actually give us a WebGL context. Cheap, synchronous probe:
// make a throwaway canvas and ask for the context. Wrapped in try/catch because some
// locked-down browsers throw rather than returning null.
export function detectWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

// A crude low/mid/high bucket from the two signals browsers expose: CPU cores and (where
// available) device memory in GB. Deliberately conservative — when a signal is missing we
// assume the *lower* end so we never push heavy WebGL onto a phone we can't measure.
// The exact thresholds get tuned against real measurement in U11; this is the starting cut.
export function deviceTier() {
  const cores = navigator.hardwareConcurrency || 2 // missing => assume weak
  const mem = navigator.deviceMemory || 2 // Safari/Firefox don't expose this => assume weak
  if (cores <= 4 || mem <= 4) return 'low'
  if (cores <= 8 || mem <= 8) return 'mid'
  return 'high'
}

// Compute the guards once at startup and hand back a frozen snapshot the rest of the
// system reads. Derived flags encode the policy in one place:
//   motionEnabled  — smooth scroll, scrubbed scenes, kinetic type may run
//   webglEnabled   — the Three.js canvas may initialize
//   reducedMotion  — the raw accessibility signal (for any layer that wants it directly)
export function createGuards() {
  const reducedMotion = prefersReducedMotion()
  const tier = deviceTier()
  const webgl = detectWebGL()

  return Object.freeze({
    reducedMotion,
    deviceTier: tier,
    // Reduced motion vetoes everything animated.
    motionEnabled: !reducedMotion,
    // WebGL needs: motion allowed, a real context, and a device that can carry it.
    webglEnabled: !reducedMotion && webgl && tier !== 'low',
  })
}
