import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { AccessoryId, ParticleId, accessoryById, particleCatalog } from '../data/customisation';

export function ParticleAvatar({ size = 190, discovered = false, particle = 'electron', accessories = [], floating = true, groundShadow = false, happy = false }: {
  size?: number; discovered?: boolean; particle?: ParticleId; accessories?: AccessoryId[]; floating?: boolean; groundShadow?: boolean; happy?: boolean;
}) {
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!floating) { y.setValue(0); return; }
    const loop = Animated.loop(Animated.sequence([Animated.timing(y, { toValue: -7, duration: 1500, useNativeDriver: true }), Animated.timing(y, { toValue: 0, duration: 1500, useNativeDriver: true })]));
    loop.start();
    return () => loop.stop();
  }, [floating, y]);
  const happySources = {
    electron: require('../assets/particles/electron-content.png'),
    photon: require('../assets/lesson-9/photon-happy-transparent.png'),
    gluon: require('../assets/module-3/lesson-2/gluon-happy-transparent.png'),
  };
  const source = happy ? happySources[particle] : particleCatalog.find(item => item.id === particle)?.source ?? particleCatalog[0]!.source;
  // The electron and every accessory use the same square source canvas.
  // Match the solid face circles, NOT the orange halo. The photon source is
  // 1024x883 with a ~420px yellow core; the electron core is ~280px on 460px.
  // Contain letterboxes the non-square photon within this square image view.
  const particleScale = particle === 'photon' ? (happy ? 1.32 : 1.48) : happy && particle === 'electron' ? 1.04 : 1;
  const particleSize = size * particleScale;
  const particleOffset = (size - particleSize) / 2;
  const particleNudge = particle === 'photon' ? (happy ? { x: 0, y: 0 } : { x: size * 0.015, y: size * 0.027 }) : { x: 0, y: 0 };
  return <View style={[styles.wrap, { width: size, height: size }]}>
    {groundShadow && <View pointerEvents="none" style={[styles.groundShadow, { width: size * 0.56, height: size * 0.105, borderRadius: size, bottom: size * 0.025 }]} />}
    <Animated.View pointerEvents="none" style={[styles.floatLayer, { width: size, height: size, transform: [{ translateY: y }] }]}>
      <Image source={source} resizeMode="contain" style={[styles.particle, { width: particleSize, height: particleSize, left: particleOffset + particleNudge.x, top: particleOffset + particleNudge.y }]} accessibilityLabel={`${happy ? 'Happy ' : ''}${particle} avatar`} />
      {accessories.map(id => {
        const item = accessoryById(id);
        if (!item) return null;
        return <Image key={id} source={item.source} resizeMode="contain" accessibilityLabel={`${item.name} accessory`} style={[styles.accessory, { width: size, height: size, left: 0, top: 0 }]} />;
      })}
    </Animated.View>
  </View>;
}
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  floatLayer: { position: 'absolute', left: 0, top: 0 },
  particle: { position: 'absolute', zIndex: 1 },
  groundShadow: { position: 'absolute', alignSelf: 'center', backgroundColor: '#56625D', opacity: 0.18, transform: [{ scaleY: 0.72 }] },
  accessory: { position: 'absolute', zIndex: 3 },
});
