import type { ComponentProps } from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CompactSelect } from "@/components/home/CompactSelect";

afterEach(() => {
  cleanup();
});

const OPTIONS = [
  { value: "accommodation", label: "Accommodation" },
  { value: "cars", label: "Cars" },
  { value: "tours", label: "Tours" },
];

function renderSelect(
  props: Partial<ComponentProps<typeof CompactSelect>> = {}
) {
  return render(
    <CompactSelect
      value="accommodation"
      onChange={vi.fn()}
      options={OPTIONS}
      ariaLabel="Leisure"
      controlClassName="control"
      {...props}
    />
  );
}

describe("CompactSelect", () => {
  it("renders the selected label and data-value", () => {
    renderSelect();
    const control = screen.getByRole("combobox", { name: "Leisure" });
    expect(control).toHaveAttribute("data-value", "accommodation");
    expect(control).toHaveTextContent("Accommodation");
  });

  it("calls onChange with the option value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ onChange });

    await user.click(screen.getByRole("combobox", { name: "Leisure" }));
    await user.click(screen.getByRole("option", { name: "Cars" }));
    expect(onChange).toHaveBeenCalledWith("cars");
  });

  it("exposes option data-value attributes for e2e selection", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox", { name: "Leisure" }));
    const listbox = screen.getByRole("listbox", { name: "Leisure" });
    expect(
      within(listbox).getByRole("option", { name: "Tours" })
    ).toHaveAttribute("data-value", "tours");
  });
});
