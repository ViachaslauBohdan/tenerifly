"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  COOKIE_CONSENT_EVENT,
  readCookieConsent,
} from "@/lib/cookieConsent";
import { GOOGLE_ADS_ID } from "@/lib/gtag";

export function GoogleAdsTag() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => {
      const accepted = readCookieConsent(window.localStorage) === "accepted";
      setEnabled(accepted);
      document.documentElement.dataset.cookieAds = accepted ? "on" : "off";
    };
    sync();
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
      delete document.documentElement.dataset.cookieAds;
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
