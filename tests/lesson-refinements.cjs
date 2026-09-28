const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
let state = [], cursor = 0, finishFlight;
const React = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat() }),
  useState: initial => { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], v => { state[i] = typeof v === 'function' ? v(state[i]) : v; }]; },
  useRef: initial => { const i = cursor++; return state[i] ||= { current: initial }; },
  useEffect: () => {},
};
const native = { StyleSheet: { create: x => x }, Easing: { linear: x => x }, Animated: {
  Value: class { setValue() {} stopAnimation() {} interpolate() { return 0; } },
  Image: 'AnimatedImage', timing: () => ({ start: cb => { finishFlight = cb; } }),
} };
for (const n of ['SafeAreaView', 'ScrollView', 'View', 'Text', 'Pressable']) native[n] = n;
function load(path) {
  const result = {};
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText;
  new Function('require', 'exports', 'React', code)(name => {
    if (name === 'react') return React;
    if (name === 'react-native') return native;
    if (name.endsWith('theme')) return { colors: {}, fonts: {} };
    if (name.endsWith('probability')) return { zoneWeights: [10,20,40,20,10], sampleZone: () => 2 };
    if (name.endsWith('lessonTwo')) return load('data/lessonTwo.ts');
    const key = name.split('/').pop(); return { [key]: key };
  }, result, React);
  return result;
}
const all = t => !t || typeof t !== 'object' ? [] : [t, ...t.children.flatMap(all)];
const questions = load('data/lessonTwo.ts').lessonTwoQuestions;
assert.equal(questions.length, 2);
assert(questions[1].question.includes('leaf'));
const { LessonTwoScreen } = load('screens/LessonTwoScreen.tsx');
const render = () => { cursor = 0; return LessonTwoScreen({ onHome() {}, onComplete() {} }); };
for (const mode of ['ball','sand','electron']) all(render()).find(n => n.type === 'ThrowExperiment' && n.props.mode === mode).props.onTried();
assert(!all(render()).some(n => n.type === 'MysteryPanel'));
all(render()).find(n => n.type === 'PrimaryButton' && n.props.label === 'Start the quiz').props.onPress();
assert(all(render()).some(n => n.type === 'LessonQuiz'));
assert(!all(render()).some(n => n.type === 'ThrowExperiment'), 'Quiz unmounts notes and experiments');
assert(!all(render()).some(n => n.props.onPress && n.children.includes('‹ Home')), 'Quiz has no link back to notes');
state = [];
const { ProbabilityExperiment } = load('components/ProbabilityExperiment.tsx');
const rewards = [];
const game = () => { cursor = 0; return ProbabilityExperiment({ onComplete() {}, onPredictionComplete: n => rewards.push(n) }); };
const button = label => all(game()).find(n => n.type === 'PrimaryButton' && n.props.label === label);
for (let round = 1; round <= 3; round++) {
  const zone = round === 2 ? 0 : 2;
  all(game()).filter(n => n.type === 'Pressable')[zone].props.onPress();
  button('Test my prediction').props.onPress();
  finishFlight({ finished: true });
  if (round < 3) button('Try another prediction').props.onPress();
}
assert.deepEqual(rewards, [1,2,3], 'Completed predictions award participation XP regardless of luck');
assert(JSON.stringify(game()).includes('possibility of landing in every section'));
for (const file of ['LessonScreen','LessonTwoScreen','DoubleSlitScreen','LessonFourScreen','LessonFiveScreen']) {
  assert(fs.readFileSync('screens/' + file + '.tsx', 'utf8').includes('<LessonBadge number='));
}
assert(fs.readFileSync('screens/LessonFourScreen.tsx', 'utf8').includes('<ParticleAvatar size={150} />'), 'Lesson 4 electron uses the floating avatar');
assert(fs.readFileSync('screens/LessonFourScreen.tsx', 'utf8').match(/coatingColor="#F2C5A7"/g)?.length === 2, 'Lesson 4 scratch panels use the warm peach coating');
for (let face = 1; face <= 6; face++) assert(fs.readFileSync('screens/LessonFourScreen.tsx', 'utf8').includes(`dice-${face}-transparent.png`));
assert(fs.readFileSync('screens/DoubleSlitScreen.tsx', 'utf8').includes('MysteryCard'), 'Lesson 3 restores the requested mystery card after the reveal');
console.log('PASS: lesson badges, streamlined endings, quiz isolation, transfer question and participation rewards');
