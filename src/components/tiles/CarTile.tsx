import { Card, Image, Text, Badge, Group, Button } from '@mantine/core';
import { IconStar, IconCar, IconUsers, IconCurrencyEuro, IconManualGearbox } from '@tabler/icons-react';

interface CarTileProps {
  title: string;
  description: string;
  image: string;
  transmission: string;
  seats: number;
  features: string;
  price: string;
  rating: number;
  brand: string;
  model: string;
  year: number;
  onRent?: () => void;
}

export function CarTile({
  title,
  description,
  image,
  transmission,
  seats,
  features,
  price,
  rating,
  brand,
  model,
  year,
  onRent
}: CarTileProps) {
  return (
    <Card withBorder padding="lg" radius="md">
      <Card.Section>
        <Image
          src={image}
          height={200}
          alt={title}
        />
      </Card.Section>

      <Group justify="space-between" mt="md">
        <Text size="lg" fw={500}>{title}</Text>
        <Badge leftSection={<IconStar size={14} />} color="yellow">
          {rating}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mt="sm">
        {brand} {model} ({year})
      </Text>

      <Text size="sm" c="dimmed" mt="sm" lineClamp={2}>
        {description}
      </Text>

      <Group mt="md" gap="xs">
        <IconManualGearbox size={16} />
        <Text size="sm">{transmission}</Text>
      </Group>

      <Group mt="xs" gap="xs">
        <IconUsers size={16} />
        <Text size="sm">{seats} seats</Text>
      </Group>

      <Text size="sm" mt="xs">
        {features}
      </Text>

      <Group mt="xs" gap="xs">
        <IconCurrencyEuro size={16} />
        <Text size="sm">{price}/day</Text>
      </Group>

      <Button 
        fullWidth 
        mt="xl" 
        leftSection={<IconCar size={20} />}
        onClick={onRent}
      >
        Rent Now
      </Button>
    </Card>
  );
} 