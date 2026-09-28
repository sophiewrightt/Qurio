import { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { requiredFinalAnswers } from '../data/learnerRules';
import { FinalQuizRequirement } from '../components/FinalQuizRequirement';
import { PrimaryButton } from '../components/PrimaryButton';
import { WorldQuizRecap, QuizRefresherNote } from '../components/WorldQuizRecap';
import { FloatingStrange } from '../components/StrangeSpinLesson';
import { QuantumConnectionsCompletion } from '../components/QuantumConnectionsFinale';
import { quantumConnectionsFinalQuestions } from '../data/moduleThree';
import { AccessoryId } from '../data/customisation';
import { colors, fonts } from '../constants/theme';

export function ModuleThreeLessonEightScreen({ onHome, onComplete, ownedAccessories, onUnlockAccessories }: {
  onHome: () => void; onComplete: (correct: number) => void;
  ownedAccessories: AccessoryId[]; onUnlockAccessories: (ids: AccessoryId[]) => void;
}) {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'complete'>('intro');
  const [score, setScore] = useState(0);
  const quizFinished = useRef(false);
  if (phase === 'quiz') return <SafeAreaView style={styles.safe}>
    <LessonQuiz minimumCorrect={requiredFinalAnswers(quantumConnectionsFinalQuestions.length)} onNotPassed={onHome} questions={quantumConnectionsFinalQuestions} completionActions={false} finalActionLabel="Celebrate Chapter 3" onFinish={correct => {
      if (quizFinished.current) return;
      quizFinished.current = true;
      setScore(correct); setPhase('complete');
    }} />
  </SafeAreaView>;
  return <SafeAreaView style={styles.safe}><ScrollView key={phase} contentContainerStyle={styles.content}>
    {phase === 'intro' ? <>
      <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
      <Text style={styles.module}>CHAPTER 3 · QUANTUM CONNECTIONS</Text>
      <LessonBadge number={8} world={3} />
      <Text style={styles.title}>Connecting the dots</Text>
      <FloatingStrange compact />
      <Text style={styles.body}>Spin, entanglement, secret messages and teleportation. Let’s put your Chapter 3 discoveries together!</Text>
      <WorldQuizRecap world={3} />
      <FinalQuizRequirement total={quantumConnectionsFinalQuestions.length} />
      <PrimaryButton label="Start the final challenge" onPress={() => setPhase('quiz')} />
      <QuizRefresherNote />
    </> : <QuantumConnectionsCompletion correct={score} total={quantumConnectionsFinalQuestions.length} ownedAccessories={ownedAccessories} onUnlockAccessories={onUnlockAccessories} onFinish={() => onComplete(score)} />}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 80 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  module: { color: colors.green, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 39, lineHeight: 46, marginVertical: 20 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginVertical: 20 },
});
