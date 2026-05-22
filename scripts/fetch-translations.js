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
  uk: "Знайти",
  ua: "Знайти",
};

/** Label for hero tab selector (accommodation / cars / tours). */
const HERO_LEISURE_LABEL = {
  de: "Erholung",
  en: "Leisure",
  es: "Ocio",
  fr: "Loisirs",
  pl: "Wypoczynek",
  ru: "Отдых",
  uk: "Відпочинок",
  ua: "Відпочинок",
};

/** Main hero H1 — Tenerife island search only (worldwide block has its own heading). */
const HERO_TENERIFE_TITLE = {
  de: "Buchen Sie Erholung auf Teneriffa",
  en: "Book your getaway on Tenerife",
  es: "Reserva tu ocio en Tenerife",
  fr: "Réservez vos loisirs à Tenerife",
  pl: "Zarezerwuj wypoczynek na Teneryfie",
  ru: "Бронируйте отдых на Тенерифе",
  uk: "Бронюйте відпочинок на Тенеріфі",
  ua: "Бронюйте відпочинок на Тенеріфі",
};

/** Homepage world-tours CTA (redirects to /world-tours). */
const HERO_WORLD_TOURS = {
  de: {
    heading: "System zur weltweiten Tour-Suche und -Buchung",
    title: "Toursuche",
    hint: "Um zur Seite aller Touren zu gelangen, klicken Sie auf «Globale Touren suchen»",
    search: "Suchen",
  },
  en: {
    heading: "Worldwide tour search and booking system",
    title: "Search for a tour",
    hint: "To go to the page with all tours, click Search Global Tours",
    search: "Find",
  },
  es: {
    heading: "Sistema de búsqueda y reserva de tours en todo el mundo",
    title: "Buscar tour",
    hint: "Para ir a la página con todos los tours, pulse «Buscar tours globales»",
    search: "Buscar",
  },
  fr: {
    heading: "Système de recherche et de réservation de circuits dans le monde",
    title: "Recherche de circuit",
    hint: "Pour accéder à la page de tous les circuits, cliquez sur «Rechercher des tours mondiaux»",
    search: "Trouver",
  },
  pl: {
    heading: "System wyszukiwania i rezerwacji tourów na całym świecie",
    title: "Wyszukiwarka tourów",
    hint: "Aby przejść na stronę wszystkich turów, kliknij «Szukaj tourów globalnych»",
    search: "Znajdź",
  },
  ru: {
    heading: "Система поиска и бронирования туров по всему миру",
    title: "Поиск тура",
    hint: "Для перехода на страницу всех туров нажмите «Искать туры по всему миру»",
    search: "Найти",
  },
  uk: {
    heading: "Система пошуку і бронювання турів по всьому світу",
    title: "Пошук туру",
    hint: "Для переходу на сторінку всіх турів натисніть «Знайти»",
    search: "Знайти",
  },
  ua: {
    heading: "Система пошуку і бронювання турів по всьому світу",
    title: "Пошук туру",
    hint: "Для переходу на сторінку всіх турів натисніть «Знайти»",
    search: "Знайти",
  },
};

function applyMainLocalePatches(translation) {
  for (const [locale, taglines] of Object.entries(HERO_TOUR_TAGLINES)) {
    if (translation[locale]?.hero) {
      translation[locale].hero.tourTaglines = taglines;
      if (HERO_SEARCH_GLOBAL_TOURS[locale]) {
        translation[locale].hero.searchGlobalTours =
          HERO_SEARCH_GLOBAL_TOURS[locale];
      }
      if (HERO_WORLD_TOURS[locale]) {
        translation[locale].hero.worldTours = {
          ...HERO_WORLD_TOURS[locale],
          search:
            HERO_SEARCH_GLOBAL_TOURS[locale] ?? HERO_WORLD_TOURS[locale].search,
        };
      }
      if (HERO_TENERIFE_TITLE[locale]) {
        translation[locale].hero.title = HERO_TENERIFE_TITLE[locale];
      }
      if (HERO_LEISURE_LABEL[locale]) {
        translation[locale].hero.leisure = HERO_LEISURE_LABEL[locale];
      }
    }
  }
  if (translation.uk?.hero && translation.ua?.hero) {
    translation.ua.hero.searchGlobalTours =
      HERO_SEARCH_GLOBAL_TOURS.ua ?? HERO_SEARCH_GLOBAL_TOURS.uk;
    translation.ua.hero.worldTours = {
      ...(HERO_WORLD_TOURS.ua ?? HERO_WORLD_TOURS.uk),
      search:
        HERO_SEARCH_GLOBAL_TOURS.ua ??
        HERO_SEARCH_GLOBAL_TOURS.uk ??
        (HERO_WORLD_TOURS.ua ?? HERO_WORLD_TOURS.uk).search,
    };
    translation.ua.hero.title =
      HERO_TENERIFE_TITLE.ua ?? HERO_TENERIFE_TITLE.uk;
    translation.ua.hero.leisure =
      HERO_LEISURE_LABEL.ua ?? HERO_LEISURE_LABEL.uk;
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
    console.warn("⚠️ Не удалось загрузить переводы из Strapi:", error.message);
    // Check if existing translation files are available as fallback
    if (fs.existsSync(I18N_DIR) && fs.readdirSync(I18N_DIR).some(f => f.endsWith('.json'))) {
      console.warn("⚠️ Используем существующие файлы переводов из репозитория.");
    } else {
      console.error("💥 Нет существующих файлов переводов для fallback. Сборка прервана.");
      process.exit(1);
    }
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
