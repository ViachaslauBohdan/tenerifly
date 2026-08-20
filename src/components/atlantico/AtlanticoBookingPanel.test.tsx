import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AtlanticoBookingPanel } from "./AtlanticoBookingPanel";

vi.mock("@/components/PhoneNumberInput", () => ({
  isPhoneNumberValid: (_country: string, value?: string) =>
    Boolean(value && value.replace(/\D/g, "").length >= 8),
  PhoneNumberInput: ({
    label,
    value,
    onChange,
    error,
  }: {
    label: string;
    value?: string;
    onChange: (value: string) => void;
    error?: string;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span>{error}</span> : null}
    </label>
  ),
}));

vi.mock("@/lib/gtag", () => ({
  gtagReportConversion: vi.fn(),
}));

const REAL_SUPPLIER_HOST = /atlanticoexcursiones\.com/i;

const events = [
  {
    id: "569",
    code: "184",
    name: "From The South Area",
    pProd: "0" as const,
  },
];

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("AtlanticoBookingPanel", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo) => {
        const url = String(input);
        expect(url).not.toMatch(REAL_SUPPLIER_HOST);
        expect(url).not.toMatch(/\/confirm(?:\?|$)/);
        if (url.includes("/api/atlantico/availability")) {
          return {
            ok: true,
            json: async () => ({
              dates: ["2026-08-22"],
              limits: { id: "184", dates: { date: ["20260822"] }, sessions: {} },
            }),
          };
        }
        if (url.includes("/api/atlantico/prices")) {
          return {
            ok: true,
            json: async () => ({
              prices: {
                kind: "perPerson",
                adult: 36,
                child: 19,
                infant: 0,
                adultCommission: 0,
                childCommission: 0,
                infantCommission: 0,
              },
            }),
          };
        }
        if (url.includes("/api/atlantico/book")) {
          return {
            ok: true,
            json: async () => ({ bookingCode: "AE-1001" }),
          };
        }
        return { ok: false, json: async () => ({ error: "unexpected" }) };
      })
    );
  });

  it("keeps Book now enabled and shows errors when required fields are empty", async () => {
    const user = userEvent.setup();
    render(
      <AtlanticoBookingPanel
        tourCode="12"
        tourName="Teide Masca"
        events={events}
        locale="en"
      />
    );

    const bookNow = await screen.findByRole("button", { name: /book now/i });
    expect(bookNow).toBeEnabled();

    await user.click(bookNow);

    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter a valid phone/i)).toBeInTheDocument();
    expect(vi.mocked(fetch).mock.calls.some(([input]) => String(input).includes("/api/atlantico/book"))).toBe(
      false
    );
  });

  it("confirms a booking and shows the reference", async () => {
    const user = userEvent.setup();
    render(
      <AtlanticoBookingPanel
        tourCode="12"
        tourName="Teide Masca"
        events={events}
        locale="en"
      />
    );

    expect(
      await screen.findByRole("button", { name: /book now/i })
    ).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: /full name/i }), "Ada Lovelace");
    await user.type(screen.getByRole("textbox", { name: /email/i }), "ada@example.com");
    await user.type(screen.getByLabelText(/phone/i), "+34600111222");
    await user.click(screen.getByRole("button", { name: /book now/i }));

    expect(
      await screen.findByText(/reservation confirmed/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/AE-1001/)).toBeInTheDocument();

    const booked = vi
      .mocked(fetch)
      .mock.calls.filter(([input]) => String(input).includes("/api/atlantico/book"));
    expect(booked).toHaveLength(1);
    expect(booked.every(([input]) => String(input).startsWith("/api/atlantico/"))).toBe(
      true
    );
  });
});
