import { SW, SH, wrap } from "./primitives";
import { UI, drawFooter } from "./widgets";

const BODY = [
  "One night there flew over the city a little Swallow. His friends had gone away to Egypt six weeks before, but he had stayed behind, for he was in love with the most beautiful Reed.",
  "He had met her early in the spring as he was flying down the river after a big yellow moth, and had been so attracted by her slender waist that he had stopped to talk to her.",
  "“Shall I love you?” said the Swallow, who liked to come to the point at once, and the Reed made him a low bow. So he flew round and round her, and made silver ripples.",
];

export function drawReading(ctx: CanvasRenderingContext2D, playing: boolean) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SW, SH);
  const padX = 64;
  let y = 70;
  ctx.fillStyle = UI.ink;
  ctx.font = "700 58px Georgia, serif";
  y = wrap(ctx, "The Happy Prince", padX, y, SW - 2 * padX, 66);
  y += 4;
  ctx.fillStyle = UI.muted;
  ctx.font = "italic 30px Georgia, serif";
  ctx.fillText("Oscar Wilde", padX, y);
  y += 34 + 30;
  ctx.fillStyle = UI.ink;
  ctx.font = "34px Georgia, serif";
  for (const p of BODY) {
    y = wrap(ctx, p, padX, y, SW - 2 * padX, 52);
    y += 26;
  }
  drawFooter(ctx, playing, playing ? "Reading aloud · 2:14" : "Page 7 of 142");
}
