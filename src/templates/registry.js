// ============================================================
// TEMPLATE REGISTRY
// registry[event_type_key][template_type_key] -> React component
// Every template receives the full event payload as `data`.
// Adding a template = build the component, register it here,
// and add its meta (name/price/palette) in config/eventTypes.js.
// ============================================================
import MarriageTraditional from './marriage/Traditional'
import MarriageFloral from './marriage/Floral'
import BirthdayVibrant from './birthday/Vibrant'

export const TEMPLATE_REGISTRY = {
  marriage: {
    traditional: MarriageTraditional,
    floral: MarriageFloral,
  },
  birthday: {
    vibrant: BirthdayVibrant,
  },
}

export function resolveTemplate(eventTypeKey, templateTypeKey) {
  return TEMPLATE_REGISTRY[eventTypeKey]?.[templateTypeKey] || null
}
