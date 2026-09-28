import { Image, type ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../constants/theme';
import { boutique as b } from '../constants/boutique';
import type { PacketKind } from '../data/shop';

export const packetArtwork = {
  standard: [require('../assets/rewards/q-pack-closed-transparent.png'), require('../assets/rewards/q-pack-torn-transparent.png')],
  rare: [require('../assets/shop/Q_pack_rare.jpg'), require('../assets/shop/Q_pack_rare_teared.jpg')],
  'ultra-rare': [require('../assets/shop/Q_pack_ultra_rare.jpg'), require('../assets/shop/Q_pack_ultra_rare_teared.jpg')],
  legendary: [require('../assets/shop/Q_pack_legendary.jpg'), require('../assets/shop/Q_pack_legendary_teared.jpg')],
};

export function PacketArtwork({ kind = 'standard', torn = false, size = 150, paper = b.cream }: { kind?: PacketKind; torn?: boolean; size?: number; paper?: string }) {
  if (kind === 'standard') return <Image source={packetArtwork[kind][torn ? 1 : 0]} resizeMode="contain" style={{ width: size, height: size * 1.35 }} accessibilityLabel={`${torn ? 'Torn' : 'Sealed'} Q accessory packet`} />;
  // Frame the unchanged scans and blend the scanned white paper into the host surface.
  // The paper colour is explicit because native/web image wrappers isolate blending.
  const frame = !torn ? { left: 0.375, top: 0.23, width: 0.315, height: 0.455 }
    : kind === 'rare' ? { left: 0.205, top: 0.155, width: 0.455, height: 0.53 }
    : { left: 0.155, top: 0.155, width: 0.465, height: 0.545 };
  const canvas = size / frame.width;
  return <View style={{ width: size, height: canvas * frame.height, overflow: 'hidden', backgroundColor: paper }}>
    <Image source={packetArtwork[kind][torn ? 1 : 0]} accessibilityLabel={`${torn ? 'Torn' : 'Sealed'} ${kind} packet`} style={[styles.scan, { width: canvas, height: canvas, left: -canvas * frame.left, top: -canvas * frame.top }]} />
  </View>;
}

export function ShopIcon() {
  return <View accessible={false} style={styles.bag}><View style={styles.handle} /><Text style={styles.q}>Q</Text></View>;
}

// Display tight subject windows from the unchanged supplied scans.
function ScanArtwork({ source, frame, width, height, paper }: { source: ImageSourcePropType; frame: [number, number, number, number]; width: number; height: number; paper: string }) {
  const [left, top, subjectWidth, subjectHeight] = frame;
  const canvas = Math.min(width / subjectWidth, height / subjectHeight);
  const cropWidth = canvas * subjectWidth, cropHeight = canvas * subjectHeight;
  return <View accessible={false} pointerEvents="none" style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: cropWidth, height: cropHeight, overflow: 'hidden', backgroundColor: paper }}>
      <Image source={source} resizeMode="contain" style={[styles.scan, { width: canvas, height: canvas, left: -canvas * left, top: -canvas * top }]} />
    </View>
  </View>;
}

const quantaScans: Record<number, { source: ImageSourcePropType; frame: [number, number, number, number] }> = {
  100: { source: require('../assets/shop/pile_of_quanta_.jpg'), frame: [0.352, 0.475, 0.133, 0.119] },
  300: { source: require('../assets/shop/bucket_of_quanta.jpg'), frame: [0.307, 0.342, 0.214, 0.234] },
  500: { source: require('../assets/shop/chest_of_quanta.jpg'), frame: [0.329, 0.408, 0.21, 0.179] },
  1000: { source: require('../assets/shop/vault_of_quanta.jpg'), frame: [0.256, 0.324, 0.23, 0.198] },
};

export function QuantaArtwork({ amount }: { amount: number }) {
  const art = quantaScans[amount] ?? quantaScans[100]!;
  return <ScanArtwork {...art} width={112} height={116} paper="#FFF9EF" />;
}

export function AchievementEntryArtwork() {
  return <ScanArtwork source={require('../assets/ui/default_achievement_badge.jpg')} frame={[0.387, 0.331, 0.201, 0.199]} width={76} height={76} paper="#F8F3E8" />;
}

const styles = StyleSheet.create({
  scan: { position: 'absolute', mixBlendMode: 'multiply' },
  bag: { width: 23, height: 25, borderWidth: 1.5, borderColor: b.gold, borderRadius: 3, alignItems: 'center', justifyContent: 'center', marginTop: 5 },
  handle: { position: 'absolute', top: -7, width: 11, height: 10, borderWidth: 1.5, borderColor: b.gold, borderRadius: 7 },
  q: { color: b.plum, fontFamily: fonts.display, fontSize: 16 },
});
