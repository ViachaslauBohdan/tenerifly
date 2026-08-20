import { afterEach, describe, expect, it, vi } from "vitest";
import { ATLANTICO_AFFILIATE_ID } from "./affiliate";
import { getAtlanticoExcursionsAffiliateUrl } from "@/lib/excursionAggregatorUrls";

describe("Atlantico affiliate attribution", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses Tenerife Joy collaborator 3726", () => {
    expect(ATLANTICO_AFFILIATE_ID).toBe("3726");
  });

  it("sends 3726 on website affiliate links", () => {
    expect(getAtlanticoExcursionsAffiliateUrl("en")).toContain("afId=3726");
  });

  it("defaults API userId and collaborator to 3726", async () => {
    vi.stubEnv("ATLANTICO_USER_ID", "");
    vi.stubEnv("ATLANTICO_COLLABORATOR", "");
    const { getAtlanticoConfig, isAtlanticoCatalogConfigured } = await import(
      "./config"
    );
    const config = getAtlanticoConfig();
    expect(config.userId).toBe("3726");
    expect(config.collaborator).toBe("3726");
    expect(isAtlanticoCatalogConfigured()).toBe(true);
  });
});
