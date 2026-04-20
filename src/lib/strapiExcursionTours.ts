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

  const priceNum = typeof d.price === "number" ? d.price : Number(d.price ?? 0);
  const price = {
    amount: Number.isFinite(priceNum) ? priceNum : 0,
    currency: "EUR",
    period: "person",
  };

  const images = collectImages(d);

  const meetingPoint = d.meetingPoint != null ? String(d.meetingPoint) : "";
  const inferredCity = inferCityFromMeetingPoint(meetingPoint);
  const locationFromMeeting =
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

  return {
    id: typeof d.id === "number" ? d.id : Number(row.id ?? 0),
    documentId: String(d.documentId ?? row.documentId ?? d.id ?? ""),
    name: title,
    title,
    slug,
    description,
    duration,
    language: "EN",
    available_days: null,
    createdAt: String(d.createdAt ?? ""),
    updatedAt: String(d.updatedAt ?? ""),
    publishedAt: String(d.publishedAt ?? ""),
    images,
    location: locationFromMeeting,
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
