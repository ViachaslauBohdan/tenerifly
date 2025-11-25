#!/usr/bin/env node

/**
 * Скрипт для показа лишних английских автомобилей по documentId
 */

// Конфигурация
const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN =
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

/**
 * Функция для получения всех автомобилей по локали
 */
async function fetchCarsByLocale(locale) {
  console.log(`🔄 Загружаем все автомобили с локалью "${locale}"...`);

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (API_TOKEN) {
      headers["Authorization"] = `Bearer ${API_TOKEN}`;
    }

    const allCars = [];
    let page = 1;
    const pageSize = 100;

    while (true) {
      const params = new URLSearchParams();
      params.set("populate", "*");
      params.set("publicationState", "live");
      params.set("locale", locale);
      params.set("sort", "title:ASC");
      params.set("pagination[page]", String(page));
      params.set("pagination[pageSize]", String(pageSize));

      const url = `${API_URL}/api/cars?${params.toString()}`;
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const batch = data.data || [];

      if (batch.length === 0) {
        break;
      }

      allCars.push(...batch);

      const pageCount = data?.meta?.pagination?.pageCount;
      const currentPage = data?.meta?.pagination?.page;

      if (!pageCount || !currentPage || currentPage >= pageCount) {
        break;
      }

      page += 1;
    }

    return allCars;
  } catch (error) {
    console.error(`❌ Ошибка при загрузке автомобилей:`, error.message);
    throw error;
  }
}

/**
 * Функция для поиска лишних английских автомобилей по documentId
 */
function findExtraEnglishCars(englishCars, russianCars) {
  // Создаем Set documentId русских автомобилей
  const russianDocIds = new Set();
  russianCars.forEach((car) => {
    if (car.documentId) {
      russianDocIds.add(car.documentId);
    }
  });

  console.log(`\n📊 Уникальных documentId в русской локали: ${russianDocIds.size}`);

  // Находим английские автомобили без соответствующего русского documentId
  const extraCars = [];
  const matchedCars = [];

  englishCars.forEach((englishCar) => {
    if (!englishCar.documentId) {
      extraCars.push(englishCar);
      return;
    }

    // Проверяем, есть ли русский автомобиль с таким же documentId
    if (russianDocIds.has(englishCar.documentId)) {
      const matchingRussianCar = russianCars.find(
        (russianCar) => russianCar.documentId === englishCar.documentId
      );
      matchedCars.push({
        english: englishCar,
        russian: matchingRussianCar,
      });
    } else {
      // Нет русского автомобиля с таким documentId - это лишний английский автомобиль
      extraCars.push(englishCar);
    }
  });

  return { extraCars, matchedCars };
}

/**
 * Основная функция
 */
async function main() {
  console.log("🚀 Поиск лишних английских автомобилей по documentId...");
  console.log(`📍 API URL: ${API_URL}`);

  try {
    // Загружаем все русские автомобили
    const russianCars = await fetchCarsByLocale("ru");
    console.log(`✅ Русских автомобилей: ${russianCars.length}`);

    // Загружаем все английские автомобили
    const englishCars = await fetchCarsByLocale("en");
    console.log(`✅ Английских автомобилей: ${englishCars.length}`);

    // Находим лишние английские автомобили
    const { extraCars, matchedCars } = findExtraEnglishCars(
      englishCars,
      russianCars
    );

    console.log(`\n📊 Результаты анализа:`);
    console.log(`  ✅ Соответствующих пар (en+ru по documentId): ${matchedCars.length}`);
    console.log(`  ❌ Лишних английских автомобилей: ${extraCars.length}`);

    if (extraCars.length === 0) {
      console.log("\n✅ Лишних автомобилей не найдено!");
      return;
    }

    console.log(`\n🔍 Лишние английские автомобили (показываем первые 5):`);
    extraCars.slice(0, 5).forEach((car, index) => {
      console.log(`\n  ${index + 1}. "${car.title}"`);
      console.log(`     ID: ${car.id}`);
      console.log(`     DocumentId: ${car.documentId}`);
      console.log(`     Locale: ${car.locale}`);
      console.log(`     Created: ${car.createdAt}`);
      if (car.specifications) {
        console.log(`     Make/Model: ${car.specifications.make || "N/A"} ${car.specifications.model || "N/A"}`);
      }
    });

    if (extraCars.length > 5) {
      console.log(`\n  ... и еще ${extraCars.length - 5} автомобилей`);
    }

    console.log(`\n📋 Все лишние автомобили (ID для удаления):`);
    extraCars.forEach((car) => {
      console.log(`  - ID: ${car.id}, DocumentId: ${car.documentId}, Title: "${car.title}"`);
    });

    console.log("\n✅ Скрипт завершен!");
  } catch (error) {
    console.error("💥 Скрипт завершился с ошибкой:", error.message);
    process.exit(1);
  }
}

// Запускаем скрипт
if (require.main === module) {
  main();
}

module.exports = {
  fetchCarsByLocale,
  findExtraEnglishCars,
};



