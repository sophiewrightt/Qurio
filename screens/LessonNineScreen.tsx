import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ParticleAvatar } from '../components/ParticleAvatar';
import { ExploreFurther } from '../components/ExploreFurther';
import { LearningMap } from '../components/LearningMap';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { requiredFinalAnswers } from '../data/learnerRules';
import { FinalQuizRequirement } from '../components/FinalQuizRequirement';
import { PrimaryButton } from '../components/PrimaryButton';
import { WorldQuizRecap, QuizRefresherNote } from '../components/WorldQuizRecap';
import { RewardPack } from '../components/RewardPack';
import { LessonFinishActions } from '../components/LessonFinishActions';
import { WorldCelebration } from '../components/WorldCelebration';
import { AccessoryId } from '../data/customisation';
import { lessonNineQuestions } from '../data/lessonNine';
import { colors, fonts } from '../constants/theme';

type Phase = 'intro' | 'quiz' | 'map';

export function LessonNineScreen({ onHome, onComplete, onUnlockAccessories, ownedAccessories = [] }: {
  onHome: () => void; onComplete: (correct: number) => void; onUnlockAccessories?: (ids: AccessoryId[]) => void; ownedAccessories?: AccessoryId[];
}) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [score, setScore] = useState(0);
  if (phase === 'quiz') return <SafeAreaView style={styles.safe}><LessonBadge number={9} compact /><LessonQuiz minimumCorrect={requiredFinalAnswers(lessonNineQuestions.length)} onNotPassed={onHome} questions={lessonNineQuestions} completionActions={false} finalActionLabel="See Chapter 1 results" onFinish={correct => { setScore(correct); setPhase('map'); }} /></SafeAreaView>;
  if (phase === 'intro') return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
    <LessonBadge number={9} />
    <Text style={styles.title}>Welcome to Quantum.</Text>
    <ParticleAvatar size={175} discovered />
    <Text style={styles.heading}>Ok... so now you know a little bit about quantum mechanics.</Text>
    <Text style={styles.body}>Let’s check the big ideas from this chapter.</Text>
    <WorldQuizRecap world={1} />
    <FinalQuizRequirement total={lessonNineQuestions.length} />
    <PrimaryButton label="Start the quiz" onPress={() => setPhase('quiz')} />
    <QuizRefresherNote />
  </ScrollView></SafeAreaView>;
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <LessonBadge number={9} />
    <Text style={styles.score}>FINAL CHECK · {score}/6</Text>
    <Text style={styles.title}>Look how far you’ve come!</Text>
    <ExploreFurther title="Revisit the story"><LearningMap onComplete={() => {}} /></ExploreFurther>
    <View style={styles.complete}>
      <WorldCelebration source={require('../assets/lesson-9/electron-celebrating-transparent.png')} accessibilityLabel="A celebrating electron jumps while colourful confetti falls" />
      <Text style={styles.worldComplete}>CHAPTER COMPLETE!</Text>
      <Text style={styles.discovered}>You completed your first quantum chapter.</Text>
      <RewardPack onOpen={onUnlockAccessories} excludeIds={ownedAccessories} />
      <LessonFinishActions next={false} homeLabel="Finish Chapter 1" onComplete={() => onComplete(score)} />
    </View>
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 70, alignItems: 'center' },
  back: { width: '100%', color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  title: { width: '100%', color: colors.ink, fontFamily: fonts.display, fontSize: 42, lineHeight: 49, marginVertical: 20, textAlign: 'center' },
  heading: { color: colors.ink, fontFamily: fonts.body, fontSize: 30, lineHeight: 37, marginVertical: 20, textAlign: 'center' },
  body: { width: '100%', color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 29, marginBottom: 20, textAlign: 'center' },
  score: { color: colors.coral, fontFamily: fonts.display, fontSize: 17, letterSpacing: 1.3, marginTop: 4 },
  complete: { width: '100%', alignItems: 'center', marginTop: 26, paddingTop: 28, borderTopWidth: 3, borderStyle: 'dashed', borderColor: colors.coral },
  worldComplete: { color: colors.coral, fontFamily: fonts.display, fontSize: 39, textAlign: 'center', marginVertical: 12 },
  discovered: { color: colors.ink, fontFamily: fonts.body, fontSize: 25, textAlign: 'center', marginBottom: 10 },
  customise: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, textAlign: 'center', marginBottom: 8 },
});
