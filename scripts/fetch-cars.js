#!/usr/bin/env node

/**
 * Простой скрипт для получения всех автомобилей из Strapi
 */

const fs = require("fs");
const path = require("path");

// Конфигурация
const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN =
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

/**
 * Функция для получения всех автомобилей из Strapi
 */
async function fetchAllCars() {
  console.log("🔄 Загружаем все автомобили из Strapi...");

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
      params.set("sort", "title:ASC");
      params.set("pagination[page]", String(page));
      params.set("pagination[pageSize]", String(pageSize));

      const url = `${API_URL}/api/cars?${params.toString()}`;
      console.log(`📄 Загружаем страницу ${page}...`);

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const batch = data.data || [];
      
      console.log(`✅ Страница ${page}: получено ${batch.length} автомобилей`);
      
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

    console.log(`✅ Всего получено ${allCars.length} автомобилей`);
    return allCars;
  } catch (error) {
    console.error("❌ Ошибка при загрузке автомобилей:", error.message);
    throw error;
  }
}

/**
 * Функция для группировки автомобилей по локалям
 */
function groupCarsByLocale(cars) {
  const carsByLocale = {
    en: [],
    ru: [],
    pl: [],
    fr: [],
    uk: [],
    de: [],
    es: [],
  };

  cars.forEach((car) => {
    const carData = car;
    const carDocumentId = carData.documentId;
    const carTitle = carData.title;
    const mainLocale = carData.locale || "en";

    // Добавляем основную запись ТОЛЬКО если её локаль соответствует нужной локали
    if (carsByLocale[mainLocale] && carDocumentId) {
      const existingCar = carsByLocale[mainLocale].find(
        (existing) =>
          existing.documentId === carDocumentId ||
          (carTitle && existing.title === carTitle)
      );
      if (!existingCar) {
        carsByLocale[mainLocale].push(car);
      }
    }

    // Добавляем локализованные версии ТОЛЬКО для других локалей
    // НЕ добавляем локализации для английского языка (en) - только основные записи с locale="en"
    if (carData.localizations && Array.isArray(carData.localizations)) {
      carData.localizations.forEach((localization) => {
        // Пропускаем локализацию для той же локали, что и основная запись
        if (localization.locale === mainLocale) {
          return;
        }

        // НЕ добавляем локализации для английского языка
        // Английский язык должен содержать только записи с основной локалью "en"
        if (localization.locale === "en") {
          return;
        }

        if (carsByLocale[localization.locale] && localization.documentId) {
          const existingCar = carsByLocale[localization.locale].find(
            (existing) =>
              existing.documentId === localization.documentId ||
              existing.documentId === carDocumentId ||
              (localization.title && existing.title === localization.title)
          );
          if (!existingCar) {
            const hybridCar = {
              ...car,
              title: localization.title,
              description: localization.description,
              locale: localization.locale,
              documentId: localization.documentId,
            };
            carsByLocale[localization.locale].push(hybridCar);
          }
        }
      });
    }
  });

  return carsByLocale;
}

/**
 * Основная функция
 */
async function main() {
  console.log("🚀 Запуск скрипта получения автомобилей...");
  console.log(`📍 API URL: ${API_URL}`);
  console.log(`🔑 API Token: ${API_TOKEN ? "установлен" : "не установлен"}`);

  try {
    // Загружаем все автомобили из Strapi
    const allCars = await fetchAllCars();

    if (allCars.length === 0) {
      console.warn(
        "⚠️  Не получено ни одного автомобиля. Проверьте настройки API."
      );
      return;
    }

    // Группируем по локалям
    const carsByLocale = groupCarsByLocale(allCars);

    // Выводим статистику
    console.log("\n📊 Статистика по локалям:");
    Object.entries(carsByLocale).forEach(([locale, cars]) => {
      console.log(`  ${locale}: ${cars.length} автомобилей`);
    });

    // Сохраняем в файл для проверки
    const outputPath = path.join(__dirname, "..", "cars-data.json");
    fs.writeFileSync(
      outputPath,
      JSON.stringify(
        {
          total: allCars.length,
          byLocale: carsByLocale,
          allCars: allCars,
        },
        null,
        2
      ),
      "utf8"
    );
    console.log(`\n💾 Данные сохранены в: ${outputPath}`);

    console.log("\n🎉 Скрипт успешно завершен!");
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
  fetchAllCars,
  groupCarsByLocale,
};

