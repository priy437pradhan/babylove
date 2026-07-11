import { useEffect, useRef, useState } from 'react'
import { FiHelpCircle, FiX } from 'react-icons/fi'
 
/**
 * Little "?" badge that opens a step-by-step guide popover.
 * Usage: <HelpTip title="How to get a Google Maps link" steps={[...]} />
 */
export default function HelpTip({ title, steps = [], note }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
 
  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
 
  return (
    <span className="helptip" ref={ref}>
      <button
        type="button"
        className="helptip-btn"
        aria-label={`Help: ${title}`}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <FiHelpCircle />
      </button>
      {open && (
        <span className="helptip-pop" role="dialog" aria-label={title}>
          <span className="helptip-head">
            <b>{title}</b>
            <button type="button" className="helptip-close" onClick={() => setOpen(false)} aria-label="Close">
              <FiX />
            </button>
          </span>
          <ol>
            {steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          {note && <span className="helptip-note">{note}</span>}
        </span>
      )}
    </span>
  )
}
