import { SITE_WHATSAPP_DIGITS } from "@/lib/siteContact";
import { Locale } from "@/types/locale";

interface WhatsAppDetails {
  title: string;
  price?: string;
  // Car specific
  brand?: string;
  model?: string;
  // Excursion specific
  duration?: string;
  language?: string;
}

interface BookingDetails extends WhatsAppDetails {
  startDate?: string;
  endDate?: string;
  comments?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  telegram?: string;
}

type WhatsAppItemType = "excursion" | "car" | "accommodation" | "general";

function interestMessage(
  itemType: WhatsAppItemType,
  details: WhatsAppDetails,
  language: Locale
): string {
  const messages: Record<Locale, Record<WhatsAppItemType, string>> = {
    en: {
      excursion: `Hi! I'm interested in the tour "${details.title}" (${details.duration}, ${details.language}) for ${details.price}`,
      car: `Hi! I'd like to rent a car ${details.brand} ${details.model} "${details.title}" for ${details.price}`,
      accommodation: `Hi! I'm interested in the stay "${details.title}" for ${details.price}`,
      general: `Hi! I'd like to learn more about your services in Tenerife`,
    },
    pl: {
      excursion: `Dzień dobry! Interesuje mnie wycieczka "${details.title}" (${details.duration}, ${details.language}) za ${details.price}`,
      car: `Dzień dobry! Chciałbym wynająć samochód ${details.brand} ${details.model} "${details.title}" za ${details.price}`,
      accommodation: `Dzień dobry! Interesuje mnie zakwaterowanie "${details.title}" za ${details.price}`,
      general: `Dzień dobry! Chciałbym dowiedzieć się więcej o Waszych usługach na Teneryfie`,
    },
    fr: {
      excursion: `Bonjour ! Je suis intéressé par l'excursion "${details.title}" (${details.duration}, ${details.language}) pour ${details.price}`,
      car: `Bonjour ! Je voudrais louer une voiture ${details.brand} ${details.model} "${details.title}" pour ${details.price}`,
      accommodation: `Bonjour ! Je suis intéressé par l'hébergement "${details.title}" pour ${details.price}`,
      general: `Bonjour ! Je voudrais en savoir plus sur vos services à Tenerife`,
    },
    ru: {
      excursion: `Привет! Меня интересует экскурсия "${details.title}" (${details.duration}, ${details.language}) за ${details.price}`,
      car: `Привет! Я хотел бы арендовать автомобиль ${details.brand} ${details.model} "${details.title}" за ${details.price}`,
      accommodation: `Привет! Меня интересует жилье "${details.title}" за ${details.price}`,
      general: `Привет! Я хотел бы узнать больше о ваших услугах на Тенерифе`,
    },
    ua: {
      excursion: `Привіт! Мене цікавить екскурсія "${details.title}" (${details.duration}, ${details.language}) за ${details.price}`,
      car: `Привіт! Я хотів би орендувати автомобіль ${details.brand} ${details.model} "${details.title}" за ${details.price}`,
      accommodation: `Привіт! Мене цікавить житло "${details.title}" за ${details.price}`,
      general: `Привіт! Я хотів би дізнатися більше про ваші послуги на Тенеріфе`,
    },
    de: {
      excursion: `Hallo! Ich interessiere mich für die Exkursion "${details.title}" (${details.duration}, ${details.language}) für ${details.price}`,
      car: `Hallo! Ich möchte ein Auto mieten ${details.brand} ${details.model} "${details.title}" für ${details.price}`,
      accommodation: `Hallo! Ich interessiere mich für die Unterkunft "${details.title}" für ${details.price}`,
      general: `Hallo! Ich möchte mehr über Ihre Dienstleistungen auf Teneriffa erfahren`,
    },
    es: {
      excursion: `¡Hola! Me interesa la excursión "${details.title}" (${details.duration}, ${details.language}) por ${details.price}`,
      car: `¡Hola! Me gustaría alquilar un coche ${details.brand} ${details.model} "${details.title}" por ${details.price}`,
      accommodation: `¡Hola! Me interesa el alojamiento "${details.title}" por ${details.price}`,
      general: `¡Hola! Me gustaría saber más sobre sus servicios en Tenerife`,
    },
  };

  const localeMessages = messages[language] ?? messages.en;
  let message = localeMessages[itemType];
  if (typeof window !== "undefined") {
    const refCode = localStorage.getItem("ref_code") || "";
    if (refCode) {
      message += ` (ref: ${refCode})`;
    }
  }
  return message;
}

/** WhatsApp deep link to the work number with a prefilled interest message. */
export function whatsAppInterestHref(
  itemType: WhatsAppItemType,
  details: WhatsAppDetails,
  language: Locale = "en"
): string {
  const text = encodeURIComponent(interestMessage(itemType, details, language));
  return `https://wa.me/${SITE_WHATSAPP_DIGITS}?text=${text}`;
}

export const openWhatsApp = (
  itemType: WhatsAppItemType,
  details: WhatsAppDetails,
  language: Locale = "en"
) => {
  if (typeof window === "undefined") {
    return;
  }
  window.open(whatsAppInterestHref(itemType, details, language), "_blank");
};

export const openBookingWhatsApp = (
  itemType: "excursion" | "car" | "accommodation",
  details: BookingDetails,
  language: Locale = "en"
) => {
  // Check if we're in the browser
  if (typeof window === "undefined") {
    return;
  }

  const phoneNumber = SITE_WHATSAPP_DIGITS;

  const bookingMessages = {
    en: {
      accommodation: `Hi! I would like to book "${details.title}" for ${details.price}`,
      car: `Hi! I would like to book the car ${details.brand} ${details.model} "${details.title}" for ${details.price}`,
      excursion: `Hi! I would like to book the tour "${details.title}" (${details.duration}, ${details.language}) for ${details.price}`,
    },
    pl: {
      accommodation: `Dzień dobry! Chciałbym zarezerwować "${details.title}" za ${details.price}`,
      car: `Dzień dobry! Chciałbym zarezerwować samochód ${details.brand} ${details.model} "${details.title}" za ${details.price}`,
      excursion: `Dzień dobry! Chciałbym zarezerwować wycieczkę "${details.title}" (${details.duration}, ${details.language}) za ${details.price}`,
    },
    fr: {
      accommodation: `Bonjour ! Je voudrais réserver "${details.title}" pour ${details.price}`,
      car: `Bonjour ! Je voudrais réserver la voiture ${details.brand} ${details.model} "${details.title}" pour ${details.price}`,
      excursion: `Bonjour ! Je voudrais réserver l'excursion "${details.title}" (${details.duration}, ${details.language}) pour ${details.price}`,
    },
    ru: {
      accommodation: `Привет! Я хотел бы забронировать "${details.title}" за ${details.price}`,
      car: `Привет! Я хотел бы забронировать автомобиль ${details.brand} ${details.model} "${details.title}" за ${details.price}`,
      excursion: `Привет! Я хотел бы забронировать экскурсию "${details.title}" (${details.duration}, ${details.language}) за ${details.price}`,
    },
    ua: {
      accommodation: `Привіт! Я хотів би забронювати "${details.title}" за ${details.price}`,
      car: `Привіт! Я хотів би забронювати автомобіль ${details.brand} ${details.model} "${details.title}" за ${details.price}`,
      excursion: `Привіт! Я хотів би забронювати екскурсію "${details.title}" (${details.duration}, ${details.language}) за ${details.price}`,
    },
    de: {
      accommodation: `Hallo! Ich möchte "${details.title}" für ${details.price} buchen`,
      car: `Hallo! Ich möchte das Auto ${details.brand} ${details.model} "${details.title}" für ${details.price} buchen`,
      excursion: `Hallo! Ich möchte die Exkursion "${details.title}" (${details.duration}, ${details.language}) für ${details.price} buchen`,
    },
    es: {
      accommodation: `¡Hola! Me gustaría reservar "${details.title}" por ${details.price}`,
      car: `¡Hola! Me gustaría reservar el coche ${details.brand} ${details.model} "${details.title}" por ${details.price}`,
      excursion: `¡Hola! Me gustaría reservar la excursión "${details.title}" (${details.duration}, ${details.language}) por ${details.price}`,
    },
  };

  let message = bookingMessages[language][itemType];

  // Add contact information if provided
  if (details.firstName && details.lastName) {
    message += `\n\nContact Information:`;
    message += `\nName: ${details.firstName} ${details.lastName}`;
  }

  if (details.phone) {
    message += `\nPhone: ${details.phone}`;
  }

  if (details.email) {
    message += `\nEmail: ${details.email}`;
  }

  if (details.whatsapp) {
    message += `\nWhatsApp: ${details.whatsapp}`;
  }

  if (details.telegram) {
    message += `\nTelegram: ${details.telegram}`;
  }

  // Add dates if provided
  if (details.startDate && details.endDate) {
    message += `\n\nDates: ${details.startDate} - ${details.endDate}`;
  }

  // Add comments if provided
  if (details.comments) {
    message += `\n\nComments: ${details.comments}`;
  }

  // Add referral code if available
  let refCode = "";
  if (typeof window !== "undefined") {
    refCode = localStorage.getItem("ref_code") || "";
  }

  if (refCode) {
    message += `\n\nRef: ${refCode}`;
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
};
