import { PACKAGES_ENABLED } from "../../src/features";
import createImageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { type ChangeEvent, type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";
import { type PreviewContent, type PreviewDocumentStatus, type PreviewPackage, type PreviewPerspective, normalizePreviewContent, resolveQuotePackageSlug, selectPreviewHomepagePackages } from "./model";
import type { PreviewSingletonKey, PreviewSingletonType } from "./siteModel";
import styles from "./WebsitePreviewTool.module.css";

const API_VERSION = "2026-08-24";
const CONTENT_QUERY = `{
  "packages": select($packagesEnabled => *[_type == "rentalPackage" && !(_id in path("versions.**"))] | order(displayOrder asc, name asc), []),
  "faqs": *[_type == "faq" && !(_id in path("versions.**"))] | order(displayOrder asc, question asc),
  "site": {
    "settings": *[_id == "siteSettings" && _type == "siteSettings"][0], "home": *[_id == "homePage" && _type == "homePage"][0],
    "about": *[_id == "aboutPage" && _type == "aboutPage"][0], "packages": select($packagesEnabled => *[_id == "packagesPage" && _type == "packagesPage"][0], null),
    "gallery": *[_id == "galleryPage" && _type == "galleryPage"][0],
    "quote": *[_id == "quotePage" && _type == "quotePage"][0], "faq": *[_id == "faqPage" && _type == "faqPage"][0]
  }
}`;
const ALL_TYPES = ["rentalPackage", "faq", "siteSettings", "homePage", "aboutPage", "packagesPage", "quotePage", "faqPage", "galleryPage"].filter((type) => PACKAGES_ENABLED || !["rentalPackage", "packagesPage"].includes(type));
const STATUS_QUERY = `{ "draftIds": *[_type in ${JSON.stringify(ALL_TYPES)} && _id in path("drafts.**")]._id, "publishedIds": *[_type in ${JSON.stringify(ALL_TYPES)} && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]._id }`;
const LISTEN_QUERY = `*[_type in ${JSON.stringify(ALL_TYPES)}]`;

type PreviewPage = "home" | "about" | "packages" | "detail" | "quote" | "faq" | "gallery";
type PreviewViewport = "desktop" | "mobile";
interface PreviewState { content: PreviewContent; error?: string; loading: boolean; lastUpdated?: Date; }
interface SitePreviewProps {
  content: PreviewContent; getImageUrl: (source: Record<string, unknown> | null, width: number, height: number) => string | undefined;
  onNavigate: (page: PreviewPage) => void; onOpenPackage: (pkg: PreviewPackage) => void; onQuotePackage: (pkg: PreviewPackage) => void;
  onQuoteSelectionChange: (slug: string) => void; page: PreviewPage; perspective: PreviewPerspective;
  selectedPackage?: PreviewPackage; selectedQuoteSlug: string; viewport: PreviewViewport;
}
const EMPTY_CONTENT = normalizePreviewContent({}, {});

function usePreviewContent(perspective: PreviewPerspective) {
  const studioClient = useClient({ apiVersion: API_VERSION });
  const rawClient = useMemo(() => studioClient.withConfig({ perspective: "raw", useCdn: false }), [studioClient]);
  const perspectiveClient = useMemo(() => studioClient.withConfig({ perspective, useCdn: false }), [perspective, studioClient]);
  const requestId = useRef(0);
  const [state, setState] = useState<PreviewState>({ content: EMPTY_CONTENT, loading: true });
  const refresh = useCallback(async (showLoading = false) => {
    const currentRequestId = ++requestId.current;
    if (showLoading) setState((current) => ({ ...current, error: undefined, loading: true }));
    try {
      const [input, statusResult] = await Promise.all([perspectiveClient.fetch(CONTENT_QUERY, { packagesEnabled: PACKAGES_ENABLED }), rawClient.fetch(STATUS_QUERY)]);
      if (requestId.current === currentRequestId) setState({ content: normalizePreviewContent(input, statusResult), loading: false, lastUpdated: new Date() });
    } catch (cause) {
      if (requestId.current === currentRequestId) setState((current) => ({ ...current, error: cause instanceof Error ? cause.message : "Unable to load the website preview.", loading: false }));
    }
  }, [perspectiveClient, rawClient]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    void refresh(true);
    const subscription = rawClient.listen(LISTEN_QUERY, {}, { includeResult: false, visibility: "query" }).subscribe({
      next: () => { clearTimeout(timer); timer = setTimeout(() => void refresh(), 200); },
      error: (cause) => setState((current) => ({ ...current, error: cause instanceof Error ? cause.message : "Live preview updates were interrupted." })),
    });
    return () => { requestId.current += 1; clearTimeout(timer); subscription.unsubscribe(); };
  }, [rawClient, refresh]);
  return { ...state, refresh: () => refresh(true), studioClient };
}

function StatusBadge({ perspective, status }: { perspective: PreviewPerspective; status: PreviewDocumentStatus }) {
  if (perspective === "published") return null;
  const label = status === "new" ? "Not yet public" : status === "changed" ? "Unpublished changes" : "Published";
  return <span className={styles.statusBadge} data-status={status}>{label}</span>;
}
function Issues({ issues }: { issues: string[] }) { return issues.length ? <div className={styles.issues} role="status"><strong>Finish in Studio:</strong> {issues.join(" � ")}</div> : null; }
function EditDocumentLink({ id, label, type }: { id: string; label: string; type: "rentalPackage" | "faq" | PreviewSingletonType }) {
  return <IntentLink className={styles.editLink} intent="edit" params={{ id, type }}>{label}</IntentLink>;
}
function PreviewImage({ alt, className, getImageUrl, height, source, width }: { alt: string; className: string; getImageUrl: SitePreviewProps["getImageUrl"]; height: number; source: Record<string, unknown> | null; width: number }) {
  const src = getImageUrl(source, width, height);
  return src ? (
    // This image is rendered inside standalone Sanity Studio, not the Next.js application.
    // eslint-disable-next-line @next/next/no-img-element
    <img className={className} src={src} alt={alt} />
  ) : <div className={`${className} ${styles.imagePlaceholder}`}>Choose an image in Studio</div>;
}
function PackageCardPreview({ getImageUrl, onOpenPackage, onQuotePackage, perspective, pkg, labels }: Pick<SitePreviewProps, "getImageUrl" | "onOpenPackage" | "onQuotePackage" | "perspective"> & { pkg: PreviewPackage; labels: NonNullable<PreviewContent["site"]["content"]["packages"]>["labels"] }) {
  return <article className={styles.packageCard}>
    <PreviewImage alt={pkg.imageAlt} className={styles.cardImage} getImageUrl={getImageUrl} height={450} source={pkg.image} width={800} />
    <div className={styles.cardBody}><div className={styles.badgeRow}><span className={styles.categoryBadge}>{pkg.category}</span><StatusBadge perspective={perspective} status={pkg.status} /></div>
      <h3>{pkg.name}</h3><p className={styles.description}>{pkg.description}</p>
      <dl className={styles.quickFacts}><div><dt>{labels.bestFor}</dt><dd>{pkg.bestFor}</dd></div><div><dt>{labels.eventSize}</dt><dd>{pkg.eventSize}</dd></div>{pkg.rentalPeriod ? <div><dt>{labels.rentalPeriod}</dt><dd>{pkg.rentalPeriod}</dd></div> : null}</dl>
      <div className={styles.includesPreview}><strong>{labels.includes}</strong>{pkg.includes.length ? <ul>{pkg.includes.slice(0, 4).map((item, index) => <li key={`${pkg.id}-included-${index}`}>{item}</li>)}</ul> : <p className={styles.placeholderText}>Add included items in Studio.</p>}</div>
      <Issues issues={pkg.issues} /><div className={styles.cardActions}><button type="button" onClick={() => onQuotePackage(pkg)}>{labels.cardAvailability}</button><button className={styles.secondaryButton} type="button" onClick={() => onOpenPackage(pkg)}>{labels.cardDetails}</button><EditDocumentLink id={pkg.id} label="Edit package" type="rentalPackage" /></div>
    </div>
  </article>;
}
function EmptyPreview({ children }: { children: string }) { return <div className={styles.emptyPreview}>{children}</div>; }

function HomePreview(props: SitePreviewProps) {
  const page = props.content.site.content.home; const labels = props.content.site.content.packages?.labels;
  const featured = selectPreviewHomepagePackages(props.content.packages);
  return <>
    <section className={styles.hero}><div><p className={styles.eyebrow}>{page.hero.eyebrow}</p><h1>{page.hero.heading}</h1><p className={styles.tagline}>{page.hero.tagline}</p><p className={styles.heroCopy}>{page.hero.description}</p><div className={styles.heroActions}>{PACKAGES_ENABLED ? <button type="button" onClick={() => props.onNavigate("packages")}>{page.hero.primaryLabel}</button> : null}<button type="button" onClick={() => props.onNavigate("quote")}>{page.hero.secondaryLabel}</button></div></div><PreviewImage alt={page.hero.image.alt} className={styles.heroVisual} getImageUrl={props.getImageUrl} height={700} source={props.content.site.images.homeHero} width={900} /></section>
    <section className={styles.contextSection}><div className={styles.contextGrid}>{page.proofPoints.map((item) => <div key={item.key}><strong>{item.text}</strong></div>)}</div></section>
    {PACKAGES_ENABLED && page.featuredPackages && labels ? <section className={styles.siteSection}><div className={styles.sectionHeading}><div><p className={styles.eyebrowDark}>{page.featuredPackages.eyebrow}</p><h2>{page.featuredPackages.heading}</h2><p>{page.featuredPackages.description}</p></div><button className={styles.textButton} type="button" onClick={() => props.onNavigate("packages")}>{page.featuredPackages.linkLabel}</button></div>{featured.length ? <div className={styles.packageGrid}>{featured.map((pkg) => <PackageCardPreview key={pkg.id} {...props} labels={labels} pkg={pkg} />)}</div> : <EmptyPreview>No featured Sound packages appear on the homepage in this view.</EmptyPreview>}</section> : null}
    <section className={styles.contextSection}><p className={styles.eyebrowDark}>{page.upgrades.eyebrow}</p><h2>{page.upgrades.heading}</h2><p>{page.upgrades.description}</p><div className={styles.contextGrid}>{page.upgrades.items.map((item) => <div key={item.key}><strong>{item.title}</strong><p>{item.description}</p></div>)}</div></section>
    <section className={styles.siteSection}><div className={styles.sectionHeading}><PreviewImage alt={page.process.image.alt} className={styles.marketingImage} getImageUrl={props.getImageUrl} height={600} source={props.content.site.images.homeProcess} width={800} /><div><p className={styles.eyebrowDark}>{page.process.eyebrow}</p><h2>{page.process.heading}</h2><p>{page.process.description}</p><ol>{page.process.steps.map((step) => <li key={step.key}>{step.text}</li>)}</ol></div></div></section>
    <section className={styles.contextSection}><p className={styles.eyebrowDark}>{page.eventTypes.eyebrow}</p><h2>{page.eventTypes.heading}</h2><div className={styles.contextGrid}>{page.eventTypes.items.map((item) => <div key={item.key}><strong>{item.title}</strong><p>{item.description}</p></div>)}</div></section>
    <section className={styles.siteSection}><div className={styles.ctaSection}><div><p className={styles.eyebrow}>{page.cta.eyebrow}</p><h2>{page.cta.heading}</h2><p>{page.cta.description}</p></div><PreviewImage alt={page.cta.image.alt} className={styles.marketingImage} getImageUrl={props.getImageUrl} height={500} source={props.content.site.images.homeCta} width={700} /></div></section>
  </>;
}

function AboutPreview(props: SitePreviewProps) {
  const page = props.content.site.content.about;
  return <section className={styles.siteSection}><div className={styles.sectionHeading}><div><p className={styles.eyebrowDark}>{page.introduction.eyebrow}</p><h1>{page.introduction.heading}</h1><p>{page.introduction.description}</p><p>{page.introduction.secondaryDescription}</p></div><PreviewImage alt={page.heroImage.alt} className={styles.marketingImage} getImageUrl={props.getImageUrl} height={650} source={props.content.site.images.aboutHero} width={850} /></div><div className={styles.contextGrid}>{[page.supportedEvents, page.supportOptions].map((section) => <div key={section.eyebrow}><p className={styles.eyebrowDark}>{section.eyebrow}</p><h2>{section.heading}</h2><ul>{section.items.map((item) => <li key={item.key}>{item.text}</li>)}</ul></div>)}</div><div className={styles.nextSteps}><p className={styles.eyebrowDark}>{page.serviceArea.eyebrow}</p><h2>{page.serviceArea.heading}</h2><p>{page.serviceArea.description}</p></div><div className={styles.ctaSection}><div><p className={styles.eyebrow}>{page.cta.eyebrow}</p><h2>{page.cta.heading}</h2><p>{page.cta.description}</p></div></div></section>;
}

function GalleryPreview(props: SitePreviewProps) {
  const page = props.content.site.content.gallery;
  return <section className={styles.siteSection}>
    <div className={styles.pageHeading}><p className={styles.eyebrowDark}>{page.introduction.eyebrow}</p><h1>{page.introduction.heading}</h1><p>{page.introduction.description}</p></div>
    {page.photos.length ? <div className={styles.galleryGrid}>{page.photos.map((photo, index) => <figure key={photo.key} className={styles.galleryPhoto}>
      <PreviewImage alt={photo.alt} className={styles.galleryImage} getImageUrl={props.getImageUrl} height={600} width={800} source={props.content.site.galleryImages[index]} />
      {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
    </figure>)}</div> : <EmptyPreview>Photos are coming soon.</EmptyPreview>}
  </section>;
}

function PackagesPreview(props: SitePreviewProps) {
  const page = props.content.site.content.packages;
  if (!PACKAGES_ENABLED || !page) return null;
  return <section className={styles.siteSection}><div className={styles.pageHeading}><p className={styles.eyebrowDark}>{page.introduction.eyebrow}</p><h1>{page.introduction.heading}</h1><p>{page.introduction.description}</p></div>{props.content.packages.length ? <div className={styles.packageGrid}>{props.content.packages.map((pkg) => <PackageCardPreview key={pkg.id} {...props} labels={page.labels} pkg={pkg} />)}</div> : <EmptyPreview>No packages are available in this view.</EmptyPreview>}</section>;
}

function DetailPreview(props: SitePreviewProps) {
  const pkg = props.selectedPackage; const labels = props.content.site.content.packages?.labels;
  if (!PACKAGES_ENABLED || !labels) return null;
  if (!pkg) return <section className={styles.siteSection}><EmptyPreview>Select a package from Home or Packages to preview its detail page.</EmptyPreview></section>;
  return <section className={styles.siteSection}><button className={styles.textButton} type="button" onClick={() => props.onNavigate("packages")}>{labels.backToPackages}</button><article className={styles.detailCard}><PreviewImage alt={pkg.imageAlt} className={styles.detailImage} getImageUrl={props.getImageUrl} height={720} source={pkg.image} width={1600} /><div className={styles.detailBody}><div className={styles.badgeRow}><span className={styles.categoryBadge}>{pkg.category}</span>{pkg.rentalPeriod ? <span>{pkg.rentalPeriod}</span> : null}<StatusBadge perspective={props.perspective} status={pkg.status} /></div><h1>{pkg.name}</h1><p className={styles.detailDescription}>{pkg.description}</p><Issues issues={pkg.issues} /><div className={styles.factGrid}><div><span>{labels.bestFor}</span><p>{pkg.bestFor}</p></div><div><span>{labels.eventSize}</span><p>{pkg.eventSize}</p></div></div><div className={styles.listGrid}><div><h2>{labels.detailIncludes}</h2><ul>{pkg.includes.map((item, index) => <li key={`${pkg.id}-include-${index}`}>{item}</li>)}</ul></div><div><h2>{labels.detailAddons}</h2><ul>{pkg.addons.map((item, index) => <li key={`${pkg.id}-addon-${index}`}>{item}</li>)}</ul></div></div><div className={styles.detailActions}><button type="button" onClick={() => props.onQuotePackage(pkg)}>{labels.detailAvailability}</button><EditDocumentLink id={pkg.id} label="Edit this package" type="rentalPackage" /></div></div></article></section>;
}

function QuotePreview(props: SitePreviewProps) {
  const page = props.content.site.content.quote;
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();
  const handlePackageChange = (event: ChangeEvent<HTMLSelectElement>) => props.onQuoteSelectionChange(event.target.value);
  return <section className={`${styles.siteSection} ${styles.quoteLayout}`}><div className={styles.quoteIntro}><p className={styles.eyebrowDark}>{page.introduction.eyebrow}</p><h1>{page.introduction.heading}</h1><p>{page.introduction.description}</p><div className={styles.nextSteps}><strong>{page.nextStepsHeading}</strong><ol>{page.nextSteps.map((step) => <li key={step.key}>{step.text}</li>)}</ol></div></div><form className={styles.quoteForm} onSubmit={handleSubmit}><div className={styles.previewNotice}>Preview only - this form cannot submit.</div><label>Name<input readOnly value="Preview customer" /></label><label>Event date<input readOnly type="date" value="" /></label><label>Location<input readOnly value="North Georgia venue" /></label>{PACKAGES_ENABLED ? <label>Package<select value={props.selectedQuoteSlug} onChange={handlePackageChange}><option value="">Not sure yet</option>{props.content.packages.map((pkg) => <option key={pkg.id} value={pkg.slug}>{pkg.name}</option>)}</select></label> : null}<label>Notes<textarea readOnly value="Preview of the customer notes field." /></label><button disabled type="submit">Preview - submission disabled</button></form></section>;
}

function FaqPreview(props: SitePreviewProps) {
  const page = props.content.site.content.faq;
  return <section className={styles.siteSection}><div className={styles.pageHeading}><p className={styles.eyebrowDark}>{page.introduction.eyebrow}</p><h1>{page.introduction.heading}</h1><p>{page.introduction.description}</p></div>{props.content.faqs.length ? <div className={styles.faqList}>{props.content.faqs.map((faq) => <article key={faq.id}><div className={styles.badgeRow}><StatusBadge perspective={props.perspective} status={faq.status} /><EditDocumentLink id={faq.id} label="Edit FAQ" type="faq" /></div><h2>{faq.question}</h2><p>{faq.answer}</p><Issues issues={faq.issues} /></article>)}</div> : <EmptyPreview>No FAQs are available in this view.</EmptyPreview>}<div className={styles.ctaSection}><div><p className={styles.eyebrow}>{page.cta.eyebrow}</p><h2>{page.cta.heading}</h2><p>{page.cta.description}</p></div></div></section>;
}

const pageKeys: Record<PreviewPage, PreviewSingletonKey> = { home: "home", about: "about", packages: "packages", detail: "packages", quote: "quote", faq: "faq", gallery: "gallery" };
function PageControls({ content, page, perspective }: Pick<SitePreviewProps, "content" | "page" | "perspective">) {
  const key = pageKeys[page]; const state = content.site.pages[key]; const seo = page === "detail" && content.packages.length ? { title: content.site.content.packages?.seo.title, description: "Package metadata uses the selected package name, description, and image." } : (content.site.content[key === "settings" ? "home" : key]?.seo ?? content.site.content.settings.seo);
  return <div className={styles.pageMeta}><div><div className={styles.badgeRow}><strong>{page === "detail" ? "Package Detail" : `${state.type.replace(/Page$/, "")} page`}</strong><StatusBadge perspective={perspective} status={state.status} /></div><Issues issues={state.issues} /></div><div className={styles.seoSummary}><strong>SEO</strong><span>{seo.title}</span><small>{seo.description}</small></div><EditDocumentLink id={state.id} label="Edit this page" type={state.type} /></div>;
}

function SitePreview(props: SitePreviewProps) {
  const settings = props.content.site.content.settings;
  return <div className={styles.site} data-viewport={props.viewport}><header className={styles.siteHeader}><button type="button" onClick={() => props.onNavigate("home")}><span className={styles.brandMark}>JA</span>{settings.shortName}</button><nav>{PACKAGES_ENABLED ? <button type="button" onClick={() => props.onNavigate("packages")}>{settings.header.packagesLabel}</button> : null}<button type="button" onClick={() => props.onNavigate("quote")}>{settings.header.quoteLabel}</button><button type="button" onClick={() => props.onNavigate("gallery")}>{settings.header.galleryLabel}</button><button type="button" onClick={() => props.onNavigate("about")}>{settings.header.aboutLabel}</button><button type="button" onClick={() => props.onNavigate("faq")}>{settings.header.faqLabel}</button><button type="button" onClick={() => props.onNavigate("quote")}>{settings.header.ctaLabel}</button></nav></header><PageControls content={props.content} page={props.page} perspective={props.perspective} />{props.page === "home" ? <HomePreview {...props} /> : null}{props.page === "about" ? <AboutPreview {...props} /> : null}{PACKAGES_ENABLED && props.page === "packages" ? <PackagesPreview {...props} /> : null}{PACKAGES_ENABLED && props.page === "detail" ? <DetailPreview {...props} /> : null}{props.page === "quote" ? <QuotePreview {...props} /> : null}{props.page === "faq" ? <FaqPreview {...props} /> : null}{props.page === "gallery" ? <GalleryPreview {...props} /> : null}<footer className={styles.siteFooter}><div><strong>{settings.businessName}</strong><p>{settings.description}</p></div><div><strong>{settings.footer.serviceAreaHeading}</strong><p>{settings.footer.serviceAreaDescription}</p></div></footer></div>;
}

export function WebsitePreviewTool() {
  const [perspective, setPerspective] = useState<PreviewPerspective>("drafts"); const [viewport, setViewport] = useState<PreviewViewport>("desktop"); const [page, setPage] = useState<PreviewPage>("home");
  const [selectedPackageId, setSelectedPackageId] = useState<string>(); const [requestedQuoteSlug, setRequestedQuoteSlug] = useState<string>();
  const { content, error, lastUpdated, loading, refresh, studioClient } = usePreviewContent(perspective);
  const imageBuilder = useMemo(() => createImageUrlBuilder(studioClient), [studioClient]);
  const selectedPackage = content.packages.find((pkg) => pkg.id === selectedPackageId) ?? content.packages[0];
  const selectedQuoteSlug = resolveQuotePackageSlug(content.packages, requestedQuoteSlug);
  const getImageUrl = useCallback((source: Record<string, unknown> | null, width: number, height: number) => { if (!source) return undefined; try { return imageBuilder.image(source as SanityImageSource).width(width).height(height).fit("crop").url(); } catch { return undefined; } }, [imageBuilder]);
  const openPackage = (pkg: PreviewPackage) => { setSelectedPackageId(pkg.id); setPage("detail"); };
  const quotePackage = (pkg: PreviewPackage) => { setRequestedQuoteSlug(pkg.slug); setPage("quote"); };
  return <div className={styles.tool}><header className={styles.toolHeader}><div><p className={styles.toolEyebrow}>JA Event Production</p><h1>Website Preview</h1><p>Review draft or published CMS content across the customer journey. This preview does not publish content or submit quote requests.</p></div><div className={styles.toolMeta}>{PACKAGES_ENABLED ? <span>{content.packages.length} packages</span> : null}<span>{content.faqs.length} FAQs</span>{lastUpdated ? <span>Updated {lastUpdated.toLocaleTimeString()}</span> : null}</div></header><div className={styles.toolbar}><fieldset><legend>Content</legend><button aria-pressed={perspective === "drafts"} type="button" onClick={() => setPerspective("drafts")}>Draft</button><button aria-pressed={perspective === "published"} type="button" onClick={() => setPerspective("published")}>Published</button></fieldset><fieldset><legend>Viewport</legend><button aria-pressed={viewport === "desktop"} type="button" onClick={() => setViewport("desktop")}>Desktop</button><button aria-pressed={viewport === "mobile"} type="button" onClick={() => setViewport("mobile")}>Mobile</button></fieldset><button className={styles.refreshButton} type="button" onClick={refresh}>Refresh</button></div>{perspective === "drafts" ? <div className={styles.draftBanner}>Draft preview - content marked Not yet public or Unpublished changes is not on the deployed website.</div> : <div className={styles.publishedBanner}>Published preview - this is the content available to the next static website build.</div>}{error ? <div className={styles.errorBanner} role="alert"><strong>Preview could not update.</strong> {error}<button type="button" onClick={refresh}>Try again</button></div> : null}<div className={styles.previewStage} data-viewport={viewport}><div className={styles.browserFrame}><div className={styles.browserBar}><span className={styles.browserDots}>* * *</span><span className={styles.addressBar}>preview.ja-event-production.local/{page === "home" ? "" : page}</span></div><div className={styles.browserContent} aria-busy={loading}>{loading && !content.packages.length && !content.faqs.length ? <div className={styles.loadingPreview}>Loading website preview...</div> : <SitePreview content={content} getImageUrl={getImageUrl} onNavigate={setPage} onOpenPackage={openPackage} onQuotePackage={quotePackage} onQuoteSelectionChange={setRequestedQuoteSlug} page={page} perspective={perspective} selectedPackage={selectedPackage} selectedQuoteSlug={selectedQuoteSlug} viewport={viewport} />}</div></div></div></div>;
}
