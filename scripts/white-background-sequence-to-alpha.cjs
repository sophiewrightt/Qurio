const fs = require('node:fs');
const { PNG } = require('pngjs');

const rawArgs = process.argv.slice(2);
const cropArgument = rawArgs.find(argument => argument.startsWith('--crop='));
const keepSmallComponents = rawArgs.includes('--keep-small');
const args = rawArgs.filter(argument => !argument.startsWith('--crop=') && argument !== '--keep-small');
if (args.length < 4 || args.length % 2 !== 0) {
  throw new Error('Usage: node scripts/white-background-sequence-to-alpha.cjs [--crop=x,y,width,height] input.png output.png [input.png output.png ...]');
}

const frames = [];
for (let index = 0; index < args.length; index += 2) {
  const source = PNG.sync.read(fs.readFileSync(args[index]));
  frames.push({ source, outputPath: args[index + 1], alpha: new Uint8Array(source.width * source.height) });
}

const { width, height } = frames[0].source;
if (frames.some(frame => frame.source.width !== width || frame.source.height !== height)) {
  throw new Error('All animation frames must have matching source dimensions');
}

for (const frame of frames) {
  const { source, alpha } = frame;
  for (let pixel = 0; pixel < alpha.length; pixel += 1) {
    const offset = pixel * 4;
    const distanceFromPaper = Math.max(255 - source.data[offset], 255 - source.data[offset + 1], 255 - source.data[offset + 2]);
    alpha[pixel] = Math.max(0, Math.min(255, Math.round((distanceFromPaper - 4) * 12)));
  }

  if (!keepSmallComponents) {
    const visited = new Uint8Array(alpha.length);
    for (let start = 0; start < alpha.length; start += 1) {
      if (visited[start] || alpha[start] <= 18) continue;
      const component = [];
      const queue = [start];
      visited[start] = 1;
      for (let head = 0; head < queue.length; head += 1) {
        const pixel = queue[head];
        component.push(pixel);
        const x = pixel % width;
        const neighbours = [pixel - 1, pixel + 1, pixel - width, pixel + width];
        for (const neighbour of neighbours) {
          if (neighbour < 0 || neighbour >= alpha.length || visited[neighbour] || alpha[neighbour] <= 18) continue;
          const neighbourX = neighbour % width;
          const neighbourY = Math.floor(neighbour / width);
          const y = Math.floor(pixel / width);
          if (Math.abs(neighbourX - x) + Math.abs(neighbourY - y) !== 1) continue;
          visited[neighbour] = 1;
          queue.push(neighbour);
        }
      }
      if (component.length < 80) component.forEach(pixel => { alpha[pixel] = 0; });
    }
  }
}

let minX;
let minY;
let maxX;
let maxY;
if (cropArgument) {
  const crop = cropArgument.slice('--crop='.length).split(',').map(Number);
  if (crop.length !== 4 || crop.some(value => !Number.isFinite(value))) throw new Error('Crop must be x,y,width,height');
  const [x, y, cropWidth, cropHeight] = crop;
  minX = x;
  minY = y;
  maxX = x + cropWidth - 1;
  maxY = y + cropHeight - 1;
  if (minX < 0 || minY < 0 || maxX >= width || maxY >= height || cropWidth <= 0 || cropHeight <= 0) throw new Error('Crop is outside the source image');
} else {
  minX = width;
  minY = height;
  maxX = -1;
  maxY = -1;
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
  if (maxX < minX || maxY < minY) throw new Error('No artwork found');

  const padding = 28;
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width - 1, maxX + padding);
  maxY = Math.min(height - 1, maxY + padding);
}

for (const { source, outputPath, alpha } of frames) {
  const output = new PNG({ width: maxX - minX + 1, height: maxY - minY + 1 });
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const sourceOffset = (y * width + x) * 4;
      const outputOffset = ((y - minY) * output.width + (x - minX)) * 4;
      output.data[outputOffset] = source.data[sourceOffset];
      output.data[outputOffset + 1] = source.data[sourceOffset + 1];
      output.data[outputOffset + 2] = source.data[sourceOffset + 2];
      output.data[outputOffset + 3] = alpha[y * width + x];
    }
  }
  fs.writeFileSync(outputPath, PNG.sync.write(output));
}
