"use client";

import { AtlanticoExcursionCard } from "@/components/AtlanticoExcursionCard";
import { useTranslation } from "@/hooks/useTranslation";
import { pickLocaleBundle } from "@/types/locale";
import { CatalogBackLink } from "@/components/CatalogBackLink";
import { CatalogDetailShell } from "@/components/CatalogDetailShell";
import { ExcursionsIntermediaryNotice } from "@/components/ExcursionsIntermediaryNotice";
import translations from "@/i18n/tours.json";
import mainJson from "@/i18n/main.json";

type MainBundle = {
  sections?: {
    excursions?: {
      title?: string;
      subtitle?: string;
      intermediaryNotice?: string;
    };
  };
};

export default function ToursPageClient() {
  const { locale, createLocaleLink } = useTranslation();
  const language = locale;

  const t = pickLocaleBundle(translations, language);
  const mainT = pickLocaleBundle(mainJson as Record<string, MainBundle>, language);
  const excursionSection = mainT?.sections?.excursions;

  return (
    <CatalogDetailShell>
      <CatalogBackLink href={createLocaleLink("/")} label={t.backToHome} />

      <div className="mb-8 text-center">
        {(excursionSection?.intermediaryNotice ?? t.intermediaryNotice) ? (
          <>
            <ExcursionsIntermediaryNotice
              text={
                excursionSection?.intermediaryNotice ??
                t.intermediaryNotice ??
                ""
              }
              as="h1"
              variant="page"
              className="mx-auto max-w-3xl"
            />
            {excursionSection?.subtitle ? (
              <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                {excursionSection.subtitle}
              </p>
            ) : null}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {excursionSection?.title ?? t.toursInTenerife}
            </h1>
            {excursionSection?.subtitle ? (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {excursionSection.subtitle}
              </p>
            ) : null}
          </>
        )}
      </div>

      <AtlanticoExcursionCard locale={language} variant="tours" />
    </CatalogDetailShell>
  );
}
