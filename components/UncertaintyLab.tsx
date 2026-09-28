import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnswerButton } from './AnswerButton';
import { colors, fonts } from '../constants/theme';

// Minimum-uncertainty Gaussian states in illustrative units, not knowledge percentages.
export function uncertaintyWidths(focus: number) {
  const position = 0.32 * Math.exp((0.5 - focus) * 2);
  return { position, momentum: 0.32 * 0.32 / position };
}
function Distribution({ title, width, axis }: { title: string; width: number; axis: string }) {
  return <View style={styles.distribution} accessible accessibilityLabel={title + ': ' + (width < 0.24 ? 'narrow' : width > 0.44 ? 'broad' : 'medium') + ' spread of possible results'}>
    <Text style={styles.label}>{title}</Text>
    <View style={styles.bars}>{Array.from({ length: 31 }, (_, index) => {
      const x = (index - 15) / 10;
      const height = Math.exp(-0.5 * (x / width) ** 2) / width * 13;
      return <View key={index} style={[styles.bar, { height, backgroundColor: title === 'Position' ? colors.primary : colors.coral }]} />;
    })}</View>
    <Text style={styles.axis}>{axis}</Text>
    <Text style={styles.caption}>Narrower shape = less uncertainty</Text>
  </View>;
}
export function UncertaintyLab({ onInteract }: { onInteract: () => void }) {
  const [focus, setFocus] = useState(0.5);
  const [seen, setSeen] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string>();
  const trackWidth = useRef(1);
  const complete = useRef(false);
  const widths = uncertaintyWidths(focus);
  const correct = 'A wider spread of possible momenta';
  const choose = (value: number) => {
    const next = Math.max(0, Math.min(1, value));
    setFocus(next);
    const end = next < 0.25 ? 'momentum' : next > 0.75 ? 'position' : '';
    if (end) setSeen(previous => previous.includes(end) ? previous : [...previous, end]);
  };
  return <View style={styles.lab}>
    <Text style={styles.body}>Each shape shows the spread of results we could get from many electrons prepared in the same state. These are not tracks showing an electron moving.</Text>
    <Distribution title="Position" width={widths.position} axis="Possible positions →" />
    <Distribution title="Momentum" width={widths.momentum} axis="Possible momenta →" />
    <Text style={styles.body}>Change the preparation. In this example, narrowing one spread widens the other.</Text>
    <View accessibilityRole="adjustable" accessibilityLabel="Change the uncertainty preparation"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(focus * 100), text: focus > 0.75 ? 'Narrow position spread' : focus < 0.25 ? 'Narrow momentum spread' : 'Both spreads intermediate' }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={event => choose(focus + (event.nativeEvent.actionName === 'increment' ? 0.25 : -0.25))}
      onLayout={event => { trackWidth.current = event.nativeEvent.layout.width; }}
      onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true} onResponderTerminationRequest={() => false}
      onResponderGrant={event => choose(event.nativeEvent.locationX / trackWidth.current)}
      onResponderMove={event => choose(event.nativeEvent.locationX / trackWidth.current)} style={styles.slider}>
      <View pointerEvents="none" style={[styles.thumb, { left: `${focus * 90 + 5}%` }]} />
    </View>
    <Text style={styles.caption}>You can see if the momentum becomes specific, the position becomes vague, and vice versa!!</Text>
    {seen.length === 2 && <>
      <Text style={styles.body}>If we prepare a narrower range of possible positions, what does this model predict?</Text>
      {['The electron stops moving', correct, 'Both spreads become arbitrarily narrow'].map(option => <AnswerButton key={option} knowledgeKey="uncertainty-transfer" isCorrectAnswer={option === correct} label={option} disabled={!!answer}
        state={!answer ? 'default' : option === correct ? 'correct' : option === answer ? 'incorrect' : 'default'}
        onPress={() => { if (complete.current) return false; complete.current = true; setAnswer(option); onInteract(); }} />)}
      {answer && <Text accessibilityLiveRegion="polite" style={styles.body}>The momentum spread widens. Earlier lessons showed that quantum outcomes form patterns rather than one certain path. This is the same idea becoming more precise: sharpening one property makes its partner less specific.</Text>}
    </>}
  </View>;
}
const styles = StyleSheet.create({
  lab: { marginVertical: 20, gap: 12 },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 29, marginVertical: 10 },
  distribution: { marginVertical: 8 }, label: { color: colors.ink, fontFamily: fonts.display, fontSize: 26 },
  bars: { height: 120, flexDirection: 'row', alignItems: 'flex-end', gap: 3, borderBottomWidth: 2, borderColor: colors.ink, overflow: 'hidden' },
  bar: { flex: 1, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  axis: { color: colors.ink, fontFamily: fonts.body, fontSize: 18, textAlign: 'center', marginTop: 6 },
  caption: { color: colors.muted, fontFamily: fonts.body, fontSize: 17, textAlign: 'center', marginVertical: 8 },
  slider: { height: 48, justifyContent: 'center', borderWidth: 2, borderColor: colors.ink, borderRadius: 24, backgroundColor: colors.surface, marginHorizontal: 4 },
  thumb: { position: 'absolute', width: 32, height: 32, marginLeft: -16, borderRadius: 16, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.ink },
});
