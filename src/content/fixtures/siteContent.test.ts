import { describe, expect, it } from "vitest";
import { fixtureSiteContent } from "@/content/fixtures/siteContent";

describe("fixtureSiteContent", () => {
  it("preserves the current visible marketing copy and image paths", () => {
    expect(fixtureSiteContent.home.hero.heading).toBe("Sound rentals for North Georgia events");
    expect(fixtureSiteContent.home.hero.image.src).toBe("/brand/audio-console.jpg");
    expect(fixtureSiteContent.home.process.image.src).toBe("/brand/audio-console.jpg");
    expect(fixtureSiteContent.about.heroImage.src).toBe("/brand/stage-audio.jpg");
    expect(fixtureSiteContent.home.cta.image.src).toBe("/brand/outdoor-screen.jpg");
    expect(fixtureSiteContent.home.proofPoints).toHaveLength(3);
  });
});
