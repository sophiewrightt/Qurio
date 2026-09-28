import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../constants/theme';
import { shuffledLoadingMessages } from '../data/loading';

export function LoadingScreen({ fontsReady = true }: { fontsReady?: boolean }) {
  const [messages, setMessages] = useState(() => shuffledLoadingMessages());
  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const spin = Animated.loop(Animated.timing(rotation, {
      toValue: 1, duration: 1800, easing: Easing.linear, useNativeDriver: true,
    }));
    spin.start();
    const timer = setInterval(() => setMessages(current => current.length > 1
      ? current.slice(1) : shuffledLoadingMessages(current[0])), 3000);
    return () => { clearInterval(timer); spin.stop(); rotation.setValue(0); };
  }, [rotation]);
  return <View accessibilityLabel="Loading Qurio artwork" style={s.cover}>
    <Image accessibilityLabel="Qurio" source={require('../assets/brand/qurio-logo-transparent.png')} resizeMode="contain" style={s.logo} />
    <Animated.View accessible={false} style={[s.spinner, { transform: [{ rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }]}>
      {/* Frame the subject in the unchanged scan, centred on its rotation axis. */}
      <Image source={require('../assets/ui/loading_symbol.jpg')} style={s.scan} />
    </Animated.View>
    <Text accessibilityLiveRegion="polite" style={[s.message, fontsReady && { fontFamily: fonts.body }]}>{messages[0]}</Text>
  </View>;
}

const s = StyleSheet.create({
  cover: { position: 'absolute', inset: 0, zIndex: 1100, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F3E8', paddingHorizontal: 24 },
  logo: { width: 224, height: 88, marginBottom: 24 },
  spinner: { width: 88, height: 88, overflow: 'hidden', backgroundColor: '#F8F3E8' },
  scan: { position: 'absolute', width: 560, height: 560, left: -228, top: -164, mixBlendMode: 'multiply' },
  message: { color: '#68746F', fontSize: 21, lineHeight: 28, marginTop: 24, minHeight: 84, maxWidth: 360, textAlign: 'center' },
});
