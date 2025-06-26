import { Container } from '@mantine/core';
import { LocalePageClient } from './LocalePageClient';
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
export const revalidate = 3600; // Обновление каждый час

interface LocalePageProps {
  params: Promise<{ locale: Locale }>;
}

export default function LocalePage({ params }: LocalePageProps) {
  return <LocalePageClient params={params} />;
}