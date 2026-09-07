// Provider-hosted market data. No prices, returns, or volumes are generated here.
export const MARKET_ASSETS = Object.freeze({
  equities: Object.freeze({ symbol: 'AMEX:SPY', ticker: 'SPY', name: 'U.S. equities', description: 'SPDR S&P 500 ETF Trust · USD', url: 'https://www.tradingview.com/symbols/AMEX-SPY/' }),
  bonds: Object.freeze({ symbol: 'NASDAQ:IEF', ticker: 'IEF', name: 'U.S. Treasuries', description: 'iShares 7–10 Year Treasury Bond ETF · USD', url: 'https://www.tradingview.com/symbols/NASDAQ-IEF/' }),
  gold: Object.freeze({ symbol: 'AMEX:GLD', ticker: 'GLD', name: 'Gold', description: 'SPDR Gold Shares · USD', url: 'https://www.tradingview.com/symbols/AMEX-GLD/' }),
})

export function marketWidgetConfig(kind, asset = 'equities') {
  if (kind === 'heatmap') return {
    exchanges: [], dataSource: 'SPX500', grouping: 'sector',
    blockSize: 'market_cap_basic', blockColor: 'change', locale: 'en',
    symbolUrl: '', colorTheme: 'dark', hasTopBar: true,
    isDataSetEnabled: false, isZoomEnabled: true, hasSymbolTooltip: true,
    isMonoSize: false, width: '100%', height: '100%',
  }
  if (kind !== 'price' || !Object.hasOwn(MARKET_ASSETS, asset)) throw new RangeError('Unknown market panel or asset')
  return {
    autosize: true, symbol: MARKET_ASSETS[asset].symbol, interval: 'W',
    timezone: 'America/New_York', theme: 'dark', style: '1', locale: 'en',
    withdateranges: true, range: '12M', hide_side_toolbar: true,
    allow_symbol_change: false, save_image: false,
    backgroundColor: 'rgba(13, 23, 37, 1)', gridColor: 'rgba(49, 66, 84, 0.35)',
    studies: ['MASimple@tv-basicstudies'],
    support_host: 'https://www.tradingview.com',
  }
}

export function initMarketFeeds(scope = document) {
  scope.querySelectorAll('[data-market-feed]').forEach(root => {
    if (root.dataset.feedInitialized) return
    root.dataset.feedInitialized = 'true'
    const kind = root.dataset.marketFeed
    const host = root.querySelector('[data-feed-host]')
    const status = root.querySelector('[data-feed-status]')
    const retry = root.querySelector('[data-feed-retry]')
    const source = root.querySelector('[data-feed-source]')
    const buttons = [...root.querySelectorAll('[data-market-asset]')]
    const disclosure = root.closest('details')
    let asset = 'equities'
    let started = false
    let dispose = () => {}

    function mount() {
      started = true
      dispose()
      const config = marketWidgetConfig(kind, asset)
      const instrument = MARKET_ASSETS[asset]
      const title = kind === 'price' ? `${instrument.ticker} market chart by TradingView` : 'S&P 500 stock heatmap by TradingView'
      const url = kind === 'price' ? instrument.url : 'https://www.tradingview.com/heatmap/stock/'
      root.dataset.feedState = 'loading'
      status.textContent = 'Connecting to TradingView…'
      source.href = url
      source.textContent = kind === 'price' ? `Open ${instrument.ticker} on TradingView ↗` : 'Open the heatmap on TradingView ↗'
      const container = document.createElement('div')
      container.className = 'tradingview-widget-container'
      const widget = document.createElement('div')
      widget.className = 'tradingview-widget-container__widget'
      const copyright = document.createElement('div')
      copyright.className = 'tradingview-widget-copyright'
      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.rel = 'noopener nofollow'
      link.textContent = kind === 'price' ? `${instrument.ticker} chart` : 'Stock Heatmap'
      copyright.append(link, document.createTextNode(' by TradingView'))
      container.append(widget, copyright)
      host.replaceChildren(container)
      let active = true
      let frame
      const slow = setTimeout(() => {
        if (!active || root.dataset.feedState !== 'loading') return
        root.dataset.feedState = 'slow'
        status.textContent = 'Taking longer to connect. Reload, or open the source below.'
      }, 15000)
      function loaded() {
        if (!active) return
        clearTimeout(slow)
        root.dataset.feedState = 'embedded'
        // An iframe load confirms the embed, not the availability of a quote.
        status.textContent = 'Market data by TradingView · exchange delays apply.'
      }
      const observer = new MutationObserver(() => {
        const next = container.querySelector('iframe')
        if (!next || frame === next) return
        frame = next
        frame.title = title
        frame.addEventListener('load', loaded, { once: true })
      })
      observer.observe(container, { childList: true, subtree: true })
      const script = document.createElement('script')
      script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${kind === 'price' ? 'advanced-chart' : 'stock-heatmap'}.js`
      script.async = true
      script.textContent = JSON.stringify(config)
      script.addEventListener('error', () => {
        if (!active) return
        clearTimeout(slow)
        root.dataset.feedState = 'unavailable'
        status.textContent = 'The market chart could not connect. Reload, or open the source below.'
      }, { once: true })
      dispose = () => {
        active = false
        clearTimeout(slow)
        observer.disconnect()
        frame?.removeEventListener('load', loaded)
        script.remove()
      }
      container.append(script)
    }

    function start() {
      if (started || (disclosure && !disclosure.open)) return
      mount()
    }
    buttons.forEach(button => {
      button.disabled = false
      button.addEventListener('click', () => {
        const next = button.dataset.marketAsset
        if (next === asset || !Object.hasOwn(MARKET_ASSETS, next)) return
        asset = next
        const selected = MARKET_ASSETS[asset]
        buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)))
        root.querySelector('[data-feed-name]').textContent = selected.name
        root.querySelector('[data-feed-instrument]').textContent = `${selected.ticker} / ${selected.description}`
        mount()
      })
    })
    retry.hidden = false
    retry.addEventListener('click', mount)
    if (disclosure) disclosure.addEventListener('toggle', start)
    if (typeof IntersectionObserver === 'function') {
      const visibility = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          start()
          if (started) visibility.disconnect()
        }
      }, { rootMargin: '160px' })
      visibility.observe(host)
    } else start()
  })
}
