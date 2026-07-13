import { useEffect, useState } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import { getTheme, setTheme } from '../theme'

export default function ThemeToggle() {
  const [theme, set] = useState(getTheme)

  useEffect(() => { setTheme(theme) }, [theme])

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => set(t => (t === 'dark' ? 'light' : 'dark'))}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
    >
      {theme === 'dark' ? <FiSun /> : <FiMoon />}
    </button>
  )
}
