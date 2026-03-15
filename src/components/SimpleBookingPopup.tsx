import React, { useState } from "react";
import {
  Modal,
  Text,
  Button,
  Stack,
  Group,
  Textarea,
  TextInput,
  Select,
  Stepper,
  Box,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconMessage,
  IconSend,
  IconCalendar,
  IconUser,
  IconPhone,
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconCheck,
  IconMapPin,
  IconArrowRight,
  IconArrowLeft,
} from "@tabler/icons-react";
import type { Locale } from "@/types/locale";

interface SimpleBookingPopupProps {
  opened: boolean;
  onClose: () => void;
  item: {
    name: string;
    price?: string;
    currency?: string;
    contactEmail?: string;
  };
  mode?: "contact" | "booking";
  /** Current locale for translations. Defaults to "en" if not provided. */
  currentLocale?: Locale;
}

export function SimpleBookingPopup({
  opened,
  onClose,
  item,
  mode = "booking",
  currentLocale = "en",
}: SimpleBookingPopupProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [comments, setComments] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [telegram, setTelegram] = useState("");
  const [preferredContact, setPreferredContact] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState(0);

  const contactTranslations = {
    en: {
      title: "Pre-Book",
      itemName: "Property",
      price: "Price",
      contactInfo: "Contact Information",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      email: "Email",
      whatsapp: "WhatsApp (Optional)",
      telegram: "Telegram (Optional)",
      preferredContact: "Preferred contact",
      selectDates: "SELECT DATES",
      comments: "Request Description",
      commentsPlaceholder: "Any special requests or additional information...",
      close: "Close",
      send: "Send Contact Request",
      success:
        "Thanks for your contact request. Our Tenerifly team will analyze it and respond soon",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      emailError: "Please enter a valid email address",
      phoneError: "Please enter a valid phone number (at least 10 digits)",
      premium: "Premium Service",
      instantResponse: "Instant Response",
      secureBooking: "Secure Booking",
      next: "Next",
      back: "Back",
    },
  
    ru: {
      title: "Предварительное бронирование",
      itemName: "Объект",
      price: "Цена",
      contactInfo: "Контактная информация",
      firstName: "Имя",
      lastName: "Фамилия",
      phone: "Номер телефона",
      email: "Email",
      whatsapp: "WhatsApp (Необязательно)",
      telegram: "Telegram (Необязательно)",
      preferredContact: "Предпочтительный способ связи",
      selectDates: "ВЫБРАТЬ ДАТЫ (НЕОБЯЗАТЕЛЬНО)",
      comments: "Описание запроса",
      commentsPlaceholder: "Особые пожелания или дополнительная информация...",
      close: "Закрыть",
      send: "Отправить запрос на связь",
      success:
        "Спасибо за ваш запрос на связь. Наша команда Tenerifly проанализирует его и ответит в ближайшее время",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      emailError: "Пожалуйста, введите корректный email адрес",
      phoneError:
        "Пожалуйста, введите корректный номер телефона (минимум 10 цифр)",
      premium: "Премиум сервис",
      instantResponse: "Мгновенный ответ",
      secureBooking: "Безопасное бронирование",
      next: "Далее",
      back: "Назад",
    },
  
    pl: {
      title: "Przedwstępna rezerwacja",
      itemName: "Nieruchomość",
      price: "Cena",
      contactInfo: "Informacje kontaktowe",
      firstName: "Imię",
      lastName: "Nazwisko",
      phone: "Numer telefonu",
      email: "Email",
      whatsapp: "WhatsApp (Opcjonalnie)",
      telegram: "Telegram (Opcjonalnie)",
      preferredContact: "Preferowana metoda kontaktu",
      selectDates: "WYBIERZ DATY (OPCJONALNIE)",
      comments: "Opis żądania",
      commentsPlaceholder: "Specjalne życzenia lub dodatkowe informacje...",
      close: "Zamknij",
      send: "Wyślij prośbę o kontakt",
      success:
        "Dziękujemy za Twoją prośbę o kontakt. Nasz zespół Tenerifly przeanalizuje ją i odpowie wkrótce",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      emailError: "Proszę wprowadzić poprawny adres email",
      phoneError:
        "Proszę wprowadzić poprawny numer telefonu (co najmniej 10 cyfr)",
      premium: "Usługa Premium",
      instantResponse: "Natychmiastowa odpowiedź",
      secureBooking: "Bezpieczna rezerwacja",
      next: "Dalej",
      back: "Wstecz",
    },
  
    fr: {
      title: "Pré-réserver",
      itemName: "Propriété",
      price: "Prix",
      contactInfo: "Informations de contact",
      firstName: "Prénom",
      lastName: "Nom de famille",
      phone: "Numéro de téléphone",
      email: "Email",
      whatsapp: "WhatsApp (Optionnel)",
      telegram: "Telegram (Optionnel)",
      preferredContact: "Méthode de contact préférée",
      selectDates: "SÉLECTIONNER LES DATES (OPTIONNEL)",
      comments: "Description de la demande",
      commentsPlaceholder:
        "Demandes spéciales ou informations supplémentaires...",
      close: "Fermer",
      send: "Envoyer la demande de contact",
      success:
        "Merci pour votre demande de contact. Notre équipe Tenerifly l'analysera et répondra bientôt",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      emailError: "Veuillez saisir une adresse email valide",
      phoneError:
        "Veuillez saisir un numéro de téléphone valide (au moins 10 chiffres)",
      premium: "Service Premium",
      instantResponse: "Réponse Instantanée",
      secureBooking: "Réservation Sécurisée",
      next: "Suivant",
      back: "Retour",
    },
  
    uk: {
      title: "Попереднє бронювання",
      itemName: "Об'єкт",
      price: "Ціна",
      contactInfo: "Контактна інформація",
      firstName: "Ім'я",
      lastName: "Прізвище",
      phone: "Номер телефону",
      email: "Email",
      whatsapp: "WhatsApp (Необов'язково)",
      telegram: "Telegram (Необов'язково)",
      preferredContact: "Бажаний спосіб зв'язку",
      selectDates: "ВИБРАТИ ДАТИ (НЕОБОВ'ЯЗКОВО)",
      comments: "Опис запиту",
      commentsPlaceholder: "Особливі побажання або додаткова інформація...",
      close: "Закрити",
      send: "Надіслати запит на зв'язок",
      success:
        "Дякуємо за ваш запит на зв'язок. Наша команда Tenerifly проаналізує його і відповість найближчим часом",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      emailError: "Будь ласка, введіть коректну email адресу",
      phoneError:
        "Будь ласка, введіть коректний номер телефону (мінімум 10 цифр)",
      premium: "Преміум сервіс",
      instantResponse: "Миттєва відповідь",
      secureBooking: "Безпечне бронювання",
      next: "Далі",
      back: "Назад",
    },
  
    de: {
      title: "Vorab-Buchung",
      itemName: "Objekt",
      price: "Preis",
      contactInfo: "Kontaktinformationen",
      firstName: "Vorname",
      lastName: "Nachname",
      phone: "Telefonnummer",
      email: "E-Mail",
      whatsapp: "WhatsApp (Optional)",
      telegram: "Telegram (Optional)",
      preferredContact: "Bevorzugte Kontaktmethode",
      selectDates: "DATUM AUSWÄHLEN (OPTIONAL)",
      comments: "Anfragebeschreibung",
      commentsPlaceholder:
        "Besondere Wünsche oder zusätzliche Informationen...",
      close: "Schließen",
      send: "Kontaktanfrage senden",
      success:
        "Vielen Dank für Ihre Kontaktanfrage. Unser Tenerifly-Team wird sie analysieren und bald antworten",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "E-Mail",
      emailError: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      phoneError:
        "Bitte geben Sie eine gültige Telefonnummer ein (mindestens 10 Ziffern)",
      premium: "Premium-Service",
      instantResponse: "Sofortige Antwort",
      secureBooking: "Sichere Buchung",
      next: "Weiter",
      back: "Zurück",
    },
  
    es: {
      title: "Reserva anticipada",
      itemName: "Propiedad",
      price: "Precio",
      contactInfo: "Información de contacto",
      firstName: "Nombre",
      lastName: "Apellido",
      phone: "Número de teléfono",
      email: "Email",
      whatsapp: "WhatsApp (Opcional)",
      telegram: "Telegram (Opcional)",
      preferredContact: "Método de contacto preferido",
      selectDates: "SELECCIONAR FECHAS (OPCIONAL)",
      comments: "Descripción de la solicitud",
      commentsPlaceholder: "Solicitudes especiales o información adicional...",
      close: "Cerrar",
      send: "Enviar solicitud de contacto",
      success:
        "Gracias por su solicitud de contacto. Nuestro equipo Tenerifly la analizará y responderá pronto",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      emailError: "Por favor, introduzca una dirección de email válida",
      phoneError:
        "Por favor, introduzca un número de teléfono válido (mínimo 10 dígitos)",
      premium: "Servicio Premium",
      instantResponse: "Respuesta Instantánea",
      secureBooking: "Reserva Segura",
      next: "Siguiente",
      back: "Atrás",
    },
  };

  const bookingTranslations = {
    en: {
      title: "Pre-book",
      itemName: "Property",
      price: "Price",
      contactInfo: "Contact Information",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      email: "Email",
      whatsapp: "WhatsApp (Optional)",
      telegram: "Telegram (Optional)",
      preferredContact: "Preferred contact",
      selectDates: "SELECT DATES",
      comments: "Request Description",
      commentsPlaceholder: "Any special requests or additional information...",
      close: "Close",
      send: "Send Booking Request",
      success:
        "Thanks for your pre-booking request. Our Tenerifly team will analyze it and respond soon",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      emailError: "Please enter a valid email address",
      phoneError: "Please enter a valid phone number (at least 10 digits)",
      premium: "Premium Service",
      instantResponse: "Instant Response",
      secureBooking: "Secure Booking",
      next: "Next",
      back: "Back",
    },
  
    ru: {
      title: "Предварительное бронирование",
      itemName: "Объект",
      price: "Цена",
      contactInfo: "Контактная информация",
      firstName: "Имя",
      lastName: "Фамилия",
      phone: "Номер телефона",
      email: "Email",
      whatsapp: "WhatsApp (Необязательно)",
      telegram: "Telegram (Необязательно)",
      preferredContact: "Предпочтительный способ связи",
      selectDates: "ВЫБРАТЬ ДАТЫ (НЕОБЯЗАТЕЛЬНО)",
      comments: "Описание запроса",
      commentsPlaceholder: "Особые пожелания или дополнительная информация...",
      close: "Закрыть",
      send: "Отправить заявку на бронирование",
      success:
        "Спасибо за ваш запрос на предварительное бронирование. Наша команда Tenerifly проанализирует его и ответит в ближайшее время",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      emailError: "Пожалуйста, введите корректный email адрес",
      phoneError:
        "Пожалуйста, введите корректный номер телефона (минимум 10 цифр)",
      premium: "Премиум сервис",
      instantResponse: "Мгновенный ответ",
      secureBooking: "Безопасное бронирование",
      next: "Далее",
      back: "Назад",
    },
  
    pl: {
      title: "Przedwstępna rezerwacja",
      itemName: "Nieruchomość",
      price: "Cena",
      contactInfo: "Informacje kontaktowe",
      firstName: "Imię",
      lastName: "Nazwisko",
      phone: "Numer telefonu",
      email: "Email",
      whatsapp: "WhatsApp (Opcjonalnie)",
      telegram: "Telegram (Opcjonalnie)",
      preferredContact: "Preferowana metoda kontaktu",
      selectDates: "WYBIERZ DATY (OPCJONALNIE)",
      comments: "Opis żądania",
      commentsPlaceholder: "Specjalne życzenia lub dodatkowe informacje...",
      close: "Zamknij",
      send: "Wyślij prośbę o rezerwację",
      success:
        "Dziękujemy za Twoją prośbę o przedwstępną rezerwację. Nasz zespół Tenerifly przeanalizuje ją i odpowie wkrótce",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      emailError: "Proszę wprowadzić poprawny adres email",
      phoneError:
        "Proszę wprowadzić poprawny numer telefonu (co najmniej 10 cyfr)",
      premium: "Usługa Premium",
      instantResponse: "Natychmiastowa odpowiedź",
      secureBooking: "Bezpieczna rezerwacja",
      next: "Dalej",
      back: "Wstecz",
    },
  
    fr: {
      title: "Pré-réserver",
      itemName: "Propriété",
      price: "Prix",
      contactInfo: "Informations de contact",
      firstName: "Prénom",
      lastName: "Nom de famille",
      phone: "Numéro de téléphone",
      email: "Email",
      whatsapp: "WhatsApp (Optionnel)",
      telegram: "Telegram (Optionnel)",
      preferredContact: "Méthode de contact préférée",
      selectDates: "SÉLECTIONNER LES DATES (OPTIONNEL)",
      comments: "Description de la demande",
      commentsPlaceholder:
        "Demandes spéciales ou informations supplémentaires...",
      close: "Fermer",
      send: "Envoyer la demande de réservation",
      success:
        "Merci pour votre demande de pré-réservation. Notre équipe Tenerifly l'analysera et répondra bientôt",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      emailError: "Veuillez saisir une adresse email valide",
      phoneError:
        "Veuillez saisir un numéro de téléphone valide (au moins 10 chiffres)",
      premium: "Service Premium",
      instantResponse: "Réponse Instantanée",
      secureBooking: "Réservation Sécurisée",
      next: "Suivant",
      back: "Retour",
    },
  
    uk: {
      title: "Попереднє бронювання",
      itemName: "Об'єкт",
      price: "Ціна",
      contactInfo: "Контактна інформація",
      firstName: "Ім'я",
      lastName: "Прізвище",
      phone: "Номер телефону",
      email: "Email",
      whatsapp: "WhatsApp (Необов'язково)",
      telegram: "Telegram (Необов'язково)",
      preferredContact: "Бажаний спосіб зв'язку",
      selectDates: "ВИБРАТИ ДАТИ (НЕОБОВ'ЯЗКОВО)",
      comments: "Опис запиту",
      commentsPlaceholder: "Особливі побажання або додаткова інформація...",
      close: "Закрити",
      send: "Надіслати заявку на бронювання",
      success:
        "Дякуємо за ваш запит на попереднє бронювання. Наша команда Tenerifly проаналізує його і відповість найближчим часом",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      emailError: "Будь ласка, введіть коректну email адресу",
      phoneError:
        "Будь ласка, введіть коректний номер телефону (мінімум 10 цифр)",
      premium: "Преміум сервіс",
      instantResponse: "Миттєва відповідь",
      secureBooking: "Безпечне бронювання",
      next: "Далі",
      back: "Назад",
    },
  
    de: {
      title: "Vorab-Buchung",
      itemName: "Objekt",
      price: "Preis",
      contactInfo: "Kontaktinformationen",
      firstName: "Vorname",
      lastName: "Nachname",
      phone: "Telefonnummer",
      email: "E-Mail",
      whatsapp: "WhatsApp (Optional)",
      telegram: "Telegram (Optional)",
      preferredContact: "Bevorzugte Kontaktmethode",
      selectDates: "DATUM AUSWÄHLEN (OPTIONAL)",
      comments: "Anfragebeschreibung",
      commentsPlaceholder:
        "Besondere Wünsche oder zusätzliche Informationen...",
      close: "Schließen",
      send: "Buchungsanfrage senden",
      success:
        "Vielen Dank für Ihre Vorab-Buchungsanfrage. Unser Tenerifly-Team wird sie analysieren und bald antworten",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "E-Mail",
      emailError: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
      phoneError:
        "Bitte geben Sie eine gültige Telefonnummer ein (mindestens 10 Ziffern)",
      premium: "Premium-Service",
      instantResponse: "Sofortige Antwort",
      secureBooking: "Sichere Buchung",
      next: "Weiter",
      back: "Zurück",
    },
  
    es: {
      title: "Reserva anticipada",
      itemName: "Propiedad",
      price: "Precio",
      contactInfo: "Información de contacto",
      firstName: "Nombre",
      lastName: "Apellido",
      phone: "Número de teléfono",
      email: "Email",
      whatsapp: "WhatsApp (Opcional)",
      telegram: "Telegram (Opcional)",
      preferredContact: "Método de contacto preferido",
      selectDates: "SELECCIONAR FECHAS (OPCIONAL)",
      comments: "Descripción de la solicitud",
      commentsPlaceholder: "Solicitudes especiales o información adicional...",
      close: "Cerrar",
      send: "Enviar solicitud de reserva",
      success:
        "Gracias por su solicitud de reserva anticipada. Nuestro equipo Tenerifly la analizará y responderá pronto",
      whatsappLabel: "WhatsApp",
      telegramLabel: "Telegram",
      emailLabel: "Email",
      emailError: "Por favor, introduzca una dirección de email válida",
      phoneError:
        "Por favor, introduzca un número de teléfono válido (mínimo 10 dígitos)",
      premium: "Servicio Premium",
      instantResponse: "Respuesta Instantánea",
      secureBooking: "Reserva Segura",
      next: "Siguiente",
      back: "Atrás",
    },
  };

  // Select translations based on mode
  const translations =
    mode === "contact" ? contactTranslations : bookingTranslations;

  // Use current locale; fallback to English if locale not in map
  const t = translations[currentLocale] ?? translations.en;

  const handleSend = async () => {
    if (!firstName || !lastName || !phone || !email) return;

    setIsSending(true);

    // Create email message with all booking details
    const emailMessage = `
Новая заявка на бронирование:

${item.name ? `Объект: ${item.name}` : ""}
${item.price ? `Цена: ${item.currency} ${item.price}` : ""}

Контактная информация:
Имя: ${firstName}
Фамилия: ${lastName}
Телефон: ${phone}
Email: ${email}
${whatsapp ? `WhatsApp: ${whatsapp}` : ""}
${telegram ? `Telegram: ${telegram}` : ""}
${preferredContact ? `Предпочтительный способ связи: ${preferredContact}` : ""}

${startDate || endDate ? "Даты:" : ""}
${startDate ? `Дата начала: ${startDate.toLocaleDateString()}` : ""}
${endDate ? `Дата окончания: ${endDate.toLocaleDateString()}` : ""}

${comments ? `Дополнительная информация: ${comments}` : ""}

---
Отправлено с сайта: ${process.env.NEXT_PUBLIC_DOMAIN || "tenerifly.info.com"}
        `.trim();

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email, // User's email as "from"
          contactEmail: item.contactEmail, // Property's contact email
          subject: `New Pre-Book request - ${item.name || "Personalized Request"}`,
          message: emailMessage,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setShowSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          setShowSuccess(false);
          setStep(0);
          onClose();
          // Reset form
          setStartDate(null);
          setEndDate(null);
          setComments("");
          setFirstName("");
          setLastName("");
          setPhone("");
          setEmail("");
          setWhatsapp("");
          setTelegram("");
          setPreferredContact("");
        }, 2000);
      } else {
        console.error("Failed to send email:", data.error);
        // You might want to show an error message here
      }
    } catch (error) {
      console.error("Error sending email:", error);
      // You might want to show an error message here
    } finally {
      setIsSending(false);
    }
  };

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation function
  const isValidPhone = (phone: string) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");
    // Check if it has at least 10 digits (international standard)
    return cleanPhone.length >= 10;
  };

  const isFormValid =
    firstName &&
    lastName &&
    phone &&
    email &&
    isValidEmail(email) &&
    isValidPhone(phone);

  const inputStyles = {
    input: {
      border: "1px solid #e2e8f0",
      borderRadius: "6px",
      fontSize: "14px",
      transition: "all 0.2s",
      "&:focus": { borderColor: "#3182ce", boxShadow: "0 0 0 3px rgba(49, 130, 206, 0.1)" },
    },
    label: { fontWeight: 500, color: "#4a5568", marginBottom: "4px" },
  };

  return (
    <Modal
      opened={opened}
      onClose={() => { setStep(0); onClose(); }}
      title={null}
      size="md"
      centered
      withCloseButton={false}
      styles={{
        body: { padding: 0 },
        content: {
          maxWidth: "min(520px, 95vw)",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)",
          border: "1px solid #e2e8f0",
        },
      }}
    >
      {/* Header with stepper */}
      <Box px="md" pt="md" pb="xs">
        <Group justify="space-between" align="center">
          <Text size="lg" fw={600} c="#1a202c">
            {t.title}
          </Text>
          <Button variant="subtle" color="gray" size="sm" onClick={() => { setStep(0); onClose(); }}>✕</Button>
        </Group>
        <Stepper
          size="xs"
          active={step}
          onStepClick={setStep}
          mt="sm"
          allowNextStepsSelect={false}
          styles={{ stepBody: { display: "none" }, separator: { marginLeft: 4, marginRight: 4 } }}
        >
          <Stepper.Step label={t.contactInfo} />
          <Stepper.Step label={t.selectDates} />
        </Stepper>
      </Box>

      {/* Success state */}
      {showSuccess ? (
        <Box p="xl" py="48px">
          <Stack align="center" gap="md">
            <IconCheck size={48} color="#22c55e" stroke={2.5} />
            <Text size="lg" fw={500} c="#166534" ta="center">
              {t.success}
            </Text>
          </Stack>
        </Box>
      ) : (
        <Box px="md" pb="md">
          {/* Step 0: Contact */}
          {step === 0 && (
            <Stack gap="sm">
              <Group gap="xs" mb={4}>
                <IconMapPin size={16} color="#3182ce" />
                <Text size="sm" fw={500} c="dimmed">{item.name}{item.price ? ` · ${item.price}` : ""}</Text>
              </Group>
              <Group grow>
                <TextInput label={t.firstName} placeholder={t.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} required withAsterisk styles={inputStyles} />
                <TextInput label={t.lastName} placeholder={t.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} required withAsterisk styles={inputStyles} />
              </Group>
              <TextInput label={t.phone} placeholder={t.phone} value={phone} onChange={(e) => setPhone(e.target.value)} required withAsterisk error={phone && !isValidPhone(phone) ? t.phoneError : undefined} styles={inputStyles} />
              <TextInput label={t.email} placeholder={t.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required withAsterisk error={email && !isValidEmail(email) ? t.emailError : undefined} styles={inputStyles} />
              <Group grow>
                <TextInput placeholder={t.whatsapp} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} leftSection={<IconBrandWhatsapp size={16} color="#25D366" />} styles={inputStyles} />
                <TextInput placeholder={t.telegram} value={telegram} onChange={(e) => setTelegram(e.target.value)} leftSection={<IconBrandTelegram size={16} color="#0088cc" />} styles={inputStyles} />
              </Group>
              <Select placeholder={t.preferredContact} value={preferredContact} onChange={(v) => setPreferredContact(v || "")} data={[{ value: "email", label: t.emailLabel }, { value: "whatsapp", label: t.whatsappLabel }, { value: "telegram", label: t.telegramLabel }]} styles={inputStyles} />
              <Group justify="space-between" mt="md">
                <Button variant="subtle" color="gray" onClick={onClose}>{t.close}</Button>
                <Button rightSection={<IconArrowRight size={16} />} onClick={() => setStep(1)} disabled={!isFormValid}>
                  {t.next}
                </Button>
              </Group>
            </Stack>
          )}

          {/* Step 1: Dates & comments */}
          {step === 1 && (
            <Stack gap="sm">
              <Group grow>
                <DateInput
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Start date"
                  leftSection={<IconCalendar size={16} />}
                  clearable
                  valueFormat="DD/MM/YYYY"
                  minDate={new Date()}
                  maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
                  styles={inputStyles}
                />
                <DateInput
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="End date"
                  leftSection={<IconCalendar size={16} />}
                  clearable
                  valueFormat="DD/MM/YYYY"
                  minDate={startDate || new Date()}
                  maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
                  styles={inputStyles}
                />
              </Group>
              <Textarea placeholder={t.commentsPlaceholder} value={comments} onChange={(e) => setComments(e.target.value)} minRows={2} maxRows={3} autosize styles={{ ...inputStyles, input: { ...inputStyles.input, resize: "none" } }} />
              <Group justify="space-between" mt="md">
                <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => setStep(0)}>
                  {t.back}
                </Button>
                <Button leftSection={<IconSend size={16} />} onClick={handleSend} disabled={!isFormValid || isSending} loading={isSending}>
                  {t.send}
                </Button>
              </Group>
            </Stack>
          )}
        </Box>
      )}
    </Modal>
  );
}
