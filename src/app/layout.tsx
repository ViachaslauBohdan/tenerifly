import type {Metadata, Viewport} from "next";
import {headers} from "next/headers";
import {Geist, Geist_Mono} from "next/font/google";
import "../styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import {ColorSchemeScript} from "@mantine/core";
import {MantineProvider} from "@/components/providers/MantineProvider";

import {OtpuskBodyClassGuard} from "@/components/OtpuskBodyClassGuard";
import {
    DeferredReferral,
    DeferredWhatsApp,
} from "@/components/DeferredLayoutWidgets";
import {OTPUSK_BODY_CLASS_GUARD_INLINE} from "@/lib/otpuskBodyClassGuard";
import Script from 'next/script'
import {
    DEFAULT_OG_IMAGE,
    SEO_HOME,
    absoluteUrlForLocale,
    hreflangAlternates,
    openGraphAlternateLocales,
    organizationAndWebsiteJsonLd,
    ogLocale,
} from "@/lib/seo";
import { SITE_BRAND, SITE_URL } from "@/lib/site";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// 7 days — keep in sync with CMS_PAGE_REVALIDATE in src/config/cmsCache.ts
export const revalidate = 604800;

export async function generateMetadata(): Promise<Metadata> {
    const seo = SEO_HOME.en;
    return {
        title: {
            default:
                `${SITE_BRAND} — Tenerife holidays: apartments, car hire & tours (Canary Islands)`,
            template: `%s | ${SITE_BRAND}`,
        },
        description: seo.description,
        keywords: seo.keywords,
        authors: [{name: `${SITE_BRAND}`}],
        creator: `${SITE_BRAND}`,
        publisher: `${SITE_BRAND}`,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        openGraph: {
            title: seo.title,
            description: seo.description,
            url: absoluteUrlForLocale("en", ""),
            siteName: SITE_BRAND,
            images: [
                {
                    url: DEFAULT_OG_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: seo.title,
                },
            ],
            locale: ogLocale("en"),
            alternateLocale: openGraphAlternateLocales("en"),
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: seo.title,
            description: seo.description,
            images: [DEFAULT_OG_IMAGE],
        },
        metadataBase: new URL(SITE_URL),
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

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const headersList = await headers();
    const htmlLang = headersList.get("x-locale") ?? "en";

    return (
        <html
            lang={htmlLang}
            className={`${geistSans.variable} ${geistMono.variable}`}
            suppressHydrationWarning
        >
        <head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationAndWebsiteJsonLd()),
                }}
            />
            <ColorSchemeScript defaultColorScheme="light"/>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap"
                rel="stylesheet"
            />
            <link rel="preload" href={DEFAULT_OG_IMAGE} as="image"/>
        </head>
        <body suppressHydrationWarning>
        <script
            dangerouslySetInnerHTML={{__html: OTPUSK_BODY_CLASS_GUARD_INLINE}}
        />
        <OtpuskBodyClassGuard/>
        <MantineProvider>
            <DeferredReferral/>
            {children}
            <DeferredWhatsApp/>
        </MantineProvider>
        <Script
            src="https://www.googletagmanager.com/gtag/js?id=AW-679583815"
            strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
            {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'AW-679583815');
    `}
        </Script>
        </body>
        </html>
    );
}
