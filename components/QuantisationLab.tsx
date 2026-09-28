import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

const basketball = require('../assets/lesson-1/basketball.png');
const electron = require('../assets/particles/electron-avatar.png');
const ramp = require('../assets/module-2/ramp-transparent.png');
const stairs = require('../assets/module-2/stairs-transparent.png');

export function QuantisationLab({ onExplore }: { onExplore?: () => void }) {
  const [metres, setMetres] = useState(3.8);
  const [rolling, setRolling] = useState(false);
  const [step, setStep] = useState(1);
  useEffect(() => {
    if (!rolling) return;
    const timer = setInterval(() => setMetres(current => {
      const next = Math.max(0.2, current - 0.07);
      if (next <= 0.2) setRolling(false);
      return next;
    }), 38);
    return () => clearInterval(timer);
  }, [rolling]);
  const rampProgress = (3.8 - metres) / 3.6;
  const rollBall = () => { setMetres(3.8); setRolling(true); onExplore?.(); };
  const moveStep = () => { setStep(current => current === 4 ? 1 : current + 1); onExplore?.(); };
  const stepLeft = [22, 85, 150, 215][step - 1]!;
  const stepTop = [150, 100, 48, 0][step - 1]!;
  return <View>
    <Text style={[styles.flashTitle, styles.classicalTitle]}>Classical = continuous</Text>
    <Text style={styles.explanation}>We can represent the state of a basketball in the classical world as its position anywhere along a slope. It can be at 1 m, 1.1 m, 1.387897349 m, 1.9999 m, and so on.</Text>
    <View style={styles.card}>
      <View style={styles.rampStage} accessibilityLabel={`Basketball is ${metres.toFixed(2)} metres up the ramp`}>
        <Image source={ramp} resizeMode="contain" style={styles.rampArt} />
        <Image source={basketball} resizeMode="contain" style={[styles.ball, { left: 232 - rampProgress * 218, top: 18 + rampProgress * 99, transform: [{ rotate: `${-rampProgress * 520}deg` }] }]} />
        <View style={styles.measure}><Text style={styles.measureNumber}>{metres.toFixed(2)} m</Text></View>
      </View>
      <Pressable accessibilityRole="button" onPress={rollBall} disabled={rolling} style={[styles.action, rolling && styles.disabled]}><Text style={styles.actionText}>{rolling ? 'Rolling through all the values…' : 'Roll the basketball'}</Text></Pressable>
    </View>
    <Text style={styles.explanation}>There’s a <Text style={styles.italic}>continuous</Text> range of values the basketball can be at.</Text>
    <Text style={[styles.flashTitle, styles.quantumTitle]}>Quantum = ?</Text>
    <Text style={styles.explanation}>Now replace the basketball with an electron, which follows quantum rules. The ramp now becomes steps. But steps don’t have continuous values - no 1.2, no 1.9999, just 1, 2, 3, 4...</Text>
    <View style={[styles.card, styles.quantumCard]}>
      <View style={styles.stairStage} accessibilityLabel={`Electron is on allowed step ${step}`}>
        <Image source={stairs} resizeMode="contain" style={styles.stairsArt} />
        <Image source={electron} resizeMode="contain" style={[styles.electron, { left: stepLeft, top: stepTop }]} />
      </View>
      <View style={styles.levelReadout}><Text style={styles.levelValue}>STEP {step}</Text></View>
      <Pressable accessibilityRole="button" onPress={moveStep} style={styles.action}><Text style={styles.actionText}>{step === 4 ? 'Start again' : 'Move up one allowed step'}</Text></Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  card: { marginVertical: 20 },
  quantumCard: {}, explanation: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 29, marginBottom: 10 }, italic: { fontStyle: 'italic' },
  flashTitle: { alignSelf: 'center', color: colors.ink, fontFamily: fonts.display, fontSize: 33, lineHeight: 41, textAlign: 'center', textDecorationLine: 'underline', textDecorationStyle: 'dashed', marginTop: 7, marginBottom: 18 },
  classicalTitle: { textDecorationColor: colors.coral, transform: [{ rotate: '-1deg' }] },
  quantumTitle: { textDecorationColor: colors.primary, transform: [{ rotate: '1deg' }], marginTop: 26 },
  rampStage: { height: 190, overflow: 'hidden', marginTop: 10 }, rampArt: { position: 'absolute', width: 300, height: 190, left: 0, top: 0 }, ball: { position: 'absolute', width: 54, height: 54 },
  measure: { position: 'absolute', right: 7, bottom: 4, alignItems: 'flex-end' }, measureNumber: { color: colors.primary, fontFamily: fonts.display, fontSize: 26 },
  action: { minHeight: 49, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.yellow, borderWidth: 2, borderColor: colors.ink, borderRadius: 14 }, actionText: { color: colors.ink, fontFamily: fonts.display, fontSize: 18 }, disabled: { opacity: 0.55 },
  stairStage: { width: 330, height: 230, alignSelf: 'center', marginTop: 3, overflow: 'hidden' }, stairsArt: { position: 'absolute', width: 520, height: 363, left: -95, top: -70 }, electron: { position: 'absolute', width: 58, height: 58, zIndex: 3 },
  levelReadout: { alignItems: 'center', marginVertical: 8 }, levelValue: { color: colors.primary, fontFamily: fonts.display, fontSize: 24 },
});
