// Mechanical crops only: preserve supplied drawings and retain the source scans.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const { PNG } = require('pngjs');
const root = path.resolve(__dirname, '..');
const sources = path.join(root, 'assets/lesson-1/refinements/source');
fs.mkdirSync(sources, { recursive: true });
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'qurio-world-one-art-'));
// Coordinates refer to the 1600px attachment previews. Square canvases retain
// compatibility with FramedSprite. Small dust marks are outside these crops.
const jobs = [
  ['molecule_bonds.jpg', 'assets/lesson-1/refinements/bonds.png', [350, 650, 610, 910], 640, false],
  ['Neutron_structure.jpg', 'assets/lesson-1/refinements/neutron.png', [350, 300, 1010, 960], 700, true],
  ['Neutron_structure 1.jpg', 'assets/lesson-1/refinements/neutron-lens.png', [285, 290, 1265, 1270], 800, true],
  ['censored.jpg', 'assets/ui/censored-transparent.png', [467, 677, 782, 992], 400, false],
];
for (const [name, relative, box, size, glow] of jobs) {
  const original = path.join(sources, name);
  if (!fs.existsSync(original)) fs.copyFileSync(path.join('/Users/sophiewright/Desktop', name), original);
  const converted = path.join(temp, `${name}.png`);
  execFileSync('sips', ['-s', 'format', 'png', original, '--out', converted], { stdio: 'ignore' });
  const src = PNG.sync.read(fs.readFileSync(converted));
  const [l,t,r,b] = box.map(n => Math.round(n * src.width / 1600));
  const png = new PNG({ width: r-l, height: b-t });
  for (let y=0;y<png.height;y++) for (let x=0;x<png.width;x++) {
    const i=((y+t)*src.width+x+l)*4;
    src.data.copy(png.data,(y*png.width+x)*4,i,i+4);
  }
  if (glow) {
    // Remove the white matte continuously, retaining the soft purple halo.
    for (let i=0;i<png.data.length;i+=4) {
      const white=Math.min(png.data[i],png.data[i+1],png.data[i+2]);
      const alpha=white>250?0:255-white;
      for(let c=0;c<3;c++) png.data[i+c]=alpha?Math.max(0,Math.round((png.data[i+c]-white)*255/alpha)):0;
      png.data[i+3]=alpha;
    }
  } else {
    // Flood exterior paper only, so CENSORED's white lettering stays opaque.
    const seen=new Uint8Array(png.width*png.height), queue=[];
    const visit=p=>{
      if(p<0||p>=seen.length||seen[p])return;
      if(Math.min(...png.data.subarray(p*4,p*4+3))>235){seen[p]=1;queue.push(p);}
    };
    for(let x=0;x<png.width;x++){visit(x);visit((png.height-1)*png.width+x);}
    for(let y=0;y<png.height;y++){visit(y*png.width);visit(y*png.width+png.width-1);}
    for(let h=0;h<queue.length;h++){
      const p=queue[h],x=p%png.width,y=Math.floor(p/png.width);
      if(x)visit(p-1);if(x+1<png.width)visit(p+1);if(y)visit(p-png.width);if(y+1<png.height)visit(p+png.width);
    }
    seen.forEach((v,p)=>{if(v)png.data[p*4+3]=0;});
  }
  const target=path.join(root,relative);
  fs.writeFileSync(target,PNG.sync.write(png));
  execFileSync('sips',['-Z',String(size),target],{stdio:'ignore'});
  console.log(relative);
}
