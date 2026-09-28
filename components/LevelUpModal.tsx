import { useEffect, useRef } from 'react';
import { Animated, Modal, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { PrimaryButton } from './PrimaryButton';
import { QUANTA_PER_LEVEL } from '../data/knowledge';

export function LevelUpModal({ level, onClose }: { level?: number; onClose: () => void }) {
  const shine = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!level) return;
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(shine, { toValue: 1, duration: 1100, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(shine, { toValue: 0, duration: 1100, useNativeDriver: Platform.OS !== 'web' }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [level, shine]);
  return <Modal visible={Boolean(level)} transparent animationType="fade" onRequestClose={onClose}>
    <View style={s.backdrop}><View accessibilityViewIsModal style={s.paper}>
      <Text accessibilityRole="header" style={s.title}>Level up!</Text>
      <View accessibilityLabel={`Level ${level}`} style={s.orbScene}>
        <Animated.View style={[s.halo, { opacity: shine.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.55] }), transform: [{ scale: shine.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }] }]} />
        <View style={s.orb}><View style={s.innerGlow} /><View style={s.highlight} /><Text style={s.orbLabel}>LEVEL</Text><Text style={s.number}>{level}</Text></View>
        <Text style={[s.sparkle, { top: 16, right: 4 }]}>✦</Text><Text style={[s.sparkle, { bottom: 14, left: 4, fontSize: 27 }]}>✧</Text>
      </View>
      <Text style={s.reward}>+{QUANTA_PER_LEVEL} Quanta</Text>
      <Text style={s.body}>Your curiosity is paying off!</Text>
      <PrimaryButton label="Keep exploring" onPress={onClose} />
    </View></View>
  </Modal>;
}
const s = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 22, backgroundColor: 'rgba(35,28,47,0.48)' },
  paper: { width: '100%', maxWidth: 370, padding: 26, borderRadius: 28, borderWidth: 3, borderColor: '#A7802C', backgroundColor: '#FFF7DF', alignItems: 'center', gap: 12 },
  title: { fontFamily: fonts.display, fontSize: 44, color: colors.ink },
  orbScene: { width: 225, height: 215, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 195, height: 195, borderRadius: 100, backgroundColor: '#FFD65B' },
  orb: { width: 170, height: 170, borderRadius: 85, backgroundColor: '#F5BE43', borderWidth: 4, borderColor: '#CC8C20', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0px 5px 18px rgba(222,154,30,0.35)' },
  innerGlow: { position: 'absolute', width: 145, height: 145, top: 2, left: 2, borderRadius: 75, backgroundColor: '#FFE794' },
  highlight: { position: 'absolute', top: 20, left: 27, width: 52, height: 20, borderRadius: 16, backgroundColor: '#FFF9D9', transform: [{ rotate: '-35deg' }] },
  orbLabel: { marginTop: 16, fontFamily: fonts.display, fontSize: 18, color: '#795015' },
  number: { fontFamily: fonts.display, fontSize: 68, lineHeight: 78, color: '#614117' },
  sparkle: { position: 'absolute', color: '#B98515', fontSize: 40 },
  reward: { fontFamily: fonts.display, fontSize: 32, color: '#7053B5' },
  body: { fontFamily: fonts.body, fontSize: 22, color: colors.ink, textAlign: 'center', marginBottom: 8 },
});
