import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Birthday, chooseGreeting, GREETING_DURATION_MS } from '../data/greetings';
import { colors, fonts } from '../constants/theme';

export function AvatarGreeting({ enabled, birthday, width = 170 }: { enabled: boolean; birthday?: Birthday; width?: number }) {
  const greeted = useRef(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled || greeted.current) return;
    greeted.current = true;
    setMessage(chooseGreeting(new Date(), birthday));
  }, [enabled, birthday]);
  useEffect(() => {
    if (!message) return;
    let cancelled = false;
    const fadeIn = Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true });
    const fadeOut = Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true });
    fadeIn.start();
    const timer = setTimeout(() => fadeOut.start(({ finished }) => {
      if (finished && !cancelled) setMessage(null);
    }), GREETING_DURATION_MS - 500);
    return () => { cancelled = true; clearTimeout(timer); fadeIn.stop(); fadeOut.stop(); };
  }, [message, opacity]);
  // Home positions this independently so the particle stays centred during the fade.
  return <View pointerEvents="none" style={{ width, height: width * 0.83 }}>
    {enabled && message && <Animated.View style={[styles.bubble, { opacity }]}>
      <View accessible={false} style={styles.curvedDash} />
      <View style={styles.words}><Text accessibilityLiveRegion="polite" style={[styles.message, { fontSize: width < 120 ? 12 : 14, lineHeight: width < 120 ? 14 : 16 }]}>{message}</Text></View>
    </Animated.View>}
  </View>;
}

const styles = StyleSheet.create({
  bubble: { flex: 1 },
  curvedDash: { position: 'absolute', width: 26, height: 18, left: -8, bottom: 4, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: colors.ink, borderBottomLeftRadius: 22, transform: [{ rotate: '-38deg' }] },
  words: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, paddingBottom: 16 },
  message: { fontFamily: fonts.body, color: colors.ink, textAlign: 'center' },
});
