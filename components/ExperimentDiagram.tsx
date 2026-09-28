import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { EnvironmentEffects, EnvironmentKind } from './EnvironmentEffects';
import { ExperimentSource } from './ExperimentSource';

const electron = require('../assets/particles/electron-avatar.png');
const basketball = require('../assets/lesson-1/basketball.png');
const censored = require('../assets/ui/censored-transparent.png');
const detectorEye = require('../assets/lesson-5/eye-icon-transparent.png');
type Mode = 'ball' | 'wave' | 'electron';

// One deterministic cycle sampled from a central-bright diffraction envelope:
// central fringe 8/20, inner pair 4/20 each, outer pair 2/20 each.
const interferenceBands = [95, 62, 95, 128, 95, 29, 95, 161, 95, 62, 95, 128, 62, 95, 128, 95, 29, 62, 161, 128];

function BasketballFlight({ width, delay }: { width: number; delay: number }) {
  const progress = useRef(new Animated.Value(0)).current;
  const [target, setTarget] = useState(120);
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    const launch = () => {
      if (!active) return;
      setTarget(62 + Math.random() * 158);
      progress.setValue(0);
      Animated.timing(progress, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: true }).start(({ finished }) => {
        if (finished && active) timer = setTimeout(launch, 180);
      });
    };
    timer = setTimeout(launch, delay);
    return () => { active = false; clearTimeout(timer); progress.stopAnimation(); };
  }, [width, delay, progress]);
  return <Animated.Image source={basketball} style={[styles.ball, {
    opacity: progress.interpolate({ inputRange: [0, 0.06, 0.92, 1], outputRange: [0, 1, 1, 0] }),
    transform: [
      { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [20, width * 0.46 - 21] }) },
      { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [140, target] }) },
      { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '240deg'] }) },
    ],
  }]} />;
}

function Ripple({ y, delay, extent }: { y: number; delay: number; extent: number }) {
  const phase = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.timing(phase, { toValue: 1, duration: 2300, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web', isInteraction: false }));
    const timer = setTimeout(() => animation.start(), delay);
    return () => { clearTimeout(timer); animation.stop(); };
  }, [phase, delay]);
  return <Animated.View style={[styles.ripple, {
    width: extent * 2, height: extent * 2, borderRadius: extent,
    left: -extent, top: y - extent,
    opacity: phase.interpolate({ inputRange: [0, 0.08, 0.8, 1], outputRange: [0, 0.6, 0.35, 0] }),
    transform: [{ scale: phase.interpolate({ inputRange: [0, 1], outputRange: [0.02, 1.35] }) }],
  }]} />;
}

function Waves({ width, revealed, openings = 'both' }: { width: number; revealed: boolean; openings?: 'a' | 'b' | 'both' }) {
  const phase = useRef(new Animated.Value(0)).current;
  const wallX = width * 0.46;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(phase, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web', isInteraction: false }));
    loop.start(); return () => loop.stop();
  }, [phase]);
  return <>
    <View style={[styles.incident, { width: wallX - 32 }]}>
      <Animated.View testID="incoming-wavefronts" style={{ width: wallX, height: 165, transform: [{ translateX: phase.interpolate({ inputRange: [0, 1], outputRange: [-26, 0] }) }] }}>
        {Array.from({ length: 8 }, (_, i) => <View key={i} style={[styles.front, { left: i * 26 }]} />)}
      </Animated.View>
    </View>
    {revealed && <View style={[styles.outgoing, { left: wallX + 9, width: width - wallX - 49 }]}>
      {(openings === 'a' ? [65] : openings === 'b' ? [125] : [65, 125]).map(y => [0, 760, 1520].map(delay => <Ripple key={y + '-' + delay} y={y} delay={delay} extent={width - wallX - 35} />))}
    </View>}
  </>;
}

export function ExperimentDiagram({ mode, revealed, count = 0, progress, firing = false, whichPath = false, environment, possibilities = false, concealPath = false, waveOpenings = 'both', waveActive = true, screenPattern, screenProgress }: {
  mode: Mode; revealed: boolean; count?: number; progress?: Animated.Value; firing?: boolean; whichPath?: boolean;
  environment?: EnvironmentKind; possibilities?: boolean; concealPath?: boolean;
  waveOpenings?: 'a' | 'b' | 'both'; waveActive?: boolean; screenPattern?: 'a' | 'b' | 'sum' | 'interference'; screenProgress?: Animated.Value;
}) {
  const [width, setWidth] = useState(320);
  const revealOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(revealOpacity, { toValue: revealed ? 1 : 0, duration: 950, useNativeDriver: true }).start();
  }, [revealed, revealOpacity]);
  const wallX = width * 0.46;
  // Detector positions are a teaching illustration, not a physical simulation.
  const marks = Array.from({ length: Math.min(count, 300) }, (_, i) => {
    const band = mode === 'ball' || whichPath ? [65, 125][i % 2]! : interferenceBands[i % interferenceBands.length]!;
    // Strong environmental disturbance washes out fringes into a broad envelope.
    const diffuseY = 12 + (((i * 37) % 163) + ((i * 71) % 163)) / 2;
    return { x: 4 + (i * 7 % 17), y: environment ? diffuseY : band + ((i * 11 % 13) - 6) };
  });
  const nextBand = whichPath ? [65, 125][count % 2]! : interferenceBands[count % interferenceBands.length]!;
  const landingY = 55 + (environment ? 12 + (((count * 37) % 163) + ((count * 71) % 163)) / 2 : nextBand + ((count * 11 % 13) - 6)) - 13;
  return <View onLayout={e => setWidth(e.nativeEvent.layout.width)} style={styles.diagram} accessibilityLabel={mode + ' experiment, ' + (screenPattern ? 'screen showing schematic intensity' : count === 0 ? 'detector empty' : 'detector showing arrival points')}>
    {!revealed && <View pointerEvents="none" style={styles.labels}>
      <Text style={[styles.annotation, { left: 3, top: 14, width: 95 }]}>{mode === 'ball' ? 'basketball shooter' : mode === 'wave' ? 'wave source' : 'electron source'} ↓</Text>
      <Text style={[styles.annotation, { left: wallX - 19, top: 13 }]}>wall ↓</Text>
      <Text style={[styles.annotation, { right: 3, top: 13 }]}>screen ↓</Text>
      <Text style={[styles.annotation, { left: wallX - 30, top: 261 }]}>↑ two openings</Text>
    </View>}
    <ExperimentSource mode={mode} />
    {mode === 'ball' && !revealed && [0, 350, 700].map(delay => <BasketballFlight key={delay} width={width} delay={delay} />)}
    {mode === 'wave' && waveActive && <Waves width={width} revealed={revealed} openings={waveOpenings} />}
    {possibilities && <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: environment ? 0.12 : 0.65 }]}>
      <Waves width={width} revealed />
    </View>}
    {environment && <EnvironmentEffects kind={environment} width={width} />}
    <View style={[styles.wall, { left: wallX }]}><View style={[styles.opening, { top: 55 }]} /><View style={[styles.opening, { top: 115 }]} /></View>
    {mode === 'wave' && waveOpenings !== 'both' && <View testID="covered-wave-slit" style={{ position: 'absolute', left: wallX - 2, top: waveOpenings === 'a' ? 170 : 110, width: 13, height: 20, backgroundColor: colors.ink }} />}
    {screenPattern && <>
      <Text style={[styles.annotation, { right: 5, top: 22, color: colors.ink }]}>screen ↓</Text>
      <Text style={[styles.annotation, { left: wallX - 20, top: 110, color: colors.ink }]}>A</Text>
      <Text style={[styles.annotation, { left: wallX - 20, top: 170, color: colors.ink }]}>B</Text>
    </>}
    {whichPath && <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Text style={[styles.annotation, { left: wallX - 30, top: 20, color: colors.ink }]}>slit detectors ↓</Text>
      {[111, 171].map((y, i) => <View key={y} style={{ position: 'absolute', left: wallX + 12, top: y, width: 32, height: 25, borderRadius: 5, borderWidth: 2, borderColor: colors.ink, backgroundColor: firing && count % 2 === i ? colors.yellow : '#C8BBEF', transform: [{ rotate: '-4deg' }] }}><Image source={detectorEye} resizeMode="contain" style={styles.detectorEye} /></View>)}
    </View>}
    {!revealed && <Text style={[styles.unknown, { left: wallX + 22 }]}>?</Text>}
    <View style={styles.detector}>
      {screenPattern ? <Animated.View testID="wave-screen-intensity" accessibilityLabel={`${screenPattern === 'interference' ? 'Alternating strong and weak bands' : 'Broad smooth intensity'} on the screen, schematic not measured counts`} style={{ flex: 1, overflow: 'hidden', opacity: screenProgress ? screenProgress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] }) : 1 }}>
        {Array.from({ length: 38 }, (_, i) => {
          // Schematic common envelope. Adding separate intensities is smooth;
          // adding coherent amplitudes introduces bright and dark fringes.
          const y = (i + 0.5) / 38;
          const envelope = Math.exp(-Math.pow((y - 0.5) / 0.33, 2));
          const intensity = envelope * (screenPattern === 'interference' ? Math.pow(Math.cos((y - 0.5) * Math.PI * 5), 2) : 1);
          return <View key={i} style={{ height: 5, backgroundColor: colors.primary, opacity: intensity }} />;
        })}
      </Animated.View> : <Animated.View style={{ flex: 1, opacity: revealOpacity }}>{marks.map((point, i) => <View key={i} style={[styles.dot, { left: point.x, top: point.y, backgroundColor: mode === 'ball' ? colors.coral : colors.primary }]} />)}</Animated.View>}
    </View>
    {firing && progress && <Animated.Image source={electron} style={[styles.flying, {
      // In the possibilities view, don't pretend we know an unmeasured slit/path.
      opacity: progress.interpolate({ inputRange: possibilities ? [0, 0.05, 0.38, 0.5] : [0, 0.05, 0.94, 1], outputRange: [0, 1, 1, 0], extrapolate: 'clamp' }),
      transform: [
        { translateX: progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [18, wallX - 8, width - 42] }) },
        // Alternate the illustrative approach. In an unmeasured experiment the
        // actual slit region remains hidden or is shown as both possibilities.
        { translateY: progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [135, count % 2 ? 161 : 101, landingY] }) },
      ],
    }]} />}
    {mode === 'electron' && concealPath && firing && <Image source={censored} resizeMode="contain" style={[styles.pathCover, { left: wallX - 56 }]} />}
  </View>;
}
const styles = StyleSheet.create({
  diagram: { height: 300, backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1.5, borderColor: colors.ink, overflow: 'hidden' },
  labels: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }, annotation: { position: 'absolute', fontFamily: fonts.body, color: colors.muted, fontSize: 15, transform: [{ rotate: '-3deg' }] },
  ball: { position: 'absolute', width: 22, height: 22, left: 0, top: 0 },
  wall: { position: 'absolute', top: 55, height: 190, width: 9, backgroundColor: colors.ink },
  opening: { position: 'absolute', width: 11, left: -1, height: 20, backgroundColor: colors.surface },
  detector: { position: 'absolute', right: 9, top: 55, height: 190, width: 31, borderWidth: 2, borderColor: colors.ink, borderRadius: 5 },
  dot: { position: 'absolute', width: 4, height: 4, borderRadius: 2, opacity: 0.7 },
  unknown: { position: 'absolute', top: 118, fontFamily: fonts.display, fontSize: 54, color: colors.coral },
  incident: { position: 'absolute', left: 32, top: 68, height: 165, overflow: 'hidden' },
  front: { position: 'absolute', top: 0, width: 3, height: 165, backgroundColor: colors.blue, opacity: 0.7, borderRadius: 3 },
  outgoing: { position: 'absolute', top: 55, height: 190, overflow: 'hidden' },
  ripple: { position: 'absolute', borderWidth: 2.5, borderColor: colors.blue },
  flying: { position: 'absolute', left: 0, top: 0, width: 31, height: 31 },
  pathCover: { position: 'absolute', top: 87, width: 120, height: 120, zIndex: 30, transform: [{ rotate: '-2deg' }] },
  detectorEye: { width: 27, height: 20, alignSelf: 'center', marginTop: 1 },
});
