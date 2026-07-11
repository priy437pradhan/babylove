import { useEffect, useRef, useState } from 'react'
import { SafeImg, CustomHtml, Reveal, useCountdown, useMusicToggle, MusicButton, splitParticipants } from '../shared/TemplateBits'
import { findMainEvent } from '../../utils/date'
import './nikah.css'

const pad = (n) => (n < 10 ? `0${n}` : `${n}`)

function iconFor(title = '') {
  const t = title.toLowerCase()
  if (t.includes('mehndi') || t.includes('mehendi')) return '🌿'
  if (t.includes('nikah')) return '💍'
  if (t.includes('walima') || t.includes('reception')) return '🥘'
  return '✦'
}

function Doors({ open, onOpen, coupleNames }) {
  return (
    <div className={`tnk-opener ${open ? 'is-open' : ''}`} role="button" aria-label="Tap to open the invitation" onClick={onOpen}>
      <div className="tnk-door tnk-left" />
      <div className="tnk-door tnk-right" />
      <div className="tnk-seal">
        <div className="tnk-bismillah">﷽</div>
        <div className="tnk-ring"><div className="tnk-couple">{coupleNames || 'The Couple'}</div></div>
        <div className="tnk-sub">request the honour of your presence</div>
        <div className="tnk-tap">Tap to open ✦</div>
      </div>
    </div>
  )
}

function CloudReveal({ mainEvent }) {
  const [parted, setParted] = useState(false)
  return (
    <div className={`tnk-sky ${parted ? 'is-parted' : ''}`} role="button" tabIndex={0} aria-label="Tap to part the clouds" onClick={() => setParted(p => !p)}>
      <div className="tnk-stars" />
      <div className="tnk-reveal-date">
        <span className="tnk-rd-day">{mainEvent?.title || 'Save the Date'}</span>
        <span className="tnk-rd-big">{mainEvent?.time || 'Date to be announced'}</span>
        <span className="tnk-rd-sub">InshaAllah</span>
      </div>
      <div className="tnk-cloud tnk-c-left" aria-hidden="true" />
      <div className="tnk-cloud tnk-c-right" aria-hidden="true" />
      <div className="tnk-sky-hint">Tap to part the clouds</div>
    </div>
  )
}

function ScratchCard({ children }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const doneRef = useRef(false)
  const strokesRef = useRef(0)
  const [revealed, setRevealed] = useState(false)

  const paintFoil = () => {
    const canvas = canvasRef.current, wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    const rect = wrap.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height)
    g.addColorStop(0, '#d9b866'); g.addColorStop(.5, '#ecd08a'); g.addColorStop(1, '#b8891f')
    ctx.fillStyle = g; ctx.fillRect(0, 0, rect.width, rect.height)
    ctx.fillStyle = 'rgba(6,40,29,.55)'
    ctx.font = "600 15px Marcellus, serif"; ctx.textAlign = 'center'
    ctx.fillText('SCRATCH TO REVEAL', rect.width / 2, rect.height / 2)
    ctx.globalCompositeOperation = 'destination-out'
  }
  const scratchAt = (x, y, r = 24) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  }
  const checkDone = () => {
    if (doneRef.current) return
    const canvas = canvasRef.current, ctx = canvas?.getContext('2d')
    if (!ctx) return
    const w = canvas.width, h = canvas.height
    const img = ctx.getImageData(0, 0, w, h).data
    let clear = 0, tot = 0
    for (let y = 0; y < h; y += 16) for (let x = 0; x < w; x += 16) { tot++; if (img[(y * w + x) * 4 + 3] < 40) clear++ }
    if (tot && clear / tot > 0.5) { doneRef.current = true; setRevealed(true) }
  }
  const pos = (e) => { const r = canvasRef.current.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
  const downRef = useRef(false)
  const onDown = (e) => { downRef.current = true; const p = pos(e); scratchAt(p.x, p.y) }
  const onMove = (e) => { if (!downRef.current) return; const p = pos(e); scratchAt(p.x, p.y); strokesRef.current++; if (strokesRef.current % 10 === 0) checkDone() }
  const onUp = () => { downRef.current = false; checkDone() }

  useEffect(() => {
    paintFoil()
    window.addEventListener('resize', paintFoil)
    return () => window.removeEventListener('resize', paintFoil)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={wrapRef} className={`tnk-scratch-wrap ${revealed ? 'is-revealed' : ''}`}>
      <div className="tnk-scratch-base">{children}</div>
      <canvas ref={canvasRef} className="tnk-scratch-canvas" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp} />
    </div>
  )
}

export default function Nikah({ data }) {
  const d = data || {}
  const { first, second } = splitParticipants(d.participants)
  const mainEvent = findMainEvent(d.when_where)
  const cd = useCountdown(d.when_where)
  const music = useMusicToggle(d.music_url)
  const [open, setOpen] = useState(false)
  const coupleNames = [first?.name, second?.name].filter(Boolean).join(' & ')
  const heroImg = d.primary_image?.[0]

  const handleOpen = () => { setOpen(true); music.play() }

  return (
    <div className="t-nk">
      <Doors open={open} onOpen={handleOpen} coupleNames={coupleNames} />
      <MusicButton hasMusic={music.hasMusic} playing={music.playing} onToggle={music.toggle} className="tnk-music-btn" />

      <section className="tnk-hero">
        <div className="tnk-bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
        <p className="tnk-families">With the blessings of the Almighty and our beloved families</p>
        <div className="tnk-arch-stage">
          <div className="tnk-arch">
            <SafeImg src={heroImg?.image_url} alt={heroImg?.image_title || coupleNames} className="tnk-arch-img" fallbackClass="tnk-arch-fallback" />
          </div>
        </div>
        <h1 className="tnk-names">
          <span>{first?.name || 'Groom'}</span>
          <span className="tnk-amp">و</span>
          <span>{second?.name || 'Bride'}</span>
        </h1>
        {mainEvent?.time && <p className="tnk-date-line">{mainEvent.time}</p>}
        {mainEvent?.message && <p className="tnk-venue-line">{mainEvent.message}</p>}
      </section>

      <section className="tnk-block">
        <div className="tnk-eyebrow">You are warmly invited</div>
        <h2 className="tnk-h2">Together forever, InshaAllah</h2>
        {d.verse && (
          <Reveal as="p" className="tnk-verse">
            {d.verse}
            {d.verse_ref && <cite>— {d.verse_ref}</cite>}
          </Reveal>
        )}
        {d.hashtag && <p className="tnk-hashtag">{d.hashtag}</p>}
      </section>

      <section className="tnk-block">
        <div className="tnk-eyebrow">Save the date</div>
        <h2 className="tnk-h2">Written in the sky</h2>
        <Reveal as="p" className="tnk-lead">The clouds have kept a little secret. Let them part…</Reveal>
        <CloudReveal mainEvent={mainEvent} />
      </section>

      <section className="tnk-block">
        <div className="tnk-eyebrow">A little surprise</div>
        <h2 className="tnk-h2">Scratch &amp; reveal</h2>
        <Reveal as="p" className="tnk-lead">Rub away the gold to uncover our Nikah date.</Reveal>
        <ScratchCard>
          <span className="tnk-rd-day">Nikah · InshaAllah</span>
          <span className="tnk-rd-big">{mainEvent?.time || 'Date to be announced'}</span>
          <span className="tnk-rd-sub">{mainEvent?.message}</span>
        </ScratchCard>
      </section>

      {cd && (
        <section className="tnk-block">
          <div className="tnk-eyebrow">Counting the days</div>
          <h2 className="tnk-h2">Until our Nikah</h2>
          {!cd.done ? (
            <div className="tnk-countdown">
              <Reveal className="tnk-cd-box"><b>{cd.days}</b><small>Days</small></Reveal>
              <Reveal className="tnk-cd-box"><b>{pad(cd.hours)}</b><small>Hours</small></Reveal>
              <Reveal className="tnk-cd-box"><b>{pad(cd.minutes)}</b><small>Mins</small></Reveal>
              <Reveal className="tnk-cd-box"><b>{pad(cd.seconds)}</b><small>Secs</small></Reveal>
            </div>
          ) : <p className="tnk-rd-big">Today is the blessed day! ✦</p>}
        </section>
      )}

      {d.when_where?.length > 0 && (
        <section className="tnk-block">
          <div className="tnk-eyebrow">Festivities</div>
          <h2 className="tnk-h2">When &amp; Where</h2>
          <div className="tnk-events">
            {d.when_where.map((w, i) => (
              <Reveal as="div" className="tnk-ev" key={i}>
                <div className="tnk-ev-k">{iconFor(w.title)}</div>
                <h3>{w.title}</h3>
                <p>{w.message}</p>
                <span className="tnk-when">{w.time}</span>
              </Reveal>
            ))}
          </div>
          {d.map_url && <a className="tnk-maplink" href={d.map_url} target="_blank" rel="noopener noreferrer">Open in Maps</a>}
        </section>
      )}

      {d.family_members?.length > 0 && (
        <section className="tnk-block">
          <div className="tnk-eyebrow">With the blessings of</div>
          <h2 className="tnk-h2">Our families</h2>
          <ul className="tnk-family">
            {d.family_members.map((f, i) => (
              <Reveal as="li" key={i}><b>{f.name}</b><span>{f.role}</span></Reveal>
            ))}
          </ul>
        </section>
      )}

      {d.other_image?.length > 0 && (
        <section className="tnk-block">
          <div className="tnk-eyebrow">Our journey</div>
          <h2 className="tnk-h2">Moments &amp; memories</h2>
          <div className="tnk-gallery">
            {d.other_image.map((img, i) => (
              <Reveal key={i}>
                <SafeImg src={img.image_url} alt={img.image_title || 'Photo'} className="tnk-gallery-img" fallbackClass="tnk-gallery-fallback" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {d.blank_html && (
        <section className="tnk-block">
          <CustomHtml html={d.blank_html} className="tnk-custom" />
        </section>
      )}

      <footer className="tnk-footer">
        <span className="tnk-ar">بَارَكَ اللّٰهُ لَكُمَا</span>
        <span className="tnk-names-f">{coupleNames}{mainEvent?.time ? ` · ${mainEvent.time}` : ''}</span>
      </footer>
    </div>
  )
}