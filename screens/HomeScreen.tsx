import { currentRealm } from '../data/curriculum';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, type ImageSourcePropType } from 'react-native';
import { TourAnchor, TourScrollView, useTour } from '../components/Onboarding';
import { DAILY_LIFE_LIMIT } from '../data/learnerRules';
import { featureAvailable, tourStep } from '../data/onboarding';
import { ParticleAvatar } from '../components/ParticleAvatar';
import { AchievementEntryArtwork } from '../components/ShopArtwork';
import { AvatarGreeting } from '../components/AvatarGreeting';
import { ProfileModal } from '../components/ProfileModal';
import { DictionaryIcon, DictionaryModal } from '../components/DictionaryModal';
import { type DictionaryEntry } from '../data/dictionary';
import { Birthday } from '../data/greetings';
import { PrimaryButton } from '../components/PrimaryButton';
import { LevelUpModal } from '../components/LevelUpModal';
import { knowledgeLevel } from '../data/knowledge';
import { XPBar } from '../components/XPBar';
import { WorldUnlockModal } from '../components/WorldUnlockModal';
import { AccessoryId, ParticleId } from '../data/customisation';
import { colors, fonts, shadow, spacing, type } from '../constants/theme';

const energyIcon = require('../assets/ui/energy-icon-transparent.png');
const fireIcon = require('../assets/ui/fire-icon-transparent.png');
const quantaIcon = require('../assets/ui/quanta-icon-transparent.png');
const coatHanger = require('../assets/ui/coat-hanger-transparent.png');
const tickIcon = require('../assets/ui/tick-icon-transparent.png');
const worldOneIcon = require('../assets/module-covers/world-1.png');
const worldTwoIcon = require('../assets/module-covers/world-2.png');
const worldThreeIcon = require('../assets/module-covers/world-3.png');
const worldFourIcon = require('../assets/module-covers/world-4.png');
const worldFourFirstBadge = require('../assets/lesson-badges/world-4/1.png');
const worldFourSecondBadge = require('../assets/lesson-badges/world-4/2.png');
const worldFourThirdBadge = require('../assets/lesson-badges/world-4/3.png');
const worldFourFourthBadge = require('../assets/lesson-badges/world-4/4.png');
const worldFourFifthBadge = require('../assets/lesson-badges/world-4/5.png');
const worldFourSixthBadge = require('../assets/lesson-badges/world-4/6.png');
const qurioLogo = require('../assets/brand/qurio-logo-transparent.png');
const worldOneNodes = [
  require('../assets/lesson-badges/world-1/1.png'),
  require('../assets/lesson-badges/world-1/2.png'),
  require('../assets/lesson-badges/world-1/3.png'),
  require('../assets/lesson-badges/world-1/4.png'),
  require('../assets/lesson-badges/world-1/5.png'),
  require('../assets/lesson-badges/world-1/6.png'),
  require('../assets/lesson-badges/world-1/7.png'),
  require('../assets/lesson-badges/world-1/8.png'),
  require('../assets/lesson-badges/world-1/9.png'),
];
const worldTwoNodes = [
  require('../assets/lesson-badges/world-2/1.png'),
  require('../assets/lesson-badges/world-2/2.png'),
  require('../assets/lesson-badges/world-2/3.png'),
  require('../assets/lesson-badges/world-2/4.png'),
  require('../assets/lesson-badges/world-2/5.png'),
  require('../assets/lesson-badges/world-2/6.png'),
  require('../assets/lesson-badges/world-2/7.png'),
  require('../assets/lesson-badges/world-2/8.png'),
  require('../assets/lesson-badges/world-2/9.png'),
];
const worldThreeNodes = [
  require('../assets/lesson-badges/world-3/1.png'),
  require('../assets/lesson-badges/world-3/2.png'),
  require('../assets/lesson-badges/world-3/3.png'),
  require('../assets/lesson-badges/world-3/4.png'),
  require('../assets/lesson-badges/world-3/5.png'),
  require('../assets/lesson-badges/world-3/6.png'),
  require('../assets/lesson-badges/world-3/7.png'),
  require('../assets/lesson-badges/world-3/8.png'),
];

function renderLessonPathRow({ id, title, badge, complete, accessibilityLabel, onSelect }: {
  id: number;
  title: string;
  badge: ImageSourcePropType;
  complete: boolean;
  accessibilityLabel: string;
  onSelect: (id: number) => void;
}) {
  return <TourAnchor key={id} id={`lesson-${id}`}><Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={() => onSelect(id)} style={styles.pathRow}>
    <View style={styles.nodeFrame}><Image source={badge} resizeMode="contain" style={styles.node} /></View>
    <View style={styles.pathCopy}>
      <Text style={[styles.pathEyebrow, complete && styles.completedText]}>{complete ? 'COMPLETED · REPLAY' : 'TAP TO EXPLORE'}</Text>
      <Text style={[styles.pathTitle, complete && styles.completedText]}>{title}</Text>
    </View>
    {complete && <Image accessibilityLabel="Completed" source={tickIcon} resizeMode="contain" style={styles.pathCheck} />}
  </Pressable></TourAnchor>;
}

export function HomeScreen({ visibleLessons, xp, collected, username = 'Username', infiniteEnergy = false, onExit, particle = 'electron', particleName = '', accessories = [], energy = DAILY_LIFE_LIMIT, quanta = 120, streak = 3, onContinue, completed, onSelectLesson, onCustomise, onRenameParticle, unlockedWorld, onDismissWorldUnlock, birthday, onBirthdayChange, greetingReady = true, dictionaryEntries = [], shownKnowledge = xp, onKnowledgePresented, levelUp, onDismissLevelUp, achievementCount = 0, unclaimedAchievements = false, onAchievements }: {
  visibleLessons?: readonly number[];
  infiniteEnergy?: boolean; onExit?: () => void;
  username?: string;
  achievementCount?: number; unclaimedAchievements?: boolean; onAchievements?: () => void;
  shownKnowledge?: number; onKnowledgePresented?: (total: number) => void; levelUp?: number; onDismissLevelUp?: (level: number) => void;
  xp: number; collected: boolean; particle?: ParticleId; particleName?: string; accessories?: AccessoryId[]; energy?: number; quanta?: number; streak?: number;
  lessonComplete?: boolean; onContinue: () => void; completed: number[]; onSelectLesson: (lesson: number) => void; onCustomise?: () => void; onRenameParticle?: (name: string) => void;
  unlockedWorld?: 2 | 3 | 4; onDismissWorldUnlock?: () => void;
  birthday?: Birthday; onBirthdayChange?: (birthday?: Birthday) => void; greetingReady?: boolean;
  dictionaryEntries?: DictionaryEntry[];
}) {
  const canSee = (id: number) => !visibleLessons || visibleLessons.includes(id);
  const lessonPathRow = (props: Parameters<typeof renderLessonPathRow>[0]) => canSee(props.id) ? renderLessonPathRow(props) : null;
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const drawerShift = useRef(new Animated.Value(350)).current;
  useEffect(() => {
    if (!settingsOpen) return;
    drawerShift.setValue(350);
    const animation = Animated.timing(drawerShift, { toValue: 0, duration: 300, useNativeDriver: Platform.OS !== 'web' });
    animation.start(); return () => animation.stop();
  }, [settingsOpen, drawerShift]);
  const tour = useTour();
  const dictionaryLocked = !featureAvailable(tour.state, 'dictionary');
  const achievementsLocked = !featureAvailable(tour.state, 'achievements');
  const wardrobeLocked = !featureAvailable(tour.state, 'wardrobe');
  const finishNaming = () => { if (particleName.trim()) tour.event('name-saved'); };
  const tourActive = tour.enabled && tourStep(tour.state)?.screen === 0;
  const [heroWidth, setHeroWidth] = useState(300);
  const [dictionaryOpen, setDictionaryOpen] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const [barY, setBarY] = useState<number>();
  const [barReady, setBarReady] = useState(false);
  const rewardsReady = greetingReady && !unlockedWorld && !profileOpen && !settingsOpen && !dictionaryOpen && !levelUp;
  useEffect(() => {
    if (!rewardsReady || (tourActive && tour.state.step !== 'knowledge') || xp <= shownKnowledge || barY === undefined) { setBarReady(false); return; }
    scroll.current?.scrollTo({ y: Math.max(0, barY - 110), animated: true });
    const timer = setTimeout(() => setBarReady(true), 500);
    return () => clearTimeout(timer);
  }, [rewardsReady, xp, shownKnowledge, barY, tourActive, tour.state.step]);
  const worldOffsets = useRef<Record<2 | 3 | 4, number>>({ 2: 0, 3: 0, 4: 0 });
  const worldOneComplete = completed.filter(lesson => lesson >= 1 && lesson <= 9).length;
  const worldTwoComplete = completed.filter(lesson => lesson >= 11 && lesson <= 18).length;
  const worldThreeComplete = completed.filter(lesson => (lesson >= 19 && lesson <= 25) || lesson === 31).length;
  const takeMeThere = () => {
    if (!unlockedWorld) return;
    const target = unlockedWorld;
    onDismissWorldUnlock?.();
    requestAnimationFrame(() => scroll.current?.scrollTo({ y: Math.max(0, worldOffsets.current[target] - 18), animated: true }));
  };
  return <SafeAreaView style={styles.safe}><TourScrollView ref={scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.top}><View><Image accessibilityLabel="Qurio" source={qurioLogo} resizeMode="contain" style={styles.logoImage} /></View><TourAnchor id="profile"><Pressable accessibilityRole="button" accessibilityLabel={`Open settings, ${username}, Level ${knowledgeLevel(shownKnowledge)}`} onPress={() => setSettingsOpen(true)} style={styles.profileButton}>
      <Text numberOfLines={2} style={styles.profileUsername}>{username}</Text>
      <Text style={styles.profileLevel}>{knowledgeLevel(shownKnowledge)}</Text>
      <Text style={styles.settingsTab}>tap to see settings</Text>
    </Pressable></TourAnchor></View>
    <View style={styles.resourceRow}>
      <TourAnchor id="streak" style={{ flex: 1 }}><View style={[styles.resource, styles.streakResource]}><View pointerEvents="none" style={styles.crayonEdge} /><Image source={fireIcon} resizeMode="contain" style={styles.resourceIcon} /><View><Text style={styles.resourceValue}>{streak}</Text><Text style={styles.resourceLabel}>STREAK</Text></View></View></TourAnchor>
      <TourAnchor id="energy" style={{ flex: 1 }}><View style={[styles.resource, styles.energyResource]}><View pointerEvents="none" style={styles.crayonEdge} /><Image source={energyIcon} resizeMode="contain" style={styles.resourceIcon} /><View><Text style={styles.resourceValue}>{infiniteEnergy ? '∞' : `${energy}/${DAILY_LIFE_LIMIT}`}</Text><Text style={styles.resourceLabel}>ENERGY</Text></View></View></TourAnchor>
      <TourAnchor id="quanta" style={{ flex: 1 }}><View style={[styles.resource, styles.quantaResource]}><View pointerEvents="none" style={styles.crayonEdge} /><Image source={quantaIcon} resizeMode="contain" style={styles.quantaIcon} /><View><Text style={styles.resourceValue}>{quanta}</Text><Text style={styles.resourceLabel}>QUANTA</Text></View></View></TourAnchor>
    </View>
    <TourAnchor id="friend"><View style={styles.hero}>{collected ? <>
      <View style={styles.companionRow} onLayout={event => setHeroWidth(event.nativeEvent.layout.width)}>
        <ParticleAvatar size={Math.min(240, heroWidth * 0.7)} discovered groundShadow particle={particle} accessories={accessories} />
        <View pointerEvents="none" style={styles.greetingPosition}><AvatarGreeting width={Math.min(132, heroWidth * 0.36)} enabled={rewardsReady && !tourActive && xp === shownKnowledge} birthday={birthday} /></View>
      </View>
      <TourAnchor id="name" style={{ width: '100%' }}><TextInput accessibilityLabel="Name your particle" value={particleName} placeholder="Tap here to rename your pal" placeholderTextColor={colors.muted} maxLength={24} returnKeyType="done" selectTextOnFocus onFocus={() => tour.event('name-focused')} onBlur={finishNaming} onSubmitEditing={finishNaming} onChangeText={name => onRenameParticle?.(name)} style={styles.particleNameInput} /></TourAnchor>
      <Text style={styles.particleSub}>{particle}</Text>
      <TourAnchor id="wardrobe"><Pressable accessibilityRole="button" accessibilityLabel="Customise your particle!" accessibilityState={{ disabled: wardrobeLocked }} onPress={onCustomise} disabled={!onCustomise || wardrobeLocked} style={({ pressed }) => [styles.customisePrompt, wardrobeLocked && { opacity: 0.45 }, pressed && styles.customisePressed]}><Image source={coatHanger} resizeMode="contain" style={styles.hangerIcon} /><Text style={styles.customiseText}>{wardrobeLocked ? 'Keep playing levels to unlock!' : 'Customise your particle!'}</Text></Pressable></TourAnchor>
    </> : <View style={styles.lockedFriend} />}</View></TourAnchor>
    <View onLayout={event => setBarY(event.nativeEvent.layout.y)}><TourAnchor id="knowledge"><XPBar value={xp} from={shownKnowledge} enabled={rewardsReady && barReady} onPresented={onKnowledgePresented} /></TourAnchor></View>
    <View style={styles.shortcutRow}><TourAnchor id="achievements" style={{ flex: 1 }}><Pressable accessibilityRole="button" accessibilityLabel={`Open achievements, ${achievementCount} earned${unclaimedAchievements ? ', new rewards waiting' : ''}`} accessibilityState={{ disabled: achievementsLocked }} disabled={achievementsLocked} onPress={onAchievements} style={[styles.dictionaryEntry, achievementsLocked && { opacity: 0.45 }]}><View style={styles.shortcutArt}><AchievementEntryArtwork /></View><View><Text style={styles.shortcutTitle}>Achievements</Text>{achievementsLocked && <Text style={styles.shortcutHint}>Keep playing levels to unlock!</Text>}{unclaimedAchievements && <Text style={styles.newAchievements}>Rewards waiting!</Text>}</View></Pressable></TourAnchor>
    <TourAnchor id="dictionary" style={{ flex: 1 }}><Pressable accessibilityRole="button" accessibilityLabel="Open your dictionary" accessibilityState={{ disabled: dictionaryLocked }} disabled={dictionaryLocked} onPress={() => { if (dictionaryLocked) return; tour.event('dictionary-open'); setDictionaryOpen(true); }} style={({ pressed }) => [styles.dictionaryEntry, dictionaryLocked && { opacity: 0.45 }, pressed && { opacity: 0.65 }]}>
      <View style={styles.shortcutArt}><DictionaryIcon /></View><View><Text style={styles.shortcutTitle}>Dictionary</Text>{dictionaryLocked && <Text style={styles.shortcutHint}>Keep playing levels to unlock!</Text>}</View>
    </Pressable></TourAnchor></View>
    <Text style={styles.realmHeading}>Realm {currentRealm.number} · {currentRealm.chapters.length} chapters</Text>
    <View style={styles.worldHeading}><View style={styles.worldIdentity}><Image source={worldOneIcon} resizeMode="contain" style={styles.worldOneIcon} /><View><Text style={styles.eyebrow}>CHAPTER 1</Text><Text style={styles.worldTitle}>Entering the{`\n`}Quantum World</Text></View></View><Text style={styles.worldCount}>{worldOneComplete}/9</Text></View>
    <Text style={styles.worldQuestion}>What even is quantum?</Text>
    <View style={styles.pathCard}><View style={styles.pathLine} />
      {['How small can we go?', 'Two different worlds', 'One particle. Two paths?', 'A particle? A wave?', 'Electron stage fright…', 'The “magic” of observation?', 'How certain can we be?', 'Quantum isn’t just weird', 'Welcome to Quantum'].map((title, i) => lessonPathRow({ id: i + 1, title, badge: worldOneNodes[i], complete: completed.includes(i + 1), accessibilityLabel: `Open Lesson ${i + 1}: ${title}`, onSelect: onSelectLesson }))}
    </View>
    {canSee(11) && <><View onLayout={event => { worldOffsets.current[2] = event.nativeEvent.layout.y; }} style={styles.worldHeading}><View style={styles.worldIdentity}><Image source={worldTwoIcon} resizeMode="contain" style={styles.worldTwoIcon} /><View><Text style={[styles.eyebrow, styles.worldTwoEyebrow]}>CHAPTER 2</Text><Text style={styles.worldTitle}>The Quantum{`\n`}Rules</Text></View></View><Text style={styles.worldCount}>{worldTwoComplete}/8</Text></View>
    <Text style={styles.worldQuestion}>What are some rules that the quantum particles must follow?</Text>
    <View style={[styles.pathCard, styles.worldTwoCard]}><View style={styles.worldTwoLine} />
      {[{ id: 11, title: 'Q is for...' }, { id: 12, title: 'Atomic energy levels' }, { id: 13, title: 'Colourful results' }, { id: 14, title: 'Quantum state of mind' }, { id: 15, title: 'Superpositions' }, { id: 16, title: 'State collapse' }, { id: 17, title: 'One Crazy Cat' }, { id: 18, title: 'Quantum rules at work' }].map((lesson, index) => lessonPathRow({ id: lesson.id, title: lesson.title, badge: worldTwoNodes[index], complete: completed.includes(lesson.id), accessibilityLabel: `Open Chapter 2 Lesson ${index + 1}: ${lesson.title}`, onSelect: onSelectLesson }))}
    </View>
    </>}
    {canSee(19) && <><View onLayout={event => { worldOffsets.current[3] = event.nativeEvent.layout.y; }} style={styles.worldHeading}><View style={styles.worldIdentity}><Image source={worldThreeIcon} resizeMode="contain" style={styles.worldThreeIcon} /><View><Text style={[styles.eyebrow, styles.worldThreeEyebrow]}>CHAPTER 3</Text><Text style={styles.worldTitle}>Quantum{`\n`}Connections</Text></View></View><Text style={styles.worldCount}>{worldThreeComplete}/8</Text></View>
    <Text style={styles.worldQuestion}>What happens when quantum systems stop behaving alone?</Text>
    <View style={[styles.pathCard, styles.worldThreeCard]}><View style={styles.worldThreeLine} />
      {[{ id: 19, title: 'I’m spinning around!' }, { id: 20, title: 'When two particles meet…' }, { id: 21, title: 'All entangled up' }, { id: 22, title: 'Twin telepathy' }, { id: 23, title: 'Does that ring a bell?' }, { id: 24, title: 'Teleporting without travelling' }, { id: 25, title: 'Connections at work' }, { id: 31, title: 'Connecting the dots' }].map((lesson, index) => lessonPathRow({ id: lesson.id, title: lesson.title, badge: worldThreeNodes[index], complete: completed.includes(lesson.id), accessibilityLabel: `Open Chapter 3 Lesson ${index + 1}: ${lesson.title}`, onSelect: onSelectLesson }))}
    </View>
    </>}
    {canSee(26) && <><View onLayout={event => { worldOffsets.current[4] = event.nativeEvent.layout.y; }} style={styles.worldHeading}>
      <View style={styles.worldIdentity}><Image accessibilityLabel="Chapter 4: Better together" source={worldFourIcon} resizeMode="contain" style={{ width: 100, height: 104 }} /><View><Text style={[styles.eyebrow, { color: '#B33C87' }]}>CHAPTER 4</Text><Text style={styles.worldTitle}>Better{`\n`}together</Text></View></View>
      <Text style={styles.worldCount}>{[26, 27, 28, 29, 30, 32].filter(id => completed.includes(id)).length}/6</Text>
    </View>
    <Text style={styles.worldQuestion}>What are differences in quantum particles and their families?</Text>
    <View style={[styles.pathCard, { backgroundColor: '#FBEAF4' }]}>
      {lessonPathRow({ id: 26, title: 'Quantum tunnelling', badge: worldFourFirstBadge, complete: completed.includes(26), accessibilityLabel: 'Open Chapter 4 Lesson 1: Quantum tunnelling', onSelect: onSelectLesson })}
      {lessonPathRow({ id: 27, title: 'Face card never declines', badge: worldFourSecondBadge, complete: completed.includes(27), accessibilityLabel: 'Open Chapter 4 Lesson 2: Face card never declines', onSelect: onSelectLesson })}
      {lessonPathRow({ id: 28, title: 'Two households, both unlike in dignity', badge: worldFourThirdBadge, complete: completed.includes(28), accessibilityLabel: 'Open Chapter 4 Lesson 3: Two households, both unlike in dignity', onSelect: onSelectLesson })}
      {lessonPathRow({ id: 29, title: 'Fermions firm in chemistry', badge: worldFourFourthBadge, complete: completed.includes(29), accessibilityLabel: 'Open Chapter 4 Lesson 4: Fermions firm in chemistry', onSelect: onSelectLesson })}
      {lessonPathRow({ id: 30, title: 'Happy, friendly bosons', badge: worldFourFifthBadge, complete: completed.includes(30), accessibilityLabel: 'Open Chapter 4 Lesson 5: Happy, friendly bosons', onSelect: onSelectLesson })}
      {lessonPathRow({ id: 32, title: 'Putting it all together', badge: worldFourSixthBadge, complete: completed.includes(32), accessibilityLabel: 'Open Chapter 4 Lesson 6: Putting it all together', onSelect: onSelectLesson })}
    </View>
    </>}
    <PrimaryButton label={completed.includes(26) && completed.includes(27) && completed.includes(28) && completed.includes(29) && completed.includes(30) && completed.includes(32) && worldThreeComplete === 8 && worldTwoComplete === 8 && worldOneComplete === 9 ? 'Replay Chapter 4 · Lesson 1' : 'Continue'} onPress={onContinue} />
  </TourScrollView><WorldUnlockModal world={unlockedWorld} onTakeThere={takeMeThere} onLater={() => onDismissWorldUnlock?.()} />
    <LevelUpModal level={greetingReady && !unlockedWorld && !profileOpen && !dictionaryOpen ? levelUp : undefined} onClose={() => { if (levelUp) onDismissLevelUp?.(levelUp); }} />
    {profileOpen && <ProfileModal birthday={birthday} onSave={value => onBirthdayChange?.(value)} onClose={() => setProfileOpen(false)} />}
    {dictionaryOpen && <DictionaryModal entries={dictionaryEntries} onClose={() => { if (tour.state.step === 'dictionaryExplain') return; setDictionaryOpen(false); if (tour.state.step === 'dictionaryBrowse') tour.event('dictionary-close', 'dictionaryBrowse'); }} />}
    <Modal visible={settingsOpen} transparent animationType="fade" onRequestClose={() => setSettingsOpen(false)}>
      <View style={styles.drawerBackdrop}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close settings sidebar" style={{ flex: 1 }} onPress={() => setSettingsOpen(false)} />
        <Animated.View style={[styles.settingsDrawer, { transform: [{ translateX: drawerShift }] }]}>
          <Text style={styles.profileUsername}>{username}</Text>
          <Pressable accessibilityRole="button" onPress={() => setSettingsOpen(false)} style={styles.drawerAction}><Text style={styles.dictionaryTitle}>× Close</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => { setSettingsOpen(false); setProfileOpen(true); }} style={styles.drawerAction}><Text style={styles.dictionaryTitle}>Profile & birthday</Text></Pressable>
          <Text style={styles.dictionaryHint}>Local prototype. Daily energy and login streaks are not yet connected to accounts.</Text>
          {onExit && <Pressable accessibilityRole="button" onPress={onExit} style={styles.drawerAction}><Text style={styles.dictionaryTitle}>Leave this session</Text><Text style={styles.dictionaryHint}>Resets progress and returns to Guest / Tester entry.</Text></Pressable>}
        </Animated.View>
      </View>
    </Modal>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  drawerBackdrop: { flex: 1, flexDirection: 'row', backgroundColor: '#241C3680' }, settingsDrawer: { width: '82%', maxWidth: 350, backgroundColor: '#FFF9EC', padding: 24, paddingTop: 50 }, drawerAction: { paddingVertical: 20, borderBottomWidth: 1, borderColor: '#D9CDBA', marginBottom: 14 },
  newAchievements: { fontFamily: fonts.body, fontSize: 17, color: '#953A34', backgroundColor: '#FBE0D9', borderRadius: 12, padding: 9, marginTop: 10 },
  shortcutRow: { flexDirection: 'row', gap: 12, marginVertical: 12 },
  shortcutArt: { height: 96, justifyContent: 'center', alignItems: 'center' },
  shortcutTitle: { fontFamily: fonts.display, fontSize: 23, color: '#62412B', textAlign: 'center' },
  shortcutHint: { fontFamily: fonts.body, fontSize: 16, color: '#78614B', textAlign: 'center' },
  realmHeading: { fontFamily: fonts.display, fontSize: 25, color: colors.primary, marginTop: 22 },
  dictionaryEntry: { alignItems: 'center', gap: 4, paddingVertical: 8, minHeight: 116 }, dictionaryTitle: { fontFamily: fonts.display, fontSize: 27, color: '#62412B' }, dictionaryHint: { fontFamily: fonts.body, fontSize: 18, color: '#78614B', marginTop: 4 }, dictionaryArrow: { fontFamily: fonts.display, fontSize: 35, color: '#906A36' },
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, paddingBottom: spacing.xxl }, top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, logoImage: { width: 145, height: 58, marginLeft: -8, marginBottom: -5 }, greeting: { color: colors.muted, fontSize: type.small, fontFamily: fonts.body },
  profileButton: { flexShrink: 1, maxWidth: 170, alignItems: 'center', gap: 2, padding: 3 },
  profileUsername: { fontSize: 20, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  profileLevel: { fontSize: 30, lineHeight: 34, fontWeight: '900', color: colors.primaryDark },
  settingsTab: { fontFamily: fonts.body, fontSize: 15, color: colors.primaryDark, backgroundColor: '#EEE7FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  companionRow: { width: '100%', maxWidth: 480, alignItems: 'center', justifyContent: 'center' },
  greetingPosition: { position: 'absolute', right: -8, top: -22 },
  resourceRow: { flexDirection: 'row', gap: 8, marginTop: 20 }, resource: { flex: 1, minHeight: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, padding: 6, shadowColor: colors.ink, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.12, shadowRadius: 0, elevation: 1 }, streakResource: { backgroundColor: '#FFE8DF', borderColor: '#E9A28E', transform: [{ rotate: '-0.8deg' }] }, energyResource: { backgroundColor: '#FFF3C9', borderColor: '#DCBD61', transform: [{ rotate: '0.7deg' }] }, quantaResource: { backgroundColor: '#EDE8FF', borderColor: '#A998E0', transform: [{ rotate: '-0.4deg' }] }, crayonEdge: { position: 'absolute', inset: 3, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.ink, borderRadius: 12, opacity: 0.12, transform: [{ rotate: '0.8deg' }] }, resourceIcon: { width: 31, height: 34 }, quantaIcon: { width: 35, height: 35 }, resourceValue: { color: colors.ink, fontFamily: fonts.display, fontSize: 17 }, resourceLabel: { color: colors.muted, fontFamily: fonts.display, fontSize: 9, letterSpacing: 0.7 },
  hero: { alignItems: 'center', marginVertical: spacing.xl }, particleNameInput: { alignSelf: 'center', width: 218, maxWidth: '80%', color: colors.ink, fontSize: 19, fontFamily: fonts.display, textAlign: 'center', borderBottomWidth: 1.5, borderBottomColor: '#C6BEB0', paddingHorizontal: 4, paddingTop: spacing.sm, paddingBottom: 4 }, particleSub: { color: colors.muted, fontFamily: fonts.body, fontSize: 18, marginTop: 4, textTransform: 'lowercase' }, customisePrompt: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 12, paddingHorizontal: 12 }, customisePressed: { opacity: 0.58, transform: [{ scale: 0.98 }] }, hangerIcon: { width: 56, height: 48 }, customiseText: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 22 }, lockedFriend: { minHeight: 280, width: '100%', alignItems: 'center', justifyContent: 'center' }, lockedFriendOutline: { position: 'absolute', width: 274, height: 274 }, lockedFriendText: { width: 158, color: colors.ink, fontFamily: fonts.body, fontSize: 18, lineHeight: 22, textAlign: 'center' },
  worldTwoCard: { backgroundColor: '#EEE9FF' }, worldTwoLine: { position: 'absolute', width: 3, backgroundColor: '#CFC4F4', left: 43, top: 56, bottom: 43 },
  worldThreeCard: { backgroundColor: '#E8F5EE' }, worldThreeLine: { position: 'absolute', width: 3, backgroundColor: '#B8DFCD', left: 43, top: 41, bottom: 41 },
  worldHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.md }, worldIdentity: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }, worldOneIcon: { width: 92, height: 92, marginLeft: -7 }, worldTwoIcon: { width: 120, height: 82, marginLeft: -10 }, worldThreeIcon: { width: 126, height: 78, marginLeft: -9 }, eyebrow: { color: colors.primary, fontFamily: fonts.display, fontSize: type.tiny, letterSpacing: 1.5 }, worldTwoEyebrow: { color: colors.coral }, worldThreeEyebrow: { color: colors.green }, worldTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: type.h2, lineHeight: 31, marginTop: 4 }, worldCount: { color: colors.muted, fontFamily: fonts.display }, worldQuestion: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 27, marginBottom: spacing.md }, pathCard: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 2, borderColor: colors.ink, padding: spacing.lg, marginBottom: spacing.md, transform: [{ rotate: '0.25deg' }], ...shadow }, pathLine: { position: 'absolute', width: 3, backgroundColor: colors.track, left: 43, top: 56, bottom: 43 }, pathRow: { minHeight: 78, flexDirection: 'row', alignItems: 'flex-start', borderRadius: 12, paddingHorizontal: 4, paddingTop: 4 }, nodeFrame: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 1 }, node: { width: 48, height: 48 }, pathCopy: { flex: 1, marginLeft: spacing.md, paddingBottom: spacing.lg }, pathEyebrow: { color: colors.coral, fontFamily: fonts.display, fontSize: type.tiny, letterSpacing: 1 }, pathTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: type.h3, marginTop: 4 }, completedText: { color: colors.green }, pathCheck: { width: 31, height: 31, marginTop: 7, marginLeft: 6 },
});
