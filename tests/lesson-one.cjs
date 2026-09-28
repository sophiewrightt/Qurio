const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
let state = [], cursor = 0;
const React = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat() }),
  useState: initial => { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], value => { state[i] = value; }]; },
  useRef: initial => { const i = cursor++; return state[i] ||= { current: initial }; },
  useEffect: () => {},
};
function load(file) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true } }).outputText;
  new Function('require', 'exports', 'React', code)(name => {
    if (name === 'react') return React;
    if (name === 'react-native') return { ...Object.fromEntries(['ScrollView', 'Text', 'View', 'Image'].map(n => [n,n])), StyleSheet: { create: s => s } };
    if (name.endsWith('theme')) return { colors: {}, fonts: {}, spacing: {} };
    if (name.endsWith('KnowledgeContext')) return { useKnowledge: () => () => {} };
    if (name.endsWith('QuizQuestion')) return { QuizQuestion: 'QuizQuestion' };
    if (name.endsWith('PrimaryButton')) return { PrimaryButton: 'PrimaryButton' };
    if (name.endsWith('LessonFinishActions')) return { LessonFinishActions: 'LessonFinishActions' };
    if (name.endsWith('ZoomTrail')) return { ZoomTrail: 'ZoomTrail' };
    if (name.endsWith('lessonOne')) return load('data/lessonOne.ts');
    if (name.endsWith('FramedSprite')) return { ...load('components/FramedSprite.tsx'), FramedSprite: 'FramedSprite' };
    if (/\.(png|jpg)$/.test(name)) return name;
    if (name === './QuizCompanion') return { QuizCompanion: 'QuizCompanion' };
    throw Error(name);
  }, exports, React);
  return exports;
}
function find(tree, type) {
  if (!tree || typeof tree !== 'object') return;
  if (tree.type === type) return tree;
  for (const child of tree.children || []) { const result = find(child, type); if (result) return result; }
}
const { lessonBeats, lessonQuestions } = load('data/lessonOne.ts');
assert.equal(lessonBeats.length, 6);
assert.equal(lessonQuestions.length, 3);
assert.equal(lessonQuestions[2].answer, 'Elementary');
assert.equal(lessonQuestions[1].answer, 'Electron');
assert(lessonQuestions[1].question.includes('electricity'));
assert.equal(lessonBeats[3].moleculeNote, true);
const { LessonQuiz } = load('components/LessonQuiz.tsx');
const results = [];
const render = () => { cursor = 0; return LessonQuiz({ questions: lessonQuestions, onFinish: score => results.push(score) }); };
assert(!find(render(), 'PrimaryButton'), 'Cannot advance before answering');
for (let i = 0; i < 3; i++) {
  const q = find(render(), 'QuizQuestion');
  assert.equal(q.props.number, i + 1);
  assert.equal(q.props.total, 3);
  q.props.onSelect(i === 1 ? 'Photon' : lessonQuestions[i].answer);
  q.props.onSelect(lessonQuestions[i].answer);
  assert(find(render(), 'QuizQuestion').props.locked);
  if (i < 2) {
    const button = find(render(), 'PrimaryButton');
    button.props.onPress();
    button.props.onPress();
  } else {
    const actions = find(render(), 'LessonFinishActions');
    actions.props.onComplete();
    actions.props.onComplete();
  }
}
assert.deepEqual(results, [2], 'Completion is single-fire; repeated taps cannot inflate score');
console.log('PASS: six scales, electricity question, three-question quiz, answer locks, score and completion guards');
assert(lessonBeats[2].art.source.endsWith('.png'), 'Rubber particle must use transparent PNG artwork');
const { LessonSection } = load('components/LessonSection.tsx');
state = [];
let moleculeInspections = 0;
const moleculeSection = () => { cursor = 0; return LessonSection({ beat: lessonBeats[3], index: 3, onInspect: () => moleculeInspections++ }); };
const moleculeStage = () => moleculeSection().children.find(child => child?.props?.onLayout);
const moleculeSurface = () => moleculeStage().children.find(child => child?.props?.testID === 'inspection-touch-surface');
assert.equal(moleculeSurface().props.accessibilityLabel, 'Hold anywhere to look inside');
moleculeSurface().props.onResponderGrant({ nativeEvent: { locationX: 24, locationY: 170 } });
moleculeSurface().props.onResponderMove({ nativeEvent: { locationX: 285, locationY: 120 } });
assert.equal(moleculeInspections, 2, 'Every part of the molecule interaction surface activates the lens');
state = [];
const holdingChanges = [];
let discoveries = 0;
const section = () => { cursor = 0; return LessonSection({ beat: lessonBeats[5], index: 5, onHolding: value => holdingChanges.push(value), onInspect: () => discoveries++ }); };
const stage = () => section().children.find(child => child?.props?.onLayout);
const surface = () => stage().children.find(child => child?.props?.testID === 'inspection-touch-surface');
assert.equal(surface().props.collapsable, false);
assert.equal(surface().props.pointerEvents, 'box-only');
assert.equal(surface().props.onStartShouldSetResponder(), true);
assert.equal(surface().props.onStartShouldSetResponderCapture(), true, 'Touch layer wins before the ScrollView');
surface().props.onResponderGrant({ nativeEvent: { locationX: 100, locationY: 100 } });
assert.equal(stage().children[1].props.pointerEvents, 'none', 'Lens must not steal touches');
assert.equal(surface().props.onResponderTerminationRequest(), false, 'Scroll must not steal an active inspection');
surface().props.onResponderMove({ nativeEvent: { locationX: 160, locationY: 170 } });
assert.equal(discoveries, 2);
surface().props.onResponderRelease();
assert.equal(stage().children[1].props.style.opacity, 0, 'Release hides the preloaded lens');
surface().props.onResponderGrant({ nativeEvent: { locationX: 100, locationY: 100 } });
surface().props.onResponderTerminate();
assert.equal(stage().children[1].props.style.opacity, 0, 'Cancellation hides the preloaded lens');
assert.deepEqual(holdingChanges, [true, false, true, false], 'Release/cancellation restores scrolling');
console.log('PASS: immediate inspection, dragging, gesture ownership, release/cancel cleanup and PNG mapping');
assert.equal(stage().children[1].props.collapsable, false, 'Lens keeps native bounds on iOS');
assert.equal(stage().children[1].props.style.width, 180);
assert.equal(stage().children[1].props.style.height, 200);
assert(stage().children[1].props.style.zIndex > surface().props.style.zIndex, 'Lens renders above touch surface');
surface().props.onResponderGrant({ nativeEvent: { touches: [{ locationX: 110, locationY: 125 }] } });
assert.equal(stage().children[1].props.style.opacity, 1);
assert.equal(stage().children[1].props.style.left, 45);
assert.equal(stage().children[1].props.style.top, 60);
assert(!JSON.stringify(section()).includes('Looking inside'));
assert(!JSON.stringify(section()).includes('Touch detected'));
surface().props.onResponderMove({ nativeEvent: { locationX: NaN, locationY: NaN } });
assert(Number.isFinite(stage().children[1].props.style.left));
assert(Number.isFinite(stage().children[1].props.style.top));
console.log('PASS: persistent image, explicit native bounds, stacking, iOS touch coordinates and no distracting hold messages');
