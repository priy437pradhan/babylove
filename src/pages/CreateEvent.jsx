import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiEye, FiMapPin, FiArrowLeft, FiSave } from 'react-icons/fi'
import { api } from '../api/client'
import { getEventType, getTemplateMeta } from '../config/eventTypes'
import { getSchema, getSample, emptyPayload } from '../config/formSchemas'
import { resolveTemplate } from '../templates/registry'
import { slugify, validateSlug } from '../utils/slug'
import { mergeForPreview, normalizePayload } from '../utils/merge'
import { Field } from '../components/form/Field'
import ListField from '../components/form/ListField'
import HelpTip from '../components/HelpTip'
 
const MAP_STEPS = [
  'Open Google Maps and search your venue (e.g. "Shree Palace Bhubaneswar").',
  'Tap the venue name, then tap the Share button.',
  'Choose "Copy link".',
  'Come back here and paste it in this box.',
]
 
/**
 * One page, two modes:
 *  - create:  /create/:eventTypeKey/:templateTypeKey  (blank form → checkout)
 *  - edit:    /edit/:eventUrl                          (prefilled → save, even after the link is live)
 */
export default function CreateEvent({ editMode = false }) {
  const params = useParams()
  const navigate = useNavigate()
 
  const [existing, setExisting] = useState(null)   // loaded event in edit mode
  const [loadError, setLoadError] = useState(null)
  const [data, setData] = useState(() =>
    editMode ? null : emptyPayload(params.eventTypeKey, params.templateTypeKey)
  )
  const [slugTouched, setSlugTouched] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [showMobilePreview, setShowMobilePreview] = useState(false)
  const [showSample, setShowSample] = useState(!editMode) // sample fill-ins on for new events
 
  // load the event when editing
  useEffect(() => {
    if (!editMode) return
    api.getEventByUrl(params.eventUrl)
      .then(ev => {
        setExisting(ev)
        setData(normalizePayload(ev, emptyPayload(ev.event_type_key, ev.template_type_key)))
      })
      .catch(e => setLoadError(e.message))
  }, [editMode, params.eventUrl])
 
  const eventTypeKey = editMode ? existing?.event_type_key : params.eventTypeKey
  const templateTypeKey = editMode ? existing?.template_type_key : params.templateTypeKey
 
  const eventType = getEventType(eventTypeKey)
  const templateMeta = getTemplateMeta(eventTypeKey, templateTypeKey)
  const Template = resolveTemplate(eventTypeKey, templateTypeKey)
  const schema = useMemo(() => getSchema(eventTypeKey), [eventTypeKey])
  const sample = useMemo(
    () => (eventTypeKey ? getSample(eventTypeKey, templateTypeKey) : null),
    [eventTypeKey, templateTypeKey]
  )
 
  if (editMode && loadError) {
    return (
      <main className="page invite-notfound">
        <h1 className="page-title">Couldn't load this invitation</h1>
        <p className="page-lede" style={{ margin: '10px auto 26px' }}>{loadError}</p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </main>
    )
  }
  if (editMode && (!existing || !data)) {
    return <main className="page"><div className="loading-block"><span className="spinner spinner-dark" /> Loading your invitation…</div></main>
  }
  if (!eventType || !templateMeta || !Template) {
    return (
      <main className="page invite-notfound">
        <h1 className="page-title">Template not found</h1>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>Back to home</Link>
      </main>
    )
  }
 
  const setField = (name, value) => setData(d => ({ ...d, [name]: value }))
  const setList = (name) => (items) => setData(d => ({ ...d, [name]: items }))
 
  const onNameChange = (value) => {
    setData(d => ({
      ...d,
      event_name: value,
      event_url: editMode || slugTouched ? d.event_url : slugify(value),
    }))
  }
 
  const validate = () => {
    const e = {}
    if (!data.event_name.trim()) e.event_name = 'Give your event a name'
    if (!editMode) {
      const slugErr = validateSlug(data.event_url)
      if (slugErr) e.event_url = slugErr
    }
    if (!data.participants.some(p => p.name.trim())) e.participants = 'Add at least one name'
    setErrors(e)
    return Object.keys(e).length === 0
  }
 
  const cleanPayload = () => ({
    ...data,
    participants: data.participants.filter(p => p.name.trim()),
    family_members: data.family_members.filter(f => f.name.trim()),
    primary_image: data.primary_image.filter(i => i.image_url.trim()),
    other_image: data.other_image.filter(i => i.image_url.trim()),
    when_where: data.when_where.filter(w => w.title.trim()),
    messages: data.messages.filter(m => m.what.trim()),
  })
 
  const onSubmit = async () => {
    setSubmitError(null)
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setSubmitting(true)
    try {
      if (editMode) {
        await api.updateEvent(params.eventUrl, cleanPayload())
        navigate(`/invite/${params.eventUrl}`)
      } else {
        const res = await api.createEvent(cleanPayload())
        navigate(`/checkout/${res.event_url}`)
      }
    } catch (err) {
      setSubmitError(err.message)
      if (err.code === 'SLUG_TAKEN') setErrors(e => ({ ...e, event_url: err.message }))
    } finally {
      setSubmitting(false)
    }
  }
 
  // preview: user's data wherever typed, sample data everywhere else (toggleable)
  const previewData = showSample && sample ? mergeForPreview(data, sample) : data
 
  const SampleToggle = (
    <label className="preview-toggle">
      <input type="checkbox" checked={showSample} onChange={e => setShowSample(e.target.checked)} />
      Fill gaps with sample data
    </label>
  )
 
  return (
    <main className="page">
      <p className="eyebrow-ui">{eventType.icon} {eventType.name} · {templateMeta.name} template</p>
      <h1 className="page-title">{editMode ? 'Edit your invitation' : 'Fill in your details'}</h1>
      <p className="page-lede">
        {editMode
          ? 'Change anything — your link stays the same and updates instantly for guests.'
          : 'Everything updates live in the preview — nothing is published until you pay.'}
      </p>
 
      {submitError && <p className="error-note">{submitError}</p>}
 
      <div className="create-layout">
        {/* ---------------- form column ---------------- */}
        <div>
          <div className="form-section">
            <div className="form-section-head">
              <h2 className="form-section-title">Event details</h2>
            </div>
            <Field
              id="event_name"
              label="Event name"
              placeholder={schema.placeholders.event_name}
              value={data.event_name}
              onChange={e => onNameChange(e.target.value)}
              error={errors.event_name}
            />
            <div className="field">
              <label htmlFor="event_url">Your invitation link</label>
              <div className="slug-row">
                <span className="slug-prefix">{window.location.host}/invite/</span>
                <input
                  id="event_url"
                  value={data.event_url}
                  placeholder="rahul-priya-wedding"
                  disabled={editMode}
                  onChange={e => { setSlugTouched(true); setField('event_url', slugify(e.target.value) || e.target.value.toLowerCase()) }}
                />
              </div>
              {errors.event_url
                ? <p className="field-error">{errors.event_url}</p>
                : <p className="hint">{editMode
                    ? "The link can't change after creation — everyone you shared it with keeps working."
                    : 'Auto-filled from the event name — edit it if you like.'}</p>}
            </div>
          </div>
 
          <ListField
            listId="participants"
            title={schema.labels.participants}
            subtitle={errors.participants}
            items={data.participants}
            onChange={setList('participants')}
            minItems={1}
            emptyItem={{ role: '', name: '' }}
            addLabel="Add participant"
            fields={[
              { name: 'role', label: 'Role', placeholder: schema.participantRoles[0], suggestions: schema.participantRoles },
              { name: 'name', label: 'Name', placeholder: 'Full name' },
            ]}
          />
 
          <ListField
            listId="family"
            title={schema.labels.family}
            items={data.family_members}
            onChange={setList('family_members')}
            emptyItem={{ role: '', name: '' }}
            addLabel="Add family member"
            fields={[
              { name: 'role', label: 'Relation', placeholder: 'father', suggestions: schema.familyRoles },
              { name: 'name', label: 'Name', placeholder: 'Full name' },
            ]}
          />
 
          <ListField
            listId="primary"
            title={schema.labels.primaryImages}
            subtitle="Shown large at the top — paste a link or upload"
            items={data.primary_image}
            onChange={setList('primary_image')}
            emptyItem={{ image_title: '', image_url: '' }}
            addLabel="Add photo"
            fields={[
              { name: 'image_title', label: 'Caption', placeholder: 'Bride' },
              { name: 'image_url', label: 'Photo', type: 'image' },
            ]}
          />
 
          <ListField
            listId="other"
            title={schema.labels.otherImages}
            subtitle="Gallery section"
            items={data.other_image}
            onChange={setList('other_image')}
            emptyItem={{ image_title: '', image_url: '' }}
            addLabel="Add photo"
            fields={[
              { name: 'image_title', label: 'Caption', placeholder: 'Pre Wedding' },
              { name: 'image_url', label: 'Photo', type: 'image' },
            ]}
          />
 
          <ListField
            listId="when"
            title={schema.labels.whenWhere}
            items={data.when_where}
            onChange={setList('when_where')}
            emptyItem={{ title: '', message: '', time: '' }}
            addLabel="Add ceremony"
            fields={[
              { name: 'title', label: 'Ceremony', placeholder: schema.placeholders.when_title },
              { name: 'message', label: 'Venue', placeholder: schema.placeholders.when_message },
              { name: 'time', label: 'Date & time', placeholder: schema.placeholders.when_time },
            ]}
          />
 
          <div className="form-section">
            <div className="form-section-head">
              <h2 className="form-section-title"><FiMapPin style={{ verticalAlign: '-2px' }} /> Map & extras</h2>
            </div>
            <Field
              id="map_url"
              label="Google Maps link"
              labelExtra={
                <HelpTip
                  title="How to get a Google Maps link"
                  steps={MAP_STEPS}
                  note="Guests tap one button and navigation opens straight to your venue."
                />
              }
              placeholder="https://maps.google.com/?q=…"
              value={data.map_url}
              onChange={e => setField('map_url', e.target.value)}
            />
            <Field
              id="blank_html"
              label="Custom block (optional HTML)"
              textarea
              placeholder="<h2>Wedding Invitation</h2><p>Welcome…</p>"
              hint="Shown as its own section. Basic HTML only."
              value={data.blank_html}
              onChange={e => setField('blank_html', e.target.value)}
            />
          </div>
 
          <ListField
            listId="messages"
            title={schema.labels.messages}
            items={data.messages}
            onChange={setList('messages')}
            emptyItem={{ whom: '', what: '' }}
            addLabel="Add message"
            fields={[
              { name: 'whom', label: 'For whom', placeholder: 'guest', suggestions: ['guest', 'friends', 'family', 'colleagues'] },
              { name: 'what', label: 'Message', placeholder: 'Your presence is the greatest gift to us.', textarea: true },
            ]}
          />
 
          <div className="form-footer">
            {editMode ? (
              <Link to={`/invite/${params.eventUrl}`} className="btn btn-ghost"><FiArrowLeft /> Back to invitation</Link>
            ) : (
              <Link to={`/events/${eventTypeKey}`} className="btn btn-ghost"><FiArrowLeft /> Change template</Link>
            )}
            <button className="btn btn-primary" onClick={onSubmit} disabled={submitting}>
              {submitting && <span className="spinner" />}
              {editMode ? <>Save changes <FiSave /></> : `Continue to payment · ₹${templateMeta.price}`}
            </button>
          </div>
        </div>
 
        {/* ---------------- desktop live preview ---------------- */}
        <aside className="preview-pane" aria-label="Live preview">
          <p className="preview-label">Live preview</p>
          {SampleToggle}
          <div className="preview-frame">
            <Template data={previewData} />
          </div>
        </aside>
      </div>
 
      {/* ---------------- mobile preview ---------------- */}
      <div className="mobile-preview-bar">
        <button className="btn btn-ghost btn-sm" onClick={() => setShowMobilePreview(true)}>
          <FiEye /> Preview
        </button>
        <button className="btn btn-primary btn-sm" onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Saving…' : editMode ? 'Save changes' : `Pay ₹${templateMeta.price}`}
        </button>
      </div>
 
      {showMobilePreview && (
        <div className="mobile-preview-overlay">
          <div className="mobile-preview-close">
            <span className="mobile-preview-toggle">{SampleToggle}</span>
            <button className="btn btn-gold btn-sm" onClick={() => setShowMobilePreview(false)}>
              ✕ Back to form
            </button>
          </div>
          <Template data={previewData} />
        </div>
      )}
    </main>
  )
}
