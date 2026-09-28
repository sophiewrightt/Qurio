import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { WallPattern } from './WallPattern';

const basketball = require('../assets/lesson-1/basketball.png');
const rubber = require('../assets/lesson-1/explore/rubber.png');
const carbon = require('../assets/lesson-1/explore/carbon.png');
const electronOpenMouth = require('../assets/lesson-9/electron-open-mouth-transparent.png');
const dice = require('../assets/lesson-9/dice-transparent.png');

const stopTitles = [
  'Everyday world',
  'Matter',
  'Atoms',
  'Elementary particles',
  'Interference',
  'Probability + measurement',
  'Heisenberg uncertainty',
] as const;

function DownArrow() {
  return <View pointerEvents="none" style={styles.downArrow}>
    <View style={styles.arrowLine} />
    <View style={styles.arrowPoint} />
  </View>;
}

function MapSpot({ index, title, visited, onPress, children, compact = false }: {
  index: number; title: string; visited: boolean; onPress: (index: number) => void; children: ReactNode; compact?: boolean;
}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Review ${title}`} accessibilityState={{ selected: visited }}
    onPress={() => onPress(index)} style={({ pressed }) => [styles.spot, compact && styles.compactSpot, pressed && styles.pressed]}>
    <View style={[styles.picture, compact && styles.compactPicture]}>{children}</View>
    <Text style={[styles.label, compact && styles.compactLabel]}>{title}</Text>
    {visited && <View style={styles.checkBubble}><Text style={styles.check}>✓</Text></View>}
  </Pressable>;
}

export function LearningMap({ onComplete }: { onComplete: () => void }) {
  const [visited, setVisited] = useState<number[]>([]);
  const completed = useRef(false);
  const visit = (index: number) => {
    setVisited(old => {
      if (old.includes(index)) return old;
      const next = [...old, index];
      if (next.length === stopTitles.length && !completed.current) {
        completed.current = true;
        onComplete();
      }
      return next;
    });
  };

  return <View style={styles.map}>
    <MapSpot index={0} title={stopTitles[0]} visited={visited.includes(0)} onPress={visit}>
      <Image source={basketball} resizeMode="contain" style={styles.basketball} />
    </MapSpot>
    <DownArrow />
    <MapSpot index={1} title={stopTitles[1]} visited={visited.includes(1)} onPress={visit}>
      <Image source={rubber} resizeMode="contain" style={styles.rubberImage} />
    </MapSpot>
    <DownArrow />
    <MapSpot index={2} title={stopTitles[2]} visited={visited.includes(2)} onPress={visit}>
      <Image source={carbon} resizeMode="contain" style={styles.carbonImage} />
    </MapSpot>
    <DownArrow />
    <MapSpot index={3} title={stopTitles[3]} visited={visited.includes(3)} onPress={visit}>
      <Image source={electronOpenMouth} resizeMode="contain" style={styles.coreImage} />
    </MapSpot>

    <Text style={styles.behaviourTitle}>ELEMENTARY PARTICLE BEHAVIOUR</Text>
    <View pointerEvents="none" style={styles.fork}>
      <View style={styles.forkStem} /><View style={styles.forkBar} />
      <View style={[styles.forkDrop, { left: 33 }]} /><View style={[styles.forkDrop, { left: 144 }]} /><View style={[styles.forkDrop, { right: 33 }]} />
    </View>
    <View style={styles.behaviours}>
      <MapSpot compact index={4} title={stopTitles[4]} visited={visited.includes(4)} onPress={visit}>
        <WallPattern kind="interference" />
      </MapSpot>
      <MapSpot compact index={5} title={stopTitles[5]} visited={visited.includes(5)} onPress={visit}>
        <Image source={dice} resizeMode="contain" style={styles.dice} />
      </MapSpot>
      <MapSpot compact index={6} title={stopTitles[6]} visited={visited.includes(6)} onPress={visit}>
        <View style={styles.questionCircle}><Text style={styles.questionMark}>?</Text></View>
      </MapSpot>
    </View>
    <Text style={styles.hint}>{visited.length}/{stopTitles.length} spots revisited · tap every picture</Text>
  </View>;
}

const styles = StyleSheet.create({
  map: { width: '100%', marginVertical: 26, alignItems: 'center' },
  spot: { width: 190, minHeight: 126, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, position: 'relative' },
  compactSpot: { width: '33.33%', minHeight: 154, justifyContent: 'flex-start' },
  pressed: { opacity: 0.68, transform: [{ scale: 0.97 }] },
  picture: { width: 160, height: 112, alignItems: 'center', justifyContent: 'center' },
  compactPicture: { width: 98, height: 86 },
  basketball: { width: 88, height: 88 },
  coreImage: { width: 114, height: 90 },
  rubberImage: { width: 154, height: 112 },
  carbonImage: { width: 148, height: 120 },
  dice: { width: 91, height: 78 },
  label: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 26, textAlign: 'center', marginTop: 2 },
  compactLabel: { fontSize: 17, lineHeight: 21, paddingHorizontal: 1 },
  checkBubble: { position: 'absolute', top: 1, right: 14, width: 34, height: 34, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D9F3D0', borderWidth: 2, borderColor: colors.green, transform: [{ rotate: '-7deg' }] },
  check: { color: colors.green, fontFamily: fonts.display, fontSize: 24, lineHeight: 27 },
  downArrow: { width: 36, height: 57, alignItems: 'center', marginVertical: 2 },
  arrowLine: { width: 4, height: 42, borderRadius: 3, backgroundColor: colors.ink, transform: [{ rotate: '-1deg' }] },
  arrowPoint: { width: 17, height: 17, marginTop: -15, borderRightWidth: 4, borderBottomWidth: 4, borderColor: colors.ink, transform: [{ rotate: '45deg' }] },
  behaviourTitle: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 18, letterSpacing: 1, textAlign: 'center', marginTop: 25 },
  fork: { width: 290, height: 55, position: 'relative' },
  forkStem: { position: 'absolute', left: 143, top: 0, width: 4, height: 21, borderRadius: 3, backgroundColor: colors.ink },
  forkBar: { position: 'absolute', left: 34, right: 34, top: 19, height: 4, borderRadius: 3, backgroundColor: colors.ink },
  forkDrop: { position: 'absolute', top: 19, width: 4, height: 34, borderRadius: 3, backgroundColor: colors.ink },
  behaviours: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  questionCircle: { width: 72, height: 72, borderRadius: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEE9FF', borderWidth: 3, borderColor: colors.primaryDark, transform: [{ rotate: '2deg' }] },
  questionMark: { color: colors.primaryDark, fontFamily: fonts.display, fontSize: 48, lineHeight: 55 },
  hint: { color: colors.ink, fontFamily: fonts.body, fontSize: 18, marginTop: 24, textAlign: 'center' },
});
