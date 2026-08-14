// Generates public/llms-full.txt — the whole site's content as one markdown
// file (companion to llms.txt) — by fetching every route from a running
// build, so it can never drift from the published pages.
//   npm run build && npx next start -p 3111 &   then: node scripts/make-llms-full.mjs
import { writeFileSync } from "fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3111";
const ROUTES = [
  "/", "/wh-347-form", "/wh-347-generator", "/try",
  "/certified-payroll-report", "/how-to-fill-out-wh-347",
  "/california-dir-ecpr", "/certified-payroll-texas",
  "/prevailing-wage-payroll", "/certified-payroll-excel-template",
  "/for/quickbooks", "/for/adp", "/for/gusto", "/lcptracker-alternatives",
];

function htmlToMarkdown(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? html;
  return main
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, "\n# $1\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, "\n## $1\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, "\n### $1\n")
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) =>
      `[${text}](${href.startsWith("/") ? "https://www.wh347form.com" + href : href})`)
    .replace(/<li[^>]*>/g, "\n- ")
    .replace(/<\/(p|div|li|tr|fieldset|legend)>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&rsquo;|&#x27;/g, "'").replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&hellip;/g, "…").replace(/&ndash;/g, "–").replace(/&mdash;/g, "—").replace(/&times;/g, "×")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

let out = `# WH347form.com — full site content\n\nGenerated from the published pages. Index: https://www.wh347form.com/llms.txt\n`;
for (const route of ROUTES) {
  const res = await fetch(BASE + route);
  if (!res.ok) { console.error(`SKIP ${route}: ${res.status}`); continue; }
  const title = (await res.text().then((html) => {
    out += `\n\n---\n\nURL: https://www.wh347form.com${route === "/" ? "" : route}\n\n${htmlToMarkdown(html)}\n`;
    return html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? route;
  }));
  console.log(`ok ${route} (${title})`);
}
writeFileSync("public/llms-full.txt", out);
console.log(`wrote public/llms-full.txt (${out.length} chars)`);
