import { Metadata } from 'next';
import { propertiesAPI } from '@/services/api';

// ISR настройки
export const revalidate = 1800; // Обновление каждые 30 минут

// Генерация метаданных для SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Accommodation in Tenerife - Apartments, Villas & Houses | Tenerifly.io",
    description: "Find the perfect accommodation in Tenerife. Browse apartments, villas, and houses for rent or sale. Best prices, direct booking with local providers.",
    keywords: [
      "Tenerife accommodation",
      "Tenerife apartments",
      "Tenerife villas", 
      "Tenerife houses",
      "Tenerife property rental",
      "Tenerife property sale",
      "Tenerife vacation rental",
      "Tenerife holiday home"
    ],
    openGraph: {
      title: "Accommodation in Tenerife - Apartments, Villas & Houses",
      description: "Find the perfect accommodation in Tenerife. Browse apartments, villas, and houses for rent or sale.",
      url: "https://tenerifly.io/apartments",
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerife Accommodation",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    alternates: {
      canonical: "https://tenerifly.io/apartments",
      languages: {
        'en': 'https://tenerifly.io/en/apartments',
        'pl': 'https://tenerifly.io/pl/apartments',
        'fr': 'https://tenerifly.io/fr/apartments',
        'ru': 'https://tenerifly.io/ru/apartments',
        'uk': 'https://tenerifly.io/uk/apartments',
      },
    },
  };
}

// Предзагрузка данных для SEO
export async function generateStaticProps() {
  try {
    // Загружаем все апартаменты для всех языков
    const [enProperties, ruProperties, plProperties, frProperties, ukProperties] = await Promise.all([
      propertiesAPI.getAll('en', {}, 1, 1000),
      propertiesAPI.getAll('ru', {}, 1, 1000),
      propertiesAPI.getAll('pl', {}, 1, 1000),
      propertiesAPI.getAll('fr', {}, 1, 1000),
      propertiesAPI.getAll('uk', {}, 1, 1000)
    ]);

        return {
      props: {
        initialProperties: {
          en: enProperties.data,
          ru: ruProperties.data,
          pl: plProperties.data,
          fr: frProperties.data,
          uk: ukProperties.data
        }
      },
      revalidate: 1800 // ISR каждые 30 минут
    };
            } catch (error) {
    console.error('Error generating static props for apartments:', error);
    return {
      props: {
        initialProperties: {
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
import ApartmentsPageClient from './ApartmentsPageClient';

export default function ApartmentsPage({ initialProperties }: { initialProperties: any }) {
  return <ApartmentsPageClient initialProperties={initialProperties} />;
}
