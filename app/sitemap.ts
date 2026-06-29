import type { MetadataRoute } from "next";

import { docSlugs } from "@/lib/docs";
import { Locale, locales } from "@/lib/i18n-core";
import { absoluteUrl, alternateLanguages, localizedPath, publicSeoPaths } from "@/lib/seo";

const docPaths = docSlugs.map((slug) => `/docs/${slug}`);

function sitemapEntry(locale: Locale, path: string, lastModified: Date): MetadataRoute.Sitemap[number] {
  const priority = path === "/" ? 1 : path.startsWith("/docs/") ? 0.65 : 0.8;

  return {
    url: absoluteUrl(localizedPath(locale, path)),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
    alternates: {
      languages: alternateLanguages(path)
    }
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const paths = [...publicSeoPaths, ...docPaths];

  return paths.flatMap((path) => locales.map((locale) => sitemapEntry(locale, path, lastModified)));
}
