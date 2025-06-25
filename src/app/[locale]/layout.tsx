import type { Metadata } from "next";
import { Locale } from '@/types/locale';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>; 
}

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'pl' },
    { locale: 'fr' },
    { locale: 'ru' },
    { locale: 'uk' },
  ];
}

export default async function LocaleLayout({ 
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params; 
  
  return (
    <>
      {children}
    </>
  );
}