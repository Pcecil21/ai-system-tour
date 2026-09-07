// Native links retain fragment URLs and work even when this enhancement is unavailable.
const sectionNav = document.querySelector('.section-nav')
const summary = sectionNav.querySelector('summary')
const navigation = sectionNav.closest('.nav')

// Enlarged text can wrap the mobile header onto another line.
// Native fragment links must still leave their destination below it.
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--inventory-nav-height', `${navigation.getBoundingClientRect().height}px`)
}).observe(navigation)

sectionNav.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]')
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  sectionNav.open = false
  document.getElementById(link.hash.slice(1))?.focus({ preventScroll: true })
})

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !sectionNav.open) return
  sectionNav.open = false
  summary.focus({ preventScroll: true })
  event.preventDefault()
})

document.addEventListener('click', event => {
  if (!sectionNav.open || sectionNav.contains(event.target)) return
  sectionNav.open = false
  // An outside click on plain text must not leave focus in the hidden link list.
  if (sectionNav.contains(document.activeElement)) summary.focus({ preventScroll: true })
})

document.addEventListener('focusin', event => {
  if (!sectionNav.contains(event.target)) sectionNav.open = false
})
