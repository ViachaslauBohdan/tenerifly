"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { pickLocaleBundle } from "@/types/locale";
import { CatalogBackLink } from "@/components/CatalogBackLink";
import { CatalogDetailShell } from "@/components/CatalogDetailShell";
import mainJson from "@/i18n/main.json";

type LegalPageBundle = {
  legalPage?: {
    title?: string;
    backToHome?: string;
    intermediaryTitle?: string;
    intermediaryText?: string;
  };
};

export default function LegalNoticePageClient() {
  const { locale, createLocaleLink } = useTranslation();
  const bundle = pickLocaleBundle(
    mainJson as Record<string, LegalPageBundle>,
    locale
  );
  const t = bundle.legalPage ?? {};

  return (
    <CatalogDetailShell>
      <CatalogBackLink
        href={createLocaleLink("/")}
        label={t.backToHome ?? "Back to home"}
      />

      <article className="mx-auto max-w-3xl">
        {t.title ? (
          <h1 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
            {t.title}
          </h1>
        ) : null}

        {t.intermediaryTitle && t.intermediaryText ? (
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-base leading-relaxed text-gray-700">
              <span className="font-semibold text-gray-900">
                {t.intermediaryTitle}:{" "}
              </span>
              {t.intermediaryText}
            </p>
          </section>
        ) : null}
      </article>
    </CatalogDetailShell>
  );
}
