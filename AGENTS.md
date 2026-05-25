# AGENTS.md

## Project overview

JA Event Production is a rental-first audio, lighting, and AV event-rental website/MVP.

The product direction is:

- Lead with rental packages, not vague service copy or raw inventory.
- Make it easy for customers to answer: what is available, what package fits my event, what it roughly costs, and whether delivery/setup/technician support is available.
- Treat the quote/availability request flow as the primary conversion path.
- Keep technician/setup/labor as optional add-ons that increase margin without making the site feel labor-first.

The current MVP is a Next.js App Router application with public marketing/package/quote pages, an admin quote area, Drizzle/Postgres persistence, and stubbed Resend email support.

## Current stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- Drizzle ORM + drizzle-kit
- PostgreSQL via `DATABASE_URL` / Supabase project database
- Resend for outbound email, currently safe to keep stubbed until domain/DNS details are ready
- npm scripts from `package.json`

## High-level architecture

Important folders and files:

- `src/app/page.tsx` — homepage
- `src/app/about/page.tsx` — about page
- `src/app/faq/page.tsx` — FAQ page
- `src/app/packages/page.tsx` — packages index
- `src/app/packages/[slug]/page.tsx` — package detail pages
- `src/app/quote/page.tsx` — quote request form page
- `src/app/quote/actions.ts` — quote submit server action
- `src/app/admin-login/page.tsx` — admin login page
- `src/app/admin-login/actions.ts` — admin login server action
- `src/app/admin/layout.tsx` — admin route protection/layout
- `src/app/admin/quotes/page.tsx` — admin quote list
- `src/app/admin/quotes/[id]/page.tsx` — admin quote detail
- `src/app/admin/quotes/actions.ts` — admin quote actions
- `src/components/` — shared UI components
- `src/data/packages.ts` — package data source for the current MVP
- `src/db/schema.ts` — Drizzle schema source of truth
- `src/db/index.ts` — database client setup
- `src/lib/admin-auth.ts` — admin auth helper logic
- `src/lib/email.ts` — email sending abstraction/stub
- `src/lib/types.ts` — shared TypeScript types
- `src/lib/validation.ts` — quote form validation
- `drizzle/` — generated migrations and metadata

## Product principles

1. Rental-first, package-led.
   - Prioritize package browsing, availability requests, and clear customer decision paths.
   - Do not turn the MVP into a full e-commerce checkout unless explicitly asked.
   - Do not assume real-time inventory booking is available yet.

2. Keep the quote request flow central.
   - Quote requests should capture enough information for a human to follow up quickly.
   - Preserve fields around event date, location, event type, guest count, pickup/delivery preference, support needs, and notes.
   - Prefer “Request availability” / “Get a fast quote” language over “Buy now” language.

3. Sell confidence and simplicity.
   - Copy should emphasize reliable gear, right-sized packages, delivery/setup options, and optional technician support.
   - Avoid jargon-heavy AV language on customer-facing pages unless it is explained plainly.

4. Build the MVP, not the eventual platform.
   - Favor simple, durable implementations over broad abstractions.
   - Use `src/data/packages.ts` for package content until a database-backed catalog is clearly needed.
   - Avoid introducing tenants, accounts, carts, payments, or inventory reservations unless the task explicitly asks for them.

## Coding conventions

- Use TypeScript throughout.
- Prefer server components by default in the App Router.
- Use client components only when interactivity, browser APIs, or local state require them.
- Use server actions for form submissions unless there is a clear reason for an API route.
- Keep DB access server-only.
- Keep validation logic centralized in `src/lib/validation.ts` where practical.
- Keep shared types in `src/lib/types.ts` when they cross route/component boundaries.
- Keep reusable UI in `src/components/`.
- Keep package/rental content data-driven where reasonable.
- Avoid large rewrites when a focused patch solves the task.
- Avoid adding dependencies unless the task truly requires them.
- Do not manually edit generated Drizzle snapshot metadata unless specifically fixing a migration problem and explaining why.

## UI and content conventions

- Use Tailwind utility classes consistent with the existing app.
- Keep layouts responsive and readable on mobile.
- Use semantic HTML where possible.
- Forms must have accessible labels or label-equivalent markup.
- Buttons and links should use clear action language.
- Customer-facing copy should be direct, practical, and rental-focused.
- Prefer examples like:
  - “Browse Packages”
  - “Request Availability”
  - “Get a Fast Quote”
  - “Delivery, setup, and technician support available”
- Avoid generic copy like:
  - “Full-service event solutions”
  - “We make your event unforgettable”
  - “Contact us for all your production needs”

## Database and migrations

- Drizzle schema lives in `src/db/schema.ts`.
- Generated migrations live under `drizzle/`.
- When changing the schema:
  1. Update `src/db/schema.ts`.
  2. Run `npm run db:generate`.
  3. Review the generated SQL before applying.
  4. Only run `npm run db:migrate` when a valid `DATABASE_URL` is available and migration is intended.
- Do not create destructive migrations casually.
- Preserve existing quote request data when possible.
- If adding enum values, consider how existing records and admin filters will behave.

## Email conventions

- Email behavior is abstracted in `src/lib/email.ts`.
- Resend may remain stubbed until the business has final domain/DNS information.
- Do not hard-code API keys, sender domains, or recipient addresses.
- Read email-related env vars only on the server.
- Quote submission should not fail catastrophically just because email sending is unavailable during local development.

## Admin conventions

- Keep admin-only routes under `src/app/admin/`.
- Keep login under `src/app/admin-login/` unless intentionally changing the admin auth flow.
- Do not expose admin secrets or auth checks to client-side code.
- Admin quote actions should be explicit and conservative.
- Quote status changes should preserve the simple status lifecycle unless the task asks to expand it:
  - `new`
  - `contacted`
  - `quoted`
  - `closed`

## Security and privacy

- Never commit secrets.
- Never print secrets in logs or UI.
- Keep `DATABASE_URL`, Resend API keys, and admin secrets server-only.
- Validate and normalize user-submitted form data before inserting into the database.
- Avoid logging full quote details unless needed for debugging.
- Treat customer contact info as private.

## Validation commands

Use the scripts available in `package.json`.

Before finishing most code changes, run:

```bash
npm run lint
npm run build
```

When schema changes are made, also run:

```bash
npm run db:generate
```

Only run this when a valid database connection is configured and applying the migration is intended:

```bash
npm run db:migrate
```

There is currently no dedicated test script unless one is added later.

## Codex working style

For each task:

1. Inspect the relevant files before editing.
2. Make the smallest coherent change that satisfies the request.
3. Preserve current behavior unless the task explicitly asks to change it.
4. Prefer clear file-level patches over broad rewrites.
5. Keep implementation aligned with the rental-first MVP direction.
6. Run the relevant validation commands when possible.
7. Summarize:
   - files changed
   - what changed
   - commands run
   - any known limitations or follow-up work

When blocked:

- State the exact missing information or failing command.
- Do not invent environment variables, secrets, database URLs, or domain settings.
- Provide a safe stub or clear TODO only when that is better than blocking the whole task.

## Good next-task areas

The highest-value improvements for this MVP are likely:

- Package detail page polish and clearer package CTAs.
- Passing selected package context into the quote form.
- Admin quote workflow improvements.
- Email notification wiring once domain details are available.
- Rental catalog foundation after package flow is solid.
- Manual availability/request flow before real-time inventory booking.
- Better trust signals: service area, real event photos, testimonials, brands carried, FAQ clarity.

Do not jump to full checkout, payment processing, client accounts, or real-time inventory reservations unless explicitly requested.

## Definition of done

A task is done when:

- The requested behavior is implemented.
- The change is scoped and understandable.
- TypeScript and lint/build checks pass, or failures are clearly reported.
- User-facing copy still supports the rental-first positioning.
- No secrets or server-only logic have leaked into client code.
- Any schema changes include generated Drizzle migration files.
