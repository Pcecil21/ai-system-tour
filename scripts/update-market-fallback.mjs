// Legacy simulated-chart generator retained for recovery only. The active website
// uses scripts/update-market-panels.mjs and src/marketFeeds.js with real data.
throw new Error('Simulated market fallbacks are retired. Run node scripts/update-market-panels.mjs instead.')
// Refresh the inventory panels and the homepage study from the shared renderer.
// Run with: node scripts/update-market-fallback.mjs
import { readFile, writeFile } from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import { initMarketDemos } from '../src/marketDemo.js'

const file = new URL('../inventory.html', import.meta.url)
const html = await readFile(file, 'utf8')
const dom = new JSDOM(html)
globalThis.window = dom.window
globalThis.document = dom.window.document
initMarketDemos()
for (const panel of document.querySelectorAll('.market-demo')) {
  panel.querySelectorAll('button, input').forEach(control => { control.disabled = true })
  const slider = panel.querySelector('input[type="range"]')
  if (slider) slider.setAttribute('value', slider.value)
  const note = panel.querySelector('[data-market-interaction-note]')
  if (note) note.textContent = 'Static sample · controls become available when loaded.'
}
const panels = [...document.querySelectorAll('section.market-demo')]
let index = 0
const updated = html.replace(/<section class="market-demo"[\s\S]*?<\/section>/g, () => panels[index++].outerHTML)
if (index !== 2) throw new Error('Expected exactly two market panels; source left unchanged.')
// The homepage uses the same study, with its secondary readout inside the disclosure.
// Keep a single source for controls, labels, sample data and static SVG geometry.
const homeFile = new URL('../index.html', import.meta.url)
const home = await readFile(homeFile, 'utf8')
const homePanel = panels[0].cloneNode(true)
homePanel.querySelector('.market-methodology').append(homePanel.querySelector('.market-readout'))
const marker = /<!-- HOME_MARKET_STUDY_START -->[\s\S]*?<!-- HOME_MARKET_STUDY_END -->/
if (!marker.test(home)) throw new Error('Homepage study markers are missing.')
const homeMarkup = homePanel.outerHTML.replace(/^[\t ]+$/gm, '')
await writeFile(file, updated)
await writeFile(homeFile, home.replace(marker, `<!-- HOME_MARKET_STUDY_START -->\n${homeMarkup}\n    <!-- HOME_MARKET_STUDY_END -->`))
dom.window.close()
console.log('Updated inventory panels and homepage study from the interactive renderer.')
