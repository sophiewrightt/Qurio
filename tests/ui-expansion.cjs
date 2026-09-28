const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createHarness } = require('./component-harness.cjs');
const app = createHarness('App.tsx', { profile: { username: 'Tester', mode: 'tester' } }, 'App');
const tour = () => app.nodes('OnboardingProvider')[0].props;
assert.equal(tour().state.step, 'done');
tour().event('finish-four');
assert.equal(tour().state.step, 'done');
assert.equal(tour().state.gift, 0, 'Tester does not receive tutorial gifts');
const home = () => app.nodes('HomeScreen')[0].props;
assert.equal(home().infiniteEnergy, true);
home().onAchievements();
assert.equal(app.nodes('AchievementsScreen').length, 1);
app.nodes('AchievementsScreen')[0].props.onBack();
home().onSelectLesson(1);
assert.equal(app.nodes('QuizCompanionProvider')[0].props.visible, false);
app.nodes('LessonScreen')[0].props.onComplete();
app.nodes('LessonNavigationProvider')[0].props.onHome();
home().onSelectLesson(2);
assert.equal(app.nodes('QuizCompanionProvider')[0].props.visible, true);
const guest = createHarness('App.tsx', { profile: { username: 'Guest', mode: 'guest' } }, 'App');
assert.equal(guest.nodes('OnboardingProvider')[0].props.state.step, 'welcome');

const quiz = createHarness('components/LessonQuiz.tsx', { questions: [
  { question: 'One?', options: ['Yes', 'No'], answer: 'Yes' },
  { question: 'Two?', options: ['Yes', 'No'], answer: 'Yes' },
], onFinish() {} });
assert.equal(quiz.nodes('QuizCompanion')[0].props.correct, false);
quiz.nodes('QuizQuestion')[0].props.onSelect('Yes');
assert.equal(quiz.nodes('QuizCompanion')[0].props.correct, true);
quiz.nodes('PrimaryButton')[0].props.onPress();
assert.equal(quiz.nodes('QuizCompanion')[0].props.correct, false);
assert.equal(quiz.nodes('QuizCompanion')[0].props.questionKey, 1);
quiz.nodes('QuizQuestion')[0].props.onSelect('No');
assert.equal(quiz.nodes('QuizCompanion')[0].props.correct, false);
assert.equal(quiz.rewards.length, 1);
for (const particle of ['electron', 'photon', 'gluon']) {
  const avatar = createHarness('components/ParticleAvatar.tsx', { particle, happy: true, accessories: ['fedora', 'red-spectacles'], floating: false });
  assert(avatar.nodes('Image')[0].props.accessibilityLabel.startsWith('Happy '));
  assert.equal(avatar.nodes('Image').length, 3, 'Happy pose retains both equipped overlays');
  avatar.unmount();
}
const homeUI = createHarness('screens/HomeScreen.tsx', { xp: 0, completed: [], collected: false });
const row = homeUI.nodes('View').find(n => n.props.style?.flexDirection === 'row' && n.children.filter(c => c?.type === 'TourAnchor' && ['dictionary', 'achievements'].includes(c.props.id)).length === 2);
assert(row, 'Both shortcuts share one horizontal row');
assert(!homeUI.nodes('Text').flatMap(n => n.children).some(s => typeof s === 'string' && s.includes('click here to see')));
for (const kind of ['rare', 'ultra-rare', 'legendary']) for (const torn of [false, true]) {
  const packet = createHarness('components/ShopArtwork.tsx', { kind, torn, paper: '#FBF4E7' }, 'PacketArtwork');
  assert.equal(packet.nodes('View')[0].props.style.backgroundColor, '#FBF4E7');
  assert.equal(packet.nodes('Image')[0].props.style[0].mixBlendMode, 'multiply');
}
const preload = {};
const ts = require('typescript');
new Function('exports', 'require', ts.transpileModule(fs.readFileSync('data/preloadAssets.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(preload, name => name.endsWith('/achievementArt') ? { achievementArt: {} } : name);
for (const assets of [preload.preloadAssets, ...Object.values(preload.preloadAssetsByWorld)]) {
  for (const file of ['electron-content.png', 'photon-happy-transparent.png', 'gluon-happy-transparent.png']) assert(assets.some(p => p.endsWith(file)), file);
}
console.log('PASS: tester skips all intro, Guest retains intro, compact shortcuts, quiz pose/reset and equipped accessories');
