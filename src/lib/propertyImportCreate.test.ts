import { beforeEach, describe, expect, it, vi } from "vitest";
import { createNewProperties } from "./propertyImportCreate";
import { localizeProperty, TARGET_LOCALES } from "../../scripts/lib/propertyLocales.mjs";

vi.mock("../../scripts/lib/propertyLocales.mjs", async () => {
  const actual = await vi.importActual<Record<string, unknown>>(
    "../../scripts/lib/propertyLocales.mjs"
  );
  return {
    ...actual,
    localizeProperty: vi.fn(),
  };
});

const localeList = TARGET_LOCALES as string[];

function writtenLocales() {
  return {
    documentId: "new",
    title: "Villa El Duque",
    backupFile: null,
    results: localeList.map((locale) => ({
      locale,
      status: "written",
      title: `title ${locale}`,
    })),
  };
}

const villa = {
  title: "Villa El Duque",
  slug: "villa-el-duque",
  description: "Ocean view villa.",
  type: "rent",
  property_status: "available",
  category: "villa",
  price: { amount: 730, currency: "EUR", period: "day" },
  location: { city: "Costa Adeje" },
  id: 4,
  _import: { media_folder: "photos" },
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("createNewProperties", () => {
  beforeEach(() => {
    vi.mocked(localizeProperty).mockReset();
    vi.mocked(localizeProperty).mockResolvedValue(writtenLocales());
  });

  it("does not call Strapi when the JSON is invalid", async () => {
    const fetchImpl = vi.fn();
    const outcome = await createNewProperties("{", {
      apiUrl: "https://strapi.test",
      token: "token",
      fetchImpl,
    });

    expect(outcome.ok).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(localizeProperty).not.toHaveBeenCalled();
  });

  it("creates a new property and never updates or deletes", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method || "GET";
      if (method === "GET" && url.includes("/api/properties")) {
        return jsonResponse({ data: [] });
      }
      if (method === "POST" && url.includes("/api/properties")) {
        return jsonResponse({ data: { id: 12, documentId: "new" } });
      }
      return jsonResponse({ error: "unexpected" }, 500);
    });

    const outcome = await createNewProperties(JSON.stringify([villa]), {
      apiUrl: "https://strapi.test/",
      token: "token",
      fetchImpl,
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(localeList).toEqual(["ru", "uk", "pl", "de", "es", "fr"]);
    expect(outcome.results).toEqual([
      expect.objectContaining({
        status: "created",
        slug: "villa-el-duque",
        detail: `Создан, id 12. Переведены: ${localeList.join(", ")}`,
      }),
    ]);
    expect(outcome.results[0]?.localeErrors).toBeUndefined();

    const postCall = fetchImpl.mock.calls.find((call) => call[1]?.method === "POST");
    expect(localizeProperty).toHaveBeenCalledTimes(1);
    expect(localizeProperty).toHaveBeenCalledWith({
      apiUrl: "https://strapi.test",
      token: "token",
      documentId: "new",
      locales: localeList,
      dryRun: false,
    });
    expect(vi.mocked(localizeProperty).mock.invocationCallOrder[0]).toBeGreaterThan(
      fetchImpl.mock.invocationCallOrder[fetchImpl.mock.calls.indexOf(postCall!)]
    );

    const methods = fetchImpl.mock.calls.map((call) => call[1]?.method || "GET");
    expect(methods).toEqual(["GET", "POST"]);
    const post = fetchImpl.mock.calls.find((call) => call[1]?.method === "POST");
    const body = JSON.parse(String(post?.[1]?.body));
    expect(body.data.slug).toBe("villa-el-duque");
    expect(body.data.title).toBe("Villa El Duque");
    expect(body.data.description).toBe("Ocean view villa.");
    expect(body.data.id).toBeUndefined();
    expect(body.data._import).toBeUndefined();
  });

  it("skips a slug that already exists and does not post it", async () => {
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ data: [{ id: 8, documentId: "old" }] })
    );

    const outcome = await createNewProperties(JSON.stringify(villa), {
      apiUrl: "https://strapi.test",
      token: "token",
      fetchImpl,
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.results[0]).toMatchObject({
      status: "skipped",
      detail: "Уже есть в Strapi, запись не изменена",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0]?.[1]?.method).toBe("GET");
    expect(localizeProperty).not.toHaveBeenCalled();
  });

  it("keeps the English property when translation throws", async () => {
    vi.mocked(localizeProperty).mockRejectedValue(new Error("translator down"));
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method || "GET";
      if (method === "GET" && url.includes("/api/properties")) {
        return jsonResponse({ data: [] });
      }
      if (method === "POST" && url.includes("/api/properties")) {
        return jsonResponse({ data: { id: 12, documentId: "new" } });
      }
      return jsonResponse({ error: "unexpected" }, 500);
    });

    const outcome = await createNewProperties(JSON.stringify([villa]), {
      apiUrl: "https://strapi.test",
      token: "token",
      fetchImpl,
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.results[0]).toMatchObject({
      status: "created",
      detail: `Создан, id 12. Не записаны локали: ${localeList.join(", ")} (translator down)`,
      localeErrors: localeList.map((locale) => ({ locale, error: "translator down" })),
    });
    const methods = fetchImpl.mock.calls.map((call) => call[1]?.method || "GET");
    expect(methods).toEqual(["GET", "POST"]);
  });

  it("reports the locale that failed and still counts the property as created", async () => {
    vi.mocked(localizeProperty).mockResolvedValue({
      documentId: "new",
      title: "Villa El Duque",
      backupFile: null,
      results: localeList.map((locale) =>
        locale === "uk"
          ? { locale, status: "error", error: "Translation to uk looked invalid" }
          : { locale, status: "written", title: `title ${locale}` }
      ),
    });
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method || "GET";
      if (method === "GET") return jsonResponse({ data: [] });
      if (method === "POST") return jsonResponse({ data: { id: 12, documentId: "new" } });
      return jsonResponse({ error: "unexpected" }, 500);
    });

    const outcome = await createNewProperties(JSON.stringify(villa), {
      apiUrl: "https://strapi.test",
      token: "token",
      fetchImpl,
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.results[0]?.status).toBe("created");
    expect(outcome.results[0]?.detail).toContain(
      "Не записаны локали: uk (Translation to uk looked invalid)"
    );
    expect(outcome.results[0]?.detail).toContain("Переведены: ru, pl, de, es, fr");
    expect(outcome.results[0]?.localeErrors).toEqual([
      { locale: "uk", error: "Translation to uk looked invalid" },
    ]);
  });

  it("reports a locale the localizer refused to write", async () => {
    vi.mocked(localizeProperty).mockResolvedValue({
      documentId: "new",
      title: "Villa El Duque",
      backupFile: null,
      results: localeList.map((locale) => ({
        locale,
        status: "skipped-incomplete",
        error: "EN record is missing category/price/specifications/location/contact",
      })),
    });
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method || "GET";
      if (method === "GET") return jsonResponse({ data: [] });
      if (method === "POST") return jsonResponse({ data: { id: 12, documentId: "new" } });
      return jsonResponse({ error: "unexpected" }, 500);
    });

    const outcome = await createNewProperties(JSON.stringify(villa), {
      apiUrl: "https://strapi.test",
      token: "token",
      fetchImpl,
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.results[0]?.status).toBe("created");
    expect(outcome.results[0]?.detail).toContain(
      "uk (EN record is missing category/price/specifications/location/contact)"
    );
    expect(outcome.results[0]?.localeErrors).toHaveLength(localeList.length);
  });

  it("does not treat an already usable locale as a failed translation", async () => {
    vi.mocked(localizeProperty).mockResolvedValue({
      documentId: "new",
      title: "Villa El Duque",
      backupFile: null,
      results: localeList.map((locale) =>
        locale === "ru"
          ? { locale, status: "skipped-existing", title: "Вилла" }
          : { locale, status: "written", title: `title ${locale}` }
      ),
    });
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method || "GET";
      if (method === "GET") return jsonResponse({ data: [] });
      if (method === "POST") return jsonResponse({ data: { id: 12, documentId: "new" } });
      return jsonResponse({ error: "unexpected" }, 500);
    });

    const outcome = await createNewProperties(JSON.stringify(villa), {
      apiUrl: "https://strapi.test",
      token: "token",
      fetchImpl,
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.results[0]?.status).toBe("created");
    expect(outcome.results[0]?.localeErrors).toBeUndefined();
    expect(outcome.results[0]?.detail).toContain("Уже были переводы: ru");
    expect(outcome.results[0]?.detail).not.toContain("Не записаны локали");
  });

  it("does not localize a property that Strapi rejected", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method || "GET";
      if (method === "GET") return jsonResponse({ data: [] });
      return jsonResponse({ error: "no" }, 500);
    });

    const outcome = await createNewProperties(JSON.stringify(villa), {
      apiUrl: "https://strapi.test",
      token: "token",
      fetchImpl,
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.results[0]?.status).toBe("failed");
    expect(localizeProperty).not.toHaveBeenCalled();
  });

  it("continues the batch when one translation fails", async () => {
    vi.mocked(localizeProperty)
      .mockRejectedValueOnce(new Error("translator down"))
      .mockResolvedValueOnce(writtenLocales());
    const second = { ...villa, title: "Second Villa", slug: "second-villa" };
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method || "GET";
      if (method === "GET") return jsonResponse({ data: [] });
      if (method === "POST") return jsonResponse({ data: { id: 20, documentId: "doc-20" } });
      return jsonResponse({ error: "unexpected" }, 500);
    });

    const outcome = await createNewProperties(JSON.stringify([villa, second]), {
      apiUrl: "https://strapi.test",
      token: "token",
      fetchImpl,
    });

    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    expect(outcome.results.map((row) => row.status)).toEqual(["created", "created"]);
    expect(outcome.results[0]?.detail).toContain("translator down");
    expect(outcome.results[1]?.detail).toContain(`Переведены: ${localeList.join(", ")}`);
    expect(localizeProperty).toHaveBeenCalledTimes(2);
  });
});
