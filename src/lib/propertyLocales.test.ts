import { afterEach, describe, expect, it, vi } from "vitest";
import { translateText } from "../../scripts/lib/cmsTranslate.mjs";
import { upsertTranslatedLocale } from "../../scripts/lib/propertyLocales.mjs";

vi.mock("../../scripts/lib/cmsTranslate.mjs", async () => {
  const actual = await vi.importActual<Record<string, unknown>>(
    "../../scripts/lib/cmsTranslate.mjs"
  );
  return {
    ...actual,
    translateText: vi.fn(async () => {
      throw new Error("translateText should not run for a usable locale");
    }),
  };
});

const enDoc = {
  title: "Villa",
  description: "Ocean view",
  category: "villa",
  price: { amount: 1, currency: "EUR" },
  specifications: { bedrooms: 1 },
  location: { city: "Adeje" },
  contact: { name: "A" },
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("upsertTranslatedLocale", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not overwrite a locale that already has title and description", async () => {
    const methods: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        methods.push(init?.method || "GET");
        return jsonResponse({
          data: {
            title: "Вилла",
            description: "Вид на океан",
            locale: "ru",
            documentId: "doc-1",
          },
        });
      })
    );

    const result = await upsertTranslatedLocale({
      apiUrl: "https://strapi.test",
      token: "token",
      documentId: "doc-1",
      locale: "ru",
      enSnapshot: { title: "Villa", description: "Ocean view" },
      enDoc,
      dryRun: false,
    });

    expect(result).toMatchObject({ locale: "ru", status: "skipped-existing", title: "Вилла" });
    expect(translateText).not.toHaveBeenCalled();
    expect(methods).toEqual(["GET"]);
  });

  it("does not treat a blank description as a finished translation", async () => {
    const methods: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        methods.push(init?.method || "GET");
        return jsonResponse({
          data: {
            title: "Вилла",
            description: "   ",
            locale: "ru",
            documentId: "doc-1",
          },
        });
      })
    );

    await expect(
      upsertTranslatedLocale({
        apiUrl: "https://strapi.test",
        token: "token",
        documentId: "doc-1",
        locale: "ru",
        enSnapshot: { title: "Villa", description: "Ocean view" },
        enDoc,
        dryRun: false,
      })
    ).rejects.toThrow(/should not run/);
    expect(translateText).toHaveBeenCalledWith("Villa", "ru", "en");
    expect(methods).toEqual(["GET"]);
  });
});
