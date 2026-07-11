import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiEye, FiEdit3, FiCreditCard, FiShare2, FiArrowRight, FiHeart, FiSmartphone, FiZap } from 'react-icons/fi'
import { api } from '../api/client'
 
/* floating emojis in the hero — left%, top%, size px, duration s, delay s */
const FLOATIES = [
  { e: '💍', l: 5,  t: 16, s: 30, d: 7,   dl: 0 },
  { e: '🎂', l: 90, t: 20, s: 28, d: 8,   dl: 0.8 },
  { e: '🪔', l: 12, t: 66, s: 26, d: 6.5, dl: 1.4 },
  { e: '🎉', l: 84, t: 62, s: 30, d: 7.5, dl: 0.4 },
  { e: '💐', l: 22, t: 30, s: 22, d: 9,   dl: 2 },
  { e: '✨', l: 72, t: 12, s: 20, d: 6,   dl: 1 },
  { e: '🎊', l: 64, t: 74, s: 24, d: 8.5, dl: 0.2 },
  { e: '🌸', l: 38, t: 10, s: 20, d: 7,   dl: 1.8 },
  { e: '💌', l: 47, t: 80, s: 22, d: 6.8, dl: 0.6 },
  { e: '🥳', l: 30, t: 74, s: 24, d: 9.5, dl: 1.2 },
]
 
const MARQUEE = [
  '💍 Weddings', '🎂 Birthdays', '💐 Engagements', '🏠 Griha Pravesh',
  '👶 Baby Showers', '🪔 Pujas', '🎓 Graduations', '💞 Anniversaries',
  '🎪 Mehendi', '🎶 Sangeet', '🌺 Haldi', '🥂 Receptions',
]
 
const STEPS = [
  { icon: <FiEye />,        t: 'Choose',  d: 'Pick your occasion and a design you love — preview instantly.' },
  { icon: <FiEdit3 />,      t: 'Fill',    d: 'Names, photos, ceremonies — watch the invitation build itself live.' },
  { icon: <FiCreditCard />, t: 'Pay',     d: 'One simple payment publishes your page. Edits stay free.' },
  { icon: <FiShare2 />,     t: 'Share',   d: 'One elegant link on WhatsApp reaches everyone you love.' },
]
 
export default function Home() {
  const [types, setTypes] = useState(null)
  const [error, setError] = useState(null)
 
  useEffect(() => {
    api.getEventTypes().then(setTypes).catch(e => setError(e.message))
  }, [])
 
  return (
    <main className="page">
 
      {/* ---------- hero ---------- */}
      <div className="home-hero">
        <div className="hero-float-field" aria-hidden="true">
          {FLOATIES.map((f, i) => (
            <span
              key={i}
              className="floaty"
              style={{
                left: `${f.l}%`,
                top: `${f.t}%`,
                fontSize: f.s,
                animationDuration: `${f.d}s`,
                animationDelay: `${f.dl}s`,
              }}
            >{f.e}</span>
          ))}
        </div>
 
        <p className="eyebrow-ui"><FiZap style={{ verticalAlign: '-2px' }} /> Digital invitations, made in minutes</p>
        <h1 className="page-title hero-title">
          Every celebration deserves a <span className="shimmer">beautiful</span> nimantran
        </h1>
        <p className="page-lede">
          Pick your occasion, choose a design, fill in your details and share
          one elegant link with everyone you love.
        </p>
        <div className="hero-cta">
          <a href="#occasions" className="btn btn-primary">Start creating <FiArrowRight /></a>
          <span className="hero-cta-note"><FiSmartphone /> Looks perfect on every phone</span>
        </div>
 
        {/* emoji marquee */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span className="marquee-item" key={i}>{m}</span>
            ))}
          </div>
        </div>
      </div>
 
      {/* ---------- occasions ---------- */}
      <section id="occasions" className="occasions">
        <p className="eyebrow-ui">Occasions</p>
        <h2 className="section-heading">What are we celebrating?</h2>
 
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
                <span className="event-go"><FiArrowRight /></span>
              </Link>
            ))}
          </div>
        )}
      </section>
 
      {/* ---------- how it works: animated journey line ---------- */}
      <section className="journey">
        <p className="eyebrow-ui">How it works</p>
        <h2 className="section-heading">From "let's celebrate" to shared — in four steps</h2>
 
        <div className="journey-wrap">
          <svg className="journey-svg" viewBox="0 0 1000 150" preserveAspectRatio="none" aria-hidden="true">
            <path
              id="journeyPath"
              className="journey-base"
              d="M10,110 C160,30 330,140 500,70 C670,10 830,130 990,50"
              fill="none"
            />
            <path
              className="journey-dash"
              d="M10,110 C160,30 330,140 500,70 C670,10 830,130 990,50"
              fill="none"
            />
            <text className="journey-traveller" fontSize="26" dy="9">
              💌
              <animateMotion dur="8s" repeatCount="indefinite">
                <mpath href="#journeyPath" />
              </animateMotion>
            </text>
          </svg>
 
          <div className="journey-steps">
            {STEPS.map((s, i) => (
              <div className="step-card" key={i}>
                <span className="step-num">Step {i + 1}</span>
                <div className="step-icon">{s.icon}</div>
                <b>{s.t}</b>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ---------- CTA band ---------- */}
      <section className="cta-band">
        <span className="floaty cta-floaty" style={{ left: '6%', top: '18%', fontSize: 26, animationDuration: '7s' }}>🪔</span>
        <span className="floaty cta-floaty" style={{ right: '7%', top: '24%', fontSize: 28, animationDuration: '8s', animationDelay: '.7s' }}>🎊</span>
        <span className="floaty cta-floaty" style={{ left: '14%', bottom: '16%', fontSize: 22, animationDuration: '6.4s', animationDelay: '1.2s' }}>✨</span>
        <h2>Your shubh moment deserves a shubh invite</h2>
        <p>Create it now, share it tonight — guests open it right inside WhatsApp.</p>
        <a href="#occasions" className="btn btn-gold">Create my invitation <FiHeart /></a>
      </section>
 
    </main>
  )
}
