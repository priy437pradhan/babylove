import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiEdit3 } from 'react-icons/fi'
import { api } from '../api/client'
 
export default function Success() {
  const { eventUrl } = useParams()
  const [event, setEvent] = useState(null)
  const [copied, setCopied] = useState(false)
 
  useEffect(() => {
    api.getEventByUrl(eventUrl).then(setEvent).catch(() => {})
  }, [eventUrl])
 
  const fullLink = useMemo(
    () => `${window.location.origin}/invite/${eventUrl}`,
    [eventUrl]
  )
 
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }
 
  const waText = encodeURIComponent(
    `${event?.event_name || 'You are invited!'} — ${fullLink}`
  )
 
  return (
    <main className="page page-narrow">
      <div className="success-hero">
        <div className="success-badge">✓</div>
        <p className="eyebrow-ui">Payment successful</p>
        <h1 className="page-title">Your invitation is live!</h1>
        <p className="page-lede" style={{ margin: '10px auto 0' }}>
          Share this link with your guests — it opens beautifully on any phone.
        </p>
 
        <div className="link-box">
          <code>{fullLink}</code>
          <button className="btn btn-primary btn-sm" onClick={copy}>
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
 
        <div className="share-row">
          <a
            className="btn btn-gold"
            href={`https://wa.me/?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on WhatsApp
          </a>
          <Link className="btn btn-primary" to={`/invite/${eventUrl}`}>
            Open invitation
          </Link>
          <Link className="btn btn-ghost" to={`/edit/${eventUrl}`}>
            <FiEdit3 /> Edit invitation
          </Link>
        </div>
        <p className="hint" style={{ textAlign: 'center', marginTop: 16 }}>
          Made a typo? Edits are free anytime — the link never changes, guests always see the latest version.
        </p>
        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <Link className="header-link" to="/">Create another invitation</Link>
        </div>
      </div>
    </main>
  )
}
