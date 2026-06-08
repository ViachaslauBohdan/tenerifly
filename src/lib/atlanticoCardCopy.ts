import { pickLocaleBundle } from "@/types/locale";

export type AtlanticoCardCopy = {
  tagline: string;
  partnerTitle: string;
  description: string;
  toursCta: string;
  whatsappHint: string;
};

const ATLANTICO_CARD_COPY: Record<string, AtlanticoCardCopy> = {
  de: {
    tagline: "Mehr Touren & Aktivitäten",
    partnerTitle: "Unser Partner Atlántico Excursiones",
    description:
      "Busreisen, Freizeitparks, Bootstouren und VIP — buchen Sie bei Atlántico Excursiones.",
    toursCta: "Alle Touren anzeigen",
    whatsappHint:
      "Kontaktieren Sie uns per WhatsApp zur Reservierung Ihrer Exkursion",
  },
  en: {
    tagline: "More tours & activities",
    partnerTitle: "Our partner Atlántico Excursiones",
    description:
      "Coach tours, theme parks, boat trips and VIP experiences — book with Atlántico Excursiones.",
    toursCta: "View all tours",
    whatsappHint: "Contact us on WhatsApp to reserve your excursion",
  },
  es: {
    tagline: "Más tours y actividades",
    partnerTitle: "Nuestro socio Atlántico Excursiones",
    description:
      "Excursiones en bus, parques temáticos, barcos y experiencias VIP — reserva con Atlántico Excursiones.",
    toursCta: "Ver todos los tours",
    whatsappHint: "Contáctenos por WhatsApp para reservar su excursión",
  },
  fr: {
    tagline: "Plus de visites et d'activités",
    partnerTitle: "Notre partenaire Atlántico Excursiones",
    description:
      "Circuits en bus, parcs à thème, croisières et expériences VIP — réservez avec Atlántico Excursiones.",
    toursCta: "Voir toutes les visites",
    whatsappHint: "Contactez-nous sur WhatsApp pour réserver votre excursion",
  },
  pl: {
    tagline: "Więcej wycieczek i aktywności",
    partnerTitle: "Nasz partner: Atlántico Excursiones",
    description:
      "Wycieczki autokarowe, parki rozrywki, rejsy i VIP — rezerwuj z Atlántico Excursiones.",
    toursCta: "Zobacz wszystkie wycieczki",
    whatsappHint: "Skontaktuj się z nami przez WhatsApp, aby zarezerwować wycieczkę",
  },
  ru: {
    tagline: "Больше туров и активностей",
    partnerTitle: "Наш партнёр Atlántico Excursiones",
    description:
      "Автобусные туры, тематические парки, морские прогулки и VIP — бронируйте с Atlántico Excursiones.",
    toursCta: "Посмотреть все туры",
    whatsappHint: "Свяжитесь с нами в WhatsApp для резервации экскурсии",
  },
  uk: {
    tagline: "Більше турів та активностей",
    partnerTitle: "Партнер Atlántico Excursiones",
    description:
      "Автобусні тури, парки розваг, морські прогулянки та VIP — бронюйте з Atlántico Excursiones.",
    toursCta: "Переглянути всі тури",
    whatsappHint: "Зв'яжіться з нами в WhatsApp для резервації екскурсії",
  },
  ua: {
    tagline: "Більше турів та активностей",
    partnerTitle: "Партнер Atlántico Excursiones",
    description:
      "Автобусні тури, парки розваг, морські прогулянки та VIP — бронюйте з Atlántico Excursiones.",
    toursCta: "Переглянути всі тури",
    whatsappHint: "Зв'яжіться з нами в WhatsApp для резервації екскурсії",
  },
};

export function getAtlanticoCardCopy(locale: string): AtlanticoCardCopy {
  return pickLocaleBundle(ATLANTICO_CARD_COPY, locale);
}
