"use client";
import { useState, useEffect, useMemo, useCallback, type ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ChevronDown,
  Home,
  Car,
  MapPin,
  Star,
  Clock,
  Users,
  Phone,
  Eye,
  BookOpen,
  Search,
  AlertCircle,
  Wifi,
  WifiOff,
  Calendar,
  User,
  ArrowRight,
  Plane,
} from "lucide-react";
import { useDataLoader } from "./useDataLoader";
import { SimpleBookingPopup } from "@/components/SimpleBookingPopup";
import translationsJson from "../i18n/main.json";
import { SiteHeader } from "@/components/SiteHeader";
import {
  formatTransferPrice,
  getTransferImage,
  getTransferLocaleText,
  Transfer,
} from "@/lib/transfers";
import { getCanariasRentacarBannerImageUrl } from "@/lib/canariasAffiliate";
import {
  TileCarPrice,
  TilePriceBadge,
  formatTileAmount,
} from "@/components/TilePriceBadge";
import {
  localeDisplayCode,
  pickLocaleBundle,
  type Locale,
} from "@/types/locale";
import { type HeroTab, parseHeroTab, isHeroTab } from "@/lib/heroTab";
// Переводы для всех языков
const translations = translationsJson;

// Языки с флагами
const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ua", name: "Українська", flag: "🇺🇦" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

type LanguageCode = "en" | "ru" | "pl" | "fr" | "ua" | "de" | "es";

interface LocalePageClientProps {
  initialData?: {
    properties: any[];
    cars: any[];
    tours: any[];
    blogs: any[];
    transfers?: Transfer[];
  };
}

function CompactSearchField({
  label,
  children,
  className = "",
  hideLabel = false,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  hideLabel?: boolean;
}) {
  return (
    <div
        className={`flex min-w-0 flex-1 flex-col justify-center px-2.5 sm:px-3 ${
          hideLabel ? "py-0" : "py-1.5 sm:py-2"
        } ${className}`}
    >
      {hideLabel ? (
        <span className="sr-only">{label}</span>
      ) : (
        <span className="mb-0.5 truncate text-[10px] font-medium leading-none text-gray-500 sm:text-[11px]">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

export function LocalePageClient({ initialData }: LocalePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale, switchLocale, createLocaleLink } = useTranslation();

  // State для языка - инициализируем из URL или по умолчанию английский
  const [language, setLanguage] = useState<LanguageCode>(
    (locale || "en") as LanguageCode
  );
  // State for component
  const [mounted, setMounted] = useState(false);

  // State for search filters (synced with ?tab= query for shareable links)
  const [activeTab, setActiveTab] = useState<HeroTab>(() =>
    parseHeroTab(searchParams.get("tab"))
  );
  const [dates, setDates] = useState(["", ""]);
  const [guests, setGuests] = useState(2);
  const [carType, setCarType] = useState("");

  // Enhanced filter states to sync with individual pages
  const [accommodationFilters, setAccommodationFilters] = useState({
    rooms: "",
    priceFrom: "",
    priceTo: "",
    city: "",
    district: "Tenerife",
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
  });

  const [tourLanguage, setTourLanguage] = useState("en");

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
  const [carTypes, setCarTypes] = useState<string[]>([]);
  const [carBrands, setCarBrands] = useState<string[]>([]);
  const [carTransmissions, setCarTransmissions] = useState<string[]>([]);

  const t = pickLocaleBundle(translations, language);
  const transferCopy = getTransferLocaleText(language);
  const datePlaceholder =
    language === "ru"
      ? "Выберите дату"
      : language === "pl"
        ? "Wybierz datę"
        : language === "fr"
          ? "Choisir une date"
          : language === "ua"
            ? "Оберіть дату"
            : language === "de"
              ? "Datum wählen"
              : language === "es"
                ? "Elegir fecha"
                : "Choose date";
  const fieldLabelClass =
    "block text-[11px] font-medium text-gray-500 mb-1";
  const fieldControlClass =
    "h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400";
  const iconFieldControlClass =
    "h-9 w-full rounded-lg border border-gray-200 bg-white pl-8 pr-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400";
  const compactControlClass =
    "w-full min-w-0 border-0 bg-transparent p-0 text-sm font-medium text-gray-900 shadow-none outline-none focus:ring-0 placeholder:text-gray-400";
  const searchBarClass =
    "flex min-h-[44px] flex-1 flex-col divide-y divide-gray-200 sm:flex-row sm:divide-x sm:divide-y-0";
  const heroSearchWrapClass =
    "flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.24)] sm:flex-row";
  const searchSubmitClass =
    "flex h-11 shrink-0 items-center justify-center gap-1.5 border-t border-gray-200 bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:h-auto sm:border-t-0 sm:border-l sm:px-5 md:min-w-[7.5rem]";
  const heroTabNavClass =
    "inline-flex max-w-full flex-wrap justify-center gap-1 rounded-lg bg-sky-950/55 p-1 ring-1 ring-white/15 backdrop-blur-sm";
  const heroTabButtonClass = (isActive: boolean) =>
    `inline-flex shrink-0 flex-row items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold leading-tight transition-all sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm ${
      isActive
        ? "bg-white text-slate-900 shadow-sm"
        : "border border-white/35 text-white hover:bg-white/10"
    }`;
  const heroTabIconClass = (isActive: boolean) =>
    `h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${isActive ? "text-slate-800" : "text-white"}`;
  const getMobileTabLabel = (key: string, fallback: string) => {
    const labels: Record<LanguageCode, Record<string, string>> = {
      en: {
        accommodation: "Stays",
        cars: "Cars",
        tours: "Tours",
      },
      ru: {
        accommodation: "Жилье",
        cars: "Авто",
        tours: "Туры",
      },
      pl: {
        accommodation: "Nocleg",
        cars: "Auta",
        tours: "Wycieczki",
      },
      fr: {
        accommodation: "Séjour",
        cars: "Autos",
        tours: "Excursions",
      },
      ua: {
        accommodation: "Житло",
        cars: "Авто",
        tours: "Екскурсії",
      },
      de: {
        accommodation: "Unterkunft",
        cars: "Autos",
        tours: "Touren",
      },
      es: {
        accommodation: "Estancia",
        cars: "Coches",
        tours: "Excursiones",
      },
    };

    return labels[language]?.[key] || fallback;
  };

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
  const { cars, accommodation, blogPosts, transfers, dataLoading } =
    initialData
      ? {
          cars: initialData.cars || [],
          accommodation: initialData.properties || [],
          blogPosts: initialData.blogs || [],
          transfers: initialData.transfers || [],
          dataLoading: false,
        }
      : {
          cars: dataFromHook.cars,
          accommodation: dataFromHook.accommodation,
          blogPosts: dataFromHook.blogPosts,
          transfers: dataFromHook.transfers,
          dataLoading: dataFromHook.dataLoading,
        };

  // Extract filter options from useDataLoader data (same pattern as individual pages)
  useEffect(() => {
    if (mounted && accommodation && cars) {
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

      // Set all filter options (simple string arrays like individual pages)
      setCarTypes(carTypesArray);
      setCarBrands(carBrandsArray);
      setCarTransmissions(carTransmissionsArray);
    }
  }, [mounted, accommodation, cars]);

  // Функция для открытия модального окна бронирования
  const openBookingModal = (
    type: "excursion" | "car" | "accommodation" | "transfer",
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

  useEffect(() => {
    if (!mounted) return;
    setActiveTab(parseHeroTab(searchParams.get("tab")));
  }, [mounted, searchParams]);

  const selectHeroTab = useCallback(
    (tab: HeroTab) => {
      setActiveTab(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  // Переключение языка через URL
  const handleLanguageChange = (langCode: LanguageCode) => {
    switchLocale(langCode);
  };

  const scrollToSection = useCallback(
    (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

  const handleSearch = () => {
    // Build query parameters based on active tab and filters
    const params = new URLSearchParams();

    // Add common date parameters
    if (dates[0]) params.append("checkIn", dates[0]);
    if (dates[1]) params.append("checkOut", dates[1]);

    switch (activeTab) {
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
        router.push(`${createLocaleLink("/cars")}?${params.toString()}`);
        break;

      case "accommodation":
        // Add accommodation-specific filters
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
        if (guests) params.append("guests", guests.toString());
        router.push(`${createLocaleLink("/apartments")}?${params.toString()}`);
        break;

      case "tours":
        if (dates[0]) params.append("date", dates[0]);
        if (guests) params.append("people", guests.toString());
        params.append("language", tourLanguage);
        router.push(`${createLocaleLink("/tours")}?${params.toString()}`);
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
        variant="home"
        showTransfers={transfers.length > 0}
        createLocaleLink={createLocaleLink}
        onScrollToSection={scrollToSection}
      />

      {/* Hero Section */}
      <section
        id="home"
        className="relative flex min-h-dvh flex-col bg-cover bg-center bg-no-repeat sm:min-h-[70vh]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg')`,
        }}
      >
        <div
            className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-3 pt-[6.75rem] min-[400px]:px-4 md:pt-20 pb-[max(2rem,env(safe-area-inset-bottom,0px))] sm:pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]">
          {/* Title - moved higher */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg pt-2 sm:pt-0">
              {t.hero.title}
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
              {t.hero.subtitle}
            </p>
          </div>

          <div className="flex w-full max-w-5xl flex-col gap-2 xl:max-w-6xl sm:gap-2.5">
            <nav
                className={`${heroTabNavClass} mx-auto mb-8 sm:mb-10 md:mb-12`}
                role="tablist"
                aria-label={t.hero.subtitle}
            >
              {[
                {
                  key: "accommodation",
                  icon: Home,
                  label: t.hero.tabs.accommodation,
                },
                {key: "cars", icon: Car, label: t.hero.tabs.cars},
                {key: "tours", icon: MapPin, label: t.hero.tabs.excursions},
              ].map(({key, icon: Icon, label}) => {
                const isActive = activeTab === key;
                return (
                  <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        if (isHeroTab(key)) selectHeroTab(key);
                      }}
                      className={heroTabButtonClass(isActive)}
                  >
                    <Icon className={heroTabIconClass(isActive)} />
                    <span className="max-w-[5.5rem] truncate sm:max-w-none">
                      <span className="md:hidden">
                        {getMobileTabLabel(key, label)}
                      </span>
                      <span className="hidden md:inline">{label}</span>
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="w-full">
              {/* Accommodation Tab */}
              {activeTab === "accommodation" && (
                  <div>
                    <div className={heroSearchWrapClass}>
                      <div className={searchBarClass}>
                        <CompactSearchField label={t.hero.accommodation.checkin}>
                        <input
                            type={dates[0] ? "date" : "text"}
                            placeholder={datePlaceholder}
                            className={compactControlClass}
                            value={dates[0]}
                            onFocus={(e) => {
                              e.currentTarget.type = "date";
                            }}
                            onBlur={(e) => {
                              if (!e.currentTarget.value) {
                                e.currentTarget.type = "text";
                              }
                            }}
                            onChange={(e) => setDates([e.target.value, dates[1]])}
                        />
                        </CompactSearchField>
                        <CompactSearchField label={t.hero.accommodation.checkout}>
                        <input
                            type={dates[1] ? "date" : "text"}
                            placeholder={datePlaceholder}
                            className={compactControlClass}
                            value={dates[1]}
                            onFocus={(e) => {
                              e.currentTarget.type = "date";
                            }}
                            onBlur={(e) => {
                              if (!e.currentTarget.value) {
                                e.currentTarget.type = "text";
                              }
                            }}
                            onChange={(e) => setDates([dates[0], e.target.value])}
                        />
                        </CompactSearchField>
                        <CompactSearchField label={t.hero.accommodation.guests}>
                          <div className="relative flex items-center">
                            <Users className="absolute left-0 h-3.5 w-3.5 text-gray-400"/>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                className={`${compactControlClass} pl-5`}
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                            />
                          </div>
                        </CompactSearchField>
                      </div>
                      <button
                          type="button"
                          onClick={handleSearch}
                          className={searchSubmitClass}
                      >
                        <Search className="h-4 w-4 shrink-0"/>
                        <span>{t.hero.search}</span>
                      </button>
                    </div>

                  </div>
              )}

              {activeTab === "cars" && (
                  <div>
                    <div className={heroSearchWrapClass}>
                      <div className={searchBarClass}>
                        <CompactSearchField label={t.hero.cars.bodyType}>
                        <select
                            className={compactControlClass}
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
                        </CompactSearchField>
                        <CompactSearchField label={t.hero.cars.pickup}>
                        <input
                            type={dates[0] ? "date" : "text"}
                            placeholder={datePlaceholder}
                            className={compactControlClass}
                            value={dates[0]}
                            onFocus={(e) => {
                              e.currentTarget.type = "date";
                            }}
                            onBlur={(e) => {
                              if (!e.currentTarget.value) {
                                e.currentTarget.type = "text";
                              }
                            }}
                            onChange={(e) => setDates([e.target.value, dates[1]])}
                        />
                        </CompactSearchField>
                        <CompactSearchField label={t.hero.cars.dropoff}>
                        <input
                            type={dates[1] ? "date" : "text"}
                            placeholder={datePlaceholder}
                            className={compactControlClass}
                            value={dates[1]}
                            onFocus={(e) => {
                              e.currentTarget.type = "date";
                            }}
                            onBlur={(e) => {
                              if (!e.currentTarget.value) {
                                e.currentTarget.type = "text";
                              }
                            }}
                            onChange={(e) => setDates([dates[0], e.target.value])}
                        />
                        </CompactSearchField>
                      </div>
                      <button
                          type="button"
                          onClick={handleSearch}
                          className={searchSubmitClass}
                      >
                        <Search className="h-4 w-4 shrink-0"/>
                        <span>{t.hero.search}</span>
                      </button>
                    </div>

                  </div>
              )}

              {activeTab === "tours" && (
                  <div>
                    <div className={heroSearchWrapClass}>
                      <div className={searchBarClass}>
                        <CompactSearchField label={t.hero.excursions.date}>
                        <input
                            type={dates[0] ? "date" : "text"}
                            placeholder={datePlaceholder}
                            className={compactControlClass}
                            value={dates[0]}
                            onFocus={(e) => {
                              e.currentTarget.type = "date";
                            }}
                            onBlur={(e) => {
                              if (!e.currentTarget.value) {
                                e.currentTarget.type = "text";
                              }
                            }}
                            onChange={(e) => setDates([e.target.value, dates[1]])}
                        />
                        </CompactSearchField>
                        <CompactSearchField label={t.hero.excursions.people}>
                          <div className="relative flex items-center">
                            <Users className="absolute left-0 h-3.5 w-3.5 text-gray-400"/>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                className={`${compactControlClass} pl-5`}
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                            />
                          </div>
                        </CompactSearchField>
                        <CompactSearchField label={t.hero.excursions.language}>
                        <select
                            className={compactControlClass}
                            value={tourLanguage}
                            onChange={(e) => setTourLanguage(e.target.value)}
                        >
                          {t.hero.excursions.languageOptions.map(
                              (opt: { value: string; label: string }) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                              )
                          )}
                        </select>
                        </CompactSearchField>
                      </div>
                      <button
                          type="button"
                          onClick={handleSearch}
                          className={searchSubmitClass}
                      >
                        <Search className="h-4 w-4 shrink-0"/>
                        <span>{t.hero.search}</span>
                      </button>
                    </div>
                  </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Секция недвижимости */}
      <section
          id="accommodation"
          className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-gray-50"
      >
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
              <ArrowRight className="w-4 h-4"/>
            </button>
          </div>

          {dataLoading ? (
              <EmptyState type="loading"/>
          ) : accommodation.length === 0 ? (
              <EmptyState type="empty"/>
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
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <TilePriceBadge>
                              <span className="text-sm font-semibold tabular-nums text-yellow-900">
                                {place.price}
                              </span>
                            </TilePriceBadge>
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
      <section
        id="cars"
        className="scroll-mt-[6.5rem] pt-20 md:scroll-mt-16 bg-white"
      >
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
            <div className="inline-block rounded-xl overflow-hidden shadow-lg">
              <img
                src={getCanariasRentacarBannerImageUrl(language)}
                alt="rentacar canarias.com"
                className="max-w-full h-auto"
              />
            </div>
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
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <TileCarPrice
                              currencySymbol={getLocalizedCurrency(car)}
                              amount={Number(getCarPrice(car)) || 0}
                              perDaySuffix={t.common.perDay}
                              locale={language as Locale}
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              openBookingModal("car", {
                                title: car.title,
                                price: `${getLocalizedCurrency(car).trim()} ${formatTileAmount(Number(getCarPrice(car)) || 0, language as Locale)}${t.common.perDay}`,
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

      {/* Секция трансферов */}
      {transfers.length > 0 && (
        <section
          id="transfers"
          className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {transferCopy.sectionTitle}
              </h2>
              <p className="text-xl text-gray-600">
                {transferCopy.sectionSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {transfers.slice(0, 2).map((transfer) => (
                <div
                  key={transfer.documentId || transfer.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img
                      src={getTransferImage(transfer)}
                      alt={transfer.title}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() =>
                        router.push(
                          createLocaleLink(`/transfers/${transfer.documentId}`)
                        )
                      }
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {transfer.title}
                        </h3>
                        <div className="mt-2 inline-flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>
                            {transfer.seats} {transferCopy.seats}
                          </span>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700">
                        <Plane className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {transferCopy.from}{" "}
                          {formatTransferPrice(transfer, "south")}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-5 line-clamp-2">
                      {transfer.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="text-sm text-gray-500 mb-1">
                          {transferCopy.southAirport}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatTransferPrice(transfer, "south")}
                        </div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="text-sm text-gray-500 mb-1">
                          {transferCopy.northAirport}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatTransferPrice(transfer, "north")}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          router.push(
                            createLocaleLink(`/transfers/${transfer.documentId}`)
                          )
                        }
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        {transferCopy.viewDetails}
                      </button>
                      <button
                        onClick={() =>
                          openBookingModal("transfer", {
                            title: transfer.title,
                            price: `${transferCopy.southAirport}: ${formatTransferPrice(
                              transfer,
                              "south"
                            )}, ${transferCopy.northAirport}: ${formatTransferPrice(
                              transfer,
                              "north"
                            )}`,
                            contact: transfer.contact,
                          })
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {transferCopy.bookNow}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Excursion aggregator (Atlántico) */}
      <section
        id="excursions"
        className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 md:mb-14 gap-4">
            <div className="text-center flex-1 w-full sm:w-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t.sections.excursions.title}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto sm:mx-0 sm:max-w-none">
                {t.sections.excursions.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push(createLocaleLink("/tours"))}
              className="flex shrink-0 items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl sm:ml-8"
            >
              {t.sections.excursions.viewAll}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 hover:shadow-2xl transition-all duration-300">
              <div className="md:flex items-stretch min-h-[280px]">
                <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:p-10 flex items-center justify-center">
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
                                : language === "ua"
                                  ? "Більше турів та активностей"
                                  : "More tours & activities"}
                    </p>
                  </div>
                </div>
                <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    {language === "ru"
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
                                : "Our partner Atlántico Excursiones"}
                  </h4>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
                    {language === "ru"
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
                                : "Coach tours, theme parks, boat trips and VIP experiences — book with Atlántico Excursiones."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция блогов */}
      <section
        id="blog"
        className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-white"
      >
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

      {/* FAQ секция */}
      <section
        id="faq"
        className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-white"
      >
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
                  href={createLocaleLink("/#transfers")}
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
                <span className="block text-gray-400">
                  Car Rental Services
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                {t.footer.contacts}
              </h4>
              <div className="space-y-3">
                <a
                  href="tel:+34613211069"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +34613211069
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
          currentLocale={locale}
        />
      )}
    </main>
  );
}
