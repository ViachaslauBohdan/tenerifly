import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@mantine/core", () => ({
  Modal: ({
    children,
    opened,
  }: {
    children: React.ReactNode;
    opened: boolean;
  }) => (opened ? <div>{children}</div> : null),
  Text: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  TextInput: () => null,
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
  Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Group: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Textarea: () => <textarea />,
}));

vi.mock("@mantine/dates", () => ({
  DateInput: () => null,
}));

vi.mock("@tabler/icons-react", () => ({
  IconCalendar: () => null,
  IconMessage: () => null,
  IconSend: () => null,
}));

import { BookingModal } from "./BookingModal";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("BookingModal", () => {
  it("sends the booking request to the work WhatsApp number", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const user = userEvent.setup();

    render(
      <BookingModal
        opened
        onClose={() => undefined}
        itemType="accommodation"
        title="Sunny Duplex"
        price="€70"
        currentLocale="en"
      />
    );

    await user.click(
      screen.getByRole("button", { name: "Send Booking Request" })
    );

    expect(open).toHaveBeenCalledTimes(1);
    const url = String(open.mock.calls[0][0]);
    expect(url.startsWith("https://wa.me/34604972372?text=")).toBe(true);
    expect(url).not.toContain("34656641433");
    expect(url).not.toContain("34613211069");
  });
});
