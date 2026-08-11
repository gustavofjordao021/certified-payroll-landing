import { describe, it, expect } from "vitest";
import { checksumRow } from "../validation/checksums";
import { reconcile } from "../extraction/agreement";
import { splitDaily, splitName } from "../render/wh347-official";
import { EmployeeRowSchema, EmployeeRow, PayrollExtraction } from "../types";

const row = (overrides: Partial<EmployeeRow> = {}): EmployeeRow => ({
  name: "Miguel Ramirez",
  classification: "Electrician - Journeyman",
  daily_hours: [8, 8, 8, 8, 8, 0, 0],
  reg_hours: 40,
  ot_hours: 0,
  hourly_rate: 50,
  gross_pay: 2000,
  fringe_total: 400,
  ...overrides,
});

describe("splitDaily — federal weekly-OT allocation", () => {
  it("puts everything in ST under 40 hours", () => {
    expect(splitDaily([8, 8, 8, 0, 0, 0, 0])).toEqual({
      st: [8, 8, 8, 0, 0, 0, 0],
      ot: [0, 0, 0, 0, 0, 0, 0],
    });
  });

  it("splits the day that crosses 40 and sends the rest to OT", () => {
    const { st, ot } = splitDaily([8, 8, 8, 10, 9, 0, 0]);
    expect(st).toEqual([8, 8, 8, 10, 6, 0, 0]);
    expect(ot).toEqual([0, 0, 0, 0, 3, 0, 0]);
    expect(st.reduce((a, b) => a + b)).toBe(40);
  });

  it("handles a whole OT day after the budget is spent", () => {
    const { st, ot } = splitDaily([8, 8, 8, 8, 8, 6, 0]);
    expect(st[5]).toBe(0);
    expect(ot[5]).toBe(6);
  });

  it("treats null days as zero and null grids as empty", () => {
    expect(splitDaily([8, null, 8, null, null, null, null]).st).toEqual([8, 0, 8, 0, 0, 0, 0]);
    expect(splitDaily(null)).toEqual({ st: [], ot: [] });
  });
});

describe("splitName — WH-347 name columns", () => {
  it("maps two-part names to first/last", () => {
    expect(splitName("Miguel Ramirez")).toEqual({ first: "Miguel", last: "Ramirez", middle: "" });
  });
  it("uses the second token as middle initial for 3+ parts", () => {
    expect(splitName("D Ray Washington Jr")).toEqual({ first: "D", middle: "R", last: "Washington Jr" });
  });
  it("puts a single token in last name", () => {
    expect(splitName("Cher")).toEqual({ last: "Cher", first: "", middle: "" });
  });
});

describe("checksumRow — deterministic arithmetic net", () => {
  it("passes a consistent row", () => {
    expect(checksumRow(row())).toEqual([]);
  });

  it("catches day-grid misalignment (the spike's silent-error class)", () => {
    // sum 41 vs reg+ot 40 — exactly what a shifted day column produces
    const bad = row({ daily_hours: [8, 8, 8, 8, 9, 0, 0] });
    expect(checksumRow(bad).some((f) => f.includes("daily hours sum"))).toBe(true);
  });

  it("accepts gross anywhere between straight-time and OT-inclusive", () => {
    const withOt = row({ daily_hours: [8, 8, 8, 8, 8, 4, 0], reg_hours: 40, ot_hours: 4, gross_pay: 40 * 50 + 4 * 75 });
    expect(checksumRow(withOt)).toEqual([]);
  });

  it("flags gross outside the band", () => {
    const bad = row({ gross_pay: 950 });
    expect(checksumRow(bad).some((f) => f.includes("gross"))).toBe(true);
  });

  it("abstains when fields are null — no checks on missing data", () => {
    expect(checksumRow(row({ daily_hours: null, gross_pay: null }))).toEqual([]);
  });
});

describe("reconcile — dual-model disagreement detection", () => {
  const extraction = (rows: EmployeeRow[]): PayrollExtraction => ({ company: "Acme", employees: rows });

  it("confirms rows where both models agree and checksums pass", () => {
    const v = reconcile(extraction([row()]), extraction([row()]));
    expect(v.rows[0].status).toBe("confirmed");
    expect(v.rows[0].disagreements).toEqual([]);
  });

  it("flags numeric disagreement and prefers the secondary model's values", () => {
    const primary = extraction([row({ hourly_rate: 50 })]);
    const secondary = extraction([row({ hourly_rate: 52 })]);
    const v = reconcile(primary, secondary);
    expect(v.rows[0].status).toBe("review");
    expect(v.rows[0].disagreements[0].field).toBe("hourly_rate");
    expect(v.rows[0].row.hourly_rate).toBe(52);
  });

  it("flags daily-grid disagreement", () => {
    const secondary = extraction([row({ daily_hours: [0, 8, 8, 8, 8, 8, 0] })]);
    const v = reconcile(extraction([row()]), secondary);
    expect(v.rows[0].disagreements.some((d) => d.field === "daily_hours")).toBe(true);
  });

  it("matches rows by name ignoring case and punctuation", () => {
    const secondary = extraction([row({ name: "MIGUEL   ramirez" })]);
    const v = reconcile(extraction([row()]), secondary);
    expect(v.rows).toHaveLength(1);
    expect(v.rows[0].status).toBe("confirmed");
  });

  it("marks rows seen by only one model for review, both directions", () => {
    const extra = row({ name: "Sarah Chen" });
    const v = reconcile(extraction([row()]), extraction([row(), extra]));
    expect(v.rows).toHaveLength(2);
    expect(v.rows[1].status).toBe("review");
    expect(v.documentWarnings[0]).toContain("Sarah Chen");
    const v2 = reconcile(extraction([row(), extra]), extraction([row()]));
    expect(v2.rows.find((r) => r.row.name === "Sarah Chen")?.status).toBe("review");
  });

  it("a checksum failure alone forces review even when models agree", () => {
    const bad = row({ daily_hours: [8, 8, 8, 8, 9, 0, 0] });
    const v = reconcile(extraction([bad]), extraction([bad]));
    expect(v.rows[0].status).toBe("review");
    expect(v.rows[0].checksumFailures.length).toBeGreaterThan(0);
  });
});

describe("EmployeeRowSchema — transcribe-only contract", () => {
  it("accepts nulls everywhere except name", () => {
    expect(() =>
      EmployeeRowSchema.parse({ name: "X", classification: null, daily_hours: null, reg_hours: null, ot_hours: null, hourly_rate: null, gross_pay: null, fringe_total: null }),
    ).not.toThrow();
  });
  it("rejects a daily grid that is not exactly 7 entries", () => {
    expect(() => EmployeeRowSchema.parse({ ...row(), daily_hours: [8, 8] })).toThrow();
  });
});
