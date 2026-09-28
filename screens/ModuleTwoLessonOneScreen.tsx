import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { PrimaryButton } from '../components/PrimaryButton';
import { QuantisationLab } from '../components/QuantisationLab';
import { ScratchReveal } from '../components/ScratchReveal';
import { TerminologyCard } from '../components/TerminologyCard';
import { quantisationQuestions } from '../data/moduleTwo';
import { colors, fonts } from '../constants/theme';

export function ModuleTwoLessonOneScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [wordRevealed, setWordRevealed] = useState(false);
  const [wordGuess, setWordGuess] = useState<string>();
  const wordChoices = ['Quantity', 'Quasar', 'Quotient', 'Quintessence', 'Qualify', 'Quiver'];
  if (quizStarted) return <SafeAreaView style={styles.safe}><Text style={styles.module}>CHAPTER 2 · QUICK CHECK</Text><LessonQuiz questions={quantisationQuestions} onFinish={onComplete} /></SafeAreaView>;
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text><Text style={styles.module}>CHAPTER 2 · THE QUANTUM RULES</Text><LessonBadge number={1} world={2} />
    <Text style={styles.title}>Q is for...</Text>
    <Text style={styles.body}>In the last chapter, we learnt that <Text style={styles.underline}>quantum physics</Text> behaves differently from <Text style={styles.underline}>classical physics</Text>. But why is it called “quantum”?</Text>
    <Text style={styles.guessPrompt}>Guess which one of these words “quantum” comes from.</Text>
    <View style={styles.wordGrid}>{wordChoices.map(word => <Pressable key={word} accessibilityRole="button" accessibilityState={{ selected: wordGuess === word }} onPress={() => setWordGuess(word)} style={[styles.wordChoice, wordGuess === word && styles.wordChoiceSelected]}><Text style={[styles.wordChoiceText, wordGuess === word && styles.wordChoiceTextSelected]}>{word}</Text></Pressable>)}</View>
    {wordGuess && <>
      <Text style={styles.investigate}>Let’s investigate.</Text>
      <Text style={styles.body}>Let’s use an analogy.</Text>
      <QuantisationLab />
      <ScratchReveal title="What is this called?" rainbow coatingColor="#F2B6D4" onReveal={() => setWordRevealed(true)}>Quantised</ScratchReveal>
      {wordRevealed && <><Text style={styles.body}>This is where quantum physics gets its name. A <Text style={styles.bold}>quantum</Text> is a particular amount or “packet.” A quantised property does not slide through every value in a smooth range.</Text>
      <Text style={styles.body}>It can only take particular allowed values.</Text>
      <TerminologyCard term="Quantised" definition="A property is quantised when only certain values are allowed." />
      <PrimaryButton label="Start the quiz" onPress={() => setQuizStarted(true)} /></>}
    </>}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 70 }, back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 }, module: { color: colors.coral, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 41, lineHeight: 48, marginVertical: 20 }, body: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 29, marginBottom: 18 }, underline: { textDecorationLine: 'underline' }, bold: { fontFamily: fonts.display, fontWeight: '700' },
  guessPrompt: { color: colors.ink, fontFamily: fonts.display, fontSize: 27, lineHeight: 34, marginBottom: 14 },
  wordGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  wordChoice: { width: '48%', minHeight: 54, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.ink, borderRadius: 14, backgroundColor: colors.surface },
  wordChoiceSelected: { borderStyle: 'solid', borderColor: colors.primary, backgroundColor: '#EEE9FF' },
  wordChoiceText: { color: colors.ink, fontFamily: fonts.body, fontSize: 20 },
  wordChoiceTextSelected: { color: colors.primaryDark, fontFamily: fonts.display },
  investigate: { color: colors.coral, fontFamily: fonts.display, fontSize: 34, lineHeight: 42, textAlign: 'center', marginTop: 8, marginBottom: 23 },
});
