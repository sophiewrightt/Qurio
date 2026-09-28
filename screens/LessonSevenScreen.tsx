import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { PrimaryButton } from '../components/PrimaryButton';
import { TerminologyCard } from '../components/TerminologyCard';
import { UncertaintyLab } from '../components/UncertaintyLab';
import { lessonSevenQuestions } from '../data/lessonSeven';
import { colors, fonts } from '../constants/theme';

function RollingBasketball() {
  const roll = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.timing(roll, { toValue: 1, duration: 2600, easing: Easing.linear, useNativeDriver: true }));
    animation.start();
    return () => animation.stop();
  }, [roll]);
  return <View style={styles.ballStage} accessibilityLabel="A basketball rolling horizontally across the screen">
    <View style={styles.ground} />
    <Animated.Image source={require('../assets/lesson-1/basketball.png')} resizeMode="contain" style={[styles.rollingBall, {
      transform: [
        { translateX: roll.interpolate({ inputRange: [0, 1], outputRange: [-118, 118] }) },
        { rotate: roll.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] }) },
      ],
    }]} />
  </View>;
}

function HoldElectronScene() {
  const [held, setHeld] = useState(false);
  const [momentum, setMomentum] = useState(37);
  const travel = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (held) return;
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(travel, { toValue: 1, duration: 520, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(travel, { toValue: 0, duration: 410, easing: Easing.linear, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [held, travel]);
  useEffect(() => {
    if (held) return;
    const timer = setInterval(() => setMomentum(value => (value * 7 + 13) % 97), 180);
    return () => clearInterval(timer);
  }, [held]);
  const holdAtCurrentPosition = () => {
    travel.stopAnimation(value => travel.setValue(value));
    setHeld(true);
  };
  return <Pressable accessibilityRole="button" accessibilityLabel="Hold to stop the electron" onPressIn={holdAtCurrentPosition} onPressOut={() => setHeld(false)} style={styles.holdLab}>
    <Text style={styles.holdInstruction}>Hold the animation down to stop the electron</Text>
    <View style={styles.zipStage}>
      <Animated.Image source={require('../assets/particles/electron-avatar.png')} resizeMode="contain" style={[styles.zippingElectron, { opacity: held ? 1 : 0.78, transform: [{ translateX: travel.interpolate({ inputRange: [0, 1], outputRange: [-118, 118] }) }, { scale: held ? 1 : 0.72 }] }]} />
    </View>
    <View style={styles.readout}><Text style={styles.readoutText}>Position: <Text style={styles.readoutValue}>{held ? 'LOCATED' : 'UNKNOWN'}</Text></Text><Text style={styles.readoutText}>Momentum: <Text style={styles.readoutValue}>{held ? 'UNKNOWN' : `${momentum}.${(momentum * 3) % 10} units`}</Text></Text></View>
  </Pressable>;
}

export function LessonSevenScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [explored, setExplored] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  if (quizStarted) return <SafeAreaView style={styles.safe}><LessonBadge number={7} compact /><LessonQuiz questions={lessonSevenQuestions} onFinish={onComplete} /></SafeAreaView>;
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
    <LessonBadge number={7} />
    <Text style={styles.title}>How certain can we be?</Text>
    <Text style={styles.body}>With a basketball, we can measure where it is and how it is moving using our eyes, a camera, or fancy physics equipment. Easy enough.</Text>
    <RollingBasketball />
    <Text style={styles.body}>We know:</Text>
    <Text style={styles.bullet}>• where it is - <Text style={styles.bold}>position</Text></Text>
    <Text style={styles.bullet}>• its mass combined with its speed and direction - <Text style={styles.bold}>momentum</Text></Text>
    <Text style={styles.body}>Quantum particles are different. Let’s compare how sharply we can know an electron’s <Text style={styles.underline}>position</Text> and its <Text style={styles.underline}>momentum</Text>.</Text>
    <UncertaintyLab onInteract={() => setExplored(true)} />
    {!explored && <Text style={styles.hint}>Explore both ends of the slider, then explain what changed.</Text>}
    {explored && <View style={styles.reveal}>
      <Text style={styles.body}>In the double-slit experiment, we learnt that an electron does not carry one ordinary, fully knowable path. Position and momentum show the same quantum trade-off: making one more specific makes the other more vague.</Text>
      <HoldElectronScene />
      <TerminologyCard term="Heisenberg uncertainty principle" definition="For certain paired quantum properties - most famously position and momentum - their uncertainties cannot both be made arbitrarily small at once." />
      <PrimaryButton label="Start the quiz" onPress={() => setQuizStarted(true)} />
    </View>}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 70 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 42, lineHeight: 49, marginVertical: 20 },
  heading: { color: colors.ink, fontFamily: fonts.body, fontSize: 30, lineHeight: 37, marginVertical: 20 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 29, marginBottom: 20 },
  underline: { textDecorationLine: 'underline' },
  bold: { fontFamily: fonts.display, fontSize: 23, fontWeight: '700', color: colors.ink },
  bullet: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 29, marginBottom: 12, paddingLeft: 8 },
  ballStage: { height: 132, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 24, overflow: 'hidden' },
  ground: { position: 'absolute', bottom: 15, left: 7, right: 7, height: 3, borderRadius: 3, backgroundColor: colors.ink, opacity: 0.55, transform: [{ rotate: '-0.5deg' }] },
  rollingBall: { position: 'absolute', bottom: 14, width: 82, height: 82 },
  hint: { color: colors.ink, fontFamily: fonts.body, fontSize: 19, textAlign: 'center', marginBottom: 24 },
  reveal: { marginTop: 16, paddingTop: 20, borderTopWidth: 2, borderStyle: 'dashed', borderColor: colors.primary },
  holdLab: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.coral, borderRadius: 19, backgroundColor: '#FFF3D2', padding: 16, marginBottom: 24 },
  holdInstruction: { color: colors.ink, fontFamily: fonts.display, fontSize: 22, lineHeight: 28, textAlign: 'center', marginBottom: 8 },
  zipStage: { height: 145, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  zippingElectron: { position: 'absolute', width: 94, height: 94 },
  readout: { borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: colors.ink, paddingTop: 11 },
  readoutText: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, lineHeight: 28 },
  readoutValue: { color: colors.primaryDark, fontFamily: fonts.display },
});
