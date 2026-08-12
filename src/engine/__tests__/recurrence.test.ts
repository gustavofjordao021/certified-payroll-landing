import { describe, it, expect } from "vitest";
import { CADENCES, nextDueDate, FilingCadence } from "../schedule/recurrence";

const weekly = CADENCES[0];
const cadence = (rrule: FilingCadence["rrule"]): FilingCadence => ({ ...weekly, rrule });

describe("nextDueDate — filing cadence math", () => {
  it("weekly: due the Friday after a mid-week date", () => {
    // Wed 2026-08-12 -> Fri 2026-08-14
    expect(nextDueDate(weekly, new Date("2026-08-12T12:00:00"))).toEqual(new Date("2026-08-14T12:00:00"));
  });

  it("weekly: a Friday rolls to the NEXT Friday, never same-day", () => {
    expect(nextDueDate(weekly, new Date("2026-08-14T12:00:00"))).toEqual(new Date("2026-08-21T12:00:00"));
  });

  it("weekly: Saturday and Sunday land on the coming Friday", () => {
    expect(nextDueDate(weekly, new Date("2026-08-15T12:00:00"))).toEqual(new Date("2026-08-21T12:00:00"));
    expect(nextDueDate(weekly, new Date("2026-08-16T12:00:00"))).toEqual(new Date("2026-08-21T12:00:00"));
  });

  it("quarterly: first day of the next quarter", () => {
    const due = nextDueDate(cadence("QUARTERLY"), new Date("2026-02-15T12:00:00"));
    expect(due.getFullYear()).toBe(2026);
    expect(due.getMonth()).toBe(3); // April
    expect(due.getDate()).toBe(1);
    const q4 = nextDueDate(cadence("QUARTERLY"), new Date("2026-11-02T12:00:00"));
    expect([q4.getFullYear(), q4.getMonth(), q4.getDate()]).toEqual([2027, 0, 1]);
  });

  it("annual: January 31 of the following year", () => {
    const due = nextDueDate(cadence("ANNUAL"), new Date("2026-08-12T12:00:00"));
    expect([due.getFullYear(), due.getMonth(), due.getDate()]).toEqual([2027, 0, 31]);
  });

  it("does not mutate the input date", () => {
    const from = new Date("2026-08-12T12:00:00");
    nextDueDate(weekly, from);
    expect(from).toEqual(new Date("2026-08-12T12:00:00"));
  });
});
