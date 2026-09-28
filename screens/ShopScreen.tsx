import { useState } from 'react';
import { Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../constants/theme';
import { boutique as b } from '../constants/boutique';
import { accessoryCatalog, type AccessoryId } from '../data/customisation';
import { eligibleAccessories, packetOffers, quantaBundles, type PacketKind, type PurchasedPacket } from '../data/shop';
import { PacketArtwork, QuantaArtwork } from '../components/ShopArtwork';
import { RewardPack } from '../components/RewardPack';
import { TourAnchor, TourOverlay, TourScrollView, useTour } from '../components/Onboarding';

export function ShopScreen({ quanta, owned, packet, onBuy, onRip, onFinishPacket, onBack }: {
  quanta: number; owned: AccessoryId[]; packet?: PurchasedPacket;
  onBuy: (kind: PacketKind) => boolean; onRip: (id: number) => void; onFinishPacket: (id: number) => void; onBack: () => void;
}) {
  const tour = useTour();
  const [packetVisible, setPacketVisible] = useState(Boolean(packet));
  const [error, setError] = useState('');
  const available = eligibleAccessories('standard', accessoryCatalog, owned);
  const count = available.length ? 3 : 0;
  const guidedOffer = ['shopPause', 'packets', 'gift', 'buy'].includes(tour.state.step);
  const offerLocked = guidedOffer && tour.state.step !== 'buy';
  const buy = (kind: PacketKind) => {
    if (offerLocked || (guidedOffer && kind !== 'standard')) return;
    if (onBuy(kind)) { setError(''); setPacketVisible(true); }
    else setError('This packet is not available right now. Your Quanta have not been spent.');
  };
  return <SafeAreaView style={s.safe}><TourScrollView contentContainerStyle={s.content}>
    <View style={s.top}><TourAnchor id="shop-back"><Pressable accessibilityRole="button" onPress={onBack} style={s.back}><Text style={s.link}>‹ Wardrobe</Text></Pressable></TourAnchor><View style={s.balance}><Image source={require('../assets/ui/quanta-icon-transparent.png')} style={s.coin} /><Text style={s.balanceText}>{quanta}</Text></View></View>
    <Text style={s.title}>Q-market</Text>
    {packet && <Pressable accessibilityRole="button" onPress={() => setPacketVisible(true)} style={s.resume}><Text style={s.link}>{packet.opened ? 'See your new accessories' : 'Open your purchased packet'}</Text></Pressable>}
    <View style={s.featured}>
      <PacketArtwork size={155} />
      <Text style={s.cardTitle}>Q accessory packet</Text>
      <Text style={s.body}>Get 3 random accessories (all rarities)</Text>
      <Text style={s.offerNote}>• Repeats of items you already own are possible ;)</Text>
      <TourAnchor id="buy-packet" style={{ width: '100%' }}><Pressable accessibilityRole="button" accessibilityLabel="Buy Q accessory packet for 100 Quanta" accessibilityState={{ disabled: offerLocked || !count || quanta < 100 || Boolean(packet) }} disabled={offerLocked || !count || quanta < 100 || Boolean(packet)} onPress={() => buy('standard')} style={[s.buy, (offerLocked || !count || quanta < 100 || Boolean(packet)) && s.disabled]}><Text style={s.buyText}>{!count ? 'Collection complete' : packet ? 'Finish your current packet' : quanta < 100 ? 'Need 100 Quanta' : 'Buy for 100 Quanta'}</Text></Pressable></TourAnchor>
    </View>
    {error !== '' && <Text accessibilityRole="alert" style={s.note}>{error}</Text>}
    <Text style={s.sectionTitle}>Special Q-packs</Text>
    <Text style={s.body}>One accessory in each packet. Repeats are possible.</Text>
    {packetOffers.filter(offer => offer.kind !== 'standard').map(offer => {
      const pool = eligibleAccessories(offer.kind, accessoryCatalog, owned);
      const disabled = guidedOffer || !pool.length || quanta < offer.price || Boolean(packet);
      return <View key={offer.kind} style={s.rarityCard}>
        <PacketArtwork kind={offer.kind} size={100} paper="#FFF" />
        <View style={s.rarityCopy}><Text style={s.body}>{offer.price} Quanta</Text><Text style={s.note}>{!pool.length ? 'Coming soon: artwork is being prepared.' : '1 accessory'}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`Buy ${offer.name} packet for ${offer.price} Quanta`} accessibilityState={{ disabled }} disabled={disabled} onPress={() => buy(offer.kind)} style={[s.smallBuy, disabled && s.disabled]}><Text style={s.buyText}>{!pool.length ? 'Coming soon' : quanta < offer.price ? 'More Quanta needed' : `Buy for ${offer.price}`}</Text></Pressable>
        </View>
      </View>;
    })}
    <View style={s.support}><Text style={[s.eyebrow, s.purchaseFont]}>A LITTLE HELP GOES A LONG WAY</Text><Text style={[s.sectionTitle, s.purchaseFont]}>Support us by getting quanta</Text><Text style={[s.body, s.purchaseFont]}>In-app purchases are in development. No real-money purchases are available yet.</Text>
      <View style={s.bundleGrid}>{quantaBundles.map(bundle => <View key={bundle.amount} style={s.bundle}>
        <QuantaArtwork amount={bundle.amount} /><Text style={s.bundleAmount}>{bundle.amount}</Text><Text style={s.bundleName}>{bundle.name}</Text><Text style={s.price}>{bundle.price}</Text><Text style={[s.note, s.purchaseFont]}>{bundle.proposed ? 'Proposed AUD price' : 'Planned AUD price'}</Text><Text style={s.comingSoon}>Coming soon</Text>
      </View>)}</View>
      <Text style={[s.note, s.purchaseFont]}>Final prices will be shown by the app store before you pay.</Text>
    </View>
  </TourScrollView>
    <TourOverlay host="shop" />
    <Modal visible={Boolean(packet && packetVisible)} transparent animationType="fade" onRequestClose={() => { if (!['packetPause', 'rip', 'revealed'].includes(tour.state.step)) setPacketVisible(false); }}>
      <View style={s.overlay}><View accessibilityViewIsModal style={s.modal}><TourScrollView contentContainerStyle={s.modalContent}>
        {packet && <RewardPack key={packet.id} packetKind={packet.kind} rewardIds={packet.rewards} excludeIds={owned} duplicateFlags={packet.duplicates} initiallyOpen={packet.opened} openingDisabled={tour.state.step === 'packetPause'} onOpen={() => onRip(packet.id)} />}
        <TourAnchor id="packet-done"><Pressable accessibilityRole="button" onPress={() => { if (packet?.opened) onFinishPacket(packet.id); setPacketVisible(false); }} style={s.buy}><Text style={s.buyText}>{packet?.opened ? 'Back to Q-market' : 'Open later'}</Text></Pressable></TourAnchor>
        {!packet?.opened && <Text style={s.note}>Your purchased packet is saved for this session.</Text>}
      </TourScrollView></View><TourOverlay host="packet" /></View>
    </Modal>
  </SafeAreaView>;
}

// Deliberately not reachable from a fake purchase button. The future billing
// coordinator must show this only after verified, idempotent wallet credit.
export function PurchaseThankYouModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}><View style={s.overlay}><View accessibilityViewIsModal style={[s.modal, s.modalContent]}><Text style={s.sectionTitle}>Thank you! Your support means a lot.</Text><Pressable accessibilityRole="button" onPress={onClose} style={s.buy}><Text style={s.buyText}>Back to the shop</Text></Pressable></View></View></Modal>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: b.cream }, content: { padding: 20, paddingBottom: 60, width: '100%', maxWidth: 600, alignSelf: 'center' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, back: { paddingVertical: 14, paddingHorizontal: 4 }, link: { fontFamily: fonts.body, color: b.plum, fontSize: 17 },
  balance: { flexDirection: 'row', alignItems: 'center', gap: 5 }, coin: { width: 31, height: 31 }, balanceText: { fontFamily: fonts.body, fontWeight: '700', fontSize: 21, color: b.plum },
  eyebrow: { fontFamily: fonts.body, fontSize: 10, letterSpacing: 2, textAlign: 'center', color: b.muted, marginTop: 20 }, title: { fontFamily: fonts.display, fontSize: 46, color: b.plum, textAlign: 'center', marginTop: 10 },
  featured: { backgroundColor: '#FFF', borderWidth: 1, borderColor: b.gold, borderRadius: 24, marginTop: 24, padding: 20, alignItems: 'center' },
  cardTitle: { fontFamily: fonts.display, fontSize: 28, color: b.ink, textAlign: 'center', marginTop: 10 }, body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23, color: b.ink, textAlign: 'center', marginTop: 8 }, note: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, color: b.muted, textAlign: 'center', marginTop: 8 },
  offerNote: { fontFamily: fonts.body, fontSize: 16, lineHeight: 21, color: b.muted, textAlign: 'center', marginTop: 8 },
  buy: { backgroundColor: b.plum, borderRadius: 13, minHeight: 50, padding: 14, alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 18 }, buyText: { fontFamily: fonts.body, fontSize: 18, color: '#FFF', textAlign: 'center' }, disabled: { backgroundColor: '#827681' },
  sectionTitle: { fontFamily: fonts.display, fontSize: 29, color: b.plum, textAlign: 'center', marginTop: 30 }, rarityCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2D6C8', borderRadius: 18, padding: 16, marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }, rarityCopy: { flex: 1 }, smallBuy: { padding: 11, minHeight: 44, backgroundColor: b.plum, borderRadius: 9, marginTop: 12, justifyContent: 'center' },
  purchaseFont: { fontFamily: b.body },
  support: { marginTop: 34, borderTopWidth: 1, borderColor: b.gold, paddingTop: 8 }, bundleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: '4%', marginTop: 20 }, bundle: { width: '48%', padding: 8, marginBottom: 14, borderWidth: 1, borderColor: '#DDD0C2', borderRadius: 16, backgroundColor: '#FFF9EF', alignItems: 'center' }, bundleAmount: { fontFamily: b.body, fontSize: 30, color: b.plum }, bundleName: { fontFamily: b.body, fontSize: 13, color: b.ink, textAlign: 'center', marginTop: 4 }, price: { fontFamily: b.body, fontSize: 19, color: b.plum, fontWeight: '600', marginTop: 12 }, comingSoon: { fontFamily: b.body, fontSize: 12, color: b.muted, padding: 10 },
  resume: { borderWidth: 1, borderColor: b.gold, borderRadius: 12, padding: 16, marginTop: 16, alignItems: 'center' }, overlay: { flex: 1, backgroundColor: 'rgba(33,20,32,0.7)', alignItems: 'center', justifyContent: 'center', padding: 18 }, modal: { width: '100%', maxWidth: 480, maxHeight: '90%', backgroundColor: b.cream, borderRadius: 24, borderWidth: 1, borderColor: b.gold }, modalContent: { padding: 20 },
});
