import { Card, Image, Text, Badge, Button, Group, Stack, rem } from '@mantine/core';
import { IconCar, IconUsers, IconGasStation, IconSettings, IconPhone, IconEye } from '@tabler/icons-react';
import { Locale } from '@/types/locale';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

interface CarTileProps {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'rent' | 'sale';
  dailyPrice: number;
  specifications: {
    make: string;
    model: string;
    year: number;
    fuel: string;
    transmission: string;
    seats: number;
  };
  features: {
    air_conditioning: boolean;
    navigation: boolean;
    bluetooth: boolean;
    backup_camera: boolean;
  };
  onContact: (id: string) => void;
  currentLocale: Locale;
}

export function CarTile({
  id,
  title,
  description,
  image,
  type,
  dailyPrice,
  specifications,
  features,
  onContact,
  currentLocale
}: CarTileProps) {
  const router = useRouter();
  const { createLocaleLink } = useTranslation();

  const handleViewDetails = () => {
    router.push(createLocaleLink(`/cars/${id}`));
  };
  const typeLabels = {
    rent: {
      en: 'For Rent',
      ru: 'Аренда',
      pl: 'Do wynajęcia',
      fr: 'À louer',
      uk: 'Оренда',
      de: 'Zu vermieten',
      es: 'Alquilar'
    },
    sale: {
      en: 'For Sale',
      ru: 'Продажа',
      pl: 'Na sprzedaż',
      fr: 'À vendre',
      uk: 'Продаж',
      de: 'Verkaufen',
      es: 'Venta'
    }
  };

  const featuresCount = Object.values(features).filter(Boolean).length;

  return (
    <Card
      shadow="md"
      padding="lg"
      radius="md"
      withBorder
      className="glass-effect hover-lift"
      h="100%"
    >
      <Card.Section>
        <Image
          src={image}
          height={200}
          alt={title}
          fallbackSrc="/placeholder.jpg"
        />
      </Card.Section>

      <Stack gap="md" mt="md">
        {/* Заголовок и тип */}
        <Group justify="space-between" align="flex-start">
          <Text fw={600} size="lg" lineClamp={2} flex={1}>
            {title}
          </Text>
          <Badge
            color={type === 'rent' ? 'blue' : 'green'}
            size="sm"
          >
            {typeLabels[type][currentLocale]}
          </Badge>
        </Group>

        {/* Описание */}
        <Text size="sm" c="dimmed" lineClamp={2}>
          {description}
        </Text>

        {/* Характеристики */}
        <Stack gap="xs">
          <Group gap="md">
            <Group gap={4}>
              <IconCar size={16} />
              <Text size="xs" c="dimmed">
                {specifications.make} {specifications.model}
              </Text>
            </Group>
            <Group gap={4}>
              <IconUsers size={16} />
              <Text size="xs" c="dimmed">
                {specifications.seats} мест
              </Text>
            </Group>
          </Group>

          <Group gap="md">
            <Group gap={4}>
              <IconGasStation size={16} />
              <Text size="xs" c="dimmed">
                {specifications.fuel}
              </Text>
            </Group>
            <Group gap={4}>
              <IconSettings size={16} />
              <Text size="xs" c="dimmed">
                {specifications.transmission}
              </Text>
            </Group>
          </Group>
        </Stack>

        {/* Дополнительные возможности */}
        {featuresCount > 0 && (
          <Text size="xs" c="blue.6">
            +{featuresCount} дополнительных опций
          </Text>
        )}

        {/* Цена и кнопки */}
        <Group justify="space-between" align="center" mt="auto">
          <Stack gap={0}>
            <Text size="xl" fw={700} c="blue.6">
              €{dailyPrice}
            </Text>
            <Text size="xs" c="dimmed">
              за день
            </Text>
          </Stack>
        </Group>

        <Group grow>
          <Button
            variant="outline"
            leftSection={<IconEye size={16} />}
            onClick={handleViewDetails}
            size="sm"
          >
            View Details
          </Button>
          <Button
            leftSection={<IconPhone size={16} />}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            size="sm"
            onClick={() => onContact(id)}
          >
            Book
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
