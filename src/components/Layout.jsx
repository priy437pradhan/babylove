import { Link, Outlet } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import ThemeToggle from './ThemeToggle'

export default function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand">
            <span className="brand-tile" aria-hidden="true">💌</span>
            <span className="brand-text">
              <span className="brand-mark">Nimantran</span>
              <span className="brand-sub">Invites</span>
            </span>
          </Link>
          <nav className="header-nav">
            <ThemeToggle />
            {/* <Link to="/" className="btn btn-primary btn-sm header-cta">
              <FiPlus />
              <span className="header-cta-text">Create invitation</span>
            </Link> */}
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  )
}