import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AnswerButton, type AnswerState } from './AnswerButton';
import { MysteryPanel } from './MysteryPanel';
import { PrimaryButton } from './PrimaryButton';
import { colors, fonts, radii, spacing } from '../constants/theme';

const entanglerToBoxes = require('../assets/module-3/lesson-3-all-entangled-up/entangler_pointing_to_boxes-transparent.png');
const alexAndBarbWithBoxes = require('../assets/module-3/lesson-3-all-entangled-up/alex-barb-room-closed-transparent.png');
const alexWithSpinUp = require('../assets/module-3/refinements/alex-spin-up.png');
const strangeInstructionSheet = require('../assets/module-3/refinements/instruction-sheet.png');
const speedOfLight = require('../assets/module-3/lesson-4-telepathy/speed-of-light-transparent.png');
const photon = require('../assets/lesson-9/photon-default-transparent.png');
const eye = require('../assets/lesson-5/eye-icon-transparent.png');
const lightRoom = require('../assets/module-3/lesson-4-telepathy/light-room-transparent.png');
const darkRoom = require('../assets/module-3/lesson-4-telepathy/dark-room-transparent.png');
const lightSwitchOff = require('../assets/module-3/lesson-4-telepathy/light-switch-off-transparent.png');
const lightSwitchOn = require('../assets/module-3/lesson-4-telepathy/light-switch-on-transparent.png');
const runningPhotonOne = require('../assets/module-3/lesson-4-telepathy/photon-running-1-transparent.png');
const runningPhotonTwo = require('../assets/module-3/lesson-4-telepathy/photon-running-2-transparent.png');
const sun = require('../assets/module-3/lesson-4-telepathy/sun-transparent.png');
const personLookingAtSun = require('../assets/module-3/lesson-4-telepathy/person-looking-at-sun-transparent.png');
const alexOnSpaceship = require('../assets/module-3/lesson-4-telepathy/alex-on-spaceship-transparent.png');
const barbOnEarth = require('../assets/module-3/lesson-4-telepathy/barb-on-earth-transparent.png');
const barbWithSpinDown = require('../assets/module-3/refinements/barb-spin-down-no-name.png');

function answerState(choice: string, selected: string | null, correct: string): AnswerState {
  if (!selected) return 'default';
  if (selected === correct && choice === correct) return 'correct';
  if (choice === selected) return 'incorrect';
  return 'default';
}

export function LightSwitchLab({ onComplete }: { onComplete: () => void }) {
  const [lightOn, setLightOn] = useState(false);
  const completed = useRef(false);

  const toggle = () => {
    setLightOn(value => !value);
    if (!completed.current) {
      completed.current = true;
      onComplete();
    }
  };

  return <View style={styles.switchLab}>
    <Image accessibilityLabel={`Room light is ${lightOn ? 'on' : 'off'}`} source={lightOn ? lightRoom : darkRoom} resizeMode="contain" style={styles.roomArt} />
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: lightOn }} accessibilityLabel="Room light switch" onPress={toggle} style={({ pressed }) => [styles.switchPressable, pressed && styles.pressed]}>
      <Image source={lightOn ? lightSwitchOn : lightSwitchOff} resizeMode="contain" style={styles.switchArt} />
      <Text style={styles.switchLabel}>TAP</Text>
    </Pressable>
  </View>;
}

function PhotonRunnerSprite({ style }: { style?: object }) {
  const gait = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(gait, { toValue: 1, duration: 170, useNativeDriver: true }),
      Animated.timing(gait, { toValue: 0, duration: 170, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [gait]);

  return <View style={[styles.photonRunner, style]}>
    <Animated.Image source={runningPhotonOne} resizeMode="contain" style={[styles.photonFrame, { opacity: gait.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]} />
    <Animated.Image source={runningPhotonTwo} resizeMode="contain" style={[styles.photonFrame, { opacity: gait }]} />
  </View>;
}

function RunningPhoton() {
  const run = useRef(new Animated.Value(0)).current;
  const [journeyWidth, setJourneyWidth] = useState(287);

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(run, { toValue: 1, duration: 2600, useNativeDriver: true }),
      Animated.timing(run, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [run]);

  return <View accessibilityLabel="A photon travelling from the Sun to the observer’s eye" onLayout={event => setJourneyWidth(event.nativeEvent.layout.width)} style={styles.starJourney}>
    <Image source={sun} resizeMode="contain" style={styles.sunArt} />
    <Animated.View style={[styles.runningPhoton, { transform: [{ translateX: run.interpolate({ inputRange: [0, 1], outputRange: [0, Math.max(60, journeyWidth - 151)] }) }, { translateY: run.interpolate({ inputRange: [0, 1], outputRange: [0, 9] }) }] }]}> 
      <PhotonRunnerSprite />
    </Animated.View>
    <Image source={personLookingAtSun} resizeMode="contain" style={styles.observerArt} />
  </View>;
}

function TeleportingPhoton() {
  const hop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(hop, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(hop, { toValue: 0, duration: 650, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [hop]);
  return <View accessibilityLabel="One photon suddenly alternates between the left and right without crossing the gap" style={styles.teleportDemo}>
    <Animated.Image source={photon} resizeMode="contain" style={[styles.teleportPhotonLeft, { opacity: hop.interpolate({ inputRange: [0, 0.48, 0.52, 1], outputRange: [1, 1, 0, 0] }) }]} />
    <Animated.Image source={photon} resizeMode="contain" style={[styles.teleportPhotonRight, { opacity: hop.interpolate({ inputRange: [0, 0.48, 0.52, 1], outputRange: [0, 0, 1, 1] }) }]} />
    <Text style={styles.cross}>✕</Text>
  </View>;
}

export function LightSpeedContext({ onComplete }: { onComplete: () => void }) {
  const [switchTried, setSwitchTried] = useState(false);
  const [teleportTried, setTeleportTried] = useState(false);

  return <View style={styles.contextCard}>
    <Text style={styles.contextHeading}>A light-speed lesson</Text>
    <Text style={styles.body}>When you turn on a light switch, it can feel as if the whole room changes instantly.</Text>
    <LightSwitchLab onComplete={() => setSwitchTried(true)} />

    {switchTried && <>
      <Text style={styles.body}>But light doesn’t just teleport from one place to another.</Text>
      {!teleportTried && <PrimaryButton label="Try teleporting the photon" onPress={() => setTeleportTried(true)} />}
      {teleportTried && <TeleportingPhoton />}
      {teleportTried && <>
        <Text style={styles.body}>That would skip every point in between. Real light travels across the space.</Text>
      </>}
    </>}

    {teleportTried && <>
      <Text style={styles.body}>You may have heard that the Sun you see is actually light from the Sun from about 8 minutes ago.</Text>
      <RunningPhoton />
      <Text style={styles.speedIntro}>Light travels at about:</Text>
      <Image accessibilityLabel="Three times ten to the eight metres per second" source={speedOfLight} resizeMode="contain" style={styles.speedValueArt} />
      <Text style={styles.body}>That is about 300,000 kilometres every second. Pretty fast!</Text>
      <Text style={styles.speedLimitCopy}>According to our best tested physics, nothing can travel faster than light.</Text>
      <PrimaryButton label="Ok" onPress={onComplete} />
    </>}
  </View>;
}

export function DistanceSlider({ onFar }: { onFar: () => void }) {
  const [distance, setDistance] = useState(0);
  const [sceneWidth, setSceneWidth] = useState(327);
  const trackWidth = useRef(1);
  const completed = useRef(false);
  const arrived = distance >= 0.96;

  const choose = (value: number) => {
    const next = Math.max(0, Math.min(1, value));
    setDistance(next);
    if (next >= 0.96 && !completed.current) {
      completed.current = true;
      onFar();
    }
  };

  return <View>
    <View accessibilityLabel={`Alex is ${Math.round(distance * 10)} million light-years from Barb`} onLayout={event => setSceneWidth(event.nativeEvent.layout.width)} style={styles.distanceScene}>
      <Image source={barbOnEarth} resizeMode="contain" style={styles.earthArt} />
      <Image source={alexOnSpaceship} resizeMode="contain" style={[styles.spaceshipArt, { transform: [{ translateX: distance * Math.max(0, sceneWidth - 174) }] }]} />
    </View>
    {!arrived && <><View accessibilityRole="adjustable" accessibilityLabel="Move Alex away from Earth"
      accessibilityValue={{ min: 0, max: 10, now: Math.round(distance * 10), text: `${Math.round(distance * 10)} million light-years` }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={event => choose(distance + (event.nativeEvent.actionName === 'increment' ? 0.2 : -0.2))}
      onLayout={event => { trackWidth.current = event.nativeEvent.layout.width; }}
      onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true} onResponderTerminationRequest={() => false}
      onResponderGrant={event => choose(event.nativeEvent.locationX / trackWidth.current)}
      onResponderMove={event => choose(event.nativeEvent.locationX / trackWidth.current)} style={styles.slider}>
      <View pointerEvents="none" style={styles.sliderTrack} />
      <View pointerEvents="none" style={[styles.sliderProgress, { width: `${distance * 92}%` }]} />
      <View pointerEvents="none" style={[styles.sliderThumb, { left: `${distance * 90 + 5}%` }]}><Text style={styles.sliderThumbText}>✦</Text></View>
    </View>
    <View style={styles.sliderLabels}><Text style={styles.sliderLabel}>EARTH</Text><Text style={styles.sliderLabel}>10 MILLION LIGHT-YEARS</Text></View></>}
  </View>;
}

export function SpaceRiddle({ onComplete }: { onComplete: () => void }) {
  const [farAway, setFarAway] = useState(false);
  const [opened, setOpened] = useState(false);
  const [barbGuess, setBarbGuess] = useState<string | null>(null);
  const correctGuess = 'Spin down';
  const barbRevealed = barbGuess === correctGuess;

  return <View style={styles.riddleSection}>
    <Text style={styles.riddleTitle}>Riddle me this.</Text>
    <Text style={styles.body}>Let’s send Alex on a spaceship 10 million light-years away from Barb on Earth.</Text>
    <Text style={styles.body}>Even light would need at least <Text style={styles.emphasis}>10 million years</Text> to travel between them. Slide Alex all the way out.</Text>
    <DistanceSlider onFar={() => setFarAway(true)} />

    {farAway && <Text style={styles.body}>Let’s open Alex’s box.</Text>}
    {farAway && !opened && <PrimaryButton label="Open Alex’s box" onPress={() => setOpened(true)} />}

    {opened && <>
      <Image accessibilityLabel="Alex opens Box A and records spin up" source={alexWithSpinUp} resizeMode="contain" style={styles.resultArt} />
      <Text style={styles.resultCallout}>Alex records spin up.</Text>
      <Text style={styles.guessPrompt}>What spin will Barb record when she opens Box B along the same vertical direction?</Text>
      <View style={styles.answerStack}>
        {['Spin up', 'Spin down', 'There is no way to predict the paired result'].map(choice => <AnswerButton key={choice} knowledgeKey="paired-spin" isCorrectAnswer={choice === correctGuess} label={choice} state={answerState(choice, barbGuess, correctGuess)} onPress={() => setBarbGuess(choice)} />)}
      </View>
      {barbGuess && !barbRevealed && <Text style={styles.tryAgain}>Not quite. Remember what matching directions revealed about this pair.</Text>}
    </>}

    {barbRevealed && <>
      <Text style={styles.correctGuess}>Exactly. One second later…</Text>
      <Image accessibilityLabel="Barb opens Box B and records spin down" source={barbWithSpinDown} resizeMode="contain" style={styles.resultArt} />
      <Text style={styles.butWait}>But wait…</Text>
      <Text style={styles.body}>Barb opened her box only one second later, and the shared state guaranteed her result would be down - far too soon for a light-speed signal to arrive from Alex.</Text>
      <Text style={styles.bigQuestion}>Does this mean quantum information can travel faster than light?</Text>
      <MysteryPanel number={5} title="Did information beat light?" body="Their results fit together across an enormous distance. Is anything actually travelling between the particles, or is there another explanation?" />
      <PrimaryButton label="Start the quiz" onPress={onComplete} />
    </>}
  </View>;
}

function RecapPair() {
  return <View accessibilityLabel="The entangler sends one strange quark to Alex and one to Barb" style={styles.recapArt}>
    <Image source={entanglerToBoxes} resizeMode="contain" style={styles.entanglerArt} />
    <Image accessibilityLabel="Alex with Box A and Barb with Box B" source={alexAndBarbWithBoxes} resizeMode="contain" style={styles.recapPeopleArt} />
  </View>;
}

export function TelepathyLesson({ onComplete }: { onComplete: () => void }) {
  const [contextComplete, setContextComplete] = useState(false);

  return <>
    <Text style={styles.body}>Here’s a refresher. We prepared two entangled strange quarks, put one in each box, and gave Box A to Alex and Box B to Barb.</Text>
    <RecapPair />
    <Text style={styles.body}>When they measured along the same vertical direction, their results were opposite. For example, Alex could record up while Barb recorded down.</Text>
    <View style={styles.oppositePair}>
      <Image accessibilityLabel="Alex records spin up" source={alexWithSpinUp} resizeMode="contain" style={styles.oppositeArt} />
      <Image accessibilityLabel="Barb records spin down" source={barbWithSpinDown} resizeMode="contain" style={styles.oppositeArt} />
    </View>
    <View style={styles.hiddenVariablesCard}>
      <Text style={styles.hiddenVariablesTitle}>Then we looked at hidden variables…</Text>
      <Text style={styles.cardBody}>A local hidden-variable model says that each particle leaves the source with a private list of pre-written answers for every measurement direction.</Text>
      <Image accessibilityLabel="A strange quark looking at a private answer sheet" source={strangeInstructionSheet} resizeMode="contain" style={styles.instructionSheetArt} />
      <Text style={styles.cardBody}>Alex’s choice would affect only Alex’s nearby result, and Barb’s choice would affect only hers. This is a proposal to test, not an established fact.</Text>
    </View>
    <Text style={styles.body}>But before that, there’s something even weirder to investigate. I’ll give you some context first.</Text>
    <LightSpeedContext onComplete={() => setContextComplete(true)} />
    {contextComplete && <SpaceRiddle onComplete={onComplete} />}
  </>;
}

const styles = StyleSheet.create({
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginBottom: 18 },
  emphasis: { color: colors.green, fontFamily: fonts.display },
  recapArt: { alignItems: 'center', marginTop: -8, marginBottom: 14 },
  entanglerArt: { width: '100%', height: 250 },
  recapPeopleArt: { width: '100%', height: 258, marginTop: -38 },
  oppositePair: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: -14, marginBottom: 20 },
  oppositeArt: { width: '49%', height: 190 },
  hiddenVariablesCard: { backgroundColor: '#FFF0A6', borderWidth: 2, borderStyle: 'dashed', borderColor: '#C9A02B', borderRadius: radii.lg, padding: 18, marginBottom: 24 },
  hiddenVariablesTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 25, lineHeight: 31, textAlign: 'center', marginBottom: 10 },
  cardBody: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, marginBottom: 10 },
  instructionSheetArt: { width: '100%', height: 190, marginVertical: 2 },
  eye: { position: 'absolute', right: 0, width: 64, height: 64 },
  contextCard: { backgroundColor: '#E8F1F7', borderWidth: 2, borderStyle: 'dashed', borderColor: '#6EA5C7', borderRadius: radii.lg, padding: 18, marginTop: 4, marginBottom: spacing.xl, overflow: 'hidden' },
  contextHeading: { color: '#2E739E', fontFamily: fonts.display, fontSize: 27, lineHeight: 34, textAlign: 'center', marginBottom: 15 },
  switchLab: { minHeight: 218, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: -5, marginBottom: 20 },
  roomArt: { flex: 1, minWidth: 0, maxWidth: 194, height: 205 },
  switchPressable: { width: 68, minHeight: 122, alignItems: 'center', justifyContent: 'center' },
  switchArt: { width: 68, height: 98 },
  switchLabel: { color: colors.ink, fontFamily: fonts.display, fontSize: 14, marginTop: 7 },
  pressed: { opacity: 0.58, transform: [{ scale: 0.96 }] },
  teleportDemo: { height: 104, marginVertical: 13, position: 'relative' },
  teleportPhotonLeft: { position: 'absolute', left: 12, top: 17, width: 70, height: 70 },
  teleportPhotonRight: { position: 'absolute', right: 12, top: 17, width: 70, height: 70 },
  travelDemo: { height: 96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 13, paddingHorizontal: 5 },
  solidTrack: { position: 'absolute', left: 28, right: 28, top: 48, borderTopWidth: 3, borderColor: '#6EA5C7' },
  travellingPhoton: { position: 'absolute', left: 3, width: 70, height: 70 },
  photonRunner: { width: '100%', height: '100%' },
  photonFrame: { position: 'absolute', width: '100%', height: '100%' },
  cross: { position: 'absolute', right: 4, top: 4, color: colors.red, fontFamily: fonts.display, fontSize: 43 },
  correctRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 10, marginBottom: 18 },
  tick: { color: colors.green, fontFamily: fonts.display, fontSize: 42 },
  correctText: { color: colors.ink, fontFamily: fonts.display, fontSize: 21 },
  starJourney: { height: 190, overflow: 'hidden', marginTop: -2, marginBottom: 20 },
  sunArt: { position: 'absolute', left: 0, top: 0, width: 116, height: 116 },
  runningPhoton: { position: 'absolute', left: 72, top: 50, width: 62, height: 74, alignItems: 'center' },
  observerArt: { position: 'absolute', right: 0, bottom: 0, width: 74, height: 134 },
  speedIntro: { color: '#2E739E', fontFamily: fonts.display, fontSize: 22, lineHeight: 29, textAlign: 'center' },
  speedValueArt: { width: '100%', height: 96, marginTop: -4, marginBottom: 6 },
  speedLimitCopy: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, textAlign: 'center', backgroundColor: colors.surface, borderRadius: radii.md, padding: 15, marginBottom: 20 },
  riddleSection: { marginTop: 6 },
  riddleTitle: { color: colors.red, fontFamily: fonts.display, fontSize: 43, lineHeight: 50, textAlign: 'center', marginBottom: 14 },
  distanceScene: { height: 192, overflow: 'hidden', marginBottom: 8 },
  earthArt: { position: 'absolute', left: -4, bottom: 0, width: 104, height: 164 },
  spaceshipArt: { position: 'absolute', left: 62, top: 18, width: 126, height: 88, zIndex: 2 },
  slider: { height: 40, justifyContent: 'center', marginHorizontal: 3, overflow: 'visible' },
  sliderTrack: { position: 'absolute', left: 14, right: 14, height: 7, borderRadius: 2, backgroundColor: '#B8D8C8', transform: [{ rotate: '-0.35deg' }] },
  sliderProgress: { position: 'absolute', left: 14, height: 7, borderRadius: 2, backgroundColor: colors.green, transform: [{ rotate: '0.45deg' }] },
  sliderThumb: { position: 'absolute', width: 30, height: 30, marginLeft: -15, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: '#F7FFF8', borderWidth: 3, borderColor: colors.green, transform: [{ rotate: '-3deg' }] },
  sliderThumbText: { color: colors.green, fontFamily: fonts.display, fontSize: 19 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7, marginBottom: 22 },
  sliderLabel: { maxWidth: '48%', color: colors.green, fontFamily: fonts.display, fontSize: 12, lineHeight: 16, letterSpacing: 0.5, textAlign: 'center' },
  resultArt: { width: '100%', height: 280, marginTop: 4 },
  resultCallout: { color: colors.green, fontFamily: fonts.display, fontSize: 29, lineHeight: 36, textAlign: 'center', marginTop: -13, marginBottom: 17 },
  guessPrompt: { color: colors.ink, fontFamily: fonts.display, fontSize: 27, lineHeight: 34, textAlign: 'center', marginBottom: 14 },
  answerStack: { gap: 10, marginBottom: 14 },
  tryAgain: { color: colors.red, fontFamily: fonts.body, fontSize: 20, lineHeight: 26, textAlign: 'center', marginBottom: 12 },
  correctGuess: { color: colors.green, fontFamily: fonts.display, fontSize: 25, textAlign: 'center', marginTop: 6 },
  butWait: { color: colors.red, fontFamily: fonts.display, fontSize: 43, lineHeight: 50, textAlign: 'center', marginTop: 2, marginBottom: 12 },
  bigQuestion: { color: colors.ink, fontFamily: fonts.display, fontSize: 29, lineHeight: 37, textAlign: 'center', marginBottom: 20 },
});
