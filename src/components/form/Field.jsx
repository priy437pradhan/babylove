/** Basic labelled input / textarea. `labelExtra` renders beside the label (e.g. a HelpTip). */
export function Field({ label, labelExtra, error, hint, textarea, ...props }) {
  return (
    <div className="field">
      {label && (
        <div className="field-label-row">
          <label htmlFor={props.id}>{label}</label>
          {labelExtra}
        </div>
      )}
      {textarea ? <textarea {...props} /> : <input {...props} />}
      {hint && !error && <p className="hint">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
