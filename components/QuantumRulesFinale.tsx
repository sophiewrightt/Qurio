import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { FinalQuizRequirement } from './FinalQuizRequirement';
import { quantumRulesChallengeQuestions } from '../data/moduleTwo';
import { FloatingRecapParticle, QuizRefresherNote } from './WorldQuizRecap';
import { LessonFinishActions } from './LessonFinishActions';
import { RewardPack } from './RewardPack';
import { WorldCelebration } from './WorldCelebration';
import { AccessoryId } from '../data/customisation';
import { colors, fonts, spacing } from '../constants/theme';

const electron = require('../assets/particles/electron-content.png');
const stairs = require('../assets/module-2/stairs-transparent.png');
const energyLevels = require('../assets/module-2/energy-levels-transparent.png');
const photon = require('../assets/particles/photon.png');
const quantumState = require('../assets/module-2/lesson-4/possibility-cloud-transparent.png');
const superposition = require('../assets/module-2/lesson-5/state-a-and-b-centered-transparent.png');
const measurement = require('../assets/module-2/lesson-6/outcome-a-transparent.png');
const celebratingPhoton = require('../assets/module-2/lesson-8/photon-celebrating-transparent.png');
const celebrationShadow = require('../assets/module-2/lesson-8/shadow-transparent.png');

const rules = [
  ['Quantisation', 'Some properties have specific allowed values.'],
  ['Energy levels', 'Electrons in atoms occupy allowed energy states.'],
  ['Photons', 'Atoms can absorb or emit packets of electromagnetic energy.'],
  ['Quantum states', 'States determine the probabilities of possible measurement outcomes.'],
  ['Superposition', 'Quantum states can contain combinations of possibilities.'],
  ['Measurement', 'Measurement produces one definite outcome according to quantum probabilities.'],
] as const;

const ruleSprites = [stairs, energyLevels, photon, quantumState, superposition, measurement];

export function QuantumRulesFinale({ onStartChallenge }: { onStartChallenge: () => void }) {
  return <View>
    <FloatingRecapParticle particle="photon" />
    <Text style={styles.intro}>Here are the ideas you’ve uncovered about the rules that shape individual quantum systems.</Text>
    <View style={styles.ruleList}>{rules.map(([name, meaning], index) => <View key={name} style={styles.ruleRow}>
      <View style={[styles.ruleSpriteFrame, { backgroundColor: index % 2 ? '#F8CDBE' : '#DCD4F7' }]}><Image accessibilityLabel={`${name} lesson sprite`} source={ruleSprites[index]} resizeMode="contain" style={styles.ruleSprite} /></View>
      <View style={styles.ruleCopy}><Text style={styles.ruleName}>{name}</Text><Text style={styles.ruleMeaning}>{meaning}</Text></View>
    </View>)}</View>
    <FinalQuizRequirement total={quantumRulesChallengeQuestions.length} />
    <PrimaryButton label="Start the final challenge" onPress={onStartChallenge} />
    <QuizRefresherNote />
  </View>;
}

function ConnectedParticles() {
  const glow = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0.3, duration: 800, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [glow]);
  return <View accessibilityLabel="Two quantum particles forming a glowing connection" style={styles.connectionScene}>
    <Image source={electron} resizeMode="contain" style={styles.connectedElectron} />
    <View style={styles.connectionTrack}><Animated.View style={[styles.connectionGlow, { opacity: glow }]} /></View>
    <Image source={electron} resizeMode="contain" style={styles.connectedElectron} />
  </View>;
}

export function QuantumBuildingFinale({ score, onFinish, onUnlockAccessories, ownedAccessories = [] }: {
  score: number;
  onFinish: () => void;
  onUnlockAccessories?: (ids: AccessoryId[]) => void;
  ownedAccessories?: AccessoryId[];
}) {
  return <View>
    <Text style={styles.score}>FINAL CHALLENGE · {score}/5</Text>
    <Text style={styles.finaleTitle}>Chapter 2 complete!</Text>
    <WorldCelebration source={celebratingPhoton} shadowSource={celebrationShadow} accessibilityLabel="A celebrating photon jumps while colourful confetti falls" />
    <Text style={styles.finaleBody}>You’ve uncovered some of the basic rules governing the quantum world.</Text>
    <Text style={styles.finaleBody}>But so far, we’ve mostly explored <Text style={styles.emphasis}>individual quantum systems</Text>.</Text>
    <ConnectedParticles />
    <Text style={styles.nextQuestion}>What happens when quantum systems start interacting?</Text>
    <Text style={styles.nextWorld}>There are more weird things to find out in Chapter 3!</Text>
    <RewardPack onOpen={onUnlockAccessories} excludeIds={ownedAccessories} />
    <LessonFinishActions next={false} homeLabel="Finish Chapter 2" onComplete={onFinish} />
  </View>;
}

const styles = StyleSheet.create({
  intro: { color: colors.ink, fontFamily: fonts.body, fontSize: 23, lineHeight: 30, marginBottom: 18 },
  ruleList: { gap: 13, marginBottom: spacing.xl },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  ruleSpriteFrame: { width: 62, height: 62, alignItems: 'center', justifyContent: 'center', borderRadius: 18, transform: [{ rotate: '-2deg' }] },
  ruleSprite: { width: 58, height: 58 },
  ruleCopy: { flex: 1, paddingBottom: 10, borderBottomWidth: 1.5, borderBottomColor: '#D8D0C3' },
  ruleName: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 23 },
  ruleMeaning: { color: colors.ink, fontFamily: fonts.body, fontSize: 19, lineHeight: 24, marginTop: 2 },
  score: { color: colors.coral, fontFamily: fonts.display, fontSize: 18, textAlign: 'center', letterSpacing: 0.6 },
  finaleTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 41, lineHeight: 48, textAlign: 'center', marginTop: 8 },
  finaleBody: { color: colors.ink, fontFamily: fonts.body, fontSize: 23, lineHeight: 30, marginTop: 18, marginBottom: 15 },
  emphasis: { fontFamily: fonts.display, color: colors.primaryDark },
  connectionScene: { height: 118, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  connectedElectron: { width: 82, height: 82, zIndex: 2 },
  connectionTrack: { width: 108, height: 16, justifyContent: 'center', marginHorizontal: -8 },
  connectionGlow: { height: 13, borderRadius: 8, backgroundColor: '#8E7AE4', shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 9, elevation: 4 },
  nextQuestion: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 29, lineHeight: 36, textAlign: 'center', marginBottom: 24 },
  nextWorld: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, textAlign: 'center', marginTop: -12, marginBottom: 24 },
});
