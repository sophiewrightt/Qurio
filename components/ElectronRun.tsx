import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { ExperimentDiagram } from './ExperimentDiagram';
import { EnvironmentKind } from './EnvironmentEffects';
import { PrimaryButton } from './PrimaryButton';
import { colors, fonts } from '../constants/theme';

// Each mounted experiment owns its screen, animation, and arrivals.
export function ElectronRun({ whichPath = false, environment, possibilities = false, concealPath = false, manyOnly = false, onPattern, onBusyChange }: {
  whichPath?: boolean; environment?: EnvironmentKind; possibilities?: boolean; concealPath?: boolean; manyOnly?: boolean;
  onPattern: () => void; onBusyChange?: (busy: boolean) => void;
}) {
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [firing, setFiring] = useState(false);
  const countRef = useRef(0);
  const lock = useRef(false);
  const notified = useRef(false);
  const alive = useRef(true);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; clearInterval(timer.current); progress.stopAnimation(); };
  }, [progress]);
  const shoot = (many: boolean) => {
    if (lock.current || countRef.current >= 120 || (many && !manyOnly && countRef.current < 3)) return;
    lock.current = true; setBusy(true); onBusyChange?.(true); setFiring(true); progress.setValue(0);
    const add = (n: number) => {
      countRef.current = Math.min(120, countRef.current + n);
      setCount(countRef.current);
    };
    const finish = () => {
      lock.current = false; setBusy(false); setFiring(false); onBusyChange?.(false);
      if (countRef.current >= 60 && !notified.current) {
        notified.current = true; onPattern();
      }
    };
    Animated.timing(progress, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
      if (!alive.current) return;
      if (!finished) { finish(); return; }
      setFiring(false); add(1);
      if (!many) { finish(); return; }
      // Accelerated accumulation after the first visible arrival.
      let batches = 0;
      timer.current = setInterval(() => {
        if (!alive.current) return;
        add(5); batches += 1;
        if (batches === 12) { clearInterval(timer.current); timer.current = undefined; finish(); }
      }, 110);
    });
  };
  return <View>
    <ExperimentDiagram mode="electron" revealed count={count} whichPath={whichPath} progress={progress} firing={firing}
      environment={environment} possibilities={possibilities && busy} concealPath={concealPath} />
    <Text style={styles.hint} accessibilityLiveRegion="polite">{busy ? 'Watch the arrivals build up…' : count === 0 ? '' : count >= 120 ? 'Pattern complete - keep exploring below.' : 'Keep firing electrons to find out!'}</Text>
    <View style={styles.controls}>
      <PrimaryButton label={busy ? firing ? 'Firing…' : 'Experiment running…' : count >= 120 ? 'Pattern complete' : !manyOnly && count < 3 ? 'Shoot an electron' : 'Fire many · build the pattern'} disabled={busy || count >= 120} onPress={() => shoot(manyOnly || countRef.current >= 3)} />
    </View>
  </View>;
}
const styles = StyleSheet.create({
  controls: { gap: 12, marginTop: 4, marginBottom: 22 },
  hint: { color: colors.ink, fontFamily: fonts.body, fontSize: 18, textAlign: 'center', marginVertical: 14 },
});
