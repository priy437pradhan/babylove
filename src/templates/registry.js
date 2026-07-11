// ============================================================
// TEMPLATE REGISTRY
// registry[event_type_key][template_type_key] -> React component
// Every template receives the full event payload as `data`.
// Adding a template = build the component, register it here,
// and add its meta (name/price/palette) in config/eventTypes.js.
// ============================================================
import MarriageTraditional from './marriage/Traditional'
import MarriageFloral from './marriage/Floral'
import MarriageRoyal from './marriage/Royal' 
import BirthdayVibrant from './birthday/Vibrant'
import MarriageScratch from './marriage/Scratch'
import MarriageBlossom from './marriage/Blossom'
import MarriageChapel from './marriage/Chapel'
import MarriageNikah from './marriage/Nikah'

export const TEMPLATE_REGISTRY = {
  marriage: {
    traditional: MarriageTraditional,
    floral: MarriageFloral,
        royal: MarriageRoyal,  
         scratch: MarriageScratch,
         blossom: MarriageBlossom,
         chapel:  MarriageChapel,
         nikah: MarriageNikah
      
  },
  birthday: {
    vibrant: BirthdayVibrant,
  },
}

export function resolveTemplate(eventTypeKey, templateTypeKey) {
  return TEMPLATE_REGISTRY[eventTypeKey]?.[templateTypeKey] || null
}
