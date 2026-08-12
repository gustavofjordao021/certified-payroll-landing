import { describe, it, expect } from "vitest";
import { createRateLimiter } from "../rate-limit";

describe("createRateLimiter — fixed window per key", () => {
  function withClock(start = 0) {
    let t = start;
    return { now: () => t, tick: (ms: number) => (t += ms) };
  }

  it("allows up to the limit, then blocks", () => {
    const clock = withClock();
    const limited = createRateLimiter(5, 3600_000, clock.now);
    for (let i = 0; i < 5; i++) expect(limited("1.2.3.4")).toBe(false);
    expect(limited("1.2.3.4")).toBe(true);
  });

  it("resets after the window elapses from the first hit", () => {
    const clock = withClock();
    const limited = createRateLimiter(5, 3600_000, clock.now);
    for (let i = 0; i < 6; i++) limited("ip");
    clock.tick(3600_001);
    expect(limited("ip")).toBe(false);
  });

  it("does not reset mid-window", () => {
    const clock = withClock();
    const limited = createRateLimiter(2, 1000, clock.now);
    limited("ip");
    clock.tick(999);
    limited("ip");
    expect(limited("ip")).toBe(true);
  });

  it("tracks keys independently", () => {
    const clock = withClock();
    const limited = createRateLimiter(1, 1000, clock.now);
    expect(limited("a")).toBe(false);
    expect(limited("b")).toBe(false);
    expect(limited("a")).toBe(true);
  });
});
