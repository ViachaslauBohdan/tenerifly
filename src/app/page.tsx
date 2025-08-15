import { Metadata } from 'next';
import { LocalePageClient } from './LocalePageClient';
import { propertiesAPI, carsAPI, excursionsAPI, blogAPI } from '@/services/api';

// ISR настройки
export const revalidate = 3600; // Обновление каждые 1 час

// Генерация метаданных для SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tenerifly.io - Accommodation, Tours and Car Rental in Tenerife",
    description: "Find your perfect accommodation, tours or car rental in Tenerife. Book directly with local providers for the best prices and authentic experiences.",
    keywords: [
      "Tenerife accommodation",
      "Tenerife tours", 
      "Tenerife car rental",
      "Tenerife vacation",
      "Tenerife holiday",
      "Tenerife apartments",
      "Tenerife villas",
      "Tenerife activities",
      "Tenerife sightseeing",
      "Tenerife travel"
    ],
    openGraph: {
      title: "Tenerifly.io - Your Guide to Tenerife",
      description: "Find your perfect accommodation, tours or car rental in Tenerife. Book directly with local providers for the best prices and authentic experiences.",
      url: "https://tenerifly.io",
      siteName: "Tenerifly.io",
      images: [
        {
          url: "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg",
          width: 1200,
          height: 630,
          alt: "Tenerifly.io - Your Guide to Tenerife",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Tenerifly.io - Your Guide to Tenerife",
      description: "Find your perfect accommodation, tours or car rental in Tenerife. Book directly with local providers for the best prices and authentic experiences.",
      images: ["https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg"],
    },
    alternates: {
      canonical: "https://tenerifly.io",
      languages: {
        'en': 'https://tenerifly.io/en',
        'pl': 'https://tenerifly.io/pl',
        'fr': 'https://tenerifly.io/fr',
        'ru': 'https://tenerifly.io/ru',
        'uk': 'https://tenerifly.io/uk',
      },
    },
  };
}

// Предзагрузка данных для SEO
export async function generateStaticProps() {
  try {
    // Загружаем данные для всех языков
    const [enData, ruData, plData, frData, ukData] = await Promise.all([
      Promise.all([
        propertiesAPI.getFeatured('en'),
        carsAPI.getFeatured('en'),
        excursionsAPI.getFeatured('en'),
        blogAPI.getAll('en')
      ]),
      Promise.all([
        propertiesAPI.getFeatured('ru'),
        carsAPI.getFeatured('ru'),
        excursionsAPI.getFeatured('ru'),
        blogAPI.getAll('ru')
      ]),
      Promise.all([
        propertiesAPI.getFeatured('pl'),
        carsAPI.getFeatured('pl'),
        excursionsAPI.getFeatured('pl'),
        blogAPI.getAll('pl')
      ]),
      Promise.all([
        propertiesAPI.getFeatured('fr'),
        carsAPI.getFeatured('fr'),
        excursionsAPI.getFeatured('fr'),
        blogAPI.getAll('fr')
      ]),
      Promise.all([
        propertiesAPI.getFeatured('uk'),
        carsAPI.getFeatured('uk'),
        excursionsAPI.getFeatured('uk'),
        blogAPI.getAll('uk')
      ])
    ]);

    return {
      props: {
        initialData: {
          en: {
            properties: enData[0].data,
            cars: enData[1].data,
            tours: enData[2].data,
            blogPosts: enData[3].data
          },
          ru: {
            properties: ruData[0].data,
            cars: ruData[1].data,
            tours: ruData[2].data,
            blogPosts: ruData[3].data
          },
          pl: {
            properties: plData[0].data,
            cars: plData[1].data,
            tours: plData[2].data,
            blogPosts: plData[3].data
          },
          fr: {
            properties: frData[0].data,
            cars: frData[1].data,
            tours: frData[2].data,
            blogPosts: frData[3].data
          },
          uk: {
            properties: ukData[0].data,
            cars: ukData[1].data,
            tours: ukData[2].data,
            blogPosts: ukData[3].data
          }
        }
      },
      revalidate: 3600 // ISR каждые 1 час
    };
  } catch (error) {
    console.error('Error generating static props:', error);
    return {
      props: {
        initialData: {
          en: { properties: [], cars: [], tours: [], blogPosts: [] },
          ru: { properties: [], cars: [], tours: [], blogPosts: [] },
          pl: { properties: [], cars: [], tours: [], blogPosts: [] },
          fr: { properties: [], cars: [], tours: [], blogPosts: [] },
          uk: { properties: [], cars: [], tours: [], blogPosts: [] }
        }
      },
      revalidate: 3600
    };
  }
}

export default function RootPage({ initialData }: { initialData: any }) {
  return <LocalePageClient initialData={initialData} />;
}