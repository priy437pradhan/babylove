// Helpers for "sample data everywhere": the live preview starts filled
// with the event type's sample payload, and each field flips to the
// user's own value the moment they type it.
 
const hasText = (v) => String(v ?? '').trim().length > 0
 
export function filledOnly(list) {
  return (list || []).filter(item => Object.values(item || {}).some(hasText))
}
 
export function listHasContent(list) {
  return filledOnly(list).length > 0
}
 
/** Preview payload: user's data wherever present, sample data everywhere else. */
export function mergeForPreview(data, sample) {
  if (!sample) return data
  const pickList = (key) => (listHasContent(data[key]) ? filledOnly(data[key]) : sample[key])
  return {
    ...sample,
    ...data,
    event_name: hasText(data.event_name) ? data.event_name : sample.event_name,
    event_url: hasText(data.event_url) ? data.event_url : sample.event_url,
    participants: pickList('participants'),
    family_members: pickList('family_members'),
    primary_image: pickList('primary_image'),
    other_image: pickList('other_image'),
    when_where: pickList('when_where'),
    messages: pickList('messages'),
    map_url: hasText(data.map_url) ? data.map_url : sample.map_url,
    blank_html: hasText(data.blank_html) ? data.blank_html : sample.blank_html,
  }
}
 
/** For edit mode: make sure every list has at least one row so the form renders. */
export function normalizePayload(event, empty) {
  const withRows = (list, fallback) => (list && list.length ? list : fallback)
  return {
    ...empty,
    ...event,
    participants: withRows(event.participants, empty.participants),
    family_members: withRows(event.family_members, empty.family_members),
    primary_image: withRows(event.primary_image, empty.primary_image),
    other_image: withRows(event.other_image, empty.other_image),
    when_where: withRows(event.when_where, empty.when_where),
    messages: withRows(event.messages, empty.messages),
  }
}
