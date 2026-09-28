import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

export function CrayonMark({ kind }: { kind: 'correct' | 'incorrect' }) {
  const color = kind === 'correct' ? colors.green : colors.red;
  return <View accessibilityElementsHidden style={styles.canvas}>
    {kind === 'correct' ? <><View style={[styles.stroke, styles.tickShort, { backgroundColor: color }]} /><View style={[styles.stroke, styles.tickLong, { backgroundColor: color }]} /></> : <><View style={[styles.stroke, styles.crossA, { backgroundColor: color }]} /><View style={[styles.stroke, styles.crossB, { backgroundColor: color }]} /></>}
  </View>;
}

const styles = StyleSheet.create({
  canvas: { width: 30, height: 30, marginLeft: 10 },
  stroke: { position: 'absolute', height: 5, borderRadius: 4, opacity: 0.86 },
  tickShort: { width: 13, left: 1, top: 15, transform: [{ rotate: '43deg' }] },
  tickLong: { width: 23, left: 9, top: 11, transform: [{ rotate: '-49deg' }] },
  crossA: { width: 27, left: 2, top: 12, transform: [{ rotate: '43deg' }] },
  crossB: { width: 27, left: 2, top: 12, transform: [{ rotate: '-47deg' }] },
});
