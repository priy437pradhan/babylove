import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { resolveTemplate } from '../templates/registry'

/**
 * The public guest-facing page: /invite/:eventUrl
 * Fetches the payload and renders whichever template it names.
 * Templates own the full screen — the site theme does not apply here.
 */
export default function Invitation() {
  const { eventUrl } = useParams()
  const [event, setEvent] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setEvent(null)
    setError(null)
    api.getEventByUrl(eventUrl)
      .then(ev => {
        setEvent(ev)
        if (ev.event_name) document.title = ev.event_name
      })
      .catch(e => setError(e.message))
  }, [eventUrl])

  if (error) {
    return (
      <main className="invite-notfound">
        <p className="eyebrow-ui">Nimantran</p>
        <h1 className="page-title">Invitation not found</h1>
        <p className="page-lede" style={{ margin: '10px auto 26px' }}>
          This link may be incorrect, or the invitation hasn't been published yet.
        </p>
        <Link to="/" className="btn btn-primary">Create your own</Link>
      </main>
    )
  }

  if (!event) {
    return <div className="loading-block" style={{ minHeight: '100vh' }}><span className="spinner spinner-dark" /> Opening invitation…</div>
  }

  const Template = resolveTemplate(event.event_type_key, event.template_type_key)
  if (!Template) {
    return (
      <main className="invite-notfound">
        <h1 className="page-title">Template unavailable</h1>
        <p className="page-lede" style={{ margin: '10px auto' }}>
          "{event.template_type_key}" isn't registered for "{event.event_type_key}".
        </p>
      </main>
    )
  }

  return (
    <>
      {event.status !== 'published' && (
        <div className="draft-banner">
          Draft preview — complete <Link to={`/checkout/${eventUrl}`}>payment</Link> to make this live.
        </div>
      )}
      <Template data={event} />
    </>
  )
}
