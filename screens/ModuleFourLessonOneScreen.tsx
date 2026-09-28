import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { TunnellingLesson } from '../components/TunnellingLesson';
import { tunnellingQuestions } from '../data/moduleFour';
import { colors, fonts } from '../constants/theme';

export function ModuleFourLessonOneScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [quiz, setQuiz] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);
  if (quiz) return <SafeAreaView style={styles.safe}>
    <Text style={styles.module}>CHAPTER 4 · TUNNELLING CHECKPOINT</Text>
    <LessonQuiz questions={tunnellingQuestions} takeaway="A barrier is not always a dead end. Quantum tunnelling gives a particle a chance to get through, and helps power our Sun." onFinish={onComplete} />
  </SafeAreaView>;
  return <SafeAreaView style={styles.safe}><ScrollView scrollEnabled={!scrollLocked} contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
    <Text style={styles.module}>CHAPTER 4 · BETTER TOGETHER</Text><LessonBadge number={1} world={4} />
    <TunnellingLesson onScrollLockChange={setScrollLocked} onComplete={() => setQuiz(true)} />
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 80, maxWidth: 640, width: '100%', alignSelf: 'center' },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  module: { color: '#B33C87', fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
});
