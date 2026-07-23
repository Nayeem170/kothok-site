import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCREEN_ORDER, SCREEN_STATES } from "./Device";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Device carousel", () => {
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

  it("carousel always starts at index 0 (splash)", () => {
    expect(SCREEN_ORDER[0].state).toBe("splash");
  });
});

describe("Device carousel regression: reducedMotion must NOT freeze carousel", () => {
  const src = fs.readFileSync(path.resolve(__dirname, "Device.tsx"), "utf-8");
  const lines = src.split("\n");

  it("carousel advance line must not be gated on reducedMotion", () => {
    const carouselGate = lines.find((l: string) =>
      l.includes("elapsed >= def.dwell"),
    );
    expect(carouselGate).toBeDefined();
    expect(carouselGate).not.toContain("reducedMotion");
  });

  it("activeIdx initial value is always 0, not reducedMotion-dependent", () => {
    const initMatch = src.match(/activeIdx = useRef\(([^)]+)\)/);
    expect(initMatch).not.toBeNull();
    expect(initMatch![1].trim()).toBe("0");
  });

  it("float and sway remain gated on reducedMotion", () => {
    const floatBlock = lines.findIndex(
      (l: string) => l.includes("position.y") && l.includes("FLOAT_SPEED"),
    );
    const swayBlock = lines.findIndex(
      (l: string) => l.includes("rotation.z") && l.includes("SWAY_SPEED"),
    );
    if (floatBlock >= 0) {
      const surrounding = lines.slice(Math.max(0, floatBlock - 2), floatBlock + 1).join("\n");
      expect(surrounding).toContain("reducedMotion");
    }
    if (swayBlock >= 0) {
      const surrounding = lines.slice(Math.max(0, swayBlock - 2), swayBlock + 1).join("\n");
      expect(surrounding).toContain("reducedMotion");
    }
  });
});
