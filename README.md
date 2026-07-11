# Nimantran — dynamic invitation platform (React + Vite)

Anyone can pick an occasion → pick a template → fill a form → pay → get a
shareable invitation link like `/invite/rahul-priya-wedding`.

Everything is driven by one JSON payload per event (the exact structure you
defined: `event_type_key`, `template_type_key`, `event_url`, `participants`,
`family_members`, `primary_image`, `other_image`, `when_where`, `map_url`,
`blank_html`, `messages`).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build in dist/
```

Works fully offline right now — the API layer is mocked with localStorage, so
the entire flow (create → pay → shareable link) works with no backend.

## Project map

```
src/
├── api/
│   ├── client.js        # flip USE_MOCK=false + BASE_URL when backend is ready
│   └── mock.js          # localStorage-backed mock, same function signatures
├── config/
│   ├── eventTypes.js    # event type + template catalog (name, price, palette)
│   └── formSchemas.js   # per-event-type form config, samples, empty payload
├── templates/
│   ├── registry.js      # registry[event_type_key][template_type_key] -> component
│   ├── shared/TemplateBits.jsx  # SafeImg, countdown hook, ornament, CustomHtml
│   ├── marriage/        # Traditional.jsx, Floral.jsx (+ scoped css)
│   └── birthday/        # Vibrant.jsx
├── pages/
│   ├── Home.jsx             # choose event type
│   ├── ChooseTemplate.jsx   # template cards + full live preview modal
│   ├── CreateEvent.jsx      # dynamic form + live preview
│   ├── Checkout.jsx         # payment (mock; Razorpay notes inside)
│   ├── Success.jsx          # copy link / WhatsApp share
│   └── Invitation.jsx       # public /invite/:eventUrl renderer
└── components/form/         # Field, ListField (generic repeatable rows)
```

## Add a new template (e.g. marriage → "royal")

1. Create `src/templates/marriage/Royal.jsx` + `royal.css` — component takes
   the full payload as `data`.
2. Register it in `src/templates/registry.js`.
3. Add its meta (name, description, price, palette) in
   `src/config/eventTypes.js` under `TEMPLATES.marriage`.

Done — it appears on the template chooser with live preview automatically.

## Add a new event type (e.g. "engagement")

1. Add it to `EVENT_TYPES` in `src/config/eventTypes.js` (remove `comingSoon`).
2. Add at least one template under `TEMPLATES.engagement` + registry entry.
3. Add a schema in `src/config/formSchemas.js` (roles, labels, sample payload).

## Wiring the real backend

Open `src/api/client.js`, set `USE_MOCK = false` and `BASE_URL`. Expected
endpoints (rename paths to match your Django URLs — only this file changes):

| Method | Path                                          | Purpose                                   |
| ------ | --------------------------------------------- | ----------------------------------------- |
| GET    | /api/event-types                               | list of event types                       |
| GET    | /api/event-types/:event_type_key/templates     | templates for a type                      |
| GET    | /api/events/check-slug?slug=…                  | `{ available: bool }`                     |
| POST   | /api/events                                    | body = full event JSON → creates draft    |
| GET    | /api/events/:event_url                         | full event JSON + `status`                |
| POST   | /api/events/:event_url/payment/order           | `{ order_id, amount, currency }`          |
| POST   | /api/events/:event_url/payment/verify          | verify gateway signature → `published`    |

Razorpay: real integration steps are commented at the top of
`src/pages/Checkout.jsx` (add checkout.js script, open with `order_id`,
verify signature server-side).

## Backend must-dos

- **Sanitize `blank_html` with `bleach` before storing** — it's user-submitted
  HTML rendered to guests. The frontend only does a light scrub.
- Enforce `event_url` uniqueness + reserved words (`invite`, `api`, `admin`…).
- Status flow: `draft` → (payment verified) → `published`; the public endpoint
  should only serve `published` events (mock serves drafts with a banner for
  easy testing).
- For WhatsApp link previews, serve `/invite/:slug` with server-side OG meta
  tags (og:title = event name, og:image = first primary image) — an SPA alone
  can't do this; add a tiny server-rendered shell or pre-render on the Django
  side.
