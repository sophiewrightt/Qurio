import { useEffect, useRef, useState } from 'react';
import { Animated, Image, PanResponder, StyleSheet, Text, View } from 'react-native';
import { sampleBinary } from '../data/experimentSampling';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';
import { colors, fonts, radii, spacing } from '../constants/theme';

const strange = require('../assets/module-3/lesson-1/strange-default-transparent.png');
const strangeHappy = require('../assets/module-3/lesson-1/strange-happy-transparent.png');
const spinUpStrange = require('../assets/module-3/lesson-1/spin-up-quark-transparent.png');
const spinDownStrange = require('../assets/module-3/lesson-1/spin-down-quark-transparent.png');
const spinUpHappy = require('../assets/module-3/lesson-1/spin-up-happy-transparent.png');
const spinDownHappy = require('../assets/module-3/lesson-1/spin-down-happy-transparent.png');
const verticalSorter = require('../assets/module-3/lesson-1/vertical-spin-sorter-transparent.png');

const rainbow = ['#E95D59', '#F19A3E', '#E5BF2C', '#4CA57F', '#429BD1', '#7654C8', '#C75AA3'];

function RainbowText({ children }: { children: string }) {
  return <Text>{[...children].map((letter, index) => <Text key={`${letter}-${index}`} style={{ color: rainbow[index % rainbow.length] }}>{letter}</Text>)}</Text>;
}

function PreparationCard({ name }: { name: 'A' | 'B' }) {
  return <View style={styles.preparation}>
    <Text style={styles.preparationName}>STRANGE {name}</Text>
    <Image accessibilityLabel={`Strange quark ${name}`} source={strange} resizeMode="contain" style={styles.preparationStrange} />
    <Text style={styles.preparationValue}>↑ 50%</Text>
    <Text style={styles.preparationValue}>↓ 50%</Text>
  </View>;
}

function StrangeStream({ name, travel }: { name: 'A' | 'B'; travel: Animated.Value }) {
  return <View style={styles.streamRow}>
    <Text style={styles.streamName}>{name}</Text>
    <Animated.View style={[styles.streamParticles, {
      opacity: travel.interpolate({ inputRange: [0, 0.47, 0.6, 1], outputRange: [1, 1, 0, 0] }),
      transform: [
        { translateX: travel.interpolate({ inputRange: [0, 0.58, 1], outputRange: [0, 104, 104] }) },
        { translateY: travel.interpolate({ inputRange: [0, 0.58, 1], outputRange: [0, name === 'A' ? 18 : -18, name === 'A' ? 18 : -18] }) },
        { scale: travel.interpolate({ inputRange: [0, 0.58, 1], outputRange: [1, 0.22, 0.22] }) },
      ],
    }]}> 
      {Array.from({ length: 20 }, (_, index) => <Image key={`${name}-${index}`} source={strange} resizeMode="contain" style={styles.streamParticle} />)}
    </Animated.View>
  </View>;
}

export function BatchSorter({ travel, onSend, disabled }: { travel: Animated.Value; onSend: () => void; disabled: boolean }) {
  const latest = useRef({ onSend, disabled });
  latest.current = { onSend, disabled };
  const send = () => { if (!latest.current.disabled) latest.current.onSend(); };
  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_, g) => !latest.current.disabled && g.dx > 6 && Math.abs(g.dx) > Math.abs(g.dy),
    onPanResponderRelease: (_, g) => { if (g.dx > 22 || g.vx > .3) send(); },
    onPanResponderTerminationRequest: () => false,
  })).current;
  return <View accessibilityRole="button" accessibilityLabel="Swipe right to send 20 pairs through the sorter" accessibilityState={{ disabled }} accessibilityActions={[{ name: 'activate' }]} onAccessibilityAction={send} {...responder.panHandlers} style={styles.sorterScene}>
    <View style={styles.streams}><StrangeStream name="A" travel={travel} /><StrangeStream name="B" travel={travel} /></View>
    <Image accessibilityLabel="Vertical spin sorter" source={verticalSorter} resizeMode="contain" style={styles.sorter} />
    {!disabled && <Text style={styles.swipeHint}>SWIPE THE STRANGES →</Text>}
    <Animated.Text style={[styles.resultsBelow, { opacity: travel.interpolate({ inputRange: [0, 0.88, 1], outputRange: [0, 0, 1] }) }]}>SEE RESULTS BELOW ↓</Animated.Text>
  </View>;
}

function SpinDistribution({ name, up, down }: { name: 'A' | 'B'; up: number; down: number }) {
  return <View accessibilityLabel={`Strange ${name} measured ${up} spin up and ${down} spin down`} style={styles.spinDistribution}>
    <Text style={styles.distributionTitle}>STRANGE {name} · 20 RUNS</Text>
    <View style={styles.distributionResultRow}><Text style={styles.distributionArrow}>↑</Text><Text style={styles.distributionLabel}>UP</Text><View style={styles.resultTrack}><View style={[styles.resultFill, styles.greenFill, { width: `${up * 5}%` }]} /></View><Text style={styles.resultCount}>{up}</Text></View>
    <View style={styles.distributionResultRow}><Text style={styles.distributionArrow}>↓</Text><Text style={styles.distributionLabel}>DOWN</Text><View style={styles.resultTrack}><View style={[styles.resultFill, styles.greenFill, { width: `${down * 5}%` }]} /></View><Text style={styles.resultCount}>{down}</Text></View>
  </View>;
}

export function IndependentPairLab({ onComplete }: { onComplete: () => void }) {
  const [counts, setCounts] = useState<{ aUp: number; bUp: number } | null>(null);
  const [running, setRunning] = useState(false);
  const travel = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const advanced = useRef(false);
  const sent = useRef(false);
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; animation.current?.stop(); }, []);
  const run = () => {
    if (sent.current) return;
    sent.current = true;
    const aUp = sampleBinary(20, 0.5).filter(Boolean).length;
    const bUp = sampleBinary(20, 0.5).filter(Boolean).length;
    setCounts(null);
    setRunning(true);
    travel.setValue(0);
    animation.current = Animated.timing(travel, { toValue: 1, duration: 1450, useNativeDriver: true });
    animation.current.start(({ finished }) => {
      if (!finished || !mounted.current) return;
      setCounts({ aUp, bUp });
      setRunning(false);
      if (!advanced.current) { advanced.current = true; onComplete(); }
    });
  };
  return <View style={styles.section}>
    <Text style={styles.body}>Ok, so now we know what spin is. If we prepare one strange quark, a vertical spin measurement can give up or down.</Text>
    <Text style={styles.body}>We’ve never looked at what happens when more than one elementary particle interacts in an isolated setting.</Text>
    <Text style={styles.heading}>Let’s prepare each strange separately</Text>
    <Text style={styles.body}>We’ll prepare A and B independently. Each one has a 50% predicted chance of spin up and a 50% predicted chance of spin down.</Text>
    <View style={styles.preparationRow}><PreparationCard name="A" /><PreparationCard name="B" /></View>
    <Text style={styles.body}>We’ll repeat each preparation 20 times and see how many up and down results we record. Each run uses a freshly prepared strange quark.</Text>
    <BatchSorter travel={travel} onSend={run} disabled={running || Boolean(counts)} />
    {counts && <>
      <View style={styles.distributionRow}><SpinDistribution name="A" up={counts.aUp} down={20 - counts.aUp} /><SpinDistribution name="B" up={counts.bUp} down={20 - counts.bUp} /></View>
      <Text style={styles.observation}>Predicted for each strange: 50% up and 50% down. These are independently sampled results, so a group of 20 does not have to split exactly 10 and 10.</Text>
      <Text style={styles.body}>We haven’t connected the strange quarks in any way, so their outcomes are <Text style={styles.bold}>independent</Text>. <Text style={styles.underlined}>A giving a certain spin doesn’t influence B’s result.</Text></Text>
    </>}
  </View>;
}

function ConnectedPair() {
  const hover = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const hoverAnimation = Animated.loop(Animated.sequence([
      Animated.timing(hover, { toValue: 1, duration: 1050, useNativeDriver: true }),
      Animated.timing(hover, { toValue: 0, duration: 1050, useNativeDriver: true }),
    ]));
    const pulseAnimation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 760, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 760, useNativeDriver: true }),
    ]));
    hoverAnimation.start();
    pulseAnimation.start();
    return () => { hoverAnimation.stop(); pulseAnimation.stop(); };
  }, [hover, pulse]);
  return <View accessibilityLabel="Two strange quarks hovering together with a fading symbolic connection" style={styles.connectedPairWrap}>
    <Animated.View style={[styles.connectedPair, { transform: [{ translateY: hover.interpolate({ inputRange: [0, 1], outputRange: [5, -7] }) }] }]}> 
      <Image source={strangeHappy} resizeMode="contain" style={styles.connectedStrange} />
      <Animated.View style={{ opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.28, 1] }) }}><Text style={styles.squiggle}>∿∿∿</Text></Animated.View>
      <Image source={strangeHappy} resizeMode="contain" style={styles.connectedStrange} />
    </Animated.View>
  </View>;
}

function CorrelatedPair() {
  return <View accessibilityLabel="A happy spin-up strange and happy spin-down strange show opposite correlated results" style={styles.correlatedPair}>
    <Image source={spinUpHappy} resizeMode="contain" style={styles.correlatedStrange} />
    <Image source={spinDownHappy} resizeMode="contain" style={styles.correlatedStrange} />
  </View>;
}

type PairCount = { label: string; count: number; tone: 'red' | 'green' };

function PairResults({ counts }: { counts: PairCount[] }) {
  return <View accessibilityLabel="Results for 20 connected pairs" style={styles.pairResults}>
    <Text style={styles.distributionTitle}>20 CONNECTED PAIRS</Text>
    {counts.map(result => <View key={result.label} style={styles.resultRow}>
      <Text style={styles.resultLabel}>{result.label}</Text>
      <View style={styles.resultTrack}><View style={[styles.resultFill, result.tone === 'green' ? styles.greenFill : styles.redFill, { width: `${result.count * 5}%` }]} /></View>
      <Text style={styles.resultCount}>{result.count}</Text>
    </View>)}
  </View>;
}

export function InteractionLab({ onComplete }: { onComplete: () => void }) {
  const [interacted, setInteracted] = useState(false);
  const [counts, setCounts] = useState<PairCount[] | null>(null);
  const [running, setRunning] = useState(false);
  const approach = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const connectionReveal = useRef(new Animated.Value(0)).current;
  const travel = useRef(new Animated.Value(0)).current;
  const interactionAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const sortingAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const sent = useRef(false);
  const advanced = useRef(false);
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; interactionAnimation.current?.stop(); sortingAnimation.current?.stop(); }, []);
  const interact = () => {
    if (running || interacted) return;
    setRunning(true);
    approach.setValue(0);
    flash.setValue(0);
    connectionReveal.setValue(0);
    interactionAnimation.current = Animated.sequence([
      Animated.parallel([
        Animated.timing(approach, { toValue: 1, duration: 720, useNativeDriver: true }),
        Animated.timing(flash, { toValue: 1, duration: 720, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(flash, { toValue: 0, duration: 520, useNativeDriver: true }),
        Animated.timing(connectionReveal, { toValue: 1, duration: 520, useNativeDriver: true }),
      ]),
    ]);
    interactionAnimation.current.start(({ finished }) => {
      if (!mounted.current) return;
      setRunning(false);
      if (finished) setInteracted(true);
    });
  };
  const sortPairs = () => {
    if (running || sent.current || !interacted) return;
    sent.current = true;
    const aUp = sampleBinary(20, 0.5).filter(Boolean).length;
    setCounts(null);
    setRunning(true);
    travel.setValue(0);
    sortingAnimation.current = Animated.timing(travel, { toValue: 1, duration: 1450, useNativeDriver: true });
    sortingAnimation.current.start(({ finished }) => {
      if (!finished || !mounted.current) return;
      setCounts([
        { label: 'A ↑   B ↑', count: 0, tone: 'red' },
        { label: 'A ↑   B ↓', count: aUp, tone: 'green' },
        { label: 'A ↓   B ↑', count: 20 - aUp, tone: 'green' },
        { label: 'A ↓   B ↓', count: 0, tone: 'red' },
      ]);
      setRunning(false);
      if (!advanced.current) { advanced.current = true; onComplete(); }
    });
  };
  return <View style={styles.section}>
    <Text style={styles.heading}>Now connect the two stranges</Text>
    <Text style={styles.body}>Now let’s use a physics process that prepares the two strange quarks together. We won’t go into what is exactly happening to do this here. We just want to focus on the effect.</Text>
    {!interacted ? <>
      <View style={styles.interactionTransition}>
        <Animated.View style={[styles.interactionLayer, { opacity: connectionReveal.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 0.45, 0] }) }]}>
          <View accessibilityLabel="Two strange quarks approach and interact in a bright burst" style={styles.interactionScene}>
            <Animated.Image source={strange} resizeMode="contain" style={[styles.interactingStrange, { transform: [{ translateX: approach.interpolate({ inputRange: [0, 1], outputRange: [0, 72] }) }, { rotate: approach.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '300deg'] }) }] }]} />
            <Animated.View style={[styles.interactionFlash, { opacity: flash, transform: [{ scale: flash.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1.7] }) }] }]}><Text style={styles.flashMark}>✦</Text></Animated.View>
            <Animated.Image source={strange} resizeMode="contain" style={[styles.interactingStrange, { transform: [{ translateX: approach.interpolate({ inputRange: [0, 1], outputRange: [0, -72] }) }, { rotate: approach.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-300deg'] }) }] }]} />
          </View>
        </Animated.View>
        <Animated.View style={[styles.interactionLayer, { opacity: connectionReveal }]}>
          <ConnectedPair />
        </Animated.View>
      </View>
      <PrimaryButton disabled={running} label={running ? 'Stranges interacting…' : 'Let them interact'} onPress={interact} />
    </> : <>
      <ConnectedPair />
      <Text style={styles.body}>(The stranges aren’t physically joined, they have just been connected in such a way that they have a shared quantum state!)</Text>
      <Text style={styles.body}>Let’s separate them and send 20 freshly prepared pairs through the <Text style={styles.bold}>vertical</Text> sorter.</Text>
      <BatchSorter travel={travel} onSend={sortPairs} disabled={running || Boolean(counts)} />
      {counts && <>
        <PairResults counts={counts} />
        <Text style={styles.changed}>What changed??</Text>
        <Text style={styles.body}>For this preparation and vertical measurement, A and B cannot both have the same direction. They only give opposite results.</Text>
        <Text style={[styles.body, styles.underlined]}>Knowing A’s result now tells us B’s result.</Text>
        <Text style={styles.theyAre}>They are</Text>
        <Text style={styles.correlated}><RainbowText>Correlated.</RainbowText></Text>
        <CorrelatedPair />
      </>}
    </>}
  </View>;
}

export function JointStateExplanation({ onComplete }: { onComplete: () => void }) {
  return <View style={styles.section}>
    <TerminologyCard term="Entanglement" definition="A shared quantum state in which two or more systems cannot be fully described independently. Their measurement results can show quantum correlations." />
    <Text style={[styles.body, styles.afterTerminology]}>In this idealised preparation, the two strange quarks are entangled. The opposite results show one correlation. Later, we’ll test more measurement directions to see why quantum entanglement is different from an ordinary pre-arranged pair.</Text>
    <PrimaryButton label="Start the quiz" onPress={onComplete} />
  </View>;
}

export function JointStateLessonLabs({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  return <>
    <IndependentPairLab onComplete={() => setStage(1)} />
    {stage >= 1 && <InteractionLab onComplete={() => setStage(2)} />}
    {stage >= 2 && <JointStateExplanation onComplete={onComplete} />}
  </>;
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  heading: { color: colors.ink, fontFamily: fonts.display, fontSize: 30, lineHeight: 36, marginTop: 16, marginBottom: 10 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginBottom: 18 },
  bold: { fontFamily: fonts.display },
  underlined: { textDecorationLine: 'underline' },
  preparationRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  preparation: { flex: 1, alignItems: 'center', backgroundColor: '#E8F5EE', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.green, borderRadius: radii.lg, paddingVertical: 12 },
  preparationName: { color: colors.green, fontFamily: fonts.display, fontSize: 16, letterSpacing: 0.8 },
  preparationStrange: { width: 92, height: 82, marginVertical: 4 },
  preparationValue: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, lineHeight: 24 },
  sorterScene: { height: 220, position: 'relative', overflow: 'hidden', marginBottom: 8 },
  streams: { position: 'absolute', left: 0, top: 25, width: 115, gap: 9, zIndex: 4 },
  streamRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streamName: { width: 15, color: colors.green, fontFamily: fonts.display, fontSize: 16 },
  streamParticles: { width: 96, flexDirection: 'row', flexWrap: 'wrap' },
  streamParticle: { width: 19, height: 19 },
  sorter: { position: 'absolute', left: '31%', top: 45, width: 156, height: 142, zIndex: 3 },
  sorterOutputUp: { position: 'absolute', left: '58%', top: 23, flexDirection: 'row', gap: -16, zIndex: 2 },
  sorterOutputDown: { position: 'absolute', left: '58%', bottom: 18, flexDirection: 'row', gap: -16, zIndex: 2 },
  outputParticle: { width: 48, height: 55 },
  resultsBelow: { position: 'absolute', right: 0, bottom: 10, width: 116, color: colors.ink, fontFamily: fonts.display, fontSize: 16, lineHeight: 20, textAlign: 'center' },
  swipeHint: { position: 'absolute', bottom: 0, left: 0, fontFamily: fonts.display, color: colors.ink, fontSize: 17 },
  distributionArrow: { width: 30, color: colors.ink, fontSize: 30, textAlign: 'center' },
  distributionRow: { gap: 10, marginTop: 18, marginBottom: 14 },
  spinDistribution: { padding: 12, backgroundColor: '#FFFDF7', borderWidth: 2, borderColor: colors.ink, borderRadius: radii.lg },
  distributionTitle: { color: colors.green, fontFamily: fonts.display, fontSize: 14, letterSpacing: 0.6, textAlign: 'center', marginBottom: 8 },
  distributionResultRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 7 },
  distributionIcon: { width: 36, height: 42 },
  distributionLabel: { width: 43, color: colors.ink, fontFamily: fonts.body, fontSize: 17 },
  observation: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, lineHeight: 26, backgroundColor: '#FFF0A6', borderRadius: radii.md, padding: 15, marginBottom: 18 },
  connectedPairWrap: { alignItems: 'center', marginVertical: 18 },
  connectedPair: { minHeight: 132, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  connectedStrange: { width: 118, height: 118, zIndex: 2 },
  squiggle: { color: colors.green, fontFamily: fonts.display, fontSize: 39, letterSpacing: -7, marginHorizontal: -13 },
  pairResults: { backgroundColor: '#FFFDF7', borderWidth: 2, borderColor: colors.ink, borderRadius: radii.lg, padding: 16, marginVertical: 18 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 9 },
  resultLabel: { width: 75, color: colors.ink, fontFamily: fonts.body, fontSize: 18 },
  resultTrack: { flex: 1, height: 15, overflow: 'hidden', backgroundColor: colors.track, borderRadius: 8 },
  resultFill: { height: '100%', borderRadius: 8 },
  greenFill: { backgroundColor: colors.green },
  redFill: { backgroundColor: colors.coral },
  resultCount: { width: 24, color: colors.ink, fontFamily: fonts.display, fontSize: 18, textAlign: 'right' },
  interactionTransition: { position: 'relative', height: 196, overflow: 'hidden', marginBottom: 6 },
  interactionLayer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center' },
  interactionScene: { height: 196, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', paddingHorizontal: 10 },
  interactingStrange: { width: 108, height: 108, zIndex: 2 },
  interactionFlash: { position: 'absolute', left: '50%', marginLeft: -38, width: 76, height: 76, alignItems: 'center', justifyContent: 'center', borderRadius: 38, backgroundColor: '#FFF0A6', shadowColor: colors.yellow, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.95, shadowRadius: 22, elevation: 5 },
  flashMark: { color: colors.coral, fontFamily: fonts.display, fontSize: 54 },
  changed: { color: '#D94C4C', fontFamily: fonts.display, fontSize: 41, lineHeight: 48, textAlign: 'center', marginVertical: 18 },
  theyAre: { color: colors.ink, fontFamily: fonts.body, fontSize: 24, textAlign: 'center' },
  correlated: { fontFamily: fonts.display, fontSize: 42, lineHeight: 51, textAlign: 'center', marginBottom: 4 },
  correlatedPair: { minHeight: 168, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  correlatedStrange: { width: '48%', height: 180 },
  correlationLink: { color: colors.green, fontFamily: fonts.display, fontSize: 29, marginHorizontal: -9 },
  afterTerminology: { marginTop: 28 },
});
