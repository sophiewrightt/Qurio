import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { ExperimentDiagram } from './ExperimentDiagram';
import { PrimaryButton } from './PrimaryButton';
import { colors, fonts } from '../constants/theme';

type Stage = 'ready' | 'a-running' | 'a-done' | 'b-running' | 'sum' | 'both-running' | 'done';

export function SlitWaveComparison({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>('ready');
  const [comparison, setComparison] = useState<'sum' | 'interference'>('interference');
  const progress = useRef(new Animated.Value(0)).current;
  const busy = useRef(false);
  const active = useRef(true);
  const notified = useRef(false);
  useEffect(() => { active.current = true; return () => { active.current = false; progress.stopAnimation(); }; }, [progress]);
  const run = (which: 'a' | 'b' | 'both') => {
    if (busy.current || (which === 'a' ? stage !== 'ready' : which === 'b' ? stage !== 'a-done' : stage !== 'sum')) return;
    busy.current = true;
    progress.setValue(0);
    setStage(which === 'both' ? 'both-running' : which === 'a' ? 'a-running' : 'b-running');
    Animated.timing(progress, { toValue: 1, duration: 2800, useNativeDriver: true }).start(({ finished }) => {
      if (!active.current || !finished) return;
      busy.current = false;
      setStage(which === 'both' ? 'done' : which === 'a' ? 'a-done' : 'sum');
      if (which === 'both' && !notified.current) { notified.current = true; onComplete(); }
    });
  };
  const running = stage.endsWith('running');
  const separate = stage === 'sum' || (stage === 'done' && comparison === 'sum');
  const openings = stage === 'ready' || stage.startsWith('a-') ? 'a' : stage.startsWith('b-') || separate ? 'b' : 'both';
  const pattern = stage === 'ready' ? undefined : separate ? 'sum' : openings === 'both' ? 'interference' : openings;
  const caption = stage === 'ready' ? 'Cover B and send a wave through A.'
    : stage.startsWith('a-') ? 'A only: the wave spreads onto a broad region of the screen.'
    : stage === 'b-running' ? 'B only: another broad region reaches the screen.'
    : separate ? 'A only + B only: adding the two separate results gives a smooth pattern, with no cancellation bands.'
    : 'Both open together: strong bands reach some parts of the screen; cancellation leaves weak bands between them.';
  return <View>
    <Text style={styles.note}>The same apparatus, turned sideways: A is now the upper opening and B the lower one.</Text>
    <ExperimentDiagram mode="wave" revealed={stage !== 'ready'} waveOpenings={openings} waveActive={!separate} screenPattern={pattern} screenProgress={running ? progress : undefined} />
    <Text accessibilityLiveRegion="polite" style={styles.caption}>{caption}</Text>
    {stage === 'ready' && <PrimaryButton label="Send through A only" onPress={() => run('a')} />}
    {stage === 'a-done' && <PrimaryButton label="Now send through B only" onPress={() => run('b')} />}
    {stage === 'sum' && <PrimaryButton label="Open both slits together" onPress={() => run('both')} />}
    {running && <Text style={styles.note}>Watch the waves reach the screen…</Text>}
    {stage === 'done' && <View style={styles.choices}>{(['sum', 'interference'] as const).map(value => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: comparison === value }} onPress={() => setComparison(value)} style={[styles.choice, comparison === value && styles.selected]}><Text style={styles.choiceText}>{value === 'sum' ? 'Separate runs added' : 'Both open together'}</Text></Pressable>)}</View>}
    <Text style={styles.note}>Purple shading shows relative intensity on the screen. This is a schematic wave illustration, not a particle’s trail or measured arrival counts.</Text>
  </View>;
}

const styles = StyleSheet.create({
  caption: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 28, marginVertical: 15 },
  note: { color: colors.muted, fontFamily: fonts.body, fontSize: 17, lineHeight: 23, marginVertical: 12 },
  choices: { flexDirection: 'row', gap: 10, marginVertical: 5 },
  choice: { flex: 1, borderWidth: 2, borderColor: colors.ink, borderRadius: 14, minHeight: 62, alignItems: 'center', justifyContent: 'center', padding: 7 },
  selected: { borderColor: colors.primaryDark, backgroundColor: '#EDE8FF' },
  choiceText: { color: colors.ink, fontFamily: fonts.body, fontSize: 19, textAlign: 'center' },
});
