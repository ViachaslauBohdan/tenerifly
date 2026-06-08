import type { MetadataRoute } from "next";
import { SEO_HOME } from "@/lib/seo";
import { SITE_BRAND } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const { description } = SEO_HOME.en;
  return {
    name: `${SITE_BRAND} — Tenerife travel`,
    short_name: "Tenerife Joy",
    description,
    start_url: "/en/",
    scope: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#1e4d5c",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
