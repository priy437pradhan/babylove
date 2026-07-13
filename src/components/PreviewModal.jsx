import { useEffect } from 'react'
import { resolveTemplate } from '../templates/registry'
import PreviewFrame from './PreviewFrame'

/**
 * Full-screen live preview at guest phone width (390px canvas) —
 * what the invitation looks like when the link opens on a phone.
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
          <span className="modal-bar-title">{title} — guest view</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {onUse && <button className="btn btn-gold btn-sm" onClick={onUse}>Use this template</button>}
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
          </div>
        </div>
        <div className="modal-scroll-center">
          {Template ? (
            <PreviewFrame className="modal-pf" title={`${title} preview`}>
              <Template data={data} />
            </PreviewFrame>
          ) : (
            <p style={{ padding: 40, textAlign: 'center' }}>Template not found in registry.</p>
          )}
        </div>
      </div>
    </div>
  )
}
