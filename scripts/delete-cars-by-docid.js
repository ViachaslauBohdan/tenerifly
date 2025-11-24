#!/usr/bin/env node

/**
 * Скрипт для удаления автомобилей по documentId через Strapi API
 */

// Конфигурация
const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN =
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

/**
 * Функция для получения автомобиля по documentId
 */
async function getCarByDocumentId(documentId) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (API_TOKEN) {
      headers["Authorization"] = `Bearer ${API_TOKEN}`;
    }

    // Пробуем найти через фильтр по documentId
    const params = new URLSearchParams();
    params.set("filters[documentId][$eq]", documentId);
    params.set("populate", "*");

    const url = `${API_URL}/api/cars?${params.toString()}`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data[0]; // Возвращаем первый найденный
    }

    return null;
  } catch (error) {
    console.error(`❌ Ошибка при получении автомобиля:`, error.message);
    return null;
  }
}

/**
 * Функция для удаления автомобиля по ID
 */
async function deleteCarById(carId) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (API_TOKEN) {
      headers["Authorization"] = `Bearer ${API_TOKEN}`;
    }

    const url = `${API_URL}/api/cars/${carId}`;
    console.log(`🗑️  Отправляем DELETE запрос на: ${url}`);

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
    }

    // Strapi может вернуть пустой ответ при успешном удалении
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        const data = await response.json();
        return { success: true, data };
      } catch (e) {
        // Если не удалось распарсить JSON, но статус 200 - это успех
        return { success: true, data: null };
      }
    } else {
      // Пустой ответ или не JSON - это тоже успех для DELETE
      return { success: true, data: null };
    }
  } catch (error) {
    console.error(`❌ Ошибка при удалении автомобиля:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Основная функция
 */
async function main() {
  // DocumentId для удаления (можно передать через аргументы командной строки)
  const documentIdsToDelete =
    process.argv.slice(2).length > 0 ? process.argv.slice(2) : ["310"]; // По умолчанию Dacia Sandero 2023

  console.log("🚀 Запуск скрипта удаления автомобилей по documentId...");
  console.log(`📍 API URL: ${API_URL}`);
  console.log(`🔑 API Token: ${API_TOKEN ? "установлен" : "не установлен"}`);
  console.log(`📋 DocumentId для удаления: ${documentIdsToDelete.join(", ")}`);

  try {
    let deletedCount = 0;
    let failedCount = 0;

    for (const documentId of documentIdsToDelete) {
      console.log(`\n📋 Ищем автомобиль с documentId: ${documentId}...`);

      // Находим автомобиль по documentId
      const car = await getCarByDocumentId(documentId);

      if (!car) {
        console.log(`❌ Автомобиль с documentId ${documentId} не найден`);
        failedCount++;
        continue;
      }

      console.log(`✅ Найден автомобиль:`);
      console.log(`   Title: "${car.title || "N/A"}"`);
      console.log(`   ID: ${car.id}`);
      console.log(`   DocumentId: ${car.documentId}`);
      console.log(`   Locale: ${car.locale || "N/A"}`);

      // Удаляем автомобиль
      console.log(`🗑️  Удаляем автомобиль...`);
      const result = await deleteCarById(car.id);

      if (result.success) {
        console.log(`✅ Автомобиль успешно удален!`);
        deletedCount++;
      } else {
        console.error(`❌ Ошибка при удалении: ${result.error}`);
        failedCount++;
      }

      // Небольшая задержка между запросами
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`\n🎉 Удаление завершено!`);
    console.log(`✅ Успешно удалено: ${deletedCount}`);
    console.log(`❌ Ошибок: ${failedCount}`);

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
  getCarByDocumentId,
  deleteCarById,
};
