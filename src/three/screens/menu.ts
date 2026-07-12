import { SW, SH, resetText, wrap } from "./primitives";
import { UI, COVERS, drawButton, drawRule, drawSliderRow, drawCoverArt } from "./widgets";

export function drawMenu(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SW, SH);
  ctx.fillStyle = UI.green;
  ctx.fillRect(0, 0, SW, 4);

  const pad = 24;
  const gap = 18;
  const innerW = SW - 2 * pad;
  let y = pad;

  drawButton(ctx, pad, y, 160, 56, "Library");
  drawButton(ctx, pad + 160 + 12, y, 170, 56, "Reading", { fontSize: 22 });
  ctx.fillStyle = UI.ink;
  ctx.font = "22px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("9:41    78%", SW / 2, y + 28);
  resetText(ctx);
  drawButton(ctx, SW - pad - 56, y, 56, 56, "X", { fontSize: 26 });
  y += 56 + gap;

  drawRule(ctx, pad, y, innerW);
  y += gap;

  y = drawSliderRow(ctx, pad, y, innerW, "Brightness", "50%", 0.5) + gap;
  y = drawSliderRow(ctx, pad, y, innerW, "Speed", "1.0x", 0.5) + gap;
  y = drawSliderRow(ctx, pad, y, innerW, "Font", "36px", (36 - 20) / 40) + gap;
  y = drawSliderRow(ctx, pad, y, innerW, "Volume", "100%", 1.0) + gap;

  drawRule(ctx, pad, y, innerW);
  y += gap;
  drawButton(ctx, pad, y, innerW, 60, "Voice", { value: "Emma (English)", fontSize: 22 });
  y += 60 + gap;

  drawRule(ctx, pad, y, innerW);
  y += gap;
  drawButton(ctx, pad, y, 220, 60, "Home WiFi", { fontSize: 20 });
  drawButton(ctx, pad + 220 + 16, y, 220, 60, "JBL Flip", { fontSize: 20 });
  drawButton(ctx, pad + (220 + 16) * 2, y, innerW - (220 + 16) * 2, 60, "Chapters", {
    fontSize: 22,
  });
  y += 60 + gap;

  drawRule(ctx, pad, y, innerW);

  const coverW = 176;
  const coverH = coverW * 1.4;
  const coverX = SW - pad - coverW;
  const coverY = SH - pad - coverH - 10;
  drawCoverArt(ctx, coverX, coverY, coverW, coverH, COVERS[0]);

  const infoW = coverX - pad - 24;
  let iy = SH - pad - 150;
  ctx.textAlign = "left";
  ctx.fillStyle = UI.ink;
  ctx.font = "700 26px Georgia, serif";
  iy = wrap(ctx, "The Happy Prince", pad, iy, infoW, 32);
  ctx.fillStyle = "#777777";
  ctx.font = "20px Arial, sans-serif";
  ctx.fillText("Oscar Wilde", pad, iy);
  iy += 28;
  ctx.fillStyle = "#333333";
  ctx.font = "20px Arial, sans-serif";
  ctx.fillText("The Selfish Giant", pad, iy);
  iy += 28;
  ctx.fillStyle = "#777777";
  ctx.fillText("Page 7 / 142", pad, iy);
  iy += 28;
  ctx.fillStyle = "#666666";
  ctx.font = "18px Arial, sans-serif";
  wrap(ctx, "swipe: pages - swipe down: menu - double-tap: play", pad, iy, infoW, 24);
  resetText(ctx);
}
