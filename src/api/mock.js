// ============================================================
// MOCK API — localStorage-backed so the whole flow works with
// no backend. Same function signatures as the real client, so
// flipping USE_MOCK in client.js is the only change needed.
// ============================================================
import { EVENT_TYPES, TEMPLATES, getTemplateMeta } from '../config/eventTypes'

const STORE_KEY = 'nimantran_events'

const read = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') } catch { return {} }
}
const write = (db) => localStorage.setItem(STORE_KEY, JSON.stringify(db))
const delay = (ms = 350) => new Promise(r => setTimeout(r, ms))

export const mockApi = {
  async getEventTypes() {
    await delay()
    return EVENT_TYPES
  },

  async getTemplates(eventTypeKey) {
    await delay()
    return TEMPLATES[eventTypeKey] || []
  },

  async checkSlug(slug) {
    await delay(200)
    const db = read()
    return { available: !db[slug] || db[slug].status !== 'published' }
  },

  // payload = the full event JSON (event_type_key, template_type_key, event_url, ...)
  async createEvent(payload) {
    await delay()
    const db = read()
    const existing = db[payload.event_url]
    if (existing && existing.status === 'published') {
      const err = new Error('This link is already taken. Try another one.')
      err.code = 'SLUG_TAKEN'
      throw err
    }
    db[payload.event_url] = {
      ...payload,
      status: 'draft',
      created_at: existing?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    write(db)
    return { event_url: payload.event_url, status: 'draft' }
  },

  async getEventByUrl(slug) {
    await delay()
    const db = read()
    if (!db[slug]) {
      const err = new Error('Invitation not found')
      err.code = 'NOT_FOUND'
      throw err
    }
    return db[slug]
  },

  async createPaymentOrder(slug) {
    await delay(500)
    const db = read()
    const event = db[slug]
    if (!event) throw new Error('Invitation not found')
    const meta = getTemplateMeta(event.event_type_key, event.template_type_key)
    return {
      order_id: 'order_' + Math.random().toString(36).slice(2, 12),
      amount: (meta?.price || 0) * 100, // paise, Razorpay-style
      currency: 'INR',
    }
  },

  async verifyPayment(slug, { order_id }) {
    await delay(800)
    const db = read()
    if (!db[slug]) throw new Error('Invitation not found')
    db[slug].status = 'published'
    db[slug].payment = { order_id, paid_at: new Date().toISOString() }
    write(db)
    return { status: 'published', event_url: slug }
  },
}
