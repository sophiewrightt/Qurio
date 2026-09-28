const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { PNG } = require('pngjs');
const { createHarness } = require('./component-harness.cjs');
const file = 'components/ParticleIdentityLesson.tsx';
const button = (h, label) => h.nodes('PrimaryButton').find(n => n.props.label === label);
const answer = (h, label) => h.nodes('AnswerButton').find(n => n.props.label === label);
const children = (h, name) => h.all(h.render()).filter(n => n.type?.name === name);
const text = h => JSON.stringify(h.render());

for (const initialGuess of ['Yes, identical', 'No, different']) {
  let quizzes = 0;
  const h = createHarness(file, { onComplete() { quizzes++; } });
  assert.equal(h.nodes('AnswerButton').length, 2);
  assert.equal(button(h, 'Start the quiz'), undefined);
  answer(h, initialGuess).props.onPress();
  assert.equal(answer(h, initialGuess).props.state, 'selected', 'Defer the electron verdict');
  assert(!text(h).includes('answer to our first question'));
  assert.equal(children(h, 'IdentityCardPair').length, 0);
  answer(h, 'Exactly identical').props.onPress();
  assert.equal(answer(h, 'Exactly identical').props.state, 'incorrect');
  assert.equal(answer(h, 'Not exactly identical').props.state, 'correct');
  assert(text(h).includes('answer to our first question is yes'));
  assert.equal(children(h, 'IdentityCardPair').length, 4);
  assert.equal(children(h, 'HoveringCharm').length, 0);
  const pair = children(h, 'IdentityCardPair').find(n => n.props.right === 'charm');
  const actualCard = createHarness(file, pair.props, 'IdentityCardPair');
  actualCard.nodes('Pressable').find(n => n.props.accessibilityLabel === 'Read Charm ID 2').props.onPress();
  assert.equal(actualCard.nodes('Modal').length, 0, 'First Charm ID tap reveals the lesson below instead of blocking it with a modal');
  assert.equal(children(h, 'HoveringCharm').length, 1);
  assert.equal(children(h, 'CharmStateLab').length, 0, 'No removed spin lab in the lesson');
  assert(button(h, 'Start the quiz'));
  button(h, 'Start the quiz').props.onPress(); assert.equal(quizzes, 1);
}

let completed = 0;
const h = createHarness(file, { onComplete() { completed++; } }, 'CharmStateLab');
assert.equal(button(h, 'Measure both spins'), undefined);
const entangle = button(h, 'Entangle the charms').props.onPress;
entangle(); entangle();
assert.equal(button(h, 'Entangle the charms').props.disabled, true);
assert.equal(children(h, 'CharmSpin').length, 0);
h.flight();
assert(text(h).includes('no definite local up or down yet'));
assert.equal(children(h, 'CharmSpin').length, 0);
assert.equal(completed, 0);
const originalRandom = Math.random;
try {
  Math.random = () => .1;
  const measure = button(h, 'Measure both spins').props.onPress;
  measure(); measure(); assert.equal(completed, 0);
  h.flight();
  assert.deepEqual(children(h, 'CharmSpin').map(n => n.props.up), [true, false]);
  assert.equal(completed, 1);
  button(h, 'Try a fresh pair').props.onPress();
  assert.equal(children(h, 'CharmSpin').length, 0);
  assert.equal(button(h, 'Measure both spins'), undefined);
  button(h, 'Entangle the charms').props.onPress(); h.flight();
  Math.random = () => .9;
  button(h, 'Measure both spins').props.onPress(); h.flight();
  assert.deepEqual(children(h, 'CharmSpin').map(n => n.props.up), [false, true], 'A fresh pair samples afresh');
  assert.equal(completed, 1, 'Notify completion once, not on every replay');
} finally { Math.random = originalRandom; }
for (const phase of ['entangling', 'measuring']) {
  let called = false;
  const cancelled = createHarness(file, { onComplete() { called = true; } }, 'CharmStateLab');
  button(cancelled, 'Entangle the charms').props.onPress();
  if (phase === 'measuring') { cancelled.flight(); button(cancelled, 'Measure both spins').props.onPress(); }
  cancelled.unmount(); cancelled.flight();
  assert.equal(called, false); assert.equal(children(cancelled, 'CharmSpin').length, 0);
}

const ids = createHarness(file, { left: 'electron', right: 'photon' }, 'IdentityCardPair');
assert.equal(ids.nodes('Modal').length, 0);
ids.nodes('Pressable')[0].props.onPress();
assert(!text(ids).includes('−1.6 × 10⁻¹⁹ C'), 'Do not repeat the artwork details below the ID');
assert.equal(children(ids, 'CardArt').length, 3);
assert.equal(ids.nodes('Modal').length, 1);
ids.nodes('Modal')[0].props.onRequestClose(); assert.equal(ids.nodes('Modal').length, 0);
ids.nodes('Pressable')[1].props.onPress(); button(ids, 'Close ID').props.onPress(); assert.equal(ids.nodes('Modal').length, 0);

const screen = createHarness('screens/ModuleFourLessonTwoScreen.tsx', { onComplete() {} });
assert.equal(screen.nodes('LessonQuiz').length, 0);
screen.nodes('ParticleIdentityLesson')[0].props.onComplete();
assert.equal(screen.nodes('ParticleIdentityLesson').length, 0);
const questions = screen.nodes('LessonQuiz')[0].props.questions;
assert.equal(questions.length, 5);
questions.forEach(q => { assert(q.explanation); assert(q.options.includes(q.answer)); });

const app = createHarness('App.tsx');
app.nodes('HomeScreen')[0].props.onSelectLesson(26); app.nodes('LessonEntryModal')[0].props.onPlay();
app.nodes('LessonNavigationProvider')[0].props.onNext(); app.nodes('LessonEntryModal')[0].props.onPlay();
assert.equal(app.nodes('ModuleFourLessonTwoScreen').length, 1);
assert.equal(typeof app.nodes('LessonNavigationProvider')[0].props.onNext, 'function');
app.nodes('ModuleFourLessonTwoScreen')[0].props.onComplete(5);
app.nodes('ModuleFourLessonTwoScreen')[0].props.onComplete(5);
app.nodes('LessonNavigationProvider')[0].props.onHome();
assert.equal(app.nodes('HomeScreen')[0].props.xp, 0);
assert.deepEqual(app.nodes('HomeScreen')[0].props.completed, [27]);

const source = fs.readFileSync(file, 'utf8'), preloads = fs.readFileSync('data/preloadAssets.ts', 'utf8');
const assets = [...source.matchAll(/require\('(\.\.\/assets\/[^']+)'\)/g)].map(m => m[1]);
assets.forEach(a => { assert(fs.existsSync(path.resolve('components', a))); assert(preloads.includes(a)); });
const pngs = fs.readdirSync('assets/module-4/lesson-2').map(f => PNG.sync.read(fs.readFileSync(`assets/module-4/lesson-2/${f}`)));
assert.equal(pngs.length, 13); pngs.forEach(p => { assert(p.width <= 800); assert(p.height <= 800); assert.equal(p.data[3], 0); });
const shared = ['charm_up','charm_default','Happy_charm'].map(n => PNG.sync.read(fs.readFileSync(`assets/module-4/lesson-2/${n}.png`)));
assert(shared.every(p => p.width === shared[0].width && p.height === shared[0].height));
assert(!source.includes('—'));
assert(source.includes("fillImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }"), 'Explicit image bounds prevent intrinsic-size overflow on web and native');
console.log('PASS: particle identity predictions, ID enlargement, charm reveal, entangle/measure gates, independent replay, cancellation, quiz, navigation, XP and assets');
