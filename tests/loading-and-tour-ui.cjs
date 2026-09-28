const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { createHarness } = require('./component-harness.cjs');
const data = {};
new Function('exports', ts.transpileModule(fs.readFileSync('data/loading.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(data);
assert.equal(data.loadingMessages.length, 33);
assert.equal(new Set(data.loadingMessages).size, 33);
let previous;
for (let i = 0; i < 100; i++) {
  const shuffled = data.shuffledLoadingMessages(previous);
  assert.deepEqual([...shuffled].sort(), [...data.loadingMessages].sort());
  assert.notEqual(shuffled[0], previous);
  previous = shuffled.at(-1);
}
const fixed = data.shuffledLoadingMessages(undefined, () => 0);
assert.notEqual(data.shuffledLoadingMessages(fixed[0], () => 0)[0], fixed[0]);
const loading = createHarness('components/LoadingScreen.tsx');
const phrase = () => loading.nodes('Text')[0].children[0];
const cycle = [phrase()];
for (let i = 1; i < 33; i++) { loading.tick(); cycle.push(phrase()); }
assert.equal(new Set(cycle).size, 33);
loading.tick(); assert.notEqual(phrase(), cycle.at(-1));
assert.equal(loading.activeTimers(), 1);
assert.equal(loading.nodes('AnimatedView').length, 1);
assert(loading.nodes('Image').some(n => n.props.source.endsWith('loading_symbol.jpg')));
loading.unmount(); assert.equal(loading.activeTimers(), 0);
assert(fs.readFileSync('data/preloadAssets.ts', 'utf8').includes('loading_symbol.jpg'));
assert(!fs.readFileSync('App.tsx', 'utf8').includes('loadingLine'));

for (const step of ['welcome', 'profile', 'packets', 'gift', 'achievements', 'buy', 'shopPause']) {
  const calls = [];
  const shop = ['packets', 'gift', 'buy', 'shopPause'].includes(step);
  const overlay = createHarness('components/Onboarding.tsx', {
    host: shop ? 'shop' : undefined,
    tourContext: { enabled: true, screen: shop ? 34 : 0, state: { step }, event: (...args) => calls.push(args), target: step === 'buy' ? 'buy-packet' : step, rect: { x: 10, y: 120, width: 100, height: 50 } },
  }, 'TourOverlay');
  const action = ['achievements', 'buy', 'shopPause'].includes(step);
  const presses = overlay.nodes('Pressable');
  assert(presses.length, 'Backdrop always intercepts clicks');
  presses.forEach(n => n.props.onPress?.());
  assert.equal(calls.length > 0, !action, 'Only narration advances from anywhere');
  for (const call of calls) assert.deepEqual(call, ['continue', step]);
  const cue = presses.find(n => n.props.accessibilityLabel === 'Tap anywhere to continue introduction');
  assert.equal(Boolean(cue), !action);
  if (shop && step !== 'shopPause') assert(presses.some(n => n.props.style?.[0]?.backgroundColor === '#242031B3'), 'Shop guidance dims the screen');
  overlay.unmount();
}
const props = { xp: 0, completed: [], collected: true, tourState: { step: 'waiting-four' } };
const home = createHarness('screens/HomeScreen.tsx', props);
const copy = () => home.nodes('Text').flatMap(n => n.children).filter(x => typeof x === 'string');
assert.equal(copy().filter(x => x === 'Keep playing levels to unlock!').length, 3);
assert(copy().includes('Keep playing levels to unlock!'));
props.tourState = { step: 'done' };
assert(!copy().includes('click here to see your achievements!'));
assert(!copy().includes('click here to see the terminology you’ve unlocked'));
console.log('PASS: loading shuffle cycles, timer cleanup, supplied sprite, narration tap surfaces, shop dimming and locked feature copy');
