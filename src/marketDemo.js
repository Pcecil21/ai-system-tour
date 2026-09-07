// Retired native prototype. The active entry point uses marketFeeds.js.
import {
  ASSET_NAMES, ASSET_CODES, BREADTH_PERIOD_NAMES, formatObservationDate, formatReturn, formatVolume, getAssetAnalytics,
  getPriceSeries, getPriceSummary, getPriceGeometry, nearestPriceIndex,
  getBreadthSummary, getBreadthGeometry,
} from './marketDemoData.js'
import { createMarketMotion, easeOut, priceTransition } from './marketMotion.js'

const namespace = 'http://www.w3.org/2000/svg'
const colors = {
  grid: 'var(--terminal-grid, #314258)',
  muted: 'var(--terminal-muted, #a7b9cd)',
  text: 'var(--terminal-text, #edf3fc)',
  accent: 'var(--terminal-accent, #7299ff)',
  positive: 'var(--terminal-positive, #75dfc0)',
  negative: 'var(--terminal-negative, #ff9d9a)',
}

function svgElement(name, attributes, text) {
  const element = document.createElementNS(namespace, name)
  Object.entries(attributes).forEach(([attribute, value]) => element.setAttribute(attribute, value))
  if (text !== undefined) element.textContent = text
  return element
}

function output(root, selector, value) {
  const element = root.querySelector(selector)
  if (element) element.textContent = value
}

function selectButton(buttons, key, value) {
  buttons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset[key] === value))
  })
}

function setDirection(element, value) {
  element.dataset.direction = value > 0 ? 'up' : value < 0 ? 'down' : 'flat'
}

function dimensions(svg, height) {
  return { width: svg.clientWidth || 900, height: svg.clientHeight || height }
}

function observeSize(svg, render) {
  if (typeof ResizeObserver === 'undefined') return
  let previous = `${svg.clientWidth}:${svg.clientHeight}`
  new ResizeObserver(() => {
    const next = `${svg.clientWidth}:${svg.clientHeight}`
    if (next === previous) return
    previous = next
    render()
  }).observe(svg)
}

// Exported renderers also allow the build's HTML fallback to use the same geometry.
export function renderPriceChart(svg, geometry, view = 'line', averages = true) {
  const { width, height, bounds, ticks, points, line, area } = geometry
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  const fragment = document.createDocumentFragment()
  ticks.forEach(tick => {
    fragment.append(svgElement('line', {
      x1: bounds.left, x2: bounds.right, y1: tick.y, y2: tick.y,
      stroke: colors.grid, 'stroke-width': 1,
    }))
    fragment.append(svgElement('text', {
      x: bounds.left - (width < 600 ? 8 : 12), y: tick.y + 5, fill: colors.muted,
      'font-size': 12, 'text-anchor': 'end',
    }, tick.value.toFixed(Number.isInteger(tick.value) ? 0 : 1)))
  })
  ;[0, Math.floor((points.length - 1) / 2), points.length - 1].forEach((index, position) => {
    const point = points[index]
    const label = new Intl.DateTimeFormat('en-US', {
      month: 'short', ...(points.length <= 13 ? { day: 'numeric' } : { year: '2-digit' }), timeZone: 'UTC',
    })
      .format(new Date(`${point.date}T00:00:00Z`))
    fragment.append(svgElement('text', {
      x: point.x, y: height - 8, fill: colors.muted, 'font-size': 12,
      'text-anchor': position === 0 ? 'start' : position === 2 ? 'end' : 'middle',
    }, label))
  })
  const areaPath = svgElement('path', { d: area, fill: colors.accent, opacity: 0.13, 'data-price-area': '' })
  const linePath = svgElement('path', {
    d: line, fill: 'none', stroke: colors.accent, 'stroke-width': 3,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke',
    'data-price-line': '', pathLength: 1,
  })
  fragment.append(areaPath, linePath)
  linePath.style.display = view === 'line' ? '' : 'none'
  areaPath.style.display = view === 'line' ? '' : 'none'
  const candles = svgElement('g', { 'data-price-candles': '', display: view === 'candles' ? 'inline' : 'none' })
  const candleWidth = Math.max(2, Math.min(12, (bounds.right - bounds.left) / points.length * .58))
  points.forEach(point => {
    const color = point.value >= point.open ? colors.positive : colors.negative
    const group = svgElement('g', { 'data-candle': '' })
    group.append(svgElement('line', { x1: point.x, x2: point.x, y1: point.highY, y2: point.lowY, stroke: color, 'stroke-width': 1.2 }))
    group.append(svgElement('rect', { x: point.x - candleWidth / 2, y: Math.min(point.openY, point.y), width: candleWidth, height: Math.max(1, Math.abs(point.openY - point.y)), fill: color }))
    candles.append(group)
  })
  fragment.append(candles)
  for (const [key, color] of [['sma5Y', '#8ba4ff'], ['sma13Y', '#e8c484']]) {
    const valid = points.filter(point => point[key] !== null)
    const path = valid.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(2)},${point[key].toFixed(2)}`).join(' ')
    fragment.append(svgElement('path', { d: path, fill: 'none', stroke: color, 'stroke-width': 1.8, 'data-moving-average': key, display: averages ? 'inline' : 'none', 'vector-effect': 'non-scaling-stroke' }))
  }
  const crosshair = svgElement('line', {
    y1: bounds.top, y2: bounds.bottom, stroke: colors.muted,
    'stroke-dasharray': '4 5', 'stroke-width': 1,
    'data-price-crosshair': '',
  })
  const point = svgElement('circle', {
    r: 5, fill: colors.text, stroke: colors.accent, 'stroke-width': 3,
    'data-price-point': '',
  })
  const halo = svgElement('circle', { r: 11, fill: colors.accent, opacity: 0.2, 'data-price-halo': '' })
  fragment.append(crosshair, halo, point)
  svg.replaceChildren(fragment)
  return { crosshair, point, halo, linePath, areaPath, candles }
}

function revealCandles(marker, geometry, progress) {
  const t = easeOut(progress)
  ;[...marker.candles.children].forEach((group, index) => {
    const point = geometry.points[index], [wick, body] = group.children
    wick.setAttribute('y1', point.openY + (point.highY - point.openY) * t)
    wick.setAttribute('y2', point.openY + (point.lowY - point.openY) * t)
    const close = point.openY + (point.y - point.openY) * t
    body.setAttribute('y', Math.min(point.openY, close))
    body.setAttribute('height', Math.max(1, Math.abs(point.openY - close)))
  })
}

function renderVolume(svg, geometry, selectedIndex) {
  if (!svg) return
  const width = geometry.width, height = svg.clientHeight || 76
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  const maximum = Math.max(...geometry.points.map(point => point.volume))
  const barWidth = Math.max(2, Math.min(14, (geometry.bounds.right - geometry.bounds.left) / geometry.points.length * .7))
  svg.replaceChildren(...geometry.points.map((point, index) => {
    const barHeight = point.volume / maximum * (height - 10)
    return svgElement('rect', { x: point.x - barWidth / 2, y: height - barHeight, width: barWidth, height: barHeight, fill: point.value >= point.open ? colors.positive : colors.negative, opacity: index === selectedIndex ? 1 : .38, 'data-volume-bar': index })
  }))
}

export function renderBreadthChart(svg, period, selectedSector) {
  const { width, height, compact, zero, ticks, rows } = getBreadthGeometry(period, dimensions(svg, 260))
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  const fragment = document.createDocumentFragment()
  ticks.forEach(tick => {
    fragment.append(svgElement('line', {
      x1: tick.x, x2: tick.x, y1: 12, y2: height - 40,
      stroke: tick.value === 0 ? colors.muted : colors.grid, 'stroke-width': 1,
    }))
    if (!compact || tick.value === 0 || Math.abs(tick.value) === Math.abs(ticks[0].value)) {
      fragment.append(svgElement('text', {
        x: tick.x, y: height - 10, fill: colors.muted, 'font-size': 11, 'text-anchor': 'middle',
      }, `${tick.value > 0 ? '+' : ''}${tick.value}%`))
    }
  })
  rows.forEach(row => {
    const selected = row.id === selectedSector
    const color = row.value < 0 ? colors.negative : colors.positive
    fragment.append(svgElement('text', {
      x: 8, y: row.y + 5, fill: selected ? colors.text : colors.muted,
      'font-size': compact ? 12 : 15, 'font-weight': selected ? 600 : 400,
    }, row.name))
    fragment.append(svgElement('rect', {
      x: row.x, y: row.y - 10, width: row.width, height: 20, rx: 3,
      fill: color, opacity: selected ? 1 : 0.45,
      'data-sector-bar': row.id,
    }))
    fragment.append(svgElement('text', {
      x: compact ? width - 2 : row.value < 0 ? row.end - 10 : row.end + 10, y: row.y + 5,
      fill: selected ? colors.text : colors.muted, 'font-size': compact ? 11 : 14,
      'text-anchor': compact || row.value < 0 ? 'end' : 'start',
    }, formatReturn(row.value)))
  })
  // Draw the origin last so negative and positive bars share a crisp baseline.
  fragment.append(svgElement('line', {
    x1: zero, x2: zero, y1: 12, y2: height - 40, stroke: colors.muted, 'stroke-width': 1,
  }))
  svg.replaceChildren(fragment)
}

function initPriceChart(root) {
  const svg = root.querySelector('[data-price-svg]')
  const scrubber = root.querySelector('[data-price-scrubber]')
  const assetButtons = [...root.querySelectorAll('[data-asset]')]
  const periodButtons = [...root.querySelectorAll('[data-period]')]
  const viewButtons = [...root.querySelectorAll('[data-chart-view]')]
  const averageToggle = root.querySelector('[data-average-toggle]')
  const volumeSvg = root.querySelector('[data-volume-svg]')
  const motion = createMarketMotion(svg)
  let asset = 'equities'
  let period = '1y'
  let series
  let geometry
  let marker
  let displayedPoints
  let view = viewButtons.length ? 'candles' : 'line'
  let averages = true
  let inspectedIndex = 51

  function moveMarker(point) {
    marker.crosshair.setAttribute('x1', point.x)
    marker.crosshair.setAttribute('x2', point.x)
    for (const circle of [marker.point, marker.halo]) {
      circle.setAttribute('cx', point.x)
      circle.setAttribute('cy', point.y)
    }
  }

  function inspect(index, animate = false) {
    const position = Math.max(0, Math.min(series.length - 1, Math.round(index)))
    if (animate) {
      motion.stop('intro')
      motion.stop('plot')
      if (position === inspectedIndex) return
    }
    inspectedIndex = position
    const point = geometry.points[position]
    scrubber.value = String(position)
    const date = formatObservationDate(point.date)
    scrubber.setAttribute('aria-valuetext', `${date}: ${point.value.toFixed(1)} index points`)
    output(root, '[data-observation-date]', date)
    output(root, '[data-observation-value]', point.value.toFixed(1))
    for (const field of ['open', 'high', 'low']) output(root, `[data-ohlc-${field}]`, point[field].toFixed(2))
    output(root, '[data-ohlc-close]', point.value.toFixed(2))
    output(root, '[data-observation-volume]', formatVolume(point.volume))
    volumeSvg?.querySelectorAll('[data-volume-bar]').forEach(bar => bar.setAttribute('opacity', Number(bar.dataset.volumeBar) === position ? 1 : .38))
    if (!animate) { moveMarker(point); return }
    const from = { x: Number(marker.point.getAttribute('cx')), y: Number(marker.point.getAttribute('cy')) }
    motion.run('marker', progress => {
      const t = easeOut(progress)
      moveMarker({ x: from.x + (point.x - from.x) * t, y: from.y + (point.y - from.y) * t })
    }, 110)
  }

  function update(animate = false) {
    const previous = displayedPoints
    motion.stopAll()
    series = getPriceSeries(asset, period)
    const summary = getPriceSummary(series)
    geometry = getPriceGeometry(series, dimensions(svg, 300))
    marker = renderPriceChart(svg, geometry, view, averages)
    displayedPoints = geometry.points
    renderVolume(volumeSvg, geometry, series.length - 1)
    selectButton(assetButtons, 'asset', asset)
    selectButton(periodButtons, 'period', period)
    output(root, '[data-asset-name]', ASSET_NAMES[asset])
    output(root, '[data-asset-code]', ASSET_CODES[asset])
    const analytics = getAssetAnalytics(asset, period)
    output(root, '[data-volatility]', `${analytics.volatility.toFixed(1)}%`)
    output(root, '[data-drawdown]', formatReturn(analytics.drawdown))
    output(root, '[data-sma5]', analytics.sma5.toFixed(2))
    output(root, '[data-sma13]', analytics.sma13.toFixed(2))
    output(root, '[data-relative-volume]', `${analytics.relativeVolume.toFixed(2)}×`)
    output(root, '[data-index-value]', summary.last.value.toFixed(1))
    output(root, '[data-change]', formatReturn(summary.change))
    setDirection(root.querySelector('[data-change]'), summary.change)
    output(root, '[data-high]', summary.high.toFixed(1))
    output(root, '[data-low]', summary.low.toFixed(1))
    output(root, '[data-range-start]', formatObservationDate(summary.first.date))
    output(root, '[data-range-end]', formatObservationDate(summary.last.date))
    svg.setAttribute('aria-label', `Simulated ${ASSET_NAMES[asset]} ${view === 'candles' ? 'weekly candlestick' : 'close-price'} chart from ${formatObservationDate(summary.first.date)} to ${formatObservationDate(summary.last.date)}. Closing range ${summary.low.toFixed(1)} to ${summary.high.toFixed(1)}. Use the Inspect an observation slider for each observation.`)
    scrubber.max = String(series.length - 1)
    inspect(series.length - 1)
    if (animate && previous) {
      const interpolate = priceTransition(previous, geometry.points)
      motion.run('plot', progress => {
        displayedPoints = progress === 1 ? geometry.points : interpolate(easeOut(progress))
        const path = displayedPoints.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ')
        marker.linePath.setAttribute('d', progress === 1 ? geometry.line : path)
        marker.areaPath.setAttribute('d', progress === 1 ? geometry.area : `${path} L${geometry.bounds.right},${geometry.bounds.bottom} L${geometry.bounds.left},${geometry.bounds.bottom} Z`)
        revealCandles(marker, geometry, progress)
        moveMarker(view === 'line' ? displayedPoints.at(-1) : geometry.points.at(-1))
      }, 560)
    }
  }

  function pointerInspect(event) {
    const matrix = svg.getScreenCTM()
    if (!matrix) return
    const point = svg.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const local = point.matrixTransform(matrix.inverse())
    inspect(nearestPriceIndex(local.x, series.length, geometry.bounds), true)
  }

  assetButtons.forEach(button => button.addEventListener('click', () => {
    if (asset === button.dataset.asset) return
    asset = button.dataset.asset
    update(true)
  }))
  periodButtons.forEach(button => button.addEventListener('click', () => {
    if (period === button.dataset.period) return
    period = button.dataset.period
    update(true)
  }))
  scrubber.addEventListener('input', () => inspect(Number(scrubber.value), true))
  viewButtons.forEach(button => button.addEventListener('click', () => {
    if (view === button.dataset.chartView) return
    const selected = inspectedIndex
    view = button.dataset.chartView
    selectButton(viewButtons, 'chartView', view)
    update(true)
    if (selected !== inspectedIndex) inspect(selected, true)
  }))
  averageToggle?.addEventListener('click', () => {
    averages = !averages
    averageToggle.setAttribute('aria-pressed', String(averages))
    svg.querySelectorAll('[data-moving-average]').forEach(path => path.setAttribute('display', averages ? 'inline' : 'none'))
  })
  svg.addEventListener('pointermove', event => {
    // Touch scrolling stays native; deliberate touch taps and the slider inspect points.
    if (event.pointerType !== 'touch') pointerInspect(event)
  })
  svg.addEventListener('click', pointerInspect)
  update()
  motion.revealOnce(() => {
    motion.run('intro', progress => {
      marker.linePath.setAttribute('stroke-dasharray', '1')
      marker.linePath.setAttribute('stroke-dashoffset', String(1 - easeOut(progress)))
      marker.areaPath.setAttribute('opacity', 0.13 * easeOut(progress))
      marker.halo.setAttribute('r', 11 + 14 * (1 - progress))
      revealCandles(marker, geometry, progress)
      if (progress === 1) marker.linePath.removeAttribute('stroke-dasharray')
    }, 1150)
  })
  observeSize(svg, () => {
    motion.stopAll()
    geometry = getPriceGeometry(series, dimensions(svg, 300))
    marker = renderPriceChart(svg, geometry, view, averages)
    displayedPoints = geometry.points
    renderVolume(volumeSvg, geometry, inspectedIndex)
    inspect(inspectedIndex)
  })
  ;[...assetButtons, ...periodButtons, ...viewButtons, ...(averageToggle ? [averageToggle] : []), scrubber].forEach(control => { control.disabled = false })
  const interactionNote = root.querySelector('[data-market-interaction-note]')
  if (interactionNote) interactionNote.textContent = 'Explore the chart by pointer or slider.'
}

function initBreadthChart(root) {
  const svg = root.querySelector('[data-sector-svg]')
  const sectorButtons = [...root.querySelectorAll('[data-sector]')]
  const periodButtons = [...root.querySelectorAll('[data-breadth-period]')]
  const motion = createMarketMotion(svg)
  let sector = 'technology'
  let period = '1m'

  function barStates() {
    return [...svg.querySelectorAll('[data-sector-bar]')].map(bar => ({
      x: Number(bar.getAttribute('x')), width: Number(bar.getAttribute('width')), opacity: Number(bar.getAttribute('opacity')),
    }))
  }

  function animateBars(previous, stagger = false) {
    const targets = barStates()
    const bars = [...svg.querySelectorAll('[data-sector-bar]')]
    motion.run('bars', progress => {
      bars.forEach((bar, index) => {
        const local = stagger ? Math.min(1, Math.max(0, (progress * 850 - index * 55) / 575)) : progress
        const t = easeOut(local)
        for (const key of ['x', 'width', 'opacity']) bar.setAttribute(key, previous[index][key] + (targets[index][key] - previous[index][key]) * t)
      })
    }, stagger ? 850 : 480)
  }

  function update(animate = false) {
    const previous = barStates()
    motion.stopAll()
    const { rows, up, down, benchmark } = getBreadthSummary(period)
    const selected = rows.find(row => row.id === sector)
    selectButton(sectorButtons, 'sector', sector)
    selectButton(periodButtons, 'breadthPeriod', period)
    sectorButtons.forEach(button => {
      const row = rows.find(item => item.id === button.dataset.sector)
      output(button, '[data-sector-return]', formatReturn(row.value))
      output(button, '[data-sector-excess]', `${row.excess > 0 ? '+' : row.excess < 0 ? '−' : ''}${Math.abs(row.excess).toFixed(2)}`)
      output(button, '[data-sector-rank]', String(row.rank).padStart(2, '0'))
      button.setAttribute('aria-label', `${row.name}: ${formatReturn(row.value)} over ${BREADTH_PERIOD_NAMES[period]}, ${row.excess.toFixed(2)} percentage points versus the basket, rank ${row.rank} of 6`)
      setDirection(button, row.value)
    })
    output(root, '[data-sector-name]', selected.name)
    output(root, '[data-sector-value]', formatReturn(selected.value))
    setDirection(root.querySelector('[data-sector-value]'), selected.value)
    output(root, '[data-sector-period]', BREADTH_PERIOD_NAMES[period])
    output(root, '[data-market-up]', String(up))
    output(root, '[data-market-down]', String(down))
    output(root, '[data-sector-benchmark]', formatReturn(benchmark, 2))
    output(root, '[data-selected-excess]', `${selected.excess > 0 ? '+' : selected.excess < 0 ? '−' : ''}${Math.abs(selected.excess).toFixed(2)} pp`)
    output(root, '[data-selected-contribution]', `${selected.contribution > 0 ? '+' : selected.contribution < 0 ? '−' : ''}${Math.abs(selected.contribution).toFixed(2)} pp`)
    output(root, '[data-selected-rank]', `${selected.rank} / 6`)
    renderBreadthChart(svg, period, sector)
    if (animate && previous.length) animateBars(previous)
    svg.setAttribute('aria-label', `Illustrative sector returns over ${BREADTH_PERIOD_NAMES[period]}: ${rows.map(row => `${row.name} ${formatReturn(row.value)}`).join(', ')}.`)
  }

  sectorButtons.forEach(button => button.addEventListener('click', () => {
    if (sector === button.dataset.sector) return
    sector = button.dataset.sector
    update(true)
  }))
  periodButtons.forEach(button => button.addEventListener('click', () => {
    if (period === button.dataset.breadthPeriod) return
    period = button.dataset.breadthPeriod
    update(true)
  }))
  update()
  motion.revealOnce(() => {
    const { zero } = getBreadthGeometry(period, dimensions(svg, 260))
    animateBars(barStates().map(() => ({ x: zero, width: 0, opacity: 0.25 })), true)
  })
  observeSize(svg, () => {
    motion.stopAll()
    renderBreadthChart(svg, period, sector)
  })
  ;[...sectorButtons, ...periodButtons].forEach(control => { control.disabled = false })
}

export function initMarketDemos(scope = document) {
  scope.querySelectorAll('[data-market-chart]').forEach(initPriceChart)
  scope.querySelectorAll('[data-market-breadth]').forEach(initBreadthChart)
}
