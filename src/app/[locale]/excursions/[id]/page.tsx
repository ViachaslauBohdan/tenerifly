import { Metadata } from 'next';
import { Locale } from '@/types/locale';
import { ExcursionDetailClient } from './ExcursionDetailClient';

// Генерация статических параметров для ISR
export async function generateStaticParams() {
  const locales = ['en', 'pl', 'fr', 'ru', 'uk'];
  const excursionIds = ['1', '2', '3']; // Основные экскурсии
  
  return locales.flatMap(locale => 
    excursionIds.map(id => ({
      locale: locale as Locale,
      id
    }))
  );
}

export const revalidate = 3600;

interface ExcursionDetailsProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export async function generateMetadata({ params }: ExcursionDetailsProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    en: 'Excursion Details - Tenerifly',
    pl: 'Szczegóły wycieczki - Tenerifly',
    fr: 'Détails de l\'excursion - Tenerifly',
    ru: 'Детали экскурсии - Tenerifly',
    uk: 'Деталі екскурсії - Tenerifly'
  };

  const descriptions = {
    en: 'View detailed information about this excursion in Tenerife',
    pl: 'Zobacz szczegółowe informacje o tej wycieczce na Teneryfie',
    fr: 'Voir les informations détaillées sur cette excursion à Tenerife',
    ru: 'Посмотрите подробную информацию об этой экскурсии на Тенерифе',
    uk: 'Подивіться детальну інформацію про цю екскурсію на Тенерифе'
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      type: 'website',
      locale: locale,
    },
  };
}

export default function ExcursionDetailsPage({ params }: ExcursionDetailsProps) {
  return <ExcursionDetailClient params={params} />;
}