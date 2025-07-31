'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import ToursFilter from "./ToursFilter"
import TourCard from "./TourCard"

// Переводы для всех языков
const translations = {
    en: {
        backToHome: "Back to Home",
        toursInTenerife: "Tours in Tenerife",
        filters: "Filters",
        location: "Location",
        allLocations: "All locations",
        cities: "Cities",
        regions: "Regions",
        tourType: "Tour type",
        allTypes: "All types",
        boatTrip: "Boat trip",
        walkingTour: "Walking tour",
        jeepSafari: "Jeep safari",
        museum: "Museum",
        waterPark: "Water park",
        volcano: "Volcano tour",
        wineyard: "Winery tour",
        dolphinWatching: "Dolphin watching",
        cultural: "Cultural",
        adventure: "Adventure",
        price: "Price (€)",
        from: "From",
        to: "To",
        duration: "Duration",
        hours: "Hours",
        days: "Days",
        availableDates: "Available dates",
        guideLanguage: "Guide language",
        allLanguages: "All languages",
        english: "English",
        spanish: "Spanish",
        german: "German",
        french: "French",
        russian: "Russian",
        tourCategory: "Tour category",
        allCategories: "All categories",
        familyFriendly: "Family friendly",
        forChildren: "For children",
        extreme: "Extreme",
        romantic: "Romantic",
        groupSize: "Group size",
        anySize: "Any size",
        individual: "Individual",
        smallGroup: "Small group (2-8)",
        largeGroup: "Large group (9+)",
        included: "Included",
        transport: "Transport",
        meals: "Meals",
        tickets: "Tickets",
        difficultyLevel: "Difficulty level",
        allLevels: "All levels",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        rating: "Rating",
        anyRating: "Any rating",
        rating4plus: "4+ stars",
        rating45plus: "4.5+ stars",
        resetFilters: "Reset filters",
        available: "AVAILABLE",
        viewDetails: "View Details",
        bookNow: "Book",
        selectLanguage: "Select Language",
        excitingDescription: "Exciting and unforgettable tour experience in Tenerife!",
        features: {
            transport: "Transport",
            meals: "Meals",
            tickets: "Tickets",
            guide: "Guide",
            familyFriendly: "Family",
            extreme: "Extreme",
        },
        reviewsText: "reviews",
        ratingText: "Rating",
    },
    ru: {
        backToHome: "Назад на главную",
        toursInTenerife: "Экскурсии в Тенерифе",
        filters: "Фильтры",
        location: "Локация",
        allLocations: "Все локации",
        cities: "Города",
        regions: "Регионы",
        tourType: "Тип развлечения",
        allTypes: "Все типы",
        boatTrip: "Прогулка на катере",
        walkingTour: "Пешая экскурсия",
        jeepSafari: "Джип-сафари",
        museum: "Музей",
        waterPark: "Аквапарк",
        volcano: "Экскурсия к вулкану",
        wineyard: "Винная экскурсия",
        dolphinWatching: "Наблюдение за дельфинами",
        cultural: "Культурная",
        adventure: "Приключенческая",
        price: "Цена (€)",
        from: "От",
        to: "До",
        duration: "Продолжительность",
        hours: "Часов",
        days: "Дней",
        availableDates: "Доступные даты",
        guideLanguage: "Язык гида",
        allLanguages: "Все языки",
        english: "Английский",
        spanish: "Испанский",
        german: "Немецкий",
        french: "Французский",
        russian: "Русский",
        tourCategory: "Подходит для",
        allCategories: "Все категории",
        familyFriendly: "Семейные",
        forChildren: "Для детей",
        extreme: "Экстремальные",
        romantic: "Романтические",
        groupSize: "Количество участников",
        anySize: "Любое количество",
        individual: "Индивидуально",
        smallGroup: "Малая группа (2-8)",
        largeGroup: "Большая группа (9+)",
        included: "Включено",
        transport: "Транспорт",
        meals: "Питание",
        tickets: "Билеты",
        difficultyLevel: "Уровень сложности",
        allLevels: "Все уровни",
        easy: "Лёгкий",
        medium: "Средний",
        hard: "Сложный",
        rating: "Оценки и отзывы",
        anyRating: "Любой рейтинг",
        rating4plus: "4+ звезды",
        rating45plus: "4.5+ звезды",
        resetFilters: "Сбросить фильтры",
        available: "ДОСТУПНА",
        viewDetails: "Подробнее",
        bookNow: "Забронировать",
        selectLanguage: "Выбрать язык",
        excitingDescription: "Захватывающая и незабываемая экскурсия в Тенерифе!",
        features: {
            transport: "Транспорт",
            meals: "Питание",
            tickets: "Билеты",
            guide: "Гид",
            familyFriendly: "Семейная",
            extreme: "Экстрим",
        },
        reviewsText: "отзывов",
        ratingText: "Рейтинг",
    },
    pl: {
        backToHome: "Powrót do strony głównej",
        toursInTenerife: "Wycieczki na Teneryfie",
        filters: "Filtry",
        location: "Lokalizacja",
        allLocations: "Wszystkie lokalizacje",
        cities: "Miasta",
        regions: "Regiony",
        tourType: "Typ rozrywki",
        allTypes: "Wszystkie typy",
        boatTrip: "Rejs łodzią",
        walkingTour: "Wycieczka piesza",
        jeepSafari: "Safari jeepem",
        museum: "Muzeum",
        waterPark: "Park wodny",
        volcano: "Wycieczka do wulkanu",
        wineyard: "Wycieczka do winnicy",
        dolphinWatching: "Obserwacja delfinów",
        cultural: "Kulturalna",
        adventure: "Przygodowa",
        price: "Cena (€)",
        from: "Od",
        to: "Do",
        duration: "Czas trwania",
        hours: "Godzin",
        days: "Dni",
        availableDates: "Dostępne daty",
        guideLanguage: "Język przewodnika",
        allLanguages: "Wszystkie języki",
        english: "Angielski",
        spanish: "Hiszpański",
        german: "Niemiecki",
        french: "Francuski",
        russian: "Rosyjski",
        tourCategory: "Odpowiednie dla",
        allCategories: "Wszystkie kategorie",
        familyFriendly: "Rodzinne",
        forChildren: "Dla dzieci",
        extreme: "Ekstremalne",
        romantic: "Romantyczne",
        groupSize: "Liczba uczestników",
        anySize: "Dowolna liczba",
        individual: "Indywidualnie",
        smallGroup: "Mała grupa (2-8)",
        largeGroup: "Duża grupa (9+)",
        included: "W cenie",
        transport: "Transport",
        meals: "Posiłki",
        tickets: "Bilety",
        difficultyLevel: "Poziom trudności",
        allLevels: "Wszystkie poziomy",
        easy: "Łatwy",
        medium: "Średni",
        hard: "Trudny",
        rating: "Oceny i opinie",
        anyRating: "Dowolna ocena",
        rating4plus: "4+ gwiazdki",
        rating45plus: "4.5+ gwiazdki",
        resetFilters: "Resetuj filtry",
        available: "DOSTĘPNA",
        viewDetails: "Zobacz szczegóły",
        bookNow: "Zarezerwuj teraz",
        selectLanguage: "Wybierz język",
        excitingDescription: "Ekscytująca i niezapomniana wycieczka na Teneryfie!",
        features: {
            transport: "Transport",
            meals: "Posiłki",
            tickets: "Bilety",
            guide: "Przewodnik",
            familyFriendly: "Rodzinna",
            extreme: "Ekstremalna",
        },
        reviewsText: "opinii",
        ratingText: "Ocena",
    },
    fr: {
        backToHome: "Retour à l'accueil",
        toursInTenerife: "Excursions à Tenerife",
        filters: "Filtres",
        location: "Emplacement",
        allLocations: "Tous les emplacements",
        cities: "Villes",
        regions: "Régions",
        tourType: "Type de divertissement",
        allTypes: "Tous les types",
        boatTrip: "Excursion en bateau",
        walkingTour: "Visite à pied",
        jeepSafari: "Safari en jeep",
        museum: "Musée",
        waterPark: "Parc aquatique",
        volcano: "Excursion au volcan",
        wineyard: "Visite de vignoble",
        dolphinWatching: "Observation des dauphins",
        cultural: "Culturelle",
        adventure: "Aventure",
        price: "Prix (€)",
        from: "De",
        to: "À",
        duration: "Durée",
        hours: "Heures",
        days: "Jours",
        availableDates: "Dates disponibles",
        guideLanguage: "Langue du guide",
        allLanguages: "Toutes les langues",
        english: "Anglais",
        spanish: "Espagnol",
        german: "Allemand",
        french: "Français",
        russian: "Russe",
        tourCategory: "Convient pour",
        allCategories: "Toutes les catégories",
        familyFriendly: "Familiales",
        forChildren: "Pour enfants",
        extreme: "Extrêmes",
        romantic: "Romantiques",
        groupSize: "Nombre de participants",
        anySize: "Tout nombre",
        individual: "Individuel",
        smallGroup: "Petit groupe (2-8)",
        largeGroup: "Grand groupe (9+)",
        included: "Inclus",
        transport: "Transport",
        meals: "Repas",
        tickets: "Billets",
        difficultyLevel: "Niveau de difficulté",
        allLevels: "Tous les niveaux",
        easy: "Facile",
        medium: "Moyen",
        hard: "Difficile",
        rating: "Notes et avis",
        anyRating: "Toute note",
        rating4plus: "4+ étoiles",
        rating45plus: "4.5+ étoiles",
        resetFilters: "Réinitialiser les filtres",
        available: "DISPONIBLE",
        viewDetails: "Voir les détails",
        bookNow: "Réserver maintenant",
        selectLanguage: "Choisir la langue",
        excitingDescription: "Excursion passionnante et inoubliable à Tenerife!",
        features: {
            transport: "Transport",
            meals: "Repas",
            tickets: "Billets",
            guide: "Guide",
            familyFriendly: "Familiale",
            extreme: "Extrême",
        },
        reviewsText: "avis",
        ratingText: "Note",
    },
    uk: {
        backToHome: "Повернутися на головну",
        toursInTenerife: "Екскурсії на Тенеріфе",
        filters: "Фільтри",
        location: "Локація",
        allLocations: "Всі локації",
        cities: "Міста",
        regions: "Регіони",
        tourType: "Тип розваги",
        allTypes: "Всі типи",
        boatTrip: "Прогулянка на катері",
        walkingTour: "Пішохідна екскурсія",
        jeepSafari: "Джип-сафарі",
        museum: "Музей",
        waterPark: "Аквапарк",
        volcano: "Екскурсія до вулкану",
        wineyard: "Винна екскурсія",
        dolphinWatching: "Спостереження за дельфінами",
        cultural: "Культурна",
        adventure: "Пригодницька",
        price: "Ціна (€)",
        from: "Від",
        to: "До",
        duration: "Тривалість",
        hours: "Годин",
        days: "Днів",
        availableDates: "Доступні дати",
        guideLanguage: "Мова гіда",
        allLanguages: "Всі мови",
        english: "Англійська",
        spanish: "Іспанська",
        german: "Німецька",
        french: "Французька",
        russian: "Російська",
        tourCategory: "Підходить для",
        allCategories: "Всі категорії",
        familyFriendly: "Сімейні",
        forChildren: "Для дітей",
        extreme: "Екстремальні",
        romantic: "Романтичні",
        groupSize: "Кількість учасників",
        anySize: "Будь-яка кількість",
        individual: "Індивідуально",
        smallGroup: "Мала група (2-8)",
        largeGroup: "Велика група (9+)",
        included: "Включено",
        transport: "Транспорт",
        meals: "Харчування",
        tickets: "Квитки",
        difficultyLevel: "Рівень складності",
        allLevels: "Всі рівні",
        easy: "Легкий",
        medium: "Середній",
        hard: "Складний",
        rating: "Оцінки та відгуки",
        anyRating: "Будь-який рейтинг",
        rating4plus: "4+ зірки",
        rating45plus: "4.5+ зірки",
        resetFilters: "Скинути фільтри",
        available: "ДОСТУПНА",
        viewDetails: "Детальніше",
        bookNow: "Забронювати",
        selectLanguage: "Обрати мову",
        excitingDescription: "Захоплююча та незабутня екскурсія на Тенеріфе!",
        features: {
            transport: "Транспорт",
            meals: "Харчування",
            tickets: "Квитки",
            guide: "Гід",
            familyFriendly: "Сімейна",
            extreme: "Екстрим",
        },
        reviewsText: "відгуків",
        ratingText: "Рейтинг",
    },
}

const getLoadingToursText = (language: string) => {
    const texts: Record<string, string> = {
        en: 'Loading tours...',
        ru: 'Загрузка экскурсий...',
        pl: 'Ładowanie wycieczek...',
        fr: 'Chargement des excursions...',
        uk: 'Завантаження екскурсій...'
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
]

// Определяем интерфейс для тура (соответствует структуре API)
interface Tour {
    id: number
    documentId: string
    title: string
    slug: string
    description: string
    duration: string
    language: string
    available_days: string | null
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
    location?: {
        address: string
        city: string
        region: string
        postal_code: string
        latitude: number | null
        longitude: number | null
    } | null
    price?: {
        amount: number
        currency: string
        period: string
    } | null
    contact?: {
        name: string
        email: string
        phone: string
        whatsapp: string
        telegram: string
        preferred_contact: string
    } | null
    // Дополнительные поля для совместимости с фильтрами
    type?: string
    category?: string
    groupSize?: string
    difficulty?: string
    rating?: number
    reviewsCount?: number
    features?: {
        transport?: boolean
        meals?: boolean
        tickets?: boolean
        guide?: boolean
        familyFriendly?: boolean
        extreme?: boolean
    }
    available?: boolean
    [key: string]: any // для дополнительных полей
}

export default function ToursPage() {
    const [language, setLanguage] = useState<"en" | "ru" | "pl" | "fr" | "uk">("en")
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
    const [filters, setFilters] = useState({
        location: "",
        tourType: "",
        priceFrom: "",
        priceTo: "",
        duration: "",
        durationType: "hours",
        availableFrom: "",
        language: "",
        category: "",
        groupSize: "",
        difficulty: "",
        rating: "",
        transport: false,
        meals: false,
        tickets: false,
    })
    // Исправляем тип для tours
    const [tours, setTours] = useState<Tour[]>([])
    const [initialLoadComplete, setInitialLoadComplete] = useState(false)

    // Функция для создания заголовков с авторизацией
    const getAuthHeaders = () => {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    }

    // Загружаем все экскурсии при первой загрузке
    useEffect(() => {
        const loadAllTours = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'
                console.log('Tours Page API URL:', apiUrl) // Для отладки

                const response = await fetch(`${apiUrl}/api/tours/?populate=*`, {
                    headers: getAuthHeaders()
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()

                if (data.data) {
                    setTours(data.data)
                }
            } catch (error) {
                console.error('Error loading tours:', error)
            } finally {
                setInitialLoadComplete(true)
            }
        }

        loadAllTours()
    }, [])

    const t = translations[language]
    const currentLanguage = languages.find((lang) => lang.code === language)

    // Загрузка сохраненного языка из localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem("selectedLanguage")
        if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
            setLanguage(savedLanguage as "en" | "ru" | "pl" | "fr" | "uk")
        }
    }, [])

    // Сохранение языка в localStorage
    const handleLanguageChange = (langCode: "en" | "ru" | "pl" | "fr" | "uk") => {
        setLanguage(langCode)
        localStorage.setItem("selectedLanguage", langCode)
        setIsLanguageDropdownOpen(false)
    }

    const resetFilters = () => {
        setFilters({
            location: "",
            tourType: "",
            priceFrom: "",
            priceTo: "",
            duration: "",
            durationType: "hours",
            availableFrom: "",
            language: "",
            category: "",
            groupSize: "",
            difficulty: "",
            rating: "",
            transport: false,
            meals: false,
            tickets: false,
        })
    }

    const handleFilterChange = (key: string, value: string | boolean) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    // Теперь функция принимает правильный тип
    const handleToursUpdate = (updatedTours: Tour[]) => {
        setTours(updatedTours)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header with Language Switcher */}
                <div className="flex justify-between items-center mb-6">
                    <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t.backToHome}
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
                    <h1 className="text-3xl font-bold text-gray-900">{t.toursInTenerife}</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters Sidebar */}
                    <ToursFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onResetFilters={resetFilters}
                        onToursUpdate={handleToursUpdate}
                        translations={t}
                    />

                    {/* Tours Grid */}
                    <div className="flex-1">
                        {initialLoadComplete ? (
                            <TourCard
                                translations={t}
                                language={language}
                                tours={tours}
                            />
                        ) : (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">{getLoadingToursText(language)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Click outside to close dropdown */}
                {isLanguageDropdownOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setIsLanguageDropdownOpen(false)} />
                )}
            </div>
        </div>
    )
}
