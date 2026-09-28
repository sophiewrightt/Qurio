import { useEffect, useState } from 'react';
import { KNOWLEDGE_PER_LEVEL, knowledgeLevel } from '../data/knowledge';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, type } from '../constants/theme';
export function XPBar({ value, from = value, enabled = true, onPresented }: { value: number; from?: number; enabled?: boolean; onPresented?: (total: number) => void }) {
  const [displayed, setDisplayed] = useState(from);
  useEffect(() => {
    setDisplayed(from);
    if (!enabled || value <= from) return;
    // Pause at every full bar so each level gets its own celebration.
    const target = Math.min(value, knowledgeLevel(from) * KNOWLEDGE_PER_LEVEL);
    let frame = 0;
    const frames = 45;
    const timer = setInterval(() => {
      frame += 1;
      const fraction = Math.min(1, frame / frames);
      setDisplayed(from + (target - from) * (1 - Math.pow(1 - fraction, 3)));
      if (frame >= frames) { clearInterval(timer); onPresented?.(target); }
    }, 32);
    return () => clearInterval(timer);
  }, [value, from, enabled, onPresented]);
  const total = Math.round(displayed);
  const filledBoundary = total > from && total % KNOWLEDGE_PER_LEVEL === 0;
  const level = knowledgeLevel(total) - (filledBoundary ? 1 : 0);
  const progress = filledBoundary ? KNOWLEDGE_PER_LEVEL : total % KNOWLEDGE_PER_LEVEL;
  const width = `${progress / KNOWLEDGE_PER_LEVEL * 100}%` as `${number}%`;
  return <View accessibilityLabel={`Level ${level}, ${progress} of ${KNOWLEDGE_PER_LEVEL} Knowledge`}>
    <View style={styles.row}><Text style={styles.label}>KNOWLEDGE · LEVEL {level}</Text><Text style={styles.value}>{progress} / {KNOWLEDGE_PER_LEVEL}</Text></View>
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: KNOWLEDGE_PER_LEVEL, now: progress }} style={styles.track}><View style={[styles.fill, { width }]} /></View>
    {value > from && <Text style={styles.value}>+{value - from} Knowledge earned</Text>}
  </View>;
}
const styles = StyleSheet.create({ row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 }, label: { fontSize: type.small, color: colors.primaryDark, fontFamily: fonts.display, letterSpacing: 1 }, value: { fontSize: type.body, color: colors.ink, fontFamily: fonts.body }, track: { height: 17, borderRadius: 7, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, transform: [{ rotate: '-0.45deg' }] }, fill: { height: '100%', borderRightWidth: 2, borderRightColor: colors.ink, backgroundColor: colors.yellow } });
