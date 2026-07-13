import ImageInput from './ImageInput'

/**
 * Repeatable group of fields — drives participants, family_members,
 * primary_image, other_image, when_where and messages. Fully generic:
 * pass `fields` config and it renders/updates the array in the payload.
 * Field types: text (default), textarea, image (URL + device upload).
 */
export default function ListField({
  title,
  subtitle,
  labelExtra,
  items = [],
  fields,            // [{ name, label, placeholder, suggestions?, textarea?, type? }]
  emptyItem,         // object used when adding a new row
  addLabel = 'Add another',
  minItems = 0,
  onChange,          // (nextItems) => void
  listId,
}) {
  const update = (idx, name, value) => {
    const next = items.map((it, i) => (i === idx ? { ...it, [name]: value } : it))
    onChange(next)
  }
  const add = () => onChange([...items, { ...emptyItem }])
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx))

  const hasImage = fields.some(f => f.type === 'image')
  const cols = hasImage ? '' : fields.length === 2 ? 'cols-2' : fields.length >= 3 ? 'cols-3' : ''

  return (
    <div className="form-section">
      <div className="form-section-head">
        <h2 className="form-section-title">{title}{labelExtra}</h2>
        {subtitle && <span className="form-section-sub">{subtitle}</span>}
      </div>

      {items.map((item, idx) => (
        <div className="list-item" key={idx}>
          {items.length > minItems && (
            <button
              type="button"
              className="remove-item"
              onClick={() => remove(idx)}
              aria-label={`Remove item ${idx + 1}`}
            >×</button>
          )}
          <div className={`list-item-grid ${cols}`}>
            {fields.map(f => {
              const inputId = `${listId}-${idx}-${f.name}`
              const dlId = f.suggestions ? `${inputId}-dl` : undefined
              return (
                <div className="field" key={f.name}>
                  <label htmlFor={inputId}>{f.label}</label>
                  {f.type === 'image' ? (
                    <ImageInput
                      id={inputId}
                      value={item[f.name] || ''}
                      onChange={v => update(idx, f.name, v)}
                    />
                  ) : f.textarea ? (
                    <textarea
                      id={inputId}
                      value={item[f.name] || ''}
                      placeholder={f.placeholder}
                      onChange={e => update(idx, f.name, e.target.value)}
                    />
                  ) : (
                    <input
                      id={inputId}
                      value={item[f.name] || ''}
                      placeholder={f.placeholder}
                      list={dlId}
                      onChange={e => update(idx, f.name, e.target.value)}
                    />
                  )}
                  {f.suggestions && (
                    <datalist id={dlId}>
                      {f.suggestions.map(s => <option key={s} value={s} />)}
                    </datalist>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <button type="button" className="add-item" onClick={add}>+ {addLabel}</button>
    </div>
  )
}
