import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, spacing, type } from '../constants/theme';
import { CrayonMark } from './CrayonMark';
import { useKnowledge } from './KnowledgeContext';
export type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect';
export function AnswerButton({ label, state = 'default', onPress, disabled, illustration, knowledgeKey, isCorrectAnswer }: { label: string; knowledgeKey?: string; isCorrectAnswer?: boolean; illustration?: ReactNode; state?: AnswerState; onPress: () => void | boolean; disabled?: boolean }) {
  const awardCorrect = useKnowledge();
  return <Pressable accessibilityRole="button" onPress={() => { if (disabled) return; const accepted = onPress(); if (accepted !== false && knowledgeKey && isCorrectAnswer) awardCorrect(`check:${knowledgeKey}`); }} disabled={disabled} style={({ pressed }) => [styles.base, styles[state], pressed && styles.pressed]}>{illustration}<Text style={[styles.text, state === 'selected' && styles.selectedText]}>{label}</Text>{state === 'correct' && <CrayonMark kind="correct" />}{state === 'incorrect' && <CrayonMark kind="incorrect" />}</Pressable>;
}
const styles = StyleSheet.create({ base: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, borderRadius: 13, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, borderStyle: 'dashed' }, default: {}, selected: { borderColor: colors.primary, borderStyle: 'solid', backgroundColor: '#EEEAFF' }, correct: { borderColor: colors.green, borderStyle: 'solid', backgroundColor: '#E6F7EF' }, incorrect: { borderColor: colors.red, borderStyle: 'solid', backgroundColor: '#FFF0ED' }, text: { flex: 1, fontSize: type.h3, color: colors.ink, fontFamily: fonts.body }, selectedText: { color: colors.primaryDark }, pressed: { transform: [{ scale: 0.985 }, { rotate: '-0.3deg' }] } });
