import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Birthday, isValidBirthday } from '../data/greetings';
import { PrimaryButton } from './PrimaryButton';
import { colors, fonts } from '../constants/theme';

// Mounted anew when opened so unsaved edits never leak into the profile.
export function ProfileModal({ birthday, onSave, onClose }: {
  birthday?: Birthday; onSave: (birthday?: Birthday) => void; onClose: () => void;
}) {
  const [day, setDay] = useState(birthday ? String(birthday.day) : '');
  const [month, setMonth] = useState(birthday ? String(birthday.month) : '');
  const [error, setError] = useState('');
  const save = () => {
    if (!day && !month) { onSave(undefined); onClose(); return; }
    const value = { day: Number(day), month: Number(month) };
    if (!isValidBirthday(value)) { setError('Please enter a real day and month, like 25 and 12.'); return; }
    onSave(value); onClose();
  };
  return <Modal transparent visible animationType="fade" onRequestClose={onClose}>
    <KeyboardAvoidingView style={styles.backdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <View accessibilityViewIsModal style={styles.card}>
          <Text style={styles.title}>Your profile</Text>
          <Text style={styles.body}>When’s your birthday?</Text>
          <Text style={styles.hint}>Optional, just for a birthday greeting from your pal. No year needed.</Text>
          <View style={styles.fields}>
            <View style={styles.field}><Text style={styles.label}>Day</Text><TextInput accessibilityLabel="Birthday day" placeholder="DD" value={day} keyboardType="number-pad" maxLength={2} onChangeText={text => { setDay(text.replace(/\D/g, '')); setError(''); }} style={styles.input} /></View>
            <View style={styles.field}><Text style={styles.label}>Month</Text><TextInput accessibilityLabel="Birthday month" placeholder="MM" value={month} keyboardType="number-pad" maxLength={2} onChangeText={text => { setMonth(text.replace(/\D/g, '')); setError(''); }} style={styles.input} /></View>
          </View>
          {Boolean(error) && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Text style={styles.hint}>Leave both blank to remove your birthday. Profile details last for this prototype session.</Text>
          <PrimaryButton label="Save profile" onPress={save} />
          <PrimaryButton label="Cancel" secondary onPress={onClose} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </Modal>;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay }, scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 430, padding: 22, borderWidth: 3, borderColor: colors.ink, borderRadius: 26, backgroundColor: colors.background },
  title: { fontFamily: fonts.display, fontSize: 34, color: colors.ink, marginBottom: 12 },
  body: { fontFamily: fonts.body, fontSize: 24, color: colors.ink }, hint: { fontFamily: fonts.body, fontSize: 18, lineHeight: 24, color: colors.muted, marginVertical: 10 },
  fields: { flexDirection: 'row', gap: 18, marginVertical: 8 }, field: { flex: 1 }, label: { fontFamily: fonts.body, fontSize: 20, color: colors.ink },
  input: { borderWidth: 2, borderRadius: 12, borderColor: colors.ink, backgroundColor: colors.surface, fontFamily: fonts.body, fontSize: 24, padding: 12, marginTop: 5, color: colors.ink },
  error: { fontFamily: fonts.body, fontSize: 18, color: '#A32A34', marginVertical: 8 },
});
