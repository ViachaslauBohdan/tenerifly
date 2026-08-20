import { getAtlanticoConfig } from "./config";
import { toAtlanticoLanguage } from "./language";
import { classificationTourCount, countToursByCategory, withPositiveTourCounts } from "./parse";
import type {
  AtlanticoClassification,
  AtlanticoConfirmRequest,
  AtlanticoConfirmResponse,
  AtlanticoEventDetails,
  AtlanticoLoadLimitsResponse,
  AtlanticoTourDetails,
  AtlanticoTourSummary,
} from "./types";

export class AtlanticoApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string
  ) {
    super(message);
    this.name = "AtlanticoApiError";
  }
}

function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const key of ["data", "groups", "tours", "list", "result"]) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }
  return [];
}

function asObject<T>(data: unknown): T | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const record = data as Record<string, unknown>;
  if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
    return record.data as T;
  }
  return data as T;
}

async function atlanticoFetch(
  path: string,
  init: RequestInit & { revalidateSeconds?: number } = {}
): Promise<unknown> {
  const { baseUrl, token } = getAtlanticoConfig();
  const { revalidateSeconds, headers, ...rest } = init;
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const isMutating = Boolean(rest.method && rest.method !== "GET");
  const noStore = isMutating || revalidateSeconds === 0;

  const response = await fetch(url, {
    ...rest,
    ...(noStore
      ? { cache: "no-store" as const }
      : { next: { revalidate: revalidateSeconds ?? 3600 } }),
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  if (!response.ok) {
    let message = `Atlantico API error (${response.status})`;
    let code: string | undefined;
    try {
      const parsed = JSON.parse(rawText) as { message?: string; code?: string };
      if (parsed.message) message = parsed.message;
      code = parsed.code;
    } catch {
      if (rawText) message = rawText.slice(0, 300);
    }
    if (response.status === 401) {
      message =
        "Atlantico API unauthorized. Check ATLANTICO_API_TOKEN and the IP allowlist.";
      code = code || "unauthorized";
    }
    throw new AtlanticoApiError(message, response.status, code);
  }

  if (!rawText.trim()) return null;

  const trimmed = rawText.trim();
  const looksLikeJson =
    contentType.includes("application/json") ||
    trimmed.startsWith("{") ||
    trimmed.startsWith("[");

  if (looksLikeJson) {
    try {
      return JSON.parse(rawText);
    } catch {
      throw new AtlanticoApiError(
        "Atlantico API returned incomplete JSON. The full tour list is likely truncated.",
        502,
        "invalid_json"
      );
    }
  }

  return rawText;
}

function isInvalidJsonError(error: unknown): boolean {
  return error instanceof AtlanticoApiError && error.code === "invalid_json";
}

function uniqueTours(tours: AtlanticoTourSummary[]): AtlanticoTourSummary[] {
  const byId = new Map<string, AtlanticoTourSummary>();
  for (const tour of tours) {
    const key = String(tour.id || tour.code || "").trim();
    if (key && !byId.has(key)) {
      byId.set(key, tour);
    }
  }
  return [...byId.values()];
}

export async function listAtlanticoClassifications(
  locale: string
): Promise<AtlanticoClassification[]> {
  const language = toAtlanticoLanguage(locale);
  const { collaborator } = getAtlanticoConfig();
  const path = collaborator
    ? `/clasificationList/${language}/${encodeURIComponent(collaborator)}`
    : `/clasificationList/${language}`;
  const data = await atlanticoFetch(path, {
    revalidateSeconds: 3600,
  });
  return asArray<AtlanticoClassification>(data);
}

export async function listAtlanticoClassificationsWithCounts(
  locale: string
): Promise<AtlanticoClassification[]> {
  const [classifications, tours] = await Promise.all([
    listAtlanticoClassifications(locale),
    listAtlanticoTours(locale),
  ]);
  const counts = countToursByCategory(tours);
  return withPositiveTourCounts(
    classifications.map((classification) => ({
      ...classification,
      count: classificationTourCount(classification, counts),
    }))
  );
}

async function fetchAtlanticoToursForClassification(
  locale: string,
  classificationCode: string
): Promise<AtlanticoTourSummary[]> {
  const language = toAtlanticoLanguage(locale);
  const data = await atlanticoFetch(
    `/groupsList/${language}/-1/${encodeURIComponent(classificationCode)}`,
    { revalidateSeconds: 1800 }
  );
  return asArray<AtlanticoTourSummary>(data);
}

async function listAtlanticoToursByClassification(
  locale: string
): Promise<AtlanticoTourSummary[]> {
  const classifications = await listAtlanticoClassifications(locale);
  const lists = await Promise.all(
    classifications.map((classification) => {
      const code = classification.id || classification.code;
      if (!code) return Promise.resolve([] as AtlanticoTourSummary[]);
      return fetchAtlanticoToursForClassification(locale, code);
    })
  );
  return uniqueTours(lists.flat());
}

export async function listAtlanticoTours(
  locale: string,
  classificationCode?: string
): Promise<AtlanticoTourSummary[]> {
  if (classificationCode) {
    return fetchAtlanticoToursForClassification(locale, classificationCode);
  }

  const language = toAtlanticoLanguage(locale);

  try {
    const data = await atlanticoFetch(`/groupsList/${language}/-1`, {
      revalidateSeconds: 1800,
    });
    const tours = asArray<AtlanticoTourSummary>(data);
    if (tours.length > 0) return tours;
  } catch (error) {
    if (!isInvalidJsonError(error)) throw error;
  }

  // Production `/groupsList/{lang}/-1` is truncated (~200KB) and invalid JSON.
  // Per-category lists are smaller and complete.
  return listAtlanticoToursByClassification(locale);
}

export async function getAtlanticoTourDetails(
  code: string,
  locale: string
): Promise<AtlanticoTourDetails | null> {
  const language = toAtlanticoLanguage(locale);
  const data = await atlanticoFetch(
    `/groupDetails/${encodeURIComponent(code)}/${language}`,
    { revalidateSeconds: 1800 }
  );
  return asObject<AtlanticoTourDetails>(data);
}

export async function getAtlanticoEventDetails(
  code: string,
  locale: string
): Promise<AtlanticoEventDetails | null> {
  const language = toAtlanticoLanguage(locale);
  const data = await atlanticoFetch(
    `/eventDetails/${encodeURIComponent(code)}/${language}`,
    { revalidateSeconds: 1800 }
  );
  return asObject<AtlanticoEventDetails>(data);
}

export async function getAtlanticoPrices(
  eventCode: string,
  date: string,
  office?: string
): Promise<string> {
  const { collaborator } = getAtlanticoConfig();
  const officeCode = office || collaborator;
  const path = officeCode
    ? `/loadPrices/${encodeURIComponent(eventCode)}/${date}/${encodeURIComponent(officeCode)}`
    : `/loadPrices/${encodeURIComponent(eventCode)}/${date}`;
  const data = await atlanticoFetch(path, {
    method: "GET",
    cache: "no-store",
    revalidateSeconds: 0,
    headers: { Accept: "text/plain, application/json" },
  });
  return typeof data === "string" ? data : JSON.stringify(data);
}

export async function getAtlanticoLimits(
  eventCode: string,
  locale: string,
  date?: string
): Promise<AtlanticoLoadLimitsResponse | null> {
  const language = toAtlanticoLanguage(locale);
  const path = date
    ? `/loadLimits/${encodeURIComponent(eventCode)}/${language}/${date}`
    : `/loadLimits/${encodeURIComponent(eventCode)}/${language}`;
  const data = await atlanticoFetch(path, {
    cache: "no-store",
    revalidateSeconds: 0,
  });
  return asObject<AtlanticoLoadLimitsResponse>(data);
}

export function parseConfirmResponse(data: unknown): AtlanticoConfirmResponse {
  if (typeof data === "string") {
    const trimmed = data.trim().replace(/^"+|"+$/g, "");
    if (trimmed && trimmed !== "0" && trimmed !== "1") {
      return { bookingCode: trimmed };
    }
  }
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const code =
      record.bookingCode ??
      record.booking_code ??
      record.reference ??
      record.ref ??
      record.code;
    if (code != null && String(code).trim()) {
      return {
        bookingCode: String(code).trim(),
        message: typeof record.message === "string" ? record.message : undefined,
      };
    }
  }
  throw new AtlanticoApiError(
    "Atlantico confirm did not return a booking code.",
    502,
    "invalid_confirm_response"
  );
}

export async function confirmAtlanticoBooking(
  body: AtlanticoConfirmRequest
): Promise<AtlanticoConfirmResponse> {
  const data = await atlanticoFetch("/confirm", {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseConfirmResponse(data);
}
