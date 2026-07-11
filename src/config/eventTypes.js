// ============================================================
// EVENT TYPE + TEMPLATE CATALOG
// This mirrors what the backend will eventually return from:
//   GET /api/event-types
//   GET /api/event-types/:event_type_key/templates
// Adding a new event type or template = add an entry here
// (and a component in src/templates + registry.js).
// ============================================================

export const EVENT_TYPES = [
  {
    key: 'marriage',
    name: 'Wedding',
    icon: '💍',
    tagline: 'Shaadi, ceremonies and receptions',
  },
  {
    key: 'birthday',
    name: 'Birthday',
    icon: '🎂',
    tagline: 'First birthdays to fiftieths',
  },
  {
    key: 'engagement',
    name: 'Engagement',
    icon: '💐',
    tagline: 'Ring ceremonies and roka',
    comingSoon: true,
  },
  {
    key: 'housewarming',
    name: 'Housewarming',
    icon: '🏠',
    tagline: 'Griha pravesh celebrations',
    comingSoon: true,
  },
]

export const TEMPLATES = {
  marriage: [
    {
      key: 'traditional',
      name: 'Traditional',
      description: 'Deep maroon and gold, mandap arches, a classic card feel',
      price: 499,
      palette: ['#4E0F1E', '#C9A24B', '#FBF4E4'],
    },
    {
      key: 'floral',
      name: 'Floral',
      description: 'Ivory and blush, airy botanical framing, soft serif',
      price: 499,
      palette: ['#FDFBF7', '#C97B84', '#7C8F6E'],
    },
    {
      key: 'royal',
      name: 'Royal',
      description: 'Deep emerald and peacock gold, diamond frames, regal feel',
      price: 599,
      palette: ['#0E3B33', '#D4AF6A', '#2E8BA8'],
    },
      {
      key: 'scratch',
      name: 'Scratch & Reveal',
      description: 'Maroon and gold, a scratch-card reveal with festive sparkle animations',
      price: 599,
      palette: ['#5A0E1C', '#D4AF37', '#FBF3E4'],
    },
  ],
  birthday: [
    {
      key: 'vibrant',
      name: 'Vibrant',
      description: 'Midnight blue with confetti brights and playful type',
      price: 299,
      palette: ['#1E1B4B', '#FFD166', '#FF6B6B'],
    },
  ],
}

export function getEventType(key) {
  return EVENT_TYPES.find(e => e.key === key) || null
}

export function getTemplateMeta(eventTypeKey, templateTypeKey) {
  return (TEMPLATES[eventTypeKey] || []).find(t => t.key === templateTypeKey) || null
}