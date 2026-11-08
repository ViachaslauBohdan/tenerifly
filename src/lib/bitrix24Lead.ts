export type Bitrix24LeadInput = {
  email?: string;
  subject?: string;
  message?: string;
  contactEmail?: string;
};

export function extractField(message: string | undefined, fieldName: string) {
  if (!message) return "";

  const match = message.match(new RegExp(`^${fieldName}:\\s*(.+)$`, "mi"));
  return match?.[1]?.trim() || "";
}

export function bitrix24LeadFields(input: Bitrix24LeadInput) {
  const phone = extractField(input.message, "Телефон");

  return {
    TITLE: input.subject || "New pre-book request",
    NAME: extractField(input.message, "Имя"),
    COMMENTS: [input.message, "", `Email объекта: ${input.contactEmail || "Not set"}`].join(
      "\n"
    ),
    SOURCE_ID: "WEB",
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
