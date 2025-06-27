'use client';

import { useState, useEffect } from 'react';
import { Container, Grid, Title, Text, Card, Image, Badge, Group, Stack, Button } from '@mantine/core';
import { IconCalendar, IconUser, IconClock, IconEye } from '@tabler/icons-react';
import { BackToHome } from '@/components/BackToHome';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { Locale } from '@/types/locale';
import { blogAPI } from '@/services/api';
import { BlogPost } from '@/types/strapi';

interface BlogPageClientProps {
  params: Promise<{ locale: Locale }>;
}

export function BlogPageClient({ params }: BlogPageClientProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    params.then(({ locale }) => {
      setCurrentLocale(locale);
    });
  }, [params]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!currentLocale) return;
      
      try {
        setLoading(true);
        const response = await blogAPI.getAll(currentLocale);
        setPosts(response.data || []);
      } catch (err) {
        setError('Не удалось загрузить статьи');
        console.error('Error fetching blog posts:', err);
        
        // Fallback к мок-данным
        const response = await blogAPI.getAll(currentLocale);
        setPosts(response.data || []);
      } finally {
        setLoading(false);
      }
    };

    if (mounted && currentLocale) {
      fetchPosts();
    }
  }, [mounted, currentLocale]);

  if (!mounted || loading) {
    return (
      <Container size="xl" py="xl">
        <Text ta="center">Загрузка...</Text>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLocale === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Исправляем проверку featured статьи
  const featuredPost = posts.find(post => post.featured || (post as any).is_featured);
  const regularPosts = posts.filter(post => !post.featured && !(post as any).is_featured);

  return (
    <Container size="xl" py="xl">
      <BackToHome />
      
      <Title order={1} mb="xl" ta="center" className="gradient-text">
        {t.blog?.title || 'Блог'}
      </Title>

      {error && (
        <Text c="red" ta="center" mb="xl">{error}</Text>
      )}

      {/* Главная статья */}
      {featuredPost && (
        <Card withBorder radius="xl" mb="xl" p={0} className="glass-effect">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Image
                src={featuredPost.featured_image?.url || '/placeholder.jpg'}
                height={400}
                alt={featuredPost.title}
                radius="xl"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack p="xl" h="100%" justify="space-between">
                <div>
                  <Badge color="blue" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} mb="md" size="lg">
                    ⭐ Рекомендуемая статья
                  </Badge>
                  <Title order={2} mb="md" className="gradient-text">
                    {featuredPost.title}
                  </Title>
                  <Text c="dimmed" mb="md" size="lg">
                    {(featuredPost as any).excerpt || featuredPost.description}
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
                    size="lg"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                    leftSection={<IconEye size={20} />}
                    onClick={() => router.push(`/${currentLocale}/blog/${featuredPost.slug}`)}
                  >
                    {t.blog?.readMore || 'Читать далее'}
                  </Button>
                </div>
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>
      )}

      {/* Остальные статьи */}
      {regularPosts.length > 0 && (
        <>
          <Title order={2} mb="xl" ta="center">
            Другие статьи
          </Title>
          <Grid>
            {regularPosts.map((post) => (
              <Grid.Col key={post.id} span={{ base: 12, sm: 6, md: 4 }}>
                <Card withBorder radius="xl" h="100%" className="glass-effect">
                  <Card.Section>
                    <Image
                      src={post.featured_image?.url || '/placeholder.jpg'}
                      height={200}
                      alt={post.title}
                    />
                  </Card.Section>

                  <Stack mt="md" h="100%" justify="space-between">
                    <div>
                      <Title order={3} size="h4" mb="md" lineClamp={2}>
                        {post.title}
                      </Title>
                      <Text size="sm" c="dimmed" mb="md" lineClamp={3}>
                        {(post as any).excerpt || post.description}
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
                      
                      {post.tags && post.tags.length > 0 && (
                        <Group gap="xs" mb="md">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="light" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </Group>
                      )}
                      
                      <Button
                        variant="light"
                        fullWidth
                        leftSection={<IconEye size={16} />}
                        onClick={() => router.push(`/${currentLocale}/blog/${post.slug}`)}
                      >
                        {t.blog?.readMore || 'Читать далее'}
                      </Button>
                    </div>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </>
      )}

      {posts.length === 0 && !loading && (
        <Text ta="center" py="xl" size="lg" c="dimmed">
          Статьи не найдены
        </Text>
      )}
    </Container>
  );
}