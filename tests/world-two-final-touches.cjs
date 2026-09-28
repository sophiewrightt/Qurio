const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createHarness } = require('./component-harness.cjs');
const text = h => h.nodes('Text').flatMap(n => n.children).join('');

const unlock = createHarness('components/PhotonUnlockModal.tsx', { visible: true, score: 2, onUsePhoton() {}, onKeepElectron() {} });
assert(!/CHECKPOINT|Atoms exchange|A tiny packet/.test(text(unlock)));
assert.equal(unlock.nodes('PrimaryButton').length, 2);
assert.equal(unlock.nodes('Image').length, 1);

const flame = createHarness('components/PhotonLessonLabs.tsx', { onAnswer() {} }, 'FlameTest');
const tab = symbol => flame.nodes('Pressable').find(n => n.props.accessibilityLabel?.startsWith(symbol));
assert.equal(tab('Na').props.style.filter(Boolean).length, 2);
flame.nodes('Pressable').find(n => n.props.accessibilityLabel?.includes('tap to ignite')).props.onPress();
assert.equal(tab('Na').props.accessibilityLabel, 'Na, tested');
assert.equal(tab('Na').props.style.at(-1).backgroundColor, '#DCEBE0');
tab('Li').props.onPress();
assert.equal(tab('Na').props.style.at(-1).backgroundColor, '#DCEBE0', 'Tested shading persists after selecting another element');
assert(!tab('Li').props.accessibilityLabel.includes('tested'), 'Selecting alone does not mark an element tested');
flame.unmount(); assert.equal(flame.activeTimers(), 0);

const machine = createHarness('components/QuantumPossibilityLabs.tsx', { onComplete() {} }, 'PreparationMachine');
assert(text(machine).includes('two results that are possible'));
assert(text(machine).includes('probabilities of each outcome'));
assert(!text(machine).includes('Two-outcome possibility maker'));
assert(machine.nodes('PossibilityCloud')[0].props.outcomeLetters);
assert.equal(machine.nodes('PossibilityCloud')[0].props.leftLabel, 'A\n75%');
machine.nodes('Pressable').find(n => n.children.some(c => c.children?.includes('Balanced'))).props.onPress();
assert.equal(machine.nodes('PossibilityCloud')[0].props.leftLabel, 'A\n50%');
const cloud = createHarness('components/PossibilityCloud.tsx', { outcomeLetters: true, leftLabel: 'A\n50%', rightLabel: 'B\n50%' });
assert.equal(cloud.nodes('Image').filter(n => ['A','B'].includes(n.props.accessibilityLabel)).length, 2);
assert.equal(text(cloud), '50%50%');
assert(cloud.nodes('AnimatedView').some(n => n.props.style?.some(s => s?.transform?.[0]?.translateY)), 'Letters float inside the cloud');
cloud.unmount();
const paths = createHarness('components/SuperpositionLessonLabs.tsx', { onComplete() {} }, 'QuantumCombination');
assert(paths.nodes('PossibilityCloud')[0].props.outcomeLetters);
assert.equal(paths.nodes('TerminologyCard').length, 0, 'The cloud is introduced here, but superposition is named after the evidence');

let completed = 0;
const waves = createHarness('components/SlitWaveComparison.tsx', { onComplete() { completed++; } });
const go = () => waves.nodes('PrimaryButton')[0].props.onPress();
assert.equal(waves.nodes('ExperimentDiagram')[0].props.waveOpenings, 'a');
const first = waves.nodes('PrimaryButton')[0].props.onPress;
first(); first();
assert.equal(waves.nodes('PrimaryButton').length, 0, 'No duplicate launches while a wave is travelling');
waves.flight(); assert.equal(waves.nodes('ExperimentDiagram')[0].props.screenPattern, 'a');
go(); waves.flight();
assert.equal(waves.nodes('ExperimentDiagram')[0].props.screenPattern, 'sum');
assert.equal(waves.nodes('ExperimentDiagram')[0].props.waveActive, false, 'The sum is a comparison of finished separate runs, not a new ongoing two-slit wave');
assert.equal(completed, 0, 'Adding separate results does not complete the coherent comparison');
go(); waves.flight(); assert.equal(completed, 1);
assert.equal(waves.nodes('ExperimentDiagram')[0].props.screenPattern, 'interference');
assert.equal(waves.nodes('ExperimentDiagram')[0].props.waveActive, true);
waves.nodes('Pressable')[0].props.onPress();
assert.equal(waves.nodes('ExperimentDiagram')[0].props.screenPattern, 'sum');
waves.nodes('Pressable')[1].props.onPress(); assert.equal(completed, 1);
const cancelled = createHarness('components/SlitWaveComparison.tsx', { onComplete() { throw Error('Unmounted'); } });
cancelled.nodes('PrimaryButton')[0].props.onPress(); cancelled.unmount(); cancelled.flight();
assert.equal(cancelled.nodes('PrimaryButton').length, 0, 'An unmounted animation cannot advance');

const diagram = pattern => createHarness('components/ExperimentDiagram.tsx', { mode: 'wave', revealed: true, screenPattern: pattern, waveOpenings: 'a' });
for(const pattern of ['sum','interference']) {
  const h = diagram(pattern);
  assert.equal(h.nodes('ExperimentSource').length, 1);
  assert.equal(h.nodes('View').filter(n => n.props.testID === 'covered-wave-slit').length, 1);
  const screen = h.nodes('AnimatedView').find(n => n.props.testID === 'wave-screen-intensity');
  const strips = screen.children.flat();
  assert.equal(strips.length, 38);
  if(pattern === 'interference') assert(strips.some(n => n.props.style.opacity < 0.01), 'Cancellation is visibly dark on the actual screen');
  else assert(strips.every(n => n.props.style.opacity > 0.09), 'Adding separate intensities has no cancellation gaps');
}
const avatar = createHarness('components/ParticleAvatar.tsx', { particle: 'photon', size: 200, accessories: ['red-spectacles'], floating: false });
const photon = avatar.nodes('Image')[0].props.style[1];
assert.equal(photon.width, 296, 'The yellow core, not the halo, sets photon scale');
assert.equal(avatar.nodes('Image')[1].props.style[1].width, 200, 'Accessories retain the common electron canvas');
assert.equal(avatar.nodes('AnimatedView')[0].props.pointerEvents, 'none', 'The larger halo cannot block wardrobe arrows');
assert(!fs.readFileSync('components/SuperpositionLessonLabs.tsx','utf8').includes('styles.keyPoint'), 'Only one solved explanation remains');
console.log('PASS: Chapter 2 copy, tested elements, minimal photon unlock, core scaling, cartoon A/B clouds, slit comparison gates, screen intensity, cleanup and replay');
