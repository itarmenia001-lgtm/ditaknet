import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/hy", "/en", "/ru"],
        disallow: [
          "/api/",
          "/*/admin/",
          "/*/account/",
          "/*/login",
          "/*/logout",
          "/*/register",
          "/*/support/tickets/"
        ]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
