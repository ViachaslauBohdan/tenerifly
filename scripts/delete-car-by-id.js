#!/usr/bin/env node

/**
 * Скрипт для удаления автомобиля по ID через Strapi API
 */

// Конфигурация
const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN =
  process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
  "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

/**
 * Функция для получения информации об автомобиле
 */
async function getCarInfo(carId) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (API_TOKEN) {
      headers["Authorization"] = `Bearer ${API_TOKEN}`;
    }

    const url = `${API_URL}/api/cars/${carId}?populate=*`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(
      `❌ Ошибка при получении информации об автомобиле:`,
      error.message
    );
    return null;
  }
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
  // Получаем ID из аргументов командной строки
  const carId = process.argv[2];

  if (!carId) {
    console.error("❌ Пожалуйста, укажите ID автомобиля для удаления");
    console.log("Использование: node scripts/delete-car-by-id.js <carId>");
    console.log("Пример: node scripts/delete-car-by-id.js 328");
    process.exit(1);
  }

  console.log("🚀 Запуск скрипта удаления автомобиля...");
  console.log(`📍 API URL: ${API_URL}`);
  console.log(`🔑 API Token: ${API_TOKEN ? "установлен" : "не установлен"}`);
  console.log(`🆔 ID автомобиля: ${carId}`);

  try {
    // Сначала получаем информацию об автомобиле
    console.log("\n📋 Получаем информацию об автомобиле...");
    const carInfo = await getCarInfo(carId);

    if (!carInfo) {
      console.error(
        `❌ Автомобиль с ID ${carId} не найден или произошла ошибка`
      );
      process.exit(1);
    }

    console.log(`✅ Найден автомобиль:`);
    console.log(`   Title: "${carInfo.title || "N/A"}"`);
    console.log(`   DocumentId: ${carInfo.documentId || "N/A"}`);
    console.log(`   Locale: ${carInfo.locale || "N/A"}`);
    console.log(`   Created: ${carInfo.createdAt || "N/A"}`);

    // Удаляем автомобиль
    console.log(`\n🗑️  Удаляем автомобиль...`);
    const result = await deleteCar(carId);

    if (result.success) {
      console.log(`\n✅ Автомобиль успешно удален!`);
      console.log(`   ID: ${carId}`);
      console.log(`   Title: "${carInfo.title || "N/A"}"`);
    } else {
      console.error(`\n❌ Ошибка при удалении автомобиля:`);
      console.error(`   ${result.error}`);
      process.exit(1);
    }

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
  getCarInfo,
  deleteCar,
};
