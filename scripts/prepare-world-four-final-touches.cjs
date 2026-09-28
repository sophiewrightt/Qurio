// Mechanical crops of the supplied scans, retaining originals and enclosed whites.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const { execFileSync } = require('node:child_process');
const { PNG } = require('pngjs');
const output = path.resolve(__dirname, '../assets/module-4/refinements');
fs.mkdirSync(path.join(output, 'source'), { recursive: true });
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'qurio-world-four-'));
for (const [name, box, glow] of [
  ['unfriendly_electron', [35, 490, 1415, 1090], true],
  ['friendly_photon', [245, 425, 1360, 1100], true],
  ['alex_full_body', [425, 445, 735, 980], false],
  ['photon_+_co', [460, 385, 985, 970], false],
]) {
  const original = path.join(output, 'source', name + '.jpg');
  if (!fs.existsSync(original)) fs.copyFileSync(path.join('/Users/sophiewright/Desktop', name + '.jpg'), original);
  const converted = path.join(temp, name + '.png');
  execFileSync('sips', ['-s', 'format', 'png', original, '--out', converted], { stdio: 'ignore' });
  const src = PNG.sync.read(fs.readFileSync(converted)), ratio = src.width / 1600;
  const [l,t,r,b] = box.map(v => Math.round(v * ratio));
  const png = new PNG({ width: r-l, height: b-t });
  for (let y=0;y<png.height;y++) for (let x=0;x<png.width;x++) {
    const i=((y+t)*src.width+x+l)*4; src.data.copy(png.data,(y*png.width+x)*4,i,i+4);
  }
  const seen = new Uint8Array(png.width*png.height), queue=[];
  const visit=p=>{if(seen[p])return;const i=p*4;if(Math.min(...png.data.subarray(i,i+3))>(glow?60:238)){seen[p]=1;queue.push(p);}};
  for(let x=0;x<png.width;x++){visit(x);visit((png.height-1)*png.width+x);}
  for(let y=0;y<png.height;y++){visit(y*png.width);visit(y*png.width+png.width-1);}
  for(let h=0;h<queue.length;h++){const p=queue[h],x=p%png.width,y=Math.floor(p/png.width);if(x)visit(p-1);if(x+1<png.width)visit(p+1);if(y)visit(p-png.width);if(y+1<png.height)visit(p+png.width);}
  seen.forEach((v,p)=>{if(!v)return;const i=p*4;if(!glow){png.data[i+3]=0;return;}const white=Math.min(...png.data.subarray(i,i+3)),alpha=white>249?0:255-white;for(let c=0;c<3;c++)png.data[i+c]=alpha?Math.max(0,Math.round((png.data[i+c]-white)*255/alpha)):0;png.data[i+3]=alpha;});
  const target=path.join(output,name+'.png');fs.writeFileSync(target,PNG.sync.write(png));execFileSync('sips',['-Z','900',target],{stdio:'ignore'});
}
