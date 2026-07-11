import { SafeImg, Ornament, CustomHtml, useCountdown, splitParticipants } from '../shared/TemplateBits'
import { findMainEvent } from '../../utils/date'
import './traditional.css'

export default function Traditional({ data }) {
  const d = data || {}
  const { first, second } = splitParticipants(d.participants)
  const mainEvent = findMainEvent(d.when_where)
  const cd = useCountdown(d.when_where)

  return (
    <div className="t-trad">
      <div className="t-trad-card">

        {/* hero */}
        <header className="tt-hero">
          <p className="tt-eyebrow">Wedding Invitation</p>
          <Ornament color="#C9A24B" />
          <h1 className="tt-names">
            {first.name || 'Groom'}
            <span className="tt-amp">weds</span>
            {second ? (second.name || 'Bride') : ''}
          </h1>
          <p className="tt-sub">Together with their families, request the honour of your presence</p>
          {mainEvent?.time && <p className="tt-date">{mainEvent.time}</p>}
          {cd && !cd.done && (
            <div className="tt-countdown" aria-label="Countdown to the wedding">
              <Cell num={cd.days} label="Days" />
              <Cell num={pad(cd.hours)} label="Hours" />
              <Cell num={pad(cd.minutes)} label="Minutes" />
              <Cell num={pad(cd.seconds)} label="Seconds" />
            </div>
          )}
          {cd?.done && <p className="tt-today">The auspicious day is here</p>}
        </header>

        {/* couple */}
        {d.primary_image?.length > 0 && (
          <section className="tt-paper">
            <SectionHead eyebrow="The Couple" title="Two hearts, one journey" />
            <div className="tt-couple-grid">
              {d.primary_image.map((img, i) => (
                <figure key={i}>
                  <div className="tt-arch">
                    <SafeImg src={img.image_url} alt={img.image_title || 'Photo'} />
                  </div>
                  <figcaption className="tt-arch-caption">{captionFor(img, d.participants)}</figcaption>
                  <p className="tt-arch-role">{img.image_title}</p>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* family */}
        {d.family_members?.length > 0 && (
          <section className="tt-paper tt-dim">
            <SectionHead eyebrow="With the blessings of" title="Our Family" />
            <div className="tt-family">
              {d.family_members.map((f, i) => (
                <div className="tt-family-item" key={i}>
                  <p className="tt-family-name">{f.name}</p>
                  <p className="tt-family-role">{f.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* when & where */}
        {d.when_where?.length > 0 && (
          <section className="tt-paper">
            <SectionHead eyebrow="When & Where" title="Ceremonies" />
            <div className="tt-timeline">
              {d.when_where.map((w, i) => (
                <div className="tt-tl-item" key={i}>
                  <p className="tt-tl-time">{w.time}</p>
                  <h3 className="tt-tl-title">{w.title}</h3>
                  <p className="tt-tl-msg">{w.message}</p>
                </div>
              ))}
            </div>
            {d.map_url && (
              <a className="tt-map-btn" href={d.map_url} target="_blank" rel="noopener noreferrer">
                View on map
              </a>
            )}
          </section>
        )}

        {/* gallery */}
        {d.other_image?.length > 0 && (
          <section className="tt-gallery">
            <SectionHead eyebrow="Moments" title="Our Gallery" gold />
            <div className="tt-gallery-grid">
              {d.other_image.map((img, i) => (
                <figure className="tt-g-item" key={i}>
                  <SafeImg src={img.image_url} alt={img.image_title || 'Photo'} />
                  <figcaption className="tt-g-cap">{img.image_title}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* messages */}
        {d.messages?.some(m => m.what) && (
          <section className="tt-paper tt-dim">
            <SectionHead eyebrow="A few words" title="From our hearts" />
            <div className="tt-msgs">
              {d.messages.filter(m => m.what).map((m, i) => (
                <div className="tt-msg" key={i}>
                  <span className="tt-msg-whom">For our {m.whom || 'guests'}</span>
                  <p className="tt-msg-text">“{m.what}”</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* custom html */}
        {d.blank_html && (
          <section className="tt-paper">
            <CustomHtml html={d.blank_html} className="tt-custom" />
          </section>
        )}

        {/* footer */}
        <footer className="tt-footer">
          <Ornament color="#C9A24B" />
          <p className="tt-footer-names">
            {(d.participants || []).map(p => p.name).filter(Boolean).join(' ❤ ') || d.event_name}
          </p>
          <p className="tt-footer-note">We await your presence</p>
        </footer>

      </div>
    </div>
  )
}

function SectionHead({ eyebrow, title, gold }) {
  return (
    <>
      <p className="tt-eyebrow">{eyebrow}</p>
      <h2 className={`tt-section-title ${gold ? 'is-gold' : ''}`}>{title}</h2>
      <Ornament color={gold ? '#E9CE8A' : '#C9A24B'} />
    </>
  )
}

function Cell({ num, label }) {
  return (
    <div className="tt-cd-cell">
      <div className="tt-cd-num">{num}</div>
      <div className="tt-cd-lab">{label}</div>
    </div>
  )
}

const pad = (n) => (n < 10 ? `0${n}` : `${n}`)

function captionFor(img, participants = []) {
  const match = participants.find(
    p => (p.role || '').toLowerCase() === (img.image_title || '').toLowerCase()
  )
  return match?.name || img.image_title || ''
}
