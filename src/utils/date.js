// when_where[].time is a free display string like "19 Feb 2027 · 6:30 PM".
// Try to parse it so templates can show countdowns; return null if not parseable.
export function parseEventDate(str) {
  if (!str) return null
  const cleaned = String(str).replace(/[·|,]/g, ' ').replace(/\s+/g, ' ').trim()
  const t = Date.parse(cleaned)
  return Number.isNaN(t) ? null : t
}

// Pick the "main" ceremony for countdowns: prefers titles containing key words,
// falls back to the first entry.
export function findMainEvent(whenWhere = []) {
  const priority = /wedding|marriage|ceremony|party|celebration|reception/i
  return whenWhere.find(w => priority.test(w.title || '')) || whenWhere[0] || null
}
