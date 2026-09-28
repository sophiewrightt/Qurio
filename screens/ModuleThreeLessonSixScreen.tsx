import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { QuantumApplicationsLesson } from '../components/QuantumConnectionsFinale';
import { colors, fonts } from '../constants/theme';

export function ModuleThreeLessonSixScreen({ onHome, onComplete }: {
  onHome: () => void;
  onComplete: () => void;
}) {
  const [scrollLocked, setScrollLocked] = useState(false);
  return <SafeAreaView style={styles.safe}><ScrollView scrollEnabled={!scrollLocked} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text>
      <Text style={styles.module}>CHAPTER 3 · QUANTUM CONNECTIONS</Text>
      <LessonBadge number={7} world={3} />
      <Text style={styles.title}>Connections at work</Text>
      <QuantumApplicationsLesson onScrollLockChange={setScrollLocked} onComplete={onComplete} />
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 80 },
  back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 },
  module: { color: colors.green, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 39, lineHeight: 46, marginVertical: 20 },
});
