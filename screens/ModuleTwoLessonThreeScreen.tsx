import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { LessonFinishActions } from '../components/LessonFinishActions';
import { PhotonLessonLabs } from '../components/PhotonLessonLabs';
import { PhotonUnlockModal } from '../components/PhotonUnlockModal';
import { photonColourQuestions } from '../data/moduleTwo';
import { colors, fonts } from '../constants/theme';

type Phase = 'lesson' | 'quiz' | 'complete';

export function ModuleTwoLessonThreeScreen({ onHome, onComplete, onChoosePhoton }: { onHome: () => void; onComplete: (correct: number) => void; onChoosePhoton?: () => void }) {
  const [phase, setPhase] = useState<Phase>('lesson');
  const [score, setScore] = useState(0);
  const [unlockVisible, setUnlockVisible] = useState(false);

  const finish = (choosePhoton: boolean) => {
    if (choosePhoton) onChoosePhoton?.();
    setUnlockVisible(false);
    onComplete(score);
    setPhase('complete');
  };

  if (phase === 'complete') return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}><LessonFinishActions onComplete={() => {}} /></ScrollView></SafeAreaView>;

  if (phase === 'quiz') return <SafeAreaView style={styles.safe}>
    <Text style={styles.module}>CHAPTER 2 · PHOTON CHECKPOINT</Text>
    <LessonQuiz questions={photonColourQuestions} completionActions={false} finalActionLabel="Unlock Photon" onFinish={correct => { setScore(correct); setUnlockVisible(true); }} />
    <PhotonUnlockModal visible={unlockVisible} score={score} onUsePhoton={() => finish(true)} onKeepElectron={() => finish(false)} />
  </SafeAreaView>;

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
    <Text style={styles.module}>CHAPTER 2 · THE QUANTUM RULES</Text>
    <LessonBadge number={3} world={2} />
    <Text style={styles.title}>Colourful results</Text>
    <PhotonLessonLabs onComplete={() => setPhase('quiz')} />
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 80 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  module: { color: colors.coral, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 41, lineHeight: 48, marginVertical: 20 },
});
