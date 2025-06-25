'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, Card, Image, Button, Badge, Group, Stack } from '@mantine/core';
import { IconCalendar, IconUser, IconClock } from '@tabler/icons-react';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/types/locale';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: {
    url: string;
  };
  author: string;
  reading_time: number;
  is_featured: boolean;
  createdAt: string;
  tags?: string[];
}

// Мок-данные для примера
const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Почему стоит посетить Тенерифе в 2025 году',
    slug: 'why-visit-tenerife-2025',
    excerpt: 'Тенерифе - это остров вечной весны, где каждый найдет что-то особенное. От вулканических пейзажей до прекрасных пляжей.',
    featured_image: {
      url: 'https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg'
    },
    author: 'Tenerifly Team',
    reading_time: 8,
    is_featured: true,
    createdAt: '2025-01-20T00:00:00.000Z',
    tags: ['Путешествия', 'Тенерифе', '2025']
  },
  {
    id: 2,
    title: 'Лучшие пляжи Тенерифе: полный гид',
    slug: 'best-beaches-tenerife-guide',
    excerpt: 'Откройте для себя самые красивые пляжи острова - от черных вулканических песков до золотистых бухт.',
    featured_image: {
      url: 'https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg'
    },
    author: 'Tenerifly Team',
    reading_time: 12,
    is_featured: false,
    createdAt: '2025-01-18T00:00:00.000Z',
    tags: ['Пляжи', 'Отдых']
  },
  {
    id: 3,
    title: 'Экскурсии на Тейде: что нужно знать',
    slug: 'teide-excursions-guide',
    excerpt: 'Полный гид по посещению самой высокой точки Испании. Советы, маршруты и лучшее время для визита.',
    featured_image: {
      url: 'https://res.cloudinary.com/dlnvckilf/image/upload/v1745227161/roques_de_garcia_pl_61b31e3ebb.webp'
    },
    author: 'Tenerifly Team',
    reading_time: 10,
    is_featured: false,
    createdAt: '2025-01-15T00:00:00.000Z',
    tags: ['Тейде', 'Экскурсии', 'Природа']
  }
];

interface BlogPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function BlogPage({ params }: BlogPageProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);

  useEffect(() => {
    setMounted(true);
    params.then(({ locale }) => {
      setCurrentLocale(locale);
    });
  }, [params]);

  if (!mounted) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLocale === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredPost = posts.find(post => post.is_featured);
  const regularPosts = posts.filter(post => !post.is_featured);

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      
      <Title order={1} mb="xl" ta="center">
        {t.blog.title}
      </Title>

      {/* Главная статья */}
      {featuredPost && (
        <Card withBorder radius="md" mb="xl" p={0}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Image
                src={featuredPost.featured_image?.url}
                height={400}
                alt={featuredPost.title}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack p="xl" h="100%" justify="space-between">
                <div>
                  <Badge color="blue" variant="light" mb="md">
                    Рекомендуемая статья
                  </Badge>
                  <Title order={2} mb="md">
                    {featuredPost.title}
                  </Title>
                  <Text c="dimmed" mb="md">
                    {featuredPost.excerpt}
                  </Text>
                </div>
                
                <div>
                  <Group gap="md" mb="md">
                    <Group gap="xs">
                      <IconUser size={16} />
                      <Text size="sm">{featuredPost.author}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconCalendar size={16} />
                      <Text size="sm">{formatDate(featuredPost.createdAt)}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconClock size={16} />
                      <Text size="sm">{featuredPost.reading_time} мин</Text>
                    </Group>
                  </Group>
                  
                  <Button
                    onClick={() => window.open(`/${currentLocale}/blog/${featuredPost.slug}`, '_self')}
                  >
                    {t.blog.readMore}
                  </Button>
                </div>
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>
      )}

      {/* Остальные статьи */}
      <Grid>
        {regularPosts.map((post) => (
          <Grid.Col key={post.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card withBorder radius="md" h="100%">
              <Card.Section>
                <Image
                  src={post.featured_image?.url}
                  height={200}
                  alt={post.title}
                />
              </Card.Section>

              <Stack mt="md" h="100%" justify="space-between">
                <div>
                  <Title order={3} size="h4" mb="md">
                    {post.title}
                  </Title>
                  <Text size="sm" c="dimmed" mb="md" lineClamp={3}>
                    {post.excerpt}
                  </Text>
                </div>

                <div>
                  <Group gap="md" mb="md">
                    <Group gap="xs">
                      <IconUser size={14} />
                      <Text size="xs">{post.author}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconClock size={14} />
                      <Text size="xs">{post.reading_time} мин</Text>
                    </Group>
                  </Group>
                  
                  <Text size="xs" c="dimmed" mb="md">
                    {formatDate(post.createdAt)}
                  </Text>
                  
                  <Button
                    variant="light"
                    fullWidth
                    onClick={() => window.open(`/${currentLocale}/blog/${post.slug}`, '_self')}
                  >
                    {t.blog.readMore}
                  </Button>
                </div>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}