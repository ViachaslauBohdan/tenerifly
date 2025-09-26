"use client"

import { useState, useEffect, useCallback } from "react"
import { FilterParams } from "@/utils/filterUtils"

// Используем FilterParams из utils
type FilterState = FilterParams;

interface ApartmentsFilterProps {
    filters: FilterState
    onFilterChange: (key: string, value: string | boolean) => void
    onResetFilters: () => void
    onApartmentsUpdate: (apartments: any[]) => void
    translations: any
    allApartments: any[] // Добавляем проп для всех апартаментов
}

interface FilterOptions {
    cities: string[]
    districts: string[]
    propertyTypes: string[]
    conditions: string[]
}

// Интерфейс для данных недвижимости из API
interface PropertyData {
    id: number
    documentId: string
    title: string
    category?: string
    location?: {
        city?: string
        region?: string
        [key: string]: any
    }
    [key: string]: any
}

export default function ApartmentsFilter({
                                             filters,
                                             onFilterChange,
                                             onResetFilters,
                                             onApartmentsUpdate,
                                             translations: t,
                                             allApartments // Используем переданные данные
                                         }: ApartmentsFilterProps) {
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        cities: [],
        districts: [],
        propertyTypes: [],
        conditions: []
    })
    const [isLoading, setIsLoading] = useState(false)

    // Функция для создания заголовков с авторизацией
    const getAuthHeaders = () => {
        const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    }

    // Загрузка опций фильтров из переданных данных
    useEffect(() => {
        if (allApartments && allApartments.length > 0) {
            const properties: PropertyData[] = allApartments

            // Извлекаем уникальные значения для фильтров
            const cities: string[] = [...new Set(properties
                .map((property: PropertyData) => property.location?.city)
                .filter((value): value is string => Boolean(value) && typeof value === 'string')
            )].sort()

            const districts: string[] = [...new Set(properties
                .map((property: PropertyData) => property.location?.region)
                .filter((value): value is string => Boolean(value) && typeof value === 'string')
            )].sort()

            const propertyTypes: string[] = [...new Set(properties
                .map((property: PropertyData) => property.category)
                .filter((value): value is string => Boolean(value) && typeof value === 'string')
            )].sort()

            const conditions = ["new", "good", "needs_repair"] // Фиксированные значения состояния

            setFilterOptions({
                cities,
                districts,
                propertyTypes,
                conditions
            })
        }
    }, [allApartments])

    // Мемоизированная функция фильтрации
    const applyFiltersToData = useCallback((apartments: PropertyData[], filterState: FilterState): PropertyData[] => {
        return apartments.filter((property) => {
            // Фильтр по типу недвижимости
            if (filterState.propertyType && property.category !== filterState.propertyType) {
                return false
            }

            // Фильтр по количеству комнат
            if (filterState.rooms && property.specifications?.bedrooms?.toString() !== filterState.rooms) {
                return false
            }

            // Фильтр по площади
            if (filterState.areaFrom && property.specifications?.total_area &&
                property.specifications.total_area < parseInt(filterState.areaFrom)) {
                return false
            }
            if (filterState.areaTo && property.specifications?.total_area &&
                property.specifications.total_area > parseInt(filterState.areaTo)) {
                return false
            }

            // Фильтр по цене
            if (filterState.priceFrom && property.price?.amount &&
                property.price.amount < parseInt(filterState.priceFrom)) {
                return false
            }
            if (filterState.priceTo && property.price?.amount &&
                property.price.amount > parseInt(filterState.priceTo)) {
                return false
            }

            // Фильтр по этажу
            if (filterState.floorFrom && property.specifications?.floor &&
                property.specifications.floor < parseInt(filterState.floorFrom)) {
                return false
            }
            if (filterState.floorTo && property.specifications?.floor &&
                property.specifications.floor > parseInt(filterState.floorTo)) {
                return false
            }

            // Фильтр по году постройки
            if (filterState.yearBuiltFrom && property.specifications?.year_built &&
                property.specifications.year_built < parseInt(filterState.yearBuiltFrom)) {
                return false
            }
            if (filterState.yearBuiltTo && property.specifications?.year_built &&
                property.specifications.year_built > parseInt(filterState.yearBuiltTo)) {
                return false
            }

            // Фильтр по типу (аренда/продажа)
            if (filterState.type && property.type !== filterState.type) {
                return false
            }

            // Фильтр по статусу недвижимости
            if (filterState.propertyStatus && property.property_status !== filterState.propertyStatus) {
                return false
            }

            // Фильтр по городу
            if (filterState.city && property.location?.city !== filterState.city) {
                return false
            }

            // Фильтр по району
            if (filterState.district && property.location?.region !== filterState.district) {
                return false
            }

            // Фильтры по функциям
            if (filterState.balcony && !property.features?.has_terrace) {
                return false
            }
            if (filterState.terrace && !property.features?.has_terrace) {
                return false
            }
            if (filterState.garden && !property.features?.has_garden) {
                return false
            }
            if (filterState.parking && !property.features?.has_garage) {
                return false
            }
            if (filterState.furnished && !property.features?.furnished) {
                return false
            }
            if (filterState.airConditioner && !property.features?.has_air_conditioning) {
                return false
            }
            if (filterState.wifi && !property.features?.has_internet) {
                return false
            }
            // Исправляем логику для washingMachine и dishwasher
            if (filterState.washingMachine && !property.features?.has_heating) {
                return false
            }
            if (filterState.dishwasher && !property.features?.has_security) {
                return false
            }

            return true
        });
    }, [])

    // Применение фильтров локально без API запросов
    useEffect(() => {
        if (!allApartments || allApartments.length === 0) {
            return
        }

        setIsLoading(true)

        // Добавляем небольшую задержку для оптимизации
        const timeoutId = setTimeout(() => {
            const filteredApartments = applyFiltersToData(allApartments, filters)
            onApartmentsUpdate(filteredApartments)
            setIsLoading(false)
        }, 300)

        return () => {
            clearTimeout(timeoutId)
            setIsLoading(false)
        }
    }, [filters, allApartments, applyFiltersToData]) // Убираем onApartmentsUpdate из зависимостей

    return (
        <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border p-6 max-h-screen overflow-y-auto">
                <div className="flex items-center mb-6">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                        />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-900">{t.filters}</h2>
                    {isLoading && (
                        <div className="ml-auto">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                </div>

                {/* Тип объявления */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.type || "Type"}</label>
                    <select
                        value={filters.type}
                        onChange={(e) => onFilterChange("type", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allTypes}</option>
                        <option value="rent">{t.rent || "Rent"}</option>
                        <option value="sale">{t.sale || "Sale"}</option>
                    </select>
                </div>

                {/* Статус недвижимости */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.status || "Status"}</label>
                    <select
                        value={filters.propertyStatus}
                        onChange={(e) => onFilterChange("propertyStatus", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allStatuses || "All statuses"}</option>
                        <option value="available">{t.available}</option>
                        <option value="reserved">{t.reserved || "Reserved"}</option>
                        <option value="rented">{t.rented || "Rented"}</option>
                        <option value="sold">{t.sold || "Sold"}</option>
                    </select>
                </div>

                {/* Тип недвижимости */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.propertyType}</label>
                    <select
                        value={filters.propertyType}
                        onChange={(e) => onFilterChange("propertyType", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allTypes}</option>
                        {filterOptions.propertyTypes.map((type) => (
                            <option key={type} value={type}>
                                {type === 'apartment' ? t.apartment :
                                    type === 'house' ? t.house :
                                        type === 'plot' ? t.plot : type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Количество комнат */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.rooms}</label>
                    <select
                        value={filters.rooms}
                        onChange={(e) => onFilterChange("rooms", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.any}</option>
                        <option value="0">{t.studio}</option>
                        <option value="1">1 {t.room}</option>
                        <option value="2">2 {t.rooms}</option>
                        <option value="3">3 {t.rooms}</option>
                        <option value="4">4 {t.rooms}</option>
                        <option value="5">5+ {t.rooms}</option>
                    </select>
                </div>

                {/* Площадь */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.area}</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder={t.from}
                            value={filters.areaFrom}
                            onChange={(e) => onFilterChange("areaFrom", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <input
                            type="number"
                            placeholder={t.to}
                            value={filters.areaTo}
                            onChange={(e) => onFilterChange("areaTo", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Цена */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {filters.type === 'rent' ? t.pricePerMonth : t.price}
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder={t.from}
                            value={filters.priceFrom}
                            onChange={(e) => onFilterChange("priceFrom", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <input
                            type="number"
                            placeholder={t.to}
                            value={filters.priceTo}
                            onChange={(e) => onFilterChange("priceTo", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Этаж */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.floor}</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder={t.from}
                            value={filters.floorFrom}
                            onChange={(e) => onFilterChange("floorFrom", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <input
                            type="number"
                            placeholder={t.to}
                            value={filters.floorTo}
                            onChange={(e) => onFilterChange("floorTo", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Год постройки */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.yearBuilt}</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder={t.from}
                            value={filters.yearBuiltFrom}
                            onChange={(e) => onFilterChange("yearBuiltFrom", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <input
                            type="number"
                            placeholder={t.to}
                            value={filters.yearBuiltTo}
                            onChange={(e) => onFilterChange("yearBuiltTo", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Состояние */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.condition}</label>
                    <select
                        value={filters.condition}
                        onChange={(e) => onFilterChange("condition", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allTypes}</option>
                        {filterOptions.conditions.map((condition) => (
                            <option key={condition} value={condition}>
                                {condition === 'needsRepair' ? t.needsRepair :
                                    condition === 'readyToLive' ? t.readyToLive :
                                        condition === 'newProperty' ? t.newProperty : condition}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Город */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.location}</label>
                    <select
                        value={filters.city}
                        onChange={(e) => onFilterChange("city", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allLocations}</option>
                        {filterOptions.cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                {/* Район */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.district}</label>
                    <select
                        value={filters.district}
                        onChange={(e) => onFilterChange("district", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allDistricts}</option>
                        {filterOptions.districts.map((district) => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>
                </div>

                {/* Дополнительные опции */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">{t.features}</label>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.balcony}
                                onChange={(e) => onFilterChange("balcony", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{t.pool}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.terrace}
                                onChange={(e) => onFilterChange("terrace", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{t.terrace}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.garden}
                                onChange={(e) => onFilterChange("garden", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{t.garden}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.parking}
                                onChange={(e) => onFilterChange("parking", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{t.garage}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.furnished}
                                onChange={(e) => onFilterChange("furnished", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{t.furnished}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.airConditioner}
                                onChange={(e) => onFilterChange("airConditioner", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{t.airConditioner}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.wifi}
                                onChange={(e) => onFilterChange("wifi", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{t.internet}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.washingMachine}
                                onChange={(e) => onFilterChange("washingMachine", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{t.heating}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.dishwasher}
                                onChange={(e) => onFilterChange("dishwasher", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{t.security}</span>
                        </label>
                    </div>
                </div>

                {/* Reset Filters */}
                <button
                    onClick={onResetFilters}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                    {t.resetFilters}
                </button>
            </div>
        </div>
    )
}