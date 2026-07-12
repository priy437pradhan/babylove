import { useRef } from 'react'

/**
 * PreviewFrame
 * ─────────────────────────────────────────────────────────────
 * Renders live React children (real invitation templates) inside
 * an isolated, scrollable viewport that fits the hero phone shell.
 *
 * Why CSS-scale instead of <iframe>:
 *   • Templates are React components — they can't be portal'd into a
 *     cross-origin frame without a full re-render pipeline.
 *   • CSS transform-scale keeps them in the same React tree so
 *     props, context and state all flow through normally.
 *   • Same approach used by .mini-preview-scale on the template cards.
 *
 * The component sets a fixed 390 px wide inner canvas (≈ iPhone 14
 * viewport width) and scales it down to fill the phone shell width.
 * Users can swipe/scroll in the hero — but pointer-events on the
 * outer shell are disabled, so the phone stays purely decorative.
 *
 * Props
 *   children  – the template JSX to display
 *   className – forwarded to the outer wrapper ("phone-screen")
 *   title     – accessible label for the region
 */
export default function PreviewFrame({ children, className = '', title }) {
  const wrapRef = useRef(null)

  return (
    <div
      ref={wrapRef}
      className={`pf-outer ${className}`.trim()}
      role="region"
      aria-label={title || 'Live preview'}
    >
      {/* ── inner canvas: always 390 px wide, scaled to fit shell ── */}
      <div className="pf-canvas">
        <div className="pf-content">
          {children}
        </div>
      </div>

      {/* subtle "LIVE" badge — mirrors mini-preview card style */}
      <span className="pf-live-badge" aria-hidden="true">
        <i className="pf-live-dot" />
        Live
      </span>
    </div>
  )
}
