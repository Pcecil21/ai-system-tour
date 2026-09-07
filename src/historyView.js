import { historyWindow, historySummary, historyGeometry, linePath, monthLabel } from './treasuryHistory.js'

export function renderHistory(root, years = '22', index, size = { width: 900, height: 300 }) {
  const points = historyWindow(years), summary = historySummary(points)
  const selectedIndex = Math.max(0, Math.min(index ?? points.length - 1, points.length - 1))
  const chosen = points[selectedIndex]
  const bounds = { x: 36, y: 16, width: Math.max(10, size.width - 52), height: Math.max(10, size.height - 48) }
  const geometry = historyGeometry(points, bounds)
  const svg = root.querySelector('[data-history-svg]')
  svg.setAttribute('viewBox', `0 0 ${size.width} ${size.height}`)
  svg.setAttribute('aria-label', `10-year Treasury yield, monthly averages, ${monthLabel(points[0].date)} to ${monthLabel(points.at(-1).date)}. Range ${summary.low.value.toFixed(2)} to ${summary.high.value.toFixed(2)} percent. Use Explore a month to inspect observations.`)
  const axis = [0, 2, 4, 6].map(value => {
    const y = bounds.y + bounds.height * (1 - value / 6)
    return `<line x1="${bounds.x}" x2="${bounds.x + bounds.width}" y1="${y}" y2="${y}" stroke="#294252"/><text x="${bounds.x - 10}" y="${y + 4}" text-anchor="end" fill="#a8bfce" font-size="10">${value}%</text>`
  })
  for (const i of [0, points.length - 1]) axis.push(`<text x="${geometry[i].x}" y="${size.height - 6}" text-anchor="${i ? 'end' : 'start'}" fill="#a8bfce" font-size="10">${monthLabel(points[i].date)}</text>`)
  root.querySelector('[data-history-grid]').innerHTML = axis.join('')
  root.querySelector('[data-history-line]').setAttribute('d', linePath(geometry))
  const selectedPoint = geometry[selectedIndex]
  root.querySelector('[data-history-marker]').innerHTML = `<line x1="${selectedPoint.x}" x2="${selectedPoint.x}" y1="${bounds.y}" y2="${bounds.y + bounds.height}" stroke="#698398" stroke-dasharray="3 4"/><circle cx="${selectedPoint.x}" cy="${selectedPoint.y}" r="4" fill="#b4c9ff" stroke="#071827" stroke-width="2"/>`
  const set = (selector, text) => { root.querySelector(selector).textContent = text }
  set('[data-history-date]', monthLabel(chosen.date)); set('[data-history-value]', `${chosen.value.toFixed(2)}%`)
  set('[data-history-low]', `${summary.low.value.toFixed(2)}%`); set('[data-history-high]', `${summary.high.value.toFixed(2)}%`)
  const bps = summary.changeBps
  set('[data-history-change]', `${bps < 0 ? '−' : bps > 0 ? '+' : ''}${Math.abs(bps)} ${Math.abs(bps) === 1 ? 'bp' : 'bps'}`)
  set('[data-history-insight]', years === '22' ? 'Nearly the same yield. Twenty-two years of context.' : years === '5' ? 'Five years reveal the change in rates.' : 'One year brings the recent movement into focus.')
  const slider = root.querySelector('[data-history-scrub]')
  slider.max = String(points.length - 1); slider.value = String(selectedIndex)
  slider.setAttribute('aria-valuetext', `${monthLabel(chosen.date)}: ${chosen.value.toFixed(2)} percent yield`)
  root.querySelectorAll('[data-history-years]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.historyYears === years)))
  return { geometry, points, selectedIndex }
}
