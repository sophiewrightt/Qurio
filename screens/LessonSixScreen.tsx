import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, PanResponder, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { ElectronRun } from '../components/ElectronRun';
import { EnvironmentKind } from '../components/EnvironmentEffects';
import { PrimaryButton } from '../components/PrimaryButton';
import { HoveringImage } from '../components/HoveringImage';
import { TerminologyCard } from '../components/TerminologyCard';
import { LessonFinishActions } from '../components/LessonFinishActions';
import { colors, fonts } from '../constants/theme';

export const environments: { id: EnvironmentKind; label: string; setup: string; result: string }[] = [
  { id: 'air', label: 'Air', setup: 'Let air molecules into the chamber, so they collide with the electrons.',
    result: 'Air molecules bump into the electrons and pick up clues about their paths. Lots of tiny bumps blur the stripe pattern.' },
  { id: 'heat', label: 'Heat', setup: 'Warm the surroundings enough to increase collisions and interactions with thermal radiation.',
    result: 'A warmer environment creates more jostling and more chances for the electrons to interact with their surroundings. The delicate stripes wash out.' },
];

const airParticle = require('../assets/lesson-6/interactions/air-particle-transparent.png');
const heatParticle = require('../assets/lesson-6/interactions/heat-particle-transparent.png');
const snowflake = require('../assets/lesson-6/interactions/snowflake-transparent.png');
const thermometers = [
  require('../assets/lesson-6/interactions/thermometer-1-transparent.png'),
  require('../assets/lesson-6/interactions/thermometer-2-transparent.png'),
  require('../assets/lesson-6/interactions/thermometer-3-transparent.png'),
  require('../assets/lesson-6/interactions/thermometer-4-transparent.png'),
  require('../assets/lesson-6/interactions/thermometer-5-transparent.png'),
];

export function AirInteractionWarmup({ onReady }: { onReady: () => void }) {
  const [taps, setTaps] = useState(0);
  const drift = useRef(new Animated.Value(0)).current;
  const ready = useRef(false);
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(drift, { toValue: 1, duration: 1350, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(drift, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [drift]);
  const addInteraction = () => {
    const next = Math.min(3, taps + 1);
    setTaps(next);
    if (next === 3 && !ready.current) { ready.current = true; onReady(); }
  };
  return <Pressable accessibilityRole="button" accessibilityLabel="Tap to let moving air particles into the chamber" onPress={addInteraction} style={({ pressed }) => [styles.warmup, pressed && styles.warmupPressed]}>
    <Text style={styles.warmupTitle}>{taps === 3 ? 'Air is moving through the chamber!' : 'Tap to let air particles in'}</Text>
    <View style={styles.airChamber}>
      <View pointerEvents="none" style={styles.chamberInner} />
      {Array.from({ length: taps * 4 }, (_, index) => <Animated.Image key={index} source={airParticle} resizeMode="contain" style={[styles.airParticle, {
        left: `${5 + (index * 23) % 82}%`,
        top: 8 + (index * 31) % 88,
        transform: [
          { translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [index % 2 ? -8 : 6, index % 2 ? 10 : -9] }) },
          { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [index % 3 ? 5 : -7, index % 3 ? -8 : 7] }) },
          { scale: 0.72 + (index % 3) * 0.13 },
        ],
      }]} />)}
    </View>
    <Text style={styles.warmupCaption}>{taps}/3 taps · each tap adds more moving particles</Text>
  </Pressable>;
}

export function HeatInteractionWarmup({ onReady, onGestureLock }: { onReady: () => void; onGestureLock?: (locked: boolean) => void }) {
  const [level, setLevel] = useState(0);
  const levelRef = useRef(0);
  const startLevel = useRef(0);
  const ready = useRef(false);
  const drift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(drift, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(drift, { toValue: 0, duration: 850, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    animation.start();
    return () => { animation.stop(); onGestureLock?.(false); };
  }, [drift, onGestureLock]);
  const updateLevel = (next: number) => {
    const clamped = Math.max(0, Math.min(4, next));
    levelRef.current = clamped;
    setLevel(clamped);
    if (clamped === 4 && !ready.current) { ready.current = true; onReady(); }
  };
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 3,
    onMoveShouldSetPanResponderCapture: (_, gesture) => Math.abs(gesture.dy) > 3,
    onPanResponderGrant: () => { startLevel.current = levelRef.current; onGestureLock?.(true); },
    onPanResponderMove: (_, gesture) => updateLevel(startLevel.current + Math.round(-gesture.dy / 38)),
    onPanResponderRelease: () => onGestureLock?.(false),
    onPanResponderTerminate: () => onGestureLock?.(false),
    onPanResponderTerminationRequest: () => false,
  })).current;
  const coldCount = Math.max(0, 4 - level * 2);
  const hotCount = level >= 2 ? level * 2 : 0;
  const labels = ['Very cold', 'Cool', 'Warming up', 'Hot', 'Maximum heat'];
  return <View style={styles.warmup}>
    <Text style={styles.warmupTitle}>{level === 4 ? 'The chamber is hot!' : 'Swipe the thermometer up to turn up the heat'}</Text>
    <View style={styles.heatStage}>
      {Array.from({ length: coldCount }, (_, index) => <Image key={`cold-${index}`} source={snowflake} resizeMode="contain" style={[styles.temperatureParticle, { left: index % 2 ? '72%' : '8%', top: 12 + index * 34 }]} />)}
      {Array.from({ length: hotCount }, (_, index) => <Animated.Image key={`hot-${index}`} source={heatParticle} resizeMode="contain" style={[styles.temperatureParticle, {
        left: `${5 + (index * 29) % 82}%`, top: 8 + (index * 37) % 145,
        transform: [{ translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [5, -9 - index % 3] }) }, { scale: 0.74 + (index % 3) * 0.12 }],
      }]} />)}
      <Animated.View accessibilityRole="adjustable" accessibilityLabel="Heat level" accessibilityValue={{ min: 0, max: 4, now: level, text: labels[level] }}
        accessibilityActions={[{ name: 'increment', label: 'Turn up the heat' }, { name: 'decrement', label: 'Turn down the heat' }]}
        onAccessibilityAction={event => updateLevel(levelRef.current + (event.nativeEvent.actionName === 'increment' ? 1 : -1))}
        {...panResponder.panHandlers} style={styles.thermometerTouch}>
        <Image source={thermometers[level]} resizeMode="contain" style={styles.thermometer} />
        {level < 4 && <Text style={styles.swipeArrow}>↑</Text>}
      </Animated.View>
    </View>
    <Text style={styles.warmupCaption}>{labels[level]} · {level}/4</Text>
  </View>;
}

function InteractionWarmup({ kind, onReady, onGestureLock }: { kind: EnvironmentKind; onReady: () => void; onGestureLock?: (locked: boolean) => void }) {
  return kind === 'air' ? <AirInteractionWarmup onReady={onReady} /> : <HeatInteractionWarmup onReady={onReady} onGestureLock={onGestureLock} />;
}

function BasketballReveal() {
  const zoom = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const revealAnimation = Animated.timing(zoom, { toValue: 1, duration: 1600, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    const bounceAnimation = Animated.loop(Animated.sequence([
      Animated.timing(bounce, { toValue: 1, duration: 520, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(bounce, { toValue: 0, duration: 430, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]));
    revealAnimation.start(); bounceAnimation.start();
    return () => { revealAnimation.stop(); bounceAnimation.stop(); };
  }, [bounce, zoom]);
  return <View style={styles.basketballScene} accessibilityLabel="Zooming out from many tiny particles to an everyday basketball">
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: zoom.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 0.2, 0] }) }]}>
      {Array.from({ length: 36 }, (_, i) => <View key={i} style={{ position: 'absolute', left: `${12 + (i * 19) % 72}%`, top: 25 + (i * 31) % 190, width: 9, height: 9, borderRadius: 5, backgroundColor: i % 2 ? colors.primary : colors.coral }} />)}
    </Animated.View>
    <Animated.View style={[styles.ballShadow, { opacity: zoom.interpolate({ inputRange: [0, 1], outputRange: [0, 0.2] }), transform: [{ scaleX: bounce.interpolate({ inputRange: [0, 1], outputRange: [1, 0.68] }) }] }]} />
    <Animated.Image source={require('../assets/lesson-1/basketball.png')} resizeMode="contain" style={[
      styles.bouncingBasketball,
      { opacity: zoom, transform: [{ translateY: bounce.interpolate({ inputRange: [0, 1], outputRange: [14, -32] }) }, { scale: zoom.interpolate({ inputRange: [0, 1], outputRange: [0.15, 1] }) }] },
    ]} />
    <Text style={styles.sceneCaption}>A whole world of interacting particles.</Text>
  </View>;
}

export function LessonSixScreen({ onHome, onComplete }: { onHome: () => void; onComplete: () => void }) {
  const [baselineComplete, setBaselineComplete] = useState(false);
  const [selected, setSelected] = useState<EnvironmentKind>('air');
  const [tried, setTried] = useState<EnvironmentKind[]>([]);
  const [result, setResult] = useState<EnvironmentKind | null>(null);
  const [busy, setBusy] = useState(false);
  const [trial, setTrial] = useState(0);
  const [prepared, setPrepared] = useState<EnvironmentKind | null>(null);
  const [gestureLocked, setGestureLocked] = useState(false);
  const busyRef = useRef(false);
  const setup = environments.find(item => item.id === selected)!;
  const coreTried = tried.includes('air') && tried.includes('heat');
  const select = (id: EnvironmentKind) => {
    if (busyRef.current || id === selected) return;
    setSelected(id); setResult(null); setPrepared(null); setTrial(value => value + 1);
  };
  return <SafeAreaView style={styles.safe}><ScrollView scrollEnabled={!gestureLocked} contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
    <LessonBadge number={6} />
    <Text style={styles.title}>The “magic” of observation?</Text>
    <Text style={styles.body}>Imagine we keep our electron as isolated as possible from the world around it, until it arrives at the screen.</Text>
    <Text style={styles.body}>No slit detectors. No stage fright. Just a peaceful electron in its familiar two-slit experiment.</Text>
    <HoveringImage source={require('../assets/lesson-6/electron-meditating-transparent.png')} style={styles.meditatingElectron} accessibilityLabel="Electron meditating peacefully" />
    <Text style={styles.heading}>A quiet little quantum world.</Text>
    <Text style={styles.body}>Send electrons through one at a time. The blue glow represents the wave of possibilities through both openings, which makes the alternatives easier to visualise. It is not a trail showing where a tiny ball actually went.</Text>
    <ElectronRun possibilities onPattern={() => setBaselineComplete(true)} />
    {!baselineComplete && <Text style={styles.hint}>Build the pattern to see what happens when the outside world joins in.</Text>}
    {baselineComplete && <>
      <Text style={styles.body}>There’s our interference pattern again! Each electron leaves one dot, and many arrivals build up alternating bands.</Text>
      <View style={styles.section}>
        <Text style={styles.heading}>Let’s invite the outside world in.</Text>
        <Text style={styles.body}>Let’s see what happens if we introduce some other interactions to the experiment.</Text>
        <View style={styles.choices} accessibilityRole="radiogroup">
          {environments.map(item => <Pressable key={item.id} accessibilityRole="radio"
            accessibilityLabel={`${item.label}${tried.includes(item.id) ? ', explored' : ''}`}
            accessibilityState={{ checked: selected === item.id, disabled: busy }} disabled={busy}
            onPress={() => select(item.id)} style={[styles.choice, tried.includes(item.id) && styles.choiceExplored, selected === item.id && styles.choiceSelected, busy && { opacity: 0.6 }]}>
            <Text style={[styles.choiceText, selected === item.id && { color: colors.white }]}>{item.label}</Text>
            {tried.includes(item.id) && <Text style={[styles.explored, selected === item.id && { color: colors.yellow }]}>explored</Text>}
          </Pressable>)}
        </View>
        <InteractionWarmup key={`warmup-${selected}-${trial}`} kind={selected} onReady={() => setPrepared(selected)} onGestureLock={setGestureLocked} />
        {prepared === selected && <ElectronRun key={`${selected}-${trial}`} environment={selected} possibilities
          onBusyChange={value => { busyRef.current = value; setBusy(value); }}
          onPattern={() => { setResult(selected); setTried(old => old.includes(selected) ? old : [...old, selected]); }} />}
        {result === selected && <View style={styles.finding} accessibilityLiveRegion="polite">
          <Text style={styles.findingTitle}>The bands have washed out.</Text>
          <Text style={styles.body}>{setup.result}</Text>
        </View>}
        {result === selected && !coreTried && <PrimaryButton label="Explore the other option to find out what happens!" secondary disabled={busy} onPress={() => select(selected === 'air' ? 'heat' : 'air')} />}
        <Text style={styles.hint}>{tried.length} of 2 explored{coreTried ? ' - comparison complete!' : ' · explore Air and Heat.'}</Text>
      </View>
      {coreTried && <>
        <Text style={styles.heading}>It’s not magic. It’s physics.</Text>
        <Text style={styles.body}>Interference is delicate. Air, heat and other things can jostle an electron and leave path clues in the surroundings.</Text>
        <Text style={styles.body}>Once the two paths stop combining cleanly, the stripes wash out. Nobody has to watch. The interaction does the work.</Text>
        <TerminologyCard term="Decoherence" definition="When a quantum system becomes linked with its environment, its alternatives stop producing clear interference in the system we observe." />
        <View style={styles.section}>
          <Text style={styles.heading}>And our basketball?</Text>
          <>
            <BasketballReveal />
            <Text style={styles.body}>A basketball contains an enormous number of particles, interacting with one another, the air, light, and everything around it.</Text>
            <Text style={styles.body}>It isn’t exempt from quantum physics. It’s made entirely from things that obey it!</Text>
            <Text style={styles.body}>Those constant interactions make interference between different whole-ball paths incredibly difficult to observe. Classical physics works beautifully for predicting an everyday shot.</Text>
            <LessonFinishActions onComplete={onComplete} />
          </>
        </View>
      </>}
    </>}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 70 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 40, marginVertical: 20 },
  heading: { color: colors.ink, fontFamily: fonts.body, fontSize: 29, marginTop: 18, marginBottom: 20 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 29, marginBottom: 20 },
  meditatingElectron: { width: '100%', height: 230, alignSelf: 'center', marginTop: 4, marginBottom: 8 },
  section: { marginTop: 36, paddingTop: 20, borderTopWidth: 2, borderStyle: 'dashed', borderColor: colors.primary },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  choice: { minWidth: '45%', flexGrow: 1, paddingVertical: 13, paddingHorizontal: 12, borderWidth: 2, borderColor: colors.primary, borderRadius: 15, backgroundColor: colors.surface, alignItems: 'center' },
  choiceSelected: { backgroundColor: colors.primary, transform: [{ rotate: '-1deg' }] },
  choiceExplored: { backgroundColor: '#DDD8E8', borderColor: '#8E879A' },
  choiceText: { color: colors.ink, fontFamily: fonts.body, fontSize: 22 },
  explored: { color: colors.primaryDark, fontFamily: fonts.body, fontSize: 16, marginTop: 3 },
  finding: { padding: 18, backgroundColor: '#E7F0E2', borderColor: '#64886C', borderWidth: 2, borderStyle: 'dashed', borderRadius: 17, marginBottom: 20 },
  findingTitle: { color: colors.ink, fontFamily: fonts.body, fontSize: 27, marginBottom: 14 },
  hint: { color: colors.ink, fontFamily: fonts.body, fontSize: 19, textAlign: 'center', marginVertical: 18 },
  small: { color: colors.ink, fontFamily: fonts.body, fontSize: 17, lineHeight: 23, marginBottom: 12 },
  warmup: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.coral, borderRadius: 18, backgroundColor: '#FFF5D8', padding: 16, marginBottom: 20, overflow: 'hidden' },
  warmupPressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
  warmupTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 24, textAlign: 'center' },
  airChamber: { height: 150, marginVertical: 12, overflow: 'hidden', borderWidth: 2, borderRadius: 17, borderColor: colors.ink, backgroundColor: 'rgba(255,255,255,0.52)' },
  chamberInner: { position: 'absolute', inset: 5, borderWidth: 1, borderStyle: 'dashed', borderColor: '#BDB3A4', borderRadius: 12 },
  airParticle: { position: 'absolute', width: 37, height: 37 },
  heatStage: { height: 238, marginVertical: 8, alignItems: 'center', justifyContent: 'center' },
  thermometerTouch: { width: 126, height: 232, alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  thermometer: { width: 88, height: 220 },
  swipeArrow: { position: 'absolute', right: 2, top: 70, color: colors.coral, fontFamily: fonts.display, fontSize: 47 },
  temperatureParticle: { position: 'absolute', width: 43, height: 43 },
  warmupCaption: { color: colors.coral, fontFamily: fonts.body, fontSize: 18, textAlign: 'center' },
  basketballScene: { minHeight: 300, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  bouncingBasketball: { width: 210, height: 210 },
  ballShadow: { position: 'absolute', bottom: 47, width: 128, height: 18, borderRadius: 20, backgroundColor: colors.ink },
  sceneCaption: { color: colors.ink, fontFamily: fonts.body, fontSize: 19, marginTop: 15, textAlign: 'center' },
});
