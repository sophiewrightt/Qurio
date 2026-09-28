import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, PanResponder, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { AnswerButton } from './AnswerButton';
import { PrimaryButton } from './PrimaryButton';
import { MysteryPanel } from './MysteryPanel';
import { TerminologyCard } from './TerminologyCard';
import { tunnellingProbability } from '../data/moduleFour';
import { colors, fonts } from '../constants/theme';

const electron = require('../assets/particles/electron-content.png');
const basketball = require('../assets/lesson-1/basketball.png');
const photon = require('../assets/particles/photon.png');
const sun = require('../assets/module-4/lesson-1/sun.png');
const hydrogen = require('../assets/module-4/lesson-1/hydrogen.png');
const helium = require('../assets/module-4/lesson-1/helium.png');
const repelling = require('../assets/module-4/lesson-1/repelling.png');
const rainbow = ['#C43C56', '#B85B22', '#997100', '#33844D', '#2875AF', '#8252B5'];

export function ClassicalBarrier({ particle, onComplete }: { particle: 'basketball' | 'electron'; onComplete: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const busyRef = useRef(false), alive = useRef(true), complete = useRef(false);
  const [busy, setBusy] = useState(false), [done, setDone] = useState(false), [width, setWidth] = useState(300);
  useEffect(() => { alive.current = true; return () => { alive.current = false; animation.current?.stop(); }; }, []);
  const shoot = () => {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); progress.setValue(0);
    animation.current = Animated.sequence([
      Animated.timing(progress, { toValue: 1, duration: 650, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(progress, { toValue: 0, duration: 700, easing: Easing.linear, useNativeDriver: true }),
    ]);
    animation.current.start(({ finished }) => {
      if (!alive.current || !finished) return;
      busyRef.current = false; setBusy(false); setDone(true);
      if (!complete.current) { complete.current = true; onComplete(); }
    });
  };
  return <View>
    <View style={s.classicalScene} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      <View style={[s.wall, { left: '67%', top: 30, bottom: 20, width: 28 }, particle === 'electron' && s.electricWall]}>
        <Text style={s.wallMarks}>{particle === 'electron' ? 'ϟ\nϟ\nϟ' : '─\n─\n─'}</Text>
      </View>
      <Animated.Image accessibilityLabel={particle} source={particle === 'electron' ? electron : basketball} resizeMode="contain" style={[s.projectile, { transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, width * .67 - 68] }) }, { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', particle === 'basketball' ? '260deg' : '0deg'] }) }] }]} />
      <View style={s.ground} />
    </View>
    <PrimaryButton label={done ? 'Replay the bounce' : `Shoot ${particle === 'electron' ? 'an electron' : 'the basketball'}`} disabled={busy} onPress={shoot} secondary={done} />
    {done && <Text style={s.caption}>{particle === 'electron' ? 'The classical prediction: not enough energy to cross.' : 'Boing! The wall sends our basketball back.'}</Text>}
  </View>;
}

// A qualitative wavefunction sketch, not a time-dependent Schrödinger solver.
// Reveal speed is a teaching device; it must not be read as a tunnelling time.
export function BarrierLab({ onComplete }: { onComplete: () => void }) {
  const reveal = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const alive = useRef(true), busyRef = useRef(false);
  const [width, setWidth] = useState(300), [busy, setBusy] = useState(false), [shown, setShown] = useState(false);
  const [thick, setThick] = useState(false), [high, setHigh] = useState(false);
  const [seenThick, setSeenThick] = useState(false), [seenHigh, setSeenHigh] = useState(false);
  const completed = useRef(false);
  useEffect(() => { alive.current = true; return () => { alive.current = false; animation.current?.stop(); }; }, []);
  const probability = tunnellingProbability(thick, high);
  const left = width * .43, right = width * (thick ? .7 : .55), amplitude = Math.sqrt(probability);
  const points = Array.from({ length: 101 }, (_, i) => {
    const x = i * width / 100;
    const envelope = x < left ? 1 : x > right ? amplitude : Math.exp(Math.log(amplitude) * (x-left)/(right-left));
    const oscillation = x < left ? Math.cos((x-left) / 12) : x > right ? Math.cos((x-right) / 12) : 1;
    return { x, y: 122 - 35 * envelope * oscillation };
  });
  const shoot = () => {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(true); reveal.setValue(0);
    animation.current = Animated.sequence([
      Animated.timing(reveal, { toValue: .43, duration: 900, easing: Easing.linear, useNativeDriver: false }),
      Animated.timing(reveal, { toValue: .55, duration: 1800, easing: Easing.linear, useNativeDriver: false }),
      Animated.timing(reveal, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: false }),
    ]);
    animation.current.start(({ finished }) => { if (!alive.current || !finished) return; busyRef.current = false; setBusy(false); setShown(true); });
  };
  const changeBarrier = (kind: 'thick' | 'high', value: boolean) => {
    if (!shown || busyRef.current) return;
    if (kind === 'thick') { setThick(value); if (value) setSeenThick(true); }
    else { setHigh(value); if (value) setSeenHigh(true); }
  };
  useEffect(() => {
    if (seenThick && seenHigh && !completed.current) { completed.current = true; onComplete(); }
  }, [seenThick, seenHigh, onComplete]);
  const diagram = <View style={s.waveScene} onLayout={e => setWidth(e.nativeEvent.layout.width)} accessibilityLabel={`Wavefunction sketch: ${thick ? 'thicker' : 'thin'}, ${high ? 'higher' : 'lower'} energy barrier`}>
      <Text style={s.diagramTitle}>ELECTRIC ENERGY BARRIER</Text>
      <View style={[s.energyBarrier, { left, width: right-left, top: high ? 42 : 70 }]} />
      <View style={s.energyLine} /><Text style={s.energyLabel}>Electron energy</Text>
      <View style={s.waveAxis} />
      <Animated.View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, height: 190, overflow: 'hidden', width: reveal.interpolate({ inputRange: [0, 1], outputRange: [0, width] }) }}>
        {points.slice(1).map((point, i) => {
          const prev = points[i]!, dx = point.x-prev.x, dy = point.y-prev.y;
          return <View key={i} style={{ position: 'absolute', backgroundColor: '#7654B2', height: 3, borderRadius: 2, width: Math.hypot(dx,dy)+1, left: (point.x+prev.x)/2-Math.hypot(dx,dy)/2, top: (point.y+prev.y)/2-1.5, transform: [{ rotate: `${Math.atan2(dy,dx)}rad` }] }} />;
        })}
      </Animated.View>
      <Text style={[s.region, { left: 0 }]}>Incoming →</Text><Text style={[s.region, { right: 0 }]}>→ Transmitted</Text>
    </View>;
  return <View>
    <Text style={s.p}>Firstly, electrons have wave behaviour, as we know. So let’s track the wavefunction and try this again.</Text>
    <Text style={s.p}>The wavefunction helps us calculate where the electron might be detected. It is not a trail showing where a tiny ball has been.</Text>
    {diagram}
    {!shown && <PrimaryButton label="Shoot an electron wave" disabled={busy} onPress={shoot} />}
    {busy && <Text style={s.caption}>Slowed illustration, not a tunnelling clock.</Text>}
    {shown && <View>
      <Text style={s.what}>WHAT?</Text>
      <MysteryPanel number={1} title="Through a barrier?" body="How can an electron turn up beyond a barrier it cannot cross classically?" />
      <Text style={s.p}>Let’s see what happens when we change the barrier. Keep the electron’s energy the same.</Text>
      <View style={s.controls}>
        {diagram}
        <View style={s.switchRow}><Text style={s.switchLabel}>Thicker barrier</Text><Switch accessibilityLabel="Thicker barrier" value={thick} onValueChange={v => changeBarrier('thick', v)} trackColor={{ true: '#D980B8' }} /></View>
        <View style={s.switchRow}><Text style={s.switchLabel}>Higher energy barrier</Text><Switch accessibilityLabel="Higher energy barrier" value={high} onValueChange={v => changeBarrier('high', v)} trackColor={{ true: '#D980B8' }} /></View>
        <Text accessibilityLiveRegion="polite" style={s.caption}>{thick || high ? 'Much less of the wave reaches the other side.' : 'A small transmitted wave remains.'}</Text>
        <Text style={s.small}>Try both switches. Watch the purple wave change.</Text>
      </View>
      {(seenThick || seenHigh) && <Text style={s.p}>The wavefunction falls away inside the barrier. A wider barrier gives it farther to fall. A higher barrier makes it fall more steeply. Both make tunnelling less likely.</Text>}
      {seenThick && seenHigh && <View>
        <Text style={s.p}>“Higher” means more potential energy, not a taller wall to jump over. The electron does not borrow energy or lose it getting through this static barrier.</Text>
        <TerminologyCard term="Quantum tunnelling" definition="A particle can be detected beyond an energy barrier that it could not cross according to classical physics." />
        <Text style={s.heading}>One whole electron</Text>
        <Text style={s.p}>With a thin enough barrier, part of the wavefunction reaches the far side. A measurement can then record the whole electron there.</Text>
        <View style={s.material} accessibilityLabel="One possible transmitted detection beyond a thin material layer">
          <View style={s.materialRow}><Image accessibilityLabel="Incoming electron" source={electron} resizeMode="contain" style={s.atom} /><Text style={s.direction}>→</Text><View style={s.materialLayer} /><Text style={s.direction}>→</Text><Image source={electron} resizeMode="contain" style={s.atom} /></View>
        </View>
        <Text style={s.p}>BUT… just because an electron has a chance of going through, doesn’t mean it always goes through. It can also be seen to reflect off.</Text>
      </View>}
    </View>}
  </View>;
}

export function SolarFusion({ onComplete, onScrollLockChange }: { onComplete: () => void; onScrollLockChange?: (locked: boolean) => void }) {
  const [stage, setStage] = useState<'ready' | 'repelled' | 'chain' | 'done'>('ready');
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false), alive = useRef(true), stageRef = useRef(stage);
  const approach = useRef(new Animated.Value(0)).current;
  const light = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  useEffect(() => { alive.current = true; return () => { alive.current = false; animation.current?.stop(); light.stopAnimation(); onScrollLockChange?.(false); }; }, []);
  const moveStage = (value: typeof stage) => { stageRef.current = value; setStage(value); };
  const collide = () => {
    if (busyRef.current || stageRef.current === 'done' || stageRef.current === 'chain') return;
    const first = stageRef.current === 'ready';
    busyRef.current = true; setBusy(true); approach.setValue(0);
    animation.current = Animated.sequence([
      Animated.timing(approach, { toValue: 1, duration: 750, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(approach, { toValue: first ? 0 : 1, duration: 650, useNativeDriver: true }),
    ]);
    animation.current.start(({ finished }) => {
      if (!alive.current || !finished) return;
      if (first) { busyRef.current = false; setBusy(false); moveStage('repelled'); return; }
      moveStage('chain');
      animation.current = Animated.timing(light, { toValue: 1, duration: 2200, useNativeDriver: true });
      animation.current.start(({ finished: complete }) => {
        if (!alive.current || !complete) return;
        moveStage('done'); setBusy(false); busyRef.current = false; onComplete();

      });
    });
  };
  const gestures = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => !busyRef.current && stageRef.current !== 'done' && Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy)*1.4,
    onPanResponderGrant: () => onScrollLockChange?.(true),
    onPanResponderRelease: (_, g) => { onScrollLockChange?.(false); if (Math.abs(g.dx) > 32) collide(); },
    onPanResponderTerminate: () => onScrollLockChange?.(false),
  });
  return <View>
    <View style={s.bubble}><Text style={s.bubbleText}>We probably wouldn’t be alive right now if it weren’t for quantum tunnelling.</Text></View>
    <Image accessibilityLabel="Sun wearing sunglasses" source={sun} resizeMode="contain" style={s.sun} />
    <Text style={s.p}>The Sun is a life source of energy for us. It is a huge ball of hot plasma, mostly hydrogen and helium, with electrons separated from their nuclei.</Text>
    <Text style={s.p}>Deep inside, hydrogen nuclei race around and collide. A hydrogen nucleus here is one positively charged proton.</Text>
    {stage !== 'ready' && <View>
      <Text style={s.heading}>Hang on…</Text>
      <Image accessibilityLabel="Like charges repel" source={repelling} resizeMode="contain" style={s.repelling} />
      <Text style={s.p}>Like charges repel! These positive nuclei push each other away. So how does fusion happen?</Text>
      <Text style={s.p}>The Sun’s core is VERY hot, but the colliding protons usually still lack the energy to cross the electric barrier classically. Tunnelling gives them a tiny chance to get close enough to start fusing.</Text>
      <Text style={s.small}>The second swipe shows one successful example, not a promise that every collision works.</Text>
    </View>}
    {stage !== 'ready' && <Text style={s.p}>Overall, four hydrogen nuclei become one helium nucleus through a chain of reactions. Let’s watch the overall change.</Text>}
    <Text style={s.heading}>{stage === 'ready' ? 'Bring two protons together' : stage === 'repelled' ? 'Now include tunnelling' : stage === 'chain' ? 'Fusion begins…' : 'Hello, helium!'}</Text>
    <View {...gestures.panHandlers} style={s.fusionScene} accessibilityLabel="Swipe horizontally to bring the hydrogen nuclei together">
      {stage !== 'done' && <Animated.View style={[StyleSheet.absoluteFill, { opacity: light.interpolate({ inputRange: [0, .45, 1], outputRange: [1, 0, 0] }) }]}>
        {Array.from({ length: stage === 'ready' ? 2 : 4 }, (_, i) => <Animated.Image key={i} accessibilityLabel="Hydrogen nucleus" source={hydrogen} resizeMode="contain" style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -30, marginTop: -30, width: 60, height: 60, transform: [
          { translateX: approach.interpolate({ inputRange: [0, 1], outputRange: [i % 2 ? 76 : -76, stage === 'ready' ? (i % 2 ? 34 : -34) : 0] }) },
          { translateY: approach.interpolate({ inputRange: [0, 1], outputRange: [stage === 'ready' ? 0 : (i < 2 ? -34 : 34), 0] }) },
        ] }} />)}
      </Animated.View>}
      {(stage === 'chain' || stage === 'done') && <Animated.View style={[s.heliumScene, { opacity: light.interpolate({ inputRange: [0, .45, 1], outputRange: [0, 1, 1] }) }]}>
        <Image accessibilityLabel="Helium nucleus" source={helium} resizeMode="contain" style={s.helium} />
        <Text style={s.radiation}>∿ ∿</Text>
        <Animated.Image accessibilityLabel="Energy released as a photon" source={photon} resizeMode="contain" style={[s.photon, { opacity: light.interpolate({ inputRange: [0, .8, 1], outputRange: [1, 1, 0] }), transform: [{ translateX: light.interpolate({ inputRange: [0, 1], outputRange: [0, 105] }) }, { translateY: light.interpolate({ inputRange: [0, 1], outputRange: [0, -70] }) }] }]} />
        <Text style={s.energyReleased}>Energy released!</Text>
      </Animated.View>}
    </View>
    {(stage === 'ready' || stage === 'repelled') && <Pressable accessibilityRole="button" accessibilityLabel={stage === 'ready' ? 'Bring protons together' : 'Show a tunnelling-assisted fusion example'} disabled={busy} onPress={collide} style={s.swipePrompt}><Text style={s.swipeText}>{busy ? 'Watch the nuclei…' : stage === 'ready' ? 'Swipe inward → (or tap here)' : 'Swipe again → (or tap here)'}</Text></Pressable>}
    {stage === 'done' && <View>
      <Text style={s.p}>Four hydrogen nuclei have become one helium nucleus overall. Other particles are released too.</Text>
      <Text style={s.p}>The products have a little less total mass. That difference is released as energy, helping keep the Sun hot and shining.</Text>
    </View>}
  </View>;
}

export function TunnellingLesson({ onComplete, onScrollLockChange }: { onComplete: () => void; onScrollLockChange?: (locked: boolean) => void }) {
  const [ballDone, setBallDone] = useState(false), [classicalDone, setClassicalDone] = useState(false), [labDone, setLabDone] = useState(false);
  const [guess, setGuess] = useState<string>(), [fusionDone, setFusionDone] = useState(false);
  const real = guess === 'It happens in real life!';
  return <View>
    <Text style={s.p}>Let’s look at something fun. Like…</Text>
    <Text accessibilityRole="header" accessibilityLabel="Quantum tunnelling" style={s.title}>{Array.from('Quantum tunnelling').map((char, i) => <Text key={i} style={{ color: rainbow[i % rainbow.length] }}>{char}</Text>)}</Text>
    <Text style={s.p}>And no, it’s not a fake scientific myth. It’s something that is possible in real life!</Text>
    <Text style={s.heading}>As always, let’s start classically.</Text>
    <Text style={s.p}>Here we have a wall and our trusty old basketball.</Text>
    <ClassicalBarrier particle="basketball" onComplete={() => setBallDone(true)} />
    {ballDone && <View>
      <Text style={s.p}>Now let’s try an electron. Instead of bricks, an electric field makes a high potential-energy barrier.</Text>
      <Text style={s.heading}>Classical assumption</Text>
      <Text style={s.p}>Our electron has less energy than the barrier height. If it behaved classically, it would bounce back too.</Text>
      <ClassicalBarrier particle="electron" onComplete={() => setClassicalDone(true)} />
    </View>}
    {classicalDone && <View>
      <Text style={s.p}>But you know better than that… Electrons have quantum behaviour!</Text>
      <Text style={s.heading}>Quantum assumption</Text>
      <BarrierLab onComplete={() => setLabDone(true)} />
    </View>}
    {labDone && <View>
      <Text style={s.heading}>Does this actually happen in real life? Or is it just a probability on paper?</Text>
      <View style={s.answers}>{['It’s only an idea on paper', 'It happens in real life!'].map(option => <AnswerButton key={option} knowledgeKey="real-tunnelling" isCorrectAnswer={option === "It happens in real life!"} label={option} state={guess === option ? real ? 'correct' : 'incorrect' : 'default'} disabled={real} onPress={() => setGuess(option)} />)}</View>
      {guess && !real && <Text style={s.p}>Think beyond this drawing. Tunnelling has real, measurable effects. Try again.</Text>}
      {real && <SolarFusion onComplete={() => setFusionDone(true)} onScrollLockChange={onScrollLockChange} />}
    </View>}
    {fusionDone && <View>
      <MysteryPanel number={1} unlocked title="Mystery solved!" body="A wavefunction can extend through a barrier. That gives a real chance of finding the particle beyond it, and helps nuclear fusion power the Sun." />
      <PrimaryButton label="Start the quiz" onPress={onComplete} />
    </View>}
  </View>;
}

const s = StyleSheet.create({
  p: { fontFamily: fonts.body, color: colors.ink, fontSize: 23, lineHeight: 31, marginVertical: 12 },
  title: { fontFamily: fonts.display, fontSize: 43, lineHeight: 51, marginBottom: 18 },
  heading: { fontFamily: fonts.display, color: colors.ink, fontSize: 29, lineHeight: 36, marginTop: 28, marginBottom: 12 },
  caption: { fontFamily: fonts.body, color: colors.ink, fontSize: 20, lineHeight: 27, textAlign: 'center', marginVertical: 12 },
  small: { fontFamily: fonts.body, color: colors.muted, fontSize: 18, lineHeight: 24, textAlign: 'center' },
  classicalScene: { height: 190, marginVertical: 16 }, wall: { position: 'absolute', backgroundColor: '#CEC5B9', borderWidth: 3, borderColor: '#706B66', transform: [{ rotate: '-1deg' }] },
  electricWall: { backgroundColor: '#F8D5EA', borderColor: '#AD4B87' }, wallMarks: { fontFamily: fonts.display, color: '#706B66', textAlign: 'center', fontSize: 27 },
  projectile: { position: 'absolute', width: 58, height: 58, top: 92, left: 10 }, ground: { position: 'absolute', bottom: 20, left: 0, right: 0, height: 2, backgroundColor: '#BEB7A8' },
  waveScene: { height: 230, marginTop: 20 }, diagramTitle: { fontFamily: fonts.display, color: '#A0487F', textAlign: 'center', fontSize: 15 },
  energyBarrier: { position: 'absolute', bottom: 50, backgroundColor: '#F1C8E1', borderWidth: 2, borderColor: '#B75992' },
  energyLine: { position: 'absolute', top: 101, left: 0, right: 0, borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#B67839' },
  energyLabel: { position: 'absolute', top: 72, left: 0, fontFamily: fonts.body, color: '#8B592B', fontSize: 15 }, waveAxis: { position: 'absolute', top: 122, left: 0, right: 0, height: 1, backgroundColor: '#BDB7C5' },
  region: { position: 'absolute', bottom: 12, fontFamily: fonts.body, fontSize: 18, color: '#7654B2' },
  what: { color: '#CB343B', fontFamily: fonts.display, fontSize: 52, textAlign: 'center', marginTop: 24 },
  controls: { padding: 16, borderRadius: 18, borderWidth: 2, borderColor: '#DBACCA', backgroundColor: '#FFF4FA', marginVertical: 16 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 60 }, switchLabel: { flex: 1, fontFamily: fonts.body, fontSize: 22, color: colors.ink },
  material: { paddingVertical: 16 }, materialRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', height: 100 }, materialLayer: { width: 16, height: 88, backgroundColor: '#E7D0DF', borderWidth: 2, borderColor: '#AC688F' },
  direction: { color: '#8862B3', fontSize: 36 }, atom: { width: 66, height: 66 }, smallAtom: { width: 40, height: 40 },
  result: { borderWidth: 2, borderColor: colors.green, borderRadius: 18, padding: 16, marginVertical: 20, backgroundColor: '#EEF7EE' },
  bubble: { borderRadius: 30, borderWidth: 2, borderColor: '#D09935', backgroundColor: '#FFF4CF', padding: 22, marginTop: 35 }, bubbleText: { fontFamily: fonts.display, fontSize: 28, lineHeight: 35, textAlign: 'center', color: colors.ink },
  sun: { width: '80%', height: 240, alignSelf: 'center', marginVertical: 24 }, fusionScene: { height: 220, justifyContent: 'center', alignItems: 'center' }, pair: { width: 220, flexDirection: 'row', justifyContent: 'space-between' },
  swipePrompt: { padding: 16, minHeight: 54, borderRadius: 15, borderWidth: 2, borderStyle: 'dashed', borderColor: '#BD679E' }, swipeText: { fontFamily: fonts.body, fontSize: 22, textAlign: 'center', color: '#92326D' },
  chain: { alignItems: 'center' }, fourHydrogens: { flexDirection: 'row', gap: 10, marginBottom: 10 }, heliumScene: { width: 250, height: 200, alignItems: 'center', justifyContent: 'center' }, helium: { width: 100, height: 100 },
  photon: { position: 'absolute', width: 65, height: 65, left: 100, top: 65 }, radiation: { position: 'absolute', left: 168, top: 52, fontSize: 36, color: '#DF9919', transform: [{ rotate: '-35deg' }] }, energyReleased: { fontFamily: fonts.display, color: '#A37313', fontSize: 24, marginTop: 12 },
  repelling: { width: '100%', height: 95, marginTop: 20 }, answers: { gap: 12, marginVertical: 20 },
});
