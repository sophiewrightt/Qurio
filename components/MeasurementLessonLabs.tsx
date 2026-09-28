import { sampleBinary } from '../data/experimentSampling';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';
import { colors, fonts, radii, spacing } from '../constants/theme';

const aAndBCloud = require('../assets/module-2/lesson-5/state-a-and-b-centered-transparent.png');
const detectorSprite = require('../assets/module-2/lesson-6/detector-transparent.png');
const outcomeA = require('../assets/module-2/lesson-6/outcome-a-transparent.png');
const outcomeB = require('../assets/module-2/lesson-6/outcome-b-transparent.png');

function outcomeSprite(outcome: string) {
  return outcome === 'A' ? outcomeA : outcomeB;
}

function MeasurementHook({ onComplete }: { onComplete: () => void }) {
  return <View style={styles.section}>
    <Text style={styles.body}>We have prepared this electron in an A &amp; B superposition. Before measurement, both possibilities contribute to its quantum state.</Text>
    <Image accessibilityLabel="A and B superposition cloud" source={aAndBCloud} resizeMode="contain" style={styles.cloud} />
    <Text style={styles.body}>Now let’s send it to a detector and see what is actually recorded.</Text>
    <PrimaryButton label="Send the state to the detector" onPress={onComplete} />
  </View>;
}

export function MeasurementMachine({ onComplete }: { onComplete: () => void }) {
  const [outcomes] = useState(() => sampleBinary(4, 0.7).map(isA => isA ? 'A' : 'B'));
  const [history, setHistory] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const flight = useRef(new Animated.Value(0)).current;
  const busy = useRef(false);
  const mounted = useRef(true);
  const advanced = useRef(false);
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; animation.current?.stop(); }; }, []);
  const measure = () => {
    if (busy.current || history.length >= outcomes.length) return;
    busy.current = true;
    setRunning(true);
    flight.setValue(0);
    const outcome = outcomes[history.length]!;
    animation.current = Animated.timing(flight, { toValue: 1, duration: 650, useNativeDriver: true });
    animation.current.start(({ finished }) => {
      if (!mounted.current) return;
      if (finished) {
        const nextHistory = [...history, outcome];
        setHistory(nextHistory);
        if (nextHistory.length === outcomes.length && !advanced.current) {
          advanced.current = true;
          onComplete();
        }
      }
      busy.current = false;
      setRunning(false);
    });
  };
  const lastOutcome = history.at(-1);
  return <View style={styles.section}>
    <Text style={styles.heading}>Let’s see how this pans out.</Text>
    <Text style={styles.body}>Each run uses a fresh electron prepared in the same A &amp; B state.</Text>
    <View accessibilityLabel="Quantum state entering a detector" style={styles.machine}>
      <Animated.Image source={aAndBCloud} resizeMode="contain" style={[styles.machineCloud, { opacity: flight.interpolate({ inputRange: [0, 0.72, 1], outputRange: [1, 1, 0] }), transform: [{ translateX: flight.interpolate({ inputRange: [0, 1], outputRange: [0, 91] }) }, { scale: 0.55 }] }]} />
      <Image accessibilityLabel="Detector" source={detectorSprite} resizeMode="contain" style={styles.detectorImage} />
      <View style={styles.output}><Text style={styles.outputLabel}>OUTCOME</Text>{lastOutcome ? <Image accessibilityLabel={`Outcome ${lastOutcome}`} source={outcomeSprite(lastOutcome)} resizeMode="contain" style={styles.outputImage} /> : <Text style={styles.outputQuestion}>?</Text>}</View>
    </View>
    {!!history.length && <View style={styles.history}><Text style={styles.historyLabel}>RUNS</Text>{history.map((outcome, index) => <Image key={index} accessibilityLabel={`Run ${index + 1}: outcome ${outcome}`} source={outcomeSprite(outcome)} resizeMode="contain" style={styles.historyOutcome} />)}</View>}
    {history.length < outcomes.length && <PrimaryButton disabled={running} label={history.length ? 'Prepare the same state again' : 'Measure a freshly prepared electron'} onPress={measure} />}
  </View>;
}

export function RepeatedMeasurementLab({ onComplete }: { onComplete: () => void }) {
  const [result, setResult] = useState<boolean[]>([]);
  const [target, setTarget] = useState(0);
  const [visited, setVisited] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const busy = useRef(false);
  const advanced = useRef(false);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  const run = (size: number) => {
    if (busy.current) return;
    busy.current = true;
    const samples = sampleBinary(size, 0.7);
    let shown = 0;
    setTarget(size); setResult([]); setRunning(true);
    timer.current = setInterval(() => {
      shown = Math.min(size, shown + Math.max(1, Math.ceil(size / 24)));
      setResult(samples.slice(0, shown));
      if (shown === size) {
        clearInterval(timer.current); timer.current = undefined; busy.current = false;
        setRunning(false); setVisited(current => current.includes(size) ? current : [...current, size]);
      }
    }, 42);
  };
  const a = result.filter(Boolean).length;
  const b = result.length - a;
  const percent = result.length ? Math.round(a / result.length * 100) : 0;
  const compared = visited.some(size => size <= 10) && visited.some(size => size >= 100);
  return <View style={styles.section}>
    <Text style={styles.heading}>A bigger sample size</Text>
    <Text style={styles.body}>When we have a greater number of electrons to test, the pattern becomes clearer. Compare a small sample with a large one. Tap a size again for a new run.</Text>
    <Text style={styles.preparationTitle}>Preparation state:</Text>
    <View accessibilityLabel="Preparation predicts 70 percent A and 30 percent B" style={styles.preparationState}>
      <View style={styles.preparationOutcome}><Image source={outcomeA} resizeMode="contain" style={styles.preparationSprite} /><Text style={styles.preparationPercent}>70%</Text></View>
      <View style={styles.preparationOutcome}><Image source={outcomeB} resizeMode="contain" style={styles.preparationSprite} /><Text style={styles.preparationPercent}>30%</Text></View>
    </View>
    <View style={styles.trialButtons}>{[1, 10, 100, 1000].map(size => <Pressable key={size} accessibilityRole="button" accessibilityLabel={`Measure ${size}`} disabled={running} onPress={() => run(size)} style={[styles.trialButton, target === size && styles.trialButtonActive, visited.includes(size) && styles.trialButtonVisited]}><Text style={styles.trialButtonText}>{size}</Text></Pressable>)}</View>
    <View style={styles.resultsPanel}>
      <Text style={styles.resultsTitle}>{result.length ? `OBSERVED · ${result.length} MEASUREMENTS` : 'CHOOSE A SAMPLE SIZE'}</Text>
      <View style={styles.outcomeStream}>{result.slice(-20).map((isA, index) => <Image key={index} accessibilityLabel={isA ? 'A' : 'B'} source={isA ? outcomeA : outcomeB} resizeMode="contain" style={styles.streamLetter} />)}</View>
      <View style={styles.resultBar}>{result.length ? <><View style={[styles.resultA, { flex: a || 0.001 }]} /><View style={[styles.resultB, { flex: b || 0.001 }]} /></> : <View style={styles.emptyBar} />}</View>
      <View style={styles.resultLabels}><Text style={styles.aText}>A · {a} ({percent}%)</Text><Text style={styles.bText}>B · {b} ({result.length ? 100 - percent : 0}%)</Text></View>
    </View>
    {!compared && <Text style={styles.progress}>Try one small sample (1 or 10) and one large sample (100 or 1000).</Text>}
    {compared && <><Text style={styles.feedback}>A small sample does not need to match the prediction exactly. The probability describes the long-run pattern, not a fixed quota for every group.</Text><PrimaryButton label="Continue" onPress={() => { if (!advanced.current) { advanced.current = true; onComplete(); } }} /></>}
  </View>;
}

export function CoinCollapseDemo({ onComplete }: { onComplete: () => void }) {
  const turn = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const completed = useRef(false);
  const [result, setResult] = useState<'HEADS' | 'TAILS'>();
  useEffect(() => {
    animation.current = Animated.loop(Animated.timing(turn, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web', isInteraction: false }));
    animation.current.start();
    return () => animation.current?.stop();
  }, [turn]);
  const collapse = () => {
    if (completed.current) return;
    completed.current = true;
    animation.current?.stop();
    turn.setValue(0);
    setResult(Math.random() < 0.5 ? 'HEADS' : 'TAILS');
    onComplete();
  };
  return <View style={styles.coinSection}>
    <Text style={styles.heading}>Try the coin analogy</Text>
    <Text style={styles.body}>Hold the spinning coin down to collapse it.</Text>
    <Pressable accessibilityRole="button" accessibilityLabel={result ? `Coin collapsed to ${result.toLowerCase()}` : 'Hold to collapse the spinning coin'} delayLongPress={420} disabled={!!result} onLongPress={collapse} style={styles.coinPress}>
      <Animated.View style={[styles.coin, { transform: [{ scaleX: turn.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [1, 0.08, 1, 0.08, 1] }) }] }]}><Text style={styles.coinText}>{result ?? 'H / T'}</Text></Animated.View>
    </Pressable>
    {!result && <Text style={styles.holdHint}>press and hold</Text>}
    {result && <Text style={styles.coinResult}>Result: {result.toLowerCase()}</Text>}
  </View>;
}

export function MeasurementLessonLabs({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  return <>
    <MeasurementHook onComplete={() => setStage(1)} />
    {stage >= 1 && <MeasurementMachine onComplete={() => setStage(2)} />}
    {stage >= 2 && <View style={styles.section}>
      <Text style={styles.heading}>State versus outcome</Text>
      <View style={styles.stateOutcome}><View style={styles.stateSide}><Text style={styles.sideLabel}>BEFORE</Text><Image source={aAndBCloud} resizeMode="contain" style={styles.smallCloud} /><Text style={styles.sideText}>A &amp; B are possible</Text></View><Text style={styles.arrow}>→</Text><View style={styles.outcomeSide}><Text style={styles.sideLabel}>AFTER</Text><Image accessibilityLabel="Outcome A" source={outcomeA} resizeMode="contain" style={styles.bigOutcome} /><Text style={styles.sideText}>one result recorded</Text></View></View>
      <Text style={styles.body}>The quantum state contains the information used to predict possible outcomes. A measurement gives one actual result. This is what we call the collapse of a quantum state.</Text>
      <TerminologyCard term="Quantum state collapse" definition="The name often used for the change from a state containing several possible outcomes to the one outcome recorded in a measurement." />
      <CoinCollapseDemo onComplete={() => setStage(3)} />
    </View>}
    {stage >= 3 && <><View style={styles.section}><Text style={styles.body}>A useful way to picture it is a flipping coin. While it is twirling, we can describe a mixture of heads and tails possibilities. When you slap it down, one result appears, not both. A quantum state is not literally a coin, but the analogy helps separate possibilities before measurement from the one outcome recorded afterwards.</Text><PrimaryButton label="Compare many fresh measurements" onPress={() => setStage(4)} /></View></>}
    {stage >= 4 && <RepeatedMeasurementLab onComplete={() => setStage(5)} />}
    {stage >= 5 && <View style={styles.section}><Text style={styles.heading}>What causes this randomness?</Text><Text style={styles.body}>Although physicists agree well on how to calculate these results, they don’t all agree on the story behind what happens during measurement with all this randomness. (We won’t go into this for now, but you can explore it in the later philosophy modules of Qurio!)</Text><PrimaryButton label="Start the quiz" onPress={onComplete} /></View>}
  </>;
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  heading: { color: colors.ink, fontFamily: fonts.display, fontSize: 30, lineHeight: 36, marginTop: 16, marginBottom: 10 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginBottom: 18 },
  question: { color: colors.ink, fontFamily: fonts.display, fontSize: 25, lineHeight: 31, marginBottom: 16 },
  cloud: { width: 216, height: 190, alignSelf: 'center', marginVertical: 4 },
  answerStack: { gap: 10, marginBottom: 16 },
  feedback: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, backgroundColor: '#FFF0A6', borderRadius: radii.md, padding: 15, marginBottom: 18 },
  machine: { height: 166, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', marginBottom: 12 },
  machineCloud: { width: 152, height: 146, marginLeft: -43 },
  detectorImage: { width: 94, height: 118 },
  output: { width: 83, height: 108, alignItems: 'center', justifyContent: 'center' },
  outputLabel: { color: colors.muted, fontFamily: fonts.display, fontSize: 12, letterSpacing: 0.8 },
  outputImage: { width: 62, height: 70 },
  outputQuestion: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 46, lineHeight: 58 },
  history: { minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 18 },
  historyLabel: { color: colors.muted, fontFamily: fonts.display, fontSize: 13, marginRight: 3 },
  historyOutcome: { width: 42, height: 50 },
  stateOutcome: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
  stateSide: { width: '42%', alignItems: 'center' },
  outcomeSide: { width: '35%', alignItems: 'center' },
  sideLabel: { color: colors.coral, fontFamily: fonts.display, fontSize: 13, letterSpacing: 1 },
  sideText: { color: colors.ink, fontFamily: fonts.body, fontSize: 18, textAlign: 'center' },
  smallCloud: { width: 112, height: 94 },
  bigOutcome: { width: 72, height: 76 },
  arrow: { color: colors.primary, fontFamily: fonts.display, fontSize: 32 },
  trialButtons: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  preparationTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 24, marginBottom: 8 },
  preparationState: { flexDirection: 'row', justifyContent: 'center', gap: 32, marginBottom: 20 },
  preparationOutcome: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  preparationSprite: { width: 54, height: 60 },
  preparationPercent: { color: colors.ink, fontFamily: fonts.display, fontSize: 30, fontWeight: '700' },
  trialButton: { flex: 1, minHeight: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.ink, borderRadius: 13, backgroundColor: colors.surface },
  trialButtonActive: { borderStyle: 'solid', borderColor: colors.primary, backgroundColor: '#EEE9FF' },
  trialButtonVisited: { borderColor: colors.green },
  trialButtonText: { color: colors.ink, fontFamily: fonts.display, fontSize: 19 },
  resultsPanel: { minHeight: 202, justifyContent: 'center', backgroundColor: '#EEE9FF', borderRadius: radii.lg, padding: 18 },
  resultsTitle: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 17, letterSpacing: 1, textAlign: 'center' },
  outcomeStream: { minHeight: 62, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 3, marginVertical: 8 },
  streamLetter: { width: 24, height: 26 },
  resultBar: { height: 29, flexDirection: 'row', overflow: 'hidden', borderWidth: 2, borderColor: colors.ink, borderRadius: 15 },
  resultA: { backgroundColor: colors.coral },
  resultB: { backgroundColor: colors.blue },
  emptyBar: { flex: 1, backgroundColor: colors.track },
  resultLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 },
  aText: { color: '#A94031', fontFamily: fonts.display, fontSize: 16 },
  bText: { color: '#276F9D', fontFamily: fonts.display, fontSize: 16 },
  progress: { color: colors.muted, fontFamily: fonts.body, fontSize: 17, textAlign: 'center', marginVertical: 13 },
  coinSection: { alignItems: 'center', marginTop: 8 },
  coinPress: { width: 190, height: 190, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  coin: { width: 142, height: 142, alignItems: 'center', justifyContent: 'center', borderRadius: 71, borderWidth: 8, borderColor: '#B98923', backgroundColor: '#F3C553', shadowColor: colors.ink, shadowOffset: { width: 3, height: 5 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 4 },
  coinText: { color: '#6F5117', fontFamily: fonts.display, fontSize: 27 },
  holdHint: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 19, marginBottom: 12 },
  coinResult: { color: colors.green, fontFamily: fonts.display, fontSize: 26, marginBottom: 14 },
});
