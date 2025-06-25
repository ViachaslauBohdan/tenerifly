import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../styles/globals.css";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { ColorSchemeScript } from '@mantine/core';
import { MantineProvider } from '@/components/providers/MantineProvider';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ReferralCodeClient } from '@/components/ReferralCodeClient';
import { Locale } from '@/types/locale';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>; 
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'pl' },
    { locale: 'fr' },
    { locale: 'ru' },
    { locale: 'uk' },
  ];
}

export default async function LocaleLayout({ 
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params; 
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <MantineProvider>
          <ReferralCodeClient />
          {children}
          <WhatsAppButton />
        </MantineProvider>
      </body>
    </html>
  );
}