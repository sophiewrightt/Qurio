const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { PNG } = require('pngjs');
const { createHarness } = require('./component-harness.cjs');
const read = name => fs.readFileSync(name, 'utf8');
const text = h => h.nodes('Text').flatMap(n => n.children).join('');

// The default electron is not an alternative skin, and empty drawers explain
// how to unlock more without offering a no-op carousel.
const wardrobe = createHarness('screens/CustomisationScreen.tsx', {
  particle: 'electron', particleName: 'Orbit', equipped: {}, owned: [], electronUnlocked: true,
  photonUnlocked: false, onParticle() { throw Error('No alternative unlocked'); }, onAccessory() {}, onBack() {},
});
assert(text(wardrobe).includes('You don’t have any other particles, keep learning to unlock more!'));
assert(!text(wardrobe).includes('TRYING ON'));
assert(wardrobe.nodes('Pressable').filter(n => /^(Previous|Next)/.test(n.props.accessibilityLabel)).every(n => n.props.disabled));
assert.equal(wardrobe.nodes('ParticleAvatar')[0].props.discovered, undefined);
wardrobe.nodes('View').find(n => n.props.onLayout).props.onLayout({ nativeEvent: { layout: { width: 272 } } });
assert.equal(wardrobe.nodes('ParticleAvatar')[0].props.size, 176, '320px phones leave 48px for each arrow');
assert(!read('components/ParticleAvatar.tsx').includes('shadowRadius'), 'No square avatar glow in Home, lessons or wardrobe');

assert(!read('components/LessonSection.tsx').includes('Looking inside'));
assert(read('components/LessonSection.tsx').includes("holdHint: { color: '#C93432'"));
assert(!read('screens/LessonTwoScreen.tsx').includes('Quantum rules apply to the particles inside a basketball too'));
assert(read('components/MysteryCard.tsx').includes('title="Wave-particle duality"'));
assert(!read('components/QuantumPhone.tsx').includes('All four clues found'));
assert(!read('screens/LessonFiveScreen.tsx').includes('Next we’ll explore'));

// Both diagrams use the same shooter; the censor covers both slit heights.
for (const name of ['ExperimentDiagram','ProbabilityExperiment']) {
  assert(read(`components/${name}.tsx`).includes('<ExperimentSource'));
  const file = read(`components/${name}.tsx`);
  assert(file.includes('width: 120, height: 120'));
  assert(file.includes('censored-transparent.png'));
}
for (const count of [0, 1, 2, 3]) {
  const diagram = createHarness('components/ExperimentDiagram.tsx', {
    mode: 'electron', revealed: true, count, firing: true, possibilities: true,
    progress: { interpolate: value => value },
  });
  const flight = diagram.nodes('AnimatedImage')[0].props.style[1];
  assert.equal(flight.transform[1].translateY.outputRange[1], count % 2 ? 161 : 101);
  assert.deepEqual(flight.opacity.inputRange, [0, 0.05, 0.38, 0.5], 'No measured trajectory is invented through the hidden slit region');
}
for (const kind of ['air','heat']) {
  const effects = createHarness('components/EnvironmentEffects.tsx', { kind, width: 272 });
  assert.equal(effects.nodes('Image').length, 6);
  assert(effects.nodes('Image').every(n => n.props.source.includes(`${kind}-particle-transparent.png`)));
}
const animation = read('components/LessonFiveAnimations.tsx');
assert.equal((animation.match(/useNativeDriver: Platform.OS !== 'web'/g) || []).length, 2, 'Hat and dance loops use explicit JS looping on web');
assert(animation.includes('return () => animation.stop()'));
assert(read('components/ExperimentDiagram.tsx').includes('testID="incoming-wavefronts"'));

// Censor lettering survives, paper outside it is clear, and supplied crops are
// both globally registered and available in the Chapter 1 preload group.
const censor = PNG.sync.read(fs.readFileSync('assets/ui/censored-transparent.png'));
assert.equal(censor.width, censor.height);
assert.equal(censor.data[3], 0);
let opaqueWhite = 0;
for(let i=0;i<censor.data.length;i+=4) if(censor.data[i]>235 && censor.data[i+1]>235 && censor.data[i+2]>235 && censor.data[i+3]>245) opaqueWhite++;
assert(opaqueWhite > 1000);
const preload = {};
const achievementArt = {};
new Function('exports','require',ts.transpileModule(read('data/achievementArt.ts'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(achievementArt, name => name);
new Function('exports','require',ts.transpileModule(read('data/preloadAssets.ts'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(preload, name => name === './achievementArt' ? achievementArt : name);
for(const name of ['bonds','neutron','neutron-lens']) {
  const suffix = `/lesson-1/refinements/${name}.png`;
  assert(preload.preloadAssets.some(p=>p.endsWith(suffix)));
  assert(preload.preloadAssetsByWorld[1].some(p=>p.endsWith(suffix)));
  assert(read('data/lessonOne.ts').includes(suffix));
}
console.log('PASS: Chapter 1 copy, progressive controls, shared launcher, alternating approaches, matching environment sprites, replay-safe web loops, responsive wardrobe and preserved artwork');
