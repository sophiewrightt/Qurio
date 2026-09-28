import { StyleSheet, View } from 'react-native';

export function ZoomTrail() {
  return <View accessibilityLabel="Zoom further in" style={styles.wrap}>
    <View style={[styles.shaft, styles.pencilEcho]} />
    <View style={styles.shaft} />
    <View style={[styles.arrowLeft, styles.pencilEcho]} />
    <View style={[styles.arrowRight, styles.pencilEcho]} />
    <View style={styles.arrowLeft} />
    <View style={styles.arrowRight} />
  </View>;
}
const styles = StyleSheet.create({
  wrap: { width: 54, height: 92, alignSelf: 'center', marginTop: 15, marginBottom: 0 },
  shaft: { position: 'absolute', top: 2, left: 25, height: 68, width: 4, borderRadius: 4, backgroundColor: '#D92389', transform: [{ rotate: '2deg' }] },
  arrowLeft: { position: 'absolute', left: 14, top: 58, width: 4, height: 28, borderRadius: 4, backgroundColor: '#D92389', transform: [{ rotate: '-43deg' }] },
  arrowRight: { position: 'absolute', left: 35, top: 57, width: 4, height: 29, borderRadius: 4, backgroundColor: '#D92389', transform: [{ rotate: '43deg' }] },
  pencilEcho: { opacity: 0.3, marginLeft: 2, marginTop: 1, backgroundColor: '#F05A72' },
});
