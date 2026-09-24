import { describe, expect, it, vi } from "vitest";
import { probeAtlanticoTestBooking } from "./adminProbe";

describe("probeAtlanticoTestBooking", () => {
  it("calls only the supplier test host", async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      expect(url.startsWith("https://testapi.atlanticoexcursiones.com")).toBe(true);
      expect(url.startsWith("https://api.atlanticoexcursiones.com")).toBe(false);
      if (String(init?.method) === "POST") {
        return new Response("-1", { status: 200 });
      }
      if (url.includes("/eventDetails/")) {
        return new Response(JSON.stringify({ name: "From The South Area", group: "12", times: ["08:00"] }), {
          status: 200,
        });
      }
      return new Response("52.00|35.00|0.00", { status: 200 });
    });

    const result = await probeAtlanticoTestBooking(fetchImpl as typeof fetch);
    expect(result.host).toBe("https://testapi.atlanticoexcursiones.com");
    expect(result.event.name).toBe("From The South Area");
    expect(result.confirm.body).toBe("-1");
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });
});
