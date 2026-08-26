import { describe, expect, it } from "vitest";
import { normalizePreviewContent } from "./model";

describe("preview singleton normalization", () => {
  it("keeps an empty dataset usable with page-level setup notices", () => {
    const result = normalizePreviewContent({}, {});
    expect(result.site.content.home.hero.heading).toBeTruthy();
    expect(result.site.pages.home.issues).toContain("Home Page has not been created in this view");
    expect(result.site.pages.settings.issues).toContain("Site Settings has not been created in this view");
  });

  it("reports draft-only singleton status and inherits the SEO summary", () => {
    const result = normalizePreviewContent({ site: { settings: { _id: "drafts.siteSettings", advanced: { defaultSeoTitle: "Preview title", defaultSeoDescription: "Preview description" } }, home: { _id: "drafts.homePage", advanced: { seo: {} } } } }, { draftIds: ["drafts.siteSettings", "drafts.homePage"], publishedIds: [] });
    expect(result.site.pages.home.status).toBe("new");
    expect(result.site.content.home.seo.title).toBe("Preview title");
    expect(result.site.content.home.seo.description).toBe("Preview description");
  });
});
