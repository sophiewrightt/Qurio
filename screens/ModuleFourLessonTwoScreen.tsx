import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { ParticleIdentityLesson } from '../components/ParticleIdentityLesson';
import { identityQuestions } from '../data/moduleFour';
import { colors, fonts } from '../constants/theme';

export function ModuleFourLessonTwoScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [quiz, setQuiz] = useState(false);
  if (quiz) return <SafeAreaView style={styles.safe}>
    <Text style={styles.module}>CHAPTER 4 · PARTICLE ID CHECKPOINT</Text>
    <LessonQuiz questions={identityQuestions} takeaway="Same kind, same intrinsic properties. Different states do not make different kinds of particle." onFinish={onComplete} />
  </SafeAreaView>;
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
    <Text style={styles.module}>CHAPTER 4 · BETTER TOGETHER</Text><LessonBadge number={2} world={4} />
    <ParticleIdentityLesson onComplete={() => setQuiz(true)} />
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 80, maxWidth: 640, width: '100%', alignSelf: 'center' },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  module: { color: '#B33C87', fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
});
