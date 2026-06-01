// scenes.js — scroll-scrubbed cinematic motion, driven by the single scroll authority
// (Lenis → GSAP ScrollTrigger). This file replaces the old hand-rolled hero parallax that
// had its own window 'scroll' listener — now there is exactly one scroll clock.
//
// Phase B scope (this increment): the hero scene — a scrubbed parallax on the photo plus a
// gentle "departure" as the hero leaves the viewport. Heavier pinning and section-by-section
// scene rework are intentionally deferred to a desk-tuning pass, because their feel can only
// be judged by actually scrolling, not from static screenshots.

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initScenes(guards) {
  // Reduced motion (or any veto): no scrubbed motion. The hero is its static self.
  if (!guards.motionEnabled) return
  gsap.registerPlugin(ScrollTrigger)

  const hero = document.querySelector('.hero')
  const heroBg = document.querySelector('.hero-bg')
  const heroInner = document.querySelector('.hero-inner')

  // Parallax: the photo drifts down slower than the page, so it appears to hang behind the
  // content as you scroll past — the same effect the old inline listener produced, but now
  // scrubbed to the shared scroll clock (one authority, no competing rAF loop). The child
  // .hero-bg-img keeps its own Ken-Burns scale; this transforms the parent, so they compose.
  if (hero && heroBg) {
    gsap.to(heroBg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }

  // Departure: the hero copy lifts and fades as the hero exits, handing the screen to the
  // content below. Stays fully visible until the hero is halfway gone, so it never fades
  // while the reader is still on it.
  if (hero && heroInner) {
    gsap.to(heroInner, {
      yPercent: -6,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'center top',
        end: 'bottom top',
        scrub: true,
      },
    })
  }
}
