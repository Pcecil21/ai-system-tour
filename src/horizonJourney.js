import { renderHistory } from './historyView.js'
import { journeyLine, linePath, smoothStep } from './treasuryHistory.js'
import { initLakeScene } from './lakeScene.js'

const journey = document.querySelector('.journey')
if (journey) initJourney(journey)

function initJourney(root) {
  const stage = root.querySelector('.journey-stage'), panels = [...root.querySelectorAll('.journey-panel')]
  const chapters = [...root.querySelectorAll('[data-chapter]')]
  const historyRoot = root.querySelector('.history-interface'), svg = root.querySelector('[data-history-svg]')
  const historyDisclosure = root.querySelector('.history-disclosure')
  const compact = matchMedia('(max-width: 760px)')
  let compactHistoryOpen = false
  historyDisclosure.open = !compact.matches
  historyDisclosure.querySelector('summary').addEventListener('click', () => {
    if (compact.matches) compactHistoryOpen = !historyDisclosure.open
  })
  historyDisclosure.addEventListener('toggle', () => { paintHistory(); schedule() })
  compact.addEventListener('change', () => {
    historyDisclosure.open = compact.matches ? compactHistoryOpen : true
    configure()
  })
  const slider = root.querySelector('[data-history-scrub]'), thread = root.querySelector('.journey-thread')
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const spacious = matchMedia('(min-width: 1000px) and (min-height: 760px)')
  const navigation = document.querySelector('.masthead')
  let years = '22', index = 263, plot, pinned = false, pending = 0, lastProgress = NaN, lakeActive = false
  let fade = null
  const setLakeActive = initLakeScene(root.querySelector('.lake-canvas'), root.querySelector('.journey-lake img'), root.querySelector('.water-toggle'), reduced)

  function paintHistory() {
    plot = renderHistory(historyRoot, years, index, { width: svg.clientWidth || 900, height: svg.clientHeight || 300 })
    index = plot.selectedIndex
    lastProgress = NaN
  }
  function unpin() {
    pinned = false; root.classList.remove('is-pinned'); root.removeAttribute('data-scene')
    panels.forEach(panel => { panel.removeAttribute('aria-hidden'); panel.inert = false; panel.style.removeProperty('opacity'); panel.style.removeProperty('visibility') })
    root.style.setProperty('--intro-height', `${panels[0].offsetHeight}px`)
  }
  function configure() {
    document.documentElement.style.setProperty('--journey-nav', `${navigation.offsetHeight}px`)
    // The property also belongs on body because the preceding stylesheet sets its default there.
    document.body.style.setProperty('--journey-nav', `${navigation.offsetHeight}px`)
    pinned = spacious.matches && !reduced.matches && !matchMedia('(forced-colors: active)').matches
    if (pinned) historyDisclosure.open = true
    root.classList.toggle('is-pinned', pinned)
    if (!pinned || panels.some(panel => panel.scrollHeight > stage.clientHeight + 2)) unpin()
    paintHistory(); schedule()
  }
  function progress() {
    const bounds = root.getBoundingClientRect()
    return Math.max(0, Math.min(1, (navigation.offsetHeight - bounds.top) / Math.max(1, root.offsetHeight - stage.offsetHeight)))
  }
  function paint() {
    pending = 0
    const p = pinned ? progress() : 0
    const intro = panels[0].getBoundingClientRect()
    const activeWater = (!pinned || p < .28) && intro.bottom > navigation.offsetHeight && intro.top < innerHeight
    if (activeWater !== lakeActive) { lakeActive = activeWater; setLakeActive(activeWater) }
    if (!pinned || p === lastProgress) return
    lastProgress = p
    const opacity = [1 - smoothStep((p - .14) / .16), smoothStep((p - .22) / .14) * (1 - smoothStep((p - .64) / .14)), smoothStep((p - .73) / .16)]
    const scene = p < .28 ? 0 : p < .76 ? 1 : 2
    root.dataset.scene = String(scene)
    root.style.setProperty('--lake-reveal', String(1 - smoothStep((p - .16) / .17)))
    root.style.setProperty('--family-reveal', String(smoothStep((p - .68) / .2)))
    panels.forEach((panel, i) => {
      panel.style.opacity = opacity[i]; panel.style.visibility = opacity[i] > .005 ? 'visible' : 'hidden'
      panel.setAttribute('aria-hidden', String(i !== scene)); panel.inert = i !== scene
    })
    chapters.forEach((link, i) => i === scene ? link.setAttribute('aria-current', 'step') : link.removeAttribute('aria-current'))
    const stageBox = stage.getBoundingClientRect(), plotBox = svg.getBoundingClientRect()
    const familyBox = root.querySelector('.family-line-anchor').getBoundingClientRect()
    const points = plot.geometry.map(point => ({ x: point.x + plotBox.left - stageBox.left, y: point.y + plotBox.top - stageBox.top }))
    thread.setAttribute('viewBox', `0 0 ${stage.clientWidth} ${stage.clientHeight}`)
    thread.dataset.family = String(p > .84)
    thread.querySelector('path').setAttribute('d', linePath(journeyLine(points, p, {
      width: stage.clientWidth, height: stage.clientHeight,
      family: { x: familyBox.left - stageBox.left, y: familyBox.top - stageBox.top, width: familyBox.width },
    })))
  }
  function schedule() { if (!pending) pending = requestAnimationFrame(paint) }
  function navigate(hash, behavior = 'smooth') {
    const target = panels.findIndex(panel => `#${panel.id}` === hash)
    if (!pinned || target < 0) return false
    const top = root.getBoundingClientRect().top + scrollY - navigation.offsetHeight
    scrollTo({ top: top + [0, .49, .96][target] * (root.offsetHeight - stage.offsetHeight), behavior })
    return true
  }
  root.querySelectorAll('a[href^="#scene-"]').forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (navigate(link.hash)) { event.preventDefault(); history.pushState(null, '', link.hash) }
  }))
  window.addEventListener('popstate', () => navigate(location.hash, 'instant'))
  root.querySelectorAll('[data-history-years]').forEach(button => {
    button.disabled = false
    button.addEventListener('click', () => {
      years = button.dataset.historyYears; index = Infinity; fade?.cancel(); paintHistory(); schedule()
      if (!reduced.matches) fade = historyRoot.animate([{ opacity: .55 }, { opacity: 1 }], { duration: 250, easing: 'ease-out' })
    })
  })
  slider.disabled = false
  slider.addEventListener('input', () => { index = Number(slider.value); paintHistory(); schedule() })
  function inspect(event) {
    const box = svg.getBoundingClientRect(), x = event.clientX - box.left
    const first = plot.geometry[0].x, last = plot.geometry.at(-1).x
    index = Math.round(Math.max(0, Math.min(1, (x - first) / (last - first))) * (plot.points.length - 1))
    paintHistory(); schedule()
  }
  svg.addEventListener('pointermove', event => { if (event.pointerType !== 'touch') inspect(event) }, { passive: true })
  let touchStart = null
  svg.addEventListener('pointerdown', event => { touchStart = [event.clientX, event.clientY] }, { passive: true })
  svg.addEventListener('pointerup', event => {
    if (touchStart && Math.hypot(event.clientX - touchStart[0], event.clientY - touchStart[1]) < 10) inspect(event)
    touchStart = null
  }, { passive: true })
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', configure, { passive: true })
  reduced.addEventListener('change', () => { fade?.cancel(); configure() })
  document.addEventListener('visibilitychange', () => { if (document.hidden) fade?.cancel(); else schedule() })
  new ResizeObserver(() => {
    if (pinned && panels.some(panel => panel.scrollHeight > stage.clientHeight + 2)) unpin()
    if (!pinned) root.style.setProperty('--intro-height', `${panels[0].offsetHeight}px`)
    paintHistory(); schedule()
  }).observe(historyRoot)
  new ResizeObserver(configure).observe(navigation)
  configure()
  document.fonts.ready.then(() => {
    configure()
    if (location.hash && !navigate(location.hash, 'instant')) {
      // Pinning changes the space above later sections after the browser's initial fragment jump.
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
  })
}
