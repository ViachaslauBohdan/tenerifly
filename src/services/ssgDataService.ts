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
const getImageUrl = (item: any): string => {
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
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      headers: getAuthHeaders(),
      next: { revalidate: 3600 }, // Кэширование на уровне Next.js
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    cache.set(cacheKey, {
      data: data.data || data,
      timestamp: now,
    });

    return data.data || data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// Получение всех апартаментов
export async function getAllProperties() {
  return fetchWithCache(
    "/properties?populate=*&pagination[pageSize]=1000",
    "all-properties"
  );
}

// Получение всех автомобилей
export async function getAllCars() {
  return fetchWithCache(
    "/cars?populate=*&pagination[pageSize]=1000",
    "all-cars"
  );
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
  return fetchWithCache(`/properties/${id}?populate=*`, `property-${id}`);
}

// Получение всех ID автомобилей для генерации статических путей
export async function getAllCarIds() {
  return fetchWithCache("/cars?fields=id&pagination[pageSize]=1000", "car-ids");
}

// Получение автомобиля по ID
export async function getCarById(id: string) {
  return fetchWithCache(`/cars/${id}?populate=*`, `car-${id}`);
}

// Получение всех ID экскурсий для генерации статических путей
export async function getAllTourIds() {
  return fetchWithCache(
    "/tours?fields=id&pagination[pageSize]=1000",
    "tour-ids"
  );
}

// Получение экскурсии по ID
export async function getTourById(id: string) {
  return fetchWithCache(`/tours/${id}?populate=*`, `tour-${id}`);
}

// Получение всех ID блогов для генерации статических путей
export async function getAllBlogIds() {
  return fetchWithCache(
    "/blog-posts?fields=id&pagination[pageSize]=1000",
    "blog-ids"
  );
}

// Получение блога по ID
export async function getBlogById(id: string) {
  return fetchWithCache(`/blog-posts/${id}?populate=*`, `blog-${id}`);
}

// Получение данных для главной страницы с трансформацией
export async function getHomePageData(language: string = "en") {
  try {
    const [toursResult, carsResult, propertiesResult, blogsResult] =
      await Promise.allSettled([
        getAllTours(),
        getAllCars(),
        getAllProperties(),
        getAllBlogs(),
      ]);

    // Трансформация туров
    const tours =
      toursResult.status === "fulfilled"
        ? toursResult.value.map((tour: any) => ({
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
          }))
        : [];

    // Трансформация автомобилей
    const cars =
      carsResult.status === "fulfilled"
        ? carsResult.value.map((car: any) => ({
            id: car.id,
            documentId: car.documentId,
            title:
              car.title ||
              `${car.specifications?.make || "Car"} ${car.specifications?.model || ""}`.trim(),
            description: car.description || "Reliable car for your journey",
            image: getImageUrl(car),
            price: `€${car.rental_prices?.day_1 || 30}/${getLocalizedText(language, "day")}`,
            transmission:
              car.specifications?.transmission === "automatic"
                ? getLocalizedText(language, "automatic")
                : getLocalizedText(language, "manual"),
            features: [
              car.features?.air_conditioning &&
                getLocalizedText(language, "airConditioning"),
              `${car.specifications?.seats || 5} ${getLocalizedText(language, "seats")}`,
              car.features?.bluetooth && "Bluetooth",
              car.specifications?.fuel,
              car.specifications?.year && `${car.specifications.year}`,
            ]
              .filter(Boolean)
              .join(", "),
            rating: 4.6,
            specifications: car.specifications,
            location: car.location,
            rental_prices: car.rental_prices,
            type: car.type,
            car_status: car.car_status,
          }))
        : [];

    // Трансформация недвижимости
    const properties =
      propertiesResult.status === "fulfilled"
        ? propertiesResult.value.map((property: any) => ({
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
          }))
        : [];

    // Трансформация блогов
    const blogs =
      blogsResult.status === "fulfilled"
        ? blogsResult.value.map((blog: any) => ({
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
          }))
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
      cars: [],
      tours: [],
      blogs: [],
    };
  }
}
