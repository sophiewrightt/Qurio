// Preserve supplied artwork; crop paper, flood-fill exterior whites, then resize.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const { PNG } = require('pngjs');
const root = path.resolve(__dirname, '..');
const source = '/Users/sophiewright/Desktop/World 4';
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'qurio-world-four-'));
const jobs = [
  ['world_4_icon', 'module-covers/world-4', [420,420,1170,1190], 640],
  ['sun_with_sunglasses', 'module-4/lesson-1/sun', [205,325,595,700], 480],
  ['hydrogens_repelling_', 'module-4/lesson-1/repelling', [390,635,1130,800], 740],
  ['hydrogen', 'module-4/lesson-1/hydrogen', [515,640,670,795], 200],
  ['helium', 'module-4/lesson-1/helium', [615,615,860,860], 240],
  ...Array.from({ length: 7 }, (_, i) => [`4.${i+1}`, `lesson-badges/world-4/${i+1}`, [480,410,805,735], 256]),
  // Shared frames keep the ID comparisons and charm spin overlays aligned.
  ...['electron_ID','photon_ID','strange_ID','charm_ID','alex_id','barb_id_'].map(name => [name, `module-4/lesson-2/${name}`, [465,325,1080,775], 800]),
  ...['charm_up','charm_default','Happy_charm'].map(name => [name, `module-4/lesson-2/${name}`, [615,550,1100,1140], 590]),
  ['tennis_ball_', 'module-4/lesson-2/tennis_ball_', [710,475,970,735], 256],
  ['dog_with_ball', 'module-4/lesson-2/dog_with_ball', [570,500,925,900], 480],
  ['tennis_player', 'module-4/lesson-2/tennis_player', [595,465,975,1085], 620],
  ['charm_and_strange_together', 'module-4/lesson-2/charm_and_strange_together', [515,680,1210,1015], 740],
  ...[
    ['Z_default', [710,550,1160,995]], ['W_default', [470,390,1055,990]],
    ['up_default', [540,395,945,785]], ['top_default_', [545,405,1060,915]],
    ['tau_neutrino_default', [415,270,1150,995]], ['tau_neutrino_default 1', [460,310,1225,1075]],
    ['Tau_default', [470,425,1055,1005]], ['gluon_default', [515,405,1075,965]],
    ['electron_neutrino_default', [535,440,1160,1085]], ['higgs_default', [380,515,965,1075]],
    ['Muon_default', [450,375,935,855]], ['down_default', [585,385,940,735]],
    ['bottom_default', [565,355,1045,830]], ['strange_pyramid', [470,315,1285,1050]],
    ['photon_glue', [530,275,985,900]],
  ].map(([name, box]) => [name, `module-4/lesson-3/${name}`, box, name === 'strange_pyramid' ? 800 : 512]),
];
for (const [name, dest, box, size] of jobs) {
  if (process.argv.includes('--lesson-three') && !dest.includes('/lesson-3/')) continue;
  const input = path.join(source, `${name}.jpg`);
  const original = path.join(root, 'assets/module-4/source', `${name}.jpg`);
  fs.mkdirSync(path.dirname(original), { recursive: true });
  fs.copyFileSync(input, original);
  const converted = path.join(temp, `${name}.png`);
  execFileSync('sips', ['-s','format','png',original,'--out',converted], { stdio: 'ignore' });
  const src = PNG.sync.read(fs.readFileSync(converted));
  const [left, top, right, bottom] = box.map(n => Math.round(n*src.width/1600));
  const out = new PNG({ width: right-left, height: bottom-top });
  for (let y=0;y<out.height;y++) for (let x=0;x<out.width;x++) {
    const j=((y+top)*src.width+x+left)*4;
    src.data.copy(out.data,(y*out.width+x)*4,j,j+4);
  }
  const seen = new Uint8Array(out.width*out.height), queue=[];
  const visit=p=>{const i=p*4;
    // Keep the intentionally white face inside this very pale rainbow sprite.
    const x=p%out.width, y=Math.floor(p/out.width);
    const keepFace=name==='electron_neutrino_default' && ((x/out.width-.49)/.29)**2+((y/out.height-.51)/.29)**2<1;
    if(!keepFace&&!seen[p]&&Math.min(...out.data.subarray(i,i+3))>235){seen[p]=1;queue.push(p);}};
  for(let x=0;x<out.width;x++){visit(x);visit((out.height-1)*out.width+x);}
  for(let y=0;y<out.height;y++){visit(y*out.width);visit(y*out.width+out.width-1);}
  for(let h=0;h<queue.length;h++){
    const p=queue[h],x=p%out.width,y=Math.floor(p/out.width);
    if(x)visit(p-1);if(x+1<out.width)visit(p+1);if(y)visit(p-out.width);if(y+1<out.height)visit(p+out.width);
  }
  seen.forEach((v,p)=>{if(v)out.data[p*4+3]=0;});
  const target = path.join(root, 'assets', `${dest}.png`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, PNG.sync.write(out));
  execFileSync('sips', ['-Z', String(size), target], { stdio: 'ignore' });
  console.log(dest);
}
