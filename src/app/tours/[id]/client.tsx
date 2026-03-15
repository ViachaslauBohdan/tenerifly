"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SimpleBookingPopup } from "@/components/SimpleBookingPopup";
import translations from "@/i18n/tourDetail.json";
interface TourData {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  language: string;
  available_days: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images: Array<{
    id: number;
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  }>;
  location?: {
    address: string;
    city: string;
    region: string;
    postal_code: string;
    latitude: number | null;
    longitude: number | null;
  } | null;
  price?: {
    amount: number;
    currency: string;
    period: string;
  } | null;
  contact?: {
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    telegram: string;
    preferred_contact: string;
  } | null;
}

  

// Языки с флагами
const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

export default function TourDetailPageClient({ tour }: { tour: TourData }) {
  const { locale, switchLocale, createLocaleLink } = useTranslation();
  const [language, setLanguage] = useState<
    "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  >(locale as "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const t = translations[language];
  const currentLanguage = languages.find((lang) => lang.code === language);

  // Синхронизируем язык с URL
  useEffect(() => {
    setLanguage(locale as "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es");
  }, [locale]);

  // Переключение языка через URL
  const handleLanguageChange = (
    langCode: "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  ) => {
    switchLocale(langCode);
    setIsLanguageDropdownOpen(false);
  };

  const getAllImageUrls = (tour: TourData) => {
    if (tour.images && tour.images.length > 0) {
      return tour.images.map((img) => {
        // Если URL уже полный (начинается с http), возвращаем как есть
        if (img.url.startsWith("http")) {
          return img.url;
        }
        // Если URL относительный, добавляем базовый URL Strapi
        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        return `${apiUrl}${img.url}`;
      });
    }
    return ["/placeholder.svg?height=400&width=600"];
  };

  const getPrice = (tour: TourData) => {
    if (tour.price && tour.price.amount) {
      return tour.price.amount;
    }
    return 0;
  };

  const getCurrency = (tour: TourData) => {
    if (tour.price && tour.price.currency) {
      return tour.price.currency;
    }
    return "EUR";
  };

  const getLocation = (tour: TourData) => {
    if (tour.location) {
      const parts = [];
      if (tour.location.city) parts.push(tour.location.city);
      if (tour.location.region) parts.push(tour.location.region);
      return parts.join(", ") || tour.location.address || "—";
    }
    return "—";
  };

  const getLanguageText = (tourLanguage: string) => {
    switch (tourLanguage) {
      case "EN":
        return t.english;
      case "ES":
        return t.spanish;
      case "DE":
        return t.german;
      case "FR":
        return t.french;
      case "RU":
        return t.russian;
      default:
        return tourLanguage;
    }
  };

  const getDurationText = (duration: string) => {
    const hours = parseInt(duration);
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days} ${days === 1 ? t.days.slice(0, -1) : t.days}`;
    }
    return `${hours} ${t.hours}`;
  };

  const getPriceText = (tour: TourData) => {
    const price = getPrice(tour);
    const currency = getCurrency(tour);
    return `${currency} ${price}`;
  };

  const handleOpenBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with Language Switcher */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href={createLocaleLink("/tours")}
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
            {t.backToTours}
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
                {currentLanguage?.code.toUpperCase()}
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

            {/* Dropdown Menu */}
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    {t.selectLanguage}
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() =>
                        handleLanguageChange(
                          lang.code as
                            | "en"
                            | "ru"
                            | "pl"
                            | "fr"
                            | "uk"
                            | "de"
                            | "es"
                        )
                      }
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

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{tour.title}</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            {/* Image Carousel */}
            <div className="mb-8 relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {getAllImageUrls(tour).map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${tour.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 z-10 bg-white/80 hover:bg-white border-2 border-gray-200 shadow-lg" />
                <CarouselNext className="right-4 z-10 bg-white/80 hover:bg-white border-2 border-gray-200 shadow-lg" />
              </Carousel>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t.description}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* Tour Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t.tourDetails}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t.duration}:</span>
                  <span className="font-medium text-gray-900">
                    {getDurationText(tour.duration)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t.location}:</span>
                  <span className="font-medium text-gray-900">
                    {getLocation(tour)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t.guideLanguage}:</span>
                  <span className="font-medium text-gray-900">
                    {getLanguageText(tour.language)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t.pricing}
              </h2>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {getPriceText(tour)}
                </div>
                <div className="text-gray-600 mb-4">
                  {tour.price?.period || "total"}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 xl:sticky xl:top-6">
              {/* Status */}
              <div className="flex gap-2 mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {t.available}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {t.tour}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-6">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm">{getLocation(tour)}</span>
              </div>

              {/* Price Display */}
              <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {getCurrency(tour)} {getPrice(tour).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {tour.price?.period || "total"}
                </div>
              </div>

              {/* Tour Highlights */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Tour Highlights
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 text-blue-600 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      {getDurationText(tour.duration)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 text-green-600 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">
                      {getLanguageText(tour.language)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 text-orange-600 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{getLocation(tour)}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact Button */}
              {tour.contact?.whatsapp && (
                <a
                  href={`https://wa.me/${tour.contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center justify-center mb-3"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  {t.whatsapp}
                </a>
              )}

              {/* Telegram Contact Button */}
              {tour.contact?.telegram && (
                <a
                  href={`https://t.me/${tour.contact.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors flex items-center justify-center mb-3"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  {t.telegram}
                </a>
              )}

              {/* Book Now Button */}
              <button
                onClick={handleOpenBookingModal}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {t.bookNow}
              </button>
            </div>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {isLanguageDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsLanguageDropdownOpen(false)}
          />
        )}

        {/* Booking Modal */}
        {tour && (
          <SimpleBookingPopup
            opened={isBookingModalOpen}
            onClose={handleCloseBookingModal}
            item={{
              name: tour.title,
              price: tour.price
                ? `${tour.price.currency} ${tour.price.amount.toLocaleString()}/${tour.price.period || "total"}`
                : undefined,
              currency: tour.price?.currency,
              contactEmail: tour.contact?.email,
            }}
            currentLocale={locale}
          />
        )}
      </div>
    </div>
  );
}