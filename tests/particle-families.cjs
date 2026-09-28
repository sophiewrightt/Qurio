const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { PNG } = require('pngjs');
const { createHarness } = require('./component-harness.cjs');
const file = 'components/ParticleFamiliesLesson.tsx';
const children = (h, name) => h.all(h.render()).filter(n => n.type?.name === name);
const button = (h, label) => h.nodes('PrimaryButton').find(n => n.props.label === label);
let quizzes = 0;
const lesson = createHarness(file, { onComplete() { quizzes++; }, onScrollLock() {} });
assert.equal(children(lesson, 'FamilyGrid').length, 1);
assert.equal(children(lesson, 'QuantumChairs').length, 0);
assert.equal(button(lesson, 'Start the quiz'), undefined);
for (const [family, count] of [['fermion', 12], ['boson', 5]]) {
  const gridProps = children(lesson, 'FamilyGrid').find(n => n.props.family === family).props;
  const grid = createHarness(file, gridProps, 'FamilyGrid');
  const tiles = children(grid, 'ScratchParticle');
  assert.equal(tiles.length, count);
  if (family === 'fermion') {
    assert.deepEqual(tiles.slice(0, 3).map(n => n.props.member.label), ['Electron', 'Charm quark', 'Strange quark']);
    assert(tiles.slice(3).every(n => n.props.member.label === '?'));
    assert.equal(new Set(tiles.map(n => n.props.member.id)).size, 12);
  }
  tiles.slice(0, -1).forEach(t => { t.props.onReveal(); t.props.onReveal(); });
  assert.equal(children(lesson, family === 'fermion' ? 'FamilyGrid' : 'QuantumChairs').length, family === 'fermion' ? 1 : 0);
  tiles.at(-1).props.onReveal();
}
assert.equal(children(lesson, 'QuantumChairs').length, 1);
children(lesson, 'QuantumChairs')[0].props.onComplete();
assert.equal(lesson.nodes('TerminologyCard').length, 1);
assert.equal(children(lesson, 'QuantumChairs').length, 2);
assert.equal(button(lesson, 'Start the quiz'), undefined);
children(lesson, 'QuantumChairs')[1].props.onComplete();
button(lesson, 'Start the quiz').props.onPress(); assert.equal(quizzes, 1);

let reveals = 0; const locks = [];
const scratch = createHarness(file, { member: { id: 'test', label: '?', source: 'test.png' }, index: 0, family: 'fermion', onReveal() { reveals++; }, onScrollLock(v) { locks.push(v); } }, 'ScratchParticle');
const surface = () => scratch.nodes('View').find(n => n.props.testID === 'scratch-test');
surface().props.onLayout({ nativeEvent: { layout: { width: 100, height: 112 } } });
const event = (x, y) => ({ nativeEvent: { locationX: x, locationY: y } });
surface().props.onPanResponderGrant(event(5, 55));
assert.equal(reveals, 0, 'A single contact is not a completed scratch');
assert.equal(locks.at(-1), true);
surface().props.onPanResponderMove(event(95, 55));
assert.equal(reveals, 1, 'A continuous scratch uncovers the panel');
surface().props.onPanResponderMove(event(5, 55)); assert.equal(reveals, 1);
surface().props.onPanResponderRelease(); assert.equal(locks.at(-1), false);
assert.equal(scratch.nodes('Pressable').length, 0);
scratch.unmount(); assert.equal(locks.at(-1), false);
const tap = createHarness(file, { member: { id: 'tap', label: '?', source: 'test.png' }, index: 0, family: 'boson', onReveal() { reveals++; }, onScrollLock() {} }, 'ScratchParticle');
const reveal = tap.nodes('Pressable')[0].props.onPress; reveal(); reveal(); assert.equal(reveals, 2);

for (const family of ['fermion', 'boson']) {
  let completed = 0;
  const chairs = createHarness(file, { family, onComplete() { completed++; } }, 'QuantumChairs');
  assert.equal(chairs.nodes('AnimatedImage').length, family === 'fermion' ? 2 : 8);
  const start = chairs.nodes('PrimaryButton')[0].props.onPress;
  start(); start(); assert.equal(completed, 0); assert.equal(chairs.nodes('PrimaryButton')[0].props.disabled, true);
  chairs.flight(); assert.equal(completed, 1);
  button(chairs, 'Replay the chairs').props.onPress(); chairs.flight(); assert.equal(completed, 1);
  const cancelled = createHarness(file, { family, onComplete() { throw Error('Completion after unmount'); } }, 'QuantumChairs');
  cancelled.nodes('PrimaryButton')[0].props.onPress(); cancelled.unmount(); cancelled.flight();
}
const screen = createHarness('screens/ModuleFourLessonThreeScreen.tsx', { onComplete() {} });
screen.nodes('ParticleFamiliesLesson')[0].props.onScrollLock(true); assert.equal(screen.nodes('ScrollView')[0].props.scrollEnabled, false);
screen.nodes('ParticleFamiliesLesson')[0].props.onScrollLock(false); assert.equal(screen.nodes('ScrollView')[0].props.scrollEnabled, true);
screen.nodes('ParticleFamiliesLesson')[0].props.onComplete();
assert.equal(screen.nodes('ParticleFamiliesLesson').length, 0);
screen.nodes('LessonQuiz')[0].props.questions.forEach(q => { assert(q.explanation); assert(q.options.includes(q.answer)); });
const app = createHarness('App.tsx'); app.nodes('HomeScreen')[0].props.onSelectLesson(27); app.nodes('LessonEntryModal')[0].props.onPlay();
app.nodes('LessonNavigationProvider')[0].props.onNext(); app.nodes('LessonEntryModal')[0].props.onPlay(); assert.equal(app.nodes('ModuleFourLessonThreeScreen').length, 1);
assert.equal(typeof app.nodes('LessonNavigationProvider')[0].props.onNext, 'function');
app.nodes('ModuleFourLessonThreeScreen')[0].props.onComplete(5); app.nodes('ModuleFourLessonThreeScreen')[0].props.onComplete(5);
app.nodes('LessonNavigationProvider')[0].props.onHome(); assert.equal(app.nodes('HomeScreen')[0].props.xp, 0);
assert.deepEqual(app.nodes('HomeScreen')[0].props.completed, [28]);
const source = fs.readFileSync(file, 'utf8'), preloads = fs.readFileSync('data/preloadAssets.ts', 'utf8');
[...source.matchAll(/require\('(\.\.\/assets\/[^']+)'\)/g)].forEach(([, a]) => { assert(fs.existsSync(path.resolve('components', a))); assert(preloads.includes(a)); });
fs.readdirSync('assets/module-4/lesson-3').forEach(f => { const p = PNG.sync.read(fs.readFileSync(`assets/module-4/lesson-3/${f}`)); assert(p.width <= 800 && p.height <= 800); assert.equal(p.data[3], 0); });
assert(!source.includes('—'));
console.log('PASS: particle families, individual scratch/tap reveal, scroll release, complete gates, chair replay/cleanup, quiz, navigation, XP and assets');
