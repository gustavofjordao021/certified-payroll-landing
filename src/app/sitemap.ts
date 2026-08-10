import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://wh347form.com/", changeFrequency: "weekly", priority: 1 },
    { url: "https://wh347form.com/wh-347-generator", changeFrequency: "weekly", priority: 0.9 },
  ];
}
