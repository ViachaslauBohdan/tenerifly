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
  Badge,
  Divider,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconMessage,
  IconSend,
  IconCalendar,
  IconHome,
  IconUser,
  IconPhone,
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconCheck,
  IconStar,
  IconClock,
  IconMapPin,
} from "@tabler/icons-react";
import { openBookingWhatsApp } from "../utils/whatsapp";

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
}

export function SimpleBookingPopup({
  opened,
  onClose,
  item,
  mode = "booking",
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

  const contactTranslations = {
    en: {
      title: "Contact",
      itemName: "Property",
      price: "Price",
      contactInfo: "Contact Information",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      email: "Email (Optional)",
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
    },
    ru: {
      title: "Связаться",
      itemName: "Объект",
      price: "Цена",
      contactInfo: "Контактная информация",
      firstName: "Имя",
      lastName: "Фамилия",
      phone: "Номер телефона",
      email: "Email (Необязательно)",
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
    },
    pl: {
      title: "Kontakt",
      itemName: "Nieruchomość",
      price: "Cena",
      contactInfo: "Informacje kontaktowe",
      firstName: "Imię",
      lastName: "Nazwisko",
      phone: "Numer telefonu",
      email: "Email (Opcjonalnie)",
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
    },
    fr: {
      title: "Contact",
      itemName: "Propriété",
      price: "Prix",
      contactInfo: "Informations de contact",
      firstName: "Prénom",
      lastName: "Nom de famille",
      phone: "Numéro de téléphone",
      email: "Email (Optionnel)",
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
    },
    uk: {
      title: "Зв'язатися",
      itemName: "Об'єкт",
      price: "Ціна",
      contactInfo: "Контактна інформація",
      firstName: "Ім'я",
      lastName: "Прізвище",
      phone: "Номер телефону",
      email: "Email (Необов'язково)",
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
    },
    de: {
      title: "Kontakt",
      itemName: "Objekt",
      price: "Preis",
      contactInfo: "Kontaktinformationen",
      firstName: "Vorname",
      lastName: "Nachname",
      phone: "Telefonnummer",
      email: "E-Mail (Optional)",
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
    },
    es: {
      title: "Contactar",
      itemName: "Propiedad",
      price: "Precio",
      contactInfo: "Información de contacto",
      firstName: "Nombre",
      lastName: "Apellido",
      phone: "Número de teléfono",
      email: "Email (Opcional)",
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
      email: "Email (Optional)",
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
    },
    ru: {
      title: "Предварительное бронирование",
      itemName: "Объект",
      price: "Цена",
      contactInfo: "Контактная информация",
      firstName: "Имя",
      lastName: "Фамилия",
      phone: "Номер телефона",
      email: "Email (Необязательно)",
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
    },
    pl: {
      title: "Przedwstępna rezerwacja",
      itemName: "Nieruchomość",
      price: "Cena",
      contactInfo: "Informacje kontaktowe",
      firstName: "Imię",
      lastName: "Nazwisko",
      phone: "Numer telefonu",
      email: "Email (Opcjonalnie)",
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
    },
    fr: {
      title: "Pré-réserver",
      itemName: "Propriété",
      price: "Prix",
      contactInfo: "Informations de contact",
      firstName: "Prénom",
      lastName: "Nom de famille",
      phone: "Numéro de téléphone",
      email: "Email (Optionnel)",
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
    },
    uk: {
      title: "Попереднє бронювання",
      itemName: "Об'єкт",
      price: "Ціна",
      contactInfo: "Контактна інформація",
      firstName: "Ім'я",
      lastName: "Прізвище",
      phone: "Номер телефону",
      email: "Email (Необов'язково)",
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
    },
    de: {
      title: "Vorab-Buchung",
      itemName: "Objekt",
      price: "Preis",
      contactInfo: "Kontaktinformationen",
      firstName: "Vorname",
      lastName: "Nachname",
      phone: "Telefonnummer",
      email: "E-Mail (Optional)",
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
    },
    es: {
      title: "Reserva anticipada",
      itemName: "Propiedad",
      price: "Precio",
      contactInfo: "Información de contacto",
      firstName: "Nombre",
      lastName: "Apellido",
      phone: "Número de teléfono",
      email: "Email (Opcional)",
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
    },
  };

  // Select translations based on mode
  const translations =
    mode === "contact" ? contactTranslations : bookingTranslations;

  // Default to English for now - you can add language detection logic
  const t = translations.en;

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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={null}
      size="xl"
      centered
      fullScreen={false}
      withCloseButton={false}
      styles={{
        body: {
          padding: 0,
          maxHeight: "90vh",
          overflowY: "auto",
        },
        content: {
          maxWidth: "95vw",
          width: "700px",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0",
        },
      }}
    >
      {/* Clean Header */}
      <div
        style={{
          background: "#f8fafc",
          padding: "24px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconHome size={24} color="#3182ce" />
            <div>
              <Text size="xl" fw={600} c="#1a202c">
                {t.title}
              </Text>
              <Text size="sm" c="#64748b">
                Complete your booking request
              </Text>
            </div>
          </Group>

          <Button
            variant="subtle"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              width: "32px",
              height: "32px",
              padding: 0,
              minWidth: "auto",
              color: "#64748b",
            }}
          >
            ✕
          </Button>
        </Group>
      </div>

      {/* Main Content */}
      <div style={{ padding: "24px" }}>
        <Stack gap="lg">
          {/* Item Info Card */}
          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Group gap="xs" mb="sm">
              <IconMapPin size={18} color="#3182ce" />
              <Text
                size="sm"
                fw={600}
                c="#4a5568"
                tt="uppercase"
                style={{ letterSpacing: "0.05em" }}
              >
                {t.itemName}
              </Text>
            </Group>
            <Text size="lg" fw={600} c="#1a202c" mb="xs">
              {item.name}
            </Text>
            {item.price && (
              <Text size="md" fw={500} c="#3182ce">
                {item.price}
              </Text>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <Group gap="xs" mb="md">
              <IconUser size={18} color="#3182ce" />
              <Text size="md" fw={600} c="#1a202c">
                {t.contactInfo}
              </Text>
            </Group>

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <Stack gap="md">
                <Group grow>
                  <TextInput
                    leftSection={<IconUser size={16} color="#64748b" />}
                    placeholder="First Name"
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    withAsterisk
                    styles={{
                      input: {
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        fontSize: "14px",
                        transition: "all 0.2s",
                        "&:focus": {
                          borderColor: "#3182ce",
                          boxShadow: "0 0 0 3px rgba(49, 130, 206, 0.1)",
                        },
                      },
                      label: {
                        fontWeight: 500,
                        color: "#4a5568",
                        marginBottom: "6px",
                      },
                    }}
                  />
                  <TextInput
                    leftSection={<IconUser size={16} color="#64748b" />}
                    placeholder="Last Name"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    withAsterisk
                    styles={{
                      input: {
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        fontSize: "14px",
                        transition: "all 0.2s",
                        "&:focus": {
                          borderColor: "#3182ce",
                          boxShadow: "0 0 0 3px rgba(49, 130, 206, 0.1)",
                        },
                      },
                      label: {
                        fontWeight: 500,
                        color: "#4a5568",
                        marginBottom: "6px",
                      },
                    }}
                  />
                </Group>
                <TextInput
                  leftSection={<IconPhone size={16} color="#64748b" />}
                  placeholder="Phone Number"
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  withAsterisk
                  error={
                    phone && !isValidPhone(phone) ? t.phoneError : undefined
                  }
                  styles={{
                    input: {
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "14px",
                      transition: "all 0.2s",
                      "&:focus": {
                        borderColor: "#3182ce",
                        boxShadow: "0 0 0 3px rgba(49, 130, 206, 0.1)",
                      },
                    },
                    label: {
                      fontWeight: 500,
                      color: "#4a5568",
                      marginBottom: "6px",
                    },
                  }}
                />
                <TextInput
                  leftSection={<IconMessage size={16} color="#64748b" />}
                  placeholder="Email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  withAsterisk
                  error={
                    email && !isValidEmail(email) ? t.emailError : undefined
                  }
                  styles={{
                    input: {
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "14px",
                      transition: "all 0.2s",
                      "&:focus": {
                        borderColor: "#3182ce",
                        boxShadow: "0 0 0 3px rgba(49, 130, 206, 0.1)",
                      },
                    },
                    label: {
                      fontWeight: 500,
                      color: "#4a5568",
                      marginBottom: "6px",
                    },
                  }}
                />
                <Group grow>
                  <TextInput
                    leftSection={
                      <IconBrandWhatsapp size={16} color="#25D366" />
                    }
                    placeholder={t.whatsapp}
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    styles={{
                      input: {
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        fontSize: "14px",
                        transition: "all 0.2s",
                        "&:focus": {
                          borderColor: "#25D366",
                          boxShadow: "0 0 0 3px rgba(37, 211, 102, 0.1)",
                        },
                      },
                    }}
                  />
                  <TextInput
                    leftSection={
                      <IconBrandTelegram size={16} color="#0088cc" />
                    }
                    placeholder={t.telegram}
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    styles={{
                      input: {
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        fontSize: "14px",
                        transition: "all 0.2s",
                        "&:focus": {
                          borderColor: "#0088cc",
                          boxShadow: "0 0 0 3px rgba(0, 136, 204, 0.1)",
                        },
                      },
                    }}
                  />
                </Group>
                <Select
                  leftSection={<IconMessage size={16} color="#64748b" />}
                  placeholder={t.preferredContact}
                  value={preferredContact}
                  onChange={(value) => setPreferredContact(value || "")}
                  data={[
                    { value: "email", label: t.emailLabel },
                    { value: "whatsapp", label: t.whatsappLabel },
                    { value: "telegram", label: t.telegramLabel },
                  ]}
                  styles={{
                    input: {
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "14px",
                      transition: "all 0.2s",
                      "&:focus": {
                        borderColor: "#3182ce",
                        boxShadow: "0 0 0 3px rgba(49, 130, 206, 0.1)",
                      },
                    },
                  }}
                />
              </Stack>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <Group gap="xs" mb="md">
              <IconCalendar size={18} color="#3182ce" />
              <Text size="md" fw={600} c="#1a202c">
                {t.selectDates}
              </Text>
            </Group>

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <Group grow>
                <DateInput
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Start date"
                  leftSection={<IconCalendar size={16} color="#64748b" />}
                  clearable
                  styles={{
                    input: {
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "14px",
                      transition: "all 0.2s",
                      "&:focus": {
                        borderColor: "#3182ce",
                        boxShadow: "0 0 0 3px rgba(49, 130, 206, 0.1)",
                      },
                    },
                  }}
                />
                <DateInput
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="End date"
                  leftSection={<IconCalendar size={16} color="#64748b" />}
                  clearable
                  styles={{
                    input: {
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      fontSize: "14px",
                      transition: "all 0.2s",
                      "&:focus": {
                        borderColor: "#3182ce",
                        boxShadow: "0 0 0 3px rgba(49, 130, 206, 0.1)",
                      },
                    },
                  }}
                />
              </Group>
            </div>
          </div>

          {/* Comments */}
          <div>
            <Group gap="xs" mb="md">
              <IconMessage size={18} color="#3182ce" />
              <Text size="md" fw={600} c="#1a202c">
                {t.comments}
              </Text>
            </Group>

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <Textarea
                placeholder={t.commentsPlaceholder}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                styles={{
                  input: {
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "all 0.2s",
                    resize: "none",
                    "&:focus": {
                      borderColor: "#3182ce",
                      boxShadow: "0 0 0 3px rgba(49, 130, 206, 0.1)",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div
              style={{
                background: "#f0fff4",
                border: "1px solid #9ae6b4",
                borderRadius: "6px",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <Group justify="center" gap="xs" mb="xs">
                <IconCheck size={18} color="#25D366" />
                <Text c="#22543d" fw={500}>
                  {t.success}
                </Text>
              </Group>
            </div>
          )}

          {/* Action Buttons */}
          <Group justify="space-between" gap="md">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSending}
              size="md"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontWeight: 500,
                color: "#4a5568",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "#3182ce",
                  color: "#3182ce",
                  background: "rgba(49, 130, 206, 0.05)",
                },
              }}
            >
              {t.close}
            </Button>
            <Button
              leftSection={<IconSend size={16} />}
              onClick={handleSend}
              disabled={!isFormValid || isSending}
              loading={isSending}
              size="md"
              style={{
                background: "#3182ce",
                color: "white",
                borderRadius: "6px",
                fontWeight: 500,
                border: "none",
                transition: "all 0.2s",
                "&:hover": {
                  background: "#2c5aa0",
                },
                "&:disabled": {
                  background: "#cbd5e0",
                },
              }}
            >
              {t.send}
            </Button>
          </Group>
        </Stack>
      </div>
    </Modal>
  );
}
