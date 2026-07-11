import { SafeImg, CustomHtml, useCountdown, splitParticipants } from '../shared/TemplateBits'
import { findMainEvent } from '../../utils/date'
import './royal.css'

/* Stylized peacock feather — the motif of this template */
function Feather({ className = '' }) {
  return (
    <svg className={`tr-feather ${className}`} viewBox="0 0 64 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M32 110 C32 84 32 66 32 48" stroke="#D4AF6A" strokeWidth="1.6" />
      <path d="M32 92 C22 86 14 78 10 66 M32 92 C42 86 50 78 54 66" stroke="#D4AF6A" strokeWidth="0.9" opacity="0.65" />
      <path d="M32 78 C24 72 18 64 16 54 M32 78 C40 72 46 64 48 54" stroke="#2E8BA8" strokeWidth="0.9" opacity="0.8" />
      <path d="M32 64 C26 58 22 52 21 44 M32 64 C38 58 42 52 43 44" stroke="#D4AF6A" strokeWidth="0.9" opacity="0.65" />
      <ellipse cx="32" cy="27" rx="17" ry="23" fill="#14554A" />
      <ellipse cx="32" cy="29" rx="12" ry="16.5" fill="#2E8BA8" />
      <ellipse cx="32" cy="31" rx="7" ry="10" fill="#D4AF6A" />
      <ellipse cx="32" cy="32.5" rx="3.2" ry="4.8" fill="#082721" />
    </svg>
  )
}

const pad = (n) => (n < 10 ? `0${n}` : `${n}`)

export default function Royal({ data }) {
  const d = data || {}
  const { first, second } = splitParticipants(d.participants)
  const mainEvent = findMainEvent(d.when_where)
  const cd = useCountdown(d.when_where)

  return (
    <div className="t-royal">
      <div className="t-royal-card">

        {/* hero */}
        <header className="tr-hero">
          <div className="tr-frame">
            <Feather />
            <p className="tr-eyebrow">Wedding Invitation</p>
            <h1 className="tr-names">
              <span>{first.name || 'Groom'}</span>
              <span className="tr-and" aria-hidden="true">&</span>
              <span>{second ? (second.name || 'Bride') : ''}</span>
            </h1>
            <p className="tr-sub">With the grace of our elders and the joy in our hearts, we invite you to our wedding</p>
            {mainEvent?.time && <p className="tr-date">{mainEvent.time}</p>}
            {cd && !cd.done && (
              <div className="tr-count" aria-label="Countdown to the wedding">
                <span><b>{cd.days}</b><i>days</i></span>
                <span><b>{pad(cd.hours)}</b><i>hours</i></span>
                <span><b>{pad(cd.minutes)}</b><i>mins</i></span>
                <span><b>{pad(cd.seconds)}</b><i>secs</i></span>
              </div>
            )}
            {cd?.done && <p className="tr-today">The auspicious day has arrived</p>}
          </div>
        </header>

        {/* couple — diamond frames */}
        {d.primary_image?.length > 0 && (
          <section className="tr-section">
            <SectionHead title="The Couple" />
            <div className="tr-diamonds">
              {d.primary_image.map((img, i) => (
                <figure key={i} className="tr-diamond-fig">
                  <div className="tr-diamond">
                    <SafeImg src={img.image_url} alt={img.image_title || 'Photo'} />
                  </div>
                  <figcaption>
                    <b>{captionFor(img, d.participants)}</b>
                    <span>{img.image_title}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* family */}
        {d.family_members?.length > 0 && (
          <section className="tr-section tr-tinted">
            <SectionHead title="With the blessings of" />
            <ul className="tr-family">
              {d.family_members.map((f, i) => (
                <li key={i}>
                  <b>{f.name}</b>
                  <span>{f.role}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ceremonies */}
        {d.when_where?.length > 0 && (
          <section className="tr-section">
            <SectionHead title="Rituals & Celebrations" />
            <div className="tr-events">
              {d.when_where.map((w, i) => (
                <div className="tr-event" key={i}>
                  <span className="tr-event-num">{pad(i + 1)}</span>
                  <h3>{w.title}</h3>
                  <p className="tr-event-venue">{w.message}</p>
                  <p className="tr-event-time">{w.time}</p>
                </div>
              ))}
            </div>
            {d.map_url && (
              <a className="tr-map" href={d.map_url} target="_blank" rel="noopener noreferrer">
                View on map
              </a>
            )}
          </section>
        )}

        {/* gallery */}
        {d.other_image?.length > 0 && (
          <section className="tr-section tr-tinted">
            <SectionHead title="Treasured Moments" />
            <div className="tr-gallery">
              {d.other_image.map((img, i) => (
                <figure key={i} className="tr-g-item">
                  <SafeImg src={img.image_url} alt={img.image_title || 'Photo'} />
                  <figcaption>{img.image_title}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* messages */}
        {d.messages?.some(m => m.what) && (
          <section className="tr-section">
            <Feather className="tr-feather-divider" />
            {d.messages.filter(m => m.what).map((m, i) => (
              <blockquote className="tr-quote" key={i}>
                <p>“{m.what}”</p>
                <cite>for our {m.whom || 'guests'}</cite>
              </blockquote>
            ))}
          </section>
        )}

        {/* custom html */}
        {d.blank_html && (
          <section className="tr-section tr-tinted">
            <CustomHtml html={d.blank_html} className="tr-custom" />
          </section>
        )}

        {/* footer */}
        <footer className="tr-footer">
          <div className="tr-footer-line" aria-hidden="true" />
          <p className="tr-footer-names">
            {(d.participants || []).map(p => p.name).filter(Boolean).join(' & ') || d.event_name}
          </p>
          <span>Awaiting the honour of your presence</span>
        </footer>

      </div>
    </div>
  )
}

function SectionHead({ title }) {
  return (
    <div className="tr-section-head">
      <span className="tr-rule" aria-hidden="true" />
      <h2>{title}</h2>
      <span className="tr-rule" aria-hidden="true" />
    </div>
  )
}

function captionFor(img, participants = []) {
  const match = participants.find(
    p => (p.role || '').toLowerCase() === (img.image_title || '').toLowerCase()
  )
  return match?.name || img.image_title || ''
}