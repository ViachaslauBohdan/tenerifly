import { describe, expect, it } from "vitest";
import { propertyMapSearch } from "./propertyMapQuery";

describe("propertyMapSearch", () => {
  it("places a street address ahead of the town", () => {
    const search = propertyMapSearch({
      address: "Calle Venezuela (Ponderosa complex)",
      city: "Costa Adeje",
      region: "Tenerife",
    });

    expect(search).toMatchObject({
      precision: "address",
      label: "Calle Venezuela (Ponderosa complex)",
      areaLabel: "Costa Adeje",
      placeKey: "costa adeje",
      query: "Calle Venezuela (Ponderosa complex), Costa Adeje, Tenerife, Spain",
    });
  });

  it("cuts an address that was pasted twice", () => {
    const search = propertyMapSearch({
      address:
        "C. la Hondura, 22, 38683 Santiago del Teide, Santa Cruz de Tenerife, SpainC. la Hondura, 22, 38683 Santiago del Teide, Santa Cruz de Tenerif",
      city: "38683 Acantilados de Los Gigantes",
      region: "Tenerife",
    });

    expect(search?.query).toBe(
      "C. la Hondura, 22, 38683 Santiago del Teide, Santa Cruz de Tenerife, Spain"
    );
    expect(search?.precision).toBe("address");
    expect(search?.placeKey).toBe("acantilados de los gigantes");
  });

  it("uses the town when the address only repeats the town name", () => {
    const search = propertyMapSearch({
      address: "Los Cristianos",
      city: "Los Cristianos",
      region: "Tenerife",
    });

    expect(search).toMatchObject({
      precision: "city",
      label: "Los Cristianos",
      query: "Los Cristianos, Tenerife, Spain",
    });
  });

  it("drops a postal code stuck to the town name", () => {
    const search = propertyMapSearch({
      address: "",
      city: "38683 Acantilados de Los Gigantes",
      region: "Tenerife",
    });

    expect(search).toMatchObject({
      precision: "city",
      label: "Acantilados de Los Gigantes",
      placeKey: "acantilados de los gigantes",
    });
  });

  it("uses a real district when the town is missing", () => {
    const search = propertyMapSearch({
      address: "-",
      city: "",
      region: "Costa Adeje",
    });

    expect(search).toMatchObject({
      precision: "district",
      label: "Costa Adeje",
      query: "Costa Adeje, Tenerife, Spain",
    });
  });

  it("hides the map when the only place is the whole island", () => {
    expect(
      propertyMapSearch({
        address: "-",
        city: "Tenerife",
        region: "Santa Cruz de Tenerife",
      })
    ).toBeNull();
  });
});
