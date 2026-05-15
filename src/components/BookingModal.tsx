import React, { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  Button,
  Stack,
  Group,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCalendar, IconMessage, IconSend } from "@tabler/icons-react";
import { openWhatsApp } from "@/utils/whatsapp";
import { Locale } from "@/types/locale";

interface BookingModalProps {
  opened: boolean;
  onClose: () => void;
  itemType: "accommodation" | "car" | "excursion";
  title: string;
  price?: string;
  currentLocale: Locale;
  // Additional details for different item types
  brand?: string;
  model?: string;
  duration?: string;
  language?: string;
}

const translations = {
  en: {
    title: "Book Now",
    apartmentName: "Apartment Name",
    selectDates: "Select Dates",
    comments: "Comments (optional)",
    commentsPlaceholder: "Add any special requests or questions...",
    send: "Send Booking Request",
    agentResponse: "The agent will respond soon",
    close: "Close",
  },
  ru: {
    title: "Забронировать",
    apartmentName: "Название апартаментов",
    selectDates: "Выберите даты",
    comments: "Комментарии (необязательно)",
    commentsPlaceholder: "Добавьте особые пожелания или вопросы...",
    send: "Отправить запрос на бронирование",
    agentResponse: "Агент ответит в ближайшее время",
    close: "Закрыть",
  },
  pl: {
    title: "Zarezerwuj",
    apartmentName: "Nazwa apartamentu",
    selectDates: "Wybierz daty",
    comments: "Komentarze (opcjonalnie)",
    commentsPlaceholder: "Dodaj specjalne życzenia lub pytania...",
    send: "Wyślij prośbę o rezerwację",
    agentResponse: "Agent odpowie wkrótce",
    close: "Zamknij",
  },
  fr: {
    title: "Réserver",
    apartmentName: "Nom de l'appartement",
    selectDates: "Sélectionner les dates",
    comments: "Commentaires (optionnel)",
    commentsPlaceholder: "Ajoutez des demandes spéciales ou des questions...",
    send: "Envoyer la demande de réservation",
    agentResponse: "L'agent répondra bientôt",
    close: "Fermer",
  },
  ua: {
    title: "Забронювати",
    apartmentName: "Назва апартаментів",
    selectDates: "Виберіть дати",
    comments: "Коментарі (необов'язково)",
    commentsPlaceholder: "Додайте особливі побажання або питання...",
    send: "Надіслати запит на бронювання",
    agentResponse: "Агент відповість найближчим часом",
    close: "Закрити",
  },
  de: {
    title: "Jetzt buchen",
    apartmentName: "Apartment Name",
    selectDates: "Daten auswählen",
    comments: "Kommentare (optional)",
    commentsPlaceholder: "Fügen Sie besondere Wünsche oder Fragen hinzu...",
    send: "Buchungsanfrage senden",
    agentResponse: "Der Agent antwortet bald",
    close: "Schließen",
  },
  es: {
    title: "Reservar ahora",
    apartmentName: "Nombre del apartamento",
    selectDates: "Seleccionar fechas",
    comments: "Comentarios (opcional)",
    commentsPlaceholder: "Añade peticiones especiales o preguntas...",
    send: "Enviar solicitud de reserva",
    agentResponse: "El agente responderá pronto",
    close: "Cerrar",
  },
};

export function BookingModal({
  opened,
  onClose,
  itemType,
  title,
  price,
  currentLocale,
  brand,
  model,
  duration,
  language,
}: BookingModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [comments, setComments] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const t = translations[currentLocale] || translations.en;

  const handleSend = () => {
    setIsSending(true);

    // Prepare the message with booking details
    const bookingDetails = {
      title,
      price,
      brand,
      model,
      duration,
      language,
      dateRange:
        startDate && endDate
          ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
          : "Dates not selected",
      comments,
    };

    // Create a custom message for booking
    const message = createBookingMessage(bookingDetails, currentLocale);

    // Send to WhatsApp
    const phoneNumber = "+34656641433";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    // Show success message
    setShowSuccess(true);
    setIsSending(false);

    // Close modal after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      // Reset form
      setStartDate(null);
      setEndDate(null);
      setComments("");
    }, 2000);
  };

  const createBookingMessage = (details: any, locale: Locale) => {
    const baseMessage = `Hi! I would like to book "${details.title}"`;

    let message = baseMessage;

    if (details.price) {
      message += ` for ${details.price}`;
    }

    if (details.dateRange && details.dateRange !== "Dates not selected") {
      message += `\nDates: ${details.dateRange}`;
    }

    if (details.comments) {
      message += `\nComments: ${details.comments}`;
    }

    // Add referral code if available
    if (typeof window !== "undefined") {
      const refCode = localStorage.getItem("ref_code");
      if (refCode) {
        message += `\nRef: ${refCode}`;
      }
    }

    return message;
  };

  if (showSuccess) {
    return (
      <Modal opened={opened} onClose={onClose} title={t.title} size="sm">
        <Stack align="center" py="xl">
          <Text size="lg" fw={600} c="green">
            ✅ {t.agentResponse}
          </Text>
        </Stack>
      </Modal>
    );
  }

  return (
    <Modal opened={opened} onClose={onClose} title={t.title} size="md" centered>
      <Stack gap="md">
        {/* Item Name */}
        <div>
          <Text size="sm" fw={500} c="dimmed" mb={4}>
            {t.apartmentName}
          </Text>
          <Text size="lg" fw={600}>
            {title}
          </Text>
          {price && (
            <Text size="md" c="blue" fw={500}>
              {price}
            </Text>
          )}
        </div>

        {/* Date Range Picker */}
        <div>
          <Text size="sm" fw={500} c="dimmed" mb={4}>
            {t.selectDates}
          </Text>
          <Group grow>
            <DateInput
              value={startDate}
              onChange={setStartDate}
              placeholder="Start date"
              leftSection={<IconCalendar size={16} />}
              clearable
            />
            <DateInput
              value={endDate}
              onChange={setEndDate}
              placeholder="End date"
              leftSection={<IconCalendar size={16} />}
              clearable
            />
          </Group>
        </div>

        {/* Comments Section */}
        <div>
          <Text size="sm" fw={500} c="dimmed" mb={4}>
            {t.comments}
          </Text>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.currentTarget.value)}
            placeholder={t.commentsPlaceholder}
            leftSection={<IconMessage size={16} />}
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>
            {t.close}
          </Button>
          <Button
            onClick={handleSend}
            loading={isSending}
            leftSection={<IconSend size={16} />}
            color="green"
          >
            {t.send}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
