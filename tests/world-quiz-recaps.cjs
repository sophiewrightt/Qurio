const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHarness } = require('./component-harness.cjs');
const button = (h, label) => h.nodes('PrimaryButton').find(n => n.props.label === label);
const copy = h => JSON.stringify(h.render());

for (const [world, file, label] of [
  [1, 'screens/LessonNineScreen.tsx', 'Start the quiz'],
  [3, 'screens/ModuleThreeLessonEightScreen.tsx', 'Start the final challenge'],
  [4, 'screens/ModuleFourLessonSixScreen.tsx', 'Start the final challenge'],
]) {
  const h = createHarness(file, { ownedAccessories: [], onHome() {}, onComplete() {}, onUnlockAccessories() {} });
  assert.equal(h.nodes('WorldQuizRecap')[0].props.world, world);
  assert.equal(h.nodes('QuizRefresherNote').length, 1);
  button(h, label).props.onPress();
  assert.equal(h.nodes('WorldQuizRecap').length, 0, 'Starting the quiz replaces the recap');
  assert.equal(h.nodes('QuizRefresherNote').length, 0);
  assert.equal(h.nodes('LessonQuiz').length, 1);
  h.unmount();
}
const two = createHarness('components/QuantumRulesFinale.tsx', { onStartChallenge() {} });
assert.equal(two.nodes('FloatingRecapParticle')[0].props.particle, 'photon');
assert.equal(two.nodes('QuizRefresherNote').length, 1);
const recap = createHarness('components/WorldQuizRecap.tsx', { world: 1 }, 'WorldQuizRecap');
assert.deepEqual(Object.values(recap.exported.worldQuizRecaps).map(rows => rows.length), [5, 4, 7]);
for (const rows of Object.values(recap.exported.worldQuizRecaps)) for (const row of rows) {
  assert(row.title && row.meaning && row.icon);
  assert(!row.meaning.includes('—'));
}
const note = createHarness('components/WorldQuizRecap.tsx', {}, 'QuizRefresherNote');
assert(copy(note).includes('If you want a refresher on the content, feel free to replay the lessons or have a look at your terminology dictionary!'));
assert(!note.nodes('Text')[0].props.onPress, 'The future dictionary is not a broken link');
const float = createHarness('components/WorldQuizRecap.tsx', { particle: 'charm' }, 'FloatingRecapParticle');
assert.equal(float.nodes('AnimatedImage')[0].props.accessibilityLabel, 'Floating Charm quark');
float.unmount();

let score;
const final = createHarness('screens/ModuleFourLessonSixScreen.tsx', { ownedAccessories: [], onUnlockAccessories() {}, onComplete(value) { score = value; } });
button(final, 'Start the final challenge').props.onPress();
const quiz = final.nodes('LessonQuiz')[0];
assert.equal(quiz.props.questions.length, 7);
assert.equal(quiz.props.completionActions, false);
quiz.props.questions.forEach(q => { assert(q.options.includes(q.answer)); assert(q.explanation.length > 20); });
quiz.props.onFinish(5); quiz.props.onFinish(1);
assert(final.nodes('Text').some(node => node.children.join('') === 'FINAL CHALLENGE · 5/7'), 'Repeated finish callbacks cannot overwrite the result');
assert.equal(final.nodes('WorldCelebration').length, 1);
assert.equal(final.nodes('RewardPack').length, 1);
assert.equal(final.nodes('LessonFinishActions')[0].props.next, false);
final.nodes('LessonFinishActions')[0].props.onComplete(); assert.equal(score, 5);

const app = createHarness('App.tsx');
app.nodes('HomeScreen')[0].props.onSelectLesson(30); app.nodes('LessonEntryModal')[0].props.onPlay();
app.nodes('LessonNavigationProvider')[0].props.onNext(); app.nodes('LessonEntryModal')[0].props.onPlay();
const finish = app.nodes('ModuleFourLessonSixScreen')[0].props.onComplete;
finish(5); finish(5);
app.nodes('LessonNavigationProvider')[0].props.onHome();
assert.deepEqual(app.nodes('HomeScreen')[0].props.completed, [32]);
assert.equal(app.nodes('HomeScreen')[0].props.xp, 0, 'Finale completion alone does not earn Knowledge');
assert(!fs.readFileSync('screens/HomeScreen.tsx', 'utf8').includes('5 lessons available'));
assert(fs.readFileSync('App.tsx', 'utf8').includes('requestLesson(lessonOrder.find'));
assert(fs.readFileSync('data/curriculum.ts', 'utf8').includes('29, 30, 32]'));
const preload = fs.readFileSync('data/preloadAssets.ts', 'utf8');
for (const file of ['components/WorldQuizRecap.tsx', 'screens/ModuleFourLessonSixScreen.tsx']) {
  for (const [, asset] of fs.readFileSync(file, 'utf8').matchAll(/require\('(\.\.\/assets\/[^']+)'\)/g)) {
    assert(fs.existsSync(path.resolve(path.dirname(file), asset)), asset);
    assert(preload.includes(asset), `Missing preload: ${asset}`);
  }
}
console.log('PASS: four world recap entries, refresher note, floating sprites, seven-question finale, quiz isolation, celebration, rewards and duplicate XP guard');
