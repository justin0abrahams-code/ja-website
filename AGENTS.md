# AGENTS.md

## Current package pause

Packages are temporarily disabled by `src/features.ts`. The original routes are
preserved in `src/app/_packages/`, outside Next.js routing. Do not reintroduce
package navigation, merchandising, quote selection, or CMS editing until requested.
The active site leads with equipment rentals and availability requests. Package
documents, schemas, fixtures, components, and repository methods remain for later;
active builds do not require package documents or dormant package fields. The
package-led guidance below applies when the catalogue is restored.

## Project overview

JA Event Production is a rental-first audio, lighting, and AV event-rental website.

The product direction is:

- Lead with rental packages rather than vague service copy or raw inventory.
- Help customers understand what is available, which package fits, and whether delivery, setup, and technician support are available.
- Treat the quote and availability request as the primary conversion path.
- Keep technician, setup, and labor options as add-ons without making the site labor-first.

The application is a Next.js App Router site that exports to static files. It has public marketing, package, FAQ, and quote pages. It does not contain a database, admin quote area, application-server form handler, customer accounts, checkout, or real-time inventory reservations.

## Current stack

- Node.js 22.12 or newer
- Next.js App Router with output set to export
- React and TypeScript
- Tailwind CSS v4
- Sanity Studio and Content Lake for optional package/FAQ content
- Checked-in fixtures for offline development and automated checks
- A hosted-form endpoint or prefilled email fallback for quote requests
- Vitest for focused content-layer tests
- npm scripts from package.json

## Architecture

Important application areas:

- src/app/page.tsx — homepage
- src/app/packages/page.tsx — package index
- src/app/packages/[slug]/page.tsx — statically generated package detail pages
- src/app/quote/page.tsx — server page that resolves package choices
- src/components/QuoteRequestForm.tsx — client-side hosted-form/email behavior
- src/app/faq/page.tsx — repository-backed FAQ page
- src/app/gallery/page.tsx — gallery of up to 10 CMS-managed photos
- src/content/domain.ts — site-owned, Sanity-free content contracts
- src/content/repository.ts — public asynchronous content repository and source selection
- src/content/fixtures/ — checked-in package and FAQ content
- src/content/sanity/ — Sanity client, queries, generated types, validation, mapping, and repository adapter
- sanity/schemaTypes/ — JA-specific Studio schemas
- sanity.config.ts and sanity.cli.ts — standalone Studio and TypeGen configuration
- docs/CMS.md — setup, migration, publishing, recovery, and preview guidance
- scripts/prepare-sites.mjs — stages the static export for the current hosting workflow

The public site has four content boundaries:

1. Site-owned domain contracts expose resolved RentalPackage, Faq, and ContentImage values without Sanity fields.
2. The repository exposes getRentalPackages(), getRentalPackage(slug), and getFaqs().
3. The Sanity adapter owns client configuration, GROQ, generated query types, runtime validation, mapping, image URL resolution, and provider-error translation.
4. The Next.js composition layer selects fixture or Sanity content and resolves everything at build time.

Pages and presentation components must not import fixture data, Sanity clients, GROQ queries, or generated Sanity types directly.

## Content-source behavior

JA_CONTENT_SOURCE controls the build:

- Unset, empty, or fixture uses checked-in fixtures and requires no Sanity credentials or network.
- sanity uses only published Sanity content.
- Any unsupported value fails clearly.
- Sanity mode must never fall back to fixtures after configuration, fetch, or validation failure.

Sanity mode requires SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET. SANITY_READ_TOKEN is optional for a private dataset and must remain server/build-only. Never place viewer, read, or write tokens in NEXT_PUBLIC_* or SANITY_STUDIO_* variables.

The public Sanity adapter uses the published perspective and the live API during static builds. Draft preview, draft mode, webhooks, and runtime revalidation are later work.

## Product principles

1. Rental-first and package-led.
   - Prioritize package browsing, availability requests, and clear decision paths.
   - Do not introduce checkout, payments, accounts, or real-time booking unless explicitly requested.

2. Keep the quote request central.
   - Preserve event date, location, type, guest count, package context, and notes.
   - Prefer “Request Availability,” “Check Availability,” and “Get a Fast Quote” language.

3. Sell confidence and simplicity.
   - Emphasize reliable gear, right-sized packages, delivery/setup options, and optional technician support.
   - Explain customer-facing AV terminology plainly.

4. Build the current site, not a generic platform.
   - Keep schemas and domain rules specific to JA Event Production.
   - Do not add a generic CMS abstraction, arbitrary page builder, shared CF Assets package, inventory service, or automatic content seed without an explicit task.

## Coding conventions

- Use TypeScript throughout.
- Prefer Server Components; use client components only for browser APIs or local interactivity.
- Fetch content in server pages and pass the smallest serializable props to client components.
- Keep package detail routes fully enumerated by asynchronous generateStaticParams(), with dynamicParams disabled.
- Keep output: export and unoptimized static images unless the hosting architecture intentionally changes.
- Keep provider-native values inside their adapter.
- Validate all untrusted Sanity responses before returning domain records.
- Keep reusable presentation UI in src/components/.
- Preserve current URLs and quote behavior unless the task explicitly changes them.
- Avoid broad rewrites and unnecessary dependencies.

## Content and schema conventions

Rental packages require:

- unique slug;
- name and approved category;
- description, best-for text, and event-size text;
- nonempty included-item and add-on arrays with nonblank entries;
- optional rental period;
- required featured state and nonnegative integer display order;
- required image asset and meaningful alt text.

FAQs require a nonblank question, answer, and nonnegative integer display order.

Repository results are deterministically ordered by display order with a text tie-breaker. Sanity collections must not be empty in Sanity mode. Publishing and unpublishing take effect only after a new successful static build.

When schemas or GROQ queries change:

1. Update the Studio schema and adapter/query code.
2. Run npm run cms:generate with Studio project/dataset variables.
3. Review sanity/schema.json and src/content/sanity/generated.ts.
4. Run npm run cms:check.
5. Do not deploy Studio or write dataset content unless the task explicitly authorizes it.

Do not edit generated schema or TypeGen output manually.

## UI and accessibility

- Use Tailwind utilities consistent with the existing app.
- Keep layouts responsive and mobile-readable.
- Use semantic HTML and accessible labels.
- Use meaningful image alt text from the resolved content contract.
- Keep action language direct and rental-focused.
- Preserve the existing visual design during content-source changes.

## Security and privacy

- Never commit secrets or real environment values.
- Never log or expose Sanity tokens, contact submissions, or customer details.
- Keep CMS access and quote customer information separate; quotes do not belong in Sanity.
- Treat SANITY_STUDIO_* values as public Studio identifiers, not secret storage.
- Keep fixture fallback explicit in production operations.
- Do not add external accounts, projects, datasets, CORS origins, webhooks, or deployments without authorization.

## Validation commands

Normal offline validation:

~~~powershell
npm.cmd run check
npm.cmd run build
~~~

CMS artifact validation when project and dataset identifiers are configured:

~~~powershell
npm.cmd run cms:check
npm.cmd run studio:build
~~~

A live Sanity-backed build additionally requires JA_CONTENT_SOURCE=sanity and readable published content. Normal tests must not require live Sanity access.

## Working style

For each task:

1. Inspect the working tree and relevant files before editing.
2. Preserve unrelated user changes.
3. Make the smallest coherent change that satisfies the request.
4. Keep the rental-first and static-export constraints intact.
5. Run proportionate validation.
6. Report files changed, behavior, commands run, unavailable live checks, and known limitations.

When blocked, state the exact missing information or failing command. Do not invent project IDs, dataset names, tokens, CORS origins, domains, or account settings.

## Definition of done

A task is done when:

- requested behavior is implemented;
- fixture-mode type checking, linting, tests, and static build pass, or failures are reported;
- CMS responses cannot leak provider-native fields into presentation code;
- package routes and quote package selection use the repository;
- no secret or server-only token appears in browser output;
- schema changes include reviewed extraction and TypeGen artifacts;
- user-facing copy and design remain rental-first and quote-first.
