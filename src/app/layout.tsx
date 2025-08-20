import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { ColorSchemeScript } from "@mantine/core";
import { MantineProvider } from "@/components/providers/MantineProvider";

import { ReferralCodeClient } from "@/components/ReferralCodeClient";

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
  return {
    title: {
      default: "Tenerifly.io - Accommodation, Tours and Car Rental in Tenerife",
      template: "%s | Tenerifly.io",
    },
    description:
      "Find your perfect accommodation, tours or car rental in Tenerife. Book directly with local providers for the best prices and authentic experiences.",
    keywords: [
      "Tenerife accommodation",
      "Tenerife tours",
      "Tenerife car rental",
      "Tenerife vacation",
      "Tenerife holiday",
      "Tenerife apartments",
      "Tenerife villas",
      "Tenerife activities",
      "Tenerife sightseeing",
      "Tenerife travel",
    ],
    authors: [{ name: "Tenerifly.io" }],
    creator: "Tenerifly.io",
    publisher: "Tenerifly.io",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: "Tenerifly.io - Your Guide to Tenerife",
      description:
        "Find your perfect accommodation, tours or car rental in Tenerife. Book directly with local providers for the best prices and authentic experiences.",
      url: "https://tenerifly.io",
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerifly.io - Your Guide to Tenerife",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Tenerifly.io - Your Guide to Tenerife",
      description:
        "Find your perfect accommodation, tours or car rental in Tenerife. Book directly with local providers for the best prices and authentic experiences.",
      images: [
        "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
      ],
      creator: "@tenerifly",
      site: "@tenerifly",
    },
    metadataBase: new URL("https://tenerifly.io"),
    alternates: {
      canonical: "https://tenerifly.io",
      languages: {
        en: "https://tenerifly.io/en",
        pl: "https://tenerifly.io/pl",
        fr: "https://tenerifly.io/fr",
        ru: "https://tenerifly.io/ru",
        uk: "https://tenerifly.io/uk",
        de: "https://tenerifly.io/de",
        es: "https://tenerifly.io/es",
      },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
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
        <link
          rel="preload"
          href="https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg"
          as="image"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <MantineProvider>
          <ReferralCodeClient />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
