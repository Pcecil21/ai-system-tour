// stage.js — the WebGL cinematic overlay (raw WebGL — no Three.js).
//
// A fixed, full-viewport canvas that renders the grain + soft-light shader over the page.
// This USED to use Three.js, but only ever to draw a single full-screen quad — ~128KB gzipped
// of 3D engine for one fragment shader. Three is gone; we drive a raw WebGL context directly.
// The shaders (grainLight.js) are unchanged, so the look is identical — capable devices just no
// longer download a whole 3D library to get a film-grain wash.
//
// It is a pure enhancement: it only ever exists when guards.webglEnabled is true, carries
// pointer-events:none, and if ANY step here fails it tears down and returns null — the page
// never depends on it, and the CSS day→night arc carries the look alone.
//
// One scroll clock: it reads the same scroll progress as the light arc (via ScrollTrigger) so
// the WebGL light temperature and the CSS palette stay in agreement.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { vertexShader, fragmentShader } from './grainLight.js'

// Compile one shader; throw with the GPU's info log on failure so the caller can bail cleanly.
function compileShader(gl, type, src) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error('shader compile failed: ' + log)
  }
  return shader
}

export function initWebGLStage(guards) {
  if (!guards.webglEnabled) return null

  const canvas = document.createElement('canvas')
  canvas.className = 'webgl-grain'
  canvas.setAttribute('aria-hidden', 'true')
  document.body.appendChild(canvas)

  // alpha:false — the canvas is opaque gray and blends via CSS soft-light, so we don't need
  // per-pixel transparency. If the context can't be created (locked-down browser), bail cleanly.
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
  if (!gl) { canvas.remove(); return null }

  // Build + link the program. Any compile/link failure → tear down and return null. The page is
  // fully fine without the overlay, so a GPU quirk must never throw into the rest of the system.
  let program
  try {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
    program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('program link failed: ' + gl.getProgramInfoLog(program))
    }
  } catch (err) {
    canvas.remove()
    return null
  }
  gl.useProgram(program)

  // Full-screen quad (two triangles) in clip space; the vertex shader derives uv = pos*0.5+0.5.
  const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

  // Uniform locations, cached once. uGrain is constant, so set it now.
  const uTime = gl.getUniformLocation(program, 'uTime')
  const uProgress = gl.getUniformLocation(program, 'uProgress')
  const uResolution = gl.getUniformLocation(program, 'uResolution')
  gl.uniform1f(gl.getUniformLocation(program, 'uGrain'), 0.18) // ~±9% grain — present, not noisy

  // Cap DPR: grain doesn't benefit from retina and a full-res pass on a 3x phone is wasted work.
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    gl.viewport(0, 0, canvas.width, canvas.height)
    // ~1px grain regardless of DPR — same value Three's uResolution carried.
    gl.uniform2f(uResolution, canvas.width, canvas.height)
  }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  // Scroll progress drives the light temperature, same source the CSS arc reads.
  ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => gl.uniform1f(uProgress, self.progress),
  })

  // Draw one frame at the given time (seconds). The full-screen quad covers every pixel, so no
  // clear is needed — each frame fully overwrites the last. Exposed on the return value so the
  // frame can be forced/inspected (used by visual verification).
  function draw(timeSeconds) {
    gl.uniform1f(uTime, timeSeconds)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  // Animate + render on GSAP's ticker — the single clock the rest of the system uses.
  gsap.ticker.add((time) => draw(time))

  return { canvas, gl, draw }
}
