import { Metadata } from 'next';
import { carsAPI } from '@/services/api';

// ISR настройки
export const revalidate = 1800; // Обновление каждые 30 минут

// Генерация метаданных для SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Car Rental in Tenerife - Rent Cars & Buy Vehicles | Tenerifly.io",
    description: "Rent or buy cars in Tenerife. Wide selection of vehicles from economy to luxury. Best prices, direct booking with local providers.",
    keywords: [
      "Tenerife car rental",
      "Tenerife car hire",
      "Tenerife vehicles",
      "Tenerife car sales",
      "Tenerife car dealership",
      "Tenerife transportation",
      "Tenerife car booking",
      "Tenerife vehicle rental"
    ],
    openGraph: {
      title: "Car Rental in Tenerife - Rent Cars & Buy Vehicles",
      description: "Rent or buy cars in Tenerife. Wide selection of vehicles from economy to luxury.",
      url: "https://tenerifly.io/cars",
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife Car Rental",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: "https://tenerifly.io/cars",
      languages: {
        'en': 'https://tenerifly.io/en/cars',
        'pl': 'https://tenerifly.io/pl/cars',
        'fr': 'https://tenerifly.io/fr/cars',
        'ru': 'https://tenerifly.io/ru/cars',
        'uk': 'https://tenerifly.io/uk/cars',
      },
    },
  };
}

// Предзагрузка данных для SEO
export async function generateStaticProps() {
  try {
    // Загружаем все автомобили для всех языков
    const [enCars, ruCars, plCars, frCars, ukCars] = await Promise.all([
      carsAPI.getAll('en', {}, 1, 1000),
      carsAPI.getAll('ru', {}, 1, 1000),
      carsAPI.getAll('pl', {}, 1, 1000),
      carsAPI.getAll('fr', {}, 1, 1000),
      carsAPI.getAll('uk', {}, 1, 1000)
    ]);

        return {
      props: {
        initialCars: {
          en: enCars.data,
          ru: ruCars.data,
          pl: plCars.data,
          fr: frCars.data,
          uk: ukCars.data
        }
      },
      revalidate: 1800 // ISR каждые 30 минут
    };
            } catch (error) {
    console.error('Error generating static props for cars:', error);
    return {
      props: {
        initialCars: {
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
import CarsPageClient from './CarsPageClient';

export default function CarsPage({ initialCars }: { initialCars: any }) {
  return <CarsPageClient initialCars={initialCars} />;
}
