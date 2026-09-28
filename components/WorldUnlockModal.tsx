import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { colors, fonts, spacing } from '../constants/theme';

const covers = {
  2: require('../assets/module-covers/world-2.png'),
  3: require('../assets/module-covers/world-3.png'),
  4: require('../assets/module-covers/world-4.png'),
} as const;

export function WorldUnlockModal({ world, onTakeThere, onLater }: {
  world?: 2 | 3 | 4;
  onTakeThere: () => void;
  onLater: () => void;
}) {
  return <Modal animationType="fade" transparent visible={Boolean(world)} onRequestClose={onLater}>
    {world && <View style={styles.backdrop}><View accessibilityViewIsModal style={styles.card}>
      <Image accessibilityLabel={`Chapter ${world} cover`} source={covers[world]} resizeMode="contain" style={styles.cover} />
      <Text style={styles.title}>You’ve unlocked Chapter {world}, woohoo!</Text>
      <View style={styles.actions}>
        <PrimaryButton label="Take me there" onPress={onTakeThere} />
        <PrimaryButton label="Later" secondary onPress={onLater} />
      </View>
    </View></View>}
  </Modal>;
}

const styles = StyleSheet.create({
  actions: { gap: 20, width: '100%' },
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.overlay },
  card: { width: '100%', maxWidth: 430, padding: spacing.lg, borderWidth: 3, borderColor: colors.ink, borderRadius: 26, backgroundColor: colors.background },
  cover: { width: '100%', height: 190 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 34, lineHeight: 42, textAlign: 'center', marginBottom: spacing.lg },
});
