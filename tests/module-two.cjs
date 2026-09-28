const assert = require('node:assert/strict');
const fs = require('node:fs');
const { PNG } = require('pngjs');
const ts = require('typescript');
const { createHarness } = require('./component-harness.cjs');

const textContent = screen => screen.all(screen.render()).flatMap(node => node.type === 'Text' ? node.children : []).join('');

const quantisation = createHarness('screens/ModuleTwoLessonOneScreen.tsx', { onHome() {}, onComplete() {} });
assert.equal(quantisation.nodes('LessonBadge')[0].props.number, 1);
assert.equal(quantisation.nodes('QuantisationLab').length, 0, 'The analogy stays hidden until the learner makes a guess');
assert.equal(quantisation.nodes('Pressable').length, 6, 'The opening offers six word guesses');
quantisation.nodes('Pressable')[0].props.onPress();
assert.equal(quantisation.nodes('QuantisationLab').length, 1);
assert.equal(quantisation.nodes('ScratchReveal')[0].children[0], 'Quantised');
assert.equal(quantisation.nodes('ScratchReveal')[0].props.rainbow, true);
assert.equal(quantisation.nodes('TerminologyCard').length, 0, 'Definition waits for the scratch');
assert.equal(quantisation.nodes('PrimaryButton').length, 0, 'Quiz waits for the scratch');
quantisation.nodes('ScratchReveal')[0].props.onReveal();
assert.equal(quantisation.nodes('TerminologyCard')[0].props.term, 'Quantised');
quantisation.nodes('PrimaryButton').find(node => node.props.label === 'Start the quiz').props.onPress();
assert.equal(quantisation.nodes('LessonQuiz').length, 1, 'Lesson notes are unmounted for the quantisation quiz');
assert.equal(quantisation.nodes('LessonBadge').length, 0, 'Lesson bubble only appears at the lesson opening');

const scratch = createHarness('components/ScratchReveal.tsx', { title: 'What is this called?', children: 'Quantised' });
let scratchSurface = scratch.nodes('View').find(node => String(node.props.accessibilityLabel).startsWith('Scratch to reveal'));
scratchSurface.props.onLayout({ nativeEvent: { layout: { width: 300, height: 115 } } });
const coveredTileCount = scratch.nodes('View').length;
scratchSurface = scratch.nodes('View').find(node => String(node.props.accessibilityLabel).startsWith('Scratch to reveal'));
scratchSurface.props.onResponderGrant({ nativeEvent: { locationX: 20, locationY: 20 } });
assert(scratch.nodes('View').length < coveredTileCount, 'A finger stroke erases only the touched coating tiles');
assert(scratch.nodes('View').some(node => String(node.props.accessibilityLabel).startsWith('Scratch to reveal')), 'One tap does not reveal the whole word');

const lab = createHarness('components/QuantisationLab.tsx', { onExplore() {} });
assert(textContent(lab).includes('Classical = continuous'));
assert(textContent(lab).includes('Quantum = ?'));
assert(textContent(lab).includes('1.9999 m'));
assert(textContent(lab).includes('no 1.2, no 1.9999'));
assert(textContent(lab).includes('Now replace the basketball with an electron'));
lab.nodes('Pressable').find(node => node.props.accessibilityRole === 'button').props.onPress();
lab.tick();
assert(textContent(lab).includes('Rolling through all the values'));

const inspect = createHarness('components/AtomEnergyInspect.tsx', { onInspect() {} });
const stage = inspect.nodes('View').find(node => node.props.accessibilityLabel === 'Drag the magnifying glass over the atom');
stage.props.onResponderMove({ nativeEvent: { locationX: 160, locationY: 137 } });
assert(textContent(inspect).includes('The electron cloud'));
assert(textContent(inspect).includes('Electrons have quantised energies'));
assert(!textContent(inspect).includes('An energy-level diagram answers a different question'));

let levelCompleted = 0;
const levelLesson = createHarness('screens/ModuleTwoLessonTwoScreen.tsx', { onHome() {}, onComplete() { levelCompleted += 1; } });
assert.equal(levelLesson.nodes('LessonBadge')[0].props.number, 2);
levelLesson.nodes('AtomEnergyInspect')[0].props.onInspect();
levelLesson.nodes('PrimaryButton').find(node => node.props.label === 'Test yourself').props.onPress();
assert.equal(levelLesson.nodes('EnergyPlacementCheck').length, 1, 'Recall notes are hidden during the placement check');
assert.equal(levelLesson.nodes('LessonBadge').length, 0, 'Lesson bubble is absent from the energy check');
levelLesson.nodes('EnergyPlacementCheck')[0].props.onFinish(3);
assert.equal(levelLesson.nodes('EnergyAtomLab').length, 1);
assert(textContent(levelLesson).includes('not physical platforms inside the atom'));
levelLesson.nodes('EnergyAtomLab')[0].props.onEnergise();
levelLesson.nodes('PrimaryButton').find(node => node.props.label === 'Start the quiz').props.onPress();
assert.equal(levelLesson.nodes('LessonQuiz').length, 1);
assert.equal(levelLesson.nodes('LessonBadge').length, 0, 'Lesson bubble is absent from the final quiz');
assert.equal(levelLesson.nodes('LessonQuiz')[0].props.takeaway, 'Electrons bound inside atoms can occupy specific allowed energy states.', 'Lesson 2 passes its takeaway into the final quiz state');
levelLesson.nodes('LessonQuiz')[0].props.onFinish(4);
assert.equal(levelCompleted, 1, 'Lesson 2 finishes directly from the final quiz button');

let takeawayQuizFinished = 0;
const takeawayQuiz = createHarness('components/LessonQuiz.tsx', {
  questions: [{ question: 'Final question?', options: ['Yes', 'No'], answer: 'Yes' }],
  takeaway: 'This takeaway belongs below the final answer.',
  onFinish() { takeawayQuizFinished += 1; },
});
takeawayQuiz.nodes('QuizQuestion')[0].props.onSelect('Yes');
assert(textContent(takeawayQuiz).includes('This takeaway belongs below the final answer.'));
takeawayQuiz.nodes('LessonFinishActions')[0].props.onComplete();
assert.equal(takeawayQuizFinished, 1);

let photonCompleted = 0, photonChosen = 0;
const photonLesson = createHarness('screens/ModuleTwoLessonThreeScreen.tsx', { onHome() {}, onChoosePhoton() { photonChosen += 1; }, onComplete() { photonCompleted += 1; } });
assert.equal(photonLesson.nodes('LessonBadge')[0].props.number, 3);
assert.equal(photonLesson.nodes('LessonBadge')[0].props.world, 2);
assert(!textContent(photonLesson).includes('GUIDING QUESTION'));
assert(!textContent(photonLesson).includes('Return to the atom from Lesson 2'));
assert(textContent(photonLesson).includes('Colourful results'));
photonLesson.nodes('PhotonLessonLabs')[0].props.onComplete();
assert.equal(photonLesson.nodes('LessonQuiz').length, 1, 'Lesson 3 notes are unmounted for the checkpoint');
assert.equal(photonLesson.nodes('LessonBadge').length, 0);
photonLesson.nodes('LessonQuiz')[0].props.onFinish(5);
assert.equal(photonLesson.nodes('TerminologyCard').length, 0, 'Photon unlock is separate from terminology cards');
assert.equal(photonLesson.nodes('PhotonUnlockModal')[0].props.visible, true, 'Photon avatar choice appears after the final quiz');
assert.equal(photonLesson.nodes('PhotonUnlockModal')[0].props.score, 5);
photonLesson.nodes('PhotonUnlockModal')[0].props.onUsePhoton();
assert.equal(photonChosen, 1);
assert.equal(photonCompleted, 1);

let photonLabsComplete = 0;
const photonLabs = createHarness('components/PhotonLessonLabs.tsx', { onComplete() { photonLabsComplete += 1; } });
photonLabs.nodes('AnswerButton')[1].props.onPress();
assert(!photonLabs.nodes('PrimaryButton').some(node => node.props.label === 'So where does it go?'));
const photonInternal = name => photonLabs.all(photonLabs.render()).find(node => typeof node.type === 'function' && node.type.name === name);
assert(photonInternal('PhotonEmissionStage'), 'The repeating electron-drop animation follows the conservation explanation');
for (let step = 0; step < 3; step += 1) photonInternal('SpectrumExplorer').props.onNext();
assert(photonInternal('VisibleRainbow'), 'The visible rainbow is separate from the tap-through spectrum');
photonInternal('FlameTest').props.onAnswer(true);
photonLabs.nodes('PrimaryButton').find(node => node.props.label === 'Start the quiz').props.onPress();
assert.equal(photonLabsComplete, 1);

let possibilityCompleted = 0;
const possibilityLesson = createHarness('screens/ModuleTwoLessonFourScreen.tsx', { onHome() {}, onComplete() { possibilityCompleted += 1; } });
assert.equal(possibilityLesson.nodes('LessonBadge')[0].props.number, 4);
assert.equal(possibilityLesson.nodes('LessonBadge')[0].props.world, 2);
assert(textContent(possibilityLesson).includes('Enough about colours.'));
assert(textContent(possibilityLesson).includes('If quantum outcomes are uncertain'));
assert.equal(possibilityLesson.nodes('PossibilityCloud').length, 0, 'The mystery cloud is not previewed before its meaning is introduced');
assert.equal(possibilityLesson.nodes('QuantumPossibilityLabs').length, 1);
possibilityLesson.nodes('QuantumPossibilityLabs')[0].props.onComplete();
assert.equal(possibilityLesson.nodes('LessonQuiz').length, 1, 'Lesson 4 notes are unmounted for the checkpoint');
assert.equal(possibilityLesson.nodes('LessonBadge').length, 0);
possibilityLesson.nodes('LessonQuiz')[0].props.onFinish(5);
assert.equal(possibilityCompleted, 1);
assert(possibilityLesson.nodes('LessonQuiz')[0].props.takeaway.includes('A quantum state lets us predict the probabilities'));
assert.equal(possibilityLesson.nodes('LessonQuiz').length, 1, 'The completed quiz stays visible while App adds its inline completion footer');

let labsCompleted = 0;
const possibilityLabs = createHarness('components/QuantumPossibilityLabs.tsx', { onComplete() { labsCompleted += 1; } });
const internal = name => possibilityLabs.all(possibilityLabs.render()).find(node => typeof node.type === 'function' && node.type.name === name);
assert(internal('FiveElectronRecall'), 'The lesson begins with five individually fired electrons');
internal('FiveElectronRecall').props.onComplete();
assert(internal('HundredParticleRun'), 'The 100-particle run follows the five-shot question');
internal('HundredParticleRun').props.onComplete();
assert(internal('WaveGuess'), 'The wave-pattern guess follows the 100-particle pattern');
assert.equal(possibilityLabs.nodes('TerminologyCard').length, 0, 'The equation and quantum state stay hidden before the wave guess');
internal('WaveGuess').props.onCorrect();
assert.equal(possibilityLabs.nodes('TerminologyCard')[0].props.term, 'Schrödinger’s wave equation');
assert(possibilityLabs.nodes('TerminologyCard').some(node => node.props.term === 'Quantum state'));
assert.equal(possibilityLabs.nodes('PossibilityCloud')[0].props.question, true, 'The quantum-state reveal uses the question-mark cloud');
assert(textContent(possibilityLabs).includes('Erwin Schrödinger made a rule that models this'));
assert(textContent(possibilityLabs).includes('we’ll use this mystery probability cloud'));
assert(internal('PreparationMachine'), 'The two-outcome preparation machine follows the quantum-state introduction');
internal('PreparationMachine').props.onComplete();
possibilityLabs.nodes('PrimaryButton').find(node => node.props.label === 'Start the quiz').props.onPress();
assert.equal(labsCompleted, 1);

let waveGuesses = 0;
const waveGuess = createHarness('components/QuantumPossibilityLabs.tsx', { onCorrect() { waveGuesses += 1; } }, 'WaveGuess');
waveGuess.nodes('TextInput')[0].props.onChangeText('a particle');
waveGuess.nodes('PrimaryButton')[0].props.onPress();
assert.equal(waveGuesses, 0);
assert(textContent(waveGuess).includes('Not quite.'));
waveGuess.nodes('TextInput')[0].props.onChangeText('a wave pattern');
waveGuess.nodes('PrimaryButton')[0].props.onPress();
assert.equal(waveGuesses, 1, 'The typed wave guess unlocks the explanation');
assert.equal(waveGuess.nodes('TextInput').length, 0, 'The completed guess cannot be submitted twice');

let superpositionCompleted = 0;
const superpositionLesson = createHarness('screens/ModuleTwoLessonFiveScreen.tsx', { onHome() {}, onComplete() { superpositionCompleted += 1; } });
assert.equal(superpositionLesson.nodes('LessonBadge')[0].props.number, 5);
assert.equal(superpositionLesson.nodes('LessonBadge')[0].props.world, 2);
assert(textContent(superpositionLesson).includes('Superpositions'));
assert.equal(superpositionLesson.nodes('SuperpositionLessonLabs').length, 1);
superpositionLesson.nodes('SuperpositionLessonLabs')[0].props.onComplete();
assert.equal(superpositionLesson.nodes('LessonQuiz').length, 1, 'Lesson 5 notes are unmounted for the checkpoint');
superpositionLesson.nodes('LessonQuiz')[0].props.onFinish(4);
assert.equal(superpositionCompleted, 1);
assert(superpositionLesson.nodes('LessonQuiz')[0].props.takeaway.includes('those parts can interfere'));

let superpositionLabsComplete = 0;
const superpositionLabs = createHarness('components/SuperpositionLessonLabs.tsx', { onComplete() { superpositionLabsComplete += 1; } });
const superpositionInternal = name => superpositionLabs.all(superpositionLabs.render()).find(node => typeof node.type === 'function' && node.type.name === name);
assert(superpositionInternal('ClassicalBoxReveal'), 'The lesson starts with ordinary uncertainty');
superpositionInternal('ClassicalBoxReveal').props.onComplete();
assert(superpositionInternal('QuantumCombination'), 'The quantum preparation follows the box reveal');
superpositionInternal('QuantumCombination').props.onComplete();
assert(superpositionInternal('InterferenceComparison'), 'Interference tests the hidden-answer idea');
superpositionInternal('InterferenceComparison').props.onComplete();
assert.equal(superpositionLabsComplete, 1);

for (const answerIndex of [0, 1]) {
  let reveals = 0;
  const paths = createHarness('components/SuperpositionLessonLabs.tsx', { onComplete() { reveals += 1; } }, 'QuantumCombination');
  const before = paths.all(paths.render());
  const diagramIndex = before.findIndex(node => typeof node.type === 'function' && node.type.name === 'LabelledSlitPaths');
  const preparationIndex = before.findIndex(node => node.type === 'Text' && node.children.includes('I’ve prepared an electron so both paths contribute to its quantum state.'));
  assert(diagramIndex >= 0 && diagramIndex < preparationIndex, 'Concrete labelled paths precede the preparation sentence');
  assert.equal(paths.nodes('TerminologyCard').length, 0, 'The definition follows the prediction rather than preceding it');
  assert.equal(paths.nodes('Image').length, 0, 'Abstract clouds do not compete with the first path visual');
  paths.nodes('AnswerButton')[answerIndex].props.onPress();
  assert.equal(reveals, 1);
  assert.equal(paths.nodes('AnswerButton').length, 0);
  assert.equal(paths.nodes('TerminologyCard').length, 0, 'Superposition is named only after the interference evidence');
  assert.equal(paths.nodes('Image').length, 0, 'The combined cloud is held until after the evidence');
  assert(textContent(paths).includes('One dot cannot tell us which idea is right'));
}
const slitPaths = createHarness('components/SuperpositionLessonLabs.tsx', {}, 'LabelledSlitPaths');
assert.equal(slitPaths.nodes('FramedSprite').length, 1);
assert(slitPaths.nodes('FramedSprite')[0].props.sprite.source.endsWith('double-slit.jpg'));
assert.deepEqual(slitPaths.nodes('Image').map(node => node.props.source.split('/').pop()), ['outcome-a-transparent.png', 'outcome-b-transparent.png']);
assert(slitPaths.nodes('View').some(node => node.props.accessibilityLabel?.includes('left opening is path A; the right opening is path B')));

let comparisonComplete = 0;
const comparison = createHarness('components/SuperpositionLessonLabs.tsx', { onComplete() { comparisonComplete += 1; } }, 'InterferenceComparison');
const waveDemo = comparison.all(comparison.render()).find(node => typeof node.type === 'function' && node.type.name === 'WavePropagationDemo');
assert(waveDemo, 'The comparison uses a one-wave then two-wave slow-motion demonstration');
assert.equal(comparison.nodes('TerminologyCard').length, 0);
waveDemo.props.onComplete();
assert.equal(comparison.nodes('TerminologyCard').length, 1, 'The term follows both observed patterns');
comparison.nodes('PrimaryButton')[0].props.onPress();
assert.equal(comparisonComplete, 1);

let measurementCompleted = 0;
const measurementLesson = createHarness('screens/ModuleTwoLessonSixScreen.tsx', { onHome() {}, onComplete() { measurementCompleted += 1; } });
assert.equal(measurementLesson.nodes('LessonBadge')[0].props.number, 6);
assert.equal(measurementLesson.nodes('LessonBadge')[0].props.world, 2);
assert(textContent(measurementLesson).includes('State collapse'));
measurementLesson.nodes('MeasurementLessonLabs')[0].props.onComplete();
assert.equal(measurementLesson.nodes('LessonQuiz').length, 1, 'Lesson 6 notes are unmounted for the checkpoint');
measurementLesson.nodes('LessonQuiz')[0].props.onFinish(4);
assert.equal(measurementCompleted, 1);
assert(measurementLesson.nodes('LessonQuiz')[0].props.takeaway.includes('Repeating the same preparation and measurement'));

let measurementLabsComplete = 0;
const measurementLabs = createHarness('components/MeasurementLessonLabs.tsx', { onComplete() { measurementLabsComplete += 1; } });
const measurementInternal = name => measurementLabs.all(measurementLabs.render()).find(node => typeof node.type === 'function' && node.type.name === name);
assert(measurementInternal('MeasurementHook'), 'Measurement starts from the established A & B state');
measurementInternal('MeasurementHook').props.onComplete();
assert(measurementInternal('MeasurementMachine'), 'The state then enters a detector');
measurementInternal('MeasurementMachine').props.onComplete();
assert.equal(measurementLabs.nodes('AnswerButton').length, 0, 'Lesson questions are reserved for the final quiz');
assert.equal(measurementLabs.nodes('TerminologyCard')[0].props.term, 'Quantum state collapse');
assert(measurementInternal('CoinCollapseDemo'), 'A hold-to-collapse coin separates possibilities from one result');
measurementInternal('CoinCollapseDemo').props.onComplete();
measurementLabs.nodes('PrimaryButton').find(node => node.props.label === 'Compare many fresh measurements').props.onPress();
assert(measurementInternal('RepeatedMeasurementLab'), 'Learners compare increasing sample sizes');
measurementInternal('RepeatedMeasurementLab').props.onComplete();
measurementLabs.nodes('PrimaryButton').find(node => node.props.label === 'Start the quiz').props.onPress();
assert.equal(measurementLabsComplete, 1);

let catCompleted = 0;
const catLesson = createHarness('screens/ModuleTwoLessonSevenScreen.tsx', { onHome() {}, onComplete() { catCompleted += 1; } });
assert.equal(catLesson.nodes('LessonBadge')[0].props.number, 7);
assert.equal(catLesson.nodes('LessonBadge')[0].props.world, 2);
assert(textContent(catLesson).includes('One Crazy Cat'));
assert.equal(catLesson.nodes('SchrodingerCatLesson').length, 1);
catLesson.nodes('SchrodingerCatLesson')[0].props.onComplete();
assert.equal(catLesson.nodes('LessonQuiz').length, 1, 'The cat lesson is unmounted for its checkpoint');
catLesson.nodes('LessonQuiz')[0].props.onFinish(4);
assert.equal(catCompleted, 1);
assert(catLesson.nodes('LessonQuiz')[0].props.takeaway.includes('thought experiment'));

let spinLabsComplete = 0;
const spinLabs = createHarness('components/SpinLessonLabs.tsx', { onComplete() { spinLabsComplete += 1; } });
const spinInternal = name => spinLabs.all(spinLabs.render()).find(node => typeof node.type === 'function' && node.type.name === name);
assert(spinInternal('SpinMisconception'), 'Spin begins by correcting the literal-rotation analogy');
assert(spinInternal('IntrinsicFeatures'), 'The supplied person and electron property sprites introduce intrinsic properties');
assert(spinInternal('ContinuousArrowDemo'), 'An ordinary continuous arrow creates the contrast with quantised spin');
spinInternal('ContinuousArrowDemo').props.onComplete();
assert(spinInternal('SpinSorter'), 'Particles are sorted into discrete outcomes');
spinInternal('SpinSorter').props.onComplete();
assert(spinInternal('QuantisedSpinIntro'), 'The sorter reconnects spin to quantisation');
assert(spinInternal('PreparedSpinCheck'), 'The learner prepares and measures along one fixed direction');
spinInternal('PreparedSpinCheck').props.onComplete();
assert(spinInternal('ConceptChain'), 'The lesson ends with a concise fixed-direction summary');
spinInternal('ConceptChain').props.onComplete();
assert.equal(spinLabsComplete, 1);

let rulesCompleted = 0, worldTwoAccessories;
const rulesLesson = createHarness('screens/ModuleTwoLessonEightScreen.tsx', {
  onHome() {},
  ownedAccessories: ['red-spectacles'],
  onUnlockAccessories(ids) { worldTwoAccessories = ids; },
  onComplete() { rulesCompleted += 1; },
});
assert.equal(rulesLesson.nodes('LessonBadge')[0].props.number, 8);
assert.equal(rulesLesson.nodes('LessonBadge')[0].props.world, 2);
assert(textContent(rulesLesson).includes('Quantum rules at work'));
assert.equal(rulesLesson.nodes('QuantumRulesFinale').length, 1);
rulesLesson.nodes('QuantumRulesFinale')[0].props.onStartChallenge();
assert.equal(rulesLesson.nodes('LessonQuiz').length, 1, 'The final challenge replaces the recap');
rulesLesson.nodes('LessonQuiz')[0].props.onFinish(5);
assert.equal(rulesLesson.nodes('QuantumBuildingFinale').length, 1);
assert.deepEqual(rulesLesson.nodes('QuantumBuildingFinale')[0].props.ownedAccessories, ['red-spectacles']);
rulesLesson.nodes('QuantumBuildingFinale')[0].props.onUnlockAccessories(['fedora', 'heart-eyes', 'freckles']);
assert.deepEqual(worldTwoAccessories, ['fedora', 'heart-eyes', 'freckles']);
rulesLesson.nodes('QuantumBuildingFinale')[0].props.onFinish();
assert.equal(rulesCompleted, 1);

const worldTwoFinaleSource = fs.readFileSync('components/QuantumRulesFinale.tsx', 'utf8');
assert(worldTwoFinaleSource.includes('<RewardPack') && worldTwoFinaleSource.includes('excludeIds={ownedAccessories}'), 'Chapter 2 ends with a mystery packet containing new cosmetics');

const app = createHarness('App.tsx');
const goNext = () => { app.nodes('LessonNavigationProvider')[0].props.onNext(); app.nodes('LessonEntryModal')[0].props.onPlay(); };
app.nodes('HomeScreen')[0].props.onSelectLesson(11); app.nodes('LessonEntryModal')[0].props.onPlay();
assert.equal(app.nodes('ModuleTwoLessonOneScreen').length, 1);
app.nodes('ModuleTwoLessonOneScreen')[0].props.onComplete(3);
goNext();
assert.equal(app.nodes('ModuleTwoLessonTwoScreen').length, 1);
app.nodes('ModuleTwoLessonTwoScreen')[0].props.onComplete(4);
goNext();
assert.equal(app.nodes('ModuleTwoLessonThreeScreen').length, 1);
app.nodes('ModuleTwoLessonThreeScreen')[0].props.onComplete(5);
goNext();
assert.equal(app.nodes('ModuleTwoLessonFourScreen').length, 1);
app.nodes('ModuleTwoLessonFourScreen')[0].props.onComplete(5);
goNext();
assert.equal(app.nodes('ModuleTwoLessonFiveScreen').length, 1);
app.nodes('ModuleTwoLessonFiveScreen')[0].props.onComplete(4);
goNext();
assert.equal(app.nodes('ModuleTwoLessonSixScreen').length, 1);
app.nodes('ModuleTwoLessonSixScreen')[0].props.onComplete(4);
goNext();
assert.equal(app.nodes('ModuleTwoLessonSevenScreen').length, 1);
app.nodes('ModuleTwoLessonSevenScreen')[0].props.onComplete(4);
goNext();
assert.equal(app.nodes('ModuleTwoLessonEightScreen').length, 1);
app.nodes('ModuleTwoLessonEightScreen')[0].props.onUnlockAccessories(['black-spectacles', 'bandage', 'fedora']);
app.nodes('ModuleTwoLessonEightScreen')[0].props.onComplete(5);
app.nodes('LessonNavigationProvider')[0].props.onHome();
assert.deepEqual(app.nodes('HomeScreen')[0].props.completed, [11, 12, 13, 14, 15, 16, 17, 18]);
assert.equal(app.nodes('HomeScreen')[0].props.unlockedWorld, 3, 'Completing Chapter 2 opens the Chapter 3 unlock popup on Home');
assert.equal(app.nodes('HomeScreen')[0].props.xp, 0);
app.nodes('HomeScreen')[0].props.onCustomise();
assert.deepEqual(app.nodes('CustomisationScreen')[0].props.owned, ['black-spectacles', 'bandage', 'fedora']);

const home = createHarness('screens/HomeScreen.tsx', { xp: 120, collected: true, completed: [11, 13], onContinue() {}, onSelectLesson() {} });
assert(textContent(home).includes('The Quantum'));
assert(textContent(home).includes('Rules'));
assert(textContent(home).includes('2/8'));
assert(textContent(home).includes('Colourful results'));
assert(textContent(home).includes('Quantum state of mind'));
assert(textContent(home).includes('Superpositions'));
assert(textContent(home).includes('State collapse'));
assert(textContent(home).includes('One Crazy Cat'));
assert(textContent(home).includes('Quantum rules at work'));
assert(textContent(home).includes('TAP TO EXPLORE'));
const homeSource = fs.readFileSync('screens/HomeScreen.tsx', 'utf8');
const unlockSource = fs.readFileSync('components/WorldUnlockModal.tsx', 'utf8');
assert(homeSource.includes('WorldUnlockModal') && homeSource.includes('scrollTo') && homeSource.includes('worldOffsets'), 'The unlock popup can take the learner to the newly unlocked world');
assert(unlockSource.includes('You’ve unlocked Chapter') && unlockSource.includes('Take me there') && unlockSource.includes('Later'), 'The world unlock popup offers immediate and later choices');

const quantisationSource = fs.readFileSync('components/QuantisationLab.tsx', 'utf8');
assert(quantisationSource.includes('stairs-transparent.png'));
assert(!quantisationSource.includes('borderColor: colors.ink, borderRadius: 21'), 'Ramp and staircase no longer sit in bordered cards');
assert(quantisationSource.includes('levelValue: { color: colors.primary') && quantisationSource.includes('measureNumber: { color: colors.primary'), 'Ramp value and step value use the same colour');
const levelsSource = fs.readFileSync('components/AtomEnergyInspect.tsx', 'utf8');
assert(levelsSource.includes('[151, 63, 29]') && levelsSource.includes('[175, 78, 39]'), 'Electron positions use the measured rows of the newly aligned energy artwork with enough room for the sprite');
assert(levelsSource.includes('<EnergyLevelsDiagram pulseSteps />') && levelsSource.includes('Animated.loop'), 'The staircase energy-level sprite fades over the plain sprite');
const plainLevels = PNG.sync.read(fs.readFileSync('assets/module-2/energy-levels-transparent.png'));
const steppedLevels = PNG.sync.read(fs.readFileSync('assets/module-2/energy-levels-with-steps-transparent.png'));
assert.deepEqual([plainLevels.width, plainLevels.height], [steppedLevels.width, steppedLevels.height], 'Lesson 2 energy-level animation frames share one aligned crop');
const photonSource = fs.readFileSync('components/PhotonLessonLabs.tsx', 'utf8');
assert(photonSource.includes('blowtorch-fire-1-transparent.png') && photonSource.includes('blowtorch-fire-2-transparent.png'), 'Blowtorch alternates both supplied transparent flame frames');
assert(photonSource.includes('tap the handle to use the blowtorch'));
assert(!photonSource.includes('So where does it go?'));
assert(photonSource.includes('ExploreFurther'));
assert(photonSource.includes('Animated.loop') && !photonSource.includes('onFinished'), 'Photon emission repeats instead of running once');
assert(photonSource.includes('Repeated question animation: electron drops from Level 3 to Level 1') && photonSource.includes('question-mark-transparent.png'), 'The opening prompt loops the electron drop with the supplied question mark');
assert(photonSource.includes('MergingEnergyLevels') && photonSource.includes('many separate atomic energy levels crowd together'), 'Many separated levels animate into the continuous-level artwork');
assert(photonSource.includes('gapEquation: { color: colors.ink') && !photonSource.includes('gapEquationHigh: { color:'), 'Both energy-gap equations use the default text colour');
assert(!photonSource.includes('GapCard') && !photonSource.includes('AbsorptionLab'), 'Energy gaps and absorption are concise theory rather than extra interactives');
const photonModalSource = fs.readFileSync('components/PhotonUnlockModal.tsx', 'utf8');
assert(photonModalSource.includes('Elementary particle unlocked!') && photonModalSource.includes('<Modal'), 'Photon unlock uses a separate post-quiz modal window');
assert(photonSource.includes('tap to reveal') && !photonSource.includes('Reveal X-rays'), 'Spectrum artwork is the reveal target');
assert(photonSource.includes('electromagnetic-xray.jpg') && photonSource.includes('electromagnetic-microwave-xray.jpg') && photonSource.includes('electromagnetic-visible.jpg'));
assert(photonSource.includes('energy-levels-transparent.png') && photonSource.includes('energy-levels-with-steps-transparent.png'), 'Energy interactions use the supplied energy-level sprites');
assert(photonSource.includes('Max Planck') && photonSource.includes('Albert Einstein'), 'History copy correctly distinguishes Planck from the photoelectric explanation');
assert(photonSource.includes('photoelectric-effect-transparent.png') && photonSource.includes('rainbow-basketball-flame-transparent.png') && photonSource.includes('continuous-levels-transparent.png'), 'New lesson cartoons are shown in their requested sections');
assert(fs.existsSync('assets/module-2/lesson-3/question-mark-transparent.png'));
assert(photonSource.includes("'Lithium - red'") && photonSource.includes("'Potassium - purple'"));
const torchFrames = ['blowtorch-transparent.png', 'blowtorch-fire-1-transparent.png', 'blowtorch-fire-2-transparent.png'].map(name => PNG.sync.read(fs.readFileSync(`assets/module-2/lesson-3/${name}`)));
assert(torchFrames.every(frame => frame.width === torchFrames[0].width && frame.height === torchFrames[0].height), 'Blowtorch frames share an aligned crop');
for (const element of ['lithium', 'sodium', 'potassium', 'copper']) {
  const plain = PNG.sync.read(fs.readFileSync(`assets/module-2/lesson-3/${element}-transparent.png`));
  const fire = PNG.sync.read(fs.readFileSync(`assets/module-2/lesson-3/${element}-fire-transparent.png`));
  assert.deepEqual([plain.width, plain.height], [fire.width, fire.height], `${element} frames share an aligned crop`);
}
const possibilitySource = fs.readFileSync('components/QuantumPossibilityLabs.tsx', 'utf8');
assert(possibilitySource.includes('Fire an electron') && possibilitySource.includes('shots >= 5'));
assert(possibilitySource.includes('Shoot them all') && possibilitySource.includes('What does this look like?'));
assert(!possibilitySource.includes('ILLUSTRATIVE PATTERN · 100 PARTICLES'));
assert(possibilitySource.includes('Mostly A') && possibilitySource.includes('Balanced') && possibilitySource.includes('Mostly B'));
assert(!possibilitySource.includes('Two-outcome possibility maker') && possibilitySource.includes('leftLabel={`A\\n${choice.a}%`}') && possibilitySource.includes('rightLabel={`B\\n${100 - choice.a}%`}'), 'The maker stacks changing A/B probabilities inside its cloud');
assert(possibilitySource.includes('outcome-a-transparent.png') && possibilitySource.includes('outcome-b-transparent.png') && possibilitySource.includes('outcomeSprite'), 'The possibility maker uses the supplied A and B outcome sprites');
assert(possibilitySource.includes('attempts >= 5') && possibilitySource.includes('I’m stuck, can you reveal the answer?'), 'The wave guess offers a small reveal only after five misses');
assert(!possibilitySource.includes('<PossibilityCloud />'), 'The quantum-state reveal no longer uses unlabeled stronger/weaker glow text');
assert(possibilitySource.includes('Run 100 experiments'));
assert(possibilitySource.includes('A probability does not mean every small set of experiments will match perfectly'));
assert(possibilitySource.includes('The uncertainty still follows precise mathematical rules'));
assert(possibilitySource.includes('Schrödinger’s wave equation') && possibilitySource.toLowerCase().includes('wavefunction') && possibilitySource.includes('schrodinger-wave-equation-transparent.png'), 'Lesson 4 introduces the wave equation with the supplied artwork and explains its role in the quantum state');
assert(fs.existsSync('assets/module-2/lesson-4/schrodinger-wave-equation-transparent.png'), 'The supplied wave-equation sprite exists');
assert(!possibilitySource.includes('iℏ ∂ψ/∂t = Ĥψ'), 'The temporary typeset equation is replaced by the supplied sprite');
assert(fs.existsSync('assets/module-2/lesson-4/possibility-cloud-transparent.png'));
assert(fs.existsSync('assets/module-2/lesson-4/possibility-cloud-question-transparent.png'));
const superpositionSource = fs.readFileSync('components/SuperpositionLessonLabs.tsx', 'utf8');
assert(superpositionSource.includes('boxes-closed-transparent.png') && superpositionSource.includes('boxes-ball-a-transparent.png'), 'The classical reveal uses both aligned box frames');
assert(superpositionSource.includes('<PossibilityCloud outcomeLetters'), 'The preparation shows the floating A/B state cloud');
assert(superpositionSource.includes('Watch the paths interfere') && superpositionSource.includes('SlitWaveComparison'), 'The superposition evidence is shown with slow-motion wave overlap');
assert(superpositionSource.includes('WavePropagationDemo') && superpositionSource.includes("require('../assets/double-slit/double-slit.jpg')"), 'The path labels reuse the original wall and the later comparison focuses on wave motion');
assert(superpositionSource.includes('Has the electron secretly chosen one slit before we check?'));
assert(superpositionSource.includes('no detector checks which path'), 'The setup distinguishes path measurement from recording an arrival');
assert(superpositionSource.includes('MYSTERY SOLVED') && superpositionSource.indexOf('MYSTERY SOLVED') < superpositionSource.indexOf('<TerminologyCard term="Superposition"'), 'The interference evidence precedes the new terminology');
assert(!superpositionSource.includes('Try the quantum version') && !superpositionSource.includes('Combine A and B') && !superpositionSource.includes('Let’s test it') && !superpositionSource.includes('Lock that in'), 'Explanations unfold without redundant continue buttons');
assert(!superpositionSource.includes('Mostly A') && !superpositionSource.includes('Mostly B'), 'Unequal probabilities are left to Lesson 6 rather than adding another idea here');
assert(!superpositionSource.toLowerCase().includes('wavefunction'), 'Superposition remains notation-free');
const closedBoxes = PNG.sync.read(fs.readFileSync('assets/module-2/lesson-5/boxes-closed-transparent.png'));
const revealedBoxes = PNG.sync.read(fs.readFileSync('assets/module-2/lesson-5/boxes-ball-a-transparent.png'));
assert.deepEqual([closedBoxes.width, closedBoxes.height], [revealedBoxes.width, revealedBoxes.height], 'Box reveal frames share one aligned crop');
const measurementSource = fs.readFileSync('components/MeasurementLessonLabs.tsx', 'utf8');
assert(measurementSource.includes('sampleBinary(4, 0.7)') && measurementSource.includes('fresh electron prepared in the same A &amp; B state'), 'Repeated detector records use fresh, identically prepared systems');
assert(measurementSource.includes('sampleBinary(size, 0.7)') && !measurementSource.includes('699'), 'Each run is sampled rather than pre-filled');
assert(measurementSource.includes('Quantum state collapse') && measurementSource.includes('Compare many fresh measurements'), 'Collapse is introduced before the repeated-measurement experiment');
assert(measurementSource.includes('CoinCollapseDemo') && measurementSource.includes('Hold the spinning coin down to collapse it'), 'The coin analogy is interactive');
assert(!measurementSource.includes('AnswerButton'), 'Lesson 6 reserves assessed questions for the final quiz');
assert(measurementSource.includes('detector-transparent.png') && measurementSource.includes('outcome-a-transparent.png') && measurementSource.includes('outcome-b-transparent.png'), 'Measurement uses the supplied detector and outcome artwork');
assert(measurementSource.includes('OUTCOME') && !measurementSource.includes('RECORD') && !measurementSource.includes('Separate state from outcome') && !measurementSource.includes('What does measurement mean?'), 'Results are labelled clearly and theory does not require extra reveal buttons');
assert(measurementSource.includes('What causes this randomness?') && measurementSource.includes('they don’t all agree on the story behind what happens during measurement') && !measurementSource.toLowerCase().includes('multiverse'), 'Interpretation language stays accurate and neutral');
assert(fs.existsSync('assets/module-2/lesson-6/detector-transparent.png'));
assert(fs.existsSync('assets/module-2/lesson-6/outcome-a-transparent.png'));
assert(fs.existsSync('assets/module-2/lesson-6/outcome-b-transparent.png'));
const spinSource = fs.readFileSync('components/SpinLessonLabs.tsx', 'utf8');
assert(spinSource.includes('not a tiny ball turning around') && spinSource.includes('NOT QUITE'), 'Spin is not presented as literal rotation');
assert(spinSource.includes('person-properties-transparent.png') && spinSource.includes('electron-properties-transparent.png'), 'Lesson 7 uses both newly supplied properties sprites');
assert(spinSource.includes('spin-up-transparent.png') && spinSource.includes('spin-down-transparent.png'), 'Lesson 7 uses the supplied spin outcome sprites');
assert(spinSource.includes('Electrons entering a vertical spin sorting machine') && spinSource.includes('style={styles.incomingElectron}'), 'The incoming sorter stream uses electron sprites rather than generic dots');
assert(spinSource.includes('spin up or spin down along that direction'), 'Spin outcomes are defined relative to the chosen direction');
assert(spinSource.includes('Turn the ordinary arrow') && spinSource.includes("outputRange: ['0deg', '180deg']"), 'The continuous arrow animates from 0 to 1');
assert(!spinSource.includes('SpinAxisLab') && spinSource.includes('Later, we can explore what happens when the direction of the detector changes'), 'Changing detector axes is deferred');
assert(spinSource.includes('preparing spin up and measuring in the same direction gives spin up with certainty'), 'The fixed-direction example preserves the ideal same-axis result');
assert(spinSource.includes('Animated.loop'), 'The opening spin misconception is animated');
for (const asset of ['person-properties-transparent.png', 'electron-properties-transparent.png', 'spin-down-transparent.png', 'spin-up-transparent.png']) assert(fs.existsSync(`assets/module-2/lesson-7/${asset}`));
const finaleSource = fs.readFileSync('components/QuantumRulesFinale.tsx', 'utf8');
for (const rule of ['Quantisation', 'Energy levels', 'Photons', 'Quantum states', 'Superposition', 'Measurement']) assert(finaleSource.includes(rule), `Final recap includes ${rule}`);
assert(!finaleSource.includes('Completed Quantum Building') && !finaleSource.includes('detector-transparent.png'), 'The Chapter 2 completion copy is no longer preceded by a crowded sprite scene');
assert(finaleSource.includes('ruleSprites') && finaleSource.includes('possibility-cloud-transparent.png') && finaleSource.includes('state-a-and-b-centered-transparent.png'), 'Every recap heading uses a lesson sprite instead of a numbered circle');
assert(finaleSource.includes('What happens when quantum systems start interacting?') && finaleSource.includes('Two quantum particles forming a glowing connection'), 'The finale leads into interacting systems');
assert(!finaleSource.includes("['Spin',"), 'Spin is no longer part of the Chapter 2 recap');
assert(finaleSource.includes('photon-celebrating-transparent.png') && finaleSource.includes('shadow-transparent.png') && finaleSource.includes('WorldCelebration'), 'The finale celebrates with the supplied photon, shadow and confetti');
assert(finaleSource.includes('There are more weird things to find out in Chapter 3!') && finaleSource.includes('next={false}'), 'The Chapter 2 finale teases Chapter 3 and returns Home without a next-lesson button');
const catSource = fs.readFileSync('components/SchrodingerCatLesson.tsx', 'utf8');
assert(catSource.includes('CatBoxSetup') && catSource.includes('CatApparatusExperiment'), 'The cat thought experiment has tactile setup and a supplied apparatus stage');
assert(catSource.includes('radioactive atom') && catSource.includes('constantly interacting with one another and their surroundings') && catSource.includes('Decoherence'), 'The cat explanation remains physically accurate and does not require consciousness');
assert(catSource.includes('Math.random() < 0.5') && catSource.includes('Run the experiment again'), 'Each apparatus rerun independently samples an alive or dead result');
assert(catSource.includes('setInterval(() => setBlink(value => !value), 1000)'), 'The waiting cat blinks once per second');
assert(catSource.includes('No cats were harmed'), 'The lesson closes with its safety reassurance');
const catArtwork = [
  'schrodinger-and-cat-transparent.png',
  'cat-standing-transparent.png',
  'cat-lifted-transparent.png',
  'empty-big-box-transparent.png',
  'box-with-cat-transparent.png',
  'box-with-tape-transparent.png',
  'apparatus-ready-transparent.png',
  'apparatus-blink-transparent.png',
  'apparatus-alive-transparent.png',
  'apparatus-dead-transparent.png',
  'apparatus-human-transparent.png',
  'einstein-unhappy-transparent.png',
];
for (const asset of catArtwork) {
  assert(catSource.includes(asset), `The cat lesson uses ${asset}`);
  assert(fs.existsSync(`assets/module-2/lesson-7/cat/${asset}`), `${asset} exists`);
}
assert(catSource.includes('source={dragging ? catLifted : catStanding}'), 'The cat changes to the lifted drawing while it is being dragged');
assert(catSource.includes('source={sealed ? boxWithTape : placed ? boxWithCat : emptyBigBox}'), 'The box advances through the supplied empty, cat and taped sprites');
assert(!catSource.includes('🐈') && !catSource.includes('🐱') && !catSource.includes('😺') && !catSource.includes('😵') && !catSource.includes('👨‍🔬'), 'Uploaded cat artwork replaces the temporary cat and Schrödinger emoji');
const preloadSource = fs.readFileSync('data/preloadAssets.ts', 'utf8');
for (const asset of catArtwork) assert(preloadSource.includes(asset), `${asset} is preloaded for Chapter 2`);
const apparatusFrames = ['apparatus-ready-transparent.png', 'apparatus-blink-transparent.png', 'apparatus-alive-transparent.png', 'apparatus-dead-transparent.png', 'apparatus-human-transparent.png'].map(name => PNG.sync.read(fs.readFileSync(`assets/module-2/lesson-7/cat/${name}`)));
assert(apparatusFrames.every(frame => frame.width === apparatusFrames[0].width && frame.height === apparatusFrames[0].height), 'Every cat apparatus frame shares one aligned crop');
const moduleTwoData = fs.readFileSync('data/moduleTwo.ts', 'utf8');
assert(moduleTwoData.includes('export const schrodingerCatQuestions') && moduleTwoData.includes('export const quantumRulesChallengeQuestions'), 'The cat checkpoint and Chapter 2 final challenge use shared quiz data');
const exportedQuizData = {};
new Function('exports', ts.transpileModule(moduleTwoData, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText)(exportedQuizData);
assert.deepEqual(exportedQuizData.spinQuestions.map(item => item.options.indexOf(item.answer)), [0, 1, 2, 1], 'Lesson 7 correct answers move between positions');
assert.deepEqual(exportedQuizData.schrodingerCatQuestions.map(item => item.options.indexOf(item.answer)), [0, 1, 2, 0], 'The new cat lesson correct answers move between positions');
assert.deepEqual(exportedQuizData.quantumRulesChallengeQuestions.map(item => item.options.indexOf(item.answer)), [1, 2, 1, 0, 2], 'Lesson 8 correct answers move between positions');
assert(fs.existsSync('assets/brand/qurio-logo-transparent.png'));

console.log('PASS: Module 2 quantisation through spin and the Chapter 2 finale');
