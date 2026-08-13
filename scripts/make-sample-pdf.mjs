// Generates public/sample-payroll.pdf — the synthetic weekly timesheet used
// by the "run the sample" button on /try. All data is invented; regenerate
// with: node scripts/make-sample-pdf.mjs
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync } from "fs";

const doc = await PDFDocument.create();
const page = doc.addPage([612, 792]);
const font = await doc.embedFont(StandardFonts.Helvetica);
const bold = await doc.embedFont(StandardFonts.HelveticaBold);
const ink = rgb(0.1, 0.1, 0.12);

const draw = (t, x, y, f = font, s = 9) => page.drawText(String(t), { x, y, size: s, font: f, color: ink });

draw("Weekly Time Sheet - Riverside Library Renovation", 40, 740, bold, 14);
draw("North Fork Builders LLC  ·  Week ending Sunday 08/09/2026  ·  Foreman: C. Delgado", 40, 722, font, 9);

const cols = { name: 40, cls: 170, days: 320, rate: 500, x: 0 };
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let y = 690;
draw("Name", cols.name, y, bold);
draw("Classification", cols.cls, y, bold);
dayNames.forEach((d, i) => draw(d, cols.days + i * 24, y, bold, 8));
draw("Rate", cols.rate, y, bold);
y -= 6;
page.drawLine({ start: { x: 40, y }, end: { x: 572, y }, thickness: 0.7, color: ink });

const crew = [
  ["Marcus Webb", "Laborer - Group 1", [8, 8, 8, 8, 8, 0, 0], 28.5],
  ["Tom Alvarez", "Electrician - Journeyman", [8, 8, 10, 9, 8, 0, 0], 58.25],
  ["Rosa Delgado", "Cement Mason", [8, 8, 8, 6, 8, 0, 0], 41.0],
  ["Vic Okafor", "Plumber - Apprentice 3rd", [8, 8, 8, 8, 4, 0, 0], 33.75],
  ["Dan Kowalski", "Operator - Crane", [10, 10, 8, 8, 8, 4, 0], 67.5],
];
for (const [name, cls, days, rate] of crew) {
  y -= 22;
  draw(name, cols.name, y);
  draw(cls, cols.cls, y, font, 8);
  days.forEach((h, i) => h > 0 && draw(h, cols.days + i * 24 + 3, y));
  draw(`$${rate.toFixed(2)}`, cols.rate, y);
  const total = days.reduce((a, b) => a + b, 0);
  const reg = Math.min(total, 40), ot = Math.max(0, total - 40);
  const gross = reg * rate + ot * rate * 1.5;
  draw(`Total ${total.toFixed(1)} h  (OT ${ot.toFixed(1)})   Gross $${gross.toFixed(2)}`, cols.days, y - 10, font, 7);
  y -= 12;
}

y -= 24;
draw("Hours approved by foreman. Fringe paid to plans per CBA schedule A.", 40, y, font, 8);
draw("SAMPLE DOCUMENT - synthetic data for demonstration. Not a real crew or project.", 40, y - 14, font, 8);

writeFileSync("public/sample-payroll.pdf", await doc.save());
console.log("wrote public/sample-payroll.pdf");
