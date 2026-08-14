import type { HomeCar } from "@/components/home/types";
import { carTransmissionLabel } from "@/lib/carSpecLabels";

type CarsCurrencyMap = Record<string, string>;

export function getHomeCarPrice(car: HomeCar): number {
  const raw = car.rental_prices?.day_1 ?? car.price ?? 0;
  return Number(raw) || 0;
}

export function getHomeCarCurrency(
  car: HomeCar,
  currencyMap: CarsCurrencyMap = {}
): string {
  const currency = car.rental_prices?.currency || "€";
  return currencyMap[currency] || currency;
}

export function getHomeCarFeatures(car: HomeCar, locale = "en"): string {
  const parts = [
    car.specifications?.make,
    car.specifications?.model,
    car.type,
    car.specifications?.fuel,
    car.specifications?.transmission
      ? carTransmissionLabel(car.specifications.transmission, locale)
      : undefined,
  ].filter(Boolean);
  return parts.join(" • ") || "—";
}
