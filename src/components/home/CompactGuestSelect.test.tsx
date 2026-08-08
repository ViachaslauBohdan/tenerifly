import type { ComponentProps } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CompactGuestSelect } from "@/components/home/CompactGuestSelect";

afterEach(() => {
  cleanup();
});

function renderGuests(
  props: Partial<ComponentProps<typeof CompactGuestSelect>> = {}
) {
  return render(
    <CompactGuestSelect
      value={2}
      onChange={vi.fn()}
      ariaLabel="Guests"
      controlClassName="control"
      {...props}
    />
  );
}

function getGuestSelect() {
  return screen.getByRole("combobox", { name: "Guests" });
}

describe("CompactGuestSelect", () => {
  it("renders a combobox instead of a number input", () => {
    renderGuests();

    const select = getGuestSelect();
    expect(select.tagName).toBe("BUTTON");
    expect(select).toHaveAttribute("data-value", "2");
    expect(select).toHaveTextContent("2");
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("clamps invalid values down to 1", () => {
    renderGuests({ value: 0 });
    expect(getGuestSelect()).toHaveAttribute("data-value", "1");
  });

  it("clamps values above max down to max", () => {
    renderGuests({ value: 99, max: 10 });
    expect(getGuestSelect()).toHaveAttribute("data-value", "10");
  });

  it("supports a custom max for tour people counts with a scrollable list", async () => {
    const user = userEvent.setup();
    render(
      <CompactGuestSelect
        value={6}
        onChange={vi.fn()}
        max={20}
        ariaLabel="People"
        controlClassName="control"
      />
    );

    await user.click(screen.getByRole("combobox", { name: "People" }));
    const listbox = screen.getByRole("listbox", { name: "People" });
    expect(within(listbox).getAllByRole("option")).toHaveLength(20);
    expect(listbox.className).toMatch(/overflow-y-auto/);
    expect(listbox.style.maxHeight).toBeTruthy();
  });

  it("calls onChange with a number when a guest count is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderGuests({ onChange });

    await user.click(getGuestSelect());
    await user.click(screen.getByRole("option", { name: "4" }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("uses a full-width select hit target linked by id", () => {
    renderGuests({ id: "hero-guests" });
    const select = getGuestSelect();
    expect(select).toHaveAttribute("id", "hero-guests");
    expect(select.className).toMatch(/w-full/);
    expect(select.className).toMatch(/min-h-8/);
  });

  it("opens the listbox with the keyboard", async () => {
    const user = userEvent.setup();
    renderGuests();

    getGuestSelect().focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox", { name: "Guests" })).toBeInTheDocument();
  });
});
