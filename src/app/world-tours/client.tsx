/** World tours page client — disabled (see commented implementation below). */
export default function WorldToursPageClient() {
  return null;
}

/*
"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import payJson from "@/i18n/pay.json";
import { pickLocaleBundle } from "@/types/locale";
import { OtpuskTourSearchSection } from "@/components/OtpuskTourSearchSection";
import {
  SiteHeader,
  type SiteHeaderLanguage,
} from "@/components/SiteHeader";
import { TourTaglinesHeader } from "@/components/TourTaglinesHeader";

export default function WorldToursPageClient() {
  const { locale, switchLocale, createLocaleLink, t } = useTranslation();
  const payLabels = pickLocaleBundle(payJson, locale);
  const [language, setLanguage] = useState<SiteHeaderLanguage>(
    locale as SiteHeaderLanguage
  );
  useEffect(() => {
    setLanguage(locale as SiteHeaderLanguage);
  }, [locale]);

  const handleLanguageChange = (langCode: SiteHeaderLanguage) => {
    switchLocale(langCode);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <SiteHeader
        language={language}
        onLanguageChange={handleLanguageChange}
        selectLanguageLabel={t.selectLanguage}
        excursionsLabel={t.hero.tabs.excursions}
        variant="standalone"
        activePage="world-tours"
        payByCardLabel={payLabels.navLabel}
        createLocaleLink={createLocaleLink}
      />

      <div className="pt-[6.25rem] min-[400px]:pt-[6.5rem] sm:pt-[6.25rem] md:pt-16">
        <div className="mx-auto max-w-5xl px-4 pt-4 min-[400px]:px-5 sm:px-6 sm:pt-6">
          <TourTaglinesHeader
            dreamTrip={t.hero.tourTaglines.dreamTrip}
            tourOfTheDay={t.hero.tourTaglines.tourOfTheDay}
            chooseTour={t.hero.tourTaglines.chooseTour}
            variant="page"
          />
        </div>
        <OtpuskTourSearchSection
          language={language}
          searchContainerId="otpusk-world-search-container"
          tourContainerId="otpusk-world-tour-container"
          className="bg-gray-50 pt-6 pb-16 sm:pt-8 sm:pb-20"
        />
      </div>
    </main>
  );
}
*/
