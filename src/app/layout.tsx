import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { metadataFromSeo } from "@/content/metadata";
import { getSiteContent } from "@/content/repository";
import { runtimeSiteConfig } from "@/data/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    ...metadataFromSeo(settings.seo),
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { settings } = await getSiteContent();
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900">
        <div className="flex min-h-screen flex-col">
          <Header settings={settings} />
          <main className="flex-1">{children}</main>
          <Footer contactEmail={runtimeSiteConfig.contactEmail} settings={settings} />
        </div>
      </body>
    </html>
  );
}
