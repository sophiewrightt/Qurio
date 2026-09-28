import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AnswerButton, type AnswerState } from './AnswerButton';
import { MysteryPanel } from './MysteryPanel';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';
import { colors, fonts, radii, spacing } from '../constants/theme';

const closedBoxes = require('../assets/module-3/lesson-2/boxes-closed-aligned-transparent.png');
const boxAOpen = require('../assets/module-3/lesson-2/box-a-open-b-closed-transparent.png');
const socksInBoxes = require('../assets/module-3/lesson-2/socks-boxes-transparent.png');
const strange = require('../assets/module-3/lesson-1/strange-default-transparent.png');
const spinUpStrange = require('../assets/module-3/lesson-1/spin-up-quark-transparent.png');
const spinDownStrange = require('../assets/module-3/lesson-1/spin-down-quark-transparent.png');
const alexAndBarb = require('../assets/module-3/lesson-3-all-entangled-up/alex_and_barb_introduction-transparent.png');
const barbWithSpinDown = require('../assets/module-3/refinements/barb-spin-down-no-name.png');
const entangler = require('../assets/module-3/lesson-3-all-entangled-up/entangler-transparent.png');
const entanglerToBoxes = require('../assets/module-3/lesson-3-all-entangled-up/entangler_pointing_to_boxes-transparent.png');
const pairOfSocks = require('../assets/module-3/lesson-3-all-entangled-up/pair-of-socks-transparent.png');
const instructionSheet = require('../assets/module-3/refinements/instruction-sheet.png');
const alexBarbRoomClosed = require('../assets/module-3/refinements/room-closed.png');
const alexBarbRoomAlexUp = require('../assets/module-3/refinements/room-open.png');

function answerState(option: string, selected: string | undefined, correct: string): AnswerState {
  if (!selected) return 'default';
  if (selected === correct && option === correct) return 'correct';
  return option === selected ? 'incorrect' : 'default';
}

function EntangledPairPreview() {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floating = Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: 1, duration: 1050, useNativeDriver: true }),
      Animated.timing(float, { toValue: 0, duration: 1050, useNativeDriver: true }),
    ]));
    floating.start();
    return () => floating.stop();
  }, [float]);

  return <View accessibilityLabel="An entangled spin-up strange and spin-down strange hovering together" style={styles.entangledPair}>
    <Animated.Image source={spinUpStrange} resizeMode="contain" style={[styles.entangledStrange, { transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [5, -5] }) }] }]} />
    <Animated.Image source={spinDownStrange} resizeMode="contain" style={[styles.entangledStrange, { transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [-5, 5] }) }] }]} />
  </View>;
}

function JointStateProbabilities() {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floating = Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(float, { toValue: 0, duration: 1000, useNativeDriver: true }),
    ]));
    floating.start();
    return () => floating.stop();
  }, [float]);

  return <View accessibilityLabel="Spin up and spin down are each locally possible with 50 percent probability" style={styles.probabilityPair}>
    <Animated.View style={[styles.probabilityOutcome, { transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [4, -5] }) }] }]}>
      <Image source={spinUpStrange} resizeMode="contain" style={styles.probabilityStrange} />
      <Text style={styles.probabilityValue}>50%</Text>
    </Animated.View>
    <Animated.View style={[styles.probabilityOutcome, { transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [-5, 4] }) }] }]}>
      <Image source={spinDownStrange} resizeMode="contain" style={styles.probabilityStrange} />
      <Text style={styles.probabilityValue}>50%</Text>
    </Animated.View>
  </View>;
}

export function SockComparison({ onComplete }: { onComplete: () => void }) {
  const [openedA, setOpenedA] = useState(false);
  const [sockGuess, setSockGuess] = useState<string>();
  const [changeAnswer, setChangeAnswer] = useState<string>();
  const correctSock = 'The right sock';
  const correctChange = 'No. It was already there.';
  const sockSolved = sockGuess === correctSock;
  const changeSolved = changeAnswer === correctChange;

  return <>
    <Text style={styles.body}>You could say this is kind of like a pair of socks... <Text style={styles.bold}>Or is it?</Text></Text>
    <Image accessibilityLabel="A pair of different socks" source={pairOfSocks} resizeMode="contain" style={styles.pairOfSocks} />
    <Text style={styles.body}>I have a pair of socks. I put the left one in one box and the right one in the other.</Text>
    <Text style={styles.heading}>Let’s see what’s in Box A.</Text>
    <Image
      accessibilityLabel={!openedA ? 'Two closed boxes labelled A and B' : sockSolved ? 'The left and right socks revealed in Boxes A and B' : 'Box A open with the left sock and Box B still closed'}
      source={!openedA ? closedBoxes : sockSolved ? socksInBoxes : boxAOpen}
      resizeMode="contain"
      style={styles.sockArtwork}
    />
    {!openedA && <PrimaryButton label="Open Box A" onPress={() => setOpenedA(true)} />}

    {openedA && <View style={styles.section}>
      <Text style={styles.prompt}>If Box A contains the left sock, without opening Box B, what must be inside?</Text>
      <View style={styles.answers}>{[correctSock, 'The left sock', 'We cannot tell'].map(option => <AnswerButton key={option} knowledgeKey="sock-pair" isCorrectAnswer={option === correctSock} label={option} state={answerState(option, sockGuess, correctSock)} disabled={sockSolved} onPress={() => setSockGuess(option)} />)}</View>
      {sockGuess && !sockSolved && <Text style={styles.tryAgain}>Not quite. Try again before we open Box B.</Text>}
      {sockSolved && <Text style={styles.feedback}>Exactly. The matching right sock must be in Box B.</Text>}
    </View>}

    {sockSolved && <View style={styles.section}>
      <Text style={styles.prompt}>Did opening Box A somehow change what Box B already had?</Text>
      <View style={styles.answers}>{['Yes. Opening A changed B.', correctChange].map(option => <AnswerButton key={option} knowledgeKey="sock-change" isCorrectAnswer={option === correctChange} label={option} state={answerState(option, changeAnswer, correctChange)} disabled={changeSolved} onPress={() => setChangeAnswer(option)} />)}</View>
      {changeAnswer && !changeSolved && <Text style={styles.tryAgain}>Look again at the socks. Box B was packed before we opened A.</Text>}
    </View>}

    {changeSolved && <>
      <Text style={styles.keyPoint}>No. Opening A changed what we knew. It did not change the sock that was already inside B.</Text>
      <Text style={styles.body}>This is called <Text style={styles.bold}>classical correlation</Text>. The two socks had definite positions from the start.</Text>
      <TerminologyCard term="Classical correlation" definition="A relationship between outcomes that comes from how things were already arranged." />
      <View style={styles.afterTerminologyAction}><PrimaryButton label="Try it with entangled stranges" onPress={onComplete} /></View>
    </>}
  </>;
}

export function EntanglerSequence({ onComplete }: { onComplete: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const travel = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const mounted = useRef(true);

  useEffect(() => () => {
    mounted.current = false;
    travel.stopAnimation();
    flash.stopAnimation();
  }, [flash, travel]);

  const send = () => {
    if (sending || sent) return;
    setSending(true);
    travel.setValue(0);
    flash.setValue(0);
    Animated.sequence([
      Animated.timing(flash, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 0, duration: 520, useNativeDriver: true }),
    ]).start();
    Animated.timing(travel, { toValue: 1, duration: 1450, useNativeDriver: true }).start(({ finished }) => {
      if (!finished || !mounted.current) return;
      setSending(false);
      setSent(true);
    });
  };

  return <>
    <Text style={styles.heading}>Let’s try this with 2 entangled stranges</Text>
    <Text style={styles.body}>Let’s assume these special boxes protect the strange quarks from unwanted interactions with their environment, so the pair’s quantum state is preserved.</Text>
    <Text style={styles.body}>First, the two strange quarks enter the Entangler-2000.</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Tap the Entangler-2000 to entangle and send the strange quarks" disabled={sending || sent} onPress={send} style={({ pressed }) => [styles.entanglerStage, pressed && styles.pressed]}>
      <Animated.View style={[styles.entanglerInputLayer, { opacity: travel.interpolate({ inputRange: [0, 0.48, 0.88, 1], outputRange: [1, 1, 0, 0] }) }]}> 
        <Animated.Image source={strange} resizeMode="contain" style={[styles.incomingLeft, { transform: [{ translateX: travel.interpolate({ inputRange: [0, 1], outputRange: [0, 63] }) }, { translateY: travel.interpolate({ inputRange: [0, 1], outputRange: [0, 54] }) }, { rotate: travel.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '220deg'] }) }] }]} />
        <Animated.Image source={strange} resizeMode="contain" style={[styles.incomingRight, { transform: [{ translateX: travel.interpolate({ inputRange: [0, 1], outputRange: [0, -63] }) }, { translateY: travel.interpolate({ inputRange: [0, 1], outputRange: [0, 54] }) }, { rotate: travel.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-220deg'] }) }] }]} />
        <Image accessibilityLabel="Entangler-2000" source={entangler} resizeMode="contain" style={styles.entangler} />
        <Animated.Text style={[styles.flash, { opacity: flash }]}>✦</Animated.Text>
        {!sent && <Text style={styles.tapHint}>{sending ? 'ENTANGLING...' : 'TAP THE ENTANGLER'}</Text>}
      </Animated.View>
      <Animated.Image accessibilityLabel="Entangler-2000 sends one strange quark to Box A and the other to Box B" source={entanglerToBoxes} resizeMode="contain" style={[styles.entanglerBoxesOverlay, { opacity: travel.interpolate({ inputRange: [0, 0.42, 0.9, 1], outputRange: [0, 0, 1, 1] }) }]} />
    </Pressable>
    {sent && <>
      <Text style={styles.body}>They get entangled. One goes into Box A and the other goes into Box B.</Text>
      <PrimaryButton label="Meet Alex and Barb" onPress={onComplete} />
    </>}
  </>;
}

export function AlexAndBarbSequence({ onComplete }: { onComplete: () => void }) {
  const [alexOpened, setAlexOpened] = useState(false);
  const [barbGuess, setBarbGuess] = useState<string>();
  const correctBarb = 'The strange with spin down';
  const barbResolved = barbGuess === correctBarb;

  const openAlex = () => {
    if (alexOpened) return;
    setAlexOpened(true);
  };

  return <>
    <Text style={[styles.body, styles.postActionIntro]}>This is Alex, and this is Barb.</Text>
    <Image accessibilityLabel="Alex and Barb" source={alexAndBarb} resizeMode="contain" style={styles.peopleIntro} />
    <Text style={styles.body}>We give Alex Box A and Barb Box B.</Text>
    {!alexOpened && <Text style={styles.tapInstruction}>Tap Alex’s box to open it.</Text>}
    <Pressable accessibilityRole="button" accessibilityLabel={alexOpened ? 'Alex’s box is open' : 'Tap Alex’s box to open it'} disabled={alexOpened} onPress={openAlex} style={({ pressed }) => [styles.boxTapTarget, pressed && styles.pressed]}>
      <Image accessibilityLabel={alexOpened ? 'Alex has opened Box A to reveal a spin-up strange while Barb keeps Box B closed' : 'Alex and Barb wait in separate rooms with their closed boxes'} source={alexOpened ? alexBarbRoomAlexUp : alexBarbRoomClosed} resizeMode="contain" style={styles.sharedRoomArtwork} />
    </Pressable>
    {alexOpened && <>
      <Text style={styles.keyPoint}>Alex opens Box A. The vertical spin result is up.</Text>
      <Text style={styles.prompt}>If Alex has the strange with spin up, what’s in Barb’s box?</Text>
      <View style={styles.answers}>{[correctBarb, 'The strange with spin up', 'We cannot tell'].map(option => <AnswerButton key={option} knowledgeKey="barb-pair" isCorrectAnswer={option === correctBarb} label={option} state={answerState(option, barbGuess, correctBarb)} disabled={barbResolved} onPress={() => setBarbGuess(option)} />)}</View>
      {barbGuess && !barbResolved && <Text style={styles.tryAgain}>Not quite. Remember what matching vertical measurements do for this pair.</Text>}
    </>}
    {barbResolved && <>
      <Image accessibilityLabel="Barb opens Box B and finds a spin-down strange" source={barbWithSpinDown} resizeMode="contain" style={styles.barbReveal} />
      <Text style={styles.body}>Because the strange quarks are entangled, measuring Barb’s strange along the same vertical direction gives the opposite result: down.</Text>
      <Text style={styles.kicker}>But here’s the kicker.</Text>
      <Text style={styles.body}>Before either box is opened, neither strange has its own definite vertical result in this joint state.</Text>
      <JointStateProbabilities />
      <Text style={styles.body}>Each local result is random: 50% up or 50% down. They weren’t chosen in advance, like the socks.</Text>
      <Text style={styles.body}>It can look as if Alex’s result chose Barb’s result. But Alex could not choose to get up, and Barb cannot use her local result to learn what happened in Alex’s room.</Text>
      <MysteryPanel number={4} title="Did Alex’s strange tell Barb’s strange what to do?" body="The results fit together, even though neither person can control their own result. Is there a secret instruction inside each box, or did a message travel between them?" />
      <PrimaryButton label="Hear a theory" onPress={onComplete} />
    </>}
  </>;
}

export function HiddenVariables({ onComplete }: { onComplete: () => void }) {
  return <>
    <Text style={styles.heading}>Here’s a theory</Text>
    <Text style={styles.body}>It’s called <Text style={styles.bold}>hidden variables</Text>.</Text>
    <Text style={styles.body}>One possible explanation is that each strange leaves the source with a private answer sheet: pre-written answers for every measurement direction.</Text>
    <Image accessibilityLabel="A strange quark looks at a private answer sheet with spin-up and spin-down instructions" source={instructionSheet} resizeMode="contain" style={styles.instructionSheet} />
    <Text style={styles.body}>If that were true, the answers would already exist before anyone measured, so nothing would need to travel between the boxes at measurement time.</Text>
    <Text style={styles.body}>One opposite-result direction cannot decide whether this explanation works. Next, we’ll test the idea using several measurement directions.</Text>
    <PrimaryButton label="Start the quiz" onPress={onComplete} />
  </>;
}

export function ClassicalCorrelationLesson({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  return <>
    <Text style={styles.body}>We know that if we entangle two quantum particles, such as two strange quarks, knowing one result can tell us the other.</Text>
    <EntangledPairPreview />
    <Text style={styles.body}>If one gives an up result along the chosen direction, the other gives down.</Text>
    <SockComparison onComplete={() => setStage(1)} />
    {stage >= 1 && <EntanglerSequence onComplete={() => setStage(2)} />}
    {stage >= 2 && <AlexAndBarbSequence onComplete={() => setStage(3)} />}
    {stage >= 3 && <HiddenVariables onComplete={onComplete} />}
  </>;
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.xl },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginBottom: 18 },
  bold: { fontWeight: '700' },
  heading: { color: colors.ink, fontFamily: fonts.display, fontSize: 34, lineHeight: 41, marginTop: spacing.xl, marginBottom: 12 },
  prompt: { color: colors.ink, fontFamily: fonts.display, fontSize: 27, lineHeight: 34, marginBottom: 14 },
  answers: { gap: 10 },
  feedback: { color: colors.green, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, marginTop: 14 },
  tryAgain: { color: colors.red, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, marginTop: 14 },
  entangledPair: { minHeight: 142, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  entangledStrange: { width: 126, height: 126 },
  probabilityPair: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginTop: -8, marginBottom: 20 },
  probabilityOutcome: { flex: 1, maxWidth: 166, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAF5EF', borderRadius: radii.lg, paddingVertical: 8, paddingHorizontal: 6 },
  probabilityStrange: { width: 93, height: 105 },
  probabilityValue: { color: colors.green, fontFamily: fonts.display, fontSize: 25, marginLeft: -7 },
  pairOfSocks: { width: '100%', height: 142, alignSelf: 'center', marginTop: -6, marginBottom: 12 },
  sockArtwork: { width: '100%', height: 225, alignSelf: 'center', marginVertical: 8, marginBottom: 18 },
  afterTerminologyAction: { marginTop: 24, marginBottom: 6 },
  keyPoint: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, backgroundColor: '#FFF0A6', borderRadius: radii.md, padding: 16, marginTop: 18, marginBottom: 14 },
  entanglerStage: { position: 'relative', height: 300, alignItems: 'center', justifyContent: 'flex-end', marginTop: 2, marginBottom: 22, overflow: 'hidden' },
  entanglerInputLayer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'flex-end' },
  entangler: { width: 205, height: 195 },
  incomingLeft: { position: 'absolute', left: 24, top: 4, width: 86, height: 86, zIndex: 2 },
  incomingRight: { position: 'absolute', right: 24, top: 4, width: 86, height: 86, zIndex: 2 },
  flash: { position: 'absolute', top: 80, color: colors.yellow, fontSize: 90, zIndex: 4 },
  tapHint: { color: colors.primary, fontFamily: fonts.display, fontSize: 17, letterSpacing: 1.1, marginTop: -8 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
  entanglerBoxes: { width: '100%', height: 285, alignSelf: 'center', marginTop: -5, marginBottom: 14 },
  entanglerBoxesOverlay: { position: 'absolute', top: 4, right: 0, bottom: 0, left: 0, width: '100%', height: 285 },
  postActionIntro: { marginTop: 30 },
  peopleIntro: { width: '100%', height: 218, alignSelf: 'center', marginTop: -2, marginBottom: 4 },
  tapInstruction: { color: colors.green, fontFamily: fonts.display, fontSize: 22, lineHeight: 28, textAlign: 'center', marginBottom: 4 },
  boxTapTarget: { minHeight: 260, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  sharedRoomArtwork: { width: '100%', height: 260, alignSelf: 'center' },
  barbReveal: { width: '100%', height: 260, alignSelf: 'center', marginTop: 18, marginBottom: 8 },
  kicker: { color: colors.red, fontFamily: fonts.display, fontSize: 39, lineHeight: 46, textAlign: 'center', marginTop: 24, marginBottom: 18, transform: [{ rotate: '-1deg' }] },
  instructionSheet: { width: '100%', height: 220, alignSelf: 'center', marginTop: -6, marginBottom: 18 },
});
