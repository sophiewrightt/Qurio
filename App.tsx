import { useCallback, useRef, useState } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { LoadingScreen } from './components/LoadingScreen';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './screens/HomeScreen';
import { Birthday } from './data/greetings';
import { LessonScreen } from './screens/LessonScreen';
import { LessonTwoScreen } from './screens/LessonTwoScreen';
import { DoubleSlitScreen } from './screens/DoubleSlitScreen';
import { LessonFourScreen } from './screens/LessonFourScreen';
import { LessonFiveScreen } from './screens/LessonFiveScreen';
import { LessonSixScreen } from './screens/LessonSixScreen';
import { LessonSevenScreen } from './screens/LessonSevenScreen';
import { LessonEightScreen } from './screens/LessonEightScreen';
import { LessonNineScreen } from './screens/LessonNineScreen';
import { ModuleTwoLessonOneScreen } from './screens/ModuleTwoLessonOneScreen';
import { ModuleTwoLessonTwoScreen } from './screens/ModuleTwoLessonTwoScreen';
import { ModuleTwoLessonThreeScreen } from './screens/ModuleTwoLessonThreeScreen';
import { ModuleTwoLessonFourScreen } from './screens/ModuleTwoLessonFourScreen';
import { ModuleTwoLessonFiveScreen } from './screens/ModuleTwoLessonFiveScreen';
import { ModuleTwoLessonSixScreen } from './screens/ModuleTwoLessonSixScreen';
import { ModuleTwoLessonSevenScreen } from './screens/ModuleTwoLessonSevenScreen';
import { ModuleTwoLessonEightScreen } from './screens/ModuleTwoLessonEightScreen';
import { ModuleThreeLessonOneScreen } from './screens/ModuleThreeLessonOneScreen';
import { ModuleThreeLessonTwoScreen } from './screens/ModuleThreeLessonTwoScreen';
import { ModuleThreeLessonThreeScreen } from './screens/ModuleThreeLessonThreeScreen';
import { ModuleThreeLessonFourScreen } from './screens/ModuleThreeLessonFourScreen';
import { ModuleThreeLessonFiveScreen } from './screens/ModuleThreeLessonFiveScreen';
import { ModuleThreeLessonSixScreen } from './screens/ModuleThreeLessonSixScreen';
import { ModuleThreeLessonEightScreen } from './screens/ModuleThreeLessonEightScreen';
import { ModuleThreeLessonSevenScreen } from './screens/ModuleThreeLessonSevenScreen';
import { ModuleFourLessonOneScreen } from './screens/ModuleFourLessonOneScreen';
import { ModuleFourLessonTwoScreen } from './screens/ModuleFourLessonTwoScreen';
import { ModuleFourLessonThreeScreen } from './screens/ModuleFourLessonThreeScreen';
import { ModuleFourLessonFourScreen } from './screens/ModuleFourLessonFourScreen';
import { ModuleFourLessonFiveScreen } from './screens/ModuleFourLessonFiveScreen';
import { ModuleFourLessonSixScreen } from './screens/ModuleFourLessonSixScreen';
import { CustomisationScreen } from './screens/CustomisationScreen';
import { AccessoryCategory, AccessoryId, EquippedAccessories, ParticleId, accessoryCatalog } from './data/customisation';
import { ShopScreen } from './screens/ShopScreen';
import { buyPacket, finishPacket, initialShop, ripPacket, type PacketKind } from './data/shop';
import { useFonts } from 'expo-font';
import { Schoolbell_400Regular } from '@expo-google-fonts/schoolbell';
import { PatrickHand_400Regular } from '@expo-google-fonts/patrick-hand';
import { preloadAssetsByWorld } from './data/preloadAssets';
import { QuizCompanionProvider } from './components/QuizCompanion';
import { LessonNavigationProvider } from './components/LessonFinishActions';
import { DictionaryProvider } from './components/DictionaryContext';
import { recordDictionaryEntry, type DictionaryEntry } from './data/dictionary';

import { KnowledgeProvider } from './components/KnowledgeContext';
import { earnKnowledge, initialKnowledge, presentKnowledge } from './data/knowledge';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { AchievementToast } from './components/AchievementToast';
import { LessonEntryModal } from './components/LessonEntryModal';
import { availableLessonIds, lessonOrder, lessonNumber } from './data/lessonEntry';
import { DAILY_LIFE_LIMIT } from './data/learnerRules';
import { advanceTour, featureAvailable, tourForProfile, tourStep, type TourId, type PrototypeProfile } from './data/onboarding';
import { OnboardingProvider, TourOverlay } from './components/Onboarding';
import { PrototypeLoginScreen } from './screens/PrototypeLoginScreen';
import { claimAchievement, completeAchievementLesson, initialAchievements, openBonusPacket, recordPacket, type AchievementProgress } from './data/achievements';

type WorldNumber = 1 | 2 | 3 | 4;
const nextLessonScreen: Partial<Record<number, number>> = {
  1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9,
  11: 12, 12: 13, 13: 14, 14: 15, 15: 16, 16: 17, 17: 18,
  19: 20, 20: 21, 21: 22, 22: 23, 23: 24, 24: 25, 25: 31,
  26: 27, 27: 28, 28: 29, 29: 30, 30: 32,
};

function ArtworkPreloader({ sources, onReady }: { sources: readonly ImageSourcePropType[]; onReady: () => void }) {
  const loadedArtwork = useRef(new Set<number>());
  const markLoaded = (index: number) => {
    loadedArtwork.current.add(index);
    if (loadedArtwork.current.size === sources.length) onReady();
  };
  return <View pointerEvents="none" style={styles.preloadShelf}>
    {sources.map((source, index) => <Image key={index} source={source} resizeMode="contain" style={styles.preloadImage} onLoadEnd={() => markLoaded(index)} />)}
  </View>;
}

export default function PrototypeApp() {
  const [profile, setProfile] = useState<PrototypeProfile>();
  return profile ? <App profile={profile} onExit={() => setProfile(undefined)} /> : <PrototypeLoginScreen onEnter={setProfile} />;
}

export function App({ profile, onExit }: { profile?: PrototypeProfile; onExit?: () => void } = {}) {
  const [loaded, error] = useFonts({ Schoolbell_400Regular, PatrickHand_400Regular });
  const [artworkReadyWorld, setArtworkReadyWorld] = useState<WorldNumber | null>(null);
  const [screen, setScreen] = useState(0);
  const [tour, setTour] = useState(() => tourForProfile(profile));
  const tourRef = useRef(tour);
  const tester = profile?.mode === 'tester';
  const tourEvent = (event: string, expected: TourId = tourRef.current.step) => {
    const next = advanceTour(tourRef.current, expected, event, tester);
    tourRef.current = next; setTour(next);
  };
  const [pendingLesson, setPendingLesson] = useState<{ screen: number; label: string }>();
  const [entryCancellation, setEntryCancellation] = useState(0);
  const pendingEntry = useRef(pendingLesson);
  const admissionVersion = useRef(0);
  const currentAdmission = admissionVersion.current;
  const requestLesson = (target: number) => {
    const label = lessonNumber(target);
    if (!label || pendingEntry.current || admissionVersion.current !== currentAdmission || attempt.current !== currentAttempt) return;
    if (profile?.mode === 'guest' && !availableLessonIds([...completedRef.current]).includes(target)) return;
    if (target === 1 && tourRef.current.step === 'firstLesson' && !tourRef.current.trialUsed) {
      admissionVersion.current += 1;
      tourEvent('start-first'); setScreen(1); return;
    }
    if (tester) { admissionVersion.current += 1; setScreen(target); return; }
    const entry = { screen: target, label };
    pendingEntry.current = entry;
    setPendingLesson(entry);
  };
  const resolveEntry = (play: boolean) => {
    // Object identity prevents a dismissed/stale confirmation from opening another lesson.
    if (!pendingLesson || pendingEntry.current !== pendingLesson) return;
    pendingEntry.current = undefined;
    setPendingLesson(undefined);
    if (play) setScreen(pendingLesson.screen);
    else setEntryCancellation(value => value + 1);
  };
  const [knowledge, setKnowledge] = useState(initialKnowledge);
  const [achievementProgress, setAchievementProgress] = useState(initialAchievements);
  const achievementRef = useRef(achievementProgress);
  const updateAchievements = (next: AchievementProgress) => { achievementRef.current = next; setAchievementProgress(next); };
  const claimBadge = (id: string) => {
    const previous = achievementRef.current;
    const next = claimAchievement(previous, id);
    if (next === previous) return false;
    updateAchievements(next);
    if (id === 'W1.1') tourEvent('achievement-claimed');
    return true;
  };
  const dismissAchievement = useCallback((id: string) => {
    const current = achievementRef.current;
    if (current.notices[0] !== id) return;
    const next = { ...current, notices: current.notices.slice(1) };
    achievementRef.current = next; setAchievementProgress(next);
  }, []);
  const [shop, setShop] = useState(initialShop);
  const shopRef = useRef(shop);
  const quanta = knowledge.quanta + achievementProgress.quanta + tour.gift - shop.spent;
  // Each mounted lesson visit may earn once per question. A replay is a fresh attempt.
  const attempt = useRef({ screen, keys: new Set<string>(), finished: false, packetOpened: false });
  if (attempt.current.screen !== screen) attempt.current = { screen, keys: new Set<string>(), finished: false, packetOpened: false };
  const currentAttempt = attempt.current;
  const awardCorrect = useCallback((key: string) => {
    if (attempt.current !== currentAttempt || !lessonNumber(screen) || currentAttempt.keys.has(key)) return;
    currentAttempt.keys.add(key);
    setKnowledge(earnKnowledge);
  }, [screen, currentAttempt]);
  const showKnowledge = useCallback((total: number) => setKnowledge(progress => presentKnowledge(progress, total)), []);
  const dismissLevel = useCallback((level: number) => setKnowledge(progress => progress.celebrations[0] === level ? { ...progress, celebrations: progress.celebrations.slice(1) } : progress), []);
  const [electronCollected, setElectronCollected] = useState(false);
  const [particle, setParticle] = useState<ParticleId>('electron');
  const [particleName, setParticleName] = useState('');
  const [birthday, setBirthday] = useState<Birthday>();
  const [dictionaryEntries, setDictionaryEntries] = useState<DictionaryEntry[]>([]);
  const discoverTerm = useCallback((term: string, definition: string) => {
    setDictionaryEntries(entries => recordDictionaryEntry(entries, term, definition));
  }, []);
  const [ownedAccessories, setOwnedAccessories] = useState<AccessoryId[]>([]);
  const purchasePacket = (kind: PacketKind) => {
    // Reject stale and rapid duplicate purchase callbacks before charging.
    if (screen !== 34 || attempt.current !== currentAttempt || shopRef.current !== shop) return false;
    const next = buyPacket(shopRef.current, kind, knowledge.quanta + achievementRef.current.quanta + tourRef.current.gift, accessoryCatalog, ownedAccessories);
    if (next === shopRef.current) return false;
    shopRef.current = next; setShop(next); tourEvent('packet-bought'); return true;
  };
  const openPurchasedPacket = (id: number) => {
    const next = ripPacket(shopRef.current, id, ownedAccessories);
    if (next === shopRef.current) return;
    shopRef.current = next; setShop(next);
    setOwnedAccessories(current => [...new Set([...current, ...next.packet!.rewards])]);
    updateAchievements(recordPacket(achievementRef.current));
    tourEvent('packet-ripped');
  };
  const closePurchasedPacket = (id: number) => {
    const next = finishPacket(shopRef.current, id);
    if (next === shopRef.current) return;
    shopRef.current = next; setShop(next);
    tourEvent('packet-done');
  };
  const [equippedAccessories, setEquippedAccessories] = useState<EquippedAccessories>({});
  const [completed, setCompleted] = useState<number[]>([]);
  const [unlockedWorld, setUnlockedWorld] = useState<2 | 3 | 4>();
  const predictionRewards = useRef(new Set<number>());
  const completedRef = useRef(new Set<number>());
  const finish = (lesson: number) => {
    if (attempt.current !== currentAttempt || screen !== lesson || currentAttempt.finished) return;
    currentAttempt.finished = true;
    updateAchievements(completeAchievementLesson(achievementRef.current, lesson));
    if (lesson === 1) tourEvent(knowledge.total ? 'finish-first' : 'finish-first-no-knowledge');
    if (lesson === 4) tourEvent(dictionaryEntries.length ? 'finish-four' : 'finish-four-no-word');
    if (!completedRef.current.has(lesson)) {
      completedRef.current.add(lesson);
      setCompleted([...completedRef.current]);
    }
  };
  const unlockAccessories = (ids: AccessoryId[]) => {
    if (attempt.current !== currentAttempt || currentAttempt.packetOpened) return;
    currentAttempt.packetOpened = true;
    updateAchievements(recordPacket(achievementRef.current));
    setOwnedAccessories(current => [...new Set([...current, ...ids])]);
  };
  const openAchievementPacket = (id: string, ids: AccessoryId[]) => {
    const previous = achievementRef.current;
    const next = openBonusPacket(previous, id);
    if (next === previous) return;
    updateAchievements(next);
    setOwnedAccessories(current => [...new Set([...current, ...ids])]);
  };
  const equipAccessory = (category: AccessoryCategory, id?: AccessoryId) => setEquippedAccessories(current => ({ ...current, [category]: id }));
  const wornAccessories = Object.values(equippedAccessories).filter((id): id is AccessoryId => Boolean(id));
  // Ownership only labels duplicates. Pending packets no longer reserve items.
  const rewardExclusions = ownedAccessories;
  const worldOneIncomplete = [1, 2, 3, 4, 5, 6, 7, 8, 9].some(lesson => !completed.includes(lesson));
  const worldTwoIncomplete = [11, 12, 13, 14, 15, 16, 17, 18].some(lesson => !completed.includes(lesson));
  const worldThreeIncomplete = [19, 20, 21, 22, 23, 24, 25, 31].some(lesson => !completed.includes(lesson));
  const preloadWorld: WorldNumber = screen === 31 ? 3 : screen >= 26 && screen <= 32 ? 4 : screen >= 19 && screen <= 25 ? 3 : screen >= 11 && screen <= 18 ? 2 : screen >= 1 && screen <= 9 ? 1 : worldOneIncomplete ? 1 : worldTwoIncomplete ? 2 : worldThreeIncomplete ? 3 : 4;
  const worldPreloads = preloadAssetsByWorld[preloadWorld];
  const ready = (loaded || Boolean(error)) && artworkReadyWorld === preloadWorld;
  const nextScreen = screen === 1 || screen === 4 ? undefined : nextLessonScreen[screen];
  const openAchievements = () => {
    if (!featureAvailable(tourRef.current, 'achievements')) return;
    tourEvent('achievements-open');
    if (achievementRef.current.claimed.includes('W1.1')) tourEvent('achievement-claimed');
    setScreen(33);
  };
  const tourVisible = tourStep(tour)?.screen === screen;
  return <QuizCompanionProvider visible={electronCollected && screen !== 1} particle={particle} accessories={wornAccessories}><OnboardingProvider state={tour} screen={screen} enabled={ready && !pendingLesson && !unlockedWorld && !knowledge.celebrations.length} event={tourEvent}><KnowledgeProvider onCorrect={awardCorrect}><DictionaryProvider enabled={ready && !pendingLesson && Boolean(lessonNumber(screen))} onDiscover={discoverTerm}><LessonNavigationProvider entryCancellation={entryCancellation} onHome={() => setScreen(0)} onNext={nextScreen ? () => requestLesson(nextScreen) : undefined}><View style={styles.app}><StatusBar style="dark" />
    {screen === 0 && <HomeScreen visibleLessons={profile?.mode === 'guest' ? availableLessonIds(completed) : undefined} username={profile?.username} onExit={onExit} infiniteEnergy={tester} achievementCount={achievementProgress.earned.length} unclaimedAchievements={achievementProgress.earned.some(id => !achievementProgress.claimed.includes(id))} onAchievements={openAchievements} dictionaryEntries={dictionaryEntries} xp={knowledge.total} shownKnowledge={knowledge.shown} onKnowledgePresented={showKnowledge} levelUp={knowledge.celebrations[0]} onDismissLevelUp={dismissLevel} collected={electronCollected} particle={particle} particleName={particleName} accessories={wornAccessories} energy={DAILY_LIFE_LIMIT} quanta={quanta} streak={3} completed={completed} birthday={birthday} onBirthdayChange={setBirthday} greetingReady={ready && !pendingLesson}
      unlockedWorld={unlockedWorld} onDismissWorldUnlock={() => setUnlockedWorld(undefined)} onRenameParticle={setParticleName} onCustomise={() => { if (!featureAvailable(tourRef.current, 'wardrobe')) return; tourEvent('wardrobe-open'); setScreen(10); }} onSelectLesson={requestLesson} onContinue={() => requestLesson(lessonOrder.find(n => !completed.includes(n)) ?? 26)} />}
    {screen === 1 && <LessonScreen onBack={() => setScreen(0)}
      onComplete={() => { setElectronCollected(true); finish(1); }} />}
    {screen === 2 && <LessonTwoScreen onHome={() => setScreen(0)} onComplete={() => finish(2)} />}
    {screen === 3 && <DoubleSlitScreen onHome={() => setScreen(0)} onContinue={() => finish(3)} />}
    {screen === 4 && <LessonFourScreen onPredictionComplete={round => { if (predictionRewards.current.has(round)) return false; predictionRewards.current.add(round); return true; }} onHome={() => setScreen(0)} onComplete={() => finish(4)} />}
    {screen === 5 && <LessonFiveScreen onHome={() => setScreen(0)} onComplete={() => finish(5)} />}
    {screen === 6 && <LessonSixScreen onHome={() => setScreen(0)} onComplete={() => finish(6)} />}
    {screen === 7 && <LessonSevenScreen onHome={() => setScreen(0)} onComplete={() => finish(7)} />}
    {screen === 8 && <LessonEightScreen onHome={() => setScreen(0)} onComplete={() => finish(8)} />}
    {screen === 9 && <LessonNineScreen onHome={() => setScreen(0)} ownedAccessories={rewardExclusions} onUnlockAccessories={unlockAccessories} onComplete={() => { const firstCompletion = !completedRef.current.has(9); finish(9); if (firstCompletion) setUnlockedWorld(2); setScreen(0); }} />}
    {screen === 10 && <CustomisationScreen creatorPreviewAvailable={!profile || tester} particle={particle} particleName={particleName} equipped={equippedAccessories} owned={ownedAccessories} electronUnlocked={electronCollected} photonUnlocked={completed.includes(13)} knowledge={knowledge.total} energy={DAILY_LIFE_LIMIT} quanta={quanta} onParticle={setParticle} onAccessory={equipAccessory} onBack={() => setScreen(0)} onShop={() => { tourEvent('market-open'); setScreen(34); }} />}
    {screen === 11 && <ModuleTwoLessonOneScreen onHome={() => setScreen(0)} onComplete={() => finish(11)} />}
    {screen === 12 && <ModuleTwoLessonTwoScreen onHome={() => setScreen(0)} onComplete={() => finish(12)} />}
    {screen === 13 && <ModuleTwoLessonThreeScreen onHome={() => setScreen(0)} onChoosePhoton={() => setParticle('photon')} onComplete={() => finish(13)} />}
    {screen === 14 && <ModuleTwoLessonFourScreen onHome={() => setScreen(0)} onComplete={() => finish(14)} />}
    {screen === 15 && <ModuleTwoLessonFiveScreen onHome={() => setScreen(0)} onComplete={() => finish(15)} />}
    {screen === 16 && <ModuleTwoLessonSixScreen onHome={() => setScreen(0)} onComplete={() => finish(16)} />}
    {screen === 17 && <ModuleTwoLessonSevenScreen onHome={() => setScreen(0)} onComplete={() => finish(17)} />}
    {screen === 18 && <ModuleTwoLessonEightScreen onHome={() => setScreen(0)} ownedAccessories={rewardExclusions} onUnlockAccessories={unlockAccessories} onComplete={() => { const firstCompletion = !completedRef.current.has(18); finish(18); if (firstCompletion) setUnlockedWorld(3); }} />}
    {screen === 19 && <ModuleThreeLessonSevenScreen onHome={() => setScreen(0)} onComplete={() => finish(19)} />}
    {screen === 20 && <ModuleThreeLessonOneScreen onHome={() => setScreen(0)} onComplete={() => finish(20)} />}
    {screen === 21 && <ModuleThreeLessonTwoScreen onHome={() => setScreen(0)} onComplete={() => finish(21)} />}
    {screen === 22 && <ModuleThreeLessonThreeScreen onHome={() => setScreen(0)} onComplete={() => finish(22)} />}
    {screen === 23 && <ModuleThreeLessonFourScreen onHome={() => setScreen(0)} onComplete={() => finish(23)} />}
    {screen === 24 && <ModuleThreeLessonFiveScreen onHome={() => setScreen(0)} onComplete={() => finish(24)} />}
    {screen === 25 && <ModuleThreeLessonSixScreen onHome={() => setScreen(0)} onComplete={() => finish(25)} />}
    {screen === 31 && <ModuleThreeLessonEightScreen onHome={() => setScreen(0)} ownedAccessories={rewardExclusions} onUnlockAccessories={unlockAccessories} onComplete={() => { const firstCompletion = !completedRef.current.has(31); finish(31); if (firstCompletion) setUnlockedWorld(4); }} />}
    {screen === 26 && <ModuleFourLessonOneScreen onHome={() => setScreen(0)} onComplete={() => finish(26)} />}
    {screen === 27 && <ModuleFourLessonTwoScreen onHome={() => setScreen(0)} onComplete={() => finish(27)} />}
    {screen === 28 && <ModuleFourLessonThreeScreen onHome={() => setScreen(0)} onComplete={() => finish(28)} />}
    {screen === 29 && <ModuleFourLessonFourScreen onHome={() => setScreen(0)} onComplete={() => finish(29)} />}
    {screen === 30 && <ModuleFourLessonFiveScreen onHome={() => setScreen(0)} onComplete={() => finish(30)} />}
    {screen === 32 && <ModuleFourLessonSixScreen onHome={() => setScreen(0)} ownedAccessories={rewardExclusions} onUnlockAccessories={unlockAccessories} onComplete={() => finish(32)} />}
    {screen === 33 && <AchievementsScreen progress={achievementProgress} quanta={quanta} owned={rewardExclusions} onBack={() => { tourEvent('achievements-home'); setScreen(0); }} onClaim={claimBadge} onOpenPacket={openAchievementPacket} onDismissNotice={dismissAchievement} />}
    {screen === 34 && <ShopScreen quanta={quanta} owned={ownedAccessories} packet={shop.packet} onBuy={purchasePacket} onRip={openPurchasedPacket} onFinishPacket={closePurchasedPacket} onBack={() => { tourEvent('shop-back'); setScreen(10); }} />}
    {pendingLesson && <LessonEntryModal lesson={pendingLesson.label} onPlay={() => resolveEntry(true)} onLater={() => resolveEntry(false)} />}
    <AchievementToast id={achievementProgress.notices[0]} enabled={ready && !tourVisible && !pendingLesson && screen !== 33 && !unlockedWorld && !(screen === 0 && knowledge.celebrations.length > 0)} onDismiss={dismissAchievement} />
    <TourOverlay />
    <ArtworkPreloader key={preloadWorld} sources={worldPreloads} onReady={() => setArtworkReadyWorld(preloadWorld)} />
    {!ready && <LoadingScreen fontsReady={loaded} />}
  </View></LessonNavigationProvider></DictionaryProvider></KnowledgeProvider></OnboardingProvider></QuizCompanionProvider>;
}

const styles = StyleSheet.create({
  app: { flex: 1 },
  preloadShelf: { position: 'absolute', left: -10000, top: -10000, width: 256, height: 256, opacity: 0.01 },
  preloadImage: { position: 'absolute', width: 256, height: 256 },
});
