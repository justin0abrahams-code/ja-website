# Sanity CMS setup

JA Event Production can build from checked-in fixtures or published Sanity content. The public site remains a static export in both modes: Sanity is contacted only while the Next.js build runs, and no CMS client or token is shipped for browser-side content fetching.

## Updating Sanity after removing lighting

Local fixtures and Studio defaults now lead with sound and event production.
Existing Sanity documents do not inherit changes to defaults. Apply these edits
in the existing Studio's **development** dataset, preserving your business name
and other custom wording.

| Studio document | Changes to make |
| --- | --- |
| Site Settings | Under Advanced labels and SEO, remove lighting from the default title and description. Replace any social image containing lighting text or room uplighting with audio-console.jpg and accurate alternative text. |
| Home Page | Remove Room Uplighting from Upgrades. Remove uplighting from process steps and the Weddings and Parties description. Remove lighting from the hero heading/caption and SEO overrides. Replace a room-uplighting hero image with audio-console.jpg. |
| About Page | Remove lighting from the introduction and uplighting from support options. Check SEO and social-image overrides. |
| Gallery Page | Use heading “Sound and event setups” and description “Take a closer look at audio equipment and event production setups.” Remove the Room uplighting photo and lighting from the SEO description. Capacity remains ten photos. |
| Quote Page | Change the SEO description to offer a sound rental quote. |
| FAQs | Remove uplighting from the equipment/add-ons answer. Check FAQ Page SEO overrides too. |

1. Open [the existing Studio](https://ja-event-production-dev.sanity.studio/), edit
   the documents above, and review them in Website Preview. Check captions,
   alternative text, and SEO overrides for any custom lighting references.
2. Click **Publish** on each edited document. Package documents remain paused;
   retain their preserved content and the old image assets.
3. In PowerShell at the repository root, build from published CMS content:

   ~~~powershell
   $env:JA_CONTENT_SOURCE = 'sanity'
   npm.cmd run build
   ~~~

4. Review the export and deploy it through the existing website hosting workflow.
   Publishing in Sanity alone does not update this static website.
5. To refresh Studio's initial values and preview defaults as well, run:

   ~~~powershell
   npm.cmd run studio:build
   node node_modules/sanity/bin/sanity deploy .sanity/studio-dist --no-build --url ja-event-production-dev
   ~~~

   This updates Studio, not its stored content. No schema migration or TypeGen
   change is required for this copy-only update.

Afterward, use `$env:JA_CONTENT_SOURCE = 'fixture'` for offline checks. Do not
rerun the gallery setup script to update existing content: it preserves a gallery
that already exists.

## Photo gallery

The `/gallery/` page holds up to **10 photos**. In Studio, open **Gallery Page**
to upload or select images, add required alternative text and optional captions,
and drag photos into the desired order. The Website Preview includes Gallery in
both draft and published views. An empty gallery shows “Photos are coming soon.”

The initial gallery uses three existing audio/event photos, leaving room for seven
more. Gallery navigation labels live in Site Settings. Publish content, then run
a fresh Sanity-backed static build and deploy the website for changes to appear.

For an existing dataset, `node scripts/add-gallery-cms.mjs` previews the scoped
setup; `--apply` creates the missing gallery and adds missing navigation labels.
It uses existing image assets, keeps current documents and drafts, and stores a
backup under ignored `.sanity/gallery/`. Use `--empty` for a gallery without
initial photos. Schema and TypeGen artifacts must also be regenerated.

## Temporary package pause

`PACKAGES_ENABLED` in `src/features.ts` is currently false. The package index and
detail code live in `src/app/_packages/`; Next.js excludes that private folder
from routing, so old package URLs return 404 after the static site is rebuilt
and deployed. The homepage, navigation, quote form, and Studio Website Preview
omit packages. Quote submissions ignore old `?package=` parameters and omit the
package field in both hosted-form submissions and prepared email messages.

Studio retains the schemas and all existing package documents, but hides the
package menus, creation options, and dormant marketing fields. Package documents
are read-only and have no document actions. Hidden fields are not required for
publishing active pages. The published site mapper ignores dormant package data;
active page and FAQ validation remains strict, with no fixture fallback.

`npm run build` clears Next.js's generated fetch-response cache before building
so published CMS edits cannot be masked by content from an earlier static build.
Compilation caches and request deduplication within a build remain available.

The scoped migration is `node scripts/pause-packages-cms.mjs` (dry run). It uses
the configured project/dataset and existing Sanity CLI login. Review its exact
edits, then run it with `--apply` to patch only matching marketing/FAQ phrases.
It preserves revisions with conditional patches and writes a before-snapshot
under ignored `.sanity/package-pause/`. It also creates the FAQ Page singleton
from the updated wording if no FAQ Page document exists. It never deletes or
unpublishes packages or publishes unrelated drafts.

To restore packages when requested: restore the `src/app/packages/` folder name,
set the flag to true, review package wording and package-led customer paths,
regenerate schema/TypeGen artifacts, then validate and deploy Studio and the
static site. Merely publishing a package while paused cannot restore a route.
The initial package-migration guidance below is retained for that future work.

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

- packages remain inactive while the package pause is enabled;
- updated content replaces the previous static content;
- unpublished FAQs disappear;
- a dataset with no published FAQs fails instead of exporting an incomplete site;
- any missing, unpublished, malformed, or image-incomplete active page singleton fails the build;
- once packages are restored, published packages again receive routes and quote options, unpublishing removes those routes/options, and an empty package collection fails the build.

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
- Home, About, Quote, and FAQ views show the active website content. Package
  views and merchandising remain preserved in code for restoration.
- Desktop and Mobile controls show the expected responsive layouts.
- **Edit FAQ** returns to the relevant Studio document.
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
