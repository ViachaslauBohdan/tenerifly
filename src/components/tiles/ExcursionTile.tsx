import { Card, Image, Text, Badge, Group, Button, Stack } from '@mantine/core';
import { IconClock, IconLanguage, IconBrandWhatsapp } from '@tabler/icons-react';
import { openWhatsApp } from '@/utils/whatsapp';

export interface ExcursionTileProps {
  title: string;
  description: string;
  image: string;
  duration: string;
  price: string;
  language: 'RU' | 'EN' | 'ES';
  onView: () => void;
}

export function ExcursionTile({
  title,
  description,
  image,
  duration,
  price,
  language,
  onView,
}: ExcursionTileProps) {
  const getLanguageLabel = (lang: 'RU' | 'EN' | 'ES') => {
    const labels = {
      RU: 'Russian',
      EN: 'English',
      ES: 'Spanish',
    };
    return labels[lang];
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
            {price}
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
            onClick={onView}
          >
            View Details
          </Button>
          <Button
            variant="filled"
            color="green"
            radius="md"
            onClick={() => openWhatsApp('excursion', {
              title,
              duration,
              price,
              language: getLanguageLabel(language)
            })}
            leftSection={<IconBrandWhatsapp size="1rem" />}
          >
            Book Now
          </Button>
        </Group>
      </Stack>
    </Card>
  );
} 