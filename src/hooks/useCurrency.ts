import { useState, useEffect } from 'react';
import { StrapiPrice, convertStrapiPrice, formatPriceSync } from '@/utils/currency';
import { Locale } from '@/types/locale';

// Хук для конвертации цены
export function useConvertedPrice(strapiPrice: StrapiPrice | null, locale: Locale) {
  const [convertedPrice, setConvertedPrice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!strapiPrice) {
      setConvertedPrice('');
      return;
    }

    const convertPrice = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await convertStrapiPrice(strapiPrice, locale);
        setConvertedPrice(result);
      } catch (err) {
        setError('Failed to convert price');
        // Fallback: показываем цену без конвертации
        setConvertedPrice(formatPriceSync(strapiPrice.amount, locale));
      } finally {
        setIsLoading(false);
      }
    };

    convertPrice();
  }, [strapiPrice, locale]);

  return { convertedPrice, isLoading, error };
}

// Хук для работы с массивом цен
export function useConvertedPrices(prices: StrapiPrice[], locale: Locale) {
  const [convertedPrices, setConvertedPrices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (prices.length === 0) {
      setConvertedPrices([]);
      return;
    }

    const convertPrices = async () => {
      setIsLoading(true);
      
      try {
        const results = await Promise.all(
          prices.map(price => convertStrapiPrice(price, locale))
        );
        setConvertedPrices(results);
      } catch (err) {
        // Fallback: показываем цены без конвертации
        const fallbackPrices = prices.map(price => 
          formatPriceSync(price.amount, locale)
        );
        setConvertedPrices(fallbackPrices);
      } finally {
        setIsLoading(false);
      }
    };

    convertPrices();
  }, [prices, locale]);

  return { convertedPrices, isLoading };
}