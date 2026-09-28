// Reproducible crops of supplied artwork; no redrawing or per-frame resizing.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const { PNG } = require('pngjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'assets/module-3/refinements');
const read = p => PNG.sync.read(fs.readFileSync(path.join(root, p)));
function crop(src, x, y, width, height) {
  const out = new PNG({ width, height });
  for (let row = 0; row < height; row++) for (let col = 0; col < width; col++) {
    if (x + col < src.width && y + row < src.height) {
      const i = ((y + row) * src.width + x + col) * 4;
      src.data.copy(out.data, (row * width + col) * 4, i, i + 4);
    }
  }
  return out;
}
const save = (name, png) => fs.writeFileSync(path.join(output, name + '.png'), PNG.sync.write(png));
save('barb-spin-down-no-name', crop(read('assets/module-3/lesson-3-all-entangled-up/barb_with_box_spin_down-transparent.png'), 10, 110, 710, 675));
save('secret-key', crop(read('assets/module-3/lesson-7-qkd/key-transparent.png'), 820, 15, 205, 195));
// Same origin and canvas keep the people and box bases fixed when A opens.
for (const [name, file] of [['room-closed', 'closed'], ['room-open', 'alex-up']]) {
  save(name, crop(read(`assets/module-3/lesson-3-all-entangled-up/alex-barb-room-${file}-transparent.png`), 0, 0, 1174, 699));
}
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'qurio-celebration-'));
const converted = path.join(temp, 'strange.png');
execFileSync('sips', ['-s', 'format', 'png', path.join(output, 'source/strange_celebrating.jpg'), '--out', converted], { stdio: 'ignore' });
const source = PNG.sync.read(fs.readFileSync(converted));
const scale = source.width / 1600;
const out = crop(source, Math.round(470 * scale), Math.round(370 * scale), Math.round(510 * scale), Math.round(625 * scale));
// Remove connected exterior paper only, preserving enclosed white details.
const visited = new Uint8Array(out.width * out.height), queue = [];
function visit(p) {
  if (visited[p] || Math.min(...out.data.subarray(p * 4, p * 4 + 3)) < 235) return;
  visited[p] = 1; queue.push(p);
}
for (let x = 0; x < out.width; x++) { visit(x); visit((out.height - 1) * out.width + x); }
for (let y = 0; y < out.height; y++) { visit(y * out.width); visit(y * out.width + out.width - 1); }
for (let i = 0; i < queue.length; i++) {
  const p = queue[i], x = p % out.width, y = Math.floor(p / out.width);
  if (x) visit(p - 1); if (x + 1 < out.width) visit(p + 1);
  if (y) visit(p - out.width); if (y + 1 < out.height) visit(p + out.width);
}
visited.forEach((v, p) => { if (v) out.data[p * 4 + 3] = 0; });
save('strange-celebrating', out);
