import { LessonBadge } from '../components/LessonBadge';
import { TourWhenVisible, useTour } from '../components/Onboarding';
import { useRef, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, View, StyleSheet } from 'react-native';
import { LessonSection } from '../components/LessonSection';
import { ParticleUnlockModal } from '../components/ParticleUnlockModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { LessonQuiz } from '../components/LessonQuiz';
import { LessonFinishActions } from '../components/LessonFinishActions';
import { colors, fonts, spacing, type } from '../constants/theme';
import { lessonBeats, lessonQuestions } from '../data/lessonOne';

export function LessonScreen({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const tour = useTour();
  const [inspectedThrough, setInspectedThrough] = useState(-1);
  const [quizStarted, setQuizStarted] = useState(false);
  const [explored, setExplored] = useState(false);
  const [holding, setHolding] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [finished, setFinished] = useState(false);
  const collected = useRef(false);
  return <SafeAreaView style={styles.safe}>
    <View style={styles.header}>
      {!quizStarted && <Text onPress={onBack} accessibilityRole="button" accessibilityLabel="Back to Home" style={styles.back}>‹</Text>}
      <View style={styles.headerMiddle}><Text style={styles.headerTitle}>{quizStarted ? 'Lesson 1 · Quiz' : 'How small can we go?'}</Text></View>
    </View>
    {quizStarted ? finished ? <View style={styles.finished}><LessonFinishActions onComplete={() => {}} /></View> : <LessonQuiz questions={lessonQuestions} completionActions={false} finalActionLabel="Meet your electron" onFinish={() => setShowReward(true)} /> :
    <ScrollView removeClippedSubviews={false} scrollEnabled={!holding} showsVerticalScrollIndicator={false}>
      <View style={styles.intro}><LessonBadge number={1} /><Text style={styles.introTitle}>When we zoom into an everyday object, how small can we go?</Text><Text style={styles.introBody}>Can we go on forever?</Text><Text style={styles.scroll}>scroll to explore ↓</Text></View>
      {lessonBeats.slice(0, inspectedThrough + 2).map((beat, i) => <LessonSection key={beat.eyebrow} beat={beat} index={i} onHolding={setHolding} onInspect={() => { setInspectedThrough(old => Math.max(old, i)); if (beat.final) setExplored(true); }} />)}
      {explored ? <View style={styles.reveal}>
        <Text style={[styles.revealTitle, { color: '#C93432' }]}>Looks like we've hit a dead end…</Text>
        <Text style={styles.revealBody}>Some particles go no smaller. As far as we currently know, there are 17 different special kinds of particles in the Standard Model called <Text style={{ backgroundColor: '#FFE48A', textDecorationLine: 'underline' }}>elementary particles</Text> that aren’t made of anything smaller.</Text>
        <Text style={styles.elementaryTitle}>ELEMENTARY PARTICLES</Text>
        <Image source={require('../assets/lesson-1/elementary.png')} resizeMode="contain" style={styles.gridImage} />
        <Text style={styles.progressNote}>As you progress, you’ll be able to learn about and unlock these particles later...</Text>
        <Image source={require('../assets/particles/electron-content.png')} style={styles.firstParticle} resizeMode="contain" accessibilityLabel="Electron" />
        <Text style={[styles.revealBody, styles.firstParticleCopy]}>Meet your first elementary particle: the electron. Electrons are part of atoms, and their movement carries electric current through metal wires.</Text>
        <View style={{ marginTop: 32 }}><TourWhenVisible><PrimaryButton label="Start the quiz" onPress={() => { if (tour.state.step === 'exploring') tour.event('quiz-visible'); else setQuizStarted(true); }} /></TourWhenVisible></View>
      </View> : null}
    </ScrollView>}
    <ParticleUnlockModal visible={showReward} onCollect={() => {
      if (collected.current) return;
      collected.current = true; setShowReward(false); onComplete(); setFinished(true);
    }} />
  </SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, header: { height: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border, zIndex: 2 }, back: { fontSize: 38, color: colors.ink, width: 34, lineHeight: 42 }, headerMiddle: { flex: 1, marginHorizontal: spacing.sm }, headerTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: type.small, marginBottom: 8 }, step: { color: colors.ink, fontSize: type.tiny, fontFamily: fonts.body, width: 36, textAlign: 'right' }, intro: { padding: spacing.lg, paddingBottom: 0 }, introMark: { color: colors.coral, fontSize: type.hero, marginBottom: spacing.md }, kicker: { color: colors.primary, fontFamily: fonts.display, letterSpacing: 1.6, fontSize: type.tiny }, introTitle: { color: colors.ink, fontFamily: fonts.body, fontSize: type.h1, lineHeight: 46, marginTop: spacing.md }, introBody: { color: colors.ink, fontFamily: fonts.body, fontSize: type.h3, marginTop: spacing.md }, scroll: { color: colors.coral, fontFamily: fonts.display, marginTop: spacing.md }, reveal: { padding: spacing.lg, paddingVertical: spacing.xxl, backgroundColor: '#EEE9FF' }, revealEyebrow: { color: colors.primaryDark, fontFamily: fonts.display, letterSpacing: 1.4, fontSize: type.tiny }, revealTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: type.h1, marginTop: 7 }, elementaryTitle: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 29, letterSpacing: 1.5, textAlign: 'center', marginTop: 28 }, gridImage: { width: '112%', alignSelf: 'center', height: 440, marginVertical: spacing.lg }, progressNote: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, lineHeight: 26, textAlign: 'center', backgroundColor: '#FFF0B8', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#D19B27', borderRadius: 14, padding: 14, marginBottom: 22 }, revealBody: { color: colors.ink, fontSize: 20, fontFamily: fonts.body, lineHeight: 25 }, firstParticle: { width: 230, height: 210, alignSelf: 'center', marginTop: spacing.lg }, firstParticleCopy: { textAlign: 'center', marginTop: spacing.sm }, finished: { flex: 1, justifyContent: 'center', padding: spacing.lg }, quiz: { minHeight: 650, justifyContent: 'center', padding: spacing.lg }, feedback: { marginTop: spacing.lg }, feedbackText: { color: colors.green, fontFamily: fonts.display, fontSize: type.body, marginBottom: spacing.md }, xpFloat: { color: colors.primary, fontSize: type.h3, fontFamily: fonts.display, alignSelf: 'center' } });
