import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { EnergyLevelsDiagram } from './AtomEnergyInspect';
import { colors, fonts, shadow } from '../constants/theme';

const spaElectron = require('../assets/module-2/spa-mask-transparent.png');
const excitedElectron = require('../assets/module-2/excited-features-transparent.png');

function ElectronMood({ excited, size = 112 }: { excited: boolean; size?: number }) {
  const shake = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!excited) { shake.setValue(0); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(shake, { toValue: -3, duration: 80, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 3, duration: 80, useNativeDriver: true }),
    ]));
    loop.start(); return () => loop.stop();
  }, [excited, shake]);
  return <Animated.View style={{ width: size, height: size, transform: [{ translateX: shake }] }}>
    <Image source={excited ? excitedElectron : spaElectron} resizeMode="contain" style={{ width: size, height: size }} />
  </Animated.View>;
}

export function EnergyAtomLab({ onEnergise }: { onEnergise?: () => void }) {
  const [level, setLevel] = useState(1);
  const energise = () => { setLevel(current => current === 3 ? 1 : current + 1); onEnergise?.(); };
  return <View>
    <View style={styles.states}>
      <View style={[styles.stateCard, styles.groundCard]}><ElectronMood excited={false} /><Text style={styles.stateTitle}>Ground state</Text><Text style={styles.stateBody}>The lowest allowed energy. Relaxed and grounded.</Text></View>
      <View style={[styles.stateCard, styles.excitedCard]}><ElectronMood excited /><Text style={styles.stateTitle}>Excited state</Text><Text style={styles.stateBody}>A higher allowed energy after gaining energy.</Text></View>
    </View>
    <View style={styles.lab}>
      <Text style={styles.labLabel}>ENERGISE THE ATOM</Text><Text style={styles.labTitle}>Electron is at Level {level}</Text>
      <View style={styles.diagramWrap}><EnergyLevelsDiagram position={level} /></View>
      <View style={styles.status}><ElectronMood excited={level > 1} size={88} /><View style={{ flex: 1 }}><Text style={styles.statusTitle}>{level === 1 ? 'Calm ground state' : `Excited at Level ${level}!`}</Text><Text style={styles.statusBody}>{level === 1 ? 'Add one packet of energy.' : 'It moved to another allowed level-not somewhere between.'}</Text></View></View>
      <Pressable accessibilityRole="button" accessibilityLabel={level === 3 ? 'Reset electron to ground state' : 'Give electron one packet of energy'} onPress={energise} style={styles.energyButton}><View style={styles.bolt}><Text style={styles.boltText}>+</Text></View><Text style={styles.energyText}>{level === 3 ? 'Let the electron relax' : 'ADD ONE PACKET OF ENERGY'}</Text></Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  states: { flexDirection: 'row', gap: 10, marginVertical: 18 }, stateCard: { flex: 1, minHeight: 260, alignItems: 'center', padding: 10, borderWidth: 2, borderColor: colors.ink, borderRadius: 20 }, groundCard: { backgroundColor: '#DDF3E9', transform: [{ rotate: '-0.7deg' }] }, excitedCard: { backgroundColor: '#FFF0A6', transform: [{ rotate: '0.8deg' }] }, stateTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 22, textAlign: 'center' }, stateBody: { color: colors.ink, fontFamily: fonts.body, fontSize: 17, lineHeight: 22, textAlign: 'center', marginTop: 5 },
  lab: { marginTop: 18, padding: 16, backgroundColor: '#EEE9FF', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.primary, borderRadius: 23, ...shadow }, labLabel: { color: colors.coral, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.3 }, labTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 28, marginTop: 4 }, diagramWrap: { backgroundColor: colors.surface, borderRadius: 17, marginTop: 12, paddingHorizontal: 5 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 7, marginVertical: 11 }, statusTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 21 }, statusBody: { color: colors.ink, fontFamily: fonts.body, fontSize: 17, lineHeight: 22 },
  energyButton: { minHeight: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, backgroundColor: colors.yellow, borderWidth: 2, borderColor: colors.ink, borderRadius: 16, transform: [{ rotate: '-0.4deg' }] }, bolt: { width: 33, height: 33, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral, borderWidth: 2, borderColor: colors.ink }, boltText: { color: colors.white, fontFamily: fonts.display, fontSize: 25, lineHeight: 28 }, energyText: { color: colors.ink, fontFamily: fonts.display, fontSize: 16 },
});
