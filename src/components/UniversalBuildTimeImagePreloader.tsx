// Универсальный компонент для предзагрузки изображений во время сборки
// Поддерживает все типы контента: апартаменты, блоги, туры, машины

import {
  preloadPropertyImages,
  preloadBlogImages,
  preloadTourImages,
  preloadCarImages,
  ContentType,
} from "@/services/universalImageCacheService";

interface UniversalBuildTimeImagePreloaderProps {
  content: {
    title: string;
    images?: Array<{ url: string }>;
  };
  contentType: ContentType;
}

export default async function UniversalBuildTimeImagePreloader({
  content,
  contentType,
}: UniversalBuildTimeImagePreloaderProps) {
  // Предзагружаем изображения только во время сборки (не критично для сборки)
  if (process.env.NODE_ENV === "production") {
    try {
      switch (contentType) {
        case "properties":
          await preloadPropertyImages(content);
          break;
        case "blogs":
          await preloadBlogImages(content);
          break;
        case "tours":
          await preloadTourImages(content);
          break;
        case "cars":
          await preloadCarImages(content);
          break;
        default:
          console.warn(`⚠️ Unknown content type: ${contentType}`);
      }
    } catch (error) {
      // Логируем ошибку, но не прерываем сборку
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.warn(
        `⚠️ Build-time image preloading failed for ${contentType}:`,
        errorMessage
      );
    }
  }

  return null; // Не рендерит ничего
}
