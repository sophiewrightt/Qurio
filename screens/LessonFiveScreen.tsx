import { LessonBadge } from '../components/LessonBadge';
import { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ElectronRun } from '../components/ElectronRun';
import { HoveringImage } from '../components/HoveringImage';
import { PrimaryButton } from '../components/PrimaryButton';
import { LessonQuiz } from '../components/LessonQuiz';
import { WallPattern } from '../components/WallPattern';
import { DancingElectronScene, MagicHatScene, WizardMagicScene } from '../components/LessonFiveAnimations';
import { colors, fonts } from '../constants/theme';
import { lessonFiveQuestions } from '../data/lessonFive';

const consciousElectron = require('../assets/lesson-5/conscious-electron-transparent.png');
const stageFrightElectron = require('../assets/lesson-5/stage-fright/behind-curtain-transparent.png');

export function LessonFiveScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [firstComplete, setFirstComplete] = useState(false);
  const [secondComplete, setSecondComplete] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  if (quizStarted) return <SafeAreaView style={styles.safe}><LessonBadge number={5} compact /><LessonQuiz questions={lessonFiveQuestions} takeaway="A measurement changes this experiment through physical interaction, not through conscious attention." onFinish={onComplete} /></SafeAreaView>;
  return <SafeAreaView style={styles.safe}><ScrollView removeClippedSubviews={false} contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
    <LessonBadge number={5} />
    <Text style={styles.title}>Electron stage fright…</Text>
    <Text style={styles.body}>We KNOW now that when we send electrons through two slits, on the other side we see an interference pattern - that pattern that shows wave-like behaviour.</Text>
    <Text style={styles.body}>Another confusing thing is, if we are sending the electrons through one at a time, how are they not just going straight into the two fringes that are directly in front of the slits? <Text style={{ fontWeight: 'bold' }}>Do they somehow know to make this pattern?</Text></Text>
    <HoveringImage source={consciousElectron} style={styles.consciousElectron} accessibilityLabel="An electron wondering about its path" />
    <Text style={styles.heading}>A very reasonable question.</Text>
    <Text style={styles.body}>First let’s go back to the experiment we had before. We have:</Text>
    <Text style={styles.bullet}>• an electron shooter</Text>
    <Text style={styles.bullet}>• a wall with 2 slits</Text>
    <Text style={styles.bullet}>• a detector to show where the electrons land.</Text>
    <Text style={styles.body}>We still do not know which slit an electron passes through, so its path is censored.</Text>
    <ElectronRun concealPath onPattern={() => setFirstComplete(true)} />
    {firstComplete && <>
      <Text style={styles.body}>Exactly as before, we have alternating bands.</Text>
      <View style={styles.nextExperiment}>
        <Text style={styles.heading}>This time, let’s add detectors at each slit which will tell us if an electron is passing through it or not.</Text>
        <Text style={styles.body}>We simply have an electron shooter,</Text>
        <Text style={styles.bullet}>• a wall with 2 slits</Text>
        <Text style={styles.bullet}>• a detector to show where the electrons land</Text>
        <Text style={[styles.bullet, styles.added]}>+ a detector at each slit ← new!</Text>
        <ElectronRun whichPath onPattern={() => setSecondComplete(true)} />
      </View>
    </>}
    {firstComplete && secondComplete && <>
      <Text style={[styles.title, { color: colors.coral }]}>WAIT, WHAT?</Text>
      <Text style={styles.body}>When we recorded which slit the electrons passed through, the interference bands disappeared.</Text>
      <View style={styles.comparison}>
        <View style={styles.example}><WallPattern kind="interference" /><Text style={styles.label}>Without detectors</Text><Text style={styles.small}>Interference bands</Text></View>
        <View style={styles.example}><WallPattern kind="two" /><Text style={styles.label}>With detectors</Text><Text style={styles.small}>No interference bands</Text></View>
      </View>
      <Text style={styles.heading}>If recording the path changes the pattern, does a person looking at it make the difference?</Text>
      <Text style={styles.body}>For a while, some scientists thought that a conscious person staring at a quantum particle changes what happens. But this isn’t what’s happening here.</Text>
      <WizardMagicScene />
      <Text style={styles.body}>In fact, closing your eyes doesn’t switch quantum behaviour on or off.</Text>
      <View style={styles.note}><Text style={styles.heading}>The detector physically interacts.</Text>
        <Text style={styles.body}>Recording which slit it went through changes the experiment. We discover an important property of quantum particles: they are actually <Text style={styles.underline}>really</Text> sensitive to their surroundings.</Text>
        <Image source={stageFrightElectron} resizeMode="contain" style={styles.stageFrightElectron} accessibilityLabel="An electron hiding behind a curtain with stage fright" />
        <Text style={styles.body}>Electrons are not conscious, but here is a memory trick. When you dance in your room and nobody else is around, you might dance like crazy. If someone enters your environment, your dancing may become much simpler. In this experiment the detector changes the electron’s environment, so the pattern changes. It is almost as if the electron gets stage fright - but the real cause is physical interaction, not feelings.</Text>
        <DancingElectronScene />
        <Text style={styles.body}>There are other ways that we can get this result too, if the quantum particle interacts with its environment.</Text>
      </View>
      <Text style={styles.heading}>Magic? No. Surprising physics? Absolutely.</Text>
      <MagicHatScene />
      <PrimaryButton label="Start the quiz" onPress={() => setQuizStarted(true)} />
    </>}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 70 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  kicker: { color: colors.primary, fontFamily: fonts.display, fontSize: 15 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 40, marginVertical: 20 },
  heading: { color: colors.ink, fontFamily: fonts.body, fontSize: 29, marginVertical: 18 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, marginBottom: 18 },
  bullet: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, marginBottom: 16, paddingLeft: 8 },
  added: { backgroundColor: '#FFF0A6', borderRadius: 10, padding: 12, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#D4A335', marginBottom: 24 },
  nextExperiment: { marginTop: 26, paddingTop: 20, borderTopWidth: 2, borderStyle: 'dashed', borderColor: colors.primary },
  comparison: { flexDirection: 'row', gap: 12, marginBottom: 22 }, example: { flex: 1, alignItems: 'center' },
  label: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, textAlign: 'center' },
  small: { color: colors.ink, fontFamily: fonts.body, fontSize: 17, textAlign: 'center' },
  note: { padding: 18, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, borderStyle: 'dashed', borderRadius: 18 },
  underline: { textDecorationLine: 'underline' },
  consciousElectron: { width: '100%', height: 280, alignSelf: 'center', marginTop: 4, marginBottom: 10 },
  stageFrightElectron: { width: 260, height: 190, alignSelf: 'center', marginBottom: 18 },
});
