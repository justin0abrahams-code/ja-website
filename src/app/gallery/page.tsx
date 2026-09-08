import type { Metadata } from "next";
import { PhotoGallery } from "@/components/PhotoGallery";
import { metadataFromSeo } from "@/content/metadata";
import { getSiteContent } from "@/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromSeo((await getSiteContent()).gallery.seo);
}

export default async function GalleryPage() {
  const content = (await getSiteContent()).gallery;
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">{content.introduction.eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-zinc-950">{content.introduction.heading}</h1>
        <p className="mt-6 text-lg leading-8 text-zinc-600">{content.introduction.description}</p>
      </div>
      <PhotoGallery photos={content.photos} />
    </section>
  );
}
