import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { colors, fonts, shadow } from '../constants/theme';

const happyGluon = require('../assets/module-3/lesson-2/gluon-happy-transparent.png');

export function GluonUnlockModal({ visible, score, onUseGluon, onKeepCurrent }: { visible: boolean; score: number; onUseGluon: () => void; onKeepCurrent: () => void }) {
  return <Modal animationType="fade" transparent visible={visible} onRequestClose={onKeepCurrent}>
    <View style={styles.overlay}>
      <View accessibilityViewIsModal accessibilityLabel="Elementary particle unlocked: Gluon" style={styles.modal}>
        <Text style={styles.eyebrow}>CHECKPOINT · {score}/4</Text>
        <Text style={styles.title}>Elementary particle unlocked!</Text>
        <Image accessibilityLabel="Happy gluon" source={happyGluon} resizeMode="contain" style={styles.image} />
        <Text style={styles.name}>Gluon</Text>
        <Text style={styles.copy}>The carrier of the strong interaction is now available as your particle skin.</Text>
        <Text style={styles.takeaway}>Gluons bind quarks together inside protons and neutrons.</Text>
        <View style={styles.actions}>
          <PrimaryButton label="Use Gluon as my particle" onPress={onUseGluon} />
          <PrimaryButton label="Keep my current particle" secondary onPress={onKeepCurrent} />
        </View>
      </View>
    </View>
  </Modal>;
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 22, backgroundColor: colors.overlay },
  modal: { width: '100%', maxWidth: 470, alignItems: 'center', backgroundColor: colors.background, borderWidth: 2, borderColor: colors.ink, borderRadius: 24, padding: 23, ...shadow },
  eyebrow: { color: colors.coral, fontFamily: fonts.display, fontSize: 15, letterSpacing: 1.1 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 34, lineHeight: 40, textAlign: 'center', marginTop: 8 },
  image: { width: 170, height: 170, marginVertical: 4 },
  name: { color: colors.green, fontFamily: fonts.display, fontSize: 31 },
  copy: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 27, textAlign: 'center', marginTop: 5 },
  takeaway: { color: colors.green, fontFamily: fonts.body, fontSize: 20, lineHeight: 26, textAlign: 'center', marginVertical: 15 },
  actions: { width: '100%', gap: 11 },
});
