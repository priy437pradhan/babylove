export function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')      // strip accents
    .replace(/[^a-z0-9\s-]/g, '')          // drop emoji / symbols
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export const RESERVED_SLUGS = ['events', 'create', 'checkout', 'success', 'invite', 'api', 'admin']

export function validateSlug(slug) {
  if (!slug) return 'Link is required'
  if (slug.length < 3) return 'Link must be at least 3 characters'
  if (!/^[a-z0-9-]+$/.test(slug)) return 'Only lowercase letters, numbers and hyphens'
  if (RESERVED_SLUGS.includes(slug)) return 'This link is reserved, try another'
  return null
}
