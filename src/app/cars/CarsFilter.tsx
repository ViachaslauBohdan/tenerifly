"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CatalogFilterMoreToggle } from "@/components/CatalogFilterMoreToggle";
import { catalogSearchQuery, matchesCatalogSearch } from "@/lib/catalogSearch";
import { carSeatsFilterLabel, carTransmissionLabel } from "@/lib/carSpecLabels";

interface FilterState {
  brand: string;
  model: string;
  yearFrom: string;
  yearTo: string;
  priceFrom: string;
  priceTo: string;
  mileageFrom: string;
  mileageTo: string;
  fuel: string;
  transmission: string;
  bodyType: string;
  color: string;
  doors: string;
  seats: string;
  powerFrom: string;
  powerTo: string;
  location: string;
  availableFrom: string;
  airConditioner: boolean;
  rearCamera: boolean;
  multimedia: boolean;
  type: string; // rent or sale
  carStatus: string; // available, reserved, sold
  q: string;
}

interface CarsFilterProps {
  filters: FilterState;
  onFilterChange: (key: string, value: string | boolean) => void;
  onResetFilters: () => void;
  onCarsUpdate: (cars: any[]) => void;
  translations: any;
  locale?: string;
  allCars: any[]; // Добавляем проп для всех автомобилей
}

interface FilterOptions {
  brands: string[];
  models: string[];
  fuels: string[];
  transmissions: string[];
  seats: string[];
}

// Интерфейс для данных автомобиля из API
interface CarData {
  id: number;
  documentId: string;
  title: string;
  specifications?: {
    make?: string;
    model?: string;
    color?: string;
    year?: number;
    mileage?: number;
    fuel?: string;
    transmission?: string;
    power?: number;
    doors?: number;
    seats?: number;
    body_type?: string;
    [key: string]: any;
  };
  location?: {
    city?: string;
    region?: string;
    [key: string]: any;
  };
  rental_prices?: {
    day_1?: number;
    [key: string]: any;
  };
  features?: {
    air_conditioning?: boolean;
    parking_sensors?: boolean;
    bluetooth?: boolean;
    [key: string]: any;
  };
  type?: string;
  car_status?: string;
  [key: string]: any;
}

export default function CarsFilter({
  filters,
  onFilterChange,
  onResetFilters,
  onCarsUpdate,
  translations: t,
  locale = "en",
  allCars,
}: CarsFilterProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    models: [],
    fuels: [],
    transmissions: [],
    seats: [],
  });
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "q") return false;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value !== "";
    if (typeof value === "number") return value > 0;
    return false;
  }).length;

  const hasHiddenActiveFilters = Boolean(
    filters.model ||
      filters.yearFrom ||
      filters.yearTo ||
      filters.priceFrom ||
      filters.priceTo ||
      filters.fuel
  );

  useEffect(() => {
    if (hasHiddenActiveFilters) {
      setFiltersExpanded(true);
    }
  }, [hasHiddenActiveFilters]);

  // Загрузка опций фильтров из переданных данных
  useEffect(() => {
    if (allCars && allCars.length > 0) {
      const cars: CarData[] = allCars;

      // Извлекаем уникальные значения для фильтров
      const brands: string[] = [
        ...new Set(
          cars
            .map((car: CarData) => car.specifications?.make)
            .filter(
              (value): value is string =>
                Boolean(value) && typeof value === "string"
            )
        ),
      ].sort();

      const models: string[] = [
        ...new Set(
          cars
            .map((car: CarData) => car.specifications?.model)
            .filter(
              (value): value is string =>
                Boolean(value) && typeof value === "string"
            )
        ),
      ].sort();

      const fuels: string[] = [
        ...new Set(
          cars
            .map((car: CarData) => car.specifications?.fuel)
            .filter(
              (value): value is string =>
                Boolean(value) && typeof value === "string"
            )
        ),
      ].sort();

      const transmissions: string[] = [
        ...new Set(
          cars
            .map((car: CarData) => car.specifications?.transmission)
            .filter(
              (value): value is string =>
                Boolean(value) && typeof value === "string"
            )
        ),
      ].sort();

      const seats: string[] = [
        ...new Set(
          cars
            .map((car: CarData) => car.specifications?.seats)
            .filter((value): value is number => typeof value === "number")
            .map((value) => String(value))
        ),
      ].sort((left, right) => Number(left) - Number(right));

      setFilterOptions({
        brands,
        models,
        fuels,
        transmissions,
        seats,
      });
    }
  }, [allCars]);

  // Мемоизированная функция фильтрации
  const applyFiltersToData = useCallback(
    (cars: CarData[], filterState: FilterState): CarData[] => {
      const query = catalogSearchQuery(filterState.q);
      return cars.filter((car) => {
        if (
          !matchesCatalogSearch(query, [
            car.title,
            car.description,
            car.specifications?.make,
            car.specifications?.model,
            car.location?.city,
            car.location?.region,
          ])
        ) {
          return false;
        }

        // Фильтр по марке
        if (
          filterState.brand &&
          car.specifications?.make !== filterState.brand
        ) {
          return false;
        }

        // Фильтр по модели
        if (
          filterState.model &&
          car.specifications?.model !== filterState.model
        ) {
          return false;
        }

        // Фильтр по году
        if (
          filterState.yearFrom &&
          car.specifications?.year &&
          car.specifications.year < parseInt(filterState.yearFrom)
        ) {
          return false;
        }
        if (
          filterState.yearTo &&
          car.specifications?.year &&
          car.specifications.year > parseInt(filterState.yearTo)
        ) {
          return false;
        }

        // Фильтр по пробегу
        if (
          filterState.mileageFrom &&
          car.specifications?.mileage &&
          car.specifications.mileage < parseInt(filterState.mileageFrom)
        ) {
          return false;
        }
        if (
          filterState.mileageTo &&
          car.specifications?.mileage &&
          car.specifications.mileage > parseInt(filterState.mileageTo)
        ) {
          return false;
        }

        // Фильтр по цене за день
        if (
          filterState.priceFrom &&
          car.rental_prices?.day_1 &&
          car.rental_prices.day_1 < parseInt(filterState.priceFrom)
        ) {
          return false;
        }
        if (
          filterState.priceTo &&
          car.rental_prices?.day_1 &&
          car.rental_prices.day_1 > parseInt(filterState.priceTo)
        ) {
          return false;
        }

        // Фильтр по топливу
        if (filterState.fuel && car.specifications?.fuel !== filterState.fuel) {
          return false;
        }

        // Фильтр по коробке передач
        if (
          filterState.transmission &&
          car.specifications?.transmission !== filterState.transmission
        ) {
          return false;
        }

        if (
          filterState.seats &&
          String(car.specifications?.seats ?? "") !== String(filterState.seats)
        ) {
          return false;
        }

        // Фильтр по типу кузова
        if (
          filterState.bodyType &&
          car.specifications?.body_type !== filterState.bodyType
        ) {
          return false;
        }

        // Фильтр по цвету
        if (
          filterState.color &&
          car.specifications?.color !== filterState.color
        ) {
          return false;
        }

        // Фильтр по количеству дверей
        if (
          filterState.doors &&
          car.specifications?.doors &&
          car.specifications.doors.toString() !== filterState.doors
        ) {
          return false;
        }

        // Фильтр по мощности
        if (
          filterState.powerFrom &&
          car.specifications?.power &&
          car.specifications.power < parseInt(filterState.powerFrom)
        ) {
          return false;
        }
        if (
          filterState.powerTo &&
          car.specifications?.power &&
          car.specifications.power > parseInt(filterState.powerTo)
        ) {
          return false;
        }

        // Фильтр по типу (аренда/продажа)
        if (filterState.type && car.type !== filterState.type) {
          return false;
        }

        // Фильтр по статусу автомобиля
        if (filterState.carStatus && car.car_status !== filterState.carStatus) {
          return false;
        }

        // Фильтр по городу
        if (
          filterState.location &&
          car.location?.city !== filterState.location
        ) {
          return false;
        }

        // Фильтры по функциям
        if (filterState.airConditioner && !car.features?.air_conditioning) {
          return false;
        }
        if (filterState.rearCamera && !car.features?.parking_sensors) {
          return false;
        }
        if (filterState.multimedia && !car.features?.bluetooth) {
          return false;
        }

        return true;
      });
    },
    []
  );

  const onCarsUpdateRef = useRef(onCarsUpdate);
  onCarsUpdateRef.current = onCarsUpdate;

  useEffect(() => {
    if (!allCars || allCars.length === 0) {
      return;
    }

    onCarsUpdateRef.current(applyFiltersToData(allCars, filters));
  }, [filters, allCars, applyFiltersToData]);

  const visibleModels = filters.brand
    ? [
        ...new Set(
          (allCars as CarData[])
            .filter((car) => car.specifications?.make === filters.brand)
            .map((car) => car.specifications?.model)
            .filter((value): value is string => Boolean(value))
        ),
      ].sort()
    : filterOptions.models;

  const fieldClass = "min-w-[12.5rem] flex-1";
  const controlClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5";

  const fuelLabel = (value: string) => {
    const key = value.trim().toLowerCase();
    return t?.[key] || value;
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <div className={fieldClass}>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            {t.brand}
          </label>
          <select
            value={filters.brand}
            onChange={(e) => onFilterChange("brand", e.target.value)}
            className={controlClass}
          >
            <option value="">{t.allBrands}</option>
            {filterOptions.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className={fieldClass}>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            {t.transmission}
          </label>
          <select
            value={filters.transmission}
            onChange={(e) => onFilterChange("transmission", e.target.value)}
            className={controlClass}
          >
            <option value="">{t.any}</option>
            {filterOptions.transmissions.map((transmission) => (
              <option key={transmission} value={transmission}>
                {carTransmissionLabel(transmission, locale)}
              </option>
            ))}
          </select>
        </div>

        <div className={fieldClass}>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
            {carSeatsFilterLabel(locale)}
          </label>
          <select
            value={filters.seats}
            onChange={(e) => onFilterChange("seats", e.target.value)}
            className={controlClass}
          >
            <option value="">{t.any}</option>
            {filterOptions.seats.map((seats) => (
              <option key={seats} value={seats}>
                {seats}
              </option>
            ))}
          </select>
        </div>

        <CatalogFilterMoreToggle
          expanded={filtersExpanded}
          showMoreLabel={t.showMoreFilters}
          showLessLabel={t.showLessFilters}
          onToggle={() => setFiltersExpanded((open) => !open)}
          className="h-11 shrink-0 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        />

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="h-11 rounded-xl px-3 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {t.resetFilters}
          </button>
        )}
      </div>

      {filtersExpanded && (
        <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4">
          <div className={fieldClass}>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
              {t.fuelType}
            </label>
            <select
              value={filters.fuel}
              onChange={(e) => onFilterChange("fuel", e.target.value)}
              className={controlClass}
            >
              <option value="">{t.any}</option>
              {filterOptions.fuels.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuelLabel(fuel)}
                </option>
              ))}
            </select>
          </div>

          <div className={fieldClass}>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
              {t.pricePerDay}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                placeholder={t.from}
                value={filters.priceFrom}
                onChange={(e) => onFilterChange("priceFrom", e.target.value)}
                className={controlClass}
              />
              <input
                type="number"
                min="0"
                placeholder={t.to}
                value={filters.priceTo}
                onChange={(e) => onFilterChange("priceTo", e.target.value)}
                className={controlClass}
              />
            </div>
          </div>

          <div className={fieldClass}>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
              {t.yearOfManufacture}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1990"
                max="2030"
                placeholder={t.from}
                value={filters.yearFrom}
                onChange={(e) => onFilterChange("yearFrom", e.target.value)}
                className={controlClass}
              />
              <input
                type="number"
                min="1990"
                max="2030"
                placeholder={t.to}
                value={filters.yearTo}
                onChange={(e) => onFilterChange("yearTo", e.target.value)}
                className={controlClass}
              />
            </div>
          </div>

          <div className={fieldClass}>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
              {t.model}
            </label>
            <select
              value={filters.model}
              onChange={(e) => onFilterChange("model", e.target.value)}
              className={controlClass}
            >
              <option value="">{t.allModels}</option>
              {visibleModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </section>
  );
}
