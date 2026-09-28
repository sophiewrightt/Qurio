import { sampleBinary } from '../data/experimentSampling';
import { useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AnswerButton, type AnswerState } from './AnswerButton';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';
import { colors, fonts, radii, spacing } from '../constants/theme';

const photon = require('../assets/particles/photon.png');
const detectorAngles = [0, 45, 90, 135, 180];
type Polarization = 'VERTICAL' | 'HORIZONTAL';

function answerState(option: string, selected: string | undefined, correct: string): AnswerState {
  if (!selected) return 'default';
  if (option === correct) return 'correct';
  return option === selected ? 'incorrect' : 'default';
}

export function PolarizationPrimer() {
  const [tilted, setTilted] = useState(false);
  return <View style={styles.experimentSection}>
    <Text style={styles.heading}>One photon first</Text>
    <Text style={styles.body}>With electrons we measured spin. For light, we’ll measure polarization: the direction its electric field vibrates, sideways to its travel. The line on our photon represents that direction.</Text>
    <View style={styles.outcomePair}>
      <View style={styles.outcome}><PolarizedPhoton polarization="VERTICAL" /><Text style={styles.outcomeName}>PREPARED VERTICAL</Text></View>
      <View style={styles.outcome}><View style={{ transform: [{ rotate: tilted ? '45deg' : '0deg' }] }}><Text style={styles.heading}>↕ ↔</Text></View><Text style={styles.outcomeName}>DETECTOR AXES</Text></View>
    </View>
    <View style={styles.answers}>{['Measure vertically / horizontally', 'Turn the detector 45°'].map((label, index) => <Pressable key={label} accessibilityRole="radio" accessibilityState={{ checked: tilted === Boolean(index) }} onPress={() => setTilted(Boolean(index))} style={[styles.primerChoice, tilted === Boolean(index) && styles.primerChoiceSelected]}><Text style={styles.primerChoiceText}>{label}</Text></Pressable>)}</View>
    <Text style={styles.feedback}>{tilted ? 'The photon preparation is unchanged. With the detector tilted, either diagonal result has a 50% chance.' : 'For a vertically prepared photon, this detector records vertical with certainty.'}</Text>
    <Text style={styles.body}>Turning the detector changes which pair of alternatives we distinguish. It does not change the preparation or create a third outcome.</Text>
  </View>;
}

function SourceDiagram() {
  return <View accessibilityLabel="The Photon-2000 sends one entangled photon to Alice and one to Bob" style={styles.sourceScene}>
    <View style={styles.sourceMachine}><Text style={styles.sourceMachineText}>PHOTON{`\n`}2000</Text></View>
    <View style={styles.sourceBranches}>
      <View style={styles.sourceDestination}>
        <Text style={styles.sourceArrow}>↙</Text>
        <Image source={photon} resizeMode="contain" style={styles.sourcePhoton} />
        <Text style={styles.sourceName}>ALICE</Text>
      </View>
      <View style={styles.sourceDestination}>
        <Text style={styles.sourceArrow}>↘</Text>
        <Image source={photon} resizeMode="contain" style={styles.sourcePhoton} />
        <Text style={styles.sourceName}>BOB</Text>
      </View>
    </View>
  </View>;
}

function PolarizedPhoton({ polarization, size = 112 }: { polarization: Polarization; size?: number }) {
  return <View accessibilityLabel={`${polarization.toLowerCase()} polarization`} style={{ width: size, height: size }}>
    <Image source={photon} resizeMode="contain" style={styles.photonImage} />
    <View style={[styles.polarizationLine, polarization === 'VERTICAL' ? styles.verticalLine : styles.horizontalLine]} />
  </View>;
}

function Outcome({ name, result }: { name: string; result: Polarization }) {
  return <View style={styles.outcome}>
    <Text style={styles.outcomeName}>{name}</Text>
    <PolarizedPhoton polarization={result} />
    <Text style={styles.outcomeResult}>{result}</Text>
  </View>;
}

function SameDirectionResults() {
  return <View accessibilityLabel="Matching detector directions can give Alice vertical and Bob horizontal, or Alice horizontal and Bob vertical" style={styles.sameResults}>
    <View style={styles.outcomePair}>
      <Outcome name="ALICE" result="VERTICAL" />
      <Outcome name="BOB" result="HORIZONTAL" />
    </View>
    <Text style={styles.or}>OR</Text>
    <View style={styles.outcomePair}>
      <Outcome name="ALICE" result="HORIZONTAL" />
      <Outcome name="BOB" result="VERTICAL" />
    </View>
  </View>;
}

function DetectorDial({ name, angle, onRotate }: { name: string; angle: number; onRotate: (direction: -1 | 1) => void }) {
  return <View style={styles.detectorCard}>
    <Text style={styles.detectorTitle}>{name}</Text>
    <View accessibilityLabel={`${name}'s detector points at ${angle} degrees`} style={styles.dial}><Text style={[styles.dialArrow, { transform: [{ rotate: `${angle}deg` }] }]}>↑</Text></View>
    <Text style={styles.angle}>{angle}°</Text>
    <View style={styles.rotateRow}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Rotate ${name}'s detector anticlockwise`} onPress={() => onRotate(-1)} style={({ pressed }) => [styles.rotateButton, pressed && styles.pressed]}><Text style={styles.rotateText}>↺</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`Rotate ${name}'s detector clockwise`} onPress={() => onRotate(1)} style={({ pressed }) => [styles.rotateButton, pressed && styles.pressed]}><Text style={styles.rotateText}>↻</Text></Pressable>
    </View>
  </View>;
}

function MatchPlot({ same, opposite }: { same: number; opposite: number }) {
  return <View accessibilityLabel={`${same} matching outcomes and ${opposite} opposite outcomes out of 100 pairs`} style={styles.plot}>
    <Text style={styles.plotTitle}>100 ENTANGLED PAIRS</Text>
    <View style={styles.plotRow}><Text style={styles.plotLabel}>MATCH</Text><View style={styles.track}><View style={[styles.matchFill, { width: `${same}%` }]} /></View><Text style={styles.plotValue}>{same}</Text></View>
    <View style={styles.plotRow}><Text style={styles.plotLabel}>OPPOSITE</Text><View style={styles.track}><View style={[styles.oppositeFill, { width: `${opposite}%` }]} /></View><Text style={styles.plotValue}>{opposite}</Text></View>
  </View>;
}

export function EntanglementExperiment({ onComplete }: { onComplete: () => void }) {
  const answered = useRef(false);
  const [instructionAnswer, setInstructionAnswer] = useState<string>();
  const [angleA, setAngleA] = useState(0);
  const [angleB, setAngleB] = useState(0);
  const [result, setResult] = useState<{ relativeAngle: number; same: number; opposite: number }>();
  const [exploredDifferentDirections, setExploredDifferentDirections] = useState(false);
  const [exploredSameDirection, setExploredSameDirection] = useState(false);
  const hiddenInstructionAnswer = 'Maybe-these results alone cannot rule that out';

  const rotate = (detector: 'A' | 'B', direction: -1 | 1) => {
    const current = detector === 'A' ? angleA : angleB;
    const index = detectorAngles.indexOf(current);
    const next = detectorAngles[(index + direction + detectorAngles.length) % detectorAngles.length]!;
    if (detector === 'A') setAngleA(next);
    else setAngleB(next);
    setResult(undefined);
  };

  const runExperiment = () => {
    const relativeAngle = Math.abs(angleA - angleB);
    const probability = Math.sin(relativeAngle * Math.PI / 180) ** 2;
    const same = sampleBinary(100, probability < 1e-12 ? 0 : probability).filter(Boolean).length;
    setResult({ relativeAngle, same, opposite: 100 - same });
    if (relativeAngle % 180 === 0) setExploredSameDirection(true);
    else setExploredDifferentDirections(true);
  };

  return <>
    <Text style={styles.body}>Photons have a quantum property called <Text style={styles.emphasis}>polarization</Text>. With a vertical-or-horizontal detector, each photon gives one of two results: vertical or horizontal.</Text>

    <PolarizationPrimer />
    <Text style={styles.heading}>Let’s stage an experiment</Text>
    <Text style={styles.body}>We have a hypothetical machine: the Photon-2000. It prepares two photons in a shared <Text style={styles.emphasis}>entangled polarization state</Text>, then sends one photon to Alice and one to Bob.</Text>
    <SourceDiagram />

    <Text style={styles.body}>When Alice and Bob set their detectors in the same direction, there are two possible pairs of results. The results are opposite: either Alice records vertical and Bob records horizontal, or Alice records horizontal and Bob records vertical.</Text>
    <SameDirectionResults />

    <Text style={styles.heading}>What could cause this?</Text>
    <Text style={styles.body}>This looks a little like the socks from the last lesson: once Alice sees vertical, she knows Bob will see horizontal. That suggests a sensible explanation.</Text>
    <Text style={styles.prompt}>Could the machine simply give each photon a secret answer before they leave?</Text>
    <View style={styles.answers}>{[hiddenInstructionAnswer, 'No-opposite results already prove entanglement'].map(option => <AnswerButton key={option} knowledgeKey="hidden-instructions" isCorrectAnswer={option === hiddenInstructionAnswer} label={option} state={answerState(option, instructionAnswer, hiddenInstructionAnswer)} disabled={Boolean(instructionAnswer)} onPress={() => { if (answered.current) return false; answered.current = true; setInstructionAnswer(option); }} />)}</View>
    {instructionAnswer && <Text style={styles.feedback}>{instructionAnswer === hiddenInstructionAnswer ? 'Exactly. Opposite results in one direction could fit a pair of pre-written answers. We need another test.' : 'Not quite. Opposite results in one direction could still fit a pair of pre-written answers. We need another test.'}</Text>}

    {instructionAnswer && <View style={styles.experimentSection}>
      <Text style={styles.heading}>Why change direction?</Text>
      <Text style={styles.body}>A polarization result is relative to the direction we choose to measure. Turning a detector changes the polarization question we ask. A result along one direction is not the same question as a result along another.</Text>
      <Text style={styles.body}>If the photons carried secret answers, those answers would need to work for every direction Alice and Bob might choose.</Text>

      <Text style={styles.heading}>Turn the detectors</Text>
      <Text style={styles.body}>Choose Alice and Bob’s measurement directions, then run 100 newly prepared pairs.</Text>
      <View style={styles.detectorRow}>
        <DetectorDial name="ALICE" angle={angleA} onRotate={direction => rotate('A', direction)} />
        <DetectorDial name="BOB" angle={angleB} onRotate={direction => rotate('B', direction)} />
      </View>
      <Text style={styles.relative}>DIFFERENCE BETWEEN DIRECTIONS · {Math.abs(angleA - angleB)}°</Text>
      <PrimaryButton label="Run 100 pairs" onPress={runExperiment} />
      {result && <>
        <MatchPlot same={result.same} opposite={result.opposite} />
        <Text style={styles.resultCopy}>Predicted match rate: {Math.round(Math.sin(result.relativeAngle * Math.PI / 180) ** 2 * 100)}%. Observed this run: {result.same} matches and {result.opposite} opposite results. Run again to sample a new set.</Text>
        {result.relativeAngle === 0 && <Text style={styles.feedback}>Now turn one detector and run the experiment again.</Text>}
      </>}

      {exploredDifferentDirections && !exploredSameDirection && <Text style={styles.feedback}>Also run the pair with matching detector directions to compare.</Text>}
      {exploredDifferentDirections && exploredSameDirection && <>
        <Text style={styles.heading}>Could secret answers explain every result?</Text>
        <Text style={styles.body}>Our model illustrates how correlations depend on direction. These runs alone are not a demonstration of Bell’s theorem.</Text>
        <Text style={styles.keyPoint}>Scientists go further: they compare carefully chosen combinations of settings and test a limit that local pre-written answers cannot exceed. Experiments can exceed that limit, agreeing with quantum predictions.</Text>
        <Text style={styles.body}>Here “local” means each answer depends only on that particle’s instructions and nearby detector setting, not the distant detector’s choice. The test also assumes the setting choices are independent of those instructions.</Text>
        <TerminologyCard term="Bell's theorem" definition="Some quantum correlations are too strong to be explained by particles carrying pre-written local answers." />
        <Text style={styles.body}>This still does not let Alice send Bob an instant message. Neither person can choose which of their detector’s two outcomes they record.</Text>
        <PrimaryButton label="Start the quiz" onPress={onComplete} />
      </>}
    </View>}
  </>;
}

const styles = StyleSheet.create({
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginBottom: 18 },
  emphasis: { color: colors.green, fontFamily: fonts.display },
  heading: { color: colors.ink, fontFamily: fonts.display, fontSize: 32, lineHeight: 38, marginBottom: 10 },
  sourceScene: { minHeight: 240, alignItems: 'center', justifyContent: 'flex-start', marginTop: -2, marginBottom: 10 },
  sourceMachine: { minWidth: 118, minHeight: 74, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F5EE', borderWidth: 3, borderColor: colors.green, borderRadius: radii.md, paddingHorizontal: 16, paddingVertical: 8 },
  sourceMachineText: { color: colors.green, fontFamily: fonts.display, fontSize: 18, lineHeight: 20, letterSpacing: 0.8, textAlign: 'center' },
  sourceBranches: { width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginTop: -5 },
  sourceDestination: { width: '42%', alignItems: 'center' },
  sourceArrow: { color: colors.ink, fontFamily: fonts.display, fontSize: 52, lineHeight: 55 },
  sourcePhoton: { width: 94, height: 94, marginTop: -7 },
  sourceName: { color: colors.ink, fontFamily: fonts.display, fontSize: 18, letterSpacing: 0.7, textAlign: 'center', marginTop: -5 },
  photonImage: { position: 'absolute', width: '100%', height: '100%' },
  polarizationLine: { position: 'absolute', alignSelf: 'center', top: '50%', left: '50%', backgroundColor: colors.ink, borderRadius: 3 },
  verticalLine: { width: 4, height: 48, marginLeft: -2, marginTop: -24 },
  horizontalLine: { width: 48, height: 4, marginLeft: -24, marginTop: -2 },
  sameResults: { marginTop: -4, marginBottom: 24 },
  outcomePair: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  outcome: { width: '44%', alignItems: 'center' },
  outcomeName: { color: colors.green, fontFamily: fonts.display, fontSize: 16, letterSpacing: 0.8 },
  outcomeResult: { color: colors.ink, fontFamily: fonts.display, fontSize: 16, marginTop: -2 },
  or: { color: colors.muted, fontFamily: fonts.display, fontSize: 18, textAlign: 'center', marginVertical: 7 },
  keyPoint: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, backgroundColor: '#FFF0A6', borderRadius: radii.md, padding: 16, marginBottom: 18 },
  prompt: { color: colors.ink, fontFamily: fonts.display, fontSize: 27, lineHeight: 34, marginBottom: 14 },
  answers: { gap: 10 },
  primerChoice: { minHeight: 56, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 2, borderColor: colors.green, borderRadius: 14, marginTop: 8 },
  primerChoiceSelected: { backgroundColor: '#E8F5EE' },
  primerChoiceText: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 27, textAlign: 'center' },
  feedback: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, marginTop: 14, marginBottom: 8 },
  experimentSection: { marginTop: spacing.xl },
  detectorRow: { flexDirection: 'row', gap: 12, marginBottom: 13 },
  detectorCard: { flex: 1, alignItems: 'center', backgroundColor: '#E8F5EE', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.green, borderRadius: radii.lg, padding: 12 },
  detectorTitle: { color: colors.green, fontFamily: fonts.display, fontSize: 14, letterSpacing: 0.8 },
  dial: { width: 91, height: 91, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.ink, borderRadius: 46, backgroundColor: colors.surface, marginVertical: 7 },
  dialArrow: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 61, lineHeight: 67 },
  angle: { color: colors.ink, fontFamily: fonts.display, fontSize: 20 },
  rotateRow: { flexDirection: 'row', gap: 8, marginTop: 7 },
  rotateButton: { width: 46, height: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, borderRadius: 12 },
  rotateText: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 28, lineHeight: 31 },
  pressed: { opacity: 0.55, transform: [{ scale: 0.94 }] },
  relative: { color: colors.green, fontFamily: fonts.display, fontSize: 15, lineHeight: 19, letterSpacing: 0.8, textAlign: 'center', marginBottom: 15 },
  plot: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, borderRadius: radii.lg, padding: 16, marginTop: 20, marginBottom: 14 },
  plotTitle: { color: colors.green, fontFamily: fonts.display, fontSize: 15, letterSpacing: 1, textAlign: 'center', marginBottom: 12 },
  plotRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 5 },
  plotLabel: { width: 68, color: colors.ink, fontFamily: fonts.display, fontSize: 13 },
  track: { flex: 1, height: 17, overflow: 'hidden', borderRadius: 9, backgroundColor: colors.track },
  matchFill: { height: '100%', minWidth: 3, borderRadius: 9, backgroundColor: colors.primary },
  oppositeFill: { height: '100%', minWidth: 3, borderRadius: 9, backgroundColor: colors.green },
  plotValue: { width: 27, color: colors.ink, fontFamily: fonts.display, fontSize: 18, textAlign: 'right' },
  resultCopy: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 27, marginBottom: 10 },
});
