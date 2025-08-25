#!/usr/bin/env node

/**
 * Универсальный скрипт для предзагрузки всех изображений
 * Поддерживает все типы контента: апартаменты, блоги, туры, машины
 */

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// Конфигурация для разных типов контента
const contentConfig = {
  properties: {
    apiPath: "/properties",
    imageField: "images",
    maxImages: 3,
    title: "Properties",
  },
  blogs: {
    apiPath: "/blog-posts",
    imageField: "images",
    maxImages: 2,
    title: "Blog Posts",
  },
  tours: {
    apiPath: "/tours",
    imageField: "images",
    maxImages: 3,
    title: "Tours",
  },
  cars: {
    apiPath: "/cars",
    imageField: "images",
    maxImages: 3,
    title: "Cars",
  },
};

async function fetchAllContent(contentType) {
  try {
    const config = contentConfig[contentType];
    const response = await fetch(
      `${API_URL}/api${config.apiPath}?populate=*&pagination[pageSize]=1000`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${contentType}: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching ${contentType}:`, error);
    return [];
  }
}

function getOptimizedImageUrl(imageUrl, format = "medium") {
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  const width =
    format === "thumbnail"
      ? 150
      : format === "small"
        ? 300
        : format === "medium"
          ? 600
          : 1200;
  return `${API_URL}${imageUrl}?format=webp&width=${width}&quality=${format === "thumbnail" ? 60 : 85}`;
}

async function preloadImage(imageUrl) {
  try {
    const optimizedUrl = getOptimizedImageUrl(imageUrl, "medium");
    const response = await fetch(optimizedUrl, {
      signal: AbortSignal.timeout(10000), // 10 секунд таймаут
    });

    if (!response.ok) {
      throw new Error(`Failed to preload image: ${response.status}`);
    }

    console.log(`✅ Preloaded: ${imageUrl}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Failed to preload ${imageUrl}:`, error.message);
    return false;
  }
}

async function preloadContentImages(content, contentType) {
  const config = contentConfig[contentType];
  const images = content[config.imageField];

  if (!images || images.length === 0) {
    return 0;
  }

  console.log(
    `\n🖼️ Preloading ${images.length} images for ${contentType}: ${content.title || content.name}`
  );

  // Предзагружаем ограниченное количество изображений
  const imagesToPreload = images.slice(0, config.maxImages);

  const results = await Promise.allSettled(
    imagesToPreload.map((image) => preloadImage(image.url))
  );

  const successCount = results.filter(
    (result) => result.status === "fulfilled" && result.value
  ).length;

  console.log(
    `📊 Successfully preloaded ${successCount}/${imagesToPreload.length} images`
  );

  return successCount;
}

async function main() {
  console.log("🚀 Starting universal image preloading...");
  console.log(`📡 API URL: ${API_URL}`);

  const contentTypeKeys = Object.keys(contentConfig);
  let totalImages = 0;
  let totalPreloaded = 0;

  for (const contentType of contentTypeKeys) {
    console.log(`\n📂 Processing ${contentConfig[contentType].title}...`);

    const content = await fetchAllContent(contentType);
    console.log(`🏠 Found ${content.length} ${contentType}`);

    if (content.length === 0) {
      console.log(`⚠️ No ${contentType} found, skipping...`);
      continue;
    }

    let contentTypeImages = 0;
    let contentTypePreloaded = 0;

    for (const item of content) {
      if (
        item[contentConfig[contentType].imageField] &&
        item[contentConfig[contentType].imageField].length > 0
      ) {
        const config = contentConfig[contentType];
        contentTypeImages += Math.min(
          item[config.imageField].length,
          config.maxImages
        );

        const results = await Promise.allSettled(
          item[config.imageField]
            .slice(0, config.maxImages)
            .map((image) => preloadImage(image.url))
        );

        contentTypePreloaded += results.filter(
          (result) => result.status === "fulfilled" && result.value
        ).length;
      }
    }

    totalImages += contentTypeImages;
    totalPreloaded += contentTypePreloaded;

    console.log(
      `📊 ${contentConfig[contentType].title}: ${contentTypePreloaded}/${contentTypeImages} images preloaded`
    );
  }

  console.log("\n🎉 Universal image preloading completed!");
  console.log(`📊 Total images processed: ${totalImages}`);
  console.log(`✅ Successfully preloaded: ${totalPreloaded}`);
  console.log(`❌ Failed to preload: ${totalImages - totalPreloaded}`);

  if (totalPreloaded > 0) {
    console.log("✨ All images are now cached and ready for fast loading!");
  }
}

// Запускаем скрипт
if (require.main === module) {
  main().catch((error) => {
    console.error(
      "⚠️ Universal image preloading script failed:",
      error.message
    );
    console.log("🔄 Continuing with build process...");
    // Не завершаем процесс, позволяем сборке продолжиться
  });
}

module.exports = { preloadImage, preloadContentImages };
