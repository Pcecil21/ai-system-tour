// Optional ambient effects for the inventory. Content and navigation work independently.
import { createGuards } from './motion/guards.js'

const guards = createGuards()
const root = document.documentElement
root.dataset.motion = guards.motionEnabled ? 'on' : 'off'
root.dataset.webgl = guards.webglEnabled ? 'on' : 'off'

window.__blueline = { guards, lenis: null }

async function initMotion() {
  const [{ initScrollEngine }, { initCursor }] = await Promise.all([
    import('./motion/scrollEngine.js'),
    import('./motion/cursor.js'),
  ])
  window.__blueline.lenis = initScrollEngine(guards)
  initCursor(guards)

  // The scroll engine registers ScrollTrigger before the capable-device overlay uses it.
  if (guards.webglEnabled) {
    const { initWebGLStage } = await import('./webgl/stage.js')
    window.__blueline.webgl = initWebGLStage(guards)
  }
}

// Importing ScrollTrigger itself starts background work, even without active effects.
// Keep the entire animation dependency graph behind the existing accessibility guard.
if (guards.motionEnabled) {
  initMotion().catch(error => {
    console.warn('Optional motion enhancements could not load; native controls remain available.', error)
  })
}
