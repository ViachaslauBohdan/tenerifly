import { describe, expect, it, vi } from "vitest";
import { createNewProperties } from "./propertyImportCreate";

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
  it("does not call Strapi when the JSON is invalid", async () => {
    const fetchImpl = vi.fn();
    const outcome = await createNewProperties("{", {
      apiUrl: "https://strapi.test",
      token: "token",
      fetchImpl,
    });

    expect(outcome.ok).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
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
    expect(outcome.results).toEqual([
      expect.objectContaining({ status: "created", slug: "villa-el-duque", detail: "Создан, id 12" }),
    ]);

    const methods = fetchImpl.mock.calls.map((call) => call[1]?.method || "GET");
    expect(methods).toEqual(["GET", "POST"]);
    const post = fetchImpl.mock.calls.find((call) => call[1]?.method === "POST");
    const body = JSON.parse(String(post?.[1]?.body));
    expect(body.data.slug).toBe("villa-el-duque");
    expect(body.data.id).toBeUndefined();
    expect(body.data._import).toBeUndefined();
  });

  it("skips a slug that already exists and does not post it", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ data: [{ id: 8, documentId: "old" }] }));

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
  });
});
