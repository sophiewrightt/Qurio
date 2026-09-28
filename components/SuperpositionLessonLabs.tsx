import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AnswerButton } from './AnswerButton';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';
import { FramedSprite } from './FramedSprite';
import { PossibilityCloud } from './PossibilityCloud';
import { SlitWaveComparison } from './SlitWaveComparison';
import { MysteryIcon } from './MysteryIcon';
import { colors, fonts, radii, spacing } from '../constants/theme';

const closedBoxes = require('../assets/module-2/lesson-5/boxes-closed-transparent.png');
const ballInA = require('../assets/module-2/lesson-5/boxes-ball-a-transparent.png');
const originalDoubleSlit = require('../assets/double-slit/double-slit.jpg');
const slitWall = { source: originalDoubleSlit, frame: [0.363, 0.245, 0.03, 0.48] as const };
const pathA = require('../assets/module-2/lesson-6/outcome-a-transparent.png');
const pathB = require('../assets/module-2/lesson-6/outcome-b-transparent.png');

export function LabelledSlitPaths() {
  return <View accessible accessibilityRole="image" accessibilityLabel="Double-slit wall: the left opening is path A; the right opening is path B." style={styles.labelledSlits}>
    {/* Reuse only the wall from the original diagram. Rotate its view so the
        original upper/lower openings become left/right, without editing pixels. */}
    <View style={styles.rotatedWall}><FramedSprite sprite={slitWall} width={16} height={256} /></View>
    <Image source={pathA} resizeMode="contain" style={[styles.pathLetter, styles.pathA]} />
    <Image source={pathB} resizeMode="contain" style={[styles.pathLetter, styles.pathB]} />
  </View>;
}

function ClassicalBoxReveal({ onComplete }: { onComplete: () => void }) {
  const [guess, setGuess] = useState<string>();
  const choose = (option: string) => {
    setGuess(option);
    onComplete();
  };
  return <View style={styles.section}>
    <Text style={styles.body}>I’ve hidden a basketball in Box A or Box B. Can you guess where it is?</Text>
    <Image accessibilityLabel={guess ? 'The basketball revealed inside Box A' : 'Two closed boxes labelled A and B'} source={guess ? ballInA : closedBoxes} resizeMode="contain" style={styles.boxArtwork} />
    {!guess && <View style={styles.answerStack}>
      {['Box A', 'Box B', 'I’m not sure'].map(option => <AnswerButton key={option} label={option} state="default" onPress={() => choose(option)} />)}
    </View>}
    {guess && <>
      <Text style={styles.resultTitle}>It was in Box A.</Text>
      <Text style={styles.body}>The ball had a definite location before we looked. We just didn’t know it. That is ordinary uncertainty.</Text>
    </>}
  </View>;
}

export function QuantumCombination({ onComplete }: { onComplete: () => void }) {
  const [guess, setGuess] = useState<string>();
  const choose = (option: string) => {
    setGuess(option);
    onComplete();
  };
  return <View style={styles.section}>
    <Text style={styles.heading}>Now, an electron</Text>
    <Text style={styles.body}>Call the path through the left slit A, and the path through the right slit B.</Text>
    <LabelledSlitPaths />
    <Text style={styles.body}>I’ve prepared an electron so both paths contribute to its quantum state.</Text>
    <PossibilityCloud outcomeLetters leftStrength={0.5} rightStrength={0.5} />
    <Text style={styles.body}>Both slits are open, and no detector checks which path the electron takes.</Text>
    <Text style={styles.body}>Now we know that it’s possible for the electron to travel through either of these paths. But...</Text>
    <Text style={styles.prompt}>Is this just like the basketball in the boxes? Has the electron secretly chosen one slit before we check?</Text>
    {!guess && <View style={styles.answerStack}>{['Yes - it has already chosen one', 'Maybe not - both paths might contribute'].map(option => <AnswerButton key={option} label={option} state="default" onPress={() => choose(option)} />)}</View>}
    {guess && <View style={styles.pathMystery}><MysteryIcon /><Text style={styles.pathMysteryLabel}>MYSTERY #3</Text><Text style={styles.pathMysteryTitle}>Which path did the electron take?</Text><Text style={styles.pathMysteryBody}>One dot cannot tell us which idea is right: whether one hidden path was chosen or both path contributions were part of the quantum state. We need to repeat the experiment and study the pattern.</Text></View>}
  </View>;
}

const rainbowColours = ['#E95B4F', '#F39A44', '#D0A92F', '#45A66D', '#4B91CC', '#7659C7', '#D9589C'];

function RainbowPhrase({ children }: { children: string }) {
  return <Text style={styles.rainbowPhrase}>{children.split('').map((letter, index) => <Text key={`${letter}-${index}`} style={{ color: rainbowColours[index % rainbowColours.length] }}>{letter}</Text>)}</Text>;
}

export function WavePropagationDemo({ onComplete }: { onComplete: () => void }) {
  return <SlitWaveComparison onComplete={onComplete} />;
}

export function InterferenceComparison({ onComplete }: { onComplete: () => void }) {
  const [complete, setComplete] = useState(false);
  return <View style={styles.section}>
    <Text style={styles.heading}>Watch the paths interfere</Text>
    <Text style={styles.body}>Remember the water waves from Chapter 1? Compare each slit on its own with both slits open together. Watch where the waves reach the screen.</Text>
    <WavePropagationDemo onComplete={() => setComplete(true)} />
    {complete && <>
      <View style={styles.solvedCard}><Text style={styles.solvedLabel}>MYSTERY SOLVED</Text><Text style={styles.solvedText}>If the electron had secretly used only A or only B, the separate results would simply add. With both open, the path contributions reinforce or cancel each other. The interference pattern is evidence for a combined quantum state, not just one hidden path.</Text></View>
      <Text style={styles.body}>This is the kind of quantum strangeness people mean when they talk about things being in two places at once. More precisely, before measurement we describe the electron’s state as having contributions from two or more places</Text>
      <RainbowPhrase>at the same time!</RainbowPhrase>
      <Text style={styles.body}>The combination of alternatives in one quantum state is called a superposition.</Text>
      <TerminologyCard term="Superposition" definition="A quantum state made from a combination of different possible states whose contributions can interfere." />
      <PrimaryButton label="Start the quiz" onPress={onComplete} />
    </>}
  </View>;
}

export function SuperpositionLessonLabs({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  return <>
    <ClassicalBoxReveal onComplete={() => setStage(1)} />
    {stage >= 1 && <QuantumCombination onComplete={() => setStage(2)} />}
    {stage >= 2 && <InterferenceComparison onComplete={onComplete} />}
  </>;
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  heading: { color: colors.ink, fontFamily: fonts.display, fontSize: 30, lineHeight: 36, marginTop: 16, marginBottom: 10 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginBottom: 18 },
  prompt: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 25, lineHeight: 31, marginVertical: 16 },
  reveal: { color: colors.ink, fontFamily: fonts.body, fontSize: 23, lineHeight: 30, marginBottom: 18 },
  boxArtwork: { width: '100%', height: 220, alignSelf: 'center', marginVertical: 4 },
  labelledSlits: { width: 260, height: 96, alignSelf: 'center', marginBottom: 18, backgroundColor: colors.background },
  rotatedWall: { position: 'absolute', left: 122, top: -58, width: 16, height: 256, transform: [{ rotate: '-90deg' }], mixBlendMode: 'multiply' },
  pathLetter: { position: 'absolute', top: 10, width: 30, height: 38 },
  pathA: { left: 77 },
  pathB: { left: 141 },
  answerStack: { gap: 10, marginBottom: 12 },
  resultTitle: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 28, textAlign: 'center', marginBottom: 10 },
  pathMystery: { alignItems: 'center', padding: 19, marginTop: 16, marginBottom: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.ink, borderRadius: radii.lg, backgroundColor: '#27233F' },
  pathMysteryLabel: { color: colors.yellow, fontFamily: fonts.display, fontSize: 15, letterSpacing: 1.2 },
  pathMysteryTitle: { color: colors.white, fontFamily: fonts.body, fontSize: 27, lineHeight: 35, textAlign: 'center', marginVertical: 14 },
  pathMysteryBody: { color: '#D9D4E8', fontFamily: fonts.body, fontSize: 21, lineHeight: 29, textAlign: 'center' },
  solvedCard: { backgroundColor: '#E4F4EC', borderWidth: 2, borderColor: colors.green, borderRadius: radii.lg, padding: 17, marginVertical: 18, transform: [{ rotate: '0.5deg' }] },
  solvedLabel: { color: colors.green, fontFamily: fonts.display, fontSize: 17, letterSpacing: 1.2, textAlign: 'center', marginBottom: 8 },
  solvedText: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 28 },
  rainbowPhrase: { fontFamily: fonts.display, fontSize: 40, lineHeight: 48, textAlign: 'center', marginTop: -8, marginBottom: 22, fontWeight: '700' },
});
