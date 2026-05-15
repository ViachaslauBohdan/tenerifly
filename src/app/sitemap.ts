import { MetadataRoute } from "next";
import {
  getAllPropertyIds,
  getAllCarIds,
  getAllTourIds,
  getAllBlogIds,
  getAllTransferIds,
} from "@/services/ssgDataService";
import { LOCALES } from "@/types/locale";
import { absoluteUrlForLocale } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    propertyIds,
    carIds,
    tourIds,
    blogIds,
    transferIds,
  ] = await Promise.all([
    getAllPropertyIds().catch(() => []),
    getAllCarIds().catch(() => []),
    getAllTourIds().catch(() => []),
    getAllBlogIds().catch(() => []),
    getAllTransferIds().catch(() => []),
  ]);

  const now = new Date();

  const staticPaths = [
    "",
    "/apartments",
    "/tours",
    "/world-tours",
    "/cars",
    "/blog",
  ];

  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: absoluteUrlForLocale(locale.code, path),
      lastModified: now,
      changeFrequency:
        path === "" || path === "/apartments" || path === "/tours" || path === "/cars"
          ? ("daily" as const)
          : ("weekly" as const),
      priority:
        path === ""
          ? 1
          : path === "/blog"
            ? 0.75
            : 0.9,
    }))
  );

  const propertyPages: MetadataRoute.Sitemap = propertyIds.flatMap(
    (property: { documentId: string }) =>
      LOCALES.map((locale) => ({
        url: absoluteUrlForLocale(locale.code, `/apartments/${property.documentId}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
  );

  const carPages: MetadataRoute.Sitemap = carIds.flatMap(
    (car: { documentId: string }) =>
      LOCALES.map((locale) => ({
        url: absoluteUrlForLocale(locale.code, `/cars/${car.documentId}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
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

  const blogPages: MetadataRoute.Sitemap = blogIds.flatMap(
    (blog: { documentId: string }) =>
      LOCALES.map((locale) => ({
        url: absoluteUrlForLocale(locale.code, `/blog/${blog.documentId}`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.65,
      }))
  );

  const transferPages: MetadataRoute.Sitemap = transferIds.flatMap(
    (transfer: { documentId: string }) =>
      LOCALES.map((locale) => ({
        url: absoluteUrlForLocale(locale.code, `/transfers/${transfer.documentId}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.68,
      }))
  );

  return [
    ...staticPages,
    ...propertyPages,
    ...carPages,
    ...tourPages,
    ...blogPages,
    ...transferPages,
  ];
}
