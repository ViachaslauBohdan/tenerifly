import { describe, it, expect } from "vitest";
import {
  detectDistrict,
  getAllDistricts,
  getDistrictLocations,
  isValidDistrict,
  TENERIFE_DISTRICTS,
} from "./districtDetection";

describe("districtDetection", () => {
  describe("detectDistrict", () => {
    it("should detect Costa Adeje from various city names", () => {
      expect(detectDistrict("Costa Adeje", "")).toBe("Costa Adeje");
      expect(detectDistrict("Playa de las Américas", "")).toBe("Costa Adeje");
      expect(detectDistrict("Las Americas", "")).toBe("Costa Adeje");
      expect(detectDistrict("El Duque", "")).toBe("Costa Adeje");
      expect(detectDistrict("Playa Paraiso", "")).toBe("Costa Adeje");
    });

    it("should detect Santiago del Teide from various city names", () => {
      expect(detectDistrict("Puerto de Santiago", "")).toBe("Santiago del Teide");
      expect(detectDistrict("Los Gigantes", "")).toBe("Santiago del Teide");
      expect(detectDistrict("Playa de la Arena", "")).toBe("Santiago del Teide");
    });

    it("should detect Arona from various city names", () => {
      expect(detectDistrict("Los Cristianos", "")).toBe("Arona");
      expect(detectDistrict("Chayofa", "")).toBe("Arona");
      expect(detectDistrict("Los Abrigos", "")).toBe("Arona");
    });

    it("should detect Adeje from various city names", () => {
      expect(detectDistrict("Adeje", "")).toBe("Adeje");
      expect(detectDistrict("Callao Salvaje", "")).toBe("Adeje");
      expect(detectDistrict("Los Menores", "")).toBe("Adeje");
      expect(detectDistrict("La Jaca", "")).toBe("Adeje");
    });

    it("should detect Guía de Isora from various city names", () => {
      expect(detectDistrict("Playa San Juan", "")).toBe("Guía de Isora");
      expect(detectDistrict("Playa de San Juan", "")).toBe("Guía de Isora");
      expect(detectDistrict("San Juan", "")).toBe("Guía de Isora");
    });

    it("should detect district from address when city is missing", () => {
      expect(detectDistrict(null, "Located in Los Gigantes")).toBe(
        "Santiago del Teide"
      );
      expect(detectDistrict("", "Costa Adeje street")).toBe("Costa Adeje");
    });

    it("should detect district from combined city and address", () => {
      expect(detectDistrict("Tenerife", "Playa de las Americas")).toBe(
        "Costa Adeje"
      );
      expect(detectDistrict("Las Americas", "Orlando Complex")).toBe(
        "Costa Adeje"
      );
    });

    it("should return null for unknown locations", () => {
      expect(detectDistrict("Unknown City", "")).toBe(null);
      expect(detectDistrict("", "Unknown Address")).toBe(null);
      expect(detectDistrict("Tenerife", "-")).toBe(null);
    });

    it("should return null for empty inputs", () => {
      expect(detectDistrict(null, null)).toBe(null);
      expect(detectDistrict("", "")).toBe(null);
      expect(detectDistrict(undefined, undefined)).toBe(null);
    });

    it("should be case-insensitive", () => {
      expect(detectDistrict("COSTA ADEJE", "")).toBe("Costa Adeje");
      expect(detectDistrict("los gigantes", "")).toBe("Santiago del Teide");
      expect(detectDistrict("ChAyOfA", "")).toBe("Arona");
    });

    it("should handle special characters", () => {
      expect(detectDistrict("Playa Paraíso", "")).toBe("Costa Adeje");
      expect(detectDistrict("Güímar", "")).toBe("Güímar");
    });
  });

  describe("getAllDistricts", () => {
    it("should return all districts in sorted order", () => {
      const districts = getAllDistricts();
      expect(districts.length).toBeGreaterThan(0);
      expect(districts).toContain("Costa Adeje");
      expect(districts).toContain("Santiago del Teide");
      expect(districts).toContain("Arona");

      // Check if sorted
      const sorted = [...districts].sort();
      expect(districts).toEqual(sorted);
    });

    it("should return unique districts", () => {
      const districts = getAllDistricts();
      const unique = [...new Set(districts)];
      expect(districts).toEqual(unique);
    });
  });

  describe("getDistrictLocations", () => {
    it("should return locations for Costa Adeje", () => {
      const locations = getDistrictLocations("Costa Adeje");
      expect(locations).toContain("Costa Adeje");
      expect(locations).toContain("Playa de las Américas");
      expect(locations).toContain("El Duque");
    });

    it("should return locations for Santiago del Teide", () => {
      const locations = getDistrictLocations("Santiago del Teide");
      expect(locations).toContain("Puerto de Santiago");
      expect(locations).toContain("Los Gigantes");
    });

    it("should return empty array for unknown district", () => {
      const locations = getDistrictLocations("Unknown District");
      expect(locations).toEqual([]);
    });
  });

  describe("isValidDistrict", () => {
    it("should return true for valid districts", () => {
      expect(isValidDistrict("Costa Adeje")).toBe(true);
      expect(isValidDistrict("Santiago del Teide")).toBe(true);
      expect(isValidDistrict("Arona")).toBe(true);
      expect(isValidDistrict("Adeje")).toBe(true);
    });

    it("should return false for invalid districts", () => {
      expect(isValidDistrict("Unknown")).toBe(false);
      expect(isValidDistrict("Tenerife")).toBe(false);
      expect(isValidDistrict("")).toBe(false);
    });

    it("should be case-sensitive for exact match", () => {
      expect(isValidDistrict("COSTA ADEJE")).toBe(false);
      expect(isValidDistrict("costa adeje")).toBe(false);
    });
  });

  describe("TENERIFE_DISTRICTS", () => {
    it("should contain major tourist areas", () => {
      expect(TENERIFE_DISTRICTS["Costa Adeje"]).toBeDefined();
      expect(TENERIFE_DISTRICTS["Santiago del Teide"]).toBeDefined();
      expect(TENERIFE_DISTRICTS["Arona"]).toBeDefined();
    });

    it("should have all districts with at least one location", () => {
      Object.entries(TENERIFE_DISTRICTS).forEach(([district, locations]) => {
        expect(locations.length).toBeGreaterThan(0);
      });
    });
  });
});
