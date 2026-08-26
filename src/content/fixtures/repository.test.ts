import { describe, expect, it } from "vitest";
import { createFixtureContentRepository } from "./repository";

describe("fixture content repository", () => {
  it("returns all packages in deterministic display order", async () => {
    const repository = createFixtureContentRepository();
    const packages = await repository.getRentalPackages();

    expect(packages).toHaveLength(6);
    expect(packages.map((item) => item.displayOrder)).toEqual([
      10, 20, 30, 40, 50, 60,
    ]);
  });

  it("returns all FAQs in deterministic display order", async () => {
    const repository = createFixtureContentRepository();
    const faqs = await repository.getFaqs();

    expect(faqs).toHaveLength(8);
    expect(faqs.map((item) => item.displayOrder)).toEqual([
      10, 20, 30, 40, 50, 60, 70, 80,
    ]);
  });

  it("finds a package by slug and returns null for an unknown slug", async () => {
    const repository = createFixtureContentRepository();

    await expect(
      repository.getRentalPackage("basic-sound-package-1"),
    ).resolves.toMatchObject({
      name: "Small Event Sound Package",
    });
    await expect(repository.getRentalPackage("missing")).resolves.toBeNull();
  });
});
