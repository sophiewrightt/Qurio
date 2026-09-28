const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createHarness } = require('./component-harness.cjs');

const textContent = screen => screen.all(screen.render()).flatMap(node => node.type === 'Text' ? node.children : []).join('');

const terminology = createHarness('components/TerminologyCard.tsx', { term: 'Superposition', definition: 'A combination of possible states.' });
const terminologyImages = terminology.nodes('Image');
assert.equal(terminologyImages.length, 2);
assert(terminologyImages.some(node => String(node.props.source).includes('new-terminology-transparent.png')));
assert(terminologyImages.some(node => String(node.props.source).includes('terminology-sparkles-transparent.png')));
assert(textContent(terminology).includes('Superposition'));
assert(textContent(terminology).includes('A combination of possible states.'));

let quizPresses = 0;
const quizButton = createHarness('components/PrimaryButton.tsx', { label: 'Start the quiz', onPress() { quizPresses += 1; } });
assert.equal(quizButton.nodes('Image').length, 1);
assert(String(quizButton.nodes('Image')[0].props.source).includes('ready-for-quiz-transparent.png'));
assert.equal(quizButton.nodes('Image')[0].props.style.transform, undefined, 'The replacement quiz artwork renders straight');
assert.equal(quizButton.nodes('Pressable')[0].props.accessibilityLabel, 'Ready for the quiz!');
quizButton.nodes('Pressable')[0].props.onPress();
assert.equal(quizPresses, 1);

const finalChallenge = createHarness('components/PrimaryButton.tsx', { label: 'Start the final challenge', onPress() {} });
assert(String(finalChallenge.nodes('Image')[0].props.source).includes('ready-for-quiz-transparent.png'), 'The Chapter 2 final challenge uses the same quiz-entry artwork');

const ordinaryButton = createHarness('components/PrimaryButton.tsx', { label: 'Continue', onPress() {} });
assert.equal(ordinaryButton.nodes('Image').length, 0, 'Ordinary action buttons keep their standard appearance');
assert(textContent(ordinaryButton).includes('Continue'));

for (const asset of ['new-terminology-transparent.png', 'terminology-sparkles-transparent.png', 'ready-for-quiz-transparent.png']) {
  assert(fs.existsSync(`assets/ui/${asset}`));
  assert(fs.readFileSync('data/preloadAssets.ts', 'utf8').includes(asset), `${asset} is preloaded`);
}

const finishActions = fs.readFileSync('components/LessonFinishActions.tsx', 'utf8');
assert(finishActions.includes('backgroundColor: colors.yellow') && finishActions.includes("backgroundColor: '#DDD6F5'"), 'Completion navigation uses the app’s warm yellow and lavender palette');
assert(!finishActions.includes('.png') && !finishActions.includes('<Image'), 'Completion navigation does not use the rough uploaded button artwork');
assert(!fs.existsSync('components/LessonCompletionScreen.tsx'), 'The detached completion panel has been removed');
assert(fs.readFileSync('components/ParticleUnlockModal.tsx', 'utf8').includes('Equip electron as avatar'));

console.log('PASS: supplied terminology and quiz artwork is applied through shared UI defaults');
