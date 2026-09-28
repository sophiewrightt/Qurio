const fs = require('node:fs');
const { PNG } = require('pngjs');

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  throw new Error('Usage: node scripts/white-background-to-alpha.cjs input.png output.png');
}

const source = PNG.sync.read(fs.readFileSync(inputPath));
const alpha = new Uint8Array(source.width * source.height);
let minX = source.width;
let minY = source.height;
let maxX = -1;
let maxY = -1;

for (let y = 0; y < source.height; y += 1) {
  for (let x = 0; x < source.width; x += 1) {
    const offset = (y * source.width + x) * 4;
    const distanceFromPaper = Math.max(
      255 - source.data[offset],
      255 - source.data[offset + 1],
      255 - source.data[offset + 2],
    );
    const pixelAlpha = Math.max(0, Math.min(255, Math.round((distanceFromPaper - 4) * 12)));
    alpha[y * source.width + x] = pixelAlpha;
    if (pixelAlpha > 18) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
}

// Scanned pages occasionally contain a lone dust mark far from the drawing.
// Remove only tiny disconnected components before measuring the crop, while
// preserving meaningful detached marks such as a question mark's dot.
const visited = new Uint8Array(alpha.length);
for (let start = 0; start < alpha.length; start += 1) {
  if (visited[start] || alpha[start] <= 18) continue;
  const component = [];
  const queue = [start];
  visited[start] = 1;
  for (let head = 0; head < queue.length; head += 1) {
    const index = queue[head];
    component.push(index);
    const x = index % source.width;
    const y = Math.floor(index / source.width);
    const neighbours = [index - 1, index + 1, index - source.width, index + source.width];
    for (const neighbour of neighbours) {
      if (neighbour < 0 || neighbour >= alpha.length || visited[neighbour] || alpha[neighbour] <= 18) continue;
      const neighbourX = neighbour % source.width;
      const neighbourY = Math.floor(neighbour / source.width);
      if (Math.abs(neighbourX - x) + Math.abs(neighbourY - y) !== 1) continue;
      visited[neighbour] = 1;
      queue.push(neighbour);
    }
  }
  if (component.length < 80) component.forEach(index => { alpha[index] = 0; });
}

minX = source.width;
minY = source.height;
maxX = -1;
maxY = -1;
for (let y = 0; y < source.height; y += 1) {
  for (let x = 0; x < source.width; x += 1) {
    if (alpha[y * source.width + x] <= 18) continue;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
}

if (maxX < minX || maxY < minY) throw new Error(`No artwork found in ${inputPath}`);

const padding = 28;
minX = Math.max(0, minX - padding);
minY = Math.max(0, minY - padding);
maxX = Math.min(source.width - 1, maxX + padding);
maxY = Math.min(source.height - 1, maxY + padding);

const output = new PNG({ width: maxX - minX + 1, height: maxY - minY + 1 });
for (let y = minY; y <= maxY; y += 1) {
  for (let x = minX; x <= maxX; x += 1) {
    const sourceOffset = (y * source.width + x) * 4;
    const outputOffset = ((y - minY) * output.width + (x - minX)) * 4;
    const pixelAlpha = alpha[y * source.width + x];
    output.data[outputOffset] = source.data[sourceOffset];
    output.data[outputOffset + 1] = source.data[sourceOffset + 1];
    output.data[outputOffset + 2] = source.data[sourceOffset + 2];
    output.data[outputOffset + 3] = pixelAlpha;
  }
}

fs.writeFileSync(outputPath, PNG.sync.write(output));
