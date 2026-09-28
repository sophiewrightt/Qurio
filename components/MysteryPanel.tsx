import { StyleSheet, Text, View } from 'react-native';
import { MysteryIcon } from './MysteryIcon';
import { colors, fonts } from '../constants/theme';

export function MysteryPanel({ number, title, body, unlocked = false }: { number: number; title: string; body: string; unlocked?: boolean }) {
  return <View style={styles.card}><MysteryIcon unlocked={unlocked} />
    <Text style={styles.eyebrow}>{unlocked ? 'MYSTERY UNLOCKED! · #' : 'MYSTERY #'}{number}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>{body}</Text>
  </View>;
}
const styles = StyleSheet.create({
  card: { backgroundColor: '#27233F', borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.ink, padding: 20, alignItems: 'center', marginTop: 34, marginBottom: 24 },
  eyebrow: { color: colors.yellow, fontFamily: fonts.display, letterSpacing: 1, fontSize: 15 },
  title: { width: '100%', flexShrink: 1, color: colors.white, fontFamily: fonts.body, fontSize: 28, lineHeight: 38, textAlign: 'center', marginTop: 24, marginBottom: 14, paddingHorizontal: 4, paddingVertical: 3 },
  body: { width: '100%', flexShrink: 1, color: '#D9D4E8', fontFamily: fonts.body, fontSize: 21, lineHeight: 30, textAlign: 'center', paddingHorizontal: 4, paddingVertical: 3 },
});
