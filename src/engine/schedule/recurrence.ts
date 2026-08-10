// Recurrence engine stub — the retention core. Each vertical registers filing
// cadences; the engine owns due-date math, missing-filing detection, and (later)
// notification fan-out. Certified payroll: WEEKLY per active public project,
// including "no work performed" weeks (CA DIR requires them).
export interface FilingCadence {
  verticalId: string;
  label: string;
  rrule: "WEEKLY" | "QUARTERLY" | "ANNUAL";
  graceDays: number;
}

export const CADENCES: FilingCadence[] = [
  { verticalId: "certified-payroll", label: "Weekly certified payroll (WH-347 / eCPR)", rrule: "WEEKLY", graceDays: 7 },
];

export function nextDueDate(cadence: FilingCadence, from: Date): Date {
  const d = new Date(from);
  if (cadence.rrule === "WEEKLY") {
    // due the Friday after the workweek closes
    d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7));
  } else if (cadence.rrule === "QUARTERLY") {
    d.setMonth(Math.floor(d.getMonth() / 3) * 3 + 3, 1);
  } else {
    d.setFullYear(d.getFullYear() + 1, 0, 31);
  }
  return d;
}
