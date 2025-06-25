// Интерфейс для курсов валют
export interface ExchangeRates {
  EUR: number;
  USD: number;
  RUB: number;
  PLN: number;
  GBP: number;
  [key: string]: number;
}

// Кеш для курсов валют
let exchangeRatesCache: ExchangeRates | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 час

// Функция получения курсов валют из внешнего API
async function fetchExchangeRatesFromAPI(): Promise<ExchangeRates> {
  try {
    // Используем бесплатный API для курсов валют (например, exchangerate-api.com)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const data = await response.json();
    
    return {
      EUR: 1, // базовая валюта
      USD: data.rates.USD || 1.08,
      RUB: data.rates.RUB || 105.50,
      PLN: data.rates.PLN || 4.25,
      GBP: data.rates.GBP || 0.85,
    };
  } catch (error) {
    console.warn('Failed to fetch real exchange rates, using fallback:', error);
    
    // Fallback курсы если API недоступен
    return {
      EUR: 1,
      USD: 1.08,
      RUB: 105.50,
      PLN: 4.25,
      GBP: 0.85,
    };
  }
}

// Функция получения курсов валют с кешированием
export async function getExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now();
  
  // Проверяем кеш
  if (exchangeRatesCache && (now - lastFetchTime) < CACHE_DURATION) {
    return exchangeRatesCache;
  }
  
  // Обновляем курсы
  try {
    exchangeRatesCache = await fetchExchangeRatesFromAPI();
    lastFetchTime = now;
    return exchangeRatesCache;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Возвращаем кешированные данные если есть, иначе fallback
    if (exchangeRatesCache) {
      return exchangeRatesCache;
    }
    
    return {
      EUR: 1,
      USD: 1.08,
      RUB: 105.50,
      PLN: 4.25,
      GBP: 0.85,
    };
  }
}

// Функция для конвертации валют
export async function convertCurrency(
  amount: number, 
  fromCurrency: string, 
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  const rates = await getExchangeRates();
  
  // Конвертируем через EUR как базовую валюту
  let amountInEUR = amount;
  if (fromCurrency !== 'EUR') {
    amountInEUR = amount / rates[fromCurrency];
  }
  
  // Конвертируем из EUR в целевую валюту
  let finalAmount = amountInEUR;
  if (toCurrency !== 'EUR') {
    finalAmount = amountInEUR * rates[toCurrency];
  }
  
  return Math.round(finalAmount * 100) / 100; // Округляем до 2 знаков
}