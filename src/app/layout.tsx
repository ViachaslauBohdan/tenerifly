import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { ColorSchemeScript } from "@mantine/core";
import { MantineProvider } from "@/components/providers/MantineProvider";

import { ReferralCodeClient } from "@/components/ReferralCodeClient";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import {
  DEFAULT_OG_IMAGE,
  SEO_HOME,
  absoluteUrlForLocale,
  hreflangAlternates,
  organizationAndWebsiteJsonLd,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ISR настройки для layout
export const revalidate = 86400; // Обновление каждые 24 часа для основного layout

export async function generateMetadata(): Promise<Metadata> {
  const seo = SEO_HOME.en;
  return {
    title: {
      default:
        "Tenerifly.io — Tenerife holidays: apartments, car hire & tours (Canary Islands)",
      template: "%s | Tenerifly.io",
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: "Tenerifly.io" }],
    creator: "Tenerifly.io",
    publisher: "Tenerifly.io",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteUrlForLocale("en", ""),
      siteName: "Tenerifly.io",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [DEFAULT_OG_IMAGE],
      creator: "@tenerifly",
      site: "@tenerifly",
    },
    metadataBase: new URL("https://tenerifly.io"),
    alternates: {
      canonical: absoluteUrlForLocale("en", ""),
      languages: hreflangAlternates(""),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const htmlLang = headersList.get("x-locale") ?? "en";

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationAndWebsiteJsonLd()),
          }}
        />
        <ColorSchemeScript defaultColorScheme="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="preload" href={DEFAULT_OG_IMAGE} as="image" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <MantineProvider>
          <ReferralCodeClient />
          {children}
          <WhatsAppFloatingButton />
        </MantineProvider>
      </body>
    </html>
  );
}
