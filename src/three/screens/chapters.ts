import { SW, SH, roundRect, resetText, wrapClamp } from "./primitives";
import { UI, drawButton } from "./widgets";

const CHAPTERS = [
  "The Happy Prince",
  "The Nightingale and the Rose",
  "The Selfish Giant",
  "The Devoted Friend",
  "The Remarkable Rocket",
  "Appendix - Notes",
];

export function drawChapters(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SW, SH);
  const pad = 40;
  ctx.fillStyle = "#000000";
  ctx.font = "700 34px Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("Chapters", pad, 80);
  ctx.textBaseline = "alphabetic";
  drawButton(ctx, SW - pad - 140, 48, 140, 64, "Close");

  const cur = 2;
  let cy = 150;
  for (let i = 0; i < CHAPTERS.length; i++) {
    const isCur = i === cur;
    if (isCur) {
      ctx.fillStyle = UI.green;
      roundRect(ctx, pad - 12, cy - 6, 6, 56, 3);
      ctx.fill();
    }
    ctx.fillStyle = isCur ? UI.green : UI.ink;
    ctx.font = `${isCur ? "600" : "400"} 30px Georgia, serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(String(i + 1).padStart(2, "0"), pad + 14, cy + 24);
    ctx.fillStyle = isCur ? UI.green : UI.ink;
    wrapClamp(ctx, CHAPTERS[i], pad + 90, cy + 24, SW - pad - (pad + 90) - 20, 34, 1);
    ctx.textBaseline = "alphabetic";
    resetText(ctx);
    cy += 84;
  }

  drawButton(ctx, pad, SH - 36 - 84, SW - 2 * pad, 84, "Open", { fontSize: 32 });
}
