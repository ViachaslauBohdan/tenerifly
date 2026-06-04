import { MetadataRoute } from "next";
import { getAllTourIds } from "@/services/ssgDataService";
import { LOCALES } from "@/types/locale";
import { absoluteUrlForLocale } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tourIds = await getAllTourIds().catch(() => []);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    (["", "/tours", "/aviso-legal"] as const).map((path) => ({
      url: absoluteUrlForLocale(locale.code, path),
      lastModified: now,
      changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : 0.9,
    }))
    // World tours — disabled: add "/world-tours" to the array above when re-enabling
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
