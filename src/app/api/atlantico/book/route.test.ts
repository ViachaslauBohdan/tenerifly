import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AtlanticoApiError } from "@/lib/atlantico/client";

vi.mock("@/lib/atlantico/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/atlantico/client")>();
  return {
    ...actual,
    confirmAtlanticoBooking: vi.fn(),
  };
});

import { confirmAtlanticoBooking } from "@/lib/atlantico/client";
import { POST } from "./route";

const validBody = {
  t_id: "184",
  t_group: "12",
  language: "ENG",
  tourDate: "2026-08-22",
  sesTime: "09:30",
  adults: 2,
  childs: 0,
  infants: 0,
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+34600111222",
};

function postBook(body: unknown) {
  return POST(
    new Request("http://localhost/api/atlantico/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  );
}

describe("POST /api/atlantico/book", () => {
  beforeEach(() => {
    vi.mocked(confirmAtlanticoBooking).mockReset();
    vi.mocked(confirmAtlanticoBooking).mockResolvedValue({
      bookingCode: "TEST-NO-LIVE-BOOKING",
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects invalid JSON without calling confirm", async () => {
    const response = await postBook("{");
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid JSON" });
    expect(confirmAtlanticoBooking).not.toHaveBeenCalled();
  });

  it("rejects an incomplete payload without calling confirm", async () => {
    const response = await postBook({ name: "Ada Lovelace" });
    expect(response.status).toBe(400);
    expect(confirmAtlanticoBooking).not.toHaveBeenCalled();
  });

  it("returns a mocked booking code and never hits Atlántico", async () => {
    const response = await postBook(validBody);
    const payload = (await response.json()) as { bookingCode?: string };

    expect(response.status).toBe(200);
    expect(payload.bookingCode).toBe("TEST-NO-LIVE-BOOKING");
    expect(confirmAtlanticoBooking).toHaveBeenCalledTimes(1);
    expect(vi.mocked(confirmAtlanticoBooking).mock.calls[0][0]).toMatchObject({
      t_id: "184",
      t_group: "12",
      userId: "3726",
      name: "Ada Lovelace",
      email: "ada@example.com",
    });
  });

  it("omits optional hotel and notes from the confirm payload", async () => {
    await postBook(validBody);
    const sent = vi.mocked(confirmAtlanticoBooking).mock.calls[0][0];
    expect(sent).not.toHaveProperty("hotel");
    expect(sent).not.toHaveProperty("Notes");
  });

  it("maps a mocked supplier error without creating a booking", async () => {
    vi.mocked(confirmAtlanticoBooking).mockRejectedValue(
      new AtlanticoApiError("Session full", 409, "sold_out")
    );

    const response = await postBook(validBody);
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: "Session full",
      code: "sold_out",
    });
  });
});
