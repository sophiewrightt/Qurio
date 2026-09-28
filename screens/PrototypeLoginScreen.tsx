import { useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { type PrototypeProfile } from '../data/onboarding';
export function PrototypeLoginScreen({ onEnter }: { onEnter: (profile: PrototypeProfile) => void }) {
  const [username, setUsername] = useState(''), [mode, setMode] = useState<PrototypeProfile['mode']>('guest');
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <Image source={require('../assets/brand/qurio-logo-transparent.png')} resizeMode="contain" style={s.logo} />
    <Text style={s.title}>A small beginning.{`\n`}A whole quantum world.</Text>
    <Text style={s.body}>Choose a name and come on in.</Text>
    <TextInput accessibilityLabel="Your username" placeholder="Your username" value={username} onChangeText={setUsername} maxLength={24} autoCapitalize="none" autoCorrect={false} style={s.input} />
    <View style={s.modes}>{(['guest', 'tester'] as const).map(value => <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: mode === value }} onPress={() => setMode(value)} style={[s.mode, mode === value && s.selected]}><Text style={s.modeText}>{value === 'guest' ? 'Guest' : 'Tester'}</Text></Pressable>)}</View>
    <Text style={s.body}>{mode === 'tester' ? 'Explore freely with unlimited energy and a wardrobe preview. No introduction.' : 'Try the new-player introduction.'}</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Enter Qurio" onPress={() => onEnter({ username: username.trim() || (mode === 'guest' ? 'Guest' : 'Tester'), mode })} style={s.enter}><Text style={s.enterText}>Let’s explore →</Text></Pressable>
    <Text style={s.note}>LOCAL PROTOTYPE{`\n`}No password or real account is created. Progress, names and rewards last only until you leave or reload. Daily energy and login streaks are previews, not live account features.</Text>
  </ScrollView></SafeAreaView>;
}
const s = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#F8F3E8' }, content: { flexGrow: 1, justifyContent: 'center', padding: 28, maxWidth: 450, width: '100%', alignSelf: 'center' }, logo: { width: 190, height: 80, alignSelf: 'center' }, title: { fontSize: 29, lineHeight: 37, color: '#493B58', fontWeight: '700', textAlign: 'center', marginVertical: 24 }, body: { fontSize: 15, lineHeight: 23, textAlign: 'center', color: '#716675' }, input: { borderWidth: 2, borderColor: '#A18CB7', borderRadius: 17, backgroundColor: '#FFFCF5', padding: 17, fontSize: 20, marginTop: 24, color: '#493B58' }, modes: { flexDirection: 'row', gap: 12, marginVertical: 18 }, mode: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#C8BBCF' }, selected: { backgroundColor: '#E8DBFA', borderColor: '#796190' }, modeText: { color: '#493B58', textAlign: 'center', fontWeight: '700' }, enter: { backgroundColor: '#775998', padding: 19, borderRadius: 17, marginTop: 24 }, enterText: { color: 'white', textAlign: 'center', fontSize: 20, fontWeight: '700' }, note: { color: '#796F7B', textAlign: 'center', lineHeight: 19, fontSize: 12, marginTop: 28 } });
