# JA Event Production Sanity Studio crash course

This five-session course teaches Sanity through the actual JA Event Production
package, FAQ, and fixed marketing-page workflow. It is written for the business owner who will edit
content and also wants enough technical understanding to diagnose how that
content reaches the static website.

The exercises use Sanity project `wisy67hf` and its public `development`
dataset. Production is deliberately out of bounds. No exercise deploys the
Studio, writes production content, adds preview mode, or creates a webhook.

You can stop after any checkpoint. To resume with Codex, say **Continue the
Sanity crash course at Session N**.

## The mental model you will use throughout

```text
You edit in Studio
        |
        v
The schema checks the content's shape
        |
        v
Content Lake stores drafts, published documents, and image assets
        |
        v
GROQ projects only the fields the website needs
        |
        v
The JA adapter validates and translates those fields
        |
        v
Next.js builds a static snapshot of the published packages and FAQs
        |
        v
Customers browse packages and request availability
```

Keep these six ideas separate:

1. **Studio is an editor.** It is a React application for people who manage
   content. It is not the customer website and it is not where quotes arrive.
2. **Schemas are rules in code.** They define the fields editors can fill in and
   the validation Studio should show.
3. **Content Lake is the hosted content database.** A dataset contains the
   documents and assets for one environment.
4. **GROQ is the read language.** Queries choose and reshape the content the
   application needs.
5. **The JA repository is a safety boundary.** It validates Sanity's response
   and returns only provider-neutral `RentalPackage` and `Faq` values.
6. **The website is a static snapshot.** Publishing in Studio does not change
   the currently deployed website. A successful Sanity-backed build must happen
   afterward.

## Course outcome

After all five sessions you should be able to:

- create, validate, publish, update, and unpublish rental packages and FAQs;
- explain which business information belongs in Sanity and which does not;
- understand how slugs, categories, featured state, ordering, images, and alt
  text affect the website;
- trace one document from Studio to a generated package route and quote option;
- run fixture, Studio, TypeGen, and Sanity-backed build checks;
- diagnose the most common configuration, validation, publishing, and build
  failures;
- rehearse the complete workflow in development without touching production;
- recognize the additional controls required before production activation.

## Safety rails

- Work only in the `development` dataset during this course.
- Do not create or edit documents in `production`.
- Do not paste tokens into this repository, screenshots, chat messages, issues,
  or browser code.
- Let Sanity assign ordinary document IDs. Use the visible slug field for the
  customer URL; do not invent IDs from slugs.
- Enter the package and FAQ content manually. This is intentional practice and
  prevents an automated seed from becoming an accidental production tool.
- Leave `JA_CONTENT_SOURCE` unset or set to `fixture` except during an explicit
  Sanity build lab.
- If a Sanity build fails, keep the last successful static site. Never silently
  replace selected Sanity content with fixtures.
- A publish or unpublish exercise is not complete until you rebuild and verify
  the customer-facing result.

## One-time local setup

### 1. Confirm the tools

From the repository root in PowerShell:

```powershell
node --version
npx.cmd sanity@latest debug
```

Node must be 22.12 or newer. The Sanity debug output should identify the account
that owns or can access project `wisy67hf`. Do not share authentication details
from the debug output.

### 2. Configure the public development identifiers

Add these lines to the existing untracked `.env.local` file. Preserve any
contact-form or site values already in that file.

```dotenv
SANITY_STUDIO_PROJECT_ID=wisy67hf
SANITY_STUDIO_DATASET=development
```

Do not add `SANITY_READ_TOKEN`: the development dataset is public. Do not put a
Sanity token in a `NEXT_PUBLIC_*` or `SANITY_STUDIO_*` variable. The two values
above are identifiers, not secrets.

Keep fixture mode as the default:

```dotenv
JA_CONTENT_SOURCE=fixture
```

You may also leave `JA_CONTENT_SOURCE` unset, which means the same thing. The
labs use a process-scoped override when they intentionally build from Sanity.

### 3. Start Studio

```powershell
npm.cmd run studio:dev
```

Open `http://localhost:3333`. Sign in with the Sanity account that has access to
the project. The page title should be **JA Event Production**, and the document
   navigation should show the six named website pages first, followed by
   **Rental Packages** and **FAQs**.

If the browser reports a CORS error, stop and add the exact Studio origin
`http://localhost:3333` in Sanity Manage under the project's API/CORS settings,
with credentials allowed. Treat approved origins as an owner-controlled access
list; do not add wildcard origins.

### Why this Studio can live in the application repository

Sanity recommends a standalone Studio beside the frontend for new projects.
This repository already has a standalone Studio operationally: `sanity dev` and
`sanity build` run it as a separate Vite application, and there is no Next.js
`/studio` route. It shares the repository root, package manifest, and lockfile
with the static site. That is acceptable for this small, tightly coupled
content model. Reconsider separate workspace folders only if the Studio gains a
different owner, deployment schedule, or multiple frontend consumers.

---

# Session 1 — Mental model, safety, and the Studio tour

**Time:** 45–60 minutes

**Goal:** Know what each Sanity part does and move around Studio confidently
without changing production.

## 1.1 Project versus dataset

The Sanity **project** is the client-owned container. For this course its ID is
`wisy67hf`. It holds account access, datasets, API settings, CORS origins, and
other project-level configuration.

A **dataset** is an isolated collection of documents and assets inside that
project:

- `development` is the practice and rehearsal environment;
- `production` is reserved for approved public content later.

Dataset names are not drafts and published states. Each dataset independently
contains both drafts and published documents.

## 1.2 Tour the interface

With Studio running, locate these areas:

1. **Document navigation:** lists Site Settings and five marketing pages first,
   followed by Rental Packages and FAQs.
2. **Document list:** shows preview cards built from package name/category/image
   or FAQ question/answer.
3. **Editor pane:** displays the schema-defined fields and validation markers.
4. **Document actions:** create, publish, discard edits, and access unpublish or
   delete actions where permitted.
5. **Ordering menu:** choose the configured display-order sorting.
6. **Status indicators:** distinguish a new draft, unpublished changes on a
   published document, and the currently published version.
7. **History or review changes:** inspect revisions when the feature is
   available for the project's plan and your role.

Do not create a document yet. Open both document types and inspect their empty
editors.

## 1.3 What belongs in Sanity

Sanity owns reusable customer-facing package and FAQ content:

| Business information | Why it belongs |
| --- | --- |
| Package name and description | Customers compare the rental offers. |
| Best-for and event-size guidance | Helps customers self-select. |
| Included items | Defines the package starting point. |
| Add-ons | Presents delivery, setup, lighting, subs, and technician options. |
| Package image and alt text | Supports visual merchandising and accessibility. |
| Featured state and display order | Controls homepage selection and browse order. |
| FAQ question and answer | Handles common objections before the quote request. |

## 1.4 What does not belong in Sanity

| Information | Correct home |
| --- | --- |
| Customer name, phone, email, event date, and notes | Hosted quote form and approved business follow-up tools. |
| Real-time gear availability or reservations | A future inventory/booking system, not this CMS. |
| Internal event plans, crew notes, or private contracts | An access-controlled operations system. |
| Checkout, payment, or customer accounts | Out of scope for the quote-first site. |
| API keys and read/write tokens | Server-only environment/secret management. |
| One-off verbal availability promises | Human quote follow-up, not permanent package copy. |

Quotes and customer information must stay separate from the public content
system.

## 1.5 Understand the code-managed schema

Studio's fields come from these source files:

- `sanity/schemaTypes/rentalPackage.ts`
- `sanity/schemaTypes/faq.ts`
- `sanity/schemaTypes/index.ts`

Only types registered in the exported `schemaTypes` array appear in Studio.
Changing a field label, validation rule, category choice, or content type is a
code change. Editing a package value is a content change.

## Session 1 checkpoint

Without looking back, explain:

1. Why Studio is not the website.
2. Why a draft and a development dataset are different concepts.
3. Why publishing does not immediately change the static website.
4. Why quotes and customer contact information stay outside Sanity.
5. Which task requires code: renaming a package, or adding a new schema field?

You are ready for Session 2 when those distinctions feel natural.

---

# Session 2 — Model a real rental offering

**Time:** 60–75 minutes

**Goal:** Create, validate, and publish one package and one FAQ while learning
what each field means to the business.

## 2.1 Create the Small Event Sound Package as a draft

Choose **Rental Package → Create** and enter the first fixture package from
`src/content/fixtures/data.ts`.

| Studio field | Value for this exercise |
| --- | --- |
| Name | Small Event Sound Package |
| Slug | Generate from the name; confirm `basic-sound-package-1` to preserve the existing URL |
| Category | Sound |
| Description | A compact announcement setup that is easy to transport and built for clear sound at smaller events. |
| Best for | Small meetings, birthday parties, cookouts, and private gatherings |
| Event size | 50-75 people |
| Rental period | Per day |
| Featured | On |
| Display order | 10 |

Add these **Included items** as separate array entries:

1. 2 high quality 2000 watt speakers
2. 2 speaker stands
3. 16 channel digital mixer
4. 2 wireless handheld microphones
5. Audio adapter, cabling, power, and 6 ft folding table

Add these **Add-ons** as separate entries:

1. Delivery and pickup
2. Setup and strike labor
3. Technical equipment operator
4. Basic subwoofer upgrade
5. Basic uplighting upgrade

Do not publish yet.

## 2.2 Learn the business meaning of every package field

### Name

Use a name a customer can compare quickly. Prefer “Small Event Sound Package”
over internal gear nicknames or generic “Audio Solution.”

### Slug

The slug becomes the durable URL segment and the package value carried into the
quote form. Changing it changes the generated route after the next build and
can break bookmarks or campaign links. Treat a published slug like a public
address: change it only with an intentional redirect or communications plan.

Sanity's slug editor can generate from the name and checks uniqueness. The JA
adapter checks duplicate slugs again during a build.

### Category

Choose only an approved category. Categories are controlled by code so typos do
not fragment browsing. A new category requires a schema/domain change, tests,
schema extraction, TypeGen, and a new schema deployment.

### Description, best for, and event size

These fields answer three different customer questions:

- **Description:** What is this package in plain language?
- **Best for:** Which event situations fit it?
- **Event size:** Is it roughly right-sized for my crowd or room?

Avoid guarantees when venue acoustics, outdoor conditions, or event programming
could change the answer. The quote remains the final sizing conversation.

### Included items versus add-ons

Included items define the reliable rental starting point. Add-ons expose useful
margin and support without making technician labor mandatory. Delivery, setup,
subs, uplighting, band support, and an operator should remain explicit options
unless the package genuinely cannot be offered without them.

### Featured and display order

Featured packages are eligible for the homepage's featured package selection.
Display order is merchandising priority: lower numbers appear first. Use gaps
such as 10, 20, and 30 so a future package can fit between existing items.

## 2.3 Upload and edit the image

Upload `public/brand/audio-console.jpg` to the package image field.

1. Open the image editor.
2. Move the hotspot to the important console area.
3. Try a crop, observe the preview, and keep a composition that works in both a
   wide card and detail-page image.
4. Enter this alt text: **Digital audio console used for an event sound system**.

Alt text communicates the image's useful visual information to someone who
cannot see it. Do not repeat “image of,” use a filename, stuff keywords, or
describe irrelevant decoration.

The image asset lives in Content Lake. The document stores an asset reference,
crop/hotspot metadata, and alt text. The website adapter resolves that into a
validated CDN URL plus plain alt text.

For future event video, do not upload production playback video as a generic
Sanity file asset. Use an adaptive video service such as Mux or an approved
YouTube/Vimeo embed and model only the appropriate reference.

## 2.4 Deliberately meet the validation rules

Before publishing, try each mistake one at a time and observe Studio's marker:

- clear the package name;
- remove every included item;
- add an empty array item;
- duplicate an included item;
- enter `-1` or `2.5` as display order;
- remove the image;
- clear the image alt text.

Restore the correct value after each experiment. Also try generating a slug
from the name, then set it back to the established
`basic-sound-package-1` value. Do not publish while any error marker remains.

Studio validation improves the editor experience. It is not the only defense:
the build adapter independently rejects malformed remote data.

## 2.5 Publish the package

Review the preview card, spelling, arrays, slug, image, alt text, featured state,
and order. Select **Publish**. The document now has a published version in the
development dataset, but the deployed customer website has not changed.

Make one harmless draft edit to the description without publishing it. Observe
that Studio distinguishes unpublished changes from the published version, then
discard the draft edit.

## 2.6 Create the first FAQ

Choose **FAQ → Create** and enter:

| Field | Value |
| --- | --- |
| Question | Do you offer delivery and setup? |
| Answer | Yes. Delivery, pickup, setup, strike, and stage hand support are available. Include your venue or city and access details so the right support can be included in your quote. |
| Display order | 10 |

Publish it. Then locate the unpublish action, read the confirmation, and cancel.
You will perform an actual unpublish exercise safely in Session 5.

## 2.7 Plain-language exercise

Rewrite this internal-style sentence before opening the suggested answer:

> Four powered tops, two subs, RF handhelds, and a 32-channel digital desk with
> stage I/O.

A customer-facing version could be:

> A larger sound package with subwoofers, wireless microphones, expanded
> mixing, and the coverage needed for bigger rooms or crowds.

Keep the detailed equipment list in Included items. Use the description to sell
fit and confidence, not to make customers decode an equipment manifest.

## Session 2 checkpoint

Confirm that development contains one published Rental Package and one
published FAQ. You should be able to explain why the slug, featured switch,
display order, hotspot, and alt text each matter independently.

---

# Session 3 - Editor workflow and complete development migration

**Time:** 60-75 minutes

**Goal:** Finish the manual development migration and establish a repeatable,
safe editorial routine.

## 3.1 Migrate the remaining packages

Use `src/content/fixtures/data.ts` as the source of truth for every value. Create
ordinary documents and let Sanity generate their internal IDs. Preserve these
identity, merchandising, and image choices:

| Order | Package | Slug | Category | Featured | Local image | Alt text |
| ---: | --- | --- | --- | :---: | --- | --- |
| 10 | Small Event Sound Package | `basic-sound-package-1` | Sound | Yes | `public/brand/audio-console.jpg` | Digital audio console used for an event sound system |
| 20 | Medium Event Sound Package | `basic-sound-package-2` | Sound | Yes | `public/brand/uplighting-room.jpg` | Event room illuminated with blue and amber uplighting |
| 30 | Large Event Sound Package | `basic-sound-package-3` | Sound | Yes | `public/brand/stage-audio.jpg` | Stage audio system set up for a live event |
| 40 | Room Uplighting Upgrade | `basic-uplighting-upgrade` | Lighting | Yes | `public/brand/uplighting-room.jpg` | Event room illuminated with blue and amber uplighting |
| 50 | Live Band Support Upgrade | `basic-band-upgrade` | Live Music | Yes | `public/brand/stage-audio.jpg` | Stage audio system set up for a live event |
| 60 | Custom Event Quote | `custom-event-quote` | Custom | Yes | `public/brand/outdoor-screen.jpg` | Outdoor event screen and production setup |

An image uploaded once becomes a reusable asset. Reusing the same asset for a
second document is fine; each document should still carry context-appropriate
alt text and its own crop/hotspot choices.

For each package:

1. Create the draft.
2. Copy every field from the fixture carefully.
3. Generate the slug, then compare it to the required existing slug.
4. Check that Included items and Add-ons are separate nonblank array entries.
5. Upload or select the correct image and confirm alt text.
6. Review featured state and display order.
7. Read the document once as a customer, not as an equipment technician.
8. Publish only when validation is clean.

## 3.2 Migrate the remaining FAQs

Create the full FAQ set from the fixture file:

| Order | Question |
| ---: | --- |
| 10 | Do you offer delivery and setup? |
| 20 | Can I rent gear without an on-site technician? |
| 30 | Can a technical equipment operator stay for the event? |
| 40 | What if I am not sure what package I need? |
| 50 | How far in advance should I request a quote? |
| 60 | Do packages include every possible upgrade? |
| 70 | What information should I include in a quote request? |
| 80 | Where do you serve? |

The service-area answer must say **North Georgia**. FAQs are plain text in this
slice. Use concise paragraphs; do not paste HTML or build an improvised page
builder in an answer field.

## 3.3 Practice the editor tools while migrating

During the migration, deliberately practice:

- searching the document list by part of a package name;
- switching to Display order sorting;
- dragging an array item, then restoring the fixture order;
- selecting an existing image asset instead of uploading a duplicate;
- reading a validation marker and navigating to the affected field;
- comparing the preview card before and after image/category changes;
- opening a published document, making a draft edit, and discarding it;
- checking history or review changes if your account plan exposes it.

Do not duplicate a document merely to save typing unless you also replace every
identity-bearing and customer-facing value. Copying the fixture field by field
is slower but safer for this first migration.

## 3.4 The everyday owner workflow

Use this sequence for normal package, FAQ, and marketing-page changes:

1. **Identify the customer question.** Decide whether the change clarifies a
   package, creates a new package, or answers an FAQ.
2. **Draft the edit.** Do not make schema or code changes for ordinary copy.
3. **Review the sales path.** Check fit guidance, inclusions, add-ons, slug,
   image, alt text, featured state, and display order.
4. **Publish in Studio.** Publishing updates Content Lake, not the static site.
5. **Run or request a Sanity-backed static build.** A failed build must not
   replace the last successful site.
6. **Verify like a customer.** Check the package page, package list, homepage,
   quote preselection, and relevant FAQ.

### Editing the fixed marketing pages

The named page entries are singletons: there is one Site Settings document and
one document for each customer-facing marketing page. Open the named entry from
Structure rather than using a generic Create menu. Duplicate and delete actions
are intentionally unavailable for these documents.

The first time each singleton is opened, Studio prefills the current fixture
wording. Images remain empty on purpose. Review the copy, select the required
images, enter meaningful alt text, and publish only when validation is clear.
Site Settings supplies shared business, header/footer, and default SEO content.
Page-specific search and social fields inherit from those defaults when left
empty. Advanced labels and SEO remain available in the collapsed Advanced
section; destinations, page layout, and quote-form behavior remain code-owned.

Use **Website Preview** to compare Draft and Published views for Home, About,
Packages, Package Detail, Quote, and FAQ. Each view offers **Edit this page** and
an SEO summary. The preview can show incomplete drafts; a Sanity-backed public
build rejects incomplete published singletons.

### Example: adding a technician option

If technician support is optional for a package, add it to Add-ons. If the
package cannot be delivered responsibly without an operator, clarify that in
Best for or Description and decide whether the included package definition must
change. Do not create a separate "service" document just because labor is
mentioned; this site remains package-led.

### Example: a new service request

Suppose customers start asking for projector-and-screen packages:

- If the existing package fields describe the offer, create a Rental Package.
- If a genuinely new field is required, such as screen dimensions, treat that
  as a schema and application design decision first.
- If it is a one-off request, handle it through Custom Event Quote rather than
  publishing a weak permanent package.

## 3.5 Slug changes, unpublishing, and deletion

- **Edit copy** when the offering is the same and the URL should remain stable.
- **Unpublish** when an offering should disappear from the next site build but
  may return. Its route and quote option disappear after that build.
- **Delete** only when the document is truly disposable and recovery has been
  considered. Prefer unpublishing for normal operational pauses.
- **Change a slug** only with a URL/redirect plan. Static export cannot preserve
  the old route automatically.

The checked-in fixtures are a stable offline source for the launch content.
They do not capture later Studio edits, uploaded assets, history, or production
state and therefore are not a Sanity backup.

## 3.6 Access, CORS, exports, and recovery

The business owner should know who controls:

- Sanity organization and project ownership;
- billing and plan changes;
- administrator and editor invitations;
- dataset visibility and access roles;
- allowed Studio/application CORS origins;
- read-token creation and rotation if a dataset later becomes private;
- recurring exports and tested recovery.

Give editors the least access needed. Remove access when a collaborator no
longer works on the site. Never share an owner account or a personal token.

Exports should be stored outside this repository according to a written
recovery schedule. An export is a recovery artifact, not a substitute for
reviewed schemas and source control.

## Session 3 checkpoint

Development should now contain exactly six published Rental Packages and eight
published FAQs. Sort both lists by Display order and compare every preview and
field against `src/content/fixtures/data.ts` before continuing.

---

# Session 4 - Follow content through the code

**Time:** 60-75 minutes

**Goal:** Understand the complete technical path and learn what each validation
command proves.

## 4.1 Trace the Small Event Sound Package

Follow `basic-sound-package-1` through these layers in order:

1. **Studio schema** - `sanity/schemaTypes/rentalPackage.ts` defines the editor,
   approved category list, array rules, ordering, preview, image hotspot, and
   required alt text.
2. **Schema registration** - `sanity/schemaTypes/index.ts` makes Rental Package
   and FAQ real Studio document types.
3. **GROQ projection** - `src/content/sanity/queries.ts` selects only fields the
   presentation requires. It projects `slug.current` to a plain slug and
   includes the image reference/crop/hotspot needed for URL resolution.
4. **Generated query types** - `src/content/sanity/generated.ts` is produced by
   Sanity TypeGen from the extracted schema and named queries. Do not edit it by
   hand.
5. **Runtime mapper** - `src/content/sanity/mapper.ts` validates remote data,
   rejects invalid collections and duplicate slugs, resolves the image URL,
   trims values, sorts deterministically, and removes provider-native fields.
6. **Repository adapter** - `src/content/sanity/repository.ts` caches collection
   reads and translates Sanity fetch failures into repository errors.
7. **Source selection** - `src/content/repository.ts` selects fixtures or Sanity
   from `JA_CONTENT_SOURCE` and exposes only three asynchronous operations.
8. **Static routes** - `src/app/packages/[slug]/page.tsx` gets all slugs through
   `generateStaticParams`, disables unknown dynamic params, and looks up the
   package through the repository.
9. **Presentation** - the homepage, package index/detail, FAQ page, and quote
   page receive provider-neutral domain values. The quote client gets only
   `{slug, name}` choices.

By the time React renders the package, `_id`, asset references, crop objects,
draft metadata, and Sanity error classes are gone.

## 4.2 Understand the three content operations

The public repository deliberately exposes only:

```typescript
getRentalPackages(): Promise<RentalPackage[]>
getRentalPackage(slug: string): Promise<RentalPackage | null>
getFaqs(): Promise<Faq[]>
```

Pages do not know whether those values came from fixtures or Sanity. They also
cannot perform writes. This keeps Studio/content concerns out of presentation
components and keeps customer browsers away from build credentials.

## 4.3 Fixture versus Sanity mode

| `JA_CONTENT_SOURCE` | Behavior |
| --- | --- |
| unset, empty, or `fixture` | Uses checked-in content; no CMS or network needed. |
| `sanity` | Uses only published content from the configured dataset. |
| anything else | Fails with a configuration error. |

Sanity mode never falls back to fixtures after a configuration, fetch, empty
collection, or content-validation failure. That strictness prevents an outage
from silently publishing stale launch copy as if it were current CMS content.

## 4.4 Run the offline safety checks

Make sure `JA_CONTENT_SOURCE` is `fixture` or unset, then run:

```powershell
npm.cmd run check
npm.cmd run build
```

`check` performs TypeScript checking, ESLint, and focused Vitest tests. The
fixture build proves normal development and CI remain independent of Sanity.

Look at the content-layer test output. The suite covers fixture completeness,
ordering, slug lookup, malformed arrays, invalid categories/orders, missing
images or alt text, duplicate slugs, empty collections, fetch errors, and
source selection. These tests are safe places to study failures; do not corrupt
the live dataset to demonstrate every adapter error.

## 4.5 Run schema and TypeGen checks

With the two public Sanity identifiers in `.env.local`:

```powershell
npm.cmd run cms:check
npm.cmd run studio:build
```

`cms:check` extracts the registered schema with required fields enforced,
regenerates types from named GROQ queries, and fails if committed artifacts
drift. Review generated diffs after intentional source changes; never hand-edit
generated artifacts.

`studio:build` compiles the standalone Studio into the ignored
`.sanity/studio-dist/` directory without overwriting the public hosting output.

After an intentional schema/query change:

1. edit source;
2. run `npm.cmd run cms:generate`;
3. review schema and generated-type changes;
4. run `npm.cmd run cms:check` and normal checks;
5. deploy the reviewed schema to development;
6. rehearse development content;
7. obtain separate approval for production.

## 4.6 Why this phase does not use live content

Sanity supports Live Content, Presentation/Visual Editing, draft mode, and
webhook-driven invalidation. This site exports static files and has no permanent
Next.js server. The adapter reads fresh published content only during a build,
generates every package route, and ships no CMS client or token to the browser.

This matches occasional, human-reviewed package/FAQ changes: a complete build
must succeed before the public snapshot changes. Protected preview and
publish-triggered builds are later phases, not missing editor steps.

## Session 4 checkpoint

Point to the exact file responsible for Studio validation, GROQ selection,
TypeGen output, runtime validation, source selection, static slug generation,
and quote options. Explain why Studio-valid content can still fail a strict
application build.

---

# Session 5 - End-to-end publishing rehearsal

**Time:** 60-75 minutes

**Goal:** Rehearse the full development workflow, including unpublishing and
recovery, without touching production.

## 5.1 Build from published development content

Confirm all six packages and eight FAQs are published. In a fresh PowerShell
session with `.env.local` configured:

```powershell
$env:JA_CONTENT_SOURCE = "sanity"
npm.cmd run build
Remove-Item Env:JA_CONTENT_SOURCE
```

The build must succeed. If it fails, do not switch to fixtures to hide the
problem. Diagnose the reported configuration, fetch, or validation error.

## 5.2 Verify the generated customer journey

```powershell
$slugs = @(
  "basic-sound-package-1",
  "basic-sound-package-2",
  "basic-sound-package-3",
  "basic-uplighting-upgrade",
  "basic-band-upgrade",
  "custom-event-quote"
)

$slugs | ForEach-Object {
  Test-Path -LiteralPath "out/packages/$_/index.html"
}
```

Every line should be `True`. Verify:

- six package cards appear in display order;
- homepage filtering and featured limit are unchanged;
- Sanity image URLs and meaningful alt text render on cards/detail pages;
- every package URL uses its established slug;
- the quote form lists all six `{slug, name}` choices;
- `/quote/?package=basic-sound-package-1` preselects the small package;
- all eight FAQs appear in display order;
- delivery, setup, and technician support remain optional add-ons.

## 5.3 Unpublish, rebuild, and republish

Use **Room Uplighting Upgrade** (`basic-uplighting-upgrade`) in development:

1. Unpublish it in Studio; do not delete it.
2. Run the Sanity-backed build again.
3. Confirm `out/packages/basic-uplighting-upgrade/index.html` is absent.
4. Confirm it is absent from package browsing and quote choices.
5. Republish the same document.
6. Rebuild.
7. Confirm the route and quote option return in display order.

This proves that a Studio action changes Content Lake, while a later successful
build changes the static snapshot. Leave development restored to six published
packages and eight published FAQs.

## 5.4 Work the failure scenarios

| Scenario | Correct response |
| --- | --- |
| Missing project/dataset identifier | Restore the public environment value; do not hard-code it in presentation code. |
| Empty published package or FAQ collection | Check dataset selection and publication state; do not ship an incomplete build. |
| Invalid package content | Follow Studio/build validation, fix, publish, and rerun the full build. |
| Sanity unavailable | Keep the last successful static deployment and investigate; never auto-fallback. |
| Fixture copy appears unexpectedly | Check `JA_CONTENT_SOURCE`; Sanity operations must select `sanity` explicitly. |
| Published edit is not on the site | Run and deploy a new successful static build. |
| Package route is missing | Check publication state, slug, validation, and generated route output. |

## 5.5 Production-readiness gate

Do not repeat the migration in production until:

- [ ] The owner and backup administrator can access the project.
- [ ] Editor invitations and roles follow least privilege.
- [ ] Production visibility and approved CORS origins are recorded.
- [ ] All package/FAQ copy, slugs, images, crops, and alt text are approved.
- [ ] An export/recovery owner and off-repository storage location are named.
- [ ] Production build variables are managed without exposing a token.
- [ ] Any private-dataset token is read-only, server-only, and rotatable.
- [ ] A failed build cannot replace the last successful static deployment.
- [ ] Production migration and activation receive separate explicit approval.

## 5.6 Future feature map

Later phases may add:

1. protected dynamic draft preview with a server-only Viewer token;
2. Presentation/Visual Editing for click-to-edit navigation;
3. a signed publish webhook that requests a static production build;
4. build-status visibility for editors;
5. scheduled publishing after plan and build-trigger behavior are evaluated;
6. designed trust-content consumers for testimonials, real-event case studies,
   brands carried, and richer service-area content.

These are architecture projects, not switches to enable during this course.

## Session 5 checkpoint

The rehearsal is complete when development is restored to six published
packages/eight FAQs, the Sanity-backed build passes, all routes/options are
correct, you can explain publish  build  verify, and production remains empty.

---

# Owner reference

## Where does this change belong?

| Requested change | Studio | Code/schema | Another system |
| --- | :---: | :---: | :---: |
| Correct package wording or an included item | Yes | No | No |
| Add a package using existing fields | Yes | No | No |
| Reorder/feature packages or replace an image | Yes | No | No |
| Add or edit an FAQ | Yes | No | No |
| Add a package category or schema field | No | Yes | No |
| Change marketing wording, CTA label, or SEO | Yes | No | No |
| Change page layout, CTA destination, or card behavior | No | Yes | No |
| Change hosted quote-form behavior | No | Yes/config | Form provider |
| Store customer/event details | No | No | Approved lead workflow |
| Reserve equipment or calculate availability | No | No | Future inventory system |
| Process payment | No | No | Future payment system |
| Store private crew notes | No | No | Private operations tool |

## Package field-quality checklist

- [ ] Name is clear to a nontechnical customer.
- [ ] Existing slug is preserved unless a URL change is intentional.
- [ ] Category is the closest approved customer-facing category.
- [ ] Description explains the offer instead of repeating the gear list.
- [ ] Best for and Event size guide without unsupported guarantees.
- [ ] Included items and Add-ons are complete, nonblank, and nonduplicated.
- [ ] Delivery, setup, lighting, subs, band gear, and operator options are clear.
- [ ] Featured state and display order are intentional.
- [ ] Image is approved, cropped well, and has a useful hotspot.
- [ ] Alt text conveys useful visual information.
- [ ] Technician support is optional unless the package truly requires it.
- [ ] The Request Availability path remains clear.

## FAQ field-quality checklist

- [ ] The question uses customer language.
- [ ] The answer is direct, accurate, and scannable.
- [ ] It invites a quote when venue/date details determine the answer.
- [ ] It does not promise live availability or expose private information.
- [ ] Display order puts important objections first.

## Command cheat sheet

Run from the repository root in PowerShell.

| Purpose | Command |
| --- | --- |
| Start customer site | `npm.cmd run dev` |
| Start standalone Studio | `npm.cmd run studio:dev` |
| Typecheck, lint, and test offline | `npm.cmd run check` |
| Fixture-backed static build | `npm.cmd run build` with source unset/fixture |
| Regenerate schema and query types | `npm.cmd run cms:generate` |
| Detect schema/TypeGen drift | `npm.cmd run cms:check` |
| Build Studio locally | `npm.cmd run studio:build` |
| Inspect Sanity authentication | `npx.cmd sanity@latest debug` |
| List datasets | `npx.cmd sanity@latest datasets list --project-id wisy67hf` |
| Open Sanity Manage | `npx.cmd sanity manage` |

No production deploy, automatic import, or seed command is provided.

## Troubleshooting matrix

| Symptom | Likely cause | Safe response |
| --- | --- | --- |
| Missing public identifier | `.env.local` is incomplete | Add `wisy67hf`/`development`, restart Studio. |
| Studio shows wrong dataset | Dataset variable is wrong | Stop before editing; select `development` and restart. |
| Browser CORS/403 | Local origin is not approved | Add only the exact trusted origin in Sanity Manage. |
| Build 401 | Private dataset or bad token | Confirm visibility; use a server-only read token only if needed. |
| No packages/FAQs | Wrong dataset or drafts only | Select development and publish required documents. |
| Studio accepts but build rejects | Adapter has stricter collection rules | Follow the repository error, fix, republish, rebuild. |
| Duplicate slug | Two packages resolve to one route | Restore a unique established slug. |
| Image error | Missing asset/alt or malformed reference | Select the asset and enter meaningful alt text. |
| Published copy looks old | Static site was not rebuilt | Run a fresh Sanity-backed build and verify it. |
| Fixture content appears | Fixture source is selected | Use explicit `sanity` only for the intended build. |
| `cms:check` differs | Generated artifacts drifted | Review source, regenerate, and commit intentional artifacts. |

## Glossary

**API version:** pinned date that makes query behavior predictable; this app
uses `2026-08-24`.

**Asset:** uploaded image/file stored by Sanity and referenced by documents.

**Content Lake:** Sanity's hosted document and asset storage/query service.

**CORS origin:** trusted browser origin allowed to contact project APIs.

**Dataset:** isolated documents/assets inside a project, such as development.

**Document:** structured content record, such as a Rental Package or FAQ.

**Draft:** unpublished changes excluded from this site's published build.

**GROQ:** query language for filtering, ordering, and projecting documents.

**Hotspot/crop:** metadata identifying important image regions and framing.

**Perspective:** requested content view; public builds use `published`.

**Project:** container for datasets, members, API settings, and billing.

**Published document:** version available to published queries; customers see it
only after a successful static build is deployed.

**Repository adapter:** server-only fetch/validation/mapping/error boundary.

**Schema:** code declaring document types, fields, controls, and validation.

**Slug:** stable URL-safe package identifier.

**Studio:** authenticated editing application for Content Lake documents.

**TypeGen:** TypeScript types generated from schema and named GROQ queries.

## Official references

- [Install and initialize Studio](https://www.sanity.io/docs/studio/installation)
- [Studio project structure](https://www.sanity.io/docs/studio/project-structure)
- [Datasets CLI](https://www.sanity.io/docs/cli-reference/cli-datasets)
- [Documents CLI](https://www.sanity.io/docs/cli-reference/documents)
- [Schemas and TypeGen](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen)
- [Published perspective](https://www.sanity.io/docs/apis-and-sdks/js-client-querying)
- [Studio deployment choices](https://www.sanity.io/docs/studio/deployment)

For short operational setup, migration, recovery, and future-preview notes, see
[CMS.md](CMS.md).
