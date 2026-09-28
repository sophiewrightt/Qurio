const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PNG } = require('pngjs');
const { createHarness } = require('./component-harness.cjs');
const child = (h, name) => h.all(h.render()).find(n => typeof n.type === 'function' && n.type.name === name);

const curtain = createHarness('components/StrangeSpinLesson.tsx', {}, 'StrangeCurtainReveal');
const curtainControl = curtain.nodes('AnimatedView').find(n => n.props.onPanResponderRelease);
curtainControl.props.onPanResponderRelease(null, { dx: -20, vx: 0 });
curtain.flight();
assert(!curtain.nodes('AnimatedView').some(n => n.props.onPanResponderRelease), 'A short curtain swipe opens it permanently');
curtain.unmount();

let sent = 0;
const sorterProps = { travel: { interpolate: x => x }, onSend() { sent++; }, disabled: false };
const sorter = createHarness('components/JointStateLessonLabs.tsx', sorterProps, 'BatchSorter');
const gesture = sorter.nodes('View').find(n => n.props.onPanResponderRelease).props;
assert.equal(gesture.onMoveShouldSetPanResponder(null, { dx: 8, dy: 40 }), false, 'Vertical scrolling remains available');
assert.equal(gesture.onMoveShouldSetPanResponder(null, { dx: 25, dy: 2 }), true);
gesture.onPanResponderRelease(null, { dx: 25, vx: 0 });
assert.equal(sent, 1, 'A short right swipe is sufficient');
sorterProps.disabled = true; sorter.render();
gesture.onPanResponderRelease(null, { dx: 80, vx: 1 });
assert.equal(sent, 1, 'A completed sorter ignores more swipes');

let completed = 0;
const independent = createHarness('components/JointStateLessonLabs.tsx', { onComplete() { completed++; } }, 'IndependentPairLab');
const send = child(independent, 'BatchSorter').props.onSend;
send(); send(); independent.flight();
assert.equal(completed, 1);
assert.equal(independent.peekFlight(), undefined, 'Rapid gestures cannot sample a second batch');
assert(child(independent, 'BatchSorter').props.disabled);
independent.unmount();

const pair = createHarness('components/TeleportationLesson.tsx', { onComplete() { completed++; } }, 'EntanglePair');
const entangle = pair.nodes('Pressable')[0].props.onPress;
entangle(); entangle();
assert.equal(completed, 1, 'Board waits for the entangling animation');
pair.flight(); assert.equal(completed, 2);
assert.equal(pair.peekFlight(), undefined);
pair.unmount();
const cancelled = createHarness('components/TeleportationLesson.tsx', { onComplete() { completed++; } }, 'EntanglePair');
cancelled.nodes('Pressable')[0].props.onPress();
const late = cancelled.peekFlight(); cancelled.unmount(); late({ finished: true });
assert.equal(completed, 2, 'Late entangling callbacks cannot advance an unmounted lesson');

const preload = fs.readFileSync('data/preloadAssets.ts', 'utf8');
const assets = fs.readdirSync('assets/module-3/refinements').filter(f => f.endsWith('.png'));
for (const file of assets) {
  assert(preload.includes(`refinements/${file}`), `${file} is preloaded`);
  const png = PNG.sync.read(fs.readFileSync(`assets/module-3/refinements/${file}`));
  assert(png.data.some((v, i) => i % 4 === 3 && v === 0), `${file} has transparent exterior paper`);
}
for (const group of [['strange-x','strange-a','strange-b'], ['barb-computer','barb-message','barb-scrambled'], ['hacker','hacker-secret','hacker-puzzled','hacker-key']]) {
  const sizes = group.map(file => { const p = PNG.sync.read(fs.readFileSync(`assets/module-3/refinements/${file}.png`)); return [p.width, p.height]; });
  sizes.forEach(size => assert.deepEqual(size, sizes[0], 'Crossfading frames share an aligned canvas'));
}
assert(!fs.readFileSync('components/TeleportationLesson.tsx','utf8').includes('scrambleOrbit'));
console.log('PASS: Chapter 3 short swipes, one-shot batches, entangling gate, cleanup and aligned artwork');
