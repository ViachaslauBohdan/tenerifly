import { afterEach, describe, expect, it, vi } from "vitest";
import { extractField, sendBitrix24Lead } from "./bitrix24Lead";

const message = `
Новая заявка на бронирование:

Объект: Villa El Duque
Цена: €730

Контактная информация:
Имя: Ana Costa
Телефон: +34600000000
Email: ana@example.com
`.trim();

afterEach(() => {
  delete process.env.BITRIX24_WEBHOOK_URL;
  vi.restoreAllMocks();
});

describe("extractField", () => {
  it("reads a labeled line from the booking message", () => {
    expect(extractField(message, "Имя")).toBe("Ana Costa");
    expect(extractField(message, "Телефон")).toBe("+34600000000");
    expect(extractField(undefined, "Имя")).toBe("");
    expect(extractField(message, "Город")).toBe("");
  });
});

describe("sendBitrix24Lead", () => {
  it("does nothing when the webhook is not configured", async () => {
    const fetchImpl = vi.fn();
    const result = await sendBitrix24Lead(
      { email: "ana@example.com", message },
      fetchImpl
    );

    expect(result).toBeUndefined();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("creates a web lead with the name, phone, and property email", async () => {
    process.env.BITRIX24_WEBHOOK_URL = "https://example.bitrix24.com/rest/1/secret/";
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ result: 42 }), { status: 200 })
    );

    const result = await sendBitrix24Lead(
      {
        email: "ana@example.com",
        subject: "New Pre-Book request - Villa El Duque",
        message,
        contactEmail: "owner@example.com",
      },
      fetchImpl
    );

    expect(result).toBe(42);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://example.bitrix24.com/rest/1/secret/crm.lead.add.json");
    const body = JSON.parse(String(init.body));
    expect(body.fields).toMatchObject({
      TITLE: "New Pre-Book request - Villa El Duque",
      NAME: "Ana Costa",
      SOURCE_ID: "WEB",
      SOURCE_DESCRIPTION: "Booking form on Tenerife Joy website",
      EMAIL: [{ VALUE: "ana@example.com", VALUE_TYPE: "WORK" }],
      PHONE: [{ VALUE: "+34600000000", VALUE_TYPE: "MOBILE" }],
    });
    expect(body.fields.COMMENTS).toContain("Email объекта: owner@example.com");
    expect(body.fields.COMMENTS).toContain("Villa El Duque");
  });

  it("throws when Bitrix returns an error", async () => {
    process.env.BITRIX24_WEBHOOK_URL = "https://example.bitrix24.com/rest/1/secret";
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({ error: "INVALID_CREDENTIALS", error_description: "Wrong hook" }),
        { status: 401 }
      )
    );

    await expect(
      sendBitrix24Lead({ email: "ana@example.com", message }, fetchImpl)
    ).rejects.toThrow("Wrong hook");
  });
});
