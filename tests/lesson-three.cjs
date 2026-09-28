const assert = require('node:assert/strict');
const fs = require('node:fs');
const screen = fs.readFileSync('screens/DoubleSlitScreen.tsx', 'utf8');
assert(screen.includes('Imagine firing lots of basketballs one at a time through two openings.'));
assert(screen.includes('If the basketballs pass through the slits without bouncing on the walls, where would you expect most of them to land on the screen?'));
assert(screen.includes("When we shoot electrons through the wall one at a time, what do you think we'll see?"));
assert(!screen.includes('Illustrated motion'));
assert(screen.includes('correct="Something else"'));
assert(screen.includes("answer === 'Something else'"));
assert(screen.includes('illustration={<WallPattern kind={option.pattern} />}'));
assert(!screen.includes('electronAttempts'));
assert(!screen.includes('electronOptions'));
assert(screen.includes('<ExperimentDiagram mode="electron" revealed count='));
assert(screen.includes('attempted={ballAttempts}'));
assert(screen.includes('attempted={waveAttempts}'));
assert(screen.includes('<MysteryCard onContinue={onContinue} />'));
const ts = require('typescript');
const source = fs.readFileSync('components/WallPattern.tsx', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText;
const result = {};
const React = { createElement: (type, props, ...children) => ({ type, props, children: children.flat() }) };
new Function('require', 'exports', 'React', code)(() => ({ View: 'View', StyleSheet: { create: x => x } }), result, React);
const two = result.WallPattern({ kind: 'two' });
const even = result.WallPattern({ kind: 'even' });
const interference = result.WallPattern({ kind: 'interference' });
assert.equal(two.children.length, 36);
assert.equal(even.children.length, 72);
assert.equal(interference.children.length, 63);
for (const preview of [two, even, interference]) {
  assert.equal(preview.props.style.width, 90);
  for (const dot of preview.children) {
    const style = dot.props.style[1];
    assert(style.left >= 0 && style.left < 87 && style.top >= 0 && style.top < 51);
  }
}
assert.notDeepEqual(two, even);
assert.notDeepEqual(even, interference);
console.log('PASS: Lesson 3 option mappings, answer feedback, distinct wall previews and preview bounds');

const { createHarness } = require('./component-harness.cjs');
const diagram = createHarness('components/ExperimentDiagram.tsx', { mode: 'electron', revealed: true, count: 300 });
const arrivals = diagram.nodes('View').filter(node => Array.isArray(node.props.style) && node.props.style[0]?.width === 4);
const bands = [29, 62, 95, 128, 161];
const totals = bands.map(band => arrivals.filter(node => {
  const y = node.props.style[1].top;
  return Math.abs(y - band) === Math.min(...bands.map(value => Math.abs(y - value)));
}).length);
assert.deepEqual(totals, [30, 60, 120, 60, 30], 'The central fringe is brightest and outer fringes fade symmetrically');
console.log('PASS: full electron pattern follows a fading diffraction envelope');
