import { describe, expect, it } from "vitest";
import { fileSizeBucket, nonSensitiveErrorCode, safeFileType } from "../analytics-core";
import { selectVariant } from "../experiments";

describe("analytics helpers", () => {
  it("buckets file sizes without exposing exact bytes", () => {
    expect(fileSizeBucket(500_000)).toBe("<1mb");
    expect(fileSizeBucket(2 * 1024 * 1024)).toBe("1-5mb");
    expect(fileSizeBucket(7 * 1024 * 1024)).toBe("5-10mb");
    expect(fileSizeBucket(12 * 1024 * 1024)).toBe("10mb+");
  });

  it("returns only allowlisted file types", () => {
    expect(safeFileType({ name: "private-payroll.pdf", type: "application/pdf" })).toBe("pdf");
    expect(safeFileType({ name: "private-payroll.exe", type: "application/octet-stream" })).toBe("other");
  });

  it("maps response status to non-sensitive error codes", () => {
    expect(nonSensitiveErrorCode(429)).toBe("rate_limited");
    expect(nonSensitiveErrorCode(500)).toBe("service_error");
  });

  it("assigns deterministic variant buckets from a supplied random value", () => {
    expect(selectVariant(["control", "review_first"], 0.1)).toBe("control");
    expect(selectVariant(["control", "review_first"], 0.8)).toBe("review_first");
  });
});
