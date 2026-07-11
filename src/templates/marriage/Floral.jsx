import { SafeImg, CustomHtml, useCountdown, splitParticipants } from '../shared/TemplateBits'
import { findMainEvent } from '../../utils/date'
import './floral.css'

/* Botanical sprig used in corners and dividers */
function Sprig({ flip = false }) {
  return (
    <svg className={`tf-sprig ${flip ? 'is-flipped' : ''}`} viewBox="0 0 120 60" fill="none" aria-hidden="true">
      <path d="M6 54 C34 44 62 30 112 8" stroke="#7C8F6E" strokeWidth="1.5" fill="none" />
      <path d="M28 46 q-8 -12 2 -18 q8 10 -2 18Z" fill="#9FB08D" />
      <path d="M52 36 q-8 -12 2 -18 q8 10 -2 18Z" fill="#7C8F6E" />
      <path d="M78 25 q-8 -12 2 -18 q8 10 -2 18Z" fill="#9FB08D" />
      <circle cx="100" cy="13" r="5" fill="#C97B84" />
      <circle cx="100" cy="13" r="2" fill="#FDFBF7" />
    </svg>
  )
}

export default function Floral({ data }) {
  const d = data || {}
  const { first, second } = splitParticipants(d.participants)
  const mainEvent = findMainEvent(d.when_where)
  const cd = useCountdown(d.when_where)

  return (
    <div className="t-flo">
      <div className="t-flo-card">

        <header className="tf-hero">
          <Sprig />
          <Sprig flip />
          <p className="tf-eyebrow">Together with their families</p>
          <h1 className="tf-names">
            <span>{first.name || 'Groom'}</span>
            <em>and</em>
            <span>{second ? (second.name || 'Bride') : ''}</span>
          </h1>
          <p className="tf-sub">joyfully invite you to their wedding celebrations</p>
          {mainEvent?.time && <p className="tf-date">{mainEvent.time}</p>}
          {cd && !cd.done && (
            <p className="tf-count">
              {cd.days} days · {cd.hours} hrs · {cd.minutes} min to go
            </p>
          )}
        </header>

        {d.primary_image?.length > 0 && (
          <section className="tf-section">
            <div className="tf-photos">
              {d.primary_image.map((img, i) => (
                <figure key={i} className="tf-photo">
                  <SafeImg src={img.image_url} alt={img.image_title || 'Photo'} />
                  <figcaption>{img.image_title}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {d.family_members?.length > 0 && (
          <section className="tf-section tf-tinted">
            <h2 className="tf-title">With the blessings of</h2>
            <p className="tf-family">
              {d.family_members.map((f, i) => (
                <span key={i}>
                  <b>{f.name}</b> <i>({f.role})</i>
                  {i < d.family_members.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </p>
          </section>
        )}

        {d.when_where?.length > 0 && (
          <section className="tf-section">
            <h2 className="tf-title">When &amp; where</h2>
            <div className="tf-events">
              {d.when_where.map((w, i) => (
                <div className="tf-event-card" key={i}>
                  <h3>{w.title}</h3>
                  <p className="tf-event-venue">{w.message}</p>
                  <p className="tf-event-time">{w.time}</p>
                </div>
              ))}
            </div>
            {d.map_url && (
              <a className="tf-map" href={d.map_url} target="_blank" rel="noopener noreferrer">
                Open map ↗
              </a>
            )}
          </section>
        )}

        {d.other_image?.length > 0 && (
          <section className="tf-section tf-tinted">
            <h2 className="tf-title">Moments</h2>
            <div className="tf-gallery">
              {d.other_image.map((img, i) => (
                <figure key={i} className="tf-photo tf-photo-sm">
                  <SafeImg src={img.image_url} alt={img.image_title || 'Photo'} />
                  <figcaption>{img.image_title}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {d.messages?.some(m => m.what) && (
          <section className="tf-section">
            {d.messages.filter(m => m.what).map((m, i) => (
              <blockquote className="tf-quote" key={i}>
                <p>“{m.what}”</p>
                <cite>for our {m.whom || 'guests'}</cite>
              </blockquote>
            ))}
          </section>
        )}

        {d.blank_html && (
          <section className="tf-section tf-tinted">
            <CustomHtml html={d.blank_html} className="tf-custom" />
          </section>
        )}

        <footer className="tf-footer">
          <Sprig />
          <p>{(d.participants || []).map(p => p.name).filter(Boolean).join(' & ') || d.event_name}</p>
          <span>can't wait to celebrate with you</span>
        </footer>

      </div>
    </div>
  )
}
