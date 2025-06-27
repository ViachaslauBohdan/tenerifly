import { Metadata } from 'next';
import { Locale } from '@/types/locale';
import { AccommodationPageContent } from '@/components/sections/AccommodationPageContent';

interface AccommodationPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: AccommodationPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    en: 'Accommodation in Tenerife - Tenerifly',
    pl: 'Zakwaterowanie na Teneryfie - Tenerifly',
    fr: 'Hébergement à Tenerife - Tenerifly',
    ru: 'Недвижимость на Тенерифе - Tenerifly',
    uk: 'Нерухомість на Тенерифе - Tenerifly'
  };

  const descriptions = {
    en: 'Find the perfect accommodation in Tenerife - apartments, houses, villas for rent and sale. Best prices and locations.',
    pl: 'Znajdź idealne zakwaterowanie na Teneryfie - apartamenty, domy, wille do wynajęcia i sprzedaży. Najlepsze ceny i lokalizacje.',
    fr: 'Trouvez l\'hébergement parfait à Tenerife - appartements, maisons, villas à louer et à vendre. Meilleurs prix et emplacements.',
    ru: 'Найдите идеальное жилье на Тенерифе - квартиры, дома, виллы в аренду и на продажу. Лучшие цены и расположение.',
    uk: 'Знайдіть ідеальне житло на Тенерифе - квартири, будинки, віли в оренду та на продаж. Найкращі ціни та розташування.'
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

export default function AccommodationPage({ params }: AccommodationPageProps) {
  return <AccommodationPageContent params={params} />;
}