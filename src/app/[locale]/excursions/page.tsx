import { ExcursionsPageClient } from './ExcursionsPageClient';
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

interface ExcursionsPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function ExcursionsPage({ params }: ExcursionsPageProps) {
  return <ExcursionsPageClient params={params} />;
}