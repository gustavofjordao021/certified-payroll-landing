import type { EmployeeRow } from "@/engine/types";

// Pure mapping from the generator form's string inputs to EmployeeRow —
// extracted from the page component so the reg/OT/gross math is testable.
export interface GeneratorWorker {
  name: string;
  classification: string;
  daily: string[]; // 7 entries, free text
  rate: string;
  fringe: string;
}

export function formWorkersToRows(workers: GeneratorWorker[]): EmployeeRow[] {
  return workers
    .filter((w) => w.name.trim())
    .map((w) => {
      const daily = w.daily.map((d) => (d === "" ? 0 : Number(d) || 0));
      const total = daily.reduce((a, b) => a + b, 0);
      const reg = Math.min(total, 40);
      const ot = Math.max(0, total - 40);
      const rate = Number(w.rate) || 0;
      return {
        name: w.name,
        classification: w.classification || null,
        daily_hours: daily,
        reg_hours: reg,
        ot_hours: ot,
        hourly_rate: rate || null,
        gross_pay: rate ? +(reg * rate + ot * rate * 1.5).toFixed(2) : null,
        fringe_total: w.fringe ? Number(w.fringe) : null,
      };
    });
}
