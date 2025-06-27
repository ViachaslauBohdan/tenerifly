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
  ThemeIcon,
  SimpleGrid
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { 
  IconHome, 
  IconBed, 
  IconBath, 
  IconCar,
  IconBrandWhatsapp,
  IconArrowLeft,
  IconCalendar,
  IconMapPin,
  IconPhone,
  IconMail,
  IconShare,
  IconStar,
  IconCheck,
  IconX,
  IconRuler,
  IconBuilding
} from '@tabler/icons-react';
import { useTranslation } from '@/hooks/useTranslation';
import { openWhatsApp } from '@/utils/whatsapp';
import { propertiesAPI } from '@/services/api';
import { Property } from '@/types/strapi';
import { Locale } from '@/types/locale';

interface PropertyDetailClientProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export function PropertyDetailClient({ params }: PropertyDetailClientProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [propertyId, setPropertyId] = useState<string>('');
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    params.then(({ locale, id }) => {
      setCurrentLocale(locale);
      setPropertyId(id);
    });
  }, [params]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId || !currentLocale) return;
      
      try {
        setLoading(true);
        const response = await propertiesAPI.getById(parseInt(propertyId), currentLocale);
        setProperty(response.data);
      } catch (err) {
        setError('Недвижимость не найдена');
        console.error('Error fetching property:', err);
      } finally {
        setLoading(false);
      }
    };

    if (mounted && propertyId && currentLocale) {
      fetchProperty();
    }
  }, [mounted, propertyId, currentLocale]);

  if (!mounted || loading) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center">Загрузка...</Text>
      </Container>
    );
  }

  if (error || !property) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center" c="red">{error || 'Недвижимость не найдена'}</Text>
        <Group justify="center" mt="md">
          <Button onClick={() => router.push(`/${currentLocale}/accommodation`)}>
            Вернуться к недвижимости
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

  const getStatusColor = (status: Property['property_status']) => {
    const colors: Record<Property['property_status'], string> = {
      available: 'green',
      reserved: 'yellow',
      sold: 'red',
      under_contract: 'orange',
    };
    return colors[status];
  };

  const getStatusLabel = (status: Property['property_status']) => {
    const labels: Record<Property['property_status'], string> = {
      available: 'Доступно',
      reserved: 'Забронировано',
      sold: 'Продано',
      under_contract: 'Под договором',
    };
    return labels[status];
  };

  const getCategoryLabel = (category: Property['category']) => {
    const labels: Record<Property['category'], string> = {
      apartment: 'Квартира',
      house: 'Дом',
      villa: 'Вилла',
      penthouse: 'Пентхаус',
      studio: 'Студия',
      commercial: 'Коммерческая',
      land: 'Участок',
      building: 'Здание',
    };
    return labels[category] || category;
  };

  return (
    <Container size="xl" py="xl">
      <Button
        variant="light"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.push(`/${currentLocale}/accommodation`)}
        mb="xl"
      >
        {t.common?.backToHome || 'Назад к недвижимости'}
      </Button>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder p="lg">
            <Group justify="space-between" align="flex-start" mb="md">
              <Title order={1}>{property.title}</Title>
              <Group gap="xs">
                <ActionIcon variant="light" onClick={shareUrl}>
                  <IconShare size={16} />
                </ActionIcon>
                <Badge color={getStatusColor(property.property_status)} variant="light" size="lg">
                  {getStatusLabel(property.property_status)}
                </Badge>
              </Group>
            </Group>
            
            {/* Галерея изображений */}
            <Carousel withIndicators height={400} mb="lg">
              {property.images && property.images.length > 0 ? (
                property.images.map((image, index) => (
                  <Carousel.Slide key={index}>
                    <Image
                      src={image.url}
                      alt={`${property.title} - Изображение ${index + 1}`}
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
                    alt={property.title}
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
                <Tabs.Tab value="features">Удобства</Tabs.Tab>
                <Tabs.Tab value="terms">Условия</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="lg">
                <Stack gap="md">
                  <Text size="lg">{property.description || 'Описание отсутствует'}</Text>
                  
                  <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
                    <Group gap="xs">
                      <IconBed size={20} />
                      <Text fw={500}>Спальни:</Text>
                      <Text>{property.specifications?.bedrooms || 0}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconBath size={20} />
                      <Text fw={500}>Ванные:</Text>
                      <Text>{property.specifications?.bathrooms || 0}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconRuler size={20} />
                      <Text fw={500}>Площадь:</Text>
                      <Text>{property.specifications?.total_area || 0} м²</Text>
                    </Group>
                    <Group gap="xs">
                      <IconBuilding size={20} />
                      <Text fw={500}>Этаж:</Text>
                      <Text>
                        {property.specifications?.floor || 0}/
                        {property.specifications?.total_floors || 0}
                      </Text>
                    </Group>
                  </SimpleGrid>

                  {property.location && (
                    <Group gap="xs" mt="md">
                      <IconMapPin size={20} />
                      <Text fw={500}>Адрес:</Text>
                      <Text>{property.location.address}, {property.location.city}</Text>
                    </Group>
                  )}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="specifications" pt="lg">
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text fw={500}>Общая площадь:</Text>
                        <Text>{property.specifications?.total_area || 0} м²</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Жилая площадь:</Text>
                        <Text>{property.specifications?.living_area || 0} м²</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Спальни:</Text>
                        <Text>{property.specifications?.bedrooms || 0}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Ванные комнаты:</Text>
                        <Text>{property.specifications?.bathrooms || 0}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Этаж:</Text>
                        <Text>
                          {property.specifications?.floor || 0} из {property.specifications?.total_floors || 0}
                        </Text>
                      </Group>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text fw={500}>Год постройки:</Text>
                        <Text>{property.specifications?.year_built || 'Не указано'}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Парковочные места:</Text>
                        <Text>{property.specifications?.parking_spaces || 0}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Меблировано:</Text>
                        <Text>{property.specifications?.furnished ? 'Да' : 'Нет'}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Категория:</Text>
                        <Text>{getCategoryLabel(property.category)}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Тип:</Text>
                        <Text>{property.type === 'rent' ? 'Аренда' : 'Продажа'}</Text>
                      </Group>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>

              <Tabs.Panel value="features" pt="lg">
                {property.features ? (
                  <SimpleGrid cols={{ base: 2, md: 3 }} spacing="md">
                    {property.features.air_conditioning && (
                      <Group gap="xs">
                        <ThemeIcon color="green" size={20} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                        <Text size="sm">Кондиционер</Text>
                      </Group>
                    )}
                    {property.features.heating && (
                      <Group gap="xs">
                        <ThemeIcon color="green" size={20} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                        <Text size="sm">Отопление</Text>
                      </Group>
                    )}
                    {property.features.internet && (
                      <Group gap="xs">
                        <ThemeIcon color="green" size={20} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                        <Text size="sm">Интернет</Text>
                      </Group>
                    )}
                    {property.features.pool && (
                      <Group gap="xs">
                        <ThemeIcon color="green" size={20} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                        <Text size="sm">Бассейн</Text>
                      </Group>
                    )}
                    {property.features.garden && (
                      <Group gap="xs">
                        <ThemeIcon color="green" size={20} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                        <Text size="sm">Сад</Text>
                      </Group>
                    )}
                    {property.features.terrace && (
                      <Group gap="xs">
                        <ThemeIcon color="green" size={20} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                        <Text size="sm">Терраса</Text>
                      </Group>
                    )}
                    {property.features.garage && (
                      <Group gap="xs">
                        <ThemeIcon color="green" size={20} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                        <Text size="sm">Гараж</Text>
                      </Group>
                    )}
                    {property.features.elevator && (
                      <Group gap="xs">
                        <ThemeIcon color="green" size={20} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                        <Text size="sm">Лифт</Text>
                      </Group>
                    )}
                    {property.features.security && (
                      <Group gap="xs">
                        <ThemeIcon color="green" size={20} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                        <Text size="sm">Охрана</Text>
                      </Group>
                    )}
                    {property.features.washing_machine && (
                      <Group gap="xs">
                        <ThemeIcon color="green" size={20} radius="xl">
                          <IconCheck size={12} />
                        </ThemeIcon>
                        <Text size="sm">Стиральная машина</Text>
                      </Group>
                    )}
                  </SimpleGrid>
                ) : (
                  <Text>Информация об удобствах отсутствует</Text>
                )}
              </Tabs.Panel>

              <Tabs.Panel value="terms" pt="lg">
                <Stack gap="md">
                  {property.type === 'rent' && property.rental_terms && (
                    <>
                      <Title order={4}>Условия аренды</Title>
                      <Group justify="space-between">
                        <Text fw={500}>Мин. срок аренды:</Text>
                        <Text>{(property.rental_terms as any).minimum_stay || (property.rental_terms as any).min_rental_period || 1} дней</Text>
                      </Group>
                      {(property.rental_terms as any).maximum_stay && (
                        <Group justify="space-between">
                          <Text fw={500}>Макс. срок аренды:</Text>
                          <Text>{(property.rental_terms as any).maximum_stay} дней</Text>
                        </Group>
                      )}
                      {property.rental_terms.deposit_amount && (
                        <Group justify="space-between">
                          <Text fw={500}>Залог:</Text>
                          <Text>€{property.rental_terms.deposit_amount}</Text>
                        </Group>
                      )}
                      <Group justify="space-between">
                        <Text fw={500}>Домашние животные:</Text>
                        <Text>{property.rental_terms.pets_allowed ? 'Разрешены' : 'Не разрешены'}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Курение:</Text>
                        <Text>{property.rental_terms.smoking_allowed ? 'Разрешено' : 'Не разрешено'}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Коммунальные услуги:</Text>
                        <Text>{property.rental_terms.utilities_included ? 'Включены' : 'Не включены'}</Text>
                      </Group>
                    </>
                  )}
                  
                  {property.type === 'sale' && property.sale_terms && (
                    <>
                      <Title order={4}>Условия продажи</Title>
                      {(property.sale_terms as any).legal_info && (
                        <div>
                          <Text fw={500} mb="xs">Правовая информация:</Text>
                          <Text size="sm" c="dimmed">{(property.sale_terms as any).legal_info}</Text>
                        </div>
                      )}
                      {(property.sale_terms as any).additional_terms && (
                        <div>
                          <Text fw={500} mb="xs">Дополнительные условия:</Text>
                          <Text size="sm" c="dimmed">{(property.sale_terms as any).additional_terms}</Text>
                        </div>
                      )}
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
                    €{property.price?.amount || 0}
                    {property.price?.period === 'month' ? '/мес' : 
                     property.price?.period === 'day' ? '/день' : ''}
                  </Text>
                  <Badge color={getStatusColor(property.property_status)} variant="light">
                    {getStatusLabel(property.property_status)}
                  </Badge>
                </Stack>
              </Group>

              <Divider />

              <Stack gap="sm">
                <Text fw={500}>Детали недвижимости:</Text>
                <Group justify="space-between">
                  <Text size="sm">Тип:</Text>
                  <Text size="sm" fw={500}>{property.type === 'rent' ? 'Аренда' : 'Продажа'}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Категория:</Text>
                  <Text size="sm" fw={500}>{getCategoryLabel(property.category)}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Площадь:</Text>
                  <Text size="sm" fw={500}>{property.specifications?.total_area || 0} м²</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Спальни:</Text>
                  <Text size="sm" fw={500}>{property.specifications?.bedrooms || 0}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Ванные:</Text>
                  <Text size="sm" fw={500}>{property.specifications?.bathrooms || 0}</Text>
                </Group>
              </Stack>

              <Divider />

              {property.contact && (
                <Stack gap="sm">
                  {property.contact.phone && (
                    <Group gap="xs">
                      <IconPhone size={16} />
                      <Text size="sm">{property.contact.phone}</Text>
                    </Group>
                  )}
                  {property.contact.email && (
                    <Group gap="xs">
                      <IconMail size={16} />
                      <Text size="sm">{property.contact.email}</Text>
                    </Group>
                  )}
                  {property.location && (
                    <Group gap="xs">
                      <IconMapPin size={16} />
                      <Text size="sm">{property.location.address}</Text>
                    </Group>
                  )}
                </Stack>
              )}

              {property.property_status === 'available' && (
                <>
                  <Button
                    fullWidth
                    size="lg"
                    leftSection={<IconBrandWhatsapp size={20} />}
                    color="green"
                    onClick={() => openWhatsApp('accommodation', {
                      title: property.title,
                      price: `€${property.price?.amount || 0}`
                    }, currentLocale)}
                  >
                    {property.type === 'rent' ? 'Забронировать' : 'Узнать подробности'}
                  </Button>

                  <Button
                    fullWidth
                    variant="light"
                    leftSection={<IconCalendar size={20} />}
                  >
                    Запросить просмотр
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