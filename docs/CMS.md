# Sanity CMS setup

JA Event Production can build from checked-in fixtures or published Sanity content. The public site remains a static export in both modes: Sanity is contacted only while the Next.js build runs, and no CMS client or token is shipped for browser-side content fetching.

New to Sanity or content management? Work through the
[five-session JA Event Production crash course](SANITY-CRASH-COURSE.md) before
using this shorter operations guide.


## Requirements and ownership

- Node.js 22.12 or newer.
- A client-owned Sanity organization and project.
- Separate development and production datasets in that project.
- Named client administrators who own billing, editor access, exports, and account recovery.
- The project ID, dataset names, and dataset visibility decision.
- Editor invitations and roles.
- A read-only build token only when the selected dataset is private.
- Approved CORS origins for every location where Studio will run.

**SANITY_STUDIO_PROJECT_ID** and **SANITY_STUDIO_DATASET** are public identifiers required by Studio. **SANITY_READ_TOKEN** is an optional server/build secret. Never expose a read, Viewer, or write token through variables prefixed with NEXT_PUBLIC_ or SANITY_STUDIO_.

## Environment configuration

Copy .env.example to .env.local. Fixture mode is the safe default:

~~~dotenv
JA_CONTENT_SOURCE=fixture
~~~

To build from Sanity:

~~~dotenv
JA_CONTENT_SOURCE=sanity
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=development
SANITY_READ_TOKEN=
~~~

Leave **SANITY_READ_TOKEN** blank for a public dataset. Store a read-only token in the deployment environment for a private dataset. Production should set **SANITY_STUDIO_DATASET** to the approved production dataset; do not commit environment-specific values.

An unset or empty **JA_CONTENT_SOURCE** uses fixtures. An explicit **sanity** selection is strict: missing configuration, missing or unpublished page singletons, network errors, empty required collections, malformed documents, duplicate slugs, or invalid image alt text fail the build. Fixtures are never substituted after Sanity mode is selected.

## Local workflows

Install and verify the application without Sanity access:

~~~powershell
npm.cmd ci
npm.cmd run check
npm.cmd run build
~~~

Run the standalone Studio after configuring a real project and dataset:

~~~powershell
npm.cmd run studio:dev
~~~

Studio runs separately from Next.js, normally at http://localhost:3333, and always connects to the hosted Sanity Content Lake. It is not embedded in the exported public site.

Generate and verify schema/query types:

~~~powershell
npm.cmd run cms:generate
npm.cmd run cms:check
~~~

**cms:generate** extracts sanity/schema.json with required fields enforced, then regenerates src/content/sanity/generated.ts from the schema and named GROQ queries. **cms:check** repeats generation and fails when either committed artifact changes. Both commands require the Studio project ID and dataset variables, but they do not write content.

Build Studio locally without colliding with the website's dist/ hosting artifact:

~~~powershell
npm.cmd run studio:build
~~~

The Studio bundle is written to the ignored .sanity/studio-dist/ directory. No deploy command is included.

## Initial content migration

Migrate into the development dataset first. Create and publish six rentalPackage documents and eight faq documents using src/content/fixtures/data.ts as the source of truth. Then open each named page at the top of Studio Structure: Site Settings, Home Page, About Page, Packages Page, Quote Page, and FAQ Page.

Each fixed page document is created with the current fixture wording the first time it is opened. Review the wording, choose every required image, add meaningful alt text, and publish the page. The image fields are intentionally not prefilled. Site Settings requires the default social image; Home requires hero, process, and final call-to-action images; About requires its hero image. Page-level social images are optional and inherit the Site Settings default.

For packages:

1. Preserve each name, slug, category, description, best-for text, event-size text, included items, add-ons, rental period, featured state, and display order.
2. Upload the matching local image and enter the fixture's alt text:
   - Small Event Sound Package: public/brand/audio-console.jpg
   - Medium Event Sound Package: public/brand/uplighting-room.jpg
   - Large Event Sound Package: public/brand/stage-audio.jpg
   - Room Uplighting Upgrade: public/brand/uplighting-room.jpg
   - Live Band Support Upgrade: public/brand/stage-audio.jpg
   - Custom Event Quote: public/brand/outdoor-screen.jpg
3. Publish every document and run a Sanity-backed static build.
4. Compare all marketing pages, shared navigation/footer content, package output, quote selection, homepage merchandising, metadata, and FAQ output with fixture mode.
5. Repeat the approved content manually in production. There is intentionally no seed or automatic import command.

## Publishing behavior

The public adapter always queries the published perspective. Draft edits do not affect the public build.

Publishing does not update the current website immediately. A new static build is required. On the next successful build:

- newly published packages receive generated routes and quote options;
- updated content replaces the previous static content;
- an unpublished package loses its detail route and quote option;
- unpublished FAQs disappear;
- a dataset with no published packages or no published FAQs fails instead of exporting an incomplete site;
- any missing, unpublished, malformed, or image-incomplete page singleton fails the build.

Production should set **JA_CONTENT_SOURCE=sanity** explicitly. Switching a deployment back to **fixture** is a deliberate operational decision, not an automatic recovery path.

## Recovery and exports

The client-owned Sanity administrator is responsible for organization access, billing, dataset permissions, token rotation, exports, and recovery testing. Schedule dataset exports according to the client's recovery policy and store them outside the application repository. Fixtures preserve the launch content for offline development but are not a backup of later CMS edits or assets.

If Sanity is unavailable during a Sanity-selected build, keep the previously successful static deployment in place and investigate the configuration or service failure. Do not silently publish fixture content as though it were current CMS content.

## Website Preview in Studio

Studio includes a **Website Preview** tool next to Structure. It provides a
safe representation of the CMS-controlled customer journey without changing
the static public-site architecture:

- **Draft** shows saved drafts over their published versions and identifies
  new documents or unpublished changes.
- **Published** shows the content available to the next static build.
- Home, About, Packages, Package Detail, Quote, and FAQ views use the same page
  content, package ordering, and homepage merchandising rules as the website.
- Desktop and Mobile controls show the expected responsive layouts.
- **Edit package** and **Edit FAQ** return to the relevant Studio document.
- **Edit this page** opens the fixed singleton for the current page; shared
  header/footer content comes from Site Settings.
- Every page includes a compact resolved SEO summary, including Site Settings
  inheritance when a page override is empty.
- The quote form is representative only and cannot submit.

The Studio preview is intentionally tolerant of incomplete drafts and displays
missing-field guidance. The public build remains strict and can still reject
invalid published content. The preview reproduces the website's CMS-controlled
areas but is not the real Next.js frontend.

## Future Presentation and build automation

Full protected draft preview remains a later project. Do not implement it until
a dynamic preview host is selected. That phase should add:

1. a separate dynamic preview deployment using a server-only Viewer token and Sanity's drafts perspective;
2. authenticated Presentation access and Studio document locations;
3. a signed publish webhook that triggers a new static production build;
4. build-status visibility for editors.

No draft token, preview route, webhook, or permanent server runtime exists in this phase.

## Possible future extraction candidates

Nothing is extracted to CF Assets or a shared package yet. After a second compatible Next.js/Sanity consumer exists, compare and consider extracting only proven common mechanics:

- Sanity build-configuration validation;
- schema extraction and TypeGen scripts;
- response validation and provider-error translation;
- fixture/Sanity build-source selection;
- Sanity image resolution into provider-neutral image contracts.

JA-specific schemas, category values, copy, fixtures, and presentation behavior should remain site-owned.
