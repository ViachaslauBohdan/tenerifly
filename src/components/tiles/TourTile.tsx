import { Card, Image, Text, Badge, Button, Group, Stack, Rating, rem } from '@mantine/core';
import { IconClock, IconUsers, IconPhone, IconBabyCarriage, IconCar, IconCoffee, IconTicket } from '@tabler/icons-react';
import { Locale } from '@/types/locale';

interface TourTileProps {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  groupSize: string;
  price: string;
  rating: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  includes: {
    transport: boolean;
    food: boolean;
    tickets: boolean;
  };
  suitable_for_children: boolean;
  onContact: (id: number) => void;
  currentLocale: Locale;
}

export function TourTile({
  id,
  title,
  description,
  image,
  duration,
  groupSize,
  price,
  rating,
  difficulty,
  includes,
  suitable_for_children,
  onContact,
  currentLocale
}: TourTileProps) {
  const difficultyLabels = {
    easy: {
      en: 'Easy',
      ru: 'Легкий',
      pl: 'Łatwy',
      fr: 'Facile',
      uk: 'Легкий'
    },
    moderate: {
      en: 'Moderate',
      ru: 'Средний',
      pl: 'Średni',
      fr: 'Modéré',
      uk: 'Середній'
    },
    hard: {
      en: 'Hard',
      ru: 'Сложный',
      pl: 'Trudny',
      fr: 'Difficile',
      uk: 'Складний'
    }
  };

  const difficultyColors = {
    easy: 'green',
    moderate: 'yellow',
    hard: 'red'
  };

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
        {/* Заголовок и сложность */}
        <Group justify="space-between" align="flex-start">
          <Text fw={600} size="lg" lineClamp={2} flex={1}>
            {title}
          </Text>
          <Badge
            color={difficultyColors[difficulty]}
            size="sm"
          >
            {difficultyLabels[difficulty][currentLocale]}
          </Badge>
        </Group>

        {/* Описание */}
        <Text size="sm" c="dimmed" lineClamp={2}>
          {description}
        </Text>

        {/* Основная информация */}
        <Stack gap="xs">
          <Group gap="md">
            <Group gap={4}>
              <IconClock size={16} />
              <Text size="xs" c="dimmed">
                {duration}
              </Text>
            </Group>
            <Group gap={4}>
              <IconUsers size={16} />
              <Text size="xs" c="dimmed">
                {groupSize}
              </Text>
            </Group>
          </Group>

          {/* Рейтинг */}
          <Group gap={4}>
            <Rating value={rating} readOnly size="xs" />
            <Text size="xs" c="dimmed">
              {rating.toFixed(1)}
            </Text>
          </Group>
        </Stack>

        {/* Дополнительные услуги */}
        <Group gap="xs">
          {includes.transport && (
            <Badge leftSection={<IconCar size={12} />} size="xs" variant="light" color="blue">
              Транспорт
            </Badge>
          )}
          {includes.food && (
            <Badge leftSection={<IconCoffee size={12} />} size="xs" variant="light" color="orange">
              Питание
            </Badge>
          )}
          {includes.tickets && (
            <Badge leftSection={<IconTicket size={12} />} size="xs" variant="light" color="green">
              Билеты
            </Badge>
          )}
          {suitable_for_children && (
            <Badge leftSection={<IconBabyCarriage size={12} />} size="xs" variant="light" color="pink">
              Для детей
            </Badge>
          )}
        </Group>

        {/* Цена и кнопка */}
        <Group justify="space-between" align="center" mt="auto">
          <Stack gap={0}>
            <Text size="xl" fw={700} c="blue.6">
              {price}
            </Text>
            <Text size="xs" c="dimmed">
              за человека
            </Text>
          </Stack>

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
