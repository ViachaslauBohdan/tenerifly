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
        backToCars: "Back to Cars",
        available: "AVAILABLE",
        reserved: "RESERVED",
        sold: "SOLD",
        rent: "RENT",
        sale: "SALE",
        contact: "Contact",
        phone: "Phone:",
        email: "Email:",
        whatsapp: "WhatsApp:",
        telegram: "Telegram:",
        description: "Description",
        technicalSpecs: "Technical Specifications",
        brand: "Brand",
        model: "Model",
        year: "Year",
        mileage: "Mileage",
        fuel: "Fuel",
        transmission: "Transmission",
        power: "Power",
        doors: "Doors",
        seats: "Seats",
        color: "Color",
        bodyType: "Body Type",
        driveType: "Drive Type",
        equipment: "Equipment",
        rentalPrices: "Rental Prices",
        salePrice: "Sale Price",
        perDay: "per day",
        per3Days: "per 3 days",
        perWeek: "per week",
        perMonth: "month",
        bookNow: "Book",
        contactSeller: "Contact Seller",
        selectLanguage: "Select Language",
        km: "km",
        hp: "hp",
        petrol: "Petrol",
        diesel: "Diesel",
        hybrid: "Hybrid",
        electric: "Electric",
        manual: "Manual",
        automatic: "Automatic",
        airConditioning: "Air Conditioning",
        bluetooth: "Bluetooth",
        navigation: "Navigation",
        parkingSensors: "Parking Sensors",
        carNotFound: "Car not found",
        loading: "Loading...",
        error: "Error loading car details",
        noData: "—",
        noImagesAvailable: "No images available",
    },
    ru: {
        backToCars: "Назад к автомобилям",
        available: "ДОСТУПЕН",
        reserved: "ЗАБРОНИРОВАН",
        sold: "ПРОДАН",
        rent: "АРЕНДА",
        sale: "ПРОДАЖА",
        contact: "Связаться",
        phone: "Телефон:",
        email: "Email:",
        whatsapp: "WhatsApp:",
        telegram: "Telegram:",
        description: "Описание",
        technicalSpecs: "Технические характеристики",
        brand: "Марка",
        model: "Модель",
        year: "Год выпуска",
        mileage: "Пробег",
        fuel: "Топливо",
        transmission: "КПП",
        power: "Мощность",
        doors: "Двери",
        seats: "Места",
        color: "Цвет",
        bodyType: "Тип кузова",
        driveType: "Привод",
        equipment: "Комплектация",
        rentalPrices: "Цены на аренду",
        salePrice: "Цена продажи",
        perDay: "за день",
        per3Days: "за 3 дня",
        perWeek: "за неделю",
        perMonth: "месяц",
        bookNow: "Забронировать",
        contactSeller: "Связаться с продавцом",
        selectLanguage: "Выбрать язык",
        km: "км",
        hp: "л.с.",
        petrol: "Бензин",
        diesel: "Дизель",
        hybrid: "Гибрид",
        electric: "Электрический",
        manual: "Механическая",
        automatic: "Автоматическая",
        airConditioning: "Кондиционер",
        bluetooth: "Bluetooth",
        navigation: "Навигация",
        parkingSensors: "Парктроники",
        carNotFound: "Автомобиль не найден",
        loading: "Загрузка...",
        error: "Ошибка загрузки данных автомобиля",
        noData: "—",
        noImagesAvailable: "Изображения недоступны",
    },
    pl: {
        backToCars: "Powrót do samochodów",
        available: "DOSTĘPNY",
        reserved: "ZAREZERWOWANY",
        sold: "SPRZEDANY",
        rent: "WYNAJEM",
        sale: "SPRZEDAŻ",
        contact: "Kontakt",
        phone: "Telefon:",
        email: "Email:",
        whatsapp: "WhatsApp:",
        telegram: "Telegram:",
        description: "Opis",
        technicalSpecs: "Specyfikacja techniczna",
        brand: "Marka",
        model: "Model",
        year: "Rok produkcji",
        mileage: "Przebieg",
        fuel: "Paliwo",
        transmission: "Skrzynia biegów",
        power: "Moc",
        doors: "Drzwi",
        seats: "Miejsca",
        color: "Kolor",
        bodyType: "Typ nadwozia",
        driveType: "Napęd",
        equipment: "Wyposażenie",
        rentalPrices: "Ceny wynajmu",
        salePrice: "Cena sprzedaży",
        perDay: "za dzień",
        per3Days: "za 3 dni",
        perWeek: "za tydzień",
        perMonth: "miesiąc",
        bookNow: "Zarezerwuj teraz",
        contactSeller: "Skontaktuj się ze sprzedawcą",
        selectLanguage: "Wybierz język",
        km: "km",
        hp: "KM",
        petrol: "Benzyna",
        diesel: "Diesel",
        hybrid: "Hybryda",
        electric: "Elektryczny",
        manual: "Manualna",
        automatic: "Automatyczna",
        airConditioning: "Klimatyzacja",
        bluetooth: "Bluetooth",
        navigation: "Nawigacja",
        parkingSensors: "Czujniki parkowania",
        carNotFound: "Samochód nie znaleziony",
        loading: "Ładowanie...",
        error: "Błąd podczas ładowania danych samochodu",
        noData: "—",
        noImagesAvailable: "Brak dostępnych zdjęć",
    },
    fr: {
        backToCars: "Retour aux voitures",
        available: "DISPONIBLE",
        reserved: "RÉSERVÉ",
        sold: "VENDU",
        rent: "LOCATION",
        sale: "VENTE",
        contact: "Contact",
        phone: "Téléphone:",
        email: "Email:",
        whatsapp: "WhatsApp:",
        telegram: "Telegram:",
        description: "Description",
        technicalSpecs: "Spécifications techniques",
        brand: "Marque",
        model: "Modèle",
        year: "Année",
        mileage: "Kilométrage",
        fuel: "Carburant",
        transmission: "Transmission",
        power: "Puissance",
        doors: "Portes",
        seats: "Places",
        color: "Couleur",
        bodyType: "Type de carrosserie",
        driveType: "Type de transmission",
        equipment: "Équipement",
        rentalPrices: "Prix de location",
        salePrice: "Prix de vente",
        perDay: "par jour",
        per3Days: "pour 3 jours",
        perWeek: "par semaine",
        perMonth: "mois",
        bookNow: "Réserver maintenant",
        contactSeller: "Contacter le vendeur",
        selectLanguage: "Choisir la langue",
        km: "km",
        hp: "ch",
        petrol: "Essence",
        diesel: "Diesel",
        hybrid: "Hybride",
        electric: "Électrique",
        manual: "Manuelle",
        automatic: "Automatique",
        airConditioning: "Climatisation",
        bluetooth: "Bluetooth",
        navigation: "Navigation",
        parkingSensors: "Capteurs de stationnement",
        carNotFound: "Voiture non trouvée",
        loading: "Chargement...",
        error: "Erreur lors du chargement des détails de la voiture",
        noData: "—",
        noImagesAvailable: "Aucune image disponible",
    },
    uk: {
        backToCars: "Назад до автомобілів",
        available: "ДОСТУПНИЙ",
        reserved: "ЗАБРОНЬОВАНИЙ",
        sold: "ПРОДАНИЙ",
        rent: "ОРЕНДА",
        sale: "ПРОДАЖ",
        contact: "Зв'язатися",
        phone: "Телефон:",
        email: "Email:",
        whatsapp: "WhatsApp:",
        telegram: "Telegram:",
        description: "Опис",
        technicalSpecs: "Технічні характеристики",
        brand: "Марка",
        model: "Модель",
        year: "Рік випуску",
        mileage: "Пробіг",
        fuel: "Паливо",
        transmission: "КПП",
        power: "Потужність",
        doors: "Двері",
        seats: "Місця",
        color: "Колір",
        bodyType: "Тип кузова",
        driveType: "Привід",
        equipment: "Комплектація",
        rentalPrices: "Ціни на оренду",
        salePrice: "Ціна продажу",
        perDay: "за день",
        per3Days: "за 3 дні",
        perWeek: "за тиждень",
        perMonth: "місяць",
        bookNow: "Забронювати",
        contactSeller: "Зв'язатися з продавцем",
        selectLanguage: "Обрати мову",
        km: "км",
        hp: "к.с.",
        petrol: "Бензин",
        diesel: "Дизель",
        hybrid: "Гібрид",
        electric: "Електричний",
        manual: "Механічна",
        automatic: "Автоматична",
        airConditioning: "Кондиціонер",
        bluetooth: "Bluetooth",
        navigation: "Навігація",
        parkingSensors: "Парктроніки",
        carNotFound: "Автомобіль не знайдено",
        loading: "Завантаження...",
        error: "Помилка завантаження даних автомобіля",
        noData: "—",
        noImagesAvailable: "Зображення недоступні",
    },
} as const

// Языки с флагами
const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "pl", name: "Polski", flag: "🇵🇱" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "uk", name: "Українська", flag: "🇺🇦" },
] as const

type LanguageCode = keyof typeof translations

interface CarData {
    id: number
    documentId: string
    title: string
    slug: string | null
    description: string
    type: "rent" | "sale"
    car_status: "available" | "reserved" | "rented" | "sold"
    featured: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
    images: Array<{
        id: number
        url: string
        width?: number
        height?: number
        formats?: {
            thumbnail?: { url: string }
            small?: { url: string }
        }
    }>
    rental_prices?: {
        day_1: number
        day_3?: number
        day_7?: number
        month: number
        currency: string
    } | null
    specifications?: {
        make: string
        model: string
        year: number
        mileage?: number
        fuel: string
        transmission: string
        power: number
        seats: number
        doors: number
        color: string
        body_type: string
        drive_type: string
    } | null
    features?: {
        air_conditioning: boolean
        bluetooth: boolean
        navigation: boolean
        parking_sensors: boolean
        other_features?: string
    } | null
    location?: {
        city: string
        region?: string | null
        address: string
    } | null
    contact?: {
        name: string
        email: string
        phone: string
        whatsapp?: string
        telegram?: string
        preferred_contact: string
    } | null
}

export default function CarDetailPage() {
    const params = useParams()
    const carId = params.id as string
    const [language, setLanguage] = useState<LanguageCode>("en")
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
    const [car, setCar] = useState<CarData | null>(null)
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

    // Загрузка данных автомобиля по documentId
    useEffect(() => {
        const fetchCar = async () => {
            try {
                setLoading(true)
                const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'
                console.log('CarDetail API URL:', apiUrl) // Для отладки

                const response = await fetch(`${apiUrl}/api/cars/${carId}?populate=*`, {
                    headers: getAuthHeaders()
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch car details')
                }

                const data = await response.json()
                setCar(data.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
                console.error('Error fetching car details:', err)
            } finally {
                setLoading(false)
            }
        }

        if (carId) {
            fetchCar()
        }
    }, [carId])

    // Загрузка сохраненного языка из localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem("selectedLanguage")
        if (savedLanguage && translations[savedLanguage as LanguageCode]) {
            setLanguage(savedLanguage as LanguageCode)
        }
    }, [])

    // Сохранение языка в localStorage
    const handleLanguageChange = (langCode: LanguageCode) => {
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
        const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'
        return `${apiUrl}${imageUrl}`
    }

    const getFuelText = (fuel: string) => {
        switch (fuel) {
            case "petrol":
            case "gasoline":
                return t.petrol
            case "diesel":
                return t.diesel
            case "hybrid":
                return t.hybrid
            case "electric":
                return t.electric
            default:
                return fuel
        }
    }

    const getTransmissionText = (transmission: string) => {
        return transmission === "automatic" ? t.automatic : t.manual
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "available":
                return t.available
            case "reserved":
                return t.reserved
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
            case "sold":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getFeatures = () => {
        const features: string[] = []
        if (car?.features) {
            if (car.features.air_conditioning) features.push(t.airConditioning)
            if (car.features.bluetooth) features.push(t.bluetooth)
            if (car.features.navigation) features.push(t.navigation)
            if (car.features.parking_sensors) features.push(t.parkingSensors)
        }
        return features
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

    if (error || !car) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {error ? t.error : t.carNotFound}
                    </h1>
                    <Link href="/cars" className="text-blue-600 hover:text-blue-800">
                        {t.backToCars}
                    </Link>
                </div>
            </div>
        )
    }

    const renderImageCarousel = () => {
        if (car.images && car.images.length > 0) {
            return (
                <Carousel className="w-full">
                    <CarouselContent>
                        {car.images.map((image, index) => (
                            <CarouselItem key={index}>
                                <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
                                    <Image
                                        src={getImageUrl(image.url)}
                                        alt={`${car.title} - Image ${index + 1}`}
                                        width={800}
                                        height={600}
                                        className="object-contain max-w-full max-h-[600px] rounded-lg"
                                        style={{
                                            width: 'auto',
                                            height: 'auto',
                                            maxWidth: '100%',
                                            maxHeight: '600px'
                                        }}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {car.images.length > 1 && (
                        <>
                            <CarouselPrevious className="left-4 z-10 bg-white/80 hover:bg-white border-2 border-gray-200 shadow-lg" />
                            <CarouselNext className="right-4 z-10 bg-white/80 hover:bg-white border-2 border-gray-200 shadow-lg" />
                        </>
                    )}
                </Carousel>
            )
        }

        return (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
                <span className="text-gray-400">{t.noImagesAvailable}</span>
            </div>
        )
    }

    const renderTechnicalSpecs = () => {
        if (!car.specifications) return null

        return (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t.technicalSpecs}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{t.brand}:</span>
                        <span className="font-medium text-gray-900">{car.specifications.make || t.noData}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{t.model}:</span>
                        <span className="font-medium text-gray-900">{car.specifications.model || t.noData}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{t.year}:</span>
                        <span className="font-medium text-gray-900">{car.specifications.year || t.noData}</span>
                    </div>
                    {car.specifications.mileage && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">{t.mileage}:</span>
                            <span className="font-medium text-gray-900">
                                {car.specifications.mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} {t.km}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{t.fuel}:</span>
                        <span className="font-medium text-gray-900">{getFuelText(car.specifications.fuel) || t.noData}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{t.transmission}:</span>
                        <span className="font-medium text-gray-900">{getTransmissionText(car.specifications.transmission) || t.noData}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{t.power}:</span>
                        <span className="font-medium text-gray-900">
                            {car.specifications.power ? `${car.specifications.power} ${t.hp}` : t.noData}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{t.doors}:</span>
                        <span className="font-medium text-gray-900">{car.specifications.doors || t.noData}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{t.seats}:</span>
                        <span className="font-medium text-gray-900">{car.specifications.seats || t.noData}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{t.color}:</span>
                        <span className="font-medium text-gray-900">{car.specifications.color || t.noData}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{t.bodyType}:</span>
                        <span className="font-medium text-gray-900">{car.specifications.body_type || t.noData}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{t.driveType}:</span>
                        <span className="font-medium text-gray-900">{car.specifications.drive_type || t.noData}</span>
                    </div>
                </div>
            </div>
        )
    }

    const renderEquipment = () => {
        const features = getFeatures()
        if (features.length === 0) return null

        return (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t.equipment}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {features.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-gray-700">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const renderRentalPrices = () => {
        if (car.type !== 'rent' || !car.rental_prices) return null

        return (
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t.rentalPrices}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {car.rental_prices.day_1 && (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {car.rental_prices.currency} {car.rental_prices.day_1.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">{t.perDay}</div>
                        </div>
                    )}
                    {car.rental_prices.day_3 && (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {car.rental_prices.currency} {car.rental_prices.day_3.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">{t.per3Days}</div>
                        </div>
                    )}
                    {car.rental_prices.day_7 && (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {car.rental_prices.currency} {car.rental_prices.day_7.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">{t.perWeek}</div>
                        </div>
                    )}
                    {car.rental_prices.month && (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {car.rental_prices.currency} {car.rental_prices.month.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">{t.perMonth}</div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const renderLocation = () => {
        if (!car.location) return null

        return (
            <div className="flex items-center text-gray-600 mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span className="text-sm">
                    {car.location.region ? `${car.location.city}, ${car.location.region}` : car.location.city}
                </span>
            </div>
        )
    }

    const renderKeyFeatures = () => {
        if (!car.features) return null

        return (
            <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                <div className="space-y-2">
                    {car.features.air_conditioning && (
                        <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">Air Conditioning</span>
                        </div>
                    )}
                    {car.features.bluetooth && (
                        <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">Bluetooth</span>
                        </div>
                    )}
                    {car.features.navigation && (
                        <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">Navigation</span>
                        </div>
                    )}
                    {car.features.parking_sensors && (
                        <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">Parking Sensors</span>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const renderActionButtons = () => {
        if (car.car_status !== 'available') return null

        return (
            <div className="space-y-3">
                {/* WhatsApp Contact Button */}
                {car.contact?.whatsapp && (
                    <a
                        href={`https://wa.me/${car.contact.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                        </svg>
                        {t.whatsapp}
                    </a>
                )}

                {/* Telegram Contact Button */}
                {car.contact?.telegram && (
                    <a
                        href={`https://t.me/${car.contact.telegram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                        {t.telegram}
                    </a>
                )}

                <button
                    onClick={handleOpenBookingModal}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    {t.bookNow}
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header with Language Switcher */}
                <div className="flex justify-between items-center mb-6">
                    <Link href="/cars" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t.backToCars}
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
                                            onClick={() => handleLanguageChange(lang.code)}
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
                    <h1 className="text-3xl font-bold text-gray-900">{car.title}</h1>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="xl:col-span-3 order-2 xl:order-1">
                        {/* Image Carousel */}
                        <div className="mb-8 relative">
                            {renderImageCarousel()}
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.description}</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {car.description || t.noData}
                            </p>
                        </div>

                        {/* Technical Specifications */}
                        {renderTechnicalSpecs()}

                        {/* Equipment */}
                        {renderEquipment()}

                        {/* Rental Prices */}
                        {renderRentalPrices()}
                    </div>

                    {/* Sidebar */}
                    <div className="xl:col-span-1 order-1 xl:order-2">
                        <div className="bg-white rounded-lg shadow-sm border p-6 xl:sticky xl:top-6">
                            {/* Status */}
                            <div className="flex gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(car.car_status)}`}>
                                    {getStatusText(car.car_status)}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${car.type === 'rent' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                    }`}>
                                    {car.type === 'rent' ? t.rent : t.sale}
                                </span>
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
                    <div className="fixed inset-0 z-40" onClick={() => setIsLanguageDropdownOpen(false)} />
                )}

                {/* Booking Modal */}
                {car && (
                    <SimpleBookingPopup
                        opened={isBookingModalOpen}
                        onClose={handleCloseBookingModal}
                        item={{
                            name: car.title,
                            price: car.rental_prices ? `${car.rental_prices.currency} ${car.rental_prices.day_1.toLocaleString()}/day` : undefined,
                            currency: car.rental_prices?.currency,
                            contactEmail: car.contact?.email
                        }}
                    />
                )}
            </div>
        </div>
    )
}
