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

export const getTransferLocaleText = (locale: string) =>
  transferText[locale as keyof typeof transferText] || transferText.en;

export const getTransferImage = (transfer: Transfer) => {
  const firstImage = transfer.images?.[0]?.url;
  if (firstImage) {
    if (firstImage.startsWith("http") || firstImage.startsWith("/")) {
      return firstImage;
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL ||
      "https://tenerifly-strapi-production.up.railway.app";
    return `${apiUrl}${firstImage}`;
  }

  if (transfer.image) {
    if (transfer.image.startsWith("http") || transfer.image.startsWith("/")) {
      return transfer.image;
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL ||
      "https://tenerifly-strapi-production.up.railway.app";
    return `${apiUrl}${transfer.image}`;
  }

  return "/placeholder.svg?height=400&width=600";
};

export const getTransferPrice = (transfer: Transfer, airport: "south" | "north") =>
  airport === "south"
    ? Number(transfer.price_south_airport || 50)
    : Number(transfer.price_north_airport || 100);

export const formatTransferPrice = (
  transfer: Transfer,
  airport: "south" | "north"
) => `${transfer.currency || "EUR"} ${getTransferPrice(transfer, airport)}`;
