/**
 * Map Strapi `excursion` documents to the flat "tour card" shape used by /tours UI.
 */

export type NormalizedExcursionTour = {
  id: number;
  documentId: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  language: string;
  available_days: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images: Array<{
    id: number;
    url: string;
    formats?: { thumbnail?: { url: string }; small?: { url: string } };
  }>;
  location: {
    address: string;
    city: string;
    region: string;
    postal_code: string;
    latitude: number | null;
    longitude: number | null;
  } | null;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  contact: null;
  category?: string;
  features?: unknown;
  available?: boolean;
  isPopular?: boolean;
  maxGroupSize?: number;
};

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "https://tenerifly-strapi-production.up.railway.app";

function absoluteMediaUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function pickUrlFromMedia(m: unknown): string | null {
  if (!m) return null;
  if (typeof m === "string") return absoluteMediaUrl(m);
  const o = m as Record<string, unknown>;
  const direct = o.url;
  if (typeof direct === "string") return absoluteMediaUrl(direct);
  const data = o.data as Record<string, unknown> | undefined;
  if (data?.attributes && typeof data.attributes === "object") {
    const u = (data.attributes as { url?: string }).url;
    if (typeof u === "string") return absoluteMediaUrl(u);
  }
  return null;
}

function collectImages(doc: Record<string, unknown>): Array<{
  id: number;
  url: string;
}> {
  const out: Array<{ id: number; url: string }> = [];
  let n = 0;

  const pushUrl = (url: string | null) => {
    if (!url) return;
    n += 1;
    out.push({ id: n, url });
  };

  const topLevelImages = doc.images;
  if (Array.isArray(topLevelImages)) {
    for (const g of topLevelImages) {
      pushUrl(pickUrlFromMedia(g));
    }
  }

  const gallery = doc.gallery;
  if (Array.isArray(gallery)) {
    for (const g of gallery) {
      pushUrl(pickUrlFromMedia(g));
    }
  } else if (gallery && typeof gallery === "object" && "data" in gallery) {
    const data = (gallery as { data?: unknown[] }).data;
    if (Array.isArray(data)) {
      for (const g of data) {
        pushUrl(pickUrlFromMedia(g));
      }
    }
  }

  const single = doc.image;
  if (single) {
    pushUrl(pickUrlFromMedia(single));
  }

  return out;
}

function stripRichText(s: string): string {
  if (!s.includes("<")) return s;
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** Best-effort city for filters — excursion `meetingPoint` is free text. */
function inferCityFromMeetingPoint(meetingPoint: string): string {
  const m = meetingPoint.toLowerCase();
  const checks: [string, string][] = [
    ["adeje", "Adeje"],
    ["las palmas", "Las Palmas"],
    ["puerto de la cruz", "Puerto de la Cruz"],
    ["santa cruz", "Santa Cruz de Tenerife"],
    ["los cristianos", "Los Cristianos"],
    ["playa de las américas", "Playa de las Américas"],
    ["güímar", "Güímar"],
    ["la orotava", "La Orotava"],
    ["icod", "Icod de los Vinos"],
    ["garachico", "Garachico"],
  ];
  for (const [needle, label] of checks) {
    if (m.includes(needle)) return label;
  }
  return "";
}

/**
 * Normalize one Strapi `excursion` REST item (flat v5 or nested attributes v4) to TourCard shape.
 */
export function normalizeExcursionDocumentToTourCard(
  raw: unknown
): NormalizedExcursionTour {
  const row = raw as Record<string, unknown>;
  const src = row.attributes
    ? { id: row.id, documentId: row.documentId, ...(row.attributes as object) }
    : row;

  const d = src as Record<string, unknown>;
  const title = String(d.name ?? d.title ?? "Tour");
  const descriptionRaw = String(d.description ?? "");
  const description = stripRichText(descriptionRaw);
  const duration = String(d.duration ?? "3");
  const slug = String(d.slug ?? "");

  const rawPrice = d.price;
  let priceNum = 0;
  if (typeof rawPrice === "number") {
    priceNum = rawPrice;
  } else if (rawPrice && typeof rawPrice === "object") {
    const amt = (rawPrice as { amount?: unknown }).amount;
    if (typeof amt === "number") priceNum = amt;
    else if (typeof amt === "string") priceNum = Number(amt) || 0;
  } else {
    priceNum = Number(rawPrice ?? 0);
  }
  const price = {
    amount: Number.isFinite(priceNum) ? priceNum : 0,
    currency: "EUR",
    period: "person",
  };

  const images = collectImages(d);

  const locRaw = d.location;
  let locationOut: NormalizedExcursionTour["location"] = null;
  if (locRaw && typeof locRaw === "object") {
    const L = locRaw as Record<string, unknown>;
    const city = String(L.city ?? "");
    const region = String(L.region ?? "");
    const addr = String(L.address ?? "");
    const hasPlace =
      (city && city !== "-") || (region && region !== "-") || (addr && addr !== "-");
    if (hasPlace) {
      locationOut = {
        address: addr,
        city: city !== "-" ? city : "",
        region: region !== "-" ? region : "",
        postal_code: String(L.postal_code ?? ""),
        latitude: (L.latitude as number | null) ?? null,
        longitude: (L.longitude as number | null) ?? null,
      };
    }
  }
  if (!locationOut) {
    const meetingPoint = d.meetingPoint != null ? String(d.meetingPoint) : "";
    const inferredCity = inferCityFromMeetingPoint(meetingPoint);
    locationOut =
      meetingPoint.length > 0 || inferredCity
        ? {
            address: meetingPoint,
            city: inferredCity,
            region: inferredCity ? "Tenerife" : "",
            postal_code: "",
            latitude: null as number | null,
            longitude: null as number | null,
          }
        : null;
  }

  return {
    id: typeof d.id === "number" ? d.id : Number(row.id ?? 0),
    documentId: String(d.documentId ?? row.documentId ?? d.id ?? ""),
    name: title,
    title,
    slug,
    description,
    duration,
    language: String(d.language ?? "EN"),
    available_days: null,
    createdAt: String(d.createdAt ?? ""),
    updatedAt: String(d.updatedAt ?? ""),
    publishedAt: String(d.publishedAt ?? ""),
    images,
    location: locationOut,
    price,
    contact: null,
    category: d.category != null ? String(d.category) : undefined,
    features: undefined,
    available: d.isActive !== false,
    isPopular: Boolean(d.isPopular),
    maxGroupSize: typeof d.maxGroupSize === "number" ? d.maxGroupSize : 20,
  } as unknown as NormalizedExcursionTour;
}

/** Map GET /api/excursions JSON to an array of tour-card objects. */
export function mapExcursionsApiResponseToTourCards(
  payload: unknown
): NormalizedExcursionTour[] {
  const p = payload as { data?: unknown[] };
  const list = Array.isArray(p?.data) ? p.data : [];
  return list.map((item) => normalizeExcursionDocumentToTourCard(item));
}

/** Query string for listing excursions (Strapi `excursion` type). */
export const STRAPI_EXCURSIONS_LIST_PATH =
  "/excursions/?populate=*&pagination[pageSize]=1000";

/** Legacy listing when production CMS still exposes `tour` only. */
export const STRAPI_TOURS_LEGACY_LIST_PATH =
  "/tours/?populate=*&pagination[pageSize]=1000";

/**
 * Client-side: try `/excursions` first; if that fails (e.g. 404 on older Strapi),
 * load `/tours`. Returns `{ data: [] }` when the primary responds OK with an empty list.
 */
export async function fetchStrapiTourListPayload(
  apiUrl: string,
  headers: HeadersInit
): Promise<{ data: unknown[] }> {
  const base = apiUrl.replace(/\/$/, "");
  const primary = await fetch(`${base}/api${STRAPI_EXCURSIONS_LIST_PATH}`, {
    headers,
  });
  if (primary.ok) {
    const json = (await primary.json()) as { data?: unknown[] };
    return { data: Array.isArray(json?.data) ? json.data : [] };
  }
  const fallback = await fetch(`${base}/api${STRAPI_TOURS_LEGACY_LIST_PATH}`, {
    headers,
  });
  if (!fallback.ok) {
    throw new Error(
      `Tour list unavailable (excursions ${primary.status}, tours ${fallback.status})`
    );
  }
  const json = (await fallback.json()) as { data?: unknown[] };
  return { data: Array.isArray(json?.data) ? json.data : [] };
}

/** Subset of tour filter state for in-memory filtering (legacy `/tours` API). */
export type TourListFilterInput = {
  location?: string;
  priceFrom?: string;
  priceTo?: string;
  duration?: string;
  language?: string;
};

export function applyClientTourFilters(
  tours: NormalizedExcursionTour[],
  filters: TourListFilterInput
): NormalizedExcursionTour[] {
  const locQ = filters.location?.trim().toLowerCase() ?? "";
  const pFrom = filters.priceFrom?.trim()
    ? Number(filters.priceFrom)
    : null;
  const pTo = filters.priceTo?.trim() ? Number(filters.priceTo) : null;
  const dur = filters.duration?.trim() ?? "";
  const lang = filters.language?.trim() ?? "";

  return tours.filter((t) => {
    if (locQ) {
      const loc = t.location;
      const hay = [loc?.city, loc?.region, loc?.address, t.title, t.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(locQ)) return false;
    }
    if (pFrom != null && !Number.isNaN(pFrom) && t.price.amount < pFrom) {
      return false;
    }
    if (pTo != null && !Number.isNaN(pTo) && t.price.amount > pTo) {
      return false;
    }
    if (dur) {
      const td = String(t.duration);
      if (td !== dur && !td.includes(dur) && !dur.includes(td)) return false;
    }
    if (lang && String(t.language) !== lang) return false;
    return true;
  });
}
