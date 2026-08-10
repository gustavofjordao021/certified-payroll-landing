import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { EmployeeRow } from "../types";

export interface ReportMeta {
  contractor: string;
  address: string;
  projectName: string;
  projectLocation: string;
  payrollNumber: string;
  weekEnding: string; // ISO date
}

// v0 renderer: a clean certified-payroll report in WH-347 column structure,
// plus the Statement of Compliance page. Pixel-perfect official WH-347
// AcroForm fill (from DOL's fillable PDF) is the planned v1 upgrade — this
// layout carries the same data columns in the same order.
export async function renderPayrollReport(meta: ReportMeta, rows: EmployeeRow[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([842, 595]); // landscape A4-ish
  const { height } = page.getSize();

  const draw = (text: string, x: number, y: number, size = 8, f = font) =>
    page.drawText(text ?? "", { x, y, size, font: f, color: rgb(0.07, 0.07, 0.07) });

  draw("CERTIFIED PAYROLL REPORT (WH-347 format)", 30, height - 36, 13, bold);
  draw(`Contractor: ${meta.contractor}`, 30, height - 56, 9);
  draw(`Address: ${meta.address}`, 30, height - 68, 9);
  draw(`Project: ${meta.projectName} — ${meta.projectLocation}`, 30, height - 80, 9);
  draw(`Payroll No: ${meta.payrollNumber}   Week ending: ${meta.weekEnding}`, 30, height - 92, 9);

  const days = ["M", "T", "W", "Th", "F", "S", "Su"];
  const cols = [
    { label: "Name", x: 30, w: 130 },
    { label: "Classification", x: 160, w: 130 },
    ...days.map((d, i) => ({ label: d, x: 290 + i * 28, w: 28 })),
    { label: "Reg", x: 490, w: 40 },
    { label: "OT", x: 530, w: 40 },
    { label: "Rate", x: 570, w: 55 },
    { label: "Gross", x: 625, w: 65 },
    { label: "Fringe", x: 690, w: 65 },
  ];
  let y = height - 118;
  for (const c of cols) draw(c.label, c.x, y, 8, bold);
  y -= 6;
  page.drawLine({ start: { x: 30, y }, end: { x: 790, y }, thickness: 0.7, color: rgb(0.3, 0.3, 0.3) });
  y -= 14;

  for (const e of rows) {
    draw(e.name, 30, y);
    draw(e.classification ?? "", 160, y);
    (e.daily_hours ?? []).forEach((h, i) => draw(h ? String(h) : "", 290 + i * 28, y));
    draw(e.reg_hours != null ? e.reg_hours.toFixed(1) : "", 490, y);
    draw(e.ot_hours != null ? e.ot_hours.toFixed(1) : "", 530, y);
    draw(e.hourly_rate != null ? `$${e.hourly_rate.toFixed(2)}` : "", 570, y);
    draw(e.gross_pay != null ? `$${e.gross_pay.toFixed(2)}` : "", 625, y);
    draw(e.fringe_total != null ? `$${e.fringe_total.toFixed(2)}` : "", 690, y);
    y -= 16;
    if (y < 60) break; // v0: single page
  }

  const p2 = doc.addPage([595, 842]);
  const d2 = (text: string, x: number, y2: number, size = 9, f = font) =>
    p2.drawText(text, { x, y: y2, size, font: f, color: rgb(0.07, 0.07, 0.07) });
  d2("STATEMENT OF COMPLIANCE", 40, 790, 12, bold);
  d2(`Date: ${meta.weekEnding}`, 40, 766);
  d2(`I, ____________________________, ${meta.contractor}, do hereby state:`, 40, 744);
  d2("(1) That I pay or supervise the payment of the persons employed by the above contractor on the", 40, 722);
  d2(`${meta.projectName}; that during the payroll period commencing on the week ending ${meta.weekEnding},`, 40, 710);
  d2("all persons employed on said project have been paid the full weekly wages earned, that no rebates have", 40, 698);
  d2("been or will be made either directly or indirectly to or on behalf of said contractor from the full weekly", 40, 686);
  d2("wages earned by any person, and that no deductions have been made either directly or indirectly from the", 40, 674);
  d2("full wages earned by any person, other than permissible deductions as defined in Regulations, Part 3.", 40, 662);
  d2("Signature: ______________________________    Title: ______________________", 40, 600);
  d2("THE WILLFUL FALSIFICATION OF ANY OF THE ABOVE STATEMENTS MAY SUBJECT THE CONTRACTOR OR", 40, 560, 7);
  d2("SUBCONTRACTOR TO CIVIL OR CRIMINAL PROSECUTION. SEE SECTION 1001 OF TITLE 18 AND SECTION 231 OF TITLE 31.", 40, 550, 7);

  return doc.save();
}
