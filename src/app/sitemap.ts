import { MetadataRoute } from "next";
// import {
//   getAllPropertyIds,
//   getAllCarIds,
//   getAllTourIds,
//   getAllBlogIds,
// } from "@/services/ssgDataService";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tenerifly.io";

  // // Получаем все ID для динамических страниц
  // const [propertyIds, carIds, tourIds, blogIds] = await Promise.all([
  //   getAllPropertyIds(),
  //   getAllCarIds(),
  //   getAllTourIds(),
  //   getAllBlogIds(),
  // ]);

  // Основные страницы для всех языков
  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/apartments`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cars`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  // Языковые версии основных страниц
  const languages = ["en", "ru", "pl", "fr", "uk", "de", "es"];
  const languagePages = languages.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // // Динамические страницы апартаментов
  // const propertyPages = propertyIds.map((id) => ({
  //   url: `${baseUrl}/apartments/${id}`,
  //   lastModified: new Date(),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.7,
  // }));

  // // Динамические страницы автомобилей
  // const carPages = carIds.map((id) => ({
  //   url: `${baseUrl}/cars/${id}`,
  //   lastModified: new Date(),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.7,
  // }));

  // // Динамические страницы экскурсий
  // const tourPages = tourIds.map((id) => ({
  //   url: `${baseUrl}/tours/${id}`,
  //   lastModified: new Date(),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.7,
  // }));

  // // Динамические страницы блогов
  // const blogPages = blogIds.map((id) => ({
  //   url: `${baseUrl}/blog/${id}`,
  //   lastModified: new Date(),
  //   changeFrequency: "monthly" as const,
  //   priority: 0.6,
  // }));

  return [
    ...mainPages,
    ...languagePages,
    // ...propertyPages,
    // ...carPages,
    // ...tourPages,
    // ...blogPages,
  ];
}
