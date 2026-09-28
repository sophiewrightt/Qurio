import { Image, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, fonts, radii, shadow, spacing, type } from '../constants/theme';

const readyForQuiz = require('../assets/ui/ready-for-quiz-transparent.png');

export function PrimaryButton({ label, onPress, disabled, secondary, style }: { label: string; onPress: () => void; disabled?: boolean; secondary?: boolean; style?: ViewStyle }) {
  const isQuizEntry = label === 'Start the quiz' || label === 'Start the final challenge';
  return <Pressable accessibilityRole="button" accessibilityLabel={isQuizEntry ? 'Ready for the quiz!' : label} disabled={disabled} onPress={onPress} style={({ pressed }) => [isQuizEntry ? styles.quizButton : styles.button, secondary && !isQuizEntry && styles.secondary, disabled && styles.disabled, pressed && styles.pressed, style]}>
    {isQuizEntry ? <Image source={readyForQuiz} resizeMode="contain" style={styles.quizArtwork} /> : <Text style={[styles.text, secondary && styles.secondaryText]}>{label}</Text>}
  </Pressable>;
}
const styles = StyleSheet.create({
  button: { minHeight: 58, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.ink, transform: [{ rotate: '-0.35deg' }], ...shadow },
  quizButton: { width: '100%', minHeight: 104, alignItems: 'center', justifyContent: 'center' },
  quizArtwork: { width: '98%', height: 104 },
  text: { color: colors.white, fontSize: type.h3, fontFamily: fonts.display, letterSpacing: 0.2 },
  secondary: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink },
  secondaryText: { color: colors.ink }, disabled: { opacity: 0.42 }, pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
});
