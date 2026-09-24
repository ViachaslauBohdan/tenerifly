import { localeContentKey } from "@/types/locale";

export type Transfer = {
  id: number | string;
  documentId: string;
  title: string;
  slug?: string;
  description: string;
  seats: number;
  price_south_airport: number;
  price_north_airport: number;
  currency: string;
  image?: string;
  images?: Array<{ url: string }>;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    telegram?: string;
  };
};

export const fallbackTransfers: Transfer[] = [
  {
    id: "transfer-13-seats",
    documentId: "mercedes-sprinter-13-seats-airport-transfer",
    title: "Mercedes Sprinter 13 seats",
    slug: "mercedes-sprinter-13-seats-airport-transfer",
    description:
      "Private airport transfer in Tenerife for groups up to 13 passengers, with comfortable seating and luggage space.",
    seats: 13,
    price_south_airport: 50,
    price_north_airport: 100,
    currency: "EUR",
  },
  {
    id: "transfer-8-seats",
    documentId: "mercedes-sprinter-8-seats-airport-transfer",
    title: "Mercedes Sprinter 8 seats",
    slug: "mercedes-sprinter-8-seats-airport-transfer",
    description:
      "Private airport transfer in Tenerife for families and small groups up to 8 passengers.",
    seats: 8,
    price_south_airport: 50,
    price_north_airport: 100,
    currency: "EUR",
  },
];

export const transferText = {
  en: {
    sectionTitle: "Airport Transfers",
    sectionSubtitle:
      "Private Tenerife airport transfers for families and groups",
    seats: "seats",
    bothSeats: "8 and 13 seats",
    southAirport: "South Airport",
    northAirport: "North Airport",
    from: "from",
    viewDetails: "View details",
    bookNow: "Book transfer",
    back: "Back to home",
    detailTitle: "Airport transfer in Tenerife",
    included: "Included",
    includedItems: [
      "Private minibus transfer",
      "Pickup from Tenerife South or North Airport",
      "Fixed airport pricing",
      "Comfortable luggage space",
    ],
  },
  ru: {
    sectionTitle: "Трансферы из аэропорта",
    sectionSubtitle:
      "Индивидуальные трансферы по Тенерифе для семей и групп",
    seats: "мест",
    bothSeats: "на 8 и на 13 мест",
    southAirport: "Южный аэропорт",
    northAirport: "Северный аэропорт",
    from: "от",
    viewDetails: "Подробнее",
    bookNow: "Забронировать трансфер",
    back: "Назад на главную",
    detailTitle: "Трансфер из аэропорта на Тенерифе",
    included: "Что включено",
    includedItems: [
      "Индивидуальный трансфер на минибасе",
      "Встреча в Южном или Северном аэропорту Тенерифе",
      "Фиксированная цена для аэропортов",
      "Комфортное место для багажа",
    ],
  },
  pl: {
    sectionTitle: "Transfery z lotniska",
    sectionSubtitle: "Prywatne transfery na Teneryfie dla rodzin i grup",
    seats: "miejsc",
    bothSeats: "8 i 13 miejsc",
    southAirport: "Lotnisko południowe",
    northAirport: "Lotnisko północne",
    from: "od",
    viewDetails: "Szczegóły",
    bookNow: "Zarezerwuj transfer",
    back: "Powrót do strony głównej",
    detailTitle: "Transfer z lotniska na Teneryfie",
    included: "W cenie",
    includedItems: [
      "Prywatny transfer minibusem",
      "Odbiór z lotniska Tenerife South lub North",
      "Stałe ceny lotniskowe",
      "Wygodne miejsce na bagaż",
    ],
  },
  fr: {
    sectionTitle: "Transferts aéroport",
    sectionSubtitle:
      "Transferts privés à Tenerife pour familles et groupes",
    seats: "places",
    bothSeats: "8 et 13 places",
    southAirport: "Aéroport Sud",
    northAirport: "Aéroport Nord",
    from: "à partir de",
    viewDetails: "Voir détails",
    bookNow: "Réserver le transfert",
    back: "Retour à l'accueil",
    detailTitle: "Transfert aéroport à Tenerife",
    included: "Inclus",
    includedItems: [
      "Transfert privé en minibus",
      "Prise en charge à l'aéroport Sud ou Nord de Tenerife",
      "Tarifs fixes pour les aéroports",
      "Espace confortable pour les bagages",
    ],
  },
  uk: {
    sectionTitle: "Трансфери з аеропорту",
    sectionSubtitle:
      "Індивідуальні трансфери по Тенерифе для сімей і груп",
    seats: "місць",
    bothSeats: "на 8 і на 13 місць",
    southAirport: "Південний аеропорт",
    northAirport: "Північний аеропорт",
    from: "від",
    viewDetails: "Детальніше",
    bookNow: "Забронювати трансфер",
    back: "Назад на головну",
    detailTitle: "Трансфер з аеропорту на Тенерифе",
    included: "Що включено",
    includedItems: [
      "Індивідуальний трансфер на мінібасі",
      "Зустріч у Південному або Північному аеропорту Тенерифе",
      "Фіксована ціна для аеропортів",
      "Комфортне місце для багажу",
    ],
  },
  de: {
    sectionTitle: "Flughafentransfers",
    sectionSubtitle: "Private Transfers auf Teneriffa für Familien und Gruppen",
    seats: "Sitze",
    bothSeats: "8 und 13 Sitze",
    southAirport: "Flughafen Süd",
    northAirport: "Flughafen Nord",
    from: "ab",
    viewDetails: "Details",
    bookNow: "Transfer buchen",
    back: "Zur Startseite",
    detailTitle: "Flughafentransfer auf Teneriffa",
    included: "Inklusive",
    includedItems: [
      "Privater Minibus-Transfer",
      "Abholung am Flughafen Teneriffa Süd oder Nord",
      "Feste Flughafenpreise",
      "Komfortabler Platz für Gepäck",
    ],
  },
  es: {
    sectionTitle: "Traslados al aeropuerto",
    sectionSubtitle:
      "Traslados privados en Tenerife para familias y grupos",
    seats: "plazas",
    bothSeats: "8 y 13 plazas",
    southAirport: "Aeropuerto Sur",
    northAirport: "Aeropuerto Norte",
    from: "desde",
    viewDetails: "Ver detalles",
    bookNow: "Reservar traslado",
    back: "Volver al inicio",
    detailTitle: "Traslado al aeropuerto en Tenerife",
    included: "Incluido",
    includedItems: [
      "Traslado privado en minibús",
      "Recogida en el Aeropuerto Sur o Norte de Tenerife",
      "Precios fijos para aeropuertos",
      "Espacio cómodo para equipaje",
    ],
  },
};

export const getTransferLocaleText = (locale: string) => {
  const key = localeContentKey(locale) as keyof typeof transferText;
  return transferText[key] || transferText.en;
};

type TransferCardCopy = {
  title: string;
  description: string;
};

export const transferCardCopy: Record<
  "8" | "13",
  Record<string, TransferCardCopy>
> = {
  "8": {
    en: {
      title: "Mercedes Sprinter 8 seats airport transfer",
      description:
        "Private airport transfer in Tenerife for groups up to 8 passengers. Ideal for families and small groups travelling with luggage.",
    },
    uk: {
      title: "Mercedes Sprinter 8 місць — трансфер з аеропорту",
      description:
        "Приватний трансфер з аеропорту на Тенерифе для груп до 8 пасажирів. Ідеально для сімей і невеликих груп із багажем.",
    },
    ru: {
      title: "Mercedes Sprinter 8 мест — трансфер из аэропорта",
      description:
        "Индивидуальный трансфер из аэропорта на Тенерифе для групп до 8 пассажиров. Идеально для семей и небольших групп с багажом.",
    },
    pl: {
      title: "Mercedes Sprinter 8 miejsc — transfer z lotniska",
      description:
        "Prywatny transfer z lotniska na Teneryfie dla grup do 8 pasażerów. Idealny dla rodzin i małych grup z bagażem.",
    },
    de: {
      title: "Mercedes Sprinter 8 Sitze — Flughafentransfer",
      description:
        "Privater Flughafentransfer auf Teneriffa für Gruppen bis 8 Personen. Ideal für Familien und kleine Gruppen mit Gepäck.",
    },
    es: {
      title: "Mercedes Sprinter 8 plazas — traslado al aeropuerto",
      description:
        "Traslado privado al aeropuerto en Tenerife para grupos de hasta 8 pasajeros. Ideal para familias y grupos pequeños con equipaje.",
    },
    fr: {
      title: "Mercedes Sprinter 8 places — transfert aéroport",
      description:
        "Transfert privé aéroport à Tenerife pour les groupes jusqu'à 8 passagers. Idéal pour les familles et les petits groupes avec bagages.",
    },
  },
  "13": {
    en: {
      title: "Mercedes Sprinter 13 seats airport transfer",
      description:
        "Private airport transfer in Tenerife for groups up to 13 passengers. Comfortable Mercedes Sprinter minibus with space for luggage.",
    },
    uk: {
      title: "Mercedes Sprinter 13 місць — трансфер з аеропорту",
      description:
        "Приватний трансфер з аеропорту на Тенерифе для груп до 13 пасажирів. Комфортабельний мікроавтобус Mercedes Sprinter із місцем для багажу.",
    },
    ru: {
      title: "Mercedes Sprinter 13 мест — трансфер из аэропорта",
      description:
        "Индивидуальный трансфер из аэропорта на Тенерифе для групп до 13 пассажиров. Комфортабельный микроавтобус Mercedes Sprinter с местом для багажа.",
    },
    pl: {
      title: "Mercedes Sprinter 13 miejsc — transfer z lotniska",
      description:
        "Prywatny transfer z lotniska na Teneryfie dla grup do 13 pasażerów. Wygodny minibus Mercedes Sprinter z miejscem na bagaż.",
    },
    de: {
      title: "Mercedes Sprinter 13 Sitze — Flughafentransfer",
      description:
        "Privater Flughafentransfer auf Teneriffa für Gruppen bis 13 Personen. Komfortabler Mercedes-Sprinter-Minibus mit Platz für Gepäck.",
    },
    es: {
      title: "Mercedes Sprinter 13 plazas — traslado al aeropuerto",
      description:
        "Traslado privado al aeropuerto en Tenerife para grupos de hasta 13 pasajeros. Cómodo minibús Mercedes Sprinter con espacio para el equipaje.",
    },
    fr: {
      title: "Mercedes Sprinter 13 places — transfert aéroport",
      description:
        "Transfert privé aéroport à Tenerife pour les groupes jusqu'à 13 passagers. Minibus Mercedes Sprinter confortable avec espace bagages.",
    },
  },
};

const englishTransferTitles = new Set(
  Object.values(transferCardCopy)
    .map((byLocale) => byLocale.en?.title)
    .filter(Boolean)
);

export function getTransferVehicleKey(
  transfer: Pick<Transfer, "seats" | "documentId" | "slug" | "title">
): "8" | "13" | null {
  const seats = Number(transfer.seats);
  if (seats === 8) return "8";
  if (seats === 13) return "13";

  const haystack = `${transfer.documentId} ${transfer.slug ?? ""} ${transfer.title}`;
  if (/8[- ]seats/i.test(haystack)) return "8";
  if (/13[- ]seats/i.test(haystack)) return "13";
  return null;
}

export function localizeTransfer(transfer: Transfer, locale: string): Transfer {
  const key = localeContentKey(locale);
  const vehicle = getTransferVehicleKey(transfer);
  if (!vehicle) return transfer;

  const copy = transferCardCopy[vehicle][key];
  if (!copy || key === "en") return transfer;

  const stillEnglish =
    englishTransferTitles.has(transfer.title) ||
    /^Private airport transfer/i.test(transfer.description || "");
  if (!stillEnglish) return transfer;

  return {
    ...transfer,
    title: copy.title,
    description: copy.description,
  };
}

const STRAPI_API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";

export function resolveTransferMediaUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/uploads")) {
    return `${STRAPI_API_URL}${url}`;
  }
  return url.startsWith("/") ? url : `${STRAPI_API_URL}/${url}`;
}

export function getTransferFallbackImage(
  transfer: Pick<Transfer, "seats" | "documentId" | "slug" | "title">
): string {
  const vehicle = getTransferVehicleKey(transfer);
  if (vehicle === "8") return "/transfers/mercedes-sprinter-8.jpg";
  if (vehicle === "13") return "/transfers/mercedes-sprinter-13.jpg";
  return "/placeholder.svg?height=400&width=600";
}

export const getTransferImage = (transfer: Transfer) => {
  const firstImage = transfer.images?.[0]?.url;
  if (firstImage) {
    return resolveTransferMediaUrl(firstImage);
  }

  if (transfer.image) {
    return resolveTransferMediaUrl(transfer.image);
  }

  return getTransferFallbackImage(transfer);
};

export const getTransferPrice = (transfer: Transfer, airport: "south" | "north") =>
  airport === "south"
    ? Number(transfer.price_south_airport || 50)
    : Number(transfer.price_north_airport || 100);

export const formatTransferPrice = (
  transfer: Transfer,
  airport: "south" | "north"
) => `${transfer.currency || "EUR"} ${getTransferPrice(transfer, airport)}`;

type PassengerCar = {
  title?: string;
  documentId?: string;
  description?: string;
  images?: Array<{ url?: string } | null> | null;
  specifications?: { make?: string; model?: string; seats?: number };
};

export function isPassengerRenault(
  car: PassengerCar
): boolean {
  const name = `${car.specifications?.make ?? ""} ${car.specifications?.model ?? ""} ${car.title ?? ""}`;
  return /renault/i.test(name) && /captur/i.test(name);
}

/** Home shows one minibus card. Prefer the 13-seat Sprinter when both sizes exist. */
export function pickHomeBusTransfer(transfers: Transfer[]): Transfer | null {
  const thirteen = transfers.find(
    (transfer) => getTransferVehicleKey(transfer) === "13"
  );
  if (thirteen) return thirteen;
  return transfers.find((transfer) => getTransferVehicleKey(transfer) === "8") ?? null;
}

export function homeBusHasBothSizes(transfers: Transfer[]): boolean {
  const keys = new Set(
    transfers.map((transfer) => getTransferVehicleKey(transfer))
  );
  return keys.has("8") && keys.has("13");
}
