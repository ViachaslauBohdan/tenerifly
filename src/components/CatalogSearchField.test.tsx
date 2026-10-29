import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CatalogSearchField, SEARCH_DEBOUNCE_MS } from "./CatalogSearchField";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function renderField(value: string, onChange: (value: string) => void) {
  return render(
    <CatalogSearchField
      locale="en"
      value={value}
      onChange={onChange}
      placeholder="Apartment name"
    />
  );
}

describe("CatalogSearchField", () => {
  it("waits until typing pauses before publishing the full query once", () => {
    expect(SEARCH_DEBOUNCE_MS).toBeGreaterThanOrEqual(800);
    const onChange = vi.fn();
    renderField("", onChange);
    const input = screen.getByRole("searchbox", { name: "Search" });

    fireEvent.change(input, { target: { value: "r" } });
    fireEvent.change(input, { target: { value: "ro" } });
    fireEvent.change(input, { target: { value: "roy" } });

    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1);
    });
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("roy");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("roy");
  });

  it("keeps newer letters when the parent echoes the previous query", () => {
    const onChange = vi.fn();
    const view = renderField("", onChange);
    const input = screen.getByRole("searchbox", { name: "Search" });

    fireEvent.change(input, { target: { value: "roy" } });
    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    });

    fireEvent.change(input, { target: { value: "royal" } });
    view.rerender(
      <CatalogSearchField
        locale="en"
        value="roy"
        onChange={onChange}
        placeholder="Apartment name"
      />
    );

    expect(input).toHaveValue("royal");
    expect(onChange).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    });
    expect(onChange).toHaveBeenLastCalledWith("royal");
  });

  it("follows an external query such as the URL or reset", () => {
    const onChange = vi.fn();
    const view = renderField("", onChange);

    view.rerender(
      <CatalogSearchField
        locale="en"
        value="brand"
        onChange={onChange}
        placeholder="Apartment name"
      />
    );

    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("brand");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("clears the query immediately", () => {
    const onChange = vi.fn();
    renderField("brand", onChange);

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("");
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });
});
