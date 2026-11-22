import { normalizeUtm, UTM_KEYS, type UtmParams } from "@/lib/utm";

export type Bitrix24LeadInput = {
  email?: string;
  subject?: string;
  message?: string;
  contactEmail?: string;
  utm?: UtmParams;
  locale?: string;
  customerNote?: string;
  checkIn?: string;
  checkOut?: string;
  /** Price text the visitor saw, written into the comment as «Бюджет». */
  budget?: string;
  /** Town or area for the Bitrix field «Район». Omitted when unknown. */
  district?: string;
  /** Site host shown next to the source, for example tenerifejoy.com. */
  site?: string;
};

const BITRIX_UTM_FIELDS = {
  utm_source: "UTM_SOURCE",
  utm_medium: "UTM_MEDIUM",
  utm_campaign: "UTM_CAMPAIGN",
  utm_term: "UTM_TERM",
  utm_content: "UTM_CONTENT",
} as const;

const BITRIX_SOURCE_ID = "54";
const BITRIX_LANGUAGE_FIELD = "UF_CRM_1787589324067";
const BITRIX_CUSTOMER_NOTE_FIELD = "UF_CRM_1789785093941";
const BITRIX_CHECK_IN_FIELD = "UF_CRM_1794258929";
const BITRIX_CHECK_OUT_FIELD = "UF_CRM_1794258961";

const BITRIX_LANGUAGE_IDS: Record<string, string> = {
  en: "3386",
  ru: "3387",
  ua: "3388",
  uk: "3388",
  de: "3389",
  pl: "3390",
  es: "3096",
  cs: "3097",
  fr: "3406",
};

export function bitrixLanguageId(locale: unknown): string {
  if (typeof locale !== "string") return "";
  return BITRIX_LANGUAGE_IDS[locale.trim().toLowerCase()] || "";
}

export function stayDateFromPicker(date: Date | null | undefined): string | undefined {
  if (!date || Number.isNaN(date.getTime())) return undefined;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Calendar date from the form, at 08:00 in the offset Bitrix expects. */
export function bitrixStayDateTime(value: unknown): string {
  if (typeof value !== "string") return "";
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return "";
  return `${match[1]}-${match[2]}-${match[3]}T8:00:00+02:00`;
}

export function bitrixCustomerNote(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, 2000);
}

const VAGUE_PLACES = new Set([
  "-",
  "apartment",
  "canary islands",
  "espana",
  "españa",
  "islas canarias",
  "santa cruz de tenerife",
  "spain",
  "tenerife",
  "test district",
]);

function specificPlace(value: string | null | undefined): string {
  const place = bitrixCustomerNote(value);
  if (!place || VAGUE_PLACES.has(place.toLowerCase())) return "";
  return place;
}

/** City or region a renter would recognise. Island-wide names are skipped. */
export function bookingDistrict(
  location?: { city?: string | null; region?: string | null } | string | null
): string {
  if (typeof location === "string") return specificPlace(location);
  const city = specificPlace(location?.city);
  if (city) return city;
  return specificPlace(location?.region);
}

export function bookingSiteHost(site?: string): string {
  const raw = (site || process.env.NEXT_PUBLIC_DOMAIN || "tenerifejoy.com").trim();
  return raw.replace(/^https?:\/\//i, "").replace(/\/.*$/, "") || "tenerifejoy.com";
}

const BUDGET_PERIODS: Record<string, string> = {
  day: "day",
  день: "day",
  dzień: "day",
  jour: "day",
  tag: "day",
  día: "day",
  week: "week",
  неделя: "week",
  tydzień: "week",
  semaine: "week",
  woche: "week",
  semana: "week",
  month: "month",
  месяц: "month",
  miesiąc: "month",
  mois: "month",
  monat: "month",
  mes: "month",
  night: "night",
  ночь: "night",
  noc: "night",
  nuit: "night",
  nacht: "night",
  noche: "night",
  year: "year",
  год: "year",
  rok: "year",
  an: "year",
  jahr: "year",
  año: "year",
};

/** Turns the price the visitor saw into `≈ EUR 70/day`. */
export function bitrixBudgetText(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return `≈ EUR ${value}`;
  if (typeof value !== "string") return "";
  let text = value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
  if (!text) return "";
  text = text.replace(/€\s*/g, "EUR ");
  text = text.replace(/EUR(\d)/g, "EUR $1");
  text = text.replace(/\/(\S+)/g, (_, period: string) => {
    const mapped = BUDGET_PERIODS[period.toLowerCase()];
    return mapped ? `/${mapped}` : `/${period}`;
  });
  return text.replace(/\s+/g, " ").trim().slice(0, 200);
}

export function formatBitrixDate(value: unknown): string {
  if (typeof value !== "string") return "";
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  return `${match[3]}.${match[2]}.${match[1]}`;
}

/** Comment managers copy to owners. Contacts and the object name stay on the lead card. */
export function bitrixBookingComment(input: {
  leadId?: number | string;
  district?: string;
  budget?: string;
  checkIn?: string;
  checkOut?: string;
  note?: string;
}): string {
  const leadId = input.leadId == null ? "" : String(input.leadId).trim();
  const lines = [
    leadId
      ? `Новая заявка на бронирование (ID: ${leadId}):`
      : "Новая заявка на бронирование:",
  ];
  const district = specificPlace(input.district);
  if (district) lines.push(`Предпочитаемый район: ${district}`);
  const budget = bitrixBudgetText(input.budget);
  if (budget) lines.push(`Бюджет: ${budget}`);
  const from = formatBitrixDate(input.checkIn);
  const to = formatBitrixDate(input.checkOut);
  const dates = from && to ? `${from} – ${to}` : from || to;
  if (dates) lines.push(`Даты: ${dates}`);
  const note = bitrixCustomerNote(input.note);
  if (note) lines.push(`Дополнительная информация: ${note}`);
  return lines.join("\n");
}

export function extractField(message: string | undefined, fieldName: string) {
  if (!message) return "";

  const match = message.match(new RegExp(`^${fieldName}:\\s*(.+)$`, "mi"));
  return match?.[1]?.trim() || "";
}

export function bitrix24LeadFields(input: Bitrix24LeadInput, leadId?: number | string) {
  const phone = extractField(input.message, "Телефон");
  const utm = normalizeUtm(input.utm);
  const utmFields = Object.fromEntries(
    UTM_KEYS.filter((key) => utm[key]).map((key) => [BITRIX_UTM_FIELDS[key], utm[key]])
  );
  const languageId = bitrixLanguageId(input.locale);
  const customerNote = bitrixCustomerNote(input.customerNote);
  const checkIn = bitrixStayDateTime(input.checkIn);
  const checkOut = bitrixStayDateTime(input.checkOut);
  const district = bookingDistrict(input.district);
  const budget =
    bitrixBudgetText(input.budget) || bitrixBudgetText(extractField(input.message, "Цена"));

  return {
    TITLE: input.subject || "New pre-book request",
    NAME: extractField(input.message, "Имя"),
    COMMENTS: bitrixBookingComment({
      leadId,
      district,
      budget,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      note: customerNote,
    }),
    SOURCE_ID: BITRIX_SOURCE_ID,
    SOURCE_DESCRIPTION: bookingSiteHost(input.site),
    ...(district ? { ADDRESS_REGION: district } : {}),
    EMAIL: input.email
      ? [
          {
            VALUE: input.email,
            VALUE_TYPE: "WORK",
          },
        ]
      : [],
    PHONE: phone
      ? [
          {
            VALUE: phone,
            VALUE_TYPE: "MOBILE",
          },
        ]
      : [],
    ...utmFields,
    ...(languageId ? { [BITRIX_LANGUAGE_FIELD]: languageId } : {}),
    ...(customerNote ? { [BITRIX_CUSTOMER_NOTE_FIELD]: customerNote } : {}),
    ...(checkIn ? { [BITRIX_CHECK_IN_FIELD]: checkIn } : {}),
    ...(checkOut ? { [BITRIX_CHECK_OUT_FIELD]: checkOut } : {}),
  };
}

/** Creates a CRM lead. Skips quietly when the webhook is not configured. */
export async function sendBitrix24Lead(
  input: Bitrix24LeadInput,
  fetchImpl: typeof fetch = fetch
) {
  const webhookUrl = process.env.BITRIX24_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    console.log("Bitrix24 webhook is not configured");
    return;
  }

  const base = webhookUrl.replace(/\/$/, "");
  const response = await fetchImpl(`${base}/crm.lead.add.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: bitrix24LeadFields(input),
    }),
  });

  const data = (await response.json()) as {
    result?: number;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || data.error) {
    console.error("Bitrix24 lead error:", data);
    throw new Error(data.error_description || data.error || "Bitrix24 request failed");
  }

  const leadId = data.result;
  console.log("Bitrix24 lead created:", leadId);

  if (leadId != null) {
    try {
      const update = await fetchImpl(`${base}/crm.lead.update.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadId,
          fields: {
            COMMENTS: bitrix24LeadFields(input, leadId).COMMENTS,
          },
        }),
      });
      const updateData = (await update.json()) as {
        error?: string;
        error_description?: string;
      };
      if (!update.ok || updateData.error) {
        console.error("Bitrix24 lead comment update error:", updateData);
      }
    } catch (error) {
      console.error("Bitrix24 lead comment update failed:", error);
    }
  }

  return leadId;
}
