import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { JointStateLessonLabs } from '../components/JointStateLessonLabs';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { jointQuantumStateQuestions } from '../data/moduleThree';
import { colors, fonts } from '../constants/theme';

export function ModuleThreeLessonOneScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [quiz, setQuiz] = useState(false);

  if (quiz) return <SafeAreaView style={styles.safe}>
    <Text style={styles.module}>CHAPTER 3 · CONNECTION CHECKPOINT</Text>
    <LessonQuiz questions={jointQuantumStateQuestions} takeaway="An interaction can prepare two strange quarks in one entangled state. In this ideal preparation, their vertical spin results are correlated and always opposite." onFinish={onComplete} />
  </SafeAreaView>;

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
    <Text style={styles.module}>CHAPTER 3 · QUANTUM CONNECTIONS</Text>
    <LessonBadge number={2} world={3} />
    <Text style={styles.title}>When two particles meet…</Text>
    <JointStateLessonLabs onComplete={() => setQuiz(true)} />
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 80 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  module: { color: colors.green, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 41, lineHeight: 48, marginVertical: 20 },
});
