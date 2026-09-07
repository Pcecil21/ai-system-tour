// Finite chart transitions. Every interruption can settle to the current data immediately.
export function createMarketMotion(element) {
  const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  const tracks = new Map()

  function allowed() {
    if (!preference || preference.matches || document.hidden || typeof requestAnimationFrame !== 'function') return false
    const rect = element.getBoundingClientRect()
    return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight
  }

  function stop(channel, settle = true) {
    const track = tracks.get(channel)
    if (!track) return
    tracks.delete(channel)
    cancelAnimationFrame(track.frame)
    if (settle) track.draw(1)
  }

  function stopAll() {
    for (const channel of tracks.keys()) stop(channel)
  }

  function run(channel, draw, duration) {
    stop(channel, false)
    if (!allowed()) { draw(1); return }
    const start = performance.now()
    const track = { draw, frame: 0 }
    tracks.set(channel, track)
    draw(0)
    function frame(now) {
      if (tracks.get(channel) !== track) return
      const progress = Math.min(1, Math.max(0, (now - start) / duration))
      draw(progress)
      if (progress === 1) tracks.delete(channel)
      else track.frame = requestAnimationFrame(frame)
    }
    track.frame = requestAnimationFrame(frame)
  }

  function revealOnce(reveal) {
    if (typeof IntersectionObserver !== 'function') return
    let entered = false
    new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting
      if (!visible) stopAll()
      else if (!entered) {
        entered = true
        if (allowed()) reveal()
      }
    }, { threshold: 0.12 }).observe(element)
  }

  preference?.addEventListener('change', stopAll)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAll()
  })

  return { run, stop, stopAll, revealOnce }
}

export const easeOut = progress => 1 - (1 - progress) ** 3

// Use every vertex from both polylines so neither end of the morph loses detail.
export function priceTransition(from, to) {
  const positionOf = (points, point) => Number(((point.x - points[0].x) / (points.at(-1).x - points[0].x)).toFixed(12))
  const positions = [...new Set([
    ...from.map(point => positionOf(from, point)),
    ...to.map(point => positionOf(to, point)),
  ])].sort((a, b) => a - b)
  function sample(points, position) {
    if (position === 0) return points[0]
    if (position === 1) return points.at(-1)
    const x = points[0].x + position * (points.at(-1).x - points[0].x)
    const index = Math.max(1, points.findIndex(point => point.x + 1e-8 >= x))
    const left = points[index - 1]
    const right = points[index]
    const fraction = (x - left.x) / (right.x - left.x)
    return { x: left.x + (right.x - left.x) * fraction, y: left.y + (right.y - left.y) * fraction }
  }
  const pairs = positions.map(position => [sample(from, position), sample(to, position)])
  return progress => pairs.map(([a, b]) => ({ x: a.x + (b.x - a.x) * progress, y: a.y + (b.y - a.y) * progress }))
}
