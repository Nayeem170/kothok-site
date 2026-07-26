import { describe, it, expect } from "vitest";
import { isAllowedImage } from "./photoUpload";

function file(type: string): File {
  return new File(["x"], "f", { type });
}

describe("isAllowedImage", () => {
  it("accepts common image MIME types", () => {
    expect(isAllowedImage(file("image/jpeg"))).toBe(true);
    expect(isAllowedImage(file("image/png"))).toBe(true);
    expect(isAllowedImage(file("image/webp"))).toBe(true);
    expect(isAllowedImage(file("image/gif"))).toBe(true);
  });

  it("rejects SVG even though it starts with image/", () => {
    expect(isAllowedImage(file("image/svg+xml"))).toBe(false);
  });

  it("rejects non-image types", () => {
    expect(isAllowedImage(file("application/pdf"))).toBe(false);
    expect(isAllowedImage(file("text/html"))).toBe(false);
    expect(isAllowedImage(file(""))).toBe(false);
  });

  it("matches case-insensitively", () => {
    expect(isAllowedImage(file("IMAGE/JPEG"))).toBe(true);
    expect(isAllowedImage(file("Image/Svg+Xml"))).toBe(false);
  });
});
