const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PNG } = require('pngjs');
const ts = require('typescript');
const { createHarness } = require('./component-harness.cjs');

const textContent = screen => screen.all(screen.render()).flatMap(node => node.type === 'Text' ? node.children : []).join('');

let completed = 0;
const spinLesson = createHarness('screens/ModuleThreeLessonSevenScreen.tsx', { onHome() {}, onComplete() { completed += 1; } });
assert.equal(spinLesson.nodes('LessonBadge')[0].props.number, 1);
assert.equal(spinLesson.nodes('LessonBadge')[0].props.world, 3);
assert(textContent(spinLesson).includes('I’m spinning around!'));
assert.equal(spinLesson.nodes('StrangeSpinLesson').length, 1);
spinLesson.nodes('StrangeSpinLesson')[0].props.onComplete();
assert.equal(spinLesson.nodes('LessonQuiz').length, 1, 'The new Chapter 3 spin notes are replaced by the quiz');
spinLesson.nodes('LessonQuiz')[0].props.onFinish(8);
assert.equal(completed, 1, 'The spin lesson finishes directly from its final quiz question');

const bridge = createHarness('components/StrangeSpinLesson.tsx', {}, 'WorldThreeBridge');
assert(textContent(bridge).includes('Chapter 1:'));
assert(textContent(bridge).includes('We saw that the quantum world is different'));
assert(textContent(bridge).includes('teleportation'));
assert(textContent(bridge).includes('the strange quark'));
assert(textContent(bridge).includes('What a funny name'));

const curtain = createHarness('components/StrangeSpinLesson.tsx', {}, 'StrangeCurtainReveal');
const curtainControl = curtain.nodes('AnimatedView').find(node => node.props.accessibilityLabel === 'Swipe the curtain left to reveal the strange quark');
assert(curtainControl, 'The strange quark begins behind a swipeable curtain');
curtainControl.props.onAccessibilityAction();
curtain.flight();
assert.equal(curtain.nodes('AnimatedView').filter(node => node.props.accessibilityLabel === 'Swipe the curtain left to reveal the strange quark').length, 0, 'The curtain stays open after the reveal');

let arrowComplete = 0;
const arrow = createHarness('components/StrangeSpinLesson.tsx', { onComplete() { arrowComplete += 1; } }, 'ContinuousSpinArrow');
arrow.nodes('PrimaryButton').find(node => node.props.label === 'Turn the arrow').props.onPress();
arrow.flight();
assert(textContent(arrow).includes('continuous values'));
arrow.nodes('PrimaryButton').find(node => node.props.label === 'Got it').props.onPress();
assert.equal(arrowComplete, 1);

let sorterComplete = 0;
const sorter = createHarness('components/StrangeSpinLesson.tsx', { onComplete() { sorterComplete += 1; } }, 'VerticalStrangeSorter');
sorter.nodes('AnimatedView').find(node => node.props.accessibilityLabel === 'Swipe the strange quarks into the vertical slit').props.onAccessibilityAction();
sorter.flight();
assert(textContent(sorter).includes('spin up and spin down'));
assert.equal(sorterComplete, 1);

let gumComplete = 0;
const gum = createHarness('components/StrangeSpinLesson.tsx', { onComplete() { gumComplete += 1; } }, 'BubblegumAnalogy');
gum.nodes('PrimaryButton').find(node => node.props.label === 'Turn the coin').props.onPress();
gum.nodes('PrimaryButton').find(node => node.props.label === 'Pay for bubble gum').props.onPress();
gum.flight();
assert(gum.nodes('PrimaryButton').some(node => node.props.label === 'Get another colour'));
assert.equal(gumComplete, 1);

const strangeSpinSource = fs.readFileSync('components/StrangeSpinLesson.tsx', 'utf8');
for (const phrase of ['Welcome back!', 'Chapter 1:', 'StrangeCurtainReveal', 'question-mark-transparent.png', 'Animated.loop', 'NOT QUITE', 'quark-properties-transparent.png', 'quantised', 'vertical-spin-sorter-transparent.png', 'vertical-horizontal-diagonal-slots-transparent.png', 'Spin is a built-in property', 'Choose a measurement direction', 'Two allowed results', 'bubblegum-blowing-transparent.png', "['0deg', '180deg']", "['-90deg', '90deg']", "['45deg', '225deg']"]) assert(strangeSpinSource.includes(phrase), `New spin flow includes ${phrase}`);
assert(strangeSpinSource.includes("outputRange: ['0deg', '180deg']"));
assert(strangeSpinSource.includes('value.toFixed(2)'), 'The rotating arrow exposes a live 0 to 1 value');
assert(!strangeSpinSource.includes('0.25 · 0.50 · 0.75'), 'Loose decimal labels were removed from the arrow demo');
assert(!strangeSpinSource.includes('You might have seen this coming'));
assert(strangeSpinSource.includes('Math.random()'), 'Bubble gum colours are sampled afresh');

const lesson = createHarness('screens/ModuleThreeLessonOneScreen.tsx', { onHome() {}, onComplete() { completed += 1; } });
assert.equal(lesson.nodes('LessonBadge')[0].props.number, 2);
assert.equal(lesson.nodes('LessonBadge')[0].props.world, 3);
assert(textContent(lesson).includes('When two particles meet…'));
assert.equal(lesson.nodes('JointStateLessonLabs').length, 1);
lesson.nodes('JointStateLessonLabs')[0].props.onComplete();
assert.equal(lesson.nodes('LessonQuiz').length, 1, 'The joint-state lesson notes are replaced by the quiz');
assert.equal(lesson.nodes('LessonQuiz')[0].props.takeaway, 'An interaction can prepare two strange quarks in one entangled state. In this ideal preparation, their vertical spin results are correlated and always opposite.');
lesson.nodes('LessonQuiz')[0].props.onFinish(4);
assert.equal(completed, 2);

let lessonTwoCompleted = 0;
const lessonTwo = createHarness('screens/ModuleThreeLessonTwoScreen.tsx', { onHome() {}, onComplete() { lessonTwoCompleted += 1; } });
assert.equal(lessonTwo.nodes('LessonBadge')[0].props.number, 3);
assert.equal(lessonTwo.nodes('LessonBadge')[0].props.world, 3);
assert(textContent(lessonTwo).includes('All entangled up'));
assert.equal(lessonTwo.nodes('ClassicalCorrelationLesson').length, 1);
lessonTwo.nodes('ClassicalCorrelationLesson')[0].props.onComplete();
assert.equal(lessonTwo.nodes('LessonQuiz').length, 1, 'The All entangled up notes are replaced by its quiz');
assert.equal(lessonTwo.nodes('LessonQuiz')[0].props.takeaway, 'Classical socks carry pre-arranged answers. Entangled strange quarks share a joint quantum state. Hidden variables offers one possible explanation, and the next lesson will test whether that idea works.');
lessonTwo.nodes('LessonQuiz')[0].props.onFinish(4);
assert.equal(lessonTwoCompleted, 1);

const correlation = createHarness('components/ClassicalCorrelationLesson.tsx', { onComplete() {} });
assert(textContent(correlation).includes('entangle two quantum particles'));
assert(textContent(correlation).includes('the other gives down'));

let socksComplete = 0;
const socks = createHarness('components/ClassicalCorrelationLesson.tsx', { onComplete() { socksComplete += 1; } }, 'SockComparison');
assert(textContent(socks).includes('pair of socks'));
assert(socks.nodes('Image').some(node => String(node.props.source).includes('pair-of-socks-transparent.png')));
assert(socks.nodes('Image').some(node => String(node.props.source).includes('boxes-closed-aligned-transparent.png')));
socks.nodes('PrimaryButton').find(node => node.props.label === 'Open Box A').props.onPress();
assert(socks.nodes('Image').some(node => String(node.props.source).includes('box-a-open-b-closed-transparent.png')));
socks.nodes('AnswerButton').find(node => node.props.label === 'The left sock').props.onPress();
assert(textContent(socks).includes('Not quite'));
assert.equal(socks.nodes('TerminologyCard').length, 0, 'A wrong sock answer withholds the next section');
socks.nodes('AnswerButton').find(node => node.props.label === 'The right sock').props.onPress();
assert(socks.nodes('Image').some(node => String(node.props.source).includes('socks-boxes-transparent.png')));
socks.nodes('AnswerButton').find(node => node.props.label === 'Yes. Opening A changed B.').props.onPress();
assert.equal(socks.nodes('TerminologyCard').length, 0, 'A wrong causation answer also allows retry and withholds the next section');
socks.nodes('AnswerButton').find(node => node.props.label === 'No. It was already there.').props.onPress();
assert.equal(socks.nodes('TerminologyCard')[0].props.term, 'Classical correlation');
socks.nodes('PrimaryButton').find(node => node.props.label === 'Try it with entangled stranges').props.onPress();
assert.equal(socksComplete, 1);

let entanglerComplete = 0;
const entanglerSequence = createHarness('components/ClassicalCorrelationLesson.tsx', { onComplete() { entanglerComplete += 1; } }, 'EntanglerSequence');
assert(textContent(entanglerSequence).includes('protect the strange quarks'));
entanglerSequence.nodes('Pressable')[0].props.onPress();
entanglerSequence.flight();
assert(String(entanglerSequence.nodes('AnimatedImage').find(node => String(node.props.source).includes('entangler_pointing_to_boxes')).props.source).includes('entangler_pointing_to_boxes'));
entanglerSequence.nodes('PrimaryButton').find(node => node.props.label === 'Meet Alex and Barb').props.onPress();
assert.equal(entanglerComplete, 1);

let peopleComplete = 0;
const people = createHarness('components/ClassicalCorrelationLesson.tsx', { onComplete() { peopleComplete += 1; } }, 'AlexAndBarbSequence');
assert(textContent(people).includes('This is Alex, and this is Barb.'));
assert(textContent(people).includes('We give Alex Box A and Barb Box B.'));
assert(people.nodes('Image').some(node => String(node.props.source).includes('refinements/room-closed.png')));
assert(textContent(people).includes('Tap Alex’s box to open it.'));
people.nodes('Pressable').find(node => node.props.accessibilityLabel === 'Tap Alex’s box to open it').props.onPress();
assert(people.nodes('Image').some(node => String(node.props.source).includes('refinements/room-open.png')));
assert(textContent(people).includes('vertical spin result is up'));
assert(textContent(people).includes('what’s in Barb’s box'));
people.nodes('AnswerButton').find(node => node.props.label === 'The strange with spin up').props.onPress();
assert(!people.nodes('Image').some(node => String(node.props.source).includes('refinements/barb-spin-down-no-name.png')), 'A wrong guess withholds Barb’s result');
people.nodes('AnswerButton').find(node => node.props.label === 'The strange with spin down').props.onPress();
assert(people.nodes('Image').some(node => String(node.props.source).includes('refinements/barb-spin-down-no-name.png')));
assert(textContent(people).includes('opposite result: down'));
assert(textContent(people).includes('neither strange has its own definite vertical result'));
assert(textContent(people).includes('They weren’t chosen in advance, like the socks.'));
assert.equal(people.nodes('MysteryPanel')[0].props.unlocked, undefined);
people.nodes('PrimaryButton').find(node => node.props.label === 'Hear a theory').props.onPress();
assert.equal(peopleComplete, 1);

let hiddenComplete = 0;
const hidden = createHarness('components/ClassicalCorrelationLesson.tsx', { onComplete() { hiddenComplete += 1; } }, 'HiddenVariables');
assert(textContent(hidden).includes('private answer sheet'));
assert(textContent(hidden).includes('Here’s a theory'));
assert(textContent(hidden).includes('pre-written answers for every measurement direction'));
assert(textContent(hidden).includes('One opposite-result direction cannot decide'));
assert(!textContent(hidden).includes('Bell-test experiments'));
assert.equal(hidden.nodes('MysteryPanel').length, 0, 'Lesson 3 leaves the hidden-variable theory unresolved');
assert(hidden.nodes('Image').some(node => String(node.props.source).includes('refinements/instruction-sheet.png')));
hidden.nodes('PrimaryButton').find(node => node.props.label === 'Start the quiz').props.onPress();
assert.equal(hiddenComplete, 1);

const allEntangledSource = fs.readFileSync('components/ClassicalCorrelationLesson.tsx', 'utf8');
for (const phrase of ['alex_and_barb_introduction-transparent.png', 'entangler_pointing_to_boxes-transparent.png', 'refinements/barb-spin-down-no-name.png', 'pair-of-socks-transparent.png', 'refinements/room-closed.png', 'refinements/room-open.png', 'refinements/instruction-sheet.png', 'joint state', 'could not choose to get up', 'private answer sheet']) assert(allEntangledSource.includes(phrase), `All entangled up includes ${phrase}`);
assert(!allEntangledSource.includes('Bell-test experiments'));
assert(!allEntangledSource.includes('Meet the gluon'));

let lessonThreeCompleted = 0;
const lessonThree = createHarness('screens/ModuleThreeLessonThreeScreen.tsx', { onHome() {}, onComplete() { lessonThreeCompleted += 1; } });
assert.equal(lessonThree.nodes('LessonBadge')[0].props.number, 4);
assert.equal(lessonThree.nodes('LessonBadge')[0].props.world, 3);
assert(textContent(lessonThree).includes('Twin telepathy'));
assert.equal(lessonThree.nodes('TelepathyLesson').length, 1);
lessonThree.nodes('TelepathyLesson')[0].props.onComplete();
assert.equal(lessonThree.nodes('LessonQuiz').length, 1, 'Telepathy notes are replaced by its quiz');
assert.equal(lessonThree.nodes('LessonQuiz')[0].props.takeaway, 'The entangled results line up across an enormous distance, even though a light-speed signal would take millions of years. Next we’ll test whether that lets quantum information travel faster than light.');
lessonThree.nodes('LessonQuiz')[0].props.onFinish(4);
assert.equal(lessonThreeCompleted, 1);

const telepathy = createHarness('components/TelepathyLesson.tsx', { onComplete() {} });
assert(textContent(telepathy).includes('local hidden-variable model'));
assert(textContent(telepathy).includes('Then we looked at hidden variables'));
assert(textContent(telepathy).includes('This is a proposal to test'));
assert(!textContent(telepathy).includes('Bell tests compare several measurement directions'));
const telepathySource = fs.readFileSync('components/TelepathyLesson.tsx', 'utf8');
for (const phrase of ['entangler_pointing_to_boxes-transparent.png', 'alex-barb-room-closed-transparent.png', 'refinements/instruction-sheet.png', 'speed-of-light-transparent.png', 'light-room-transparent.png', 'dark-room-transparent.png', 'light-switch-off-transparent.png', 'light-switch-on-transparent.png', 'photon-running-1-transparent.png', 'photon-running-2-transparent.png', 'sun-transparent.png', 'person-looking-at-sun-transparent.png', 'alex-on-spaceship-transparent.png', 'refinements/alex-spin-up.png', 'refinements/barb-spin-down-no-name.png', 'assets/lesson-9/photon-default-transparent.png']) assert(telepathySource.includes(phrase), `Telepathy includes ${phrase}`);
assert(!telepathySource.includes('speed-of-light-limit-transparent.png'));
assert(!telepathySource.includes('dottedTrack'));
assert(!telepathySource.includes('box-b-spin-up-transparent.png'));
assert(!telepathySource.includes('distanceDashes'));
assert(!telepathySource.includes('10 light years'));
const telepathyInternals = name => telepathy.all(telepathy.render()).filter(node => typeof node.type === 'function' && node.type.name === name);
telepathyInternals('LightSpeedContext')[0].props.onComplete();
assert.equal(telepathyInternals('SpaceRiddle').length, 1, 'The distant riddle appears after the separate light-speed refresher');

let switchComplete = 0;
const lightSwitch = createHarness('components/TelepathyLesson.tsx', { onComplete() { switchComplete += 1; } }, 'LightSwitchLab');
const roomSwitch = lightSwitch.nodes('Pressable')[0];
assert.equal(roomSwitch.props.accessibilityState.checked, false);
roomSwitch.props.onPress();
assert.equal(lightSwitch.nodes('Pressable')[0].props.accessibilityState.checked, true);
lightSwitch.nodes('Pressable')[0].props.onPress();
assert.equal(switchComplete, 1, 'Toggling the room repeatedly only advances once');

let contextComplete = 0;
const lightContext = createHarness('components/TelepathyLesson.tsx', { onComplete() { contextComplete += 1; } }, 'LightSpeedContext');
const contextInternals = name => lightContext.all(lightContext.render()).filter(node => typeof node.type === 'function' && node.type.name === name);
contextInternals('LightSwitchLab')[0].props.onComplete();
lightContext.nodes('PrimaryButton').find(node => node.props.label === 'Try teleporting the photon').props.onPress();
assert(textContent(lightContext).includes('Real light travels across the space'));
assert(!lightContext.nodes('PrimaryButton').some(node => node.props.label === 'Watch light travel'), 'Light travel starts automatically');
assert(!lightContext.nodes('View').some(node => node.props.accessibilityLabel === 'Photon travelling across space'), 'Removed extra light-travel scene does not gate the Sun example');
assert(lightContext.nodes('Image').some(node => String(node.props.source).includes('speed-of-light-transparent.png')));
assert(textContent(lightContext).includes('nothing can travel faster than light'));
lightContext.nodes('PrimaryButton').find(node => node.props.label === 'Ok').props.onPress();
assert.equal(contextComplete, 1);

let farReached = 0;
const distance = createHarness('components/TelepathyLesson.tsx', { onFar() { farReached += 1; } }, 'DistanceSlider');
const slider = distance.nodes('View').find(node => node.props.accessibilityRole === 'adjustable');
slider.props.onLayout({ nativeEvent: { layout: { width: 100 } } });
slider.props.onResponderMove({ nativeEvent: { locationX: 100 } });
assert.equal(farReached, 1);
assert.equal(distance.nodes('View').filter(node => node.props.accessibilityRole === 'adjustable').length, 0, 'The completed distance slider disappears');
assert(!textContent(distance).includes('10 MILLION LIGHT-YEARS AWAY'), 'The completed slider does not leave an arrival badge behind');

let riddleComplete = 0;
const riddle = createHarness('components/TelepathyLesson.tsx', { onComplete() { riddleComplete += 1; } }, 'SpaceRiddle');
const riddleInternals = name => riddle.all(riddle.render()).filter(node => typeof node.type === 'function' && node.type.name === name);
riddleInternals('DistanceSlider')[0].props.onFar();
riddle.nodes('PrimaryButton').find(node => node.props.label === 'Open Alex’s box').props.onPress();
assert(textContent(riddle).includes('Let’s open Alex’s box'), 'The instruction remains visible after the box opens');
assert(textContent(riddle).includes('Alex records spin up'));
assert(!textContent(riddle).includes('Close-up of Box B'));
riddle.nodes('AnswerButton').find(node => node.props.label === 'Spin up').props.onPress();
assert.equal(riddle.nodes('AnswerButton').find(node => node.props.label === 'Spin down').props.state, 'default', 'A wrong answer does not reveal the correct option');
assert(textContent(riddle).includes('Not quite'));
riddle.nodes('AnswerButton').find(node => node.props.label === 'Spin down').props.onPress();
assert(textContent(riddle).includes('shared state guaranteed her result would be down'));
assert(textContent(riddle).includes('Does this mean quantum information can travel faster than light?'));
assert.equal(riddle.nodes('MysteryPanel')[0].props.title, 'Did information beat light?');
riddle.nodes('PrimaryButton').find(node => node.props.label === 'Start the quiz').props.onPress();
assert.equal(riddleComplete, 1);

let lessonFourCompleted = 0;
const lessonFour = createHarness('screens/ModuleThreeLessonFourScreen.tsx', { onHome() {}, onComplete() { lessonFourCompleted += 1; } });
assert.equal(lessonFour.nodes('LessonBadge')[0].props.number, 5);
assert.equal(lessonFour.nodes('LessonBadge')[0].props.world, 3);
assert(textContent(lessonFour).includes('Does that ring a bell?'));
assert.equal(lessonFour.nodes('NoSignallingLesson').length, 1);
lessonFour.nodes('NoSignallingLesson')[0].props.onComplete();
assert.equal(lessonFour.nodes('LessonQuiz').length, 1, 'Lesson 5 notes are replaced by its quiz');
assert.equal(lessonFour.nodes('LessonQuiz')[0].props.takeaway, 'Bell tests rule out local pre-written answers, but entanglement still cannot send a controllable message faster than light.');
lessonFour.nodes('LessonQuiz')[0].props.onFinish(4);
assert.equal(lessonFourCompleted, 1);

let noSignallingComplete = 0;
const noSignalling = createHarness('components/NoSignallingLesson.tsx', { onComplete() { noSignallingComplete += 1; } });
assert(textContent(noSignalling).includes('two confusing things'));
assert(textContent(noSignalling).includes('ARGUMENT #1'));
assert(!textContent(noSignalling).includes('ARGUMENT #2'), 'The second argument waits for the sock-box interaction');
const noSignallingSource = fs.readFileSync('components/NoSignallingLesson.tsx', 'utf8');
assert(noSignallingSource.includes('electron-angry-transparent.png'));
assert(noSignallingSource.includes('boxing-ring-transparent.png'));
assert(noSignallingSource.includes('einstein-unhappy-face-transparent.png'));
noSignalling.nodes('Pressable').find(node => node.props.accessibilityLabel === 'Tap the two closed boxes to open them').props.onPress();
assert(textContent(noSignalling).includes('ARGUMENT #2'));
assert(textContent(noSignalling).includes('In 1964'));
const noSignallingInternals = name => noSignalling.all(noSignalling.render()).filter(node => typeof node.type === 'function' && node.type.name === name);
assert.equal(noSignallingInternals('DebateFaceOff').length, 1);
assert(!noSignalling.nodes('PrimaryButton').some(node => node.props.label === 'Tap to reveal Bell’s maths'));
assert(textContent(noSignalling).includes('|S| ≤ 2'));
assert(textContent(noSignalling).includes('sock method can’t reproduce all of the results'));
assert(textContent(noSignalling).includes('Does this prove particles can communicate faster than light?'));
noSignalling.nodes('AnswerButton').find(node => node.props.label === 'Yes').props.onPress();
assert(textContent(noSignalling).includes('try again'));
assert.equal(noSignalling.nodes('PrimaryButton').filter(node => node.props.label === 'Start the quiz').length, 0);
noSignalling.nodes('AnswerButton').find(node => node.props.label === 'No').props.onPress();
assert(textContent(noSignalling).includes('NO!'));
assert(textContent(noSignalling).includes('light speed or slower'));
assert.equal(noSignalling.nodes('TerminologyCard')[0].props.term, 'Bell’s theorem');
assert.equal(noSignalling.nodes('TerminologyCard')[1].props.term, 'No-signalling');
assert(textContent(noSignalling).includes('no explanation keeping both ideas can reproduce all the quantum results'));
noSignalling.nodes('PrimaryButton').find(node => node.props.label === 'Start the quiz').props.onPress();
assert.equal(noSignallingComplete, 1);

let labsCompleted = 0;
const labs = createHarness('components/JointStateLessonLabs.tsx', { onComplete() { labsCompleted += 1; } });
const internal = name => labs.all(labs.render()).find(node => typeof node.type === 'function' && node.type.name === name);
assert(internal('IndependentPairLab'), 'The lesson starts with separately prepared strange quarks');
internal('IndependentPairLab').props.onComplete();
assert(internal('InteractionLab'), 'The independent pair is followed by a particle interaction');
internal('InteractionLab').props.onComplete();
assert(internal('JointStateExplanation'), 'The visible correlation leads into the joint-state explanation');
internal('JointStateExplanation').props.onComplete();
assert.equal(labsCompleted, 1);

const source = fs.readFileSync('components/JointStateLessonLabs.tsx', 'utf8');
assert(source.includes('50% predicted chance of spin up') && source.includes('50% predicted chance of spin down'));
assert(source.includes('sampleBinary(20, 0.5)'), 'Both independent and connected result sets use fresh 50/50 samples');
for (const pair of ["A ↑   B ↑", "A ↑   B ↓", "A ↓   B ↑", "A ↓   B ↓"]) assert(source.includes(pair), `Independent results include ${pair}`);
assert(source.includes('A giving a certain spin doesn’t influence B’s result') && source.includes('independent'));
assert(source.includes('20 CONNECTED PAIRS') && source.includes('They only give opposite results'));
assert(source.includes('What changed??') && source.includes('Correlated.'));
assert(source.includes('aren’t physically joined') && source.includes('shared quantum state'));
assert(source.includes('connectionReveal'), 'The interacting and connected pair frames crossfade without a blank state');
assert(source.includes('Animated.sequence') && source.includes('Animated.parallel'), 'The two strange quarks visibly approach, flash and separate');
assert(!source.includes('ONE COMBINED SYSTEM'));
assert(source.includes('spin-up-happy-transparent.png') && source.includes('spin-down-happy-transparent.png'));
assert(source.includes('term="Entanglement"'));
assert(!source.includes('assets/particles/electron'), 'The rebuilt lesson uses strange quarks throughout');

const dataSource = fs.readFileSync('data/moduleThree.ts', 'utf8');
const dataCode = ts.transpileModule(dataSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const data = {};
new Function('exports', dataCode)(data);
const correctPositions = data.jointQuantumStateQuestions.map(question => question.options.indexOf(question.answer));
assert.deepEqual(data.strangeSpinQuestions.map(question => question.options.indexOf(question.answer)), [1, 2, 0, 1, 2, 0, 1, 2], 'The longer spin drill mixes elementary-particle and axis checks');
assert.deepEqual(correctPositions, [2, 0, 1, 2], 'Correct quiz answers are deliberately mixed');
assert.deepEqual(data.connectedOutcomesQuestions.map(question => question.options.indexOf(question.answer)), [1, 2, 0, 1], 'Lesson 2 correct answers are also mixed');
assert.deepEqual(data.telepathyQuestions.map(question => question.options.indexOf(question.answer)), [1, 2, 0, 1], 'Telepathy correct answers are mixed');
assert.deepEqual(data.noSignallingQuestions.map(question => question.options.indexOf(question.answer)), [1, 2, 0, 1], 'Lesson 4 correct answers are mixed');
assert.deepEqual(data.teleportationQuestions.map(question => question.options.indexOf(question.answer)), [1, 2, 0, 1]);
assert.deepEqual(data.quantumConnectionsFinalQuestions.map(question => question.options.indexOf(question.answer)), [1, 2, 2, 0, 1, 2, 0]);
for (const questions of Object.values(data)) for (const question of questions) {
  assert.equal(question.options.filter(option => option === question.answer).length, 1, 'Each quiz has exactly one correct option');
}

const home = createHarness('screens/HomeScreen.tsx', { xp: 120, collected: true, completed: [], onContinue() {}, onSelectLesson() {} });
assert(textContent(home).includes('Quantum'));
assert(textContent(home).includes('Connections'));
assert(textContent(home).includes('What happens when quantum systems stop behaving alone?'));
assert(textContent(home).indexOf('I’m spinning around!') < textContent(home).indexOf('When two particles meet…'));
assert(textContent(home).includes('When two particles meet…'));
assert(textContent(home).includes('All entangled up'));
assert(textContent(home).includes('Twin telepathy'));
assert(textContent(home).includes('Does that ring a bell?'));
assert(textContent(home).includes('0/8'));
assert(textContent(home).includes('Teleporting without travelling'));
assert(textContent(home).includes('Connections at work'));
assert(textContent(home).includes('I’m spinning around!'));

const app = createHarness('App.tsx');
const goNext = () => { app.nodes('LessonNavigationProvider')[0].props.onNext(); app.nodes('LessonEntryModal')[0].props.onPlay(); };
app.nodes('HomeScreen')[0].props.onSelectLesson(19); app.nodes('LessonEntryModal')[0].props.onPlay();
assert.equal(app.nodes('ModuleThreeLessonSevenScreen').length, 1, 'Chapter 3 now opens with the strange-quark spin lesson');
app.nodes('ModuleThreeLessonSevenScreen')[0].props.onComplete(8);
goNext();
assert.equal(app.nodes('ModuleThreeLessonOneScreen').length, 1, 'Spin continues to When two quantum systems meet');
app.nodes('ModuleThreeLessonOneScreen')[0].props.onComplete(4);
goNext();
assert.equal(app.nodes('ModuleThreeLessonTwoScreen').length, 1, 'The joint-state lesson continues to All entangled up');
app.nodes('ModuleThreeLessonTwoScreen')[0].props.onComplete(4);
goNext();
assert.equal(app.nodes('ModuleThreeLessonThreeScreen').length, 1, 'All entangled up continues to Twin telepathy');
app.nodes('ModuleThreeLessonThreeScreen')[0].props.onComplete(4);
goNext();
assert.equal(app.nodes('ModuleThreeLessonFourScreen').length, 1, 'Twin telepathy continues to the no-signalling lesson');
app.nodes('ModuleThreeLessonFourScreen')[0].props.onComplete(4);
goNext();
assert.equal(app.nodes('ModuleThreeLessonFiveScreen').length, 1);
app.nodes('ModuleThreeLessonFiveScreen')[0].props.onComplete(4);
goNext();
assert.equal(app.nodes('ModuleThreeLessonSixScreen').length, 1);
app.nodes('ModuleThreeLessonSixScreen')[0].props.onComplete();
goNext();
assert.equal(app.nodes('ModuleThreeLessonEightScreen').length, 1, 'Lesson 7 leads to the separate final quiz');
app.nodes('ModuleThreeLessonEightScreen')[0].props.onUnlockAccessories(['fedora', 'red-spectacles', 'curly-moustache']);
const finishWorld = app.nodes('ModuleThreeLessonEightScreen')[0].props.onComplete;
finishWorld(5); finishWorld(5);
app.nodes('LessonNavigationProvider')[0].props.onHome();
assert.equal(app.nodes('HomeScreen').length, 1);
assert.deepEqual(app.nodes('HomeScreen')[0].props.completed, [19, 20, 21, 22, 23, 24, 25, 31]);
assert.equal(app.nodes('HomeScreen')[0].props.xp, 0, 'Completion alone does not earn Knowledge');
assert.equal(app.nodes('HomeScreen')[0].props.particle, 'electron');
app.nodes('HomeScreen')[0].props.onCustomise();
assert.equal(app.nodes('CustomisationScreen')[0].props.gluonUnlocked, undefined, 'All entangled up does not unlock the outdated gluon reward');
assert.deepEqual(app.nodes('CustomisationScreen')[0].props.owned, ['fedora', 'red-spectacles', 'curly-moustache']);

for (let number = 1; number <= 8; number += 1) {
  const path = `assets/lesson-badges/world-3/${number}.png`;
  assert(fs.existsSync(path), `Chapter 3 badge ${number} exists`);
  const badge = PNG.sync.read(fs.readFileSync(path));
  assert.deepEqual([badge.width, badge.height], [256, 256], `Chapter 3 badge ${number} uses the shared lesson-number canvas`);
}
assert(fs.existsSync('assets/module-covers/world-3.png'));
const worldThreeCover = PNG.sync.read(fs.readFileSync('assets/module-covers/world-3.png'));
assert.deepEqual([worldThreeCover.width, worldThreeCover.height], [880, 400], 'Chapter 3 uses the supplied paired strange-quark cover');
assert(worldThreeCover.data.some((value, index) => index % 4 === 3 && value === 0), 'The supplied Chapter 3 cover has a transparent background');
for (const asset of ['sock-left-transparent.png', 'sock-right-transparent.png', 'boxes-closed-aligned-transparent.png', 'box-a-open-b-closed-transparent.png', 'socks-boxes-transparent.png', 'gluon-default-transparent.png', 'gluon-happy-transparent.png']) {
  const path = `assets/module-3/lesson-2/${asset}`;
  assert(fs.existsSync(path), `${asset} exists`);
  assert(fs.readFileSync('data/preloadAssets.ts', 'utf8').includes(asset), `${asset} is preloaded`);
}
for (const asset of ['gluon-default-transparent.png', 'gluon-happy-transparent.png']) {
  const sprite = PNG.sync.read(fs.readFileSync(`assets/module-3/lesson-2/${asset}`));
  assert.deepEqual([sprite.width, sprite.height], [460, 460], `${asset} uses the shared particle and accessory canvas`);
}

const allEntangledAssets = [
  'alex_and_barb_introduction-transparent.png', 'alex_with_box-transparent.png', 'alex_with_box_spin_up-transparent.png',
  'barb_with_box-transparent.png', 'refinements/barb-spin-down-no-name.png', 'box_with_up_quark-transparent.png',
  'box_with_down_quark-transparent.png', 'entangler-transparent.png', 'entangler_pointing_to_boxes-transparent.png',
  'pair-of-socks-transparent.png', 'refinements/instruction-sheet.png',
  'alex-barb-room-closed-transparent.png', 'refinements/room-open.png',
];
for (const asset of allEntangledAssets) {
  const path = asset.startsWith('refinements/') ? `assets/module-3/${asset}` : `assets/module-3/lesson-3-all-entangled-up/${asset}`;
  assert(fs.existsSync(path), `${asset} exists`);
  assert(fs.readFileSync('data/preloadAssets.ts', 'utf8').includes(asset), `${asset} is preloaded`);
  const sprite = PNG.sync.read(fs.readFileSync(path));
  assert(sprite.data.some((value, index) => index % 4 === 3 && value === 0), `${asset} has transparent background pixels`);
}

const spinAssets = [
  'arrow-transparent.png', 'bubblegum-blue-transparent.png', 'bubblegum-blowing-transparent.png', 'bubblegum-green-transparent.png',
  'bubblegum-machine-transparent.png', 'bubblegum-orange-transparent.png', 'bubblegum-pink-transparent.png', 'bubblegum-purple-transparent.png',
  'bubblegum-yellow-transparent.png', 'coin-slot-transparent.png', 'hand-with-diagonal-coin-transparent.png', 'hand-with-vertical-coin-transparent.png',
  'quark-properties-transparent.png', 'spin-down-quark-transparent.png', 'spin-up-quark-transparent.png', 'strange-default-transparent.png',
  'spin-down-happy-transparent.png', 'spin-up-happy-transparent.png', 'strange-happy-transparent.png', 'strange-surprised-transparent.png',
  'strange-with-coin-transparent.png', 'vertical-spin-sorter-transparent.png',
];
for (const asset of spinAssets) {
  assert(fs.existsSync(`assets/module-3/lesson-1/${asset}`), `${asset} exists`);
  assert(fs.readFileSync('data/preloadAssets.ts', 'utf8').includes(asset), `${asset} is preloaded`);
}
for (const pair of [['strange-default-transparent.png', 'strange-happy-transparent.png'], ['spin-up-quark-transparent.png', 'spin-down-quark-transparent.png'], ['hand-with-diagonal-coin-transparent.png', 'hand-with-vertical-coin-transparent.png']]) {
  const [first, second] = pair.map(asset => PNG.sync.read(fs.readFileSync(`assets/module-3/lesson-1/${asset}`)));
  assert.deepEqual([first.width, first.height], [second.width, second.height], `${pair.join(' and ')} share one crop`);
}

console.log('PASS: Chapter 3 strange-spin, joint-state, classical-correlation, entanglement and no-signalling flow, navigation and artwork');
