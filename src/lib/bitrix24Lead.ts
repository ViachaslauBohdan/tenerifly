import { hasUtmParams, normalizeUtm, UTM_KEYS, type UtmParams } from "@/lib/utm";

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

export function extractField(message: string | undefined, fieldName: string) {
  if (!message) return "";

  const match = message.match(new RegExp(`^${fieldName}:\\s*(.+)$`, "mi"));
  return match?.[1]?.trim() || "";
}

export function bitrix24LeadFields(input: Bitrix24LeadInput) {
  const phone = extractField(input.message, "Телефон");
  const utm = normalizeUtm(input.utm);
  const utmLines = UTM_KEYS.filter((key) => utm[key]).map((key) => `${key}: ${utm[key]}`);
  const utmFields = Object.fromEntries(
    UTM_KEYS.filter((key) => utm[key]).map((key) => [BITRIX_UTM_FIELDS[key], utm[key]])
  );
  const languageId = bitrixLanguageId(input.locale);
  const customerNote = bitrixCustomerNote(input.customerNote);
  const checkIn = bitrixStayDateTime(input.checkIn);
  const checkOut = bitrixStayDateTime(input.checkOut);

  return {
    TITLE: input.subject || "New pre-book request",
    NAME: extractField(input.message, "Имя"),
    COMMENTS: [
      input.message,
      "",
      `Email объекта: ${input.contactEmail || "Not set"}`,
      ...(hasUtmParams(utm) ? ["", "UTM:", ...utmLines] : []),
    ].join("\n"),
    SOURCE_ID: BITRIX_SOURCE_ID,
    SOURCE_DESCRIPTION: "Booking form on Tenerife Joy website",
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

  const response = await fetchImpl(`${webhookUrl.replace(/\/$/, "")}/crm.lead.add.json`, {
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

  console.log("Bitrix24 lead created:", data.result);
  return data.result;
}
