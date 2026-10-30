import { beforeEach, describe, expect, it, vi } from "vitest";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminSessionToken } from "@/lib/adminSession";
import { POST } from "./route";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

const villa = {
  title: "Villa El Duque",
  slug: "villa-el-duque",
  description: "Ocean view villa.",
  type: "rent",
  property_status: "available",
  category: "villa",
  price: { amount: 730, currency: "EUR", period: "day" },
  location: { city: "Costa Adeje" },
};

function cookieJar(value?: string) {
  return { get: (name: string) => (name === ADMIN_COOKIE && value ? { value } : undefined) };
}

describe("POST /api/admin/properties/import", () => {
  beforeEach(() => {
    process.env.ATLANTICO_ADMIN_PASSWORD = "correct-horse";
    process.env.NEXT_PUBLIC_STRAPI_API_TOKEN = "token";
    process.env.NEXT_PUBLIC_STRAPI_API_URL = "https://strapi.test";
    vi.unstubAllGlobals();
  });

  it("rejects a visitor who is not signed in and does not touch Strapi", async () => {
    vi.mocked(cookies).mockResolvedValue(cookieJar() as never);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request("http://localhost/api/admin/properties/import", {
        method: "POST",
        body: JSON.stringify({ json: JSON.stringify([villa]) }),
      })
    );

    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns field errors and does not create anything when the format is wrong", async () => {
    vi.mocked(cookies).mockResolvedValue(
      cookieJar(adminSessionToken("correct-horse")) as never
    );
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request("http://localhost/api/admin/properties/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: "[}" }),
      })
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.issues[0].message).toMatch(/JSON не читается/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts only new properties", async () => {
    vi.mocked(cookies).mockResolvedValue(
      cookieJar(adminSessionToken("correct-horse")) as never
    );
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method || "GET";
      if (method === "GET") {
        return new Response(JSON.stringify({ data: [] }), { status: 200 });
      }
      return new Response(JSON.stringify({ data: { id: 3 } }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      new Request("http://localhost/api/admin/properties/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: JSON.stringify([villa]) }),
      })
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.results[0].status).toBe("created");
    const methods = fetchMock.mock.calls.map((call) => call[1]?.method || "GET");
    expect(methods.every((method) => method === "GET" || method === "POST")).toBe(true);
    expect(methods).not.toContain("DELETE");
    expect(methods).not.toContain("PUT");
  });
});
