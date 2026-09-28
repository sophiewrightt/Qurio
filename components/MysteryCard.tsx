import { View } from 'react-native';
import { MysteryPanel } from './MysteryPanel';
import { LessonFinishActions } from './LessonFinishActions';
export function MysteryCard({ onContinue }: { onContinue: () => void }) {
  return <View><MysteryPanel number={2} title="Wave-particle duality" body="Electrons arrive like particles, but together they make a wave-like pattern." />
    <LessonFinishActions onComplete={onContinue} />
  </View>;
}
