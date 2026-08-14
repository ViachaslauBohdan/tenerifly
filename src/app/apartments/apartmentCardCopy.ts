import { localeContentKey } from "@/types/locale";

const FOR_RENT: Record<string, string> = {
  en: "For Rent",
  ru: "Аренда",
  pl: "Na wynajem",
  fr: "À louer",
  uk: "Оренда",
  de: "Zu vermieten",
  es: "En alquiler",
};

const FOR_SALE: Record<string, string> = {
  en: "For Sale",
  ru: "Продажа",
  pl: "Na sprzedaż",
  fr: "À vendre",
  uk: "Продаж",
  de: "Zu verkaufen",
  es: "En venta",
};

export function apartmentListingTypeLabel(
  type: string | undefined,
  locale: string
): string {
  const key = localeContentKey(locale);
  const bundle = type === "sale" ? FOR_SALE : FOR_RENT;
  return bundle[key] || bundle.en;
}
