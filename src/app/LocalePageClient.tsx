"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { ChevronDown, MapPin, Phone } from "lucide-react";
import { HeroSearchCtaLink } from "@/components/HeroSearchCta";
import translationsJson from "../i18n/main.json";
import { SiteHeader } from "@/components/SiteHeader";
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
  const viewExcursionsLabel =
    (t.hero as { viewExcursions?: string }).viewExcursions ??
    (
      pickLocaleBundle(translations, "en").hero as {
        viewExcursions?: string;
      }
    ).viewExcursions ??
    "View Excursions";

  const atlanticoTagline =
    language === "ru"
      ? "Больше туров и активностей"
      : language === "pl"
        ? "Więcej wycieczek i aktywności"
        : language === "fr"
          ? "Plus de visites et d'activités"
          : language === "de"
            ? "Mehr Touren & Aktivitäten"
            : language === "es"
              ? "Más tours y actividades"
              : language === "ua"
                ? "Більше турів та активностей"
                : "More tours & activities";

  const atlanticoPartnerTitle =
    language === "ru"
      ? "Наш партнёр Atlántico Excursiones"
      : language === "pl"
        ? "Nasz partner: Atlántico Excursiones"
        : language === "fr"
          ? "Notre partenaire Atlántico Excursiones"
          : language === "de"
            ? "Unser Partner Atlántico Excursiones"
            : language === "es"
              ? "Nuestro socio Atlántico Excursiones"
              : language === "ua"
                ? "Партнер Atlántico Excursiones"
                : "Our partner Atlántico Excursiones";

  const atlanticoDescription =
    language === "ru"
      ? "Автобусные туры, тематические парки, морские прогулки и VIP — бронируйте с Atlántico Excursiones."
      : language === "pl"
        ? "Wycieczki autokarowe, parki rozrywki, rejsy i VIP — rezerwuj z Atlántico Excursiones."
        : language === "fr"
          ? "Circuits en bus, parcs à thème, croisières et expériences VIP — réservez avec Atlántico Excursiones."
          : language === "de"
            ? "Busreisen, Freizeitparks, Bootstouren und VIP — buchen Sie bei Atlántico Excursiones."
            : language === "es"
              ? "Excursiones en bus, parques temáticos, barcos y experiencias VIP — reserva con Atlántico Excursiones."
              : language === "ua"
                ? "Автобусні тури, парки розваг, морські прогулянки та VIP — бронюйте з Atlántico Excursiones."
                : "Coach tours, theme parks, boat trips and VIP experiences — book with Atlántico Excursiones.";

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
        <div className={heroInnerCompactClass}>
          <div className={heroBlockStackCompactClass}>
            <div className="text-center">
              <h1 className={`${heroTitleCompactClass} mb-0`}>
                {t.hero.title}
              </h1>
              <p className="mt-3 text-lg text-white/90 sm:mt-4 sm:text-xl">
                {t.sections.excursions.subtitle}
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
        </div>
      </section>

      <section
        id="excursions"
        className="scroll-mt-[6.5rem] bg-white py-20 md:scroll-mt-16"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:mb-14 sm:flex-row md:mb-14">
            <div className="w-full flex-1 text-center sm:w-auto sm:text-left">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                {t.sections.excursions.title}
              </h2>
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

          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
              <div className="flex min-h-[280px] items-stretch md:flex">
                <div className="flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:w-2/5 md:p-10">
                  <div className="text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-white">
                      Atlántico Excursiones
                    </h3>
                    <p className="text-sm text-blue-100">{atlanticoTagline}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 md:w-3/5 md:p-10">
                  <h4 className="mb-3 text-xl font-semibold text-gray-900">
                    {atlanticoPartnerTitle}
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-600 md:text-base">
                    {atlanticoDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
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

      <footer className="py-20" style={{ backgroundColor: "#1a1b1e" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold text-white">
                Tenerifly.io
              </h3>
              <p className="mb-4 text-gray-400">{t.footer.description}</p>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Tenerifly. All rights reserved.
              </p>
            </div>
            <div>
              <h4 className="mb-6 text-lg font-semibold text-white">
                {t.footer.contacts}
              </h4>
              <a
                href="tel:+34613211069"
                className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4" />
                +34613211069
              </a>
              <div className="mt-6 space-y-3">
                <Link
                  href={createLocaleLink("/#excursions")}
                  className="block text-gray-400 transition-colors hover:text-white"
                >
                  {t.sections.excursions.title}
                </Link>
                <Link
                  href={createLocaleLink("/#faq")}
                  className="block text-gray-400 transition-colors hover:text-white"
                >
                  {t.faq.title}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
