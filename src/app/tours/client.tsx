"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { localeDisplayCode } from "@/types/locale";
import translations from "@/i18n/tours.json";
import mainJson from "@/i18n/main.json";
import {
  ATLANTICO_EXCURSIONS_AFFILIATE_URL,
  NEREIZERDIE_EXCURSIONS_URL,
} from "@/lib/excursionAggregatorUrls";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

type Lang = "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es";

type MainBundle = {
  sections?: { excursions?: { title?: string; subtitle?: string } };
};

export default function ToursPageClient() {
  const { locale, switchLocale, createLocaleLink } = useTranslation();
  const [language, setLanguage] = useState<Lang>(locale as Lang);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    setLanguage(locale as Lang);
  }, [locale]);

  const t = translations[language];
  const currentLanguage = languages.find((lang) => lang.code === language);
  const mainT = (mainJson as Record<string, MainBundle>)[language];
  const excursionSection = mainT?.sections?.excursions;

  const handleLanguageChange = (langCode: Lang) => {
    switchLocale(langCode);
    setIsLanguageDropdownOpen(false);
  };

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
              : language === "uk"
                ? "Автобусні тури, парки, море та VIP."
                : "Coach tours, parks, boat trips & VIP.";

  const nereBlurb =
    language === "ru"
      ? "Шоу, лодки, парки и активный отдых — Viajes Nere Izerdie."
      : language === "pl"
        ? "Showy, łodzie, parki i aktywności — Viajes Nere Izerdie."
        : language === "fr"
          ? "Spectacles, bateaux, parcs et activités — Viajes Nere Izerdie."
          : language === "de"
            ? "Shows, Boote, Parks und Aktivitäten — Viajes Nere Izerdie."
            : language === "es"
              ? "Espectáculos, barcos, parques y aventura — Viajes Nere Izerdie."
              : language === "uk"
                ? "Шоу, човни, парки та активності — Viajes Nere Izerdie."
                : "Shows, boats, theme parks & adventure — Viajes Nere Izerdie.";

  const ctaAtlantico =
    language === "ru"
      ? "Все туры"
      : language === "pl"
        ? "Wszystkie wycieczki"
        : language === "fr"
          ? "Toutes les visites"
          : language === "de"
            ? "Alle Touren"
            : language === "es"
              ? "Todos los tours"
              : language === "uk"
                ? "Всі тури"
                : "View all tours";

  const ctaNere =
    language === "ru"
      ? "Каталог"
      : language === "pl"
        ? "Katalog"
        : language === "fr"
          ? "Catalogue"
          : language === "de"
            ? "Katalog"
            : language === "es"
              ? "Catálogo"
              : language === "uk"
                ? "Каталог"
                : "Open catalogue";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Link
            href={createLocaleLink("/")}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t.backToHome}
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
              }
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <span className="text-xl">{currentLanguage?.flag}</span>
              <span className="font-medium text-gray-700 hidden sm:block">
                {currentLanguage?.name}
              </span>
              <span className="font-medium text-gray-700 sm:hidden">
                {localeDisplayCode(currentLanguage?.code)}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isLanguageDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    {t.selectLanguage}
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageChange(lang.code as Lang)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${
                        language === lang.code
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                      {language === lang.code && (
                        <svg
                          className="w-4 h-4 ml-auto text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {excursionSection?.title ?? t.toursInTenerife}
          </h1>
          {excursionSection?.subtitle ? (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {excursionSection.subtitle}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                <p className="text-sm text-gray-600 line-clamp-2">
                  {atlanticoBlurb}
                </p>
              </div>
              <div className="flex-shrink-0">
                <a
                  href={ATLANTICO_EXCURSIONS_AFFILIATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  {ctaAtlantico}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 p-4 md:p-5">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                  Viajes Nere Izerdie
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">{nereBlurb}</p>
              </div>
              <div className="flex-shrink-0">
                <a
                  href={NEREIZERDIE_EXCURSIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  {ctaNere}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {isLanguageDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            role="presentation"
            onClick={() => setIsLanguageDropdownOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
