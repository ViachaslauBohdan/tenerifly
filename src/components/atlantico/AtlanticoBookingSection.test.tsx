import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AtlanticoBookingSection } from "./AtlanticoBookingSection";

vi.mock("./AtlanticoBookingPanel", () => ({
  AtlanticoBookingPanel: ({ tourName }: { tourName: string }) => (
    <div>API booking form for {tourName}</div>
  ),
}));

vi.mock("./AtlanticoIframeBooking", () => ({
  AtlanticoIframeBooking: () => <iframe title="Atlántico Excursiones catalog" />,
}));

vi.mock("@/lib/atlantico/bookingMode", () => ({
  getAtlanticoBookingChannel: vi.fn(),
}));

import { getAtlanticoBookingChannel } from "@/lib/atlantico/bookingMode";

const props = {
  tourCode: "14",
  tourName: "Siam Park",
  events: [{ id: "20", code: "20", name: "Ticket" }],
  locale: "en",
};

describe("AtlanticoBookingSection", () => {
  afterEach(() => {
    cleanup();
    vi.mocked(getAtlanticoBookingChannel).mockReset();
  });

  it("renders only the partner iframe when env is iframe", () => {
    vi.mocked(getAtlanticoBookingChannel).mockReturnValue("iframe");
    render(<AtlanticoBookingSection {...props} />);

    expect(screen.getByTitle(/Atlántico Excursiones catalog/i)).toBeInTheDocument();
    expect(screen.queryByText(/API booking form/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("renders only the REST form when env is api", () => {
    vi.mocked(getAtlanticoBookingChannel).mockReturnValue("api");
    render(<AtlanticoBookingSection {...props} />);

    expect(screen.getByText(/API booking form for Siam Park/i)).toBeInTheDocument();
    expect(screen.queryByTitle(/Atlántico Excursiones catalog/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });
});
