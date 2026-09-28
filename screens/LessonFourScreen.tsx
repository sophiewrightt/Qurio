import { LessonBadge } from '../components/LessonBadge';
import { TerminologyCard } from '../components/TerminologyCard';
import { ParticleAvatar } from '../components/ParticleAvatar';
import { useRef, useState } from 'react';
import { Animated, Easing, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { AnswerButton } from '../components/AnswerButton';
import { ProbabilityExperiment } from '../components/ProbabilityExperiment';
import { ScratchReveal } from '../components/ScratchReveal';
import { MysteryPanel } from '../components/MysteryPanel';
import { LessonFinishActions } from '../components/LessonFinishActions';
import { colors, fonts } from '../constants/theme';

const diceFaces = [
  require('../assets/lesson-4/dice-1-transparent.png'),
  require('../assets/lesson-4/dice-2-transparent.png'),
  require('../assets/lesson-4/dice-3-transparent.png'),
  require('../assets/lesson-4/dice-4-transparent.png'),
  require('../assets/lesson-4/dice-5-transparent.png'),
  require('../assets/lesson-4/dice-6-transparent.png'),
];

export function LessonFourScreen({ onHome, onComplete, onPredictionComplete }: { onHome: () => void; onComplete: () => void; onPredictionComplete: (round: number) => boolean | void }) {
  const [stamps, setStamps] = useState<string[]>([]);
  const [probability, setProbability] = useState(false);
  const [die, setDie] = useState<number>();
  const [rolling, setRolling] = useState(false);
  const diePhase = useRef(new Animated.Value(1)).current;
  const rollDie = () => {
    if (rolling) return;
    setRolling(true);
    Animated.timing(diePhase, { toValue: 0, duration: 170, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(({ finished }) => {
      if (!finished) { setRolling(false); return; }
      setDie(previous => {
        let next = Math.floor(Math.random() * 6) + 1;
        if (next === previous) next = next % 6 + 1;
        return next;
      });
      Animated.timing(diePhase, { toValue: 1, duration: 300, easing: Easing.out(Easing.back(1.7)), useNativeDriver: true }).start(() => setRolling(false));
    });
  };
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
    <LessonBadge number={4} /><Text style={styles.title}>A particle? A wave?</Text>
    <View style={styles.avatar}><ParticleAvatar size={150} /></View>
    <Text style={styles.body}>The electron arrived as a point, but lots of electrons made an interference pattern. Which everyday description seems to fit it best?</Text>
    <View style={styles.stamps}>{['Particle', 'Wave'].map(label => <AnswerButton key={label} label={label} state={stamps.length === 2 ? 'correct' : stamps.includes(label) ? 'selected' : 'default'} disabled={stamps.includes(label)} onPress={() => setStamps(old => old.includes(label) ? old : [...old, label])} />)}</View>
    {stamps.length === 1 && <Text style={styles.tryOther}>Not so fast… Try choosing the other option.</Text>}
    {stamps.length === 2 && <>
      <View style={styles.note}><Text style={styles.heading}>A particle or wave only describes part of the story.{'\n'}Neither label by itself is enough.</Text>
        <Text style={[styles.body, { marginBottom: 18 }]}>An electron isn’t a tiny classical ball or an ordinary water wave.</Text>
        <Text style={styles.body}>Different experiments reveal particle-like or wave-like behaviour.</Text>
      </View>
      <Text style={styles.howBoth}>How can it be both????</Text>
      <TerminologyCard term="Wave-particle duality" definition="This is the name for the behaviour we just saw in quantum particles. They display wave-like properties, but also behave like individual particles-like balls-depending on how they are measured." />
      <MysteryPanel unlocked number={2} title="Wave-particle duality" body="The electron arrived as one particle-like dot, but many electrons built a wave-like interference pattern. Wave-particle duality ties those two clues together." />
      <View style={{ marginTop: 64, paddingTop: 24, borderTopWidth: 1, borderColor: colors.border }}>
        <Text style={styles.heading}>Let’s look more closely at where the electrons land each time.</Text>
        <Text style={styles.body}>Let’s play a game. I’ll give you 3 guesses to see which area the electron lands in.</Text>
        <ProbabilityExperiment onComplete={() => setProbability(true)} onPredictionComplete={onPredictionComplete} />
      </View>
    </>}
    {probability && <View style={styles.section}>
      <Text style={styles.heading}>Two kinds of prediction</Text>
      <ScratchReveal title="Basketball → hoop" coatingColor="#F2C5A7">In an ideal classical model, exact starting conditions and forces give one definite path.</ScratchReveal>
      <ScratchReveal title="Electron → screen" coatingColor="#F2C5A7">Quantum mechanics gives probabilities for possible arrivals. For this experiment it does not give one guaranteed landing point.</ScratchReveal>
      <Text style={styles.heading}>Haven’t we seen probability before?</Text><Text style={styles.body}>Think of a die. We usually predict one of six faces because we don’t know every detail of its tumble. Even though we use probabilities, with precise enough measurements we could, in principle, determine which number it lands on in a classical model.</Text>
      <View style={styles.die}>{die ? <Animated.Image source={diceFaces[die - 1]} resizeMode="contain" style={[styles.dieImage, { opacity: diePhase, transform: [{ scale: diePhase.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }) }, { rotate: diePhase.interpolate({ inputRange: [0, 1], outputRange: ['-140deg', '0deg'] }) }] }]} accessibilityLabel={`Die showing ${die}`} /> : <Text style={styles.dieText}>?</Text>}</View><PrimaryButton label={rolling ? 'Rolling...' : die ? 'Roll it again' : 'Roll the die'} disabled={rolling} onPress={rollDie} />
      <Text style={[styles.body, { marginTop: 20 }]}>BUT… in quantum mechanics, even if we have all the information about this experiment, our predictions for where the electron lands can only be given as probabilities, not as one guaranteed result.</Text>
      <Text style={styles.heading}>Uncertain doesn’t mean anything goes.</Text><Text style={styles.body}>In quantum mechanics, the probabilities follow precise rules. Across many repetitions, the pattern becomes predictable-even when the next dot isn’t.</Text>
      <LessonFinishActions onComplete={onComplete} />
    </View>}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 70 },
  back: { fontFamily: fonts.body, color: colors.primary, fontSize: 20, paddingVertical: 14 },
  eyebrow: { fontFamily: fonts.display, color: colors.primary, fontSize: 15 }, title: { fontFamily: fonts.display, color: colors.ink, fontSize: 42, marginVertical: 18 },
  body: { fontFamily: fonts.body, color: colors.ink, fontSize: 21, lineHeight: 28 }, heading: { fontFamily: fonts.body, color: colors.ink, fontSize: 30, lineHeight: 37, marginVertical: 20 },
  avatar: { height: 165, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }, stamps: { gap: 12, marginTop: 22 },
  tryOther: { color: colors.coral, fontFamily: fonts.body, fontSize: 21, lineHeight: 27, textAlign: 'center', marginTop: 15 },
  howBoth: { color: colors.coral, fontFamily: fonts.display, fontSize: 31, lineHeight: 37, textAlign: 'center', marginTop: 30, marginBottom: 8 },
  note: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, borderRadius: 18, padding: 18, marginTop: 26 },
  term: { fontFamily: fonts.display, color: colors.primary, fontSize: 30, marginVertical: 20 }, unlocked: { fontFamily: fonts.display, color: colors.green, fontSize: 17, marginTop: 24, marginBottom: 8 },
  section: { marginTop: 24 }, die: { alignSelf: 'center', width: 108, height: 108, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  dieImage: { width: 108, height: 108 },
  dieText: { fontFamily: fonts.display, fontSize: 42, color: colors.primary }, caption: { fontFamily: fonts.body, color: colors.muted, fontSize: 16, lineHeight: 22, marginTop: 20 },
});
