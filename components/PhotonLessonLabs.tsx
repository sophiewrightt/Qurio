import { ExploreFurther } from './ExploreFurther';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { AnswerButton } from './AnswerButton';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';
import { colors, fonts } from '../constants/theme';

const electron = require('../assets/particles/electron-content.png');
const photon = require('../assets/lesson-9/photon-default-transparent.png');
const energyLevels = require('../assets/module-2/energy-levels-transparent.png');
const energyLevelsWithSteps = require('../assets/module-2/energy-levels-with-steps-transparent.png');
const blowtorch = require('../assets/module-2/lesson-3/blowtorch-transparent.png');
const blowtorchFireOne = require('../assets/module-2/lesson-3/blowtorch-fire-1-transparent.png');
const blowtorchFireTwo = require('../assets/module-2/lesson-3/blowtorch-fire-2-transparent.png');
const photoelectricEffect = require('../assets/module-2/lesson-3/photoelectric-effect-transparent.png');
const rainbowBasketballFlame = require('../assets/module-2/lesson-3/rainbow-basketball-flame-transparent.png');
const continuousLevels = require('../assets/module-2/lesson-3/continuous-levels-transparent.png');
const questionMark = require('../assets/module-2/lesson-3/question-mark-transparent.png');
const torch = require('../assets/module-2/lesson-3/torch-transparent.png');
const spectrumArt = [
  require('../assets/module-2/lesson-3/electromagnetic-basic.jpg'),
  require('../assets/module-2/lesson-3/electromagnetic-xray.jpg'),
  require('../assets/module-2/lesson-3/electromagnetic-microwave-xray.jpg'),
  require('../assets/module-2/lesson-3/electromagnetic-visible.jpg'),
];

type ElementId = 'lithium' | 'sodium' | 'potassium' | 'copper';
type ElementSample = {
  id: ElementId;
  name: string;
  symbol: string;
  colour: string;
  base: ImageSourcePropType;
  fire: ImageSourcePropType;
};

const elements: ElementSample[] = [
  { id: 'lithium', name: 'Lithium', symbol: 'Li', colour: 'crimson red', base: require('../assets/module-2/lesson-3/lithium-transparent.png'), fire: require('../assets/module-2/lesson-3/lithium-fire-transparent.png') },
  { id: 'sodium', name: 'Sodium', symbol: 'Na', colour: 'yellow-orange', base: require('../assets/module-2/lesson-3/sodium-transparent.png'), fire: require('../assets/module-2/lesson-3/sodium-fire-transparent.png') },
  { id: 'potassium', name: 'Potassium', symbol: 'K', colour: 'lilac', base: require('../assets/module-2/lesson-3/potassium-transparent.png'), fire: require('../assets/module-2/lesson-3/potassium-fire-transparent.png') },
  { id: 'copper', name: 'Copper', symbol: 'Cu', colour: 'blue-green', base: require('../assets/module-2/lesson-3/copper-transparent.png'), fire: require('../assets/module-2/lesson-3/copper-fire-transparent.png') },
];

function EnergyDropStage() {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.timing(progress, { toValue: 1, duration: 2300, useNativeDriver: true }));
    animation.start();
    return () => animation.stop();
  }, [progress]);

  return <View accessibilityLabel="Repeated question animation: electron drops from Level 3 to Level 1" style={styles.emissionStage}>
    <Image source={energyLevels} resizeMode="contain" style={styles.energyStageImage} />
    <Animated.Image source={electron} resizeMode="contain" style={[styles.emissionElectron, {
      opacity: progress.interpolate({ inputRange: [0, 0.12, 0.68, 0.82, 1], outputRange: [1, 1, 1, 0, 0] }),
      transform: [{ translateY: progress.interpolate({ inputRange: [0, 0.18, 0.62, 1], outputRange: [0, 0, 137, 137] }) }],
    }]} />
    <Animated.Image source={questionMark} resizeMode="contain" style={[styles.dropQuestionMark, {
      opacity: progress.interpolate({ inputRange: [0, 0.34, 0.48, 0.84, 1], outputRange: [0, 0, 1, 1, 0] }),
      transform: [{ scale: progress.interpolate({ inputRange: [0, 0.34, 0.52, 1], outputRange: [0.72, 0.72, 1, 1] }) }],
    }]} />
  </View>;
}

function PhotonEmissionStage() {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.timing(progress, { toValue: 1, duration: 2300, useNativeDriver: true }));
    animation.start();
    return () => animation.stop();
  }, [progress]);

  const appear = progress.interpolate({ inputRange: [0, 0.32, 0.42, 0.84, 1], outputRange: [0, 0, 1, 1, 0] });
  return <View accessibilityLabel="Repeated animation: electron drops from Level 3 to Level 1 and a photon shoots out" style={styles.emissionStage}>
    <Image source={energyLevels} resizeMode="contain" style={styles.energyStageImage} />
    <Animated.Image source={electron} resizeMode="contain" style={[styles.emissionElectron, {
      opacity: progress.interpolate({ inputRange: [0, 0.12, 0.68, 0.82, 1], outputRange: [1, 1, 1, 0, 0] }),
      transform: [{ translateY: progress.interpolate({ inputRange: [0, 0.18, 0.62, 1], outputRange: [0, 0, 137, 137] }) }],
    }]} />
    <Animated.Image source={photon} resizeMode="contain" style={[styles.flyingPhoton, {
      opacity: appear,
      transform: [
        { translateX: progress.interpolate({ inputRange: [0, 0.38, 0.88, 1], outputRange: [0, 0, 150, 150] }) },
        { translateY: progress.interpolate({ inputRange: [0, 0.38, 0.88, 1], outputRange: [0, 0, -35, -35] }) },
        { scale: progress.interpolate({ inputRange: [0, 0.38, 0.88, 1], outputRange: [0.7, 0.7, 1.08, 1.08] }) },
      ],
    }]} />
  </View>;
}

function TorchPhotonStage() {
  const travel = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.timing(travel, { toValue: 1, duration: 1700, useNativeDriver: true }));
    animation.start();
    return () => animation.stop();
  }, [travel]);
  return <View accessibilityLabel="A torch shines a yellow beam while photons travel through it" style={styles.torchPhotonStage}>
    <Image source={torch} resizeMode="contain" style={styles.handTorch} />
    {[0.001, 0.28, 0.56].map((start, index) => <Animated.Image key={index} source={photon} resizeMode="contain" style={[styles.beamPhoton, {
      opacity: travel.interpolate({ inputRange: [0, start, start + 0.08, start + 0.34, 1], outputRange: [0, 0, 0.95, 0.55, 0] }),
      transform: [{ translateX: travel.interpolate({ inputRange: [0, start, 1], outputRange: [0, 0, 155] }) }, { scale: 0.28 }],
    }]} />)}
  </View>;
}

function SpectrumExplorer({ step, onNext }: { step: number; onNext: () => void }) {
  return <View style={styles.spectrumSection}>
    <Text style={styles.spectrumPrompt}>Tap through to explore some of the spectrum!</Text>
    <Pressable
      accessibilityRole={step < 3 ? 'button' : undefined}
      accessibilityLabel={step < 3 ? `Tap to reveal the next part of the electromagnetic spectrum, step ${step + 1} of 4` : 'Electromagnetic spectrum fully revealed'}
      disabled={step >= 3}
      onPress={onNext}
      style={styles.spectrumTap}
    >
      <Image source={spectrumArt[step]!} resizeMode="contain" style={styles.spectrumImage} />
      {step < 3 && <Text style={styles.tapToReveal}>tap to reveal</Text>}
    </Pressable>
  </View>;
}

function VisibleRainbow() {
  const stripes = ['#E95B4F', '#F39A44', '#F4C85C', '#62AF78', '#55A6D9', '#7659C7'];
  return <View style={styles.visibleSpectrum}>
    <View accessibilityLabel="Visible light runs from lower-energy red to higher-energy violet" style={styles.rainbow}>
      {stripes.map(colour => <View key={colour} style={[styles.rainbowStripe, { backgroundColor: colour }]} />)}
    </View>
    <View style={styles.rainbowLabels}>
      <Text style={styles.rainbowLabel}>RED{`\n`}lower energy</Text>
      <Text style={[styles.rainbowLabel, styles.rainbowLabelRight]}>BLUE-VIOLET{`\n`}higher energy</Text>
    </View>
  </View>;
}

export function FlameTest({ onAnswer }: { onAnswer: (correct: boolean) => void }) {
  const answered = useRef(false);
  const [selectedId, setSelectedId] = useState<ElementId>('sodium');
  const [burning, setBurning] = useState(false);
  const [frame, setFrame] = useState(0);
  const [visited, setVisited] = useState<ElementId[]>([]);
  const [answer, setAnswer] = useState<string>();
  const selected = elements.find(item => item.id === selectedId)!;

  useEffect(() => {
    if (!burning) { setFrame(0); return; }
    const timer = setInterval(() => setFrame(value => value === 0 ? 1 : 0), 140);
    return () => clearInterval(timer);
  }, [burning]);

  const useTorch = () => {
    if (!burning) setVisited(current => current.includes(selectedId) ? current : [...current, selectedId]);
    setBurning(value => !value);
  };
  const chooseAnswer = (value: string) => {
    if (answered.current) return false;
    answered.current = true;
    setAnswer(value);
    onAnswer(value === 'Lithium - red');
  };
  const allTested = visited.length === elements.length;

  return <View style={styles.flameSection}>
    <Text style={styles.body}>Heat is a way to give atoms energy. If we light certain elements on fire and give their electrons enough energy, those electrons eventually drop down again. Because each element has different spacing between its energy levels, different colours are produced.</Text>
    <View style={styles.elementTabs}>
      {elements.map(item => <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`${item.symbol}${visited.includes(item.id) ? ', tested' : ''}`} accessibilityState={{ selected: selectedId === item.id }} onPress={() => { setSelectedId(item.id); setBurning(false); }} style={[styles.elementTab, selectedId === item.id && styles.elementTabSelected, visited.includes(item.id) && styles.elementTabTested]}><Text style={styles.elementTabText}>{item.symbol}</Text></Pressable>)}
    </View>
    <Text style={styles.torchHint}>tap the handle to use the blowtorch</Text>
    <View accessibilityLabel={`${selected.name} flame test: ${burning ? selected.colour + ' flame burning' : 'torch off'}`} style={styles.flameStage}>
      {elements.map(item => <View key={item.id} pointerEvents="none" style={[styles.elementFrame, { opacity: selectedId === item.id ? 1 : 0 }]}>
        <Image fadeDuration={0} source={item.base} resizeMode="contain" style={[styles.elementImage, { opacity: burning ? 0 : 1 }]} />
        <Image fadeDuration={0} source={item.fire} resizeMode="contain" style={[styles.elementImage, styles.elementFrameOverlay, { opacity: burning ? 1 : 0 }]} />
      </View>)}
      <View style={styles.torchWrap}>
        <Image fadeDuration={0} source={blowtorch} resizeMode="contain" style={[styles.torchImage, { opacity: burning ? 0 : 1 }]} />
        <Image fadeDuration={0} accessibilityLabel="Blowtorch firing, animation frame one" source={blowtorchFireOne} resizeMode="contain" style={[styles.torchImage, styles.torchFrameOverlay, { opacity: burning && frame === 0 ? 1 : 0 }]} />
        <Image fadeDuration={0} accessibilityLabel="Blowtorch firing, animation frame two" source={blowtorchFireTwo} resizeMode="contain" style={[styles.torchImage, styles.torchFrameOverlay, { opacity: burning && frame === 1 ? 1 : 0 }]} />
        <Pressable accessibilityRole="button" accessibilityLabel={`Blowtorch handle, ${burning ? 'tap to turn off' : 'tap to ignite'}`} hitSlop={18} onPress={useTorch} style={styles.handleHitArea} />
      </View>
    </View>
    <Text style={styles.progressText}>{burning ? `${selected.name}: ${selected.colour} photons! Tap the handle again to stop.` : `${visited.length}/4 elements tested`}</Text>
    {allTested && <View style={styles.flameQuiz}>
      <Text style={styles.quizTitle}>Which flame gives off the lower-energy visible photons?</Text>
      <Text style={styles.body}>Compare the red and purple flames.</Text>
      <View style={styles.answerStack}>{['Lithium - red', 'Potassium - purple'].map(value => <AnswerButton key={value} knowledgeKey="flame-identification" isCorrectAnswer={value === "Lithium - red"} label={value} disabled={!!answer} onPress={() => chooseAnswer(value)} state={!answer ? 'default' : value === 'Lithium - red' ? 'correct' : value === answer ? 'incorrect' : 'default'} />)}</View>
      {answer && <Text style={styles.feedbackText}>{answer === 'Lithium - red' ? 'Exactly. Red visible photons carry less energy than purple ones.' : 'The red lithium flame is lower energy; purple is closer to the higher-energy end of visible light.'}</Text>}
    </View>}
  </View>;
}

function CrowdedLevels() {
  return <View style={styles.continuitySection}>
    <Text style={styles.sectionTitle}>Once again… why doesn’t my basketball do this?</Text>
    <Text style={styles.body}>If a basketball is made of lots of different atoms which have electrons, why doesn’t it light up with rainbow fire when you heat it with a blowtorch?</Text>
    <Image source={rainbowBasketballFlame} resizeMode="contain" style={styles.rainbowBasketballArt} />

    <Text style={styles.diagramLabel}>One isolated atom has separated energy steps.</Text>
    <View accessibilityLabel="One energy-level staircase sprite" style={styles.levelCluster}>
      <Image source={energyLevelsWithSteps} resizeMode="contain" style={styles.singleLevelSprite} />
    </View>

    <Text style={styles.diagramLabel}>In a bigger object, enormous numbers of atoms and particles interact.</Text>
    <MergingEnergyLevels />
    <Text style={styles.body}>Their levels influence one another and split into many slightly different allowed energies-like countless staircases crowding together with tiny offsets.</Text>
    <Text style={styles.body}>Those allowed energies become crowded into bands. The gaps are so tiny and numerous that, at everyday scales, they look <Text style={styles.italic}>continuous</Text>. Heating a basketball also mostly produces invisible infrared radiation, rather than a neat visible flame colour.</Text>
  </View>;
}

function MergingEnergyLevels() {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.timing(progress, { toValue: 1, duration: 4200, useNativeDriver: true }));
    animation.start();
    return () => animation.stop();
  }, [progress]);

  const offsets = [
    { x: -68, y: -24 },
    { x: 0, y: 0 },
    { x: 68, y: 24 },
  ];
  return <View accessibilityLabel="Repeated animation: many separate atomic energy levels crowd together into continuous-looking levels" style={styles.mergeStage}>
    {offsets.map(({ x, y }, index) => <Animated.Image key={index} source={energyLevelsWithSteps} resizeMode="contain" style={[styles.mergingLevelSprite, {
      opacity: progress.interpolate({ inputRange: [0, 0.58, 0.76, 1], outputRange: [0.82, 0.82, 0, 0] }),
      transform: [
        { translateX: progress.interpolate({ inputRange: [0, 0.58, 1], outputRange: [x, 0, 0] }) },
        { translateY: progress.interpolate({ inputRange: [0, 0.58, 1], outputRange: [y, 0, 0] }) },
        { scale: progress.interpolate({ inputRange: [0, 0.58, 1], outputRange: [0.72, 0.88, 0.88] }) },
      ],
    }]} />)}
    <Animated.Image source={continuousLevels} resizeMode="contain" style={[styles.mergedContinuousSprite, {
      opacity: progress.interpolate({ inputRange: [0, 0.58, 0.76, 0.94, 1], outputRange: [0, 0, 1, 1, 0] }),
      transform: [{ scale: progress.interpolate({ inputRange: [0, 0.58, 0.8, 1], outputRange: [0.86, 0.86, 1, 1] }) }],
    }]} />
  </View>;
}

export function PhotonLessonLabs({ onComplete }: { onComplete: () => void }) {
  const [dropAnswer, setDropAnswer] = useState<string>();
  const emitted = dropAnswer === 'The energy goes somewhere';
  const [spectrumStep, setSpectrumStep] = useState(0);
  const [flameComplete, setFlameComplete] = useState(false);

  return <View>
    <Text style={styles.body}>We gave the atom energy to move its electron up a level. When the electron drops from Level 3 to Level 1, what happens to the energy the atom loses?</Text>
    <EnergyDropStage />
    <View style={styles.answerStack}>{['The energy disappears', 'The energy goes somewhere', 'Nothing happens'].map(value => <AnswerButton key={value} knowledgeKey="energy-release" isCorrectAnswer={value === "The energy goes somewhere"} label={value} disabled={emitted} onPress={() => setDropAnswer(value)} state={!dropAnswer ? 'default' : value === 'The energy goes somewhere' && emitted ? 'correct' : value === dropAnswer && !emitted ? 'incorrect' : 'default'} />)}</View>

    {dropAnswer && !emitted && <Text accessibilityLiveRegion="polite" style={styles.tryAgain}>Not quite. Energy is conserved, so try again.</Text>}
    {emitted && <View style={styles.revealSection}>
      <Text style={styles.revealTitle}>The energy must go somewhere.</Text>
      <Text style={styles.body}>Energy cannot simply vanish. In this example, the atom transfers its lost energy to light.</Text>
    </View>}

    {emitted && <>
      <PhotonEmissionStage />
      <Text style={styles.sectionTitle}>A photon shoots out!</Text>
      <Text style={styles.body}>When an atom loses energy, it can release that energy as a <Text style={styles.bold}>photon</Text>.</Text>
      <View style={styles.character}><Image source={photon} resizeMode="contain" style={styles.characterImage} /><View style={styles.characterCopy}><Text style={styles.characterName}>Photon</Text><Text style={styles.body}>A quantum of electromagnetic radiation, including light. In other words, a tiny packet of energy.</Text></View></View>

      <Text style={styles.sectionTitle}>Something we can actually see…</Text>
      <Text style={styles.body}>Photon literally means light, and yes, it’s one of the elementary particles we can see!</Text>
      <TorchPhotonStage />
      <Text style={styles.body}>Photons make up every part of the <Text style={styles.bold}>electromagnetic spectrum</Text>.</Text>
      <View style={{ marginBottom: 28 }}><TerminologyCard term="Electromagnetic spectrum" definition="A scale used to classify photons with different energies." /></View>
      <Text style={styles.body}>X-ray photons carry more energy than visible light, while microwave photons carry less. The photons we can see make up the light all around us.</Text>
      <SpectrumExplorer step={spectrumStep} onNext={() => setSpectrumStep(value => Math.min(3, value + 1))} />
    </>}

    {spectrumStep === 3 && <>
      <Text style={styles.body}>For visible light, photon energy is connected to colour. Red photons have less energy; blue and violet photons have more.</Text>
      <VisibleRainbow />
      <Text style={styles.sectionTitle}>Energy gaps</Text>
      <Text style={styles.gapEquation}>Level 2 → Level 1 = less energy</Text>
      <Text style={[styles.gapEquation, styles.gapEquationHigh]}>Level 4 → Level 1 = more energy!</Text>
      <Text style={styles.body}>A bigger change in the atom’s energy produces a photon with more energy.</Text>
      <FlameTest onAnswer={() => setFlameComplete(true)} />
    </>}

    {flameComplete && <>
      <Text style={styles.sectionTitle}>Absorption</Text>
      <Text style={styles.body}>The process can also run in reverse. For an allowed transition between these bound levels, the atom can absorb a photon whose energy matches the gap. It then gains that energy. This is the reverse of photon emission.</Text>

      <ExploreFurther title="A bit of history…">
      <Text style={styles.body}>A physicist called Max Planck helped develop the idea that energy comes in packets.</Text>
      <Image source={photoelectricEffect} resizeMode="contain" style={styles.historyImage} />
      <Text style={styles.body}>Experiments showed that low-energy red light could fail to eject any electrons from a material-even when the light was made more intense. Brighter light meant more low-energy photons, not more energy in each photon.</Text>
      <Text style={styles.body}>Higher-frequency light could eject electrons even when it was dim. Albert Einstein explained this using Planck’s packet idea: each photon had to carry enough energy on its own to eject an electron.</Text>

      </ExploreFurther>
      <ExploreFurther title="What about a whole basketball?"><CrowdedLevels /></ExploreFurther>
      <PrimaryButton label="Start the quiz" onPress={onComplete} />
    </>}
  </View>;
}

const styles = StyleSheet.create({
  sectionTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 31, lineHeight: 38, marginTop: 32, marginBottom: 12 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 29, marginBottom: 17 },
  bold: { fontFamily: fonts.display },
  italic: { fontStyle: 'italic' },
  answerStack: { gap: 10, marginVertical: 14 },
  tryAgain: { color: colors.coral, fontFamily: fonts.body, fontSize: 20, lineHeight: 27, textAlign: 'center', marginBottom: 13 },
  energyStageImage: { width: 315, maxWidth: '100%', height: 220 },
  emissionStage: { height: 276, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: 24 },
  emissionElectron: { position: 'absolute', width: 54, height: 54, left: '40%', top: 26 },
  dropQuestionMark: { position: 'absolute', width: 50, height: 64, left: '51%', top: 109 },
  flyingPhoton: { position: 'absolute', width: 68, height: 68, left: '48%', top: 143 },
  torchPhotonStage: { width: '100%', height: 190, alignSelf: 'center', justifyContent: 'center', overflow: 'hidden', marginTop: -8, marginBottom: 16 },
  handTorch: { width: '100%', height: 180 },
  beamPhoton: { position: 'absolute', width: 92, height: 92, left: '49%', top: 48 },
  revealSection: { marginTop: 22 },
  revealTitle: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 29, lineHeight: 35, marginBottom: 8 },
  character: { flexDirection: 'row', alignItems: 'center', gap: 15, marginVertical: 10 },
  characterImage: { width: 112, height: 112 },
  characterCopy: { flex: 1 },
  characterName: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 30, marginBottom: 4 },
  gapEquation: { color: colors.ink, fontFamily: fonts.display, fontSize: 27, lineHeight: 34, textAlign: 'center', marginTop: 13 },
  gapEquationHigh: { marginBottom: 18 },
  spectrumSection: { marginVertical: 14 },
  spectrumPrompt: { color: colors.coral, fontFamily: fonts.display, fontSize: 24, lineHeight: 30, textAlign: 'center', marginBottom: 6 },
  spectrumTap: { alignItems: 'center', justifyContent: 'center', minHeight: 285 },
  spectrumImage: { width: '115%', height: 275 },
  tapToReveal: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 22, marginTop: -20 },
  visibleSpectrum: { marginTop: 2, marginBottom: 34 },
  rainbow: { flexDirection: 'row', height: 44, borderRadius: 14, overflow: 'hidden' },
  rainbowStripe: { flex: 1 },
  rainbowLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  rainbowLabel: { color: colors.coral, fontFamily: fonts.body, fontSize: 17, lineHeight: 21 },
  rainbowLabelRight: { color: colors.primaryDark, textAlign: 'right' },
  flameSection: { marginTop: 6, marginBottom: 6 },
  elementTabs: { flexDirection: 'row', gap: 9, justifyContent: 'center', marginTop: 8, marginBottom: 16 },
  elementTab: { width: 58, height: 54, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.ink, borderRadius: 13 },
  elementTabSelected: { borderStyle: 'solid', borderColor: colors.primary, backgroundColor: '#EEE9FF' },
  elementTabTested: { backgroundColor: '#DCEBE0' },
  elementTabText: { color: colors.ink, fontFamily: fonts.display, fontSize: 22 },
  torchHint: { color: colors.primaryDark, fontFamily: fonts.body, fontSize: 20, textAlign: 'right', marginRight: 12 },
  flameStage: { height: 260, alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  elementFrame: { position: 'absolute', width: 220, height: 178, left: 0, top: 33 },
  elementImage: { width: '100%', height: '100%' },
  elementFrameOverlay: { position: 'absolute', left: 0, top: 0 },
  torchWrap: { position: 'absolute', width: 220, height: 220, right: -2, top: 25 },
  torchImage: { width: '100%', height: '100%' },
  torchFrameOverlay: { position: 'absolute', left: 0, top: 0 },
  handleHitArea: { position: 'absolute', right: 30, top: 85, width: 85, height: 120, borderRadius: 20 },
  progressText: { color: colors.muted, fontFamily: fonts.body, fontSize: 18, lineHeight: 24, textAlign: 'center', marginBottom: 17 },
  flameQuiz: { marginTop: 18 },
  quizTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 27, lineHeight: 34, marginBottom: 4 },
  feedbackText: { color: colors.green, fontFamily: fonts.body, fontSize: 20, lineHeight: 27, marginTop: 12 },
  historyImage: { width: '100%', height: 280, marginVertical: 2 },
  continuitySection: { marginBottom: 26 },
  rainbowBasketballArt: { width: '100%', height: 330, marginTop: -34, marginBottom: -4 },
  diagramLabel: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 22, lineHeight: 28, textAlign: 'center', marginTop: 13 },
  levelCluster: { minHeight: 188, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  singleLevelSprite: { width: 280, height: 180 },
  mergeStage: { width: '100%', maxWidth: 500, height: 286, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  mergingLevelSprite: { position: 'absolute', width: 292, height: 194 },
  mergedContinuousSprite: { position: 'absolute', width: 330, height: 235 },
});
