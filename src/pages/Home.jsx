import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  FiEye, FiEdit3, FiCreditCard, FiShare2, FiArrowRight, FiHeart,
  FiSmartphone, FiZap, FiClock, FiImage,
} from 'react-icons/fi'
import { api } from '../api/client'
import { EVENT_TYPES, TEMPLATES, getTemplateMeta } from '../config/eventTypes'
import { getSample } from '../config/formSchemas'
import { resolveTemplate } from '../templates/registry'
import PreviewFrame from '../components/PreviewFrame'

gsap.registerPlugin(ScrollTrigger)

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

const WHY = [
  { icon: <FiZap />,        t: 'Live in minutes',     d: 'No designer, no back-and-forth — fill a form, get a page.' },
  { icon: <FiSmartphone />, t: 'WhatsApp-first',      d: 'Opens beautifully right inside the chat, on every phone.' },
  { icon: <FiEdit3 />,      t: 'Free edits, always',  d: 'Fix a typo or change the venue — the link never breaks.' },
  { icon: <FiImage />,      t: 'Photos, maps & more', d: 'Galleries, countdowns, one-tap directions to the venue.' },
]

/* headline, split into words for the masked line-reveal */
const TITLE_WORDS = ['Send', 'a', 'nimantran', "they'll", 'never', 'forget']

/* templates the hero phone cycles through */
const HERO_KEYS = (TEMPLATES.marriage || []).map(t => t.key)

/* real numbers pulled from the catalog — no fake stats */
const DESIGN_COUNT = Object.values(TEMPLATES).reduce((n, arr) => n + arr.length, 0)
const LIVE_OCCASIONS = EVENT_TYPES.filter(t => !t.comingSoon).length
const MIN_PRICE = Math.min(...Object.values(TEMPLATES).flat().map(t => t.price))

export default function Home() {
  const rootRef = useRef(null)
  const [types, setTypes] = useState(null)
  const [error, setError] = useState(null)
  const [heroIdx, setHeroIdx] = useState(0)

  useEffect(() => {
    api.getEventTypes().then(setTypes).catch(e => setError(e.message))
  }, [])

  useEffect(() => {
    if (HERO_KEYS.length < 2) return
    const id = setInterval(() => setHeroIdx(i => (i + 1) % HERO_KEYS.length), 5000)
    return () => clearInterval(id)
  }, [])

  /* ---------------- GSAP: hero + scroll animations ---------------- */
  useEffect(() => {
    const mm = gsap.matchMedia(rootRef)

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 840px)',
        hoverable: '(hover: hover)',
      },
      (context) => {
        const { motion, desktop, hoverable } = context.conditions
        if (!motion) return

        /* --- hero entrance: masked word reveal + staggered elements --- */
        gsap.set('.word', { yPercent: 115 })
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
        tl.from('.hero-cute', { scale: 0, rotate: 40, autoAlpha: 0, duration: 0.7, ease: 'back.out(2.2)' }, 0)
          .from('.hero-eyebrow', { y: 16, autoAlpha: 0, duration: 0.7 }, 0.05)
          .to('.word', { yPercent: 0, duration: 1.1, stagger: 0.07 }, 0.15)
          .from('.hero-lede', { y: 26, autoAlpha: 0, duration: 0.8 }, '-=0.7')
          .from('.hero-actions .btn', { y: 18, autoAlpha: 0, stagger: 0.1, duration: 0.55 }, '-=0.55')
          .from('.hero-chips li', { y: 14, autoAlpha: 0, stagger: 0.07, duration: 0.5 }, '-=0.45')
          .from('.hero-stat', { y: 20, autoAlpha: 0, stagger: 0.1, duration: 0.6 }, '-=0.4')
          .from('.phone-shell', { y: 90, rotate: 9, autoAlpha: 0, duration: 1.3, ease: 'expo.out' }, 0.35)
          .from('.phone-caption', { autoAlpha: 0, duration: 0.6 }, '-=0.6')

        /* --- phone parallax while the hero scrolls away (desktop only) --- */
        if (desktop) {
          gsap.to('.hero-phone-wrap', {
            y: -46, ease: 'none',
            scrollTrigger: { trigger: '.hero-light', start: 'top top', end: 'bottom top', scrub: true },
          })
        }

        /* --- count-up stats --- */
        gsap.utils.toArray('.count-num').forEach(el => {
          const target = Number(el.dataset.count || 0)
          const state = { v: 0 }
          gsap.to(state, {
            v: target, duration: 1.6, ease: 'power1.out', delay: 0.6,
            onUpdate: () => { el.textContent = Math.round(state.v) },
          })
        })

        /* --- scroll reveals: DESKTOP ONLY. On mobile nothing is ever
               hidden waiting for a trigger — content is simply there. --- */
        if (desktop) {
          gsap.utils.toArray('.reveal').forEach(el => {
            gsap.from(el, {
              y: 34, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 86%', once: true },
            })
          })
          gsap.set('.stagger-item', { y: 44, autoAlpha: 0 })
          ScrollTrigger.batch('.stagger-item', {
            start: 'top 90%', once: true,
            onEnter: els => gsap.to(els, { y: 0, autoAlpha: 1, stagger: 0.09, duration: 0.8, ease: 'power3.out' }),
          })
        }

        /* --- journey line draws itself as you scroll --- */
        if (desktop) {
          const path = rootRef.current?.querySelector('.journey-base')
          if (path) {
            const len = path.getTotalLength()
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
            gsap.to(path, {
              strokeDashoffset: 0, ease: 'none',
              scrollTrigger: { trigger: '.journey-wrap', start: 'top 85%', end: 'top 25%', scrub: true },
            })
          }
        }

        /* --- CTA band: gentle zoom-in (desktop only) --- */
        if (desktop) {
          gsap.from('.cta-band', {
            scale: 0.96, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: '.cta-band', start: 'top 88%', once: true },
          })
        }

        /* --- magnetic buttons (desktop pointers only) --- */
        const cleanups = []
        if (hoverable) {
          rootRef.current?.querySelectorAll('.magnetic').forEach(btn => {
            const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' })
            const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' })
            const move = (e) => {
              const r = btn.getBoundingClientRect()
              xTo((e.clientX - r.left - r.width / 2) * 0.3)
              yTo((e.clientY - r.top - r.height / 2) * 0.35)
            }
            const leave = () => { xTo(0); yTo(0) }
            btn.addEventListener('mousemove', move)
            btn.addEventListener('mouseleave', leave)
            cleanups.push(() => {
              btn.removeEventListener('mousemove', move)
              btn.removeEventListener('mouseleave', leave)
            })
          })
        }
        return () => cleanups.forEach(fn => fn())
      }
    )
    return () => mm.revert()
  }, [])

  /* occasion cards arrive after the API call — animate them separately */
  useEffect(() => {
    if (!types) return
    const mm = gsap.matchMedia(rootRef)
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 840px)', () => {
      gsap.set('.event-card', { y: 44, autoAlpha: 0 })
      ScrollTrigger.batch('.event-card', {
        start: 'top 90%', once: true,
        onEnter: els => gsap.to(els, { y: 0, autoAlpha: 1, stagger: 0.09, duration: 0.8, ease: 'power3.out' }),
      })
      ScrollTrigger.refresh()
    })
    return () => mm.revert()
  }, [types])

  const heroKey = HERO_KEYS[heroIdx]
  const HeroTpl = resolveTemplate('marriage', heroKey)
  const heroMeta = getTemplateMeta('marriage', heroKey)

  return (
    <main className="home-page" ref={rootRef}>

      {/* ================= hero ================= */}
      <section className="hero-light">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-cute" aria-hidden="true">💌</div>
            <p className="eyebrow-ui hero-eyebrow"><FiZap style={{ verticalAlign: '-2px' }} /> Digital invitations, made in minutes</p>
            <h1>
              {TITLE_WORDS.map((w, i) => (
                <span className="word-mask" key={i}>
                  <span className="word">
                    {w === 'nimantran' ? <em className="accent-gold">{w}</em> : w}
                  </span>
                  {' '}
                </span>
              ))}
            </h1>
            <p className="hero-lede">
              Choose a design, add your names and photos, pay once — and share
              one beautiful link that opens perfectly inside WhatsApp.
            </p>
            <div className="hero-actions">
              <a href="#occasions" className="btn btn-primary magnetic">Start creating <FiArrowRight /></a>
              <Link to="/events/marriage" className="btn btn-ghost">See wedding designs</Link>
            </div>
            <ul className="hero-chips">
              <li><FiClock /> Live in 5 minutes</li>
              <li><FiEdit3 /> Free edits anytime</li>
              <li><FiSmartphone /> Perfect on every phone</li>
            </ul>
            <div className="hero-stats">
              <div className="hero-stat">
                <b><span className="count-num" data-count={DESIGN_COUNT}>0</span>+</b>
                <span>Designs</span>
              </div>
              <div className="hero-stat">
                <b><span className="count-num" data-count={LIVE_OCCASIONS}>0</span></b>
                <span>Occasions live</span>
              </div>
              <div className="hero-stat">
                <b>₹<span className="count-num" data-count={MIN_PRICE}>0</span></b>
                <span>Starting price</span>
              </div>
            </div>
          </div>

          {/* live phone mockup — the real templates, rotating */}
          <div className="hero-phone-wrap">
            <div className="phone-shell">
              <span className="phone-notch" aria-hidden="true" />
              <PreviewFrame className="phone-screen" title="Live invitation preview">
                <div key={heroKey} className="hero-fade">
                  {HeroTpl ? <HeroTpl data={getSample('marriage', heroKey)} /> : null}
                </div>
              </PreviewFrame>
            </div>
            <p className="phone-caption">
              <i /> Live preview · {heroMeta?.name || 'Template'} — exactly what your guests see
            </p>
          </div>
        </div>
      </section>

      <div className="page home-sections">

      {/* ================= occasions marquee ================= */}
      <div className="marquee marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span className="marquee-item" key={i}>{m}</span>
          ))}
        </div>
      </div>

      {/* ================= occasions ================= */}
      <section id="occasions" className="occasions">
        <div className="reveal">
          <p className="eyebrow-ui">Occasions</p>
          <h2 className="section-heading">What are we celebrating?</h2>
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
                <span className="event-go"><FiArrowRight /></span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ================= why nimantran ================= */}
      <section className="why">
        <div className="reveal">
          <p className="eyebrow-ui">Why Nimantran</p>
          <h2 className="section-heading">Everything a paper card can't do</h2>
        </div>
        <div className="why-grid">
          {WHY.map((w, i) => (
            <div className="why-card stagger-item" key={i}>
              <div className="step-icon">{w.icon}</div>
              <b>{w.t}</b>
              <p>{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= how it works: line draws on scroll ================= */}
      <section className="journey">
        <div className="reveal">
          <p className="eyebrow-ui">How it works</p>
          <h2 className="section-heading">From "let's celebrate" to shared — in four steps</h2>
        </div>

        <div className="journey-wrap">
          <svg className="journey-svg" viewBox="0 0 1000 150" preserveAspectRatio="none" aria-hidden="true">
            <path
              id="journeyPath"
              className="journey-base"
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
              <div className="step-card stagger-item" key={i}>
                <span className="step-num">Step {i + 1}</span>
                <div className="step-icon">{s.icon}</div>
                <b>{s.t}</b>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA band ================= */}
      <section className="cta-band">
        <h2>Your shubh moment deserves a shubh invite</h2>
        <p>Create it now, share it tonight — guests open it right inside WhatsApp.</p>
        <a href="#occasions" className="btn btn-gold magnetic">Create my invitation <FiHeart /></a>
      </section>

      </div>{/* /.home-sections */}

    </main>
  )
}