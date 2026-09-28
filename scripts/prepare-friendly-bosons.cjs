// Reproducible mechanical crops. Retain the supplied scans and enclosed whites.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const { execFileSync } = require('node:child_process');
const { PNG } = require('pngjs');
const output = path.resolve(__dirname, '../assets/module-4/lesson-5');
const originals = path.join(output, 'source');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'qurio-bosons-'));
fs.mkdirSync(originals, { recursive: true });
const jobs = [
  ['office_building', [470, 470, 925, 1080], 650],
  ['einstein_happy_face', [565, 510, 1020, 880], 420],
  ['photon_being_friendly_', [435, 345, 1280, 1010], 760],
  ['electron_being_unfriendly', [405, 240, 1310, 960], 760],
  ['electron_shells_with_seats', [460, 680, 1000, 1060], 640],
];
for (const [name, box, size] of jobs) {
  const original = path.join(originals, `${name}.jpg`);
  if (!fs.existsSync(original)) fs.copyFileSync(path.join('/Users/sophiewright/Desktop', `${name}.jpg`), original);
  const converted = path.join(temp, `${name}.png`);
  execFileSync('sips', ['-s', 'format', 'png', original, '--out', converted], { stdio: 'ignore' });
  const src = PNG.sync.read(fs.readFileSync(converted)), scale = src.width / 1600;
  const [l,t,r,b] = box.map(n => Math.round(n * scale));
  const png = new PNG({ width: r-l, height: b-t });
  for (let y=0;y<png.height;y++) for (let x=0;x<png.width;x++) {
    const i=((y+t)*src.width+x+l)*4; src.data.copy(png.data,(y*png.width+x)*4,i,i+4);
  }
  const seen = new Uint8Array(png.width*png.height), queue=[];
  const glow = name === 'photon_being_friendly_' || name === 'electron_being_unfriendly';
  const visit = p => {
    if (p<0 || p>=seen.length || seen[p]) return;
    const i=p*4;
    if (Math.min(...png.data.subarray(i,i+3))>(glow ? 70 : 238)) { seen[p]=1; queue.push(p); }
  };
  for(let x=0;x<png.width;x++){visit(x);visit((png.height-1)*png.width+x);}
  for(let y=0;y<png.height;y++){visit(y*png.width);visit(y*png.width+png.width-1);}
  for(let h=0;h<queue.length;h++){
    const p=queue[h],x=p%png.width,y=Math.floor(p/png.width);
    if(x)visit(p-1);if(x+1<png.width)visit(p+1);if(y)visit(p-png.width);if(y+1<png.height)visit(p+png.width);
  }
  seen.forEach((v,p)=>{
    if(!v)return;
    const i=p*4;
    if(!glow){png.data[i+3]=0;return;}
    // Unmatte the exterior glow from white. Closed black speech-bubble outlines
    // keep their white paper; colour halos fade smoothly on the cream page.
    const white=Math.min(...png.data.subarray(i,i+3));
    const alpha=white>249?0:255-white;
    for(let c=0;c<3;c++)png.data[i+c]=alpha?Math.max(0,Math.round((png.data[i+c]-white)*255/alpha)):0;
    png.data[i+3]=alpha;
  });
  const target=path.join(output, `${name}.png`);
  fs.writeFileSync(target, PNG.sync.write(png));
  execFileSync('sips',['-Z',String(size),target],{stdio:'ignore'});
  console.log(name);
}
