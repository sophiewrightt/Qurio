import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { SchrodingerCatLesson } from '../components/SchrodingerCatLesson';
import { schrodingerCatQuestions } from '../data/moduleTwo';
import { colors, fonts } from '../constants/theme';

type Phase = 'lesson' | 'quiz';

export function ModuleTwoLessonSevenScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [scrollLocked, setScrollLocked] = useState(false);
  const [phase, setPhase] = useState<Phase>('lesson');

  if (phase === 'quiz') return <SafeAreaView style={styles.safe}><Text style={styles.module}>CHAPTER 2 · CAT CHECKPOINT</Text><LessonQuiz questions={schrodingerCatQuestions} takeaway="Schrödinger’s cat is a thought experiment about extending a quantum superposition to an everyday object. Real large systems decohere extremely quickly." onFinish={onComplete} /></SafeAreaView>;

  return <SafeAreaView style={styles.safe}><ScrollView scrollEnabled={!scrollLocked} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text><Text style={styles.module}>CHAPTER 2 · THE QUANTUM RULES</Text><LessonBadge number={7} world={2} />
    <Text style={styles.title}>One Crazy Cat</Text><SchrodingerCatLesson onScrollLock={setScrollLocked} onComplete={() => setPhase('quiz')} />
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 80 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 }, module: { color: colors.coral, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 41, lineHeight: 48, marginVertical: 20 },
});
