// stage.js — the WebGL cinematic overlay (Three.js).
//
// A fixed, full-viewport canvas that renders the grain + soft-light shader over the page.
// It is a pure enhancement: it only ever exists when guards.webglEnabled is true (a capable,
// non-reduced-motion device), and it carries pointer-events:none so it never interferes with
// the page. When it's absent, the CSS day→night arc carries the look alone.
//
// One scroll clock: it reads the same scroll progress as the light arc (via ScrollTrigger)
// so the WebGL light temperature and the CSS palette stay in agreement.
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { vertexShader, fragmentShader } from './grainLight.js'

export function initWebGLStage(guards) {
  if (!guards.webglEnabled) return null
  gsap.registerPlugin(ScrollTrigger)

  const canvas = document.createElement('canvas')
  canvas.className = 'webgl-grain'
  canvas.setAttribute('aria-hidden', 'true')
  document.body.appendChild(canvas)

  // alpha:false — the canvas is opaque gray and blends via CSS soft-light, so we don't need
  // (and don't want) per-pixel transparency. Cap DPR: grain doesn't benefit from retina and
  // a full-res fragment pass on a 3x phone is wasted work.
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false })
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  renderer.setPixelRatio(dpr)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uGrain: { value: 0.10 }, // ~±5% grain; dialed for "felt, not seen"
  }
  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms })
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    uniforms.uResolution.value.set(w * dpr, h * dpr)
  }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  // Scroll progress drives the light temperature, same source the CSS arc reads.
  ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => { uniforms.uProgress.value = self.progress },
  })

  // Animate + render on GSAP's ticker — the single clock the rest of the system uses.
  gsap.ticker.add((time) => {
    uniforms.uTime.value = time
    renderer.render(scene, camera)
  })

  return { canvas, renderer }
}
