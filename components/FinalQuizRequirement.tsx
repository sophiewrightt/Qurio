import { StyleSheet, Text } from 'react-native';
import { requiredFinalAnswers } from '../data/learnerRules';
import { colors, fonts } from '../constants/theme';

export function FinalQuizRequirement({ total }: { total: number }) {
  return <Text style={styles.note}>To pass this chapter, get at least {requiredFinalAnswers(total)} out of {total} questions right (more than 70%). You can try again if you don’t pass.</Text>;
}
const styles = StyleSheet.create({
  note: { fontFamily: fonts.body, fontSize: 21, lineHeight: 28, color: colors.ink, marginVertical: 18, textAlign: 'center' },
});
