import { useEffect, useRef, useState } from 'react';
import { Animated, Image, PanResponder, StyleSheet, Text, View } from 'react-native';
import { AnswerButton } from './AnswerButton';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';
import { colors, fonts, radii, spacing } from '../constants/theme';

const aAndBCloud = require('../assets/module-2/lesson-5/state-a-and-b-centered-transparent.png');
const outcomeA = require('../assets/module-2/lesson-6/outcome-a-transparent.png');
const outcomeB = require('../assets/module-2/lesson-6/outcome-b-transparent.png');
const schrodingerAndCat = require('../assets/module-2/lesson-7/cat/schrodinger-and-cat-transparent.png');
const catStanding = require('../assets/module-2/lesson-7/cat/cat-standing-transparent.png');
const catLifted = require('../assets/module-2/lesson-7/cat/cat-lifted-transparent.png');
const emptyBigBox = require('../assets/module-2/lesson-7/cat/empty-big-box-transparent.png');
const boxWithCat = require('../assets/module-2/lesson-7/cat/box-with-cat-transparent.png');
const boxWithTape = require('../assets/module-2/lesson-7/cat/box-with-tape-transparent.png');
const apparatusReady = require('../assets/module-2/lesson-7/cat/apparatus-ready-transparent.png');
const apparatusBlink = require('../assets/module-2/lesson-7/cat/apparatus-blink-transparent.png');
const apparatusAlive = require('../assets/module-2/lesson-7/cat/apparatus-alive-transparent.png');
const apparatusDead = require('../assets/module-2/lesson-7/cat/apparatus-dead-transparent.png');
const apparatusHuman = require('../assets/module-2/lesson-7/cat/apparatus-human-transparent.png');
const einsteinUnhappy = require('../assets/module-2/lesson-7/cat/einstein-unhappy-transparent.png');

function ShakingWord() {
  const shake = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 80, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 80, useNativeDriver: true }),
      Animated.delay(850),
    ]));
    loop.start();
    return () => loop.stop();
  }, [shake]);
  return <Animated.Text style={[styles.shakingWord, { transform: [{ translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-4, 4] }) }, { rotate: shake.interpolate({ inputRange: [-1, 1], outputRange: ['-2deg', '2deg'] }) }] }]}>shake</Animated.Text>;
}

export function CatBoxSetup({ onComplete, onScrollLock }: { onComplete: () => void; onScrollLock?: (locked: boolean) => void }) {
  const [placed, setPlaced] = useState(false);
  const [sealed, setSealed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const catDrag = useRef(new Animated.ValueXY()).current;
  const tapeDrag = useRef(new Animated.Value(0)).current;
  const tapeLimit = useRef(130);
  const completed = useRef(false);
  const alive = useRef(true);
  const callbacks = useRef({ onComplete, onScrollLock });
  callbacks.current = { onComplete, onScrollLock };
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; catDrag.stopAnimation(); tapeDrag.stopAnimation(); callbacks.current.onScrollLock?.(false); };
  }, [catDrag, tapeDrag]);
  const releaseScroll = () => callbacks.current.onScrollLock?.(false);
  const catResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 3,
    onPanResponderGrant: () => { catDrag.stopAnimation(); setDragging(true); callbacks.current.onScrollLock?.(true); },
    onPanResponderMove: (_, gesture) => catDrag.setValue({ x: Math.max(0, gesture.dx), y: gesture.dy }),
    onPanResponderRelease: (_, gesture) => {
      setDragging(false); releaseScroll();
      if (gesture.dx > 105) { setPlaced(true); catDrag.setValue({ x: 0, y: 0 }); }
      else Animated.spring(catDrag, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
    },
    onPanResponderTerminate: () => { setDragging(false); catDrag.setValue({ x: 0, y: 0 }); releaseScroll(); },
    onPanResponderTerminationRequest: () => false,
  })).current;
  const tapeResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !completed.current,
    onMoveShouldSetPanResponder: (_, gesture) => !completed.current && Math.abs(gesture.dx) > 3,
    onPanResponderGrant: () => { if (completed.current) return; tapeDrag.stopAnimation(); tapeDrag.setValue(0); callbacks.current.onScrollLock?.(true); },
    onPanResponderMove: (_, gesture) => { if (!completed.current) tapeDrag.setValue(Math.max(0, Math.min(tapeLimit.current, gesture.dx))); },
    onPanResponderRelease: (_, gesture) => {
      releaseScroll();
      if (completed.current) return;
      if (gesture.dx > 90) {
        completed.current = true;
        Animated.timing(tapeDrag, { toValue: tapeLimit.current, duration: 160, useNativeDriver: false }).start(({ finished }) => {
          if (!alive.current || !finished) return;
          setSealed(true); callbacks.current.onComplete();
        });
      } else Animated.spring(tapeDrag, { toValue: 0, useNativeDriver: false }).start();
    },
    onPanResponderTerminate: () => { if (!completed.current) { tapeDrag.stopAnimation(); tapeDrag.setValue(0); } releaseScroll(); },
    onPanResponderTerminationRequest: () => false,
  })).current;
  return <View style={styles.setupSection}>
    <Text style={styles.instruction}>1. Put the cat in the box!</Text>
    <View style={styles.catBoxStage}>
      {!placed && <Animated.View accessibilityLabel={dragging ? 'Cat being lifted towards the box' : 'Standing cat, drag towards the box'} style={[styles.dragCat, { transform: catDrag.getTranslateTransform() }]} {...catResponder.panHandlers}>
        <Image source={dragging ? catLifted : catStanding} resizeMode="contain" style={styles.dragCatImage} />
        <Text style={styles.dragHint}>drag me</Text>
      </Animated.View>}
      <Image accessibilityLabel={sealed ? 'Sealed box containing the cat' : placed ? 'Open box containing the cat' : 'Empty open cardboard box'} source={sealed ? boxWithTape : placed ? boxWithCat : emptyBigBox} resizeMode="contain" style={styles.bigBoxArtwork} />
    </View>
    {placed && !sealed && <>
      <Text style={styles.instruction}>2. Swipe the tape to the right to seal the box.</Text>
      <View style={styles.swipeTrack} onLayout={e => { tapeLimit.current = Math.max(0, e.nativeEvent.layout.width - 92); }} {...tapeResponder.panHandlers}><Animated.View style={[styles.tapeRoll, { transform: [{ translateX: tapeDrag }] }]}><Text style={styles.tapeRollText}>TAPE</Text></Animated.View><View style={styles.swipeLine} /></View>
    </>}
    {sealed && <Text accessibilityLiveRegion="polite" style={styles.completeInstruction}>The box is sealed. Thought experiment ready.</Text>}
  </View>;
}

function CatApparatusExperiment({ onFirstRun }: { onFirstRun: () => void }) {
  const [blink, setBlink] = useState(false);
  const [result, setResult] = useState<'alive' | 'dead'>();
  const hasRun = useRef(false);
  useEffect(() => {
    if (result) return;
    const timer = setInterval(() => setBlink(value => !value), 1000);
    return () => clearInterval(timer);
  }, [result]);
  const run = () => {
    setResult(Math.random() < 0.5 ? 'alive' : 'dead');
    if (!hasRun.current) { hasRun.current = true; onFirstRun(); }
  };
  const source = result === 'alive' ? apparatusAlive : result === 'dead' ? apparatusDead : blink ? apparatusBlink : apparatusReady;
  return <View>
    <Image accessibilityLabel={result ? `Experiment result: the cat is ${result}` : 'The cat waits inside the radioactive apparatus and blinks'} source={source} resizeMode="contain" style={styles.apparatusArtwork} />
    <PrimaryButton label={result ? 'Run the experiment again' : 'Run the experiment'} onPress={run} />
    {result && <Text accessibilityLiveRegion="polite" style={[styles.experimentResult, result === 'alive' ? styles.aliveResult : styles.deadResult]}>{result === 'alive' ? 'Phew, the atom didn’t decay, so it’s still alive.' : 'Oh no, the atom decayed this time. Poor kitty.'}</Text>}
  </View>;
}

function CollapseDiagram() {
  const [showA, setShowA] = useState(true);
  useEffect(() => {
    const timer = setInterval(() => setShowA(value => !value), 850);
    return () => clearInterval(timer);
  }, []);
  return <View accessibilityLabel="A and B probability cloud points to an outcome alternating between A and B" style={styles.collapseDiagram}>
    <Image source={aAndBCloud} resizeMode="contain" style={styles.collapseCloud} />
    <Text style={styles.collapseArrow}>→</Text>
    <Image source={showA ? outcomeA : outcomeB} resizeMode="contain" style={styles.collapseOutcome} />
  </View>;
}

export function SchrodingerCatLesson({ onComplete, onScrollLock }: { onComplete: () => void; onScrollLock?: (locked: boolean) => void }) {
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState<string>();
  return <View>
    <Text style={styles.heroCopy}>Now for something you’ve all been waiting for... <Text style={styles.bold}>Schrödinger’s cat!</Text></Text>
    <Text style={styles.aside}>(Well, maybe some of you. A lot of people might not know what this is.)</Text>
    <Image accessibilityLabel="Erwin Schrödinger sitting with his cat" source={schrodingerAndCat} resizeMode="contain" style={styles.heroArtwork} />
    <Text style={styles.body}>Does the name ring a bell? The same physicist whose wave equation you just met also devised a thought experiment that would <ShakingWord /> the world of physics. It even made people at the time question the nature of the reality in front of them!</Text>
    <Text style={styles.body}>Without further ado….. let’s set it up.</Text>
    <CatBoxSetup onScrollLock={onScrollLock} onComplete={() => setStage(1)} />

    {stage >= 1 && <View style={styles.section}>
      <Text style={styles.heading}>What else is in the box:</Text>
      <Text style={styles.bullet}>• A radioactive atom that has a 50% chance of decaying, or not</Text>
      <Text style={styles.bullet}>• A vial of poison</Text>
      <Text style={styles.body}>If the atom decays, it sets off a contraption that breaks the vial of poison and kills the cat. If it doesn’t, the cat stays alive.</Text>
      <CatApparatusExperiment onFirstRun={() => setStage(2)} />
    </View>}

    {stage >= 2 && <View style={styles.section}>
      <Text style={styles.heading}>Now think about superposition</Text>
      <Text style={styles.body}>For an isolated quantum system, before measuring the system it can technically be in a state of A and B at the same time. When the state collapses, it produces either A or B according to the probability.</Text>
      <CollapseDiagram />
      <View style={styles.catMystery}>
        <Text style={styles.mysteryLabel}>SCHRÖDINGER’S QUESTION</Text>
        <Text style={styles.question}>If the cat’s fate depends on the quantum possibility of the atom decaying or not decaying, does that mean that before we observe the box, the cat is 50% alive and 50% dead at the same time??</Text>
        {!answer && <View style={styles.answers}>{['That sounds possible', 'That sounds absurd'].map(option => <AnswerButton key={option} label={option} state="default" onPress={() => { setAnswer(option); setStage(3); }} />)}</View>}
        {answer && <Text style={styles.feedback}>That tension is exactly the point. The thought experiment asks what happens when a quantum description is extended to an everyday object.</Text>}
      </View>
    </View>}

    {stage >= 3 && <View style={styles.section}>
      <Text style={styles.body}>It is a wild idea. You might wonder: if I replaced the cat with myself, could I be 50% dead and 50% alive?</Text>
      <Image accessibilityLabel="A worried person imagining themselves inside the cat-box apparatus" source={apparatusHuman} resizeMode="contain" style={styles.personApparatusArtwork} />
      <Text style={styles.body}>In fact, Albert Einstein himself was unhappy with the idea that quantum theory might make reality this strange.</Text>
      <Image accessibilityLabel="Albert Einstein looking unhappy with the idea" source={einsteinUnhappy} resizeMode="contain" style={styles.einsteinArtwork} />
      <Text style={styles.heading}>What was Schrödinger really saying?</Text>
      <Text style={styles.body}>Schrödinger was not proposing this as a practical experiment or claiming that ordinary cats stay in a visible dead-and-alive state. He made the example deliberately absurd to expose how difficult it is to connect quantum rules with the everyday world.</Text>
      <Text style={styles.heading}>So what would actually happen here?</Text>
      <Text style={styles.body}>People think that the act of observing it, looking inside the box, causes the quantum interaction. But in reality, the radioactive particle, the mechanism, the air, the cat, and every particle inside the box are constantly interacting with one another and their surroundings before we even look at it.</Text>
      <Text style={styles.body}>Those interactions spread information about the different possibilities into the environment. This process is called <Text style={styles.bold}>decoherence</Text>. It destroys the observable interference between the branches incredibly quickly for a cat-sized system.</Text>
      <TerminologyCard term="Decoherence" definition="The loss of observable quantum interference when a system becomes entangled with information in its environment." />
      <Text style={styles.body}>So a real cat in an ordinary box would not behave like one perfectly isolated particle. Decoherence explains why the everyday world looks definite, although physicists still debate what measurement means at the deepest level.</Text>
      <Text style={styles.future}>Want more thought experiments and interpretations? A future quantum philosophy chapter will explore them.</Text>
      <Text style={styles.disclaimer}>No cats were harmed in the making of this lesson.</Text>
      <Image accessibilityLabel="A happy, unharmed standing cat" source={catStanding} resizeMode="contain" style={styles.happyCatArtwork} />
      <PrimaryButton label="Start the quiz" onPress={onComplete} />
    </View>}
  </View>;
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.xl },
  heroCopy: { color: colors.ink, fontFamily: fonts.body, fontSize: 26, lineHeight: 34, marginBottom: 12 },
  aside: { color: colors.muted, fontFamily: fonts.body, fontSize: 20, lineHeight: 26, marginBottom: 15 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginBottom: 18 },
  bold: { fontFamily: fonts.display },
  heading: { color: colors.ink, fontFamily: fonts.display, fontSize: 31, lineHeight: 38, marginTop: 10, marginBottom: 12 },
  bullet: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginBottom: 9, paddingLeft: 7 },
  shakingWord: { color: colors.coral, fontFamily: fonts.display, fontSize: 25 },
  heroArtwork: { width: '100%', height: 205, alignSelf: 'center', marginBottom: 19 },
  setupSection: { marginBottom: spacing.xl }, instruction: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 24, lineHeight: 30, marginBottom: 12 },
  catBoxStage: { height: 240, overflow: 'hidden', marginBottom: 15 },
  dragCat: { position: 'absolute', left: 2, top: 82, width: 112, alignItems: 'center', zIndex: 5 }, dragCatImage: { width: 108, height: 98 }, dragHint: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 15, marginTop: -6 },
  bigBoxArtwork: { position: 'absolute', right: 0, top: 18, width: 220, height: 212 },
  swipeTrack: { height: 70, justifyContent: 'center', overflow: 'hidden', marginBottom: 12 }, swipeLine: { height: 6, marginHorizontal: 30, borderRadius: 3, backgroundColor: '#D5CABB' },
  tapeRoll: { position: 'absolute', left: 10, width: 72, height: 48, zIndex: 2, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#E7D4A0', borderWidth: 2, borderColor: colors.ink }, tapeRollText: { color: colors.ink, fontFamily: fonts.display, fontSize: 13 },
  completeInstruction: { color: colors.green, fontFamily: fonts.display, fontSize: 21, textAlign: 'center' },
  apparatusArtwork: { width: '100%', height: 305, alignSelf: 'center', marginTop: -8, marginBottom: 10 },
  experimentResult: { fontFamily: fonts.body, fontSize: 22, lineHeight: 29, textAlign: 'center', marginTop: 14 },
  aliveResult: { color: colors.green }, deadResult: { color: colors.coral },
  collapseDiagram: { height: 182, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 18 },
  collapseCloud: { width: 174, height: 162 }, collapseArrow: { color: colors.primary, fontFamily: fonts.display, fontSize: 37 }, collapseOutcome: { width: 78, height: 88 },
  catMystery: { backgroundColor: '#F6F0FF', borderWidth: 1.5, borderColor: '#B9A8E7', borderRadius: radii.lg, padding: 18 },
  mysteryLabel: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 22, lineHeight: 28, letterSpacing: 1.1, textAlign: 'center' },
  question: { color: colors.ink, fontFamily: fonts.display, fontSize: 25, lineHeight: 32, textAlign: 'center', marginVertical: 16 },
  answers: { gap: 10 }, feedback: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, marginTop: 12 },
  personApparatusArtwork: { width: '100%', height: 285, alignSelf: 'center', marginBottom: 19 },
  einsteinArtwork: { width: 230, height: 235, alignSelf: 'center', marginBottom: 19 },
  future: { color: colors.primaryDark, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, backgroundColor: '#F1ECFC', borderRadius: radii.md, padding: 16, marginBottom: 19 },
  disclaimer: { color: colors.green, fontFamily: fonts.display, fontSize: 25, lineHeight: 31, textAlign: 'center', marginVertical: 18 },
  happyCatArtwork: { width: 190, height: 155, alignSelf: 'center', marginBottom: 20 },
});
