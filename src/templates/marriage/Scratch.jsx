import { useEffect, useMemo, useRef, useState } from 'react'
import { SafeImg, CustomHtml, useCountdown, splitParticipants } from '../shared/TemplateBits'
import { findMainEvent } from '../../utils/date'
import './scratch.css'

const pad = (n) => (n < 10 ? `0${n}` : `${n}`)

/* emoji per ceremony type, falls back to a generic one */
function iconFor(title = '') {
  const t = title.toLowerCase()
  if (t.includes('haldi')) return '💛'
  if (t.includes('mehendi') || t.includes('mehandi')) return '🌿'
  if (t.includes('sangeet')) return '🎶'
  if (t.includes('wedding') || t.includes('marriage')) return '👑'
  if (t.includes('reception')) return '🥂'
  if (t.includes('engagement') || t.includes('roka')) return '💍'
  return '✨'
}

/* Reveals its children with a fade/rise once scrolled into view. */
function Reveal({ as: Tag = 'div', className = '', delay = '', children, ...rest }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const io = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) { setInView(true); io.unobserve(e.target) } }) },
      { threshold: 0.18 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`tscr-reveal ${delay} ${inView ? 'in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

/* Drifting sparkle background, generated once. */
function Sparkles() {
  const sparks = useMemo(() => {
    const chars = ['✦', '✧', '✨', '•']
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: Math.random() * 98,
      size: 8 + Math.random() * 14,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 10,
      char: chars[i % chars.length],
    }))
  }, [])
  return (
    <div className="tscr-sky" aria-hidden="true">
      {sparks.map(s => (
        <div
          key={s.id}
          className="tscr-spark"
          style={{
            left: `${s.left}%`,
            bottom: '-20px',
            fontSize: `${s.size}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        >
          {s.char}
        </div>
      ))}
    </div>
  )
}

/* Small burst of emoji/sparkle particles at a click point. */
function Bursts({ bursts }) {
  return (
    <>
      {bursts.map(b => (
        <span
          key={b.id}
          className="tscr-burst"
          style={{ left: b.x, top: b.y, '--dx': `${b.dx}px`, '--dy': `${b.dy}px` }}
        >
          {b.char}
        </span>
      ))}
    </>
  )
}

/* The gold-foil scratch card. Reveals whatever is passed as `children`. */
function ScratchCard({ children }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const doneRef = useRef(false)
  const strokesRef = useRef(0)
  const [revealed, setRevealed] = useState(false)

  const paintFoil = () => {
    const canvas = canvasRef.current
    const inner = wrapRef.current?.querySelector('.tscr-scinner')
    if (!canvas || !inner) return
    const ctx = canvas.getContext('2d')
    const rect = inner.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height)
    g.addColorStop(0, '#B8912B'); g.addColorStop(0.3, '#F3D77A')
    g.addColorStop(0.5, '#D4AF37'); g.addColorStop(0.7, '#F7E39B'); g.addColorStop(1, '#A8821F')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, rect.width, rect.height)

    ctx.fillStyle = 'rgba(90,14,28,.55)'
    ctx.font = "700 15px Mulish, sans-serif"
    ctx.textAlign = 'center'
    for (let y = 34; y < rect.height; y += 64) ctx.fillText('✦  SCRATCH ME  ✦', rect.width / 2, y)

    ctx.globalCompositeOperation = 'destination-out'
  }

  const scratchAt = (x, y, r = 26) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  const checkDone = () => {
    if (doneRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    const w = canvas.width, h = canvas.height
    const img = ctx.getImageData(0, 0, w, h).data
    let clear = 0, tot = 0
    for (let y = 0; y < h; y += 16) {
      for (let x = 0; x < w; x += 16) {
        tot++
        if (img[(y * w + x) * 4 + 3] < 40) clear++
      }
    }
    if (tot && clear / tot > 0.45) {
      doneRef.current = true
      setRevealed(true)
    }
  }

  const posFromEvent = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const downRef = useRef(false)
  const onPointerDown = (e) => { downRef.current = true; const p = posFromEvent(e); scratchAt(p.x, p.y) }
  const onPointerMove = (e) => {
    if (!downRef.current) return
    const p = posFromEvent(e)
    scratchAt(p.x, p.y)
    strokesRef.current += 1
    if (strokesRef.current % 12 === 0) checkDone()
  }
  const onPointerUp = () => { downRef.current = false; checkDone() }

  useEffect(() => {
    paintFoil()
    window.addEventListener('resize', paintFoil)
    return () => window.removeEventListener('resize', paintFoil)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={wrapRef} className={`tscr-scwrap ${revealed ? 'done' : ''}`}>
      <div className="tscr-scinner">
        <div className="tscr-under">{children}</div>
        <canvas
          ref={canvasRef}
          className="tscr-foil"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        <div className="tscr-schint">✨ Scratch to reveal ✨</div>
      </div>
    </div>
  )
}

export default function Scratch({ data }) {
  const d = data || {}
  const { first, second } = splitParticipants(d.participants)
  const mainEvent = findMainEvent(d.when_where)
  const cd = useCountdown(d.when_where)
  const [bursts, setBursts] = useState([])

  const heroImg = d.primary_image?.[0]
  const walkImg = d.primary_image?.[1] || d.primary_image?.[0]
  const venueImg = d.primary_image?.[2] || d.primary_image?.[0]
  const coupleNames = [first?.name, second?.name].filter(Boolean).join(' & ')

  const handleTap = (e) => {
    if (e.target.closest && e.target.closest('a, canvas')) return
    const chars = ['✨', '💛', '✦', '👑', '💛']
    const items = Array.from({ length: 6 }, (_, j) => {
      const angle = (Math.PI * 2 / 6) * j + Math.random()
      return {
        id: `${Date.now()}-${j}`,
        x: e.clientX,
        y: e.clientY,
        dx: Math.cos(angle) * (50 + Math.random() * 40),
        dy: Math.sin(angle) * (50 + Math.random() * 40) - 30,
        char: chars[j % chars.length],
      }
    })
    setBursts(prev => [...prev, ...items])
    items.forEach(item => {
      setTimeout(() => setBursts(prev => prev.filter(b => b.id !== item.id)), 950)
    })
  }

  return (
    <div className="t-scr" onClick={handleTap}>
      <Sparkles />
      <Bursts bursts={bursts} />

      <main>
        {/* hero + scratch card */}
        <section className="tscr-section">
          <Reveal className="tscr-eyebrow" as="p">A royal surprise awaits</Reveal>
          <Reveal as="h1" delay="tscr-d1" className="tscr-h1">Someone's Getting Married…</Reveal>
          <Reveal className="tscr-rule" delay="tscr-d1" />

          <Reveal delay="tscr-d2">
            <ScratchCard>
              <SafeImg src={heroImg?.image_url} alt={heroImg?.image_title || coupleNames || 'The couple'} className="tscr-under-img" fallbackClass="tscr-under-fallback" />
              <div className="tscr-under-names">{coupleNames || 'The Happy Couple'}</div>
              {mainEvent?.time && <div className="tscr-under-date">{mainEvent.time}</div>}
            </ScratchCard>
          </Reveal>

          <Reveal delay="tscr-d3" as="p" className="tscr-lead">
            Go on — scratch the golden card and meet the couple 💛
          </Reveal>
        </section>

        {/* save the date */}
        <section className="tscr-section">
          <Reveal className="tscr-eyebrow" as="p">Save the date</Reveal>
          <Reveal as="h2" delay="tscr-d1" className="tscr-h2">The Auspicious Day</Reveal>
          <Reveal delay="tscr-d2" className="tscr-card">
            <div className="tscr-card-big">{mainEvent?.time || 'Date to be announced'}</div>
            <div className="tscr-card-sub">{(mainEvent?.title || 'The celebration begins').toUpperCase()}</div>
          </Reveal>
          {cd && !cd.done && (
            <Reveal delay="tscr-d3" className="tscr-count" aria-label="Countdown to the wedding">
              <div><b>{cd.days}</b><span>days</span></div>
              <div><b>{pad(cd.hours)}</b><span>hrs</span></div>
              <div><b>{pad(cd.minutes)}</b><span>min</span></div>
              <div><b>{pad(cd.seconds)}</b><span>sec</span></div>
            </Reveal>
          )}
          {cd?.done && <Reveal delay="tscr-d3" className="tscr-card-sub">The auspicious day has arrived</Reveal>}
          {walkImg && (
            <Reveal delay="tscr-d3" style={{ marginTop: 34 }}>
              <SafeImg src={walkImg.image_url} alt={walkImg.image_title || 'Couple'} className="tscr-couple-img tscr-bob" fallbackClass="tscr-couple-fallback tscr-bob" />
            </Reveal>
          )}
        </section>

        {/* ceremonies */}
        {d.when_where?.length > 0 && (
          <section className="tscr-section">
            <Reveal className="tscr-eyebrow" as="p">The celebrations</Reveal>
            <Reveal as="h2" delay="tscr-d1" className="tscr-h2">Rituals &amp; Revelry</Reveal>
            <div className="tscr-timeline">
              {d.when_where.map((w, i) => (
                <Reveal as="div" className="tscr-event" delay={`tscr-d${Math.min(i, 3)}`} key={i}>
                  <div className="tscr-emoji">{iconFor(w.title)}</div>
                  <div>
                    <b>{w.title}</b>
                    <span>{w.time} {w.message ? `— ${w.message}` : ''}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* venue */}
        <section className="tscr-section">
          <Reveal className="tscr-eyebrow" as="p">Venue</Reveal>
          <Reveal as="h2" delay="tscr-d1" className="tscr-h2">Grace Us With Your Presence</Reveal>
          {mainEvent?.message && (
            <Reveal as="p" delay="tscr-d1" className="tscr-lead">{mainEvent.message}</Reveal>
          )}
          <Reveal delay="tscr-d2" className="tscr-btnrow">
            {d.map_url && (
              <a className="tscr-btn tscr-btn-g" href={d.map_url} target="_blank" rel="noopener noreferrer">📍 Open in Maps</a>
            )}
            {d.rsvp_phone && (
              <a
                className="tscr-btn tscr-btn-o"
                href={`https://wa.me/${d.rsvp_phone}?text=${encodeURIComponent('Count us in! 👑')}`}
                target="_blank" rel="noopener noreferrer"
              >
                💌 RSVP
              </a>
            )}
          </Reveal>
          {venueImg && (
            <Reveal delay="tscr-d3" style={{ marginTop: 34 }}>
              <SafeImg src={venueImg.image_url} alt={venueImg.image_title || 'Couple'} className="tscr-couple-img tscr-bob" fallbackClass="tscr-couple-fallback tscr-bob" />
            </Reveal>
          )}
          <Reveal as="p" delay="tscr-d3" className="tscr-lead">With love &amp; blessings from both families 🙏</Reveal>
        </section>

        {d.blank_html && (
          <section className="tscr-section">
            <CustomHtml html={d.blank_html} className="tscr-custom" />
          </section>
        )}
      </main>

      <footer className="tscr-footer">
        <span className="tscr-script">{coupleNames || d.event_name}</span>
        <small>tap anywhere for a little sparkle ✨</small>
      </footer>
    </div>
  )
}