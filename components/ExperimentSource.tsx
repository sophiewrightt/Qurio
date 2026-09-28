import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

// One launcher treatment for all Chapter 1 double-slit experiments.
export function ExperimentSource({ mode = 'electron' }: { mode?: 'electron' | 'ball' | 'wave' }) {
  return <View style={styles.launcher}>
    {mode === 'wave' ? <Text style={styles.wave}>≋</Text> : <Image resizeMode="contain" source={mode === 'ball' ? require('../assets/lesson-1/basketball.png') : require('../assets/particles/electron-avatar.png')} style={styles.particle} />}
  </View>;
}
const styles = StyleSheet.create({
  launcher: { position: 'absolute', left: 7, top: 128, width: 42, height: 42, borderWidth: 2, borderColor: colors.ink, borderRadius: 11, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  particle: { width: 37, height: 37 }, wave: { color: colors.blue, fontSize: 30 },
});
