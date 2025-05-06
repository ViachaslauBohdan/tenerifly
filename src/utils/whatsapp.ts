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
  language: 'en' | 'pl' = 'en'
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
    }
  };
  
  // Get ref_code from localStorage if present
  let refCode = '';
  if (typeof window !== 'undefined') {
    refCode = localStorage.getItem('ref_code') || '';
  }

  // Append ref_code to the message if it exists
  let message = messages[language][itemType];
  if (refCode) {
    message += ` (ref: ${refCode})`;
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}; 