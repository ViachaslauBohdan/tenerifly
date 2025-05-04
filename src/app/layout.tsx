import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { ColorSchemeScript } from '@mantine/core';
import { MantineProvider } from '@/components/providers/MantineProvider';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tenerifly.io - Accommodation, Tours and Car Rental in Tenerife",
    template: "%s | Tenerifly.io"
  },
  description: "Find your perfect accommodation, tours or car rental in Tenerife. Book directly with local providers for the best prices and authentic experiences.",
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
    "Tenerife travel"
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
    description: "Find your perfect accommodation, tours or car rental in Tenerife. Book directly with local providers for the best prices and authentic experiences.",
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
    description: "Find your perfect accommodation, tours or car rental in Tenerife. Book directly with local providers for the best prices and authentic experiences.",
    images: ["https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg"],
    creator: "@tenerifly",
    site: "@tenerifly",
  },
  metadataBase: new URL("https://tenerifly.io"),
  alternates: {
    canonical: "https://tenerifly.io",
    languages: {
      'en-US': 'https://tenerifly.io',
      'es-ES': 'https://tenerifly.io/es',
      'ru-RU': 'https://tenerifly.io/ru',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification',
  },
  other: {
    "telegram:channel": "@tenerifly",
    "telegram:site": "@tenerifly",
    "telegram:creator": "@tenerifly",
    "telegram:image": "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
    "viewport": "width=device-width, initial-scale=1, maximum-scale=5",
    "theme-color": "#ffffff",
    "msapplication-TileColor": "#ffffff",
    "msapplication-config": "/browserconfig.xml",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Tenerifly.io",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <MantineProvider>
          {children}
          <WhatsAppButton />
        </MantineProvider>
      </body>
    </html>
  );
}
