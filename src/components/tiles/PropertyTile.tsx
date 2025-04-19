'use client';

import { Card, Image, Text, Badge, Group, Stack, ActionIcon, Rating } from '@mantine/core';
import { IconBed, IconBath, IconUsers, IconMapPin } from '@tabler/icons-react';
import { Property } from '@/types/property';

interface PropertyTileProps {
  property: Property;
  onBook?: (id: number) => void;
}

export function PropertyTile({ property, onBook }: PropertyTileProps) {
  const { title, description, images, location, specifications, price, features } = property.attributes;

  // Get the first image URL with fallbacks
  const imageUrl = (() => {
    // Check if the images data is in the transformed format
    if (Array.isArray(images) && images.length > 0) {
      return images[0].formats?.medium?.url || images[0].url || '/placeholder.jpg';
    }
    
    // Check if the images data is in the original Strapi format
    if (images?.data?.[0]?.attributes) {
      return images.data[0].attributes.formats?.medium?.url || 
             images.data[0].attributes.url || 
             '/placeholder.jpg';
    }
    
    // Fallback to placeholder image
    return '/placeholder.jpg';
  })();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={imageUrl}
          height={200}
          alt={title}
        />
      </Card.Section>

      <Stack mt="md" gap="sm">
        <Group justify="space-between" align="flex-start">
          <Text fw={500} size="lg" lineClamp={1}>
            {title}
          </Text>
          <Badge color="blue" variant="light">
            €{price.amount}/{price.period}
          </Badge>
        </Group>

        <Group gap="xs">
          <ActionIcon variant="subtle" color="gray">
            <IconMapPin size="1rem" />
          </ActionIcon>
          <Text size="sm" c="dimmed">
            {location.address}
          </Text>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={2}>
          {description}
        </Text>

        <Group gap="lg">
          <Group gap="xs">
            <IconBed size="1rem" />
            <Text size="sm">{specifications.bedrooms} beds</Text>
          </Group>
          <Group gap="xs">
            <IconBath size="1rem" />
            <Text size="sm">{specifications.bathrooms} baths</Text>
          </Group>
          <Group gap="xs">
            <IconUsers size="1rem" />
            <Text size="sm">{specifications.total_floors} guests</Text>
          </Group>
        </Group>

        <Group justify="space-between" align="center">
          <Group gap="xs">
            {features.has_pool && <Badge color="blue">Pool</Badge>}
            {features.has_garden && <Badge color="green">Garden</Badge>}
            {features.has_air_conditioning && <Badge color="gray">AC</Badge>}
          </Group>
          {onBook && (
            <Badge
              color="blue"
              variant="light"
              style={{ cursor: 'pointer' }}
              onClick={() => onBook(property.id)}
            >
              Book Now
            </Badge>
          )}
        </Group>
      </Stack>
    </Card>
  );
} 