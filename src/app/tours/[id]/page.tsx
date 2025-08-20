"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SimpleBookingPopup } from "@/components/SimpleBookingPopup";

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

// Переводы для всех языков
const translations = {
  en: {
    backToTours: "Back to Tours",
    available: "AVAILABLE",
    tour: "TOUR",
    contact: "Contact",
    phone: "Phone:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Description",
    tourDetails: "Tour Details",
    duration: "Duration",
    location: "Location",
    guideLanguage: "Guide Language",
    pricing: "Pricing",
    bookNow: "Book",
    selectLanguage: "Select Language",
    hours: "hours",
    days: "days",
    english: "English",
    spanish: "Spanish",
    german: "German",
    french: "French",
    russian: "Russian",
    meetingPoint: "Meeting Point",
    startTime: "Start Time",
    endTime: "End Time",
    cancellationPolicy: "Cancellation Policy",
    freeCancellation: "Free cancellation up to 24 hours before the tour",
    tourNotFound: "Tour not found",
    loading: "Loading...",
    errorLoading: "Error loading tour details",
  },
  ru: {
    backToTours: "Назад к экскурсиям",
    available: "ДОСТУПНА",
    tour: "ЭКСКУРСИЯ",
    contact: "Связаться",
    phone: "Телефон:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Описание",
    tourDetails: "Детали экскурсии",
    duration: "Продолжительность",
    location: "Локация",
    guideLanguage: "Язык гида",
    pricing: "Цены",
    bookNow: "Забронировать",
    selectLanguage: "Выбрать язык",
    hours: "часов",
    days: "дней",
    english: "Английский",
    spanish: "Испанский",
    german: "Немецкий",
    french: "Французский",
    russian: "Русский",
    meetingPoint: "Место встречи",
    startTime: "Время начала",
    endTime: "Время окончания",
    cancellationPolicy: "Условия отмены",
    freeCancellation: "Бесплатная отмена за 24 часа до экскурсии",
    tourNotFound: "Экскурсия не найдена",
    loading: "Загрузка...",
    errorLoading: "Ошибка загрузки деталей экскурсии",
  },
  pl: {
    backToTours: "Powrót do wycieczek",
    available: "DOSTĘPNA",
    tour: "WYCIECZKA",
    contact: "Kontakt",
    phone: "Telefon:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Opis",
    tourDetails: "Szczegóły wycieczki",
    duration: "Czas trwania",
    location: "Lokalizacja",
    guideLanguage: "Język przewodnika",
    pricing: "Ceny",
    bookNow: "Zarezerwuj",
    selectLanguage: "Wybierz język",
    hours: "godzin",
    days: "dni",
    english: "Angielski",
    spanish: "Hiszpański",
    german: "Niemiecki",
    french: "Francuski",
    russian: "Rosyjski",
    meetingPoint: "Punkt spotkania",
    startTime: "Czas rozpoczęcia",
    endTime: "Czas zakończenia",
    cancellationPolicy: "Zasady anulowania",
    freeCancellation: "Bezpłatne anulowanie do 24 godzin przed wycieczką",
    tourNotFound: "Wycieczka nie znaleziona",
    loading: "Ładowanie...",
    errorLoading: "Błąd ładowania szczegółów wycieczki",
  },
  fr: {
    backToTours: "Retour aux excursions",
    available: "DISPONIBLE",
    tour: "EXCURSION",
    contact: "Contact",
    phone: "Téléphone:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Description",
    tourDetails: "Détails de l'excursion",
    duration: "Durée",
    location: "Emplacement",
    guideLanguage: "Langue du guide",
    pricing: "Prix",
    bookNow: "Réserver",
    selectLanguage: "Choisir la langue",
    hours: "heures",
    days: "jours",
    english: "Anglais",
    spanish: "Espagnol",
    german: "Allemand",
    french: "Français",
    russian: "Russe",
    meetingPoint: "Point de rendez-vous",
    startTime: "Heure de début",
    endTime: "Heure de fin",
    cancellationPolicy: "Politique d'annulation",
    freeCancellation: "Annulation gratuite jusqu'à 24 heures avant l'excursion",
    tourNotFound: "Excursion non trouvée",
    loading: "Chargement...",
    errorLoading: "Erreur de chargement des détails de l'excursion",
  },
  uk: {
    backToTours: "Назад до екскурсій",
    available: "ДОСТУПНА",
    tour: "ЕКСКУРСІЯ",
    contact: "Зв'язатися",
    phone: "Телефон:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Опис",
    tourDetails: "Деталі екскурсії",
    duration: "Тривалість",
    location: "Локація",
    guideLanguage: "Мова гіда",
    pricing: "Ціни",
    bookNow: "Забронювати",
    selectLanguage: "Обрати мову",
    hours: "годин",
    days: "днів",
    english: "Англійська",
    spanish: "Іспанська",
    german: "Німецька",
    french: "Французька",
    russian: "Російська",
    meetingPoint: "Місце зустрічі",
    startTime: "Час початку",
    endTime: "Час закінчення",
    cancellationPolicy: "Умови скасування",
    freeCancellation: "Безкоштовне скасування за 24 години до екскурсії",
    tourNotFound: "Екскурсію не знайдено",
    loading: "Завантаження...",
    errorLoading: "Помилка завантаження деталей екскурсії",
  },
  de: {
    backToTours: "Zurück zu den Touren",
    available: "VERFÜGBAR",
    tour: "TOUR",
    contact: "Kontakt",
    phone: "Telefon:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Beschreibung",
    tourDetails: "Tourdetails",
    duration: "Dauer",
    location: "Standort",
    guideLanguage: "Sprache des Reiseführers",
    pricing: "Preise",
    bookNow: "Buchen",
    selectLanguage: "Sprache auswählen",
    hours: "Stunden",
    days: "Tage",
    english: "Englisch",
    spanish: "Spanisch",
    german: "Deutsch",
    french: "Französisch",
    russian: "Russisch",
    meetingPoint: "Treffpunkt",
    startTime: "Startzeit",
    endTime: "Endzeit",
    cancellationPolicy: "Stornierungsbedingungen",
    freeCancellation: "Kostenlose Stornierung bis zu 24 Stunden vor der Tour",
    tourNotFound: "Tour nicht gefunden",
    loading: "Wird geladen...",
    errorLoading: "Fehler beim Laden der Tourdetails",
  },
  es: {
    backToTours: "Volver a las excursiones",
    available: "DISPONIBLE",
    tour: "EXCURSIÓN",
    contact: "Contactar",
    phone: "Teléfono:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Descripción",
    tourDetails: "Detalles de la excursión",
    duration: "Duración",
    location: "Ubicación",
    guideLanguage: "Idioma del guía",
    pricing: "Precios",
    bookNow: "Reservar",
    selectLanguage: "Seleccionar idioma",
    hours: "horas",
    days: "días",
    english: "Inglés",
    spanish: "Español",
    german: "Alemán",
    french: "Francés",
    russian: "Ruso",
    meetingPoint: "Punto de encuentro",
    startTime: "Hora de inicio",
    endTime: "Hora de finalización",
    cancellationPolicy: "Política de cancelación",
    freeCancellation:
      "Cancelación gratuita hasta 24 horas antes de la excursión",
    tourNotFound: "Excursión no encontrada",
    loading: "Cargando...",
    errorLoading: "Error al cargar detalles de la excursión",
  },
};

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

export default function TourDetailPage() {
  const params = useParams();
  const tourDocumentId = params.id as string;
  const [language, setLanguage] = useState<
    "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  >("en");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [tour, setTour] = useState<TourData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const t = translations[language];
  const currentLanguage = languages.find((lang) => lang.code === language);

  // Функция для создания заголовков с авторизацией
  const getAuthHeaders = () => {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Загрузка сохраненного языка из localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (
      savedLanguage &&
      translations[savedLanguage as keyof typeof translations]
    ) {
      setLanguage(
        savedLanguage as "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
      );
    }
  }, []);

  // Загрузка данных экскурсии
  useEffect(() => {
    const fetchTour = async () => {
      if (!tourDocumentId) return;

      try {
        setLoading(true);
        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        console.log("TourDetail API URL:", apiUrl); // Для отладки

        const response = await fetch(
          `${apiUrl}/api/tours/${tourDocumentId}?populate=*`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(`Tour not found: ${response.status}`);
        }

        const data = await response.json();
        setTour(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching tour:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourDocumentId]);

  // Сохранение языка в localStorage
  const handleLanguageChange = (
    langCode: "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  ) => {
    setLanguage(langCode);
    localStorage.setItem("selectedLanguage", langCode);
    setIsLanguageDropdownOpen(false);
  };

  const getImageUrl = (tour: TourData) => {
    if (tour.images && tour.images.length > 0) {
      // Если URL уже полный (начинается с http), возвращаем как есть
      if (tour.images[0].url.startsWith("http")) {
        return tour.images[0].url;
      }
      // Если URL относительный, добавляем базовый URL Strapi
      const apiUrl =
        process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
      return `${apiUrl}${tour.images[0].url}`;
    }
    return "/placeholder.svg?height=400&width=600";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-medium text-gray-900">{t.loading}</h1>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t.tourNotFound}
          </h1>
          <p className="text-gray-600 mb-4">{error || t.errorLoading}</p>
          <Link href="/tours" className="text-blue-600 hover:text-blue-800">
            {t.backToTours}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with Language Switcher */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/tours"
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
          />
        )}
      </div>
    </div>
  );
}
