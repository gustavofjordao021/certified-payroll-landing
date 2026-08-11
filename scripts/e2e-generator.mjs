// E2E: fill the free generator in a real browser, download the PDF, verify
// the official WH-347 contains the entered data. Requires a running server:
//   npm run build && npm run start -- -p 3111   (or set BASE_URL)
// and pdftotext (poppler-utils) on PATH.
import { chromium } from "playwright-core";
import { execFileSync } from "child_process";
import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const BASE = process.env.BASE_URL ?? "http://localhost:3111";
const EXECUTABLE = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";

const browser = await chromium.launch({ executablePath: EXECUTABLE, args: ["--no-sandbox"] });
const page = await browser.newPage({ acceptDownloads: true });
await page.goto(`${BASE}/wh-347-generator`, { waitUntil: "networkidle" });

await page.fill('input[placeholder="Contractor name"]', "Valdez Electric Inc");
await page.fill('input[placeholder="Project name"]', "Lincoln Elementary Modernization");
await page.fill('input[type="date"]', "2026-08-09");
await page.fill('input[placeholder="Full name"]', "Miguel Ramirez");
await page.fill('input[placeholder*="classification"]', "Electrician - Journeyman");
for (const d of ["Mon", "Tue", "Wed", "Thu", "Fri"]) await page.fill(`input[placeholder="${d}"]`, "8");
await page.fill('input[placeholder*="hourly rate"]', "58.25");

const [download] = await Promise.all([
  page.waitForEvent("download", { timeout: 30000 }),
  page.click("button.cta:not(.secondary)"),
]);
const out = join(mkdtempSync(join(tmpdir(), "wh347-e2e-")), "out.pdf");
await download.saveAs(out);
await browser.close();

const text = execFileSync("pdftotext", [out, "-"]).toString();
const expected = ["Ramirez", "Miguel", "Electrician", "58.25", "Lincoln Elementary", "Statement of Compliance"];
const missing = expected.filter((e) => !text.includes(e));
if (missing.length) {
  console.error("E2E FAIL — missing from generated PDF:", missing);
  process.exit(1);
}
console.log("E2E PASS — official WH-347 generated with all entered data");
