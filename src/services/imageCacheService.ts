// Сервис для кэширования изображений во время сборки

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";

interface ImageCache {
  [key: string]: {
    url: string;
    formats: {
      thumbnail: string;
      small: string;
      medium: string;
      large: string;
    };
    timestamp: number;
  };
}

// Кэш изображений в памяти (для времени сборки)
const imageCache: ImageCache = {};

// Функция для оптимизации URL изображения
export function getOptimizedImageUrl(
  imageUrl: string,
  format: "thumbnail" | "small" | "medium" | "large" = "large"
): string {
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  const baseUrl = `${API_URL}${imageUrl}`;
  const width =
    format === "thumbnail"
      ? 150
      : format === "small"
        ? 300
        : format === "medium"
          ? 600
          : 1200;

  return `${baseUrl}?format=webp&width=${width}&quality=${format === "thumbnail" ? 60 : 85}`;
}

// Функция для предзагрузки изображения
export async function preloadImage(imageUrl: string): Promise<void> {
  try {
    const response = await fetch(getOptimizedImageUrl(imageUrl, "medium"), {
      // Добавляем таймаут для предотвращения зависания
      signal: AbortSignal.timeout(10000), // 10 секунд таймаут
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Сохраняем в кэш
    const cacheKey = imageUrl;
    imageCache[cacheKey] = {
      url: imageUrl,
      formats: {
        thumbnail: getOptimizedImageUrl(imageUrl, "thumbnail"),
        small: getOptimizedImageUrl(imageUrl, "small"),
        medium: getOptimizedImageUrl(imageUrl, "medium"),
        large: getOptimizedImageUrl(imageUrl, "large"),
      },
      timestamp: Date.now(),
    };

    console.log(`✅ Preloaded image: ${imageUrl}`);
  } catch (error) {
    // Логируем ошибку, но не прерываем процесс
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.warn(`⚠️ Failed to preload image ${imageUrl}: ${errorMessage}`);
  }
}

// Функция для предзагрузки всех изображений недвижимости
export async function preloadPropertyImages(property: {
  title: string;
  images?: Array<{ url: string }>;
}): Promise<void> {
  if (!property.images || property.images.length === 0) {
    return;
  }

  console.log(
    `🖼️ Preloading ${property.images.length} images for property: ${property.title}`
  );

  // Предзагружаем все изображения
  const imagesToPreload = property.images;

  const preloadPromises = imagesToPreload.map((image: { url: string }) =>
    preloadImage(image.url)
  );

  await Promise.allSettled(preloadPromises);
}

// Функция для получения кэшированного URL
export function getCachedImageUrl(
  imageUrl: string,
  format: "thumbnail" | "small" | "medium" | "large" = "large"
): string {
  const cacheKey = imageUrl;
  const cached = imageCache[cacheKey];

  if (cached) {
    return cached.formats[format];
  }

  // Если нет в кэше, возвращаем оптимизированный URL
  return getOptimizedImageUrl(imageUrl, format);
}

// Функция для очистки старых записей кэша (старше 1 часа)
export function cleanupImageCache(): void {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;

  Object.keys(imageCache).forEach((key) => {
    if (imageCache[key].timestamp < oneHourAgo) {
      delete imageCache[key];
    }
  });
}

// Экспортируем кэш для отладки
export { imageCache };
