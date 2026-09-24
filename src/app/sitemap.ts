import { MetadataRoute } from "next";
import {
  getAllPropertyIds,
  getAllCarIds,
  getAllTourIds,
  getAllBlogIds,
  getAllTransferIds,
} from "@/services/ssgDataService";
import { listAtlanticoTourCodes } from "@/lib/atlantico/resolveTour";
import { listAuthorTourIds } from "@/lib/authorTours";
import { LOCALES } from "@/types/locale";
import { absoluteUrlForLocale } from "@/lib/seo";
import { BLOG_ENABLED } from "@/lib/siteFeatures";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    propertyIds,
    carIds,
    tourIds,
    atlanticoTourCodes,
    blogIds,
    transferIds,
  ] = await Promise.all([
    getAllPropertyIds().catch(() => []),
    getAllCarIds().catch(() => []),
    getAllTourIds().catch(() => []),
    listAtlanticoTourCodes().catch(() => []),
    BLOG_ENABLED ? getAllBlogIds().catch(() => []) : Promise.resolve([]),
    getAllTransferIds().catch(() => []),
  ]);

  const now = new Date();

  const staticPaths = [
    "",
    "/apartments",
    "/tours",
    "/world-tours",
    "/cars",
    ...(BLOG_ENABLED ? ["/blog"] : []),
    "/aviso-legal",
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

  const strapiTourPages: MetadataRoute.Sitemap = tourIds.flatMap(
    (tour: { documentId: string }) =>
      LOCALES.map((locale) => ({
        url: absoluteUrlForLocale(locale.code, `/tours/${tour.documentId}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
  );

  const atlanticoTourPages: MetadataRoute.Sitemap = atlanticoTourCodes.flatMap(
    (code) =>
      LOCALES.map((locale) => ({
        url: absoluteUrlForLocale(locale.code, `/tours/${code}`),
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      }))
  );

  const tourPages = [...atlanticoTourPages, ...strapiTourPages];

  const blogPages: MetadataRoute.Sitemap = blogIds.flatMap(
    (blog: { documentId: string }) =>
      LOCALES.map((locale) => ({
        url: absoluteUrlForLocale(locale.code, `/blog/${blog.documentId}`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.65,
      }))
  );

  const authorTourPages: MetadataRoute.Sitemap = listAuthorTourIds().flatMap(
    (id) =>
      LOCALES.map((locale) => ({
        url: absoluteUrlForLocale(locale.code, `/author-tours/${id}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
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
    ...authorTourPages,
  ];
}
