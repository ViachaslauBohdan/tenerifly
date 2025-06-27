import { Card, Image, Text, Badge, Group, Button, Stack } from '@mantine/core';
import { IconCar, IconGasStation, IconGauge, IconUsers, IconBrandWhatsapp, IconEye } from '@tabler/icons-react';
import { openWhatsApp } from '@/utils/whatsapp';
import { Locale } from '@/types/locale';
import { useRouter } from 'next/navigation';

export interface CarTileProps {
  id?: number; // Добавляем ID для навигации
  title: string;
  description: string;
  image: string;
  type: 'rent' | 'sale';
  status: 'available' | 'reserved' | 'sold' | 'maintenance';
  price: string;
  specifications: {
    brand: string;
    model: string;
    year: number;
    fuel_type: string;
    transmission: string;
    seats: number;
  };
  onView: () => void;
  currentLocale?: Locale; 
  onViewDetails?: () => void;
}

export function CarTile({
  id,
  title,
  description,
  image,
  type,
  status,
  price,
  specifications,
  onView,
  currentLocale = 'en',
  onViewDetails
}: CarTileProps) {
  const router = useRouter();
  
  const getStatusColor = (status: CarTileProps['status']) => {
    const colors: Record<CarTileProps['status'], string> = {
      available: 'green',
      reserved: 'yellow',
      sold: 'red',
      maintenance: 'gray',
    };
    return colors[status];
  };

  const getStatusLabel = (status: CarTileProps['status']) => {
    const labels: Record<CarTileProps['status'], string> = {
      available: 'Доступен',
      reserved: 'Забронирован',
      sold: 'Продан',
      maintenance: 'На обслуживании',
    };
    return labels[status];
  };

  const formattedPrice = price.startsWith('€') ? price : `€${price}`;

  const handleViewDetails = () => {
    if (id) {
      // Навигация на детальную страницу
      router.push(`/${currentLocale}/cars/${id}`);
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
        <Group gap="xs">
          <Text size="sm" c="dimmed">{specifications.brand}</Text>
          <Text size="sm" c="dimmed">•</Text>
          <Text size="sm" c="dimmed">{specifications.model}</Text>
          <Text size="sm" c="dimmed">•</Text>
          <Text size="sm" c="dimmed">{specifications.year}</Text>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={2}>
          {description}
        </Text>

        <Group justify="space-between" mt="xs">
          <Group gap="xs">
            <IconGasStation size="1rem" />
            <Text size="sm">{specifications.fuel_type}</Text>
          </Group>
          <Group gap="xs">
            <IconGauge size="1rem" />
            <Text size="sm">{specifications.transmission}</Text>
          </Group>
          <Group gap="xs">
            <IconUsers size="1rem" />
            <Text size="sm">{specifications.seats} мест</Text>
          </Group>
        </Group>

        <Group justify="space-between" mt="md">
          <Badge color={getStatusColor(status)} variant="light">
            {getStatusLabel(status)}
          </Badge>
          <Badge color="blue" variant="filled" size="lg">
            {formattedPrice}
          </Badge>
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
          {status === 'available' && (
            <Button
              variant="filled"
              color="green"
              radius="md"
              onClick={() => openWhatsApp('car', {
                title,
                brand: specifications.brand,
                model: specifications.model,
                price: formattedPrice
              }, currentLocale)}
              leftSection={<IconBrandWhatsapp size="1rem" />}
            >
              Забронировать
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
}