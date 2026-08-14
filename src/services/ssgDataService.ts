import { cmsLocale, localeContentKey, type Locale } from "@/types/locale";
// Сервис для получения данных на сервере для SSG

import { Transfer } from "@/lib/transfers";
import {
  CMS_CACHE_TAGS,
  CMS_FETCH_REVALIDATE,
  CMS_MEMORY_CACHE_MS,
  type CmsCacheTag,
} from "@/config/cmsCache";
import {
  hybridLocalizedRow,
  mergeLocalizedCatalog,
  needsCmsEnTextFallback,
  resolveCmsDocument,
  type CmsLocalizedRow,
} from "@/lib/cmsLocalizedContent";
import {
  HOME_CARS_FETCH_LIMIT,
  HOME_PREVIEW_LIMIT,
  homeListQuery,
  homePopulateQuery,
  pickHomeCarsByLocale,
  type HomeCarRow,
} from "@/lib/homeListing";
import { formatPropertyPriceLabel } from "@/utils/propertyPrice";
import {
  normalizeExcursionDocumentToTourCard,
  type NormalizedExcursionTour,
} from "@/lib/strapiExcursionTours";

type CmsDocument = CmsLocalizedRow;

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// In-process cache for repeated reads during build / warm server
const cache = new Map<string, { data: unknown; timestamp: number }>();

const defaultFetchTags: CmsCacheTag[] = [
  CMS_CACHE_TAGS.properties,
  CMS_CACHE_TAGS.apartments,
  CMS_CACHE_TAGS.cars,
];

const fetchCacheOptions = (tags: CmsCacheTag[]) => ({
  revalidate: CMS_FETCH_REVALIDATE,
  tags: [...new Set(tags)],
});

// Функция для создания заголовков с авторизацией
const getAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
    ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
  };
};

// Функция для получения URL изображения
const getImageUrl = (item: {
  images?: Array<{ url: string }>;
  image?: { url: string } | string;
}): string => {
  if (item.images && item.images.length > 0) {
    if (item.images[0].url.startsWith("http")) {
      return item.images[0].url;
    }
    return `${API_URL}${item.images[0].url}`;
  }

  if (typeof item.image === "string") {
    return item.image;
  }

  if (item.image?.url) {
    if (item.image.url.startsWith("http") || item.image.url.startsWith("/")) {
      return item.image.url;
    }
    return `${API_URL}${item.image.url}`;
  }

  return "https://res.cloudinary.com/dlnvckilf/image/upload/v1745023888/532825115_v6u0nl.jpg";
};

// Функция для локализации текста
const getLocalizedText = (language: string, textKey: string): string => {
  const texts: Record<string, Record<string, string>> = {
    max: {
      en: "Max",
      ru: "Макс",
      pl: "Maks",
      fr: "Max",
      uk: "Макс",
      de: "Max",
      es: "Máx",
    },
    people: {
      en: "people",
      ru: "человек",
      pl: "osób",
      fr: "personnes",
      uk: "осіб",
      de: "Personen",
      es: "personas",
    },
    day: {
      en: "day",
      ru: "день",
      pl: "dzień",
      fr: "jour",
      uk: "день",
      de: "Tag",
      es: "día",
    },
    seats: {
      en: "seats",
      ru: "мест",
      pl: "miejsc",
      fr: "places",
      uk: "місць",
      de: "Sitze",
      es: "asientos",
    },
    automatic: {
      en: "Automatic",
      ru: "Автомат",
      pl: "Automatyczna",
      fr: "Automatique",
      uk: "Автомат",
      de: "Automatik",
      es: "Automático",
    },
    manual: {
      en: "Manual",
      ru: "Механика",
      pl: "Manualna",
      fr: "Manuelle",
      uk: "Механіка",
      de: "Manuell",
      es: "Manual",
    },
    airConditioning: {
      en: "AC",
      ru: "Кондиционер",
      pl: "Klimatyzacja",
      fr: "Climatisation",
      uk: "Кондиціонер",
      de: "Klimaanlage",
      es: "Aire acondicionado",
    },
    bedrooms: {
      en: "bedrooms",
      ru: "спальни",
      pl: "sypialnie",
      fr: "chambres",
      uk: "спальні",
      de: "Schlafzimmer",
      es: "dormitorios",
    },
    bathrooms: {
      en: "bathrooms",
      ru: "ванные",
      pl: "łazienki",
      fr: "salles de bain",
      uk: "ванні",
      de: "Badezimmer",
      es: "baños",
    },
    minRead: {
      en: "min read",
      ru: "мин чтения",
      pl: "min czytania",
      fr: "min de lecture",
      uk: "хв читання",
      de: "Min. Lesezeit",
      es: "min de lectura",
    },
    night: {
      en: "night",
      ru: "ночь",
      pl: "noc",
      fr: "nuit",
      uk: "ніч",
      de: "Nacht",
      es: "noche",
    },
    month: {
      en: "month",
      ru: "месяц",
      pl: "miesiąc",
      fr: "mois",
      uk: "місяць",
      de: "Monat",
      es: "mes",
    },
  };

  return texts[textKey]?.[language] || texts[textKey]?.["en"] || "";
};

async function fetchWithCache(
  endpoint: string,
  cacheKey: string,
  tags: CmsCacheTag[] = defaultFetchTags
) {
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && now - cached.timestamp < CMS_MEMORY_CACHE_MS) {
    return cached.data;
  }

  try {
    const url = `${API_URL}/api${endpoint}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
      next: fetchCacheOptions(tags),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const result = data.data || data;

    cache.set(cacheKey, { data: result, timestamp: now });
    return result;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/** Like fetchWithCache but returns null on non-OK (no console.error). Used to probe `/excursions` before legacy `/tours`. */
async function fetchWithCacheMaybe(
  endpoint: string,
  cacheKey: string,
  tags: CmsCacheTag[] = [CMS_CACHE_TAGS.tours, CMS_CACHE_TAGS.excursions]
): Promise<unknown | null> {
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && now - cached.timestamp < CMS_MEMORY_CACHE_MS) {
    return cached.data;
  }

  try {
    const url = `${API_URL}/api${endpoint}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
      next: fetchCacheOptions(tags),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const result = data.data || data;

    cache.set(cacheKey, { data: result, timestamp: now });
    return result;
  } catch {
    return null;
  }
}

async function fetchTransfersQuiet(endpoint: string) {
  const response = await fetch(`${API_URL}/api${endpoint}`, {
    headers: getAuthHeaders(),
    next: fetchCacheOptions([CMS_CACHE_TAGS.transfers, CMS_CACHE_TAGS.home]),
  });

  if (!response.ok) {
    throw new Error(`Transfers API error (${response.status}) for ${endpoint}`);
  }

  const data = await response.json();
  return data.data || data;
}

/** Fetch a CMS document by id for a locale, falling back to EN text fields. */
async function getCmsDocumentById(
  collection: "cars" | "properties",
  id: string,
  locale: Locale | string | undefined,
  tags: CmsCacheTag[]
): Promise<CmsDocument | null> {
  const key = cmsLocale(locale);
  const populate = "populate=*";
  const localized = (await fetchWithCacheMaybe(
    `/${collection}/${id}?${populate}&locale=${key}`,
    `${collection}-${id}-${key}`,
    tags
  )) as CmsDocument | null;

  if (key === "en" || !needsCmsEnTextFallback(localized)) {
    return resolveCmsDocument(localized, null, key);
  }

  const en = (await fetchWithCacheMaybe(
    `/${collection}/${id}?${populate}&locale=en`,
    `${collection}-${id}-en`,
    tags
  )) as CmsDocument | null;

  return resolveCmsDocument(localized, en, key);
}

async function fetchPropertiesForCmsLocale(cmsKey: string) {
  return fetchWithCache(
    `/properties?populate=*&pagination[pageSize]=1000&locale=${cmsKey}`,
    `all-properties-${cmsKey}`,
    [CMS_CACHE_TAGS.properties, CMS_CACHE_TAGS.apartments]
  );
}

// Получение всех апартаментов с оптимизированным SSG (locale → Strapi `uk` for `ua`)
export async function getAllProperties(
  locale?: Locale | string
  // Loose Strapi payloads — catalog client expects PropertyData[].
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  try {
    const key = cmsLocale(locale);
    console.log("🔧 SSG: Fetching properties from API...", key);
    const enRows = (await fetchPropertiesForCmsLocale("en")) as CmsDocument[];
    const enList = Array.isArray(enRows) ? enRows : [];
    if (key === "en") return enList;

    let localized: CmsDocument[] = [];
    try {
      const rows = await fetchPropertiesForCmsLocale(key);
      localized = Array.isArray(rows) ? (rows as CmsDocument[]) : [];
    } catch {
      localized = [];
    }

    // Keep full EN catalog; overlay localized title/description when present
    // (avoids RU stub locales shrinking the list to 1 item).
    return mergeLocalizedCatalog(enList, localized);
  } catch (error) {
    console.error("❌ SSG: Error fetching properties:", error);
    // Return empty array as fallback to prevent build failures
    return [];
  }
}

/** Properties bucketed by CMS locale key (`uk` for Ukrainian), EN catalog + overlays. */
export async function getAllPropertiesAllLocales() {
  const cmsKeys = ["en", "ru", "pl", "fr", "uk", "de", "es"] as const;
  const byLocale: Record<string, unknown[]> = {};
  const enRows = (await fetchPropertiesForCmsLocale("en")) as CmsDocument[];
  const enList = Array.isArray(enRows) ? enRows : [];

  byLocale.en = enList;

  await Promise.all(
    cmsKeys
      .filter((k) => k !== "en")
      .map(async (key) => {
        try {
          const rows = await fetchPropertiesForCmsLocale(key);
          const localized = Array.isArray(rows) ? (rows as CmsDocument[]) : [];
          byLocale[key] = mergeLocalizedCatalog(enList, localized);
        } catch {
          byLocale[key] = enList;
        }
      })
  );

  return byLocale;
}

/** Bust Next.js data cache after a CMS publish (call from /api/revalidate). */
export async function revalidateCmsCache(tag?: CmsCacheTag | "all") {
  const { revalidateTag, revalidatePath } = await import("next/cache");
  const tags =
    !tag || tag === "all"
      ? (Object.values(CMS_CACHE_TAGS) as CmsCacheTag[])
      : [tag];

  for (const t of tags) {
    revalidateTag(t);
  }

  if (!tag || tag === "all" || tag === CMS_CACHE_TAGS.home) {
    revalidatePath("/", "page");
    const { LOCALES } = await import("@/types/locale");
    for (const { code } of LOCALES) {
      revalidatePath(`/${code}`, "page");
    }
  }

  if (
    !tag ||
    tag === "all" ||
    tag === CMS_CACHE_TAGS.properties ||
    tag === CMS_CACHE_TAGS.apartments
  ) {
    const { LOCALES } = await import("@/types/locale");
    revalidatePath("/apartments", "page");
    for (const { code } of LOCALES) {
      revalidatePath(`/${code}/apartments`, "page");
    }
  }

  console.log("🔄 CMS cache revalidated:", tags.join(", "));
}

/** @deprecated Use revalidateCmsCache — kept for existing webhook payloads. */
export async function revalidateProperties() {
  await revalidateCmsCache(CMS_CACHE_TAGS.properties);
}

// Получение всех автомобилей через Documents API (правильное отображение записей)
export async function getAllCars() {
  const pageSize = 50;
  let page = 1;
  const allItems: unknown[] = [];

  while (true) {
    const params = new URLSearchParams();
    params.set("populate", "*");
    params.set("publicationState", "live");
    params.set("sort", "title:ASC");
    params.set("pagination[page]", String(page));
    params.set("pagination[pageSize]", String(pageSize));

    // Используем обычный API для серверной стороны
    const url = `${API_URL}/api/cars?${params.toString()}`;

    console.log(`🔍 Fetching cars page ${page} via API:`, url);

    const response = await fetch(url, {
      headers: getAuthHeaders(),
      next: fetchCacheOptions([CMS_CACHE_TAGS.carsAll, CMS_CACHE_TAGS.cars]),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    const batch: Array<Record<string, unknown>> = json.data || [];

    console.log(`📊 Page ${page}: got ${batch.length} cars`);
    allItems.push(...batch);

    const pageCount: number | undefined = json?.meta?.pagination?.pageCount;
    const currentPage: number | undefined = json?.meta?.pagination?.page;
    if (!pageCount || !currentPage || currentPage >= pageCount) break;
    page += 1;
  }

  console.log(`✅ Total cars via Documents API: ${allItems.length}`);
  return allItems;
}

// Получение автомобилей для всех поддерживаемых локалей (для SSG предзагрузки)
export async function getAllCarsAllLocales() {
  // Получаем ВСЕ автомобили один раз
  const allCars = await getAllCars();

  // Группируем по локалям на сервере с дедупликацией
  const carsByLocale: Record<string, unknown[]> = {
    en: [],
    ru: [],
    pl: [],
    fr: [],
    uk: [],
    de: [],
    es: [],
  };

  allCars.forEach((car: unknown) => {
    const carData = car as {
      id?: number;
      documentId?: string;
      locale?: string;
      localizations?: Array<{
        id: number;
        locale: string;
        documentId: string;
        title: string;
        description: string;
        [key: string]: unknown;
      }>;
    };

    // Используем documentId для дедупликации (одинаковый для всех локалей одного автомобиля)
    const carDocumentId = carData.documentId;
    const carTitle = (carData as { title?: string }).title;

    // Добавляем основную запись (текущая локаль)
    const mainLocale = carData.locale || "en";
    if (carsByLocale[mainLocale] && carDocumentId) {
      // Проверяем, нет ли уже автомобиля с таким documentId или title в этой локали
      const existingCar = carsByLocale[mainLocale].find(
        (existingCar: unknown) => {
          const existing = existingCar as {
            documentId?: string;
            title?: string;
          };
          return (
            existing.documentId === carDocumentId ||
            (carTitle && existing.title === carTitle)
          );
        }
      );
      if (!existingCar) {
        carsByLocale[mainLocale].push(car);
      }
    }

    // Добавляем локализованные версии ТОЛЬКО для других локалей (не для основной локали)
    // НЕ добавляем локализации для английского языка (en) - только основные записи с locale="en"
    if (carData.localizations && Array.isArray(carData.localizations)) {
      carData.localizations.forEach((localization) => {
        // Пропускаем локализацию, если она для той же локали, что и основная запись
        if (localization.locale === mainLocale) {
          return;
        }

        // НЕ добавляем локализации для английского языка
        // Английский язык должен содержать только записи с основной локалью "en"
        if (localization.locale === "en") {
          return;
        }

        if (carsByLocale[localization.locale] && localization.documentId) {
          // Проверяем, нет ли уже автомобиля с таким documentId или title в этой локали
          // Проверяем как по documentId локализации, так и по основному documentId и title
          const existingCar = carsByLocale[localization.locale].find(
            (existingCar: unknown) => {
              const existing = existingCar as {
                documentId?: string;
                title?: string;
              };
              return (
                existing.documentId === localization.documentId ||
                existing.documentId === carDocumentId ||
                (localization.title && existing.title === localization.title)
              );
            }
          );
          if (!existingCar) {
            const hybridCar = hybridLocalizedRow(car as CmsDocument, {
              title: localization.title,
              description: localization.description,
              locale: localization.locale,
              documentId: localization.documentId,
            });
            carsByLocale[localization.locale].push(hybridCar);
          }
        }
      });
    }
  });

  // ВАЖНО: исключаем "лишние" английские автомобили, у которых нет пары в RU по documentId.
  // Это ровно те записи, которые видны на EN сайте, но "не существуют" в CMS при просмотре RU локали.
  // См. scripts/show-extra-english-cars-by-docid.js
  const ruDocIds = new Set(
    (carsByLocale.ru || [])
      .map((c: unknown) => (c as { documentId?: string }).documentId)
      .filter((id): id is string => Boolean(id))
  );
  if (ruDocIds.size > 0 && Array.isArray(carsByLocale.en)) {
    carsByLocale.en = carsByLocale.en.filter((c: unknown) => {
      const docId = (c as { documentId?: string }).documentId;
      return Boolean(docId) && ruDocIds.has(docId as string);
    });
  }

  // Логируем результат для отладки
  console.log("🚗 Cars by locale summary:");
  Object.entries(carsByLocale).forEach(([locale, cars]) => {
    console.log(`  ${locale}: ${cars.length} cars`);
  });

  return carsByLocale;
}

async function fetchExcursionOrLegacyTourRows(): Promise<unknown[]> {
  const ex = await fetchWithCacheMaybe(
    "/excursions?populate=*&pagination[pageSize]=1000",
    "all-excursions-tour-ui"
  );
  if (ex !== null && Array.isArray(ex)) return ex;

  try {
    const rows = await fetchWithCache(
      "/tours?populate=*&pagination[pageSize]=1000",
      "all-tours-legacy-tour-ui"
    );
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

// Получение всех экскурсий (Strapi `excursion`, или legacy `tour` на старом проде)
export async function getAllTours(): Promise<NormalizedExcursionTour[]> {
  const rows = await fetchExcursionOrLegacyTourRows();
  return rows.map((row: unknown) => normalizeExcursionDocumentToTourCard(row));
}

export async function getAllTransfers() {
  try {
    const transfers = await fetchTransfersQuiet(
      "/transfers?populate=*&pagination[pageSize]=100"
    );
    return Array.isArray(transfers) ? transfers : [];
  } catch (error) {
    return [];
  }
}

// Получение блогов
export async function getAllBlogs() {
  return fetchWithCache(
    "/blog-posts?populate=*&pagination[pageSize]=100",
    "all-blogs"
  );
}

// Получение всех ID апартаментов для генерации статических путей
export async function getAllPropertyIds() {
  return fetchWithCache(
    "/properties?fields=id&pagination[pageSize]=1000",
    "property-ids"
  );
}

// Получение апартамента по ID (locale → Strapi; EN text fallback)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPropertyById(
  id: string,
  locale?: Locale | string
  // Strapi documents are loosely shaped; callers expect the previous any payload.
): Promise<any> {
  return getCmsDocumentById("properties", id, locale, [
    CMS_CACHE_TAGS.properties,
    CMS_CACHE_TAGS.apartments,
  ]);
}

// Получение блога по ID
export async function getBlogById(id: string) {
  const blog = await fetchWithCache(
    `/blog-posts/${id}?populate=*`,
    `blog-${id}`
  );

  // Изображения загружаются динамически, без предзагрузки в SSG

  return blog;
}

// Получение экскурсии по documentId (коллекция `excursions` или legacy `tours`)
export async function getTourById(id: string): Promise<NormalizedExcursionTour> {
  const ex = await fetchWithCacheMaybe(
    `/excursions/${id}?populate=*`,
    `excursion-${id}`
  );
  if (ex != null) {
    return normalizeExcursionDocumentToTourCard(ex);
  }
  const raw = await fetchWithCache(
    `/tours/${id}?populate=*`,
    `tour-legacy-${id}`
  );
  return normalizeExcursionDocumentToTourCard(raw);
}

export async function getTransferById(id: string) {
  try {
    const transfer = await fetchTransfersQuiet(`/transfers/${id}?populate=*`);
    if (transfer) return transfer;
  } catch (error) {
    // Ignore and return not found below.
  }

  throw new Error(`Transfer not found: ${id}`);
}

// Получение машины по ID через Documents API (locale → Strapi; EN text fallback)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getCarById(
  id: string,
  locale?: Locale | string
): Promise<any> {
  return getCmsDocumentById("cars", id, locale, [
    CMS_CACHE_TAGS.cars,
    CMS_CACHE_TAGS.carsAll,
  ]);
}

// Получение всех ID автомобилей для генерации статических путей через Documents API
export async function getAllCarIds() {
  return fetchWithCache("/cars?fields=id&pagination[pageSize]=1000", "car-ids");
}

// Получение всех ID экскурсий для генерации статических путей
export async function getAllTourIds() {
  const ex = await fetchWithCacheMaybe(
    "/excursions?pagination[pageSize]=1000",
    "excursion-ids"
  );
  let rows: unknown[] = [];
  if (ex !== null && Array.isArray(ex)) {
    rows = ex;
  } else {
    try {
      const r = await fetchWithCache(
        "/tours?pagination[pageSize]=1000",
        "tour-ids-legacy"
      );
      if (Array.isArray(r)) rows = r;
    } catch {
      rows = [];
    }
  }
  return rows
    .map((r: unknown) => {
      const row = r as { documentId?: string; id?: number };
      return {
        documentId: String(row?.documentId ?? row?.id ?? ""),
      };
    })
    .filter((x) => x.documentId.length > 0);
}

export async function getAllTransferIds() {
  try {
    const transfers = await fetchTransfersQuiet(
      "/transfers?fields=id&pagination[pageSize]=1000"
    );
    if (Array.isArray(transfers)) return transfers;
  } catch (error) {
    // Ignore and return empty list below.
  }
  return [];
}

// Получение всех ID блогов для генерации статических путей
export async function getAllBlogIds() {
  return fetchWithCache(
    "/blog-posts?fields=id&pagination[pageSize]=1000",
    "blog-ids"
  );
}

type HomeCarStrapiRow = HomeCarRow & {
  id: number;
  documentId: string;
  specifications?: {
    make?: string;
    model?: string;
    transmission?: string;
    fuel?: string;
  };
  rental_prices?: { day_1?: number; currency?: string };
  type?: string;
  images?: Array<{ url: string }>;
};

function toHomeCar(car: HomeCarStrapiRow) {
  const firstImage = car.images?.[0];
  return {
    id: car.id,
    documentId: car.documentId,
    title:
      car.title ||
      `${car.specifications?.make || "Car"} ${car.specifications?.model || ""}`.trim(),
    images: firstImage?.url ? [firstImage] : [],
    specifications: car.specifications,
    type: car.type,
    rental_prices: car.rental_prices,
  };
}

async function getHomeCars(language: string) {
  const key = cmsLocale(language);
  const listQuery = `${homePopulateQuery()}&${homeListQuery(HOME_CARS_FETCH_LIMIT)}&sort=title:ASC`;
  const tags = [
    CMS_CACHE_TAGS.home,
    CMS_CACHE_TAGS.cars,
    CMS_CACHE_TAGS.carsAll,
  ] as CmsCacheTag[];

  let rows = await fetchWithCache(
    `/cars?${listQuery}&locale=${key}`,
    `home-cars-list-${key}`,
    tags
  );
  if (key !== "en" && (!Array.isArray(rows) || rows.length === 0)) {
    rows = await fetchWithCache(
      `/cars?${listQuery}&locale=en`,
      "home-cars-list-en",
      tags
    );
  }
  if (!Array.isArray(rows)) return [];
  return pickHomeCarsByLocale(rows as HomeCarStrapiRow[], language).map(
    (car) => toHomeCar(car)
  );
}

async function getHomeProperties(language: string = "en"): Promise<unknown[]> {
  const key = cmsLocale(language);
  const listQuery = `${homePopulateQuery()}&${homeListQuery(HOME_PREVIEW_LIMIT)}&sort=updatedAt:DESC`;
  const tags = [
    CMS_CACHE_TAGS.home,
    CMS_CACHE_TAGS.properties,
    CMS_CACHE_TAGS.apartments,
  ] as CmsCacheTag[];

  const enRows = await fetchWithCache(
    `/properties?${listQuery}&locale=en`,
    "home-properties-en",
    tags
  );
  const enList = Array.isArray(enRows) ? (enRows as CmsDocument[]) : [];
  if (key === "en") return enList;

  // Overlay from the full locale catalog. Fetching only the latest N localized
  // rows misses the EN preview IDs (those “latest” rows are a different set).
  let localized: CmsDocument[] = [];
  try {
    const rows = await fetchPropertiesForCmsLocale(key);
    localized = Array.isArray(rows) ? (rows as CmsDocument[]) : [];
  } catch {
    localized = [];
  }

  return mergeLocalizedCatalog(enList, localized);
}

async function getHomeBlogs(language: string): Promise<unknown[]> {
  const endpoint = `/blog-posts?${homePopulateQuery()}&${homeListQuery(HOME_PREVIEW_LIMIT)}&sort=publishedAt:DESC`;
  const rows = await fetchWithCache(endpoint, `home-blogs-${language}`, [
    CMS_CACHE_TAGS.home,
    CMS_CACHE_TAGS.blogs,
  ]);
  return Array.isArray(rows) ? rows : [];
}

async function getHomeTransfers(): Promise<unknown[]> {
  try {
    const transfers = await fetchTransfersQuiet(
      `/transfers?${homePopulateQuery()}&${homeListQuery(HOME_PREVIEW_LIMIT)}`
    );
    return Array.isArray(transfers) ? transfers : [];
  } catch {
    return [];
  }
}

// Получение данных для главной страницы с трансформацией
export async function getHomePageData(language: string = "en") {
  try {
    const [carsResult, propertiesResult, blogsResult, transfersResult] =
      await Promise.allSettled([
        getHomeCars(language),
        getHomeProperties(language),
        getHomeBlogs(language),
        getHomeTransfers(),
      ]);

    const cars =
      carsResult.status === "fulfilled" ? carsResult.value : [];

    // Трансформация недвижимости
    const properties =
      propertiesResult.status === "fulfilled"
        ? (propertiesResult.value as Array<{
              id: number;
              documentId: string;
              title?: string;
              description?: string;
              type?: string;
              location?: { city?: string };
              category?: string;
              specifications?: { bedrooms?: number; bathrooms?: number };
              price?: { amount: number; currency?: string; period?: string };
              contact?: { name?: string; email?: string; phone?: string };
              images?: Array<{ url: string }>;
            }>).map((property) => ({
              id: property.id,
              documentId: property.documentId,
              title: property.title || "Property",
              description:
                property.description || "Beautiful stay in Tenerife",
              image: getImageUrl(property),
              price: formatPropertyPriceLabel({
                amount: property.price?.amount || 0,
                currency: property.price?.currency,
                period: property.price?.period,
                language,
              }),
              location: property.location?.city || "Tenerife",
              amenities: [
                "WiFi",
                getLocalizedText(language, "airConditioning"),
                property.specifications?.bedrooms &&
                  `${property.specifications.bedrooms} ${getLocalizedText(language, "bedrooms")}`,
                property.specifications?.bathrooms &&
                  `${property.specifications.bathrooms} ${getLocalizedText(language, "bathrooms")}`,
              ]
                .filter(Boolean)
                .join(", "),
              rating: 4.5,
              contact: property.contact,
            })
          )
        : [];

    // Трансформация блогов
    const blogs =
      blogsResult.status === "fulfilled"
        ? (blogsResult.value as Array<{
              id: number;
              documentId: string;
              title?: string;
              excerpt?: string;
              description?: string;
              author?: string;
              readTime?: number;
              read_time?: number;
              publishedAt?: string;
              images?: Array<{ url: string }>;
            }>).map((blog) => ({
              id: blog.id,
              documentId: blog.documentId,
              title: blog.title || "Blog Post",
              description:
                blog.excerpt ||
                blog.description ||
                "Interesting article about Tenerife",
              image: getImageUrl(blog),
              author: blog.author || "Admin",
              readTime: `${blog.readTime || blog.read_time || 5} ${getLocalizedText(language, "minRead")}`,
              publishedDate: blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleDateString()
                : new Date().toLocaleDateString(),
              rating: 4.7,
            })
          )
        : [];

    const normalizeTransfer = (transfer: Transfer) => ({
      id: transfer.id,
      documentId: transfer.documentId,
      title: transfer.title || "Airport transfer",
      description:
        transfer.description || "Private airport transfer in Tenerife",
      seats: Number(transfer.seats || 0),
      price_south_airport: Number(transfer.price_south_airport || 50),
      price_north_airport: Number(transfer.price_north_airport || 100),
      currency: transfer.currency || "EUR",
      image:
        typeof transfer.image === "string" && transfer.image.length > 0
          ? transfer.image
          : undefined,
      images: transfer.images,
      contact: transfer.contact,
    });

    const transfers =
      transfersResult.status === "fulfilled" &&
      Array.isArray(transfersResult.value)
        ? (transfersResult.value as Transfer[]).map(normalizeTransfer)
        : [];

    return {
      properties,
      cars,
      blogs,
      transfers,
    };
  } catch (error) {
    console.error("Error loading home page data:", error);
    return {
      properties: [],
      cars: [],
      blogs: [],
      transfers: [],
    };
  }
}
