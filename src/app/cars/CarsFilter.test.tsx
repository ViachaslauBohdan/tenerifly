import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import CarsFilter from "./CarsFilter";

afterEach(() => {
  cleanup();
});

const filters = {
  brand: "",
  model: "",
  yearFrom: "",
  yearTo: "",
  priceFrom: "",
  priceTo: "",
  mileageFrom: "",
  mileageTo: "",
  fuel: "",
  transmission: "",
  bodyType: "",
  color: "",
  doors: "",
  seats: "",
  powerFrom: "",
  powerTo: "",
  location: "",
  availableFrom: "",
  airConditioner: false,
  rearCamera: false,
  multimedia: false,
  type: "",
  carStatus: "",
  q: "",
};

const cars = [
  {
    id: 1,
    title: "Seat Ibiza",
    specifications: {
      make: "Seat",
      model: "Ibiza",
      fuel: "petrol",
      transmission: "manual",
      seats: 5,
      year: 2023,
    },
    rental_prices: { day_1: 35 },
  },
  {
    id: 2,
    title: "Toyota Proace",
    specifications: {
      make: "Toyota",
      model: "Proace",
      fuel: "diesel",
      transmission: "automatic",
      seats: 9,
      year: 2022,
    },
    rental_prices: { day_1: 70 },
  },
];

describe("CarsFilter", () => {
  it("keeps the rental filters in one horizontal section", async () => {
    const onCarsUpdate = vi.fn();

    const { container } = render(
      <CarsFilter
        filters={filters}
        onFilterChange={vi.fn()}
        onResetFilters={vi.fn()}
        onCarsUpdate={onCarsUpdate}
        locale="en"
        translations={{
          brand: "Brand",
          allBrands: "All brands",
          transmission: "Transmission",
          any: "Any",
          fuelType: "Fuel type",
          pricePerDay: "Price (€/day)",
          yearOfManufacture: "Year of manufacture",
          model: "Model",
          allModels: "All models",
          from: "From",
          to: "To",
          petrol: "Petrol",
          showMoreFilters: "Show more filters",
          showLessFilters: "Show less filters",
          resetFilters: "Reset filters",
        }}
        allCars={cars}
      />
    );

    const brand = screen.getByText("Brand");
    const row = brand.parentElement?.parentElement;
    expect(row?.className).toMatch(/flex/);
    expect(row).toContainElement(screen.getByText("Transmission"));
    expect(row).toContainElement(screen.getByText("Seats"));
    expect(
      screen.getByRole("button", { name: "Show more filters" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Fuel type")).not.toBeInTheDocument();
    expect(container.querySelector("section")).not.toBeNull();

    await waitFor(() => {
      expect(onCarsUpdate).toHaveBeenCalledWith(cars);
    });
  });

  it("filters by transmission and reveals the extra rental fields", async () => {
    const onCarsUpdate = vi.fn();
    const user = userEvent.setup();

    render(
      <CarsFilter
        filters={{ ...filters, transmission: "automatic" }}
        onFilterChange={vi.fn()}
        onResetFilters={vi.fn()}
        onCarsUpdate={onCarsUpdate}
        locale="ru"
        translations={{
          brand: "Марка",
          allBrands: "Все марки",
          transmission: "Коробка",
          any: "Любая",
          fuelType: "Топливо",
          pricePerDay: "Цена",
          yearOfManufacture: "Год",
          model: "Модель",
          allModels: "Все модели",
          from: "От",
          to: "До",
          diesel: "Дизель",
          showMoreFilters: "Ещё фильтры",
          showLessFilters: "Скрыть фильтры",
          resetFilters: "Сбросить",
        }}
        allCars={cars}
      />
    );

    await user.click(screen.getByRole("button", { name: "Ещё фильтры" }));
    expect(screen.getByText("Топливо")).toBeInTheDocument();
    expect(screen.getByText("Цена")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Автомат" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "9" })).toBeInTheDocument();

    await waitFor(() => {
      expect(onCarsUpdate).toHaveBeenCalledWith([cars[1]]);
    });
  });
});
