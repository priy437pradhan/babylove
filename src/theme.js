// Light/dark theme: persisted, defaults to system preference.
// The invitation templates keep their own designed palettes — the theme
// only affects platform chrome (home, forms, checkout...).
const KEY = 'nimantran_theme'

export function getTheme() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch { /* storage unavailable */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme
  try { localStorage.setItem(KEY, theme) } catch { /* ignore */ }
}

export function initTheme() {
  document.documentElement.dataset.theme = getTheme()
}
