import { View } from 'react-native';
import { FramedSprite } from './FramedSprite';
import { CrayonMark } from './CrayonMark';

// Frame the artwork, excluding its large transparent canvas margins.
export function MysteryIcon({ unlocked = false }: { unlocked?: boolean }) {
  return <View style={{ alignSelf: 'center', marginBottom: 16 }}>
    <FramedSprite sprite={{ source: unlocked ? require('../assets/lesson-1/explore/empty-lens.png') : require('../assets/mystery-icon.png'), frame: [.34, .20, .32, .38] }} width={180} height={200} />
    {unlocked && <View pointerEvents="none" style={{ position: 'absolute', left: 48, top: 43, transform: [{ scale: 2 }] }}><CrayonMark kind="correct" /></View>}
  </View>;
}
