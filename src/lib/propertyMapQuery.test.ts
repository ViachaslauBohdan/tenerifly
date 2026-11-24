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
      label: "Calle Venezuela",
      areaLabel: "Costa Adeje",
      placeKey: "costa adeje",
      query: "Calle Venezuela, Costa Adeje, Tenerife",
    });
  });

  it("ties a pasted Google address to the street and the postal code on that line", () => {
    const search = propertyMapSearch({
      address: "C. Venezuela, 18, 38660 Costa Adeje, Santa Cruz de Tenerife",
      city: "Costa Adeje",
      region: "Costa Adeje",
      postalCode: "38670",
    });

    expect(search?.queries[0]).toBe("18 Calle Venezuela, 38660, Tenerife");
    expect(search?.label).toBe("Calle Venezuela");
    expect(search?.precision).toBe("address");
    expect(search?.queries).not.toContain("18 Calle Venezuela, 38670, Tenerife");
  });

  it("keeps the neighbourhood when the street number is a unit inside a complex", () => {
    const search = propertyMapSearch({
      address: "Calle Venezuela, 605 (Ponderosa), San Eugenio Bajo",
      city: "Costa Adeje",
      region: "Tenerife",
      postalCode: "38670",
    });

    expect(search?.queries[0]).toBe(
      "Calle Venezuela, San Eugenio Bajo, Tenerife"
    );
    expect(search?.queries.join(" ")).not.toContain("38670");
  });

  it("cuts an address that was pasted twice", () => {
    const search = propertyMapSearch({
      address:
        "C. la Hondura, 22, 38683 Santiago del Teide, Santa Cruz de Tenerife, SpainC. la Hondura, 22, 38683 Santiago del Teide, Santa Cruz de Tenerif",
      city: "38683 Acantilados de Los Gigantes",
      region: "Tenerife",
    });

    expect(search?.queries[0]).toBe("22 Calle la Hondura, 38683, Tenerife");
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
