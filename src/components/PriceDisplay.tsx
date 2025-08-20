import { Text, Loader } from '@mantine/core';
import { useConvertedPrice } from '@/hooks/useCurrency';
import { StrapiPrice } from '@/utils/currency';
import { Locale } from '@/types/locale';

interface PriceDisplayProps {
  price: StrapiPrice | null;
  locale: Locale;
  size?: string;
  weight?: number;
  color?: string;
  className?: string;
}

export function PriceDisplay({
  price,
  locale,
  size = 'md',
  weight = 600,
  color = 'blue',
  className
}: PriceDisplayProps) {
  const { convertedPrice, isLoading, error } = useConvertedPrice(price, locale);

  if (!price) {
    const notSpecifiedText = {
      en: 'Price not specified',
      ru: 'Цена не указана',
      pl: 'Cena nie określona',
      fr: 'Prix non spécifié',
      uk: 'Ціна не вказана',
      de: 'Preis nicht angegeben',
      es: 'Precio no especificado'
    };

    return <Text size={size} fw={weight} c="gray.5">
      {notSpecifiedText[locale] || notSpecifiedText.en}
    </Text>;
  }

  if (isLoading) {
    return <Loader size="sm" />;
  }

  if (error) {
    // Fallback: показываем оригинальную цену
    return (
      <Text size={size} fw={weight} c={color} className={className}>
        {price.currency === 'EUR' ? '€' : '$'}{price.amount}
      </Text>
    );
  }

  return (
    <Text size={size} fw={weight} c={color} className={className}>
      {convertedPrice}
    </Text>
  );
}
