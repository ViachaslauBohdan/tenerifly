export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "tenerifejoy_utm";
const MAX_UTM_LENGTH = 200;

type UtmStorage = Pick<Storage, "getItem" | "setItem">;

export function sanitizeUtmValue(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F<>]/g, "").trim().slice(0, MAX_UTM_LENGTH);
}

export function normalizeUtm(input: unknown): UtmParams {
  if (!input || typeof input !== "object") return {};

  const record = input as Record<string, unknown>;
  const result: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = sanitizeUtmValue(record[key]);
    if (value) result[key] = value;
  }
  return result;
}

export function hasUtmParams(utm: UtmParams): boolean {
  return UTM_KEYS.some((key) => Boolean(utm[key]));
}

export function parseUtmSearch(search: string): UtmParams {
  const params = new URLSearchParams(search.replace(/^\?/, ""));
  const result: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = sanitizeUtmValue(params.get(key));
    if (value) result[key] = value;
  }
  return result;
}

export function readStoredUtm(storage: Pick<Storage, "getItem">): UtmParams {
  try {
    return normalizeUtm(JSON.parse(storage.getItem(STORAGE_KEY) || "null"));
  } catch {
    return {};
  }
}

export function writeStoredUtm(storage: Pick<Storage, "setItem">, utm: UtmParams) {
  if (!hasUtmParams(utm)) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(normalizeUtm(utm)));
  } catch {
    // Private mode or a blocked storage API should not break navigation.
  }
}

/** A landing URL with any UTM replaces the saved set. Otherwise the saved set is kept. */
export function captureUtm(search: string, storages: UtmStorage[]): UtmParams {
  const fromUrl = parseUtmSearch(search);
  if (hasUtmParams(fromUrl)) {
    for (const storage of storages) writeStoredUtm(storage, fromUrl);
    return fromUrl;
  }

  for (const storage of storages) {
    const stored = readStoredUtm(storage);
    if (!hasUtmParams(stored)) continue;
    for (const target of storages) writeStoredUtm(target, stored);
    return stored;
  }

  return {};
}

/** Adds saved tags without rewriting the query string the page already has. */
export function appendMissingUtm(search: string, utm: UtmParams): string {
  const params = new URLSearchParams(search.replace(/^\?/, ""));
  const missing = UTM_KEYS.filter((key) => {
    const value = utm[key];
    return Boolean(value) && params.get(key) !== value;
  });
  if (missing.length === 0) return search || "";

  const extra = missing
    .map((key) => `${key}=${encodeURIComponent(utm[key] || "")}`)
    .join("&");
  if (!search || search === "?") return `?${extra}`;
  const base = search.startsWith("?") ? search : `?${search}`;
  return `${base}&${extra}`;
}

export function syncUtmInAddressBar(args: {
  pathname: string;
  search: string;
  hash?: string;
  history: { state: unknown; replaceState: (state: unknown, title: string, url: string) => void };
  storages: UtmStorage[];
}) {
  const utm = captureUtm(args.search, args.storages);
  const nextSearch = appendMissingUtm(args.search, utm);
  if (!nextSearch || nextSearch === args.search) return;

  args.history.replaceState(
    args.history.state,
    "",
    `${args.pathname}${nextSearch}${args.hash || ""}`
  );
}
