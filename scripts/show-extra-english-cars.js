#!/usr/bin/env node

/**
 * Скрипт для показа лишних английских автомобилей
 * Сравнивает title на русском и английском языках
 */

// Конфигурация
const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN =
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

/**
 * Нормализация title для сравнения
 */
function normalizeTitle(title) {
  if (!title) return "";
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "");
}

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
 * Функция для поиска лишних английских автомобилей
 */
function findExtraEnglishCars(englishCars, russianCars) {
  // Создаем Set нормализованных русских title
  const russianNormalizedTitles = new Set();
  russianCars.forEach((car) => {
    if (car.title) {
      const normalizedTitle = normalizeTitle(car.title);
      if (normalizedTitle) {
        russianNormalizedTitles.add(normalizedTitle);
      }
    }
  });

  // Находим английские автомобили без соответствующего русского title
  const extraCars = [];
  const matchedCars = [];

  englishCars.forEach((englishCar) => {
    if (!englishCar.title) {
      extraCars.push(englishCar);
      return;
    }

    const englishNormalizedTitle = normalizeTitle(englishCar.title);

    // Проверяем, есть ли русский автомобиль с таким же нормализованным title
    if (russianNormalizedTitles.has(englishNormalizedTitle)) {
      const matchingRussianCar = russianCars.find((russianCar) => {
        if (!russianCar.title) return false;
        return normalizeTitle(russianCar.title) === englishNormalizedTitle;
      });
      matchedCars.push({
        english: englishCar,
        russian: matchingRussianCar,
      });
    } else {
      // Нет русского автомобиля с таким title - это лишний английский автомобиль
      extraCars.push(englishCar);
    }
  });

  return { extraCars, matchedCars };
}

/**
 * Основная функция
 */
async function main() {
  console.log("🚀 Поиск лишних английских автомобилей...");
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
    console.log(`  ✅ Соответствующих пар (en+ru по title): ${matchedCars.length}`);
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
      console.log(`     Normalized title: "${normalizeTitle(car.title)}"`);
    });

    if (extraCars.length > 5) {
      console.log(`\n  ... и еще ${extraCars.length - 5} автомобилей`);
    }

    console.log(`\n📋 Все лишние автомобили (ID для удаления):`);
    extraCars.forEach((car) => {
      console.log(`  - ID: ${car.id}, Title: "${car.title}"`);
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
  normalizeTitle,
};






