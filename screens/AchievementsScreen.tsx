import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AchievementBadge } from '../components/AchievementBadge';
import { AchievementToast } from '../components/AchievementToast';
import { RewardPack } from '../components/RewardPack';
import { achievementGroups, achievements, pendingBonusPackets, type AchievementProgress } from '../data/achievements';
import { type AccessoryId } from '../data/customisation';
import { colors, fonts } from '../constants/theme';
import { TourAnchor, TourScrollView, useTour } from '../components/Onboarding';
import { tourStep } from '../data/onboarding';

const quantaIcon = require('../assets/ui/quanta-icon-transparent.png');
type Flight = { x: number; y: number; tx: number; ty: number };
function QuantaFlight({ flight, onFinish }: { flight: Flight; onFinish: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.timing(progress, { toValue: 1, duration: 950, useNativeDriver: Platform.OS !== 'web' });
    animation.start(({ finished }) => { if (finished) onFinish(); });
    return () => animation.stop();
  }, [progress, onFinish]);
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {Array.from({ length: 7 }, (_, i) => <Animated.Image key={i} source={quantaIcon} style={{ position: 'absolute', width: 28, height: 28, left: flight.x - 14, top: flight.y - 14,
      opacity: progress.interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
      transform: [
        { translateX: progress.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, (i - 3) * 15, flight.tx - flight.x] }) },
        { translateY: progress.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, -35 - (i % 3) * 14, flight.ty - flight.y] }) },
        { scale: progress.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.6, 1, 0.65] }) },
      ] }} />)}
  </View>;
}

export function AchievementsScreen({ progress, quanta, owned, onBack, onClaim, onOpenPacket, onDismissNotice }: {
  progress: AchievementProgress; quanta: number; owned: AccessoryId[]; onBack: () => void;
  onClaim: (id: string) => boolean; onOpenPacket: (id: string, accessories: AccessoryId[]) => void;
  onDismissNotice: (id: string) => void;
}) {
  const tour = useTour();
  const root = useRef<View>(null);
  const counter = useRef<View>(null);
  const alive = useRef(true);
  const [flight, setFlight] = useState<Flight>();
  const finishFlight = useCallback(() => setFlight(undefined), []);
  const [packet, setPacket] = useState<string>();
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const pending = pendingBonusPackets(progress);
  const claim = (id: string, x: number, y: number) => {
    if (!onClaim(id)) return;
    const reward = achievements.find(a => a.id === id)?.reward;
    if (reward === 'packet') { setPacket(id); return; }
    if (typeof reward !== 'number') return;
    root.current?.measureInWindow((rx, ry) => counter.current?.measureInWindow((cx, cy, cw, ch) => {
      if (alive.current) setFlight({ x: x - rx, y: y - ry, tx: cx + cw / 2 - rx, ty: cy + ch / 2 - ry });
    }));
  };
  return <SafeAreaView style={styles.safe}><View ref={root} collapsable={false} style={styles.root}>
    <View style={styles.header}>
      <TourAnchor id="achievements-home"><Pressable accessibilityRole="button" onPress={onBack} style={styles.back}><Text style={styles.backText}>‹ Home</Text></Pressable></TourAnchor>
      <View ref={counter} collapsable={false} style={styles.counter}><Image source={quantaIcon} style={styles.coin} /><Text accessibilityLiveRegion="polite" style={styles.balance}>{quanta} Quanta</Text></View>
    </View>
    <TourScrollView contentContainerStyle={styles.content}>
      <Text accessibilityRole="header" style={styles.title}>Achievements</Text>
      <Text style={styles.intro}>Earn more achievements to progress your knowledge, and earn quanta!</Text>
      <Text style={styles.summary}>{progress.earned.length} of {achievements.length} earned</Text>
      {pending.length > 0 && <Pressable accessibilityRole="button" onPress={() => setPacket(pending[0])} style={styles.packetButton}><Text style={styles.backText}>Open a bonus packet ({pending.length} waiting)</Text></Pressable>}
      {achievementGroups.map(group => <View key={group} style={styles.section}>
        <Text accessibilityRole="header" style={styles.group}>{group}</Text>
        {group === 'Streak' && <Text style={styles.note}>Login streaks will begin when accounts are available.</Text>}
        <View style={styles.grid}>{achievements.filter(a => a.group === group).map(a => {
          const earned = progress.earned.includes(a.id), claimed = progress.claimed.includes(a.id);
          const hidden = group.startsWith('Chapter') && !earned;
          const canClaim = earned && !claimed && a.reward !== null;
          const status = claimed ? 'Claimed' : earned ? a.reward === null ? 'Reward coming soon' : 'Tap badge to claim' : 'Locked';
          const reward = a.reward === 'packet' ? '1 bonus packet' : a.reward === null ? '' : `+${a.reward} Quanta`;
          return <View key={a.id} style={styles.item}>
            {hidden ? <View accessibilityLabel="Mystery achievement, locked" style={styles.mystery}><Text style={styles.question}>?</Text></View> : <Pressable
              accessibilityRole="button" accessibilityLabel={`${a.name}. ${status}${!claimed && reward ? `. ${reward}` : ''}`} accessibilityState={{ disabled: !canClaim }}
              disabled={!canClaim} onPress={event => claim(a.id, event.nativeEvent.pageX, event.nativeEvent.pageY)}
              style={({ pressed }) => [styles.badgeButton, { transform: [{ scale: pressed ? 0.91 : 1 }, { translateY: pressed ? 3 : 0 }] }]}>
              <AchievementBadge id={a.id} locked={!earned} />
            </Pressable>}
            <Text style={[styles.name, !earned && styles.muted]}>{hidden ? 'Mystery achievement' : a.name}</Text>
            {!hidden && <><Text style={[styles.description, !earned && styles.muted]}>{a.description}</Text>
              {!claimed && reward !== '' && <TourAnchor id={a.id === 'W1.1' ? 'first-reward' : `reward-${a.id}`}><Pressable accessibilityRole="button" accessibilityLabel={`Collect ${reward} for ${a.name}`} disabled={!canClaim} onPress={event => claim(a.id, event.nativeEvent.pageX, event.nativeEvent.pageY)} style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 3 }}><Image source={quantaIcon} style={{ width: 23, height: 23 }} /><Text style={styles.reward}>{reward}</Text></Pressable></TourAnchor>}
              <Text style={[styles.status, canClaim && styles.claim]}>{status}</Text>
              {!earned && a.milestone && group !== 'Streak' && <Text style={styles.note}>{Math.min(a.milestone, group === 'Lessons' ? progress.lessons : progress.packets)} / {a.milestone}</Text>}
            </>}
          </View>;
        })}</View>
      </View>)}
    </TourScrollView>
    {flight && <QuantaFlight key={`${flight.x}:${flight.y}:${quanta}`} flight={flight} onFinish={finishFlight} />}
    <AchievementToast id={progress.notices[0]} enabled={!packet && !tourStep(tour.state)} onDismiss={onDismissNotice} />
    <Modal visible={packet !== undefined} transparent animationType="fade" onRequestClose={() => setPacket(undefined)}>
      <View style={styles.modalBackdrop}><View style={styles.modalSheet}><Pressable accessibilityRole="button" onPress={() => setPacket(undefined)} style={styles.back}><Text style={styles.backText}>Close</Text></Pressable>
        <ScrollView>{packet && <RewardPack key={packet} excludeIds={owned} onOpen={ids => onOpenPacket(packet, ids)} />}</ScrollView>
      </View><AchievementToast id={progress.notices[0]} enabled={Boolean(packet)} onDismiss={onDismissNotice} /></View>
    </Modal>
  </View></SafeAreaView>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderColor: colors.border },
  back: { padding: 10, minHeight: 44 }, backText: { fontFamily: fonts.body, fontSize: 22, color: colors.primaryDark },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 6 }, coin: { width: 30, height: 30 }, balance: { fontFamily: fonts.body, fontSize: 23, color: colors.ink },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 20, paddingBottom: 70 },
  title: { fontFamily: fonts.display, fontSize: 42, textAlign: 'center', color: colors.ink },
  intro: { fontFamily: fonts.body, fontSize: 22, textAlign: 'center', color: colors.ink, marginVertical: 12 },
  summary: { fontFamily: fonts.body, fontSize: 18, textAlign: 'center', color: colors.muted },
  section: { marginTop: 30 }, group: { fontFamily: fonts.display, fontSize: 30, color: colors.ink, borderBottomWidth: 2, borderColor: colors.border, paddingBottom: 8, marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 26 }, item: { width: '47%', alignItems: 'center' },
  badgeButton: { padding: 6 }, mystery: { width: 96, height: 96, margin: 6, borderWidth: 3, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 48, backgroundColor: '#EAE5DC', alignItems: 'center', justifyContent: 'center' },
  question: { fontFamily: fonts.display, fontSize: 58, color: colors.muted },
  name: { fontFamily: fonts.display, fontSize: 22, color: colors.ink, textAlign: 'center', marginTop: 5 },
  description: { fontFamily: fonts.body, fontSize: 18, lineHeight: 23, color: colors.ink, textAlign: 'center', marginTop: 5 },
  reward: { fontFamily: fonts.body, fontSize: 18, color: colors.primaryDark, marginTop: 8 },
  status: { fontFamily: fonts.body, fontSize: 17, color: colors.muted, marginTop: 5, textAlign: 'center' }, claim: { color: colors.red }, muted: { color: '#81817C' },
  note: { fontFamily: fonts.body, fontSize: 17, color: colors.muted, textAlign: 'center', marginBottom: 12 },
  packetButton: { backgroundColor: '#EAE2FA', borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 20 },
  modalBackdrop: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: 16 }, modalSheet: { maxHeight: '90%', maxWidth: 520, width: '100%', borderRadius: 22, padding: 18, backgroundColor: colors.background },
});
