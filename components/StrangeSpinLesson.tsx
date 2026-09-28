import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, PanResponder, Platform, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';
import { colors, fonts, radii, spacing } from '../constants/theme';

const electron = require('../assets/particles/electron-content.png');
const questionMark = require('../assets/module-2/lesson-3/question-mark-transparent.png');
const personProperties = require('../assets/module-2/lesson-7/person-properties-transparent.png');
const stairs = require('../assets/module-2/stairs-transparent.png');
const arrow = require('../assets/module-3/lesson-1/arrow-transparent.png');
const measurementAxes = require('../assets/module-3/lesson-1/vertical-horizontal-diagonal-slots-transparent.png');
const strangeDefault = require('../assets/module-3/lesson-1/strange-default-transparent.png');
const strangeHappy = require('../assets/module-3/lesson-1/strange-happy-transparent.png');
const strangeProperties = require('../assets/module-3/lesson-1/quark-properties-transparent.png');
const spinUpStrange = require('../assets/module-3/lesson-1/spin-up-quark-transparent.png');
const spinDownStrange = require('../assets/module-3/lesson-1/spin-down-quark-transparent.png');
const verticalSorter = require('../assets/module-3/lesson-1/vertical-spin-sorter-transparent.png');
const coinSlot = require('../assets/module-3/lesson-1/coin-slot-transparent.png');
const diagonalCoin = require('../assets/module-3/lesson-1/hand-with-diagonal-coin-transparent.png');
const verticalCoin = require('../assets/module-3/lesson-1/hand-with-vertical-coin-transparent.png');
const bubblegumMachine = require('../assets/module-3/lesson-1/bubblegum-machine-transparent.png');
const strangeWithCoin = require('../assets/module-3/lesson-1/strange-with-coin-transparent.png');
const bubblegumBlowing = require('../assets/module-3/lesson-1/bubblegum-blowing-transparent.png');
const bubblegumBalls: ImageSourcePropType[] = [
  require('../assets/module-3/lesson-1/bubblegum-blue-transparent.png'),
  require('../assets/module-3/lesson-1/bubblegum-green-transparent.png'),
  require('../assets/module-3/lesson-1/bubblegum-purple-transparent.png'),
  require('../assets/module-3/lesson-1/bubblegum-pink-transparent.png'),
  require('../assets/module-3/lesson-1/bubblegum-orange-transparent.png'),
  require('../assets/module-3/lesson-1/bubblegum-yellow-transparent.png'),
];

const rainbow = ['#E95D59', '#F19A3E', '#E5BF2C', '#4CA57F', '#429BD1', '#7654C8', '#C75AA3'];

function RainbowText({ children }: { children: string }) {
  return <Text>{[...children].map((letter, index) => <Text key={`${letter}-${index}`} style={{ color: rainbow[index % rainbow.length] }}>{letter}</Text>)}</Text>;
}

export function WorldThreeBridge() {
  const merge = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // This scene sits below the opening copy, so a one-shot animation could
    // finish before the learner reached it. Keep the merge gently replaying.
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(merge, { toValue: 1, duration: 1350, useNativeDriver: true }),
      Animated.timing(merge, { toValue: 1, duration: 850, useNativeDriver: true }),
      Animated.timing(merge, { toValue: 0, duration: 650, useNativeDriver: true }),
      Animated.timing(merge, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [merge]);
  return <View style={styles.section}>
    <Text style={styles.welcome}><RainbowText>Welcome back!</RainbowText></Text>
    <Text style={styles.body}><Text style={styles.bold}>Chapter 1:</Text> We saw that the quantum world is different from our everyday world.</Text>
    <Text style={styles.body}><Text style={styles.bold}>Chapter 2:</Text> We introduced some of the rules we see in the quantum world, but looked at quantum particles by themselves.</Text>
    <Text style={styles.body}><Text style={styles.bold}>Chapter 3:</Text> We’ll explore what happens when quantum systems combine. We’ll even get into things like teleportation. More on that later!</Text>
    <View accessibilityLabel="Two electrons move together and reveal a question mark" style={styles.mergeScene}>
      <Animated.Image source={electron} resizeMode="contain" style={[styles.mergingElectron, { opacity: merge.interpolate({ inputRange: [0, 0.66, 0.78, 1], outputRange: [1, 1, 0, 0] }), transform: [{ translateX: merge.interpolate({ inputRange: [0, 0.66, 1], outputRange: [-94, 0, 0] }) }] }]} />
      <Animated.Image source={electron} resizeMode="contain" style={[styles.mergingElectron, { opacity: merge.interpolate({ inputRange: [0, 0.66, 0.78, 1], outputRange: [1, 1, 0, 0] }), transform: [{ translateX: merge.interpolate({ inputRange: [0, 0.66, 1], outputRange: [94, 0, 0] }) }] }]} />
      <Animated.Image source={questionMark} resizeMode="contain" style={[styles.mergeQuestion, { opacity: merge.interpolate({ inputRange: [0, 0.75, 1], outputRange: [0, 0, 1] }), transform: [{ scale: merge.interpolate({ inputRange: [0.75, 1], outputRange: [0.5, 1], extrapolate: 'clamp' }) }] }]} />
    </View>
    <Text style={styles.body}>Before we do that, let’s meet a new friend and unlock a new characteristic about quantum particles.</Text>
    <Text style={styles.meet}>Say hello to our new friend,</Text>
    <Text style={styles.strangeName}>the strange quark</Text>
    <StrangeCurtainReveal />
    <Text style={styles.body}>What a funny name… You can learn more about why it’s called that in later modules.</Text>
    <Text style={styles.body}>For now, it is just another one of our elementary particles.</Text>
    <Text style={styles.body}>I’ll call it <Text style={styles.bold}>strange</Text> for short.</Text>
  </View>;
}

export function FloatingStrange({ compact = false }: { compact?: boolean }) {
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(float, { toValue: 0, duration: 1000, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [float]);
  return <Animated.Image accessibilityLabel="Strange quark floating" source={strangeDefault} resizeMode="contain" style={[styles.floatingStrange, compact && styles.floatingStrangeCompact, { transform: [{ translateY: float.interpolate({ inputRange: [0, 1], outputRange: [5, -7] }) }] }]} />;
}

export function StrangeCurtainReveal() {
  const curtain = useRef(new Animated.Value(0)).current;
  const [revealed, setRevealed] = useState(false);
  const revealing = useRef(false);
  const curtainAnimation = useRef<Animated.CompositeAnimation | null>(null);
  useEffect(() => () => curtainAnimation.current?.stop(), []);
  const finishReveal = () => {
    if (revealing.current) return;
    revealing.current = true;
    curtainAnimation.current = Animated.timing(curtain, { toValue: -1, duration: 380, useNativeDriver: true });
    curtainAnimation.current.start(({ finished }) => {
      if (finished) setRevealed(true);
    });
  };
  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 3,
    onPanResponderMove: (_, gesture) => { if (!revealing.current) curtain.setValue(Math.max(-0.92, Math.min(0, gesture.dx / 140))); },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -18 || gesture.vx < -0.25) finishReveal();
      else Animated.spring(curtain, { toValue: 0, useNativeDriver: true }).start();
    },
    onPanResponderTerminationRequest: () => false,
    onPanResponderTerminate: () => { if (!revealing.current) Animated.spring(curtain, { toValue: 0, useNativeDriver: true }).start(); },
  })).current;

  return <View accessibilityLabel="A curtain hides the strange quark" style={styles.curtainStage}>
    <FloatingStrange compact />
    {!revealed && <Animated.View
      accessibilityRole="button"
      accessibilityLabel="Swipe the curtain left to reveal the strange quark"
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={finishReveal}
      {...responder.panHandlers}
      style={[styles.curtain, { transform: [{ translateX: curtain.interpolate({ inputRange: [-1, 0], outputRange: [-330, 0] }) }] }]}
    >
      <View style={styles.curtainPleats} />
      <View style={[styles.curtainPleats, styles.curtainPleatTwo]} />
      <View style={[styles.curtainPleats, styles.curtainPleatThree]} />
      <Text style={styles.curtainHint}>SWIPE THE CURTAIN  ←</Text>
    </Animated.View>}
  </View>;
}

function NewProperty() {
  const turn = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.timing(turn, { toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web' }));
    animation.start();
    return () => animation.stop();
  }, [turn]);
  return <View style={styles.section}>
    <Text style={styles.heading}>A new property</Text>
    <Text style={styles.body}>People have properties such as a name, mass and a favourite colour.</Text>
    <Image accessibilityLabel="A person’s example properties" source={personProperties} resizeMode="contain" style={styles.personProperties} />
    <Text style={styles.body}>Elementary particles also have features we can identify them by. Their name, their mass, and another one is <Text style={styles.bold}>spin</Text>.</Text>
    <Image accessibilityLabel="The strange quark’s properties" source={strangeProperties} resizeMode="contain" style={styles.quarkProperties} />
    <View style={styles.spinMyth}>
      <Animated.Image accessibilityLabel="Happy strange quark rotating" source={strangeHappy} resizeMode="contain" style={[styles.spinningStrange, { transform: [{ rotate: turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }]} />
      <View style={styles.notQuiteStamp}><Text style={styles.notQuiteText}>NOT QUITE</Text></View>
    </View>
    <Text style={styles.body}>Spin sounds like it’s something about a particle rotating around. But it’s actually a property that’s built into it, like your favourite colour.</Text>
    <TerminologyCard term="Spin" definition="A built-in quantum property of a particle, not a tiny ball physically rotating." />
  </View>;
}

export function ContinuousSpinArrow({ onComplete }: { onComplete: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const displayedValue = useRef(0);
  const [value, setValue] = useState(0);
  const [turned, setTurned] = useState(false);
  useEffect(() => () => animation.current?.stop(), []);
  useEffect(() => {
    if (typeof progress.addListener !== 'function') return;
    const listener = progress.addListener(({ value: nextValue }) => {
      const rounded = Math.max(0, Math.min(1, Math.round(nextValue * 100) / 100));
      if (rounded === displayedValue.current) return;
      displayedValue.current = rounded;
      setValue(rounded);
    });
    return () => progress.removeListener(listener);
  }, [progress]);
  const turnArrow = () => {
    setTurned(false);
    displayedValue.current = 0;
    setValue(0);
    progress.setValue(0);
    animation.current = Animated.timing(progress, { toValue: 1, duration: 2200, useNativeDriver: true });
    animation.current.start(({ finished }) => { if (finished) setTurned(true); });
  };
  return <View style={styles.section}>
    <Text style={styles.heading}>How can we describe spin?</Text>
    <Text style={styles.body}>Your favourite colour is simple. <Text style={{ color: '#E85CAB' }}>Pink</Text>, <Text style={{ color: '#3D91D4' }}>blue</Text>, <Text style={{ color: '#D85F57' }}>red</Text>, <Text style={{ color: '#D4A900' }}>yellow</Text>... the list goes on. But spin is something we describe a little differently. Let’s look at it in terms of an arrow.</Text>
    <Text style={styles.body}>Say the arrow pointing up is 0, and the arrow pointing down is 1.</Text>
    <View accessibilityLabel={`An arrow turning continuously from 0 up to ${value.toFixed(2)} on its way to 1 down`} style={styles.arrowDemo}>
      <Text style={[styles.arrowEndpoint, styles.arrowZero]}>0</Text>
      <Animated.Image source={arrow} resizeMode="contain" style={[styles.arrow, { transform: [{ rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }]} />
      <Text style={[styles.arrowEndpoint, styles.arrowOne]}>1</Text>
      <View style={styles.valueReadout}>
        <Text style={styles.valueLabel}>VALUE</Text>
        <Text style={styles.valueNumber}>{value === 0 || value === 1 ? value.toFixed(0) : value.toFixed(2)}</Text>
      </View>
    </View>
    <Text style={styles.body}>If the arrow turns between them, it passes through every direction in between. We could label those in-between directions with decimal numbers.</Text>
    {!turned ? <PrimaryButton label="Turn the arrow" onPress={turnArrow} /> : <>
      <Text style={styles.keyPoint}>These are continuous values. There are lots of in-between directions.</Text>
      <PrimaryButton label="Got it" onPress={onComplete} />
    </>}
  </View>;
}

const resultAxes = [
  { label: 'VERTICAL', rotations: ['0deg', '180deg'] },
  { label: 'HORIZONTAL', rotations: ['-90deg', '90deg'] },
  { label: 'DIAGONAL', rotations: ['45deg', '225deg'] },
] as const;

function SpinResultDirections() {
  return <View accessibilityLabel="Vertical up and down, horizontal left and right, and diagonal opposite spin results" style={styles.resultAxes}>
    {resultAxes.map(axis => <View key={axis.label} style={styles.resultAxisCard}>
      <Text style={styles.resultAxisLabel}>{axis.label}</Text>
      <View style={styles.resultAxisPair}>
        {axis.rotations.map(rotation => <Image key={rotation} source={arrow} resizeMode="contain" style={[styles.resultAxisArrow, { transform: [{ rotate: rotation }] }]} />)}
      </View>
    </View>)}
  </View>;
}

function QuantisedSpin() {
  return <View style={styles.section}>
    <Text style={styles.body}>Spin is a property, like the energy we saw in Chapter 2, that is <Text style={styles.rainbowInline}><RainbowText>quantised</RainbowText></Text>.</Text>
    <Image accessibilityLabel="Steps showing quantised values" source={stairs} resizeMode="contain" style={styles.stairs} />
    <Text style={styles.body}>Physicists choose one direction to measure along. This could be vertical, horizontal or diagonal.</Text>
    <Image accessibilityLabel="Vertical, horizontal and diagonal measurement direction slots" source={measurementAxes} resizeMode="contain" style={styles.measurementAxes} />
    <Text style={styles.body}>A spin measurement has only two allowed results along the chosen direction. For a vertical measurement, the result is up or down. For a horizontal measurement, it is left or right. There is no in-between measurement result.</Text>
    <SpinResultDirections />
  </View>;
}

export function VerticalStrangeSorter({ onComplete }: { onComplete: () => void }) {
  const travel = useRef(new Animated.Value(0)).current;
  const drag = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const finishedRef = useRef(false);
  const [sorted, setSorted] = useState(false);
  useEffect(() => () => animation.current?.stop(), []);
  const run = () => {
    if (finishedRef.current) return;
    travel.setValue(0);
    drag.setValue(0);
    animation.current = Animated.timing(travel, { toValue: 1, duration: 1250, useNativeDriver: true });
    animation.current.start(({ finished }) => {
      if (!finished || finishedRef.current) return;
      finishedRef.current = true;
      setSorted(true);
      onComplete();
    });
  };
  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !finishedRef.current,
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 7,
    onPanResponderMove: (_, gesture) => drag.setValue(Math.max(0, Math.min(74, gesture.dx))),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 42) run();
      else Animated.spring(drag, { toValue: 0, useNativeDriver: true }).start();
    },
  })).current;
  return <View style={styles.section}>
    <Text style={styles.body}>Swipe these strange quarks through this <Text style={styles.bold}>vertical</Text> spin sorter to see what results we get.</Text>
    <View accessibilityLabel="Two strange quarks pass through a vertical spin sorter and emerge from its two tubes" style={styles.sorterScene}>
      <Animated.View
        accessibilityRole="button"
        accessibilityLabel="Swipe the strange quarks into the vertical slit"
        accessibilityActions={[{ name: 'activate' }]}
        onAccessibilityAction={run}
        {...responder.panHandlers}
        style={[styles.incomingStranges, { opacity: travel.interpolate({ inputRange: [0, 0.46, 0.6, 1], outputRange: [1, 1, 0, 0] }), transform: [{ translateX: drag }, { translateX: travel.interpolate({ inputRange: [0, 0.58, 1], outputRange: [0, 92, 92] }) }, { scale: travel.interpolate({ inputRange: [0, 0.58, 1], outputRange: [1, 0.34, 0.34] }) }] }]}> 
        <Image source={strangeDefault} resizeMode="contain" style={styles.incomingStrange} />
        <Image source={strangeDefault} resizeMode="contain" style={styles.incomingStrange} />
      </Animated.View>
      <Image accessibilityLabel="Vertical spin sorter" source={verticalSorter} resizeMode="contain" style={styles.sorter} />
      <Animated.View style={[styles.sortedResults, { opacity: travel.interpolate({ inputRange: [0, 0.55, 0.68, 1], outputRange: [0, 0, 1, 1] }) }]}> 
        <Animated.View style={[styles.result, styles.upResult, { transform: [{ translateX: travel.interpolate({ inputRange: [0.56, 1], outputRange: [-18, 34], extrapolate: 'clamp' }) }, { translateY: travel.interpolate({ inputRange: [0.56, 1], outputRange: [15, -8], extrapolate: 'clamp' }) }] }]}><Image accessibilityLabel="Spin up strange quark" source={spinUpStrange} resizeMode="contain" style={styles.resultImage} /><Text style={styles.resultLabel}>UP</Text></Animated.View>
        <Animated.View style={[styles.result, styles.downResult, { transform: [{ translateX: travel.interpolate({ inputRange: [0.56, 1], outputRange: [-18, 34], extrapolate: 'clamp' }) }, { translateY: travel.interpolate({ inputRange: [0.56, 1], outputRange: [-15, 8], extrapolate: 'clamp' }) }] }]}><Image accessibilityLabel="Spin down strange quark" source={spinDownStrange} resizeMode="contain" style={styles.resultImage} /><Text style={styles.resultLabel}>DOWN</Text></Animated.View>
      </Animated.View>
      {!sorted && <Text style={styles.swipeHint}>SWIPE INTO THE SLIT  →</Text>}
    </View>
    {sorted && <Text style={styles.plainResult}>The sorter makes two groups: spin up and spin down along the vertical direction.</Text>}
  </View>;
}

function SpinFlow() {
  return <View style={styles.section}>
    <View style={styles.flowStep}><Text style={styles.flowText}>Spin is a built-in property</Text></View>
    <Text style={styles.flowArrow}>↓</Text>
    <View style={styles.flowStep}><Text style={styles.flowText}>Choose a measurement direction</Text></View>
    <Text style={styles.flowArrow}>↓</Text>
    <View style={styles.flowStep}><Text style={styles.flowText}>Two allowed results</Text></View>
  </View>;
}

export function BubblegumAnalogy({ onComplete }: { onComplete: () => void }) {
  const [vertical, setVertical] = useState(false);
  const [dispensed, setDispensed] = useState(false);
  const [ballIndex, setBallIndex] = useState(0);
  const [gumSceneWidth, setGumSceneWidth] = useState(327);
  const gum = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const completed = useRef(false);
  const hasSelectedBall = useRef(false);
  useEffect(() => () => animation.current?.stop(), []);
  const dispense = () => {
    const next = !hasSelectedBall.current
      ? Math.floor(Math.random() * bubblegumBalls.length)
      : bubblegumBalls.length === 1
        ? 0
        : (ballIndex + 1 + Math.floor(Math.random() * (bubblegumBalls.length - 1))) % bubblegumBalls.length;
    hasSelectedBall.current = true;
    setBallIndex(next);
    setDispensed(false);
    gum.setValue(0);
    animation.current = Animated.timing(gum, { toValue: 1, duration: 1050, useNativeDriver: true });
    animation.current.start(({ finished }) => {
      if (!finished) return;
      setDispensed(true);
      if (!completed.current) { completed.current = true; onComplete(); }
    });
  };
  return <View style={styles.section}>
    <Text style={styles.body}>You see, it’s kind of like a coin slot. If you try to put a coin in any direction other than the one it accepts, it won’t fit. You won’t be able to pay for your bubble gum.</Text>
    <View accessibilityLabel={`Coin held ${vertical ? 'vertically' : 'diagonally'} beside a vertical coin slot`} style={styles.coinScene}>
      <Image source={coinSlot} resizeMode="contain" style={styles.coinSlot} />
      <Image source={vertical ? verticalCoin : diagonalCoin} resizeMode="contain" style={styles.coinHand} />
    </View>
    {!vertical && <PrimaryButton label="Turn the coin" onPress={() => setVertical(true)} />}
    {vertical && <>
      <Text style={styles.plainResult}>Now the coin matches the direction of the slot.</Text>
      <SpinFlow />
      <View accessibilityLabel="Strange quark uses a bubble gum machine" onLayout={event => setGumSceneWidth(event.nativeEvent.layout.width)} style={styles.gumScene}>
        <Animated.Image source={strangeWithCoin} resizeMode="contain" style={[styles.strangeCoin, { transform: [{ translateX: gum.interpolate({ inputRange: [0, 0.58, 1], outputRange: [0, gumSceneWidth * 0.28, gumSceneWidth * 0.28] }) }, { translateY: gum.interpolate({ inputRange: [0, 0.58, 1], outputRange: [0, -5, -5] }) }] }]} />
        <Image source={bubblegumMachine} resizeMode="contain" style={styles.gumMachine} />
        <Animated.Image accessibilityLabel="A randomly coloured bubble gum ball falls out" source={bubblegumBalls[ballIndex]} resizeMode="contain" style={[styles.fallingGum, { opacity: gum.interpolate({ inputRange: [0, 0.55, 0.7, 1], outputRange: [0, 0, 1, 1] }), transform: [{ translateY: gum.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 0, 56] }) }] }]} />
      </View>
      <PrimaryButton label={dispensed ? 'Get another colour' : 'Pay for bubble gum'} secondary={dispensed} onPress={dispense} />
    </>}
  </View>;
}

function QuizBubble({ onComplete }: { onComplete: () => void }) {
  const bubble = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(bubble, { toValue: 1, duration: 1250, useNativeDriver: true }),
      Animated.timing(bubble, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [bubble]);
  return <View style={styles.quizFinish}>
    <PrimaryButton label="Start the quiz" onPress={onComplete} />
    <View accessibilityLabel="Strange quark blowing a growing bubble gum bubble" style={styles.bubbleFriend}>
      <Image source={strangeHappy} resizeMode="contain" style={styles.bubbleStrange} />
      <Animated.Image source={bubblegumBlowing} resizeMode="contain" style={[styles.blowingBubble, { opacity: bubble.interpolate({ inputRange: [0, 0.18, 1], outputRange: [0, 1, 1] }), transform: [{ scale: bubble.interpolate({ inputRange: [0, 1], outputRange: [0.18, 1] }) }] }]} />
    </View>
  </View>;
}

export function StrangeSpinLesson({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  return <>
    <WorldThreeBridge />
    <NewProperty />
    <ContinuousSpinArrow onComplete={() => setStage(1)} />
    {stage >= 1 && <><QuantisedSpin /><VerticalStrangeSorter onComplete={() => setStage(2)} /></>}
    {stage >= 2 && <BubblegumAnalogy onComplete={() => setStage(3)} />}
    {stage >= 3 && <QuizBubble onComplete={onComplete} />}
  </>;
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  welcome: { fontFamily: fonts.display, fontSize: 39, lineHeight: 46, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  heading: { color: colors.ink, fontFamily: fonts.display, fontSize: 31, lineHeight: 38, marginTop: 16, marginBottom: 12 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginBottom: 18 },
  bold: { fontFamily: fonts.display, fontWeight: '700' },
  mergeScene: { height: 210, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 14 },
  mergingElectron: { position: 'absolute', width: 98, height: 98 },
  mergeQuestion: { position: 'absolute', width: 82, height: 116 },
  meet: { color: colors.ink, fontFamily: fonts.body, fontSize: 24, textAlign: 'center', marginTop: 5 },
  strangeName: { color: '#35A66C', fontFamily: fonts.display, fontSize: 36, lineHeight: 44, fontWeight: '700', textAlign: 'center', textShadowColor: 'rgba(76, 165, 127, 0.58)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 },
  curtainStage: { height: 205, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', marginTop: 8, marginBottom: 18, overflow: 'hidden', borderRadius: radii.lg, backgroundColor: '#E8F5EE' },
  floatingStrange: { width: 230, height: 220, alignSelf: 'center', marginVertical: 4 },
  floatingStrangeCompact: { width: 168, height: 162, marginVertical: 0 },
  curtain: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center', backgroundColor: '#A65C78', borderWidth: 3, borderColor: '#6D3854', borderRadius: radii.lg, overflow: 'hidden' },
  curtainPleats: { position: 'absolute', top: 0, bottom: 0, left: '24%', width: 4, backgroundColor: 'rgba(255,255,255,0.22)', transform: [{ rotate: '-1deg' }] },
  curtainPleatTwo: { left: '49%', transform: [{ rotate: '1deg' }] },
  curtainPleatThree: { left: '74%', transform: [{ rotate: '-1deg' }] },
  curtainHint: { color: colors.white, fontFamily: fonts.display, fontSize: 19, letterSpacing: 1, textAlign: 'center', textShadowColor: '#6D3854', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1 },
  personProperties: { width: '100%', height: 220, alignSelf: 'center', marginTop: -10, marginBottom: 8 },
  quarkProperties: { width: '100%', height: 265, alignSelf: 'center', marginTop: -2, marginBottom: 18 },
  spinMyth: { height: 220, alignItems: 'center', justifyContent: 'center' },
  spinningStrange: { width: 178, height: 172 },
  notQuiteStamp: { position: 'absolute', right: 10, bottom: 18, borderWidth: 3, borderColor: colors.red, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, transform: [{ rotate: '-9deg' }] },
  notQuiteText: { color: colors.red, fontFamily: fonts.display, fontSize: 20, letterSpacing: 1.3 },
  arrowDemo: { height: 285, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F5EE', borderRadius: radii.lg, marginBottom: 18, overflow: 'hidden' },
  arrow: { width: 68, height: 136 },
  arrowEndpoint: { position: 'absolute', left: '50%', marginLeft: -10, color: colors.green, fontFamily: fonts.display, fontSize: 25, lineHeight: 30 },
  arrowZero: { top: 10 },
  arrowOne: { bottom: 10 },
  valueReadout: { position: 'absolute', right: 24, minWidth: 72, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 9, paddingVertical: 8, backgroundColor: '#FFFDF7', borderWidth: 2, borderColor: colors.green, borderRadius: radii.md },
  valueLabel: { color: colors.green, fontFamily: fonts.display, fontSize: 12, letterSpacing: 0.8 },
  valueNumber: { color: colors.ink, fontFamily: fonts.display, fontSize: 27, lineHeight: 32, fontVariant: ['tabular-nums'] },
  keyPoint: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, backgroundColor: '#FFF0A6', borderRadius: radii.md, padding: 16, marginBottom: 16 },
  rainbowInline: { fontFamily: fonts.display, fontWeight: '700' },
  stairs: { width: '100%', height: 245, alignSelf: 'center', marginTop: -5, marginBottom: 18 },
  measurementAxes: { width: '92%', height: 138, alignSelf: 'center', marginTop: -8, marginBottom: 20 },
  resultAxes: { flexDirection: 'row', gap: 8, marginTop: -2, marginBottom: 20 },
  resultAxisCard: { flex: 1, minHeight: 112, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, backgroundColor: '#FFFDF7', borderWidth: 2, borderColor: colors.green, borderRadius: radii.md },
  resultAxisLabel: { color: colors.green, fontFamily: fonts.display, fontSize: 12, letterSpacing: 0.5, marginBottom: 7 },
  resultAxisPair: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  resultAxisArrow: { width: 23, height: 47 },
  sorterScene: { height: 245, overflow: 'hidden', marginBottom: 12 },
  incomingStranges: { position: 'absolute', left: 1, top: 94, zIndex: 4, flexDirection: 'row', gap: -13, padding: 5 },
  incomingStrange: { width: 56, height: 54 },
  sorter: { position: 'absolute', left: '32%', top: 55, width: 155, height: 140, zIndex: 2 },
  sortedResults: { position: 'absolute', left: '60%', right: -4, top: 7, height: 229 },
  result: { position: 'absolute', width: 92, alignItems: 'center' },
  upResult: { top: 4 },
  downResult: { bottom: 1 },
  resultImage: { width: 74, height: 84 },
  resultLabel: { color: colors.green, fontFamily: fonts.display, fontSize: 16, marginTop: -7 },
  swipeHint: { position: 'absolute', left: 10, bottom: 7, color: colors.green, fontFamily: fonts.display, fontSize: 14, letterSpacing: 0.7 },
  plainResult: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, marginTop: 10, marginBottom: 18, textAlign: 'center' },
  flowStep: { width: '88%', alignSelf: 'center', minHeight: 60, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, borderWidth: 2, borderColor: colors.green, borderRadius: 18, backgroundColor: '#E8F5EE' },
  flowText: { color: colors.ink, fontFamily: fonts.display, fontSize: 22, lineHeight: 27, textAlign: 'center' },
  flowArrow: { color: colors.green, fontFamily: fonts.display, fontSize: 31, lineHeight: 36, textAlign: 'center' },
  coinScene: { height: 236, alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden' },
  coinSlot: { position: 'absolute', right: 51, width: 94, height: 171 },
  coinHand: { position: 'absolute', left: 2, width: 223, height: 158 },
  gumScene: { height: 260, marginTop: 8, marginBottom: 15, overflow: 'hidden' },
  strangeCoin: { position: 'absolute', left: 0, bottom: 34, width: '56%', height: 156, zIndex: 2 },
  gumMachine: { position: 'absolute', right: 0, top: 0, width: '46%', height: 250 },
  fallingGum: { position: 'absolute', right: 61, top: 180, width: 34, height: 34, zIndex: 3 },
  quizFinish: { marginTop: 4, marginBottom: spacing.xl },
  bubbleFriend: { height: 230, alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  bubbleStrange: { width: 205, height: 198 },
  blowingBubble: { position: 'absolute', top: 120, width: 68, height: 68 },
});
