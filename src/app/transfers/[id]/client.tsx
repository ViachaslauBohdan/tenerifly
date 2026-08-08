"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plane, Users, CheckCircle, Phone } from "lucide-react";
import { DeferredSimpleBookingPopup } from "@/components/DeferredSimpleBookingPopup";
import { useTranslation } from "@/hooks/useTranslation";
import { localeDisplayCode } from "@/types/locale";
import {
  formatTransferPrice,
  getTransferImage,
  getTransferLocaleText,
  Transfer,
} from "@/lib/transfers";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ua", name: "Українська", flag: "🇺🇦" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export default function TransferDetailPageClient({
  transfer,
}: {
  transfer: Transfer;
}) {
  const { locale, switchLocale, createLocaleLink } = useTranslation();
  const [language, setLanguage] = useState(locale);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const copy = getTransferLocaleText(language);
  const currentLanguage = languages.find((lang) => lang.code === language);

  useEffect(() => {
    setLanguage(locale);
  }, [locale]);

  const bookingPrice = `${copy.southAirport}: ${formatTransferPrice(
    transfer,
    "south"
  )}, ${copy.northAirport}: ${formatTransferPrice(transfer, "north")}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Link
            href={createLocaleLink("/#transfers")}
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
            {copy.back}
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <span className="text-xl">{currentLanguage?.flag}</span>
              <span className="font-medium text-gray-700 hidden sm:block">
                {currentLanguage?.name}
              </span>
              <span className="font-medium text-gray-700 sm:hidden">
                {localeDisplayCode(currentLanguage?.code)}
              </span>
            </button>

            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        switchLocale(lang.code as typeof locale);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${
                        language === lang.code
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-video bg-gray-100">
              <img
                src={getTransferImage(transfer)}
                alt={transfer.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-lg">
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700 mb-5">
              <Plane className="w-4 h-4" />
              <span className="text-sm font-medium">{copy.detailTitle}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {transfer.title}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              {transfer.description}
            </p>

            <div className="flex items-center gap-2 text-gray-700 mb-6">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium">
                {transfer.seats} {copy.seats}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="rounded-lg border border-gray-200 p-5">
                <div className="text-sm text-gray-500 mb-2">
                  {copy.southAirport}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatTransferPrice(transfer, "south")}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-5">
                <div className="text-sm text-gray-500 mb-2">
                  {copy.northAirport}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatTransferPrice(transfer, "north")}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {copy.included}
              </h2>
              <div className="space-y-3">
                {copy.includedItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Phone className="w-5 h-5" />
              {copy.bookNow}
            </button>
          </div>
        </div>
      </div>

      {isLanguageDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsLanguageDropdownOpen(false)}
        />
      )}

      {isBookingModalOpen && (
        <DeferredSimpleBookingPopup
          opened={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          item={{
            name: transfer.title,
            price: bookingPrice,
            currency: transfer.currency,
            contactEmail: transfer.contact?.email,
          }}
          mode="contact"
          currentLocale={locale}
        />
      )}
    </div>
  );
}
