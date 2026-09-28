import { colors } from '../constants/theme';
import { FramedSprite, Sprite } from './FramedSprite';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, ImageSourcePropType, Platform, StyleSheet, View } from 'react-native';

const confettiPieces = Array.from({ length: 24 }, (_, index) => ({
  left: 4 + (index * 37) % 91,
  delay: (index * 0.137) % 1,
  color: ['#E64D47', '#F4B52E', '#3C9B71', '#5B78D1', '#B05BC4'][index % 5]!,
  rotate: index * 29,
}));

export function WorldCelebration({ source, accessibilityLabel, shadowSource, sourceFrame }: {
  source: ImageSourcePropType;
  accessibilityLabel: string;
  shadowSource?: ImageSourcePropType;
  sourceFrame?: Sprite['frame'];
}) {
  const phase = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.timing(phase, { toValue: 1, duration: 2600, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web' }));
    animation.start();
    return () => animation.stop();
  }, [phase]);
  return <View style={styles.celebration} accessibilityLabel={accessibilityLabel}>
    {confettiPieces.map((piece, index) => <Animated.View key={index} style={[styles.confetti, { left: `${piece.left}%`, backgroundColor: piece.color, opacity: 0.9, transform: [{ translateY: phase.interpolate({ inputRange: [0, 1], outputRange: [-150 + piece.delay * 120, 330 + piece.delay * 120] }) }, { rotate: `${piece.rotate}deg` }] }]} />)}
    {shadowSource && <Image source={shadowSource} resizeMode="contain" style={styles.shadow} />}
    <Animated.View style={[styles.character, { transform: [{ translateY: phase.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [7, -28, 7, -28, 7] }) }, { rotate: phase.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: ['-4deg', '4deg', '-4deg', '4deg', '-4deg'] }) }] }]} >
      {sourceFrame ? <FramedSprite sprite={{ source, frame: sourceFrame }} width={220} height={225} paper={colors.background} /> : <Image source={source} resizeMode="contain" style={styles.character} />}
    </Animated.View>
  </View>;
}

const styles = StyleSheet.create({
  celebration: { width: '100%', height: 300, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' },
  character: { width: 220, height: 225, zIndex: 2 },
  shadow: { position: 'absolute', width: 145, height: 52, bottom: 3, opacity: 0.58 },
  confetti: { position: 'absolute', top: 0, width: 9, height: 18, borderRadius: 2 },
});
