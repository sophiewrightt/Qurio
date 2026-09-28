import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';
export function LessonProgress({ progress }: { progress: number }) { return <View style={styles.track}><View style={[styles.fill, { width: `${Math.max(4, Math.min(100, progress * 100))}%` as `${number}%` }]} /></View>; }
const styles = StyleSheet.create({ track: { height: 9, borderRadius: 4, backgroundColor: colors.surface, overflow: 'hidden', borderWidth: 1.5, borderColor: colors.ink, transform: [{ rotate: '-0.4deg' }] }, fill: { height: '100%', backgroundColor: colors.coral, borderRightWidth: 1.5, borderRightColor: colors.ink } });
