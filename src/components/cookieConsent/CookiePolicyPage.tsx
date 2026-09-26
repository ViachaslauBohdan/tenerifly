"use client";

import { CatalogBackLink } from "@/components/CatalogBackLink";
import { CatalogDetailShell } from "@/components/CatalogDetailShell";
import { useTranslation } from "@/hooks/useTranslation";
import { GOOGLE_ADS_ID } from "@/lib/gtag";
import { SITE_BRAND, SITE_HOST } from "@/lib/site";
import { SITE_PHONE_E164 } from "@/lib/siteContact";
import { cookiePolicyCopy, fillCookiePolicy } from "./cookiePolicyCopy";

function PolicyText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+|\+\d+)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("http")) {
          const href = part.replace(/[.,)]+$/, "");
          const suffix = part.slice(href.length);
          return (
            <span key={index}>
              <a
                href={href}
                className="underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {href}
              </a>
              {suffix}
            </span>
          );
        }
        if (part.startsWith("+")) {
          return (
            <a key={index} href={`tel:${part}`} className="underline underline-offset-2">
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function CookiePolicyPage() {
  const { locale, createLocaleLink } = useTranslation();
  const copy = cookiePolicyCopy(locale);
  const values = {
    brand: SITE_BRAND,
    host: SITE_HOST,
    phone: SITE_PHONE_E164,
    adsId: GOOGLE_ADS_ID,
  };

  return (
    <CatalogDetailShell>
      <CatalogBackLink
        href={createLocaleLink("/")}
        label={copy.backToHome}
      />
      <article className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
          {copy.title}
        </h1>
        <p className="mb-8 text-base leading-relaxed text-gray-700">
          <PolicyText text={fillCookiePolicy(copy.intro, values)} />
        </p>
        <div className="space-y-4">
          {copy.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-2 text-lg font-semibold text-gray-900">
                {section.title}
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                <PolicyText text={fillCookiePolicy(section.text, values)} />
              </p>
            </section>
          ))}
        </div>
      </article>
    </CatalogDetailShell>
  );
}
