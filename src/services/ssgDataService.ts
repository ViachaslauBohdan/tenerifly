// Сервис для получения данных на сервере для SSG

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// Кэш на уровне приложения
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

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
  image?: { url: string };
}): string => {
  if (item.images && item.images.length > 0) {
    if (item.images[0].url.startsWith("http")) {
      return item.images[0].url;
    }
    return `${API_URL}${item.images[0].url}`;
  }

  if (item.image?.url) {
    if (item.image.url.startsWith("http")) {
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

// Функция для кэшированного запроса
async function fetchWithCache(endpoint: string, cacheKey: string) {
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const url = `${API_URL}/api${endpoint}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
      next: {
        revalidate: 3600, // Кэширование на уровне Next.js (1 час)
        tags: ["properties", "apartments", "cars"], // Для инвалидации кэша
      },
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

// Получение всех апартаментов с оптимизированным SSG
export async function getAllProperties() {
  try {
    console.log("🔧 SSG: Fetching properties from API...");
    const result = await fetchWithCache(
      "/properties?populate=*&pagination[pageSize]=1000",
      "all-properties"
    );
    return result;
  } catch (error) {
    console.error("❌ SSG: Error fetching properties:", error);
    // Return empty array as fallback to prevent build failures
    return [];
  }
}

// Функция для принудительной инвалидации кэша апартаментов
export async function revalidateProperties() {
  try {
    const { revalidateTag } = await import("next/cache");
    await revalidateTag("properties");
    await revalidateTag("apartments");
    console.log("🔄 SSG: Cache invalidated for properties");
  } catch (error) {
    console.error("❌ SSG: Error invalidating cache:", error);
  }
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
      next: {
        revalidate: 3600,
        tags: ["cars-all"],
      },
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
            // Создаем гибридный объект: локализованные title и description + остальное из оригинала
            const originalCar = car as Record<string, unknown>;
            const hybridCar = {
              ...originalCar, // Берем все из оригинального объекта
              title: localization.title, // Перезаписываем title локализованной версией
              description: localization.description, // Перезаписываем description локализованной версией
              locale: localization.locale, // Устанавливаем правильную локаль
              documentId: localization.documentId, // Используем documentId из локализации
            };
            carsByLocale[localization.locale].push(hybridCar);
          }
        }
      });
    }
  });

  // Логируем результат для отладки
  console.log("🚗 Cars by locale summary:");
  Object.entries(carsByLocale).forEach(([locale, cars]) => {
    console.log(`  ${locale}: ${cars.length} cars`);
  });

  return carsByLocale;
}

// Получение всех экскурсий
export async function getAllTours() {
  return fetchWithCache(
    "/tours?populate=*&pagination[pageSize]=1000",
    "all-tours"
  );
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

// Получение апартамента по ID
export async function getPropertyById(id: string) {
  const property = await fetchWithCache(
    `/properties/${id}?populate=*`,
    `property-${id}`
  );

  // Изображения загружаются динамически, без предзагрузки в SSG

  return property;
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

// Получение тура по ID
export async function getTourById(id: string) {
  const tour = await fetchWithCache(`/tours/${id}?populate=*`, `tour-${id}`);

  // Изображения загружаются динамически, без предзагрузки в SSG

  return tour;
}

// Получение машины по ID через Documents API
export async function getCarById(id: string) {
  const car = await fetchWithCache(`/cars/${id}?populate=*`, `car-${id}`);

  // Изображения загружаются динамически, без предзагрузки в SSG

  return car;
}

// Получение всех ID автомобилей для генерации статических путей через Documents API
export async function getAllCarIds() {
  return fetchWithCache("/cars?fields=id&pagination[pageSize]=1000", "car-ids");
}

// Получение всех ID экскурсий для генерации статических путей
export async function getAllTourIds() {
  return fetchWithCache(
    "/tours?fields=id&pagination[pageSize]=1000",
    "tour-ids"
  );
}

// Получение всех ID блогов для генерации статических путей
export async function getAllBlogIds() {
  return fetchWithCache(
    "/blog-posts?fields=id&pagination[pageSize]=1000",
    "blog-ids"
  );
}

// Получение данных для главной страницы с трансформацией
export async function getHomePageData(language: string = "en") {
  try {
    const [toursResult, carsResult, propertiesResult, blogsResult] =
      await Promise.allSettled([
        getAllTours(),
        getAllCarsAllLocales(), // Получаем все автомобили для главной страницы
        getAllProperties(),
        getAllBlogs(),
      ]);

    // Трансформация туров
    const tours =
      toursResult.status === "fulfilled"
        ? toursResult.value.map(
            (tour: {
              id: number;
              documentId: string;
              name?: string;
              title?: string;
              description?: string;
              duration?: string;
              price?: { amount: number };
              cost?: number;
              pricing?: { amount: number };
              maxGroupSize?: number;
              max_group_size?: number;
              images?: Array<{ url: string }>;
            }) => ({
              id: tour.id,
              documentId: tour.documentId,
              title: tour.name || tour.title || "Tour",
              description:
                tour.description || "Discover amazing places in Tenerife",
              duration: tour.duration || "3 hours",
              price: `€${tour.price?.amount || tour.cost || tour.pricing?.amount || 50}`,
              rating: 4.8,
              groupSize: `${getLocalizedText(language, "max")} ${tour.maxGroupSize || tour.max_group_size || 20} ${getLocalizedText(language, "people")}`,
              image: getImageUrl(tour),
            })
          )
        : [];

    // Трансформация автомобилей
    type CarItem = {
      id: number;
      documentId: string;
      title?: string;
      description?: string;
      specifications?: {
        make?: string;
        model?: string;
        transmission?: string;
        seats?: number;
        fuel?: string;
        year?: number;
      };
      features?: { air_conditioning?: boolean; bluetooth?: boolean };
      rental_prices?: { day_1?: number };
      location?: { city?: string; region?: string };
      type?: string;
      car_status?: string;
      images?: Array<{ url: string }>;
    };

    const carsByLocale =
      carsResult.status === "fulfilled"
        ? (carsResult.value as Record<string, CarItem[]>)
        : {};
    const carsRaw: CarItem[] = carsByLocale[language] || [];
    // const cars = carsRaw.map(
    //   (car: {
    //     id: number;
    //     documentId: string;
    //     title?: string;
    //     description?: string;
    //     specifications?: {
    //       make?: string;
    //       model?: string;
    //       transmission?: string;
    //       seats?: number;
    //       fuel?: string;
    //       year?: number;
    //     };
    //     features?: { air_conditioning?: boolean; bluetooth?: boolean };
    //     rental_prices?: { day_1?: number };
    //     location?: { city?: string; region?: string };
    //     type?: string;
    //     car_status?: string;
    //     images?: Array<{ url: string }>;
    //   }) => ({
    //     id: car.id,
    //     documentId: car.documentId,
    //     title:
    //       car.title ||
    //       `${car.specifications?.make || "Car"} ${car.specifications?.model || ""}`.trim(),
    //     description: car.description || "Reliable car for your journey",
    //     image: getImageUrl(car),
    //     price: `€${car.rental_prices?.day_1 || 30}/${getLocalizedText(language, "day")}`,
    //     transmission:
    //       car.specifications?.transmission === "automatic"
    //         ? getLocalizedText(language, "automatic")
    //         : getLocalizedText(language, "manual"),
    //     features: [
    //       car.features?.air_conditioning &&
    //         getLocalizedText(language, "airConditioning"),
    //       `${car.specifications?.seats || 5} ${getLocalizedText(language, "seats")}`,
    //       car.features?.bluetooth && "Bluetooth",
    //       car.specifications?.fuel,
    //       car.specifications?.year && `${car.specifications.year}`,
    //     ]
    //       .filter(Boolean)
    //       .join(", "),
    //     rating: 4.6,
    //     specifications: car.specifications,
    //     location: car.location,
    //     rental_prices: car.rental_prices,
    //     type: car.type,
    //     car_status: car.car_status,
    //   })
    // );

    const cars = carsByLocale;

    // Трансформация недвижимости
    const properties =
      propertiesResult.status === "fulfilled"
        ? propertiesResult.value.map(
            (property: {
              id: number;
              documentId: string;
              title?: string;
              description?: string;
              type?: string;
              location?: { city?: string };
              category?: string;
              specifications?: { bedrooms?: number; bathrooms?: number };
              price?: { amount: number };
              contact?: { name?: string; email?: string; phone?: string };
              images?: Array<{ url: string }>;
            }) => ({
              id: property.id,
              documentId: property.documentId,
              title: property.title || "Property",
              description:
                property.description || "Beautiful accommodation in Tenerife",
              image: getImageUrl(property),
              price: `€${property.price?.amount || 0}/${property.type === "rent" ? getLocalizedText(language, "month") : getLocalizedText(language, "night")}`,
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
        ? blogsResult.value.map(
            (blog: {
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
            }) => ({
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

    return {
      properties,
      cars,
      tours,
      blogs,
    };
  } catch (error) {
    console.error("Error loading home page data:", error);
    return {
      properties: [],
      cars: {},
      tours: [],
      blogs: [],
    };
  }
}
