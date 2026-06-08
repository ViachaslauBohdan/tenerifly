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
  AlertCircle,
  Wifi,
  WifiOff,
  Calendar,
  User,
  Plane,
} from "lucide-react";
import { DatesProvider } from "@mantine/dates";
import { WorldToursHeroSearch } from "@/components/WorldToursHeroSearch";
import { HeroSearchCtaButton } from "@/components/HeroSearchCta";
import { HeroCompactDateInput } from "@/components/HeroCompactDateInput";
import { useDataLoader } from "./useDataLoader";
import { SimpleBookingPopup } from "@/components/SimpleBookingPopup";
import translationsJson from "../i18n/main.json";
import { SiteHeader } from "@/components/SiteHeader";
import { AtlanticoExcursionCard } from "@/components/AtlanticoExcursionCard";
import { ExcursionsIntermediaryNotice } from "@/components/ExcursionsIntermediaryNotice";
import { ViewAllLink } from "@/components/ViewAllLink";
import { ViewDetailsLink } from "@/components/ViewDetailsLink";
import { HomeCardImage } from "@/components/HomeCardImage";
import {
  getHomeCarImageUrl,
  HOME_DISPLAY_LIMIT,
} from "@/lib/homeListing";
import {
  formatTransferPrice,
  getTransferImage,
  getTransferLocaleText,
  Transfer,
} from "@/lib/transfers";
import {
  getCanariasRentacarAffiliateUrl,
  getCanariasRentacarBannerImageUrl,
} from "@/lib/canariasAffiliate";
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
import { SITE_BRAND } from "@/lib/site";
import { type HeroTab, parseHeroTab, isHeroTab } from "@/lib/heroTab";
import {
  dayjsLocale,
  getIsoDatePlusDays,
  getTodayIsoDate,
  isIsoDate,
} from "@/lib/dateLocale";
import {
  heroSearchFieldsClass,
  heroBlockStackClass,
  heroInnerClass,
  heroSearchInsetClass,
  heroSectionClass,
  heroSearchWrapClass,
  heroTitleClass,
} from "@/lib/heroSearchLayout";
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
    blogs: any[];
    transfers?: Transfer[];
  };
}

const HERO_DATES_STORAGE_KEY = "hero-search-dates";

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
        className={`flex min-w-0 flex-1 flex-col items-start justify-center px-3 sm:px-5 ${
          hideLabel ? "py-0" : "py-2 sm:py-[15px]"
        } ${className}`}
    >
      {hideLabel ? (
        <span className="sr-only">{label}</span>
      ) : (
        <span className="mb-1 truncate text-xs font-medium leading-none text-gray-500">
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
  const [dates, setDates] = useState<[string, string]>(() => {
    const today = getTodayIsoDate();
    return [today, getIsoDatePlusDays(today, 5)];
  });
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

  const t = pickLocaleBundle(translations, language);
  const excursionsIntermediaryNotice =
    (t.sections.excursions as { intermediaryNotice?: string })
      .intermediaryNotice ?? "";
  const legalPageTitle = (t as { legalPage?: { title?: string } }).legalPage
    ?.title;
  const worldToursBase =
    t.hero.worldTours ?? pickLocaleBundle(translations, "en").hero.worldTours;
  const searchGlobalToursLabel =
    (t.hero as { searchGlobalTours?: string }).searchGlobalTours ??
    pickLocaleBundle(translations, "en").hero.searchGlobalTours;
  const worldToursCopy = {
    ...worldToursBase,
    search: searchGlobalToursLabel ?? worldToursBase.search,
  };
  const heroTabOptions = useMemo(
    () =>
      [
        {
          key: "accommodation" as const,
          icon: Home,
          label: t.hero.tabs.accommodation,
        },
        { key: "cars" as const, icon: Car, label: t.hero.tabs.cars },
        { key: "tours" as const, icon: MapPin, label: t.hero.tabs.excursions },
      ],
    [t.hero.tabs.accommodation, t.hero.tabs.cars, t.hero.tabs.excursions]
  );
  const activeHeroTab = heroTabOptions.find((tab) => tab.key === activeTab);
  const ActiveHeroTabIcon = activeHeroTab?.icon ?? Home;
  const transferCopy = getTransferLocaleText(language);
  const fieldLabelClass =
    "block text-[11px] font-medium text-gray-500 mb-1";
  const fieldControlClass =
    "h-9 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400";
  const iconFieldControlClass =
    "h-9 w-full rounded-lg border border-gray-200 bg-white pl-8 pr-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400";
  const compactControlClass =
    "w-full min-w-0 border-0 bg-transparent p-0 text-base font-semibold leading-snug text-gray-900 shadow-none outline-none focus:ring-0 placeholder:font-normal placeholder:text-gray-400";
  const searchBarClass = heroSearchFieldsClass;
  const strapiApiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    "https://tenerifly-strapi-production.up.railway.app";

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

  const dataFromHook = useDataLoader(mounted, language, {
    enabled: !initialData,
  });
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
    try {
      const raw = window.localStorage.getItem(HERO_DATES_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { checkIn?: string; checkOut?: string };
      if (!parsed.checkIn || !parsed.checkOut) return;
      if (!isIsoDate(parsed.checkIn) || !isIsoDate(parsed.checkOut)) return;
      const normalizedCheckOut =
        parsed.checkOut < parsed.checkIn ? parsed.checkIn : parsed.checkOut;
      setDates([parsed.checkIn, normalizedCheckOut]);
    } catch {
      // Ignore invalid persisted data.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      HERO_DATES_STORAGE_KEY,
      JSON.stringify({ checkIn: dates[0], checkOut: dates[1] })
    );
  }, [dates]);

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

  const handleCheckInChange = (nextCheckIn: string) => {
    setDates(([_, currentCheckOut]) => {
      if (!nextCheckIn) return ["", currentCheckOut];
      if (!currentCheckOut || currentCheckOut < nextCheckIn) {
        return [nextCheckIn, nextCheckIn];
      }
      return [nextCheckIn, currentCheckOut];
    });
  };

  const handleCheckOutChange = (nextCheckOut: string) => {
    setDates(([currentCheckIn, _]) => {
      if (!nextCheckOut) return [currentCheckIn, ""];
      if (currentCheckIn && nextCheckOut < currentCheckIn) {
        return [currentCheckIn, currentCheckIn];
      }
      return [currentCheckIn, nextCheckOut];
    });
  };

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
        className={heroSectionClass}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg')`,
        }}
      >
        <div className={heroInnerClass}>
          <div aria-hidden className="hidden min-h-0 sm:block" />
          <div className={`mx-auto w-full max-w-5xl xl:max-w-6xl ${heroBlockStackClass}`}>
              <div className="text-center sm:mb-2">
                {excursionsIntermediaryNotice ? (
                  <ExcursionsIntermediaryNotice
                    text={excursionsIntermediaryNotice}
                    as="h1"
                    variant="hero"
                    className="mx-auto max-w-3xl"
                  />
                ) : (
                  <h1 className={`${heroTitleClass} mb-0`}>
                    {t.hero.title}
                  </h1>
                )}
              </div>
              <div className={heroSearchInsetClass}>
                <div className={heroSearchWrapClass}>
                <DatesProvider
                  settings={{
                    locale: dayjsLocale(language),
                    firstDayOfWeek: 1,
                    weekendDays: [0, 6],
                  }}
                >
                <div className={searchBarClass}>
                  <CompactSearchField
                    label={
                      t.hero.leisure ??
                      pickLocaleBundle(translations, "en").hero.leisure
                    }
                    className="shrink-0 sm:min-w-[9.5rem] sm:max-w-[12.5rem] sm:flex-none"
                  >
                    <div className="relative flex min-w-0 items-center gap-2">
                      <ActiveHeroTabIcon
                        className="h-4 w-4 shrink-0 text-gray-500"
                        aria-hidden
                      />
                      <select
                        value={activeTab}
                        aria-label={
                          t.hero.leisure ??
                          pickLocaleBundle(translations, "en").hero.leisure
                        }
                        onChange={(e) => {
                          const next = e.target.value;
                          if (isHeroTab(next)) selectHeroTab(next);
                        }}
                        className={`${compactControlClass} w-full cursor-pointer appearance-none pr-7`}
                      >
                        {heroTabOptions.map(({ key, label }) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-0 h-4 w-4 text-gray-400"
                        aria-hidden
                      />
                    </div>
                  </CompactSearchField>

                  {activeTab === "accommodation" && (
                    <>
                      <CompactSearchField label={t.hero.accommodation.checkin}>
                        <HeroCompactDateInput
                          locale={language}
                          value={dates[0]}
                          aria-label={t.hero.accommodation.checkin}
                          onChange={handleCheckInChange}
                        />
                      </CompactSearchField>
                      <CompactSearchField label={t.hero.accommodation.checkout}>
                        <HeroCompactDateInput
                          locale={language}
                          value={dates[1]}
                          min={dates[0]}
                          aria-label={t.hero.accommodation.checkout}
                          onChange={handleCheckOutChange}
                        />
                      </CompactSearchField>
                      <CompactSearchField label={t.hero.accommodation.guests}>
                        <div className="relative flex items-center">
                          <Users className="absolute left-0 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            min="1"
                            max="10"
                            className={`${compactControlClass} pl-6`}
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                          />
                        </div>
                      </CompactSearchField>
                    </>
                  )}

                  {activeTab === "cars" && (
                    <>
                      <CompactSearchField label={t.hero.cars.bodyType}>
                        <select
                          className={compactControlClass}
                          value={carType}
                          onChange={(e) => setCarType(e.target.value)}
                        >
                          {t.hero.cars.bodyTypeOptions.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </CompactSearchField>
                      <CompactSearchField label={t.hero.cars.pickup}>
                        <HeroCompactDateInput
                          locale={language}
                          value={dates[0]}
                          aria-label={t.hero.cars.pickup}
                          onChange={handleCheckInChange}
                        />
                      </CompactSearchField>
                      <CompactSearchField label={t.hero.cars.dropoff}>
                        <HeroCompactDateInput
                          locale={language}
                          value={dates[1]}
                          min={dates[0]}
                          aria-label={t.hero.cars.dropoff}
                          onChange={handleCheckOutChange}
                        />
                      </CompactSearchField>
                    </>
                  )}

                  {activeTab === "tours" && (
                    <>
                      <CompactSearchField label={t.hero.excursions.date}>
                        <HeroCompactDateInput
                          locale={language}
                          value={dates[0]}
                          aria-label={t.hero.excursions.date}
                          onChange={handleCheckInChange}
                        />
                      </CompactSearchField>
                      <CompactSearchField label={t.hero.excursions.people}>
                        <div className="relative flex items-center">
                          <Users className="absolute left-0 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            min="1"
                            max="20"
                            className={`${compactControlClass} pl-6`}
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
                    </>
                  )}
                </div>
                <HeroSearchCtaButton
                  label={t.hero.search}
                  onClick={handleSearch}
                />
                </DatesProvider>
                </div>
              </div>
          </div>
          <div aria-hidden className="hidden min-h-0 sm:block" />
          <div className={`mx-auto w-full max-w-5xl xl:max-w-6xl ${heroBlockStackClass}`}>
              <h2 className={`${heroTitleClass} mb-0 text-center sm:mb-2 md:mb-4`}>
                {worldToursCopy.heading}
              </h2>
              <WorldToursHeroSearch
                href={createLocaleLink("/world-tours")}
                labels={worldToursCopy}
              />
          </div>
          <div aria-hidden className="hidden min-h-0 sm:block" />
        </div>
      </section>

      {/* Секция недвижимости */}
      <section
          id="accommodation"
          className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16 sm:flex-row sm:justify-between sm:items-center">
            <div className="min-w-0 w-full text-center sm:flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t.sections.accommodation.title}
              </h2>
              <p className="text-xl text-gray-600">
                {t.sections.accommodation.subtitle}
              </p>
            </div>
            <ViewAllLink href={createLocaleLink("/apartments")}>
              {t.sections.accommodation.viewAll}
            </ViewAllLink>
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
                                <HomeCardImage
                                    src={place.image || "/placeholder.svg"}
                                    alt={place.title}
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
          <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16 sm:flex-row sm:justify-between sm:items-center">
            <div className="min-w-0 w-full text-center sm:flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t.sections.cars.title}
              </h2>
              <p className="text-xl text-gray-600">
                {t.sections.cars.subtitle}
              </p>
            </div>
            <ViewAllLink href={createLocaleLink("/cars")}>
              {t.sections.cars.viewAll}
            </ViewAllLink>
          </div>

          <div className="flex justify-center mb-10">
            <a
              href={getCanariasRentacarAffiliateUrl(language)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <img
                src={getCanariasRentacarBannerImageUrl(language)}
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
              {cars
                .slice(0, HOME_DISPLAY_LIMIT)
                .map((car, index) => {
                  const imageSrc = getHomeCarImageUrl(car, strapiApiUrl);
                  if (!imageSrc) return null;
                  return (
                    <div
                      key={car.id || index}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <HomeCardImage
                          src={imageSrc}
                          alt={car.title}
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
                  );
                })}
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
              {transfers.slice(0, 2).map((transfer) => {
                const transferDetailHref = createLocaleLink(
                  `/transfers/${transfer.documentId}`
                );

                return (
                <div
                  key={transfer.documentId || transfer.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <Link
                    href={transferDetailHref}
                    prefetch
                    className="block aspect-video relative overflow-hidden bg-gray-100 group"
                  >
                    <HomeCardImage
                      src={getTransferImage(transfer)}
                      alt={transfer.title}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
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
                      <ViewDetailsLink href={transferDetailHref}>
                        {transferCopy.viewDetails}
                      </ViewDetailsLink>
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
              );
              })}
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
              {excursionsIntermediaryNotice ? (
                <ExcursionsIntermediaryNotice
                  text={excursionsIntermediaryNotice}
                  as="h2"
                  variant="section"
                  className="mx-auto max-w-3xl sm:mx-0"
                />
              ) : (
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {t.sections.excursions.title}
                </h2>
              )}
              <p className="text-xl text-gray-600 max-w-3xl mx-auto sm:mx-0 sm:max-w-none">
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

      {/* Секция блогов */}
      <section
        id="blog"
        className="scroll-mt-[6.5rem] py-20 md:scroll-mt-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4 mb-12 sm:mb-16 sm:flex-row sm:justify-between sm:items-center">
            <div className="min-w-0 w-full text-center sm:flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t.sections.blog.title}
              </h2>
              <p className="text-xl text-gray-600">
                {t.sections.blog.subtitle}
              </p>
            </div>
            <ViewAllLink href={createLocaleLink("/blog")}>
              {t.sections.blog.viewAll}
            </ViewAllLink>
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
                        <HomeCardImage
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
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
      <footer className="py-16 md:py-20" style={{ backgroundColor: "#1a1b1e" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {SITE_BRAND}
              </h3>
              <p className="text-gray-400 mb-4">{t.footer.description}</p>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} {SITE_BRAND}. All rights reserved.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">
                {t.footer.quickLinks}
              </h4>
              <nav className="space-y-3" aria-label={t.footer.quickLinks}>
                <Link
                  href={createLocaleLink("/#excursions")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  {t.sections.excursions.title}
                </Link>
                <Link
                  href={createLocaleLink("/#faq")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
                {legalPageTitle ? (
                  <Link
                    href={createLocaleLink("/aviso-legal")}
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {legalPageTitle}
                  </Link>
                ) : null}
              </nav>
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
          {(t.footer as { legalNotice?: string }).legalNotice ? (
            <div className="mt-10 border-t border-gray-700 pt-8 md:mt-12 md:pt-10">
              <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
                {(t.footer as { legalNotice?: string }).legalNotice}
              </p>
            </div>
          ) : null}
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
