import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { requiredFinalAnswers } from '../data/learnerRules';
import { QuantumBuildingFinale } from '../components/QuantumBuildingFinale';
import { QuantumRulesFinale } from '../components/QuantumRulesFinale';
import { AccessoryId } from '../data/customisation';
import { quantumRulesChallengeQuestions } from '../data/moduleTwo';
import { colors, fonts } from '../constants/theme';

type Phase = 'lesson' | 'quiz' | 'complete';

export function ModuleTwoLessonEightScreen({ onHome, onComplete, onUnlockAccessories, ownedAccessories = [] }: {
  onHome: () => void;
  onComplete: (correct: number) => void;
  onUnlockAccessories?: (ids: AccessoryId[]) => void;
  ownedAccessories?: AccessoryId[];
}) {
  const [phase, setPhase] = useState<Phase>('lesson');
  const [score, setScore] = useState(0);

  if (phase === 'quiz') return <SafeAreaView style={styles.safe}><Text style={styles.module}>CHAPTER 2 · FINAL CHALLENGE</Text><LessonQuiz minimumCorrect={requiredFinalAnswers(quantumRulesChallengeQuestions.length)} onNotPassed={onHome} questions={quantumRulesChallengeQuestions} completionActions={false} finalActionLabel="See Chapter 2 results" onFinish={correct => { setScore(correct); setPhase('complete'); }} /></SafeAreaView>;

  if (phase === 'complete') return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><QuantumBuildingFinale score={score} ownedAccessories={ownedAccessories} onUnlockAccessories={onUnlockAccessories} onFinish={() => onComplete(score)} /></ScrollView></SafeAreaView>;

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text><Text style={styles.module}>CHAPTER 2 · THE QUANTUM RULES</Text><LessonBadge number={8} world={2} />
    <Text style={styles.title}>Quantum rules at work</Text><QuantumRulesFinale onStartChallenge={() => setPhase('quiz')} />
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 80 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 }, module: { color: colors.coral, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 41, lineHeight: 48, marginVertical: 20 },
});
