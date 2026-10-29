import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ApartmentsFilter from "./ApartmentsFilter";
import type { ApartmentFilterParams } from "@/utils/filterUtils";

afterEach(() => {
  cleanup();
});

const filters: ApartmentFilterParams = {
  propertyType: "",
  rooms: "",
  areaFrom: "",
  areaTo: "",
  priceFrom: "",
  priceTo: "",
  floorFrom: "",
  floorTo: "",
  yearBuiltFrom: "",
  yearBuiltTo: "",
  condition: "",
  city: "",
  district: "",
  balcony: false,
  terrace: false,
  garden: false,
  parking: false,
  furnished: false,
  airConditioner: false,
  wifi: false,
  washingMachine: false,
  dishwasher: false,
  type: "",
  propertyStatus: "",
  q: "brand",
};

const apartments = [
  {
    id: 1,
    title: "Brand new apartment in Parque Royal",
    description: "Ocean terrace",
    location: { city: "Costa Adeje", region: "Tenerife" },
  },
  {
    id: 2,
    title: "Ocean view apartment in Park Royal I",
    description: "Brand new parking and a sparkling pool",
    location: { city: "Costa Adeje", region: "Tenerife" },
  },
];

describe("ApartmentsFilter", () => {
  it("keeps the main filters in one horizontal section and matches the title only", async () => {
    const onApartmentsUpdate = vi.fn();

    const { container } = render(
      <ApartmentsFilter
        filters={filters}
        onFilterChange={vi.fn()}
        onResetFilters={vi.fn()}
        onApartmentsUpdate={onApartmentsUpdate}
        translations={{
          district: "District",
          location: "Location",
          type: "Type",
          allDistricts: "All districts",
          allLocations: "All locations",
          allTypes: "All types",
          showMoreFilters: "Show more filters",
          showLessFilters: "Show less filters",
        }}
        allApartments={apartments}
      />
    );

    const district = screen.getByText("District");
    const location = screen.getByText("Location");
    const row = district.parentElement?.parentElement;
    expect(row?.className).toMatch(/flex/);
    expect(row).toContainElement(location);
    expect(row).toContainElement(screen.getByText("Type"));
    expect(screen.getByRole("button", { name: "Show more filters" })).toBeInTheDocument();
    expect(container.querySelector("section")).not.toBeNull();

    await waitFor(() => {
      expect(onApartmentsUpdate).toHaveBeenCalledWith([apartments[0]]);
    });
  });
});
