import { useRef } from 'react'

/**
 * PreviewFrame — CSS-scaled live template preview
 * ─────────────────────────────────────────────────────────────
 * Renders live React children (invitation templates) in a scaled
 * viewport inside the hero phone shell and template card previews.
 *
 * Why CSS scale instead of <iframe>:
 *   • Templates are React components — they stay in the same React
 *     tree so props, context, and state flow through normally.
 *   • No stylesheet cloning or portal quirks — what you build is
 *     what you see.
 *   • Media queries respond to the window (not the scaled box), which
 *     is fine for showcase previews.
 *
 * The inner canvas is fixed at 390px wide (iPhone 14 viewport width)
 * and scrollable. CSS transform-scale shrinks it to fit the shell.
 * The shell (phone-shell) is not pointer-interactive — it's purely
 * decorative.
 *
 * Props
 *   children  – the template JSX to display
 *   className – forwarded to the outer wrapper
 *   title     – accessible label
 */
export default function PreviewFrame({ children, className = '', title = 'Live preview' }) {
  const wrapRef = useRef(null)

  return (
    <div
      ref={wrapRef}
      className={`pf-outer ${className}`.trim()}
      role="region"
      aria-label={title}
    >
      {/* ── inner canvas: fixed 390 px wide (iPhone 14), scaled to shell ── */}
      <div className="pf-canvas">
        <div className="pf-content">
          {children}
        </div>
      </div>

      {/* subtle "LIVE" badge — pulsing dot + text */}
      <span className="pf-live-badge" aria-hidden="true">
        <i className="pf-live-dot" />
        Live
      </span>
    </div>
  )
}
