import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const eventTypeEnum = pgEnum("event_type", [
  "corporate",
  "wedding",
  "live-music",
  "party",
  "presentation",
  "other",
]);

export const rentalPreferenceEnum = pgEnum("rental_preference", [
  "pickup",
  "delivery",
  "not-sure",
]);

export const quoteStatusEnum = pgEnum("quote_status", [
  "new",
  "contacted",
  "quoted",
  "closed",
]);

export const quoteRequests = pgTable("quote_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  eventDate: text("event_date"),
  eventType: eventTypeEnum("event_type").notNull(),
  guestCount: integer("guest_count"),
  location: text("location"),
  rentalPreference: rentalPreferenceEnum("rental_preference"),
  supportNeeds: text("support_needs").array().notNull().default([]),
  notes: text("notes"),
  status: quoteStatusEnum("status").notNull().default("new"),
});
