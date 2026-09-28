import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

const electron = require('../assets/particles/electron-avatar.png');

export function WizardGazePlaceholder() {
  return <View style={styles.card} accessibilityLabel="Placeholder for a future cartoon of a wizard looking at an electron">
    <Text style={styles.placeholder}>FUTURE CARTOON PLACEHOLDER</Text>
    <View style={styles.wizardScene}>
      <View style={styles.wizard}>
        <Text style={styles.hat}>△</Text>
        <View style={styles.face}><Text style={styles.faceText}>•  •</Text></View>
        <Text style={styles.wizardLabel}>your wizard sprite</Text>
      </View>
      <View style={styles.gaze}><View style={[styles.gazeLine, { transform: [{ rotate: '-10deg' }] }]} /><View style={[styles.gazeLine, { transform: [{ rotate: '10deg' }] }]} /></View>
      <View style={styles.electronPositions}>
        <Image source={electron} style={styles.electron} resizeMode="contain" />
        <Text style={styles.motion}>↕</Text>
        <Image source={electron} style={[styles.electron, { opacity: 0.4 }]} resizeMode="contain" />
      </View>
    </View>
    <Text style={styles.note}>Wizard gazes → electron appears to change position</Text>
  </View>;
}

export function MagicHatPlaceholder() {
  return <View style={styles.card} accessibilityLabel="Placeholder storyboard for a future magic hat and disappointed electron animation">
    <Text style={styles.placeholder}>FUTURE ANIMATION PLACEHOLDER</Text>
    <View style={styles.storyboard}>
      <View style={styles.frame}>
        <Image source={electron} style={styles.electron} resizeMode="contain" />
        <View style={styles.hatPlaceholder}><Text style={styles.hatLabel}>magic hat{`\n`}sprite</Text></View>
        <Text style={styles.frameLabel}>electron hovers</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
      <View style={styles.frame}>
        <Image source={electron} style={[styles.electron, { opacity: 0.8 }]} resizeMode="contain" />
        <View style={styles.goneHat}><Text style={styles.goneText}>poof!</Text></View>
        <Text style={styles.frameLabel}>hat disappears{`\n`}electron: ☹</Text>
      </View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  card: { width: '100%', backgroundColor: '#EEE9FF', borderColor: colors.primary, borderWidth: 2, borderStyle: 'dashed', borderRadius: 19, padding: 16, marginVertical: 20 },
  placeholder: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1, textAlign: 'center', marginBottom: 16 },
  wizardScene: { minHeight: 170, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  wizard: { width: 104, alignItems: 'center' }, hat: { color: colors.primary, fontSize: 70, height: 57, lineHeight: 68 },
  face: { width: 72, height: 72, borderRadius: 37, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.ink, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  faceText: { color: colors.ink, fontFamily: fonts.display, fontSize: 21 }, wizardLabel: { color: colors.ink, fontFamily: fonts.body, fontSize: 15, textAlign: 'center', marginTop: 5 },
  gaze: { width: 45, gap: 18 }, gazeLine: { width: 53, height: 2, backgroundColor: colors.coral, borderStyle: 'dashed' },
  electronPositions: { alignItems: 'center' }, electron: { width: 68, height: 68 }, motion: { color: colors.coral, fontFamily: fonts.display, fontSize: 28, height: 34 },
  note: { color: colors.ink, fontFamily: fonts.body, fontSize: 17, textAlign: 'center', marginTop: 10 },
  storyboard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  frame: { flex: 1, minHeight: 190, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.ink, borderRadius: 14, padding: 10, alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface },
  arrow: { color: colors.coral, fontFamily: fonts.display, fontSize: 27, paddingHorizontal: 5 },
  hatPlaceholder: { width: 82, height: 46, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.primary, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  hatLabel: { color: colors.primaryDark, fontFamily: fonts.body, fontSize: 14, textAlign: 'center', lineHeight: 15 },
  goneHat: { width: 82, height: 46, alignItems: 'center', justifyContent: 'center' }, goneText: { color: colors.coral, fontFamily: fonts.display, fontSize: 19 },
  frameLabel: { color: colors.ink, fontFamily: fonts.body, fontSize: 16, lineHeight: 19, textAlign: 'center' },
});
