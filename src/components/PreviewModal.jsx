import { useEffect } from 'react'
import { resolveTemplate } from '../templates/registry'

/**
 * Full-screen live preview of a template rendered with real payload data.
 * Used from ChooseTemplate (sample data) — the same component pattern the
 * public /invite page uses, so what you preview is what guests get.
 */
export default function PreviewModal({ eventTypeKey, templateTypeKey, data, title, onClose, onUse }) {
  const Template = resolveTemplate(eventTypeKey, templateTypeKey)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${title} preview`}>
      <div className="modal-shell" onClick={e => e.stopPropagation()}>
        <div className="modal-bar">
          <span className="modal-bar-title">{title} — preview</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {onUse && <button className="btn btn-gold btn-sm" onClick={onUse}>Use this template</button>}
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
          </div>
        </div>
        <div className="modal-scroll">
          {Template
            ? <Template data={data} />
            : <p style={{ padding: 40, textAlign: 'center' }}>Template not found in registry.</p>}
        </div>
      </div>
    </div>
  )
}
