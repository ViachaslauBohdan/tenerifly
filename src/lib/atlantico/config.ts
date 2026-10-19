import { ATLANTICO_AFFILIATE_ID } from "./affiliate";

const DEFAULT_BASE_URL = "https://api.atlanticoexcursiones.com";

/** Host from the supplier manual. Confirm is documented here, not on the catalog host. */
export const ATLANTICO_TEST_API_BASE_URL =
  "https://testapi.atlanticoexcursiones.com";

function trimBaseUrl(value: string): string {
  return value.trim().replace(/\/$/, "");
}

/**
 * Confirm hosts, in order. The first is the configured catalog API.
 * If that call does not return a booking code, the next host is used.
 */
export function atlanticoConfirmBaseUrls(): string[] {
  const primary = trimBaseUrl(
    process.env.ATLANTICO_API_BASE_URL || DEFAULT_BASE_URL
  );
  const fallback = trimBaseUrl(
    process.env.ATLANTICO_API_CONFIRM_FALLBACK_URL ||
      ATLANTICO_TEST_API_BASE_URL
  );
  return fallback && fallback !== primary ? [primary, fallback] : [primary];
}

export type AtlanticoConfig = {
  baseUrl: string;
  token: string;
  userId: string;
  collaborator: string;
};

export function getAtlanticoConfig(): AtlanticoConfig {
  const baseUrl = (
    process.env.ATLANTICO_API_BASE_URL || DEFAULT_BASE_URL
  ).replace(/\/$/, "");

  return {
    baseUrl,
    token: process.env.ATLANTICO_API_TOKEN?.trim() || "",
    userId:
      process.env.ATLANTICO_USER_ID?.trim() || ATLANTICO_AFFILIATE_ID,
    collaborator:
      process.env.ATLANTICO_COLLABORATOR?.trim() || ATLANTICO_AFFILIATE_ID,
  };
}

export function isAtlanticoCatalogConfigured(): boolean {
  return Boolean(getAtlanticoConfig().baseUrl);
}

export function isAtlanticoBookingConfigured(): boolean {
  return Boolean(getAtlanticoConfig().userId);
}
