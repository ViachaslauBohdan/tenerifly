export type PropertyMapPrecision = "address" | "city" | "district";

export type PropertyMapLocation = {
  address?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type PropertyMapSearch = {
  query: string;
  /** Street queries, most specific first. The geocoder stops at the first hit. */
  queries: string[];
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

function expandStreetPrefix(value: string): string {
  return value
    .replace(/\bC\/\s*/g, "Calle ")
    .replace(/\bC\.\s+(?=[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/g, "Calle ")
    .replace(/\bAvda\.\s*/gi, "Avenida ")
    .replace(/\bAv\.\s*/gi, "Avenida ");
}

function tenerifePostal(value: string | null | undefined): string {
  return value?.match(/\b(38\d{3})\b/)?.[1] ?? "";
}

function pushQuery(queries: string[], query: string) {
  const text = query.replace(/\s+/g, " ").replace(/\s+,/g, ",").trim();
  if (text && !queries.includes(text)) queries.push(text);
}

/** Queries Nominatim can place. A pasted Google line and the town name both miss the street. */
export function streetGeocodeQueries(location: PropertyMapLocation): string[] {
  const city = cleanPlaceName(location.city);
  const region = cleanPlaceName(location.region);
  const raw = cleanPlaceName(location.address);
  if (!raw || !isStreetAddress(raw, city)) return [];

  let address = expandStreetPrefix(raw).replace(/\([^)]*\)/g, " ");
  address = address
    .replace(
      /,?\s*(?:santa cruz de tenerife|canary islands|islas canarias|canarias|spain|españa|espana)\b/gi,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();

  const postalInAddress = tenerifePostal(address);
  address = address.replace(/\b38\d{3}\b/g, " ").replace(/\s+/g, " ").trim();
  address = address.replace(/^[, ]+|[, ]+$/g, "");

  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  let street = parts[0] ?? "";
  let number = "";
  const numberOnStreet = street.match(/^(.*\p{L}.*?)\s+(\d+[A-Za-z]?)$/u);
  if (numberOnStreet) {
    street = numberOnStreet[1].trim();
    number = numberOnStreet[2];
  }
  if (!number && parts[1] && /^\d+[A-Za-z]?$/.test(parts[1])) number = parts[1];

  const locality = city ?? region ?? "";
  const localityKey = locality ? normalizePlaceKey(locality) : "";
  const extraStart = number && parts[1] === number ? 2 : 1;
  const neighborhood =
    parts.slice(extraStart).find((part) => {
      const key = normalizePlaceKey(part);
      return Boolean(key) && key !== localityKey && !VAGUE_PLACES.has(key);
    }) ?? "";

  const postal = postalInAddress || (neighborhood ? "" : tenerifePostal(location.postalCode));
  const queries: string[] = [];
  if (street && number && postal) pushQuery(queries, `${number} ${street}, ${postal}, Tenerife`);
  if (street && neighborhood) pushQuery(queries, `${street}, ${neighborhood}, Tenerife`);
  if (street && postal) pushQuery(queries, `${street}, ${postal}, Tenerife`);
  if (street && number && locality) {
    pushQuery(queries, `${number} ${street}, ${locality}, Tenerife`);
  }
  if (street && locality) pushQuery(queries, `${street}, ${locality}, Tenerife`);
  if (street) pushQuery(queries, `${street}, Tenerife`);
  return queries;
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
    const queries = streetGeocodeQueries(location);
    const streetLabel = queries[0]?.split(",")[0]?.replace(/^\d+\s+/, "").trim() || street.split(",")[0]?.trim() || street;
    return {
      query: queries[0] || street,
      queries,
      precision: "address",
      label: streetLabel.length <= 48 ? streetLabel : locality ?? streetLabel,
      areaLabel: locality ?? streetLabel,
      placeKey: city ? normalizePlaceKey(city) : region ? normalizePlaceKey(region) : "",
    };
  }

  if (city) {
    const query = withIsland(city);
    return {
      query,
      queries: [query],
      precision: "city",
      label: city,
      areaLabel: city,
      placeKey: normalizePlaceKey(city),
    };
  }

  if (region) {
    const query = withIsland(region);
    return {
      query,
      queries: [query],
      precision: "district",
      label: region,
      areaLabel: region,
      placeKey: normalizePlaceKey(region),
    };
  }

  return null;
}
