import { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageSourcePropType, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { sampleBinary } from '../data/experimentSampling';
import { AnswerButton } from './AnswerButton';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';

const art = {
  electron: require('../assets/particles/electron-content.png'),
  ball: require('../assets/module-4/lesson-2/tennis_ball_.png'),
  player: require('../assets/module-4/lesson-2/tennis_player.png'),
  dog: require('../assets/module-4/lesson-2/dog_with_ball.png'),
  charm: require('../assets/module-4/lesson-2/charm_default.png'),
  happy: require('../assets/module-4/lesson-2/Happy_charm.png'),
  up: require('../assets/module-4/lesson-2/charm_up.png'),
  together: require('../assets/module-4/lesson-2/charm_and_strange_together.png'),
  entangler: require('../assets/module-3/lesson-3-all-entangled-up/entangler-transparent.png'),
};
export const identityCards = {
  alex: { name: 'Alex', source: require('../assets/module-4/lesson-2/alex_id.png'), detail: 'Human ID: Alex. Mass: 80 kg. Favourite colour: red.' },
  barb: { name: 'Barb', source: require('../assets/module-4/lesson-2/barb_id_.png'), detail: 'Human ID: Barb. Mass: 75 kg. Favourite colour: blue.' },
  electron: { name: 'Electron', source: require('../assets/module-4/lesson-2/electron_ID.png'), detail: 'Rest mass: about 9.1 × 10⁻³¹ kg. Electric charge: −e (about −1.6 × 10⁻¹⁹ C).' },
  photon: { name: 'Photon', source: require('../assets/module-4/lesson-2/photon_ID.png'), detail: 'Rest mass: 0. Electric charge: 0. Photons still carry energy!' },
  strange: { name: 'Strange', source: require('../assets/module-4/lesson-2/strange_ID.png'), detail: 'Electric charge: −⅓e. The card gives an approximate quark mass of 95 MeV/c².' },
  charm: { name: 'Charm', source: require('../assets/module-4/lesson-2/charm_ID.png'), detail: 'Electric charge: +⅔e. The card gives an approximate quark mass of 1.27 GeV/c².' },
};
type CardKind = keyof typeof identityCards;

function CardArt({ kind }: { kind: CardKind }) {
  return <View style={styles.cardArt}>
    <Image accessible={false} source={identityCards[kind].source} resizeMode="contain" style={styles.fillImage} />
    {/* The source omits the electron's minus sign. This proportional ink stroke
        corrects its display at both thumbnail and enlarged sizes without changing the scan. */}
    {kind === 'electron' && <View testID="electron-negative-charge" style={styles.minusSign} />}
  </View>;
}

export function IdentityCardPair({ left, right, onMeetCharm }: { left: CardKind; right: CardKind; onMeetCharm?: () => void }) {
  const [expanded, setExpanded] = useState<CardKind | null>(null);
  return <View style={styles.cardPair}>
    <View style={styles.row}>{[left, right].map((kind, index) => <Pressable key={index} style={styles.cardButton} accessibilityRole="button" accessibilityLabel={`Read ${identityCards[kind].name} ID ${index + 1}`} onPress={() => { if (kind === 'charm' && onMeetCharm) onMeetCharm(); else setExpanded(kind); }}>
      <CardArt kind={kind} /><Text style={styles.caption}>{identityCards[kind].name}</Text>
    </Pressable>)}</View>
    <Text style={styles.hint}>Tap an ID to read it.</Text>
    {expanded && <Modal visible transparent animationType="fade" onRequestClose={() => setExpanded(null)}>
      <View style={styles.modalShade}><View accessibilityViewIsModal style={styles.modalCard}><ScrollView contentContainerStyle={styles.modalContent}>
        <Text accessibilityRole="header" style={styles.heading}>{identityCards[expanded].name} ID</Text>
        <CardArt kind={expanded} />
        <PrimaryButton label="Close ID" onPress={() => setExpanded(null)} />
      </ScrollView></View></View>
    </Modal>}
  </View>;
}

function Pair({ source, label }: { source: ImageSourcePropType; label: string }) {
  return <View style={styles.row}>{[0, 1].map(i => <Image key={i} accessibilityLabel={`${label} ${i + 1}`} source={source} resizeMode="contain" style={styles.particle} />)}</View>;
}

export function HoveringCharm() {
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: -9, duration: 1100, useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 1100, useNativeDriver: true }),
    ]));
    loop.start(); return () => { loop.stop(); bob.stopAnimation(); };
  }, [bob]);
  return <Animated.Image accessibilityLabel="A happy charm quark" source={art.happy} resizeMode="contain" style={[styles.hero, { transform: [{ translateY: bob }] }]} />;
}

function CharmSpin({ up }: { up: boolean }) {
  return <View style={styles.spinFrame} accessibilityLabel={`Charm quark: spin ${up ? 'up' : 'down'}`} accessible>
    <Image accessible={false} source={up ? art.up : art.charm} resizeMode="contain" style={styles.fillImage} />
    {!up && <><View style={styles.topStem} /><View style={styles.downStem} /><View style={styles.downHead} /></>}
  </View>;
}

type LabPhase = 'ready' | 'entangling' | 'entangled' | 'measuring' | 'measured';
export function CharmStateLab({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<LabPhase>('ready');
  const phaseRef = useRef<LabPhase>('ready');
  const [leftUp, setLeftUp] = useState(true);
  const alive = useRef(true), notified = useRef(false);
  const travel = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(1)).current;
  useEffect(() => { alive.current = true; return () => { alive.current = false; travel.stopAnimation(); flash.stopAnimation(); }; }, [travel, flash]);
  const change = (next: LabPhase) => { phaseRef.current = next; setPhase(next); };
  const entangle = () => {
    if (phaseRef.current !== 'ready') return;
    change('entangling');
    Animated.timing(travel, { toValue: 1, duration: 1800, useNativeDriver: true }).start(({ finished }) => {
      if (!finished || !alive.current) return;
      change('entangled');
    });
  };
  const measure = () => {
    if (phaseRef.current !== 'entangled') return;
    change('measuring');
    Animated.sequence([
      Animated.timing(flash, { toValue: 0.3, duration: 250, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (!finished || !alive.current) return;
      setLeftUp(sampleBinary(1, 0.5)[0]!); change('measured');
      if (!notified.current) { notified.current = true; onComplete(); }
    });
  };
  const freshPair = () => {
    if (phaseRef.current !== 'measured') return;
    travel.setValue(0); flash.setValue(1); change('ready');
  };
  return <View style={styles.section}>
    <Text style={styles.heading}>Same ID. Different states.</Text>
    <Text style={styles.body}>Let’s borrow the Entangler-2000. It prepares a shared spin state for two charm quarks, without changing their particle type.</Text>
    <Text style={styles.hint}>An idealised spin illustration. Real quarks are confined inside composite particles, not sent freely through this machine.</Text>
    <View style={styles.machineScene}>
      <Animated.View aria-hidden={phase !== 'ready' && phase !== 'entangling'} style={[styles.inputs, { opacity: travel.interpolate({ inputRange: [0, .6, 1], outputRange: [1, 0, 0] }), transform: [{ translateY: travel.interpolate({ inputRange: [0, 1], outputRange: [0, 130] }) }, { scale: travel.interpolate({ inputRange: [0, 1], outputRange: [1, .35] }) }] }]}>
        <Pair source={art.charm} label="Incoming charm" />
      </Animated.View>
      <Image accessibilityLabel="Entangler-2000" source={art.entangler} resizeMode="contain" style={styles.machine} />
      <Animated.View aria-hidden={phase === 'ready' || phase === 'entangling'} style={[styles.outputs, { opacity: travel.interpolate({ inputRange: [0, .65, 1], outputRange: [0, 0, 1] }), transform: [{ translateY: travel.interpolate({ inputRange: [0, 1], outputRange: [-65, 0] }) }] }]}>
        <Animated.View style={[styles.row, { opacity: flash }]}>
          {phase === 'measured' ? <><CharmSpin up={leftUp} /><CharmSpin up={!leftUp} /></> : [0, 1].map(i => <View key={i} style={styles.spinFrame}><Image accessibilityLabel={`Unmeasured charm ${i + 1}`} source={art.charm} resizeMode="contain" style={styles.fillImage} /></View>)}
        </Animated.View>
      </Animated.View>
    </View>
    <Text accessibilityLiveRegion="polite" style={styles.result}>{phase === 'ready' ? 'Two charm quarks, ready to enter.' : phase === 'entangling' ? 'Preparing one shared spin state…' : phase === 'measuring' ? 'Recording both vertical spin outcomes…' : phase === 'entangled' ? 'Entangled, but no definite local up or down yet.' : `Recorded: ${leftUp ? 'up' : 'down'} on the left, ${leftUp ? 'down' : 'up'} on the right.`}</Text>
    {(phase === 'ready' || phase === 'entangling') && <PrimaryButton label="Entangle the charms" disabled={phase !== 'ready'} onPress={entangle} />}
    {(phase === 'entangled' || phase === 'measuring') && <>
      <Text style={styles.body}>Measure both along the same vertical direction. For this chosen shared state, the two results will be opposite. Which side gets up is random.</Text>
      <PrimaryButton label="Measure both spins" disabled={phase !== 'entangled'} onPress={measure} />
    </>}
    {phase === 'measured' && <><Text style={styles.body}>Different recorded spin outcomes. Still two charm quarks, with the same rest mass and charge.</Text><PrimaryButton label="Try a fresh pair" secondary onPress={freshPair} /></>}
  </View>;
}

export function ParticleIdentityLesson({ onComplete }: { onComplete: () => void }) {
  const answered = useRef(new Set<string>());
  const [electronGuess, setElectronGuess] = useState<string | null>(null);
  const [tennisGuess, setTennisGuess] = useState<string | null>(null);
  const [charmMet, setCharmMet] = useState(false);
  return <View style={styles.lesson}>
    <Text accessibilityRole="header" style={styles.title}>Face card never declines</Text>
    <Text style={styles.body}>I have two electrons. Are they identical?</Text><Pair source={art.electron} label="Electron" />
    <View style={styles.choices}>{['Yes, identical', 'No, different'].map(label => <AnswerButton key={label} knowledgeKey="identical-electrons" isCorrectAnswer={label === "Yes, identical"} label={label} state={electronGuess === label ? 'selected' : 'default'} disabled={electronGuess !== null} onPress={() => { if (answered.current.has('electrons')) return false; answered.current.add('electrons'); setElectronGuess(label); }} />)}</View>
    {electronGuess !== null && <>
      <Text style={styles.hint}>Prediction saved. Let’s investigate before we reveal the answer.</Text>
      <Text style={styles.body}>Let’s try some different balls. And no, we won’t use basketballs for the millionth time.</Text>
      <Text style={styles.body}>I have two tennis balls here. Are they exactly identical?</Text><Pair source={art.ball} label="Tennis ball" />
      <View style={styles.choices}>{['Exactly identical', 'Not exactly identical'].map(label => <AnswerButton key={label} knowledgeKey="tennis-identity" isCorrectAnswer={label === "Not exactly identical"} label={label} state={tennisGuess === null ? 'default' : label === 'Not exactly identical' ? 'correct' : tennisGuess === label ? 'incorrect' : 'default'} disabled={tennisGuess !== null} onPress={() => { if (answered.current.has('tennis')) return false; answered.current.add('tennis'); setTennisGuess(label); }} />)}</View>
    </>}
    {tennisGuess !== null && <>
      <Text accessibilityLiveRegion="polite" style={styles.result}>Not exactly identical!</Text>
      <Text style={styles.body}>They might look alike, but tiny differences in their materials and wear tell them apart. One might have met a tennis player. The other… a dog.</Text>
      <View style={styles.row}><Image accessibilityLabel="A tennis player holding a ball" source={art.player} resizeMode="contain" style={styles.storyFigure} /><Image accessibilityLabel="A dog with a tennis ball in its mouth" source={art.dog} resizeMode="contain" style={[styles.storyFigure, { height: 140, width: '34%' }]} /></View>
      <Text style={styles.body}>It’s like how you’ve never met anyone exactly like you. Alex and Barb each have their own details.</Text>
      <IdentityCardPair left="alex" right="barb" />
      <Text style={styles.heading}>Now check those electrons’ IDs.</Text>
      <IdentityCardPair left="electron" right="electron" />
      <Text style={styles.result}>Same rest mass. Same electric charge. Every electron.</Text>
      <Text style={styles.body}>So the answer to our first question is yes: they are identical particles. They have no individual serial number hidden inside them.</Text>
      <TerminologyCard term="Identical particles" definition="Particles of the same species share intrinsic properties, such as rest mass and electric charge. They can still have different quantum states." />
      <Text style={styles.body}>Each species has its own ID. An electron’s charge is always −e. Charge is <Text style={styles.bold}>quantised</Text>: it comes in fixed units, not just any value.</Text>
      <Text style={styles.body}>But an electron is not identical to a photon. Compare their cards.</Text>
      <IdentityCardPair left="electron" right="photon" />
      <Text style={styles.body}>And here are two different kinds of quark…</Text>
      <IdentityCardPair left="strange" right="charm" onMeetCharm={charmMet ? undefined : () => setCharmMet(true)} />
      {!charmMet && <Pressable accessibilityRole="button" accessibilityLabel="Meet the charm quark" onPress={() => setCharmMet(true)} style={styles.meet}>
        <Text style={styles.heading}>Wait… who’s this?</Text><Text accessible={false} style={styles.curvedArrow}>⤴</Text>
        <Text style={styles.hint}>Tap to meet our new friend.</Text>
      </Pressable>}
    </>}
    {charmMet && <>
      <Text style={styles.body}>Let’s introduce you to a new friend, the</Text><Text style={styles.charmTitle}>charm quark</Text><HoveringCharm />
      <Text style={styles.body}>Charm belongs to the quark family, just like Strange. They are different species, but both belong to the second generation of matter particles.</Text>
      <Image accessibilityLabel="Charm and Strange together" source={art.together} resizeMode="contain" style={styles.friends} />
      <Text style={styles.body}>Sorry, we got distracted by that particle’s charm there.</Text>
      <Text style={styles.body}>Anyway, same kind means the same intrinsic properties. But particles can have different positions, momenta or spin states, even without being entangled.</Text>

    </>}
    {charmMet && <>
      <Text style={styles.result}>A different state does not change a particle’s ID.</Text>
      <PrimaryButton label="Start the quiz" onPress={onComplete} />
    </>}
  </View>;
}

const styles = StyleSheet.create({
  lesson: { gap: 18 }, title: { fontFamily: fonts.display, fontSize: 36, lineHeight: 42, color: colors.ink, textAlign: 'center', marginVertical: 14 },
  body: { fontFamily: fonts.body, fontSize: 23, lineHeight: 31, color: colors.ink }, bold: { fontWeight: 'bold' },
  heading: { fontFamily: fonts.display, fontSize: 27, lineHeight: 33, color: colors.ink, textAlign: 'center', marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%', gap: 12 },
  particle: { width: '42%', height: 132 }, storyFigure: { width: '45%', height: 210 },
  choices: { gap: 10 }, hint: { fontFamily: fonts.body, fontSize: 18, lineHeight: 24, color: colors.muted, textAlign: 'center' },
  caption: { fontFamily: fonts.display, fontSize: 21, color: colors.ink, textAlign: 'center' },
  result: { fontFamily: fonts.body, fontSize: 23, lineHeight: 30, textAlign: 'center', color: '#92306E', backgroundColor: '#FBEAF4', borderRadius: 14, padding: 16 },
  cardPair: { gap: 10 }, cardButton: { flex: 1, minHeight: 90 }, cardArt: { width: '100%', aspectRatio: 615 / 450 },
  fillImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  minusSign: { position: 'absolute', backgroundColor: '#B65E43', left: '23.6%', top: '68.7%', width: '1.35%', height: '0.65%', transform: [{ rotate: '-3deg' }] },
  modalShade: { flex: 1, backgroundColor: '#30233AB8', padding: 18, justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '100%', maxWidth: 560, maxHeight: '88%', borderRadius: 22, backgroundColor: colors.background, borderWidth: 2, borderColor: colors.ink },
  modalContent: { padding: 18, gap: 20 }, meet: { minHeight: 100, paddingVertical: 10, paddingRight: 30 },
  curvedArrow: { position: 'absolute', right: 18, top: -14, fontSize: 64, color: '#92306E', transform: [{ rotate: '-15deg' }] },
  charmTitle: { fontFamily: fonts.display, fontSize: 43, lineHeight: 54, color: '#C137A2', textAlign: 'center', textShadowColor: '#F4A9E9', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 },
  hero: { width: 220, height: 255, alignSelf: 'center', marginVertical: -15 }, friends: { width: '100%', height: 185 },
  section: { gap: 16 }, machineScene: { height: 440, width: '100%' }, machine: { position: 'absolute', top: 100, width: '80%', height: 170, alignSelf: 'center' },
  inputs: { position: 'absolute', top: -20, width: '90%', alignSelf: 'center' }, outputs: { position: 'absolute', top: 255, width: '100%' },
  spinFrame: { width: '42%', maxWidth: 140, aspectRatio: 485 / 590 },
  topStem: { position: 'absolute', left: '49.5%', top: '14%', width: '2.7%', height: '4%', backgroundColor: '#77257E', borderRadius: 3 },
  downStem: { position: 'absolute', left: '49.5%', top: '87%', width: '2.7%', height: '8%', backgroundColor: '#77257E', borderRadius: 3 },
  downHead: { position: 'absolute', left: '40%', top: '84%', width: '22%', aspectRatio: 1, borderRightWidth: 5, borderBottomWidth: 5, borderColor: '#77257E', transform: [{ rotate: '45deg' }] },
});
