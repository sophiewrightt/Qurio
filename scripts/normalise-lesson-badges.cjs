#!/usr/bin/env node
const fs = require('node:fs');
const { PNG } = require('pngjs');

const OUTPUT_SIZE = 256;
const SUBJECT_SIZE = 210;

function boundsOf(png) {
  let left = png.width;
  let top = png.height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < png.height; y += 1) for (let x = 0; x < png.width; x += 1) {
    if (png.data[(y * png.width + x) * 4 + 3] <= 12) continue;
    left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  if (right < left || bottom < top) throw new Error('Image has no visible pixels');
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

function samplePremultiplied(png, x, y) {
  const x0 = Math.max(0, Math.min(png.width - 1, Math.floor(x)));
  const y0 = Math.max(0, Math.min(png.height - 1, Math.floor(y)));
  const x1 = Math.min(png.width - 1, x0 + 1);
  const y1 = Math.min(png.height - 1, y0 + 1);
  const tx = Math.max(0, Math.min(1, x - x0));
  const ty = Math.max(0, Math.min(1, y - y0));
  const points = [[x0, y0, (1 - tx) * (1 - ty)], [x1, y0, tx * (1 - ty)], [x0, y1, (1 - tx) * ty], [x1, y1, tx * ty]];
  let alpha = 0; let red = 0; let green = 0; let blue = 0;
  for (const [px, py, weight] of points) {
    const offset = (py * png.width + px) * 4;
    const a = png.data[offset + 3] / 255;
    alpha += a * weight;
    red += png.data[offset] * a * weight;
    green += png.data[offset + 1] * a * weight;
    blue += png.data[offset + 2] * a * weight;
  }
  return alpha > 0 ? [red / alpha, green / alpha, blue / alpha, alpha * 255] : [0, 0, 0, 0];
}

for (const filename of process.argv.slice(2)) {
  const source = PNG.sync.read(fs.readFileSync(filename));
  const bounds = boundsOf(source);
  const scale = SUBJECT_SIZE / Math.max(bounds.width, bounds.height);
  const width = Math.max(1, Math.round(bounds.width * scale));
  const height = Math.max(1, Math.round(bounds.height * scale));
  const output = new PNG({ width: OUTPUT_SIZE, height: OUTPUT_SIZE, colorType: 6 });
  const offsetX = Math.floor((OUTPUT_SIZE - width) / 2);
  const offsetY = Math.floor((OUTPUT_SIZE - height) / 2);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    const sourceX = bounds.left + ((x + 0.5) / width) * bounds.width - 0.5;
    const sourceY = bounds.top + ((y + 0.5) / height) * bounds.height - 0.5;
    const rgba = samplePremultiplied(source, sourceX, sourceY);
    const target = ((offsetY + y) * OUTPUT_SIZE + offsetX + x) * 4;
    output.data[target] = Math.round(rgba[0]);
    output.data[target + 1] = Math.round(rgba[1]);
    output.data[target + 2] = Math.round(rgba[2]);
    output.data[target + 3] = Math.round(rgba[3]);
  }
  fs.writeFileSync(filename, PNG.sync.write(output));
}
