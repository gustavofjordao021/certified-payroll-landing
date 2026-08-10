import { z } from "zod";

// Core extraction schema — validated by the 2026-08-06 spike
// (research/opportunity-scout/extraction-spike). Transcribe-only contract:
// null means "not printed in the source document", never "unknown".
export const EmployeeRowSchema = z.object({
  name: z.string(),
  classification: z.string().nullable(),
  daily_hours: z.array(z.number().nullable()).length(7).nullable(), // Mon..Sun
  reg_hours: z.number().nullable(),
  ot_hours: z.number().nullable(),
  hourly_rate: z.number().nullable(),
  gross_pay: z.number().nullable(),
  fringe_total: z.number().nullable(),
});
export type EmployeeRow = z.infer<typeof EmployeeRowSchema>;

export const PayrollExtractionSchema = z.object({
  company: z.string().nullable(),
  employees: z.array(EmployeeRowSchema),
});
export type PayrollExtraction = z.infer<typeof PayrollExtractionSchema>;

// Row-level trust classification produced by the dual-model agreement pass.
// "confirmed" rows auto-fill; "review" rows go to the verify screen with the
// competing values; "abstained" rows had no extractable data.
export interface VerifiedRow {
  row: EmployeeRow;
  status: "confirmed" | "review" | "abstained";
  disagreements: { field: string; primary: unknown; secondary: unknown }[];
  checksumFailures: string[];
}

export interface VerifiedExtraction {
  company: string | null;
  rows: VerifiedRow[];
  documentWarnings: string[];
}
