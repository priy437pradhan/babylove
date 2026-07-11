/** Basic labelled input / textarea. */
export function Field({ label, error, hint, textarea, ...props }) {
  return (
    <div className="field">
      {label && <label htmlFor={props.id}>{label}</label>}
      {textarea ? <textarea {...props} /> : <input {...props} />}
      {hint && !error && <p className="hint">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
