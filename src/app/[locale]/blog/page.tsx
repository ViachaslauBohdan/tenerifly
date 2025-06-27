import { Metadata } from 'next';
import { Locale } from '@/types/locale';
import { BlogPageClient } from './BlogPageClient';

interface BlogPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    en: 'Blog - Tenerifly',
    pl: 'Blog - Tenerifly',
    fr: 'Blog - Tenerifly',
    ru: 'Блог - Tenerifly',
    uk: 'Блог - Tenerifly'
  };

  const descriptions = {
    en: 'Discover the latest news and insights about Tenerife - travel tips, accommodation guides, and local experiences.',
    pl: 'Odkryj najnowsze wiadomości i porady dotyczące Tenerify - wskazówki podróżnicze, przewodniki noclegowe i lokalne doświadczenia.',
    fr: 'Découvrez les dernières actualités et conseils sur Tenerife - conseils de voyage, guides d\'hébergement et expériences locales.',
    ru: 'Откройте для себя последние новости и советы о Тенерифе - советы путешественникам, гиды по размещению и местные впечатления.',
    uk: 'Відкрийте для себе останні новини та поради про Тенерифе - поради мандрівникам, гіди з розміщення та місцеві враження.'
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

export default function BlogPage({ params }: BlogPageProps) {
  return <BlogPageClient params={params} />;
}