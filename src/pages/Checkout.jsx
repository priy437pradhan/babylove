import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { getTemplateMeta, getEventType } from '../config/eventTypes'

/**
 * Mock checkout. With the real backend + Razorpay:
 *   1. POST /api/events/:slug/payment/order  -> { order_id, amount, currency }
 *   2. Open Razorpay checkout:
 *        const rzp = new window.Razorpay({
 *          key: RAZORPAY_KEY_ID,
 *          order_id, amount, currency,
 *          name: 'Nimantran',
 *          handler: (resp) => api.verifyPayment(slug, resp).then(...)
 *        })
 *        rzp.open()
 *      (add <script src="https://checkout.razorpay.com/v1/checkout.js"> in index.html)
 *   3. Backend verifies the signature in /payment/verify and flips status
 *      to "published".
 */
export default function Checkout() {
  const { eventUrl } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [error, setError] = useState(null)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    api.getEventByUrl(eventUrl).then(setEvent).catch(e => setError(e.message))
  }, [eventUrl])

  const pay = async () => {
    setPaying(true)
    setError(null)
    try {
      const order = await api.createPaymentOrder(eventUrl)
      // Mock gateway: simulate a successful payment, then verify.
      await api.verifyPayment(eventUrl, { order_id: order.order_id })
      navigate(`/success/${eventUrl}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setPaying(false)
    }
  }

  if (error && !event) {
    return (
      <main className="page page-narrow invite-notfound">
        <h1 className="page-title">Couldn't load this draft</h1>
        <p className="page-lede" style={{ margin: '10px auto 26px' }}>{error}</p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </main>
    )
  }
  if (!event) {
    return <main className="page"><div className="loading-block"><span className="spinner spinner-dark" /> Loading…</div></main>
  }

  const meta = getTemplateMeta(event.event_type_key, event.template_type_key)
  const type = getEventType(event.event_type_key)

  return (
    <main className="page page-narrow">
      <p className="eyebrow-ui">Almost there</p>
      <h1 className="page-title">Review & pay</h1>
      <p className="page-lede">Your invitation goes live the moment payment completes.</p>

      <div className="pay-card">
        <div className="pay-row"><span>Event</span><b>{event.event_name}</b></div>
        <div className="pay-row"><span>Occasion</span><b>{type?.icon} {type?.name}</b></div>
        <div className="pay-row"><span>Template</span><b>{meta?.name}</b></div>
        <div className="pay-row"><span>Your link</span><b>/invite/{event.event_url}</b></div>
        <div className="pay-row"><span className="pay-total">Total</span><span className="pay-total">₹{meta?.price}</span></div>

        {error && <p className="error-note">{error}</p>}

        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <button className="btn btn-gold" onClick={pay} disabled={paying}>
            {paying && <span className="spinner" style={{ borderTopColor: '#3a2408' }} />}
            {paying ? 'Processing payment…' : `Pay ₹${meta?.price}`}
          </button>
          <Link className="btn btn-ghost" to={`/create/${event.event_type_key}/${event.template_type_key}`}>
            Edit details
          </Link>
        </div>
        <p className="pay-note">
          Demo mode: payment is simulated. Hook up Razorpay in <code>src/pages/Checkout.jsx</code> and
          <code> src/api/client.js</code> when your endpoints are ready.
        </p>
      </div>
    </main>
  )
}
