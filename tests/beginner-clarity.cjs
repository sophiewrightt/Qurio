const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { createHarness } = require('./component-harness.cjs');
const text = h => h.nodes('Text').flatMap(n => n.children).join('');
const button = (h, label) => h.nodes('PrimaryButton').find(n => n.props.label === label);
const load = path => {
  const exports = {};
  new Function('exports', 'require', ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exports, name => name);
  return exports;
};

// An explanatory sentence belongs to every assessed final-quiz item.
let questionsChecked = 0;
for (const file of ['lessonOne', 'lessonTwo', 'lessonSeven', 'lessonEight', 'lessonNine', 'moduleTwo', 'moduleThree']) {
  for (const value of Object.values(load(`data/${file}.ts`))) {
    if (!Array.isArray(value)) continue;
    for (const q of value.filter(q => q.question && q.options)) {
      assert.equal(q.options.filter(o => o === q.answer).length, 1);
      assert(q.explanation?.length > 20, `${file}: ${q.question} needs explanatory feedback`);
      questionsChecked++;
    }
  }
}
const q = { question: 'Test', options: ['Yes', 'No'], answer: 'Yes', explanation: 'An explanation shown after either answer.' };
for (const selected of q.options) {
  let score;
  const quiz = createHarness('components/LessonQuiz.tsx', { questions: [q], onFinish: n => { score = n; } });
  assert(!text(quiz).includes(q.explanation));
  quiz.nodes('QuizQuestion')[0].props.onSelect(selected);
  assert(text(quiz).includes(q.explanation));
  quiz.nodes('LessonFinishActions')[0].props.onComplete();
  assert.equal(score, selected === 'Yes' ? 1 : 0);
}

const optional = createHarness('components/ExploreFurther.tsx', { title: 'Extra context', children: { type: 'Text', props: {}, children: ['Optional detail'] } });
assert(!text(optional).includes('Optional detail'));
optional.nodes('Pressable')[0].props.onPress();
assert(text(optional).includes('Optional detail'));
assert(optional.nodes('Pressable')[0].props.accessibilityState.expanded);
optional.nodes('Pressable')[0].props.onPress();
assert(!text(optional).includes('Optional detail'));

const { sampleBinary } = load('data/experimentSampling.ts');
assert.deepEqual(sampleBinary(3, 0, () => 0), [false, false, false]);
assert.deepEqual(sampleBinary(3, 1, () => .999), [true, true, true]);
let rngCalls = 0;
assert.deepEqual(sampleBinary(4, .7, () => (++rngCalls % 2 ? .2 : .9)), [true, false, true, false]);
assert.equal(rngCalls, 4, 'Each trial receives its own random draw');

const originalRandom = Math.random;
const roomSwitch = createHarness('components/TelepathyLesson.tsx', { onComplete() {} }, 'LightSwitchLab');
assert(roomSwitch.nodes('Pressable')[0].props.style({ pressed: false })[0].minHeight >= 48, 'The light switch has a comfortable touch target');
roomSwitch.nodes('Pressable')[0].props.onPress();
assert(roomSwitch.nodes('Image').some(node => node.props.accessibilityLabel === 'Room light is on'));
try {
  let completed = 0;
  Math.random = () => 0;
  const lab = createHarness('components/MeasurementLessonLabs.tsx', { onComplete() { completed++; } }, 'RepeatedMeasurementLab');
  const run = size => lab.nodes('Pressable').find(n => n.props.accessibilityLabel === `Measure ${size}`).props.onPress();
  run(10); run(1000);
  assert.equal(lab.activeTimers(), 1, 'Rapid taps cannot start overlapping runs');
  for (let i = 0; i < 30; i++) lab.tick();
  assert(text(lab).includes('A · 10 (100%)'), 'Sampling is not forced to a 70/30 quota');
  assert.equal(button(lab, 'Continue'), undefined, 'A large sample is still needed');
  Math.random = () => .99;
  run(100);
  for (let i = 0; i < 30; i++) lab.tick();
  assert(text(lab).includes('B · 100 (100%)'), 'A fresh run draws fresh results');
  assert(button(lab, 'Continue'), 'Only one small and one large run are required');
  const continueLesson = button(lab, 'Continue').props.onPress;
  continueLesson(); continueLesson(); assert.equal(completed, 1);
  run(100); assert.equal(lab.activeTimers(), 1, 'Replaying the same size is allowed');
  lab.unmount(); assert.equal(lab.activeTimers(), 0);

  let prepCompletions = 0;
  const prep = createHarness('components/QuantumPossibilityLabs.tsx', { onComplete() { prepCompletions++; } }, 'PreparationMachine');
  button(prep, 'Run 100 experiments').props.onPress();
  for (let i = 0; i < 20; i++) prep.tick();
  assert(text(prep).includes('observed 0 A and 100 B'));
  Math.random = () => 0;
  button(prep, 'Run this preparation again').props.onPress();
  for (let i = 0; i < 20; i++) prep.tick();
  assert(text(prep).includes('observed 100 A and 0 B'));
  assert.equal(prepCompletions, 1);
  button(prep, 'Run this preparation again').props.onPress();
  prep.unmount(); assert.equal(prep.activeTimers(), 0);

  let preparedCompleted = 0;
  const spin = createHarness('components/SpinLessonLabs.tsx', { onComplete() { preparedCompleted++; } }, 'PreparedSpinCheck');
  button(spin, 'Measure the prepared electron').props.onPress();
  assert(text(spin).includes('Result: spin up'));
  assert(text(spin).includes('same direction gives spin up with certainty'));
  assert.equal(preparedCompleted, 1);
} finally { Math.random = originalRandom; }

console.log(`PASS: ${questionsChecked} quiz explanations, optional reveals, independent sampling, minimum comparisons, replay and cleanup`);
