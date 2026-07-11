import { useState } from 'react'
import { SafeImg, CustomHtml, Reveal, useCountdown, useMusicToggle, MusicButton, splitParticipants } from '../shared/TemplateBits'
import { findMainEvent } from '../../utils/date'
import './envelope.css'

const pad = (n) => (n < 10 ? `0${n}` : `${n}`)

function EnvelopeOpener({ open, onOpen, coupleNames }) {
  return (
    <div className={`ten-gift ${open ? 'is-gone' : ''}`} role="button" aria-label="Tap the envelope to open" onClick={onOpen}>
      <div className="ten-who-wrap">
        <div className="ten-who">{coupleNames || 'The Couple'}</div>
        <div className="ten-what">a sealed invitation, just for you</div>
      </div>
      <div className={`ten-env ${open ? 'is-open' : ''}`} aria-hidden="true">
        <div className="ten-back" />
        <div className="ten-card">
          <span className="ten-c-eyebrow">You are invited</span>
          <span className="ten-c-names">{coupleNames || 'The Couple'}</span>
          <span className="ten-c-sub">save our date</span>
        </div>
        <div className="ten-pocket" />
        <div className="ten-flap" />
        <div className="ten-seal">{coupleNames ? coupleNames.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '♥'}</div>
      </div>
      <div className="ten-hint">Tap the envelope to open ✦</div>
    </div>
  )
}

export default function Envelope({ data }) {
  const d = data || {}
  const { first, second } = splitParticipants(d.participants)
  const mainEvent = findMainEvent(d.when_where)
  const cd = useCountdown(d.when_where)
  const music = useMusicToggle(d.music_url)
  const [open, setOpen] = useState(false)
  const coupleNames = [first?.name, second?.name].filter(Boolean).join(' & ')
  const heroImg = d.primary_image?.[0]

  const handleOpen = () => { if (open) return; setOpen(true); music.play() }

  return (
    <div className="t-env">
      <EnvelopeOpener open={open} onOpen={handleOpen} coupleNames={coupleNames} />
      <MusicButton hasMusic={music.hasMusic} playing={music.playing} onToggle={music.toggle} className="ten-music-btn" />

      <section className="ten-snap ten-hero">
        <div className="ten-wrap">
          {d.invocation && <p className="ten-greet">{d.invocation}</p>}
          <p className="ten-families">Together with our beloved families</p>
          <div className="ten-frame">
            <SafeImg src={heroImg?.image_url} alt={heroImg?.image_title || coupleNames} className="ten-frame-img" fallbackClass="ten-frame-fallback" />
          </div>
          <h1 className="ten-names">
            <span>{first?.name || 'Groom'}</span>
            <span className="ten-amp">and</span>
            <span>{second?.name || 'Bride'}</span>
          </h1>
          {mainEvent?.time && <p className="ten-date-line">{mainEvent.time}</p>}
          {mainEvent?.message && <p className="ten-venue-line">{mainEvent.message}</p>}
        </div>
      </section>

      <section className="ten-snap">
        <div className="ten-wrap">
          <div className="ten-eyebrow">You are warmly invited</div>
          <h2 className="ten-h2"><span className="ten-script">Together,</span>always</h2>
          {d.verse && <Reveal as="p" className="ten-verse">{d.verse}</Reveal>}
          {d.hashtag && <p className="ten-hashtag">{d.hashtag}</p>}
        </div>
      </section>

      {cd && (
        <section className="ten-snap">
          <div className="ten-wrap">
            <div className="ten-eyebrow">Counting the days</div>
            <h2 className="ten-h2">Until we say "I do"</h2>
            {!cd.done ? (
              <div className="ten-countdown">
                <Reveal className="ten-cd-box"><b>{cd.days}</b><small>Days</small></Reveal>
                <Reveal className="ten-cd-box"><b>{pad(cd.hours)}</b><small>Hours</small></Reveal>
                <Reveal className="ten-cd-box"><b>{pad(cd.minutes)}</b><small>Mins</small></Reveal>
                <Reveal className="ten-cd-box"><b>{pad(cd.seconds)}</b><small>Secs</small></Reveal>
              </div>
            ) : <p className="ten-dc-sub">Today is the day ✦</p>}
          </div>
        </section>
      )}

      {d.when_where?.length > 0 && (
        <section className="ten-snap">
          <div className="ten-wrap">
            <div className="ten-eyebrow">Celebrations</div>
            <h2 className="ten-h2">When &amp; Where</h2>
            <div className="ten-events">
              {d.when_where.map((w, i) => (
                <Reveal as="div" className="ten-ev" key={i}>
                  <h3>{w.title}</h3>
                  <p>{w.message}</p>
                  <span className="ten-when">{w.time}</span>
                </Reveal>
              ))}
            </div>
            {d.map_url && <a className="ten-maplink" href={d.map_url} target="_blank" rel="noopener noreferrer">Open in Maps</a>}
          </div>
        </section>
      )}

      {d.other_image?.length > 0 && (
        <section className="ten-snap">
          <div className="ten-wrap">
            <div className="ten-eyebrow">Our journey</div>
            <h2 className="ten-h2">Moments together</h2>
            <div className="ten-gallery">
              {d.other_image.map((img, i) => (
                <Reveal key={i}>
                  <SafeImg src={img.image_url} alt={img.image_title || 'Photo'} className="ten-gallery-img" fallbackClass="ten-gallery-fallback" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {d.blank_html && (
        <section className="ten-snap">
          <div className="ten-wrap">
            <CustomHtml html={d.blank_html} className="ten-custom" />
          </div>
        </section>
      )}

      <section className="ten-snap ten-foot">
        <div className="ten-wrap">
          <span className="ten-script-f">With all our love</span>
          <span className="ten-names-f">{coupleNames}{mainEvent?.time ? ` · ${mainEvent.time}` : ''}</span>
        </div>
      </section>
    </div>
  )
}