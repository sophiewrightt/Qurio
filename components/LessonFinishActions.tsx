import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, shadow, spacing } from '../constants/theme';

type LessonNavigation = {
  onHome: () => void;
  onNext?: () => void;
  entryCancellation?: number;
};

const LessonNavigationContext = createContext<LessonNavigation | null>(null);

export function LessonNavigationProvider({ children, onHome, onNext, entryCancellation }: LessonNavigation & { children: ReactNode }) {
  return <LessonNavigationContext.Provider value={{ onHome, onNext, entryCancellation }}>{children}</LessonNavigationContext.Provider>;
}

export function LessonFinishActions({ onComplete, homeLabel = 'Back to home', nextLabel = 'Next lesson', next = true, disabled = false }: {
  onComplete: () => void;
  homeLabel?: string;
  nextLabel?: string;
  next?: boolean;
  disabled?: boolean;
}) {
  const navigation = useContext(LessonNavigationContext);
  const leaving = useRef(false);
  const completed = useRef(false);
  useEffect(() => { leaving.current = false; }, [navigation?.entryCancellation]);
  if (!navigation) return null;
  const leave = (destination: () => void) => {
    if (disabled || leaving.current) return;
    leaving.current = true;
    if (!completed.current) { completed.current = true; onComplete(); }
    destination();
  };
  const showNext = next && Boolean(navigation.onNext);
  return <View style={styles.wrap}>
    <Text style={styles.complete}>Lesson complete!</Text>
    <View style={styles.actions}>
      {showNext && <Pressable accessibilityRole="button" accessibilityLabel={nextLabel} disabled={disabled}
        onPress={() => leave(navigation.onNext!)} style={({ pressed }) => [styles.button, styles.next, pressed && styles.pressed, disabled && styles.disabled]}>
        <Text style={styles.label}>{nextLabel}</Text><Text style={styles.arrow}>→</Text>
      </Pressable>}
      <Pressable accessibilityRole="button" accessibilityLabel={homeLabel} disabled={disabled}
        onPress={() => leave(navigation.onHome)} style={({ pressed }) => [styles.button, styles.home, !showNext && styles.single, pressed && styles.pressed, disabled && styles.disabled]}>
        <View style={styles.house}><View style={styles.roof} /><View style={styles.houseBody}><View style={styles.door} /></View></View>
        <Text style={[styles.label, styles.homeLabel]}>{homeLabel}</Text>
      </Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  wrap: { width: '100%', marginTop: spacing.xl, paddingTop: spacing.lg, borderTopWidth: 2, borderStyle: 'dashed', borderColor: colors.border },
  complete: { color: colors.ink, fontFamily: fonts.display, fontSize: 29, textAlign: 'center', marginBottom: 14 },
  actions: { width: '100%', gap: 12 },
  button: { width: '100%', minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 20, borderWidth: 3, borderColor: colors.ink, borderRadius: 15, ...shadow },
  next: { backgroundColor: colors.yellow, transform: [{ rotate: '-0.45deg' }] },
  home: { backgroundColor: '#DDD6F5', transform: [{ rotate: '0.35deg' }] },
  single: { minHeight: 70 },
  label: { color: colors.ink, fontFamily: fonts.display, fontSize: 24, letterSpacing: 0.6, textTransform: 'uppercase' },
  homeLabel: { fontSize: 22 },
  arrow: { color: colors.ink, fontFamily: fonts.display, fontSize: 38, lineHeight: 40 },
  house: { width: 32, height: 32, alignItems: 'center', justifyContent: 'flex-end' },
  roof: { position: 'absolute', top: 1, width: 22, height: 22, backgroundColor: colors.ink, transform: [{ rotate: '45deg' }], borderRadius: 2 },
  houseBody: { width: 27, height: 21, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'flex-end' },
  door: { width: 8, height: 12, backgroundColor: '#DDD6F5' },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.42 },
});
