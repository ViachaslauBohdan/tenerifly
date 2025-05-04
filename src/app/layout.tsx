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
  title: "Tenerifly.io - Accommodation, Tours and Car Rental in Tenerife",
  description: "Find your perfect accommodation, tours or car rental in Tenerife",
  openGraph: {
    title: "Tenerifly.io - Your Guide to Tenerife",
    description: "Find your perfect accommodation, tours or car rental in Tenerife",
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
    description: "Find your perfect accommodation, tours or car rental in Tenerife",
    images: ["https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg"],
  },
  metadataBase: new URL("https://tenerifly.io"),
  other: {
    "telegram:channel": "@tenerifly",
    "telegram:site": "@tenerifly",
    "telegram:creator": "@tenerifly",
    "telegram:image": "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
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
