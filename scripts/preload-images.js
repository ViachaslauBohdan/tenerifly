#!/usr/bin/env node

/**
 * Скрипт для предзагрузки всех изображений недвижимости
 * Запускается перед сборкой для кэширования изображений
 */

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

async function fetchAllProperties() {
  try {
    const response = await fetch(
      `${API_URL}/api/properties?populate=*&pagination[pageSize]=1000`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching properties:", error);
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
    const response = await fetch(optimizedUrl);

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

async function preloadPropertyImages(property) {
  if (!property.images || property.images.length === 0) {
    return;
  }

  console.log(
    `\n🖼️ Preloading ${property.images.length} images for: ${property.title}`
  );

  // Предзагружаем первые 3 изображения
  const imagesToPreload = property.images.slice(0, 3);

  const results = await Promise.allSettled(
    imagesToPreload.map((image) => preloadImage(image.url))
  );

  const successCount = results.filter(
    (result) => result.status === "fulfilled" && result.value
  ).length;
  console.log(
    `📊 Successfully preloaded ${successCount}/${imagesToPreload.length} images`
  );
}

async function main() {
  console.log("🚀 Starting image preloading...");
  console.log(`📡 API URL: ${API_URL}`);

  const properties = await fetchAllProperties();
  console.log(`🏠 Found ${properties.length} properties`);

  if (properties.length === 0) {
    console.log("⚠️ No properties found, continuing without preloading...");
    return;
  }

  let totalImages = 0;
  let totalPreloaded = 0;

  for (const property of properties) {
    if (property.images && property.images.length > 0) {
      totalImages += Math.min(property.images.length, 3); // Первые 3 изображения

      const results = await Promise.allSettled(
        property.images.slice(0, 3).map((image) => preloadImage(image.url))
      );

      totalPreloaded += results.filter(
        (result) => result.status === "fulfilled" && result.value
      ).length;
    }
  }

  console.log("\n🎉 Image preloading completed!");
  console.log(`📊 Total images processed: ${totalImages}`);
  console.log(`✅ Successfully preloaded: ${totalPreloaded}`);
  console.log(`❌ Failed to preload: ${totalImages - totalPreloaded}`);

  if (totalPreloaded > 0) {
    console.log("✨ Images are now cached and ready for fast loading!");
  }
}

// Запускаем скрипт
if (require.main === module) {
  main().catch((error) => {
    console.error("⚠️ Image preloading script failed:", error.message);
    console.log("🔄 Continuing with build process...");
    // Не завершаем процесс, позволяем сборке продолжиться
  });
}

module.exports = { preloadImage, preloadPropertyImages };
