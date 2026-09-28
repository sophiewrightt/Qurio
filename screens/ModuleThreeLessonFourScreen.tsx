import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { NoSignallingLesson } from '../components/NoSignallingLesson';
import { noSignallingQuestions } from '../data/moduleThree';
import { colors, fonts } from '../constants/theme';

export function ModuleThreeLessonFourScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [quiz, setQuiz] = useState(false);

  if (quiz) return <SafeAreaView style={styles.safe}>
    <Text style={styles.module}>CHAPTER 3 · BELL CHECKPOINT</Text>
    <LessonQuiz questions={noSignallingQuestions} takeaway="Bell tests rule out local pre-written answers, but entanglement still cannot send a controllable message faster than light." onFinish={onComplete} />
  </SafeAreaView>;

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
    <Text style={styles.module}>CHAPTER 3 · QUANTUM CONNECTIONS</Text>
    <LessonBadge number={5} world={3} />
    <Text style={styles.title}>Does that ring a bell?</Text>
    <NoSignallingLesson onComplete={() => setQuiz(true)} />
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 80 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  module: { color: colors.green, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 39, lineHeight: 46, marginVertical: 20 },
});
