// Preserve the supplied drawings. Remove exterior paper only, retaining white
// faces and the instruction sheet. Coordinates use the 1600px reference canvas.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const { PNG } = require('pngjs');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'qurio-art-'));
const target = path.join(root, 'assets/module-3/refinements');
fs.mkdirSync(target, { recursive: true });
const jobs = [
  ['podium', 'podium', [390,455,945,1000]],
  ['boxing-electron-celebrating', 'boxing_electron_celebrating', [340,450,715,770]],
  ['bell', 'bell', [530,470,1070,1125]],
  ['instruction-sheet', 'strange_looking_at_instruction_sheet', [480,510,1155,985]],
  ['strange-x-intro', 'strange_X_intro', [405,350,1220,1140]],
  ['strange-x', 'strange_X', [480,510,970,985]],
  ['strange-a', 'strange_A', [480,510,970,985]],
  ['strange-b', 'strange_B', [480,510,970,985]],
  ['alex-face', 'alex_face', [430,450,730,775]],
  ['barb-face', 'barb_face', [810,465,1135,765]],
  ['barb-spin-down', 'World 3/barb_with_box_spin_down', [580,380,1135,980]],
  ['alex-spin-up', 'World 3/alex_with_box_spin_up', [435,380,990,980]],
  ['alex-secret', '3.8/alex_with_secret_thought', [430,370,1000,875]],
  // Shared crops keep the computers and hacker fixed during crossfades.
  ['barb-computer', '3.8/barb_behind_computer_', [435,495,880,900]],
  ['barb-message', '3.8/barb_behind_computer_with_message', [435,495,880,900]],
  ['barb-scrambled', '3.8/barb_behind_computer_secret', [435,495,880,900]],
  ['hacker', '3.8/hacker_', [550,470,1135,1010]],
  ['hacker-secret', '3.8/hacker_with_secret', [550,470,1135,1010]],
  ['hacker-puzzled', '3.8/hacker_puzzled', [550,470,1135,1010]],
  ['hacker-key', '3.8/hacker_with_key', [550,470,1135,1010]],
];
for (const [name, file, box] of jobs) {
  const converted = path.join(temp, `${name}.png`);
  execFileSync('sips', ['-s','format','png',`/Users/sophiewright/Desktop/${file}.jpg`,'--out',converted], { stdio: 'ignore' });
  const src = PNG.sync.read(fs.readFileSync(converted));
  const scale = src.width / 1600;
  const [left,top,right,bottom] = box.map(n => Math.round(n * scale));
  const out = new PNG({ width:right-left, height:bottom-top });
  for(let y=0;y<out.height;y++) for(let x=0;x<out.width;x++) {
    const i=(y*out.width+x)*4, j=((y+top)*src.width+x+left)*4;
    src.data.copy(out.data,i,j,j+4);
  }
  const outside = new Uint8Array(out.width*out.height), queue=[];
  const paper=(p)=> {
    const i=p*4, x=(p%out.width+left)/scale, y=(Math.floor(p/out.width)+top)/scale;
    // The new sheet is deliberately opaque, including its pale edges.
    if(name==='instruction-sheet' && x>=990 && x<=1145 && y>=737 && y<=910) return false;
    return Math.min(out.data[i],out.data[i+1],out.data[i+2]) > 235;
  };
  const visit=p=>{if(!outside[p]&&paper(p)){outside[p]=1;queue.push(p);}};
  for(let x=0;x<out.width;x++){visit(x);visit((out.height-1)*out.width+x);}
  for(let y=0;y<out.height;y++){visit(y*out.width);visit(y*out.width+out.width-1);}
  for(let h=0;h<queue.length;h++){
    const p=queue[h],x=p%out.width,y=Math.floor(p/out.width);
    if(x)visit(p-1);if(x+1<out.width)visit(p+1);if(y)visit(p-out.width);if(y+1<out.height)visit(p+out.width);
  }
  outside.forEach((v,p)=>{if(v)out.data[p*4+3]=0;});
  fs.writeFileSync(path.join(target,`${name}.png`),PNG.sync.write(out));
  console.log(name,out.width,out.height);
}
