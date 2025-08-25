"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import ApartmentCard from "./ApartmentCard";
import ApartmentsFilter from "./ApartmentsFilter";
import { parseUrlParams, FilterParams } from "@/utils/filterUtils";
import { useFilterSync } from "@/hooks/useFilterSync";
import { SimpleBookingPopup } from "@/components/SimpleBookingPopup";

// ... (оставляем все переводы и languages как есть)

const translations = {
  en: {
    backToHome: "Back to Home",
    apartmentsInTenerife: "Apartments in Tenerife",
    filters: "Filters",
    propertyType: "Property Type",
    allTypes: "All types",
    apartment: "Apartment",
    house: "House",
    plot: "Plot",
    studio: "Studio",
    room: "room",
    rooms: "rooms",
    any: "Any",
    area: "Area (m²)",
    from: "From",
    to: "To",
    pricePerMonth: "Price (€/month)",
    price: "Price (€)",
    floor: "Floor",
    yearBuilt: "Year Built",
    condition: "Condition",
    needsRepair: "Needs repair",
    readyToLive: "Ready to live",
    newProperty: "New property",
    location: "Location",
    allLocations: "All locations",
    district: "District",
    allDistricts: "All districts",
    features: "Features",
    balcony: "Balcony",
    terrace: "Terrace",
    garden: "Garden",
    parking: "Parking",
    furnished: "Furnished",
    airConditioner: "Air Conditioner",
    wifi: "WiFi",
    washingMachine: "Washing Machine",
    dishwasher: "Dishwasher",
    pool: "Pool",
    garage: "Garage",
    heating: "Heating",
    internet: "Internet",
    security: "Security",
    resetFilters: "Reset filters",
    available: "AVAILABLE",
    viewDetails: "View Details",
    bookNow: "Book",
    contact: "Contact",
    apartmentDescription:
      "Modern and comfortable apartment in a great location.",
    selectLanguage: "Select Language",
    sqm: "m²",
    perMonth: "month",
    perDay: "day",
    perTotal: "total",
    type: "Type",
    rent: "Rent",
    sale: "Sale",
    status: "Status",
    allStatuses: "All statuses",
    reserved: "Reserved",
    rented: "Rented",
    sold: "Sold",
  },
  ru: {
    backToHome: "Назад на главную",
    apartmentsInTenerife: "Недвижимость в Тенерифе",
    filters: "Фильтры",
    propertyType: "Тип недвижимости",
    allTypes: "Все типы",
    apartment: "Квартира",
    house: "Дом",
    plot: "Участок",
    studio: "Студия",
    room: "комната",
    rooms: "комнат",
    any: "Любое",
    area: "Площадь (м²)",
    from: "От",
    to: "До",
    pricePerMonth: "Цена (€/месяц)",
    price: "Цена (€)",
    floor: "Этаж",
    yearBuilt: "Год постройки",
    condition: "Состояние",
    needsRepair: "Требует ремонта",
    readyToLive: "Готово к проживанию",
    newProperty: "Новое",
    location: "Локация",
    allLocations: "Все локации",
    district: "Район",
    allDistricts: "Все районы",
    features: "Особенности",
    balcony: "Балкон",
    terrace: "Терраса",
    garden: "Сад",
    parking: "Парковка",
    furnished: "Меблирована",
    airConditioner: "Кондиционер",
    wifi: "WiFi",
    washingMachine: "Стиральная машина",
    dishwasher: "Посудомоечная машина",
    pool: "Бассейн",
    garage: "Гараж",
    heating: "Отопление",
    internet: "Интернет",
    security: "Охрана",
    resetFilters: "Сбросить фильтры",
    available: "ДОСТУПЕН",
    viewDetails: "Подробнее",
    bookNow: "Забронировать",
    contact: "Связаться",
    apartmentDescription:
      "Современная и комфортная недвижимость в отличном месте.",
    selectLanguage: "Выбрать язык",
    sqm: "м²",
    perMonth: "месяц",
    perDay: "день",
    perTotal: "всего",
    type: "Тип",
    rent: "Аренда",
    sale: "Продажа",
    status: "Статус",
    allStatuses: "Все статусы",
    reserved: "Зарезервирован",
    rented: "Сдан",
    sold: "Продан",
  },
  pl: {
    backToHome: "Powrót do strony głównej",
    apartmentsInTenerife: "Nieruchomości na Teneryfie",
    filters: "Filtry",
    propertyType: "Typ nieruchomości",
    allTypes: "Wszystkie typy",
    apartment: "Mieszkanie",
    house: "Dom",
    plot: "Działka",
    studio: "Studio",
    room: "pokój",
    rooms: "pokoi",
    any: "Dowolny",
    area: "Powierzchnia (m²)",
    from: "Od",
    to: "Do",
    pricePerMonth: "Cena (€/miesiąc)",
    price: "Cena (€)",
    floor: "Piętro",
    yearBuilt: "Rok budowy",
    condition: "Stan",
    needsRepair: "Wymaga remontu",
    readyToLive: "Gotowe do zamieszkania",
    newProperty: "Nowe",
    location: "Lokalizacja",
    allLocations: "Wszystkie lokalizacje",
    district: "Dzielnica",
    allDistricts: "Wszystkie dzielnice",
    features: "Cechy",
    balcony: "Balkon",
    terrace: "Taras",
    garden: "Ogród",
    parking: "Parking",
    furnished: "Umeblowane",
    airConditioner: "Klimatyzacja",
    wifi: "WiFi",
    washingMachine: "Pralka",
    dishwasher: "Zmywarka",
    pool: "Basen",
    garage: "Garaż",
    heating: "Ogrzewanie",
    internet: "Internet",
    security: "Ochrona",
    resetFilters: "Resetuj filtry",
    available: "DOSTĘPNY",
    viewDetails: "Zobacz szczegóły",
    bookNow: "Zarezerwuj",
    contact: "Kontakt",
    apartmentDescription:
      "Nowoczesna i komfortowa nieruchomość w doskonałej lokalizacji.",
    selectLanguage: "Wybierz język",
    sqm: "m²",
    perMonth: "miesiąc",
    perDay: "dzień",
    perTotal: "całość",
    type: "Typ",
    rent: "Wynajem",
    sale: "Sprzedaż",
    status: "Status",
    allStatuses: "Wszystkie statusy",
    reserved: "Zarezerwowane",
    rented: "Wynajęte",
    sold: "Sprzedane",
  },
  fr: {
    backToHome: "Retour à l'accueil",
    apartmentsInTenerife: "Immobilier à Tenerife",
    filters: "Filtres",
    propertyType: "Type de propriété",
    allTypes: "Tous les types",
    apartment: "Appartement",
    house: "Maison",
    plot: "Terrain",
    studio: "Studio",
    room: "pièce",
    rooms: "pièces",
    any: "N'importe",
    area: "Surface (m²)",
    from: "De",
    to: "À",
    pricePerMonth: "Prix (€/mois)",
    price: "Prix (€)",
    floor: "Étage",
    yearBuilt: "Année de construction",
    condition: "État",
    needsRepair: "Nécessite des réparations",
    readyToLive: "Prêt à vivre",
    newProperty: "Nouveau",
    location: "Emplacement",
    allLocations: "Tous les emplacements",
    district: "Quartier",
    allDistricts: "Tous les quartiers",
    features: "Caractéristiques",
    balcony: "Balcon",
    terrace: "Terrasse",
    garden: "Jardin",
    parking: "Parking",
    furnished: "Meublé",
    airConditioner: "Climatisation",
    wifi: "WiFi",
    washingMachine: "Lave-linge",
    dishwasher: "Lave-vaisselle",
    pool: "Piscine",
    garage: "Garage",
    heating: "Chauffage",
    internet: "Internet",
    security: "Sécurité",
    resetFilters: "Réinitialiser les filtres",
    available: "DISPONIBLE",
    viewDetails: "Voir les détails",
    bookNow: "Réserver",
    contact: "Contact",
    apartmentDescription:
      "Immobilier moderne et confortable dans un excellent emplacement.",
    selectLanguage: "Choisir la langue",
    sqm: "m²",
    perMonth: "mois",
    perDay: "jour",
    perTotal: "total",
    type: "Type",
    rent: "Location",
    sale: "Vente",
    status: "Statut",
    allStatuses: "Tous les statuts",
    reserved: "Réservé",
    rented: "Loué",
    sold: "Vendu",
  },
  uk: {
    backToHome: "Повернутися на головну",
    apartmentsInTenerife: "Нерухомість на Тенеріфе",
    filters: "Фільтри",
    propertyType: "Тип нерухомості",
    allTypes: "Всі типи",
    apartment: "Квартира",
    house: "Будинок",
    plot: "Ділянка",
    studio: "Студія",
    room: "кімната",
    rooms: "кімнат",
    any: "Будь-який",
    area: "Площа (м²)",
    from: "Від",
    to: "До",
    pricePerMonth: "Ціна (€/місяць)",
    price: "Ціна (€)",
    floor: "Поверх",
    yearBuilt: "Рік будівництва",
    condition: "Стан",
    needsRepair: "Потребує ремонту",
    readyToLive: "Готове до проживання",
    newProperty: "Нове",
    location: "Локація",
    allLocations: "Всі локації",
    district: "Район",
    allDistricts: "Всі райони",
    features: "Особливості",
    balcony: "Балкон",
    terrace: "Тераса",
    garden: "Сад",
    parking: "Парковка",
    furnished: "Мебльована",
    airConditioner: "Кондиціонер",
    wifi: "WiFi",
    washingMachine: "Пральна машина",
    dishwasher: "Посудомийна машина",
    pool: "Басейн",
    garage: "Гараж",
    heating: "Опалення",
    internet: "Інтернет",
    security: "Охорона",
    resetFilters: "Скинути фільтри",
    available: "ДОСТУПНИЙ",
    viewDetails: "Детальніше",
    bookNow: "Забронювати",
    contact: "Зв'язатися",
    apartmentDescription:
      "Сучасна та комфортна нерухомість у відмінному місці.",
    selectLanguage: "Обрати мову",
    sqm: "м²",
    perMonth: "місяць",
    perDay: "день",
    perTotal: "всього",
    type: "Тип",
    rent: "Оренда",
    sale: "Продаж",
    status: "Статус",
    allStatuses: "Всі статуси",
    reserved: "Зарезервований",
    rented: "Здано",
    sold: "Продано",
  },
  de: {
    backToHome: "Zurück zur Startseite",
    apartmentsInTenerife: "Immobilien auf Teneriffa",
    filters: "Filter",
    propertyType: "Immobilientyp",
    allTypes: "Alle Typen",
    apartment: "Wohnung",
    house: "Haus",
    plot: "Grundstück",
    studio: "Studio",
    room: "Zimmer",
    rooms: "Zimmer",
    any: "Beliebig",
    area: "Fläche (m²)",
    from: "Von",
    to: "Bis",
    pricePerMonth: "Preis (€/Monat)",
    price: "Preis (€)",
    floor: "Etage",
    yearBuilt: "Baujahr",
    condition: "Zustand",
    needsRepair: "Renovierungsbedürftig",
    readyToLive: "Bereit zum Einzug",
    newProperty: "Neue Immobilie",
    location: "Standort",
    allLocations: "Alle Standorte",
    district: "Bezirk",
    allDistricts: "Alle Bezirke",
    features: "Ausstattung",
    balcony: "Balkon",
    terrace: "Terrasse",
    garden: "Garten",
    parking: "Parkplatz",
    furnished: "Möbliert",
    airConditioner: "Klimaanlage",
    wifi: "WLAN",
    washingMachine: "Waschmaschine",
    dishwasher: "Geschirrspüler",
    pool: "Pool",
    garage: "Garage",
    heating: "Heizung",
    internet: "Internet",
    security: "Sicherheit",
    resetFilters: "Filter zurücksetzen",
    available: "VERFÜGBAR",
    viewDetails: "Details anzeigen",
    bookNow: "Jetzt buchen",
    contact: "Kontakt",
    apartmentDescription:
      "Moderne und komfortable Immobilie in großartiger Lage.",
    selectLanguage: "Sprache auswählen",
    sqm: "m²",
    perMonth: "Monat",
    perDay: "Tag",
    perTotal: "Gesamt",
    type: "Typ",
    rent: "Mieten",
    sale: "Kaufen",
    status: "Status",
    allStatuses: "Alle Status",
    reserved: "Reserviert",
    rented: "Vermietet",
    sold: "Verkauft",
  },
  es: {
    backToHome: "Volver al inicio",
    apartmentsInTenerife: "Inmuebles en Tenerife",
    filters: "Filtros",
    propertyType: "Tipo de inmueble",
    allTypes: "Todos los tipos",
    apartment: "Apartamento",
    house: "Casa",
    plot: "Terreno",
    studio: "Estudio",
    room: "habitación",
    rooms: "habitaciones",
    any: "Cualquiera",
    area: "Superficie (m²)",
    from: "Desde",
    to: "Hasta",
    pricePerMonth: "Precio (€/mes)",
    price: "Preciо (€)",
    floor: "Piso",
    yearBuilt: "Año de construcción",
    condition: "Estado",
    needsRepair: "Necesita reparación",
    readyToLive: "Listo para vivir",
    newProperty: "Inmueble nuevo",
    location: "Ubicación",
    allLocations: "Todas las ubicaciones",
    district: "Distrito",
    allDistricts: "Todos los distritos",
    features: "Características",
    balcony: "Balcón",
    terrace: "Terraza",
    garden: "Jardín",
    parking: "Aparcamiento",
    furnished: "Amueblado",
    airConditioner: "Aire acondicionado",
    wifi: "WiFi",
    washingMachine: "Lavadora",
    dishwasher: "Lavavajillas",
    pool: "Piscina",
    garage: "Garaje",
    heating: "Calefacción",
    internet: "Internet",
    security: "Seguridad",
    resetFilters: "Restablecer filtros",
    available: "DISPONIBLE",
    viewDetails: "Ver detalles",
    bookNow: "Reservar ahora",
    contact: "Contactar",
    apartmentDescription:
      "Inmueble moderno y cómodo en una excelente ubicación.",
    selectLanguage: "Seleccionar idioma",
    sqm: "m²",
    perMonth: "mes",
    perDay: "día",
    perTotal: "total",
    type: "Tipo",
    rent: "Alquiler",
    sale: "Venta",
    status: "Estado",
    allStatuses: "Todos los estados",
    reserved: "Reservado",
    rented: "Alquilado",
    sold: "Vendido",
  },
};

const getLoadingPropertiesText = (language: string) => {
  const texts: Record<string, string> = {
    en: "Loading properties...",
    ru: "Загрузка недвижимости...",
    pl: "Ładowanie nieruchomości...",
    fr: "Chargement des propriétés...",
    uk: "Завантаження нерухомості...",
    de: "Immobilien werden geladen...",
    es: "Cargando inmuebles...",
  };
  return texts[language] || texts.en;
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

// Определяем интерфейс для недвижимости
interface PropertyData {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  description: string;
  type: "rent" | "sale";
  property_status: "available" | "reserved" | "rented" | "sold";
  featured: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images: Array<{
    id: number;
    url: string;
    width?: number;
    height?: number;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  }>;
  price?: {
    amount: number;
    currency: string;
    period: string;
  } | null;
  location?: {
    address: string;
    city: string;
    region: string;
    postal_code: string;
    latitude: number;
    longitude: number;
  } | null;
  features?: {
    has_pool: boolean;
    has_garden: boolean;
    has_garage: boolean;
    has_terrace: boolean;
    has_security: boolean;
    has_air_conditioning: boolean;
    has_heating: boolean;
    has_internet: boolean;
    furnished: boolean;
    additional_features?: string | null;
  } | null;
  specifications?: {
    total_area: number;
    living_area: number;
    bedrooms: number;
    bathrooms: number;
    floor: number;
    total_floors: number;
    year_built?: number | null;
    parking_spaces?: number | null;
  } | null;
  contact?: {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
    telegram?: string;
    preferred_contact: string;
  } | null;
}

interface ApartmentsPageClientProps {
  initialProperties?: any[];
}

interface ApartmentsPageClientProps {
  initialProperties?: any[];
}

export default function ApartmentsPageClient({
  initialProperties,
}: ApartmentsPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [language, setLanguage] = useState<
    "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  >("en");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState<any>(null);

  // Инициализация фильтров из URL параметров
  const [filters, setFilters] = useState<FilterParams>(() => {
    if (searchParams) {
      const urlFilters = parseUrlParams(searchParams);
      return {
        propertyType: (urlFilters.propertyType as string) || "",
        rooms: (urlFilters.rooms as string) || "",
        areaFrom: (urlFilters.areaFrom as string) || "",
        areaTo: (urlFilters.areaTo as string) || "",
        priceFrom: (urlFilters.priceFrom as string) || "",
        priceTo: (urlFilters.priceTo as string) || "",
        floorFrom: (urlFilters.floorFrom as string) || "",
        floorTo: (urlFilters.floorTo as string) || "",
        yearBuiltFrom: (urlFilters.yearBuiltFrom as string) || "",
        yearBuiltTo: (urlFilters.yearBuiltTo as string) || "",
        condition: (urlFilters.condition as string) || "",
        city: (urlFilters.city as string) || "",
        district: (urlFilters.district as string) || "",
        balcony: (urlFilters.balcony as boolean) || false,
        terrace: (urlFilters.terrace as boolean) || false,
        garden: (urlFilters.garden as boolean) || false,
        parking: (urlFilters.parking as boolean) || false,
        furnished: (urlFilters.furnished as boolean) || false,
        airConditioner: (urlFilters.airConditioner as boolean) || false,
        wifi: (urlFilters.wifi as boolean) || false,
        washingMachine: (urlFilters.washingMachine as boolean) || false,
        dishwasher: (urlFilters.dishwasher as boolean) || false,
        type: (urlFilters.type as string) || "",
        propertyStatus: (urlFilters.propertyStatus as string) || "",
      };
    }
    return {
      propertyType: "",
      rooms: "",
      areaFrom: "",
      areaTo: "",
      priceFrom: "",
      priceTo: "",
      floorFrom: "",
      floorTo: "",
      yearBuiltFrom: "",
      yearBuiltTo: "",
      condition: "",
      city: "",
      district: "",
      balcony: false,
      terrace: false,
      garden: false,
      parking: false,
      furnished: false,
      airConditioner: false,
      wifi: false,
      washingMachine: false,
      dishwasher: false,
      type: "",
      propertyStatus: "",
    };
  });

  // Состояния для всех и отфильтрованных апартаментов
  const [allApartments, setAllApartments] = useState<PropertyData[]>(
    initialProperties || []
  );
  const [filteredApartments, setFilteredApartments] = useState<PropertyData[]>(
    initialProperties || []
  );
  const [initialLoadComplete, setInitialLoadComplete] =
    useState(!!initialProperties);

  // Используем хук синхронизации фильтров с URL
  const {
    handleFilterChange: handleFilterChangeSync,
    resetFilters: resetFiltersSync,
  } = useFilterSync({
    pageType: "apartments",
    filters,
    onFiltersChange: setFilters,
  });

  // Инициализация текущей страницы из URL параметров
  const [currentPage, setCurrentPage] = useState(() => {
    if (searchParams) {
      const page = searchParams.get("page");
      return page ? parseInt(page, 10) : 1;
    }
    return 1;
  });
  const [itemsPerPage] = useState(12); // Show 12 apartments per page

  // Функция для создания заголовков с авторизацией
  const getAuthHeaders = () => {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Загружаем все апартаменты только если нет initialProperties
  useEffect(() => {
    if (initialProperties) {
      setAllApartments(initialProperties);
      setFilteredApartments(initialProperties);
      setInitialLoadComplete(true);
      return;
    }

    const loadAllApartments = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL ||
          "https://tenerifly-strapi-production.up.railway.app";

        const response = await fetch(
          `${apiUrl}/api/properties?populate=*&pagination[pageSize]=1000`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.data) {
          setAllApartments(data.data);
          setFilteredApartments(data.data); // Изначально показываем все
        }
      } catch (error) {
        console.error("Error loading properties:", error);
      } finally {
        setInitialLoadComplete(true);
      }
    };

    loadAllApartments();
  }, [initialProperties]);

  const t = translations[language];
  const currentLanguage = languages.find((lang) => lang.code === language);

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

  // Синхронизация текущей страницы с URL при изменении searchParams
  useEffect(() => {
    if (searchParams) {
      const page = searchParams.get("page");
      const newPage = page ? parseInt(page, 10) : 1;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    }
  }, [searchParams, currentPage]);

  // Сохранение языка в localStorage
  const handleLanguageChange = (
    langCode: "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  ) => {
    setLanguage(langCode);
    localStorage.setItem("selectedLanguage", langCode);
    setIsLanguageDropdownOpen(false);
  };

  // Мемоизированная функция сброса фильтров
  const resetFilters = useCallback(() => {
    setFilters({
      propertyType: "",
      rooms: "",
      areaFrom: "",
      areaTo: "",
      priceFrom: "",
      priceTo: "",
      floorFrom: "",
      floorTo: "",
      yearBuiltFrom: "",
      yearBuiltTo: "",
      condition: "",
      city: "",
      district: "",
      balcony: false,
      terrace: false,
      garden: false,
      parking: false,
      furnished: false,
      airConditioner: false,
      wifi: false,
      washingMachine: false,
      dishwasher: false,
      type: "",
      propertyStatus: "",
    });
  }, []);

  // Мемоизированная функция изменения фильтров
  const handleFilterChange = useCallback(
    (key: string, value: string | boolean) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Функция для обновления URL с пагинацией
  const updateUrlWithPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    const path = "/apartments";
    const url = queryString ? `${path}?${queryString}` : path;
    router.replace(url, { scroll: false });
  };

  // Мемоизированная функция обновления отфильтрованных апартаментов
  const handleApartmentsUpdate = useCallback(
    (updatedApartments: PropertyData[]) => {
      setFilteredApartments(updatedApartments);
      // Сбрасываем страницу только если количество апартаментов изменилось
      const newTotalPages = Math.ceil(updatedApartments.length / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(1);
        updateUrlWithPage(1);
      }
    },
    [currentPage, itemsPerPage]
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredApartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApartments = filteredApartments.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlWithPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header with Language Switcher */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/"
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
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
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
          <h1 className="text-3xl font-bold text-gray-900">
            {t.apartmentsInTenerife}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - передаем все апартаменты в компонент фильтра */}
          <ApartmentsFilter
            filters={filters as any}
            onFilterChange={handleFilterChangeSync}
            onResetFilters={resetFiltersSync}
            onApartmentsUpdate={handleApartmentsUpdate}
            translations={t}
            allApartments={allApartments}
          />

          {/* Apartments Grid - показываем отфильтрованные апартаменты */}
          <div className="flex-1">
            {initialLoadComplete ? (
              <>
                <ApartmentCard
                  translations={t}
                  language={language}
                  apartments={currentApartments}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Results info */}
                    <div className="text-sm text-gray-600">
                      {language === "en"
                        ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredApartments.length)} of ${filteredApartments.length} properties`
                        : language === "ru"
                          ? `Показано ${startIndex + 1}-${Math.min(endIndex, filteredApartments.length)} из ${filteredApartments.length} объектов`
                          : language === "pl"
                            ? `Pokazano ${startIndex + 1}-${Math.min(endIndex, filteredApartments.length)} z ${filteredApartments.length} nieruchomości`
                            : language === "fr"
                              ? `Affichage de ${startIndex + 1}-${Math.min(endIndex, filteredApartments.length)} sur ${filteredApartments.length} propriétés`
                              : `Показано ${startIndex + 1}-${Math.min(endIndex, filteredApartments.length)} з ${filteredApartments.length} об'єктів`}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center gap-2">
                      {/* Previous button */}
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
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
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        {language === "en"
                          ? "Previous"
                          : language === "ru"
                            ? "Назад"
                            : language === "pl"
                              ? "Poprzednia"
                              : language === "fr"
                                ? "Précédent"
                                : "Попередня"}
                      </button>

                      {/* Page numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNumber: number;

                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  currentPage === pageNumber
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          }
                        )}

                        {/* Show ellipsis if there are more pages */}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                      </div>

                      {/* Next button */}
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {language === "en"
                          ? "Next"
                          : language === "ru"
                            ? "Вперед"
                            : language === "pl"
                              ? "Następna"
                              : language === "fr"
                                ? "Suivant"
                                : "Наступна"}
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  {getLoadingPropertiesText(language)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {isLanguageDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsLanguageDropdownOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
