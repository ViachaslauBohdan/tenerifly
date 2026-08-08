import type { ComponentProps } from "react";
import { cleanup, render, screen } from "@testing-library/react";
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
  it("renders a select with guest options instead of a number input", () => {
    renderGuests();

    const select = getGuestSelect();
    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveValue("2");
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(select.querySelectorAll("option")).toHaveLength(10);
  });

  it("clamps invalid values down to 1", () => {
    renderGuests({ value: 0 });
    expect(getGuestSelect()).toHaveValue("1");
  });

  it("clamps values above max down to max", () => {
    renderGuests({ value: 99, max: 10 });
    expect(getGuestSelect()).toHaveValue("10");
  });

  it("supports a custom max for tour people counts", () => {
    render(
      <CompactGuestSelect
        value={6}
        onChange={vi.fn()}
        max={20}
        ariaLabel="People"
        controlClassName="control"
      />
    );

    expect(
      screen.getByRole("combobox", { name: "People" }).querySelectorAll("option")
    ).toHaveLength(20);
  });

  it("calls onChange with a number when a guest count is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderGuests({ onChange });

    await user.selectOptions(getGuestSelect(), "4");
    expect(onChange).toHaveBeenCalledWith(4);
  });
});
