// kineticType.js — headline reveals, the craft signal.
//
// Two techniques, chosen to be safe:
//   - The hero <h1> already has .row line spans wrapping each line (with italic <em>,
//     strikethrough, and indents inside). We reveal those existing lines with a staggered
//     rise — NO text splitting — so none of that delicate inline styling is disturbed.
//   - Section headlines are plainer, so they get GSAP SplitText's masked line reveal on
//     scroll-enter, then the split is REVERTED on complete so the DOM returns to normal
//     text (reflows correctly on later resize, and assistive tech reads it normally).
//
// SplitText (free since 2025) defaults to aria:"auto" — it puts an aria-label with the
// original text on the element and aria-hidden on the split pieces, so screen readers read
// the real headline, not a stream of fragments. Reduced motion skips all of this.
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initKineticType(guards) {
  if (!guards.motionEnabled) return
  gsap.registerPlugin(SplitText, ScrollTrigger)

  // Hero headline — reveal the existing .row lines (no split). If GSAP fails to load at all,
  // main.js never runs and the lines stay visible per CSS, so this can't strand the hero.
  const heroRows = gsap.utils.toArray('.hero h1 .row')
  if (heroRows.length) {
    gsap.from(heroRows, {
      y: 30,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out',
      stagger: 0.1,
      delay: 0.25,
    })
  }

  // Section headlines — masked line reveal on scroll-enter, then revert to plain text.
  const heads = gsap.utils.toArray([
    '.intro h2',
    '.three-head h3',
    '.about-copy h3',
    '.philosophy blockquote',
  ])
  heads.forEach((el) => {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines' })
    gsap.from(split.lines, {
      yPercent: 110,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onComplete: () => split.revert(), // restore normal text once revealed
    })
  })
}
