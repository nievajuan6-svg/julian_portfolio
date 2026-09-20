import type { MetadataRoute } from "next";
import { sitio } from "@/contenido/sitio";
import { BASE_PATH } from "@/lib/obras";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${sitio.url}${BASE_PATH}/sitemap.xml` };
}
