import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

/** Optional depth never gates lesson completion or adds assessed material. */
export function ExploreFurther({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <View style={styles.section}>
    <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }}
      onPress={() => setOpen(value => !value)} style={styles.toggle}>
      <Text style={styles.title}>{open ? '−' : '+'} {title}</Text>
      <Text style={styles.optional}>Explore further · optional</Text>
    </Pressable>
    {open && <View style={styles.content}>{children}</View>}
  </View>;
}
const styles = StyleSheet.create({
  section: { width: '100%', marginVertical: 12 },
  toggle: { minHeight: 60, paddingVertical: 12 },
  title: { fontFamily: fonts.body, color: colors.primaryDark, fontSize: 23 },
  optional: { fontFamily: fonts.body, color: colors.muted, fontSize: 17, marginTop: 4 },
  content: { paddingTop: 8 },
});
