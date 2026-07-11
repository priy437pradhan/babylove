// ============================================================
// Shared pieces used across templates: image with graceful
// fallback, a countdown hook, an ornament divider, and the
// custom-HTML block for `blank_html`.
// ============================================================
import { useEffect, useState, useRef } from 'react'
import { parseEventDate, findMainEvent } from '../../utils/date'

/** Image that falls back to an initial tile when the URL fails/is empty. */
export function SafeImg({ src, alt, className, fallbackClass = '' }) {
  const [failed, setFailed] = useState(!src)
  useEffect(() => { setFailed(!src) }, [src])

  if (failed) {
    return (
      <div className={`tpl-img-fallback ${fallbackClass}`} aria-label={alt}>
        {(alt || '?').trim().charAt(0).toUpperCase() || '?'}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

/** Countdown to the main ceremony. Returns null if the time string isn't parseable. */
export function useCountdown(whenWhere) {
  const main = findMainEvent(whenWhere)
  const target = parseEventDate(main?.time)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!target) return null
  const diff = target - now
  if (diff <= 0) return { done: true }
  return {
    done: false,
    days: Math.floor(diff / 864e5),
    hours: Math.floor((diff % 864e5) / 36e5),
    minutes: Math.floor((diff % 36e5) / 6e4),
    seconds: Math.floor((diff % 6e4) / 1e3),
  }
}

/** Small lotus/diamond divider used by the templates. */
export function Ornament({ color = '#C9A24B', className = '' }) {
  return (
    <svg className={`tpl-ornament ${className}`} viewBox="0 0 150 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 11 H58" stroke={color} strokeWidth="1" />
      <path d="M92 11 H148" stroke={color} strokeWidth="1" />
      <path d="M75 2 C80 7 84 9 89 11 C84 13 80 15 75 20 C70 15 66 13 61 11 C66 9 70 7 75 2 Z" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="75" cy="11" r="2" fill={color} />
      <circle cx="58" cy="11" r="1.5" fill={color} />
      <circle cx="92" cy="11" r="1.5" fill={color} />
    </svg>
  )
}

/**
 * Renders user-supplied blank_html with a light client-side scrub
 * (strips <script>, inline event handlers and javascript: URLs).
 * IMPORTANT: this is a convenience only — sanitize properly on the
 * backend with bleach before storing, since guests will load this.
 */
export function CustomHtml({ html, className = '' }) {
  if (!html) return null
  const scrubbed = String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
  return <div className={className} dangerouslySetInnerHTML={{ __html: scrubbed }} />
}

/** Convenience: participants by role, tolerant of missing roles. */
export function splitParticipants(participants = []) {
  const byRole = (r) => participants.find(p => (p.role || '').toLowerCase() === r)
  return {
    first: byRole('groom') || participants[0] || { name: '' },
    second: byRole('bride') || participants[1] || null,
    all: participants,
  }
}

/** Component that reveals its children when scrolled into view */
export function Reveal({ as: Tag = 'div', className = '', delay = '', children, ...rest }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setInView(true)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.18 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`tpl-reveal ${delay} ${inView ? 'in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

/** Hook to manage background audio music playback */
export function useMusicToggle(musicUrl) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!musicUrl) return

    audioRef.current = new Audio(musicUrl)
    audioRef.current.loop = true

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setPlaying(false)
    }
  }, [musicUrl])

  const play = () => {
    if (audioRef.current && !playing) {
      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(err => console.log("Audio play blocked/failed:", err))
    }
  }

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(err => console.log("Audio play blocked/failed:", err))
    }
  }

  return {
    hasMusic: !!musicUrl,
    playing,
    play,
    toggle,
  }
}

/** Audio play/pause button component */
export function MusicButton({ hasMusic, playing, onToggle, className = '' }) {
  if (!hasMusic) return null

  return (
    <button
      type="button"
      className={`${className} ${playing ? 'is-playing' : ''}`}
      onClick={onToggle}
      aria-label={playing ? "Mute music" : "Play music"}
    >
      {playing ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}>
          <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l6 6L21 20l-9-9L4.27 3zM14 7h4V3h-6v5.18l2 2V7z" />
        </svg>
      )}
    </button>
  )
}
