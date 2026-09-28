const fs = require('node:fs');
const { PNG } = require('pngjs');

const [, , outputDirectory, ...inputPaths] = process.argv;
if (!outputDirectory || inputPaths.length < 2) {
  throw new Error('Usage: node scripts/white-background-frames-to-alpha.cjs output-directory frame-1.png frame-2.png [...]');
}

const sources = inputPaths.map(inputPath => ({
  inputPath,
  image: PNG.sync.read(fs.readFileSync(inputPath)),
}));
const { width, height } = sources[0].image;
if (sources.some(({ image }) => image.width !== width || image.height !== height)) {
  throw new Error('Every frame must use the same source canvas dimensions.');
}

function buildAlpha(source) {
  const alpha = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const distanceFromPaper = Math.max(
        255 - source.data[offset],
        255 - source.data[offset + 1],
        255 - source.data[offset + 2],
      );
      alpha[y * width + x] = Math.max(0, Math.min(255, Math.round((distanceFromPaper - 4) * 12)));
    }
  }

  const visited = new Uint8Array(alpha.length);
  for (let start = 0; start < alpha.length; start += 1) {
    if (visited[start] || alpha[start] <= 18) continue;
    const component = [];
    const queue = [start];
    visited[start] = 1;
    for (let head = 0; head < queue.length; head += 1) {
      const index = queue[head];
      component.push(index);
      const x = index % width;
      const neighbours = [index - 1, index + 1, index - width, index + width];
      for (const neighbour of neighbours) {
        if (neighbour < 0 || neighbour >= alpha.length || visited[neighbour] || alpha[neighbour] <= 18) continue;
        const neighbourX = neighbour % width;
        const neighbourY = Math.floor(neighbour / width);
        if (Math.abs(neighbourX - x) + Math.abs(neighbourY - Math.floor(index / width)) !== 1) continue;
        visited[neighbour] = 1;
        queue.push(neighbour);
      }
    }
    if (component.length < 80) component.forEach(index => { alpha[index] = 0; });
  }
  return alpha;
}

const frames = sources.map(source => ({ ...source, alpha: buildAlpha(source.image) }));
let minX = width;
let minY = height;
let maxX = -1;
let maxY = -1;
for (const { alpha } of frames) {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (alpha[y * width + x] <= 18) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
}
if (maxX < minX || maxY < minY) throw new Error('No artwork found in the supplied frames.');

const padding = 28;
minX = Math.max(0, minX - padding);
minY = Math.max(0, minY - padding);
maxX = Math.min(width - 1, maxX + padding);
maxY = Math.min(height - 1, maxY + padding);
fs.mkdirSync(outputDirectory, { recursive: true });

for (const { inputPath, image, alpha } of frames) {
  const output = new PNG({ width: maxX - minX + 1, height: maxY - minY + 1 });
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const sourceOffset = (y * width + x) * 4;
      const outputOffset = ((y - minY) * output.width + (x - minX)) * 4;
      output.data[outputOffset] = image.data[sourceOffset];
      output.data[outputOffset + 1] = image.data[sourceOffset + 1];
      output.data[outputOffset + 2] = image.data[sourceOffset + 2];
      output.data[outputOffset + 3] = alpha[y * width + x];
    }
  }
  fs.writeFileSync(`${outputDirectory}/${inputPath.split('/').pop()}`, PNG.sync.write(output));
}
