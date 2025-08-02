import React, { useState } from 'react';
import { Modal, Text, Button, Stack, Group, Textarea, TextInput, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconMessage, IconSend, IconCalendar, IconHome, IconUser, IconPhone, IconBrandWhatsapp, IconBrandTelegram } from '@tabler/icons-react';
import { openBookingWhatsApp } from '../utils/whatsapp';

interface SimpleBookingPopupProps {
    opened: boolean;
    onClose: () => void;
    item: {
        name: string;
        price?: string;
        currency?: string;
    };
}

export function SimpleBookingPopup({ opened, onClose, item }: SimpleBookingPopupProps) {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [comments, setComments] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [telegram, setTelegram] = useState('');
    const [preferredContact, setPreferredContact] = useState<string>('');
    const [isSending, setIsSending] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const translations = {
        en: {
            title: 'Pre-book',
            itemName: '',
            price: 'Price',
            contactInfo: 'Contact Information',
            firstName: 'First Name',
            lastName: 'Last Name',
            phone: 'Phone Number',
            email: 'Email (Optional)',
            whatsapp: 'WhatsApp (Optional)',
            telegram: 'Telegram (Optional)',
            preferredContact: 'Preferred contact',
            selectDates: 'SELECT DATES',
            comments: 'Request Description',
            commentsPlaceholder: 'Any special requests or additional information...',
            close: 'Close',
            send: 'Send Booking Request',
            success: 'The agent will respond soon',
            whatsappLabel: 'WhatsApp',
            telegramLabel: 'Telegram',
            emailLabel: 'Email',
            emailError: 'Please enter a valid email address',
            phoneError: 'Please enter a valid phone number (at least 10 digits)'
        },
        ru: {
            title: 'Предварительное бронирование',
            itemName: '',
            price: 'Цена',
            contactInfo: 'Контактная информация',
            firstName: 'Имя',
            lastName: 'Фамилия',
            phone: 'Номер телефона',
            email: 'Email (Необязательно)',
            whatsapp: 'WhatsApp (Необязательно)',
            telegram: 'Telegram (Необязательно)',
            preferredContact: 'Предпочтительный способ связи',
            selectDates: 'ВЫБРАТЬ ДАТЫ (НЕОБЯЗАТЕЛЬНО)',
            comments: 'Описание запроса',
            commentsPlaceholder: 'Особые пожелания или дополнительная информация...',
            close: 'Закрыть',
            send: 'Отправить заявку на бронирование',
            success: 'Агент ответит в ближайшее время',
            whatsappLabel: 'WhatsApp',
            telegramLabel: 'Telegram',
            emailLabel: 'Email',
            emailError: 'Пожалуйста, введите корректный email адрес',
            phoneError: 'Пожалуйста, введите корректный номер телефона (минимум 10 цифр)'
        },
        pl: {
            title: 'Przedwstępna rezerwacja',
            itemName: '',
            price: 'Cena',
            contactInfo: 'Informacje kontaktowe',
            firstName: 'Imię',
            lastName: 'Nazwisko',
            phone: 'Numer telefonu',
            email: 'Email (Opcjonalnie)',
            whatsapp: 'WhatsApp (Opcjonalnie)',
            telegram: 'Telegram (Opcjonalnie)',
            preferredContact: 'Preferowana metoda kontaktu',
            selectDates: 'WYBIERZ DATY (OPCJONALNIE)',
            comments: 'Opis żądania',
            commentsPlaceholder: 'Specjalne życzenia lub dodatkowe informacje...',
            close: 'Zamknij',
            send: 'Wyślij prośbę o rezerwację',
            success: 'Agent odpowie wkrótce',
            whatsappLabel: 'WhatsApp',
            telegramLabel: 'Telegram',
            emailLabel: 'Email',
            emailError: 'Proszę wprowadzić poprawny adres email',
            phoneError: 'Proszę wprowadzić poprawny numer telefonu (co najmniej 10 cyfr)'
        },
        fr: {
            title: 'Pré-réserver',
            itemName: '',
            price: 'Prix',
            contactInfo: 'Informations de contact',
            firstName: 'Prénom',
            lastName: 'Nom de famille',
            phone: 'Numéro de téléphone',
            email: 'Email (Optionnel)',
            whatsapp: 'WhatsApp (Optionnel)',
            telegram: 'Telegram (Optionnel)',
            preferredContact: 'Méthode de contact préférée',
            selectDates: 'SÉLECTIONNER LES DATES (OPTIONNEL)',
            comments: 'Description de la demande',
            commentsPlaceholder: 'Demandes spéciales ou informations supplémentaires...',
            close: 'Fermer',
            send: 'Envoyer la demande de réservation',
            success: 'L\'agent répondra bientôt',
            whatsappLabel: 'WhatsApp',
            telegramLabel: 'Telegram',
            emailLabel: 'Email',
            emailError: 'Veuillez saisir une adresse email valide',
            phoneError: 'Veuillez saisir un numéro de téléphone valide (au moins 10 chiffres)'
        },
        uk: {
            title: 'Попереднє бронювання',
            itemName: '',
            price: 'Ціна',
            contactInfo: 'Контактна інформація',
            firstName: 'Ім\'я',
            lastName: 'Прізвище',
            phone: 'Номер телефону',
            email: 'Email (Необов\'язково)',
            whatsapp: 'WhatsApp (Необов\'язково)',
            telegram: 'Telegram (Необов\'язково)',
            preferredContact: 'Бажаний спосіб зв\'язку',
            selectDates: 'ВИБРАТИ ДАТИ (НЕОБОВ\'ЯЗКОВО)',
            comments: 'Опис запиту',
            commentsPlaceholder: 'Особливі побажання або додаткова інформація...',
            close: 'Закрити',
            send: 'Надіслати заявку на бронювання',
            success: 'Агент відповість найближчим часом',
            whatsappLabel: 'WhatsApp',
            telegramLabel: 'Telegram',
            emailLabel: 'Email',
            emailError: 'Будь ласка, введіть коректну email адресу',
            phoneError: 'Будь ласка, введіть коректний номер телефону (мінімум 10 цифр)'
        }
    };

    // Default to English for now - you can add language detection logic
    const t = translations.en;

    const handleSend = async () => {
        if (!firstName || !lastName || !phone || !email) return;

        setIsSending(true);

        // Create email message with all booking details
        const emailMessage = `
Новая заявка на бронирование:

${item.name ? `Объект: ${item.name}` : ''}
${item.price ? `Цена: ${item.currency} ${item.price}` : ''}

Контактная информация:
Имя: ${firstName}
Фамилия: ${lastName}
Телефон: ${phone}
Email: ${email}
${whatsapp ? `WhatsApp: ${whatsapp}` : ''}
${telegram ? `Telegram: ${telegram}` : ''}
${preferredContact ? `Предпочтительный способ связи: ${preferredContact}` : ''}

${startDate || endDate ? 'Даты:' : ''}
${startDate ? `Дата начала: ${startDate.toLocaleDateString()}` : ''}
${endDate ? `Дата окончания: ${endDate.toLocaleDateString()}` : ''}

${comments ? `Дополнительная информация: ${comments}` : ''}

---
Отправлено с сайта: ${process.env.NEXT_PUBLIC_DOMAIN || 'tenerifly.info.com'}
        `.trim();

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email, // User's email as "from"
                    subject: `New Pre-Book request - ${item.name || 'Personalized Request'}`,
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
                    setComments('');
                    setFirstName('');
                    setLastName('');
                    setPhone('');
                    setEmail('');
                    setWhatsapp('');
                    setTelegram('');
                    setPreferredContact('');
                }, 2000);
            } else {
                console.error('Failed to send email:', data.error);
                // You might want to show an error message here
            }
        } catch (error) {
            console.error('Error sending email:', error);
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
        const cleanPhone = phone.replace(/\D/g, '');
        // Check if it has at least 10 digits (international standard)
        return cleanPhone.length >= 10;
    };

    const isFormValid = firstName && lastName && phone && email && isValidEmail(email) && isValidPhone(phone);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group gap="xs">
                    <IconHome size={20} color="#3182ce" />
                    <Text fw={600} size="lg">{t.title}</Text>
                </Group>
            }
            size="lg"
            centered
            fullScreen={false}
            styles={{
                title: { flex: 1 },
                header: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
                body: {
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    padding: '20px'
                },
                content: {
                    maxWidth: '90vw',
                    width: '600px'
                }
            }}
        >
            <Stack gap="md">
                {/* Item Info */}
                <div style={{
                    backgroundColor: '#f7fafc',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                }}>
                    <Text size="sm" fw={600} c="#4a5568" tt="uppercase" style={{ letterSpacing: '0.05em' }} mb="xs">
                        {t.itemName}
                    </Text>
                    <Text size="lg" fw={600} c="#1a202c">{item.name}</Text>
                    {item.price && (
                        <Text size="md" c="#2d3748" mt="xs">
                            {item.currency} {item.price}
                        </Text>
                    )}
                </div>

                {/* Contact Information */}
                <div>
                    <Group gap="xs" mb="sm">
                        <IconUser size={20} color="#3182ce" />
                        <Text size="sm" fw={600} c="#4a5568" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
                            {t.contactInfo}
                        </Text>
                    </Group>
                    <Stack gap="sm">
                        <Group grow>
                            <TextInput
                                leftSection={<IconUser size={16} />}
                                placeholder="First Name"
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                withAsterisk
                            />
                            <TextInput
                                leftSection={<IconUser size={16} />}
                                placeholder="Last Name"
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                withAsterisk
                            />
                        </Group>
                        <TextInput
                            leftSection={<IconPhone size={16} />}
                            placeholder="Phone Number"
                            label="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            withAsterisk
                            error={phone && !isValidPhone(phone) ? t.phoneError : undefined}
                        />
                        <TextInput
                            leftSection={<IconMessage size={16} />}
                            placeholder="Email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            withAsterisk
                            error={email && !isValidEmail(email) ? t.emailError : undefined}
                        />
                        <TextInput
                            leftSection={<IconBrandWhatsapp size={16} />}
                            placeholder={t.whatsapp}
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                        />
                        <TextInput
                            leftSection={<IconBrandTelegram size={16} />}
                            placeholder={t.telegram}
                            value={telegram}
                            onChange={(e) => setTelegram(e.target.value)}
                        />
                        <Select
                            leftSection={<IconMessage size={16} />}
                            placeholder={t.preferredContact}
                            value={preferredContact}
                            onChange={(value) => setPreferredContact(value || '')}
                            data={[
                                { value: 'email', label: t.emailLabel },
                                { value: 'whatsapp', label: t.whatsappLabel },
                                { value: 'telegram', label: t.telegramLabel }
                            ]}
                        />
                    </Stack>
                </div>

                {/* Date Selection */}
                <div>
                    <Group gap="xs" mb="sm">
                        <IconCalendar size={20} color="#3182ce" />
                        <Text size="sm" fw={600} c="#4a5568" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
                            {t.selectDates}
                        </Text>
                    </Group>
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

                {/* Comments */}
                <div>
                    <Group gap="xs" mb="sm">
                        <IconMessage size={20} color="#3182ce" />
                        <Text size="sm" fw={600} c="#4a5568" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
                            {t.comments}
                        </Text>
                    </Group>
                    <Textarea
                        placeholder={t.commentsPlaceholder}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={2}
                        styles={{
                            input: {
                                border: '1px solid #e2e8f0',
                                borderRadius: '6px',
                                fontSize: '14px'
                            }
                        }}
                    />
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div style={{
                        backgroundColor: '#f0fff4',
                        border: '1px solid #9ae6b4',
                        borderRadius: '6px',
                        padding: '12px',
                        textAlign: 'center'
                    }}>
                        <Text c="#22543d" fw={500}>{t.success}</Text>
                    </div>
                )}

                {/* Action Buttons */}
                <Group justify="flex-end" gap="md">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSending}
                    >
                        {t.close}
                    </Button>
                    <Button
                        leftSection={<IconSend size={16} />}
                        onClick={handleSend}
                        disabled={!isFormValid || isSending}
                        loading={isSending}
                        style={{
                            backgroundColor: '#3182ce',
                            color: 'white'
                        }}
                    >
                        {t.send}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
} 
