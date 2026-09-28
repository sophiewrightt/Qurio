import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
export type Sprite = { source: ImageSourcePropType; frame: readonly [number, number, number, number] };
// Frames are relative to the original square canvas. No source pixels are edited.
export function spriteLayout(sprite: Sprite, width: number, height: number) {
  const [x, y, w, h] = sprite.frame;
  const canvas = Math.min(width / w, height / h);
  return { canvas, left: (width - w * canvas) / 2 - x * canvas, top: (height - h * canvas) / 2 - y * canvas };
}
export function FramedSprite({ sprite, width, height, onLoad, onError, paper }: { sprite: Sprite; width: number; height: number; onLoad?: () => void; onError?: () => void; paper?: string }) {
  const { canvas, left, top } = spriteLayout(sprite, width, height);
  const [x, y, w, h] = sprite.frame;
  return <View collapsable={false} pointerEvents="none" style={{ width, height }}>
    <View collapsable={false} style={{ position: 'absolute', left: left + x * canvas, top: top + y * canvas, width: w * canvas, height: h * canvas, overflow: 'hidden', backgroundColor: paper }}>
      <Image source={sprite.source} onLoad={onLoad} onError={onError} fadeDuration={0} style={[paper ? scanStyles.blend : undefined, { position: 'absolute', width: canvas, height: canvas, left: -x * canvas, top: -y * canvas }]} resizeMode="stretch" />
    </View>
  </View>;
}
const scanStyles = StyleSheet.create({ blend: { position: 'absolute', mixBlendMode: 'multiply' } });
