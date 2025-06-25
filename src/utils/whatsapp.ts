import { Locale } from '@/types/locale';

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

export const openWhatsApp = (
  itemType: 'excursion' | 'car' | 'accommodation' | 'general', 
  details: WhatsAppDetails,
  language: Locale = 'en' 
) => {
  const phoneNumber = '+34656641433';
  
  const messages = {
    en: {
      excursion: `Hi! I'm interested in the excursion "${details.title}" (${details.duration}, ${details.language}) for ${details.price}`,
      car: `Hi! I'd like to rent a car ${details.brand} ${details.model} "${details.title}" for ${details.price}`,
      accommodation: `Hi! I'm interested in the accommodation "${details.title}" for ${details.price}`,
      general: `Hi! I'd like to learn more about your services in Tenerife`
    },
    pl: {
      excursion: `Dzień dobry! Interesuje mnie wycieczka "${details.title}" (${details.duration}, ${details.language}) za ${details.price}`,
      car: `Dzień dobry! Chciałbym wynająć samochód ${details.brand} ${details.model} "${details.title}" za ${details.price}`,
      accommodation: `Dzień dobry! Interesuje mnie zakwaterowanie "${details.title}" za ${details.price}`,
      general: `Dzień dobry! Chciałbym dowiedzieć się więcej o Waszych usługach na Teneryfie`
    },
    fr: {
      excursion: `Bonjour ! Je suis intéressé par l'excursion "${details.title}" (${details.duration}, ${details.language}) pour ${details.price}`,
      car: `Bonjour ! Je voudrais louer une voiture ${details.brand} ${details.model} "${details.title}" pour ${details.price}`,
      accommodation: `Bonjour ! Je suis intéressé par l'hébergement "${details.title}" pour ${details.price}`,
      general: `Bonjour ! Je voudrais en savoir plus sur vos services à Tenerife`
    },
    ru: {
      excursion: `Привет! Меня интересует экскурсия "${details.title}" (${details.duration}, ${details.language}) за ${details.price}`,
      car: `Привет! Я хотел бы арендовать автомобиль ${details.brand} ${details.model} "${details.title}" за ${details.price}`,
      accommodation: `Привет! Меня интересует жилье "${details.title}" за ${details.price}`,
      general: `Привет! Я хотел бы узнать больше о ваших услугах на Тенерифе`
    },
    uk: {
      excursion: `Привіт! Мене цікавить екскурсія "${details.title}" (${details.duration}, ${details.language}) за ${details.price}`,
      car: `Привіт! Я хотів би орендувати автомобіль ${details.brand} ${details.model} "${details.title}" за ${details.price}`,
      accommodation: `Привіт! Мене цікавить житло "${details.title}" за ${details.price}`,
      general: `Привіт! Я хотів би дізнатися більше про ваші послуги на Тенеріфе`
    }
  };
  
  let refCode = '';
  if (typeof window !== 'undefined') {
    refCode = localStorage.getItem('ref_code') || '';
  }

  let message = messages[language][itemType];
  if (refCode) {
    message += ` (ref: ${refCode})`;
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}