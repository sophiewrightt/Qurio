import { Image, View, type ImageStyle, type ViewStyle } from 'react-native';
import { achievementArt } from '../data/achievementArt';
import { colors } from '../constants/theme';

// Shared optical frame preserves the original scans without modifying their pixels.
export function AchievementBadge({ id, size = 96, locked = false }: { id: string; size?: number; locked?: boolean }) {
  const canvas = size / 0.205;
  const scanStyle: ImageStyle & ViewStyle = { position: 'absolute', width: canvas, height: canvas, left: -0.385 * canvas, top: -0.33 * canvas, mixBlendMode: 'multiply', opacity: locked ? 0.4 : 1, filter: locked ? 'grayscale(100%)' : undefined };
  return <View pointerEvents="none" style={{ width: size, height: size, overflow: 'hidden', backgroundColor: colors.background }}>
    <Image source={achievementArt[id]} resizeMode="stretch" style={scanStyle} />
  </View>;
}
