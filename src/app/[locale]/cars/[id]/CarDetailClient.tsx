'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Title, 
  Text, 
  Grid, 
  Card, 
  Badge, 
  Group, 
  Stack, 
  Button,
  Image,
  Tabs,
  List,
  Divider,
  ActionIcon,
  ThemeIcon
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { 
  IconCar, 
  IconGasStation, 
  IconGauge, 
  IconUsers, 
  IconBrandWhatsapp,
  IconArrowLeft,
  IconCalendar,
  IconMapPin,
  IconPhone,
  IconMail,
  IconShare,
  IconStar,
  IconCheck
} from '@tabler/icons-react';
import { useTranslation } from '@/hooks/useTranslation';
import { openWhatsApp } from '@/utils/whatsapp';
import { carsAPI } from '@/services/api';
import { Car } from '@/types/strapi';
import { Locale } from '@/types/locale';

interface CarDetailClientProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export function CarDetailClient({ params }: CarDetailClientProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [carId, setCarId] = useState<string>('');
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    params.then(({ locale, id }) => {
      setCurrentLocale(locale);
      setCarId(id);
    });
  }, [params]);

  useEffect(() => {
    const fetchCar = async () => {
      if (!carId || !currentLocale) return;
      
      try {
        setLoading(true);
        const response = await carsAPI.getById(parseInt(carId), currentLocale);
        setCar(response.data);
      } catch (err) {
        setError('Автомобиль не найден');
        console.error('Error fetching car:', err);
      } finally {
        setLoading(false);
      }
    };

    if (mounted && carId && currentLocale) {
      fetchCar();
    }
  }, [mounted, carId, currentLocale]);

  if (!mounted || loading) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center">Загрузка...</Text>
      </Container>
    );
  }

  if (error || !car) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center" c="red">{error || 'Автомобиль не найден'}</Text>
        <Group justify="center" mt="md">
          <Button onClick={() => router.push(`/${currentLocale}/cars`)}>
            Вернуться к автомобилям
          </Button>
        </Group>
      </Container>
    );
  }

  const shareUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getStatusColor = (status: Car['car_status']) => {
    const colors: Record<Car['car_status'], string> = {
      available: 'green',
      reserved: 'yellow',
      sold: 'red',
      maintenance: 'orange',
    };
    return colors[status];
  };

  const getStatusLabel = (status: Car['car_status']) => {
    const labels: Record<Car['car_status'], string> = {
      available: 'Доступен',
      reserved: 'Забронирован',
      sold: 'Продан',
      maintenance: 'На обслуживании',
    };
    return labels[status];
  };

  return (
    <Container size="xl" py="xl">
      <Button
        variant="light"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.push(`/${currentLocale}/cars`)}
        mb="xl"
      >
        Вернуться к автомобилям
      </Button>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="lg">
            <Group justify="space-between" align="flex-start" mb="md">
              <Title order={1}>{car.title}</Title>
              <Group gap="xs">
                <ActionIcon variant="light" onClick={shareUrl}>
                  <IconShare size={16} />
                </ActionIcon>
                <Badge color={getStatusColor(car.car_status)} variant="light" size="lg">
                  {getStatusLabel(car.car_status)}
                </Badge>
              </Group>
            </Group>
            
            {/* Галерея изображений */}
            <Carousel withIndicators height={400} mb="lg">
              {car.images && car.images.length > 0 ? (
                car.images.map((image, index) => (
                  <Carousel.Slide key={index}>
                    <Image
                      src={image.url}
                      alt={`${car.title} - Изображение ${index + 1}`}
                      height={400}
                      fit="cover"
                      radius="md"
                    />
                  </Carousel.Slide>
                ))
              ) : (
                <Carousel.Slide>
                  <Image
                    src="/placeholder.jpg"
                    alt={car.title}
                    height={400}
                    fit="cover"
                    radius="md"
                  />
                </Carousel.Slide>
              )}
            </Carousel>

            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview">Обзор</Tabs.Tab>
                <Tabs.Tab value="specifications">Характеристики</Tabs.Tab>
                <Tabs.Tab value="features">Опции</Tabs.Tab>
                <Tabs.Tab value="terms">Условия</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="lg">
                <Stack gap="md">
                  <Text size="lg">{car.description || 'Описание отсутствует'}</Text>
                  
                  <Grid>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconCar size={20} />
                        <Text fw={500}>Марка:</Text>
                        <Text>{car.specifications?.make}</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconCar size={20} />
                        <Text fw={500}>Модель:</Text>
                        <Text>{car.specifications?.model}</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconCalendar size={20} />
                        <Text fw={500}>Год:</Text>
                        <Text>{car.specifications?.year}</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <IconGauge size={20} />
                        <Text fw={500}>Пробег:</Text>
                        <Text>{car.specifications?.mileage} км</Text>
                      </Group>
                    </Grid.Col>
                  </Grid>

                  {car.location && (
                    <Group gap="xs" mt="md">
                      <IconMapPin size={20} />
                      <Text fw={500}>Местоположение:</Text>
                      <Text>{car.location.address}, {car.location.city}</Text>
                    </Group>
                  )}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="specifications" pt="lg">
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text fw={500}>Марка:</Text>
                        <Text>{car.specifications?.make}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Модель:</Text>
                        <Text>{car.specifications?.model}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Год выпуска:</Text>
                        <Text>{car.specifications?.year}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Пробег:</Text>
                        <Text>{car.specifications?.mileage} км</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Топливо:</Text>
                        <Text>{car.specifications?.fuel || 'Не указано'}</Text>
                      </Group>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text fw={500}>Коробка передач:</Text>
                        <Text>{car.specifications?.transmission || 'Не указано'}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Мощность:</Text>
                        <Text>{car.specifications?.power || 'Не указано'}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Места:</Text>
                        <Text>{car.specifications?.seats || 0}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Двери:</Text>
                        <Text>{car.specifications?.doors || 0}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Цвет:</Text>
                        <Text>{car.specifications?.color || 'Не указан'}</Text>
                      </Group>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>

              <Tabs.Panel value="features" pt="lg">
                {car.features ? (
                  <Grid>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <ThemeIcon color={car.features.air_conditioning ? "green" : "red"} size={20} radius="xl">
                          {car.features.air_conditioning ? <IconCheck size={12} /> : <IconStar size={12} />}
                        </ThemeIcon>
                        <Text size="sm">Кондиционер</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <ThemeIcon color={car.features.navigation ? "green" : "red"} size={20} radius="xl">
                          {car.features.navigation ? <IconCheck size={12} /> : <IconStar size={12} />}
                        </ThemeIcon>
                        <Text size="sm">Навигация</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <ThemeIcon color={car.features.bluetooth ? "green" : "red"} size={20} radius="xl">
                          {car.features.bluetooth ? <IconCheck size={12} /> : <IconStar size={12} />}
                        </ThemeIcon>
                        <Text size="sm">Bluetooth</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <ThemeIcon color={car.features.parking_sensors ? "green" : "red"} size={20} radius="xl">
                          {car.features.parking_sensors ? <IconCheck size={12} /> : <IconStar size={12} />}
                        </ThemeIcon>
                        <Text size="sm">Парктроник</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <ThemeIcon color={car.features.backup_camera ? "green" : "red"} size={20} radius="xl">
                          {car.features.backup_camera ? <IconCheck size={12} /> : <IconStar size={12} />}
                        </ThemeIcon>
                        <Text size="sm">Камера заднего вида</Text>
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group gap="xs">
                        <ThemeIcon color={car.features.cruise_control ? "green" : "red"} size={20} radius="xl">
                          {car.features.cruise_control ? <IconCheck size={12} /> : <IconStar size={12} />}
                        </ThemeIcon>
                        <Text size="sm">Круиз-контроль</Text>
                      </Group>
                    </Grid.Col>
                  </Grid>
                ) : (
                  <Text>Информация об опциях отсутствует</Text>
                )}
              </Tabs.Panel>

              <Tabs.Panel value="terms" pt="lg">
                <Stack gap="md">
                  {car.type === 'rent' && car.rental_terms && (
                    <>
                      <Title order={4}>Условия аренды</Title>
                      <Group justify="space-between">
                        <Text fw={500}>Мин. срок аренды:</Text>
                        <Text>{car.rental_terms.min_rental_period || 1} дней</Text>
                      </Group>
                      {car.rental_terms.deposit_amount && (
                        <Group justify="space-between">
                          <Text fw={500}>Залог:</Text>
                          <Text>€{car.rental_terms.deposit_amount}</Text>
                        </Group>
                      )}
                      <Group justify="space-between">
                        <Text fw={500}>Страховка включена:</Text>
                        <Text>{car.rental_terms.insurance_included ? 'Да' : 'Нет'}</Text>
                      </Group>
                      {car.rental_terms.mileage_limit && (
                        <Group justify="space-between">
                          <Text fw={500}>Лимит пробега:</Text>
                          <Text>{car.rental_terms.mileage_limit} км/день</Text>
                        </Group>
                      )}
                    </>
                  )}
                  
                  {car.type === 'sale' && car.sale_terms && (
                    <>
                      <Title order={4}>Условия продажи</Title>
                      <Group justify="space-between">
                        <Text fw={500}>Гарантия:</Text>
                        <Text>{car.sale_terms.warranty_included ? 'Включена' : 'Не включена'}</Text>
                      </Group>
                      {car.sale_terms.warranty_duration && (
                        <Group justify="space-between">
                          <Text fw={500}>Срок гарантии:</Text>
                          <Text>{car.sale_terms.warranty_duration} месяцев</Text>
                        </Group>
                      )}
                      <Group justify="space-between">
                        <Text fw={500}>Кредит доступен:</Text>
                        <Text>{car.sale_terms.financing_available ? 'Да' : 'Нет'}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Trade-in:</Text>
                        <Text>{car.sale_terms.trade_in_accepted ? 'Принимается' : 'Не принимается'}</Text>
                      </Group>
                    </>
                  )}
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Grid.Col>

        {/* Боковая панель с бронированием */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder p="lg" pos="sticky" style={{ top: 20 }}>
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs">
                  <Text size="xl" fw={700} c="blue">
                    €{car.price?.amount || 0}
                    {car.price?.period === 'day' ? '/день' : ''}
                  </Text>
                  <Badge color={getStatusColor(car.car_status)} variant="light">
                    {getStatusLabel(car.car_status)}
                  </Badge>
                </Stack>
              </Group>

              <Divider />

              <Stack gap="sm">
                <Text fw={500}>Детали автомобиля:</Text>
                <Group justify="space-between">
                  <Text size="sm">Тип:</Text>
                  <Text size="sm" fw={500}>{car.type === 'rent' ? 'Аренда' : 'Продажа'}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Марка:</Text>
                  <Text size="sm" fw={500}>{car.specifications?.make}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Модель:</Text>
                  <Text size="sm" fw={500}>{car.specifications?.model}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Год:</Text>
                  <Text size="sm" fw={500}>{car.specifications?.year}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Пробег:</Text>
                  <Text size="sm" fw={500}>{car.specifications?.mileage} км</Text>
                </Group>
              </Stack>

              <Divider />

              {car.contact && (
                <Stack gap="sm">
                  {car.contact.phone && (
                    <Group gap="xs">
                      <IconPhone size={16} />
                      <Text size="sm">{car.contact.phone}</Text>
                    </Group>
                  )}
                  {car.contact.email && (
                    <Group gap="xs">
                      <IconMail size={16} />
                      <Text size="sm">{car.contact.email}</Text>
                    </Group>
                  )}
                  {car.location && (
                    <Group gap="xs">
                      <IconMapPin size={16} />
                      <Text size="sm">{car.location.address}</Text>
                    </Group>
                  )}
                </Stack>
              )}

              {car.car_status === 'available' && (
                <>
                  <Button
                    fullWidth
                    size="lg"
                    leftSection={<IconBrandWhatsapp size={20} />}
                    color="green"
                    onClick={() => openWhatsApp('car', {
                      title: car.title,
                      price: `€${car.price?.amount || 0}`
                    }, currentLocale)}
                  >
                    {car.type === 'rent' ? 'Забронировать' : 'Узнать подробности'}
                  </Button>

                  <Button
                    fullWidth
                    variant="light"
                    leftSection={<IconCalendar size={20} />}
                  >
                    Запросить тест-драйв
                  </Button>
                </>
              )}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}