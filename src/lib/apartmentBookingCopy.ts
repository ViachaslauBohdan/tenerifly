import { localeContentKey, type Locale } from "@/types/locale";

/** Minutes promised in the apartment request success copy. */
export const APARTMENT_PRICE_RESPONSE_MINUTES = 30;

type ApartmentBookingCopy = {
  checkPrice: string;
  contactManager: string;
  chooseChannel: string;
  whatsapp: string;
  telegram: string;
  requestTitle: string;
  steps: string;
  priceDisclaimer: string;
  success: string;
};

const COPY: Record<string, ApartmentBookingCopy> = {
  en: {
    checkPrice: "Get exact price",
    contactManager: "Message manager",
    chooseChannel: "Choose how to write",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    requestTitle: "Booking request",
    steps:
      "1. You send a request → 2. Manager confirms the exact price → 3. Prepayment locks the dates",
    priceDisclaimer:
      "Indicative price. It may be higher or lower depending on season and length of stay.",
    success: `Request received. A manager will confirm the price for your dates and contact you within ${APARTMENT_PRICE_RESPONSE_MINUTES} minutes. Dates are held only after price confirmation and prepayment.`,
  },
  ru: {
    checkPrice: "Узнать точную цену",
    contactManager: "Написать менеджеру",
    chooseChannel: "Как написать",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    requestTitle: "Запрос на бронирование",
    steps:
      "1. Вы отправляете запрос → 2. Менеджер подтверждает точную цену → 3. Предоплата закрывает даты",
    priceDisclaimer:
      "Ориентировочная цена. Может быть выше или ниже в зависимости от сезона и длительности",
    success: `Запрос принят. Менеджер уточнит стоимость на выбранные даты и свяжется с вами в течение ${APARTMENT_PRICE_RESPONSE_MINUTES} минут. Даты закрепляются только после подтверждения цены и предоплаты.`,
  },
  uk: {
    checkPrice: "Дізнатися точну ціну",
    contactManager: "Написати менеджеру",
    chooseChannel: "Як написати",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    requestTitle: "Запит на бронювання",
    steps:
      "1. Ви надсилаєте запит → 2. Менеджер підтверджує точну ціну → 3. Передоплата фіксує дати",
    priceDisclaimer:
      "Орієнтовна ціна. Може бути вищою або нижчою залежно від сезону та тривалості",
    success: `Запит прийнято. Менеджер уточнить вартість на обрані дати і зв'яжеться з вами протягом ${APARTMENT_PRICE_RESPONSE_MINUTES} хвилин. Дати фіксуються лише після підтвердження ціни та передоплати.`,
  },
  pl: {
    checkPrice: "Poznaj dokładną cenę",
    contactManager: "Napisz do managera",
    chooseChannel: "Jak napisać",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    requestTitle: "Zapytanie o rezerwację",
    steps:
      "1. Wysyłasz zapytanie → 2. Manager potwierdza dokładną cenę → 3. Przedpłata rezerwuje terminy",
    priceDisclaimer:
      "Cena orientacyjna. Może być wyższa lub niższa w zależności od sezonu i długości pobytu.",
    success: `Zapytanie przyjęte. Manager potwierdzi cenę na wybrane daty i skontaktuje się w ciągu ${APARTMENT_PRICE_RESPONSE_MINUTES} minut. Terminy są blokowane dopiero po potwierdzeniu ceny i przedpłacie.`,
  },
  fr: {
    checkPrice: "Connaître le prix exact",
    contactManager: "Écrire au manager",
    chooseChannel: "Comment écrire",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    requestTitle: "Demande de réservation",
    steps:
      "1. Vous envoyez une demande → 2. Le manager confirme le prix exact → 3. L'acompte bloque les dates",
    priceDisclaimer:
      "Prix indicatif. Il peut être plus élevé ou plus bas selon la saison et la durée.",
    success: `Demande reçue. Un manager confirmera le prix pour vos dates et vous contactera sous ${APARTMENT_PRICE_RESPONSE_MINUTES} minutes. Les dates sont réservées uniquement après confirmation du prix et acompte.`,
  },
  de: {
    checkPrice: "Genauen Preis erfahren",
    contactManager: "Manager schreiben",
    chooseChannel: "Wie schreiben",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    requestTitle: "Buchungsanfrage",
    steps:
      "1. Sie senden eine Anfrage → 2. Manager bestätigt den genauen Preis → 3. Anzahlung sichert die Daten",
    priceDisclaimer:
      "Richtpreis. Kann je nach Saison und Aufenthaltsdauer höher oder niedriger sein.",
    success: `Anfrage erhalten. Ein Manager bestätigt den Preis für Ihre Daten und meldet sich innerhalb von ${APARTMENT_PRICE_RESPONSE_MINUTES} Minuten. Daten werden erst nach Preisbestätigung und Anzahlung gesichert.`,
  },
  es: {
    checkPrice: "Saber el precio exacto",
    contactManager: "Escribir al manager",
    chooseChannel: "Cómo escribir",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    requestTitle: "Solicitud de reserva",
    steps:
      "1. Envía la solicitud → 2. El manager confirma el precio exacto → 3. El prepago bloquea las fechas",
    priceDisclaimer:
      "Precio orientativo. Puede ser mayor o menor según la temporada y la duración.",
    success: `Solicitud recibida. Un manager confirmará el precio para tus fechas y te contactará en ${APARTMENT_PRICE_RESPONSE_MINUTES} minutos. Las fechas se reservan solo tras confirmar el precio y el prepago.`,
  },
};

const MANAGER_MESSAGE: Record<string, (title: string) => string> = {
  en: (title) =>
    `Hello! I'm interested in “${title}”. Could you tell me the price and available dates?`,
  ru: (title) =>
    `Здравствуйте! Интересует «${title}». Подскажите цену и свободные даты.`,
  uk: (title) =>
    `Вітаю! Цікавить «${title}». Підкажіть ціну та вільні дати.`,
  pl: (title) =>
    `Dzień dobry! Interesuje mnie „${title}”. Proszę o cenę i wolne terminy.`,
  fr: (title) =>
    `Bonjour ! Je suis intéressé par « ${title} ». Pouvez-vous indiquer le prix et les dates disponibles ?`,
  de: (title) =>
    `Hallo! Mich interessiert „${title}“. Bitte teilen Sie Preis und freie Termine mit.`,
  es: (title) =>
    `¡Hola! Me interesa «${title}». ¿Me puede indicar el precio y las fechas disponibles?`,
};

export function getApartmentBookingCopy(
  locale: Locale | string
): ApartmentBookingCopy {
  const key = localeContentKey(locale);
  return COPY[key] ?? COPY.en;
}

/** Prefill for WhatsApp / Telegram when writing the apartment manager. */
export function getApartmentManagerMessage(
  propertyTitle: string,
  locale: Locale | string
): string {
  const title = propertyTitle.trim() || "apartment";
  const key = localeContentKey(locale);
  const build = MANAGER_MESSAGE[key] ?? MANAGER_MESSAGE.en;
  return build(title);
}
