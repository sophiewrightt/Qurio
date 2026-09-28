const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { createHarness } = require('./component-harness.cjs');
const lib = {};
const curriculum = {}; new Function('exports', ts.transpileModule(fs.readFileSync('data/curriculum.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(curriculum);
new Function('require', 'exports', ts.transpileModule(fs.readFileSync('data/lessonEntry.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(() => curriculum, lib);
for (const [screens, world] of [[[1,2,3,4,5,6,7,8,9], 1], [[11,12,13,14,15,16,17,18], 2], [[19,20,21,22,23,24,25,31], 3], [[26,27,28,29,30,32], 4]]) {
  screens.forEach((screen, index) => assert.equal(lib.lessonNumber(screen), `${world}.${index + 1}`));
}
for (const id of [0, 10, 33, -1, 1.5, NaN]) assert.equal(lib.lessonNumber(id), undefined);

const app = createHarness('App.tsx');
const home = () => app.nodes('HomeScreen')[0].props;
const entry = () => app.nodes('LessonEntryModal')[0].props;
home().onSelectLesson(10); assert.equal(app.nodes('LessonEntryModal').length, 0);
home().onSelectLesson(28);
assert.equal(entry().lesson, '4.3');
assert.equal(app.nodes('ModuleFourLessonThreeScreen').length, 0, 'Selection does not start the lesson');
assert.equal(home().greetingReady, false);
assert.equal(app.nodes('AchievementToast')[0].props.enabled, false);
const stalePlay = entry().onPlay;
entry().onLater();
assert.equal(app.nodes('LessonEntryModal').length, 0);
assert.deepEqual(home().completed, []); assert.equal(home().xp, 0); assert.equal(home().energy, 3);
home().onContinue(); assert.equal(entry().lesson, '1.1');
stalePlay(); assert.equal(entry().lesson, '1.1', 'Old confirmation cannot resolve a new prompt');
const play = entry().onPlay;
play(); play();
assert.equal(app.nodes('LessonEntryModal').length, 0);
assert.equal(app.nodes('LessonScreen').length, 1);
app.nodes('LessonScreen')[0].props.onComplete();
assert.equal(app.nodes('LessonNavigationProvider')[0].props.onNext, undefined, 'Lesson 1 returns Home for the introduction');
app.nodes('LessonNavigationProvider')[0].props.onHome();
home().onSelectLesson(1); assert.equal(entry().lesson, '1.1', 'Replays also confirm'); entry().onPlay();
app.nodes('LessonScreen')[0].props.onComplete();
app.nodes('LessonNavigationProvider')[0].props.onHome();
assert.deepEqual(home().completed, [1]); assert.equal(home().energy, 3, 'Confirmation does not invent local energy debits');
home().onSelectLesson(2); entry().onPlay();
app.nodes('LessonNavigationProvider')[0].props.onNext(); assert.equal(entry().lesson, '1.3');
entry().onLater(); app.nodes('LessonNavigationProvider')[0].props.onHome();
for (const [screen, number] of [[31, '3.8'], [32, '4.6']]) {
  home().onSelectLesson(screen); assert.equal(entry().lesson, number); entry().onLater();
}

let confirmed = 0, cancelled = 0;
const modal = createHarness('components/LessonEntryModal.tsx', { lesson: '4.3', onPlay() { confirmed++; }, onLater() { cancelled++; } });
assert(modal.nodes('Text').some(n => n.children.includes('This will use 1 energy.')));
assert.equal(modal.nodes('Image').length, 1);
modal.nodes('PrimaryButton').find(n => n.props.label === 'Play lesson 4.3').props.onPress();
modal.nodes('PrimaryButton').find(n => n.props.label === 'Later').props.onPress();
modal.nodes('Modal')[0].props.onRequestClose();
assert.equal(confirmed, 1); assert.equal(cancelled, 2);

const homeUI = createHarness('screens/HomeScreen.tsx', { xp: 600, shownKnowledge: 400, username: 'Sophie', particleName: 'Sparky', collected: true, completed: [] });
assert(homeUI.nodes('Pressable').some(n => n.props.accessibilityLabel === 'Open settings, Sophie, Level 3'));
assert.equal(homeUI.nodes('ParticleAvatar').length, 1, 'Profile header no longer repeats the avatar');
assert(homeUI.nodes('Text').some(n => n.children.includes('tap to see settings')));
assert(!homeUI.nodes('Text').some(n => n.children.includes('click here to see the terminology you’ve unlocked')));
const bubble = homeUI.nodes('View').find(n => n.children.some(child => child?.type === 'AvatarGreeting'));
assert.equal(bubble.props.style.position, 'absolute', 'Greeting cannot shift the avatar off centre');
const row = homeUI.nodes('View').find(n => n.children.some(child => child?.type === 'ParticleAvatar'));
assert.equal(row.props.style.alignItems, 'center');
assert(fs.existsSync('assets/ui/speech-bubble-source.jpg'));
assert.equal(fs.readFileSync('data/preloadAssets.ts', 'utf8').split("require('../assets/ui/speech-bubble-source.jpg')").length - 1, 2);
console.log('PASS: lesson-entry labels, cancel/play/Continue/Next/replay, stale confirmation guards, unchanged energy, username header and centred avatar');
