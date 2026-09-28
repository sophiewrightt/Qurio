const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PNG } = require('pngjs');
const { createHarness } = require('./component-harness.cjs');

const textContent = screen => screen.all(screen.render()).flatMap(node => node.type === 'Text' ? node.children : []).join('');

let renamed = '';
const home = createHarness('screens/HomeScreen.tsx', { xp: 120, collected: true, particle: 'electron', particleName: '', completed: [], onContinue() {}, onSelectLesson() {}, onCustomise() {}, onRenameParticle(name) { renamed = name; } });
assert(!textContent(home).includes('your particle friend'));
assert.equal(home.nodes('TextInput')[0].props.placeholder, 'Tap here to rename your pal');
home.nodes('TextInput')[0].props.onChangeText('Sparky');
assert.equal(renamed, 'Sparky');
assert(textContent(home).includes('electron'));
assert(textContent(home).includes('Customise your particle!'));
assert(home.nodes('Image').some(node => String(node.props.source).includes('coat-hanger-transparent.png')));
assert(home.nodes('Image').some(node => String(node.props.source).includes('quanta-icon-transparent.png')));
assert.equal(home.nodes('ParticleAvatar').find(node => node.props.groundShadow).props.groundShadow, true, 'The Home particle has a grounded shadow');

let chosenParticle;
const accessoryChanges = [];
const wardrobe = createHarness('screens/CustomisationScreen.tsx', {
  particle: 'electron', particleName: 'Sparky', equipped: {}, owned: ['red-spectacles'], electronUnlocked: true, photonUnlocked: true,
  knowledge: 120, energy: 5, quanta: 120, onParticle(id) { chosenParticle = id; }, onAccessory(category, id) { accessoryChanges.push([category, id]); }, onBack() {},
});
assert(!textContent(wardrobe).includes('Sparky'), 'The name stays on Home, not in the wardrobe');
assert(textContent(wardrobe).includes('Qurio Boutique'));
assert.equal(wardrobe.nodes('ParticleAvatar')[0].props.floating, false, 'The particle rests on its stool in the wardrobe');
for (const label of ['Particles drawer, open', 'Glasses drawer', 'Faces drawer', 'Hats drawer']) assert(wardrobe.nodes('Pressable').some(node => node.props.accessibilityLabel === label));
wardrobe.nodes('Pressable').find(node => node.props.accessibilityLabel === 'Next other particles').props.onPress();
assert.equal(chosenParticle, 'photon', 'Wardrobe arrows cycle through unlocked particle types');

let chosenGluon;
const gluonWardrobe = createHarness('screens/CustomisationScreen.tsx', {
  particle: 'photon', equipped: {}, owned: [], electronUnlocked: true, photonUnlocked: true, gluonUnlocked: true,
  knowledge: 120, energy: 5, quanta: 120, onParticle(id) { chosenGluon = id; }, onAccessory() {}, onBack() {},
});
gluonWardrobe.nodes('Pressable').find(node => node.props.accessibilityLabel === 'Next other particles').props.onPress();
assert.equal(chosenGluon, 'gluon', 'The unlocked gluon joins the same particle-skin carousel');
wardrobe.nodes('Pressable').find(node => node.props.accessibilityLabel === 'Glasses drawer').props.onPress();
assert(textContent(wardrobe).includes('No glasses'));
wardrobe.nodes('Pressable').find(node => node.props.accessibilityLabel === 'Next glasses').props.onPress();
assert.deepEqual(accessoryChanges.at(-1), ['eyes', 'red-spectacles'], 'Wardrobe arrows equip an unlocked accessory');
wardrobe.nodes('Pressable').find(node => node.props.accessibilityLabel === 'Hats drawer').props.onPress();
assert(textContent(wardrobe).includes('You don’t have any hats, keep learning to unlock more!'));
assert.equal(wardrobe.nodes('Pressable').find(node => node.props.accessibilityLabel === 'Next hats').props.disabled, true);

const app = createHarness('App.tsx');
const initialHome = app.nodes('HomeScreen')[0];
initialHome.props.onRenameParticle('Orbit');
assert.equal(app.nodes('HomeScreen')[0].props.particleName, 'Orbit', 'Particle names persist in App state');
app.nodes('HomeScreen')[0].props.onCustomise();
assert.equal(app.nodes('CustomisationScreen')[0].props.particleName, 'Orbit');
app.nodes('CustomisationScreen')[0].props.onParticle('photon');
assert.equal(app.nodes('CustomisationScreen')[0].props.particleName, 'Orbit', 'Changing the particle skin keeps the one profile name');

const avatarSource = fs.readFileSync('components/ParticleAvatar.tsx', 'utf8');
assert(avatarSource.includes('floating = true') && avatarSource.includes('if (!floating)'), 'Wardrobe can turn off the home floating animation');
assert(!avatarSource.includes('styles.orbit'), 'Particle avatars no longer render the decorative orbit line');
assert(avatarSource.includes("particle === 'photon' ? (happy ? 1.32 : 1.48)"), 'Photon and electron face circles receive the measured optical correction');
assert(avatarSource.includes('width: size, height: size, left: 0, top: 0'), 'Accessories use the exact same canvas as the particle');
const electron = PNG.sync.read(fs.readFileSync('assets/particles/electron-avatar.png'));
assert.equal(electron.width, electron.height, 'The electron uses a square wardrobe canvas');
const colouredWidth = (png, matches) => {
  let minX = png.width, maxX = -1;
  for (let y = 0; y < png.height; y += 1) for (let x = 0; x < png.width; x += 1) {
    const offset = (y * png.width + x) * 4;
    if (png.data[offset + 3] > 40 && matches(png.data[offset], png.data[offset + 1], png.data[offset + 2])) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
  }
  return maxX - minX + 1;
};
const photon = PNG.sync.read(fs.readFileSync('assets/lesson-9/photon-default-transparent.png'));
const gluon = PNG.sync.read(fs.readFileSync('assets/module-3/lesson-2/gluon-default-transparent.png'));
const electronCircle = colouredWidth(electron, (red, green, blue) => blue > 180 && red < 85 && green > 130) / electron.width;
const photonCircle = colouredWidth(photon, (red, green, blue) => red > 180 && green > 175 && blue < 70 && green / red > 0.83) / photon.width * 1.48;
const gluonCircle = colouredWidth(gluon, (red, green, blue) => green > 130 && green > red * 1.15 && green > blue * 1.05) / gluon.width;
assert(Math.abs(electronCircle - photonCircle) < 0.015, 'Electron and photon internal circles render at the same diameter');
assert(Math.abs(colouredWidth(electron, (r,g,b) => b > 160 && b > r * 1.3 && b > g) / electron.width - gluonCircle) < 0.015, 'Electron and gluon internal circles render at the same diameter');
for (const file of fs.readdirSync('assets/accessories').filter(file => file.endsWith('-transparent.png') && file !== 'sparkly-eyes-transparent.png')) {
  const accessory = PNG.sync.read(fs.readFileSync(`assets/accessories/${file}`));
  assert.deepEqual([accessory.width, accessory.height], [electron.width, electron.height], `${file} shares the electron canvas`);
}
for (const asset of ['coat-hanger-transparent.png', 'quanta-icon-transparent.png']) {
  assert(fs.existsSync(`assets/ui/${asset}`));
  assert(fs.readFileSync('data/preloadAssets.ts', 'utf8').includes(asset), `${asset} is preloaded`);
}
const homeSource = fs.readFileSync('screens/HomeScreen.tsx', 'utf8');
assert(homeSource.includes('complete && styles.completedText'));
assert(homeSource.includes('style={styles.pathCheck}'));
assert(!homeSource.includes('pathRowComplete'), 'Completed lessons use a green label and tick instead of row shading');
for (const world of ['world-1', 'world-2', 'world-3']) for (const file of fs.readdirSync(`assets/lesson-badges/${world}`).filter(file => file.endsWith('.png'))) {
  const badge = PNG.sync.read(fs.readFileSync(`assets/lesson-badges/${world}/${file}`));
  assert.deepEqual([badge.width, badge.height], [256, 256], `${world}/${file} uses the shared badge canvas`);
}

console.log('PASS: editable particle names, home icons, stool preview, wardrobe drawers, arrow cycling and empty categories');
