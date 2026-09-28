import { StyleSheet, View } from 'react-native';
export type WallPatternKind = 'two' | 'even' | 'interference';

// Identical wall and ink for every answer: only the distribution changes.
export function WallPattern({ kind }: { kind: WallPatternKind }) {
  const columns = kind === 'two' ? [23, 27, 61, 65] : kind === 'interference' ? [8, 23, 39, 43, 47, 63, 78] : [8, 18, 28, 38, 48, 58, 68, 78];
  return <View pointerEvents="none" accessible={false} style={styles.wall}>
    {columns.flatMap((x, col) => Array.from({ length: 9 }, (_, row) => <View key={col + ':' + row} style={[styles.dot, {
      left: x + ((row * 3 + col) % 3 - 1), top: 5 + row * 5,
      opacity: kind === 'interference' ? .3 + .7 * (1 - Math.abs(x - 43) / 43) : .85,
    }]} />))}
  </View>;
}
const styles = StyleSheet.create({
  wall: { width: 90, height: 54, marginVertical: 12, marginRight: 12, backgroundColor: '#FFFDF6', borderWidth: 1.5, borderColor: '#554A66', borderRadius: 4, transform: [{ rotate: '-1deg' }] },
  dot: { position: 'absolute', width: 3, height: 3, borderRadius: 2, backgroundColor: '#6F548E' },
});
