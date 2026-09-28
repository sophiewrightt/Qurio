import { useEffect, useRef } from 'react';
import { Animated, Easing, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

export function HoveringImage({ source, style, accessibilityLabel }: {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel: string;
}) {
  const hover = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(hover, { toValue: -9, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(hover, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [hover]);

  return <Animated.Image accessibilityLabel={accessibilityLabel} source={source} resizeMode="contain" style={[style, { transform: [{ translateY: hover }] }]} />;
}
