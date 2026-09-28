import { useEffect, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

const basketball = require('../assets/lesson-1/basketball.png');
const shyElectron = require('../assets/lesson-5/electron-getting-shy-transparent.png');
const dice = require('../assets/lesson-9/dice-transparent.png');
const strange = require('../assets/module-3/lesson-1/strange-default-transparent.png');
const socks = require('../assets/module-3/lesson-3-all-entangled-up/pair-of-socks-transparent.png');
const cat = require('../assets/module-2/lesson-7/cat/cat-standing-transparent.png');
const electronID = require('../assets/module-4/lesson-2/electron_ID.png');
const chair = require('../assets/module-4/lesson-4/chair.png');
const electron = require('../assets/particles/electron-content.png');
const atom = require('../assets/module-4/lesson-4/Carbon.png');
const photon = require('../assets/particles/photon.png');
const charm = require('../assets/module-4/lesson-2/charm_default.png');

type Icon = 'basketball' | 'interference' | 'shy' | 'dice' | 'phone' | 'up' | 'entangled' | 'socks' | 'cat' | 'wall' | 'id' | 'chair' | 'electron' | 'atom' | 'photon' | 'condensate';
type Recap = { title: string; meaning: string; icon: Icon };
export const worldQuizRecaps: Record<1 | 3 | 4, Recap[]> = {
  1: [
    { title: 'The quantum limit', meaning: 'Quantum physics follows different rules from the everyday world we see around us.', icon: 'basketball' },
    { title: 'Wave-particle duality', meaning: 'Quantum particles show both particle-like and wave-like behaviour.', icon: 'interference' },
    { title: 'Decoherence', meaning: 'Interaction with the environment, including during measurement, can wash out quantum interference.', icon: 'shy' },
    { title: 'Heisenberg’s uncertainty principle', meaning: 'A particle’s position and momentum cannot both be perfectly definite at once.', icon: 'dice' },
    { title: 'Quantum is everywhere!', meaning: 'Quantum isn’t just a weird concept. It’s in our technologies and the world around us.', icon: 'phone' },
  ],
  3: [
    { title: 'Spin', meaning: 'Quantum particles have an intrinsic, quantised property called spin.', icon: 'up' },
    { title: 'Entanglement', meaning: 'Entangled particles share a joint quantum state that links their outcome probabilities.', icon: 'entangled' },
    { title: 'Superposition', meaning: 'One quantum state can combine several possibilities, not just hide an answer like a pair of socks!', icon: 'socks' },
    { title: 'Schrödinger’s cat', meaning: 'A thought experiment that challenges how we interpret quantum superposition in the everyday world.', icon: 'cat' },
  ],
  4: [
    { title: 'Quantum tunnelling', meaning: 'Another weird quantum effect: a barrier need not be the end of the story!', icon: 'wall' },
    { title: 'Indistinguishable particles', meaning: 'Particles of the same species have the same intrinsic properties, even in different states.', icon: 'id' },
    { title: 'Pauli’s exclusion principle', meaning: 'Identical fermions cannot occupy the same complete quantum state.', icon: 'chair' },
    { title: 'Fermions', meaning: 'The particle family that follows the no-sharing rule, including electrons and quarks.', icon: 'electron' },
    { title: 'Elemental structures', meaning: 'Proton number identifies an element. Electron arrangements shape its chemistry.', icon: 'atom' },
    { title: 'Bosons', meaning: 'Particles that can share the same quantum state, including photons.', icon: 'photon' },
    { title: 'Bose-Einstein condensate', meaning: 'Under suitable conditions, many bosons share the lowest state and show quantum behaviour together.', icon: 'condensate' },
  ],
};

export function QuizRefresherNote() {
  return <Text style={styles.refresher}>If you want a refresher on the content, feel free to replay the lessons or have a look at your terminology dictionary!</Text>;
}

export function FloatingRecapParticle({ particle }: { particle: 'photon' | 'charm' }) {
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: -12, duration: 1500, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(float, { toValue: 0, duration: 1500, useNativeDriver: Platform.OS !== 'web' }),
    ]));
    loop.start();
    return () => { loop.stop(); float.stopAnimation(); };
  }, [float]);
  return <View style={styles.floatingFrame}><Animated.Image accessibilityLabel={`Floating ${particle === 'charm' ? 'Charm quark' : 'photon'}`} source={particle === 'charm' ? charm : photon} resizeMode="contain" style={[styles.floatingParticle, { transform: [{ translateY: float }] }]} /></View>;
}

function RecapIcon({ icon }: { icon: Icon }) {
  const sprites: Partial<Record<Icon, ImageSourcePropType>> = { basketball, shy: shyElectron, dice, cat, id: electronID, chair, electron, atom, photon };
  if (sprites[icon]) return <Image source={sprites[icon]} resizeMode="contain" style={styles.sprite} />;
  if (icon === 'socks') return <View style={styles.sprite}><Image source={socks} resizeMode="contain" style={styles.sprite} /><View style={[styles.cross, { transform: [{ rotate: '45deg' }] }]} /><View style={[styles.cross, { transform: [{ rotate: '-45deg' }] }]} /></View>;
  if (icon === 'up') return <Text style={styles.arrow}>↑</Text>;
  if (icon === 'phone') return <View style={styles.phone}><View style={styles.phoneScreen} /><View style={styles.phoneHome} /></View>;
  if (icon === 'wall') return <View style={styles.wall}>{Array.from({ length: 3 }, (_, row) => <View key={row} style={{ flexDirection: 'row', marginLeft: row % 2 ? -8 : 0 }}>{Array.from({ length: 4 }, (_, col) => <View key={col} style={styles.brick} />)}</View>)}</View>;
  if (icon === 'interference') return <View style={styles.pattern}>{[.22, .5, 1, .5, .22].map((opacity, i) => <View key={i} style={[styles.band, { opacity }]} />)}</View>;
  if (icon === 'entangled') return <View style={styles.sprite}><View style={styles.link} /><Image source={strange} resizeMode="contain" style={[styles.smallParticle, { left: 0, top: 3 }]} /><Image source={strange} resizeMode="contain" style={[styles.smallParticle, { right: 0, bottom: 3 }]} /></View>;
  return <View style={styles.sprite}>{[[4, 3], [23, 7], [12, 24], [28, 26], [0, 23]].map(([left, top], i) => <Image key={i} source={photon} resizeMode="contain" style={[styles.smallParticle, { left, top }]} />)}</View>;
}

export function WorldQuizRecap({ world }: { world: 1 | 3 | 4 }) {
  return <View style={styles.list}>{worldQuizRecaps[world].map(({ title, meaning, icon }, index) => <View key={title} style={styles.row}>
    <View accessible accessibilityLabel={`${title} recap icon`} style={[styles.iconFrame, { backgroundColor: index % 2 ? '#F8CDBE' : '#DCD4F7' }]}><RecapIcon icon={icon} /></View>
    <View style={styles.copy}><Text style={styles.name}>{title}</Text><Text style={styles.meaning}>{meaning}</Text></View>
  </View>)}</View>;
}

const styles = StyleSheet.create({
  list: { width: '100%', gap: 13, marginBottom: 28 }, row: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  iconFrame: { width: 62, height: 62, alignItems: 'center', justifyContent: 'center', borderRadius: 18, transform: [{ rotate: '-2deg' }] },
  sprite: { width: 58, height: 58 }, copy: { flex: 1, paddingBottom: 10, borderBottomWidth: 1.5, borderBottomColor: '#D8D0C3' },
  name: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 23 },
  meaning: { color: colors.ink, fontFamily: fonts.body, fontSize: 19, lineHeight: 24, marginTop: 2 },
  refresher: { color: colors.muted, fontFamily: fonts.body, fontSize: 17, lineHeight: 23, textAlign: 'center', marginTop: 12, marginBottom: 12, alignSelf: 'center', maxWidth: 460 },
  floatingFrame: { height: 160, alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 14 }, floatingParticle: { width: 150, height: 150 },
  cross: { position: 'absolute', left: 0, top: 27, width: 58, height: 4, borderRadius: 3, backgroundColor: '#BC3C40' },
  arrow: { fontFamily: fonts.display, fontSize: 54, lineHeight: 60, color: '#328249' },
  phone: { width: 30, height: 48, borderWidth: 3, borderColor: colors.ink, borderRadius: 7, padding: 3, alignItems: 'center', backgroundColor: '#F8F2E6' },
  phoneScreen: { width: 19, height: 29, backgroundColor: '#87C4E2', borderRadius: 2 }, phoneHome: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.ink, marginTop: 3 },
  wall: { width: 52, height: 40, overflow: 'hidden', borderWidth: 2, borderColor: '#765548', borderRadius: 3 }, brick: { width: 18, height: 12, backgroundColor: '#C58271', borderWidth: 1, borderColor: '#F4DECD' },
  pattern: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 4, backgroundColor: '#FFF9EE' }, band: { width: 5, height: 39, borderRadius: 3, backgroundColor: '#6252AA' },
  smallParticle: { position: 'absolute', width: 32, height: 32 }, link: { position: 'absolute', left: 10, top: 27, width: 39, height: 3, borderRadius: 3, backgroundColor: '#568E65', transform: [{ rotate: '32deg' }] },
});
