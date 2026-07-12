import { SW, SH, resetText } from "./primitives";
import { UI, COVERS, drawCoverArt, drawProgressBar, drawNavBar } from "./widgets";

export function drawLibrary(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SW, SH);
  const cellH = 438;
  const heroY = 10;
  const hero = COVERS[0];
  const covH = 410;
  const covW = 300;
  const covX = 24;
  const covY = heroY + (cellH - covH) / 2;
  drawCoverArt(ctx, covX, covY, covW, covH, hero);

  const textX = covX + covW + 28;
  const textW = SW - 10 - textX - 20;
  ctx.fillStyle = UI.muted;
  ctx.font = "500 28px Arial, sans-serif";
  ctx.fillText("Continue Reading", textX, heroY + 46);

  const barY = heroY + cellH - 56;
  drawProgressBar(ctx, textX, barY, textW - 96, hero.progress);
  ctx.fillStyle = UI.ink;
  ctx.font = "600 28px Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(Math.round(hero.progress * 100) + "%", textX + textW, barY + 8);
  resetText(ctx);

  const cols = 3;
  const gap = 14;
  const padX = 10;
  const availW = SW - 2 * padX;
  const cellW = (availW - (cols - 1) * gap) / cols;
  const thumbH = 300;
  const thumbW = Math.min(thumbH * 0.75, cellW * 0.82);
  const rowPitch = cellH + gap;
  const grid = COVERS.slice(1);
  for (let i = 0; i < grid.length; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const cx = padX + c * (cellW + gap);
    const cy = heroY + (r + 1) * rowPitch;
    const tX = cx + (cellW - thumbW) / 2;
    drawCoverArt(ctx, tX, cy + 4, thumbW, thumbH, grid[i]);
    if (grid[i].progress > 0) {
      drawProgressBar(ctx, cx + 10, cy + 4 + thumbH + 16, cellW - 20, grid[i].progress);
    }
  }
  drawNavBar(ctx);
}
