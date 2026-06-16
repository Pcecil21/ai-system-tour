// cursor.js — a custom cursor + magnetic CTAs. A premium pointer touch, kept restrained
// so it reads as craft, not a gimmick.
//
// A two-part cursor: a small dot that tracks the pointer almost exactly, and a ring that
// trails with easing. The ring grows over interactive elements. Primary CTAs are "magnetic"
// — they lean slightly toward the pointer on hover, then spring back.
//
// Strictly an enhancement: it only runs on a fine pointer (mouse/trackpad) with motion
// enabled. Touch devices and reduced-motion users keep the native cursor untouched, and if
// the script never runs, the native cursor is simply never hidden.
import { gsap } from 'gsap'

export function initCursor(guards) {
  if (!guards.motionEnabled) return
  if (!window.matchMedia('(pointer: fine)').matches) return

  const ring = document.createElement('div')
  ring.className = 'cursor-ring'
  ring.setAttribute('aria-hidden', 'true')
  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  dot.setAttribute('aria-hidden', 'true')
  document.body.append(ring, dot)

  // Center both on their coordinate, then animate x/y in pixels (gsap composes the two).
  gsap.set([ring, dot], { xPercent: -50, yPercent: -50 })
  // Hiding the native cursor is done via a class so it's trivially reversible and never
  // applies unless this code actually ran.
  document.documentElement.classList.add('has-custom-cursor')

  // quickTo = a reusable tween per property; the dot is snappy, the ring lags for elegance.
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' })
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })
  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' })
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' })

  window.addEventListener('pointermove', (e) => {
    ringX(e.clientX); ringY(e.clientY)
    dotX(e.clientX); dotY(e.clientY)
  }, { passive: true })

  // Grow the ring over anything interactive.
  const interactive = document.querySelectorAll('a, button, [role="button"], summary, input')
  interactive.forEach((el) => {
    el.addEventListener('pointerenter', () => document.documentElement.classList.add('cursor-hover'))
    el.addEventListener('pointerleave', () => document.documentElement.classList.remove('cursor-hover'))
  })

  // Restraint over the trust-critical zones (per the design audit). The custom cursor is an
  // opening flourish — but on the contact footer, the founding-clients CTA band, the trust strip,
  // and the credibility block, it hands the native cursor back and hides its ring/dot. A precise,
  // high-trust click should never fight a trailing ring; the flourish stays everywhere else.
  const nativeZones = document.querySelectorAll('#contact, .founding, .trust, .cred-block')
  nativeZones.forEach((el) => {
    el.addEventListener('pointerenter', () => document.documentElement.classList.add('cursor-native'))
    el.addEventListener('pointerleave', () => document.documentElement.classList.remove('cursor-native'))
  })

  // Magnetic primary CTAs — the element leans ~25% toward the pointer, then springs back.
  const magnets = document.querySelectorAll('.nav .talk, .system-cta, .founding a')
  magnets.forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      const mx = e.clientX - (r.left + r.width / 2)
      const my = e.clientY - (r.top + r.height / 2)
      gsap.to(el, { x: mx * 0.25, y: my * 0.25, duration: 0.4, ease: 'power3' })
    })
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    })
  })
}
