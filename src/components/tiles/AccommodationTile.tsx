import { Card, Image, Text, Badge, Group, Button } from '@mantine/core';
import { IconStar, IconHome, IconBed, IconBath, IconUsers, IconCurrencyEuro, IconLocation } from '@tabler/icons-react';

interface AccommodationTileProps {
  title: string;
  description: string;
  image: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  price: string;
  rating: number;
  amenities: string;
  onView?: () => void;
}

export function AccommodationTile({
  title,
  description,
  image,
  location,
  bedrooms,
  bathrooms,
  maxGuests,
  price,
  rating,
  amenities,
  onView
}: AccommodationTileProps) {
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

      <Text size="sm" c="dimmed" mt="sm" lineClamp={2}>
        {description}
      </Text>

      <Group mt="md" gap="xs">
        <IconLocation size={16} />
        <Text size="sm">{location}</Text>
      </Group>

      <Group mt="xs" gap="xs">
        <IconBed size={16} />
        <Text size="sm">{bedrooms} bedrooms</Text>
      </Group>

      <Group mt="xs" gap="xs">
        <IconBath size={16} />
        <Text size="sm">{bathrooms} bathrooms</Text>
      </Group>

      <Group mt="xs" gap="xs">
        <IconUsers size={16} />
        <Text size="sm">Up to {maxGuests} guests</Text>
      </Group>

      <Text size="sm" mt="xs">
        {amenities}
      </Text>

      <Group mt="xs" gap="xs">
        <IconCurrencyEuro size={16} />
        <Text size="sm">{price}/night</Text>
      </Group>

      <Button 
        fullWidth 
        mt="xl" 
        leftSection={<IconHome size={20} />}
        onClick={onView}
      >
        View Details
      </Button>
    </Card>
  );
} 