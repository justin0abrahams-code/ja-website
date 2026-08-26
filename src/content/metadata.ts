import type { Metadata } from "next";
import type { SeoContent } from "@/content/domain";

export function metadataFromSeo(seo: SeoContent): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    title: seo.title,
    description: seo.description,
    openGraph: { title: seo.title, description: seo.description, type: "website", images: siteUrl ? [{ url: seo.socialImage.src, alt: seo.socialImage.alt }] : undefined },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: siteUrl ? [seo.socialImage.src] : undefined },
  };
}
