"use client"

import { useState, useEffect, useCallback } from "react"

interface FilterState {
    brand: string
    model: string
    yearFrom: string
    yearTo: string
    priceFrom: string
    priceTo: string
    mileageFrom: string
    mileageTo: string
    fuel: string
    transmission: string
    bodyType: string
    color: string
    doors: string
    powerFrom: string
    powerTo: string
    location: string
    availableFrom: string
    airConditioner: boolean
    rearCamera: boolean
    multimedia: boolean
    type: string // rent or sale
    carStatus: string // available, reserved, sold
}

interface CarsFilterProps {
    filters: FilterState
    onFilterChange: (key: string, value: string | boolean) => void
    onResetFilters: () => void
    onCarsUpdate: (cars: any[]) => void
    translations: any
    allCars: any[] // Добавляем проп для всех автомобилей
}

interface FilterOptions {
    brands: string[]
    models: string[]
    colors: string[]
    cities: string[]
    regions: string[]
}

// Интерфейс для данных автомобиля из API
interface CarData {
    id: number
    documentId: string
    title: string
    specifications?: {
        make?: string
        model?: string
        color?: string
        year?: number
        mileage?: number
        fuel?: string
        transmission?: string
        power?: number
        doors?: number
        body_type?: string
        [key: string]: any
    }
    location?: {
        city?: string
        region?: string
        [key: string]: any
    }
    rental_prices?: {
        day_1?: number
        [key: string]: any
    }
    features?: {
        air_conditioning?: boolean
        parking_sensors?: boolean
        bluetooth?: boolean
        [key: string]: any
    }
    type?: string
    car_status?: string
    [key: string]: any
}

export default function CarsFilter({
                                       filters,
                                       onFilterChange,
                                       onResetFilters,
                                       onCarsUpdate,
                                       translations: t,
                                       allCars
                                   }: CarsFilterProps) {
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        brands: [],
        models: [],
        colors: [],
        cities: [],
        regions: []
    })
    const [isLoading, setIsLoading] = useState(false)

    // Загрузка опций фильтров из переданных данных
    useEffect(() => {
        if (allCars && allCars.length > 0) {
            const cars: CarData[] = allCars

            // Извлекаем уникальные значения для фильтров
            const brands: string[] = [...new Set(cars
                .map((car: CarData) => car.specifications?.make)
                .filter((value): value is string => Boolean(value) && typeof value === 'string')
            )].sort()

            const models: string[] = [...new Set(cars
                .map((car: CarData) => car.specifications?.model)
                .filter((value): value is string => Boolean(value) && typeof value === 'string')
            )].sort()

            const colors: string[] = [...new Set(cars
                .map((car: CarData) => car.specifications?.color)
                .filter((value): value is string => Boolean(value) && typeof value === 'string')
            )].sort()

            const cities: string[] = [...new Set(cars
                .map((car: CarData) => car.location?.city)
                .filter((value): value is string => Boolean(value) && typeof value === 'string')
            )].sort()

            const regions: string[] = [...new Set(cars
                .map((car: CarData) => car.location?.region)
                .filter((value): value is string => Boolean(value) && typeof value === 'string')
            )].sort()

            setFilterOptions({
                brands,
                models,
                colors,
                cities,
                regions
            })
        }
    }, [allCars])

    // Мемоизированная функция фильтрации
    const applyFiltersToData = useCallback((cars: CarData[], filterState: FilterState): CarData[] => {
        return cars.filter((car) => {
            // Фильтр по марке
            if (filterState.brand && car.specifications?.make !== filterState.brand) {
                return false
            }

            // Фильтр по модели
            if (filterState.model && car.specifications?.model !== filterState.model) {
                return false
            }

            // Фильтр по году
            if (filterState.yearFrom && car.specifications?.year &&
                car.specifications.year < parseInt(filterState.yearFrom)) {
                return false
            }
            if (filterState.yearTo && car.specifications?.year &&
                car.specifications.year > parseInt(filterState.yearTo)) {
                return false
            }

            // Фильтр по пробегу
            if (filterState.mileageFrom && car.specifications?.mileage &&
                car.specifications.mileage < parseInt(filterState.mileageFrom)) {
                return false
            }
            if (filterState.mileageTo && car.specifications?.mileage &&
                car.specifications.mileage > parseInt(filterState.mileageTo)) {
                return false
            }

            // Фильтр по цене за день
            if (filterState.priceFrom && car.rental_prices?.day_1 &&
                car.rental_prices.day_1 < parseInt(filterState.priceFrom)) {
                return false
            }
            if (filterState.priceTo && car.rental_prices?.day_1 &&
                car.rental_prices.day_1 > parseInt(filterState.priceTo)) {
                return false
            }

            // Фильтр по топливу
            if (filterState.fuel && car.specifications?.fuel !== filterState.fuel) {
                return false
            }

            // Фильтр по коробке передач
            if (filterState.transmission && car.specifications?.transmission !== filterState.transmission) {
                return false
            }

            // Фильтр по типу кузова
            if (filterState.bodyType && car.specifications?.body_type !== filterState.bodyType) {
                return false
            }

            // Фильтр по цвету
            if (filterState.color && car.specifications?.color !== filterState.color) {
                return false
            }

            // Фильтр по количеству дверей
            if (filterState.doors && car.specifications?.doors &&
                car.specifications.doors.toString() !== filterState.doors) {
                return false
            }

            // Фильтр по мощности
            if (filterState.powerFrom && car.specifications?.power &&
                car.specifications.power < parseInt(filterState.powerFrom)) {
                return false
            }
            if (filterState.powerTo && car.specifications?.power &&
                car.specifications.power > parseInt(filterState.powerTo)) {
                return false
            }

            // Фильтр по типу (аренда/продажа)
            if (filterState.type && car.type !== filterState.type) {
                return false
            }

            // Фильтр по статусу автомобиля
            if (filterState.carStatus && car.car_status !== filterState.carStatus) {
                return false
            }

            // Фильтр по городу
            if (filterState.location && car.location?.city !== filterState.location) {
                return false
            }

            // Фильтры по функциям
            if (filterState.airConditioner && !car.features?.air_conditioning) {
                return false
            }
            if (filterState.rearCamera && !car.features?.parking_sensors) {
                return false
            }
            if (filterState.multimedia && !car.features?.bluetooth) {
                return false
            }

            return true
        })
    }, [])

    // Применение фильтров локально без API запросов
    useEffect(() => {
        if (!allCars || allCars.length === 0) {
            return
        }

        setIsLoading(true)

        // Добавляем небольшую задержку для оптимизации
        const timeoutId = setTimeout(() => {
            const filteredCars = applyFiltersToData(allCars, filters)
            onCarsUpdate(filteredCars)
            setIsLoading(false)
        }, 300)

        return () => {
            clearTimeout(timeoutId)
            setIsLoading(false)
        }
    }, [filters, allCars, applyFiltersToData])

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

                {/* Статус автомобиля */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.status || "Status"}</label>
                    <select
                        value={filters.carStatus}
                        onChange={(e) => onFilterChange("carStatus", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allStatuses || "All statuses"}</option>
                        <option value="available">{t.available}</option>
                        <option value="reserved">{t.reserved || "Reserved"}</option>
                        <option value="sold">{t.sold || "Sold"}</option>
                    </select>
                </div>

                {/* Марка */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.brand}</label>
                    <select
                        value={filters.brand}
                        onChange={(e) => onFilterChange("brand", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allBrands}</option>
                        {filterOptions.brands.map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>

                {/* Модель */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.model}</label>
                    <select
                        value={filters.model}
                        onChange={(e) => onFilterChange("model", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allModels}</option>
                        {filterOptions.models.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>

                {/* Год выпуска */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.yearOfManufacture}</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder={t.from}
                            value={filters.yearFrom}
                            onChange={(e) => onFilterChange("yearFrom", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <input
                            type="number"
                            placeholder={t.to}
                            value={filters.yearTo}
                            onChange={(e) => onFilterChange("yearTo", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Цена за день (только для аренды) */}
                {filters.type === 'rent' && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.pricePerDay}</label>
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
                )}

                {/* Пробег */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.mileageKm}</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder={t.from}
                            value={filters.mileageFrom}
                            onChange={(e) => onFilterChange("mileageFrom", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <input
                            type="number"
                            placeholder={t.to}
                            value={filters.mileageTo}
                            onChange={(e) => onFilterChange("mileageTo", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Тип топлива */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.fuelType}</label>
                    <select
                        value={filters.fuel}
                        onChange={(e) => onFilterChange("fuel", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allTypes}</option>
                        <option value="petrol">{t.petrol}</option>
                        <option value="diesel">{t.diesel}</option>
                        <option value="hybrid">{t.hybrid}</option>
                        <option value="electric">{t.electric}</option>
                    </select>
                </div>

                {/* Коробка передач */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.transmission}</label>
                    <select
                        value={filters.transmission}
                        onChange={(e) => onFilterChange("transmission", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allTypes}</option>
                        <option value="manual">{t.manual}</option>
                        <option value="automatic">{t.automatic}</option>
                    </select>
                </div>

                {/* Тип кузова */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.bodyType}</label>
                    <select
                        value={filters.bodyType}
                        onChange={(e) => onFilterChange("bodyType", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allTypes}</option>
                        <option value="sedan">{t.sedan}</option>
                        <option value="hatchback">{t.hatchback}</option>
                        <option value="wagon">{t.wagon}</option>
                        <option value="suv">{t.suv}</option>
                        <option value="convertible">{t.convertible}</option>
                    </select>
                </div>

                {/* Цвет */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.color}</label>
                    <select
                        value={filters.color}
                        onChange={(e) => onFilterChange("color", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allColors}</option>
                        {filterOptions.colors.map((color) => (
                            <option key={color} value={color}>
                                {color === 'black' ? t.black :
                                    color === 'white' ? t.white :
                                        color === 'blue' ? t.blue :
                                            color === 'red' ? t.red :
                                                color === 'yellow' ? t.yellow :
                                                    color === 'silver' ? t.silver : color}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Количество дверей */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.numberOfDoors}</label>
                    <select
                        value={filters.doors}
                        onChange={(e) => onFilterChange("doors", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.any}</option>
                        <option value="2">{t.doors2}</option>
                        <option value="4">{t.doors4}</option>
                        <option value="5">{t.doors5}</option>
                    </select>
                </div>

                {/* Мощность двигателя */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.enginePower}</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder={t.from}
                            value={filters.powerFrom}
                            onChange={(e) => onFilterChange("powerFrom", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <input
                            type="number"
                            placeholder={t.to}
                            value={filters.powerTo}
                            onChange={(e) => onFilterChange("powerTo", e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                    </div>
                </div>

                {/* Локация */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.location}</label>
                    <select
                        value={filters.location}
                        onChange={(e) => onFilterChange("location", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">{t.allLocations}</option>
                        {filterOptions.cities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                {/* Дополнительные опции */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">{t.additionalOptions}</label>
                    <div className="space-y-2">
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
                                checked={filters.rearCamera}
                                onChange={(e) => onFilterChange("rearCamera", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{t.parkingSensors || "Parking sensors"}</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.multimedia}
                                onChange={(e) => onFilterChange("multimedia", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{t.bluetooth || "Bluetooth"}</span>
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