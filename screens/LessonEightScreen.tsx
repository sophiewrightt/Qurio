import { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { PrimaryButton } from '../components/PrimaryButton';
import { QuantumPhone } from '../components/QuantumPhone';
import { lessonEightQuestions } from '../data/lessonEight';
import { colors, fonts } from '../constants/theme';

const uses = [
  { image: require('../assets/lesson-8/laser-transparent.png'), name: 'Lasers' },
  { image: require('../assets/lesson-8/mri-transparent.png'), name: 'MRI' },
  { image: require('../assets/lesson-8/solar-cell-transparent.png'), name: 'Solar cells' },
  { image: require('../assets/lesson-8/quantum-computing-transparent.png'), name: 'Quantum computers' },
  { image: require('../assets/lesson-8/quantum-sensor-transparent.png'), name: 'Quantum sensors' },
];

export function LessonEightScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [phoneComplete, setPhoneComplete] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  if (quizStarted) return <SafeAreaView style={styles.safe}><LessonBadge number={8} compact /><LessonQuiz questions={lessonEightQuestions} onFinish={onComplete} /></SafeAreaView>;
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
    <LessonBadge number={8} />
    <Text style={styles.title}>Quantum isn’t just weird.</Text>
    <Text style={styles.body}>Here is a phone - the one you’re holding now will do.</Text>
    <Text style={styles.heading}>How much quantum physics do you think is inside it?</Text>
    <Text style={styles.body}>Turn it on, open the apps, and find all four quantum clues.</Text>
    <QuantumPhone onComplete={() => setPhoneComplete(true)} />
    {phoneComplete && <View style={styles.reveal}>
      <Text style={styles.heading}>And that’s only your phone.</Text>
      <Text style={styles.body}>There are so many other technologies all around us that use quantum physics!</Text>
      <View style={styles.uses}>{uses.map((item, index) => <View key={item.name} style={[styles.use, { transform: [{ rotate: `${index % 2 ? 1.5 : -1.5}deg` }] }]}>
        <Image source={item.image} resizeMode="contain" style={styles.useImage} /><Text style={styles.useName}>{item.name}</Text>
      </View>)}</View>
      <Text style={styles.heading}>You’ve learnt the basics of something that is already everywhere.</Text>
      <PrimaryButton label="Start the quiz" onPress={() => setQuizStarted(true)} />
    </View>}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 70 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 42, lineHeight: 49, marginVertical: 20 },
  heading: { color: colors.ink, fontFamily: fonts.body, fontSize: 30, lineHeight: 37, marginVertical: 20 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 29, marginBottom: 20 },
  reveal: { marginTop: 24, paddingTop: 14, borderTopWidth: 2, borderStyle: 'dashed', borderColor: colors.primary },
  uses: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginVertical: 22 },
  use: { width: '46%', minHeight: 160, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.ink, borderRadius: 16, backgroundColor: colors.surface, padding: 10 },
  useImage: { width: '100%', height: 105 },
  useName: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, textAlign: 'center', marginTop: 6 },
});
