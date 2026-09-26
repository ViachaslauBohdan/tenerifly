"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  publishCookieConsent,
  readCookieConsent,
  type CookieConsentChoice,
} from "@/lib/cookieConsent";
import { useTranslation } from "@/hooks/useTranslation";
import { cookieConsentCopy } from "./cookieConsentCopy";

function syncBannerHeight(node: HTMLElement | null) {
  if (!node) {
    document.documentElement.style.removeProperty("--cookie-banner-height");
    return;
  }
  document.documentElement.style.setProperty(
    "--cookie-banner-height",
    `${node.offsetHeight}px`
  );
}

export function CookieConsentBanner() {
  const { locale, createLocaleLink } = useTranslation();
  const bannerRef = useRef<HTMLDivElement>(null);
  const [choice, setChoice] = useState<CookieConsentChoice | null>(null);
  const [open, setOpen] = useState(true);
  const copy = cookieConsentCopy(locale);

  useEffect(() => {
    setChoice(readCookieConsent(window.localStorage));
  }, []);

  useEffect(() => {
    if (!open) {
      document.documentElement.style.removeProperty("--cookie-banner-height");
      return;
    }

    const node = bannerRef.current;
    syncBannerHeight(node);
    if (!node || typeof ResizeObserver === "undefined") {
      return () => {
        document.documentElement.style.removeProperty("--cookie-banner-height");
      };
    }

    const observer = new ResizeObserver(() => syncBannerHeight(node));
    observer.observe(node);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--cookie-banner-height");
    };
  }, [open]);

  const handleChoice = (next: CookieConsentChoice) => {
    publishCookieConsent(next);
    setChoice(next);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 z-[1100] rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg hover:bg-slate-50 sm:bottom-6 sm:left-6"
        onClick={() => setOpen(true)}
      >
        {copy.manage}
      </button>
    );
  }

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-message"
      className="fixed inset-x-0 bottom-0 z-[1100] border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pb-[max(1rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md sm:rounded-2xl sm:border sm:pb-4"
    >
      <h2 id="cookie-consent-title" className="text-base font-semibold text-slate-950">
        {copy.title}
      </h2>
      <p id="cookie-consent-message" className="mt-1 text-sm leading-relaxed text-slate-600">
        {copy.message}
      </p>
      {choice ? (
        <p className="mt-2 text-sm font-medium text-slate-800">
          {choice === "accepted" ? copy.statusOn : copy.statusOff}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-full bg-[#28a745] px-4 py-2 text-sm font-semibold text-white hover:bg-[#218838]"
          onClick={() => handleChoice("accepted")}
        >
          {copy.accept}
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() => handleChoice("rejected")}
        >
          {copy.reject}
        </button>
        <Link
          href={createLocaleLink("/cookies")}
          className="text-sm text-slate-600 underline underline-offset-2 hover:text-slate-950"
        >
          {copy.policy}
        </Link>
      </div>
    </div>
  );
}
