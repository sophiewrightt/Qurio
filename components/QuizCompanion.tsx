import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, View } from 'react-native';
import { ParticleAvatar } from './ParticleAvatar';
import type { ParticleId, AccessoryId } from '../data/customisation';

type Companion = { visible: boolean; particle: ParticleId; accessories: AccessoryId[] };
const Context = createContext<Companion>({ visible: false, particle: 'electron', accessories: [] });
export function QuizCompanionProvider({ children, ...companion }: Companion & { children: ReactNode }) {
  return <Context.Provider value={companion}>{children}</Context.Provider>;
}
export function QuizCompanion({ correct, questionKey }: { correct: boolean; questionKey: number }) {
  const companion = useContext(Context);
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let alive = true;
    let animation: Animated.CompositeAnimation | undefined;
    y.setValue(0);
    if (companion.visible && correct) {
      AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
        if (!alive || reduced) return;
        animation = Animated.sequence([
          Animated.timing(y, { toValue: -22, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }),
          Animated.timing(y, { toValue: 0, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }),
        ]);
        animation.start();
      });
    }
    return () => { alive = false; animation?.stop(); y.stopAnimation(); };
  }, [correct, questionKey, companion.visible, y]);
  if (!companion.visible) return null;
  return <View pointerEvents="none" style={{ alignItems: 'flex-end', paddingTop: 24 }}>
    <Animated.View style={{ transform: [{ translateY: y }] }}>
      <ParticleAvatar size={116} particle={companion.particle} accessories={companion.accessories} happy={correct} floating={false} />
    </Animated.View>
  </View>;
}
