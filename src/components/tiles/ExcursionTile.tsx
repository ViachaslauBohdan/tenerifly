import { Card, Image, Text, Badge, Group, Button } from '@mantine/core';
import { IconStar, IconClock, IconUsers, IconCurrencyEuro, IconMap } from '@tabler/icons-react';

interface ExcursionTileProps {
  title: string;
  description: string;
  image: string;
  duration: string;
  groupSize: string;
  price: string;
  rating: number;
  onBook?: () => void;
}

export function ExcursionTile({
  title,
  description,
  image,
  duration,
  groupSize,
  price,
  rating,
  onBook
}: ExcursionTileProps) {
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
        <IconClock size={16} />
        <Text size="sm">{duration}</Text>
      </Group>

      <Group mt="xs" gap="xs">
        <IconUsers size={16} />
        <Text size="sm">{groupSize}</Text>
      </Group>

      <Group mt="xs" gap="xs">
        <IconCurrencyEuro size={16} />
        <Text size="sm">{price}</Text>
      </Group>

      <Button 
        fullWidth 
        mt="xl" 
        leftSection={<IconMap size={20} />}
        onClick={onBook}
      >
        Book Now
      </Button>
    </Card>
  );
} 