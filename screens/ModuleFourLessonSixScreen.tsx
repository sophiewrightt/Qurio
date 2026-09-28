import { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { requiredFinalAnswers } from '../data/learnerRules';
import { FinalQuizRequirement } from '../components/FinalQuizRequirement';
import { PrimaryButton } from '../components/PrimaryButton';
import { WorldQuizRecap, FloatingRecapParticle, QuizRefresherNote } from '../components/WorldQuizRecap';
import { LessonFinishActions } from '../components/LessonFinishActions';
import { RewardPack } from '../components/RewardPack';
import { WorldCelebration } from '../components/WorldCelebration';
import { worldFourFinalQuestions } from '../data/moduleFour';
import { AccessoryId } from '../data/customisation';
import { colors, fonts } from '../constants/theme';

export function ModuleFourLessonSixScreen({ onHome, onComplete, ownedAccessories, onUnlockAccessories }: {
  onHome: () => void; onComplete: (correct: number) => void;
  ownedAccessories: AccessoryId[]; onUnlockAccessories: (ids: AccessoryId[]) => void;
}) {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'complete'>('intro');
  const [score, setScore] = useState(0);
  const quizFinished = useRef(false);
  if (phase === 'quiz') return <SafeAreaView style={styles.safe}>
    <LessonBadge number={6} world={4} compact />
    <LessonQuiz minimumCorrect={requiredFinalAnswers(worldFourFinalQuestions.length)} onNotPassed={onHome} questions={worldFourFinalQuestions} completionActions={false} finalActionLabel="Celebrate Chapter 4" onFinish={correct => {
      if (quizFinished.current) return;
      quizFinished.current = true;
      setScore(correct); setPhase('complete');
    }} />
  </SafeAreaView>;
  return <SafeAreaView style={styles.safe}><ScrollView key={phase} contentContainerStyle={styles.content}>
    {phase === 'intro' ? <>
      <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
      <LessonBadge number={6} world={4} />
      <Text style={styles.title}>Putting it all together</Text>
      <FloatingRecapParticle particle="charm" />
      <Text style={styles.body}>Let’s bring your Chapter 4 discoveries together!</Text>
      <WorldQuizRecap world={4} />
      <FinalQuizRequirement total={worldFourFinalQuestions.length} />
      <PrimaryButton label="Start the final challenge" onPress={() => setPhase('quiz')} />
      <QuizRefresherNote />
    </> : <>
      <Text style={styles.score}>FINAL CHALLENGE · {score}/{worldFourFinalQuestions.length}</Text>
      <Text style={styles.title}>Chapter 4 complete!</Text>
      <WorldCelebration source={require('../assets/module-4/celebrating-charm.jpg')} sourceFrame={[0.39, 0.31, 0.285, 0.38]} accessibilityLabel="Celebrating Charm in a party hat jumps while colourful confetti falls" />
      <Text style={styles.body}>From tunnelling to atoms and shared quantum states, you’ve discovered why particles are better together!</Text>
      <RewardPack excludeIds={ownedAccessories} onOpen={onUnlockAccessories} />
      <LessonFinishActions next={false} homeLabel="Finish Chapter 4" onComplete={() => onComplete(score)} />
    </>}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 80 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 39, lineHeight: 46, marginVertical: 20 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, marginVertical: 20 },
  score: { color: '#B33C87', fontFamily: fonts.display, fontSize: 18, textAlign: 'center' },
});
