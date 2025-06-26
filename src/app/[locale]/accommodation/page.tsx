import { AccommodationPageClient } from './AccommodationPageClient';
import { Locale } from '@/types/locale';

// Генерация статических параметров для ISR
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'pl' },
    { locale: 'fr' },
    { locale: 'ru' },
    { locale: 'uk' },
  ];
}

// Настройка revalidate для ISR
export const revalidate = 1800; // Обновление каждые 30 минут

interface AccommodationPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function AccommodationPage({ params }: AccommodationPageProps) {
  return <AccommodationPageClient params={params} />;
}