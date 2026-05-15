#!/usr/bin/env node

/**
 * Простой скрипт для скачивания всех файлов из коллекции translations
 * без какой-либо обработки или преобразования
 */

const fs = require("fs");
const path = require("path");

// Конфигурация
const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN =
  "1f096171636a9e46b82d7c8ac34dcbc324143a8add19966e3ecffc2149cf563249efee0d2c47ef478fa643dd2fdd1d2964b0a3ff2f865086f8038e86a54d188ffbf8b5f7545d2778dcfc164ff41e5c62d399b5f1b2ba472fd4f4696fe273a526d87580ec3663d6ea9b86ac567d96645982668cc62e5efcda2b8f5636762f8d1d";

// Путь к папке i18n
const I18N_DIR = path.join(__dirname, "..", "src", "i18n");

/** App-only hero copy (not in Strapi) — merged into main.json on each fetch. */
const HERO_TOUR_TAGLINES = {
  de: {
    dreamTrip: "Deine Traumreise beginnt hier",
    tourOfTheDay: "Tagesausflug: bester Preis",
    chooseTour: "Wähle deine Tour",
  },
  en: {
    dreamTrip: "Your dream trip starts here",
    tourOfTheDay: "Tour of the day: best price",
    chooseTour: "Choose your tour",
  },
  es: {
    dreamTrip: "Tu viaje soñado comienza aquí",
    tourOfTheDay: "Tour del día: mejor precio",
    chooseTour: "Elige tu tour",
  },
  fr: {
    dreamTrip: "Votre voyage de rêve commence ici",
    tourOfTheDay: "Circuit du jour : meilleur prix",
    chooseTour: "Choisir votre circuit",
  },
  pl: {
    dreamTrip: "Twoja wymarzona podróż zaczyna się tutaj",
    tourOfTheDay: "Wycieczka dnia: najlepsza cena",
    chooseTour: "Wybierz swoją wycieczkę",
  },
  ru: {
    dreamTrip: "Твоё путешествие мечты начинается здесь",
    tourOfTheDay: "Тур дня: лучшая цена",
    chooseTour: "Выбрать свой тур",
  },
  uk: {
    dreamTrip: "Твоя подорож мрії починається тут",
    tourOfTheDay: "Тур дня: найкраща ціна",
    chooseTour: "Обрати свій тур",
  },
};

const HERO_SEARCH_GLOBAL_TOURS = {
  de: "Globale Touren suchen",
  en: "Search Global Tours",
  es: "Buscar tours globales",
  fr: "Rechercher des tours mondiaux",
  pl: "Szukaj tourów globalnych",
  ru: "Искать туры по всему миру",
  uk: "Шукати глобальні тури",
  ua: "Шукати глобальні тури",
};

function applyMainLocalePatches(translation) {
  for (const [locale, taglines] of Object.entries(HERO_TOUR_TAGLINES)) {
    if (translation[locale]?.hero) {
      translation[locale].hero.tourTaglines = taglines;
      if (HERO_SEARCH_GLOBAL_TOURS[locale]) {
        translation[locale].hero.searchGlobalTours =
          HERO_SEARCH_GLOBAL_TOURS[locale];
      }
    }
  }
  if (translation.uk?.hero && translation.ua?.hero) {
    translation.ua.hero.searchGlobalTours =
      HERO_SEARCH_GLOBAL_TOURS.ua ?? HERO_SEARCH_GLOBAL_TOURS.uk;
  }
  if (translation.uk && !translation.ua) {
    translation.ua = JSON.parse(JSON.stringify(translation.uk));
  }
  return translation;
}

/**
 * Функция для получения всех переводов из Strapi
 */
async function fetchAllTranslations() {
  console.log("🔄 Загружаем все переводы из Strapi...");

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (API_TOKEN) {
      headers["Authorization"] = `Bearer ${API_TOKEN}`;
    }

    // Получаем все записи без пагинации
    const response = await fetch(`${API_URL}/api/translations`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Получено ${data.data?.length || 0} записей переводов`);

    return data.data || [];
  } catch (error) {
    console.error("❌ Ошибка при загрузке переводов:", error.message);
    throw error;
  }
}

/**
 * Функция для создания безопасного имени файла
 */
function createSafeFileName(name) {
  // Заменяем недопустимые символы на подчеркивания
  return name
    .replace(/[<>:"/\\|?*]/g, "_")
    .replace(/\s+/g, "_")
    .toLowerCase();
}

/**
 * Функция для сохранения всех переводов в папку i18n
 */
async function saveAllTranslations(translationsData) {
  console.log("🔄 Сохраняем все переводы в папку i18n...");

  try {
    // Создаем директорию, если она не существует
    if (!fs.existsSync(I18N_DIR)) {
      fs.mkdirSync(I18N_DIR, { recursive: true });
    }

    // Сохраняем все переводы как есть в файл translations.json (для резервной копии)
    const translationsJsonPath = path.join(I18N_DIR, "translations.json");
    fs.writeFileSync(
      translationsJsonPath,
      JSON.stringify(translationsData, null, 2),
      "utf8"
    );
    console.log("✅ translations.json сохранен (резервная копия)");

    // Создаем отдельные файлы для каждой записи
    let savedFiles = 0;

    for (const record of translationsData) {
      const name = record.Name || record.name || `translation_${record.id}`;
      let translation = record.translation || {};

      // Создаем безопасное имя файла
      const safeFileName = createSafeFileName(name);
      const filePath = path.join(I18N_DIR, `${safeFileName}.json`);

      if (safeFileName === "main") {
        translation = applyMainLocalePatches(translation);
      }

      // Сохраняем только содержимое поля translation
      fs.writeFileSync(filePath, JSON.stringify(translation, null, 2), "utf8");

      console.log(`✅ ${safeFileName}.json сохранен (Name: "${name}")`);
      savedFiles++;
    }

    console.log(`📁 Всего сохранено файлов: ${savedFiles}`);
    console.log(`📁 Файлы сохранены в: ${I18N_DIR}`);
  } catch (error) {
    console.error("❌ Ошибка при сохранении файлов:", error.message);
    throw error;
  }
}

/**
 * Основная функция
 */
async function main() {
  console.log("🚀 Запуск скрипта скачивания переводов...");
  console.log(`📍 API URL: ${API_URL}`);
  console.log(`🔑 API Token: ${API_TOKEN ? "установлен" : "не установлен"}`);

  try {
    // Загружаем все переводы из Strapi
    const translationsData = await fetchAllTranslations();

    if (translationsData.length === 0) {
      console.warn(
        "⚠️  Не получено ни одного перевода. Проверьте настройки API."
      );
      return;
    }

    // Сохраняем все переводы как есть
    await saveAllTranslations(translationsData);

    console.log("🎉 Скрипт успешно завершен!");
    console.log(`📊 Скачано записей: ${translationsData.length}`);
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
  fetchAllTranslations,
  saveAllTranslations,
  createSafeFileName,
};
