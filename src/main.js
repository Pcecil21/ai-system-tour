// main.js — the single client entry point Vite bundles for the homepage.
//
// Phase A scope: compute the guards once and start the scroll engine. Later phases (the
// light arc, scenes, kinetic type, WebGL) hang off these same two objects, so this file
// grows into the conductor for the whole cinematic system.
import { createGuards } from './motion/guards.js'
import { initScrollEngine } from './motion/scrollEngine.js'

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
const lenis = initScrollEngine(guards)
window.__blueline = { guards, lenis }
