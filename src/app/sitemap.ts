import { MetadataRoute } from "next";
import { getAllTourIds } from "@/services/ssgDataService";
import { LOCALES } from "@/types/locale";
import { absoluteUrlForLocale } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tourIds = await getAllTourIds().catch(() => []);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    (["", "/tours", "/world-tours"] as const).map((path) => ({
      url: absoluteUrlForLocale(locale.code, path),
      lastModified: now,
      changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : path === "/world-tours" ? 0.85 : 0.9,
    }))
  );

  const tourPages: MetadataRoute.Sitemap = tourIds.flatMap(
    (tour: { documentId: string }) =>
      LOCALES.map((locale) => ({
        url: absoluteUrlForLocale(locale.code, `/tours/${tour.documentId}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
  );

  return [...staticPages, ...tourPages];
}
