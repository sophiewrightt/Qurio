import { StyleSheet, Text, View } from 'react-native';
import { AnswerButton, AnswerState } from './AnswerButton';
import { colors, fonts, spacing, type } from '../constants/theme';
export function QuizQuestion({ number, total, question, options, answer, selected, locked, onSelect }: { number: number; total: number; question: string; options: string[]; answer: string; selected?: string; locked: boolean; onSelect: (value: string) => void }) {
  const stateFor = (option: string): AnswerState => !selected ? 'default' : option === answer ? 'correct' : option === selected ? 'incorrect' : 'default';
  return <View><Text style={styles.eyebrow}>QUICK CHECK · {number} OF {total}</Text><Text style={styles.question}>{question}</Text><View style={styles.answers}>{options.map(option => <AnswerButton key={option} label={option} state={stateFor(option)} disabled={locked} onPress={() => onSelect(option)} />)}</View></View>;
}
const styles = StyleSheet.create({ eyebrow: { color: colors.primary, fontFamily: fonts.display, letterSpacing: 1.3, fontSize: type.small }, question: { color: colors.ink, fontFamily: fonts.body, fontSize: 34, lineHeight: 41, marginTop: spacing.sm, marginBottom: spacing.lg }, answers: { gap: spacing.sm } });
