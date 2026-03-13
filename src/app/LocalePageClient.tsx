"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ChevronDown,
  Check,
  Home,
  Car,
  MapPin,
  Star,
  Clock,
  Users,
  Euro,
  Phone,
  Eye,
  BookOpen,
  Search,
  Mail,
  AlertCircle,
  Wifi,
  WifiOff,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useDataLoader } from "./useDataLoader";
import { SimpleBookingPopup } from "@/components/SimpleBookingPopup";
import translationsJson from "../i18n/main.json";
// Переводы для всех языков
const translations = translationsJson;

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

type LanguageCode = "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es";

interface LocalePageClientProps {
  initialData?: {
    properties: any[];
    cars: any[];
    tours: any[];
    blogs: any[];
  };
}

export function LocalePageClient({ initialData }: LocalePageClientProps) {
  const router = useRouter();
  const { locale, switchLocale, createLocaleLink } = useTranslation();

  // State для языка - инициализируем из URL или по умолчанию английский
  const [language, setLanguage] = useState<LanguageCode>(
    (locale || "en") as LanguageCode
  );
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // State for component
  const [mounted, setMounted] = useState(false);

  // State for search filters
  const [activeTab, setActiveTab] = useState("accommodation");
  const [dates, setDates] = useState(["", ""]);
  const [guests, setGuests] = useState(2);
  const [carType, setCarType] = useState("");
  const [excursionType, setExcursionType] = useState("");
  const [excursionDate, setExcursionDate] = useState("");
  const [excursionPeople, setExcursionPeople] = useState(2);

  // Enhanced filter states to sync with individual pages
  const [accommodationFilters, setAccommodationFilters] = useState({
    propertyType: "",
    rooms: "",
    priceFrom: "",
    priceTo: "",
    city: "",
    district: "Tenerife",
    type: "rent", // rent or sale
  });

  const [carFilters, setCarFilters] = useState({
    brand: "",
    model: "",
    yearFrom: "",
    yearTo: "",
    priceFrom: "",
    priceTo: "",
    fuel: "",
    transmission: "",
    location: "",
    type: "rent", // rent or sale
  });

  const [excursionFilters, setExcursionFilters] = useState({
    location: "",
    tourType: "",
    priceFrom: "",
    priceTo: "",
    duration: "",
    category: "",
    language: "", // Добавляем свойство language
  });

  // State для модального окна бронирования
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState<{
    title: string;
    price?: string;
    currency?: string;
    duration?: string;
    language?: string;
    brand?: string;
    model?: string;
    contact?: { email?: string };
  } | null>(null);

  // State для FAQ секции
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Dynamic filter options extracted from useDataLoader data (same pattern as individual pages)
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [carTypes, setCarTypes] = useState<string[]>([]);
  const [carBrands, setCarBrands] = useState<string[]>([]);
  const [carTransmissions, setCarTransmissions] = useState<string[]>([]);
  const [tourDurations, setTourDurations] = useState<string[]>([]);

  // Advanced search visibility states
  const [showAdvancedAccommodation, setShowAdvancedAccommodation] =
    useState(false);
  const [showAdvancedCars, setShowAdvancedCars] = useState(false);
  const [showAdvancedTours, setShowAdvancedTours] = useState(false);

  const t = translations[language];
  const currentLanguage = languages.find((lang) => lang.code === language);

  const getCarImage = (car: any) => {
    const apiUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://tenerifly.io";
    const rawUrl = car.image || car.images?.[0]?.url;
    if (!rawUrl) return "/placeholder.svg?height=400&width=600";
    if (typeof rawUrl === "string" && rawUrl.startsWith("http")) return rawUrl;
    return `${apiUrl}${rawUrl}`;
  };

  const getCarPrice = (car: any) =>
    car?.rental_prices?.day_1 ?? car?.price ?? 0;

  const getDayText = () =>
    (t as any)?.sections?.cars?.pricePerDay || "day";

  const getLocalizedCurrency = (car: any) => {
    const currency = car?.rental_prices?.currency || "€";
    const currencyMap = (t as any)?.sections?.cars?.currency || {};
    return currencyMap[currency] || currency;
  };

  const getCarFeatures = (car: any) => {
    const parts = [
      car?.specifications?.make,
      car?.specifications?.model,
      car?.type,
      car?.specifications?.fuel,
      car?.specifications?.transmission,
    ].filter(Boolean);
    return parts.join(" • ") || "—";
  };

  // Используем initialData если доступно, иначе загружаем через хук
  const dataFromHook = useDataLoader(mounted, language);
  const { excursions, cars, accommodation, blogPosts, dataLoading } =
    initialData
      ? {
          excursions: initialData.tours || [],
          cars: initialData.cars || [],
          accommodation: initialData.properties || [],
          blogPosts: initialData.blogs || [],
          dataLoading: false,
        }
      : dataFromHook;

  // Extract filter options from useDataLoader data (same pattern as individual pages)
  useEffect(() => {
    if (mounted && accommodation && cars && excursions) {
      // Extract property types from accommodation data
      const propertyTypesArray = [
        ...new Set(
          accommodation
            .map((property: { category?: string }) => property.category)
            .filter(
              (value): value is string =>
                Boolean(value) && typeof value === "string"
            )
        ),
      ].sort();

      // Extract car filter options from cars data
      const carTypesArray = [
        ...new Set(
          cars
            .map((car: { type?: string }) => car.type)
            .filter(
              (value): value is string =>
                Boolean(value) && typeof value === "string"
            )
        ),
      ].sort();

      const carBrandsArray = [
        ...new Set(
          cars
            .map(
              (car: { specifications?: { make?: string } }) =>
                car.specifications?.make
            )
            .filter(
              (value: string | undefined): value is string =>
                Boolean(value) && typeof value === "string"
            )
        ),
      ].sort();

      const carTransmissionsArray = [
        ...new Set(
          cars
            .map(
              (car: { specifications?: { transmission?: string } }) =>
                car.specifications?.transmission
            )
            .filter(
              (value): value is string =>
                Boolean(value) && typeof value === "string"
            )
        ),
      ].sort();

      // Extract tour filter options from excursions data
      const tourDurationsArray = [
        ...new Set(
          excursions
            .map((tour: { duration?: string }) => tour.duration)
            .filter(
              (value): value is string =>
                Boolean(value) && typeof value === "string"
            )
        ),
      ].sort();

      // Set all filter options (simple string arrays like individual pages)
      setPropertyTypes(propertyTypesArray);
      setCarTypes(carTypesArray);
      setCarBrands(carBrandsArray);
      setCarTransmissions(carTransmissionsArray);
      setTourDurations(tourDurationsArray);
    }
  }, [mounted, accommodation, cars, excursions]);

  // Функция для открытия модального окна бронирования
  const openBookingModal = (
    type: "excursion" | "car" | "accommodation",
    item: {
      title: string;
      price?: string;
      currency?: string;
      duration?: string;
      language?: string;
      brand?: string;
      model?: string;
      contact?: { email?: string };
    }
  ) => {
    setBookingItem(item);
    setIsBookingModalOpen(true);
  };

  useEffect(() => {
    setMounted(true);
    setLanguage(locale as LanguageCode);
  }, [locale]);

  // Переключение языка через URL
  const handleLanguageChange = (langCode: LanguageCode) => {
    switchLocale(langCode);
    setIsLanguageDropdownOpen(false);
  };

  // Показываем загрузку до инициализации
  if (!mounted) {
    return null;
  }

  const handleSearch = () => {
    // Build query parameters based on active tab and filters
    const params = new URLSearchParams();

    // Add common date parameters
    if (dates[0]) params.append("checkIn", dates[0]);
    if (dates[1]) params.append("checkOut", dates[1]);

    switch (activeTab) {
      case "excursions":
        // Add excursion-specific filters
        if (excursionType) params.append("tourType", excursionType);
        if (excursionDate) params.append("date", excursionDate);
        if (excursionPeople)
          params.append("people", excursionPeople.toString());
        if (excursionFilters.location)
          params.append("location", excursionFilters.location);
        if (excursionFilters.priceFrom)
          params.append("priceFrom", excursionFilters.priceFrom);
        if (excursionFilters.priceTo)
          params.append("priceTo", excursionFilters.priceTo);
        if (excursionFilters.duration)
          params.append("duration", excursionFilters.duration);
        if (excursionFilters.language)
          params.append("language", excursionFilters.language);
        if (excursionFilters.category)
          params.append("category", excursionFilters.category);
        router.push(`${createLocaleLink("/tours")}?${params.toString()}`);
        break;

      case "cars":
        // Add car-specific filters
        if (carType) params.append("bodyType", carType);
        if (carFilters.brand) params.append("brand", carFilters.brand);
        if (carFilters.model) params.append("model", carFilters.model);
        if (carFilters.yearFrom) params.append("yearFrom", carFilters.yearFrom);
        if (carFilters.yearTo) params.append("yearTo", carFilters.yearTo);
        if (carFilters.priceFrom)
          params.append("priceFrom", carFilters.priceFrom);
        if (carFilters.priceTo) params.append("priceTo", carFilters.priceTo);
        if (carFilters.fuel) params.append("fuel", carFilters.fuel);
        if (carFilters.transmission)
          params.append("transmission", carFilters.transmission);
        if (carFilters.location) params.append("location", carFilters.location);
        if (carFilters.type) params.append("type", carFilters.type);
        router.push(`${createLocaleLink("/cars")}?${params.toString()}`);
        break;

      case "accommodation":
        // Add accommodation-specific filters
        if (accommodationFilters.propertyType)
          params.append("propertyType", accommodationFilters.propertyType);
        if (accommodationFilters.rooms)
          params.append("rooms", accommodationFilters.rooms);
        if (accommodationFilters.priceFrom)
          params.append("priceFrom", accommodationFilters.priceFrom);
        if (accommodationFilters.priceTo)
          params.append("priceTo", accommodationFilters.priceTo);
        if (accommodationFilters.city)
          params.append("city", accommodationFilters.city);
        if (accommodationFilters.district)
          params.append("district", accommodationFilters.district);
        if (accommodationFilters.type)
          params.append("type", accommodationFilters.type);
        if (guests) params.append("guests", guests.toString());
        router.push(`${createLocaleLink("/apartments")}?${params.toString()}`);
        break;

      case "blog":
        router.push(createLocaleLink("/blog"));
        break;
    }
  };

  const EmptyState = ({ type }: { type: "loading" | "error" | "empty" }) => {
    if (type === "loading") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg animate-pulse"
            >
              {/* Image skeleton */}
              <div className="aspect-video bg-gray-200"></div>
              <div className="p-6">
                {/* Title and rating skeleton */}
                <div className="flex justify-between items-start mb-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
                {/* Description skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                {/* Details skeleton */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
                {/* Button skeleton */}
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (type === "error") {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg text-red-600">{t.common.serverError}</p>
        </div>
      );
    }

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <WifiOff className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-lg text-blue-600">{t.common.noData}</p>
      </div>
    );
  };

  return (
    <main>
      {/* Language Selector */}
      <div className="absolute top-5 right-5 z-50">
        <div className="relative">
          <button
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg hover:bg-white transition-all duration-200"
          >
            <span className="text-lg">{currentLanguage?.flag}</span>
            <span className="font-medium text-gray-700 hidden sm:block">
              {currentLanguage?.name}
            </span>
            <span className="font-medium text-gray-700 sm:hidden">
              {currentLanguage?.code.toUpperCase()}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isLanguageDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isLanguageDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
              <div className="py-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  {t.selectLanguage}
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() =>
                      handleLanguageChange(lang.code as LanguageCode)
                    }
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                      language === lang.code
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                    {language === lang.code && (
                      <Check className="w-4 h-4 ml-auto text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative h-screen min-[381px]:h-[80vh] sm:h-[70vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg')`,
        }}
      >
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          {/* Title - moved higher */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg pt-4 sm:pt-0">
              {t.hero.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Search Card - centered */}
          <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            {/* Tabs - изменен порядок, accommodation теперь первый */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  {
                    key: "accommodation",
                    icon: Home,
                    label: t.hero.tabs.accommodation,
                  },
                  { key: "cars", icon: Car, label: t.hero.tabs.cars },
                  {
                    key: "excursions",
                    icon: MapPin,
                    label: t.hero.tabs.excursions,
                  },
                  { key: "blog", icon: BookOpen, label: t.hero.tabs.blog },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === key
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Form Content */}
            <div className="p-4 sm:p-6 pb-8">
              {/* Accommodation Tab */}
              {activeTab === "accommodation" && (
                <div className="space-y-3">
                  {/* First row - Basic filters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.hero.accommodation.type}
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={accommodationFilters.propertyType}
                        onChange={(e) =>
                          setAccommodationFilters({
                            ...accommodationFilters,
                            propertyType: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          {language === "en"
                            ? "Select type"
                            : language === "ru"
                              ? "Выберите тип"
                              : language === "pl"
                                ? "Wybierz typ"
                                : language === "fr"
                                  ? "Sélectionner le type"
                                  : language === "de"
                                    ? "Typ auswählen"
                                    : language === "es"
                                      ? "Seleccionar tipo"
                                      : "Оберіть тип"}
                        </option>
                        {t.hero.accommodation.types.map(
                          (type: { value: string; label: string }) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.hero.accommodation.checkin}
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={dates[0]}
                        onChange={(e) => setDates([e.target.value, dates[1]])}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.hero.accommodation.checkout}
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={dates[1]}
                        onChange={(e) => setDates([dates[0], e.target.value])}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.hero.accommodation.guests}
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="number"
                          min="1"
                          max="10"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Advanced search toggle button */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setShowAdvancedAccommodation(!showAdvancedAccommodation)
                      }
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      {showAdvancedAccommodation ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          {t.common.hideSearch}
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
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
                          {t.common.showSearch}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Second row - Additional filters (expandable) */}
                  {showAdvancedAccommodation && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.hero.accommodation.rooms}
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={accommodationFilters.rooms}
                          onChange={(e) =>
                            setAccommodationFilters({
                              ...accommodationFilters,
                              rooms: e.target.value,
                            })
                          }
                        >
                          {t.hero.accommodation.roomsList?.map(
                            (room: { value: string; label: string }) => (
                              <option key={room.value} value={room.value}>
                                {room.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.common.priceFrom}
                        </label>
                        <input
                          type="number"
                          placeholder="€"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={accommodationFilters.priceFrom}
                          onChange={(e) =>
                            setAccommodationFilters({
                              ...accommodationFilters,
                              priceFrom: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.common.priceTo}
                        </label>
                        <input
                          type="number"
                          placeholder="€"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={accommodationFilters.priceTo}
                          onChange={(e) =>
                            setAccommodationFilters({
                              ...accommodationFilters,
                              priceTo: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.common.type}
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={accommodationFilters.type}
                          onChange={(e) =>
                            setAccommodationFilters({
                              ...accommodationFilters,
                              type: e.target.value,
                            })
                          }
                        >
                          <option value="rent">{t.common.typeRent}</option>
                          <option value="sale">{t.common.typeSale}</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cars Tab */}
              {activeTab === "cars" && (
                <div className="space-y-4">
                  {/* First row - Basic filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.hero.cars.bodyType}
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={carType}
                        onChange={(e) => setCarType(e.target.value)}
                      >
                        {/* <option value="">
                          {language === "en"
                            ? "Select car type"
                            : language === "ru"
                              ? "Выберите тип авто"
                              : language === "pl"
                                ? "Wybierz typ samochodu"
                                : language === "fr"
                                  ? "Sélectionner le type de voiture"
                                  : language === "de"
                                    ? "Auto-Typ auswählen"
                                    : language === "es"
                                      ? "Seleccionar tipo de coche"
                                      : "Оберіть тип авто"}
                        </option> */}
                        {t.hero.cars.bodyTypeOptions.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.hero.cars.pickup}
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={dates[0]}
                        onChange={(e) => setDates([e.target.value, dates[1]])}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.hero.cars.dropoff}
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={dates[1]}
                        onChange={(e) => setDates([dates[0], e.target.value])}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.common.type}
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={carFilters.type}
                        onChange={(e) =>
                          setCarFilters({ ...carFilters, type: e.target.value })
                        }
                      >
                        <option value="rent">{t.common.typeRent}</option>
                        <option value="sale">{t.common.typeSale}</option>
                      </select>
                    </div>
                  </div>

                  {/* Advanced search toggle button */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedCars(!showAdvancedCars)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      {showAdvancedCars ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          {t.common.hideSearch}
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
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
                          {t.common.showSearch}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Second row - Additional filters (expandable) */}
                  {showAdvancedCars && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.hero.cars.brand}
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={carFilters.brand}
                          onChange={(e) =>
                            setCarFilters({
                              ...carFilters,
                              brand: e.target.value,
                            })
                          }
                        >
                          <option value="">{t.common.all}</option>
                          {carBrands.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand.charAt(0).toUpperCase() + brand.slice(1)}
                            </option>
                          ))}
                          {/* {carMarks.map((mark) => (
                            <option key={mark.value} value={mark.value}>
                              {mark.label}
                            </option>
                          ))} */}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.common.priceFrom}
                        </label>
                        <input
                          type="number"
                          placeholder="€"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={carFilters.priceFrom}
                          onChange={(e) =>
                            setCarFilters({
                              ...carFilters,
                              priceFrom: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.common.priceTo}
                        </label>
                        <input
                          type="number"
                          placeholder="€"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={carFilters.priceTo}
                          onChange={(e) =>
                            setCarFilters({
                              ...carFilters,
                              priceTo: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.hero.cars.transmission}
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={carFilters.transmission}
                          onChange={(e) =>
                            setCarFilters({
                              ...carFilters,
                              transmission: e.target.value,
                            })
                          }
                        >
                          <option value="">{t.common.all}</option>
                          {t.hero.cars.transmissionOptions.map(
                            (transmission) => (
                              <option
                                key={transmission.value}
                                value={transmission.value}
                              >
                                {transmission.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Excursions Tab */}
              {activeTab === "excursions" && (
                <div className="space-y-4">
                  {/* First row - Basic filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.hero.excursions.type}
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={excursionType}
                        onChange={(e) => setExcursionType(e.target.value)}
                      >
                        <option value="">
                          {language === "en"
                            ? "Select type"
                            : language === "ru"
                              ? "Выберите тип"
                              : language === "pl"
                                ? "Wybierz typ"
                                : language === "fr"
                                  ? "Sélectionner le type"
                                  : language === "de"
                                    ? "Typ auswählen"
                                    : language === "es"
                                      ? "Seleccionar tipo"
                                      : "Оберіть тип"}
                        </option>
                        {t.hero.excursions.types.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.hero.excursions.date}
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={excursionDate}
                        onChange={(e) => setExcursionDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.hero.excursions.people}
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="number"
                          min="1"
                          max="20"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={excursionPeople}
                          onChange={(e) =>
                            setExcursionPeople(Number(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.hero.excursions.language}
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={excursionFilters.language}
                        onChange={(e) =>
                          setExcursionFilters({
                            ...excursionFilters,
                            language: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          {language === "en"
                            ? "Select language"
                            : language === "ru"
                              ? "Выберите язык"
                              : language === "pl"
                                ? "Wybierz język"
                                : language === "fr"
                                  ? "Sélectionner la langue"
                                  : language === "uk"
                                    ? "Оберіть мову"
                                    : language === "de"
                                      ? "Sprache auswählen"
                                      : "Seleccionar idioma"}
                        </option>
                        {t.hero.excursions.languageOptions.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Advanced search toggle button */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedTours(!showAdvancedTours)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      {showAdvancedTours ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                          {t.common.hideSearch}
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
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
                          {t.common.showSearch}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Second row - Additional filters (expandable) */}
                  {showAdvancedTours && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          placeholder="Any location"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={excursionFilters.location}
                          onChange={(e) =>
                            setExcursionFilters({
                              ...excursionFilters,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.common.priceFrom}
                        </label>
                        <input
                          type="number"
                          placeholder="€"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={excursionFilters.priceFrom}
                          onChange={(e) =>
                            setExcursionFilters({
                              ...excursionFilters,
                              priceFrom: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.common.priceTo}
                        </label>
                        <input
                          type="number"
                          placeholder="€"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={excursionFilters.priceTo}
                          onChange={(e) =>
                            setExcursionFilters({
                              ...excursionFilters,
                              priceTo: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={excursionFilters.duration}
                          onChange={(e) =>
                            setExcursionFilters({
                              ...excursionFilters,
                              duration: e.target.value,
                            })
                          }
                        >
                          {tourDurations.map((duration) => (
                            <option key={duration} value={duration}>
                              {duration.charAt(0).toUpperCase() +
                                duration.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Blog Tab */}
              {activeTab === "blog" && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === "en"
                      ? "Discover Our Blog"
                      : language === "ru"
                        ? "Откройте наш блог"
                        : language === "pl"
                          ? "Odkryj nasz blog"
                          : language === "fr"
                            ? "Découvrez notre blog"
                            : language === "uk"
                              ? "Відкрийте наш блог"
                              : language === "de"
                                ? "Unser Blog entdecken"
                                : language === "es"
                                  ? "Descubre nuestro blog"
                                  : "Відкрийте наш блог"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {language === "en"
                      ? "Read about the best places, tips and experiences in Tenerife"
                      : language === "ru"
                        ? "Читайте о лучших местах, советах и впечатлениях на Тенерифе"
                        : language === "pl"
                          ? "Czytaj o najlepszych miejscach, wskazówkach i doświadczeniach na Teneryfie"
                          : language === "fr"
                            ? "Lisez sur les meilleurs endroits, conseils et expériences à Tenerife"
                            : language === "uk"
                              ? "Читайте про найкращі місця, поради та враження на Тенеріфе"
                              : language === "de"
                                ? "Lesen Sie über die besten Orte, Tipps und Erfahrungen auf Teneriffa"
                                : language === "es"
                                  ? "Lee sobre los mejores lugares, consejos y experiencias en Tenerife"
                                  : "Читайте про найкращі місця, поради та враження на Тенеріфе"}
                  </p>
                  <button
                    onClick={() => router.push(createLocaleLink("/blog"))}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    {language === "en"
                      ? "Visit Blog"
                      : language === "ru"
                        ? "Перейти в блог"
                        : language === "pl"
                          ? "Odwiedź blog"
                          : language === "fr"
                            ? "Visiter le blog"
                            : language === "uk"
                              ? "Відвідати блог"
                              : language === "de"
                                ? "Blog besuchen"
                                : language === "es"
                                  ? "Visitar el blog"
                                  : "Відвідати блог"}
                  </button>
                </div>
              )}

              {/* Search Button */}
              {activeTab !== "blog" && (
                <button
                  onClick={handleSearch}
                  className="w-full mt-6 mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
                >
                  <Search className="w-5 h-5" />
                  {t.hero.search}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Секция недвижимости */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div className="text-center flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t.sections.accommodation.title}
              </h2>
              <p className="text-xl text-gray-600">
                {t.sections.accommodation.subtitle}
              </p>
            </div>
            <button
              onClick={() => router.push(createLocaleLink("/apartments"))}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl ml-8"
            >
              {t.sections.accommodation.viewAll}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {dataLoading ? (
            <EmptyState type="loading" />
          ) : accommodation.length === 0 ? (
            <EmptyState type="empty" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {accommodation.map(
                (place, index) =>
                  index < 3 && (
                    <div
                      key={place.id || index}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={place.image || "/placeholder.svg"}
                          alt={place.title}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          onClick={() =>
                            router.push(
                              createLocaleLink(
                                `/apartments/${place.documentId}`
                              )
                            )
                          }
                        />
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() =>
                              router.push(
                                createLocaleLink(
                                  `/apartments/${place.documentId}`
                                )
                              )
                            }
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 sm:hidden"
                          >
                            <svg
                              className="w-4 h-4 text-gray-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {place.title}
                          </h3>
                          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-yellow-700">
                              {place.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {place.description}
                        </p>
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {t.sections.accommodation.location}:{" "}
                              {place.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Home className="w-4 h-4" />
                            <span>
                              {t.sections.accommodation.amenities}:{" "}
                              {place.amenities}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Euro className="w-4 h-4" />
                            <span>{place.price}</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              openBookingModal("accommodation", {
                                title: place.title,
                                price: place.price,
                                currency: place.currency,
                                duration: place.duration,
                                language: place.language,
                                brand: place.brand,
                                model: place.model,
                                contact: place.contact,
                              })
                            }
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {t.common.bookNow}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Секция автомобилей */}
      <section className="pt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div className="text-center flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t.sections.cars.title}
              </h2>
              <p className="text-xl text-gray-600">
                {t.sections.cars.subtitle}
              </p>
            </div>
            <button
              onClick={() => router.push(createLocaleLink("/cars"))}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl ml-8"
            >
              {t.sections.cars.viewAll}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Баннер партнерского сервиса аренды авто (Canarias.com) */}
          <div className="flex justify-center mb-10">
            <a
              href="https://rentacar.canarias.com/de?affiliateid=VA20022026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src="https://rentacar.canarias.com/Content/images/banner/afiliados-themes/1/dim6DE.jpg"
                alt="rentacar canarias.com"
                className="max-w-full h-auto"
              />
            </a>
          </div>

          {dataLoading ? (
            <EmptyState type="loading" />
          ) : cars.length === 0 ? (
            <EmptyState type="empty" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map(
                (car, index) =>
                  index < 3 && (
                    <div
                      key={car.id || index}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={getCarImage(car)}
                          alt={car.title}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          onClick={() =>
                            router.push(
                              createLocaleLink(`/cars/${car.documentId}`)
                            )
                          }
                        />
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() =>
                              router.push(
                                createLocaleLink(`/cars/${car.documentId}`)
                              )
                            }
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 sm:hidden"
                          >
                            <svg
                              className="w-4 h-4 text-gray-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {car.title}
                          </h3>
                          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-yellow-700">
                              {car.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {car.description}
                        </p>
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Car className="w-4 h-4" />
                            <span>
                              {t.sections.cars.transmission}:{" "}
                              {car.specifications?.transmission || "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Home className="w-4 h-4" />
                            <span>
                              {t.sections.cars.features}: {getCarFeatures(car)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Euro className="w-4 h-4" />
                            <span>
                              {getLocalizedCurrency(car)}
                              {getCarPrice(car)}/{getDayText()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              openBookingModal("car", {
                                title: car.title,
                                price: `${getLocalizedCurrency(car)}${getCarPrice(car)}/${getDayText()}`,
                                brand: car.specifications?.make,
                                model: car.specifications?.model,
                                duration: car.duration,
                                language: car.language,
                                contact: car.contact,
                              })
                            }
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {t.common.bookNow}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Секция экскурсий */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div className="text-center flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t.sections.excursions.title}
              </h2>
              <p className="text-xl text-gray-600">
                {t.sections.excursions.subtitle}
              </p>
            </div>
            <button
              onClick={() => router.push(createLocaleLink("/tours"))}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl ml-8"
            >
              {t.sections.excursions.viewAll}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {dataLoading ? (
            <EmptyState type="loading" />
          ) : excursions.length === 0 ? (
            <EmptyState type="empty" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(() => {
                return excursions.map(
                  (excursion, index) =>
                    index < 3 && (
                      <div
                        key={excursion.id || index}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={excursion.image || "/placeholder.svg"}
                            alt={excursion.title}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() =>
                              router.push(
                                createLocaleLink(
                                  `/tours/${excursion.documentId || index + 1}`
                                )
                              )
                            }
                          />
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/tours/${excursion.documentId || index + 1}`
                                )
                              }
                              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 sm:hidden"
                            >
                              <svg
                                className="w-4 h-4 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {excursion.title}
                            </h3>
                            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium text-yellow-700">
                                {excursion.rating}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {excursion.description}
                          </p>
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                {t.sections.excursions.duration}:{" "}
                                {excursion.duration}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>
                                {t.sections.excursions.groupSize}:{" "}
                                {excursion.groupSize}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Euro className="w-4 h-4" />
                              <span>
                                {t.sections.excursions.price}: {excursion.price}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                openBookingModal("excursion", {
                                  title: excursion.title,
                                  price: excursion.price,
                                  duration: excursion.duration,
                                  language: "English",
                                  brand: excursion.brand,
                                  model: excursion.model,
                                  contact: excursion.contact,
                                })
                              }
                              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              {t.common.bookNow}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                );
              })()}
            </div>
          )}
        </div>
      </section>

      {/* Мини-секция Atlántico Excursiones */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 hover:shadow-2xl transition-all duration-300">
            <div className="md:flex items-center">
              <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Atlántico Excursiones
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {language === "ru" 
                      ? "Больше туров и активностей"
                      : language === "pl"
                      ? "Więcej wycieczek i aktywności"
                      : language === "fr"
                      ? "Plus de visites et d'activités"
                      : language === "de"
                      ? "Mehr Touren & Aktivitäten"
                      : language === "es"
                      ? "Más tours y actividades"
                      : language === "uk"
                      ? "Більше турів та активностей"
                      : "More Tours & Activities"}
                  </p>
                </div>
              </div>
              <div className="md:w-2/3 p-8 md:p-12">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === "ru"
                    ? "Откройте для себя больше экскурсий на Тенерифе"
                    : language === "pl"
                    ? "Odkryj więcej wycieczek na Teneryfie"
                    : language === "fr"
                    ? "Découvrez plus d'excursions à Tenerife"
                    : language === "de"
                    ? "Entdecken Sie mehr Ausflüge auf Teneriffa"
                    : language === "es"
                    ? "Descubre más excursiones en Tenerife"
                    : language === "uk"
                    ? "Відкрийте для себе більше екскурсій на Тенерифі"
                    : "Discover More Excursions in Tenerife"}
                </h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {language === "ru"
                    ? "Исследуйте широкий выбор автобусных туров, тематических парков, морских прогулок, приключенческих мероприятий и VIP-экскурсий. Забронируйте билеты на лучшие развлечения на Тенерифе с Atlántico Excursiones."
                    : language === "pl"
                    ? "Odkryj szeroki wybór wycieczek autokarowych, parków tematycznych, rejsów łodzią, aktywności przygodowych i doświadczeń VIP. Zarezerwuj bilety na najlepsze atrakcje na Teneryfie z Atlántico Excursiones."
                    : language === "fr"
                    ? "Explorez une large sélection de visites en bus, de parcs à thème, de croisières, d'activités d'aventure et d'expériences VIP. Réservez des billets pour les meilleures activités à Tenerife avec Atlántico Excursiones."
                    : language === "de"
                    ? "Entdecken Sie eine große Auswahl an Busreisen, Themenparks, Bootsfahrten, Abenteueraktivitäten und VIP-Erlebnissen. Buchen Sie Tickets für die besten Aktivitäten auf Teneriffa mit Atlántico Excursiones."
                    : language === "es"
                    ? "Explora una amplia selección de excursiones en autobús, parques temáticos, paseos en barco, actividades de aventura y experiencias VIP. Reserva entradas para las mejores actividades en Tenerife con Atlántico Excursiones."
                    : language === "uk"
                    ? "Дослідіть широкий вибір автобусних турів, тематичних парків, морських прогулянок, пригодницьких заходів та VIP-екскурсій. Забронюйте квитки на найкращі розваги на Тенерифі з Atlántico Excursiones."
                    : "Explore a wide selection of coach tours, theme parks, boat trips, adventure activities, and VIP experiences. Book tickets for the best activities in Tenerife with Atlántico Excursiones."}
                </p>
                <a
                  href="https://en.atlanticoexcursiones.com/index.php?afId=3609"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  {language === "ru"
                    ? "Посмотреть все туры"
                    : language === "pl"
                    ? "Zobacz wszystkie wycieczki"
                    : language === "fr"
                    ? "Voir toutes les visites"
                    : language === "de"
                    ? "Alle Touren anzeigen"
                    : language === "es"
                    ? "Ver todos los tours"
                    : language === "uk"
                    ? "Переглянути всі тури"
                    : "View All Tours"}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция блогов */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div className="text-center flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t.sections.blog.title}
              </h2>
              <p className="text-xl text-gray-600">
                {t.sections.blog.subtitle}
              </p>
            </div>
            <button
              onClick={() => router.push(createLocaleLink("/blog"))}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl ml-8"
            >
              {t.sections.blog.viewAll}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {dataLoading ? (
            <EmptyState type="loading" />
          ) : blogPosts.length === 0 ? (
            <EmptyState type="empty" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map(
                (post, index) =>
                  index < 3 && (
                    <div
                      key={post.id || index}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          onClick={() =>
                            router.push(
                              createLocaleLink(
                                `/blog/${post.documentId || index + 1}`
                              )
                            )
                          }
                        />
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/blog/${post.documentId || index + 1}`
                              )
                            }
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 sm:hidden"
                          >
                            <svg
                              className="w-4 h-4 text-gray-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-yellow-700">
                              {post.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {post.description}
                        </p>
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>
                              {t.sections.blog.author}: {post.author}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              {t.sections.blog.readTime}: {post.readTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {t.sections.blog.publishedDate}:{" "}
                              {post.publishedDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              router.push(
                                createLocaleLink(
                                  `/blog/${post.documentId || index + 1}`
                                )
                              )
                            }
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {t.common.readMore}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t.cta.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8">{t.cta.subtitle}</p>
            <button
              onClick={() =>
                openBookingModal("accommodation", {
                  title: "",
                  price: undefined,
                  currency: undefined,
                  duration: undefined,
                  language: undefined,
                  brand: undefined,
                  model: undefined,
                  contact: undefined,
                })
              }
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              <Phone className="w-5 h-5" />
              {t.cta.button}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ секция */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t.faq.title}
            </h2>
            <p className="text-lg text-gray-600">{t.faq.subtitle}</p>
          </div>

          <div className="space-y-4">
            {/* Pre-Book FAQ */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  setExpandedFaq(expandedFaq === "preBook" ? null : "preBook")
                }
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {t.faq.preBook.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${expandedFaq === "preBook" ? "rotate-180" : ""}`}
                />
              </button>
              {expandedFaq === "preBook" && (
                <div className="px-6 pb-4 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {t.faq.preBook.answer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20" style={{ backgroundColor: "#1a1b1e" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Tenerifly.io
              </h3>
              <p className="text-gray-400 mb-4">{t.footer.description}</p>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Tenerifly. All rights reserved.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                {t.footer.services}
              </h4>
              <div className="space-y-3">
                <Link
                  href={createLocaleLink("/cars")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Airport Transfers
                </Link>
                <Link
                  href={createLocaleLink("/tours")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Excursions & Tours
                </Link>
                <Link
                  href={createLocaleLink("/apartments")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Property Rental & Sales
                </Link>
                <Link
                  href="https://rentacar.canarias.com/en?affiliateid=VA20022026"
                  className="block text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="nofollow"
                >
                  Car Rental Services
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                {t.footer.contacts}
              </h4>
              <div className="space-y-3">
                <a
                  href="tel:+34656641433"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +34656641433
                </a>
                <a
                  href="mailto:info@tenerifly.io"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@tenerifly.io
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Click outside to close dropdown */}
      {isLanguageDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsLanguageDropdownOpen(false)}
        />
      )}

      {/* Модальное окно бронирования */}
      {bookingItem && (
        <SimpleBookingPopup
          opened={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setBookingItem(null);
          }}
          item={{
            name: bookingItem.title,
            price: bookingItem.price,
            currency: bookingItem.currency,
            contactEmail: bookingItem.contact?.email,
          }}
          mode="contact"
        />
      )}
    </main>
  );
}
