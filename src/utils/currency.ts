import { Locale } from '@/types/locale';
import { getExchangeRates, convertCurrency } from '@/services/exchangeRatesAPI';

// Валюты по локалям
const localeCurrencies: Record<Locale, string> = {
  en: 'EUR',
  ru: 'RUB',
  pl: 'PLN',
  fr: 'EUR',
  uk: 'USD',
};

// Символы валют
const currencySymbols: Record<string, string> = {
  EUR: '€',
  USD: '$',
  RUB: '₽',
  PLN: 'zł',
  GBP: '£',
};

// Интерфейс для цены из Strapi (обновленный для соответствия реальной схеме)
export interface StrapiPrice {
  amount: number;
  currency: string; // Изменено с 'EUR' | 'USD' на string для совместимости
  period: string;   // Изменено с enum на string для совместимости
}

// Функция конвертации цены из Strapi формата
export async function convertStrapiPrice(
  strapiPrice: StrapiPrice,
  targetLocale: Locale,
  showSymbol: boolean = true
): Promise<string> {
  const targetCurrency = localeCurrencies[targetLocale];
  
  // Убеждаемся что валюта поддерживается, иначе используем EUR по умолчанию
  const sourceCurrency = ['EUR', 'USD', 'RUB', 'PLN', 'GBP'].includes(strapiPrice.currency) 
    ? strapiPrice.currency 
    : 'EUR';
  
  // Конвертируем цену
  const convertedAmount = await convertCurrency(
    strapiPrice.amount,
    sourceCurrency,
    targetCurrency
  );
  
  const symbol = currencySymbols[targetCurrency] || targetCurrency;
  
  if (showSymbol) {
    // Для некоторых валют символ ставится после числа
    if (targetCurrency === 'RUB' || targetCurrency === 'PLN') {
      return `${Math.round(convertedAmount)} ${symbol}`;
    } else {
      return `${symbol}${Math.round(convertedAmount)}`;
    }
  }
  
  return Math.round(convertedAmount).toString();
}

// Функция получения валюты для локали
export function getCurrencyForLocale(locale: Locale): string {
  return localeCurrencies[locale];
}

// Функция получения символа валюты
export function getCurrencySymbol(locale: Locale): string {
  const currency = getCurrencyForLocale(locale);
  return currencySymbols[currency] || currency;
}

// Функция форматирования цены с учетом локали (асинхронная)
export async function formatPrice(
  strapiPrice: StrapiPrice, 
  locale: Locale
): Promise<string> {
  const targetCurrency = getCurrencyForLocale(locale);
  
  // Убеждаемся что валюта поддерживается
  const sourceCurrency = ['EUR', 'USD', 'RUB', 'PLN', 'GBP'].includes(strapiPrice.currency) 
    ? strapiPrice.currency 
    : 'EUR';
  
  // Конвертируем цену
  const convertedAmount = await convertCurrency(
    strapiPrice.amount,
    sourceCurrency,
    targetCurrency
  );
  
  // Используем Intl.NumberFormat для правильного форматирования
  const formatter = new Intl.NumberFormat(getIntlLocale(locale), {
    style: 'currency',
    currency: targetCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(Math.round(convertedAmount));
}

// Синхронная версия для простых случаев (без конвертации)
export function formatPriceSync(amount: number, locale: Locale): string {
  const currency = getCurrencyForLocale(locale);
  const symbol = getCurrencySymbol(locale);
  
  if (currency === 'RUB' || currency === 'PLN') {
    return `${Math.round(amount)} ${symbol}`;
  } else {
    return `${symbol}${Math.round(amount)}`;
  }
}

// Маппинг локалей для Intl.NumberFormat
function getIntlLocale(locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    ru: 'ru-RU', 
    pl: 'pl-PL',
    fr: 'fr-FR',
    uk: 'en-US',
  };
  
  return localeMap[locale];
}