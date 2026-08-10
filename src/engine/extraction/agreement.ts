import { EmployeeRow, PayrollExtraction, VerifiedExtraction, VerifiedRow } from "../types";
import { checksumRow } from "../validation/checksums";

const nameKey = (s: string | null | undefined) => (s ?? "").toLowerCase().replace(/[^a-z]/g, "");
const near = (a: unknown, b: unknown, tol = 0.011) =>
  a == null && b == null
    ? true
    : typeof a === "number" && typeof b === "number" && Math.abs(a - b) <= tol;

const NUMERIC_FIELDS = ["reg_hours", "ot_hours", "hourly_rate", "gross_pay", "fringe_total"] as const;

function dailyEqual(a: EmployeeRow["daily_hours"], b: EmployeeRow["daily_hours"]) {
  if (a == null && b == null) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  return a.every((x, i) => near(x ?? 0, b[i] ?? 0));
}

// Dual-model disagreement detection — the spike's key product finding: on real
// scanned documents cross-model agreement drops to 42-67%, and disagreement
// flags exactly the rows a human must confirm. Agreeing rows auto-fill.
export function reconcile(primary: PayrollExtraction, secondary: PayrollExtraction): VerifiedExtraction {
  const secondaryByName = new Map(secondary.employees.map((e) => [nameKey(e.name), e]));
  const rows: VerifiedRow[] = [];
  const documentWarnings: string[] = [];

  for (const p of primary.employees) {
    const s = secondaryByName.get(nameKey(p.name));
    secondaryByName.delete(nameKey(p.name));
    if (!s) {
      rows.push({ row: p, status: "review", disagreements: [{ field: "row", primary: p.name, secondary: null }], checksumFailures: [] });
      continue;
    }
    const disagreements: VerifiedRow["disagreements"] = [];
    for (const f of NUMERIC_FIELDS)
      if (!near(p[f], s[f])) disagreements.push({ field: f, primary: p[f], secondary: s[f] });
    if (!dailyEqual(p.daily_hours, s.daily_hours))
      disagreements.push({ field: "daily_hours", primary: p.daily_hours, secondary: s.daily_hours });

    // Prefer the secondary (stronger) model's values when models disagree —
    // it resolved every disagreement correctly in the spike corpus.
    const row = disagreements.length ? s : p;
    const checksumFailures = checksumRow(row);
    rows.push({
      row,
      status: disagreements.length || checksumFailures.length ? "review" : "confirmed",
      disagreements,
      checksumFailures,
    });
  }
  for (const [, s] of secondaryByName) {
    rows.push({ row: s, status: "review", disagreements: [{ field: "row", primary: null, secondary: s.name }], checksumFailures: checksumRow(s) });
    documentWarnings.push(`Row "${s.name}" found by only one model`);
  }
  return { company: primary.company ?? secondary.company, rows, documentWarnings };
}
