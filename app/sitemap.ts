import type { MetadataRoute } from "next";
import { sitio } from "@/contenido/sitio";
import { BASE_PATH } from "@/lib/obras";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${sitio.url}${BASE_PATH}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
