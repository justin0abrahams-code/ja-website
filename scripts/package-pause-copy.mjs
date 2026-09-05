// Exact copy edits used for fixtures and the existing CMS documents. Preserve
// editor changes outside these phrases and leave dormant package content alone.
export const packagePauseCopy = [
  ["Sound and lighting rental packages for North Georgia events", "Sound rentals for North Georgia events"],
  ["Audio rental packages for North Georgia events", "Audio rentals for North Georgia events"],
  ["equipment rental packages, delivery", "equipment rentals, delivery"],
  ["Start with a right-sized package, then add delivery, setup, or technician support when your event needs it.", "Tell us what your event needs, then add delivery, setup, or technician support when you need it."],
  ["Clear package options for gatherings from small meetings to events with crowds of up to 500 people.", "Sound for gatherings from small meetings to events with crowds of up to 500 people."],
  ["Basic sound packages for 50-500 people", "Sound rentals for 50-500 people"],
  ["Choose a practical starting point, share your event details, and Justin will confirm availability, logistics, and the right support level.", "Share your event details, and Justin will confirm equipment availability, logistics, and the right support level."],
  ["Choose a package or start with a custom quote", "Share your event date, location, and rental needs"],
  ["Scalable sound packages with monitors", "Scalable sound systems with monitors"],
  ["Share the date, location, guest count, package, and support needs.", "Share the date, location, guest count, equipment, and support needs."],
  ["The site leads with packages because most customers need a clear starting point: what setup fits the event and whether delivery, setup, or a technical operator is available.", "Justin can help you choose the equipment that fits your event and confirm whether delivery, setup, or a technical operator is available."],
  ["Fixed sound rental packages", "Sound equipment rentals"],
  ["If you are not sure which package fits your event", "If you are not sure which equipment fits your event"],
  ["Share your date, location, event type, and the package you are considering.", "Share your date, location, event type, guest count, and equipment needs."],
  ["You receive a package recommendation and quote.", "You receive an equipment recommendation and quote."],
  ["Clear package details, flexible add-ons, and a quote-first workflow keep the rental process simple without pretending inventory is instantly bookable.", "Get answers about equipment rentals, delivery, setup, and support before requesting availability for your event."],
  ["figure out the right package, support options", "figure out the right equipment, support options"],
  ["operators, package upgrades, quote requests", "operators, equipment options, quote requests"],
  ["Some packages are rental-friendly, especially smaller announcement setups.", "Some equipment is easy to set up yourself, especially smaller announcement systems."],
  ["What if I am not sure what package I need?", "What if I am not sure what equipment I need?"],
  ["matching the right package and support availability", "matching the right equipment and support availability"],
  ["Do packages include every possible upgrade?", "Can I add equipment or event-day support?"],
  ["No. Packages are practical starting points. Subwoofers, uplighting, band gear, delivery, labor, and operators can be added based on the event.", "Yes. Subwoofers, band gear, delivery, labor, and operators can be added based on the event. Justin will confirm the available options in your quote."],
  ["guest count, preferred package, pickup", "guest count, equipment needs, pickup"],
];

export function pausePackageCopy(text) {
  return packagePauseCopy.reduce((value, [before, after]) => value.replaceAll(before, after), text);
}
