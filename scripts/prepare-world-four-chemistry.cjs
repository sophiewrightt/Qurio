// Mechanical crops of supplied scans, preserving their original drawing and enclosed whites.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const { execFileSync } = require('node:child_process');
const { PNG } = require('pngjs');
const root = path.resolve(__dirname, '..');
const originals = path.join(root, 'assets/module-4/lesson-4/source');
const output = path.join(root, 'assets/module-4/lesson-4');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'qurio-chemistry-'));
const jobs = [
  ...['aluminium','arsenic','calcium','gold','helium','hydrogen','neon_','potassium','oganesson','radium','sodium'].map(n => [n,[615,700,780,855],256]),
  ['balloon_1',[600,550,785,935],400], ['balloon_2',[600,550,785,935],400],
  ['Carbon',[280,220,1140,1130],720], ['electron_',[505,422,560,478],96],
  ['hydrogen_',[765,675,870,780],140], ['milk_carton',[695,555,1030,985],400],
  ['milk_glass_',[565,705,870,1070],400], ['potato',[620,520,990,1000],400],
  ['poison_bottle',[600,405,1005,1195],480], ['periodic_table',[335,565,1210,1030],1050],
  ['neutron',[647,658,732,746],96], ['proton',[690,520,780,605],96],
  ['neon_sign',[480,490,900,770],500], ['radioactive_symbol',[625,620,975,975],400],
  ['salt_',[475,750,1090,1040],500], ['salt_shaker',[695,620,990,1030],400],
  ['soda_can',[605,540,965,985],400], ['chair',[490,475,770,855],480],
];
fs.mkdirSync(originals, { recursive: true });
for (const [name, box, size] of jobs) {
  const original = path.join(originals, `${name}.jpg`);
  // The repository copy is canonical after the initial import.
  if (!fs.existsSync(original)) fs.copyFileSync(path.join('/Users/sophiewright/Desktop', name === 'chair' ? 'World 4' : 'untitled folder', `${name}.jpg`), original);
  const converted = path.join(temp, `${name}.png`);
  execFileSync('sips', ['-s','format','png',original,'--out',converted], { stdio: 'ignore' });
  const src = PNG.sync.read(fs.readFileSync(converted)), scale = src.width / 1600;
  const [l,t,r,b] = box.map(n => Math.round(n * scale));
  const png = new PNG({ width:r-l, height:b-t });
  for (let y=0;y<png.height;y++) for (let x=0;x<png.width;x++) {
    const i=((y+t)*src.width+x+l)*4; src.data.copy(png.data,(y*png.width+x)*4,i,i+4);
  }
  const seen = new Uint8Array(png.width*png.height), queue=[];
  const visit = p => { if(p<0 || p>=seen.length || seen[p]) return; const i=p*4;
    if(Math.min(...png.data.subarray(i,i+3))>235) { seen[p]=1; queue.push(p); }
  };
  for(let x=0;x<png.width;x++){visit(x);visit((png.height-1)*png.width+x);}
  for(let y=0;y<png.height;y++){visit(y*png.width);visit(y*png.width+png.width-1);}
  if(name==='chair') for(const [x,y] of [[635,550],[635,610],[635,735],[635,800]]) visit(Math.round(y*scale-t)*png.width+Math.round(x*scale-l));
  for(let h=0;h<queue.length;h++){const p=queue[h],x=p%png.width,y=Math.floor(p/png.width);
    if(x)visit(p-1);if(x+1<png.width)visit(p+1);if(y)visit(p-png.width);if(y+1<png.height)visit(p+png.width);
  }
  seen.forEach((v,p)=>{if(v)png.data[p*4+3]=0;});
  let result=png;
  if(name==='periodic_table') {
    // The blank source grid has 19 main columns and 16 detached cells per row.
    // Remove one surplus transition column and two surplus f-block cells, retaining
    // the artist's strokes/colours and untouched original scan. Final table: 18 / 14.
    const cut=Math.round(44*scale),join=Math.round((882-335)*scale);
    result=new PNG({width:png.width-cut,height:png.height});
    for(let y=0;y<result.height;y++)for(let x=0;x<result.width;x++) {
      const detached=y>=Math.round((910-565)*scale);
      if(detached&&x<Math.round((531-335)*scale))continue;
      const sx=x+(detached||x>=join?cut:0),i=(y*png.width+sx)*4;
      png.data.copy(result.data,(y*result.width+x)*4,i,i+4);
    }
  }
  const target=path.join(output, `${name}.png`);
  fs.writeFileSync(target, PNG.sync.write(result));
  execFileSync('sips',['-Z',String(size),target],{stdio:'ignore'});
  console.log(name);
}
