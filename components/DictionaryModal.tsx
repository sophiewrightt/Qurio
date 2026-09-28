import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../constants/theme';
import { type DictionaryEntry } from '../data/dictionary';
import { TourAnchor, TourOverlay } from './Onboarding';

export function DictionaryIcon({ paper = false }: { paper?: boolean }) {
  // Frame the subject in the supplied scan without altering the original art.
  return <View pointerEvents="none" accessible={false} style={[styles.iconFrame, { backgroundColor: paper ? '#F0DEAE' : '#F8F3E8' }]}>
    <Image source={require('../assets/ui/dictionary-source.jpg')} resizeMode="contain" style={styles.iconScan} />
  </View>;
}

function RuledText({ children, heading = false }: { children: string; heading?: boolean }) {
  const [height, setHeight] = useState(0);
  const lineHeight = heading ? 32 : 30;
  return <View onLayout={event => setHeight(event.nativeEvent.layout.height)}>
    <View pointerEvents="none" accessible={false} style={StyleSheet.absoluteFill}>
      {Array.from({ length: Math.round(height / lineHeight) }, (_, index) => <View key={index} style={[styles.writingLine, { top: (index + 1) * lineHeight - 1 }]} />)}
    </View>
    <Text accessibilityRole={heading ? 'header' : undefined} style={heading ? styles.term : styles.definition}>{children}</Text>
  </View>;
}

function RuledEntry({ entry }: { entry: DictionaryEntry }) {
  return <View style={styles.entry}>
    <RuledText heading>{entry.term}</RuledText>
    <View style={{ height: 8 }} />
    <RuledText>{entry.definition}</RuledText>
  </View>;
}

export function DictionaryModal({ entries, onClose }: { entries: DictionaryEntry[]; onClose: () => void }) {
  const sorted = [...entries].sort((a, b) => a.term.localeCompare(b.term, 'en'));
  return <Modal transparent visible animationType="fade" onRequestClose={onClose}>
    <View style={styles.backdrop}>
      <View accessibilityViewIsModal accessibilityLabel="Your dictionary" style={styles.cover}>
        <View pointerEvents="none" style={styles.coverTooling} />
        <View style={styles.paper}>
          <View pointerEvents="none" style={styles.spine} />
          <View pointerEvents="none" style={styles.wornTop} />
          <View pointerEvents="none" style={styles.wornBottom} />
          <View style={styles.headingRow}>
            <Text accessibilityRole="header" style={styles.heading}>Dictionary</Text>
            <TourAnchor id="dictionary-close"><Pressable accessibilityRole="button" accessibilityLabel="Close dictionary" onPress={onClose} style={({ pressed }) => [styles.close, pressed && { opacity: 0.6 }]}><Text style={styles.closeText}>×</Text></Pressable></TourAnchor>
          </View>
          <View style={styles.flourish}><View style={styles.rule} /><Text style={styles.diamond}>✧</Text><View style={styles.rule} /></View>
          <ScrollView style={styles.pages} contentContainerStyle={styles.pageContent} showsVerticalScrollIndicator>
            {sorted.length ? sorted.map(entry => <RuledEntry key={entry.id} entry={entry} />) : <View style={styles.empty}>
              <Text style={styles.emptyCopy}>You haven’t unlocked any words yet!</Text>
            </View>}
          </ScrollView>
          {entries.length > 0 && <Text style={styles.footer}>{entries.length} {entries.length === 1 ? 'discovery' : 'discoveries'} · This session</Text>}
        </View>
      </View>
      <TourOverlay host="dictionary" />
    </View>
  </Modal>;
}

const styles = StyleSheet.create({
  iconFrame: { width: 64.5, height: 87, overflow: 'hidden' },
  iconScan: { position: 'absolute', width: 600, height: 600, left: -186, top: -202.5, mixBlendMode: 'multiply' },
  backdrop: { flex: 1, paddingHorizontal: 14, paddingVertical: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#24170FAD' },
  cover: { width: '100%', maxWidth: 580, height: '88%', maxHeight: 820, minHeight: 260, padding: 10, paddingLeft: 17, borderRadius: 15, borderWidth: 3, borderColor: '#402317', backgroundColor: '#794529', shadowColor: '#180B03', shadowOffset: { width: 4, height: 9 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 12 },
  coverTooling: { position: 'absolute', inset: 4, borderWidth: 1, borderColor: '#CAA15D', borderRadius: 9 },
  paper: { flex: 1, backgroundColor: '#F0DEAE', borderWidth: 2, borderColor: '#C4A36C', borderRadius: 4, paddingHorizontal: 19, paddingTop: 14, overflow: 'hidden' },
  spine: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 8, backgroundColor: '#B58B4A38', borderRightWidth: 1, borderRightColor: '#A37B4440' },
  wornTop: { position: 'absolute', right: -60, top: -74, width: 220, height: 120, borderRadius: 100, borderWidth: 18, borderColor: '#AD763314', backgroundColor: '#AD76331A', transform: [{ rotate: '-15deg' }] },
  wornBottom: { position: 'absolute', left: -70, bottom: -60, width: 240, height: 150, borderRadius: 110, borderWidth: 14, borderColor: '#9B672310', backgroundColor: '#9B672319' },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heading: { flex: 1, fontFamily: fonts.display, fontSize: 42, color: '#50331D' },
  close: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#937045', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7EAC9' },
  closeText: { fontFamily: fonts.body, color: '#593B23', fontSize: 32, lineHeight: 36 },
  flourish: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 12 },
  rule: { flex: 1, height: 1, backgroundColor: '#B69252' }, diamond: { fontSize: 24, color: '#9B7137' },
  pages: { flex: 1 }, pageContent: { paddingBottom: 24 },
  entry: { paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#B6996259' },
  writingLine: { position: 'absolute', left: 0, right: 0, borderBottomWidth: 1, borderBottomColor: '#A78B5140' },
  term: { fontFamily: fonts.display, color: '#523019', fontSize: 25, lineHeight: 32 },
  definition: { fontFamily: fonts.body, color: '#4D3A27', fontSize: 21, lineHeight: 30 },
  empty: { paddingVertical: 20, alignItems: 'center' }, emptyCopy: { fontFamily: fonts.body, fontSize: 21, lineHeight: 29, color: '#614B32', textAlign: 'center', marginTop: 12 },
  footer: { fontFamily: fonts.body, fontSize: 15, color: '#735536', textAlign: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#B6925266' },
});
