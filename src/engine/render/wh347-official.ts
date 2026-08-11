import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { EmployeeRow } from "../types";
import type { ReportMeta } from "./payroll-report";

// Overlay renderer for the OFFICIAL DOL WH-347 (Rev. January 2025, flat PDF —
// no AcroForm fields). Coordinates derived from the form's own text positions
// (pdfjs extraction) and verified visually. Page size 792x612 landscape.
//
// Row bands (8 worker rows, ST/OT sub-rows) — baseline y for text:
const ROWS = [
  { st: 321.0, ot: 307.7 },
  { st: 292.7, ot: 279.2 },
  { st: 264.7, ot: 251.6 },
  { st: 236.8, ot: 222.7 },
  { st: 207.8, ot: 193.8 },
  { st: 178.9, ot: 165.0 },
  { st: 151.0, ot: 137.0 },
  { st: 123.1, ot: 109.2 },
];

const COLS = {
  entryNo: 48,
  lastName: 86,
  firstName: 136,
  middleInit: 174,
  idNo: 202,
  apprentice: 236,
  classification: 276,
  dayGridLeft: 343.5, // first day-cell text x (7 cells, verified visually)
  dayCellW: 14.4,
  totalHours: 441,
  rate: 478,
  fringeCredit: 505,
  cashInLieu: 532,
  grossProject: 556,
  grossAll: 585,
  net: 729,
};

const HEADER = {
  row1Y: 466, // values under PROJECT NAME / PROJECT NO / CPR NO / BUSINESS NAME labels (labels at y=482)
  row2Y: 434, // values under LOCATION / WAGE DET NO / WEEK ENDING / ADDRESS (labels at y=451)
  projectX: 48,
  projectNoX: 203,
  cprNoX: 349,
  businessX: 447,
  checkboxPrimeX: 434.5,
  checkboxSubX: 578.5,
  checkboxY: 500.5,
  dayLettersY: 381,
  dateDigitsY: 370,
};

export interface OfficialMeta extends ReportMeta {
  isSubcontractor?: boolean;
  wageDeterminationNo?: string;
}

function splitName(full: string): { last: string; first: string; middle: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { last: parts[0], first: "", middle: "" };
  if (parts.length === 2) return { first: parts[0], last: parts[1], middle: "" };
  return { first: parts[0], middle: parts[1][0] ?? "", last: parts.slice(2).join(" ") };
}

// Allocate daily hours into ST/OT per federal weekly-overtime convention:
// straight time until the 40-hour budget is used, remainder is OT.
function splitDaily(daily: (number | null)[] | null, regBudget = 40) {
  const st: number[] = [], ot: number[] = [];
  let budget = regBudget;
  for (const h0 of daily ?? []) {
    const h = h0 ?? 0;
    const s = Math.min(h, budget);
    budget -= s;
    st.push(s);
    ot.push(+(h - s).toFixed(2));
  }
  return { st, ot };
}

export async function renderOfficialWH347(
  templateBytes: Uint8Array | ArrayBuffer,
  meta: OfficialMeta,
  rows: EmployeeRow[],
): Promise<Uint8Array> {
  const template = await PDFDocument.load(templateBytes);
  const out = await PDFDocument.create();
  const font = await out.embedFont(StandardFonts.Helvetica);

  const pagesNeeded = Math.max(1, Math.ceil(rows.length / ROWS.length));
  for (let p = 0; p < pagesNeeded; p++) {
    const [page1] = await out.copyPages(template, [0]);
    out.addPage(page1);
    const draw = (text: string, x: number, y: number, size = 6.5) =>
      text && page1.drawText(text, { x, y, size, font, color: rgb(0.05, 0.05, 0.3) });

    // header
    draw("X", meta.isSubcontractor ? HEADER.checkboxSubX : HEADER.checkboxPrimeX, HEADER.checkboxY, 8);
    draw(meta.projectName, HEADER.projectX, HEADER.row1Y, 7);
    draw(String(p + 1) === "1" ? meta.payrollNumber : `${meta.payrollNumber} (p${p + 1})`, HEADER.cprNoX, HEADER.row1Y, 7);
    draw(meta.contractor, HEADER.businessX, HEADER.row1Y, 7);
    draw(meta.projectLocation, HEADER.projectX, HEADER.row2Y, 7);
    draw(meta.wageDeterminationNo ?? "", HEADER.projectNoX, HEADER.row2Y, 7);
    draw(meta.weekEnding, HEADER.cprNoX, HEADER.row2Y, 7);
    draw(meta.address, HEADER.businessX, HEADER.row2Y, 7);

    // day-of-week letters + dates from weekEnding (Mon..Sun, weekEnding = Sunday? we
    // treat weekEnding as the last day of a Mon-start week)
    const end = new Date(meta.weekEnding + "T00:00:00");
    if (!isNaN(end.getTime())) {
      const letters = ["M", "T", "W", "T", "F", "S", "S"];
      for (let d = 0; d < 7; d++) {
        const date = new Date(end);
        date.setDate(end.getDate() - (6 - d));
        const x = COLS.dayGridLeft + d * COLS.dayCellW;
        draw(letters[d], x, HEADER.dayLettersY, 6);
        draw(String(date.getDate()), x, HEADER.dateDigitsY, 5.5);
      }
    }

    // worker rows
    const slice = rows.slice(p * ROWS.length, (p + 1) * ROWS.length);
    slice.forEach((e, i) => {
      const band = ROWS[i];
      const { last, first, middle } = splitName(e.name);
      draw(String(p * ROWS.length + i + 1), COLS.entryNo, band.st);
      draw(last.slice(0, 14), COLS.lastName, band.st);
      draw(first.slice(0, 10), COLS.firstName, band.st);
      draw(middle, COLS.middleInit, band.st);
      const cls = e.classification ?? "";
      let line1 = cls, line2 = "";
      if (cls.length > 16) {
        const cut = cls.lastIndexOf(" ", 16);
        line1 = cls.slice(0, cut > 4 ? cut : 16);
        line2 = cls.slice(cut > 4 ? cut + 1 : 16, cut > 4 ? cut + 18 : 32);
      }
      draw(line1, COLS.classification, band.st, 5);
      draw(line2, COLS.classification, band.ot, 5);

      const { st, ot } = splitDaily(e.daily_hours);
      st.forEach((h, d) => h > 0 && draw(String(h), COLS.dayGridLeft + d * COLS.dayCellW, band.st, 6));
      ot.forEach((h, d) => h > 0 && draw(String(h), COLS.dayGridLeft + d * COLS.dayCellW, band.ot, 6));

      if (e.reg_hours != null) draw(e.reg_hours.toFixed(1), COLS.totalHours, band.st);
      if (e.ot_hours != null && e.ot_hours > 0) draw(e.ot_hours.toFixed(1), COLS.totalHours, band.ot);
      if (e.hourly_rate != null) {
        draw(e.hourly_rate.toFixed(2), COLS.rate, band.st);
        if (e.ot_hours != null && e.ot_hours > 0) draw((e.hourly_rate * 1.5).toFixed(2), COLS.rate, band.ot);
      }
      if (e.fringe_total != null) draw(e.fringe_total.toFixed(2), COLS.fringeCredit, band.st);
      if (e.gross_pay != null) draw(e.gross_pay.toFixed(2), COLS.grossProject, band.st, 6);
    });
  }

  // append the untouched Statement of Compliance (page 2) for signing
  const [page2] = await out.copyPages(template, [1]);
  out.addPage(page2);

  return out.save();
}
