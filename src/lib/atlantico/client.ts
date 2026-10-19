import { atlanticoConfirmBaseUrls, getAtlanticoConfig } from "./config";
import { toAtlanticoLanguage } from "./language";
import { parsePaymentForm } from "./paymentForm";
import { ATLANTICO_PATHS } from "./paths";
import { withPositiveTourCounts } from "./parse";
import { normalizeAtlanticoPriceRaw } from "./prices";
import type {
  AtlanticoClassification,
  AtlanticoConfirmRequest,
  AtlanticoConfirmResponse,
  AtlanticoEventDetails,
  AtlanticoLoadLimitsResponse,
  AtlanticoPaymentResponse,
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
  init: RequestInit & { revalidateSeconds?: number; baseUrl?: string } = {}
): Promise<unknown> {
  const { token } = getAtlanticoConfig();
  const { revalidateSeconds, headers, baseUrl: baseUrlOverride, ...rest } = init;
  const baseUrl = (baseUrlOverride || getAtlanticoConfig().baseUrl).replace(
    /\/$/,
    ""
  );
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
  // loadPrices is often a JSON-encoded string (`"42.00|30.00|..."`) with a
  // text/html Content-Type — still parse it as JSON when the body looks like it.
  const looksLikeJson =
    contentType.includes("application/json") ||
    trimmed.startsWith("{") ||
    trimmed.startsWith("[") ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'));

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
  if (!error || typeof error !== "object") return false;
  return (error as { code?: string }).code === "invalid_json";
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

async function fetchAtlanticoToursForClassification(
  locale: string,
  classificationCode: string
): Promise<AtlanticoTourSummary[]> {
  const language = toAtlanticoLanguage(locale);
  try {
    const data = await atlanticoFetch(
      `/groupsList/${language}/-1/${encodeURIComponent(classificationCode)}`,
      { revalidateSeconds: 1800 }
    );
    return asArray<AtlanticoTourSummary>(data);
  } catch (error) {
    // Production JSON is truncated for some categories (e.g. Water Sports).
    if (isInvalidJsonError(error)) return [];
    throw error;
  }
}

async function listAtlanticoToursByClassification(
  locale: string
): Promise<{
  classifications: AtlanticoClassification[];
  tours: AtlanticoTourSummary[];
}> {
  const classifications = await listAtlanticoClassifications(locale);
  const lists = await Promise.all(
    classifications.map((classification) => {
      const code = classification.id || classification.code;
      if (!code) return Promise.resolve([] as AtlanticoTourSummary[]);
      return fetchAtlanticoToursForClassification(locale, code);
    })
  );
  return {
    classifications: classifications.map((classification, index) => ({
      ...classification,
      count: lists[index]?.length ?? 0,
    })),
    tours: uniqueTours(lists.flat()),
  };
}

export async function listAtlanticoClassificationsWithCounts(
  locale: string
): Promise<AtlanticoClassification[]> {
  const { classifications } = await listAtlanticoToursByClassification(locale);
  return withPositiveTourCounts(classifications);
}

export async function listAtlanticoTours(
  locale: string,
  classificationCode?: string
): Promise<AtlanticoTourSummary[]> {
  if (classificationCode) {
    return fetchAtlanticoToursForClassification(locale, classificationCode);
  }

  // Never call `/groupsList/{lang}/-1` without a category: production truncates it.
  const { tours } = await listAtlanticoToursByClassification(locale);
  return tours;
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

async function fetchAtlanticoPriceRaw(
  eventCode: string,
  date: string,
  officeCode?: string
): Promise<string> {
  const path = officeCode
    ? `/loadPrices/${encodeURIComponent(eventCode)}/${date}/${encodeURIComponent(officeCode)}`
    : `/loadPrices/${encodeURIComponent(eventCode)}/${date}`;
  const data = await atlanticoFetch(path, {
    method: "GET",
    cache: "no-store",
    revalidateSeconds: 0,
    headers: { Accept: "text/plain, application/json" },
  });
  return normalizeAtlanticoPriceRaw(data);
}

export async function getAtlanticoPrices(
  eventCode: string,
  date: string,
  office?: string
): Promise<string> {
  const { collaborator } = getAtlanticoConfig();
  const officeCode = (office ?? collaborator)?.trim() || undefined;

  // Generic endpoint first — some hosts return an empty `[]` body for the
  // collaborator/office variant when the caller IP is not fully entitled.
  const generic = await fetchAtlanticoPriceRaw(eventCode, date);
  if (generic) return generic;

  if (officeCode) {
    return fetchAtlanticoPriceRaw(eventCode, date, officeCode);
  }

  return "";
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

function looksLikeBookingCode(value: string): boolean {
  if (value === "0" || value === "1" || value === "-1") return false;
  return /^[A-Za-z0-9_-]{2,40}$/.test(value);
}

function supplierConfirmMessage(data: unknown): string | null {
  if (typeof data !== "string") return null;
  const text = data
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text || text === "0" || text === "1" || text === "-1") return null;
  if (looksLikeBookingCode(text)) return null;
  return text.slice(0, 300);
}

export function parseConfirmResponse(data: unknown): AtlanticoConfirmResponse {
  if (typeof data === "string") {
    const trimmed = data.trim().replace(/^"+|"+$/g, "");
    if (looksLikeBookingCode(trimmed)) {
      return { bookingCode: trimmed };
    }
    const message = supplierConfirmMessage(data);
    throw new AtlanticoApiError(
      message || "Atlantico confirm did not return a booking code.",
      502,
      "invalid_confirm_response"
    );
  }
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const code =
      record.bookingCode ??
      record.booking_code ??
      record.reference ??
      record.ref ??
      record.code;
    if (code != null && looksLikeBookingCode(String(code).trim())) {
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

function confirmFormBody(body: AtlanticoConfirmRequest): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  return params.toString();
}

async function postConfirm(
  baseUrl: string,
  body: AtlanticoConfirmRequest,
  asForm: boolean
): Promise<unknown> {
  return atlanticoFetch(ATLANTICO_PATHS.confirm, {
    method: "POST",
    cache: "no-store",
    baseUrl,
    headers: {
      "Content-Type": asForm
        ? "application/x-www-form-urlencoded"
        : "application/json",
    },
    body: asForm ? confirmFormBody(body) : JSON.stringify(body),
  });
}

export async function confirmAtlanticoBooking(
  body: AtlanticoConfirmRequest
): Promise<AtlanticoConfirmResponse> {
  // Affiliate reserve. Trailing slash is required. If the first host does not
  // return a booking code (404, -1, credit text), try the next host.
  let lastError: unknown;
  for (const baseUrl of atlanticoConfirmBaseUrls()) {
    try {
      return parseConfirmResponse(await postConfirm(baseUrl, body, false));
    } catch (error) {
      lastError = error;
      const status = error instanceof AtlanticoApiError ? error.status : 0;
      if (status >= 400 && status < 500 && status !== 401) {
        continue;
      }
    }

    try {
      return parseConfirmResponse(await postConfirm(baseUrl, body, true));
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError instanceof Error) throw lastError;
  throw new AtlanticoApiError(
    "Atlantico confirm did not return a booking code.",
    502,
    "invalid_confirm_response"
  );
}

function paymentUrlFromBody(rawText: string, baseUrl: string): string | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    const paymentUrl =
      parsed.paymentUrl ?? parsed.url ?? parsed.redirect ?? parsed.location;
    if (typeof paymentUrl === "string" && paymentUrl.trim()) {
      return new URL(paymentUrl.trim(), `${baseUrl}/`).toString();
    }
    return null;
  } catch {
    return /^https?:\/\//i.test(trimmed) ? trimmed : null;
  }
}

async function postPayment(
  baseUrl: string,
  body: AtlanticoConfirmRequest,
  asForm: boolean
): Promise<{ status: number; location: string | null; rawText: string }> {
  const { token } = getAtlanticoConfig();
  const response = await fetch(`${baseUrl}${ATLANTICO_PATHS.payment}`, {
    method: "POST",
    redirect: "manual",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": asForm
        ? "application/x-www-form-urlencoded"
        : "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: asForm ? confirmFormBody(body) : JSON.stringify(body),
  });
  const location = response.headers.get("location");
  if (response.status >= 300 && response.status < 400 && location) {
    return { status: response.status, location, rawText: "" };
  }
  return {
    status: response.status,
    location,
    rawText: await response.text(),
  };
}

/**
 * Card checkout. Same body as confirm, but the customer is sent to Atlántico's
 * payment page. Trailing slash is required. If the first host does not return
 * a payment URL, the next host is used.
 */
export async function startAtlanticoPayment(
  body: AtlanticoConfirmRequest
): Promise<AtlanticoPaymentResponse> {
  let lastError: unknown;
  for (const baseUrl of atlanticoConfirmBaseUrls()) {
    for (const asForm of [false, true]) {
      try {
        const response = await postPayment(baseUrl, body, asForm);
        if (response.status >= 300 && response.status < 400 && response.location) {
          return {
            paymentUrl: new URL(response.location, `${baseUrl}/`).toString(),
          };
        }
        if (response.status >= 200 && response.status < 300) {
          const paymentUrl = paymentUrlFromBody(response.rawText, baseUrl);
          if (paymentUrl) return { paymentUrl };
          const paymentForm = parsePaymentForm(response.rawText, baseUrl);
          if (paymentForm) return { paymentForm };
        }
        const plain = response.rawText
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 300);
        lastError = new AtlanticoApiError(
          plain || `Atlantico payment API error (${response.status})`,
          response.status >= 400 ? response.status : 502,
          "payment_redirect_missing"
        );
        if (
          !asForm &&
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 401
        ) {
          break;
        }
      } catch (error) {
        lastError = error;
      }
    }
  }

  if (lastError instanceof Error) throw lastError;
  throw new AtlanticoApiError(
    "Atlantico payment did not return a checkout URL.",
    502,
    "payment_redirect_missing"
  );
}
