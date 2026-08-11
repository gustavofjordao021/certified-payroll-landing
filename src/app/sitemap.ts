import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.wh347form.com/", changeFrequency: "weekly", priority: 1 },
    { url: "https://www.wh347form.com/wh-347-generator", changeFrequency: "weekly", priority: 0.9 },
    { url: "https://www.wh347form.com/california-dir-ecpr", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.wh347form.com/certified-payroll-report", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.wh347form.com/how-to-fill-out-wh-347", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.wh347form.com/certified-payroll-excel-template", changeFrequency: "monthly", priority: 0.7 },
  ];
}
