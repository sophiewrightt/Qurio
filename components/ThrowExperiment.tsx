import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { colors, fonts } from '../constants/theme';

function OriginalSprite({ kind, size }: { kind: 'hoop' | 'ant'; size: number }) {
  const specs = {
    hoop: { source: require('../assets/lesson-2/hoop.jpg'), x: 0.485, y: 0.425, span: 0.18 },
    ant: { source: require('../assets/lesson-2/ant.jpg'), x: 0.30, y: 0.29, span: 0.30 },
  }[kind];
  const canvas = size / specs.span;
  return <View style={{ width: size, height: size, overflow: 'hidden' }}><Image source={specs.source} style={{ position: 'absolute', width: canvas, height: canvas, left: -canvas * specs.x, top: -canvas * specs.y }} /></View>;
}

export function ThrowExperiment({ mode, onTried }: { mode: 'ball' | 'sand' | 'electron'; onTried?: () => void }) {
  const [width, setWidth] = useState(300);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [math, setMath] = useState(false);
  const lock = useRef(false);
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => () => progress.stopAnimation(), [progress]);
  const throwObject = () => {
    if (lock.current) return;
    lock.current = true; setBusy(true); setDone(false); setMath(false); progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration: 1450, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
      lock.current = false;
      if (finished) { setBusy(false); setDone(true); onTried?.(); }
    });
  };
  const endX = width - 98;
  return <View>
    <View style={styles.court} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
      {mode === 'sand' && <View style={styles.ant}><OriginalSprite kind="ant" size={105} /></View>}
      <View style={[styles.hoop, { left: endX }]}><OriginalSprite kind="hoop" size={82} /></View>
      {mode === 'electron' && <Animated.View pointerEvents="none" style={[styles.quantumBranches, { left: width * 0.38, opacity: progress.interpolate({ inputRange: [0, .45, .62, 1], outputRange: [0, 0, 1, 1] }) }]}>
        {[-34, -17, 0, 17, 34].map((offset, index) => <View key={offset} style={[styles.branch, { top: 62 + offset, width: 88 + Math.abs(offset), transform: [{ rotate: `${offset / 2.7}deg` }] }]}><Text style={[styles.branchQuestion, { right: -13, top: index % 2 ? -15 : -8 }]}>?</Text></View>)}
      </Animated.View>}
      {mode !== 'electron' && Array.from({ length: 18 }, (_, i) => {
        const t = i / 17;
        return <Animated.View key={i} style={[styles.trail, {
          left: 35 + t * (endX - 4), top: 177 - 330 * t + 265 * t * t,
          opacity: progress.interpolate({ inputRange: [Math.max(0, t - .07), Math.max(.01, t)], outputRange: [0, .65], extrapolate: 'clamp' }),
        }]} />;
      })}
      <Animated.View style={{ position: 'absolute', left: 0, top: 0,
        opacity: mode === 'electron' ? progress.interpolate({ inputRange: [0, .46, .62, 1], outputRange: [1, 1, 0, 0] }) : 1,
        transform: [
          { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [mode === 'sand' ? 58 : 24, mode === 'electron' ? width / 2 : endX + (mode === 'sand' ? 9 : 21)] }) },
          { translateY: progress.interpolate({ inputRange: [0, .25, .5, .75, 1], outputRange: mode === 'electron' ? [160, 135, 115, 110, 105] : mode === 'sand' ? [152, 86, 53, 53, 93] : [164, 98, 65, 65, 105] }) },
        ] }}>
        {mode === 'sand' ? <Image source={require('../assets/lesson-2/sand-transparent.png')} resizeMode="contain" style={{ width: 62, height: 62 }} /> : <Image source={mode === 'ball' ? require('../assets/lesson-1/basketball.png') : require('../assets/particles/electron-avatar.png')} style={{ width: 38, height: 38 }} />}
      </Animated.View>
      {math && mode !== 'electron' && <View style={styles.equations}><Text style={styles.equation}>x = x₀ + vₓt</Text><Text style={styles.equation}>y = y₀ + vᵧt − ½gt²</Text></View>}
    </View>
    <PrimaryButton label={busy ? 'In flight…' : mode === 'electron' ? 'Throw the electron' : done ? 'Throw it again' : mode === 'sand' ? 'Let the ant throw!' : 'Throw the basketball'} disabled={busy} onPress={throwObject} />
    {mode !== 'electron' && done && <Text accessibilityRole="button" onPress={() => setMath(value => !value)} style={styles.toggle}>{math ? 'Hide the maths' : 'Peek at the maths (optional)'}</Text>}
    {mode !== 'electron' && math && <Text style={styles.mathNote}>Don’t worry if this looks like a gibberish language. This is some maths you can learn later if you want to.</Text>}
    {mode === 'electron' && (busy || done) && <Text style={styles.whatsGoingOn}>What’s going on???</Text>}
  </View>;
}
const styles = StyleSheet.create({
  court: { backgroundColor: colors.white, height: 275, borderWidth: 1.5, borderColor: colors.ink, borderRadius: 18, marginVertical: 18, overflow: 'hidden' },
  ant: { position: 'absolute', left: -4, top: 158 }, hoop: { position: 'absolute', top: 108 },
  quantumBranches: { position: 'absolute', top: 47, width: 150, height: 180, zIndex: 2 },
  branch: { position: 'absolute', left: 0, height: 2, borderRadius: 2, borderTopWidth: 2, borderStyle: 'dashed', borderColor: colors.primary },
  branchQuestion: { position: 'absolute', fontFamily: fonts.display, fontSize: 30, color: colors.primaryDark },
  trail: { position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: colors.coral },
  equations: { position: 'absolute', left: 100, bottom: 8 }, equation: { color: colors.primary, fontFamily: fonts.body, fontSize: 17 },
  toggle: { fontFamily: fonts.body, fontSize: 19, paddingVertical: 16, color: colors.primary, textAlign: 'center' },
  mathNote: { fontFamily: fonts.body, fontSize: 18, lineHeight: 24, color: colors.ink, textAlign: 'center', backgroundColor: '#FFF0B8', borderRadius: 14, padding: 13, marginBottom: 8 },
  whatsGoingOn: { fontFamily: fonts.display, fontSize: 28, color: colors.coral, textAlign: 'center', marginTop: 12 },
});
