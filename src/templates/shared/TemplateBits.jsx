// ============================================================
// Shared pieces used across templates: image with graceful
// fallback, a countdown hook, an ornament divider, and the
// custom-HTML block for `blank_html`.
// ============================================================
import { useEffect, useState } from 'react'
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
