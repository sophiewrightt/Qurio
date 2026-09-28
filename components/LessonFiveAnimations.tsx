import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

const wizard = require('../assets/lesson-5/wizard-transparent.png');
const normalElectron = require('../assets/particles/electron-avatar.png');
const surprisedElectron = require('../assets/lesson-5/electron-surprised-transparent.png');
const shyElectron = require('../assets/lesson-5/electron-getting-shy-transparent.png');
const magicHat = require('../assets/lesson-5/magic-hat-transparent.png');
const stagePerson = require('../assets/lesson-5/stage-fright/stick-person-transparent.png');
const stageShadow = require('../assets/lesson-5/stage-fright/shadow-transparent.png');

export function WizardMagicScene() {
  const cast = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(cast, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(cast, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [cast]);
  return <View style={styles.castCard} accessibilityLabel="A wizard casts sparkling magic toward a smiling electron">
    <Animated.Image source={wizard} resizeMode="contain" style={[styles.wizard, {
      transform: [{ translateY: cast.interpolate({ inputRange: [0, 1], outputRange: [3, -3] }) }, { rotate: cast.interpolate({ inputRange: [0, 1], outputRange: ['-1deg', '2deg'] }) }],
    }]} />
    <Animated.View style={[styles.spellTrail, {
      opacity: cast.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0.25, 1, 0.55] }),
      transform: [{ translateX: cast.interpolate({ inputRange: [0, 1], outputRange: [-12, 13] }) }, { scale: cast.interpolate({ inputRange: [0, 1], outputRange: [0.75, 1.15] }) }],
    }]}>
      <Text style={styles.spell}>✦  ⋆  ✧</Text>
      <Text style={[styles.spell, { marginLeft: 18 }]}>⋆  ✦</Text>
    </Animated.View>
    <Animated.Image source={normalElectron} resizeMode="contain" style={[styles.castElectron, {
      transform: [{ scale: cast.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.08, 1] }) }, { rotate: cast.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '4deg', '0deg'] }) }],
    }]} />
  </View>;
}

export function MagicHatScene() {
  const phase = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // RN Web otherwise selects the native-loop branch before falling back to
    // a single JS timing run, leaving the hat invisible at phase 1.
    const animation = Animated.loop(Animated.timing(phase, { toValue: 1, duration: 5600, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web', isInteraction: false }));
    animation.start();
    return () => animation.stop();
  }, [phase]);
  const hover = phase.interpolate({ inputRange: [0, 0.18, 0.36, 0.54, 0.72, 1], outputRange: [-3, -12, -3, -12, -4, -3] });
  return <View style={styles.hatCard} accessibilityLabel="A smiling electron hovers above a magic hat; the hat vanishes in a poof and the electron looks surprised">
    <View style={styles.electronLayer}>
      <Animated.Image source={normalElectron} resizeMode="contain" style={[styles.hatElectron, {
        opacity: phase.interpolate({ inputRange: [0, 0.48, 0.58, 1], outputRange: [1, 1, 0, 0] }),
        transform: [{ translateY: hover }],
      }]} />
      <Animated.Image source={surprisedElectron} resizeMode="contain" style={[styles.hatElectron, {
        opacity: phase.interpolate({ inputRange: [0, 0.52, 0.63, 0.9, 1], outputRange: [0, 0, 1, 1, 0] }),
        transform: [{ translateY: hover }, { scale: phase.interpolate({ inputRange: [0.52, 0.67, 1], outputRange: [0.75, 1, 1], extrapolate: 'clamp' }) }],
      }]} />
    </View>
    <Animated.Image source={magicHat} resizeMode="contain" style={[styles.magicHat, {
      opacity: phase.interpolate({ inputRange: [0, 0.47, 0.58, 1], outputRange: [1, 1, 0, 0] }),
      transform: [{ scale: phase.interpolate({ inputRange: [0, 0.47, 0.58, 1], outputRange: [1, 1, 0.1, 0.1] }) }],
    }]} />
    <Animated.View style={[styles.poof, {
      opacity: phase.interpolate({ inputRange: [0, 0.46, 0.52, 0.67, 1], outputRange: [0, 0, 1, 0, 0] }),
      transform: [{ scale: phase.interpolate({ inputRange: [0.46, 0.58, 0.72], outputRange: [0.2, 1.35, 1.8], extrapolate: 'clamp' }) }],
    }]}><Text style={styles.poofText}>POOF!</Text></Animated.View>
  </View>;
}

export function DancingElectronScene() {
  const phase = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.timing(phase, { toValue: 1, duration: 6800, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web', isInteraction: false }));
    animation.start();
    return () => animation.stop();
  }, [phase]);
  return <View style={styles.danceCard} accessibilityLabel="An electron dances, becomes shy when a person enters, then dances again after the person leaves">
    <Image source={stageShadow} resizeMode="contain" style={styles.stageShadow} />
    <Animated.View style={[styles.music, { opacity: phase.interpolate({ inputRange: [0, 0.38, 0.47, 0.82, 0.9, 1], outputRange: [1, 1, 0, 0, 1, 1] }), transform: [{ translateY: phase.interpolate({ inputRange: [0, 0.38, 0.82, 1], outputRange: [9, -13, 9, -9] }) }] }]}><Text style={styles.musicText}>♪  ♫  ♪</Text></Animated.View>
    <Animated.Image source={normalElectron} resizeMode="contain" style={[styles.dancingElectron, {
      opacity: phase.interpolate({ inputRange: [0, 0.4, 0.49, 0.81, 0.9, 1], outputRange: [1, 1, 0, 0, 1, 1] }),
      transform: [
        { translateY: phase.interpolate({ inputRange: [0, 0.12, 0.24, 0.36, 0.48, 0.81, 0.9, 1], outputRange: [0, -12, 0, -12, 0, 0, -12, 0] }) },
        { rotate: phase.interpolate({ inputRange: [0, 0.12, 0.24, 0.36, 0.48, 0.81, 0.9, 1], outputRange: ['-8deg', '9deg', '-8deg', '9deg', '-8deg', '-8deg', '9deg', '-8deg'] }) },
      ],
    }]} />
    <Animated.Image source={shyElectron} resizeMode="contain" style={[styles.dancingElectron, { opacity: phase.interpolate({ inputRange: [0, 0.4, 0.49, 0.81, 0.9, 1], outputRange: [0, 0, 1, 1, 0, 0] }) }]} />
    <Animated.Image source={stagePerson} resizeMode="contain" style={[styles.person, { transform: [{ translateX: phase.interpolate({ inputRange: [0, 0.27, 0.43, 0.68, 0.84, 1], outputRange: [150, 150, 0, 0, 150, 150] }) }] }]} />
  </View>;
}

const styles = StyleSheet.create({
  castCard: { width: '100%', height: 260, marginVertical: 22, overflow: 'visible' },
  wizard: { position: 'absolute', left: -8, bottom: 5, width: 180, height: 230 },
  castElectron: { position: 'absolute', right: 20, top: 91, width: 82, height: 82 },
  spellTrail: { position: 'absolute', left: 142, top: 91, width: 92, zIndex: 3 },
  spell: { color: '#E2A800', fontFamily: fonts.display, fontSize: 25, lineHeight: 35 },
  hatCard: { width: '100%', height: 290, marginVertical: 22, overflow: 'visible', alignItems: 'center' },
  electronLayer: { position: 'absolute', top: 17, width: 146, height: 146 },
  hatElectron: { position: 'absolute', width: 146, height: 146 },
  magicHat: { position: 'absolute', top: 143, width: 190, height: 125 },
  poof: { position: 'absolute', top: 170, alignItems: 'center' },
  poofText: { color: colors.coral, fontFamily: fonts.display, fontSize: 24 },
  danceCard: { width: '100%', height: 245, marginVertical: 14, overflow: 'hidden' },
  stageShadow: { position: 'absolute', left: 5, right: 5, bottom: 5, width: '96%', height: 50, opacity: 0.72 },
  dancingElectron: { position: 'absolute', left: 34, top: 56, width: 145, height: 145 },
  behindCurtain: { position: 'absolute', left: 5, top: 67, width: 210, height: 122 },
  music: { position: 'absolute', left: 42, top: 30, zIndex: 5 },
  musicText: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 27 },
  person: { position: 'absolute', right: 2, top: 32, width: 122, height: 198 },
});
