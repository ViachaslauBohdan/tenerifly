"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CarCard from "./CarCard";
import CarsFilter from "./CarsFilter";
import { parseUrlParams, FilterParams } from "@/utils/filterUtils";
import { useFilterSync } from "@/hooks/useFilterSync";

// Переводы для всех языков
const translations = {
  en: {
    backToHome: "Back to Home",
    carsInTenerife: "Cars in Tenerife",
    filters: "Filters",
    brand: "Brand",
    allBrands: "All brands",
    model: "Model",
    allModels: "All models",
    yearOfManufacture: "Year of manufacture",
    from: "From",
    to: "To",
    pricePerDay: "Price (€/day)",
    mileageKm: "Mileage (km)",
    fuelType: "Fuel type",
    allTypes: "All types",
    petrol: "Petrol",
    diesel: "Diesel",
    hybrid: "Hybrid",
    electric: "Electric",
    transmission: "Transmission",
    manual: "Manual",
    automatic: "Automatic",
    bodyType: "Body type",
    sedan: "Sedan",
    hatchback: "Hatchback",
    wagon: "Wagon",
    suv: "SUV",
    convertible: "Convertible",
    color: "Color",
    allColors: "All colors",
    black: "Black",
    white: "White",
    blue: "Blue",
    red: "Red",
    yellow: "Yellow",
    silver: "Silver",
    numberOfDoors: "Number of doors",
    any: "Any",
    doors2: "2 doors",
    doors4: "4 doors",
    doors5: "5 doors",
    enginePower: "Engine power (hp)",
    location: "Location",
    allLocations: "All locations",
    availableFrom: "Available from",
    additionalOptions: "Additional options",
    airConditioner: "Air conditioner",
    rearCamera: "Rear camera",
    multimediaSystem: "Multimedia system",
    resetFilters: "Reset filters",
    available: "AVAILABLE",
    viewDetails: "View Details",
    bookNow: "Book",
    sportyDescription: "Sporty and stylish compact car for rent in Tenerife!",
    selectLanguage: "Select Language",
    tenerifeLocations: {
      south: "Tenerife South",
      north: "Tenerife North",
      center: "Tenerife Center",
    },
    type: "Type",
    rent: "Rent",
    sale: "Sale",
    status: "Status",
    allStatuses: "All statuses",
    reserved: "Reserved",
    rented: "Rented",
    sold: "Sold",
    parkingSensors: "Parking sensors",
    bluetooth: "Bluetooth",
  },
  ru: {
    backToHome: "Назад на главную",
    carsInTenerife: "Автомобили в Тенерифе",
    filters: "Фильтры",
    brand: "Марка",
    allBrands: "Все марки",
    model: "Модель",
    allModels: "Все модели",
    yearOfManufacture: "Год выпуска",
    from: "От",
    to: "До",
    pricePerDay: "Цена (€/день)",
    mileageKm: "Пробег (км)",
    fuelType: "Тип топлива",
    allTypes: "Все типы",
    petrol: "Бензин",
    diesel: "Дизель",
    hybrid: "Гибрид",
    electric: "Электрический",
    transmission: "Коробка передач",
    manual: "Механическая",
    automatic: "Автоматическая",
    bodyType: "Тип кузова",
    sedan: "Седан",
    hatchback: "Хэтчбек",
    wagon: "Универсал",
    suv: "Внедорожник",
    convertible: "Кабриолет",
    color: "Цвет",
    allColors: "Все цвета",
    black: "Черный",
    white: "Белый",
    blue: "Синий",
    red: "Красный",
    yellow: "Желтый",
    silver: "Серебристый",
    numberOfDoors: "Количество дверей",
    any: "Любое",
    doors2: "2 двери",
    doors4: "4 двери",
    doors5: "5 дверей",
    enginePower: "Мощность (л.с.)",
    location: "Локация",
    allLocations: "Все локации",
    availableFrom: "Доступен с",
    additionalOptions: "Дополнительные опции",
    airConditioner: "Кондиционер",
    rearCamera: "Камера заднего вида",
    multimediaSystem: "Мультимедийная система",
    resetFilters: "Сбросить фильтры",
    available: "ДОСТУПЕН",
    viewDetails: "Подробнее",
    bookNow: "Забронировать",
    sportyDescription:
      "Спортивный и стильный компактный автомобиль для аренды в Тенерифе!",
    selectLanguage: "Выбрать язык",
    tenerifeLocations: {
      south: "Тенерифе Юг",
      north: "Тенерифе Север",
      center: "Тенерифе Центр",
    },
    type: "Тип",
    rent: "Аренда",
    sale: "Продажа",
    status: "Статус",
    allStatuses: "Все статусы",
    reserved: "Зарезервирован",
    rented: "Сдан",
    sold: "Продан",
    parkingSensors: "Датчики парковки",
    bluetooth: "Bluetooth",
  },
  pl: {
    backToHome: "Powrót do strony głównej",
    carsInTenerife: "Samochody na Teneryfie",
    filters: "Filtry",
    brand: "Marka",
    allBrands: "Wszystkie marki",
    model: "Model",
    allModels: "Wszystkie modele",
    yearOfManufacture: "Rok produkcji",
    from: "Od",
    to: "Do",
    pricePerDay: "Cena (€/dzień)",
    mileageKm: "Przebieg (km)",
    fuelType: "Rodzaj paliwa",
    allTypes: "Wszystkie typy",
    petrol: "Benzyna",
    diesel: "Diesel",
    hybrid: "Hybryda",
    electric: "Elektryczny",
    transmission: "Skrzynia biegów",
    manual: "Manualna",
    automatic: "Automatyczna",
    bodyType: "Typ nadwozia",
    sedan: "Sedan",
    hatchback: "Kombi",
    wagon: "Kombi",
    suv: "SUV",
    convertible: "Kabriolet",
    color: "Kolor",
    allColors: "Wszystkie kolory",
    black: "Czarny",
    white: "Biały",
    blue: "Niebieski",
    red: "Czerwony",
    yellow: "Żółty",
    silver: "Srebrny",
    numberOfDoors: "Liczba drzwi",
    any: "Dowolna",
    doors2: "2 drzwi",
    doors4: "4 drzwi",
    doors5: "5 drzwi",
    enginePower: "Moc silnika (KM)",
    location: "Lokalizacja",
    allLocations: "Wszystkie lokalizacje",
    availableFrom: "Dostępny od",
    additionalOptions: "Dodatkowe opcje",
    airConditioner: "Klimatyzacja",
    rearCamera: "Kamera cofania",
    multimediaSystem: "System multimedialny",
    resetFilters: "Resetuj filtry",
    available: "DOSTĘPNY",
    viewDetails: "Zobacz szczegóły",
    bookNow: "Zarezerwuj teraz",
    sportyDescription:
      "Sportowy i stylowy kompaktowy samochód do wynajęcia na Teneryfie!",
    selectLanguage: "Wybierz język",
    tenerifeLocations: {
      south: "Teneryfa Południe",
      north: "Teneryfa Północ",
      center: "Teneryfa Centrum",
    },
    type: "Typ",
    rent: "Wynajem",
    sale: "Sprzedaż",
    status: "Status",
    allStatuses: "Wszystkie statusy",
    reserved: "Zarezerwowane",
    rented: "Wynajęte",
    sold: "Sprzedane",
    parkingSensors: "Czujniki parkowania",
    bluetooth: "Bluetooth",
  },
  fr: {
    backToHome: "Retour à l'accueil",
    carsInTenerife: "Voitures à Tenerife",
    filters: "Filtres",
    brand: "Marque",
    allBrands: "Toutes les marques",
    model: "Modèle",
    allModels: "Tous les modèles",
    yearOfManufacture: "Année de fabrication",
    from: "De",
    to: "À",
    pricePerDay: "Prix (€/jour)",
    mileageKm: "Kilométrage (km)",
    fuelType: "Type de carburant",
    allTypes: "Tous les types",
    petrol: "Essence",
    diesel: "Diesel",
    hybrid: "Hybride",
    electric: "Électrique",
    transmission: "Transmission",
    manual: "Manuelle",
    automatic: "Automatique",
    bodyType: "Type de carrosserie",
    sedan: "Berline",
    hatchback: "Berline compacte",
    wagon: "Break",
    suv: "SUV",
    convertible: "Cabriolet",
    color: "Couleur",
    allColors: "Toutes les couleurs",
    black: "Noir",
    white: "Blanc",
    blue: "Bleu",
    red: "Rouge",
    yellow: "Jaune",
    silver: "Argent",
    numberOfDoors: "Nombre de portes",
    any: "N'importe",
    doors2: "2 portes",
    doors4: "4 portes",
    doors5: "5 portes",
    enginePower: "Puissance (ch)",
    location: "Emplacement",
    allLocations: "Tous les emplacements",
    availableFrom: "Disponible à partir de",
    additionalOptions: "Options supplémentaires",
    airConditioner: "Climatisation",
    rearCamera: "Caméra de recul",
    multimediaSystem: "Système multimédia",
    resetFilters: "Réinitialiser les filtres",
    available: "DISPONIBLE",
    viewDetails: "Voir les détails",
    bookNow: "Réserver maintenant",
    sportyDescription:
      "Voiture compacte sportive et élégante à louer à Tenerife !",
    selectLanguage: "Choisir la langue",
    tenerifeLocations: {
      south: "Tenerife Sud",
      north: "Tenerife Nord",
      center: "Tenerife Centre",
    },
    type: "Type",
    rent: "Location",
    sale: "Vente",
    status: "Statut",
    allStatuses: "Tous les statuts",
    reserved: "Réservé",
    rented: "Loué",
    sold: "Vendu",
    parkingSensors: "Capteurs de stationnement",
    bluetooth: "Bluetooth",
  },
  uk: {
    backToHome: "Повернутися на головну",
    carsInTenerife: "Автомобілі на Тенеріфе",
    filters: "Фільтри",
    brand: "Марка",
    allBrands: "Всі марки",
    model: "Модель",
    allModels: "Всі моделі",
    yearOfManufacture: "Рік випуску",
    from: "Від",
    to: "До",
    pricePerDay: "Ціна (€/день)",
    mileageKm: "Пробіг (км)",
    fuelType: "Тип палива",
    allTypes: "Всі типи",
    petrol: "Бензин",
    diesel: "Дизель",
    hybrid: "Гібрид",
    electric: "Електричний",
    transmission: "Коробка передач",
    manual: "Механічна",
    automatic: "Автоматична",
    bodyType: "Тип кузова",
    sedan: "Седан",
    hatchback: "Хетчбек",
    wagon: "Універсал",
    suv: "Позашляховик",
    convertible: "Кабріолет",
    color: "Колір",
    allColors: "Всі кольори",
    black: "Чорний",
    white: "Білий",
    blue: "Синій",
    red: "Червоний",
    yellow: "Жовтий",
    silver: "Сріблястий",
    numberOfDoors: "Кількість дверей",
    any: "Будь-яка",
    doors2: "2 двері",
    doors4: "4 двері",
    doors5: "5 дверей",
    enginePower: "Потужність (к.с.)",
    location: "Локація",
    allLocations: "Всі локації",
    availableFrom: "Доступний з",
    additionalOptions: "Додаткові опції",
    airConditioner: "Кондиціонер",
    rearCamera: "Камера заднього виду",
    multimediaSystem: "Мультимедійна система",
    resetFilters: "Скинути фільтри",
    available: "ДОСТУПНИЙ",
    viewDetails: "Детальніше",
    bookNow: "Забронювати",
    sportyDescription:
      "Спортивний та стільний компактний автомобіль для оренди на Тенеріфе!",
    selectLanguage: "Обрати мову",
    tenerifeLocations: {
      south: "Тенеріфе Південь",
      north: "Тенеріфе Північ",
      center: "Тенеріфе Центр",
    },
    type: "Тип",
    rent: "Оренда",
    sale: "Продаж",
    status: "Статус",
    allStatuses: "Всі статуси",
    reserved: "Зарезервований",
    rented: "Здано",
    sold: "Продано",
    parkingSensors: "Датчики паркування",
    bluetooth: "Bluetooth",
  },
  de: {
    backToHome: "Zurück zur Startseite",
    carsInTenerife: "Autos auf Teneriffa",
    filters: "Filter",
    brand: "Marke",
    allBrands: "Alle Marken",
    model: "Modell",
    allModels: "Alle Modelle",
    yearOfManufacture: "Baujahr",
    from: "Von",
    to: "Bis",
    pricePerDay: "Preis (€/Tag)",
    mileageKm: "Kilometerstand (km)",
    fuelType: "Kraftstoffart",
    allTypes: "Alle Arten",
    petrol: "Benzin",
    diesel: "Diesel",
    hybrid: "Hybrid",
    electric: "Elektrisch",
    transmission: "Getriebe",
    manual: "Manuell",
    automatic: "Automatik",
    bodyType: "Karosserietyp",
    sedan: "Limousine",
    hatchback: "Kombi",
    wagon: "Kombi",
    suv: "SUV",
    convertible: "Cabrio",
    color: "Farbe",
    allColors: "Alle Farben",
    black: "Schwarz",
    white: "Weiß",
    blue: "Blau",
    red: "Rot",
    yellow: "Gelb",
    silver: "Silber",
    numberOfDoors: "Anzahl der Türen",
    any: "Beliebig",
    doors2: "2 Türen",
    doors4: "4 Türen",
    doors5: "5 Türen",
    enginePower: "Motorleistung (PS)",
    location: "Standort",
    allLocations: "Alle Standorte",
    availableFrom: "Verfügbar ab",
    additionalOptions: "Zusätzliche Optionen",
    airConditioner: "Klimaanlage",
    rearCamera: "Rückfahrkamera",
    multimediaSystem: "Multimedia-System",
    resetFilters: "Filter zurücksetzen",
    available: "VERFÜGBAR",
    viewDetails: "Details anzeigen",
    bookNow: "Jetzt buchen",
    sportyDescription:
      "Sportliches und stilvolles Kompaktauto zur Miete auf Teneriffa!",
    selectLanguage: "Sprache auswählen",
    tenerifeLocations: {
      south: "Teneriffa Süd",
      north: "Teneriffa Nord",
      center: "Teneriffa Zentrum",
    },
    type: "Typ",
    rent: "Mieten",
    sale: "Kaufen",
    status: "Status",
    allStatuses: "Alle Status",
    reserved: "Reserviert",
    rented: "Vermietet",
    sold: "Verkauft",
    parkingSensors: "Einparkhilfe",
    bluetooth: "Bluetooth",
  },
  es: {
    backToHome: "Volver al inicio",
    carsInTenerife: "Coches en Tenerife",
    filters: "Filtros",
    brand: "Marca",
    allBrands: "Todas las marcas",
    model: "Modelo",
    allModels: "Todos los modelos",
    yearOfManufacture: "Año de fabricación",
    from: "Desde",
    to: "Hasta",
    pricePerDay: "Precio (€/día)",
    mileageKm: "Kilometraje (km)",
    fuelType: "Tipo de combustible",
    allTypes: "Todos los tipos",
    petrol: "Gasolina",
    diesel: "Diésel",
    hybrid: "Híbrido",
    electric: "Eléctrico",
    transmission: "Transmisión",
    manual: "Manual",
    automatic: "Automático",
    bodyType: "Tipo de carrocería",
    sedan: "Sedán",
    hatchback: "Hatchback",
    wagon: "Familiar",
    suv: "SUV",
    convertible: "Descapotable",
    color: "Color",
    allColors: "Todos los colores",
    black: "Negro",
    white: "Blanco",
    blue: "Azul",
    red: "Rojo",
    yellow: "Amarillo",
    silver: "Plateado",
    numberOfDoors: "Número de puertas",
    any: "Cualquiera",
    doors2: "2 puertas",
    doors4: "4 puertas",
    doors5: "5 puertas",
    enginePower: "Potencia del motor (CV)",
    location: "Ubicación",
    allLocations: "Todas las ubicaciones",
    availableFrom: "Disponible desde",
    additionalOptions: "Opciones adicionales",
    airConditioner: "Aire acondicionado",
    rearCamera: "Cámara trasera",
    multimediaSystem: "Sistema multimedia",
    resetFilters: "Restablecer filtros",
    available: "DISPONIBLE",
    viewDetails: "Ver detalles",
    bookNow: "Reservar ahora",
    sportyDescription:
      "¡Coche compacto deportivo y elegante para alquilar en Tenerife!",
    selectLanguage: "Seleccionar idioma",
    tenerifeLocations: {
      south: "Tenerife Sur",
      north: "Tenerife Norte",
      center: "Tenerife Centro",
    },
    type: "Tipo",
    rent: "Alquiler",
    sale: "Venta",
    status: "Estado",
    allStatuses: "Todos los estados",
    reserved: "Reservado",
    rented: "Alquilado",
    sold: "Vendido",
    parkingSensors: "Sensores de aparcamiento",
    bluetooth: "Bluetooth",
  },
};

const getLoadingCarsText = (language: string) => {
  const texts: Record<string, string> = {
    en: "Loading cars...",
    ru: "Загрузка автомобилей...",
    pl: "Ładowanie samochodów...",
    fr: "Chargement des voitures...",
    uk: "Завантаження автомобілів...",
    de: "Autos werden geladen...",
    es: "Cargando coches...",
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

// Определяем интерфейс для автомобиля
interface CarData {
  id: number;
  documentId: string;
  title: string;
  slug: string | null;
  description: string;
  type: "rent" | "sale";
  car_status: "available" | "reserved" | "rented" | "sold";
  featured: boolean;
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
  rental_prices?: {
    day_1: number;
    day_3?: number;
    day_7?: number;
    month: number;
    currency: string;
  } | null;
  specifications?: {
    make: string;
    model: string;
    year: number;
    mileage?: number;
    fuel: string;
    transmission: string;
    power: number;
    seats: number;
    doors: number;
    color: string;
    body_type: string;
    drive_type: string;
  } | null;
  features?: {
    air_conditioning: boolean;
    bluetooth: boolean;
    navigation: boolean;
    parking_sensors: boolean;
    other_features?: string;
  } | null;
  location?: {
    city: string;
    region?: string | null;
    address: string;
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

export default function CarsPage() {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<
    "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  >("en");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Инициализация фильтров из URL параметров
  const [filters, setFilters] = useState<FilterParams>(() => {
    if (searchParams) {
      const urlFilters = parseUrlParams(searchParams);
      return {
        brand: (urlFilters.brand as string) || "",
        model: (urlFilters.model as string) || "",
        yearFrom: (urlFilters.yearFrom as string) || "",
        yearTo: (urlFilters.yearTo as string) || "",
        priceFrom: (urlFilters.priceFrom as string) || "",
        priceTo: (urlFilters.priceTo as string) || "",
        mileageFrom: (urlFilters.mileageFrom as string) || "",
        mileageTo: (urlFilters.mileageTo as string) || "",
        fuel: (urlFilters.fuel as string) || "",
        transmission: (urlFilters.transmission as string) || "",
        bodyType: (urlFilters.bodyType as string) || "",
        color: (urlFilters.color as string) || "",
        doors: (urlFilters.doors as string) || "",
        powerFrom: (urlFilters.powerFrom as string) || "",
        powerTo: (urlFilters.powerTo as string) || "",
        location: (urlFilters.location as string) || "",
        availableFrom: (urlFilters.availableFrom as string) || "",
        airConditioner: (urlFilters.airConditioner as boolean) || false,
        rearCamera: (urlFilters.rearCamera as boolean) || false,
        multimedia: (urlFilters.multimedia as boolean) || false,
        type: (urlFilters.type as string) || "",
        carStatus: (urlFilters.carStatus as string) || "",
      };
    }
    return {
      brand: "",
      model: "",
      yearFrom: "",
      yearTo: "",
      priceFrom: "",
      priceTo: "",
      mileageFrom: "",
      mileageTo: "",
      fuel: "",
      transmission: "",
      bodyType: "",
      color: "",
      doors: "",
      powerFrom: "",
      powerTo: "",
      location: "",
      availableFrom: "",
      airConditioner: false,
      rearCamera: false,
      multimedia: false,
      type: "",
      carStatus: "",
    };
  });

  // Состояния для всех и отфильтрованных автомобилей
  const [allCars, setAllCars] = useState<CarData[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarData[]>([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Используем хук синхронизации фильтров с URL
  const {
    handleFilterChange: handleFilterChangeSync,
    resetFilters: resetFiltersSync,
  } = useFilterSync({
    pageType: "cars",
    filters,
    onFiltersChange: setFilters,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Show 12 cars per page

  // Функция для создания заголовков с авторизацией
  const getAuthHeaders = () => {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Загружаем все машины только один раз при первой загрузке
  useEffect(() => {
    const loadAllCars = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        console.log("Page API URL:", apiUrl);

        const response = await fetch(`${apiUrl}/api/cars/?populate=*`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.data) {
          setAllCars(data.data);
          setFilteredCars(data.data); // Изначально показываем все
        }
      } catch (error) {
        console.error("Error loading cars:", error);
      } finally {
        setInitialLoadComplete(true);
      }
    };

    loadAllCars();
  }, []);

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
      brand: "",
      model: "",
      yearFrom: "",
      yearTo: "",
      priceFrom: "",
      priceTo: "",
      mileageFrom: "",
      mileageTo: "",
      fuel: "",
      transmission: "",
      bodyType: "",
      color: "",
      doors: "",
      powerFrom: "",
      powerTo: "",
      location: "",
      availableFrom: "",
      airConditioner: false,
      rearCamera: false,
      multimedia: false,
      type: "",
      carStatus: "",
    });
  }, []);

  // Мемоизированная функция изменения фильтров
  const handleFilterChange = useCallback(
    (key: string, value: string | boolean) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Мемоизированная функция обновления отфильтрованных автомобилей
  const handleCarsUpdate = useCallback((updatedCars: CarData[]) => {
    setFilteredCars(updatedCars);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            {t.carsInTenerife}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - передаем все автомобили в компонент фильтра */}
          <CarsFilter
            filters={filters as any}
            onFilterChange={handleFilterChangeSync}
            onResetFilters={resetFiltersSync}
            onCarsUpdate={handleCarsUpdate}
            translations={t}
            allCars={allCars}
          />

          {/* Cars Grid - показываем отфильтрованные автомобили */}
          <div className="flex-1">
            {initialLoadComplete ? (
              <>
                <CarCard
                  translations={t}
                  language={language}
                  cars={currentCars}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Results info */}
                    <div className="text-sm text-gray-600">
                      {language === "en"
                        ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} of ${filteredCars.length} cars`
                        : language === "ru"
                          ? `Показано ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} из ${filteredCars.length} автомобилей`
                          : language === "pl"
                            ? `Pokazano ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} z ${filteredCars.length} samochodów`
                            : language === "fr"
                              ? `Affichage de ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} sur ${filteredCars.length} voitures`
                              : language === "uk"
                                ? `Показано ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} з ${filteredCars.length} автомобілів`
                                : language === "de"
                                  ? `Zeige ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} von ${filteredCars.length} Autos`
                                  : `Mostrando ${startIndex + 1}-${Math.min(endIndex, filteredCars.length)} de ${filteredCars.length} coches`}
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
                                : language === "uk"
                                  ? "Попередня"
                                  : language === "de"
                                    ? "Zurück"
                                    : "Anterior"}
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
                                : language === "uk"
                                  ? "Наступна"
                                  : language === "de"
                                    ? "Weiter"
                                    : "Siguiente"}
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
                  {getLoadingCarsText(language)}
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
