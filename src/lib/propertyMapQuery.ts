export type PropertyMapPrecision = "address" | "city" | "district";

export type PropertyMapLocation = {
  address?: string | null;
  city?: string | null;
  region?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type PropertyMapSearch = {
  query: string;
  precision: PropertyMapPrecision;
  label: string;
  /** Town or district to show when a street cannot be placed. */
  areaLabel: string;
  /** Accent-free key used to find a known town center. */
  placeKey: string;
};

const VAGUE_PLACES = new Set([
  "apartment",
  "canary islands",
  "espana",
  "islas canarias",
  "spain",
  "santa cruz de tenerife",
  "tenerife",
  "test district",
]);

export function normalizePlaceKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function inTenerife(lat: number, lng: number): boolean {
  return lat >= 27.98 && lat <= 28.6 && lng >= -16.95 && lng <= -16.1;
}

export function storedTenerifeCoordinates(
  location: PropertyMapLocation
): { lat: number; lng: number } | null {
  const lat = Number(location.latitude);
  const lng = Number(location.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat === 0 && lng === 0) return null;
  if (!inTenerife(lat, lng)) return null;
  return { lat, lng };
}

function undoubleAddress(value: string): string {
  const spainAt = value.indexOf("Spain");
  if (spainAt > 20 && spainAt < value.length - 5) {
    return value.slice(0, spainAt + "Spain".length).trim();
  }
  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length >= 16 && compact.length % 2 === 0) {
    const half = compact.length / 2;
    if (compact.slice(0, half) === compact.slice(half)) {
      return compact.slice(0, half).trim();
    }
  }
  return compact;
}

export function cleanPlaceName(value: string | null | undefined): string | null {
  if (!value) return null;
  let text = undoubleAddress(value).replace(/\s+/g, " ").trim();
  if (!text || text === "-" || text === "—" || /^n\/?a$/i.test(text)) return null;
  text = text.replace(/^\d{4,5}\s+/, "").trim();
  if (!text || VAGUE_PLACES.has(normalizePlaceKey(text))) return null;
  return text;
}

function isStreetAddress(address: string, city: string | null): boolean {
  if (city && normalizePlaceKey(address) === normalizePlaceKey(city)) return false;
  if (/\d/.test(address)) return true;
  return /\b(calle|avenida|avda|av|street|carretera|camino|plaza|paseo|via|c)\b/i.test(
    address
  );
}

function withIsland(query: string): string {
  const key = normalizePlaceKey(query);
  if (key.includes("tenerife") || key.includes("spain") || key.includes("espana")) {
    return query;
  }
  return `${query}, Tenerife, Spain`;
}

export function propertyMapSearch(
  location: PropertyMapLocation
): PropertyMapSearch | null {
  const city = cleanPlaceName(location.city);
  const region = cleanPlaceName(location.region);
  const address = cleanPlaceName(location.address);
  const street =
    address && isStreetAddress(address, city) ? address : null;

  if (street) {
    const locality = city ?? region;
    const streetKey = normalizePlaceKey(street);
    const alreadyPlaced =
      streetKey.includes("spain") ||
      streetKey.includes("espana") ||
      streetKey.includes("tenerife");
    const query = alreadyPlaced
      ? street
      : withIsland(locality ? `${street}, ${locality}` : street);
    const streetLabel = street.split(",")[0]?.trim() || street;
    return {
      query,
      precision: "address",
      label: streetLabel.length <= 48 ? streetLabel : locality ?? streetLabel,
      areaLabel: locality ?? streetLabel,
      placeKey: city ? normalizePlaceKey(city) : region ? normalizePlaceKey(region) : "",
    };
  }

  if (city) {
    return {
      query: withIsland(city),
      precision: "city",
      label: city,
      areaLabel: city,
      placeKey: normalizePlaceKey(city),
    };
  }

  if (region) {
    return {
      query: withIsland(region),
      precision: "district",
      label: region,
      areaLabel: region,
      placeKey: normalizePlaceKey(region),
    };
  }

  return null;
}
