import { Link, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">Nimantran</span>
            <span className="brand-sub">Invites</span>
          </Link>
          <Link to="/" className="header-link">Create invitation</Link>
        </div>
      </header>
      <Outlet />
    </>
  )
}
