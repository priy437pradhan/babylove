// ============================================================
// API CLIENT
// Flip USE_MOCK to false and set BASE_URL when the backend
// endpoints are ready. Every page imports `api` from here and
// nothing else changes.
//
// Expected endpoints (adjust paths to match your Django routes):
//   GET  /api/event-types                              -> EVENT_TYPES shape
//   GET  /api/event-types/:event_type_key/templates    -> TEMPLATES[key] shape
//   GET  /api/events/check-slug?slug=...               -> { available: bool }
//   POST /api/events                                   -> body: full event JSON, returns { event_url, status }
//   PUT  /api/events/:event_url                        -> body: full event JSON, edits an existing event
//                                                         !! must be protected: only the owner may edit
//                                                         (auth session or an edit-token emailed/whatsapped
//                                                         to the creator). The frontend is ready either way.
//   GET  /api/events/:event_url                        -> full event JSON + status
//   POST /api/events/:event_url/payment/order          -> { order_id, amount, currency }
//   POST /api/events/:event_url/payment/verify         -> body: gateway response, returns { status }
//   POST /api/uploads (multipart)                      -> { url }  — for photo uploads; then store that
//                                                         URL in image_url instead of the data: URL
// ============================================================
import { mockApi } from './mock'

const USE_MOCK = true
const BASE_URL = 'http://localhost:5001' // your Django server

async function http(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(body.detail || body.message || `Request failed (${res.status})`)
    err.code = body.code
    err.status = res.status
    throw err
  }
  return body
}

const realApi = {
  getEventTypes: () => http('/api/event-types'),
  getTemplates: (eventTypeKey) => http(`/api/event-types/${eventTypeKey}/templates`),
  checkSlug: (slug) => http(`/api/events/check-slug?slug=${encodeURIComponent(slug)}`),
  createEvent: (payload) => http('/api/events', { method: 'POST', body: JSON.stringify(payload) }),
  updateEvent: (slug, payload) => http(`/api/events/${slug}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getEventByUrl: (slug) => http(`/api/events/${slug}`),
  createPaymentOrder: (slug) => http(`/api/events/${slug}/payment/order`, { method: 'POST' }),
  verifyPayment: (slug, data) => http(`/api/events/${slug}/payment/verify`, { method: 'POST', body: JSON.stringify(data) }),
}

export const api = USE_MOCK ? mockApi : realApi
