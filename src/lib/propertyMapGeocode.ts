import { lookupTenerifePlace } from "@/lib/tenerifePlaces";
import {
  inTenerife,
  propertyMapSearch,
  storedTenerifeCoordinates,
  type PropertyMapLocation,
  type PropertyMapPrecision,
  type PropertyMapSearch,
} from "@/lib/propertyMapQuery";

export type PropertyMapPoint = {
  lat: number;
  lng: number;
  zoom: number;
  label: string;
  precision: PropertyMapPrecision;
  radiusMeters: number;
};

const ZOOM: Record<PropertyMapPrecision, number> = {
  address: 15.4,
  city: 13,
  district: 11.6,
};

const RADIUS: Record<PropertyMapPrecision, number> = {
  address: 0,
  city: 700,
  district: 1800,
};

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "TenerifeJoy/1.0 (https://tenerifejoy.com)";

type NominatimHit = {
  lat?: string;
  lon?: string;
  type?: string;
  address?: { postcode?: string };
};

const cache = new Map<string, PropertyMapPoint | null>();
const inflight = new Map<string, Promise<PropertyMapPoint | null>>();
let queue: Promise<unknown> = Promise.resolve();

export function resetPropertyMapGeocodeCache() {
  cache.clear();
  inflight.clear();
  queue = Promise.resolve();
}

function pointFrom(
  search: PropertyMapSearch,
  lat: number,
  lng: number,
  precision: PropertyMapPrecision = search.precision
): PropertyMapPoint {
  return {
    lat,
    lng,
    zoom: ZOOM[precision],
    label: search.label,
    precision,
    radiusMeters: RADIUS[precision],
  };
}

function knownPlace(search: PropertyMapSearch): PropertyMapPoint | null {
  if (!search.placeKey) return null;
  const place = lookupTenerifePlace(search.placeKey);
  if (!place) return null;
  const precision = search.precision === "address" ? "city" : search.precision;
  return pointFrom(
    {
      ...search,
      label: search.precision === "address" ? search.areaLabel : search.label,
    },
    place.lat,
    place.lng,
    precision
  );
}

function hitRank(type: string | undefined): number {
  if (
    type === "house" ||
    type === "building" ||
    type === "residential" ||
    type === "street" ||
    type === "primary" ||
    type === "secondary" ||
    type === "tertiary" ||
    type === "living_street" ||
    type === "pedestrian"
  ) {
    return 0;
  }
  if (
    type === "town" ||
    type === "city" ||
    type === "village" ||
    type === "hamlet" ||
    type === "suburb" ||
    type === "neighbourhood" ||
    type === "locality"
  ) {
    return 1;
  }
  if (
    type === "aerodrome" ||
    type === "bus_stop" ||
    type === "supermarket" ||
    type === "cafe" ||
    type === "bar" ||
    type === "terminal"
  ) {
    return 3;
  }
  return 2;
}

function enqueue<T>(task: () => Promise<T>, gapMs: number): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () =>
      gapMs > 0
        ? new Promise((resolve) => setTimeout(resolve, gapMs))
        : undefined,
    () =>
      gapMs > 0
        ? new Promise((resolve) => setTimeout(resolve, gapMs))
        : undefined
  );
  return run;
}

async function nominatim(
  query: string,
  fetchImpl: typeof fetch,
  gapMs: number
): Promise<{ lat: number; lng: number; type?: string } | null> {
  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
  url.searchParams.set("countrycodes", "es");
  url.searchParams.set("viewbox", "-16.95,28.6,-16.1,27.98");
  url.searchParams.set("bounded", "1");
  url.searchParams.set("q", query);

  const response = await enqueue(
    () =>
      fetchImpl(url, {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
          "User-Agent": USER_AGENT,
        },
      }),
    gapMs
  );
  if (!response.ok) return null;
  const hits = (await response.json()) as NominatimHit[];
  if (!Array.isArray(hits)) return null;

  const wantedPostal = query.match(/\b(38\d{3})\b/)?.[1];
  const ranked = hits
    .map((hit, index) => ({ hit, index }))
    .filter(({ hit }) => {
      const lat = Number(hit.lat);
      const lng = Number(hit.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || !inTenerife(lat, lng)) {
        return false;
      }
      const postcode = hit.address?.postcode;
      return !wantedPostal || !postcode || postcode === wantedPostal;
    })
    .sort(
      (a, b) => hitRank(a.hit.type) - hitRank(b.hit.type) || a.index - b.index
    );

  const best = ranked[0]?.hit;
  if (!best || (wantedPostal && hitRank(best.type) > 0)) return null;
  return { lat: Number(best.lat), lng: Number(best.lon), type: best.type };
}

const SETTLEMENT_TYPES = new Set([
  "town",
  "city",
  "village",
  "hamlet",
  "suburb",
  "neighbourhood",
  "locality",
  "administrative",
]);

export async function geocodePropertyLocation(
  location: PropertyMapLocation,
  options?: { fetchImpl?: typeof fetch; minIntervalMs?: number }
): Promise<PropertyMapPoint | null> {
  const search = propertyMapSearch(location);
  const stored = storedTenerifeCoordinates(location);
  if (stored && search) {
    return pointFrom(search, stored.lat, stored.lng);
  }
  if (stored) {
    return {
      lat: stored.lat,
      lng: stored.lng,
      zoom: ZOOM.address,
      label: "Tenerife",
      precision: "address",
      radiusMeters: 0,
    };
  }
  if (!search) return null;

  if (search.precision !== "address") {
    const known = knownPlace(search);
    if (known) return known;
  }

  const cacheKey = search.queries.join(" | ") || search.query;
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached ?? knownPlace(search);

  const pending = inflight.get(cacheKey);
  if (pending) return pending;

  const fetchImpl = options?.fetchImpl ?? fetch;
  const gapMs = options?.minIntervalMs ?? 1100;
  const request = (async () => {
    try {
      let point: PropertyMapPoint | null = null;
      for (const query of search.queries) {
        const hit = await nominatim(query, fetchImpl, gapMs);
        if (!hit) continue;
        const streetLevel = hitRank(hit.type) === 0;
        if (search.precision === "address" && !streetLevel) continue;
        const precision =
          search.precision === "address" &&
          hit.type &&
          SETTLEMENT_TYPES.has(hit.type)
            ? "city"
            : search.precision;
        point = pointFrom(search, hit.lat, hit.lng, precision);
        break;
      }
      const resolved = point ?? knownPlace(search);
      cache.set(cacheKey, resolved);
      return resolved;
    } catch {
      const fallback = knownPlace(search);
      cache.set(cacheKey, fallback);
      return fallback;
    } finally {
      inflight.delete(cacheKey);
    }
  })();

  inflight.set(cacheKey, request);
  return request;
}
