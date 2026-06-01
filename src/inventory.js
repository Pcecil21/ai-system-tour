// inventory.js — the cinematic ambient layer for the "Under the hood" page.
//
// Brings art-direction parity with the homepage: smooth scroll, the custom cursor, and the
// WebGL grain/light overlay, so the two pages feel like one continuous world. It deliberately
// OMITS the homepage-only pieces — the intro curtain, the hero parallax/departure scenes, the
// homepage's specific kinetic headlines, and the day→night palette arc (which is tied to the
// homepage's dawn→moonrise narrative and has no equivalent here). Those would be misapplied
// on this page's content.
import { createGuards } from './motion/guards.js'
import { initScrollEngine } from './motion/scrollEngine.js'
import { initCursor } from './motion/cursor.js'

const guards = createGuards()
const root = document.documentElement
root.dataset.motion = guards.motionEnabled ? 'on' : 'off'
root.dataset.webgl = guards.webglEnabled ? 'on' : 'off'

const lenis = initScrollEngine(guards)
initCursor(guards)
window.__blueline = { guards, lenis }

// Same lazy, device-gated WebGL grain as the homepage — Three.js only on capable devices.
if (guards.webglEnabled) {
  import('./webgl/stage.js').then(({ initWebGLStage }) => {
    window.__blueline.webgl = initWebGLStage(guards)
  })
}
