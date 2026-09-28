import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

const cloud = require('../assets/module-2/lesson-4/possibility-cloud-transparent.png');
const questionCloud = require('../assets/module-2/lesson-4/possibility-cloud-question-transparent.png');
const outcomeA = require('../assets/module-2/lesson-6/outcome-a-transparent.png');
const outcomeB = require('../assets/module-2/lesson-6/outcome-b-transparent.png');

export function PossibilityCloud({ leftStrength = 0.78, rightStrength = 0.28, leftLabel, rightLabel, question = false, outcomeLetters = false }: {
  leftStrength?: number;
  rightStrength?: number;
  leftLabel?: string;
  rightLabel?: string;
  question?: boolean;
  outcomeLetters?: boolean;
}) {
  const hasLabels = !!leftLabel && !!rightLabel;
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1300, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 1300, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return <View accessibilityLabel={question ? 'A possibility cloud with a question mark' : hasLabels ? `${leftLabel} on the left and ${rightLabel} on the right` : 'A glowing possibility cloud'} style={styles.stage}>
    {!question && <Animated.View pointerEvents="none" style={[styles.glowShell, {
      opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] }),
      transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.04] }) }],
    }]}>
      <View style={[styles.glow, styles.leftGlow, { opacity: 0.12 + leftStrength * 0.62, transform: [{ scale: 0.72 + leftStrength * 0.38 }] }]} />
      <View style={[styles.glow, styles.rightGlow, { opacity: 0.12 + rightStrength * 0.62, transform: [{ scale: 0.72 + rightStrength * 0.38 }] }]} />
    </Animated.View>}
    <Image source={question ? questionCloud : cloud} resizeMode="contain" style={styles.cloud} />
    {!question && (hasLabels || outcomeLetters) && <View pointerEvents="none" style={styles.labels}>
      {[leftLabel, rightLabel].map((label, index) => <Animated.View key={index} style={[styles.labelColumn, { transform: [{ translateY: pulse.interpolate({ inputRange: [0, 1], outputRange: index ? [4, -4] : [-4, 4] }) }] }]}>
        {outcomeLetters && <Image accessibilityLabel={index ? 'B' : 'A'} source={index ? outcomeB : outcomeA} resizeMode="contain" style={styles.letter} />}
        {!!label && <Text style={styles.label}>{outcomeLetters ? label.replace(/^[AB]\n?/, '') : label}</Text>}
      </Animated.View>)}
    </View>}
  </View>;
}

const styles = StyleSheet.create({
  stage: { width: '100%', maxWidth: 292, height: 258, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  glowShell: { position: 'absolute', width: '100%', height: 230, top: 17 },
  glow: { position: 'absolute', top: 56, width: 112, height: 112, borderRadius: 56, backgroundColor: '#8E6DE6', shadowColor: '#8E6DE6', shadowOpacity: 0.8, shadowRadius: 25, shadowOffset: { width: 0, height: 0 }, elevation: 6 },
  leftGlow: { left: '12%' }, rightGlow: { right: '12%' },
  cloud: { position: 'absolute', width: '100%', height: 258, top: 0 },
  labels: { position: 'absolute', left: '12%', right: '12%', top: 93, flexDirection: 'row' },
  labelColumn: { width: '50%', alignItems: 'center' },
  letter: { width: 44, height: 47 },
  label: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 25, lineHeight: 29, textAlign: 'center' },
});
