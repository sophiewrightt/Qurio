import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { Accessory, AccessoryId, accessoryCatalog } from '../data/customisation';
import { colors, fonts } from '../constants/theme';
import { PacketArtwork } from './ShopArtwork';
import { drawAccessories, duplicateRewards, rarityOf, rarityOrder, rarityStyles, type PacketKind } from '../data/shop';
import { accessoryPreviewStyle } from '../data/accessoryPreview';
import { TourAnchor } from './Onboarding';

const closedPack = require('../assets/rewards/q-pack-closed-transparent.png');
const tornPack = require('../assets/rewards/q-pack-torn-transparent.png');

export function pickRandomAccessories(count = 3, random = Math.random, excludeIds: AccessoryId[] = []): Accessory[] {
  return drawAccessories(accessoryCatalog, count, random);
}

// The legacy excludeIds prop now describes ownership ONLY for duplicate labels.
export function RewardPack({ onOpen, excludeIds = [], rewardIds, duplicateFlags, initiallyOpen = false, openingDisabled = false, packetKind = 'standard' }: { onOpen?: (ids: AccessoryId[]) => void; excludeIds?: AccessoryId[]; rewardIds?: AccessoryId[]; duplicateFlags?: boolean[]; initiallyOpen?: boolean; openingDisabled?: boolean; packetKind?: PacketKind }) {
  const [open, setOpen] = useState(initiallyOpen);
  const pop = useRef(new Animated.Value(0.8)).current;
  const rewardsRef = useRef<Accessory[] | null>(null);
  const openedRef = useRef(initiallyOpen);
  const duplicatesRef = useRef<boolean[] | null>(duplicateFlags ?? null);
  if (!rewardsRef.current) rewardsRef.current = rewardIds ? rewardIds.map(id => accessoryCatalog.find(item => item.id === id)!).filter(Boolean) : pickRandomAccessories(3, Math.random, excludeIds);
  const rewards = rewardsRef.current;
  if (initiallyOpen && !duplicatesRef.current) duplicatesRef.current = duplicateRewards(rewards.map(item => item.id), excludeIds);
  useEffect(() => {
    if (!open) return;
    const animation = Animated.spring(pop, { toValue: 1, friction: 5, tension: 75, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [open, pop]);
  const openReward = () => { if (openedRef.current || openingDisabled) return; duplicatesRef.current = duplicateRewards(rewards.map(item => item.id), excludeIds); openedRef.current = true; setOpen(true); onOpen?.(rewards.map(reward => reward.id)); };
  if (!open) return <View style={styles.closed}>
    {packetKind === 'standard' ? <Image source={closedPack} resizeMode="contain" style={styles.packet} accessibilityLabel="Closed Q accessory packet" /> : <PacketArtwork kind={packetKind} />}
    <Text style={styles.closedTitle}>A mystery accessory packet!</Text>
    <TourAnchor id="rip-packet"><PrimaryButton label="Tear open my reward!" onPress={openReward} disabled={openingDisabled} /></TourAnchor>
  </View>;
  return <Animated.View style={[styles.open, { transform: [{ scale: pop }] }]}>
    <Text style={styles.burst}>RIP!</Text>
    {packetKind === 'standard' ? <Image source={tornPack} resizeMode="contain" style={styles.tornPacket} accessibilityLabel="Torn-open Q accessory packet" /> : <PacketArtwork kind={packetKind} torn />}
    <Text style={styles.openTitle}>Here’s what you got!</Text>
    <View style={styles.rewards}>{rewards.map((reward, index) => ({ reward, index, rarity: rarityOf(reward.id) })).sort((a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)).map(({ reward, index, rarity }) => <View key={`${reward.id}-${index}`} style={[styles.reward, { backgroundColor: rarityStyles[rarity].background, borderColor: rarityStyles[rarity].color }]}>
      <View style={styles.rewardImage}><Image source={reward.source} resizeMode="contain" style={accessoryPreviewStyle(reward.id)} accessibilityLabel={reward.name} /></View>
      <View style={styles.rewardCopy}><View style={styles.metadata}><Text style={styles.category}>{reward.category === 'face' ? 'FACIAL' : reward.category.toUpperCase()}</Text><Text style={[styles.rarity, { backgroundColor: rarityStyles[rarity].color, color: rarityStyles[rarity].ink }]}>{rarityStyles[rarity].label}</Text></View><Text style={styles.name}>{reward.name}{duplicatesRef.current?.[index] ? <Text style={styles.duplicate}> (You already have this)</Text> : null}</Text></View>
    </View>)}</View>
  </Animated.View>;
}

const styles = StyleSheet.create({
  closed: { alignItems: 'center', marginVertical: 28, paddingVertical: 10 },
  packet: { width: 150, height: 174, transform: [{ rotate: '-3deg' }], marginBottom: 12 },
  closedTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 29, marginBottom: 8, textAlign: 'center' },
  body: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, lineHeight: 27, textAlign: 'center', marginVertical: 14 },
  open: { alignItems: 'center', marginVertical: 28 },
  burst: { color: colors.coral, fontFamily: fonts.display, fontSize: 28 },
  tornPacket: { width: 170, height: 185, marginTop: 2 },
  openTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 30, marginBottom: 18, textAlign: 'center' },
  rewards: { width: '100%', gap: 12 },
  reward: { minHeight: 118, flexDirection: 'row', alignItems: 'center', padding: 8, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.ink, borderRadius: 16, backgroundColor: colors.surface },
  rewardImage: { width: 112, height: 112, overflow: 'hidden' }, rewardCopy: { flex: 1, minWidth: 0 },
  metadata: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  rarity: { fontFamily: fonts.body, fontSize: 14, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  duplicate: { fontFamily: fonts.body, fontSize: 16, color: colors.ink },
  category: { color: colors.coral, fontFamily: fonts.display, fontSize: 12, letterSpacing: 1.1 },
  name: { color: colors.ink, fontFamily: fonts.body, fontSize: 22 },
  unlocked: { color: colors.green, fontFamily: fonts.display, fontSize: 28, paddingHorizontal: 8 },
});
