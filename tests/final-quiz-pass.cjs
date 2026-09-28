const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { createHarness } = require('./component-harness.cjs');
const rules = {};
new Function('exports', ts.transpileModule(fs.readFileSync('data/learnerRules.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(rules);
assert.equal(rules.DAILY_LIFE_LIMIT, 3);
for (const [total, need] of [[5, 4], [6, 5], [7, 5], [10, 8]]) {
  assert.equal(rules.requiredFinalAnswers(total), need);
  assert(!rules.passesFinalQuiz(need - 1, total));
  assert(rules.passesFinalQuiz(need, total));
  assert(!rules.passesFinalQuiz(total + 1, total));
  for (let correct = 0; correct <= total; correct++) {
    let finishes = 0, exits = 0, result;
    const questions = Array.from({ length: total }, (_, i) => ({ question: `Question ${i}`, options: ['yes', 'no'], answer: 'yes', explanation: 'Why this answer works.' }));
    const h = createHarness('components/LessonQuiz.tsx', { questions, minimumCorrect: need, completionActions: false, onNotPassed() { exits++; }, onFinish(score) { finishes++; result = score; } });
    for (let i = 0; i < total; i++) {
      const select = h.nodes('QuizQuestion')[0].props.onSelect;
      select(i < correct ? 'yes' : 'no');
      select('yes'); // repeated taps cannot increase the score
      if (i < total - 1) h.nodes('PrimaryButton')[0].props.onPress();
    }
    const action = h.nodes('PrimaryButton')[0];
    assert.equal(action.props.label, correct < need ? 'Back to Home' : 'Continue');
    action.props.onPress(); action.props.onPress();
    assert.equal(finishes, correct >= need ? 1 : 0);
    assert.equal(exits, correct < need ? 1 : 0);
    if (correct >= need) assert.equal(result, correct);
    h.unmount();
  }
}
let regularFinished = false;
const regular = createHarness('components/LessonQuiz.tsx', { questions: [{ question: 'Q', options: ['yes', 'no'], answer: 'yes' }], onFinish() { regularFinished = true; } });
regular.nodes('QuizQuestion')[0].props.onSelect('no');
regular.nodes('LessonFinishActions')[0].props.onComplete();
assert(regularFinished, 'Ordinary lessons do not require a passing score');

for (const [file, start, expected] of [
  ['screens/LessonNineScreen.tsx', 'Start the quiz', 5],
  ['screens/ModuleThreeLessonEightScreen.tsx', 'Start the final challenge', 5],
  ['screens/ModuleFourLessonSixScreen.tsx', 'Start the final challenge', 5],
]) {
  const h = createHarness(file, { onHome() {}, onComplete() {}, ownedAccessories: [] });
  assert.equal(rules.requiredFinalAnswers(h.nodes('FinalQuizRequirement')[0].props.total), expected);
  h.nodes('PrimaryButton').find(n => n.props.label === start).props.onPress();
  const quiz = h.nodes('LessonQuiz')[0];
  assert.equal(quiz.props.minimumCorrect, expected);
  assert.equal(typeof quiz.props.onNotPassed, 'function');
}
const two = createHarness('screens/ModuleTwoLessonEightScreen.tsx', { onHome() {}, onComplete() {} });
two.nodes('QuantumRulesFinale')[0].props.onStartChallenge();
assert.equal(two.nodes('LessonQuiz')[0].props.minimumCorrect, 4);
const twoIntro = createHarness('components/QuantumRulesFinale.tsx', { onStartChallenge() {} });
assert.equal(twoIntro.nodes('FinalQuizRequirement')[0].props.total, 5);
console.log('PASS: strict >70% boundaries, all four finale requirements, failed-attempt exit, no reward callback, repeat-tap guards and unrestricted regular quiz scores');
