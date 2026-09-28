import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';
import { colors, fonts, radii, spacing } from '../constants/theme';

const electron = require('../assets/particles/electron-content.png');
const personProperties = require('../assets/module-2/lesson-7/person-properties-transparent.png');
const electronProperties = require('../assets/module-2/lesson-7/electron-properties-transparent.png');
const spinUp = require('../assets/module-2/lesson-7/spin-up-transparent.png');
const spinDown = require('../assets/module-2/lesson-7/spin-down-transparent.png');
const stairs = require('../assets/module-2/stairs-transparent.png');

function SpinMisconception() {
  const turn = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(turn, { toValue: 1, duration: 1350, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [turn]);
  return <View style={styles.section}>
    <Text style={styles.body}>One quantum property we can look at is called spin.</Text>
    <View style={styles.spinMyth}>
      <Animated.Image accessibilityLabel="Electron rotating like a ball" source={electron} resizeMode="contain" style={[styles.rotatingElectron, { transform: [{ rotate: turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }]} />
      <View style={styles.notQuiteStamp}><Text style={styles.notQuiteText}>NOT QUITE</Text></View>
    </View>
    <Text style={styles.body}>The name makes spin sound like the particle is physically rotating. But quantum spin is a built-in property, not a tiny ball turning around.</Text>
  </View>;
}

function IntrinsicFeatures() {
  return <View style={styles.section}>
    <Text style={styles.heading}>A property of the particle itself</Text>
    <Text style={styles.body}>People have properties such as a name, mass and favourite colour.</Text>
    <Image accessibilityLabel="A person’s example properties card" source={personProperties} resizeMode="contain" style={styles.propertyArtwork} />
    <Text style={styles.body}>An electron has its own built-in properties too, including mass, electric charge and spin.</Text>
    <Image accessibilityLabel="An electron’s example properties card" source={electronProperties} resizeMode="contain" style={styles.propertyArtwork} />
    <TerminologyCard term="Spin" definition="A built-in quantum property of a particle, not a little ball physically rotating." />
  </View>;
}

function ContinuousArrowDemo({ onComplete }: { onComplete: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const [value, setValue] = useState(0);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    const listener = progress.addListener(({ value: next }) => setValue(next));
    return () => {
      animation.current?.stop();
      progress.removeListener(listener);
    };
  }, [progress]);
  const run = () => {
    setFinished(false);
    progress.setValue(0);
    animation.current = Animated.timing(progress, { toValue: 1, duration: 2200, useNativeDriver: false });
    animation.current.start(({ finished: completed }) => {
      if (!completed) return;
      setFinished(true);
      onComplete();
    });
  };
  return <View style={styles.section}>
    <Text style={styles.heading}>First, imagine an ordinary arrow</Text>
    <Text style={styles.body}>Label one direction 0 and the opposite direction 1. As an ordinary arrow turns between them, it passes smoothly through every direction in between. The number can pass through decimals too.</Text>
    <View accessibilityLabel={`Ordinary arrow showing continuous value ${value.toFixed(2)}`} style={styles.arrowDemo}>
      <Text style={styles.endpointZero}>0</Text><Text style={styles.endpointOne}>1</Text>
      <Animated.Text style={[styles.demoArrow, { transform: [{ rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }]}>↑</Animated.Text>
      <Text style={styles.continuousValue}>{value.toFixed(2)}</Text>
    </View>
    {!finished ? <PrimaryButton label="Turn the ordinary arrow" onPress={run} /> : <Text style={styles.keyPoint}>That was continuous: the arrow passed through lots of in-between directions and values.</Text>}
  </View>;
}

function QuantisedSpinIntro() {
  return <View style={styles.section}>
    <Text style={styles.heading}>Quantum spin measurements are different</Text>
    <View style={styles.quantisedRecall}><Image accessibilityLabel="The staircase analogy for quantised values" source={stairs} resizeMode="contain" style={styles.stairs} /><Text style={styles.quantisedWord}>two allowed results</Text></View>
    <Text style={styles.body}>Choose one direction to measure along. For an electron, the spin result does not land on all the values in between. It comes out as one of two quantised results: spin up or spin down along that direction.</Text>
    <Text style={styles.body}>The electron is not secretly a tiny arrow. The arrow only helps us picture the direction chosen by the measuring equipment.</Text>
  </View>;
}

function SpinSorter({ onComplete }: { onComplete: () => void }) {
  const [sorted, setSorted] = useState(false);
  const travel = useRef(new Animated.Value(0)).current;
  const mounted = useRef(true);
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  useEffect(() => () => { mounted.current = false; animation.current?.stop(); }, []);
  const run = () => {
    if (sorted) return;
    travel.setValue(0);
    animation.current = Animated.timing(travel, { toValue: 1, duration: 750, useNativeDriver: true });
    animation.current.start(({ finished }) => {
      if (!mounted.current || !finished) return;
      setSorted(true);
      onComplete();
    });
  };
  return <View style={styles.section}>
    <Text style={styles.heading}>Try one fixed direction</Text>
    <Text style={styles.body}>Keep the spin sorter pointing vertically and send in a stream of electrons.</Text>
    <View accessibilityLabel="Electrons entering a vertical spin sorting machine" style={styles.sorterScene}>
      <Animated.View style={[styles.incomingStream, { opacity: sorted ? 0 : 1, transform: [{ translateX: travel.interpolate({ inputRange: [0, 1], outputRange: [0, 96] }) }] }]}>{[0, 1, 2].map(item => <Image key={item} accessibilityLabel="Electron" source={electron} resizeMode="contain" style={styles.incomingElectron} />)}</Animated.View>
      <View style={styles.sorterMachine}><Text style={styles.sorterLabel}>SPIN{`\n`}SORTER</Text><Text style={styles.sorterDirection}>↑</Text></View>
      {sorted && <View style={styles.sortedOutcomes}>
        <View style={styles.outcome}><Image source={spinUp} resizeMode="contain" style={styles.outcomeImage} /><Text style={styles.outcomeLabel}>Spin up</Text></View>
        <View style={styles.outcome}><Image source={spinDown} resizeMode="contain" style={styles.outcomeImage} /><Text style={styles.outcomeLabel}>Spin down</Text></View>
      </View>}
    </View>
    {!sorted ? <PrimaryButton label="Send electrons through" onPress={run} /> : <Text style={styles.keyPoint}>Only two groups appear. There are no half-up, sideways or 0.37 results in this vertical spin measurement.</Text>}
  </View>;
}

export function PreparedSpinCheck({ onComplete }: { onComplete: () => void }) {
  const [measured, setMeasured] = useState(false);
  return <View style={styles.section}>
    <Text style={styles.heading}>Prepare, then measure</Text>
    <Text style={styles.body}>Now prepare an electron as spin up vertically, then measure it in that same vertical direction.</Text>
    <View style={styles.preparedRow}><Image accessibilityLabel="Electron prepared spin up vertically" source={spinUp} resizeMode="contain" style={styles.preparedSpin} /><Text style={styles.preparedArrow}>→</Text><View style={styles.fixedDetector}><Text style={styles.fixedDetectorText}>MEASURE{`\n`}VERTICALLY</Text></View></View>
    {!measured ? <PrimaryButton label="Measure the prepared electron" onPress={() => { setMeasured(true); onComplete(); }} /> : <><View style={styles.fixedResult}><Image accessibilityLabel="Measured result spin up" source={spinUp} resizeMode="contain" style={styles.fixedResultImage} /><Text style={styles.fixedResultText}>Result: spin up</Text></View><Text style={styles.keyPoint}>In this ideal experiment, preparing spin up and measuring in the same direction gives spin up with certainty.</Text></>}
  </View>;
}

function ConceptChain({ onComplete }: { onComplete: () => void }) {
  const links = ['Spin is a built-in property', 'Choose one measurement direction', 'Two allowed results', 'Spin up or spin down'];
  return <View style={styles.section}>
    <Text style={styles.heading}>The simple version to remember</Text>
    <View style={styles.chain}>{links.map((link, index) => <View key={link} style={styles.chainItem}><Text style={styles.chainText}>{link}</Text>{index < links.length - 1 && <Text style={styles.chainArrow}>↓</Text>}</View>)}</View>
    <Text style={styles.body}>Later, we can explore what happens when the direction of the detector changes. For now, the important idea is that one chosen direction gives two discrete spin results.</Text>
    <PrimaryButton label="Start the quiz" onPress={onComplete} />
  </View>;
}

export function SpinLessonLabs({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  return <>
    <SpinMisconception />
    <IntrinsicFeatures />
    <ContinuousArrowDemo onComplete={() => setStage(1)} />
    {stage >= 1 && <><QuantisedSpinIntro /><SpinSorter onComplete={() => setStage(2)} /></>}
    {stage >= 2 && <PreparedSpinCheck onComplete={() => setStage(3)} />}
    {stage >= 3 && <ConceptChain onComplete={onComplete} />}
  </>;
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  heading: { color: colors.ink, fontFamily: fonts.display, fontSize: 30, lineHeight: 36, marginTop: 16, marginBottom: 10 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginBottom: 18 },
  spinMyth: { height: 210, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  rotatingElectron: { width: 158, height: 158 },
  notQuiteStamp: { position: 'absolute', right: 12, bottom: 14, borderWidth: 3, borderColor: colors.red, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5, transform: [{ rotate: '-8deg' }] },
  notQuiteText: { color: colors.red, fontFamily: fonts.display, fontSize: 20, letterSpacing: 1.2 },
  propertyArtwork: { width: '100%', height: 225, alignSelf: 'center', marginTop: -12, marginBottom: 10 },
  arrowDemo: { height: 235, alignItems: 'center', justifyContent: 'center', marginBottom: 12, backgroundColor: '#EEE9FF', borderRadius: radii.lg },
  endpointZero: { position: 'absolute', top: 12, left: 34, color: colors.primaryDark, fontFamily: fonts.display, fontSize: 28 },
  endpointOne: { position: 'absolute', bottom: 62, right: 34, color: colors.primaryDark, fontFamily: fonts.display, fontSize: 28 },
  demoArrow: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 116, lineHeight: 132 },
  continuousValue: { position: 'absolute', bottom: 13, color: colors.ink, fontFamily: fonts.display, fontSize: 30 },
  keyPoint: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, backgroundColor: '#FFF0A6', borderRadius: radii.md, padding: 16, marginBottom: 18 },
  quantisedRecall: { alignItems: 'center', marginBottom: 8 },
  stairs: { width: 245, height: 150 },
  quantisedWord: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 20, marginTop: -10 },
  sorterScene: { height: 200, marginBottom: 12, overflow: 'hidden' },
  incomingStream: { position: 'absolute', left: 0, top: 74, flexDirection: 'row', gap: 2 },
  incomingElectron: { width: 31, height: 31 },
  sorterMachine: { position: 'absolute', left: '38%', top: 45, width: 88, height: 118, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DED8CC', borderWidth: 3, borderColor: colors.ink, borderRadius: radii.md, transform: [{ rotate: '-1deg' }] },
  sorterLabel: { color: colors.ink, fontFamily: fonts.display, fontSize: 15, lineHeight: 18, textAlign: 'center' },
  sorterDirection: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 30, lineHeight: 34 },
  sortedOutcomes: { position: 'absolute', right: 0, top: 7, width: 117, height: 188, justifyContent: 'space-between' },
  outcome: { flexDirection: 'row', alignItems: 'center' },
  outcomeImage: { width: 72, height: 82 },
  outcomeLabel: { flex: 1, color: colors.ink, fontFamily: fonts.body, fontSize: 18, lineHeight: 21 },
  preparedRow: { minHeight: 155, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  preparedSpin: { width: 118, height: 128 },
  preparedArrow: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 34, marginHorizontal: 2 },
  fixedDetector: { width: 118, minHeight: 94, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DED8CC', borderWidth: 3, borderColor: colors.ink, borderRadius: radii.md },
  fixedDetectorText: { color: colors.ink, fontFamily: fonts.display, fontSize: 14, lineHeight: 18, textAlign: 'center' },
  fixedResult: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  fixedResultImage: { width: 100, height: 110 },
  fixedResultText: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 24 },
  chain: { alignItems: 'center', marginVertical: 12, marginBottom: 20 },
  chainItem: { alignItems: 'center' },
  chainText: { color: colors.ink, fontFamily: fonts.display, fontSize: 23, textAlign: 'center' },
  chainArrow: { color: colors.primary, fontFamily: fonts.display, fontSize: 25, lineHeight: 31 },
});
