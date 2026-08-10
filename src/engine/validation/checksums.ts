import { EmployeeRow } from "../types";

// Deterministic arithmetic net. Spike finding: every day-column misalignment
// produced by the cheap model failed the daily-sum checksum — this layer turns
// the dangerous silent-error class into a visible review flag.
// NOTE (spike, real-doc pass): prevailing-wage forms can print rate-plus-fringe
// composites, so gross checks use a tolerant band, not equality.
export function checksumRow(e: EmployeeRow): string[] {
  const failures: string[] = [];

  if (Array.isArray(e.daily_hours) && e.reg_hours != null) {
    const sum = e.daily_hours.reduce<number>((a, b) => a + (b ?? 0), 0);
    const expected = e.reg_hours + (e.ot_hours ?? 0);
    if (Math.abs(sum - expected) > 0.05)
      failures.push(`daily hours sum ${sum} ≠ reg+OT ${expected}`);
  }

  if (e.reg_hours != null && e.hourly_rate != null && e.gross_pay != null) {
    const straight = e.reg_hours * e.hourly_rate;
    const withOt = straight + (e.ot_hours ?? 0) * e.hourly_rate * 1.5;
    // Accept anywhere between straight-time and OT-inclusive plus 1% slack.
    if (e.gross_pay < straight * 0.99 || e.gross_pay > withOt * 1.01)
      failures.push(`gross ${e.gross_pay} outside expected [${straight.toFixed(2)}, ${withOt.toFixed(2)}]`);
  }

  return failures;
}
