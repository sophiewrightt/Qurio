import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { QuantumPossibilityLabs } from '../components/QuantumPossibilityLabs';
import { quantumPossibilityQuestions } from '../data/moduleTwo';
import { colors, fonts } from '../constants/theme';

type Phase = 'lesson' | 'quiz';

export function ModuleTwoLessonFourScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [phase, setPhase] = useState<Phase>('lesson');

  if (phase === 'quiz') return <SafeAreaView style={styles.safe}><Text style={styles.module}>CHAPTER 2 · POSSIBILITY CHECKPOINT</Text><LessonQuiz questions={quantumPossibilityQuestions} takeaway="A quantum state lets us predict the probabilities of different measurement outcomes." onFinish={onComplete} /></SafeAreaView>;

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text><Text style={styles.module}>CHAPTER 2 · THE QUANTUM RULES</Text><LessonBadge number={4} world={2} />
    <Text style={styles.title}>Quantum state of mind</Text>
    <Text style={styles.bridge}>Enough about colours.</Text>
    <Text style={styles.body}>Let’s move onto something different.</Text>
    <Text style={styles.guidingQuestion}>If quantum outcomes are uncertain, how do physicists describe what might happen?</Text>
    <QuantumPossibilityLabs onComplete={() => setPhase('quiz')} />
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 80 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 }, module: { color: colors.coral, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 41, lineHeight: 48, marginVertical: 20 },
  bridge: { color: colors.coral, fontFamily: fonts.display, fontSize: 27, lineHeight: 34, marginBottom: 12 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginBottom: 18 },
  guidingQuestion: { color: colors.ink, fontFamily: fonts.body, fontSize: 26, lineHeight: 33, marginBottom: 4 },
});
