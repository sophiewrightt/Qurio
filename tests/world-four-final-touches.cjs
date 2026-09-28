const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PNG } = require('pngjs');
const { createHarness } = require('./component-harness.cjs');
const source = name => fs.readFileSync(name, 'utf8');
const home = source('screens/HomeScreen.tsx');
for (const question of ['What even is quantum?', 'What are some rules that the quantum particles must follow?', 'What are differences in quantum particles and their families?']) assert(home.includes(question));
const chemistry = source('components/FermionChemistryLesson.tsx');
assert(chemistry.includes('column-shading'));
assert(!chemistry.includes('Highlight next column'));
assert(chemistry.includes('tintColor'));
const identity = createHarness('components/ParticleIdentityLesson.tsx', {left:'electron', right:'photon'}, 'IdentityCardPair');
identity.nodes('Pressable')[0].props.onPress();
const modal = JSON.stringify(identity.nodes('Modal')[0]);
assert(!modal.includes('barcode is'));
assert(!modal.includes('Quark mass'));
const office = createHarness('components/FriendlyBosonsLesson.tsx', {}, 'PhotonOffice');
const positions = office.nodes('AnimatedView').map(n => n.props.style?.transform).filter(Boolean);
assert.equal(new Set(positions.map(p => [p[0].translateX.outputRange[0],p[1].translateY.outputRange[0]].join(','))).size,10, 'All ten photons start in distinct places');
office.unmount();
const preloads = source('data/preloadAssets.ts');
for (const name of ['alex_full_body','unfriendly_electron','friendly_photon','photon_+_co']) {
  const file = `assets/module-4/refinements/${name}.png`;
  assert(preloads.includes(file));
  const p = PNG.sync.read(fs.readFileSync(file));
  assert(p.width<=900 && p.height<=900);
  for(const pixel of [0,p.width-1,(p.height-1)*p.width,p.width*p.height-1]) assert.equal(p.data[pixel*4+3],0);
}
console.log('PASS: world questions, simple IDs, automatic columns, ten distinct photons and preloaded preserved artwork');
