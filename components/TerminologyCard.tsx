import { useContext, useEffect, useRef } from 'react';
import { AppState, Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { DictionaryContext } from './DictionaryContext';
import { watchDictionaryCopy } from '../data/dictionary';

const terminologyHeading = require('../assets/ui/new-terminology-transparent.png');
const terminologySparkles = require('../assets/ui/terminology-sparkles-transparent.png');

export function TerminologyCard({ term, definition }: { term: string; definition: string }) {
  const discovery = useContext(DictionaryContext);
  const copy = useRef<View>(null);
  const enabled = discovery?.enabled;
  const onDiscover = discovery?.onDiscover;
  useEffect(() => {
    if (!enabled || !onDiscover) return;
    return watchDictionaryCopy({
      measure: callback => {
        if (copy.current) copy.current.measureInWindow((x, y, width, height) => callback({ x, y, width, height }));
        else callback({ x: 0, y: 0, width: 0, height: 0 });
      },
      viewport: () => Dimensions.get('window'),
      isActive: () => AppState.currentState === 'active' && (Platform.OS !== 'web' || typeof document === 'undefined' || !document.hidden),
      onSeen: () => onDiscover(term, definition),
      schedule: check => { const timer = setInterval(check, 350); return () => clearInterval(timer); },
    });
  }, [term, definition, enabled, onDiscover]);
  return <View style={styles.card}>
    <Image accessible={false} source={terminologySparkles} resizeMode="contain" style={styles.sparkles} />
    <Image accessibilityLabel="New terminology unlocked!" source={terminologyHeading} resizeMode="contain" style={styles.heading} />
    <View ref={copy} collapsable={false} style={styles.copy}><Text style={styles.term}>{term}</Text><Text style={styles.definition}>{definition}</Text></View>
  </View>;
}
const styles = StyleSheet.create({
  card: { minHeight: 300, backgroundColor: '#FFF8DA', borderColor: '#D4A335', borderWidth: 2, borderStyle: 'dashed', borderRadius: 22, paddingHorizontal: 20, paddingTop: 15, paddingBottom: 24, marginTop: 28, alignItems: 'center', overflow: 'hidden' },
  sparkles: { position: 'absolute', left: 4, right: 4, top: 84, width: '98%', height: 178, opacity: 0.88 },
  heading: { width: '88%', height: 112 },
  copy: { width: '78%', flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  term: { color: colors.ink, fontFamily: fonts.display, fontSize: 32, lineHeight: 38, textAlign: 'center', marginTop: 4, marginBottom: 15 },
  definition: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 29, textAlign: 'center' },
});
