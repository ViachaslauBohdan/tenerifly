export const openWhatsApp = (
  itemType: 'excursion' | 'car' | 'accommodation' | 'general', 
  details: { title: string; price?: string },
  language: 'en' | 'pl' = 'en'
) => {
  const phoneNumber = '+34656641433';
  
  const messages = {
    en: {
      excursion: `Hi! I'm interested in the excursion "${details.title}" for ${details.price}`,
      car: `Hi! I'd like to rent a car "${details.title}" for ${details.price}`,
      accommodation: `Hi! I'm interested in the accommodation "${details.title}" for ${details.price}`,
      general: `Hi! I'd like to learn more about your services in Tenerife`
    },
    pl: {
      excursion: `Dzień dobry! Interesuje mnie wycieczka "${details.title}" za ${details.price}`,
      car: `Dzień dobry! Chciałbym wynająć samochód "${details.title}" za ${details.price}`,
      accommodation: `Dzień dobry! Interesuje mnie zakwaterowanie "${details.title}" za ${details.price}`,
      general: `Dzień dobry! Chciałbym dowiedzieć się więcej o Waszych usługach na Teneryfie`
    }
  };
  
  const encodedMessage = encodeURIComponent(messages[language][itemType]);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}; 