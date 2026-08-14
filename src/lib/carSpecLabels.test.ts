import { describe, expect, it } from "vitest";
import { carTransmissionLabel } from "./carSpecLabels";

describe("carTransmissionLabel", () => {
  it("localizes automatic for every supported locale", () => {
    expect(carTransmissionLabel("automatic", "en")).toBe("Automatic");
    expect(carTransmissionLabel("automatic", "pl")).toBe("Automatyczna");
    expect(carTransmissionLabel("automatic", "ru")).toBe("Автомат");
    expect(carTransmissionLabel("automatic", "ua")).toBe("Автомат");
    expect(carTransmissionLabel("automatic", "de")).toBe("Automatik");
    expect(carTransmissionLabel("automatic", "es")).toBe("Automático");
    expect(carTransmissionLabel("automatic", "fr")).toBe("Automatique");
  });

  it("localizes manual and semi-automatic", () => {
    expect(carTransmissionLabel("manual", "pl")).toBe("Manualna");
    expect(carTransmissionLabel("semi-automatic", "pl")).toBe("Półautomatyczna");
    expect(carTransmissionLabel("semi_automatic", "de")).toBe("Halbautomatik");
  });

  it("maps ua to uk and falls back to English", () => {
    expect(carTransmissionLabel("automatic", "ua")).toBe("Автомат");
    expect(carTransmissionLabel("automatic", "xx")).toBe("Automatic");
  });

  it("returns an em dash for a blank value", () => {
    expect(carTransmissionLabel("", "pl")).toBe("—");
    expect(carTransmissionLabel(undefined, "pl")).toBe("—");
  });
});
