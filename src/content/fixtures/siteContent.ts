import type { SiteContent } from "@/content/domain";

const defaultSocialImage = { src: "/brand/audio-console.jpg", alt: "Digital audio console at an event" };

export const fixtureSiteContent = {
  settings: {
    businessName: "Justin Abrahams Event Production",
    shortName: "Justin Abrahams",
    tagline: "Sound that moves the moment.",
    serviceArea: "North Georgia",
    description: "Equipment rentals and event production support for weddings, parties, live shows, conferences, meetings, and private gatherings across North Georgia.",
    experience: "16 years of event and planning experience",
    header: { brandDescriptor: "Event Production", packagesLabel: "Packages", quoteLabel: "Quote", aboutLabel: "About", faqLabel: "FAQ", galleryLabel: "Gallery", ctaLabel: "Get a Fast Quote" },
    footer: { navigationHeading: "Navigation", serviceAreaHeading: "Service Area", packagesLabel: "Packages", quoteLabel: "Quote Request", aboutLabel: "About", faqLabel: "FAQ", galleryLabel: "Gallery", serviceAreaDescription: "Serving North Georgia with equipment rentals, delivery, setup, and technician support options.", ctaLabel: "Get a Fast Quote" },
    seo: { title: "Justin Abrahams Event Production | Sound Rentals", description: "Sound rentals for North Georgia events, with delivery, setup, and technical operator options.", socialImage: defaultSocialImage },
  },
  home: {
    hero: { eyebrow: "Justin Abrahams Event Production", heading: "Sound rentals for North Georgia events", tagline: "Sound that moves the moment.", description: "Tell us what your event needs, then add delivery, setup, or technician support when you need it.", primaryLabel: "Browse Packages", secondaryLabel: "Check Availability", image: { src: "/brand/audio-console.jpg", alt: "Digital audio console at an event" }, imageEyebrow: "Rentals, setup, and operators", imageDescription: "Sound for gatherings from small meetings to events with crowds of up to 500 people." },
    proofPoints: [{ key: "experience", text: "16 years of event and planning experience" }, { key: "coverage", text: "Sound rentals for 50-500 people" }, { key: "support", text: "Delivery, labor, and operators available" }],
    featuredPackages: { eyebrow: "Core Sound Packages", heading: "Choose by event size and coverage needs", description: "Compare what is included, then request availability so Justin can confirm the right package, logistics, and support for your date.", linkLabel: "View all packages" },
    upgrades: {
      eyebrow: "Popular Upgrades", heading: "Add only the support your event needs", description: "Upgrades and event-day services are matched to the room, schedule, audience, and access requirements during the quote process.", linkLabel: "See all packages and upgrades",
      items: [
        { key: "subwoofer-support", title: "Subwoofer Support", description: "Add fuller low-end coverage for music-focused events and larger rooms." },
        { key: "band-support", title: "Band Support", description: "Add monitors, stage microphones, DI boxes, stands, and expanded mixing for live performers." },
        { key: "event-day-help", title: "Event-Day Help", description: "Ask about delivery, setup, strike labor, or an on-site technical equipment operator." },
      ],
    },
    process: { eyebrow: "How It Works", heading: "A quote-first rental process", description: "Share your event details, and Justin will confirm equipment availability, logistics, and the right support level.", image: { src: "/brand/audio-console.jpg", alt: "Digital audio console at an event" }, stepLabel: "Step", steps: [{ key: "choose", text: "Share your event date, location, and rental needs" }, { key: "upgrade", text: "Add upgrades like subs, labor, or a technical operator" }, { key: "confirm", text: "Confirm availability, delivery, setup, and event-day support" }] },
    eventTypes: { eyebrow: "Event Types", heading: "Built for gatherings that need clear sound and simple support", items: [{ key: "weddings-parties", title: "Weddings and Parties", description: "Ceremony sound, reception audio, private parties, cookouts, and home movie nights." }, { key: "meetings-conferences", title: "Meetings and Conferences", description: "Clear announcement systems for meetings, trainings, panels, and corporate gatherings." }, { key: "live-shows", title: "Live Shows", description: "Scalable sound systems with monitors, microphones, subs, and operator support when needed." }] },
    cta: { eyebrow: "Request Availability", heading: "Need a rental quote for an event in North Georgia?", description: "Share the date, location, guest count, equipment, and support needs. Justin can help match the right rental setup and next steps.", primaryLabel: "Check Your Date", secondaryLabel: "Browse Packages", image: { src: "/brand/outdoor-screen.jpg", alt: "Outdoor event screen and production setup" } },
    seo: { title: "Justin Abrahams Event Production | Sound Rentals", description: "Sound rentals for North Georgia events, with delivery, setup, and technical operator options.", socialImage: defaultSocialImage },
  },
  about: {
    introduction: { eyebrow: "About Justin Abrahams", heading: "A small family-owned event production company focused on rentals", description: "Justin Abrahams Event Production serves the North Georgia area with audio and production equipment rentals backed by 16 years of event and planning experience.", secondaryDescription: "Justin can help you choose the equipment that fits your event and confirm whether delivery, setup, or a technical operator is available." },
    heroImage: { src: "/brand/stage-audio.jpg", alt: "Stage and speaker setup for an event" },
    supportedEvents: { eyebrow: "What We Support", heading: "Event types and rental needs", items: [{ key: "weddings", text: "North Georgia weddings and private gatherings" }, { key: "corporate", text: "Corporate meetings, conferences, and trainings" }, { key: "live", text: "Live shows, bands, and outdoor event setups" }, { key: "parties", text: "Parties, cookouts, and home movie nights" }] },
    supportOptions: { eyebrow: "Support Options", heading: "Flexible help beyond the rental itself", items: [{ key: "packages", text: "Sound equipment rentals" }, { key: "upgrades", text: "Subwoofer and band upgrades" }, { key: "delivery", text: "Equipment delivery and pickup" }, { key: "labor", text: "Setup, strike, and stage hand labor" }, { key: "operators", text: "Technical equipment operators" }] },
    serviceArea: { eyebrow: "Service Area", heading: "Serving North Georgia", description: "Service is available across North Georgia. Share your venue or city in the quote request so travel, delivery, and event logistics can be confirmed for your date." },
    cta: { eyebrow: "Need help choosing?", heading: "Tell us about the event and Justin can match the right setup", description: "If you are not sure which equipment fits your event, request a quote and share the basics.", primaryLabel: "Get a Fast Quote", secondaryLabel: "Browse Packages" },
    seo: { title: "About | Justin Abrahams Event Production", description: "Learn about Justin Abrahams Event Production and rental support for events across North Georgia.", socialImage: defaultSocialImage },
  },
  gallery: {
    introduction: { eyebrow: "Photo Gallery", heading: "Sound and event setups", description: "Take a closer look at audio equipment and event production setups." },
    photos: [
      { key: "stage", src: "/brand/stage-audio.jpg", alt: "Stage and speaker setup for an event", caption: "Stage audio" },
      { key: "console", src: "/brand/audio-console.jpg", alt: "Digital audio console at an event", caption: "Audio mixing" },
      { key: "outdoor", src: "/brand/outdoor-screen.jpg", alt: "Outdoor event screen and production setup", caption: "Outdoor production" },
    ],
    seo: { title: "Gallery | Justin Abrahams Event Production", description: "Explore sound and event production photos for North Georgia rental inspiration.", socialImage: defaultSocialImage },
  },
  packages: {
    introduction: { eyebrow: "Rental Packages", heading: "Sound packages built around real event needs", description: "Choose the setup that best matches your event size and use, then ask about delivery, setup, subs, band support, or a technical operator." },
    labels: { bestFor: "Best for:", eventSize: "Event size:", rentalPeriod: "Rental period:", includes: "Includes:", cardAvailability: "Check Availability", cardDetails: "View Details", backToPackages: "Back to Packages", detailIncludes: "What's Included", detailAddons: "Optional Add-Ons", detailAvailability: "Check Availability", detailBrowse: "Browse More Packages" },
    seo: { title: "Rental Packages | Justin Abrahams Event Production", description: "Compare sound, live-band, and custom event rental packages for North Georgia events.", socialImage: defaultSocialImage },
  },
  quote: {
    introduction: { eyebrow: "Check Availability", heading: "Tell us the basics about your event", description: "Share your date, location, event type, guest count, and equipment needs. Justin can confirm availability and recommend the right setup and support." },
    nextStepsHeading: "What happens next",
    nextSteps: [{ key: "review", text: "Your event details are reviewed." }, { key: "confirm", text: "Availability and logistics are confirmed." }, { key: "recommend", text: "You receive an equipment recommendation and quote." }],
    emailPrompt: "Prefer email?",
    seo: { title: "Request Availability | Justin Abrahams Event Production", description: "Request availability and a right-sized sound rental quote for your North Georgia event.", socialImage: defaultSocialImage },
  },
  faq: {
    introduction: { eyebrow: "Frequently Asked Questions", heading: "Helpful answers before you request a quote", description: "Get answers about equipment rentals, delivery, setup, and support before requesting availability for your event." },
    cta: { eyebrow: "Still have questions?", heading: "Tell us about your event and Justin can help from there", description: "A quote request is the fastest way to figure out the right equipment, support options, and next steps.", primaryLabel: "Get a Fast Quote", secondaryLabel: "Browse Packages" },
    seo: { title: "FAQ | Justin Abrahams Event Production", description: "Answers about delivery, setup, operators, equipment options, quote requests, and the North Georgia service area.", socialImage: defaultSocialImage },
  },
} satisfies SiteContent;
