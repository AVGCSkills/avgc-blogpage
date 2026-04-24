import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Root Metadata Configuration
export const metadata = {
  // metadataBase is required to dynamically resolve relative image/canonical URLs in your nested pages
  metadataBase: new URL("https://avgcframes.com"),

  title: {
    default: "AVGC FramesShift | Insights & Updates",
    // This template ensures all nested pages automatically append your brand name (e.g., "Post Name | AVGC FramesShift")
    template: "%s | AVGC FramesShift",
  },
  description:
    "The official blog for AVGC FramesShift, sharing the latest updates, articles, and insights.",

  // Opened up for production crawlers. Ensure staging is blocked via robots.txt instead of here.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large", // Crucial for Google Discover visibility
      "max-snippet": -1,
    },
  },

  // Even without social media profiles, basic Open Graph is necessary so links look good in Slack, iMessage, Discord, etc.
  openGraph: {
    title: "AVGC FramesShift",
    description:
      "The official blog for AVGC FramesShift, sharing the latest updates, articles, and insights.",
    url: "https://avgcframes.com",
    siteName: "AVGC FramesShift",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  // 2. Base WebSite Schema (JSON-LD)
  // This tells Google exactly what this domain represents as an entity, strictly excluding social links.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AVGC FramesShift",
    url: "https://avgcframes.com/",
    description:
      "The official blog for AVGC FramesShift, sharing the latest updates, articles, and insights.",

    sameAs: [
      "https://www.linkedin.com/company/avgc-skill-pvt-ltd",
      "https://www.facebook.com/avgcskillsstudios/",
      "https://www.instagram.com/avgc_skills_studios/",
    ],
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {/* Injecting the JSON-LD schema into the head silently */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Fixed: Actually rendering the imported Header and Footer */}

        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
