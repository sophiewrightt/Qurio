import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent, type NativeSyntheticEvent, type NativeTouchEvent } from 'react-native';
import { colors, fonts } from '../constants/theme';

const COLUMNS = 14;
const ROWS = 5;
const TILE_COUNT = COLUMNS * ROWS;
const SCRATCH_RADIUS = 25;

function distanceToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return Math.hypot(px - ax, py - ay);
  const amount = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
  return Math.hypot(px - (ax + amount * dx), py - (ay + amount * dy));
}

const rainbowColors = ['#E95B4F', '#F39A44', '#D0A92F', '#45A66D', '#4B91CC', '#7659C7', '#D9589C'];

export function ScratchReveal({ title, children, rainbow = false, coatingColor, onReveal }: { title: string; children: string; rainbow?: boolean; coatingColor?: string; onReveal?: () => void }) {
  const [erased, setErased] = useState<Set<number>>(() => new Set());
  const [size, setSize] = useState({ width: 0, height: 0 });
  const lastPoint = useRef<{ x: number; y: number } | undefined>(undefined);
  const revealed = erased.size >= TILE_COUNT;
  const notified = useRef(false);
  useEffect(() => { if (revealed && !notified.current) { notified.current = true; onReveal?.(); } }, [revealed, onReveal]);
  const scratch = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    const point = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY };
    const start = lastPoint.current ?? point;
    lastPoint.current = point;
    if (!size.width || !size.height) return;
    setErased(previous => {
      const next = new Set(previous);
      const tileWidth = size.width / COLUMNS;
      const tileHeight = size.height / ROWS;
      for (let row = 0; row < ROWS; row += 1) for (let column = 0; column < COLUMNS; column += 1) {
        const index = row * COLUMNS + column;
        const centreX = (column + 0.5) * tileWidth;
        const centreY = (row + 0.5) * tileHeight;
        if (distanceToSegment(centreX, centreY, start.x, start.y, point.x, point.y) <= SCRATCH_RADIUS) next.add(index);
      }
      return next.size >= TILE_COUNT * 0.72 ? new Set(Array.from({ length: TILE_COUNT }, (_, index) => index)) : next;
    });
  };
  const onLayout = (event: LayoutChangeEvent) => setSize(event.nativeEvent.layout);
  const revealForAccessibility = () => setErased(new Set(Array.from({ length: TILE_COUNT }, (_, index) => index)));
  return <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    {!revealed && <Text style={styles.hint}>Scratch across the panel with your finger</Text>}
    <View accessibilityRole="button" accessibilityLabel={revealed ? children : `Scratch to reveal ${title}`} onAccessibilityTap={revealForAccessibility}
      onLayout={onLayout} onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true} onResponderGrant={scratch} onResponderMove={scratch}
      onResponderRelease={() => { lastPoint.current = undefined; }} onResponderTerminate={() => { lastPoint.current = undefined; }} onResponderTerminationRequest={() => false}
      style={[styles.paper, rainbow && styles.rainbowPaper]}>
      {rainbow ? <Text style={[styles.body, styles.rainbowBody]}>{children.split('').map((letter, index) => <Text key={`${letter}-${index}`} style={{ color: rainbowColors[index % rainbowColors.length] }}>{letter}</Text>)}</Text> : <Text style={styles.body}>{children}</Text>}
      <View pointerEvents="none" style={styles.coating}>
        {size.width > 0 && Array.from({ length: TILE_COUNT }, (_, index) => erased.has(index) ? null : <View key={index} style={[styles.tile, {
          left: (index % COLUMNS) * size.width / COLUMNS,
          top: Math.floor(index / COLUMNS) * size.height / ROWS,
          width: size.width / COLUMNS + 1,
          height: size.height / ROWS + 1,
          backgroundColor: coatingColor ?? colors.mint,
        }]} />)}
      </View>
    </View>
  </View>;
}
const styles = StyleSheet.create({
  card: { marginVertical: 14 }, title: { fontFamily: fonts.display, fontSize: 25, color: colors.ink, marginBottom: 9 },
  hint: { color: colors.primary, fontFamily: fonts.body, fontSize: 17, marginBottom: 8 },
  paper: { padding: 20, minHeight: 115, justifyContent: 'center', overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, borderRadius: 13 },
  coating: { position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 10 }, tile: { position: 'absolute' },
  body: { fontFamily: fonts.body, fontSize: 24, lineHeight: 31, color: colors.ink, textAlign: 'center' },
  rainbowPaper: { minHeight: 132, backgroundColor: '#FFF9E7' },
  rainbowBody: { fontFamily: fonts.display, fontSize: 42, lineHeight: 50, fontWeight: '700', letterSpacing: 1 },
});
