import { useState } from 'react';
import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native';
import { LessonBeat, bonds } from '../data/lessonOne';
import { FramedSprite } from './FramedSprite';
import { colors, fonts, spacing } from '../constants/theme';
import { ZoomTrail } from './ZoomTrail';

export function LessonSection({ beat, index, onInspect, onHolding }: { beat: LessonBeat; index: number; onInspect?: () => void; onHolding?: (holding: boolean) => void }) {
  const [width, setWidth] = useState(300);
  const [point, setPoint] = useState<{ x: number; y: number }>();
  const end = () => { onHolding?.(false); setPoint(undefined); };
  const inspect = (event: GestureResponderEvent) => {
    // RN 0.86 reports local responder coordinates directly; retain the touch-list
    // fallback for older Expo Go builds and multi-touch events.
    const touch = Number.isFinite(event.nativeEvent.locationX) ? event.nativeEvent : event.nativeEvent.touches?.[0] ?? event.nativeEvent;
    const x = Number.isFinite(touch.locationX) ? touch.locationX : width / 2;
    const y = Number.isFinite(touch.locationY) ? touch.locationY : 140;
    setPoint({ x, y });
    onInspect?.();
  };
  return <View style={styles.section}>
    <Text style={styles.title}>{beat.title}</Text>
    <Text style={styles.holdHint}>TOUCH & HOLD THE MAGNIFYING GLASS OVER THE OBJECT</Text>
    <View
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
      style={styles.stage}>
      <FramedSprite sprite={beat.art} width={width} height={280} />
      {/* Keep the PNG mounted so it loads before a hold, with explicit native
          bounds and stacking above the artwork on iOS. */}
      <View collapsable={false} pointerEvents="none" testID="inspection-lens"
        style={{ position: 'absolute', width: 180, height: 200, zIndex: 20, opacity: point ? 1 : 0,
          left: Math.max(0, Math.min(width - 180, (point?.x ?? width / 2) - 65)),
          top: Math.max(0, Math.min(110, (point?.y ?? 140) - 65)) }}>
        <FramedSprite sprite={beat.lens} width={180} height={200} />
      </View>
      {/* A real native hit target above the non-interactive, cropped image hierarchy.
          Raw touch events run even before JS responder ownership is negotiated. */}
      <View collapsable={false} pointerEvents="box-only" testID="inspection-touch-surface"
        accessibilityRole="button" accessibilityLabel="Hold anywhere to look inside"
        style={styles.touchSurface}
        onStartShouldSetResponder={() => true}
        onStartShouldSetResponderCapture={() => true}
        onMoveShouldSetResponder={() => true}
        onMoveShouldSetResponderCapture={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={e => { onHolding?.(true); inspect(e); }}
        onResponderMove={inspect}
        onResponderRelease={end}
        onResponderTerminate={end} />
    </View>
    <Text style={styles.body}>{beat.body}</Text>
    {beat.moleculeNote && <View style={styles.tidbit}>
      <FramedSprite sprite={bonds} width={Math.min(width, 270)} height={150} />
      <Text style={styles.body}>There are lots of different kinds of molecules. They’re made of atoms of elements from the periodic table-like carbon and hydrogen-holding onto each other with chemical bonds.</Text>
    </View>}
    {!beat.final && <ZoomTrail />}
  </View>;
}
const styles = StyleSheet.create({
  section: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.sm },
  depth: { color: colors.primary, fontFamily: fonts.display, fontSize: 17, marginBottom: 16 },
  stage: { width: '100%', height: 310, marginTop: 20 },
  touchSurface: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 10, backgroundColor: 'transparent' },
  holdHint: { color: '#C93432', fontFamily: fonts.display, fontSize: 16, lineHeight: 22, textAlign: 'center', letterSpacing: 0.6, marginTop: 18, paddingHorizontal: 8 },
  title: { fontSize: 31, lineHeight: 38, textAlign: 'center', color: colors.ink, fontFamily: fonts.body },
  body: { fontSize: 20, lineHeight: 27, textAlign: 'center', color: colors.ink, fontFamily: fonts.body, marginTop: 10, maxWidth: 420 },
  tidbit: { alignItems: 'center', marginTop: 30, borderTopWidth: 1, borderColor: colors.ink, borderStyle: 'dashed', paddingTop: 18 },
  trail: { marginTop: 24, fontSize: 24, color: colors.ink },
});
