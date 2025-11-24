#!/usr/bin/env node

/**
 * Скрипт для удаления дубликатов автомобилей по title через Strapi API
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
 * Функция для получения всех автомобилей с английской локалью
 */
async function fetchEnglishCars() {
  console.log("🔄 Загружаем все автомобили с английской локалью...");

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
      params.set("locale", "en");
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

    console.log(`✅ Всего получено ${allCars.length} автомобилей с locale="en"`);
    return allCars;
  } catch (error) {
    console.error("❌ Ошибка при загрузке автомобилей:", error.message);
    throw error;
  }
}

/**
 * Функция для поиска дубликатов по title
 */
function findDuplicates(cars) {
  const titleMap = new Map();
  const duplicates = [];

  cars.forEach((car) => {
    const title = car.title?.trim().toLowerCase() || "";
    if (!title) return;

    if (!titleMap.has(title)) {
      titleMap.set(title, [car]);
    } else {
      titleMap.get(title).push(car);
    }
  });

  // Находим все title с дубликатами
  titleMap.forEach((carList, title) => {
    if (carList.length > 1) {
      // Сортируем по дате создания (оставляем самую старую)
      carList.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateA - dateB;
      });

      // Первая запись остается, остальные - дубликаты для удаления
      const toKeep = carList[0];
      const toDelete = carList.slice(1);

      duplicates.push({
        title: title,
        keep: toKeep,
        delete: toDelete,
      });
    }
  });

  return duplicates;
}

/**
 * Функция для удаления автомобиля через API
 */
async function deleteCar(carId) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (API_TOKEN) {
      headers["Authorization"] = `Bearer ${API_TOKEN}`;
    }

    const url = `${API_URL}/api/cars/${carId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`❌ Ошибка при удалении автомобиля ${carId}:`, error.message);
    return false;
  }
}

/**
 * Основная функция
 */
async function main() {
  console.log("🚀 Запуск скрипта удаления дубликатов...");
  console.log(`📍 API URL: ${API_URL}`);
  console.log(`🔑 API Token: ${API_TOKEN ? "установлен" : "не установлен"}`);

  try {
    // Загружаем все английские автомобили
    const englishCars = await fetchEnglishCars();

    if (englishCars.length === 0) {
      console.warn("⚠️  Не получено ни одного автомобиля.");
      return;
    }

    console.log(`\n📊 Всего автомобилей с locale="en": ${englishCars.length}`);

    // Находим дубликаты
    const duplicates = findDuplicates(englishCars);

    if (duplicates.length === 0) {
      console.log("✅ Дубликатов не найдено!");
      return;
    }

    console.log(`\n🔍 Найдено ${duplicates.length} групп дубликатов:`);
    duplicates.forEach((dup, index) => {
      console.log(
        `  ${index + 1}. "${dup.title}" - ${dup.delete.length} дубликат(ов) для удаления`
      );
      console.log(`     Оставляем: ID=${dup.keep.id}, documentId=${dup.keep.documentId}`);
      dup.delete.forEach((car) => {
        console.log(`     Удаляем: ID=${car.id}, documentId=${car.documentId}`);
      });
    });

    // Подсчитываем общее количество для удаления
    const totalToDelete = duplicates.reduce(
      (sum, dup) => sum + dup.delete.length,
      0
    );

    console.log(`\n⚠️  Всего будет удалено: ${totalToDelete} автомобилей`);

    // Спрашиваем подтверждение (в реальном скрипте можно использовать readline)
    console.log("\n⚠️  ВНИМАНИЕ: Скрипт удалит дубликаты!");
    console.log("Для продолжения раскомментируйте код удаления в скрипте.");

    // Раскомментируйте этот блок для реального удаления:
    
    console.log("\n🗑️  Начинаем удаление дубликатов...");
    let deletedCount = 0;
    let failedCount = 0;

    for (const dup of duplicates) {
      for (const carToDelete of dup.delete) {
        console.log(`\n🗑️  Удаляем: "${carToDelete.title}" (ID: ${carToDelete.id})...`);
        const success = await deleteCar(carToDelete.id);
        
        if (success) {
          deletedCount++;
          console.log(`✅ Удалено успешно`);
        } else {
          failedCount++;
          console.log(`❌ Ошибка при удалении`);
        }
        
        // Небольшая задержка между запросами
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`\n🎉 Удаление завершено!`);
    console.log(`✅ Успешно удалено: ${deletedCount}`);
    console.log(`❌ Ошибок: ${failedCount}`);
    

    // Сохраняем отчет
    const report = {
      totalCars: englishCars.length,
      duplicateGroups: duplicates.length,
      totalToDelete: totalToDelete,
      duplicates: duplicates.map((dup) => ({
        title: dup.title,
        keep: {
          id: dup.keep.id,
          documentId: dup.keep.documentId,
          title: dup.keep.title,
        },
        delete: dup.delete.map((car) => ({
          id: car.id,
          documentId: car.documentId,
          title: car.title,
        })),
      })),
    };

    const reportPath = path.join(__dirname, "..", "duplicates-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
    console.log(`\n💾 Отчет сохранен в: ${reportPath}`);

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
  fetchEnglishCars,
  findDuplicates,
  deleteCar,
};


