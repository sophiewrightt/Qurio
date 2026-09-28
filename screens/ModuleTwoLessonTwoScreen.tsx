import { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AtomEnergyInspect } from '../components/AtomEnergyInspect';
import { EnergyAtomLab } from '../components/EnergyAtomLab';
import { EnergyPlacementCheck } from '../components/EnergyPlacementCheck';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { PrimaryButton } from '../components/PrimaryButton';
import { energyLevelQuestions } from '../data/moduleTwo';
import { colors, fonts } from '../constants/theme';

const stairs = require('../assets/module-2/stairs-transparent.png');

type Phase = 'recall' | 'placement' | 'learn' | 'quiz';
export function ModuleTwoLessonTwoScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [phase, setPhase] = useState<Phase>('recall');
  const [inspected, setInspected] = useState(false);
  const [energised, setEnergised] = useState(false);
  if (phase === 'placement') return <SafeAreaView style={styles.safe}><Text style={styles.module}>CHAPTER 2 · ENERGY CHECK</Text><EnergyPlacementCheck onFinish={() => setPhase('learn')} /></SafeAreaView>;
  if (phase === 'quiz') return <SafeAreaView style={styles.safe}><Text style={styles.module}>CHAPTER 2 · CHECKPOINT</Text><LessonQuiz questions={energyLevelQuestions} takeaway="Electrons bound inside atoms can occupy specific allowed energy states." onFinish={onComplete} /></SafeAreaView>;
  if (phase === 'learn') return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text><Text style={styles.module}>CHAPTER 2 · THE QUANTUM RULES</Text>
    <Text style={styles.body}>Just to clarify...</Text><Text style={styles.body}>These lines are a diagram of <Text style={styles.bold}>energy</Text>, not physical platforms inside the atom. Electrons do not literally sit on tiny shelves or orbit the nucleus like little planets.</Text>
    <Text style={styles.heading}>What does it mean to be at each level?</Text><Text style={styles.body}>The energy level it’s at corresponds to exactly that: how much energy the electron has. Here are the levels it can have.</Text>
    <EnergyAtomLab onEnergise={() => setEnergised(true)} />
    {energised && <><Text style={styles.heading}>What did adding a packet of energy do?</Text><Text style={styles.body}>The atom absorbed a packet matching the gap between two allowed energies. The electron moved to the higher energy level; the diagram is not a path through space.</Text><PrimaryButton label="Start the quiz" onPress={() => setPhase('quiz')} /></>}
    {!energised && <Text style={styles.hint}>Use the energy button to move the electron before continuing.</Text>}
  </ScrollView></SafeAreaView>;
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <Text accessibilityRole="button" onPress={onHome} style={styles.back}>‹ Home</Text><Text style={styles.module}>CHAPTER 2 · THE QUANTUM RULES</Text><LessonBadge number={2} world={2} />
    <Text style={styles.title}>Atomic energy levels</Text>
    <Text style={styles.body}>The staircase analogy was pretty simple: a quantised property can take particular allowed values.</Text>
    <Text style={styles.recallTitle}>Steps, not the spaces between</Text><View style={styles.recallStage}><Image source={stairs} resizeMode="contain" style={styles.recallStairs} /></View>
    <Text style={[styles.heading, styles.atomHeading]}>Do you remember the atom?</Text><Text style={[styles.body, styles.atomPrompt]}>Atoms contain electrons around a nucleus made of protons and neutrons. Drag the magnifying glass over the blue electron cloud to see what’s going on.</Text>
    <AtomEnergyInspect onInspect={() => setInspected(true)} />
    {inspected && <><Text style={styles.body}>Let’s check whether you can spot the allowed values.</Text><PrimaryButton label="Test yourself" onPress={() => setPhase('placement')} /></>}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 24, paddingBottom: 70 }, back: { color: colors.primary, fontFamily: fonts.body, fontSize: 20, paddingVertical: 16 }, module: { color: colors.coral, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.5, textAlign: 'center', marginTop: 10 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 40, lineHeight: 47, marginVertical: 20 }, heading: { color: colors.ink, fontFamily: fonts.body, fontSize: 30, lineHeight: 37, marginTop: 25, marginBottom: 12 }, body: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 29, marginBottom: 18 }, underline: { textDecorationLine: 'underline' }, bold: { fontFamily: fonts.display, fontWeight: '700' },
  recallTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 24, textAlign: 'center' }, recallStage: { width: 330, height: 210, alignSelf: 'center', overflow: 'hidden', marginBottom: 4 }, recallStairs: { position: 'absolute', width: 520, height: 363, left: -95, top: -82 }, atomHeading: { marginTop: 14 }, atomPrompt: { marginBottom: 2 }, hint: { color: colors.primary, fontFamily: fonts.body, fontSize: 19, textAlign: 'center', marginTop: 18 },
});
