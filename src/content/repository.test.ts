import { describe, expect, it, vi } from "vitest";
import { getSanityBuildConfig } from "@/content/sanity/client";
import {
  ContentConfigurationError,
  ContentFetchError,
} from "@/content/errors";
import { resolveContentSource } from "@/content/source";
import { createSanityContentRepository } from "@/content/sanity/repository";

describe("content source selection", () => {
  it("defaults to fixtures and accepts both explicit sources", () => {
    expect(resolveContentSource(undefined)).toBe("fixture");
    expect(resolveContentSource("")).toBe("fixture");
    expect(resolveContentSource("fixture")).toBe("fixture");
    expect(resolveContentSource("sanity")).toBe("sanity");
  });

  it("rejects unsupported sources", () => {
    expect(() => resolveContentSource("automatic")).toThrow(
      ContentConfigurationError,
    );
  });

  it("fails clearly when Sanity configuration is missing", () => {
    expect(() => getSanityBuildConfig({})).toThrow(
      /SANITY_STUDIO_PROJECT_ID is not configured/,
    );
    expect(() =>
      getSanityBuildConfig({
        SANITY_STUDIO_PROJECT_ID: "project-id",
      }),
    ).toThrow(/SANITY_STUDIO_DATASET is not configured/);
  });

  it("keeps the optional read token server-side in build configuration", () => {
    expect(
      getSanityBuildConfig({
        SANITY_STUDIO_PROJECT_ID: "project-id",
        SANITY_STUDIO_DATASET: "development",
        SANITY_READ_TOKEN: "read-token",
      }),
    ).toEqual({
      projectId: "project-id",
      dataset: "development",
      token: "read-token",
    });
  });
});

describe("Sanity repository errors", () => {
  it("translates package fetch failures without silently using fixtures", async () => {
    const repository = createSanityContentRepository({
      fetch: vi.fn().mockRejectedValue(new Error("network unavailable")),
      resolveImageUrl: vi.fn(),
    });

    await expect(repository.getRentalPackages()).rejects.toBeInstanceOf(
      ContentFetchError,
    );
  });

  it("translates FAQ fetch failures", async () => {
    const repository = createSanityContentRepository({
      fetch: vi.fn().mockRejectedValue(new Error("network unavailable")),
      resolveImageUrl: vi.fn(),
    });

    await expect(repository.getFaqs()).rejects.toBeInstanceOf(
      ContentFetchError,
    );
  });
});
