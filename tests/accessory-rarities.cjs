const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { createHarness } = require('./component-harness.cjs');
function load(path) {
  const output = {};
  new Function('exports', 'require', ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(output, name => name);
  return output;
}
const shop = load('data/shop.ts');
const { accessoryCatalog } = load('data/customisation.ts');
const { drawAccessories, duplicateRewards, effectiveRarityOdds, rarityOf, rarityOrder } = shop;
assert.deepEqual(shop.standardRarityOdds, { common: 70, rare: 20, 'ultra-rare': 8, legendary: 2 }, 'Creator-approved playtest percentages');
assert.equal(rarityOf('heart-eyes'), 'rare');
assert.equal(rarityOf('monocle'), 'ultra-rare');
assert.equal(rarityOf('kawaii-blush'), 'legendary');
assert.equal(rarityOf('black-spectacles'), 'common');
assert.equal(accessoryCatalog.find(item => item.id === 'monocle').category, 'eyes');
assert.equal(accessoryCatalog.find(item => item.id === 'eyelashes').category, 'eyes');
for (const [roll, expected] of [[0, 'common'], [.69999, 'common'], [.70, 'rare'], [.89999, 'rare'], [.90, 'ultra-rare'], [.97999, 'ultra-rare'], [.98, 'legendary'], [.99999, 'legendary']]) {
  let calls = 0;
  assert.equal(rarityOf(drawAccessories(accessoryCatalog, 1, () => calls++ % 2 === 0 ? roll : 0)[0].id), expected, 'Approved odds boundary');
}
const provisional = effectiveRarityOdds(accessoryCatalog, null);
assert(Math.abs(Object.values(provisional).reduce((a, b) => a + b, 0) - 100) < 1e-9);
for (const rarity of rarityOrder) {
  const pool = accessoryCatalog.filter(item => rarityOf(item.id) === rarity);
  assert(Math.abs(provisional[rarity] - pool.length / accessoryCatalog.length * 100) < 1e-9);
}
// These are TEST weights, not product defaults. Check all boundaries exactly.
const testOdds = { common: 60, rare: 25, 'ultra-rare': 10, legendary: 5 };
for (const [roll, expected] of [[0, 'common'], [.59999, 'common'], [.60, 'rare'], [.84999, 'rare'], [.85, 'ultra-rare'], [.94999, 'ultra-rare'], [.95, 'legendary'], [.99999, 'legendary']]) {
  let calls = 0;
  const item = drawAccessories(accessoryCatalog, 1, () => calls++ % 2 === 0 ? roll : 0, 'standard', testOdds)[0];
  assert.equal(rarityOf(item.id), expected);
  assert.equal(calls, 2, 'First draw selects rarity, second selects item');
}
assert.throws(() => effectiveRarityOdds(accessoryCatalog, { ...testOdds, common: -1 }));
assert.throws(() => effectiveRarityOdds(accessoryCatalog, { ...testOdds, legendary: NaN }));
assert.throws(() => effectiveRarityOdds(accessoryCatalog.filter(item => rarityOf(item.id) !== 'legendary'), testOdds), /no artwork/);
assert.deepEqual(drawAccessories([], 3), []);
const repeated = drawAccessories(accessoryCatalog, 3, () => 0);
assert.equal(new Set(repeated.map(item => item.id)).size, 1);
assert.deepEqual(duplicateRewards(['fedora', 'red-spectacles', 'fedora'], ['red-spectacles']), [false, true, true]);
for (const kind of ['rare', 'ultra-rare', 'legendary']) {
  const purchase = shop.buyPacket(shop.initialShop, kind, 1000, accessoryCatalog, accessoryCatalog.map(item => item.id), () => 0);
  assert.equal(purchase.packet.rewards.length, 1);
  assert.equal(rarityOf(purchase.packet.rewards[0]), kind);
  const opened = shop.ripPacket(purchase, purchase.packet.id, accessoryCatalog.map(item => item.id));
  assert.deepEqual(opened.packet.duplicates, [true]);
  assert.equal(shop.ripPacket(opened, opened.packet.id, []), opened, 'Reopening preserves duplicate flags');
}

const packProps = { rewardIds: ['curly-moustache', 'fedora', 'fedora'], excludeIds: [], onOpen(ids) { packProps.excludeIds = ids; } };
const pack = createHarness('components/RewardPack.tsx', packProps);
const tear = pack.nodes('PrimaryButton')[0].props.onPress;
tear(); tear();
const texts = () => pack.nodes('Text').flatMap(node => node.children).filter(value => typeof value === 'string');
assert.equal(texts().filter(value => value.includes('(You already have this)')).length, 1, 'Only the second same-packet fedora is duplicate, even after ownership rerenders');
const previews = pack.nodes('Image').filter(node => ['Explorer fedora', 'Curly moustache'].includes(node.props.accessibilityLabel));
assert.deepEqual(previews.map(node => node.props.accessibilityLabel), ['Explorer fedora', 'Explorer fedora', 'Curly moustache'], 'Rewards are grouped by rarity');
assert(previews.every(node => node.props.style.width > 88 && node.props.style.height > 72));
const resumed = createHarness('components/RewardPack.tsx', { rewardIds: ['fedora'], excludeIds: ['fedora'], duplicateFlags: [false], initiallyOpen: true });
assert(!resumed.nodes('Text').some(node => node.children.some(value => typeof value === 'string' && value.includes('already have'))), 'A newly unlocked result stays new when reopened');

let writes = 0;
const props = { particle: 'electron', equipped: {}, owned: [], electronUnlocked: true, photonUnlocked: false, creatorPreviewAvailable: true, onParticle() { writes++; }, onAccessory() { writes++; } };
const wardrobe = createHarness('screens/CustomisationScreen.tsx', props);
const press = label => wardrobe.nodes('Pressable').find(node => node.props.accessibilityLabel === label).props.onPress();
press('Creator preview');
press('Next other particles');
assert.equal(wardrobe.nodes('ParticleAvatar')[0].props.particle, 'photon');
press('Glasses drawer'); press('Next glasses');
assert.deepEqual(wardrobe.nodes('ParticleAvatar')[0].props.accessories, ['red-spectacles']);
assert.equal(writes, 0, 'Preview never calls real equipment handlers');
assert.deepEqual(props.owned, []);
press('Creator preview');
assert.equal(wardrobe.nodes('ParticleAvatar')[0].props.particle, 'electron');
assert.deepEqual(wardrobe.nodes('ParticleAvatar')[0].props.accessories, []);
assert(wardrobe.nodes('Pressable').find(node => node.props.accessibilityLabel === 'Next glasses').props.disabled, 'Normal wardrobe still requires unlocks');
console.log('PASS: rarity mapping, independent weighted draws, repeated rewards, opening-time duplicate labels, sorted reveal, larger previews and isolated creator try-on');
