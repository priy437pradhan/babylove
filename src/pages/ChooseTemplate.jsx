import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiEye, FiArrowRight } from 'react-icons/fi'
import { api } from '../api/client'
import { getEventType } from '../config/eventTypes'
import { getSample } from '../config/formSchemas'
import { resolveTemplate } from '../templates/registry'
import PreviewModal from '../components/PreviewModal'
import PreviewFrame from '../components/PreviewFrame'

export default function ChooseTemplate() {
  const { eventTypeKey } = useParams()
  const navigate = useNavigate()
  const eventType = getEventType(eventTypeKey)

  const [templates, setTemplates] = useState(null)
  const [error, setError] = useState(null)
  const [previewing, setPreviewing] = useState(null)

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
      <h1 className="page-title underline-flair">Choose a design</h1>
      <p className="page-lede">
        Every card is a real, living preview with sample details —
        your names and photos will slot right in.
      </p>
      <p className="swipe-hint" aria-hidden="true">Swipe to browse designs <FiArrowRight /></p>

      {error && <p className="error-note">{error}</p>}
      {!templates && !error && (
        <div className="loading-block"><span className="spinner spinner-dark" /> Loading templates…</div>
      )}

      {templates && (
        <div className="template-grid">
          {templates.map(t => {
            const Tpl = resolveTemplate(eventTypeKey, t.key)
            const sample = getSample(eventTypeKey, t.key)
            return (
              <article className="template-card" key={t.key}>
                {Tpl ? (
                  <div className="mini-preview" aria-hidden="true">
                    <PreviewFrame className="mini-pf" title={`${t.name} preview`}>
                      <Tpl data={sample} />
                    </PreviewFrame>
                  </div>
                ) : (
                  <div className="swatch-band" aria-hidden="true">
                    {t.palette.map((c, i) => <span key={i} style={{ background: c }} />)}
                  </div>
                )}
                <div className="template-body">
                  <div className="template-name-row">
                    <h2 className="template-name">{t.name}</h2>
                    <span className="palette-dots" aria-hidden="true">
                      {t.palette.map((c, i) => <i key={i} style={{ background: c }} />)}
                    </span>
                  </div>
                  <p className="template-desc">{t.description}</p>
                  <p className="template-price">₹{t.price}</p>
                  <div className="template-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => setPreviewing(t)}>
                      <FiEye /> Preview
                    </button>
                    <Link className="btn btn-primary btn-sm" to={`/create/${eventTypeKey}/${t.key}`}>
                      Use this <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
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
