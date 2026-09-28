import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { PrimaryButton } from './PrimaryButton';

// A confirmation preview only. Server-authorised energy accounting is deferred.
export function LessonEntryModal({ lesson, onPlay, onLater }: { lesson: string; onPlay: () => void; onLater: () => void }) {
  return <Modal visible transparent animationType="fade" onRequestClose={onLater}>
    <View style={styles.backdrop}>
      <View accessibilityViewIsModal accessibilityLabel={`Play lesson ${lesson}`} style={styles.card}>
        <Text accessibilityRole="header" style={styles.heading}>This will use 1 energy.</Text>
        <View accessible accessibilityLabel="Minus one energy" style={styles.cost}>
          <Text accessible={false} style={styles.minus}>-</Text>
          <Image accessible={false} source={require('../assets/ui/energy-icon-transparent.png')} resizeMode="contain" style={styles.energy} />
        </View>
        <PrimaryButton label={`Play lesson ${lesson}`} onPress={onPlay} />
        <PrimaryButton label="Later" secondary onPress={onLater} />
      </View>
    </View>
  </Modal>;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, padding: 24, justifyContent: 'center', alignItems: 'center' },
  card: { width: '100%', maxWidth: 380, backgroundColor: colors.background, borderWidth: 2, borderColor: colors.ink, borderRadius: 26, padding: 24, gap: 14 },
  heading: { fontFamily: fonts.display, fontSize: 29, lineHeight: 35, color: colors.ink, textAlign: 'center' },
  cost: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 8 },
  minus: { fontSize: 62, fontFamily: fonts.display, color: colors.ink },
  energy: { width: 112, height: 112 },
});
