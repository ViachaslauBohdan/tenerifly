import { Card, Image, Text, Badge, Group, Button, Stack, ThemeIcon } from '@mantine/core';
import {
  IconBed,
  IconBath,
  IconRuler,
  IconMapPin,
  IconCar,
  IconPool,
  IconTrees,
  IconBuildingSkyscraper,
  IconHome2,
  IconBrandWhatsapp,
  IconEye
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Locale } from '@/types/locale';

export interface PropertyTileProps {
  id: number;
  title: string;
  description: string;
  image: string;
  type: 'rent' | 'sale';
  price: string;
  specifications: {
    property_type: string;
    bedrooms: number;
    bathrooms: number;
    total_area: number;
    floor: number;
    year_built: number;
  };
  location: string;
  features: {
    has_balcony: boolean;
    has_terrace: boolean;
    has_garden: boolean;
    has_pool: boolean;
    has_parking: boolean;
    furnished: boolean;
  };
  onContact: (id: number) => void;
  currentLocale?: Locale;
}

export function PropertyTile({
  id,
  title,
  description,
  image,
  type,
  price,
  specifications,
  location,
  features,
  onContact,
  currentLocale = 'en'
}: PropertyTileProps) {
  const router = useRouter();

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'Квартира',
      house: 'Дом',
      villa: 'Вилла',
      studio: 'Студия',
      penthouse: 'Пентхаус',
      plot: 'Участок',
      commercial: 'Коммерческая',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: PropertyTileProps['type']) => {
    return type === 'rent' ? 'blue' : 'green';
  };

  const getTypeLabel = (type: PropertyTileProps['type']) => {
    return type === 'rent' ? 'Аренда' : 'Продажа';
  };

  const handleViewDetails = () => {
    router.push(`/${currentLocale}/properties/${id}`);
  };

  const handleWhatsAppContact = () => {
    const message = `Привет! Меня интересует недвижимость "${title}" (ID: ${id}). Можете предоставить больше информации?`;
    const phoneNumber = '+34600000000'; // Замените на реальный номер
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Card.Section>
        <Image
          src={image}
          height={200}
          alt={title}
          fallbackSrc="/placeholder-property.jpg"
        />
      </Card.Section>

      <Stack gap="sm" mt="md">
        {/* Заголовок и тип */}
        <Group justify="space-between" align="flex-start">
          <Text fw={600} size="lg" lineClamp={2}>
            {title}
          </Text>
          <Badge variant="light" color={getTypeColor(type)} size="sm">
            {getTypeLabel(type)}
          </Badge>
        </Group>

        {/* Описание */}
        <Text size="sm" c="dimmed" lineClamp={3}>
          {description}
        </Text>

        {/* Основная информация */}
        <Group gap="xs">
          <Group gap={4}>
            <IconMapPin size={16} color="gray" />
            <Text size="xs" c="dimmed">{location}</Text>
          </Group>
          <Badge variant="outline" size="xs">
            {getPropertyTypeLabel(specifications.property_type)}
          </Badge>
        </Group>

        {/* Характеристики */}
        <Group justify="space-between">
          <Group gap="xs">
            <Group gap={4}>
              <IconBed size={16} color="gray" />
              <Text size="xs">{specifications.bedrooms}</Text>
            </Group>
            <Group gap={4}>
              <IconBath size={16} color="gray" />
              <Text size="xs">{specifications.bathrooms}</Text>
            </Group>
            <Group gap={4}>
              <IconRuler size={16} color="gray" />
              <Text size="xs">{specifications.total_area}м²</Text>
            </Group>
          </Group>
          {specifications.year_built > 0 && (
            <Text size="xs" c="dimmed">
              {specifications.year_built}г.
            </Text>
          )}
        </Group>

        {/* Удобства */}
        <Group gap="xs">
          {features.has_balcony && (
            <ThemeIcon size={20} radius="xl" color="blue" variant="light">
              <IconBuildingSkyscraper size={12} />
            </ThemeIcon>
          )}
          {features.has_garden && (
            <ThemeIcon size={20} radius="xl" color="green" variant="light">
              <IconTrees size={12} />
            </ThemeIcon>
          )}
          {features.has_pool && (
            <ThemeIcon size={20} radius="xl" color="cyan" variant="light">
              <IconPool size={12} />
            </ThemeIcon>
          )}
          {features.has_parking && (
            <ThemeIcon size={20} radius="xl" color="gray" variant="light">
              <IconCar size={12} />
            </ThemeIcon>
          )}
          {features.furnished && (
            <ThemeIcon size={20} radius="xl" color="orange" variant="light">
              <IconHome2 size={12} />
            </ThemeIcon>
          )}
        </Group>

        {/* Цена и кнопки */}
        <Group justify="space-between" align="center" mt="auto">
          <Text fw={700} size="xl" c="blue">
            {price}
            {type === 'rent' && <Text span size="sm" c="dimmed">/мес</Text>}
          </Text>
        </Group>

        <Group grow>
          <Button
            variant="outline"
            leftSection={<IconEye size={16} />}
            onClick={handleViewDetails}
            size="sm"
          >
            Подробнее
          </Button>
          <Button
            leftSection={<IconBrandWhatsapp size={16} />}
            onClick={handleWhatsAppContact}
            size="sm"
            color="green"
          >
            Book
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
