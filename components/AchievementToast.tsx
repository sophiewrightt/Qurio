import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AchievementBadge } from './AchievementBadge';
import { colors, fonts } from '../constants/theme';

export function AchievementToast({ id, enabled, onDismiss }: { id?: string; enabled: boolean; onDismiss: (id: string) => void }) {
  useEffect(() => {
    if (!id || !enabled) return;
    const timer = setTimeout(() => onDismiss(id), 3500);
    return () => clearTimeout(timer);
  }, [id, enabled, onDismiss]);
  if (!id || !enabled) return null;
  return <View pointerEvents="none" accessibilityLiveRegion="polite" style={styles.toast}>
    <AchievementBadge id={id} size={48} /><Text style={styles.text}>Achievement earnt</Text>
  </View>;
}
const styles = StyleSheet.create({
  toast: { position: 'absolute', bottom: 26, right: 12, maxWidth: '92%', zIndex: 50, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, backgroundColor: colors.surface, borderColor: colors.yellow, borderWidth: 2, borderRadius: 18 },
  text: { fontFamily: fonts.body, fontSize: 20, color: colors.ink },
});
