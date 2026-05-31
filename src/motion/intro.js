// intro.js — the opening title sequence ("the curtain").
//
// A dawn-cream panel covers the hero at first paint; this lifts it to reveal the page,
// establishing "first light" before the visitor scrolls. The panel exists in the HTML so
// it's there from the first frame (a module script runs too late to prevent a hero flash),
// and this module's only job is to animate it away — safely.
//
// Safety is the whole game here: the curtain must NEVER trap content.
//   - reduced motion or a return visit this session  -> removed immediately
//   - any error / slow JS                              -> a failsafe timer removes it
//   - the visitor scrolls or clicks                    -> they skip straight past it
import { gsap } from 'gsap'

export function initIntro(guards) {
  const curtain = document.getElementById('intro-curtain')
  if (!curtain) return

  const remove = () => curtain.remove()

  // Skip the animation entirely for reduced-motion users or anyone who already saw it this
  // session (so it doesn't replay on every back-nav within the visit).
  if (!guards.motionEnabled || sessionStorage.getItem('blIntroSeen')) {
    remove()
    return
  }
  sessionStorage.setItem('blIntroSeen', '1')

  const mark = curtain.querySelector('.ic-mark')
  const rule = curtain.querySelector('.ic-rule')

  // Belt-and-suspenders: even if the timeline throws, the curtain is gone within 3.5s.
  const failsafe = setTimeout(remove, 3500)
  const finish = () => { clearTimeout(failsafe); remove() }

  const tl = gsap.timeline({ onComplete: finish })
  tl.fromTo(mark, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.15)
    .to(rule, { width: 120, duration: 0.7, ease: 'power2.out' }, 0.35)
    .to(curtain, { yPercent: -100, duration: 0.9, ease: 'power3.inOut' }, '+=0.45')

  // Let the visitor skip by scrolling or clicking — never hold them hostage to the intro.
  const skip = () => { tl.kill(); finish() }
  curtain.addEventListener('click', skip, { once: true })
  window.addEventListener('wheel', skip, { once: true, passive: true })
  window.addEventListener('touchstart', skip, { once: true, passive: true })
}
