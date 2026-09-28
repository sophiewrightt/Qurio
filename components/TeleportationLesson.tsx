import { useEffect, useRef, useState } from 'react';
import { Animated, Image, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { AnswerButton } from './AnswerButton';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';
import { colors, fonts, radii, shadow, spacing } from '../constants/theme';

const strangeArt = {
  X: require('../assets/module-3/refinements/strange-x.png'),
  A: require('../assets/module-3/refinements/strange-a.png'),
  B: require('../assets/module-3/refinements/strange-b.png'),
};
const noScrollLock = (_locked: boolean) => {};

const scrambles = [
  { code: '00', label: 'Scramble 1', color: '#F8D59C' },
  { code: '01', label: 'Scramble 2', color: '#C8E4F6' },
  { code: '10', label: 'Scramble 3', color: '#E5CFF0' },
  { code: '11', label: 'Scramble 4', color: '#C8EACD' },
] as const;

type LockHandler = (locked: boolean) => void;
type Stage = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Prediction = 'Send strange X' | 'Copy the state' | 'Use entanglement';
type Scramble = typeof scrambles[number];

function StrangeNode({ name, role, mystery = false, paired = false, used = false, receiver = false }: {
  name: 'X' | 'A' | 'B'; role: string; mystery?: boolean; paired?: boolean; used?: boolean; receiver?: boolean;
}) {
  return <View accessibilityLabel={`Strange ${name}: ${role}${used ? ', used' : ''}`} style={styles.photonNode}>
    <Image source={strangeArt[name]} resizeMode="contain" style={[styles.photon, used && styles.usedNode]} />
    {paired && <Text style={styles.pairMarkText}>PAIR 1</Text>}
    {used && <Text style={styles.usedCross}>✕</Text>}
    <Text style={styles.roleText}>{role}</Text>
  </View>;
}

function ScrambleTile({ scramble, selected = false }: { scramble: Scramble; selected?: boolean }) {
  return <View accessibilityLabel={`${scramble.label}${selected ? ', Alex’s recorded result' : ''}`} style={[styles.tile, { backgroundColor: scramble.color }, selected && styles.selectedTile]}>
    <Text style={styles.tileText}>{scramble.label}</Text>
    {selected && <Text style={styles.small}>✓ Alex’s result</Text>}
  </View>;
}

export function EntanglePair({ onComplete }: { onComplete: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;
  const started = useRef(false), alive = useRef(true);
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  useEffect(() => () => { alive.current = false; animation.current?.stop(); }, []);
  const entangle = () => {
    if (started.current) return;
    started.current = true;
    animation.current = Animated.sequence([Animated.timing(progress, { toValue: 1, duration: 900, useNativeDriver: true }), Animated.delay(650)]);
    animation.current.start(({ finished }) => { if (finished && alive.current) onComplete(); });
  };
  return <Pressable accessibilityRole="button" accessibilityLabel="Entangle stranges A and B" onPress={entangle} style={styles.entangle}>
    <Text style={styles.instruction}>TAP TO ENTANGLE A + B</Text>
    <View style={styles.entangleRow}>
      <Animated.Image source={strangeArt.A} resizeMode="contain" style={[styles.entangleParticle, { transform: [{ translateX: progress.interpolate({ inputRange: [0,1], outputRange: [-14,0] }) }] }]} />
      <Animated.Text style={[styles.sharedSquiggle, { opacity: progress }]}>∿∿</Animated.Text>
      <Animated.Image source={strangeArt.B} resizeMode="contain" style={[styles.entangleParticle, { transform: [{ translateX: progress.interpolate({ inputRange: [0,1], outputRange: [14,0] }) }] }]} />
    </View>
    <Animated.Text style={[styles.instruction, { opacity: progress }]}>One shared quantum state</Animated.Text>
  </Pressable>;
}

export function ProtocolBoard({ stage, onMeasure }: {
  stage: Stage; onMeasure: () => void;
}) {
  const measured = stage >= 3;
  const completed = stage >= 5;
  return <View accessibilityLabel="Quantum teleportation handoff board" style={styles.protocolBoard}>
    <View style={styles.boardColumns}>
      <View style={[styles.boardColumn, styles.alexColumn]}>
        <Image source={require('../assets/module-3/refinements/alex-face.png')} resizeMode="contain" style={styles.face} /><Text style={styles.personName}>ALEX</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Measure stranges X and A together" disabled={stage !== 2} onPress={onMeasure} style={({ pressed }) => [styles.jointTarget, stage === 2 && styles.jointReady, pressed && styles.pressed]}>
          <StrangeNode name="X" role={measured ? 'original state used' : 'mystery state'} used={measured} />
          <StrangeNode name="A" role={measured ? 'helper used' : 'entangled helper'} used={measured} paired={!measured} />
          {stage === 2 && <Text style={styles.boardAction}>TAP X + A TO MEASURE TOGETHER</Text>}
        </Pressable>
      </View>
      <View style={styles.boardColumn}>
        <Image source={require('../assets/module-3/refinements/barb-face.png')} resizeMode="contain" style={styles.face} /><Text style={styles.personName}>BARB</Text>
        <View style={styles.receiver}>
          <StrangeNode name="B" role={completed ? 'X’s mystery state!' : measured ? 'state still scrambled' : 'waiting receiver'} paired={!measured} />
        </View>
      </View>
    </View>
    {measured && <Text style={styles.resourceUsedText}>ENTANGLED PAIR: USED</Text>}
  </View>;
}

export function PaperPlaneDelivery({ onDelivered, onGestureLock, scramble = scrambles[0] }: { onDelivered: () => void; onGestureLock: LockHandler; scramble?: Scramble }) {
  const planeX = useRef(new Animated.Value(0)).current;
  const alive = useRef(true);
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const done = useRef(false);
  const width = useRef(320);
  useEffect(() => () => { alive.current = false; animation.current?.stop(); onGestureLock(false); }, [onGestureLock]);
  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !done.current,
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 3,
    onPanResponderGrant: () => onGestureLock(true),
    onPanResponderMove: (_, gesture) => { if (!done.current) planeX.setValue(Math.max(0, Math.min(70, gesture.dx))); },
    onPanResponderRelease: (_, gesture) => {
      onGestureLock(false);
      if ((gesture.dx > 24 || gesture.vx > .3) && !done.current) {
        done.current = true;
        animation.current = Animated.timing(planeX, { toValue: Math.max(80, width.current - 144), duration: 1500, useNativeDriver: true });
        animation.current.start(({ finished }) => { if (finished && alive.current) onDelivered(); });
      } else if (!done.current) Animated.spring(planeX, { toValue: 0, useNativeDriver: true }).start();
    },
    onPanResponderTerminate: () => { onGestureLock(false); if (!done.current) Animated.spring(planeX, { toValue: 0, useNativeDriver: true }).start(); },
    onPanResponderTerminationRequest: () => false,
  })).current;
  return <View onLayout={event => { width.current = event.nativeEvent.layout.width; }} style={styles.messageStage}>
    <Text style={styles.instruction}>SEND A MESSAGE</Text>
    <Text style={styles.channelText}>Alex’s result, sent at light speed or slower</Text>
    <View style={styles.messagePeople}>
      <View style={styles.messagePerson}><Image source={require('../assets/module-3/refinements/alex-face.png')} resizeMode="contain" style={styles.face} /><Text style={styles.personName}>ALEX</Text></View>
      <View style={styles.messagePerson}><Image source={require('../assets/module-3/refinements/barb-face.png')} resizeMode="contain" style={styles.face} /><Text style={styles.personName}>BARB</Text></View>
    </View>
    <Animated.View accessibilityLabel="Instruction paper, swipe right from Alex to Barb" style={[styles.planeWrap, { transform: [{ translateX: planeX }] }]} {...responder.panHandlers}>
      <ScrambleTile scramble={scramble} /><Text style={styles.small}>swipe →</Text>
    </Animated.View>
  </View>;
}

function InstructionCard({ scramble, delivered = false }: { scramble: Scramble; delivered?: boolean }) {
  return <View accessibilityLabel={`${delivered ? 'Barb received' : 'Alex recorded'} instruction ${scramble.code}, ${scramble.label}`} style={[styles.instructionCard, delivered && styles.deliveredCard]}>
    <Text style={styles.instructionEyebrow}>{delivered ? 'BARB’S INSTRUCTION' : 'ALEX’S RANDOM RESULT'}</Text>
    <ScrambleTile scramble={scramble} />
    <Text style={styles.small}>Undo this scramble</Text>
  </View>;
}

function BeforeAfter() {
  return <View style={styles.beforeAfter}>
    <View style={styles.compareColumn}><Text style={styles.compareHeading}>START</Text><StrangeNode name="X" role="mystery state" mystery /><Text style={styles.compareNote}>Entangled pair ready</Text></View>
    <Text style={styles.compareArrow}>→</Text>
    <View style={styles.compareColumn}><Text style={styles.compareHeading}>FINISH</Text><StrangeNode name="B" role="same mystery state" mystery receiver /><Text style={styles.compareNote}>Original and pair used</Text></View>
  </View>;
}

export function ReceiverAdjustment({ scramble, onComplete }: { scramble: Scramble; onComplete: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;
  const started = useRef(false), alive = useRef(true);
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  useEffect(() => () => { alive.current = false; animation.current?.stop(); }, []);
  const adjust = () => {
    if (started.current) return;
    started.current = true;
    animation.current = Animated.timing(progress, { toValue: 1, duration: 1100, useNativeDriver: true });
    animation.current.start(({ finished }) => { if (finished && alive.current) onComplete(); });
  };
  return <View style={styles.workshop}>
    <InstructionCard scramble={scramble} delivered />
    <Pressable accessibilityRole="button" accessibilityLabel={`Apply ${scramble.label} adjustment to strange B`} onPress={adjust} style={styles.strangeTarget}>
      <Animated.Image source={strangeArt.B} resizeMode="contain" style={[styles.receiverArt, { transform: [{ scale: progress.interpolate({ inputRange: [0,.5,1], outputRange: [1,1.12,1] }) }] }]} />
      <Animated.View pointerEvents="none" style={[styles.scrambleBadge, { backgroundColor: scramble.color, opacity: progress.interpolate({ inputRange: [0,1], outputRange: [1,0] }) }]}><Text style={styles.small}>{scramble.label}</Text></Animated.View>
      <Text style={styles.instruction}>TAP STRANGE B TO ADJUST</Text>
    </Pressable>
  </View>;
}

export function TeleportationLesson({ onComplete, onScrollLockChange = noScrollLock }: { onComplete: () => void; onScrollLockChange?: LockHandler }) {
  const [stage, setStage] = useState<Stage>(0);
  const [prediction, setPrediction] = useState<Prediction>();
  const [scramble, setScramble] = useState<Scramble>();
  const [triedEarly, setTriedEarly] = useState(false);
  const [speedAnswer, setSpeedAnswer] = useState<'Yes' | 'No'>();
  const stageRef = useRef<Stage>(0);
  const quizStarted = useRef(false);
  useEffect(() => () => onScrollLockChange(false), [onScrollLockChange]);
  const advance = (next: Stage) => { stageRef.current = next; setStage(next); };
  const choosePrediction = (answer: Prediction) => { if (stageRef.current !== 0) return; setPrediction(answer); advance(1); };
  const measure = () => {
    if (stageRef.current !== 2) return;
    setScramble(scrambles[Math.floor(Math.random() * scrambles.length)]!);
    setTriedEarly(false);
    advance(3);
  };
  const answerSpeed = (answer: 'Yes' | 'No') => {
    if (stageRef.current !== 5) return;
    setSpeedAnswer(answer);
    if (answer === 'No') advance(6);
  };
  const replay = () => {
    onScrollLockChange(false);
    setPrediction(undefined);
    setScramble(undefined);
    setTriedEarly(false);
    setSpeedAnswer(undefined);
    quizStarted.current = false;
    advance(0);
  };
  const startQuiz = () => {
    if (stageRef.current !== 6 || quizStarted.current) return;
    quizStarted.current = true;
    onComplete();
  };

  const predictionFeedback = prediction === 'Send strange X'
    ? 'That would move the particle itself. Teleportation has a stranger goal: transfer only its quantum state.'
    : prediction === 'Copy the state'
      ? 'An unknown quantum state cannot be copied. A successful teleport must leave no spare original.'
      : 'Exactly. Shared entanglement helps transfer the state, but Barb will also need a message from Alex.';

  return <View>
    <Text style={styles.body}>You heard it right: <Text style={styles.bold}>teleportation</Text>. Let’s see how we can actually teleport a quantum state using entanglement.</Text>
    <Text style={styles.body}>Alex has a strange quark called X. It carries a mystery quantum state that nobody knows.</Text>
    <Image source={require('../assets/module-3/refinements/strange-x-intro.png')} accessibilityLabel="Strange X and its possible vertical spin outcomes" resizeMode="contain" style={styles.intro} />
    <Text style={styles.note}>The pictures show possible measurement outcomes, not a hidden answer. This is an idealised spin experiment, not a way to handle free quarks in a lab.</Text>
    <Text style={styles.body}>Alex cannot read a complete description of the state from one measurement, and he cannot make a spare copy. How could Barb receive it without strange X travelling to her?</Text>
    {stage === 0 && <View style={styles.answers}>
      {(['Send strange X', 'Copy the state', 'Use entanglement'] as Prediction[]).map(option => <AnswerButton key={option} label={option} state="default" onPress={() => choosePrediction(option)} />)}
    </View>}

    {stage >= 1 && <>
      <Text style={styles.feedback}>{predictionFeedback}</Text>
      <Text style={styles.body}>Let’s see what stranges we need for this experiment.</Text>
      <Text style={styles.heading}>3 stranges, 3 jobs.</Text>
      <View style={styles.roleStrip}>
        <View style={styles.roleCell}><StrangeNode name="X" role="State to transfer" /></View>
        <View style={styles.roleCell}><StrangeNode name="A" role="Alex’s helper" /></View>
        <View style={styles.roleCell}><StrangeNode name="B" role="Barb’s receiver" /></View>
      </View>
      <Text style={styles.body}>First, A and B are prepared together in one entangled state. Alex keeps A and Barb receives B.</Text>
      {stage === 1 && <EntanglePair onComplete={() => { if (stageRef.current === 1) advance(2); }} />}
    </>}

    {stage >= 2 && <>
      <ProtocolBoard stage={stage} onMeasure={measure} />
      <Text style={styles.body}>This is the current set up of who has which stranges.</Text>
      {stage === 2 && <Text style={styles.body}>Now Alex measures X and A together. Their original states and the shared entanglement will be used up, leaving B with a scrambled version of X’s state. Tap X + A to try it.</Text>}
    </>}

    {stage >= 3 && scramble && <>
      <Text style={styles.heading}>One random scramble</Text>
      <Text style={styles.body}>Alex’s joint measurement did not reveal the mystery state of X. It used X’s original state and the shared entanglement, and left B in 1 of 4 states related to X.</Text>
      <Text style={styles.body}>So now B carries the mystery state of X, along with 1 quantum scramble.</Text>
      <Text style={styles.body}>There are 4 possible scrambles, shown by numbered labels. Alex’s measurement records which operation will undo it. Alex cannot choose which scramble appears.</Text>
      <View style={styles.tiles}>{scrambles.map(item => <View key={item.code} style={styles.tileCell}><ScrambleTile scramble={item} selected={item.code === scramble.code} /></View>)}</View>
      {stage === 3 && <InstructionCard scramble={scramble} />}
      {stage === 3 && !triedEarly && <Pressable accessibilityRole="button" accessibilityLabel="Try to finish at Barb before the message arrives" onPress={() => { if (stageRef.current === 3) setTriedEarly(true); }} style={styles.strangeTarget}>
        <Image source={strangeArt.B} resizeMode="contain" style={styles.receiverArt} />
        <Text style={styles.instruction}>CAN BARB FINISH? TAP STRANGE B</Text>
      </Pressable>}
      {stage === 3 && triedEarly && <>
        <Text accessibilityLiveRegion="polite" style={styles.waiting}>WAITING FOR INSTRUCTIONS</Text>
        <Text style={styles.body}>Barb cannot tell which scramble B has by inspecting it. Her local state reveals no information about X.</Text>
        <Text style={styles.body}>Alex must send his random result through an ordinary communication channel.</Text>
        <Text style={styles.instruction}>Swipe the instruction from Alex to Barb.</Text>
        <PaperPlaneDelivery scramble={scramble} onDelivered={() => { if (stageRef.current === 3) advance(4); }} onGestureLock={onScrollLockChange} />
      </>}
    </>}

    {stage >= 4 && scramble && <>
      <Text style={styles.body}>Now Barb knows which adjustment will undo the scramble.</Text>
      {stage === 4 && <ReceiverAdjustment scramble={scramble} onComplete={() => { if (stageRef.current === 4) advance(5); }} />}
    </>}

    {stage >= 5 && <>
      <Text style={styles.teleported}>Strange B now has the mystery state that strange X had at the start!</Text>
      <BeforeAfter />
      <View style={styles.resultList}>
        <Text style={styles.resultItem}>✓ The quantum state was transferred.</Text>
        <Text style={styles.resultItem}>✕ Strange X did not travel to Barb.</Text>
        <Text style={styles.resultItem}>✕ No spare copy remained with Alex.</Text>
        <Text style={styles.resultItem}>✓ The entangled pair was used up.</Text>
      </View>
      <Text style={styles.question}>Could this teleportation be done faster than light?</Text>
      <View style={styles.answers}><AnswerButton label="Yes" state={speedAnswer === 'Yes' ? 'incorrect' : 'default'} onPress={() => answerSpeed('Yes')} /><AnswerButton knowledgeKey="teleportation-speed" isCorrectAnswer label="No" state={stage === 6 ? 'correct' : 'default'} onPress={() => answerSpeed('No')} /></View>
      {speedAnswer === 'Yes' && stage === 5 && <Text style={styles.retry}>Not quite. Remember what happened when you tapped B before the instruction arrived.</Text>}
    </>}

    {stage === 6 && <>
      <Text style={styles.no}>NO!</Text>
      <Text style={styles.body}>Alex’s measurement left B with a random scramble, and his message told Barb how to undo it.</Text>
      <Text style={styles.body}>That message cannot travel faster than light, so quantum teleportation cannot send usable information faster than light either.</Text>
      <TerminologyCard term="Quantum teleportation" definition="Transferring an unknown quantum state using shared entanglement, a joint measurement, an ordinary two-bit message and a final adjustment." />
      <PrimaryButton label="Try a fresh teleportation" secondary onPress={replay} /><PrimaryButton label="Start the quiz" onPress={startQuiz} />
    </>}
  </View>;
}

const styles = StyleSheet.create({
  bold: { fontWeight: '700' }, intro: { width: '100%', height: 300, marginBottom: 16 },
  usedCross: { position: 'absolute', top: -4, color: colors.red, fontSize: 80, lineHeight: 95 },
  entangle: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.green, borderRadius: radii.lg, marginBottom: 24, padding: 16 },
  entangleRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  entangleParticle: { width: '37%', height: 108 }, sharedSquiggle: { color: colors.green, fontSize: 38, letterSpacing: -5 },
  boardColumns: { flexDirection: 'row' }, boardColumn: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  alexColumn: { borderRightWidth: 1, borderRightColor: colors.border }, face: { width: 70, height: 70, marginBottom: 5 },
  jointTarget: { width: '100%', alignItems: 'center', borderWidth: 2, borderColor: 'transparent', borderRadius: 12, padding: 4, marginTop: 10 },
  jointReady: { borderColor: colors.primary, borderStyle: 'dashed' }, receiver: { width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }, tileCell: { width: '47%' },
  tile: { minHeight: 68, borderWidth: 2, borderColor: 'transparent', borderRadius: 8, padding: 9, alignItems: 'center', justifyContent: 'center' },
  selectedTile: { borderColor: colors.ink, borderWidth: 3 }, tileText: { fontFamily: fonts.display, color: colors.ink, fontSize: 19 },
  small: { fontFamily: fonts.body, color: colors.ink, fontSize: 16, textAlign: 'center' },
  body: { fontFamily: fonts.body, color: colors.ink, fontSize: 22, lineHeight: 29, marginBottom: 18 },
  heading: { fontFamily: fonts.display, color: colors.ink, fontSize: 31, lineHeight: 37, marginTop: 18, marginBottom: 12 },
  question: { fontFamily: fonts.display, color: colors.ink, fontSize: 27, lineHeight: 33, marginTop: 18, marginBottom: 12 },
  instruction: { fontFamily: fonts.display, color: colors.green, fontSize: 22, lineHeight: 27, textAlign: 'center', marginBottom: 12 },
  note: { fontFamily: fonts.body, color: colors.muted, fontSize: 18, lineHeight: 24, marginBottom: 20, textAlign: 'center' },
  feedback: { fontFamily: fonts.body, color: colors.ink, fontSize: 20, lineHeight: 27, backgroundColor: '#E8F5EE', borderLeftWidth: 4, borderLeftColor: colors.green, padding: 14, marginBottom: 18 },
  answers: { gap: 10, marginBottom: 18 },
  openingMystery: { alignItems: 'center', height: 185, justifyContent: 'center', marginBottom: 8 },
  photonNode: { width: '100%', maxWidth: 108, minHeight: 120, marginVertical: 8, alignItems: 'center', justifyContent: 'flex-start' },
  usedNode: { opacity: 0.38 }, photon: { width: 82, height: 82 },
  nameTag: { position: 'absolute', top: 53, left: 37, minWidth: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink },
  receiverNameTag: { borderColor: colors.green }, nameText: { fontFamily: fonts.display, color: colors.ink, fontSize: 21 },
  roleText: { fontFamily: fonts.body, color: colors.ink, fontSize: 15, lineHeight: 18, textAlign: 'center', marginTop: -2 },
  mysteryHalo: { position: 'absolute', top: -10, width: 101, height: 101, borderWidth: 3, borderColor: colors.primary, borderStyle: 'dashed', borderRadius: 51, alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  mysteryMark: { position: 'absolute', top: -16, right: -5, fontFamily: fonts.display, color: colors.primary, fontSize: 39, lineHeight: 41 },
  pairMark: { position: 'absolute', top: 2, right: 4, backgroundColor: '#EDE8FF', borderWidth: 2, borderColor: colors.primary, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 2, zIndex: 4 },
  pairMarkText: { fontFamily: fonts.display, color: colors.primaryDark, backgroundColor: '#EDE8FF', paddingHorizontal: 8, borderRadius: 6, fontSize: 13, marginBottom: 5 },
  usedStamp: { position: 'absolute', top: 30, transform: [{ rotate: '-12deg' }], borderWidth: 3, borderColor: colors.red, paddingHorizontal: 7, zIndex: 5 },
  usedStampText: { fontFamily: fonts.display, color: colors.red, fontSize: 18 },
  roleStrip: { flexDirection: 'row', gap: 7, marginBottom: 20 }, roleCell: { flex: 1, alignItems: 'center' },
  roleLetter: { fontFamily: fonts.display, color: colors.green, fontSize: 34 }, roleDescription: { fontFamily: fonts.body, color: colors.ink, fontSize: 17, lineHeight: 21, textAlign: 'center' },
  protocolBoard: { paddingVertical: 14, borderWidth: 2, borderColor: colors.green, borderRadius: radii.lg, backgroundColor: colors.surface, marginBottom: 18 },
  peopleRow: { position: 'absolute', top: 13, left: 18, right: 18, flexDirection: 'row', justifyContent: 'space-between' },
  personName: { fontFamily: fonts.display, color: colors.green, fontSize: 21 }, boardDivider: { position: 'absolute', top: 48, bottom: 18, left: '50%', width: 2, backgroundColor: colors.border },
  xPosition: { position: 'absolute', left: 25, top: 65 }, aPosition: { position: 'absolute', left: 18, bottom: 34 }, bPosition: { position: 'absolute', right: 20, top: 112 },
  sharedPairButton: { position: 'absolute', left: 56, right: 22, bottom: 22, minHeight: 165, alignItems: 'center', justifyContent: 'center' },
  sharedStateGlow: { position: 'absolute', width: 245, height: 115, borderRadius: 58, backgroundColor: '#EDE8FF', borderWidth: 3, borderColor: colors.primary, borderStyle: 'dashed', top: 0 },
  sharedStateText: { fontFamily: fonts.display, color: colors.primaryDark, fontSize: 13, textAlign: 'center', marginTop: 5 },
  pairNodes: { flexDirection: 'row', gap: 6, zIndex: 2, marginTop: -20 },
  boardAction: { fontFamily: fonts.display, color: colors.green, fontSize: 14, lineHeight: 18, textAlign: 'center' },
  measureTarget: { alignItems: 'center', minWidth: 130 }, measurePlus: { fontFamily: fonts.display, color: colors.primaryDark, fontSize: 24, marginTop: -4 },
  receiverButton: { width: 154, height: 170, alignItems: 'center', justifyContent: 'center' },
  resourceUsed: { position: 'absolute', bottom: 8, left: '27%', right: '27%', borderWidth: 2, borderColor: colors.red, transform: [{ rotate: '-1deg' }], backgroundColor: colors.surface, paddingVertical: 3 },
  resourceUsedText: { fontFamily: fonts.display, color: colors.red, fontSize: 13, textAlign: 'center' },
  instructionCard: { width: 205, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFDF7', borderWidth: 2, borderColor: colors.ink, borderStyle: 'dashed', padding: 12, marginBottom: 18, transform: [{ rotate: '-1deg' }] },
  deliveredCard: { borderColor: colors.green, borderStyle: 'solid' }, instructionEyebrow: { fontFamily: fonts.display, color: colors.muted, fontSize: 13 },
  instructionMark: { fontFamily: fonts.display, color: colors.primaryDark, fontSize: 38, lineHeight: 43 }, instructionLabel: { fontFamily: fonts.display, color: colors.ink, fontSize: 21 }, instructionCode: { fontFamily: fonts.body, color: colors.muted, fontSize: 17, letterSpacing: 3 },
  waiting: { fontFamily: fonts.display, color: colors.red, fontSize: 26, textAlign: 'center', marginBottom: 12 },
  messageStage: { height: 320, borderWidth: 2, borderColor: colors.green, borderRadius: radii.lg, backgroundColor: colors.surface, padding: spacing.md, overflow: 'hidden', marginBottom: 22 },
  messagePerson: { alignItems: 'center', marginTop: 16 },
  workshop: { alignItems: 'center', marginVertical: 12 },
  strangeTarget: { alignItems: 'center', padding: 12, marginBottom: 18 },
  receiverArt: { width: 165, height: 165 },
  scrambleBadge: { position: 'absolute', top: 115, borderRadius: 8, padding: 8 },
  messagePeople: { flexDirection: 'row', justifyContent: 'space-between' }, ordinaryChannel: { position: 'absolute', left: 32, right: 32, top: 94, height: 3, backgroundColor: colors.green, transform: [{ rotate: '-1deg' }] },
  channelText: { alignSelf: 'center', fontFamily: fonts.body, color: colors.muted, fontSize: 15, marginTop: 4 },
  planeWrap: { position: 'absolute', left: 12, top: 206, width: 118, padding: 5, backgroundColor: '#FFFDF7', borderWidth: 1, borderColor: colors.ink }, plane: { width: 84, height: 75 }, dragHint: { fontFamily: fonts.display, fontSize: 14, color: colors.green, textAlign: 'center', marginTop: -8 },
  adjustmentButton: { alignSelf: 'center', minWidth: 245, minHeight: 92, borderWidth: 3, borderColor: colors.green, borderRadius: radii.md, backgroundColor: '#E8F5EE', alignItems: 'center', justifyContent: 'center', marginBottom: 20, transform: [{ rotate: '-0.5deg' }], ...shadow },
  adjustmentMark: { fontFamily: fonts.display, color: colors.primaryDark, fontSize: 34 }, adjustmentText: { fontFamily: fonts.display, color: colors.ink, fontSize: 20 },
  teleported: { fontFamily: fonts.display, color: colors.green, fontSize: 30, lineHeight: 37, textAlign: 'center', marginVertical: 20 },
  beforeAfter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 20 }, compareColumn: { flex: 1, alignItems: 'center' },
  compareHeading: { fontFamily: fonts.display, color: colors.green, fontSize: 22 }, compareArrow: { fontFamily: fonts.display, color: colors.green, fontSize: 31 }, compareNote: { fontFamily: fonts.body, color: colors.muted, fontSize: 16, lineHeight: 19, textAlign: 'center' },
  resultList: { borderLeftWidth: 4, borderLeftColor: colors.green, paddingLeft: 14, marginBottom: 18 }, resultItem: { fontFamily: fonts.body, color: colors.ink, fontSize: 20, lineHeight: 27, marginBottom: 5 },
  retry: { fontFamily: fonts.body, color: colors.red, fontSize: 20, lineHeight: 26, marginBottom: 15 }, no: { fontFamily: fonts.display, color: colors.green, fontSize: 54, textAlign: 'center', marginVertical: 20 },
  pressed: { opacity: 0.65, transform: [{ scale: 0.985 }] },
});
