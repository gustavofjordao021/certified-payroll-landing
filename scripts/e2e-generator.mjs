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
const dir = mkdtempSync(join(tmpdir(), "wh347-e2e-"));
const out = join(dir, "out.pdf");
await download.saveAs(out);

const text = execFileSync("pdftotext", [out, "-"]).toString();
const expected = ["Ramirez", "Miguel", "Electrician", "58.25", "Lincoln Elementary", "Statement of Compliance"];
const missing = expected.filter((e) => !text.includes(e));
if (missing.length) {
  console.error("E2E FAIL — missing from generated PDF:", missing);
  process.exit(1);
}
console.log("E2E PASS — official WH-347 generated with all entered data");

// California eCPR XML path: toggle the CA section, fill the DIR-mandatory
// fields, download the XML and assert the DIR contract essentials.
await page.check('input[type="checkbox"]');
await page.fill('input[placeholder="DIR Project ID"]', "12345");
await page.fill('input[placeholder="License number"]', "1088999");
await page.fill('input[placeholder="PWCR registration #"]', "1000012345");
await page.fill('input[placeholder="FEIN"]', "941234567");
await page.fill('input[placeholder="Workers\' comp insurance #"]', "WC-778");
await page.fill('input[placeholder="Contractor email"]', "office@valdezelectric.com");
await page.fill('input[placeholder="Business street"]', "44 Mission St");
await page.fill('input[placeholder="SSN (eCPR only)"]', "111-22-3333");
await page.fill('input[placeholder="Home street"]', "33 Elm Ave");
const [xmlDownload] = await Promise.all([
  page.waitForEvent("download", { timeout: 15000 }),
  page.click('button:has-text("Download eCPR XML")'),
]);
const xmlOut = join(dir, "out.xml");
await xmlDownload.saveAs(xmlOut);
await browser.close();

const xml = (await import("fs")).readFileSync(xmlOut, "utf8");
const xmlExpected = [
  '<CPR:eCPR xmlns:CPR="http://www.dir.ca.gov/dlse/CPR-Prod-Test/CPR.xsd">',
  '<CPR:name id="111223333::MIGUEL RAMIREZ">Miguel Ramirez</CPR:name>',
  "<CPR:projectID>12345</CPR:projectID>",
  "<CPR:payrollNum></CPR:payrollNum>",
  "<CPR:forWeekEnding>2026-08-09</CPR:forWeekEnding>",
  "<CPR:hrlyPayRateStraightTime>58.25</CPR:hrlyPayRateStraightTime>",
];
const xmlMissing = xmlExpected.filter((e) => !xml.includes(e));
if (xmlMissing.length) {
  console.error("E2E FAIL — missing from eCPR XML:", xmlMissing);
  process.exit(1);
}
console.log("E2E PASS — California eCPR XML generated with the DIR contract intact");
