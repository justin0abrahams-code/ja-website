import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/data/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: `${siteConfig.businessName} | Sound & Lighting Rentals`,
  description:
    "Sound and lighting rental packages for North Georgia events, with delivery, setup, and technical operator options.",
  openGraph: {
    title: `${siteConfig.businessName} | Sound & Lighting Rentals`,
    description:
      "Sound and lighting rental packages for North Georgia events, with delivery, setup, and technical operator options.",
    type: "website",
    images: siteUrl
      ? [
          {
            url: "/og.png",
            width: 1734,
            height: 909,
            alt: "Justin Abrahams Event Production sound and lighting rentals",
          },
        ]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.businessName} | Sound & Lighting Rentals`,
    description:
      "Sound and lighting rental packages for North Georgia events.",
    images: siteUrl ? ["/og.png"] : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
