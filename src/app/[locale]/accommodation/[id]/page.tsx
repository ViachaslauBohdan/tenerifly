import { Metadata } from 'next';
import { Locale } from '@/types/locale';
import { PropertyDetailClient } from './PropertyDetailClient';

export async function generateStaticParams() {
  const locales = ['en', 'pl', 'fr', 'ru', 'uk'];
  const propertyIds = ['1', '2', '3']; 
  
  return locales.flatMap(locale => 
    propertyIds.map(id => ({
      locale: locale as Locale,
      id
    }))
  );
}

export const revalidate = 3600; 

interface PropertyDetailsProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export async function generateMetadata({ params }: PropertyDetailsProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    en: 'Property Details - Tenerifly',
    pl: 'Szczegóły nieruchomości - Tenerifly',
    fr: 'Détails de la propriété - Tenerifly',
    ru: 'Детали недвижимости - Tenerifly',
    uk: 'Деталі нерухомості - Tenerifly'
  };

  const descriptions = {
    en: 'View detailed information about this property in Tenerife',
    pl: 'Zobacz szczegółowe informacje o tej nieruchomości na Teneryfie',
    fr: 'Voir les informations détaillées sur cette propriété à Tenerife',
    ru: 'Посмотрите подробную информацию об этой недвижимости на Тенерифе',
    uk: 'Подивіться детальну інформацію про цю нерухомість на Тенерифе'
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

export default function PropertyDetailsPage({ params }: PropertyDetailsProps) {
  return <PropertyDetailClient params={params} />;
}