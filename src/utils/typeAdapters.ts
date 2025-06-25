import { StrapiPrice } from '@/utils/currency';

// Тип Price из Strapi (как он приходит с бэкенда)
export interface StrapiPriceRaw {
  amount: number;
  currency: string;
  period: string;
}

// Функция для адаптации типа Price из Strapi в StrapiPrice
export function adaptStrapiPrice(rawPrice: StrapiPriceRaw): StrapiPrice {
  return {
    amount: rawPrice.amount,
    currency: rawPrice.currency,
    period: rawPrice.period,
  };
}

// Функция для проверки валидности валюты
export function isValidCurrency(currency: string): currency is 'EUR' | 'USD' | 'RUB' | 'PLN' | 'GBP' {
  return ['EUR', 'USD', 'RUB', 'PLN', 'GBP'].includes(currency);
}

// Функция для нормализации валюты
export function normalizeCurrency(currency: string): 'EUR' | 'USD' {
  if (isValidCurrency(currency)) {
    return currency === 'EUR' || currency === 'USD' ? currency : 'EUR';
  }
  return 'EUR'; // fallback
}