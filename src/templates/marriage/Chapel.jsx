import { useState } from 'react'
import { SafeImg, CustomHtml, Reveal, useCountdown, useMusicToggle, MusicButton, splitParticipants } from '../shared/TemplateBits'
import { findMainEvent } from '../../utils/date'
import './chapel.css'

const pad = (n) => (n < 10 ? `0${n}` : `${n}`)

function XDivider() {
  return (
    <div className="tch-xdiv" aria-hidden="true">
      <svg width="120" height="26" viewBox="0 0 120 26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M8 13 Q22 6 36 13 M14 10 l3 -4 M22 8.6 l2.6 -4.4 M30 9.4 l2.4 -4.2" />
        <path d="M60 5 V21 M54 10.5 H66" strokeWidth="2" />
        <path d="M112 13 Q98 6 84 13 M106 10 l-3 -4 M98 8.6 l-2.6 -4.4 M90 9.4 l-2.4 -4.2" />
      </svg>
    </div>
  )
}

function Doors({ open, onOpen, coupleNames }) {
  return (
    <div className={`tch-opener ${open ? 'is-open' : ''}`} role="button" aria-label="Tap to open the invitation" onClick={onOpen}>
      <div className="tch-door tch-left" />
      <div className="tch-door tch-right" />
      <div className="tch-seal">
        <svg className="tch-cross" viewBox="0 0 26 38" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M13 3 V35 M4 13 H22" />
        </svg>
        <div className="tch-ring"><div className="tch-couple">{coupleNames || 'The Couple'}</div></div>
        <div className="tch-sub">joyfully invite you to their wedding</div>
        <div className="tch-tap">Tap to open ✦</div>
      </div>
    </div>
  )
}

export default function Chapel({ data }) {
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
    <div className="t-chap">
      <Doors open={open} onOpen={handleOpen} coupleNames={coupleNames} />

      <MusicButton hasMusic={music.hasMusic} playing={music.playing} onToggle={music.toggle} className="tch-music-btn" />

      <section className="tch-hero">
        {d.invocation && <p className="tch-invocation">{d.invocation}</p>}
        <p className="tch-families">Together with their families</p>

        <div className="tch-arch-stage">
          <div className="tch-arch">
            <SafeImg src={heroImg?.image_url} alt={heroImg?.image_title || coupleNames} className="tch-arch-img" fallbackClass="tch-arch-fallback" />
          </div>
        </div>

        <h1 className="tch-names">
          <span>{first?.name || 'Groom'}</span>
          <span className="tch-amp">and</span>
          <span>{second?.name || 'Bride'}</span>
        </h1>
        {mainEvent?.time && <p className="tch-date-line">{mainEvent.time}</p>}
        {mainEvent?.message && <p className="tch-venue-line">{mainEvent.message}</p>}
      </section>

      <XDivider />

      <section className="tch-block">
        <div className="tch-eyebrow">You are warmly invited</div>
        <h2 className="tch-h2"><span className="tch-script">Two hearts,</span>one promise</h2>
        {d.verse && (
          <Reveal as="p" className="tch-verse">
            {d.verse}
            {d.verse_ref && <cite>— {d.verse_ref}</cite>}
          </Reveal>
        )}
        {d.hashtag && <p className="tch-hashtag">{d.hashtag}</p>}
      </section>

      <XDivider />

      <section className="tch-block">
        <div className="tch-eyebrow">Save the date</div>
        <h2 className="tch-h2">A morning of grace</h2>
        <Reveal as="p" className="tch-lead">Mark your calendar — the bells will ring for us.</Reveal>
        <div className="tch-glass">
          <div className="tch-glass-rose" aria-hidden="true">
            <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="#b99a5b" strokeWidth="2" />
              <circle cx="60" cy="60" r="18" fill="#e9edd9" /></svg>
          </div>
          <p className="tch-gd-day">{mainEvent?.title || 'Save the Date'}</p>
          <p className="tch-gd-date">{mainEvent?.time || 'Date to be announced'}</p>
          <p className="tch-gd-sub">with joy and thanksgiving</p>
        </div>
      </section>

      <XDivider />

      {cd && (
        <>
          <section className="tch-block">
            <div className="tch-eyebrow">Counting the days</div>
            <h2 className="tch-h2">Until we say "I do"</h2>
            {!cd.done ? (
              <div className="tch-countdown">
                <Reveal className="tch-cd-box"><b>{cd.days}</b><small>Days</small></Reveal>
                <Reveal className="tch-cd-box" delay="tch-d1"><b>{pad(cd.hours)}</b><small>Hours</small></Reveal>
                <Reveal className="tch-cd-box" delay="tch-d2"><b>{pad(cd.minutes)}</b><small>Mins</small></Reveal>
                <Reveal className="tch-cd-box" delay="tch-d3"><b>{pad(cd.seconds)}</b><small>Secs</small></Reveal>
              </div>
            ) : (
              <p className="tch-gd-date">Today we say "I do" ✦</p>
            )}
          </section>
          <XDivider />
        </>
      )}

      {d.when_where?.length > 0 && (
        <>
          <section className="tch-block">
            <div className="tch-eyebrow">Celebrations</div>
            <h2 className="tch-h2">When &amp; Where</h2>
            <div className="tch-events">
              {d.when_where.map((w, i) => (
                <Reveal as="div" className="tch-ev" delay={`tch-d${Math.min(i, 3)}`} key={i}>
                  <h3>{w.title}</h3>
                  <p>{w.message}</p>
                  <span className="tch-when">{w.time}</span>
                </Reveal>
              ))}
            </div>
            {d.map_url && <a className="tch-maplink" href={d.map_url} target="_blank" rel="noopener noreferrer">Open in Maps</a>}
          </section>
          <XDivider />
        </>
      )}

      {d.other_image?.length > 0 && (
        <section className="tch-block">
          <div className="tch-eyebrow">Our journey</div>
          <h2 className="tch-h2">Moments of grace</h2>
          <div className="tch-gallery">
            {d.other_image.map((img, i) => (
              <Reveal as="div" delay={`tch-d${Math.min(i % 4, 3)}`} key={i}>
                <SafeImg src={img.image_url} alt={img.image_title || 'Photo'} className="tch-gallery-img" fallbackClass="tch-gallery-fallback" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {d.blank_html && (
        <section className="tch-block">
          <CustomHtml html={d.blank_html} className="tch-custom" />
        </section>
      )}

      <footer className="tch-footer">
        <span className="tch-script-f">With love &amp; prayers</span>
        <span className="tch-names-f">{coupleNames}{mainEvent?.time ? ` · ${mainEvent.time}` : ''}</span>
      </footer>
    </div>
  )
}