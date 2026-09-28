const assert=require('node:assert/strict'), fs=require('node:fs'),path=require('node:path');
const {PNG}=require('pngjs');
const {createHarness}=require('./component-harness.cjs');
const file='components/FriendlyBosonsLesson.tsx';
const child=(h,name)=>h.all(h.render()).find(n=>n.type?.name===name);
const button=(h,label)=>h.nodes('PrimaryButton').find(n=>n.props.label===label);
let quizzes=0;
const lesson=createHarness(file,{onComplete(){quizzes++;}});
assert.equal(lesson.nodes('QuantumChairs')[0].props.family,'boson');
assert.equal(child(lesson,'PhotonOffice'),undefined);
lesson.nodes('QuantumChairs')[0].props.onComplete();
assert(child(lesson,'PhotonOffice'));assert.equal(child(lesson,'FriendlyComparison'),undefined);
child(lesson,'PhotonOffice').props.onComplete();
assert.equal(lesson.nodes('TerminologyCard')[0].props.term,'Bose-Einstein condensate');
assert.equal(child(lesson,'FriendlyComparison').props.family,'fermion');
const comparisons=lesson.all(lesson.render()).filter(n=>n.type?.name==='FriendlyComparison');
assert.equal(comparisons.length,2);assert.equal(comparisons[1].props.family,'boson');
button(lesson,'Start the quiz').props.onPress();assert.equal(quizzes,1);
assert.equal(child(createHarness(file),'PhotonOffice'),undefined,'Fresh lesson resets its gates');

let condensed=0;
const office=createHarness(file,{onComplete(){condensed++;}},'PhotonOffice');
assert.equal(office.nodes('AnimatedImage').length,10);
assert.equal(child(office,'Blizzard').props.active,false);
assert.equal(button(office,'Send in the blizzard'),undefined);
const drop=button(office,'Let the photons lose energy').props.onPress;
drop();drop();assert.equal(office.nodes('PrimaryButton')[0].props.disabled,true);assert.equal(condensed,0);
office.flight();assert.equal(condensed,0);
assert.equal(child(office,'CollectiveWave'),undefined);
button(office,'Send in the blizzard').props.onPress();
assert.equal(child(office,'Blizzard').props.active,true);assert.equal(condensed,0);
office.flight();assert.equal(condensed,1);assert.equal(child(office,'CollectiveWave'),undefined);
assert(office.nodes('AnimatedImage').every(n=>n.props.style[1].opacity===.55));
assert.equal(child(office,'Blizzard').props.active,false,'Stop the blizzard after cooling');
assert.equal(office.nodes('PrimaryButton').length,0,'Completed office has no replay control');
office.unmount();assert.equal(condensed,1);
const cancelled=createHarness(file,{onComplete(){throw Error('Late completion');}},'PhotonOffice');
button(cancelled,'Let the photons lose energy').props.onPress();cancelled.flight();
button(cancelled,'Send in the blizzard').props.onPress();cancelled.unmount();cancelled.flight();
assert.equal(child(cancelled,'CollectiveWave'),undefined);

for(const family of ['fermion','boson']) {
  const encounter=createHarness(file,{family},'FriendlyComparison');
  assert.equal(encounter.nodes('PrimaryButton').length,0);
  assert.equal(encounter.nodes('AnimatedImage').length,0);
  assert(encounter.nodes('Image')[0].props.source.includes(family==='boson'?'friendly_photon':'unfriendly_electron'));
}
const screen=createHarness('screens/ModuleFourLessonFiveScreen.tsx',{onComplete(){}});
assert.equal(screen.nodes('LessonQuiz').length,0);screen.nodes('FriendlyBosonsLesson')[0].props.onComplete();
assert.equal(screen.nodes('FriendlyBosonsLesson').length,0);
const questions=screen.nodes('LessonQuiz')[0].props.questions;
assert.equal(questions.length,5);questions.forEach(q=>assert(q.explanation&&q.options.includes(q.answer)));
const app=createHarness('App.tsx');app.nodes('HomeScreen')[0].props.onSelectLesson(29); app.nodes('LessonEntryModal')[0].props.onPlay();
app.nodes('LessonNavigationProvider')[0].props.onNext(); app.nodes('LessonEntryModal')[0].props.onPlay();assert.equal(app.nodes('ModuleFourLessonFiveScreen').length,1);
app.nodes('ModuleFourLessonFiveScreen')[0].props.onComplete(4);app.nodes('ModuleFourLessonFiveScreen')[0].props.onComplete(4);
app.nodes('LessonNavigationProvider')[0].props.onHome();assert.deepEqual(app.nodes('HomeScreen')[0].props.completed,[30]);assert.equal(app.nodes('HomeScreen')[0].props.xp,0);
app.nodes('HomeScreen')[0].props.onSelectLesson(30); app.nodes('LessonEntryModal')[0].props.onPlay();app.nodes('LessonNavigationProvider')[0].props.onNext(); app.nodes('LessonEntryModal')[0].props.onPlay();assert.equal(app.nodes('ModuleFourLessonSixScreen').length,1);
const src=fs.readFileSync(file,'utf8'),preload=fs.readFileSync('data/preloadAssets.ts','utf8');
for(const[,a]of src.matchAll(/require\('(\.\.\/assets\/[^']+)'\)/g)){assert(fs.existsSync(path.resolve('components',a)));assert(preload.includes(a));}
for(const f of fs.readdirSync('assets/module-4/lesson-5').filter(f=>f.endsWith('.png'))){const p=PNG.sync.read(fs.readFileSync(`assets/module-4/lesson-5/${f}`));assert.equal(p.data[3],0);}
assert(!src.includes('—'));assert(!src.includes('/Desktop/'));assert(!src.includes('Boson-Einstein'));
assert(src.includes('cooling metaphor'));assert(src.includes('not attraction'));assert(src.includes('allowed transition'));
console.log('PASS: friendly boson gates, ten office photons, two-stage cooling, encounters, replay/cancellation, quiz isolation, navigation, XP and preloads');
