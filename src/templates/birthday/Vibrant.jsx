import { SafeImg, CustomHtml, useCountdown } from '../shared/TemplateBits'
import { findMainEvent } from '../../utils/date'
import './vibrant.css'

const CONFETTI = ['#FFD166', '#FF6B6B', '#06D6A0', '#4CC9F0', '#F72585']

function Confetti() {
  const bits = Array.from({ length: 26 }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    rot: (i * 47) % 360,
    color: CONFETTI[i % CONFETTI.length],
    round: i % 3 === 0,
  }))
  return (
    <div className="tb-confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          className={b.round ? 'is-round' : ''}
          style={{ left: `${b.left}%`, top: `${b.top}%`, background: b.color, transform: `rotate(${b.rot}deg)` }}
        />
      ))}
    </div>
  )
}

export default function Vibrant({ data }) {
  const d = data || {}
  const star = d.participants?.[0] || { name: '' }
  const mainEvent = findMainEvent(d.when_where)
  const cd = useCountdown(d.when_where)

  return (
    <div className="t-bday">
      <div className="t-bday-card">

        <header className="tb-hero">
          <Confetti />
          <p className="tb-eyebrow">You're invited!</p>
          <h1 className="tb-name">{star.name || 'Birthday Star'}</h1>
          <p className="tb-event-name">{d.event_name}</p>
          {mainEvent?.time && <p className="tb-date">{mainEvent.time}</p>}
          {cd && !cd.done && (
            <div className="tb-count">
              <span>{cd.days}<b>days</b></span>
              <span>{cd.hours}<b>hrs</b></span>
              <span>{cd.minutes}<b>min</b></span>
              <span>{cd.seconds}<b>sec</b></span>
            </div>
          )}
          {cd?.done && <p className="tb-today">It's party time! 🎉</p>}
        </header>

        {d.primary_image?.length > 0 && (
          <section className="tb-section">
            <div className="tb-star-photos">
              {d.primary_image.map((img, i) => (
                <figure key={i} className="tb-star-photo" style={{ '--tb-ring': CONFETTI[i % CONFETTI.length] }}>
                  <SafeImg src={img.image_url} alt={img.image_title || 'Photo'} />
                  <figcaption>{img.image_title}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {d.when_where?.length > 0 && (
          <section className="tb-section">
            <h2 className="tb-title">The plan</h2>
            <div className="tb-plan">
              {d.when_where.map((w, i) => (
                <div className="tb-plan-item" key={i} style={{ '--tb-accent': CONFETTI[i % CONFETTI.length] }}>
                  <span className="tb-plan-time">{w.time}</span>
                  <h3>{w.title}</h3>
                  <p>{w.message}</p>
                </div>
              ))}
            </div>
            {d.map_url && (
              <a className="tb-map" href={d.map_url} target="_blank" rel="noopener noreferrer">
                📍 Find the venue
              </a>
            )}
          </section>
        )}

        {d.family_members?.length > 0 && (
          <section className="tb-section tb-soft">
            <h2 className="tb-title">Hosted by</h2>
            <div className="tb-hosts">
              {d.family_members.map((f, i) => (
                <div className="tb-host" key={i}>
                  <b>{f.name}</b>
                  <span>{f.role}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {d.other_image?.length > 0 && (
          <section className="tb-section">
            <h2 className="tb-title">Memory wall</h2>
            <div className="tb-gallery">
              {d.other_image.map((img, i) => (
                <figure key={i} className="tb-g-item" style={{ '--tb-accent': CONFETTI[(i + 2) % CONFETTI.length] }}>
                  <SafeImg src={img.image_url} alt={img.image_title || 'Photo'} />
                  <figcaption>{img.image_title}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {d.messages?.some(m => m.what) && (
          <section className="tb-section tb-soft">
            {d.messages.filter(m => m.what).map((m, i) => (
              <div className="tb-note" key={i}>
                <span>Note for {m.whom || 'guests'}</span>
                <p>{m.what}</p>
              </div>
            ))}
          </section>
        )}

        {d.blank_html && (
          <section className="tb-section">
            <CustomHtml html={d.blank_html} className="tb-custom" />
          </section>
        )}

        <footer className="tb-footer">
          <p>See you there! 🎈</p>
        </footer>

      </div>
    </div>
  )
}
