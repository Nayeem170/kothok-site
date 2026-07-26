import { describe, it, expect, vi, beforeEach } from "vitest";

const CANVAS_CONTEXT_CALLS: { type: string; lost: boolean }[] = [];

function makeMockCanvas() {
  return {
    getContext: vi.fn((type: string) => {
      if (type === "2d") return null;
      CANVAS_CONTEXT_CALLS.push({ type, lost: false });
      return {
        getExtension: vi.fn((name: string) => {
          if (name === "WEBGL_lose_context") {
            CANVAS_CONTEXT_CALLS.push({ type: `${type}-lost`, lost: true });
            return { loseContext: vi.fn() };
          }
          return null;
        }),
      };
    }),
  };
}

let getSupportsWebGL: () => boolean;

beforeEach(async () => {
  CANVAS_CONTEXT_CALLS.length = 0;

  vi.stubGlobal("WebGLRenderingContext", class {});

  Object.defineProperty(globalThis, "document", {
    value: { createElement: vi.fn(() => makeMockCanvas()) },
    writable: true,
    configurable: true,
  });

  vi.resetModules();
  const mod = await import("../App");
  getSupportsWebGL = mod.supportsWebGL;
});

describe("supportsWebGL", () => {
  it("returns true when webgl2 context is available", () => {
    expect(getSupportsWebGL()).toBe(true);
  });

  it("caches result - second call does not create another canvas", () => {
    getSupportsWebGL();
    const countAfterFirst = CANVAS_CONTEXT_CALLS.length;
    getSupportsWebGL();
    expect(CANVAS_CONTEXT_CALLS.length).toBe(countAfterFirst);
  });

  it("releases the probe context via WEBGL_lose_context", () => {
    getSupportsWebGL();
    const lost = CANVAS_CONTEXT_CALLS.filter((c) => c.lost);
    expect(lost.length).toBeGreaterThanOrEqual(1);
  });

  it("returns false when no WebGL context available", async () => {
    Object.defineProperty(globalThis, "document", {
      value: { createElement: vi.fn(() => ({ getContext: vi.fn(() => null) })) },
      writable: true,
      configurable: true,
    });
    vi.resetModules();
    const mod = await import("../App");
    expect(mod.supportsWebGL()).toBe(false);
  });
});
