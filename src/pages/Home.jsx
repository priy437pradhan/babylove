import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

export default function Home() {
  const [types, setTypes] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getEventTypes().then(setTypes).catch(e => setError(e.message))
  }, [])

  return (
    <main className="page">
      <div className="home-hero">
        <div className="hero-garland" aria-hidden="true">✿ ❀ ✿ ❀ ✿</div>
        <p className="eyebrow-ui">Digital invitations, made in minutes</p>
        <h1 className="page-title">Every celebration deserves a beautiful nimantran</h1>
        <p className="page-lede">
          Pick your occasion, choose a design, fill in your details and share
          one elegant link with everyone you love.
        </p>
      </div>

      {error && <p className="error-note">{error}</p>}
      {!types && !error && (
        <div className="loading-block"><span className="spinner spinner-dark" /> Loading occasions…</div>
      )}

      {types && (
        <div className="event-grid">
          {types.map(t => (
            <Link
              key={t.key}
              to={t.comingSoon ? '#' : `/events/${t.key}`}
              className={`event-card ${t.comingSoon ? 'is-disabled' : ''}`}
              aria-disabled={t.comingSoon || undefined}
            >
              {t.comingSoon && <span className="soon-pill">Soon</span>}
              <div className="event-icon">{t.icon}</div>
              <div className="event-name">{t.name}</div>
              <div className="event-tagline">{t.tagline}</div>
            </Link>
          ))}
        </div>
      )}

      <div className="how-strip">
        <p className="eyebrow-ui">How it works</p>
        <div className="how-grid">
          <div className="how-step"><b>1 · Choose</b> Pick your occasion and a template you love.</div>
          <div className="how-step"><b>2 · Fill</b> Add names, photos, ceremonies and messages.</div>
          <div className="how-step"><b>3 · Pay</b> A simple one-time payment publishes your page.</div>
          <div className="how-step"><b>4 · Share</b> Send your personal link on WhatsApp and beyond.</div>
        </div>
      </div>
    </main>
  )
}
