"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { OtpuskTourSearchSection } from "@/components/OtpuskTourSearchSection";
import {
  SiteHeader,
  type SiteHeaderLanguage,
} from "@/components/SiteHeader";
import { TourTaglinesHeader } from "@/components/TourTaglinesHeader";

export default function WorldToursPageClient() {
  const { locale, switchLocale, createLocaleLink, t } = useTranslation();
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
        tabLabels={{
          accommodation: t.hero.tabs.accommodation,
          cars: t.hero.tabs.cars,
          excursions: t.hero.tabs.excursions,
          blog: t.hero.tabs.blog,
        }}
        variant="standalone"
        activePage="world-tours"
        createLocaleLink={createLocaleLink}
      />

      <div className="pt-[5.5rem] min-[400px]:pt-[6rem] sm:pt-[6.25rem] md:pt-16">
        <div className="mx-auto max-w-5xl px-3 pt-4 min-[400px]:px-4 sm:pt-6">
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
