import { Metadata } from 'next';
import { propertiesAPI } from '@/services/api';

// ISR настройки
export const revalidate = 1800; // Обновление каждые 30 минут

// Генерация статических путей для всех апартаментов
export async function generateStaticParams() {
  try {
    // Загружаем все апартаменты для получения ID
    const [enProperties, ruProperties, plProperties, frProperties, ukProperties] = await Promise.all([
      propertiesAPI.getAll('en', {}, 1, 1000),
      propertiesAPI.getAll('ru', {}, 1, 1000),
      propertiesAPI.getAll('pl', {}, 1, 1000),
      propertiesAPI.getAll('fr', {}, 1, 1000),
      propertiesAPI.getAll('uk', {}, 1, 1000)
    ]);

    // Собираем все уникальные ID
    const allIds = new Set([
      ...enProperties.data.map((p: any) => p.id.toString()),
      ...ruProperties.data.map((p: any) => p.id.toString()),
      ...plProperties.data.map((p: any) => p.id.toString()),
      ...frProperties.data.map((p: any) => p.id.toString()),
      ...ukProperties.data.map((p: any) => p.id.toString())
    ]);

    return Array.from(allIds).map((id) => ({
      id: id,
    }));
  } catch (error) {
    console.error('Error generating static params for apartments:', error);
    return [];
  }
}

// Генерация метаданных для SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Загружаем данные апартамента для всех языков
    const [enProperty, ruProperty, plProperty, frProperty, ukProperty] = await Promise.all([
      propertiesAPI.getById(params.id, 'en'),
      propertiesAPI.getById(params.id, 'ru'),
      propertiesAPI.getById(params.id, 'pl'),
      propertiesAPI.getById(params.id, 'fr'),
      propertiesAPI.getById(params.id, 'uk')
    ]);

    const property = enProperty.data || ruProperty.data || plProperty.data || frProperty.data || ukProperty.data;

    if (!property) {
        return {
        title: "Property Not Found | Tenerifly.io",
        description: "The requested property could not be found.",
      };
    }

    const title = property.title || "Accommodation in Tenerife";
    const description = property.description || "Find your perfect accommodation in Tenerife. Browse apartments, villas, and houses for rent or sale.";
    const imageUrl = property.images?.[0]?.url || "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";

    return {
      title: `${title} - Accommodation in Tenerife | Tenerifly.io`,
      description: description,
      keywords: [
        "Tenerife accommodation",
        "Tenerife apartments",
        "Tenerife property rental",
        "Tenerife vacation rental",
        "Tenerife holiday home",
        title
      ],
      openGraph: {
        title: `${title} - Accommodation in Tenerife`,
        description: description,
        url: `https://tenerifly.io/apartments/${params.id}`,
        siteName: "Tenerifly.io",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      alternates: {
        canonical: `https://tenerifly.io/apartments/${params.id}`,
        languages: {
          'en': `https://tenerifly.io/en/apartments/${params.id}`,
          'pl': `https://tenerifly.io/pl/apartments/${params.id}`,
          'fr': `https://tenerifly.io/fr/apartments/${params.id}`,
          'ru': `https://tenerifly.io/ru/apartments/${params.id}`,
          'uk': `https://tenerifly.io/uk/apartments/${params.id}`,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata for apartment:', error);
    return {
      title: "Accommodation in Tenerife | Tenerifly.io",
      description: "Find your perfect accommodation in Tenerife.",
    };
  }
}

// Предзагрузка данных для SEO
export async function generateStaticProps({ params }: { params: { id: string } }) {
  try {
    // Загружаем данные апартамента для всех языков
    const [enProperty, ruProperty, plProperty, frProperty, ukProperty] = await Promise.all([
      propertiesAPI.getById(params.id, 'en'),
      propertiesAPI.getById(params.id, 'ru'),
      propertiesAPI.getById(params.id, 'pl'),
      propertiesAPI.getById(params.id, 'fr'),
      propertiesAPI.getById(params.id, 'uk')
    ]);

    return {
      props: {
        property: {
          en: enProperty.data,
          ru: ruProperty.data,
          pl: plProperty.data,
          fr: frProperty.data,
          uk: ukProperty.data
        }
      },
      revalidate: 1800 // ISR каждые 30 минут
    };
  } catch (error) {
    console.error('Error generating static props for apartment:', error);
    return {
      props: {
        property: {
          en: null,
          ru: null,
          pl: null,
          fr: null,
          uk: null
        }
      },
      revalidate: 1800
    };
  }
}

// Импортируем клиентский компонент
import ApartmentDetailPageClient from './ApartmentDetailPageClient';

export default function ApartmentDetailPage({ property }: { property: any }) {
  return <ApartmentDetailPageClient property={property} />;
}
