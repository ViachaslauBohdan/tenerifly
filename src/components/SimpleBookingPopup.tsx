"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  Button,
  Stack,
  Group,
  Textarea,
  TextInput,
  Box,
  Alert,
} from "@mantine/core";
import { DatePickerInput, DatesProvider } from "@mantine/dates";
import type { DatesRangeValue } from "@mantine/dates";
import {
  IconSend,
  IconCalendar,
  IconCheck,
  IconMapPin,
} from "@tabler/icons-react";
import type { Locale } from "@/types/locale";
import { dayjsLocale, getDateValueFormat } from "@/lib/dateLocale";
import {
  PhoneNumberInput,
  isPhoneNumberValid,
  type Country,
} from "@/components/PhoneNumberInput";
import type { E164Number } from "libphonenumber-js";
import {gtagReportConversion} from "@/lib/gtag";

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
  const [fullName, setFullName] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<Country | undefined>();
  const [phone, setPhone] = useState<E164Number | undefined>();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    if (opened) {
      setSendError(null);
      setShowSuccess(false);
      setPhoneCountry(undefined);
      setPhone(undefined);
    }
  }, [opened]);

  const contactTranslations = {
    en: {
      title: "Pre-Book",
      itemName: "Property",
      price: "Price",
      contactInfo: "Contact Information",
      fullName: "Full Name",
      phone: "Phone Number",
      email: "Email",
      selectDates: "Rent Period",
      rentPeriodPlaceholder: "Select start and end dates",
      comments: "Request Description",
      commentsPlaceholder: "Any special requests or additional information...",
      close: "Close",
      send: "Send",
      success:
        "Thanks for your contact request. Our Tenerifly team will analyze it and respond soon",
      emailError: "Please enter a valid email address",
      phoneError: "Please select a country and enter a valid phone number",
      premium: "Premium Service",
      instantResponse: "Instant Response",
      secureBooking: "Secure Booking",
      next: "Next",
      back: "Back",
      sendError: "Could not send your request. Please try again or contact us on WhatsApp.",
    },
  
    ru: {
      title: "Предварительное бронирование",
      itemName: "Объект",
      price: "Цена",
      contactInfo: "Контактная информация",
      fullName: "Полное имя",
      phone: "Номер телефона",
      email: "Email",
      selectDates: "Период аренды",
      rentPeriodPlaceholder: "Выберите даты заезда и выезда",
      comments: "Описание запроса",
      commentsPlaceholder: "Особые пожелания или дополнительная информация...",
      close: "Закрыть",
      send: "Отправить",
      success:
        "Спасибо за ваш запрос на связь. Наша команда Tenerifly проанализирует его и ответит в ближайшее время",
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
      fullName: "Imię i nazwisko",
      phone: "Numer telefonu",
      email: "Email",
      selectDates: "Okres wynajmu",
      rentPeriodPlaceholder: "Wybierz daty rozpoczęcia i zakończenia",
      comments: "Opis żądania",
      commentsPlaceholder: "Specjalne życzenia lub dodatkowe informacje...",
      close: "Zamknij",
      send: "Wyślij",
      success:
        "Dziękujemy za Twoją prośbę o kontakt. Nasz zespół Tenerifly przeanalizuje ją i odpowie wkrótce",
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
      fullName: "Nom complet",
      phone: "Numéro de téléphone",
      email: "Email",
      selectDates: "Période de location",
      rentPeriodPlaceholder: "Choisissez les dates d'arrivée et de départ",
      comments: "Description de la demande",
      commentsPlaceholder:
        "Demandes spéciales ou informations supplémentaires...",
      close: "Fermer",
      send: "Envoyer",
      success:
        "Merci pour votre demande de contact. Notre équipe Tenerifly l'analysera et répondra bientôt",
      emailError: "Veuillez saisir une adresse email valide",
      phoneError:
        "Veuillez saisir un numéro de téléphone valide (au moins 10 chiffres)",
      premium: "Service Premium",
      instantResponse: "Réponse Instantanée",
      secureBooking: "Réservation Sécurisée",
      next: "Suivant",
      back: "Retour",
    },
  
    ua: {
      title: "Попереднє бронювання",
      itemName: "Об'єкт",
      price: "Ціна",
      contactInfo: "Контактна інформація",
      fullName: "Повне ім'я",
      phone: "Номер телефону",
      email: "Email",
      selectDates: "Період оренди",
      rentPeriodPlaceholder: "Оберіть дати заїзду та виїзду",
      comments: "Опис запиту",
      commentsPlaceholder: "Особливі побажання або додаткова інформація...",
      close: "Закрити",
      send: "Надіслати",
      success:
        "Дякуємо за ваш запит на зв'язок. Наша команда Tenerifly проаналізує його і відповість найближчим часом",
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
      fullName: "Vollständiger Name",
      phone: "Telefonnummer",
      email: "E-Mail",
      selectDates: "Mietzeitraum",
      rentPeriodPlaceholder: "Start- und Enddatum wählen",
      comments: "Anfragebeschreibung",
      commentsPlaceholder:
        "Besondere Wünsche oder zusätzliche Informationen...",
      close: "Schließen",
      send: "Senden",
      success:
        "Vielen Dank für Ihre Kontaktanfrage. Unser Tenerifly-Team wird sie analysieren und bald antworten",
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
      fullName: "Nombre completo",
      phone: "Número de teléfono",
      email: "Email",
      selectDates: "Período de alquiler",
      rentPeriodPlaceholder: "Seleccione fechas de entrada y salida",
      comments: "Descripción de la solicitud",
      commentsPlaceholder: "Solicitudes especiales o información adicional...",
      close: "Cerrar",
      send: "Enviar",
      success:
        "Gracias por su solicitud de contacto. Nuestro equipo Tenerifly la analizará y responderá pronto",
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
      fullName: "Full Name",
      phone: "Phone Number",
      email: "Email",
      selectDates: "Rent Period",
      rentPeriodPlaceholder: "Select start and end dates",
      comments: "Request Description",
      commentsPlaceholder: "Any special requests or additional information...",
      close: "Close",
      send: "Pre-book",
      success:
        "Thanks for your pre-booking request. Our Tenerifly team will analyze it and respond soon",
      emailError: "Please enter a valid email address",
      phoneError: "Please select a country and enter a valid phone number",
      premium: "Premium Service",
      instantResponse: "Instant Response",
      secureBooking: "Secure Booking",
      next: "Next",
      back: "Back",
      sendError: "Could not send your request. Please try again or contact us on WhatsApp.",
    },
  
    ru: {
      title: "Предварительное бронирование",
      itemName: "Объект",
      price: "Цена",
      contactInfo: "Контактная информация",
      fullName: "Полное имя",
      phone: "Номер телефона",
      email: "Email",
      selectDates: "Период аренды",
      rentPeriodPlaceholder: "Выберите даты заезда и выезда",
      comments: "Описание запроса",
      commentsPlaceholder: "Особые пожелания или дополнительная информация...",
      close: "Закрыть",
      send: "Забронировать",
      success:
        "Спасибо за ваш запрос на предварительное бронирование. Наша команда Tenerifly проанализирует его и ответит в ближайшее время",
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
      fullName: "Imię i nazwisko",
      phone: "Numer telefonu",
      email: "Email",
      selectDates: "Okres wynajmu",
      rentPeriodPlaceholder: "Wybierz daty rozpoczęcia i zakończenia",
      comments: "Opis żądania",
      commentsPlaceholder: "Specjalne życzenia lub dodatkowe informacje...",
      close: "Zamknij",
      send: "Rezerwuj",
      success:
        "Dziękujemy za Twoją prośbę o przedwstępną rezerwację. Nasz zespół Tenerifly przeanalizuje ją i odpowie wkrótce",
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
      fullName: "Nom complet",
      phone: "Numéro de téléphone",
      email: "Email",
      selectDates: "Période de location",
      rentPeriodPlaceholder: "Choisissez les dates d'arrivée et de départ",
      comments: "Description de la demande",
      commentsPlaceholder:
        "Demandes spéciales ou informations supplémentaires...",
      close: "Fermer",
      send: "Réserver",
      success:
        "Merci pour votre demande de pré-réservation. Notre équipe Tenerifly l'analysera et répondra bientôt",
      emailError: "Veuillez saisir une adresse email valide",
      phoneError:
        "Veuillez saisir un numéro de téléphone valide (au moins 10 chiffres)",
      premium: "Service Premium",
      instantResponse: "Réponse Instantanée",
      secureBooking: "Réservation Sécurisée",
      next: "Suivant",
      back: "Retour",
    },
  
    ua: {
      title: "Попереднє бронювання",
      itemName: "Об'єкт",
      price: "Ціна",
      contactInfo: "Контактна інформація",
      fullName: "Повне ім'я",
      phone: "Номер телефону",
      email: "Email",
      selectDates: "Період оренди",
      rentPeriodPlaceholder: "Оберіть дати заїзду та виїзду",
      comments: "Опис запиту",
      commentsPlaceholder: "Особливі побажання або додаткова інформація...",
      close: "Закрити",
      send: "Забронювати",
      success:
        "Дякуємо за ваш запит на попереднє бронювання. Наша команда Tenerifly проаналізує його і відповість найближчим часом",
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
      fullName: "Vollständiger Name",
      phone: "Telefonnummer",
      email: "E-Mail",
      selectDates: "Mietzeitraum",
      rentPeriodPlaceholder: "Start- und Enddatum wählen",
      comments: "Anfragebeschreibung",
      commentsPlaceholder:
        "Besondere Wünsche oder zusätzliche Informationen...",
      close: "Schließen",
      send: "Buchen",
      success:
        "Vielen Dank für Ihre Vorab-Buchungsanfrage. Unser Tenerifly-Team wird sie analysieren und bald antworten",
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
      fullName: "Nombre completo",
      phone: "Número de teléfono",
      email: "Email",
      selectDates: "Período de alquiler",
      rentPeriodPlaceholder: "Seleccione fechas de entrada y salida",
      comments: "Descripción de la solicitud",
      commentsPlaceholder: "Solicitudes especiales o información adicional...",
      close: "Cerrar",
      send: "Reservar",
      success:
        "Gracias por su solicitud de reserva anticipada. Nuestro equipo Tenerifly la analizará y responderá pronto",
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
    if (!isFormValid) return;

    setIsSending(true);
    setSendError(null);

    // Create email message with all booking details
    const emailMessage = `
Новая заявка на бронирование:

${item.name ? `Объект: ${item.name}` : ""}
${item.price ? `Цена: ${item.price}` : ""}

Контактная информация:
Имя: ${fullName}
Телефон: ${phone ?? ""}
Email: ${email}

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
          setFullName("");
          setPhone(undefined);
          setPhoneCountry(undefined);
          setEmail("");
          gtagReportConversion();
        }, 2000);
      } else {
        console.error("Failed to send email:", data.error);
        const errMsg =
          typeof data.error === "string"
            ? data.error
            : data.error?.message ?? data.error?.error;
        setSendError(errMsg || bookingTranslations.en.sendError);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setSendError(bookingTranslations.en.sendError);
    } finally {
      setIsSending(false);
    }
  };

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const phoneIsValid = isPhoneNumberValid(phoneCountry, phone);

  const isFormValid =
    fullName &&
    phone &&
    phoneCountry &&
    email &&
    isValidEmail(email) &&
    phoneIsValid;

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
      onClose={onClose}
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
      <Box px="md" pt="md" pb="xs">
        <Group justify="space-between" align="center">
          <Text size="lg" fw={600} c="#1a202c">
            {t.title}
          </Text>
          <Button variant="subtle" color="gray" size="sm" onClick={onClose}>
            ✕
          </Button>
        </Group>
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
          <Stack gap="sm">
            <Group gap="xs" mb={4}>
              <IconMapPin size={16} color="#3182ce" />
              <Text size="sm" fw={500} c="dimmed">
                {item.name}
                {item.price ? ` · ${item.price}` : ""}
              </Text>
            </Group>
            <TextInput
              label={t.fullName}
              placeholder={t.fullName}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              withAsterisk
              styles={inputStyles}
            />
            <PhoneNumberInput
              label={t.phone}
              required
              country={phoneCountry}
              value={phone}
              onCountryChange={setPhoneCountry}
              onChange={setPhone}
              placeholder="612 345 678"
              error={
                (phone || phoneCountry) && !phoneIsValid
                  ? t.phoneError
                  : undefined
              }
              styles={inputStyles}
            />
            <TextInput
              label={t.email}
              placeholder={t.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              withAsterisk
              error={email && !isValidEmail(email) ? t.emailError : undefined}
              styles={inputStyles}
            />
            <DatesProvider
              settings={{
                locale: dayjsLocale(currentLocale),
                firstDayOfWeek: 1,
                weekendDays: [0, 6],
              }}
            >
              <DatePickerInput
                type="range"
                label={t.selectDates}
                placeholder={t.rentPeriodPlaceholder}
                value={[startDate, endDate]}
                onChange={(range: DatesRangeValue) => {
                  const [start, end] = range ?? [null, null];
                  setStartDate(start);
                  setEndDate(end);
                }}
                leftSection={<IconCalendar size={16} />}
                clearable
                allowSingleDateInRange
                numberOfColumns={2}
                valueFormat={getDateValueFormat(currentLocale)}
                minDate={new Date()}
                maxDate={
                  new Date(new Date().getFullYear() + 1, 11, 31)
                }
                popoverProps={{ withinPortal: true, zIndex: 400 }}
                styles={inputStyles}
              />
            </DatesProvider>
            <Textarea
              label={t.comments}
              placeholder={t.commentsPlaceholder}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              minRows={2}
              maxRows={3}
              autosize
              styles={{
                ...inputStyles,
                input: { ...inputStyles.input, resize: "none" },
              }}
            />
            {sendError && (
              <Alert color="red" variant="light">
                {sendError}
              </Alert>
            )}
            <Group justify="space-between" mt="md">
              <Button variant="subtle" color="gray" onClick={onClose}>
                {t.close}
              </Button>
              <Button
                type="button"
                className={"test-book"}
                leftSection={<IconSend size={16} />}
                onClick={handleSend}
                disabled={!isFormValid || isSending}
                loading={isSending}
              >
                {t.send}
              </Button>
            </Group>
          </Stack>
        </Box>
      )}
    </Modal>
  );
}
