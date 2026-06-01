// main.js — the single client entry point Vite bundles for the homepage.
//
// Phase A scope: compute the guards once and start the scroll engine. Later phases (the
// light arc, scenes, kinetic type, WebGL) hang off these same two objects, so this file
// grows into the conductor for the whole cinematic system.
import { createGuards } from './motion/guards.js'
import { initScrollEngine } from './motion/scrollEngine.js'
import { initLightArc } from './motion/lightArc.js'
import { initScenes } from './motion/scenes.js'
import { initIntro } from './motion/intro.js'
import { initKineticType } from './motion/kineticType.js'
import { initCursor } from './motion/cursor.js'

// One capability/accessibility snapshot, read by every layer.
const guards = createGuards()

// Expose the decision on the <html> element so CSS can react too (e.g. later units can
// write `html[data-motion="off"] .scene { ... }` to force static fallbacks).
const root = document.documentElement
root.dataset.motion = guards.motionEnabled ? 'on' : 'off'
root.dataset.webgl = guards.webglEnabled ? 'on' : 'off'
root.dataset.tier = guards.deviceTier

// Smooth scroll + the GSAP bridge (no-op under reduced motion). Kept on the global so later
// units and debugging can reach it.
// Opening curtain first — lift it away to reveal the page (or remove it immediately under
// reduced motion / repeat visit). Runs before the engine so the reveal feels intentional.
initIntro(guards)

const lenis = initScrollEngine(guards)

// The day→night light arc — tints the brand tokens across scroll (snaps to dawn under
// reduced motion). Must init after the scroll engine so ScrollTrigger reads Lenis.
initLightArc(guards)

// Scrubbed cinematic scenes (hero parallax + departure). No-op under reduced motion.
initScenes(guards)

// Headline reveals — hero lines on load, section headlines on scroll-enter.
initKineticType(guards)

// Custom cursor + magnetic CTAs (fine pointer + motion only; native cursor otherwise).
initCursor(guards)

window.__blueline = { guards, lenis }

// WebGL grain/light overlay — capable devices only, and LAZY: the dynamic import means
// Three.js (~130KB gzipped) is a separate chunk that's only downloaded when webglEnabled
// is true. Reduced-motion / low-tier / no-WebGL visitors never pay for it; the CSS arc
// carries the look for them.
if (guards.webglEnabled) {
  import('./webgl/stage.js').then(({ initWebGLStage }) => {
    window.__blueline.webgl = initWebGLStage(guards)
  })
}
