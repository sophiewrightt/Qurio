import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { colors, fonts, shadow } from '../constants/theme';

const photon = require('../assets/lesson-9/photon-happy-transparent.png');

export function PhotonUnlockModal({ visible, onUsePhoton, onKeepElectron }: { visible: boolean; score: number; onUsePhoton: () => void; onKeepElectron: () => void }) {
  return <Modal animationType="fade" transparent visible={visible} onRequestClose={onKeepElectron}>
    <View style={styles.overlay}>
      <View accessibilityViewIsModal accessibilityLabel="Elementary particle unlocked: Photon" style={styles.modal}>
        <Text style={styles.title}>Elementary particle unlocked!</Text>
        <Image source={photon} resizeMode="contain" style={styles.image} />
        <Text style={styles.name}>Photon</Text>
        <View style={styles.actions}>
          <PrimaryButton label="Use Photon as my avatar" onPress={onUsePhoton} />
          <PrimaryButton label="Keep Electron for now" secondary onPress={onKeepElectron} />
        </View>
      </View>
    </View>
  </Modal>;
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 22, backgroundColor: colors.overlay },
  modal: { width: '100%', maxWidth: 470, alignItems: 'center', backgroundColor: colors.background, borderWidth: 2, borderColor: colors.ink, borderRadius: 24, padding: 23, ...shadow },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 34, lineHeight: 40, textAlign: 'center', marginTop: 8 },
  image: { width: 170, height: 145, marginVertical: 4 },
  name: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 31 },
  actions: { width: '100%', gap: 11 },
});
