"use client";

import { MapPin } from "lucide-react";
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

  const t = pickLocaleBundle(translations, language) as (typeof translations)["en"] & {
    intermediaryNotice?: string;
  };
  const mainT = pickLocaleBundle(mainJson as Record<string, MainBundle>, language);
  const excursionSection = mainT?.sections?.excursions;

  const atlanticoBlurb =
    language === "ru"
      ? "Автобусные туры, парки, морские прогулки и VIP."
      : language === "pl"
        ? "Wycieczki autokarowe, parki, rejsy i VIP."
        : language === "fr"
          ? "Bus, parcs, croisières et expériences VIP."
          : language === "de"
            ? "Busreisen, Parks, Bootstouren und VIP."
            : language === "es"
              ? "Autobús, parques, barcos y VIP."
              : language === "ua"
                ? "Автобусні тури, парки, море та VIP."
                : "Coach tours, parks, boat trips & VIP.";

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

      <div className="max-w-2xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4 p-4 md:p-5">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                Atlántico Excursiones
              </h2>
              <p className="text-sm text-gray-600 line-clamp-2">{atlanticoBlurb}</p>
            </div>
          </div>
        </div>
      </div>
    </CatalogDetailShell>
  );
}
