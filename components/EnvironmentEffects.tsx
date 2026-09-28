import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

export type EnvironmentKind = 'air' | 'photon' | 'atoms' | 'heat' | 'vibrations';

// Decorative, deliberately schematic cues for the selected interaction.
export function EnvironmentEffects({ kind, width }: { kind: EnvironmentKind; width: number }) {
  const drift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(drift, { toValue: 1, duration: kind === 'vibrations' ? 180 : 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(drift, { toValue: 0, duration: kind === 'vibrations' ? 180 : 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    animation.start(); return () => animation.stop();
  }, [drift, kind]);
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Text style={styles.caption}>{({ air: 'air molecules drift in', photon: 'light scatters from electrons', atoms: 'nearby atoms interact', heat: 'a warmer environment', vibrations: 'the apparatus vibrates' })[kind]}</Text>
    {Array.from({ length: kind === 'photon' ? 1 : 6 }, (_, i) => <Animated.View key={i} style={{
      position: 'absolute', left: 36 + ((i * 47) % Math.max(70, width - 100)), top: 65 + (i * 53) % 165,
      transform: [
        { translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [0, kind === 'photon' ? width * 0.52 : i % 2 ? -9 : 9] }) },
        { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, kind === 'photon' ? 62 : i % 2 ? 8 : -8] }) },
      ],
    }}>
      {kind === 'photon' ? <Animated.Image source={require('../assets/particles/photon.png')} style={{ width: 46, height: 46 }} resizeMode="contain" />
        : kind === 'air' ? <Image source={require('../assets/lesson-6/interactions/air-particle-transparent.png')} resizeMode="contain" style={{ width: 37, height: 37 }} />
        : kind === 'heat' ? <Image source={require('../assets/lesson-6/interactions/heat-particle-transparent.png')} resizeMode="contain" style={{ width: 43, height: 43 }} />
        : kind === 'vibrations' ? <Text style={{ fontSize: 33, color: colors.primary, opacity: 0.65 }}>∿</Text>
          : <View style={[styles.atom, { backgroundColor: '#D9CEF2' }]}><View style={styles.nucleus} /></View>}
    </Animated.View>)}
  </View>;
}
const styles = StyleSheet.create({
  caption: { color: colors.ink, fontFamily: fonts.body, fontSize: 17, textAlign: 'center', marginTop: 17 },
  atom: { width: 19, height: 19, borderRadius: 11, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary, opacity: 0.65, alignItems: 'center', justifyContent: 'center' },
  nucleus: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.primary },
});
