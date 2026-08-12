import { describe, it, expect } from "vitest";
import { formWorkersToRows, GeneratorWorker } from "../form-to-rows";

const worker = (over: Partial<GeneratorWorker> = {}): GeneratorWorker => ({
  name: "Miguel Ramirez",
  classification: "Electrician - Journeyman",
  daily: ["8", "8", "8", "8", "8", "", ""],
  rate: "50",
  fringe: "",
  ...over,
});

describe("formWorkersToRows — generator form input to EmployeeRow", () => {
  it("computes reg/ot split and OT-inclusive gross", () => {
    const [r] = formWorkersToRows([worker({ daily: ["8", "8", "8", "10", "9", "", ""] })]);
    expect(r.reg_hours).toBe(40);
    expect(r.ot_hours).toBe(3);
    expect(r.gross_pay).toBe(40 * 50 + 3 * 75);
  });

  it("drops workers with a blank name", () => {
    expect(formWorkersToRows([worker({ name: "   " }), worker()])).toHaveLength(1);
  });

  it("treats blank and non-numeric day inputs as zero hours", () => {
    const [r] = formWorkersToRows([worker({ daily: ["8", "", "abc", "8", "", "", ""] })]);
    expect(r.daily_hours).toEqual([8, 0, 0, 8, 0, 0, 0]);
    expect(r.reg_hours).toBe(16);
  });

  it("nulls rate/gross when no rate is given, and fringe when blank", () => {
    const [r] = formWorkersToRows([worker({ rate: "" })]);
    expect(r.hourly_rate).toBeNull();
    expect(r.gross_pay).toBeNull();
    expect(r.fringe_total).toBeNull();
  });

  it("keeps fringe when provided and empty classification becomes null", () => {
    const [r] = formWorkersToRows([worker({ fringe: "12.50", classification: "" })]);
    expect(r.fringe_total).toBe(12.5);
    expect(r.classification).toBeNull();
  });

  it("rounds gross to cents", () => {
    const [r] = formWorkersToRows([worker({ daily: ["7.33", "", "", "", "", "", ""], rate: "33.33" })]);
    expect(r.gross_pay).toBe(+(7.33 * 33.33).toFixed(2));
  });
});
