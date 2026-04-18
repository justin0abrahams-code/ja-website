import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JA Event Production",
  description: "Audio, lighting, and AV rentals for events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
