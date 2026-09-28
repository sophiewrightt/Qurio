import { Image, StyleSheet, Text, View } from 'react-native';
import { fonts } from '../constants/theme';

const worldOneBadges = [
  undefined,
  require('../assets/lesson-badges/world-1/1.png'),
  require('../assets/lesson-badges/world-1/2.png'),
  require('../assets/lesson-badges/world-1/3.png'),
  require('../assets/lesson-badges/world-1/4.png'),
  require('../assets/lesson-badges/world-1/5.png'),
  require('../assets/lesson-badges/world-1/6.png'),
  require('../assets/lesson-badges/world-1/7.png'),
  require('../assets/lesson-badges/world-1/8.png'),
  require('../assets/lesson-badges/world-1/9.png'),
];

const worldTwoBadges = [
  undefined,
  require('../assets/lesson-badges/world-2/1.png'),
  require('../assets/lesson-badges/world-2/2.png'),
  require('../assets/lesson-badges/world-2/3.png'),
  require('../assets/lesson-badges/world-2/4.png'),
  require('../assets/lesson-badges/world-2/5.png'),
  require('../assets/lesson-badges/world-2/6.png'),
  require('../assets/lesson-badges/world-2/7.png'),
  require('../assets/lesson-badges/world-2/8.png'),
  require('../assets/lesson-badges/world-2/9.png'),
];

const worldThreeBadges = [
  undefined,
  require('../assets/lesson-badges/world-3/1.png'),
  require('../assets/lesson-badges/world-3/2.png'),
  require('../assets/lesson-badges/world-3/3.png'),
  require('../assets/lesson-badges/world-3/4.png'),
  require('../assets/lesson-badges/world-3/5.png'),
  require('../assets/lesson-badges/world-3/6.png'),
  require('../assets/lesson-badges/world-3/7.png'),
  require('../assets/lesson-badges/world-3/8.png'),
];

const worldFourBadges = [undefined,
  require('../assets/lesson-badges/world-4/1.png'),
  require('../assets/lesson-badges/world-4/2.png'),
  require('../assets/lesson-badges/world-4/3.png'),
  require('../assets/lesson-badges/world-4/4.png'),
  require('../assets/lesson-badges/world-4/5.png'),
  require('../assets/lesson-badges/world-4/6.png'),
  require('../assets/lesson-badges/world-4/7.png'),
];

export function lessonBadgeSource(world: 1 | 2 | 3 | 4, number: number) {
  const badges = world === 4 ? worldFourBadges : world === 3 ? worldThreeBadges : world === 2 ? worldTwoBadges : worldOneBadges;
  return badges[number] ?? worldOneBadges[1];
}

export function LessonBadge({ number, world = 1, compact = false }: { number: number; world?: 1 | 2 | 3 | 4; compact?: boolean }) {
  return <View accessibilityLabel={'Lesson ' + number} style={[styles.wrap, compact && styles.compactWrap]}>
    {!compact && <Text style={[styles.label, world === 2 && styles.worldTwoLabel, world === 3 && styles.worldThreeLabel]}>LESSON</Text>}
    <Image source={lessonBadgeSource(world, number)} resizeMode="contain" style={[styles.orb, compact && styles.compactOrb]} />
  </View>;
}
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginVertical: 22 },
  label: { fontFamily: fonts.body, color: '#9E165E', fontSize: 18, letterSpacing: 3, marginBottom: 8 },
  worldTwoLabel: { color: '#C94F3A' },
  worldThreeLabel: { color: '#31946D' },
  orb: { width: 122, height: 122 },
  compactWrap: { height: 58, marginVertical: 2, paddingRight: 16, alignItems: 'flex-end' },
  compactOrb: { width: 56, height: 56 },
});
