import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, ImageSourcePropType, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';

type FamilyMember = { id: string; label: string; source: ImageSourcePropType };
export const fermions: FamilyMember[] = [
  { id: 'electron', label: 'Electron', source: require('../assets/particles/electron-content.png') },
  { id: 'charm', label: 'Charm quark', source: require('../assets/module-4/lesson-2/charm_default.png') },
  { id: 'strange', label: 'Strange quark', source: require('../assets/module-3/lesson-1/strange-default-transparent.png') },
  { id: 'muon', label: '?', source: require('../assets/module-4/lesson-3/Muon_default.png') },
  { id: 'tau', label: '?', source: require('../assets/module-4/lesson-3/Tau_default.png') },
  { id: 'tau-neutrino', label: '?', source: require('../assets/module-4/lesson-3/tau_neutrino_default.png') },
  // Provisional art mapping: two supplied files are named tau-neutrino.
  { id: 'muon-neutrino', label: '?', source: require('../assets/module-4/lesson-3/tau_neutrino_default 1.png') },
  { id: 'electron-neutrino', label: '?', source: require('../assets/module-4/lesson-3/electron_neutrino_default.png') },
  { id: 'up', label: '?', source: require('../assets/module-4/lesson-3/up_default.png') },
  { id: 'down', label: '?', source: require('../assets/module-4/lesson-3/down_default.png') },
  { id: 'top', label: '?', source: require('../assets/module-4/lesson-3/top_default_.png') },
  { id: 'bottom', label: '?', source: require('../assets/module-4/lesson-3/bottom_default.png') },
];
export const bosons: FamilyMember[] = [
  { id: 'photon', label: 'Photon', source: require('../assets/lesson-9/photon-default-transparent.png') },
  { id: 'higgs', label: '?', source: require('../assets/module-4/lesson-3/higgs_default.png') },
  { id: 'w', label: '?', source: require('../assets/module-4/lesson-3/W_default.png') },
  { id: 'z', label: '?', source: require('../assets/module-4/lesson-3/Z_default.png') },
  { id: 'gluon', label: '?', source: require('../assets/module-4/lesson-3/gluon_default.png') },
];

export function ScratchParticle({ member, index, family, onReveal, onScrollLock }: {
  member: FamilyMember; index: number; family: 'fermion' | 'boson'; onReveal: () => void; onScrollLock: (locked: boolean) => void;
}) {
  const [cleared, setCleared] = useState<number[]>([]);
  const cells = useRef(new Set<number>()), done = useRef(false), size = useRef({ width: 100, height: 112 });
  const previous = useRef<{ x: number; y: number } | null>(null);
  const callbacks = useRef({ onReveal, onScrollLock }); callbacks.current = { onReveal, onScrollLock };
  useEffect(() => () => callbacks.current.onScrollLock(false), []);
  const reveal = () => {
    if (done.current) return;
    done.current = true; setCleared(Array.from({ length: 36 }, (_, i) => i)); callbacks.current.onReveal();
  };
  const scratch = (x: number, y: number) => {
    if (done.current) return;
    const from = previous.current ?? { x, y };
    const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / 5));
    for (let s = 0; s <= steps; s++) {
      const cx = (from.x + (x - from.x) * s / steps) / size.current.width * 6;
      const cy = (from.y + (y - from.y) * s / steps) / size.current.height * 6;
      for (let cell = 0; cell < 36; cell++) if (Math.hypot(cell % 6 + .5 - cx, Math.floor(cell / 6) + .5 - cy) < 1.45) cells.current.add(cell);
    }
    previous.current = { x, y };
    if (cells.current.size >= 14) reveal(); else setCleared([...cells.current]);
  };
  const release = () => { previous.current = null; callbacks.current.onScrollLock(false); };
  const pan = PanResponder.create({
    onStartShouldSetPanResponder: () => !done.current,
    onMoveShouldSetPanResponder: () => !done.current,
    onPanResponderGrant: e => { previous.current = null; callbacks.current.onScrollLock(true); scratch(e.nativeEvent.locationX, e.nativeEvent.locationY); },
    onPanResponderMove: e => scratch(e.nativeEvent.locationX, e.nativeEvent.locationY),
    onPanResponderRelease: release, onPanResponderTerminate: release,
    onPanResponderTerminationRequest: () => false,
  });
  return <View style={styles.tile}>
    <View testID={`scratch-${member.id}`} onLayout={e => { size.current = e.nativeEvent.layout; }} {...pan.panHandlers} style={[styles.scratch, { borderColor: family === 'fermion' ? '#80ADD2' : '#DEA35D' }]}>
      <Image accessible={false} source={member.source} resizeMode="contain" style={styles.tileImage} />
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {Array.from({ length: 36 }, (_, i) => cleared.includes(i) ? null : <View key={i} style={[styles.scratchCell, { left: `${i % 6 * 100 / 6}%`, top: `${Math.floor(i / 6) * 100 / 6}%`, backgroundColor: family === 'fermion' ? '#B5D5E9' : '#F2C58E' }]} />)}
        {!cleared.length && <Text style={styles.scratchPrompt}>Scratch{`\n`}here</Text>}
      </View>
    </View>
    <Text style={styles.name}>{member.label}</Text>
    {!done.current ? <Pressable accessibilityRole="button" accessibilityLabel={`Reveal ${family} ${index + 1}`} onPress={reveal} style={styles.tapReveal}><Text style={styles.tapText}>or tap</Text></Pressable> : <Text accessibilityLabel={`${family} ${index + 1} uncovered`} style={styles.uncovered}>✓</Text>}
  </View>;
}

export function FamilyGrid({ family, onComplete, onScrollLock }: { family: 'fermion' | 'boson'; onComplete: () => void; onScrollLock: (locked: boolean) => void }) {
  const members = family === 'fermion' ? fermions : bosons;
  const [revealed, setRevealed] = useState<string[]>([]);
  const seen = useRef(new Set<string>());
  return <View style={styles.section}>
    <View style={styles.grid}>{members.map((member, index) => <ScratchParticle key={member.id} member={member} index={index} family={family} onScrollLock={onScrollLock} onReveal={() => {
      if (seen.current.has(member.id)) return;
      seen.current.add(member.id); setRevealed([...seen.current]);
      if (seen.current.size === members.length) onComplete();
    }} />)}</View>
    <Text accessibilityLiveRegion="polite" style={styles.hint}>{revealed.length} of {members.length} uncovered</Text>
  </View>;
}

export function QuantumChairs({ family, onComplete, withoutPauli = false }: { family: 'fermion' | 'boson'; onComplete: () => void; withoutPauli?: boolean }) {
  const [phase, setPhase] = useState<'ready' | 'running' | 'done'>('ready');
  const phaseRef = useRef(phase), alive = useRef(true), notified = useRef(false);
  const travel = useRef(new Animated.Value(0)).current;
  useEffect(() => { alive.current = true; return () => { alive.current = false; travel.stopAnimation(); }; }, [travel]);
  const isFermion = family === 'fermion', count = isFermion ? 2 : 8;
  const play = () => {
    if (phaseRef.current === 'running') return;
    travel.setValue(0); phaseRef.current = 'running'; setPhase('running');
    Animated.timing(travel, { toValue: 1, duration: isFermion ? 1600 : 1900, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
      if (!alive.current || !finished) return;
      phaseRef.current = 'done'; setPhase('done');
      if (!notified.current) { notified.current = true; onComplete(); }
    });
  };
  return <View style={styles.section}>
    <View style={styles.chairScene}>
      <Image accessible={false} source={require('../assets/module-4/lesson-4/chair.png')} resizeMode="contain" style={styles.chair} />
      {Array.from({ length: count }, (_, i) => {
        const side = i < count / 2 ? -1 : 1;
        const start = side * (85 + i % (count / 2) * 5);
        const rejected = isFermion && !withoutPauli && i === 1;
        return <Animated.Image key={i} accessible={false} source={withoutPauli ? fermions[0]!.source : isFermion ? require('../assets/module-3/lesson-5-bell/electron-angry-transparent.png') : bosons[0]!.source} resizeMode="contain" style={[styles.actor, {
          transform: [
            { translateX: travel.interpolate({ inputRange: [0, .15 + i * .025, .55 + i * .025, .8, 1], outputRange: [start, start, 0, rejected ? 84 : 0, rejected ? 90 : 0] }) },
            { translateY: travel.interpolate({ inputRange: [0, .2, .4, .7, 1], outputRange: [isFermion ? 35 : (i % 4 - 1.5) * 42, 35, -45, 0, rejected ? 73 : 0] }) },
            { rotate: travel.interpolate({ inputRange: [0, .6, 1], outputRange: ['0deg', '0deg', rejected ? '25deg' : '0deg'] }) },
          ],
        }]} />;
      })}
      <Text accessibilityLiveRegion="polite" style={styles.occupancy}>{phase === 'done' ? (withoutPauli ? '2 electrons, one shared state' : isFermion ? '1 electron in this state' : '8 photons, one shared state') : ''}</Text>
    </View>
    <PrimaryButton label={phase === 'running' ? 'Taking a seat…' : phase === 'done' ? 'Replay the chairs' : withoutPauli ? 'Give it a try' : isFermion ? 'Seat the electrons' : 'Seat the photons'} disabled={phase === 'running'} onPress={play} />
    {phase === 'done' && <Text style={styles.result}>{withoutPauli ? 'In this imagined world, both could share the same complete state.' : isFermion ? 'No sharing this exact state! The second electron needs a different state.' : 'All eight can share this state. They are still eight photons, not one fused particle. Even 100 photons could share a state!'}</Text>}
  </View>;
}

export function ParticleFamiliesLesson({ onComplete, onScrollLock }: { onComplete: () => void; onScrollLock: (locked: boolean) => void }) {
  const [fermionsDone, setFermionsDone] = useState(false), [bosonsDone, setBosonsDone] = useState(false);
  const [electronSeated, setElectronSeated] = useState(false), [photonsSeated, setPhotonsSeated] = useState(false);
  return <View style={styles.section}>
    <Text accessibilityRole="header" style={styles.title}>Two households, both unlike in dignity</Text>
    <Text style={styles.body}>Among the elementary particles, there are two main families.</Text>
    <Text style={styles.body}>Firstly, we have <Text style={styles.fermionWord}>fermions</Text>.</Text>
    <Text style={styles.body}>You haven’t met some of them, so I’ll just show you what they look like for now. You can meet more as you learn.</Text>
    <Text style={styles.hint}>Scratch each little panel to uncover its particle. The unfamiliar names stay a mystery for now.</Text>
    <FamilyGrid family="fermion" onComplete={() => setFermionsDone(true)} onScrollLock={onScrollLock} />
    {fermionsDone && <>
      <Text style={styles.body}>Then we have <Text style={styles.bosonWord}>bosons</Text>… a slightly smaller family.</Text>
      <FamilyGrid family="boson" onComplete={() => setBosonsDone(true)} onScrollLock={onScrollLock} />
    </>}
    {bosonsDone && <>
      <Text accessibilityRole="header" style={styles.heading}>What are the differences between these families?</Text>
      <Text style={[styles.heading, styles.underlined, styles.fermionWord]}>Fermions</Text>
      <Text style={styles.body}>“Ferm” sounds like “firm”, like something solid. Fermions are the building blocks of matter.</Text>
      <Image accessibilityLabel="A cartoon pyramid of six strange quarks" source={require('../assets/module-4/lesson-3/strange_pyramid.png')} resizeMode="contain" style={styles.diagram} />
      <Text style={styles.body}>Everyday atoms are built from electrons and nuclei containing up and down quarks.</Text>
      <Text style={styles.body}>But they have to follow a certain rule:</Text>
      <Text style={[styles.body, { color: '#BF3939' }]}>No two identical fermions can occupy the same complete quantum state at the same time.</Text>
      <Text style={styles.body}>If two electrons played musical chairs, they couldn’t both take this same quantum seat. Let’s try it.</Text>
      <QuantumChairs family="fermion" onComplete={() => setElectronSeated(true)} />
    </>}
    {electronSeated && <>
      <TerminologyCard term="Pauli exclusion principle" definition="Two identical fermions cannot share the same complete quantum state, including spin." />
      <Text style={styles.body}>Two electrons can share an orbital if their spins differ. Those are different complete states, so the rule is still obeyed.</Text>
      <Text style={[styles.heading, styles.underlined, styles.bosonWord]}>Bosons</Text>
      <Text style={styles.body}>The force-carrying particles are bosons.</Text>
      <Text style={styles.body}>For example, photons carry the electromagnetic interaction, which helps hold atoms and molecules together.</Text>
      <Image accessibilityLabel="A playful bottle labelled photon glue" source={require('../assets/module-4/lesson-3/photon_glue.png')} resizeMode="contain" style={styles.glue} />
      <Text style={styles.body}>You could see bosons as acting like a glue that holds some fermions together.</Text>
      <Text style={styles.body}>Bosons <Text style={styles.underlined}>don’t</Text> follow the Pauli exclusion principle. They can occupy the same quantum state.</Text>
      <Text style={styles.body}>In our musical chairs, photons can all jump onto the same quantum seat. Here come four from each side!</Text>
      <QuantumChairs family="boson" onComplete={() => setPhotonsSeated(true)} />
    </>}
    {photonsSeated && <>
      <Text style={styles.body}>These different sharing rules have huge consequences.</Text>
      <PrimaryButton label="Start the quiz" onPress={onComplete} />
    </>}
  </View>;
}

const styles = StyleSheet.create({
  section: { gap: 18 }, title: { fontFamily: fonts.display, fontSize: 35, lineHeight: 42, color: colors.ink, textAlign: 'center', marginVertical: 14 },
  body: { fontFamily: fonts.body, fontSize: 23, lineHeight: 31, color: colors.ink },
  heading: { fontFamily: fonts.display, fontSize: 29, lineHeight: 36, color: colors.ink, textAlign: 'center', marginTop: 16 },
  underlined: { textDecorationLine: 'underline' }, fermionWord: { color: '#266AA5', fontWeight: 'bold' },
  bosonWord: { color: '#AC5208', fontWeight: 'bold', textShadowColor: '#FFC578', textShadowRadius: 10, textShadowOffset: { width: 0, height: 0 } },
  hint: { fontFamily: fonts.body, fontSize: 18, lineHeight: 24, color: colors.muted, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 18 },
  tile: { width: '31%', alignItems: 'center' }, scratch: { height: 112, width: '100%', borderWidth: 2, borderRadius: 13, overflow: 'hidden', backgroundColor: '#FFFDF4' },
  tileImage: { position: 'absolute', left: '5%', top: '5%', width: '90%', height: '90%' },
  scratchCell: { position: 'absolute', width: '17%', height: '17.1%', borderWidth: .4, borderColor: '#FFFFFF22' },
  scratchPrompt: { fontFamily: fonts.display, fontSize: 20, lineHeight: 25, color: '#385770', textAlign: 'center', marginTop: 27, transform: [{ rotate: '-8deg' }] },
  name: { fontFamily: fonts.body, fontSize: 18, lineHeight: 22, color: colors.ink, textAlign: 'center', minHeight: 44, paddingTop: 6 },
  tapReveal: { minHeight: 44, width: '100%', justifyContent: 'center', alignItems: 'center' }, tapText: { fontFamily: fonts.body, fontSize: 17, color: '#62605C', textDecorationLine: 'underline' },
  uncovered: { minHeight: 44, fontFamily: fonts.body, fontSize: 25, color: '#36773D', textAlign: 'center', paddingTop: 6 },
  diagram: { width: '100%', height: 285 }, glue: { width: '100%', height: 255 },
  chairScene: { height: 330, width: '100%' }, chair: { position: 'absolute', top: 80, left: '50%', marginLeft: -81, width: 162, height: 220 },
  actor: { position: 'absolute', left: '50%', marginLeft: -32, top: 130, width: 64, height: 64 },
  occupancy: { position: 'absolute', bottom: 0, width: '100%', fontFamily: fonts.display, color: colors.ink, fontSize: 23, textAlign: 'center' },
  result: { backgroundColor: '#F4ECDC', borderRadius: 13, padding: 15, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, color: colors.ink },
});
