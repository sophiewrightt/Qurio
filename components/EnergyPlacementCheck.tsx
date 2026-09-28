import { useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnswerButton } from './AnswerButton';
import { PrimaryButton } from './PrimaryButton';
import { placementQuestions } from '../data/moduleTwo';
import { colors, fonts } from '../constants/theme';

import { useKnowledge } from './KnowledgeContext';

const placementArt = [
  require('../assets/module-2/energy-levels-quiz-1.jpg'),
  require('../assets/module-2/energy-levels-quiz-2.jpg'),
  require('../assets/module-2/energy-levels-quiz-3.jpg'),
];

export function EnergyPlacementCheck({ onFinish }: { onFinish: (correct: number) => void }) {
  const awardCorrect = useKnowledge();
  const answered = useRef(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string>();
  const score = useRef(0);
  const current = placementQuestions[index]!;
  const choose = (answer: string) => { if (answered.current) return; answered.current = true; setSelected(answer); if (answer === current.answer) { score.current += 1; awardCorrect(`check:energy-placement:${index}`); } };
  const next = () => {
    if (!selected) return;
    if (index === placementQuestions.length - 1) onFinish(score.current);
    else { answered.current = false; setIndex(value => value + 1); setSelected(undefined); }
  };
  return <ScrollView key={index} contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>ENERGY CHECK · {index + 1} OF 3</Text><Text style={styles.question}>{current.prompt}</Text>
    <View style={styles.diagramStage}><Image accessibilityLabel={`Energy-level example ${index + 1}`} source={placementArt[index]} resizeMode="contain" style={styles.diagramArt} /></View>
    <View style={styles.answers}>{['Yes', 'No'].map(answer => <AnswerButton key={answer} label={answer} state={!selected ? 'default' : answer === current.answer ? 'correct' : answer === selected ? 'incorrect' : 'default'} disabled={!!selected} onPress={() => choose(answer)} />)}</View>
    {selected && <View style={styles.feedback}><Text style={styles.feedbackText}>{selected === current.answer ? 'Exactly!' : `Not quite - the answer is ${current.answer}.`} {current.explanation}</Text><PrimaryButton label={index === 2 ? 'Continue the lesson' : 'Next example'} onPress={next} /></View>}
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 70 }, eyebrow: { color: colors.primary, fontFamily: fonts.display, fontSize: 14, letterSpacing: 1.2 }, question: { color: colors.ink, fontFamily: fonts.body, fontSize: 33, lineHeight: 40, marginVertical: 16 }, diagramStage: { height: 245, alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden', backgroundColor: colors.white, borderRadius: 20 }, diagramArt: { width: '100%', height: '100%', alignSelf: 'center' }, answers: { gap: 10 }, feedback: { marginTop: 24 }, feedbackText: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, lineHeight: 27, marginBottom: 18 },
});
