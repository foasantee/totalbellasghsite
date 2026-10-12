import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import "@/css/variables.css";
import "@/css/base.css";
import "@/css/layout.css";
import "@/css/components.css";
import "@/css/responsive.css";

const title = "Total Bellas GH — Curated Fashion, Footwear & Bags";
const description =
  "Total Bellas GH — curated clothing, shoes and bags for the modern Ghanaian woman. Shop the new season edit.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s — Total Bellas GH",
  },
  description,
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='16' fill='%232D6A4F'/%3E%3Ctext x='50' y='68' font-family='Georgia,serif' font-size='58' fill='%23FAF9F5' text-anchor='middle'%3ET%3C/text%3E%3C/svg%3E",
  },
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "Total Bellas GH",
    images: ["/hero/hero-image.png"],
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/hero/hero-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- this rule targets pages/_document.js; the App Router root layout is the correct place to load fonts for the whole app */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
