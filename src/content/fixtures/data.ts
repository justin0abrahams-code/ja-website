import type { Faq, RentalPackage } from "@/content/domain";

export const fixtureRentalPackages = [
  {
    slug: "basic-sound-package-1",
    name: "Small Event Sound Package",
    category: "Sound",
    bestFor: "Small meetings, birthday parties, cookouts, and private gatherings",
    eventSize: "50-75 people",
    includes: [
      "2 high quality 2000 watt speakers",
      "2 speaker stands",
      "16 channel digital mixer",
      "2 wireless handheld microphones",
      "Audio adapter, cabling, power, and 6 ft folding table",
    ],
    addons: [
      "Delivery and pickup",
      "Setup and strike labor",
      "Technical equipment operator",
      "Basic subwoofer upgrade",
      "Basic uplighting upgrade",
    ],
    description:
      "A compact announcement setup that is easy to transport and built for clear sound at smaller events.",
    image: {
      src: "/brand/audio-console.jpg",
      alt: "Digital audio console used for an event sound system",
    },
    rentalPeriod: "Per day",
    featured: true,
    displayOrder: 10,
  },
  {
    slug: "basic-sound-package-2",
    name: "Medium Event Sound Package",
    category: "Sound",
    bestFor: "Meetings and events that need a little more coverage",
    eventSize: "150-200 people",
    includes: [
      "4 high quality 2000 watt speakers",
      "4 speaker stands",
      "16 channel digital mixer",
      "4 wireless handheld microphones",
      "Audio adapters, cabling, power, and 6 ft folding table",
    ],
    addons: [
      "Delivery and pickup",
      "Setup and strike labor",
      "Technical equipment operator",
      "Basic subwoofer upgrade",
      "Basic uplighting upgrade",
    ],
    description:
      "A medium announcement package for events that need more speaker coverage and microphone flexibility.",
    image: {
      src: "/brand/uplighting-room.jpg",
      alt: "Event room illuminated with blue and amber uplighting",
    },
    rentalPeriod: "Per day",
    featured: true,
    displayOrder: 20,
  },
  {
    slug: "basic-sound-package-3",
    name: "Large Event Sound Package",
    category: "Sound",
    bestFor: "Large events, conferences, outdoor gatherings, and fuller room coverage",
    eventSize: "Up to 500 people",
    includes: [
      "4 high quality 2000 watt speakers",
      "2 high quality 1000 watt speakers",
      "2 high quality 2000 watt subwoofers",
      "32 channel digital mixer with I/O rack",
      "4 wireless handheld microphones plus cabling, power, and table",
    ],
    addons: [
      "Delivery and pickup",
      "Setup and strike labor",
      "Technical equipment operator",
      "Basic band upgrade",
      "Basic uplighting upgrade",
    ],
    description:
      "A larger sound package with subs, expanded mixing, and the coverage needed for bigger rooms or crowds.",
    image: {
      src: "/brand/stage-audio.jpg",
      alt: "Stage audio system set up for a live event",
    },
    rentalPeriod: "Per day",
    featured: true,
    displayOrder: 30,
  },
  {
    slug: "basic-uplighting-upgrade",
    name: "Room Uplighting Upgrade",
    category: "Lighting",
    bestFor: "Weddings, parties, receptions, and room ambiance",
    eventSize: "Best matched to room size",
    includes: [
      "8 basic color par lights",
      "Power cabling",
      "Power strips",
      "Static color look",
    ],
    addons: [
      "Additional setup labor",
      "Delivery and pickup",
      "Add to any sound package",
    ],
    description:
      "A simple room-transforming lighting add-on for a clean static color look.",
    image: {
      src: "/brand/uplighting-room.jpg",
      alt: "Event room illuminated with blue and amber uplighting",
    },
    rentalPeriod: "Per day add-on",
    featured: true,
    displayOrder: 40,
  },
  {
    slug: "basic-band-upgrade",
    name: "Live Band Support Upgrade",
    category: "Live Music",
    bestFor: "Bands that need monitors, stage microphones, DI boxes, and a larger mix setup",
    eventSize: "Add-on for live music events",
    includes: [
      "4 high quality 2000 watt monitor speakers",
      "Band microphone kit",
      "Tall and short mic stands",
      "DI boxes",
      "32 channel mixer, I/O rack, split snake, cabling, power, and table",
    ],
    addons: [
      "Technical equipment operator",
      "Setup and strike labor",
      "Delivery and pickup",
    ],
    description:
      "A live music upgrade for events that need proper stage inputs, monitors, and operator-ready infrastructure.",
    image: {
      src: "/brand/stage-audio.jpg",
      alt: "Stage audio system set up for a live event",
    },
    rentalPeriod: "Per day add-on",
    featured: true,
    displayOrder: 50,
  },
  {
    slug: "custom-event-quote",
    name: "Custom Event Quote",
    category: "Custom",
    bestFor: "Weddings, corporate events, home movie nights, private parties, conferences, and unusual setups",
    eventSize: "Tell us about the event",
    includes: [
      "Package recommendation",
      "Upgrade and add-on guidance",
      "Delivery, setup, and operator options",
      "Right-sized quote for your event",
    ],
    addons: [
      "Equipment delivery and pickup",
      "General labor",
      "Technical equipment operator",
    ],
    description:
      "Not sure which package fits? Share the event details and Justin can recommend the right rental setup.",
    image: {
      src: "/brand/outdoor-screen.jpg",
      alt: "Outdoor event screen and production setup",
    },
    featured: true,
    displayOrder: 60,
  },
] satisfies RentalPackage[];

export const fixtureFaqs = [
  {
    question: "Do you offer delivery and setup?",
    answer:
      "Yes. Delivery, pickup, setup, strike, and stage hand support are available. Include your venue or city and access details so the right support can be included in your quote.",
    displayOrder: 10,
  },
  {
    question: "Can I rent gear without an on-site technician?",
    answer:
      "Yes. Some packages are rental-friendly, especially smaller announcement setups. Larger events, bands, and higher-pressure timelines may benefit from setup help or a technical equipment operator.",
    displayOrder: 20,
  },
  {
    question: "Can a technical equipment operator stay for the event?",
    answer:
      "Yes. Technical equipment operators are available for events that need active mixing, equipment monitoring, or hands-on support throughout the program.",
    displayOrder: 30,
  },
  {
    question: "What if I am not sure what package I need?",
    answer:
      "Start with a custom quote request. Share the event type, date, guest count, location, and what you are trying to accomplish, and Justin can recommend the right setup.",
    displayOrder: 40,
  },
  {
    question: "How far in advance should I request a quote?",
    answer:
      "As early as possible is best, especially for weddings, live shows, and larger event dates. Early requests improve the chance of matching the right package and support availability.",
    displayOrder: 50,
  },
  {
    question: "Do packages include every possible upgrade?",
    answer:
      "No. Packages are practical starting points. Subwoofers, uplighting, band gear, delivery, labor, and operators can be added based on the event.",
    displayOrder: 60,
  },
  {
    question: "What information should I include in a quote request?",
    answer:
      "The most helpful details are your event date, location, event type, guest count, preferred package, pickup or delivery preference, and any notes about venue access or timing.",
    displayOrder: 70,
  },
  {
    question: "Where do you serve?",
    answer:
      "JA Event Production serves North Georgia. Include your venue or city in the quote request so travel and availability can be confirmed.",
    displayOrder: 80,
  },
] satisfies Faq[];
