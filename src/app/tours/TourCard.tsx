"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const getFoundText = (locale: string): string => {
  const texts: Record<string, string> = {
    en: 'Found',
    ru: 'Найдено',
    pl: 'Znaleziono',
    fr: 'Trouvé',
    uk: 'Знайдено'
  };
  return texts[locale] || texts.en;
};

const getToursText = (locale: string): string => {
  const texts: Record<string, string> = {
    en: 'excursions',
    ru: 'экскурсий',
    pl: 'wycieczek',
    fr: 'excursions',
    uk: 'екскурсій'
  };
  return texts[locale] || texts.en;
};

const getFilterActiveText = (locale: string): string => {
  const texts: Record<string, string> = {
    en: '🔍 Filter active',
    ru: '🔍 Фильтр активен',
    pl: '🔍 Filtr aktywny',
    fr: '🔍 Filtre actif',
    uk: '🔍 Фільтр активний'
  };
  return texts[locale] || texts.en;
};

const getNoToursText = (locale: string): string => {
  const texts: Record<string, string> = {
    en: 'No tours matching the selected filters',
    ru: 'Нет экскурсий, соответствующих выбранным фильтрам',
    pl: 'Brak wycieczek odpowiadających wybranym filtrom',
    fr: 'Aucune excursion correspondant aux filtres sélectionnés',
    uk: 'Немає екскурсій, що відповідають обраним фільтрам'
  };
  return texts[locale] || texts.en;
};

const getTryChangeFiltersText = (locale: string): string => {
  const texts: Record<string, string> = {
    en: 'Try changing filter parameters',
    ru: 'Попробуйте изменить параметры фильтрации',
    pl: 'Spróbuj zmienić parametry filtrowania',
    fr: 'Essayez de modifier les paramètres de filtrage',
    uk: 'Спробуйте змінити параметри фільтрації'
  };
  return texts[locale] || texts.en;
};

const getNoToursAvailableText = (locale: string): string => {
  const texts: Record<string, string> = {
    en: 'No tours available',
    ru: 'Экскурсии недоступны',
    pl: 'Brak dostępnych wycieczek',
    fr: 'Aucune excursion disponible',
    uk: 'Екскурсії недоступні'
  };
  return texts[locale] || texts.en;
};

const getGuideText = (locale: string): string => {
  const texts: Record<string, string> = {
    en: 'Guide',
    ru: 'Гид',
    pl: 'Przewodnik',
    fr: 'Guide',
    uk: 'Гід'
  };
  return texts[locale] || texts.en;
};

const getErrorLoadingText = (locale: string): string => {
  const texts: Record<string, string> = {
    en: 'Error loading tours',
    ru: 'Ошибка загрузки экскурсий',
    pl: 'Błąd ładowania wycieczek',
    fr: 'Erreur lors du chargement des excursions',
    uk: 'Помилка завантаження екскурсій'
  };
  return texts[locale] || texts.en;
};

interface TourData {
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
}

interface TourCardProps {
    translations: {
        available: string
        viewDetails: string
        bookNow: string
        excitingDescription: string
        english: string
        spanish: string
        german: string
        french: string
        russian: string
        hours: string
        days: string
        ratingText: string
        reviewsText: string
        features: {
            transport: string
            meals: string
            tickets: string
            guide: string
            familyFriendly: string
            extreme: string
        }
    }
    language: string
    tours?: TourData[]
}

const TourCard = ({ translations, language, tours: filteredTours }: TourCardProps) => {
    const [tours, setTours] = useState<TourData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Функция для создания заголовков с авторизацией
    const getAuthHeaders = () => {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    }

    useEffect(() => {
        // Если есть отфильтрованные экскурсии, используем их
        if (filteredTours) {
            setTours(filteredTours)
            setLoading(false)
            return
        }

        // Если нет отфильтрованных экскурсий, загружаем все
        const fetchTours = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'
                console.log('TourCard API URL:', apiUrl) // Для отладки

                const response = await fetch(`${apiUrl}/api/tours?populate=*`, {
                    headers: getAuthHeaders()
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch tours: ${response.status}`)
                }

                const data = await response.json()
                setTours(data.data || [])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
                console.error('Error fetching tours:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchTours()
    }, [filteredTours])

    // Обновляем экскурсии при изменении отфильтрованного списка
    useEffect(() => {
        if (filteredTours) {
            setTours(filteredTours)
            setLoading(false)
        }
    }, [filteredTours])

    const handleViewDetails = (tourDocumentId: string) => {
        window.location.href = `/tours/${tourDocumentId}`
    }

    const getImageUrl = (tour: TourData) => {
        if (tour.images && tour.images.length > 0) {
            // Если URL уже полный (начинается с http), возвращаем как есть
            if (tour.images[0].url.startsWith('http')) {
                return tour.images[0].url
            }
            // Если URL относительный, добавляем базовый URL Strapi
            const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'
            return `${apiUrl}${tour.images[0].url}`
        }
        return "/placeholder.svg?height=200&width=300"
    }

    const getPrice = (tour: TourData) => {
        if (tour.price && tour.price.amount) {
            return tour.price.amount
        }
        return 0
    }

    const getCurrency = (tour: TourData) => {
        if (tour.price && tour.price.currency) {
            return tour.price.currency
        }
        return "EUR"
    }

    const getLocation = (tour: TourData) => {
        if (tour.location) {
            const parts = []
            if (tour.location.city) parts.push(tour.location.city)
            if (tour.location.region) parts.push(tour.location.region)
            return parts.join(', ') || tour.location.address || "—"
        }
        return "—"
    }

    const getLanguageText = (tourLanguage: string) => {
        switch (tourLanguage) {
            case 'EN':
                return translations.english
            case 'ES':
                return translations.spanish
            case 'DE':
                return translations.german
            case 'FR':
                return translations.french
            case 'RU':
                return translations.russian
            default:
                return tourLanguage
        }
    }

    const getDurationText = (duration: string) => {
        const hours = parseInt(duration)
        if (hours >= 24) {
            const days = Math.floor(hours / 24)
            return `${days} ${days === 1 ? translations.days.slice(0, -1) : translations.days}`
        }
        return `${hours} ${translations.hours}`
    }

    const getPriceText = (tour: TourData) => {
        const price = getPrice(tour)
        const currency = getCurrency(tour)
        const period = tour.price?.period || 'total'

        if (period === 'total') {
            return `${currency} ${price}`
        }
        return `${currency} ${price}/${period}`
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
                        <div className="aspect-video bg-gray-200"></div>
                        <div className="p-6">
                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {[1, 2, 3, 4].map((j) => (
                                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 mb-2">{getErrorLoadingText(language)}</div>
                <div className="text-red-500 text-sm">{error}</div>
            </div>
        )
    }

    if (tours.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <div className="text-gray-500 text-lg mb-2">
                    {filteredTours !== undefined ?
                        getNoToursText(language) :
                        getNoToursAvailableText(language)
                    }
                </div>
                {filteredTours !== undefined && (
                    <div className="text-gray-400 text-sm">
                        {getTryChangeFiltersText(language)}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Счетчик результатов */}
            <div className="flex items-center justify-between">
                <div className="text-gray-600">
                    {getFoundText(language)}: <span className="font-semibold text-gray-900">{tours.length}</span> {getToursText(language)}
                </div>
                {filteredTours !== undefined && (
                    <div className="text-sm text-blue-600">
                        {getFilterActiveText(language)}
                    </div>
                )}
            </div>

            {/* Сетка экскурсий */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tours.map((tour) => (
                    <div
                        key={tour.id}
                        className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className="aspect-video relative bg-gray-100">
                            <Image
                                src={getImageUrl(tour)}
                                alt={tour.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <div className="mb-3">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{tour.title}</h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    {getDurationText(tour.duration)} • {getLanguageText(tour.language)}
                                </p>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                            </div>

                            {/* Tour Details */}
                            <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    {getLocation(tour)}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {getDurationText(tour.duration)}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    {getLanguageText(tour.language)}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    {tour.contact?.name || getGuideText(language)}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap gap-1 mb-4">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                    {translations.features.guide}
                                </span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    {translations.features.familyFriendly}
                                </span>
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                    {translations.features.transport}
                                </span>
                            </div>

                            {/* Availability and Price */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {translations.available}
                                </span>
                                <div className="text-right">
                                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {getPriceText(tour)}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleViewDetails(tour.documentId)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                    {translations.viewDetails}
                                </button>
                                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    {translations.bookNow}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TourCard