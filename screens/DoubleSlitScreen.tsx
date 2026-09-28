import { LessonBadge } from '../components/LessonBadge';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WallPattern } from '../components/WallPattern';
import { AnswerButton } from '../components/AnswerButton';
import { ExperimentDiagram } from '../components/ExperimentDiagram';
import { PrimaryButton } from '../components/PrimaryButton';
import { TerminologyCard } from '../components/TerminologyCard';
import { MysteryCard } from '../components/MysteryCard';
import { colors, fonts, spacing } from '../constants/theme';

const familiarOptions = [
  { label: 'Two bands', pattern: 'two' as const },
  { label: 'Evenly spread', pattern: 'even' as const },
  { label: 'Something else', pattern: 'interference' as const },
];
function Prediction({ selected, correct, attempted = [], onSelect }: { selected?: string; correct?: string; attempted?: string[]; onSelect: (answer: string) => void }) {
  return <View style={styles.options}>{familiarOptions.map(option => <AnswerButton key={option.label} knowledgeKey={`slit-prediction:${correct}`} isCorrectAnswer={option.label === correct} label={option.label}
    illustration={<WallPattern kind={option.pattern} />}
    state={selected && option.label === correct ? 'correct' : attempted.includes(option.label) ? 'incorrect' : !correct && option.label === selected ? 'selected' : 'default'}
    disabled={Boolean(selected) || attempted.includes(option.label)} onPress={() => onSelect(option.label)} />)}</View>;
}

export function DoubleSlitScreen({ onHome, onContinue }: { onHome: () => void; onContinue: () => void }) {
  const [ballChoice, setBallChoice] = useState<string>();
  const [waveChoice, setWaveChoice] = useState<string>();
  const [ballAttempts, setBallAttempts] = useState<string[]>([]);
  const [waveAttempts, setWaveAttempts] = useState<string[]>([]);
  const [shots, setShots] = useState(0);
  const [firing, setFiring] = useState(false);
  const firingLock = useRef(false);
  const [burst, setBurst] = useState(false);
  const [burstDots, setBurstDots] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => () => progress.stopAnimation(), [progress]);
  useEffect(() => {
    if (!burst) return;
    const timer = setInterval(() => setBurstDots(value => {
      if (value >= 300) { clearInterval(timer); return 300; }
      return Math.min(300, value + 20);
    }), 90);
    return () => clearInterval(timer);
  }, [burst]);
  const fire = () => {
    if (firingLock.current || shots >= 5) return;
    firingLock.current = true; setFiring(true); progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
      firingLock.current = false;
      if (finished) { setShots(value => value + 1); setFiring(false); }
    });
  };
  const reset = () => { setShots(0); setBurst(false); setBurstDots(0); };
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <Text onPress={onHome} accessibilityRole="button" style={styles.back}>‹ Home</Text>
    <LessonBadge number={3} />
    <Text style={styles.hero}>One particle.{'\n'}Two paths?</Text>
    <Text style={styles.body}>You’ve seen what quantum particles are. But what makes their behaviour so strange?</Text>

    <View style={styles.chapter}>
      <Text style={styles.kicker}>01 · START FAMILIAR</Text>
      <Text style={styles.title}>Imagine firing lots of basketballs one at a time through two openings.</Text>
      <ExperimentDiagram mode="ball" revealed={!!ballChoice} count={ballChoice ? 90 : 0} />
      <Text style={styles.question}>If the basketballs pass through the slits without bouncing on the walls, where would you expect most of them to land on the screen?</Text>
      <Prediction selected={ballChoice} attempted={ballAttempts} correct="Two bands" onSelect={answer => answer === 'Two bands' ? setBallChoice(answer) : setBallAttempts(old => old.includes(answer) ? old : [...old, answer])} />
      {ballAttempts.length > 0 && !ballChoice && <Text style={styles.tryAgain}>Not quite. That option is crossed out, so try again.</Text>}
      {ballChoice && <View style={styles.note}><Text style={styles.noteTitle}>Exactly - two bands!</Text><Text style={styles.body}>Basketballs pass through one opening or the other. Here we’re imagining straight paths and no bouncing off the edges.</Text></View>}
    </View>

    {ballChoice && <View style={styles.chapter}>
      <Text style={styles.kicker}>02 · CHANGE THE RULES</Text>
      <Text style={styles.title}>Now send a wave toward the openings.</Text>
      <ExperimentDiagram mode="wave" revealed={!!waveChoice} count={waveChoice ? 240 : 0} />
      <Text style={styles.question}>What pattern do you think the waves will make on the screen?</Text>
      <Prediction selected={waveChoice} attempted={waveAttempts} correct="Something else" onSelect={answer => answer === 'Something else' ? setWaveChoice(answer) : setWaveAttempts(old => old.includes(answer) ? old : [...old, answer])} />
      {waveAttempts.length > 0 && !waveChoice && <Text style={styles.tryAgain}>That one is ruled out. Have another go.</Text>}
      {waveChoice && <><View style={styles.note}><Text style={styles.noteTitle}>Yes - waves make something called an 'interference pattern'.</Text><Text style={styles.body}>Each opening lets waves spread outward. Where those waves overlap, they can reinforce or cancel each other. That makes alternating strong and weak bands on the screen.</Text></View>
        <TerminologyCard term="Interference" definition="When overlapping waves combine. They can reinforce one another to make stronger regions, or cancel to make weaker regions." /></>}
    </View>}

    {ballChoice && waveChoice && <View style={styles.chapter}>
      <Text style={styles.title}>What happens with electrons?</Text>
      <Image source={require('../assets/particles/electron-avatar.png')} style={styles.avatar} resizeMode="contain" />
      <Text style={styles.question}>Electrons are <Text style={styles.underline}>quantum</Text> particles. When we shoot electrons through the wall one at a time, what do you think we'll see?</Text>
      <Text style={styles.body}>We record its arrival on the wall, not its path through the openings. That part of the drawing stays censored.</Text>
      <ExperimentDiagram mode="electron" revealed count={burst ? burstDots : shots} progress={progress} firing={firing} concealPath />
      <>
        <Text style={styles.counter}>{burst ? 'Watch the pattern build…' : 'Keep firing electrons to find out!'}</Text>
        {!burst && <PrimaryButton label={firing ? 'Firing…' : shots < 5 ? 'Fire electron' : 'Fire 1000 electrons'} disabled={firing} onPress={shots < 5 ? fire : () => setBurst(true)} />}
      </>
      {burstDots >= 300 && <>
        <Text style={styles.surprise}>WAIT… WHAT?</Text><Text style={styles.body}>Each electron arrived as a single point. But together, they formed the pattern we’d expect from waves.</Text>
        <MysteryCard onContinue={onContinue} />
        <PrimaryButton label="Restart experiment" secondary onPress={reset} style={{ marginTop: 12 }} />
      </>}
    </View>}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 80 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 12, marginBottom: 20 },
  kicker: { color: colors.coral, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1 },
  hero: { color: colors.ink, fontFamily: fonts.display, fontSize: 46, lineHeight: 53, marginVertical: 14 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, lineHeight: 27 },
  chapter: { borderTopWidth: 1, borderColor: colors.border, marginTop: 30, paddingTop: 30 },
  title: { color: colors.ink, fontFamily: fonts.body, fontSize: 30, lineHeight: 37, marginVertical: 18 },
  question: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginVertical: 18 },
  options: { gap: 10 }, predict: { marginTop: 18 },
  note: { backgroundColor: colors.surface, borderColor: colors.ink, borderWidth: 1.5, borderRadius: 16, padding: 18, marginTop: 20 },
  noteTitle: { fontFamily: fonts.body, fontSize: 24, color: colors.primaryDark, marginBottom: 8 },
  avatar: { width: 130, height: 130, alignSelf: 'center' },
  underline: { textDecorationLine: 'underline' },
  counter: { fontFamily: fonts.body, fontSize: 22, color: colors.primaryDark, textAlign: 'center', marginVertical: 18 },
  caption: { fontFamily: fonts.body, fontSize: 15, lineHeight: 20, color: colors.muted, marginTop: 14 },
  surprise: { fontFamily: fonts.display, fontSize: 36, color: '#C93432', marginTop: 20, marginBottom: 10 },
  tryAgain: { color: colors.coral, fontFamily: fonts.body, fontSize: 20, lineHeight: 26, marginTop: 12, textAlign: 'center' },
});
