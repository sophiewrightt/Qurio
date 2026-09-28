import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AnswerButton, type AnswerState } from './AnswerButton';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';
import { colors, fonts, radii, spacing } from '../constants/theme';

const closedBoxes = require('../assets/module-3/lesson-2/boxes-closed-aligned-transparent.png');
const socksInBoxes = require('../assets/module-3/lesson-2/socks-boxes-transparent.png');
const angryElectron = require('../assets/module-3/lesson-5-bell/electron-angry-transparent.png');
const boxingRing = require('../assets/module-3/lesson-5-bell/boxing-ring-transparent.png');
const unhappyEinstein = require('../assets/module-3/lesson-5-bell/einstein-unhappy-face-transparent.png');

function answerState(option: string, selected: string | undefined, correct: string): AnswerState {
  if (!selected) return 'default';
  if (selected === correct && option === correct) return 'correct';
  return option === selected ? 'incorrect' : 'default';
}

function DebateFaceOff() {
  return <Image accessibilityLabel="Einstein and the electron face off in the boxing ring" source={boxingRing} resizeMode="contain" style={styles.boxingRing} />;
}

function SwingingBell() {
  const swing = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(swing, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(swing, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [swing]);
  return <Animated.Image source={require('../assets/module-3/refinements/bell.png')} resizeMode="contain" accessibilityLabel="A bell swings from side to side" style={[styles.bell, { transform: [{ rotate: swing.interpolate({ inputRange: [0,1], outputRange: ['-12deg','12deg'] }) }] }]} />;
}

function BellVerdict() {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(bounce, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(bounce, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [bounce]);

  return <View accessibilityLabel="The electron celebrates first place; Einstein stands on the second-place podium" style={styles.podiumScene}>
    <Image source={require('../assets/module-3/refinements/podium.png')} resizeMode="contain" style={styles.podium} />
    <Animated.Image source={require('../assets/module-3/refinements/boxing-electron-celebrating.png')} resizeMode="contain" style={[styles.winningElectron, { transform: [{ translateY: bounce.interpolate({ inputRange: [0,1], outputRange: [0,-22] }) }] }]} />
  </View>;
}

function SummaryPoint({ children }: { children: ReactNode }) {
  return <View style={styles.summaryPoint}>
    <Text style={styles.summaryDot}>•</Text>
    <Text style={styles.summaryText}>{children}</Text>
  </View>;
}

export function NoSignallingLesson({ onComplete }: { onComplete: () => void }) {
  const [boxesOpened, setBoxesOpened] = useState(false);
  const [fasterThanLightAnswer, setFasterThanLightAnswer] = useState<string>();
  const correctAnswer = 'No';
  const fasterThanLightSolved = fasterThanLightAnswer === correctAnswer;

  return <>
    <Text style={styles.body}>So we’ve run into two confusing things here.</Text>
    <View style={styles.recapCard}>
      <Text style={styles.recapNumber}>1</Text>
      <Text style={styles.recapText}>When Alex measured one vertical spin result, Barb measured the opposite result along that same direction.</Text>
      <Text style={styles.recapNumber}>2</Text>
      <Text style={styles.recapText}>The results still match when the quarks are so far apart that no light-speed signal could cross the gap in time.</Text>
    </View>
    <Text style={styles.body}>This was a big deal, because these rules govern how the universe works!</Text>

    <Text style={styles.either}>Either…</Text>
    <View style={[styles.argumentCard, styles.argumentOne]}>
      <Text style={styles.argumentHeading}>ARGUMENT #1</Text>
      <Image source={unhappyEinstein} resizeMode="contain" style={styles.argumentFace} />
      <Text style={styles.cardBody}>The strange quarks had real, definite local properties before they were measured. They were like a pair of socks packed into two boxes, with every answer set beforehand.</Text>
      <Text style={styles.cardBody}>If that is the whole story, no information needs to travel between the boxes. Opening one box only tells you what was already inside the other.</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={boxesOpened ? 'Two open boxes reveal a left sock and a right sock' : 'Tap the two closed boxes to open them'}
        disabled={boxesOpened}
        onPress={() => setBoxesOpened(true)}
        style={({ pressed }) => [styles.sockButton, pressed && styles.pressed]}
      >
        <Image source={boxesOpened ? socksInBoxes : closedBoxes} resizeMode="contain" style={styles.sockBoxes} />
        {!boxesOpened && <Text style={styles.tapHint}>TAP TO OPEN THE BOXES</Text>}
      </Pressable>
      {boxesOpened && <Text style={styles.sockResult}>A right sock here means the other box contains the left sock. The socks did not decide when the boxes opened.</Text>}
    </View>

    {boxesOpened && <>
      <Text style={styles.or}>Or…</Text>
      <View style={[styles.argumentCard, styles.argumentTwo]}>
        <Text style={styles.argumentHeading}>ARGUMENT #2</Text>
        <Image source={angryElectron} resizeMode="contain" style={styles.argumentFace} />
        <Text style={styles.cardBody}>The strange quarks <Text style={styles.underlined}>do not</Text> carry definite local answers before measurement. Quantum mechanics describes the pair with one joint state, which produces strong correlations even when the particles are light-years apart.</Text>
      </View>

      <Text style={styles.heading}>Two camps</Text>
      <Text style={styles.body}>Einstein disliked argument #2: quantum mechanics being the complete story. He defended the definiteness of the particles and argued that hidden properties, which we do not know, might determine their measurement results.</Text>
      <Image source={require('../assets/module-3/refinements/instruction-sheet.png')} resizeMode="contain" accessibilityLabel="A strange quark with a hidden answer sheet" style={styles.boxingRing} />
      <Text style={styles.body}>The other camp accepted quantum mechanics’ joint-state predictions without local pre-written answers.</Text>
      <DebateFaceOff />

      <Text style={styles.heading}>Then Bell entered the ring</Text>
      <SwingingBell />
      <Text style={styles.body}>In 1964, physicist John Bell found a way to test the disagreement using maths.</Text>
    </>}

    {boxesOpened && <>
      <Text style={styles.body}><Text style={styles.bold}>Here’s the idea:</Text> if particles carry local pre-written answers, like the socks, the correlations between many results cannot be stronger than Bell’s limit.</Text>
      <View accessibilityLabel="CHSH combined correlation score: absolute S at most two for local models" style={styles.mathCard}>
        <Text style={styles.mathLabel}>LOCAL MODELS: COMBINED CORRELATION SCORE</Text>
        <Text style={styles.equation}>|S| ≤ 2</Text>
        <Text style={styles.mathScribble}>At most 2, in the CHSH version of Bell’s test.</Text>
      </View>
      <Text style={styles.body}>Quantum mechanics predicts correlations that go over that limit in certain settings.</Text>
      <Text style={styles.body}>So quantum mechanics wins the prediction contest. Later laboratory experiments have repeatedly violated Bell inequalities.</Text>
      <TerminologyCard term="Bell’s theorem" definition="Under the standard assumptions, no local model with pre-written answers can reproduce every quantum correlation tested across different measurement settings." />
      <BellVerdict />
      <Text style={styles.keyPoint}>Bell tests found a stronger quantum pattern: the sock method can’t reproduce all of the results.</Text>

      <Text style={styles.waitHeading}>But wait… Does this prove particles can communicate faster than light?</Text>
      <View style={styles.answers}>{['Yes', 'No'].map(option => <AnswerButton
        key={option}
        knowledgeKey="no-signalling" isCorrectAnswer={option === correctAnswer} label={option}
        state={answerState(option, fasterThanLightAnswer, correctAnswer)}
        disabled={fasterThanLightSolved}
        onPress={() => setFasterThanLightAnswer(option)}
      />)}</View>
      {fasterThanLightAnswer === 'Yes' && <Text style={styles.tryAgain}>It looks that way, but try again. Can either person choose the random result they get?</Text>}
    </>}

    {fasterThanLightSolved && <View style={styles.finalSection}>
      <Text style={styles.no}>NO!</Text>
      <Text style={styles.body}>Each person still sees a random result. Alex cannot choose spin up, Barb cannot choose spin down, and neither can tell whether the other person measured by looking at their own particle.</Text>
      <Text style={styles.body}>The Bell correlation only appears after they compare lots of paired results using an ordinary message. That comparison travels at light speed or slower.</Text>
      <TerminologyCard term="No-signalling" definition="Entanglement cannot be used by itself to send a controllable message faster than light." />

      <Text style={styles.heading}>So in summary…</Text>
      <View style={styles.summaryCard}>
        <SummaryPoint><Text style={styles.bold}>Locality</Text> says things over here should not instantly influence things very far away.</SummaryPoint>
        <SummaryPoint><Text style={styles.bold}>Pre-existing local properties</Text> say particles already possess the answers we later discover.</SummaryPoint>
        <Text style={styles.summaryConclusion}>Bell’s theorem and the experiments show that no explanation keeping both ideas can reproduce all the quantum results, under the standard assumptions.</Text>
      </View>
      <Text style={styles.body}>Which idea an interpretation gives up, and what the quantum state means, is still debated. What is not debated is that Bell inequalities are violated and these correlations cannot send a controllable faster-than-light message.</Text>
      <PrimaryButton label="Start the quiz" onPress={onComplete} />
    </View>}
  </>;
}

const styles = StyleSheet.create({
  bold: { fontWeight: '700' }, underlined: { textDecorationLine: 'underline' },
  argumentFace: { width: 116, height: 112, alignSelf: 'center', marginBottom: 16 },
  bell: { width: 115, height: 138, alignSelf: 'center', marginVertical: 20 },
  podiumScene: { width: '100%', aspectRatio: 1, marginTop: 20, marginBottom: 16 },
  podium: { position: 'absolute', width: '100%', height: '100%' },
  winningElectron: { position: 'absolute', left: '1%', top: '15%', width: '48%', height: '35%' },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginBottom: 18 },
  recapCard: { backgroundColor: '#EAF5EF', borderRadius: radii.lg, padding: 17, marginBottom: 20 },
  recapNumber: { color: colors.green, fontFamily: fonts.display, fontSize: 24, lineHeight: 28 },
  recapText: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, lineHeight: 26, marginLeft: 28, marginTop: -27, marginBottom: 14 },
  either: { color: colors.ink, fontFamily: fonts.display, fontSize: 38, lineHeight: 44, textAlign: 'center', marginTop: 8, marginBottom: 16 },
  or: { color: colors.ink, fontFamily: fonts.display, fontSize: 35, lineHeight: 41, textAlign: 'center', marginVertical: 17 },
  argumentCard: { borderWidth: 2, borderRadius: radii.lg, padding: 17, marginBottom: 10 },
  argumentOne: { backgroundColor: '#FFF7D6', borderColor: '#D9A737' },
  argumentTwo: { backgroundColor: '#EAF5EF', borderColor: colors.green },
  argumentHeading: { color: colors.ink, fontFamily: fonts.display, fontWeight: '700', fontSize: 27, lineHeight: 33, letterSpacing: 0.6, marginBottom: 12 },
  cardBody: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, marginBottom: 14 },
  sockButton: { minHeight: 214, alignItems: 'center', justifyContent: 'center', marginTop: -4 },
  sockBoxes: { width: '100%', height: 190 },
  tapHint: { color: colors.primary, fontFamily: fonts.display, fontSize: 16, letterSpacing: 0.7, marginTop: -8 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
  sockResult: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, lineHeight: 26, backgroundColor: '#FFF0A6', borderRadius: radii.md, padding: 14, marginTop: 4 },
  heading: { color: colors.ink, fontFamily: fonts.display, fontSize: 34, lineHeight: 41, marginTop: spacing.xl, marginBottom: 12 },
  faceOff: { minHeight: 210, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: -3, marginBottom: 20 },
  debateSide: { flex: 1, alignItems: 'center' },
  argumentNumber: { color: colors.green, fontFamily: fonts.display, fontSize: 27, lineHeight: 31 },
  debateImage: { width: 132, height: 132 },
  debateLabel: { color: colors.ink, fontFamily: fonts.display, fontSize: 13, lineHeight: 17, letterSpacing: 0.5, textAlign: 'center' },
  versus: { width: 36, height: 158, alignItems: 'center', justifyContent: 'center' },
  versusLine: { width: 2, flex: 1, backgroundColor: colors.ink, opacity: 0.45 },
  versusText: { color: colors.red, fontFamily: fonts.display, fontSize: 19, marginVertical: 5 },
  mathCard: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1EAF6', borderWidth: 2, borderStyle: 'dashed', borderColor: '#71508F', borderRadius: radii.lg, padding: 20, marginTop: spacing.xl, marginBottom: 18, transform: [{ rotate: '-1deg' }] },
  mathLabel: { color: '#71508F', fontFamily: fonts.display, fontSize: 16, letterSpacing: 0.8 },
  equation: { color: colors.ink, fontFamily: fonts.display, fontSize: 51, lineHeight: 59, marginVertical: 5 },
  mathScribble: { color: colors.muted, fontFamily: fonts.body, fontSize: 18 },
  joke: { color: colors.ink, fontFamily: fonts.display, fontSize: 28, lineHeight: 35, marginBottom: 18 },
  keyPoint: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, backgroundColor: '#FFF0A6', borderRadius: radii.md, padding: 16, marginBottom: 18 },
  boxingRing: { width: '100%', height: 255, alignSelf: 'center', marginTop: -2, marginBottom: 20 },
  waitHeading: { color: colors.ink, fontFamily: fonts.display, fontSize: 35, lineHeight: 42, marginTop: spacing.xl, marginBottom: 18 },
  answers: { gap: 10 },
  tryAgain: { color: colors.red, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, marginTop: 14 },
  finalSection: { marginTop: spacing.xl },
  no: { color: colors.red, fontFamily: fonts.display, fontSize: 58, lineHeight: 64, textAlign: 'center', marginBottom: 14, transform: [{ rotate: '-2deg' }] },
  summaryCard: { backgroundColor: '#EAF5EF', borderRadius: radii.lg, padding: 17, marginBottom: 18 },
  summaryPoint: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  summaryDot: { width: 22, color: colors.green, fontFamily: fonts.display, fontSize: 28, lineHeight: 28 },
  summaryText: { flex: 1, color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 27 },
  summaryConclusion: { color: colors.ink, fontFamily: fonts.display, fontSize: 23, lineHeight: 30, borderTopWidth: 1, borderColor: '#9BCAB0', paddingTop: 14 },
});
