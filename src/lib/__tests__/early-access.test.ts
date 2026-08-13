import { describe, it, expect } from "vitest";
import { isValidEmail } from "../early-access";

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("office+payroll@valdez-electric.com")).toBe(true);
  });
  it("rejects junk, spaces, missing parts, and non-strings", () => {
    for (const bad of ["", "a", "a@b", "a b@c.com", "@x.com", "a@.com", "a@b.", 42, null, undefined, {}])
      expect(isValidEmail(bad as never)).toBe(false);
  });
  it("rejects absurd lengths", () => {
    expect(isValidEmail("a@" + "b".repeat(260) + ".com")).toBe(false);
  });
});
