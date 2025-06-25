'use client';

import { Card, Image, Text, Badge, Group, Stack, ActionIcon, Button } from '@mantine/core';
import { IconBed, IconBath, IconUsers, IconMapPin, IconEye, IconBrandWhatsapp } from '@tabler/icons-react';
import { Property } from '@/types/strapi';
import { openWhatsApp } from '@/utils/whatsapp';

interface PropertyTileProps {
  property: Property;
  onBook?: (id: number) => void;
  onViewDetails?: (id: number) => void;
}

export function PropertyTile({ property, onBook, onViewDetails }: PropertyTileProps) {
  const { id, title, description, images, location, specifications, price, features, contact } = property;

  const handleBook = () => {
    // Open WhatsApp in a new tab
    const whatsappUrl = `https://wa.me/34656641433?text=${encodeURIComponent(`Hi! I'm interested in the accommodation "[Property ID: ${id}] ${title}" for €${price?.amount || 0}/${price?.period || 'night'}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(id);
    } else {
      // Fallback: открываем детальную страницу
      window.open(`/accommodation/${id}`, '_self');
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={property.images?.[0]?.url || '/placeholder.jpg'}
          height={200}
          alt={title}
          fallbackSrc="/placeholder.jpg"
        />
      </Card.Section>

      <Stack mt="md" gap="sm">
        <Group justify="space-between" align="flex-start">
          <Text fw={500} size="lg" lineClamp={1}>
            {title}
          </Text>
          <Badge color="blue" variant="light" size="lg">
            €{price?.amount || 0}/{price?.period || 'month'}
          </Badge>
        </Group>

        <Group gap="xs">
          <ActionIcon variant="subtle" color="gray" size="sm">
            <IconMapPin size="1rem" />
          </ActionIcon>
          <Text size="sm" c="dimmed">
            {location?.address || 'Address not specified'}
          </Text>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={2}>
          {description || 'No description available'}
        </Text>

        <Group gap="lg">
          <Group gap="xs">
            <IconBed size="1rem" />
            <Text size="sm">{specifications?.bedrooms || 0} beds</Text>
          </Group>
          <Group gap="xs">
            <IconBath size="1rem" />
            <Text size="sm">{specifications?.bathrooms || 0} baths</Text>
          </Group>
          <Group gap="xs">
            <IconUsers size="1rem" />
            <Text size="sm">Floor {specifications?.floor || 0}/{specifications?.total_floors || 0}</Text>
          </Group>
        </Group>

        <Group gap="xs" mt="xs">
          {features?.pool && <Badge color="blue" size="sm">Pool</Badge>}
          {features?.garden && <Badge color="green" size="sm">Garden</Badge>}
          {features?.air_conditioning && <Badge color="gray" size="sm">AC</Badge>}
          {features?.terrace && <Badge color="orange" size="sm">Terrace</Badge>}
        </Group>

        {/* Кнопки действий */}
        <Group grow mt="md">
          <Button
            variant="light"
            color="blue"
            leftSection={<IconEye size={16} />}
            onClick={handleViewDetails}
          >
            Подробнее
          </Button>
          <Button
            variant="filled"
            color="green"
            leftSection={<IconBrandWhatsapp size={16} />}
            onClick={handleBook}
          >
            Забронировать
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}