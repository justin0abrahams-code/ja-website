import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `${siteConfig.businessName} | Event Rentals in ${siteConfig.serviceArea}`,
  description:
    "Sound, lighting, and event production equipment rentals with delivery, setup, and technical operator options in North Georgia.",
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
