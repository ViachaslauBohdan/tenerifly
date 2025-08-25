"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SimpleBookingPopup } from "@/components/SimpleBookingPopup";

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

// Переводы для всех языков
const translations = {
  en: {
    backToProperties: "Back to Properties",
    available: "AVAILABLE",
    reserved: "RESERVED",
    rented: "RENTED",
    sold: "SOLD",
    rent: "RENT",
    sale: "SALE",
    contact: "Contact",
    phone: "Phone:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Description",
    specifications: "Specifications",
    propertyType: "Property Type",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    totalArea: "Total Area",
    livingArea: "Living Area",
    floor: "Floor",
    totalFloors: "Total Floors",
    yearBuilt: "Year Built",
    parkingSpaces: "Parking Spaces",
    location: "Location",
    address: "Address",
    city: "City",
    region: "Region",
    postalCode: "Postal Code",
    features: "Features",
    rentalTerms: "Rental Terms",
    minimumStay: "Minimum Stay",
    maximumStay: "Maximum Stay",
    depositAmount: "Deposit Amount",
    utilitiesIncluded: "Utilities Included",
    petsAllowed: "Pets Allowed",
    smokingAllowed: "Smoking Allowed",
    additionalTerms: "Additional Terms",
    price: "Price",
    bookNow: "Book",
    selectLanguage: "Select Language",
    sqm: "m²",
    apartment: "Apartment",
    house: "House",
    plot: "Plot",
    studio: "Studio",
    month: "month",
    months: "months",
    yes: "Yes",
    no: "No",
    loading: "Loading...",
    notFound: "Property not found",
    hasPool: "Swimming Pool",
    hasGarden: "Garden",
    hasGarage: "Garage",
    hasTerrace: "Terrace",
    hasSecurity: "Security",
    hasAirConditioning: "Air Conditioning",
    hasHeating: "Heating",
    hasInternet: "Internet",
    furnished: "Furnished",
    keyAmenities: "Key Amenities",
    errorLoading: "Error loading property",
  },
  ru: {
    backToProperties: "Назад к недвижимости",
    available: "ДОСТУПЕН",
    reserved: "ЗАРЕЗЕРВИРОВАН",
    rented: "СДАН",
    sold: "ПРОДАН",
    rent: "АРЕНДА",
    sale: "ПРОДАЖА",
    contact: "Связаться",
    phone: "Телефон:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Описание",
    specifications: "Характеристики",
    propertyType: "Тип недвижимости",
    bedrooms: "Спальни",
    bathrooms: "Ванные",
    totalArea: "Общая площадь",
    livingArea: "Жилая площадь",
    floor: "Этаж",
    totalFloors: "Всего этажей",
    yearBuilt: "Год постройки",
    parkingSpaces: "Парковочные места",
    location: "Локация",
    address: "Адрес",
    city: "Город",
    region: "Регион",
    postalCode: "Почтовый индекс",
    features: "Особенности",
    rentalTerms: "Условия аренды",
    minimumStay: "Минимальный срок",
    maximumStay: "Максимальный срок",
    depositAmount: "Размер депозита",
    utilitiesIncluded: "Коммунальные включены",
    petsAllowed: "Животные разрешены",
    smokingAllowed: "Курение разрешено",
    additionalTerms: "Дополнительные условия",
    price: "Цена",
    bookNow: "Забронировать",
    selectLanguage: "Выбрать язык",
    sqm: "м²",
    apartment: "Квартира",
    house: "Дом",
    plot: "Участок",
    studio: "Студия",
    month: "месяц",
    months: "месяцев",
    yes: "Да",
    no: "Нет",
    loading: "Загрузка...",
    notFound: "Недвижимость не найдена",
    hasPool: "Бассейн",
    hasGarden: "Сад",
    hasGarage: "Гараж",
    hasTerrace: "Терраса",
    hasSecurity: "Охрана",
    hasAirConditioning: "Кондиционер",
    hasHeating: "Отопление",
    hasInternet: "Интернет",
    furnished: "Меблирована",
    keyAmenities: "Ключевые удобства",
    errorLoading: "Ошибка загрузки недвижимости",
  },
  pl: {
    backToProperties: "Powrót do nieruchomości",
    available: "DOSTĘPNY",
    reserved: "ZAREZERWOWANY",
    rented: "WYNAJĘTY",
    sold: "SPRZEDANY",
    rent: "WYNAJEM",
    sale: "SPRZEDAŻ",
    contact: "Kontakt",
    phone: "Telefon:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Opis",
    specifications: "Specyfikacja",
    propertyType: "Typ nieruchomości",
    bedrooms: "Sypialnie",
    bathrooms: "Łazienki",
    totalArea: "Powierzchnia całkowita",
    livingArea: "Powierzchnia mieszkalna",
    floor: "Piętro",
    totalFloors: "Łączna liczba pięter",
    yearBuilt: "Rok budowy",
    parkingSpaces: "Miejsca parkingowe",
    location: "Lokalizacja",
    address: "Adres",
    city: "Miasto",
    region: "Region",
    postalCode: "Kod pocztowy",
    features: "Cechy",
    rentalTerms: "Warunki wynajmu",
    minimumStay: "Minimalny pobyt",
    maximumStay: "Maksymalny pobyt",
    depositAmount: "Kwota depozytu",
    utilitiesIncluded: "Media wliczone",
    petsAllowed: "Zwierzęta dozwolone",
    smokingAllowed: "Palenie dozwolone",
    additionalTerms: "Dodatkowe warunki",
    price: "Cena",
    bookNow: "Zarezerwuj",
    selectLanguage: "Wybierz język",
    sqm: "m²",
    apartment: "Mieszkanie",
    house: "Dom",
    plot: "Działka",
    studio: "Studio",
    month: "miesiąc",
    months: "miesięcy",
    yes: "Tak",
    no: "Nie",
    loading: "Ładowanie...",
    notFound: "Nieruchomość nie znaleziona",
    hasPool: "Basen",
    hasGarden: "Ogród",
    hasGarage: "Garaż",
    hasTerrace: "Taras",
    hasSecurity: "Ochrona",
    hasAirConditioning: "Klimatyzacja",
    hasHeating: "Ogrzewanie",
    hasInternet: "Internet",
    furnished: "Umeblowane",
    keyAmenities: "Kluczowe udogodnienia",
    errorLoading: "Błąd ładowania nieruchomości",
  },
  fr: {
    backToProperties: "Retour aux propriétés",
    available: "DISPONIBLE",
    reserved: "RÉSERVÉ",
    rented: "LOUÉ",
    sold: "VENDU",
    rent: "LOCATION",
    sale: "VENTE",
    contact: "Contact",
    phone: "Téléphone:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Description",
    specifications: "Spécifications",
    propertyType: "Type de propriété",
    bedrooms: "Chambres",
    bathrooms: "Salles de bain",
    totalArea: "Surface totale",
    livingArea: "Surface habitable",
    floor: "Étage",
    totalFloors: "Nombre total d'étages",
    yearBuilt: "Année de construction",
    parkingSpaces: "Places de parking",
    location: "Emplacement",
    address: "Adresse",
    city: "Ville",
    region: "Région",
    postalCode: "Code postal",
    features: "Caractéristiques",
    rentalTerms: "Conditions de location",
    minimumStay: "Séjour minimum",
    maximumStay: "Séjour maximum",
    depositAmount: "Montant du dépôt",
    utilitiesIncluded: "Charges incluses",
    petsAllowed: "Animaux autorisés",
    smokingAllowed: "Fumeurs autorisés",
    additionalTerms: "Conditions supplémentaires",
    price: "Prix",
    bookNow: "Réserver",
    selectLanguage: "Choisir la langue",
    sqm: "m²",
    apartment: "Appartement",
    house: "Maison",
    plot: "Terrain",
    studio: "Studio",
    month: "mois",
    months: "mois",
    yes: "Oui",
    no: "Non",
    loading: "Chargement...",
    notFound: "Propriété non trouvée",
    hasPool: "Piscine",
    hasGarden: "Jardin",
    hasGarage: "Garage",
    hasTerrace: "Terrasse",
    hasSecurity: "Sécurité",
    hasAirConditioning: "Climatisation",
    hasHeating: "Chauffage",
    hasInternet: "Internet",
    furnished: "Meublé",
    keyAmenities: "Équipements principaux",
    errorLoading: "Erreur de chargement de la propriété",
  },
  uk: {
    backToProperties: "Назад до нерухомості",
    available: "ДОСТУПНИЙ",
    reserved: "ЗАРЕЗЕРВОВАНИЙ",
    rented: "ЗДАНО",
    sold: "ПРОДАНО",
    rent: "ОРЕНДА",
    sale: "ПРОДАЖ",
    contact: "Зв'язатися",
    phone: "Телефон:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Опис",
    specifications: "Характеристики",
    propertyType: "Тип нерухомості",
    bedrooms: "Спальні",
    bathrooms: "Ванні",
    totalArea: "Загальна площа",
    livingArea: "Житлова площа",
    floor: "Поверх",
    totalFloors: "Всього поверхів",
    yearBuilt: "Рік будівництва",
    parkingSpaces: "Паркувальні місця",
    location: "Локація",
    address: "Адреса",
    city: "Місто",
    region: "Регіон",
    postalCode: "Поштовий індекс",
    features: "Особливості",
    rentalTerms: "Умови оренди",
    minimumStay: "Мінімальний термін",
    maximumStay: "Максимальний термін",
    depositAmount: "Розмір депозиту",
    utilitiesIncluded: "Комунальні включені",
    petsAllowed: "Тварини дозволені",
    smokingAllowed: "Куріння дозволено",
    additionalTerms: "Додаткові умови",
    price: "Ціна",
    bookNow: "Забронювати",
    selectLanguage: "Обрати мову",
    sqm: "м²",
    apartment: "Квартира",
    house: "Будинок",
    plot: "Ділянка",
    studio: "Студія",
    month: "місяць",
    months: "місяців",
    yes: "Так",
    no: "Ні",
    loading: "Завантаження...",
    notFound: "Нерухомість не знайдена",
    hasPool: "Басейн",
    hasGarden: "Сад",
    hasGarage: "Гараж",
    hasTerrace: "Тераса",
    hasSecurity: "Охорона",
    hasAirConditioning: "Кондиціонер",
    hasHeating: "Опалення",
    hasInternet: "Інтернет",
    furnished: "Мебльована",
    keyAmenities: "Ключові зручності",
    errorLoading: "Помилка завантаження нерухомості",
  },
  de: {
    backToProperties: "Zurück zu den Immobilien",
    available: "VERFÜGBAR",
    reserved: "RESERVIERT",
    rented: "VERMIETET",
    sold: "VERKAUFT",
    rent: "MIETE",
    sale: "VERKAUF",
    contact: "Kontakt",
    phone: "Telefon:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Beschreibung",
    specifications: "Spezifikationen",
    propertyType: "Immobilientyp",
    bedrooms: "Schlafzimmer",
    bathrooms: "Badezimmer",
    totalArea: "Gesamtfläche",
    livingArea: "Wohnfläche",
    floor: "Etage",
    totalFloors: "Gesamtetagen",
    yearBuilt: "Baujahr",
    parkingSpaces: "Parkplätze",
    location: "Standort",
    address: "Adresse",
    city: "Stadt",
    region: "Region",
    postalCode: "Postleitzahl",
    features: "Ausstattung",
    rentalTerms: "Mietbedingungen",
    minimumStay: "Mindestaufenthalt",
    maximumStay: "Maximalaufenthalt",
    depositAmount: "Kaution",
    utilitiesIncluded: "Nebenkosten inklusive",
    petsAllowed: "Haustiere erlaubt",
    smokingAllowed: "Rauchen erlaubt",
    additionalTerms: "Zusätzliche Bedingungen",
    price: "Preis",
    bookNow: "Jetzt buchen",
    selectLanguage: "Sprache auswählen",
    sqm: "m²",
    apartment: "Wohnung",
    house: "Haus",
    plot: "Grundstück",
    studio: "Studio",
    month: "Monat",
    months: "Monate",
    yes: "Ja",
    no: "Nein",
    loading: "Wird geladen...",
    notFound: "Immobilie nicht gefunden",
    hasPool: "Schwimmbad",
    hasGarden: "Garten",
    hasGarage: "Garage",
    hasTerrace: "Terrasse",
    hasSecurity: "Sicherheit",
    hasAirConditioning: "Klimaanlage",
    hasHeating: "Heizung",
    hasInternet: "Internet",
    furnished: "Möbliert",
    keyAmenities: "Wichtige Annehmlichkeiten",
    errorLoading: "Fehler beim Laden der Immobilie",
  },
  es: {
    backToProperties: "Volver a las propiedades",
    available: "DISPONIBLE",
    reserved: "RESERVADO",
    rented: "ALQUILADO",
    sold: "VENDIDO",
    rent: "ALQUILER",
    sale: "VENTA",
    contact: "Contactar",
    phone: "Teléfono:",
    email: "Email:",
    whatsapp: "WhatsApp:",
    telegram: "Telegram:",
    description: "Descripción",
    specifications: "Especificaciones",
    propertyType: "Tipo de propiedad",
    bedrooms: "Dormitorios",
    bathrooms: "Baños",
    totalArea: "Área total",
    livingArea: "Área habitable",
    floor: "Piso",
    totalFloors: "Total de pisos",
    yearBuilt: "Año de construcción",
    parkingSpaces: "Plazas de aparcamiento",
    location: "Ubicación",
    address: "Dirección",
    city: "Ciudad",
    region: "Región",
    postalCode: "Código postal",
    features: "Características",
    rentalTerms: "Términos de alquiler",
    minimumStay: "Estancia mínima",
    maximumStay: "Estancia máxima",
    depositAmount: "Importe del depósito",
    utilitiesIncluded: "Servicios incluidos",
    petsAllowed: "Mascotas permitidas",
    smokingAllowed: "Fumar permitido",
    additionalTerms: "Términos adicionales",
    price: "Precio",
    bookNow: "Reservar ahora",
    selectLanguage: "Seleccionar idioma",
    sqm: "m²",
    apartment: "Apartamento",
    house: "Casa",
    plot: "Terreno",
    studio: "Estudio",
    month: "mes",
    months: "meses",
    yes: "Sí",
    no: "No",
    loading: "Cargando...",
    notFound: "Propiedad no encontrada",
    hasPool: "Piscine",
    hasGarden: "Jardín",
    hasGarage: "Garaje",
    hasTerrace: "Terraza",
    hasSecurity: "Seguridad",
    hasAirConditioning: "Aire acondicionado",
    hasHeating: "Calefacción",
    hasInternet: "Internet",
    furnished: "Amueblado",
    keyAmenities: "Comodidades principales",
    errorLoading: "Error al cargar la propiedad",
  },
};

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
  rental_terms?: {
    minimum_stay: number;
    maximum_stay: number;
    deposit_amount: number;
    utilities_included: boolean;
    pets_allowed: boolean;
    smoking_allowed: boolean;
    additional_terms?: string | null;
  } | null;
  sale_terms?: {
    price: number;
    currency: string;
    payment_terms?: string;
    additional_terms?: string;
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

interface PropertyDetailPageClientProps {
  propertyId: string;
}

export default function PropertyDetailPageClient({
  propertyId,
}: PropertyDetailPageClientProps) {
  const [language, setLanguage] = useState<
    "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  >("en");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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

  // Загрузка данных недвижимости
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl =
          process.env.NEXT_PUBLIC_STRAPI_API_URL ||
          "https://tenerifly-strapi-production.up.railway.app";

        const response = await fetch(
          `${apiUrl}/api/properties/${propertyId}?populate=*`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch property: ${response.status}`);
        }

        const data = await response.json();
        setProperty(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  // Сохранение языка в localStorage
  const handleLanguageChange = (
    langCode: "en" | "ru" | "pl" | "fr" | "uk" | "de" | "es"
  ) => {
    setLanguage(langCode);
    localStorage.setItem("selectedLanguage", langCode);
    setIsLanguageDropdownOpen(false);
  };

  // Функции для рендеринга компонентов
  const renderImageCarousel = () => {
    if (!property?.images || property.images.length === 0) {
      return (
        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
          <p className="text-gray-500">No images available</p>
        </div>
      );
    }

    return (
      <Carousel className="w-full">
        <CarouselContent>
          {property.images.map((image) => (
            <CarouselItem key={image.id}>
              <div className="relative h-96">
                <Image
                  src={
                    image.url.startsWith("http")
                      ? image.url
                      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${image.url}`
                  }
                  alt={property.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  };

  const renderSpecifications = () => {
    if (!property?.specifications) return null;

    const specs = property.specifications;
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Property Type:</span>
            <span className="font-medium">{property.category || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bedrooms:</span>
            <span className="font-medium">{specs.bedrooms || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bathrooms:</span>
            <span className="font-medium">{specs.bathrooms || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Area:</span>
            <span className="font-medium">
              {specs.total_area ? `${specs.total_area} m²` : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Living Area:</span>
            <span className="font-medium">
              {specs.living_area ? `${specs.living_area} m²` : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Floor:</span>
            <span className="font-medium">{specs.floor || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Floors:</span>
            <span className="font-medium">{specs.total_floors || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Year Built:</span>
            <span className="font-medium">{specs.year_built || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Parking Spaces:</span>
            <span className="font-medium">{specs.parking_spaces || "—"}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderFeatures = () => {
    if (!property?.features) return null;

    const features = property.features;
    const featuresList = [];

    if (features.has_pool) featuresList.push("Swimming Pool");
    if (features.has_garden) featuresList.push("Garden");
    if (features.has_garage) featuresList.push("Garage");
    if (features.has_terrace) featuresList.push("Terrace");
    if (features.has_security) featuresList.push("Security");
    if (features.has_air_conditioning) featuresList.push("Air Conditioning");
    if (features.has_heating) featuresList.push("Heating");
    if (features.has_internet) featuresList.push("Internet");
    if (features.furnished) featuresList.push("Furnished");

    if (featuresList.length === 0) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
        <div className="flex flex-wrap gap-2">
          {featuresList.map((item, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderRentalTerms = () => {
    if (!property?.rental_terms || property.type !== "rent") return null;

    const terms = property.rental_terms;
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Rental Terms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Minimum Stay:</span>
            <span className="font-medium">
              {terms.minimum_stay ? `${terms.minimum_stay} months` : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Maximum Stay:</span>
            <span className="font-medium">
              {terms.maximum_stay ? `${terms.maximum_stay} months` : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Deposit Amount:</span>
            <span className="font-medium">
              {terms.deposit_amount
                ? `€${terms.deposit_amount.toLocaleString()}`
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Utilities Included:</span>
            <span className="font-medium">
              {terms.utilities_included ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pets Allowed:</span>
            <span className="font-medium">
              {terms.pets_allowed ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Smoking Allowed:</span>
            <span className="font-medium">
              {terms.smoking_allowed ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderLocation = () => {
    if (!property?.location) return null;

    return (
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
        <div className="text-sm text-gray-600">
          <p>{property.location.city}</p>
          <p>{property.location.region}</p>
          {property.location.address && <p>{property.location.address}</p>}
          {property.location.postal_code && (
            <p>{property.location.postal_code}</p>
          )}
        </div>
      </div>
    );
  };

  const renderKeyFeatures = () => {
    if (!property?.specifications) return null;

    const specs = property.specifications;
    const features = [];

    if (specs.bedrooms) features.push(`${specs.bedrooms} bedrooms`);
    if (specs.bathrooms) features.push(`${specs.bathrooms} bathrooms`);
    if (specs.total_area) features.push(`${specs.total_area} m²`);
    if (property.features?.furnished) features.push("Furnished");

    if (features.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
        <div className="flex flex-wrap gap-1">
          {features.map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderActionButtons = () => {
    return (
      <div className="space-y-3">
        {property?.type === "rent" && (
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
        )}
        {property?.contact && (
          <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Contact Owner
          </button>
        )}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "rented":
        return "bg-blue-100 text-blue-800";
      case "sold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "AVAILABLE";
      case "reserved":
        return "RESERVED";
      case "rented":
        return "RENTED";
      case "sold":
        return "SOLD";
      default:
        return status.toUpperCase();
    }
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading property</p>
          <Link
            href="/apartments"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Property not found</p>
          <Link
            href="/apartments"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/apartments"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Back to Properties
          </Link>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>{currentLanguage?.flag}</span>
              <span className="hidden sm:inline">{currentLanguage?.name}</span>
              <svg
                className={`w-4 h-4 transition-transform ${
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
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
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
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            {/* Image Carousel */}
            <div className="mb-8 relative">{renderImageCarousel()}</div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description || "No description available"}
              </p>
            </div>

            {/* Specifications */}
            {renderSpecifications()}

            {/* Features */}
            {renderFeatures()}

            {/* Rental Terms */}
            {renderRentalTerms()}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 xl:sticky xl:top-6">
              {/* Status */}
              <div className="flex gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.property_status)}`}
                >
                  {getStatusText(property.property_status)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.type === "rent"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {property.type === "rent" ? "RENT" : "SALE"}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Price</h3>
                <div className="text-3xl font-bold text-green-600">
                  {property.price ? (
                    <>
                      €{property.price.amount.toLocaleString()}
                      <span className="text-lg text-gray-500 ml-1">
                        /{property.type === "rent" ? "month" : ""}
                      </span>
                    </>
                  ) : (
                    "Price on request"
                  )}
                </div>
              </div>

              {/* Location */}
              {renderLocation()}

              {/* Key Features */}
              {renderKeyFeatures()}

              {/* Action Buttons */}
              {renderActionButtons()}
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
        {property && (
          <SimpleBookingPopup
            opened={isBookingModalOpen}
            onClose={handleCloseBookingModal}
            item={{
              name: property.title,
              price: property.price
                ? property.type === "rent"
                  ? `€${property.price.amount.toLocaleString()}/month`
                  : `€${property.price.amount.toLocaleString()}`
                : "Price on request",
              currency: property.price?.currency || "EUR",
              contactEmail: property.contact?.email,
            }}
          />
        )}
      </div>
    </div>
  );
}
