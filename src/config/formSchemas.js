// ============================================================
// FORM SCHEMAS
// One payload shape for every event type (your JSON structure),
// but each event type customises the form around it: suggested
// roles, section labels, placeholders and a sample payload used
// for template previews. Adding an event type = add a schema.
// ============================================================

const DEFAULT_SCHEMA = {
  participantRoles: ['host'],
  familyRoles: ['father', 'mother', 'brother', 'sister'],
  labels: {
    participants: 'Participants',
    family: 'Family members',
    primaryImages: 'Main photos',
    otherImages: 'More photos',
    whenWhere: 'When & where',
    messages: 'Messages for guests',
  },
  placeholders: {
    event_name: 'My Special Event',
    when_title: 'Main Ceremony',
    when_message: 'Venue name, City',
    when_time: '19 Feb 2027 · 6:30 PM',
  },
}

export const FORM_SCHEMAS = {
  marriage: {
    ...DEFAULT_SCHEMA,
    participantRoles: ['groom', 'bride'],
    familyRoles: ['father', 'mother', 'brother', 'sister', 'grandfather', 'grandmother'],
    labels: {
      ...DEFAULT_SCHEMA.labels,
      participants: 'The couple',
      family: 'With the blessings of',
    },
    placeholders: {
      ...DEFAULT_SCHEMA.placeholders,
      event_name: 'Rahul ❤️ Priya Wedding',
      when_title: 'Wedding Ceremony',
      when_message: 'Shree Palace, Bhubaneswar',
    },
    sample: {
      event_type_key: 'marriage',
      template_type_key: 'traditional',
      event_url: 'rahul-priya-wedding',
      event_name: 'Rahul ❤️ Priya Wedding',
      participants: [
        { role: 'groom', name: 'Rahul' },
        { role: 'bride', name: 'Priya' },
      ],
      family_members: [
        { role: 'father', name: 'Ramesh Kumar' },
        { role: 'mother', name: 'Sunita Kumar' },
        { role: 'brother', name: 'Amit Kumar' },
      ],
      primary_image: [
        { image_title: 'Bride', image_url: 'https://example.com/images/bride.jpg' },
        { image_title: 'Groom', image_url: 'https://example.com/images/groom.jpg' },
      ],
      other_image: [
        { image_title: 'Pre Wedding', image_url: 'https://example.com/images/pre1.jpg' },
        { image_title: 'Family', image_url: 'https://example.com/images/family.jpg' },
      ],
      when_where: [
        { title: 'Haldi Ceremony', message: "Bride's Home", time: '19 Feb 2027 · 10:00 AM' },
        { title: 'Wedding Ceremony', message: 'Shree Palace, Bhubaneswar', time: '19 Feb 2027 · 6:30 PM' },
        { title: 'Reception', message: 'Royal Garden', time: '20 Feb 2027 · 7:00 PM' },
      ],
      map_url: 'https://maps.google.com/?q=Shree+Palace+Bhubaneswar',
      blank_html: '<h2>Wedding Invitation</h2><p>Together with our families, we joyfully invite you.</p>',
      messages: [
        { whom: 'guest', what: 'Your presence is the greatest gift to us.' },
        { whom: 'friends', what: 'Join us to celebrate our special day.' },
      ],
    },
  },

  birthday: {
    ...DEFAULT_SCHEMA,
    participantRoles: ['birthday star'],
    familyRoles: ['father', 'mother', 'sister', 'brother'],
    labels: {
      ...DEFAULT_SCHEMA.labels,
      participants: 'Birthday star',
      family: 'Hosted by',
      messages: 'Party notes',
    },
    placeholders: {
      ...DEFAULT_SCHEMA.placeholders,
      event_name: "Aarav's 5th Birthday Bash",
      when_title: 'Birthday Party',
      when_message: 'Fun Zone, Patia',
      when_time: '14 Mar 2027 · 5:00 PM',
    },
    sample: {
      event_type_key: 'birthday',
      template_type_key: 'vibrant',
      event_url: 'aarav-turns-5',
      event_name: "Aarav's 5th Birthday Bash",
      participants: [{ role: 'birthday star', name: 'Aarav' }],
      family_members: [
        { role: 'father', name: 'Vikram Das' },
        { role: 'mother', name: 'Nisha Das' },
      ],
      primary_image: [
        { image_title: 'Aarav', image_url: 'https://example.com/images/aarav.jpg' },
      ],
      other_image: [
        { image_title: 'Last Year', image_url: 'https://example.com/images/b1.jpg' },
        { image_title: 'Family', image_url: 'https://example.com/images/b2.jpg' },
      ],
      when_where: [
        { title: 'Birthday Party', message: 'Fun Zone, Patia', time: '14 Mar 2027 · 5:00 PM' },
        { title: 'Cake Cutting', message: 'Main Hall', time: '14 Mar 2027 · 6:30 PM' },
      ],
      map_url: 'https://maps.google.com/?q=Patia+Bhubaneswar',
      blank_html: '<h2>You are invited!</h2><p>Games, cake and a lot of balloons.</p>',
      messages: [
        { whom: 'guest', what: 'No gifts please — just your blessings and big smiles.' },
      ],
    },
  },
}

export function getSchema(eventTypeKey) {
  return FORM_SCHEMAS[eventTypeKey] || DEFAULT_SCHEMA
}

export function getSample(eventTypeKey, templateTypeKey) {
  const schema = getSchema(eventTypeKey)
  const sample = schema.sample || FORM_SCHEMAS.marriage.sample
  return { ...sample, event_type_key: eventTypeKey, template_type_key: templateTypeKey }
}

// Blank payload for a fresh form — exactly your JSON structure.
export function emptyPayload(eventTypeKey, templateTypeKey) {
  const schema = getSchema(eventTypeKey)
  return {
    event_type_key: eventTypeKey,
    template_type_key: templateTypeKey,
    event_url: '',
    event_name: '',
    participants: schema.participantRoles.map(role => ({ role, name: '' })),
    family_members: [{ role: '', name: '' }],
    primary_image: [{ image_title: '', image_url: '' }],
    other_image: [{ image_title: '', image_url: '' }],
    when_where: [{ title: '', message: '', time: '' }],
    map_url: '',
    blank_html: '',
    messages: [{ whom: 'guest', what: '' }],
  }
}
