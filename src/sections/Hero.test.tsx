import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("../components/Reveal", () => ({
  Reveal: ({ children }: { children: ReactNode }) => <>{children}</>,
  STAGGER: { lead: 0.05, follow: 0.1, trail: 0.14, late: 0.2 },
}));

vi.mock("../components/SamplePlayer", () => ({
  SamplePlayer: () => <div data-testid="sample-player" />,
}));

vi.mock("../components/DownloadButton", () => ({
  DownloadButton: () => <div data-testid="download-button" />,
}));

vi.mock("../three/HeroStage", () => ({
  HeroStage: () => <div data-testid="hero-stage">3D Canvas</div>,
}));

const { Hero } = await import("./Hero");

const POSTER_ALT = /kitchen/i;

describe("Hero gate", () => {
  it("shows 3D stage when enhanced=true and reducedMotion=true", () => {
    render(<Hero theme="light" reducedMotion={true} enhanced={true} />);
    expect(screen.queryByAltText(POSTER_ALT)).not.toBeInTheDocument();
  });

  it("shows 3D stage when enhanced=true and reducedMotion=false", () => {
    render(<Hero theme="light" reducedMotion={false} enhanced={true} />);
    expect(screen.queryByAltText(POSTER_ALT)).not.toBeInTheDocument();
  });

  it("shows poster when enhanced=false and reducedMotion=true", () => {
    render(<Hero theme="light" reducedMotion={true} enhanced={false} />);
    expect(screen.getByAltText(POSTER_ALT)).toBeInTheDocument();
  });

  it("shows poster when enhanced=false and reducedMotion=false", () => {
    render(<Hero theme="light" reducedMotion={false} enhanced={false} />);
    expect(screen.getByAltText(POSTER_ALT)).toBeInTheDocument();
  });

  it("poster alt text references no-WebGL fallback, not reduced-motion", () => {
    render(<Hero theme="light" reducedMotion={true} enhanced={false} />);
    const img = screen.getByAltText(POSTER_ALT);
    expect(img).toHaveAttribute("loading", "eager");
  });
});

describe("Hero gate regression", () => {
  it("reducedMotion MUST NOT prevent 3D rendering", () => {
    const { container } = render(
      <Hero theme="dark" reducedMotion={true} enhanced={true} />,
    );

    const hasPoster = container.querySelector("img");
    const hasStage = container.querySelector("[data-testid='hero-stage']");

    expect(hasPoster).toBeNull();
    expect(hasStage).not.toBeNull();
  });
});
