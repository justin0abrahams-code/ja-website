import { describe, expect, it } from "vitest";
import { normalizePreviewContent } from "./model";

describe("preview singleton normalization", () => {
  it("previews ordered gallery photos and flags unfinished image descriptions", () => {
    const source = { _key: "stage", asset: { _ref: "image-stage" }, caption: "Stage" };
    const result = normalizePreviewContent({ site: { gallery: { _id: "drafts.galleryPage", photos: [source] } } }, { draftIds: ["drafts.galleryPage"], publishedIds: [] });
    expect(result.site.pages.gallery.status).toBe("new");
    expect(result.site.content.gallery.photos[0]).toMatchObject({ key: "stage", caption: "Stage" });
    expect(result.site.galleryImages).toEqual([source]);
    expect(result.site.pages.gallery.issues).toContain("Complete gallery photo 1: add alternative text");
  });

  it("omits paused packages and their setup notices", () => {
    const result = normalizePreviewContent({}, {});
    expect(result.site.content.packages).toBeUndefined();
    expect(result.site.content.home.featuredPackages).toBeUndefined();
    expect(result.site.pages.packages.issues).toEqual([]);
    expect(result.site.pages.home.issues.join(" ")).not.toMatch(/featured-packages|primary label/);
    expect(result.site.pages.settings.issues.join(" ")).not.toMatch(/packages label/);
  });

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
