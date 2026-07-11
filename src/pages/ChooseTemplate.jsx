import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { getEventType } from '../config/eventTypes'
import { getSample } from '../config/formSchemas'
import PreviewModal from '../components/PreviewModal'

export default function ChooseTemplate() {
  const { eventTypeKey } = useParams()
  const navigate = useNavigate()
  const eventType = getEventType(eventTypeKey)

  const [templates, setTemplates] = useState(null)
  const [error, setError] = useState(null)
  const [previewing, setPreviewing] = useState(null) // template meta

  useEffect(() => {
    setTemplates(null)
    api.getTemplates(eventTypeKey).then(setTemplates).catch(e => setError(e.message))
  }, [eventTypeKey])

  if (!eventType) {
    return (
      <main className="page invite-notfound">
        <h1 className="page-title">Unknown event type</h1>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>Back to home</Link>
      </main>
    )
  }

  return (
    <main className="page">
      <p className="eyebrow-ui">{eventType.icon} {eventType.name}</p>
      <h1 className="page-title">Choose a design</h1>
      <p className="page-lede">
        Every template runs on the same details — preview with sample data,
        then fill in your own.
      </p>

      {error && <p className="error-note">{error}</p>}
      {!templates && !error && (
        <div className="loading-block"><span className="spinner spinner-dark" /> Loading templates…</div>
      )}

      {templates && (
        <div className="template-grid">
          {templates.map(t => (
            <article className="template-card" key={t.key}>
              <div className="swatch-band" aria-hidden="true">
                {t.palette.map((c, i) => <span key={i} style={{ background: c }} />)}
              </div>
              <div className="template-body">
                <h2 className="template-name">{t.name}</h2>
                <p className="template-desc">{t.description}</p>
                <p className="template-price">₹{t.price}</p>
                <div className="template-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => setPreviewing(t)}>Preview</button>
                  <Link className="btn btn-primary btn-sm" to={`/create/${eventTypeKey}/${t.key}`}>Use this</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {previewing && (
        <PreviewModal
          eventTypeKey={eventTypeKey}
          templateTypeKey={previewing.key}
          data={getSample(eventTypeKey, previewing.key)}
          title={`${eventType.name} · ${previewing.name}`}
          onClose={() => setPreviewing(null)}
          onUse={() => navigate(`/create/${eventTypeKey}/${previewing.key}`)}
        />
      )}
    </main>
  )
}
