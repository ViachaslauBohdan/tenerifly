"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { SimpleBookingPopup } from '@/components/SimpleBookingPopup'

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
        errorLoading: "Помилка завантаження нерухомості",
    },
}

// Языки с флагами
const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "pl", name: "Polski", flag: "🇵🇱" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "uk", name: "Українська", flag: "🇺🇦" },
]

interface PropertyData {
    id: number
    documentId: string
    title: string
    slug: string | null
    description: string
    type: "rent" | "sale"
    property_status: "available" | "reserved" | "rented" | "sold"
    featured: boolean
    category: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    images: Array<{
        id: number
        url: string
        formats?: {
            thumbnail?: { url: string }
            small?: { url: string }
        }
    }>
    price?: {
        amount: number
        currency: string
        period: string
    } | null
    location?: {
        address: string
        city: string
        region: string
        postal_code: string
        latitude: number
        longitude: number
    } | null
    features?: {
        has_pool: boolean
        has_garden: boolean
        has_garage: boolean
        has_terrace: boolean
        has_security: boolean
        has_air_conditioning: boolean
        has_heating: boolean
        has_internet: boolean
        furnished: boolean
        additional_features?: string | null
    } | null
    specifications?: {
        total_area: number
        living_area: number
        bedrooms: number
        bathrooms: number
        floor: number
        total_floors: number
        year_built?: number | null
        parking_spaces?: number | null
    } | null
    rental_terms?: {
        minimum_stay: number
        maximum_stay: number
        deposit_amount: number
        utilities_included: boolean
        pets_allowed: boolean
        smoking_allowed: boolean
        additional_terms?: string | null
    } | null
    sale_terms?: any | null
    contact?: {
        name: string
        email: string
        phone: string
        whatsapp?: string
        telegram?: string
        preferred_contact: string
    } | null
}

export default function PropertyDetailPage() {
    const params = useParams()
    const propertyId = params.id as string
    const [language, setLanguage] = useState<"en" | "ru" | "pl" | "fr" | "uk">("en")
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
    const [property, setProperty] = useState<PropertyData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

    const t = translations[language]
    const currentLanguage = languages.find((lang) => lang.code === language)

    // Функция для создания заголовков с авторизацией
    const getAuthHeaders = () => {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    }

    // Загрузка сохраненного языка из localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem("selectedLanguage")
        if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
            setLanguage(savedLanguage as "en" | "ru" | "pl" | "fr" | "uk")
        }
    }, [])

    // Загрузка данных недвижимости
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true)
                setError(null)

                const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://tenerifly-strapi-production.up.railway.app'
                console.log('Property Detail API URL:', apiUrl) // Для отладки

                const response = await fetch(`${apiUrl}/api/properties/${propertyId}?populate=*`, {
                    headers: getAuthHeaders()
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch property: ${response.status}`)
                }

                const data = await response.json()
                console.log('Property data:', data)
                setProperty(data.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
                console.error('Error fetching property:', err)
            } finally {
                setLoading(false)
            }
        }

        if (propertyId) {
            fetchProperty()
        }
    }, [propertyId])

    // Сохранение языка в localStorage
    const handleLanguageChange = (langCode: "en" | "ru" | "pl" | "fr" | "uk") => {
        setLanguage(langCode)
        localStorage.setItem("selectedLanguage", langCode)
        setIsLanguageDropdownOpen(false)
    }

    const getImageUrl = (imageUrl: string) => {
        // Если URL уже полный (начинается с http), возвращаем как есть
        if (imageUrl.startsWith('http')) {
            return imageUrl
        }
        // Если URL относительный, добавляем базовый URL Strapi
        const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://tenerifly-strapi-production.up.railway.app'
        return `${apiUrl}${imageUrl}`
    }

    const getPropertyTypeText = (category: string) => {
        switch (category) {
            case "apartment":
                return t.apartment
            case "house":
                return t.house
            case "plot":
                return t.plot
            default:
                return category
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "available":
                return t.available
            case "reserved":
                return t.reserved
            case "rented":
                return t.rented
            case "sold":
                return t.sold
            default:
                return status.toUpperCase()
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available":
                return "bg-green-100 text-green-800"
            case "reserved":
                return "bg-yellow-100 text-yellow-800"
            case "rented":
                return "bg-red-100 text-red-800"
            case "sold":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getTypeText = (type: string) => {
        return type === 'rent' ? t.rent : t.sale
    }

    const getTypeColor = (type: string) => {
        return type === 'rent' ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
    }

    const formatStayDuration = (duration: number) => {
        return `${duration} ${duration === 1 ? t.month : t.months}`
    }

    const getBooleanText = (value: boolean) => {
        return value ? t.yes : t.no
    }

    const handleOpenBookingModal = () => {
        setIsBookingModalOpen(true)
    }

    const handleCloseBookingModal = () => {
        setIsBookingModalOpen(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h1 className="text-xl font-semibold text-gray-900">{t.loading}</h1>
                </div>
            </div>
        )
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || t.notFound}</h1>
                    <Link href="/apartments" className="text-blue-600 hover:text-blue-800">
                        {t.backToProperties}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header with Language Switcher */}
                <div className="flex justify-between items-center mb-6">
                    <Link href="/apartments" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t.backToProperties}
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                            <span className="text-xl">{currentLanguage?.flag}</span>
                            <span className="font-medium text-gray-700 hidden sm:block">{currentLanguage?.name}</span>
                            <span className="font-medium text-gray-700 sm:hidden">{currentLanguage?.code.toUpperCase()}</span>
                            <svg
                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isLanguageDropdownOpen ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                                            onClick={() => handleLanguageChange(lang.code as "en" | "ru" | "pl" | "fr" | "uk")}
                                            className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${language === lang.code ? "bg-blue-50 text-blue-700" : "text-gray-700"
                                                }`}
                                        >
                                            <span className="text-lg">{lang.flag}</span>
                                            <span className="font-medium">{lang.name}</span>
                                            {language === lang.code && (
                                                <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
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
                    <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="xl:col-span-3 order-2 xl:order-1">
                        {/* Image Gallery with Carousel */}
                        <div className="mb-8">
                            {property.images && property.images.length > 0 ? (
                                <Carousel className="w-full">
                                    <CarouselContent>
                                        {property.images.map((image, index) => (
                                            <CarouselItem key={image.id}>
                                                <div className="relative">
                                                    <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                                                        <Image
                                                            src={getImageUrl(image.url)}
                                                            alt={`${property.title} - Image ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                            priority={index === 0}
                                                        />
                                                    </div>
                                                    {/* Image counter */}
                                                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                                        {index + 1} / {property.images.length}
                                                    </div>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="left-4 z-10 bg-white/90 hover:bg-white border-2 border-gray-200 shadow-lg" />
                                    <CarouselNext className="right-4 z-10 bg-white/90 hover:bg-white border-2 border-gray-200 shadow-lg" />
                                </Carousel>
                            ) : (
                                <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
                                    <span className="text-gray-400">No images available</span>
                                </div>
                            )}

                            {/* Thumbnail grid below carousel */}
                            {property.images && property.images.length > 1 && (
                                <div className="mt-4 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                                    {property.images.slice(0, 8).map((image, index) => (
                                        <div key={`thumb-${image.id}`} className="aspect-square relative bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                                            <Image
                                                src={getImageUrl(image.url)}
                                                alt={`${property.title} - Thumbnail ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    {property.images.length > 8 && (
                                        <div className="aspect-square bg-gray-200 rounded-md flex items-center justify-center">
                                            <span className="text-sm text-gray-600 font-medium">
                                                +{property.images.length - 8}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.description}</h2>
                            <p className="text-gray-600 leading-relaxed">{property.description}</p>
                        </div>

                        {/* Specifications */}
                        {property.specifications && (
                            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">{t.specifications}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.propertyType}:</span>
                                        <span className="font-medium text-gray-900">{getPropertyTypeText(property.category)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.bedrooms}:</span>
                                        <span className="font-medium text-gray-900">{property.specifications.bedrooms}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.bathrooms}:</span>
                                        <span className="font-medium text-gray-900">{property.specifications.bathrooms}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.totalArea}:</span>
                                        <span className="font-medium text-gray-900">{property.specifications.total_area} {t.sqm}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.livingArea}:</span>
                                        <span className="font-medium text-gray-900">{property.specifications.living_area} {t.sqm}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.floor}:</span>
                                        <span className="font-medium text-gray-900">{property.specifications.floor}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.totalFloors}:</span>
                                        <span className="font-medium text-gray-900">{property.specifications.total_floors}</span>
                                    </div>
                                    {property.specifications.year_built && (
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">{t.yearBuilt}:</span>
                                            <span className="font-medium text-gray-900">{property.specifications.year_built}</span>
                                        </div>
                                    )}
                                    {property.specifications.parking_spaces && (
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-600">{t.parkingSpaces}:</span>
                                            <span className="font-medium text-gray-900">{property.specifications.parking_spaces}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        {property.location && (
                            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">{t.location}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.address}:</span>
                                        <span className="font-medium text-gray-900">{property.location.address}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.city}:</span>
                                        <span className="font-medium text-gray-900">{property.location.city}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.region}:</span>
                                        <span className="font-medium text-gray-900">{property.location.region}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.postalCode}:</span>
                                        <span className="font-medium text-gray-900">{property.location.postal_code}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        {property.features && (
                            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">{t.features}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {property.features.has_pool && (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-700">{t.hasPool}</span>
                                        </div>
                                    )}
                                    {property.features.has_garden && (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-700">{t.hasGarden}</span>
                                        </div>
                                    )}
                                    {property.features.has_garage && (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-700">{t.hasGarage}</span>
                                        </div>
                                    )}
                                    {property.features.has_terrace && (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-700">{t.hasTerrace}</span>
                                        </div>
                                    )}
                                    {property.features.has_security && (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-700">{t.hasSecurity}</span>
                                        </div>
                                    )}
                                    {property.features.has_air_conditioning && (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-700">{t.hasAirConditioning}</span>
                                        </div>
                                    )}
                                    {property.features.has_heating && (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-700">{t.hasHeating}</span>
                                        </div>
                                    )}
                                    {property.features.has_internet && (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-700">{t.hasInternet}</span>
                                        </div>
                                    )}
                                    {property.features.furnished && (
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-700">{t.furnished}</span>
                                        </div>
                                    )}
                                </div>
                                {property.features.additional_features && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-gray-600">{property.features.additional_features}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Rental Terms */}
                        {property.rental_terms && property.type === 'rent' && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">{t.rentalTerms}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.minimumStay}:</span>
                                        <span className="font-medium text-gray-900">{formatStayDuration(property.rental_terms.minimum_stay)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.maximumStay}:</span>
                                        <span className="font-medium text-gray-900">{formatStayDuration(property.rental_terms.maximum_stay)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.depositAmount}:</span>
                                        <span className="font-medium text-gray-900">€{property.rental_terms.deposit_amount}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.utilitiesIncluded}:</span>
                                        <span className="font-medium text-gray-900">{getBooleanText(property.rental_terms.utilities_included)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.petsAllowed}:</span>
                                        <span className="font-medium text-gray-900">{getBooleanText(property.rental_terms.pets_allowed)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">{t.smokingAllowed}:</span>
                                        <span className="font-medium text-gray-900">{getBooleanText(property.rental_terms.smoking_allowed)}</span>
                                    </div>
                                </div>
                                {property.rental_terms.additional_terms && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h3 className="font-medium text-gray-900 mb-2">{t.additionalTerms}:</h3>
                                        <p className="text-gray-600">{property.rental_terms.additional_terms}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="xl:col-span-1 order-1 xl:order-2">
                        <div className="bg-white rounded-lg shadow-sm border p-6 xl:sticky xl:top-6">
                            {/* Status and Type */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.property_status)}`}>
                                    {getStatusText(property.property_status)}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(property.type)}`}>
                                    {getTypeText(property.type)}
                                </span>
                            </div>

                            {/* Price */}
                            {property.price && (
                                <div className="mb-6">
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        {property.price.currency} {property.price.amount.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {property.type === 'rent' ? `/ ${t.month}` : t.price}
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            {property.location && (
                                <div className="flex items-center text-gray-600 mb-6">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm">
                                        {property.location.city}, {property.location.region}
                                    </span>
                                </div>
                            )}



                            {/* Contact Info */}
                            {property.contact && (
                                <div className="space-y-3 mb-6">
                                    <div>
                                        <span className="text-sm text-gray-600">{t.phone}</span>
                                        <div className="font-medium text-gray-900">{property.contact.phone}</div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">{t.email}</span>
                                        <div className="font-medium text-gray-900">{property.contact.email}</div>
                                    </div>
                                    {property.contact.whatsapp && (
                                        <div>
                                            <span className="text-sm text-gray-600">{t.whatsapp}</span>
                                            <div className="font-medium text-gray-900">{property.contact.whatsapp}</div>
                                        </div>
                                    )}
                                    {property.contact.telegram && (
                                        <div>
                                            <span className="text-sm text-gray-600">{t.telegram}</span>
                                            <div className="font-medium text-gray-900">{property.contact.telegram}</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Book Now Button */}
                            {property.property_status === 'available' && (
                                <button
                                    onClick={handleOpenBookingModal}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                >
                                    {t.bookNow}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Click outside to close dropdown */}
                {isLanguageDropdownOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setIsLanguageDropdownOpen(false)} />
                )}

                {/* Booking Modal */}
                {property && (
                    <SimpleBookingPopup
                        opened={isBookingModalOpen}
                        onClose={handleCloseBookingModal}
                        item={{
                            name: property.title,
                            price: property.price ? `${property.price.currency} ${property.price.amount.toLocaleString()}/${property.type === 'rent' ? 'month' : 'night'}` : undefined,
                            currency: property.price?.currency,
                            contactEmail: property.contact?.email
                        }}
                    />
                )}
            </div>
        </div>
    )
}
