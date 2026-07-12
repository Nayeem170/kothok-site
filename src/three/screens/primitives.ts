export const SW = 1072;
export const SH = 1448;

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export function resetText(ctx: CanvasRenderingContext2D) {
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

export function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  let line = "";
  let yy = y;
  for (const word of text.split(" ")) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lh;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, yy);
  return yy + lh;
}

export function wrapClamp(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lh: number,
  maxLines: number
): number {
  let line = "";
  let yy = y;
  let n = 1;
  for (const word of text.split(" ")) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(n === maxLines ? line + "..." : line, x, yy);
      if (n === maxLines) return yy + lh;
      line = word;
      yy += lh;
      n++;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, yy);
  return yy + lh;
}

export function centerWrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  topY: number,
  maxW: number,
  lh: number,
  maxLines: number
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  lines.push(line);
  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    const last = shown[maxLines - 1];
    shown[maxLines - 1] = last.slice(0, Math.max(0, last.length - 1)) + "...";
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  let yy = topY;
  for (const ln of shown) {
    ctx.fillText(ln, cx, yy);
    yy += lh;
  }
}
