import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LOCALES, type Locale } from './src/types/locale';

const locales = LOCALES.map(locale => locale.code) as Locale[];
const defaultLocale: Locale = 'en';

// Пути, которые не требуют локализации
const publicPaths = ['/api', '/_next', '/static', '/favicon.ico', '/robots.txt', '/sitemap.xml'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Пропускаем публичные пути
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Проверяем, есть ли уже локаль в пути
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Если локаль уже есть в пути, продолжаем
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Определяем локаль из заголовков или используем дефолтную
  const locale = getLocale(request) || defaultLocale;

  // Редиректим на путь с локалью
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  
  // Сохраняем query параметры
  newUrl.search = request.nextUrl.search;
  
  return NextResponse.redirect(newUrl);
}

function getLocale(request: NextRequest): Locale | null {
  // Проверяем Accept-Language заголовок
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // Парсим Accept-Language (например: "en-US,en;q=0.9,ru;q=0.8")
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const [code, q = '1'] = lang.trim().split(';');
        const quality = q.includes('q=') ? parseFloat(q.split('q=')[1]) : 1;
        return { code: code.split('-')[0].toLowerCase(), quality };
      })
      .sort((a, b) => b.quality - a.quality);

    // Ищем первую поддерживаемую локаль
    for (const lang of languages) {
      if (locales.includes(lang.code as Locale)) {
        return lang.code as Locale;
      }
    }
  }

  return null;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

