const assert=require('node:assert/strict'), fs=require('node:fs'),path=require('node:path');
const {PNG}=require('pngjs');
const {createHarness}=require('./component-harness.cjs');
const file='components/FermionChemistryLesson.tsx';
const child=(h,name)=>h.all(h.render()).find(n=>n.type?.name===name);
const button=(h,label)=>h.nodes('PrimaryButton').find(n=>n.props.label===label) || h.nodes('Pressable').find(n=>n.props.accessibilityLabel===label);
let quizzes=0;
const lesson=createHarness(file,{onComplete(){quizzes++;}});
assert.equal(child(lesson,'WithoutPauliLab'),undefined);
assert.equal(child(lesson,'ElementExplorer'),undefined);
assert.equal(lesson.nodes('QuantumChairs')[0].props.withoutPauli,true);
lesson.nodes('QuantumChairs')[0].props.onComplete();
assert.equal(lesson.nodes('TerminologyCard').length,1);
assert.equal(child(lesson,'ElementExplorer'),undefined);
child(lesson,'WithoutPauliLab').props.onComplete();
assert(child(lesson,'ElementExplorer'));
assert.equal(child(lesson,'PeriodicColumns'),undefined);
child(lesson,'ElementExplorer').props.onComplete();
assert.equal(button(lesson,'Start the quiz'),undefined);
child(lesson,'PeriodicColumns').props.onComplete();
button(lesson,'Start the quiz').props.onPress(); assert.equal(quizzes,1);
assert.equal(child(createHarness(file),'ElementExplorer'),undefined,'A fresh lesson resets all gates');

let completed=0;
const lab=createHarness(file,{onComplete(){completed++;}},'WithoutPauliLab');
const start=button(lab,'See what happens').props.onPress;
start();start();assert.equal(completed,0);assert.equal(lab.nodes('PrimaryButton')[0].props.disabled,true);
lab.flight();assert.equal(completed,1);
button(lab,'Replay the thought experiment').props.onPress();lab.flight();assert.equal(completed,1);
button(lab,'Replay the thought experiment').props.onPress();lab.unmount();lab.flight();assert.equal(completed,1);

let discoveries=0;
const explorer=createHarness(file,{onComplete(){discoveries++;}},'ElementExplorer');
const z=[1,2,10,11,13,19,20,33,79,88,118];
for(let i=0;i<z.length-1;i++){
  assert.equal(child(explorer,'AtomPicture').props.element.z,z[i]);
  const delta=z[i+1]-z[i], action=button(explorer,`Add ${delta} proton${delta===1?'':'s'}`).props.onPress;
  action();action();assert.equal(button(explorer,`Add ${delta} proton${delta===1?'':'s'}`).props.disabled,true);
  assert.equal(discoveries,0,'Completion waits for the final addition');
  explorer.flight();
}
assert.equal(discoveries,1);assert.equal(explorer.nodes('PrimaryButton').length,0);
assert.equal(child(explorer,'AtomPicture').props.element.z,118);
explorer.nodes('Pressable')[0].props.onPress();assert.equal(child(explorer,'AtomPicture').props.element.z,88);
button(explorer,'Add 30 protons').props.onPress();explorer.flight();assert.equal(discoveries,1);
const cancelled=createHarness(file,{onComplete(){throw Error('Late callback');}},'ElementExplorer');
button(cancelled,'Add 1 proton').props.onPress();cancelled.unmount();cancelled.flight();
assert.equal(child(cancelled,'AtomPicture').props.element.z,1);

let columns=0;const table=createHarness(file,{onComplete(){columns++;}},'PeriodicColumns');
assert.deepEqual(table.nodes('Image')[0].props.style[1],{width:'100%',height:'100%'},'Keep the table inside its phone-size wrapper');
assert.equal(table.nodes('PrimaryButton').length,0);
assert.equal(table.activeTimers(),1);
for(let i=0;i<7;i++){table.tick();assert.equal(columns,0);}
table.tick();assert.equal(columns,1);
for(let i=0;i<8;i++)table.tick();
assert.equal(columns,1);
table.unmount();assert.equal(table.activeTimers(),0);

const counterfactual=createHarness('components/ParticleFamiliesLesson.tsx',{family:'fermion',withoutPauli:true,onComplete(){}},'QuantumChairs');
assert(counterfactual.nodes('Image').some(n=>n.props.source.endsWith('/chair.png')));
assert.equal(counterfactual.nodes('AnimatedImage').length,2);
counterfactual.nodes('AnimatedImage').forEach(n=>assert.equal(n.props.style[1].transform[0].translateX.outputRange.at(-1),0));
button(counterfactual,'Give it a try').props.onPress();counterfactual.flight();
assert.equal(counterfactual.nodes('AnimatedImage').length,2, 'Sharing does not merge the particles');

const screen=createHarness('screens/ModuleFourLessonFourScreen.tsx',{onComplete(){}});
assert.equal(screen.nodes('LessonQuiz').length,0);
screen.nodes('FermionChemistryLesson')[0].props.onComplete();
assert.equal(screen.nodes('FermionChemistryLesson').length,0);
const questions=screen.nodes('LessonQuiz')[0].props.questions;
assert.equal(questions.length,5);questions.forEach(q=>assert(q.explanation&&q.options.includes(q.answer)));
const app=createHarness('App.tsx');app.nodes('HomeScreen')[0].props.onSelectLesson(28); app.nodes('LessonEntryModal')[0].props.onPlay();
app.nodes('LessonNavigationProvider')[0].props.onNext(); app.nodes('LessonEntryModal')[0].props.onPlay();assert.equal(app.nodes('ModuleFourLessonFourScreen').length,1);
app.nodes('ModuleFourLessonFourScreen')[0].props.onComplete(5);app.nodes('ModuleFourLessonFourScreen')[0].props.onComplete(5);
app.nodes('LessonNavigationProvider')[0].props.onHome();assert.deepEqual(app.nodes('HomeScreen')[0].props.completed,[29]);assert.equal(app.nodes('HomeScreen')[0].props.xp,0);
app.nodes('HomeScreen')[0].props.onSelectLesson(29); app.nodes('LessonEntryModal')[0].props.onPlay();assert.equal(typeof app.nodes('LessonNavigationProvider')[0].props.onNext,'function');

const data={};new Function('exports',require('typescript').transpileModule(fs.readFileSync('data/moduleFour.ts','utf8'),{compilerOptions:{module:1}}).outputText)(data);
assert.deepEqual(data.chemistryElements.map(e=>e.z),z);
data.chemistryElements.forEach(e=>assert.equal(e.shells.reduce((a,b)=>a+b,0),e.z,'Neutral atom totals'));
for(const e of data.chemistryElements){
  const atom=child(explorer,'AtomPicture');const images=explorer.all(atom.type({element:e})).filter(n=>n.type==='Image');
  for(const [name,count] of [['proton',e.z],['neutron',e.neutrons],['electron_',e.z]])assert.equal(images.filter(n=>n.props.source.endsWith(`/${name}.png`)).length,count,`${e.name}: exact ${name} sprite count`);
}
const src=fs.readFileSync(file,'utf8'),preload=fs.readFileSync('data/preloadAssets.ts','utf8');
for(const[,a]of src.matchAll(/require\('(\.\.\/assets\/[^']+)'\)/g)){assert(fs.existsSync(path.resolve('components',a)));assert(preload.includes(a));}
for(const f of fs.readdirSync('assets/module-4/lesson-4').filter(f=>f.endsWith('.png'))){const p=PNG.sync.read(fs.readFileSync(`assets/module-4/lesson-4/${f}`));assert.equal(p.data[3],0);}
assert(!src.includes('—'));assert(!src.includes('/Desktop/'));
console.log('PASS: chemistry progression, ten additions, exact neutral totals, batch/replay/cancellation guards, columns, quiz isolation, chair sprite, navigation, XP and preloads');
