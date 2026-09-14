import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AtlanticoExcursionsByChannel } from "./AtlanticoExcursionsByChannel";

vi.mock("./AtlanticoIframeBooking", () => ({
  AtlanticoIframeBooking: () => <iframe title="Atlántico Excursiones catalog" />,
}));

vi.mock("@/lib/atlantico/bookingMode", () => ({
  getAtlanticoBookingChannel: vi.fn(),
}));

import { getAtlanticoBookingChannel } from "@/lib/atlantico/bookingMode";

describe("AtlanticoExcursionsByChannel", () => {
  afterEach(() => {
    cleanup();
    vi.mocked(getAtlanticoBookingChannel).mockReset();
  });

  it("shows iframe when the env channel is iframe", () => {
    vi.mocked(getAtlanticoBookingChannel).mockReturnValue("iframe");
    render(
      <AtlanticoExcursionsByChannel
        locale="en"
        api={<div>api tiles</div>}
      />
    );
    expect(screen.getByTitle(/Atlántico Excursiones catalog/i)).toBeInTheDocument();
    expect(screen.queryByText(/api tiles/i)).not.toBeInTheDocument();
  });

  it("shows api catalog when the env channel is api", () => {
    vi.mocked(getAtlanticoBookingChannel).mockReturnValue("api");
    render(
      <AtlanticoExcursionsByChannel
        locale="en"
        api={<div>api tiles</div>}
      />
    );
    expect(screen.getByText(/api tiles/i)).toBeInTheDocument();
    expect(screen.queryByTitle(/Atlántico Excursiones catalog/i)).not.toBeInTheDocument();
  });
});
