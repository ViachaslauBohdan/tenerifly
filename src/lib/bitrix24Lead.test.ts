import { afterEach, describe, expect, it, vi } from "vitest";
import {
  bitrixBookingComment,
  bitrixBudgetText,
  bookingDistrict,
  extractField,
  sendBitrix24Lead,
} from "./bitrix24Lead";

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

describe("bitrixBookingComment", () => {
  it("builds the text managers copy, without contacts or the object name", () => {
    expect(
      bitrixBookingComment({
        leadId: 12345,
        district: "Costa Adeje",
        budget: "≈ €70/день",
        checkIn: "2026-11-19",
        checkOut: "2026-11-23",
        note: "текст клиента",
      })
    ).toBe(
      [
        "Новая заявка на бронирование (ID: 12345):",
        "Предпочитаемый район: Costa Adeje",
        "Бюджет: ≈ EUR 70/day",
        "Даты: 19.11.2026 – 23.11.2026",
        "Дополнительная информация: текст клиента",
      ].join("\n")
    );
  });

  it("drops the district line when the place is only the island", () => {
    expect(bookingDistrict({ city: "Tenerife", region: "Spain" })).toBe("");
    expect(bookingDistrict({ city: "Costa Adeje", region: "Tenerife" })).toBe(
      "Costa Adeje"
    );
    expect(bitrixBudgetText("≈ EUR 70/день")).toBe("≈ EUR 70/day");
    expect(bitrixBookingComment({ budget: "€730" })).toBe(
      ["Новая заявка на бронирование:", "Бюджет: EUR 730"].join("\n")
    );
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
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://example.bitrix24.com/rest/1/secret/crm.lead.add.json");
    const body = JSON.parse(String(init.body));
    expect(body.fields).toMatchObject({
      TITLE: "New Pre-Book request - Villa El Duque",
      NAME: "Ana Costa",
      SOURCE_ID: "54",
      SOURCE_DESCRIPTION: "tenerifejoy.com",
      EMAIL: [{ VALUE: "ana@example.com", VALUE_TYPE: "WORK" }],
      PHONE: [{ VALUE: "+34600000000", VALUE_TYPE: "MOBILE" }],
    });
    expect(body.fields.COMMENTS).toBe(
      ["Новая заявка на бронирование:", "Бюджет: EUR 730"].join("\n")
    );
    expect(body.fields.COMMENTS).not.toContain("Email объекта");
    expect(body.fields.COMMENTS).not.toContain("Villa El Duque");
    expect(body.fields.COMMENTS).not.toContain("Ana Costa");
    expect(body.fields.UTM_SOURCE).toBeUndefined();

    const [updateUrl, updateInit] = fetchImpl.mock.calls[1] as [string, RequestInit];
    expect(updateUrl).toBe("https://example.bitrix24.com/rest/1/secret/crm.lead.update.json");
    const updateBody = JSON.parse(String(updateInit.body));
    expect(updateBody.id).toBe(42);
    expect(updateBody.fields.COMMENTS).toContain("(ID: 42)");
    expect(updateBody.fields.COMMENTS).not.toContain("owner@example.com");
  });

  it("sends campaign tags on the lead fields Bitrix stores for UTM", async () => {
    process.env.BITRIX24_WEBHOOK_URL = "https://example.bitrix24.com/rest/1/secret";
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ result: 7 }), { status: 200 })
    );

    await sendBitrix24Lead(
      {
        email: "ana@example.com",
        message,
        utm: {
          utm_source: "google",
          utm_medium: "cpc",
          utm_campaign: "spring",
          utm_term: "tenerife villa",
          utm_content: "banner",
          extra: "ignore",
        } as never,
      },
      fetchImpl
    );

    const body = JSON.parse(String((fetchImpl.mock.calls[0] as [string, RequestInit])[1].body));
    expect(body.fields).toMatchObject({
      UTM_SOURCE: "google",
      UTM_MEDIUM: "cpc",
      UTM_CAMPAIGN: "spring",
      UTM_TERM: "tenerife villa",
      UTM_CONTENT: "banner",
    });
    expect(body.fields.COMMENTS).not.toContain("utm_source");
    expect(body.fields.COMMENTS).not.toContain("extra");
    const updateBody = JSON.parse(
      String((fetchImpl.mock.calls[1] as [string, RequestInit])[1].body)
    );
    expect(updateBody.fields.COMMENTS).not.toContain("utm_source");
  });

  it("sends the portal source, language, customer note, and stay dates", async () => {
    process.env.BITRIX24_WEBHOOK_URL = "https://example.bitrix24.com/rest/1/secret";
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ result: 8 }), { status: 200 })
    );

    await sendBitrix24Lead(
      {
        email: "ana@example.com",
        message,
        locale: "ru",
        customerNote: "  Нужен поздний заезд  ",
        checkIn: "2026-11-14",
        checkOut: "2026-11-18",
        district: "Costa Adeje",
        budget: "≈ EUR 70/day",
        site: "https://tenerifejoy.com/ru",
      },
      fetchImpl
    );

    const body = JSON.parse(String((fetchImpl.mock.calls[0] as [string, RequestInit])[1].body));
    expect(body.fields).toMatchObject({
      SOURCE_ID: "54",
      SOURCE_DESCRIPTION: "tenerifejoy.com",
      ADDRESS_REGION: "Costa Adeje",
      UF_CRM_1787589324067: "3387",
      UF_CRM_1789785093941: "Нужен поздний заезд",
      UF_CRM_1794258929: "2026-11-14T8:00:00+02:00",
      UF_CRM_1794258961: "2026-11-18T8:00:00+02:00",
    });
    expect(body.fields.COMMENTS).toContain("Предпочитаемый район: Costa Adeje");
    expect(body.fields.COMMENTS).toContain("Бюджет: ≈ EUR 70/day");
    expect(body.fields.COMMENTS).toContain("Даты: 14.11.2026 – 18.11.2026");
    expect(body.fields.COMMENTS).toContain("Дополнительная информация: Нужен поздний заезд");
    expect(body.fields.COMMENTS).not.toContain("Отправлено с сайта");
  });

  it("keeps the created lead when the comment id cannot be written", async () => {
    process.env.BITRIX24_WEBHOOK_URL = "https://example.bitrix24.com/rest/1/secret";
    const fetchImpl = vi.fn(async (url: string) => {
      if (String(url).includes("crm.lead.update")) {
        return new Response(
          JSON.stringify({ error: "UPDATE_FAILED", error_description: "nope" }),
          { status: 400 }
        );
      }
      return new Response(JSON.stringify({ result: 42 }), { status: 200 });
    });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      sendBitrix24Lead({ email: "ana@example.com", message }, fetchImpl)
    ).resolves.toBe(42);

    error.mockRestore();
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
