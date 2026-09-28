import { useEffect, useRef, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import { QuizCompanion } from './QuizCompanion';
import { QuizQuestion } from './QuizQuestion';
import { LessonFinishActions } from './LessonFinishActions';
import { PrimaryButton } from './PrimaryButton';
import { colors, fonts, spacing } from '../constants/theme';

import { useKnowledge } from './KnowledgeContext';

export type LessonQuestion = { question: string; options: string[]; answer: string; explanation?: string };
// Mount instead of lesson content, never underneath it. Future quizzes use this boundary too.
export function LessonQuiz({ questions, takeaway, onFinish, completionActions = true, finalActionLabel = 'Continue', minimumCorrect = 0, onNotPassed }: {
  questions: LessonQuestion[];
  takeaway?: string;
  onFinish: (correct: number) => void;
  completionActions?: boolean;
  finalActionLabel?: string;
  minimumCorrect?: number;
  onNotPassed?: () => void;
}) {
  const awardCorrect = useKnowledge();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string>();
  const score = useRef(0);
  const answered = useRef(false);
  const finished = useRef(false);
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, []);
  const question = questions[index]!;
  const select = (value: string) => {
    if (answered.current) return;
    answered.current = true;
    setSelected(value);
    if (value === question.answer) { score.current += 1; awardCorrect(`quiz:${index}:${question.question}`); }
  };
  const next = () => {
    if (!answered.current || finished.current) return;
    if (index === questions.length - 1 && score.current < minimumCorrect) return;
    if (index === questions.length - 1) { finished.current = true; onFinish(score.current); }
    else { answered.current = false; setSelected(undefined); setIndex(index + 1); }
  };
  return <ScrollView key={index} contentContainerStyle={styles.content}>
    <View style={styles.quizHeading}><Text style={styles.note}>Your turn!</Text><QuizCompanion correct={selected === question.answer} questionKey={index} /></View>
    <QuizQuestion number={index + 1} total={questions.length} {...question} selected={selected} locked={!!selected} onSelect={select} />
    {selected && <View style={styles.feedback}>
      <Text style={styles.note}>{selected === question.answer ? 'Nice! You spotted it. +5 Knowledge' : 'Not quite-it’s ' + question.answer + '.'}</Text>
      {question.explanation && <Text accessibilityLiveRegion="polite" style={styles.explanation}>{question.explanation}</Text>}
      {index === questions.length - 1 && takeaway && <View style={styles.takeaway}>
        <Text style={styles.takeawayLabel}>LESSON TAKEAWAY</Text>
        <Text style={styles.takeawayText}>{takeaway}</Text>
      </View>}
      {index === questions.length - 1 && score.current < minimumCorrect ? <View>
        <Text accessibilityLiveRegion="polite" style={styles.explanation}>You got {score.current} out of {questions.length}. You need {minimumCorrect} to pass this chapter. Take a breather, revisit the ideas, and try again when you’re ready!</Text>
        <PrimaryButton label="Back to Home" onPress={() => { if (finished.current) return; finished.current = true; onNotPassed?.(); }} />
      </View> : index === questions.length - 1 && completionActions
        ? <LessonFinishActions onComplete={() => { if (finished.current) return; finished.current = true; onFinish(score.current); }} />
        : <PrimaryButton label={index === questions.length - 1 ? finalActionLabel : 'Next question'} onPress={next} />}
    </View>}
  </ScrollView>;
}
const styles = StyleSheet.create({
  quizHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  note: { fontFamily: fonts.body, fontSize: 20, color: colors.ink, marginBottom: 24 },
  feedback: { marginTop: 28 },
  explanation: { fontFamily: fonts.body, fontSize: 21, lineHeight: 28, color: colors.ink, marginBottom: 24 },
  takeaway: { backgroundColor: '#DFF3E9', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.green, borderRadius: 20, padding: 20, marginBottom: 24 },
  takeawayLabel: { color: colors.green, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.2 },
  takeawayText: { color: colors.ink, fontFamily: fonts.body, fontSize: 24, lineHeight: 31, marginTop: 7 },
});
