import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { PrimaryButton } from '../components/PrimaryButton';
import { lessonTwoQuestions } from '../data/lessonTwo';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ThrowExperiment } from '../components/ThrowExperiment';
import { colors, fonts } from '../constants/theme';

export function LessonTwoScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [tried, setTried] = useState<string[]>([]);
  const mark = (id: string) => setTried(old => old.includes(id) ? old : [...old, id]);
  if (quizStarted) return <SafeAreaView style={styles.safe}><LessonBadge number={2} compact /><LessonQuiz questions={lessonTwoQuestions} onFinish={onComplete} /></SafeAreaView>;
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <Text onPress={onHome} accessibilityRole="button" style={styles.back}>‹ Home</Text>
    <LessonBadge number={2} />
    <Text style={styles.title}>Let’s play basketball.</Text>
    <Text style={styles.body}>If we throw a basketball towards a hoop, can we predict where it goes?</Text>
    <ThrowExperiment mode="ball" onTried={() => mark('ball')} />
    {tried.includes('ball') && <View style={styles.section}>
      <Text style={styles.body}>If we repeat throwing the basketball in the same conditions-the same amount of force and the same direction-there is a definite path it follows.</Text>
      <Text style={styles.body}>Yes-real measurements are imperfect, but in this ideal world, we can predict exactly where the ball will be over time.</Text>
      <Text style={styles.body}>{'Classical physics'.split('').map((letter, i) => <Text key={i} style={{ color: ['#C93432', '#BE6421', '#92740F', '#307748', '#326EB4', '#7955C6'][i % 6] }}>{letter}</Text>)} describes the motion of everyday objects extremely well.</Text>
      <Text style={styles.heading}>…Let’s play ant basketball.</Text>
      <Text style={styles.body}>When we shrink down our system to an ant trying to dunk a grain of sand, what happens?</Text>
      <ThrowExperiment mode="sand" onTried={() => mark('sand')} />
    </View>}
    {tried.includes('sand') && <View style={styles.section}>
      <Text style={styles.body}>Yes, the system is smaller, and it might be harder to measure, but a grain of sand’s movement is still compatible with classical physics.</Text>
      <Text style={styles.heading}>Ok… Let’s play{'\n'}electron basketball.</Text>
      <Text style={styles.body}>If a microscopic LeBron James dunked this electron, how would it move?</Text>
      <ThrowExperiment mode="electron" onTried={() => mark('electron')} />
    </View>}
    {tried.includes('electron') && <View style={styles.section}>
      <Text style={styles.body}>You may have heard that there is classical physics-which we saw with normal basketball and ant basketball-and then there’s <Text style={styles.underline}>quantum physics</Text>. It turns out that when we zoom in too far, we can no longer make predictions the way we can in our big world: electron basketball becomes more unpredictable.</Text>
      <PrimaryButton label="Start the quiz" onPress={() => setQuizStarted(true)} />
    </View>}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 70 },
  back: { fontFamily: fonts.body, color: colors.primary, fontSize: 20, paddingVertical: 14 },
  eyebrow: { fontFamily: fonts.display, color: colors.primary, fontSize: 15, letterSpacing: 1 },
  title: { fontFamily: fonts.display, color: colors.ink, fontSize: 42, marginVertical: 18 },
  heading: { fontFamily: fonts.body, color: colors.ink, fontSize: 28, lineHeight: 37, flexShrink: 1, marginTop: 34, marginBottom: 14 },
  body: { fontFamily: fonts.body, color: colors.ink, fontSize: 21, lineHeight: 28, marginBottom: 18 },
  underline: { textDecorationLine: 'underline', textDecorationStyle: 'solid' },
  section: { marginTop: 28 },
});
