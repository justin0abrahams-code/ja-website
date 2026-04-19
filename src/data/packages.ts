import { RentalPackage } from "@/lib/types";

export const packages: RentalPackage[] = [
  {
    slug: "small-speech-package",
    name: "Small Speech Package",
    category: "Presentation",
    bestFor: "Meetings, announcements, school events, and small gatherings",
    eventSize: "Up to 75 guests",
    startingPrice: "$149",
    includes: [
      "2 powered speakers",
      "1 wireless microphone",
      "1 compact mixer",
      "2 speaker stands",
      "Required cabling",
    ],
    addons: ["Delivery", "Setup", "On-site technician"],
    description:
      "A simple, reliable package for spoken-word events where clarity and speed matter most.",
    featured: true,
  },
  {
    slug: "wedding-ceremony-package",
    name: "Wedding Ceremony Package",
    category: "Wedding",
    bestFor: "Ceremonies, officiants, vows, and ceremony music playback",
    eventSize: "Up to 150 guests",
    startingPrice: "$249",
    includes: [
      "2 powered speakers",
      "2 wireless microphones",
      "Audio playback input",
      "Stands and required cabling",
    ],
    addons: ["Delivery", "Setup", "Ceremony support technician"],
    description:
      "Designed to make sure every important word is heard clearly during the ceremony.",
    featured: true,
  },
  {
    slug: "small-band-pa-package",
    name: "Small Band PA Package",
    category: "Live Music",
    bestFor: "Solo artists, duos, and small band performances",
    eventSize: "Up to 200 guests",
    startingPrice: "$399",
    includes: [
      "2 main speakers",
      "Mixer",
      "2 vocal microphones",
      "DI boxes",
      "Stands and required cabling",
    ],
    addons: ["Monitors", "Delivery", "Setup", "Live sound engineer"],
    description:
      "A flexible starter PA package for small live music performances and intimate venues.",
    featured: true,
  },
  {
    slug: "corporate-presentation-package",
    name: "Corporate Presentation Package",
    category: "Presentation",
    bestFor: "Business meetings, panels, training sessions, and presentations",
    eventSize: "Up to 200 guests",
    startingPrice: "$349",
    includes: [
      "Speaker system",
      "Wireless microphones",
      "Small mixer",
      "Projector support options",
      "Required cabling",
    ],
    addons: ["Projector", "Screen", "Delivery", "Setup", "AV technician"],
    description:
      "A polished package for corporate and professional events that need dependable AV.",
  },
  {
    slug: "uplighting-package",
    name: "Uplighting Package",
    category: "Lighting",
    bestFor: "Weddings, parties, receptions, and room ambiance",
    eventSize: "Varies by room size",
    startingPrice: "$199",
    includes: ["8 uplights", "Power cabling", "Basic placement guidance"],
    addons: ["Additional fixtures", "Setup", "Custom color programming"],
    description:
      "An easy way to transform a room and create a cleaner, more elevated event look.",
    featured: true,
  },
];
