import { Card, Image, Text, Badge, Group, Button, Stack } from '@mantine/core';
import { IconClock, IconLanguage, IconBrandWhatsapp, IconEye } from '@tabler/icons-react';
import { openWhatsApp } from '@/utils/whatsapp';
import { Locale } from '@/types/locale';
import { PriceDisplay } from '@/components/PriceDisplay';
import { StrapiPrice } from '@/utils/currency';
import { useRouter } from 'next/navigation';

export interface ExcursionTileProps {
  id?: number; // Добавляем ID для навигации
  title: string;
  description: string;
  image: string;
  duration: string;
  price: string; // Fallback price as string
  language: 'RU' | 'EN' | 'ES';
  onView: () => void;
  currentLocale?: Locale; 
  onViewDetails?: () => void;
  strapiPrice?: StrapiPrice | null; // Новое поле для Strapi цены
}

export function ExcursionTile({
  id,
  title,
  description,
  image,
  duration,
  price,
  language,
  onView,
  currentLocale = 'en',
  onViewDetails,
  strapiPrice
}: ExcursionTileProps) {
  const router = useRouter();
  
  const getLanguageLabel = (lang: 'RU' | 'EN' | 'ES') => {
    const labels = {
      RU: 'Русский',
      EN: 'English',
      ES: 'Español',
    };
    return labels[lang];
  };

  const handleViewDetails = () => {
    if (id) {
      // Навигация на детальную страницу
      router.push(`/${currentLocale}/excursions/${id}`);
    } else if (onViewDetails) {
      onViewDetails();
    } else {
      onView(); // Fallback to existing onView
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={image}
          height={160}
          alt={title}
        />
      </Card.Section>

      <Stack mt="md">
        <Text fw={500} size="lg">{title}</Text>
        <Text size="sm" c="dimmed" lineClamp={2}>
          {description}
        </Text>

        <Group justify="space-between" mt="md">
          <Group gap="xs">
            <IconClock size="1rem" />
            <Text size="sm">{duration}</Text>
          </Group>
          <Badge color="blue" variant="light">
            {strapiPrice ? (
              <PriceDisplay 
                price={strapiPrice} 
                locale={currentLocale}
                size="sm"
                weight={600}
                color="blue"
              />
            ) : (
              price
            )}
          </Badge>
        </Group>

        <Group gap="xs">
          <IconLanguage size="1rem" />
          <Text size="sm">{getLanguageLabel(language)}</Text>
        </Group>

        <Group grow mt="md">
          <Button 
            variant="light" 
            color="blue"
            radius="md" 
            onClick={handleViewDetails}
            leftSection={<IconEye size="1rem" />}
          >
            Подробнее
          </Button>
          <Button
            variant="filled"
            color="green"
            radius="md"
            onClick={() => openWhatsApp('excursion', {
              title,
              duration,
              price: strapiPrice ? 'Цена уточняется' : price, // Для WhatsApp используем простую строку
              language: getLanguageLabel(language)
            }, currentLocale)}
            leftSection={<IconBrandWhatsapp size="1rem" />}
          >
            Забронировать
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}