import { useKnowledge } from './KnowledgeContext';
import { sampleBinary } from '../data/experimentSampling';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radii } from '../constants/theme';
import { ExperimentDiagram } from './ExperimentDiagram';
import { PossibilityCloud } from './PossibilityCloud';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';

const schrodingerWaveEquation = require('../assets/module-2/lesson-4/schrodinger-wave-equation-transparent.png');
const outcomeA = require('../assets/module-2/lesson-6/outcome-a-transparent.png');
const outcomeB = require('../assets/module-2/lesson-6/outcome-b-transparent.png');

const regionResults = [10, 20, 40, 20, 10];
type Preparation = 'mostly-a' | 'balanced' | 'mostly-b';
const preparations: Record<Preparation, { label: string; a: number }> = {
  'mostly-a': { label: 'Mostly A', a: 75 },
  balanced: { label: 'Balanced', a: 50 },
  'mostly-b': { label: 'Mostly B', a: 25 },
};

function DistributionRows({ values, suffix = '%' }: { values: number[]; suffix?: string }) {
  return <View style={styles.distribution}>{values.map((value, index) => <View key={index} style={styles.distributionRow}>
    <Text style={styles.distributionLabel}>Region {index + 1}</Text><View style={styles.track}><View style={[styles.fill, { width: `${value * 2.25}%` }]} /></View><Text style={styles.distributionValue}>{value}{suffix}</Text>
  </View>)}</View>;
}

function FiveElectronRecall({ onComplete }: { onComplete: () => void }) {
  const [shots, setShots] = useState(0);
  const [firing, setFiring] = useState(false);
  const lock = useRef(false);
  const progress = useRef(new Animated.Value(0)).current;
  const [advanced, setAdvanced] = useState(false);
  useEffect(() => () => progress.stopAnimation(), [progress]);
  const fire = () => {
    if (lock.current || shots >= 5) return;
    lock.current = true; setFiring(true); progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 820, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
      lock.current = false; setFiring(false);
      if (finished) setShots(value => Math.min(5, value + 1));
    });
  };
  return <View>
    <ExperimentDiagram mode="electron" revealed count={shots} progress={progress} firing={firing} possibilities={firing} />
    <Text accessibilityLiveRegion="polite" style={styles.counter}>{shots}/5 electrons fired</Text>
    {shots < 5 && <PrimaryButton label={firing ? 'Electron flying…' : 'Fire an electron'} disabled={firing} onPress={fire} />}
    {shots === 5 && <View style={styles.questionSection}><Text style={styles.question}>If the result isn’t always the same, how can quantum physics make predictions?</Text>{!advanced && <PrimaryButton label="Try a bigger sample" onPress={() => { setAdvanced(true); onComplete(); }} />}</View>}
  </View>;
}

function HundredParticleRun({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  useEffect(() => () => clearInterval(timer.current), []);
  const run = () => {
    if (running || count === 100) return;
    setCount(0); setRunning(true);
    timer.current = setInterval(() => setCount(value => {
      const next = Math.min(100, value + 5);
      if (next === 100) { clearInterval(timer.current); timer.current = undefined; setRunning(false); onComplete(); }
      return next;
    }), 65);
  };
  return <View>
    <ExperimentDiagram mode="electron" revealed count={count} />
    <Text accessibilityLiveRegion="polite" style={styles.counter}>{running ? `Running… ${count}/100` : count === 100 ? '100/100 experiments complete' : 'Detector ready for 100 particles'}</Text>
    {count < 100 && <PrimaryButton label={running ? 'Shooting all 100…' : 'Shoot them all'} disabled={running} onPress={run} />}
    {count === 100 && <View style={styles.resultCard}><DistributionRows values={regionResults} /><Text style={styles.resultCopy}>You saw this before…</Text><Text style={styles.patternQuestion}>What does this look like?</Text><Text style={styles.waveHint}>I’ll give you a hint - it starts with W and rhymes with Dave.</Text></View>}
  </View>;
}

export function WaveGuess({ onCorrect }: { onCorrect: () => void }) {
  const awardCorrect = useKnowledge();
  const [guess, setGuess] = useState('');
  const [incorrect, setIncorrect] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const check = () => {
    const words = guess.toLowerCase().replace(/[^a-z]+/g, ' ').trim().split(/\s+/);
    if (words.includes('wave')) { awardCorrect('check:wave-recognition'); setIncorrect(false); setCorrect(true); onCorrect(); }
    else { setIncorrect(true); setAttempts(value => value + 1); }
  };
  if (correct) return null;
  return <View style={styles.waveGuess}>
    <TextInput accessibilityLabel="Guess what the pattern looks like" autoCapitalize="none" autoCorrect={false} onChangeText={value => { setGuess(value); setIncorrect(false); }} onSubmitEditing={check} placeholder="Type your guess" placeholderTextColor={colors.muted} returnKeyType="done" style={styles.waveInput} value={guess} />
    <PrimaryButton label="Check my guess" disabled={!guess.trim()} onPress={check} />
    {incorrect && <Text accessibilityLiveRegion="polite" style={styles.tryAgain}>Not quite. Try the word that rhymes with “Dave”.</Text>}
    {attempts >= 5 && <Pressable accessibilityRole="button" onPress={() => { setCorrect(true); onCorrect(); }} style={styles.revealAnswer}><Text style={styles.revealAnswerText}>I’m stuck, can you reveal the answer?</Text></Pressable>}
  </View>;
}

export function PreparationMachine({ onComplete }: { onComplete: () => void }) {
  const [preparation, setPreparation] = useState<Preparation>('mostly-a');
  const [running, setRunning] = useState(false);
  const [trials, setTrials] = useState(0);
  const [observedA, setObservedA] = useState(0);
  const busy = useRef(false);
  const [finished, setFinished] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const notified = useRef(false);
  useEffect(() => () => clearInterval(timer.current), []);
  const choice = preparations[preparation];
  const choose = (next: Preparation) => { if (!running) { setPreparation(next); setTrials(0); setObservedA(0); setFinished(false); } };
  const run = () => {
    if (busy.current) return;
    busy.current = true;
    const samples = sampleBinary(100, choice.a / 100);
    let count = 0;
    setTrials(0); setObservedA(0); setFinished(false); setRunning(true);
    timer.current = setInterval(() => {
      count = Math.min(100, count + 5);
      setTrials(count); setObservedA(samples.slice(0, count).filter(Boolean).length);
      if (count === 100) {
        clearInterval(timer.current); timer.current = undefined; busy.current = false; setRunning(false); setFinished(true);
        if (!notified.current) { notified.current = true; onComplete(); }
      }
    }, 55);
  };
  const observedB = trials - observedA;
  return <>
    <Text style={styles.body}>Say, in a quantum experiment, we have two results that are possible:</Text>
    <View accessibilityLabel="A and B" style={styles.introOutcomes}><Image accessibilityLabel="A" source={outcomeA} resizeMode="contain" style={styles.introLetter} /><Text style={styles.body}>and</Text><Image accessibilityLabel="B" source={outcomeB} resizeMode="contain" style={styles.introLetter} /></View>
    <View style={styles.machine}>
    <Text style={styles.machineCopy}>Physicists can prepare an experiment to manipulate the probabilities of each outcome. Try choosing different preparations below to see the outcomes!</Text>
    <View style={styles.choiceRow}>{(Object.keys(preparations) as Preparation[]).map(key => <Pressable key={key} accessibilityRole="button" accessibilityState={{ selected: preparation === key, disabled: running }} disabled={running} onPress={() => choose(key)} style={[styles.choice, preparation === key && styles.choiceSelected]}><Text style={[styles.choiceText, preparation === key && styles.choiceTextSelected]}>{preparations[key].label}</Text></Pressable>)}</View>
    <PossibilityCloud outcomeLetters leftStrength={choice.a / 100} rightStrength={(100 - choice.a) / 100} leftLabel={`A\n${choice.a}%`} rightLabel={`B\n${100 - choice.a}%`} />
    <View style={styles.outcomeRow}><View style={styles.outcome}><Image source={outcomeA} resizeMode="contain" style={styles.outcomeSprite} /><Text style={styles.outcomeCount}>{observedA}</Text></View><View style={styles.outcome}><Image source={outcomeB} resizeMode="contain" style={styles.outcomeSprite} /><Text style={styles.outcomeCount}>{observedB}</Text></View></View>
    <Text accessibilityLiveRegion="polite" style={styles.counter}>{running ? `${trials}/100 trials` : finished ? 'Run complete' : 'Ready to test this preparation'}</Text>
    <PrimaryButton label={running ? 'Running 100 experiments…' : finished ? 'Run this preparation again' : 'Run 100 experiments'} disabled={running} onPress={run} />
    {finished && <View style={styles.observation}><Text style={styles.observationTitle}>Expected: {choice.a}% A · {100 - choice.a}% B</Text><Text style={styles.resultCopy}>This independently sampled run observed {observedA} A and {100 - observedA} B. A probability does not mean every small set of experiments will match perfectly. Over many trials, the overall pattern approaches the expected distribution.</Text></View>}
    </View>
  </>;
}

export function QuantumPossibilityLabs({ onComplete }: { onComplete: () => void }) {
  const [fiveComplete, setFiveComplete] = useState(false);
  const [hundredComplete, setHundredComplete] = useState(false);
  const [waveRecognised, setWaveRecognised] = useState(false);
  const [machineComplete, setMachineComplete] = useState(false);
  return <View>
    <View style={styles.firstSection}><Text style={styles.heading}>Back to the double slit</Text><Text style={styles.body}>Fire five identically prepared electrons through the double slit, one at a time.</Text><FiveElectronRecall onComplete={() => setFiveComplete(true)} /></View>
    {fiveComplete && <View style={styles.section}><Text style={styles.heading}>Repeat the experiment</Text><Text style={styles.body}>Now let’s try a sample of 100 particles and look for a pattern.</Text><HundredParticleRun onComplete={() => setHundredComplete(true)} /></View>}
    {hundredComplete && <View style={styles.section}><WaveGuess onCorrect={() => setWaveRecognised(true)} /></View>}
    {waveRecognised && <><View style={styles.section}><Text style={styles.correctGuess}>That’s right!</Text><Text style={styles.body}>A physicist called Erwin Schrödinger made a rule that models this. It is a <Text style={styles.bold}>wave equation</Text> used to calculate how a quantum state changes over time. The solution to this equation is called a <Text style={styles.bold}>wavefunction</Text>.</Text><Image accessibilityLabel="Schrödinger’s wave equation above a hand-drawn wave" source={schrodingerWaveEquation} resizeMode="contain" style={styles.equationArtwork} /><Text style={styles.equationReaction}>Woah! That looks like a foreign language.</Text><Text style={styles.body}>That’s the maths physicists use, but thankfully this is only something you have to learn if you want to study the subject further.</Text><Text style={styles.body}>The wavefunction is not a water wave or a tiny particle physically wobbling. It lets physicists calculate the probabilities of different measurement outcomes.</Text><TerminologyCard term="Schrödinger’s wave equation" definition="An equation that describes how a quantum state changes over time." /></View>
      <View style={styles.section}><Text style={styles.heading}>The quantum state</Text><PossibilityCloud question /><Text style={styles.body}>We don’t want to use all of that maths to represent a quantum state every time, so instead we’ll use this mystery probability cloud.</Text><Text style={styles.body}>It contains the information needed to predict possible measurement outcomes and their probabilities - sometimes one certain result, often several possible results.</Text><TerminologyCard term="Quantum state" definition="A description containing the information needed to predict possible measurement outcomes and their probabilities." /></View>
      <View style={styles.section}><Text style={styles.heading}>Build a possibility state</Text><PreparationMachine onComplete={() => setMachineComplete(true)} /></View></>}
    {machineComplete && <View style={styles.section}><Text style={styles.heading}>Uncertain does not mean unpredictable</Text><Text style={styles.body}>Linking back to Chapter 1, this is what we meant when we said quantum behaviour is uncertain.</Text><Text style={styles.ruleText}>Schrödinger’s wave equation predicts the probabilities of possible results, even when it cannot predict the exact result of one experiment.</Text><Text style={styles.body}>The uncertainty still follows precise mathematical rules.</Text><PrimaryButton label="Start the quiz" onPress={onComplete} /></View>}
  </View>;
}

const styles = StyleSheet.create({
  firstSection: { marginTop: 10 },
  section: { marginTop: 34 },
  heading: { color: colors.ink, fontFamily: fonts.display, fontSize: 31, lineHeight: 38, marginVertical: 13 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 29, marginBottom: 17 },
  bold: { fontFamily: fonts.display }, counter: { color: colors.primaryDark, fontFamily: fonts.body, fontSize: 20, textAlign: 'center', marginVertical: 14 },
  questionSection: { marginTop: 24 },
  question: { color: colors.ink, fontFamily: fonts.display, fontSize: 27, lineHeight: 34, marginBottom: 18 },
  resultCard: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, borderRadius: radii.lg, padding: 18, marginTop: 20 },
  distribution: { marginVertical: 10 }, distributionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 9 }, distributionLabel: { width: 58, color: colors.muted, fontFamily: fonts.body, fontSize: 16 },
  track: { flex: 1, height: 16, borderRadius: 8, backgroundColor: colors.track, overflow: 'hidden' }, fill: { height: '100%', borderRadius: 8, backgroundColor: colors.primary }, distributionValue: { width: 36, color: colors.ink, fontFamily: fonts.display, fontSize: 16, textAlign: 'right' },
  resultCopy: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, lineHeight: 27, marginTop: 12 },
  waveHint: { color: colors.blue, fontFamily: fonts.display, fontSize: 23, lineHeight: 29, textAlign: 'center', marginTop: 12 },
  patternQuestion: { color: colors.ink, fontFamily: fonts.display, fontSize: 29, lineHeight: 36, textAlign: 'center', marginTop: 18 },
  waveGuess: { marginTop: -20 },
  waveInput: { minHeight: 58, color: colors.ink, fontFamily: fonts.body, fontSize: 22, borderWidth: 2, borderColor: colors.ink, borderRadius: 15, backgroundColor: colors.surface, paddingHorizontal: 16, marginBottom: 10 },
  tryAgain: { color: colors.coral, fontFamily: fonts.body, fontSize: 19, lineHeight: 25, textAlign: 'center', marginTop: 10 },
  revealAnswer: { alignSelf: 'center', marginTop: 12, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 12, backgroundColor: '#DDEDF8', borderWidth: 1.5, borderColor: colors.blue },
  revealAnswerText: { color: colors.blue, fontFamily: fonts.display, fontSize: 17 },
  correctGuess: { color: colors.green, fontFamily: fonts.display, fontSize: 34, lineHeight: 42, textAlign: 'center', marginBottom: 13 },
  equationArtwork: { width: '112%', height: 230, alignSelf: 'center', marginBottom: 6 },
  equationReaction: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 29, lineHeight: 36, textAlign: 'center', marginBottom: 17 },
  machine: { backgroundColor: '#FFF9E7', borderWidth: 2, borderColor: colors.ink, borderRadius: radii.lg, padding: 16 }, machineTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 26, textAlign: 'center' }, machineCopy: { color: colors.ink, fontFamily: fonts.body, fontSize: 19, lineHeight: 25, textAlign: 'center', marginTop: 8 },
  introOutcomes: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15, marginBottom: 15 },
  introLetter: { width: 42, height: 48 },
  choiceRow: { flexDirection: 'row', gap: 7, marginTop: 18 }, choice: { flex: 1, minHeight: 54, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.ink, borderRadius: 13, backgroundColor: colors.surface }, choiceSelected: { borderStyle: 'solid', borderColor: colors.primary, backgroundColor: '#EDE8FF' }, choiceText: { color: colors.ink, fontFamily: fonts.body, fontSize: 17, textAlign: 'center' }, choiceTextSelected: { color: colors.primaryDark, fontFamily: fonts.display },
  outcomeRow: { flexDirection: 'row', gap: 12, marginTop: -2 }, outcome: { flex: 1, minHeight: 118, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, borderRadius: 16 }, outcomeSprite: { width: 58, height: 63 }, outcomeCount: { color: colors.ink, fontFamily: fonts.display, fontSize: 25, marginTop: 3 },
  observation: { backgroundColor: '#E4F4EC', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.green, borderRadius: 17, padding: 16, marginTop: 18 }, observationTitle: { color: colors.green, fontFamily: fonts.display, fontSize: 20 },
  ruleText: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 24, lineHeight: 31, marginBottom: 18 },
});
