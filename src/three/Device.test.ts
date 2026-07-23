import { describe, it, expect } from "vitest";
import { SCREEN_ORDER, SCREEN_STATES } from "./Device";

describe("Device carousel", () => {
  const STILL_SCREEN_IDX = SCREEN_ORDER.findIndex((s) => s.state === "reading");

  it("STILL_SCREEN_IDX points to reading, not splash", () => {
    expect(STILL_SCREEN_IDX).toBeGreaterThanOrEqual(0);
    expect(SCREEN_ORDER[STILL_SCREEN_IDX].state).toBe("reading");
    expect(SCREEN_ORDER[0].state).toBe("splash");
    expect(STILL_SCREEN_IDX).not.toBe(0);
  });

  it("reading screen exists in SCREEN_STATES", () => {
    expect([...SCREEN_STATES]).toContain("reading");
  });

  it("all SCREEN_ORDER states exist in SCREEN_STATES", () => {
    for (const entry of SCREEN_ORDER) {
      expect([...SCREEN_STATES]).toContain(entry.state);
    }
  });

  it("all screens have positive dwell time", () => {
    for (const entry of SCREEN_ORDER) {
      expect(entry.dwell).toBeGreaterThan(0);
    }
  });
});
