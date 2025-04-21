export const openWhatsApp = (message: string = '') => {
  const phoneNumber = '+34656641433';
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}; 