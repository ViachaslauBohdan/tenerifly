import { Metadata } from 'next';
import { Locale } from '@/types/locale';
import { CarDetailClient } from './CarDetailClient';

export async function generateStaticParams() {
  const locales = ['en', 'pl', 'fr', 'ru', 'uk'];
  const carIds = ['1', '2', '3']; 
  
  return locales.flatMap(locale => 
    carIds.map(id => ({
      locale: locale as Locale,
      id
    }))
  );
}

export const revalidate = 3600; 

interface CarDetailsProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export async function generateMetadata({ params }: CarDetailsProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    en: 'Car Details - Tenerifly',
    pl: 'Szczegóły samochodu - Tenerifly',
    fr: 'Détails de la voiture - Tenerifly',
    ru: 'Детали автомобиля - Tenerifly',
    uk: 'Деталі автомобіля - Tenerifly'
  };

  const descriptions = {
    en: 'View detailed information about this car rental in Tenerife',
    pl: 'Zobacz szczegółowe informacje o tym wynajmie samochodu na Teneryfie',
    fr: 'Voir les informations détaillées sur cette location de voiture à Tenerife',
    ru: 'Посмотрите подробную информацию об аренде этого автомобиля на Тенерифе',
    uk: 'Подивіться детальну інформацію про оренду цього автомобіля на Тенерифе'
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

export default function CarDetailsPage({ params }: CarDetailsProps) {
  return <CarDetailClient params={params} />;
}