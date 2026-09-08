import { describe, expect, it } from "vitest";
import { selectHomepagePackages } from "@/content/merchandising";

describe("homepage package merchandising", () => {
  it("selects the first three featured Sound packages in display order", () => {
    const packages = [
      { name: "Fourth", category: "Sound", featured: true, displayOrder: 40 },
      { name: "Lighting", category: "Lighting", featured: true, displayOrder: 5 },
      { name: "Second", category: "Sound", featured: true, displayOrder: 20 },
      { name: "Hidden", category: "Sound", featured: false, displayOrder: 1 },
      { name: "Third", category: "Sound", featured: true, displayOrder: 30 },
      { name: "First", category: "Sound", featured: true, displayOrder: 10 },
    ];

    expect(selectHomepagePackages(packages).map((pkg) => pkg.name)).toEqual([
      "First",
      "Second",
      "Third",
    ]);
    expect(packages[0].name).toBe("Fourth");
  });

  it("uses package name as a deterministic order tie-breaker", () => {
    const packages = [
      { name: "Beta", category: "Sound", featured: true, displayOrder: 10 },
      { name: "Alpha", category: "Sound", featured: true, displayOrder: 10 },
    ];

    expect(selectHomepagePackages(packages).map((pkg) => pkg.name)).toEqual([
      "Alpha",
      "Beta",
    ]);
  });
});
