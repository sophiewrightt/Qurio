import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ParticleAvatar } from '../components/ParticleAvatar';
import { AccessoryCategory, AccessoryId, EquippedAccessories, ParticleId, accessoryById, accessoryCatalog, particleCatalog } from '../data/customisation';
import { colors, fonts, shadow } from '../constants/theme';
import { boutique as b } from '../constants/boutique';
import { ShopIcon } from '../components/ShopArtwork';
import { rarityOf, rarityStyles } from '../data/shop';
import { TourAnchor, TourScrollView } from '../components/Onboarding';

type WardrobeCategory = 'particle' | AccessoryCategory;

const drawers: { id: WardrobeCategory; label: string; emptyName: string }[] = [
  { id: 'particle', label: 'Particles', emptyName: 'other particles' },
  { id: 'eyes', label: 'Glasses', emptyName: 'glasses' },
  { id: 'face', label: 'Faces', emptyName: 'face accessories' },
  { id: 'head', label: 'Hats', emptyName: 'hats' },
];

function Stool() {
  return <View accessible={false} style={styles.stool}>
    <View style={styles.stoolBackLeg} />
    <View style={[styles.stoolLeg, styles.stoolLeft]} />
    <View style={[styles.stoolLeg, styles.stoolRight]} />
    <View style={styles.stoolBrace} />
    <View style={styles.stoolSeat}><View style={styles.stoolSeatTop} /><View style={styles.woodGrain} /><View style={styles.woodKnot} /></View>
  </View>;
}

export function CustomisationScreen({ particle, equipped, owned, electronUnlocked, photonUnlocked, gluonUnlocked = false, creatorPreviewAvailable = false, onParticle, onAccessory, onBack, onShop }: {
  particle: ParticleId; particleName?: string; equipped: EquippedAccessories; owned: AccessoryId[]; electronUnlocked: boolean; photonUnlocked: boolean; gluonUnlocked?: boolean;
  creatorPreviewAvailable?: boolean; knowledge: number; energy: number; quanta: number; onParticle: (id: ParticleId) => void;
  onAccessory: (category: AccessoryCategory, id?: AccessoryId) => void; onBack: () => void; onShop?: () => void;
}) {
  const [openDrawer, setOpenDrawer] = useState<WardrobeCategory>('particle');
  const [stageWidth, setStageWidth] = useState(342);
  const [preview, setPreview] = useState(false);
  const [previewParticle, setPreviewParticle] = useState(particle);
  const [previewEquipped, setPreviewEquipped] = useState<EquippedAccessories>(equipped);
  const showingPreview = creatorPreviewAvailable && preview;
  const shownParticle = showingPreview ? previewParticle : particle;
  const shownEquipped = showingPreview ? previewEquipped : equipped;
  const avatarSize = Math.min(220, Math.max(140, stageWidth - 96));
  const worn = Object.values(shownEquipped).filter((id): id is AccessoryId => Boolean(id));
  const availableParticles = particleCatalog.filter(item => showingPreview || (item.id === 'electron' ? electronUnlocked : item.id === 'photon' ? photonUnlocked : gluonUnlocked));
  const availableAccessories = openDrawer === 'particle' ? [] : accessoryCatalog.filter(item => item.category === openDrawer && (showingPreview || owned.includes(item.id)));
  const drawer = drawers.find(item => item.id === openDrawer)!;
  const drawerIsEmpty = openDrawer === 'particle' ? availableParticles.length <= 1 : availableAccessories.length === 0;

  const selectedLabel = openDrawer === 'particle'
    ? particleCatalog.find(item => item.id === shownParticle)?.name ?? 'Particle'
    : shownEquipped[openDrawer]
      ? accessoryById(shownEquipped[openDrawer]!)?.name ?? 'Accessory'
      : `No ${drawer.emptyName}`;
  const selectedAccessory = openDrawer !== 'particle' ? shownEquipped[openDrawer] : undefined;
  const selectedRarity = selectedAccessory ? rarityStyles[rarityOf(selectedAccessory)] : undefined;

  const cycle = (direction: -1 | 1) => {
    if (openDrawer === 'particle') {
      if (!availableParticles.length) return;
      const current = availableParticles.findIndex(item => item.id === shownParticle);
      const next = (Math.max(0, current) + direction + availableParticles.length) % availableParticles.length;
      if (showingPreview) setPreviewParticle(availableParticles[next]!.id);
      else onParticle(availableParticles[next]!.id);
      return;
    }
    if (!availableAccessories.length) return;
    const choices: (AccessoryId | undefined)[] = [undefined, ...availableAccessories.map(item => item.id)];
    const current = choices.findIndex(item => item === shownEquipped[openDrawer]);
    const next = (Math.max(0, current) + direction + choices.length) % choices.length;
    if (showingPreview) setPreviewEquipped(current => ({ ...current, [openDrawer]: choices[next] }));
    else onAccessory(openDrawer, choices[next]);
  };

  return <SafeAreaView style={styles.safe}><TourScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.topBar}><Pressable accessibilityRole="button" accessibilityLabel="Return home" onPress={onBack}><Text style={styles.back}>‹ Home</Text></Pressable>
      <TourAnchor id="market"><Pressable accessibilityRole="button" accessibilityLabel="Shop" onPress={onShop} style={styles.shop}><ShopIcon /><Text style={styles.shopText}>Shop</Text></Pressable></TourAnchor></View>
    <Text style={styles.title}>Qurio Boutique</Text>
    <Text style={styles.subtitle}>Dress up your particle</Text>
    {creatorPreviewAvailable && <View style={styles.previewPanel}><Pressable accessibilityRole="switch" accessibilityLabel="Creator preview" accessibilityState={{ checked: showingPreview }} onPress={() => {
      if (!preview) { setPreviewParticle(particle); setPreviewEquipped({ ...equipped }); }
      setPreview(value => !value);
    }} style={styles.previewToggle}><Text style={styles.shopText}>Creator preview: {showingPreview ? 'on' : 'off'}</Text></Pressable><Text style={styles.previewNote}>{showingPreview ? 'Try every available design. Previewing does not unlock or equip items in your real wardrobe.' : 'Prototype tool: preview all available artwork without changing your collection.'}</Text></View>}

    <View style={styles.dressingRoom}>
      <View pointerEvents="none" accessible={false} style={styles.scenery}>
        <View style={styles.wallRail} /><View style={styles.mirror}><View style={styles.mirrorInset} /></View>
        <View style={[styles.curtain, styles.leftCurtain]} /><View style={[styles.curtain, styles.rightCurtain]} />
        <View style={[styles.tie, { left: 9 }]} /><View style={[styles.tie, { right: 9 }]} />
        <View style={styles.rug} /><Text style={styles.ornament}>✧</Text>
      </View>
      <View onLayout={event => setStageWidth(event.nativeEvent.layout.width)} style={styles.tryOnRow}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Previous ${drawer.emptyName}`} accessibilityState={{ disabled: drawerIsEmpty }} disabled={drawerIsEmpty} onPress={() => cycle(-1)} style={({ pressed }) => [styles.arrow, drawerIsEmpty && styles.arrowDisabled, pressed && styles.arrowPressed]}><Text style={styles.arrowText}>‹</Text></Pressable>
        <View style={[styles.avatarStage, { width: avatarSize, paddingTop: 220 - avatarSize }]}>
          {availableParticles.length ? <ParticleAvatar particle={shownParticle} accessories={worn} size={avatarSize} floating={false} /> : <View style={styles.mysteryParticle}><Text style={styles.mysteryMark}>?</Text></View>}
          <Stool />
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={`Next ${drawer.emptyName}`} accessibilityState={{ disabled: drawerIsEmpty }} disabled={drawerIsEmpty} onPress={() => cycle(1)} style={({ pressed }) => [styles.arrow, drawerIsEmpty && styles.arrowDisabled, pressed && styles.arrowPressed]}><Text style={styles.arrowText}>›</Text></Pressable>
      </View>
      <Text style={styles.currentItem}>{selectedLabel}</Text>
      {selectedRarity && <Text style={[styles.rarity, { color: selectedRarity.ink, backgroundColor: selectedRarity.color }]}>{selectedRarity.label}</Text>}
      {showingPreview && selectedAccessory && !owned.includes(selectedAccessory) && <Text style={styles.previewNote}>Preview only, not unlocked</Text>}
      {drawerIsEmpty && <Text style={styles.emptyMessage}>You don’t have any {drawer.emptyName}, keep learning to unlock more!</Text>}
    </View>

    <TourAnchor id="drawers"><View accessibilityLabel="Wardrobe drawers" style={styles.wardrobe}>
      <Text style={styles.wardrobeTitle}>My wardrobe</Text>
      <View style={styles.drawerGrid}>{drawers.map(item => {
        const open = item.id === openDrawer;
        return <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected: open }} accessibilityLabel={`${item.label} drawer${open ? ', open' : ''}`} onPress={() => setOpenDrawer(item.id)} style={({ pressed }) => [styles.drawer, open && styles.openDrawer, pressed && styles.drawerPressed]}>
          <View style={styles.drawerHandle} />
          <Text style={[styles.drawerText, open && styles.openDrawerText]}>{item.label}</Text>
        </Pressable>;
      })}</View>
      <View style={styles.wardrobeFeet}><View style={styles.wardrobeFoot} /><View style={styles.wardrobeFoot} /></View>
    </View></TourAnchor>
    <Text style={styles.hint}>Open a drawer, then use the arrows to try things on.</Text>
  </TourScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  previewPanel: { marginTop: 18, alignItems: 'center' },
  previewToggle: { borderWidth: 1, borderColor: b.gold, borderRadius: 12, padding: 12, minHeight: 48, backgroundColor: b.cream },
  previewNote: { fontFamily: fonts.body, fontSize: 12, lineHeight: 18, color: b.muted, textAlign: 'center', marginTop: 6 },
  rarity: { fontFamily: fonts.body, fontSize: 12, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, marginTop: 8 },
  safe: { flex: 1, backgroundColor: b.blush },
  content: { padding: 20, paddingBottom: 50, width: '100%', maxWidth: 580, alignSelf: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shop: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: b.gold, borderRadius: 12, backgroundColor: b.cream },
  shopText: { color: b.plum, fontFamily: fonts.body, fontSize: 17 },
  back: { color: b.plum, fontFamily: fonts.body, fontSize: 17, paddingVertical: 14 },
  title: { color: b.plum, fontFamily: fonts.display, fontSize: 36, lineHeight: 44, marginTop: 10, textAlign: 'center' },
  subtitle: { color: b.muted, fontFamily: fonts.body, fontSize: 14, textAlign: 'center', marginTop: 6 },
  dressingRoom: { alignItems: 'center', minHeight: 390, marginTop: 18, paddingBottom: 12 },
  scenery: { position: 'absolute', top: 0, left: 0, right: 0, height: 294, backgroundColor: '#F9EEE3', borderTopLeftRadius: 100, borderTopRightRadius: 100, overflow: 'hidden', borderWidth: 1, borderColor: b.gold },
  mirror: { position: 'absolute', width: '68%', height: 251, top: 12, left: '16%', borderWidth: 5, borderColor: b.gold, borderTopLeftRadius: 120, borderTopRightRadius: 120, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, backgroundColor: '#DDE8E2', padding: 4 },
  mirrorInset: { flex: 1, borderWidth: 1, borderColor: '#F3DFAE', borderTopLeftRadius: 120, borderTopRightRadius: 120, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: '#E9F0E9' },
  wallRail: { position: 'absolute', bottom: 35, width: '100%', height: 42, borderTopWidth: 3, borderColor: '#D2B788', backgroundColor: '#E7D9C4' },
  curtain: { position: 'absolute', width: '18%', height: 216, top: 0, backgroundColor: b.velvet, borderWidth: 4, borderColor: b.plum },
  leftCurtain: { left: -10, borderBottomRightRadius: 80, transform: [{ rotate: '6deg' }] },
  rightCurtain: { right: -10, borderBottomLeftRadius: 80, transform: [{ rotate: '-6deg' }] },
  tie: { position: 'absolute', top: 153, width: 30, height: 7, borderRadius: 4, backgroundColor: '#D5B774' },
  rug: { position: 'absolute', width: '86%', height: 46, bottom: 4, left: '7%', backgroundColor: '#C9ACAF', borderWidth: 3, borderColor: '#B38A91', borderRadius: 100 },
  ornament: { position: 'absolute', top: 1, alignSelf: 'center', color: '#F8DE9C', fontSize: 35 },
  tryOnRow: { width: '100%', height: 274, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  arrow: { width: 48, height: 70, alignItems: 'center', justifyContent: 'center' },
  arrowDisabled: { opacity: 0.22 },
  arrowPressed: { opacity: 0.5, transform: [{ scale: 0.9 }] },
  arrowText: { color: b.plum, fontFamily: fonts.display, fontSize: 62, lineHeight: 68 },
  avatarStage: { width: 230, height: 274, alignItems: 'center', justifyContent: 'flex-start' },
  stool: { position: 'absolute', width: 160, bottom: 8, height: 86, alignItems: 'center', transform: [{ rotate: '-2deg' }] },
  stoolSeat: { width: 158, height: 32, backgroundColor: '#CA8952', borderWidth: 3, borderColor: '#64452F', borderTopLeftRadius: 49, borderTopRightRadius: 39, borderBottomLeftRadius: 24, borderBottomRightRadius: 30, transform: [{ rotate: '3deg' }], zIndex: 2 },
  stoolSeatTop: { position: 'absolute', left: 2, right: 3, top: -2, height: 21, backgroundColor: '#EFC18B', borderBottomWidth: 2, borderColor: '#825A39', borderRadius: 40, transform: [{ rotate: '-1deg' }] },
  woodGrain: { position: 'absolute', top: 7, left: 24, width: 71, height: 5, borderTopWidth: 1.5, borderColor: '#AE7A46', borderRadius: 8, transform: [{ rotate: '-3deg' }] },
  woodKnot: { position: 'absolute', top: 6, right: 21, width: 17, height: 7, borderWidth: 1.5, borderColor: '#B78652', borderRadius: 12 },
  stoolLeg: { position: 'absolute', top: 23, width: 14, height: 61, backgroundColor: '#C9905D', borderWidth: 2.5, borderColor: '#64452F', borderTopLeftRadius: 3, borderBottomLeftRadius: 7, borderBottomRightRadius: 4 },
  stoolLeft: { left: 29, transform: [{ rotate: '11deg' }] },
  stoolRight: { right: 27, transform: [{ rotate: '-9deg' }] },
  stoolBackLeg: { position: 'absolute', top: 22, width: 12, height: 49, backgroundColor: '#AC774B', borderWidth: 2, borderColor: '#64452F', borderRadius: 4 },
  stoolBrace: { position: 'absolute', top: 57, width: 95, height: 9, backgroundColor: '#D29B69', borderWidth: 2, borderColor: '#64452F', borderRadius: 5, transform: [{ rotate: '2deg' }] },
  mysteryParticle: { width: 176, height: 176, borderRadius: 88, marginTop: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.track, borderWidth: 3, borderStyle: 'dashed', borderColor: colors.ink, zIndex: 3 },
  mysteryMark: { color: colors.coral, fontFamily: fonts.display, fontSize: 82 },
  currentItem: { color: b.muted, fontFamily: fonts.body, fontSize: 19, marginTop: 24 },
  emptyMessage: { color: b.muted, fontFamily: fonts.body, fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, paddingHorizontal: 12 },
  wardrobe: { marginTop: 14, backgroundColor: b.plum, borderWidth: 2, borderColor: b.gold, borderRadius: 16, padding: 16, paddingBottom: 12, ...shadow },
  wardrobeTitle: { color: '#F4DFC0', fontFamily: fonts.display, fontSize: 24, textAlign: 'center', marginBottom: 16 },
  drawerGrid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: '4%', rowGap: 10 },
  drawer: { width: '48%', minHeight: 74, alignItems: 'center', justifyContent: 'center', backgroundColor: '#704C62', borderWidth: 1, borderColor: b.gold, borderRadius: 7, shadowColor: b.ink, shadowOffset: { width: 1, height: 3 }, shadowOpacity: 0.24, shadowRadius: 0, elevation: 2 },
  openDrawer: { backgroundColor: '#F5E7CF', borderColor: '#DEC58E', transform: [{ translateY: 5 }], shadowOffset: { width: 1, height: 6 } },
  drawerPressed: { opacity: 0.72 },
  drawerHandle: { width: 31, height: 9, borderRadius: 7, borderWidth: 2, borderColor: '#DDBE7F', backgroundColor: b.gold, marginBottom: 8 },
  drawerText: { color: '#FFF4DC', fontFamily: fonts.display, fontSize: 19 },
  openDrawerText: { color: b.plum },
  wardrobeFeet: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 19, marginBottom: -23 },
  wardrobeFoot: { width: 22, height: 18, backgroundColor: b.gold, borderWidth: 1, borderColor: '#876138', borderTopWidth: 0, borderBottomLeftRadius: 7, borderBottomRightRadius: 7 },
  hint: { color: b.muted, fontFamily: fonts.body, fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 26 },
});
