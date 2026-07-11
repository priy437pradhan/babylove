import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="page invite-notfound">
      <p className="eyebrow-ui">404</p>
      <h1 className="page-title">This page doesn't exist</h1>
      <p className="page-lede" style={{ margin: '10px auto 26px' }}>
        The link may be wrong, or the page has moved.
      </p>
      <Link to="/" className="btn btn-primary">Go to home</Link>
    </main>
  )
}
