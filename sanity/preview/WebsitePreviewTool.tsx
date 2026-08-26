import createImageUrlBuilder, {
  type SanityImageSource,
} from "@sanity/image-url";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";
import {
  type PreviewContent,
  type PreviewDocumentStatus,
  type PreviewFaq,
  type PreviewPackage,
  type PreviewPerspective,
  normalizePreviewContent,
  resolveQuotePackageSlug,
  selectPreviewHomepagePackages,
} from "./model";
import styles from "./WebsitePreviewTool.module.css";

const API_VERSION = "2026-08-24";

const CONTENT_QUERY = `{
  "packages": *[
    _type == "rentalPackage" && !(_id in path("versions.**"))
  ] | order(displayOrder asc, name asc) {
    _id,
    slug,
    name,
    category,
    description,
    bestFor,
    eventSize,
    includes,
    addons,
    rentalPeriod,
    featured,
    displayOrder,
    image {
      alt,
      asset,
      crop,
      hotspot
    }
  },
  "faqs": *[
    _type == "faq" && !(_id in path("versions.**"))
  ] | order(displayOrder asc, question asc) {
    _id,
    question,
    answer,
    displayOrder
  }
}`;

const STATUS_QUERY = `{
  "draftIds": *[
    _type in ["rentalPackage", "faq"] && _id in path("drafts.**")
  ]._id,
  "publishedIds": *[
    _type in ["rentalPackage", "faq"] &&
    !(_id in path("drafts.**")) &&
    !(_id in path("versions.**"))
  ]._id
}`;

const LISTEN_QUERY = `*[_type in ["rentalPackage", "faq"]]`;

type PreviewPage = "home" | "packages" | "detail" | "quote" | "faq";
type PreviewViewport = "desktop" | "mobile";

interface PreviewState {
  content: PreviewContent;
  error?: string;
  loading: boolean;
  lastUpdated?: Date;
}

interface SitePreviewProps {
  content: PreviewContent;
  getImageUrl: (pkg: PreviewPackage, width: number, height: number) => string | undefined;
  onNavigate: (page: PreviewPage) => void;
  onOpenPackage: (pkg: PreviewPackage) => void;
  onQuotePackage: (pkg: PreviewPackage) => void;
  onQuoteSelectionChange: (slug: string) => void;
  page: PreviewPage;
  perspective: PreviewPerspective;
  selectedPackage?: PreviewPackage;
  selectedQuoteSlug: string;
  viewport: PreviewViewport;
}

const EMPTY_CONTENT: PreviewContent = { packages: [], faqs: [] };

function usePreviewContent(perspective: PreviewPerspective) {
  const studioClient = useClient({ apiVersion: API_VERSION });
  const rawClient = useMemo(
    () => studioClient.withConfig({ perspective: "raw", useCdn: false }),
    [studioClient],
  );
  const perspectiveClient = useMemo(
    () => studioClient.withConfig({ perspective, useCdn: false }),
    [perspective, studioClient],
  );
  const requestId = useRef(0);
  const [state, setState] = useState<PreviewState>({
    content: EMPTY_CONTENT,
    loading: true,
  });

  const refresh = useCallback(
    async (showLoading = false) => {
      const currentRequestId = requestId.current + 1;
      requestId.current = currentRequestId;

      if (showLoading) {
        setState((current) => ({ ...current, error: undefined, loading: true }));
      }

      try {
        const [input, statusResult] = await Promise.all([
          perspectiveClient.fetch(CONTENT_QUERY),
          rawClient.fetch(STATUS_QUERY),
        ]);

        if (requestId.current !== currentRequestId) return;

        setState({
          content: normalizePreviewContent(input, statusResult),
          loading: false,
          lastUpdated: new Date(),
        });
      } catch (cause) {
        if (requestId.current !== currentRequestId) return;

        setState((current) => ({
          ...current,
          error:
            cause instanceof Error
              ? cause.message
              : "Unable to load the website preview.",
          loading: false,
        }));
      }
    },
    [perspectiveClient, rawClient],
  );

  useEffect(() => {
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    void refresh(true);

    const subscription = rawClient
      .listen(LISTEN_QUERY, {}, { includeResult: false, visibility: "query" })
      .subscribe({
        next: () => {
          clearTimeout(refreshTimer);
          refreshTimer = setTimeout(() => void refresh(), 200);
        },
        error: (cause) => {
          setState((current) => ({
            ...current,
            error:
              cause instanceof Error
                ? cause.message
                : "Live preview updates were interrupted.",
          }));
        },
      });

    return () => {
      requestId.current += 1;
      clearTimeout(refreshTimer);
      subscription.unsubscribe();
    };
  }, [rawClient, refresh]);

  return { ...state, refresh: () => refresh(true), studioClient };
}

function StatusBadge({
  perspective,
  status,
}: {
  perspective: PreviewPerspective;
  status: PreviewDocumentStatus;
}) {
  if (perspective === "published") return null;

  const label =
    status === "new"
      ? "Not yet public"
      : status === "changed"
        ? "Unpublished changes"
        : "Published";

  return (
    <span className={styles.statusBadge} data-status={status}>
      {label}
    </span>
  );
}

function Issues({ issues }: { issues: string[] }) {
  if (issues.length === 0) return null;

  return (
    <div className={styles.issues} role="status">
      <strong>Finish in Studio:</strong> {issues.join(" · ")}
    </div>
  );
}

function EditDocumentLink({
  id,
  label,
  type,
}: {
  id: string;
  label: string;
  type: "rentalPackage" | "faq";
}) {
  return (
    <IntentLink
      className={styles.editLink}
      intent="edit"
      params={{ id, type }}
    >
      {label}
    </IntentLink>
  );
}

function PackageImage({
  className,
  getImageUrl,
  height,
  pkg,
  width,
}: {
  className: string;
  getImageUrl: SitePreviewProps["getImageUrl"];
  height: number;
  pkg: PreviewPackage;
  width: number;
}) {
  const src = getImageUrl(pkg, width, height);

  return src ? (
    // This runs inside Studio, not the Next.js application.
    // eslint-disable-next-line @next/next/no-img-element
    <img className={className} src={src} alt={pkg.imageAlt} />
  ) : (
    <div className={`${className} ${styles.imagePlaceholder}`}>
      Choose an image in Studio
    </div>
  );
}

function PackageCardPreview({
  getImageUrl,
  onOpenPackage,
  onQuotePackage,
  perspective,
  pkg,
}: {
  getImageUrl: SitePreviewProps["getImageUrl"];
  onOpenPackage: SitePreviewProps["onOpenPackage"];
  onQuotePackage: SitePreviewProps["onQuotePackage"];
  perspective: PreviewPerspective;
  pkg: PreviewPackage;
}) {
  return (
    <article className={styles.packageCard}>
      <PackageImage
        className={styles.cardImage}
        getImageUrl={getImageUrl}
        height={450}
        pkg={pkg}
        width={800}
      />
      <div className={styles.cardBody}>
        <div className={styles.badgeRow}>
          <span className={styles.categoryBadge}>{pkg.category}</span>
          <StatusBadge perspective={perspective} status={pkg.status} />
        </div>
        <h3>{pkg.name}</h3>
        <p className={styles.description}>{pkg.description}</p>
        <dl className={styles.quickFacts}>
          <div>
            <dt>Best for:</dt>
            <dd>{pkg.bestFor}</dd>
          </div>
          <div>
            <dt>Event size:</dt>
            <dd>{pkg.eventSize}</dd>
          </div>
          {pkg.rentalPeriod ? (
            <div>
              <dt>Rental period:</dt>
              <dd>{pkg.rentalPeriod}</dd>
            </div>
          ) : null}
        </dl>
        <div className={styles.includesPreview}>
          <strong>Includes:</strong>
          {pkg.includes.length > 0 ? (
            <ul>
              {pkg.includes.slice(0, 4).map((item, index) => (
                <li key={`${pkg.id}-included-${index}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.placeholderText}>Add included items in Studio.</p>
          )}
        </div>
        <Issues issues={pkg.issues} />
        <div className={styles.cardActions}>
          <button type="button" onClick={() => onQuotePackage(pkg)}>
            Check Availability
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => onOpenPackage(pkg)}
          >
            View Details
          </button>
          <EditDocumentLink id={pkg.id} label="Edit package" type="rentalPackage" />
        </div>
      </div>
    </article>
  );
}

function EmptyPreview({ children }: { children: string }) {
  return <div className={styles.emptyPreview}>{children}</div>;
}

function HomePreview(props: SitePreviewProps) {
  const featuredPackages = selectPreviewHomepagePackages(props.content.packages);

  return (
    <>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Justin Abrahams Event Production</p>
          <h1>Sound and lighting rental packages for North Georgia events</h1>
          <p className={styles.tagline}>Sound that moves the moment.</p>
          <p className={styles.heroCopy}>
            Start with a right-sized package, then add delivery, setup, or
            technician support when your event needs it.
          </p>
          <div className={styles.heroActions}>
            <button type="button" onClick={() => props.onNavigate("packages")}>
              Browse Packages
            </button>
            <button
              className={styles.heroSecondary}
              type="button"
              onClick={() => props.onNavigate("quote")}
            >
              Check Availability
            </button>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <span>Customer website hero image</span>
        </div>
      </section>

      <section className={styles.siteSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrowDark}>Core Sound Packages</p>
            <h2>Choose by event size and coverage needs</h2>
            <p>
              This uses the exact featured, Sound-category, display-order, and
              three-package limit used by the customer homepage.
            </p>
          </div>
          <button
            className={styles.textButton}
            type="button"
            onClick={() => props.onNavigate("packages")}
          >
            View all packages
          </button>
        </div>
        {featuredPackages.length > 0 ? (
          <div className={styles.packageGrid}>
            {featuredPackages.map((pkg) => (
              <PackageCardPreview
                key={pkg.id}
                getImageUrl={props.getImageUrl}
                onOpenPackage={props.onOpenPackage}
                onQuotePackage={props.onQuotePackage}
                perspective={props.perspective}
                pkg={pkg}
              />
            ))}
          </div>
        ) : (
          <EmptyPreview>
            No featured Sound packages appear on the homepage in this view.
          </EmptyPreview>
        )}
      </section>

      <section className={styles.contextSection}>
        <p className={styles.eyebrowDark}>Popular Upgrades</p>
        <h2>Fixed website content remains visible for context</h2>
        <div className={styles.contextGrid}>
          {["Room Uplighting", "Subwoofer Support", "Band Support", "Event-Day Help"].map(
            (title) => (
              <div key={title}>
                <strong>{title}</strong>
                <p>Customer-facing supporting copy from the website.</p>
              </div>
            ),
          )}
        </div>
      </section>
    </>
  );
}

function PackagesPreview(props: SitePreviewProps) {
  return (
    <section className={styles.siteSection}>
      <div className={styles.pageHeading}>
        <p className={styles.eyebrowDark}>Rental Packages</p>
        <h1>Sound and lighting packages built around real event needs</h1>
        <p>
          Choose the setup that best matches your event size and use, then ask
          about delivery, setup, upgrades, or a technical operator.
        </p>
      </div>
      {props.content.packages.length > 0 ? (
        <div className={styles.packageGrid}>
          {props.content.packages.map((pkg) => (
            <PackageCardPreview
              key={pkg.id}
              getImageUrl={props.getImageUrl}
              onOpenPackage={props.onOpenPackage}
              onQuotePackage={props.onQuotePackage}
              perspective={props.perspective}
              pkg={pkg}
            />
          ))}
        </div>
      ) : (
        <EmptyPreview>No packages are available in this view.</EmptyPreview>
      )}
    </section>
  );
}

function DetailPreview(props: SitePreviewProps) {
  const pkg = props.selectedPackage;

  if (!pkg) {
    return (
      <section className={styles.siteSection}>
        <EmptyPreview>
          Select a package from Home or Packages to preview its detail page.
        </EmptyPreview>
      </section>
    );
  }

  return (
    <section className={styles.siteSection}>
      <button
        className={styles.textButton}
        type="button"
        onClick={() => props.onNavigate("packages")}
      >
        Back to Packages
      </button>
      <article className={styles.detailCard}>
        <PackageImage
          className={styles.detailImage}
          getImageUrl={props.getImageUrl}
          height={720}
          pkg={pkg}
          width={1600}
        />
        <div className={styles.detailBody}>
          <div className={styles.badgeRow}>
            <span className={styles.categoryBadge}>{pkg.category}</span>
            {pkg.rentalPeriod ? <span>{pkg.rentalPeriod}</span> : null}
            <StatusBadge perspective={props.perspective} status={pkg.status} />
          </div>
          <h1>{pkg.name}</h1>
          <p className={styles.detailDescription}>{pkg.description}</p>
          <Issues issues={pkg.issues} />
          <div className={styles.factGrid}>
            <div>
              <span>Best For</span>
              <p>{pkg.bestFor}</p>
            </div>
            <div>
              <span>Event Size</span>
              <p>{pkg.eventSize}</p>
            </div>
          </div>
          <div className={styles.listGrid}>
            <div>
              <h2>What&apos;s Included</h2>
              {pkg.includes.length > 0 ? (
                <ul>
                  {pkg.includes.map((item, index) => (
                    <li key={`${pkg.id}-detail-include-${index}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.placeholderText}>Add included items in Studio.</p>
              )}
            </div>
            <div>
              <h2>Optional Add-Ons</h2>
              {pkg.addons.length > 0 ? (
                <ul>
                  {pkg.addons.map((item, index) => (
                    <li key={`${pkg.id}-detail-addon-${index}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.placeholderText}>Add optional add-ons in Studio.</p>
              )}
            </div>
          </div>
          <div className={styles.detailActions}>
            <button type="button" onClick={() => props.onQuotePackage(pkg)}>
              Check Availability
            </button>
            <EditDocumentLink id={pkg.id} label="Edit this package" type="rentalPackage" />
          </div>
        </div>
      </article>
    </section>
  );
}

function QuotePreview(props: SitePreviewProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handlePackageChange(event: ChangeEvent<HTMLSelectElement>) {
    props.onQuoteSelectionChange(event.target.value);
  }

  return (
    <section className={`${styles.siteSection} ${styles.quoteLayout}`}>
      <div className={styles.quoteIntro}>
        <p className={styles.eyebrowDark}>Check Availability</p>
        <h1>Tell us the basics about your event</h1>
        <p>
          Share your date, location, event type, and the package you are
          considering. Justin can confirm availability and recommend the right
          setup and support.
        </p>
        <div className={styles.nextSteps}>
          <strong>What happens next</strong>
          <ol>
            <li>Your event details are reviewed.</li>
            <li>Availability and logistics are confirmed.</li>
            <li>You receive a package recommendation and quote.</li>
          </ol>
        </div>
      </div>
      <form className={styles.quoteForm} onSubmit={handleSubmit}>
        <div className={styles.previewNotice}>
          Preview only — this form cannot submit.
        </div>
        <label>
          Name
          <input readOnly value="Preview customer" />
        </label>
        <label>
          Event date
          <input readOnly type="date" value="" />
        </label>
        <label>
          Location
          <input readOnly value="North Georgia venue" />
        </label>
        <label>
          Package
          <select value={props.selectedQuoteSlug} onChange={handlePackageChange}>
            <option value="">Not sure yet</option>
            {props.content.packages.map((pkg) => (
              <option key={pkg.id} value={pkg.slug}>
                {pkg.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Notes
          <textarea readOnly value="Preview of the customer notes field." />
        </label>
        <button disabled type="submit">
          Preview — submission disabled
        </button>
      </form>
    </section>
  );
}

function FaqPreview({
  content,
  perspective,
}: Pick<SitePreviewProps, "content" | "perspective">) {
  return (
    <section className={styles.siteSection}>
      <div className={styles.pageHeading}>
        <p className={styles.eyebrowDark}>Frequently Asked Questions</p>
        <h1>Helpful answers before you request a quote</h1>
        <p>
          Clear package details, flexible add-ons, and a quote-first workflow
          keep the rental process simple.
        </p>
      </div>
      {content.faqs.length > 0 ? (
        <div className={styles.faqList}>
          {content.faqs.map((faq: PreviewFaq) => (
            <article key={faq.id}>
              <div className={styles.badgeRow}>
                <StatusBadge perspective={perspective} status={faq.status} />
                <EditDocumentLink id={faq.id} label="Edit FAQ" type="faq" />
              </div>
              <h2>{faq.question}</h2>
              <p>{faq.answer}</p>
              <Issues issues={faq.issues} />
            </article>
          ))}
        </div>
      ) : (
        <EmptyPreview>No FAQs are available in this view.</EmptyPreview>
      )}
    </section>
  );
}

function SitePreview(props: SitePreviewProps) {
  return (
    <div className={styles.site} data-viewport={props.viewport}>
      <header className={styles.siteHeader}>
        <button type="button" onClick={() => props.onNavigate("home")}>
          <span className={styles.brandMark}>JA</span>
          <span>Justin Abrahams</span>
        </button>
        <nav aria-label="Preview website navigation">
          <button type="button" onClick={() => props.onNavigate("home")}>Home</button>
          <button type="button" onClick={() => props.onNavigate("packages")}>Packages</button>
          <button type="button" onClick={() => props.onNavigate("faq")}>FAQ</button>
          <button type="button" onClick={() => props.onNavigate("quote")}>Get a Quote</button>
        </nav>
      </header>
      <main>
        {props.page === "home" ? <HomePreview {...props} /> : null}
        {props.page === "packages" ? <PackagesPreview {...props} /> : null}
        {props.page === "detail" ? <DetailPreview {...props} /> : null}
        {props.page === "quote" ? <QuotePreview {...props} /> : null}
        {props.page === "faq" ? (
          <FaqPreview content={props.content} perspective={props.perspective} />
        ) : null}
      </main>
      <footer className={styles.siteFooter}>
        <strong>Justin Abrahams Event Production</strong>
        <span>Sound and lighting rentals for North Georgia events</span>
      </footer>
    </div>
  );
}

export function WebsitePreviewTool() {
  const [perspective, setPerspective] =
    useState<PreviewPerspective>("drafts");
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const [page, setPage] = useState<PreviewPage>("home");
  const [selectedPackageId, setSelectedPackageId] = useState<string>();
  const [requestedQuoteSlug, setRequestedQuoteSlug] = useState<string>();
  const { content, error, lastUpdated, loading, refresh, studioClient } =
    usePreviewContent(perspective);
  const imageBuilder = useMemo(
    () => createImageUrlBuilder(studioClient),
    [studioClient],
  );
  const selectedPackage =
    content.packages.find((pkg) => pkg.id === selectedPackageId) ??
    content.packages[0];
  const selectedQuoteSlug = resolveQuotePackageSlug(
    content.packages,
    requestedQuoteSlug,
  );

  const getImageUrl = useCallback(
    (pkg: PreviewPackage, width: number, height: number) => {
      if (!pkg.image) return undefined;

      try {
        return imageBuilder
          .image(pkg.image as SanityImageSource)
          .width(width)
          .height(height)
          .fit("crop")
          .url();
      } catch {
        return undefined;
      }
    },
    [imageBuilder],
  );

  function openPackage(pkg: PreviewPackage) {
    setSelectedPackageId(pkg.id);
    setPage("detail");
  }

  function quotePackage(pkg: PreviewPackage) {
    setRequestedQuoteSlug(pkg.slug);
    setPage("quote");
  }

  return (
    <div className={styles.tool}>
      <header className={styles.toolHeader}>
        <div>
          <p className={styles.toolEyebrow}>JA Event Production</p>
          <h1>Website Preview</h1>
          <p>
            Review how CMS content affects the customer journey. This preview
            does not publish content or submit quote requests.
          </p>
        </div>
        <div className={styles.toolMeta}>
          <span>{content.packages.length} packages</span>
          <span>{content.faqs.length} FAQs</span>
          {lastUpdated ? (
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          ) : null}
        </div>
      </header>

      <div className={styles.toolbar}>
        <fieldset>
          <legend>Content</legend>
          <button
            aria-pressed={perspective === "drafts"}
            type="button"
            onClick={() => setPerspective("drafts")}
          >
            Draft
          </button>
          <button
            aria-pressed={perspective === "published"}
            type="button"
            onClick={() => setPerspective("published")}
          >
            Published
          </button>
        </fieldset>
        <fieldset>
          <legend>Viewport</legend>
          <button
            aria-pressed={viewport === "desktop"}
            type="button"
            onClick={() => setViewport("desktop")}
          >
            Desktop
          </button>
          <button
            aria-pressed={viewport === "mobile"}
            type="button"
            onClick={() => setViewport("mobile")}
          >
            Mobile
          </button>
        </fieldset>
        <button className={styles.refreshButton} type="button" onClick={refresh}>
          Refresh
        </button>
      </div>

      {perspective === "drafts" ? (
        <div className={styles.draftBanner}>
          Draft preview — content marked “Not yet public” or “Unpublished
          changes” is not on the deployed website.
        </div>
      ) : (
        <div className={styles.publishedBanner}>
          Published preview — this is the content available to the next static
          website build.
        </div>
      )}

      {error ? (
        <div className={styles.errorBanner} role="alert">
          <strong>Preview could not update.</strong> {error}
          <button type="button" onClick={refresh}>Try again</button>
        </div>
      ) : null}

      <div className={styles.previewStage} data-viewport={viewport}>
        <div className={styles.browserFrame}>
          <div className={styles.browserBar}>
            <span className={styles.browserDots}>● ● ●</span>
            <span className={styles.addressBar}>
              preview.ja-event-production.local/{page === "home" ? "" : page}
            </span>
          </div>
          <div className={styles.browserContent} aria-busy={loading}>
            {loading && content.packages.length === 0 && content.faqs.length === 0 ? (
              <div className={styles.loadingPreview}>Loading website preview…</div>
            ) : (
              <SitePreview
                content={content}
                getImageUrl={getImageUrl}
                onNavigate={setPage}
                onOpenPackage={openPackage}
                onQuotePackage={quotePackage}
                onQuoteSelectionChange={setRequestedQuoteSlug}
                page={page}
                perspective={perspective}
                selectedPackage={selectedPackage}
                selectedQuoteSlug={selectedQuoteSlug}
                viewport={viewport}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
