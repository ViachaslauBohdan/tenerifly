import { Metadata } from 'next';
import { excursionsAPI } from '@/services/api';

// ISR настройки
export const revalidate = 1800; // Обновление каждые 30 минут

// Генерация метаданных для SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tours & Excursions in Tenerife - Guided Tours & Activities | Tenerifly.io",
    description: "Discover Tenerife with our guided tours and excursions. From Teide National Park to whale watching, explore the best of the Canary Islands.",
    keywords: [
      "Tenerife tours",
      "Tenerife excursions", 
      "Tenerife guided tours",
      "Teide National Park",
      "Tenerife whale watching",
      "Tenerife activities",
      "Tenerife sightseeing",
      "Tenerife adventure tours"
    ],
    openGraph: {
      title: "Tours & Excursions in Tenerife - Guided Tours & Activities",
      description: "Discover Tenerife with our guided tours and excursions. From Teide National Park to whale watching.",
      url: "https://tenerifly.io/tours",
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife Tours & Excursions",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: "https://tenerifly.io/tours",
      languages: {
        'en': 'https://tenerifly.io/en/tours',
        'pl': 'https://tenerifly.io/pl/tours',
        'fr': 'https://tenerifly.io/fr/tours',
        'ru': 'https://tenerifly.io/ru/tours',
        'uk': 'https://tenerifly.io/uk/tours',
      },
    },
  };
}

// Предзагрузка данных для SEO
export async function generateStaticProps() {
  try {
    // Загружаем все экскурсии для всех языков
    const [enTours, ruTours, plTours, frTours, ukTours] = await Promise.all([
      excursionsAPI.getAll('en', {}, 1, 1000),
      excursionsAPI.getAll('ru', {}, 1, 1000),
      excursionsAPI.getAll('pl', {}, 1, 1000),
      excursionsAPI.getAll('fr', {}, 1, 1000),
      excursionsAPI.getAll('uk', {}, 1, 1000)
    ]);

        return {
      props: {
        initialTours: {
          en: enTours.data,
          ru: ruTours.data,
          pl: plTours.data,
          fr: frTours.data,
          uk: ukTours.data
        }
      },
      revalidate: 1800 // ISR каждые 30 минут
    };
            } catch (error) {
    console.error('Error generating static props for tours:', error);
    return {
      props: {
        initialTours: {
          en: [],
          ru: [],
          pl: [],
          fr: [],
          uk: []
        }
      },
      revalidate: 1800
    };
  }
}

// Импортируем клиентский компонент
import ToursPageClient from './ToursPageClient';

export default function ToursPage({ initialTours }: { initialTours: any }) {
  return <ToursPageClient initialTours={initialTours} />;
}
