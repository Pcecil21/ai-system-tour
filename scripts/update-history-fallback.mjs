import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import { renderHistory } from '../src/historyView.js'
import { treasuryHistory } from '../src/treasuryHistory.js'

const file = new URL('../index.html', import.meta.url)
const html = await readFile(file, 'utf8'), dom = new JSDOM(html)
const root = dom.window.document.querySelector('.history-interface')
const pattern = /<div class="history-interface">[\s\S]*?\n        <\/div>/g
if (!root || [...html.matchAll(pattern)].length !== 1) throw new Error('Expected exactly one history fallback')
renderHistory(root, '22', undefined, { width: 390, height: 260 })
root.querySelectorAll('[data-history-grid] text').forEach(label => label.setAttribute('font-size', '12'))
await writeFile(file, html.replace(pattern, root.outerHTML))
await mkdir(new URL('../public/data/', import.meta.url), { recursive: true })
await writeFile(new URL('../public/data/treasury-history.csv', import.meta.url), 'date,yield_percent\n' + treasuryHistory.map(p => `${p.date},${p.value.toFixed(2)}`).join('\n') + '\n')
dom.window.close()
console.log('Updated the sourced Treasury history fallback and public CSV.')
