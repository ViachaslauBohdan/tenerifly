"use client";

import { AtlanticoTourCatalog } from "@/components/atlantico/AtlanticoTourCatalog";
import { useTranslation } from "@/hooks/useTranslation";
import { pickLocaleBundle } from "@/types/locale";
import { CatalogBackLink } from "@/components/CatalogBackLink";
import { CatalogDetailShell } from "@/components/CatalogDetailShell";
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
  const notice =
    excursionSection?.intermediaryNotice ?? t.intermediaryNotice ?? "";

  return (
    <CatalogDetailShell>
      <CatalogBackLink href={createLocaleLink("/")} label={t.backToHome} />
      {notice ? (
        <p className="mb-8 text-center text-sm text-gray-500">{notice}</p>
      ) : null}
      <AtlanticoTourCatalog locale={language} />
    </CatalogDetailShell>
  );
}
