"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown } from "lucide-react";
import { AtlanticoExcursionCard } from "@/components/AtlanticoExcursionCard";
import { HeroSearchCtaLink } from "@/components/HeroSearchCta";
import { ExcursionsIntermediaryNotice } from "@/components/ExcursionsIntermediaryNotice";
// import { WorldToursHeroSearch } from "@/components/WorldToursHeroSearch";
import translationsJson from "../i18n/main.json";
import { SiteHeader } from "@/components/SiteHeader";
import payJson from "@/i18n/pay.json";
import { ViewAllLink } from "@/components/ViewAllLink";
import { pickLocaleBundle } from "@/types/locale";
import {
  heroBlockStackCompactClass,
  heroCtaWrapCompactClass,
  heroInnerCompactClass,
  heroSectionCompactClass,
  heroTitleCompactClass,
} from "@/lib/heroSearchLayout";

const translations = translationsJson;

type LanguageCode = "en" | "ru" | "ua" | "pl" | "de" | "es" | "fr";

export function LocalePageClient() {
  const { locale, switchLocale, createLocaleLink } = useTranslation();

  const [language, setLanguage] = useState<LanguageCode>(
    (locale || "en") as LanguageCode
  );
  const [mounted, setMounted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const t = pickLocaleBundle(translations, language);
  const payLabels = pickLocaleBundle(payJson, language);
  const excursionsIntermediaryNotice =
    (t.sections.excursions as { intermediaryNotice?: string })
      .intermediaryNotice ?? "";
  const viewExcursionsLabel =
    (t.hero as { viewExcursions?: string }).viewExcursions ??
    "View Excursions";

  // const worldToursBase =
  //   t.hero.worldTours ?? pickLocaleBundle(translations, "en").hero.worldTours;
  // const searchGlobalToursLabel =
  //   (t.hero as { searchGlobalTours?: string }).searchGlobalTours ??
  //   pickLocaleBundle(translations, "en").hero.searchGlobalTours;
  // const worldToursCopy = {
  //   ...worldToursBase,
  //   search: searchGlobalToursLabel ?? worldToursBase.search,
  // };

  useEffect(() => {
    setMounted(true);
    setLanguage(locale as LanguageCode);
  }, [locale]);

  const handleLanguageChange = (langCode: LanguageCode) => {
    switchLocale(langCode);
  };

  const scrollToSection = useCallback(
    (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    []
  );

  if (!mounted) {
    return null;
  }

  return (
    <main>
      <SiteHeader
        language={language}
        onLanguageChange={handleLanguageChange}
        selectLanguageLabel={t.selectLanguage}
        excursionsLabel={t.hero.tabs.excursions}
        variant="home"
        payByCardLabel={payLabels.navLabel}
        createLocaleLink={createLocaleLink}
        onScrollToSection={scrollToSection}
      />

      <section
        id="home"
        className={heroSectionCompactClass}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg')`,
        }}
      >
        <div className={`${heroInnerCompactClass} gap-6 sm:gap-8`}>
          <div className={heroBlockStackCompactClass}>
            <div className="text-center">
              {excursionsIntermediaryNotice ? (
                <ExcursionsIntermediaryNotice
                  text={excursionsIntermediaryNotice}
                  as="h1"
                  variant="hero"
                  className="mx-auto max-w-3xl"
                />
              ) : (
                <h1 className={`${heroTitleCompactClass} mb-0`}>
                  {t.hero.title}
                </h1>
              )}
              <p className="mt-3 text-lg text-white/90 sm:mt-4 sm:text-xl">
                {excursionsIntermediaryNotice
                  ? t.hero.title
                  : t.sections.excursions.subtitle}
              </p>
            </div>
            <div className={heroCtaWrapCompactClass}>
              <HeroSearchCtaLink
                href={createLocaleLink("/tours")}
                label={viewExcursionsLabel}
                className="w-full rounded-xl text-base min-h-[52px] py-3.5 sm:min-h-[68px] sm:px-8 sm:text-lg sm:!normal-case sm:!tracking-normal"
              />
            </div>
          </div>
          {/* World tours — disabled
          <div className={heroBlockStackCompactClass}>
            <h2 className={`${heroTitleCompactClass} text-center`}>
              {worldToursCopy.heading}
            </h2>
            <WorldToursHeroSearch
              href={createLocaleLink("/world-tours")}
              labels={worldToursCopy}
            />
          </div>
          */}
        </div>
      </section>

      <section
        id="excursions"
        className="scroll-mt-[6.5rem] bg-white py-20 md:scroll-mt-16"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:mb-14 sm:flex-row md:mb-14">
            <div className="w-full flex-1 text-center sm:w-auto sm:text-left">
              {excursionsIntermediaryNotice ? (
                <ExcursionsIntermediaryNotice
                  text={excursionsIntermediaryNotice}
                  as="h2"
                  variant="section"
                  className="mx-auto max-w-3xl sm:mx-0"
                />
              ) : (
                <h2 className="mb-4 text-4xl font-bold text-gray-900">
                  {t.sections.excursions.title}
                </h2>
              )}
              <p className="mx-auto max-w-3xl text-xl text-gray-600 sm:mx-0">
                {t.sections.excursions.subtitle}
              </p>
            </div>
            <ViewAllLink
              href={createLocaleLink("/tours")}
              className="sm:ml-8"
            >
              {t.sections.excursions.viewAll}
            </ViewAllLink>
          </div>

          <AtlanticoExcursionCard locale={language} variant="home" />
        </div>
      </section>

      <section
        id="faq"
        className="scroll-mt-[6.5rem] bg-gray-50 py-20 md:scroll-mt-16"
      >
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              {t.faq.title}
            </h2>
            <p className="text-lg text-gray-600">{t.faq.subtitle}</p>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() =>
                  setExpandedFaq(expandedFaq === "preBook" ? null : "preBook")
                }
                className="flex w-full items-center justify-between bg-white px-6 py-4 text-left transition-colors hover:bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {t.faq.preBook.question}
                </h3>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${expandedFaq === "preBook" ? "rotate-180" : ""}`}
                />
              </button>
              {expandedFaq === "preBook" && (
                <div className="bg-gray-50 px-6 pb-4">
                  <p className="whitespace-pre-line leading-relaxed text-gray-700">
                    {t.faq.preBook.answer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
