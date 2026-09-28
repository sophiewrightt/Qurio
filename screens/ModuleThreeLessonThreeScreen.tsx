import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { TelepathyLesson } from '../components/TelepathyLesson';
import { telepathyQuestions } from '../data/moduleThree';
import { colors, fonts } from '../constants/theme';

export function ModuleThreeLessonThreeScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [quiz, setQuiz] = useState(false);

  if (quiz) return <SafeAreaView style={styles.safe}>
    <Text style={styles.module}>CHAPTER 3 · TWIN TELEPATHY CHECKPOINT</Text>
    <LessonQuiz questions={telepathyQuestions} takeaway="The entangled results line up across an enormous distance, even though a light-speed signal would take millions of years. Next we’ll test whether that lets quantum information travel faster than light." onFinish={onComplete} />
  </SafeAreaView>;

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
    <Text style={styles.module}>CHAPTER 3 · QUANTUM CONNECTIONS</Text>
    <LessonBadge number={4} world={3} />
    <Text style={styles.title}>Twin telepathy</Text>
    <TelepathyLesson onComplete={() => setQuiz(true)} />
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 80 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  module: { color: colors.green, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 41, lineHeight: 48, marginVertical: 20 },
});
