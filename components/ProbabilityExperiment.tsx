import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { sampleZone, zoneWeights } from '../data/probability';
import { PrimaryButton } from './PrimaryButton';
import { ExperimentSource } from './ExperimentSource';

export function ProbabilityExperiment({ onComplete, onPredictionComplete }: { onComplete: () => void; onPredictionComplete: (round: number) => boolean | void }) {
  const [guess, setGuess] = useState<number>();
  const [result, setResult] = useState<number>();
  const [history, setHistory] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [width, setWidth] = useState(300);
  const [destination, setDestination] = useState(0);
  const lock = useRef(false);
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => () => p.stopAnimation(), [p]);
  const fire = () => {
    if (guess === undefined || lock.current || history.length >= 3 || result !== undefined) return;
    const target = sampleZone(); // Never depends on the learner's choice.
    setDestination(target); setBusy(true); lock.current = true; p.setValue(0);
    Animated.timing(p, { toValue: 1, duration: 1300, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
      lock.current = false;
      if (finished) { setBusy(false); setResult(target); setHistory(old => [...old, target]); onPredictionComplete(history.length + 1); }
    });
  };
  return <View>
    <Text style={styles.prompt}>Choose a zone 1-5 to test your prediction.</Text>
    <Text style={styles.small}>Prediction {Math.min(history.length + (result === undefined ? 1 : 0), 3)} of 3</Text>
    <View onLayout={e => setWidth(e.nativeEvent.layout.width)} style={styles.experiment}>
      <ExperimentSource />
      <View style={[styles.wall, { left: width * 0.43 }]}><View style={[styles.slit, { top: 63 }]} /><View style={[styles.slit, { top: 126 }]} /></View>
      <View style={styles.zones}>{zoneWeights.map((_, i) => <Pressable key={i} accessibilityRole="button" accessibilityLabel={`Predict zone ${i + 1}`} accessibilityState={{ selected: guess === i, disabled: busy || result !== undefined }} disabled={busy || result !== undefined} onPress={() => setGuess(i)} style={[styles.zone, guess === i && styles.selected]}>
        <Text style={styles.zoneText}>{i + 1}</Text>{result === i && <View style={styles.arrival} />}
      </Pressable>)}</View>
      {busy && <Animated.Image source={require('../assets/particles/electron-avatar.png')} style={[styles.electron, { transform: [
        { translateX: p.interpolate({ inputRange: [0, 0.5, 1], outputRange: [14, width * 0.43 - 8, width - 70] }) },
        { translateY: p.interpolate({ inputRange: [0, 0.5, 1], outputRange: [136, history.length % 2 ? 153 : 90, 36 + destination * 44] }) },
      ] }]} />}
      {busy && <Image source={require('../assets/ui/censored-transparent.png')} resizeMode="contain" style={[styles.pathCover, { left: width * 0.43 - 55 }]} />}
    </View>
    {result === undefined ? <PrimaryButton label={busy ? 'Finding out…' : 'Test my prediction'} disabled={guess === undefined || busy} onPress={fire} /> : <View>
      <Text accessibilityLiveRegion="polite" style={styles.feedback}>{guess === result ? 'Your guess matched by chance this time.' : `It arrived in zone ${result + 1}, not zone ${guess! + 1}.`} No single landing is guaranteed. Thanks for exploring!</Text>
      {history.length < 3 && <PrimaryButton label="Try another prediction" onPress={() => { setGuess(undefined); setResult(undefined); }} />}
    </View>}
    {history.length === 3 && <View style={styles.map}>
      <Text style={styles.prompt}>Actually, there’s not a right or wrong answer for where it should land-it has a possibility of landing in every section.</Text><Text style={styles.small}>Some sections are more likely than others:</Text>
      {zoneWeights.map((weight, i) => <View key={i} style={styles.mapRow}><Text style={styles.small}>Zone {i + 1}</Text><View style={styles.track}><View style={[styles.fill, { width: `${weight * 2}%` }]} /></View><Text style={styles.small}>{weight}%</Text></View>)}
      <Text style={styles.feedback}>The middle zone is more likely, not certain. Three shots are too few to show the whole pattern. Many repeated experiments reveal it.</Text>
      <PrimaryButton label="What does probability mean?" onPress={onComplete} />
    </View>}
  </View>;
}
const styles = StyleSheet.create({
  prompt: { fontFamily: fonts.body, fontSize: 26, color: colors.ink, marginVertical: 12 },
  small: { fontFamily: fonts.body, fontSize: 17, color: colors.muted },
  experiment: { height: 286, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, borderRadius: 16, marginVertical: 18, overflow: 'hidden' },
  sourceLabel: { position: 'absolute', left: 8, top: 126, fontFamily: fonts.body, color: colors.primary },
  wall: { position: 'absolute', width: 8, height: 220, top: 28, backgroundColor: colors.ink }, slit: { position: 'absolute', width: 10, height: 24, left: -1, backgroundColor: colors.surface },
  zones: { position: 'absolute', right: 7, top: 26, width: 72 }, zone: { height: 44, borderWidth: 1.5, borderColor: colors.ink, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }, selected: { backgroundColor: colors.yellow },
  zoneText: { fontFamily: fonts.body, color: colors.ink, fontSize: 22 }, arrival: { backgroundColor: colors.primary, width: 9, height: 9, borderRadius: 5, marginLeft: 20 },
  electron: { position: 'absolute', width: 26, height: 26 }, feedback: { fontFamily: fonts.body, color: colors.ink, fontSize: 20, lineHeight: 27, marginVertical: 16 },
  pathCover: { position: 'absolute', top: 72, width: 120, height: 120, zIndex: 20, transform: [{ rotate: '-2deg' }] },
  map: { marginTop: 26 }, mapRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 10 }, track: { height: 17, flex: 1, backgroundColor: colors.track, borderRadius: 5 }, fill: { height: '100%', backgroundColor: colors.primary, borderRadius: 5 },
});
