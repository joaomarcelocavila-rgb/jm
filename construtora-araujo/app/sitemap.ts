import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    { url: site.url, lastModified: agora, changeFrequency: "monthly", priority: 1 },
    ...["construcao", "reforma", "acabamento"].map((slug) => ({
      url: `${site.url}/${slug}`,
      lastModified: agora,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
