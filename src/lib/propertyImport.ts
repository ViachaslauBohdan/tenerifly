export type PropertyImportIssue = {
  index: number;
  path: string;
  message: string;
};

export type PropertyDraft = Record<string, unknown>;

export type PropertyImportPreview = {
  ok: boolean;
  issues: PropertyImportIssue[];
  properties: PropertyDraft[];
};

const TYPES = new Set(["rent", "sale"]);
const STATUSES = new Set(["available", "reserved", "rented", "sold"]);
const CATEGORIES = new Set(["apartment", "house", "villa", "commercial", "plot"]);
const PERIODS = new Set(["day", "week", "month", "total"]);
const CURRENCIES = new Set(["EUR", "USD"]);
const CONTACT_PREFERENCES = new Set(["whatsapp", "telegram", "phone", "email"]);

const SPEC_NUMBER_KEYS = [
  "total_area",
  "living_area",
  "bedrooms",
  "bathrooms",
  "floor",
  "total_floors",
  "year_built",
  "parking_spaces",
] as const;

const FEATURE_KEYS = [
  "has_pool",
  "has_garden",
  "has_garage",
  "has_terrace",
  "has_security",
  "has_air_conditioning",
  "has_heating",
  "has_internet",
  "furnished",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function issue(
  issues: PropertyImportIssue[],
  index: number,
  path: string,
  message: string
) {
  issues.push({ index, path, message });
}

export function slugifyTitle(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function requireString(
  issues: PropertyImportIssue[],
  index: number,
  path: string,
  value: unknown,
  label: string
): string | null {
  if (typeof value !== "string" || !value.trim()) {
    issue(issues, index, path, `${label} должен быть непустой строкой`);
    return null;
  }
  return value.trim();
}

function optionalString(
  issues: PropertyImportIssue[],
  index: number,
  path: string,
  value: unknown
): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    issue(issues, index, path, "должно быть строкой");
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed || undefined;
}

function optionalNumber(
  issues: PropertyImportIssue[],
  index: number,
  path: string,
  value: unknown
): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    issue(issues, index, path, "должно быть числом");
    return undefined;
  }
  return value;
}

function optionalBoolean(
  issues: PropertyImportIssue[],
  index: number,
  path: string,
  value: unknown
): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "boolean") {
    issue(issues, index, path, "должно быть true или false");
    return undefined;
  }
  return value;
}

function readImages(
  issues: PropertyImportIssue[],
  index: number,
  value: unknown
): Array<string | number> | undefined {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) {
    issue(issues, index, "images", "фото должны быть массивом ссылок");
    return undefined;
  }
  const images: Array<string | number> = [];
  value.forEach((item, imageIndex) => {
    if (typeof item === "number" && Number.isFinite(item)) {
      images.push(item);
      return;
    }
    if (typeof item === "string" && /^https?:\/\//i.test(item.trim())) {
      images.push(item.trim());
      return;
    }
    issue(
      issues,
      index,
      `images[${imageIndex}]`,
      "нужна прямая ссылка http(s) или id уже загруженного файла"
    );
  });
  return images;
}

function readProperty(
  raw: unknown,
  index: number,
  issues: PropertyImportIssue[]
): PropertyDraft | null {
  if (!isRecord(raw)) {
    issue(issues, index, "", "объект апартамента должен быть JSON-объектом");
    return null;
  }

  const title = requireString(issues, index, "title", raw.title, "Название");
  const description = requireString(
    issues,
    index,
    "description",
    raw.description,
    "Описание"
  );

  let type: string | null = null;
  if (!TYPES.has(String(raw.type))) {
    issue(issues, index, "type", "укажите rent или sale");
  } else {
    type = String(raw.type);
  }

  let propertyStatus: string | null = null;
  if (!STATUSES.has(String(raw.property_status))) {
    issue(
      issues,
      index,
      "property_status",
      "укажите available, reserved, rented или sold"
    );
  } else {
    propertyStatus = String(raw.property_status);
  }

  let category: string | null = null;
  if (!CATEGORIES.has(String(raw.category))) {
    issue(
      issues,
      index,
      "category",
      "укажите apartment, house, villa, commercial или plot"
    );
  } else {
    category = String(raw.category);
  }

  const featured = optionalBoolean(issues, index, "featured", raw.featured);

  let price: PropertyDraft | null = null;
  if (!isRecord(raw.price)) {
    issue(issues, index, "price", "цена должна быть объектом с amount, currency и period");
  } else {
    const amount = optionalNumber(issues, index, "price.amount", raw.price.amount);
    if (raw.price.amount === undefined || raw.price.amount === null) {
      issue(issues, index, "price.amount", "укажите сумму числом");
    } else if (typeof amount === "number" && amount <= 0) {
      issue(issues, index, "price.amount", "сумма должна быть больше нуля");
    }
    const currency = optionalString(issues, index, "price.currency", raw.price.currency);
    if (currency && !CURRENCIES.has(currency)) {
      issue(issues, index, "price.currency", "валюта: EUR или USD");
    } else if (!currency) {
      issue(issues, index, "price.currency", "укажите EUR или USD");
    }
    const period = optionalString(issues, index, "price.period", raw.price.period);
    if (period && !PERIODS.has(period)) {
      issue(issues, index, "price.period", "период: day, week, month или total");
    } else if (!period) {
      issue(issues, index, "price.period", "укажите day, week, month или total");
    }
    if (
      typeof amount === "number" &&
      amount > 0 &&
      currency &&
      CURRENCIES.has(currency) &&
      period &&
      PERIODS.has(period)
    ) {
      price = { amount, currency, period };
    }
  }

  const specifications: PropertyDraft = {};
  if (raw.specifications !== undefined && raw.specifications !== null) {
    if (!isRecord(raw.specifications)) {
      issue(issues, index, "specifications", "должно быть объектом");
    } else {
      for (const key of SPEC_NUMBER_KEYS) {
        const value = optionalNumber(
          issues,
          index,
          `specifications.${key}`,
          raw.specifications[key]
        );
        if (value !== undefined) specifications[key] = value;
      }
    }
  }

  const features: PropertyDraft = {};
  if (raw.features !== undefined && raw.features !== null) {
    if (!isRecord(raw.features)) {
      issue(issues, index, "features", "должно быть объектом");
    } else {
      for (const key of FEATURE_KEYS) {
        const value = optionalBoolean(issues, index, `features.${key}`, raw.features[key]);
        if (value !== undefined) features[key] = value;
      }
      const extra = optionalString(
        issues,
        index,
        "features.additional_features",
        raw.features.additional_features
      );
      if (extra) features.additional_features = extra;
    }
  }

  let location: PropertyDraft | null = null;
  if (!isRecord(raw.location)) {
    issue(issues, index, "location", "нужен объект с городом");
  } else {
    const city = requireString(issues, index, "location.city", raw.location.city, "Город");
    const address = optionalString(issues, index, "location.address", raw.location.address);
    const region = optionalString(issues, index, "location.region", raw.location.region);
    const postalCode = optionalString(
      issues,
      index,
      "location.postal_code",
      raw.location.postal_code
    );
    const latitude = optionalNumber(issues, index, "location.latitude", raw.location.latitude);
    const longitude = optionalNumber(
      issues,
      index,
      "location.longitude",
      raw.location.longitude
    );
    if (city) {
      location = { city };
      if (address) location.address = address;
      if (region) location.region = region;
      if (postalCode) location.postal_code = postalCode;
      if (latitude !== undefined) location.latitude = latitude;
      if (longitude !== undefined) location.longitude = longitude;
    }
  }

  let contact: PropertyDraft | undefined;
  if (raw.contact !== undefined && raw.contact !== null) {
    if (!isRecord(raw.contact)) {
      issue(issues, index, "contact", "должно быть объектом");
    } else {
      contact = {};
      for (const key of ["name", "email", "phone", "whatsapp", "telegram"] as const) {
        const value = optionalString(issues, index, `contact.${key}`, raw.contact[key]);
        if (value) contact[key] = value;
      }
      const preferred = optionalString(
        issues,
        index,
        "contact.preferred_contact",
        raw.contact.preferred_contact
      );
      if (preferred && !CONTACT_PREFERENCES.has(preferred)) {
        issue(
          issues,
          index,
          "contact.preferred_contact",
          "укажите whatsapp, telegram, phone или email"
        );
      } else if (preferred) {
        contact.preferred_contact = preferred;
      }
      if (Object.keys(contact).length === 0) contact = undefined;
    }
  }

  const explicitSlug = optionalString(issues, index, "slug", raw.slug);
  const slug = explicitSlug || (title ? slugifyTitle(title) : "");
  if (!slug) {
    issue(issues, index, "slug", "не удалось получить slug");
  }

  const images = readImages(issues, index, raw.images);

  if (
    !title ||
    !description ||
    !type ||
    !propertyStatus ||
    !category ||
    !price ||
    !location ||
    !slug
  ) {
    return null;
  }

  const draft: PropertyDraft = {
    title,
    slug,
    description,
    type,
    property_status: propertyStatus,
    category,
    featured: featured ?? false,
    price,
    location,
  };
  if (Object.keys(specifications).length > 0) draft.specifications = specifications;
  if (Object.keys(features).length > 0) draft.features = features;
  if (contact) draft.contact = contact;
  if (images) draft.images = images;
  return draft;
}

export function parsePropertyImport(raw: string): PropertyImportPreview {
  const issues: PropertyImportIssue[] = [];
  const text = raw.trim();
  if (!text) {
    issue(issues, -1, "", "Вставьте JSON с апартаментами");
    return { ok: false, issues, properties: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : "некорректный JSON";
    issue(issues, -1, "", `JSON не читается: ${message}`);
    return { ok: false, issues, properties: [] };
  }

  const list = Array.isArray(parsed) ? parsed : isRecord(parsed) ? [parsed] : null;
  if (!list) {
    issue(issues, -1, "", "Нужен массив объектов или один объект");
    return { ok: false, issues, properties: [] };
  }
  if (list.length === 0) {
    issue(issues, -1, "", "В массиве нет апартаментов");
    return { ok: false, issues, properties: [] };
  }
  if (list.length > 100) {
    issue(issues, -1, "", "За один раз можно загрузить не больше 100 объектов");
    return { ok: false, issues, properties: [] };
  }

  const properties: PropertyDraft[] = [];
  const slugs = new Map<string, number>();
  list.forEach((item, index) => {
    const before = issues.length;
    const draft = readProperty(item, index, issues);
    if (!draft || issues.length > before) return;
    const slug = String(draft.slug);
    const previous = slugs.get(slug);
    if (previous !== undefined) {
      issue(
        issues,
        index,
        "slug",
        `такой slug уже есть у объекта ${previous + 1} в этом JSON`
      );
      return;
    }
    slugs.set(slug, index);
    properties.push(draft);
  });

  if (issues.length > 0) {
    return { ok: false, issues, properties: [] };
  }
  return { ok: true, issues, properties };
}
