import { useEffect, useRef, useState } from 'react';
import { Animated, Image, NativeSyntheticEvent, StyleSheet, Text, View, type NativeTouchEvent } from 'react-native';
import { colors, fonts, shadow } from '../constants/theme';

const atom = require('../assets/lesson-1/explore/carbon.png');
const magnifier = require('../assets/lesson-1/explore/empty-lens.png');
const energyLevels = require('../assets/module-2/energy-levels-transparent.png');
const energyLevelsWithSteps = require('../assets/module-2/energy-levels-with-steps-transparent.png');
const electron = require('../assets/particles/electron-avatar.png');

export function EnergyLevelsDiagram({ position = 1, showSteps = false, pulseSteps = false, compact = false }: { position?: number; showSteps?: boolean; pulseSteps?: boolean; compact?: boolean }) {
  const stepFade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!pulseSteps) { stepFade.setValue(0); return; }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(stepFade, { toValue: 1, duration: 1100, useNativeDriver: true }),
      Animated.timing(stepFade, { toValue: 0, duration: 1100, useNativeDriver: true }),
    ]));
    animation.start(); return () => animation.stop();
  }, [pulseSteps, stepFade]);
  const imageHeight = compact ? 190 : 220;
  const artTop = compact ? 10 : 14;
  const height = imageHeight + artTop + 10;
  const imageWidth = compact ? 285 : 315;
  const electronSize = compact ? 48 : 56;
  // These positions match the actual, intentionally uneven rows in Sophie's artwork.
  const levelLineTop = compact ? [151, 63, 29] : [175, 78, 39];
  const lowerLevel = Math.max(1, Math.min(3, Math.floor(position)));
  const upperLevel = Math.max(1, Math.min(3, Math.ceil(position)));
  const fraction = position - Math.floor(position);
  const lineTop = levelLineTop[lowerLevel - 1]! + (levelLineTop[upperLevel - 1]! - levelLineTop[lowerLevel - 1]!) * fraction;
  const electronTop = lineTop - electronSize / 2;
  return <View style={[styles.diagram, { height }]} accessibilityLabel={`Electron energy shown at level ${position}`}>
    <Image source={showSteps ? energyLevelsWithSteps : energyLevels} resizeMode="contain" style={[styles.energyDiagramArt, { width: imageWidth, height: imageHeight, top: artTop }]} />
    {pulseSteps && <Animated.Image source={energyLevelsWithSteps} resizeMode="contain" style={[styles.energyDiagramArt, { width: imageWidth, height: imageHeight, top: artTop, opacity: stepFade }]} />}
    <Image source={electron} resizeMode="contain" style={[styles.diagramElectron, { width: electronSize, height: electronSize, top: electronTop }]} />
  </View>;
}

export function AtomEnergyInspect({ onInspect }: { onInspect?: () => void }) {
  const [lensX, setLensX] = useState(285);
  const [inspected, setInspected] = useState(false);
  const moveLens = (event: NativeSyntheticEvent<NativeTouchEvent>) => {
    const x = Math.max(100, Math.min(300, event.nativeEvent.locationX));
    setLensX(x);
    if (x < 185) { setInspected(true); onInspect?.(); }
  };
  return <View>
    <View accessible accessibilityRole="button" accessibilityLabel="Drag the magnifying glass over the atom" onAccessibilityTap={() => { setInspected(true); onInspect?.(); }}
      onStartShouldSetResponderCapture={() => true} onMoveShouldSetResponderCapture={() => true} onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true}
      onResponderGrant={moveLens} onResponderMove={moveLens} onResponderTerminationRequest={() => false} style={styles.inspectStage}>
      <View pointerEvents="none" style={styles.visualLayer}>
        <Image source={atom} resizeMode="contain" style={styles.atom} accessibilityLabel="A carbon atom with a fuzzy electron cloud" />
        <Image source={magnifier} resizeMode="contain" style={[styles.lens, { left: lensX - 115 }]} />
      </View>
    </View>
    {inspected && <View style={styles.reveal}><Text style={styles.revealTitle}>The electron cloud</Text><Text style={styles.revealBody}>The cloud isn’t what an electron literally looks like. It shows the <Text style={styles.underline}>probabilities</Text> of where the electron could be found. Different allowed energy states can give the cloud different shapes.{`\n\n`}Electrons have quantised energies - like the staircase. They can’t sit in between these levels.</Text><EnergyLevelsDiagram pulseSteps /></View>}
  </View>;
}

const styles = StyleSheet.create({
  inspectStage: { height: 255, width: '100%', overflow: 'hidden' }, visualLayer: { position: 'absolute', inset: 0 },
  atom: { position: 'absolute', width: 230, height: 230, left: -8, top: 12 }, lens: { position: 'absolute', width: 230, height: 230, top: 12, zIndex: 4 },
  reveal: { marginTop: 6, padding: 17, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.ink, borderRadius: 19, ...shadow }, revealTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 25, textAlign: 'center' }, revealBody: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, lineHeight: 27, textAlign: 'center', marginTop: 7 },
  underline: { textDecorationLine: 'underline' },
  diagram: { width: '100%', marginTop: 10, overflow: 'hidden', alignItems: 'center' }, energyDiagramArt: { position: 'absolute', top: 0, alignSelf: 'center' }, diagramElectron: { position: 'absolute', left: 22, zIndex: 3 },
});
