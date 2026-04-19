CREATE TYPE "public"."event_type" AS ENUM('corporate', 'wedding', 'live-music', 'party', 'presentation', 'other');--> statement-breakpoint
CREATE TYPE "public"."quote_status" AS ENUM('new', 'contacted', 'quoted', 'closed');--> statement-breakpoint
CREATE TYPE "public"."rental_preference" AS ENUM('pickup', 'delivery', 'not-sure');--> statement-breakpoint
CREATE TABLE "quote_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"event_date" text,
	"event_type" "event_type" NOT NULL,
	"guest_count" integer,
	"location" text,
	"rental_preference" "rental_preference",
	"support_needs" text[] DEFAULT '{}' NOT NULL,
	"notes" text,
	"status" "quote_status" DEFAULT 'new' NOT NULL
);
