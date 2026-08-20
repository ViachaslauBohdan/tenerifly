import { ATLANTICO_AFFILIATE_ID } from "./affiliate";

const DEFAULT_BASE_URL = "https://testapi.atlanticoexcursiones.com";

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
