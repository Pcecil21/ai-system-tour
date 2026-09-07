// A still remains underneath this optional, bounded-resolution water treatment.
export function initLakeScene(canvas, image, button, reduced) {
  if (reduced.matches || !window.WebGLRenderingContext) return () => {}
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' })
  if (!gl) return () => {}
  let frame = 0, visible = false, active = false, paused = false, ready = false, lost = false, lastFrame = 0, clock = 0
  let pointer = [.5, .3], lastTouch = -100
  const shader = (type, source) => {
    const result = gl.createShader(type)
    gl.shaderSource(result, source); gl.compileShader(result)
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error('Lake shader unavailable')
    return result
  }
  try {
    const program = gl.createProgram()
    gl.attachShader(program, shader(gl.VERTEX_SHADER, 'attribute vec2 a; varying vec2 uv; void main(){ uv=a*.5+.5; gl_Position=vec4(a,0.,1.); }'))
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying vec2 uv; uniform sampler2D photo; uniform vec2 ratio; uniform vec2 pointer;
      uniform float time; uniform float touchAge;
      void main(){
        vec2 p=(uv-.5)*ratio+.5;
        float water=1.-smoothstep(.44,.48,p.y);
        float depth=clamp((.48-p.y)*2.,0.,1.);
        float waves=sin(p.y*135.+time*.7)+sin(p.y*72.-time*.43+p.x*5.);
        p.x += water*depth*waves*.0018;
        p.y += water*depth*sin(p.x*48.+p.y*61.+time*.53)*.0008;
        vec2 delta=uv-pointer; float distance=length(delta*vec2(1.7,1.));
        float ripple=sin(distance*75.-touchAge*6.)*exp(-distance*8.)*exp(-touchAge*.8);
        p += water*normalize(delta+.0001)*ripple*.002;
        gl_FragColor=vec4(texture2D(photo,clamp(p,.001,.999)).rgb,1.);
      }`))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Lake program unavailable')
    gl.useProgram(program)
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
    const attribute = gl.getAttribLocation(program, 'a'); gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0)
    const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    const uniforms = Object.fromEntries(['ratio','pointer','time','touchAge'].map(name => [name, gl.getUniformLocation(program, name)]))
    function draw(now) {
      frame = 0
      if (!ready || !visible || !active || paused || lost || reduced.matches || document.hidden) return
      if (now - lastFrame >= 32) {
        clock += Math.min(now - lastFrame, 50) / 1000; lastFrame = now
        const box = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio, 1.5)
        const w = Math.round(box.width * dpr), h = Math.round(box.height * dpr)
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h) }
        const viewAspect = box.width / box.height, photoAspect = image.naturalWidth / image.naturalHeight
        gl.uniform2f(uniforms.ratio, Math.min(1, viewAspect / photoAspect), Math.min(1, photoAspect / viewAspect))
        gl.uniform2f(uniforms.pointer, ...pointer); gl.uniform1f(uniforms.time, clock); gl.uniform1f(uniforms.touchAge, Math.max(0, clock - lastTouch))
        gl.drawArrays(gl.TRIANGLES, 0, 6); canvas.classList.add('is-ready')
      }
      frame = requestAnimationFrame(draw)
    }
    function update() {
      cancelAnimationFrame(frame); frame = 0
      if (reduced.matches || lost) { canvas.classList.remove('is-ready'); button.hidden = true }
      else button.hidden = !ready
      if (ready && visible && active && !paused && !lost && !reduced.matches && !document.hidden) { lastFrame = performance.now(); frame = requestAnimationFrame(draw) }
    }
    image.decode().then(() => {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
      ready = true; update()
    }).catch(() => { lost = true; update() })
    button.addEventListener('click', () => { paused = !paused; button.setAttribute('aria-pressed', String(paused)); button.textContent = paused ? 'Resume water' : 'Pause water'; update() })
    canvas.closest('.journey').addEventListener('pointermove', event => {
      if (!visible || !active || paused || event.pointerType === 'touch') return
      const box = canvas.getBoundingClientRect()
      pointer = [(event.clientX - box.left) / box.width, 1 - (event.clientY - box.top) / box.height]; lastTouch = clock
    }, { passive: true })
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() }).observe(canvas)
    document.addEventListener('visibilitychange', update)
    reduced.addEventListener('change', update)
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); lost = true; update() })
    return value => { active = value; update() }
  } catch {
    canvas.classList.remove('is-ready'); button.hidden = true
    return () => {}
  }
}
