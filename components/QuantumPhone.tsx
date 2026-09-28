import { useEffect, useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Animated, Image, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

type Discovery = 'display' | 'gps' | 'camera' | 'processor';
type PhonePage = 'off' | 'home' | 'maps' | 'camera' | 'inside';

function CameraIcon() {
  return <View style={[styles.appTile, styles.cameraTile]}><View style={styles.cameraBody}><View style={styles.cameraLens} /><View style={styles.cameraFlash} /></View></View>;
}

function MapsIcon() {
  return <View style={[styles.appTile, styles.mapsTile]}>
    <View style={styles.mapGreen} /><View style={styles.mapBlue} /><View style={styles.mapRoadA} /><View style={styles.mapRoadB} />
    <View style={styles.mapPin}><View style={styles.mapPinDot} /></View>
  </View>;
}

function MapView() {
  return <View style={styles.liveMap}>
    <View style={styles.parkA} /><View style={styles.parkB} /><View style={styles.river} />
    <View style={[styles.road, { top: 35, left: -20, transform: [{ rotate: '18deg' }] }]} />
    <View style={[styles.road, { top: 93, left: 18, transform: [{ rotate: '-22deg' }] }]} />
    <View style={[styles.roadThin, { top: 62, left: 45, transform: [{ rotate: '72deg' }] }]} />
    <View style={styles.locationPin}><View style={styles.locationCore} /></View>
    <Text style={styles.streetA}>Orbit Ave</Text><Text style={styles.streetB}>Photon St</Text>
  </View>;
}

function CircuitBoard() {
  return <View style={styles.board}>
    <View style={styles.bigChip}><Text style={styles.chipText}>CPU</Text></View>
    {[18, 46, 75, 111, 144].map((top, index) => <View key={top} style={[styles.trace, { top, left: index % 2 ? 18 : 95, width: index % 2 ? 88 : 105 }]} />)}
    {[23, 56, 91, 127, 161].map((left, index) => <View key={left} style={[styles.component, { left, top: index % 2 ? 120 : 42, backgroundColor: index % 2 ? '#E7B74D' : '#D97161' }]} />)}
    <View style={styles.smallChip} /><View style={styles.coil} />
  </View>;
}

const screwdriver = require('../assets/lesson-8/screwdriver-transparent.png');

export function QuantumPhone({ onComplete }: { onComplete: () => void }) {
  const [page, setPage] = useState<PhonePage>('off');
  const [found, setFound] = useState<Discovery[]>([]);
  const [now, setNow] = useState(() => new Date());
  const [permission, requestPermission] = useCameraPermissions();
  const toolPosition = useRef(new Animated.ValueXY()).current;
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const unlock = (id: Discovery) => {
    setFound(old => {
      if (old.includes(id)) return old;
      const next = [...old, id];
      if (next.length === 4) onComplete();
      return next;
    });
  };
  const powerOn = () => { setPage('home'); unlock('display'); };
  const openMaps = () => { setPage('maps'); unlock('gps'); };
  const openCamera = () => {
    setPage('camera');
    unlock('camera');
    if (!permission?.granted) void requestPermission();
  };
  const canDissect = found.includes('gps') && found.includes('camera') && !found.includes('processor');
  const dissect = () => { setPage('inside'); unlock('processor'); };
  const toolPan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 6 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderTerminationRequest: () => false,
    onPanResponderMove: Animated.event([null, { dx: toolPosition.x, dy: toolPosition.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -70 && Math.abs(gesture.dy) < 80) dissect();
      else Animated.spring(toolPosition, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    },
    onPanResponderTerminate: () => Animated.spring(toolPosition, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start(),
  })).current;

  return <View style={styles.explorer}>
    <Text style={styles.counter}>{found.length}/4 quantum clues found</Text>
    <View style={styles.phoneArea}>
      {page === 'off' && <View pointerEvents="none" style={styles.powerHint}><Text style={styles.powerHintText}>Turn on the phone with the side button!</Text></View>}
      <View style={styles.phone} accessibilityLabel={page === 'off' ? 'Phone switched off' : `Phone showing ${page}`}>
        <View style={styles.speaker} />
        <View style={[styles.screen, page !== 'off' && styles.screenOn]}>
          {page === 'off' && <Text style={styles.offMark}>tap the side button</Text>}
          {page === 'home' && <>
            <View style={styles.wallpaper}><View style={styles.wallBlobA} /><View style={styles.wallBlobB} /><View style={styles.wallBlobC} /></View>
            <View style={styles.statusBar}><Text style={styles.statusTime}>{time}</Text><Text style={styles.statusIcons}>● ))) ▰</Text></View>
            <View style={styles.notification}><Text style={styles.notificationTitle}>Quantum clue 1 · Display</Text><Text style={styles.notificationBody}>LEDs use quantum energy changes to release photons of light.</Text></View>
            <View style={styles.apps}>
              <Pressable accessibilityRole="button" accessibilityLabel="Open Camera" onPress={openCamera} style={styles.appButton}><CameraIcon /><Text style={styles.appName}>Camera</Text></Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Open Maps" onPress={openMaps} style={styles.appButton}><MapsIcon /><Text style={styles.appName}>Maps</Text></Pressable>
            </View>
            <View style={styles.homeIndicator} />
          </>}
          {page === 'maps' && <>
            <View style={styles.appHeader}><Pressable accessibilityRole="button" accessibilityLabel="Return to phone home screen" onPress={() => setPage('home')}><Text style={styles.backButton}>‹ Home</Text></Pressable><Text style={styles.appHeaderTitle}>Maps</Text><View style={{ width: 45 }} /></View>
            <MapView />
            <View style={styles.phoneInfo}><Text style={styles.phoneInfoTitle}>Quantum clue 2 · GPS</Text><Text style={styles.phoneInfoBody}>GPS satellites carry atomic clocks. Their precise ticks come from quantum energy changes inside atoms.</Text></View>
            <View style={styles.homeIndicator} />
          </>}
          {page === 'camera' && <>
            <View style={[styles.appHeader, styles.cameraHeader]}><Pressable accessibilityRole="button" accessibilityLabel="Return to phone home screen" onPress={() => setPage('home')}><Text style={[styles.backButton, { color: '#FFFFFF' }]}>‹ Home</Text></Pressable><Text style={[styles.appHeaderTitle, { color: '#FFFFFF' }]}>Camera</Text><View style={{ width: 45 }} /></View>
            <View style={styles.cameraPreview}>
              {permission?.granted ? <CameraView style={StyleSheet.absoluteFill} facing="back" /> : <View style={styles.permissionFallback}>
                <Text style={styles.permissionText}>Camera preview needs permission.</Text>
                <Pressable accessibilityRole="button" onPress={() => void requestPermission()} style={styles.permissionButton}><Text style={styles.permissionButtonText}>Allow camera</Text></Pressable>
              </View>}
              <View style={styles.focusSquare} />
            </View>
            <View style={styles.phoneInfo}><Text style={styles.phoneInfoTitle}>Quantum clue 3 · Camera sensor</Text><Text style={styles.phoneInfoBody}>Photons hitting the camera sensor become electrical information - the ingredients of a digital photo.</Text></View>
            <View style={styles.homeIndicator} />
          </>}
          {page === 'inside' && <>
            <View style={styles.appHeader}><View style={{ width: 45 }} /><Text style={styles.appHeaderTitle}>Inside the phone</Text><View style={{ width: 45 }} /></View>
            <CircuitBoard />
            <View style={styles.phoneInfo}><Text style={styles.phoneInfoTitle}>Quantum clue 4 · Processor</Text><Text style={styles.phoneInfoBody}>Billions of tiny switches control how electrons move, letting the processor calculate and remember.</Text></View>
            <View style={styles.homeIndicator} />
          </>}
        </View>
        {page === 'off' && <Pressable accessibilityRole="button" accessibilityLabel="Turn on the phone" onPress={powerOn} hitSlop={14} style={styles.sidePower}><View style={styles.sidePowerInner} /></Pressable>}
      </View>
      {canDissect && <Animated.View {...toolPan.panHandlers} style={[styles.sideTool, { transform: [...toolPosition.getTranslateTransform(), { rotate: '-12deg' }] }] }>
        <Pressable accessibilityRole="button" accessibilityLabel="Drag screwdriver over the phone" accessibilityHint="Drag it left onto the phone to reveal the processor" onPress={dissect}
          hitSlop={18} style={styles.screwdriverTouch}>
          <Image source={screwdriver} resizeMode="contain" style={styles.screwdriverSprite} />
        </Pressable>
      </Animated.View>}
    </View>
    {page !== 'off' && !canDissect && !found.includes('processor') && <Text style={styles.instruction}>Open both apps to find the next clues.</Text>}
    {canDissect && <Text style={styles.toolInstruction}>Drag the screwdriver left onto the phone to open it and reveal the final clue.</Text>}
  </View>;
}

const styles = StyleSheet.create({
  explorer: { marginVertical: 24, alignItems: 'center' },
  counter: { color: colors.coral, fontFamily: fonts.display, fontSize: 19, textAlign: 'center', marginBottom: 14 },
  phoneArea: { width: '100%', minHeight: 550, alignItems: 'center', justifyContent: 'flex-end', position: 'relative' },
  powerHint: { position: 'absolute', top: 0, left: 18, right: 18, zIndex: 4, alignItems: 'center', transform: [{ rotate: '-1deg' }] },
  powerHintText: { color: colors.coral, fontFamily: fonts.display, fontSize: 22, lineHeight: 28, textAlign: 'center' },
  phone: { width: 270, height: 500, borderRadius: 43, borderWidth: 4, borderColor: colors.ink, backgroundColor: '#34323A', padding: 12, transform: [{ rotate: '-0.5deg' }] },
  speaker: { width: 63, height: 6, borderRadius: 4, backgroundColor: '#77747E', alignSelf: 'center', marginBottom: 8 },
  screen: { flex: 1, borderRadius: 30, backgroundColor: '#111116', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  screenOn: { backgroundColor: '#F6F6F8', justifyContent: 'flex-start' },
  offMark: { color: '#8D8B93', fontSize: 14, letterSpacing: 0.4 },
  sidePower: { position: 'absolute', right: -16, top: 78, width: 19, height: 66, alignItems: 'flex-start', justifyContent: 'center' },
  sidePowerInner: { width: 10, height: 54, borderTopRightRadius: 5, borderBottomRightRadius: 5, backgroundColor: '#6F6B76', borderWidth: 2, borderLeftWidth: 0, borderColor: colors.ink },
  wallpaper: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#B8D9EF' },
  wallBlobA: { position: 'absolute', width: 250, height: 220, borderRadius: 130, backgroundColor: '#7D68DC', top: 125, left: -92, transform: [{ rotate: '25deg' }] },
  wallBlobB: { position: 'absolute', width: 205, height: 230, borderRadius: 120, backgroundColor: '#F09B8A', right: -78, bottom: -42, transform: [{ rotate: '-22deg' }] },
  wallBlobC: { position: 'absolute', width: 155, height: 155, borderRadius: 80, backgroundColor: '#F4D474', right: -32, top: 66, opacity: 0.88 },
  statusBar: { width: '100%', height: 34, paddingHorizontal: 14, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', zIndex: 2 },
  statusTime: { color: '#15151A', fontSize: 13, fontWeight: '700' },
  statusIcons: { color: '#15151A', fontSize: 10, fontWeight: '600' },
  notification: { zIndex: 2, width: '88%', backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: 15, padding: 10, marginTop: 8 },
  notificationTitle: { color: '#17171B', fontSize: 12, fontWeight: '700' },
  notificationBody: { color: '#34343A', fontSize: 11, lineHeight: 14, marginTop: 3 },
  apps: { zIndex: 2, flexDirection: 'row', gap: 34, marginTop: 56 },
  appButton: { alignItems: 'center', width: 73 },
  appTile: { width: 61, height: 61, borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', shadowColor: '#000000', shadowOpacity: 0.18, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  appName: { color: '#FFFFFF', fontSize: 12, fontWeight: '500', marginTop: 5, textShadowColor: 'rgba(0,0,0,0.65)', textShadowRadius: 3 },
  cameraTile: { backgroundColor: '#E9E9EC' },
  cameraBody: { width: 39, height: 28, borderRadius: 7, backgroundColor: '#3B3C42', alignItems: 'center', justifyContent: 'center' },
  cameraLens: { width: 19, height: 19, borderRadius: 10, backgroundColor: '#16171A', borderWidth: 3, borderColor: '#747984' },
  cameraFlash: { position: 'absolute', width: 5, height: 5, borderRadius: 3, backgroundColor: '#E8D27A', right: 5, top: 4 },
  mapsTile: { backgroundColor: '#EAF3E5' },
  mapGreen: { position: 'absolute', left: -12, top: -5, width: 42, height: 80, backgroundColor: '#8BD483', transform: [{ rotate: '17deg' }] },
  mapBlue: { position: 'absolute', right: -13, bottom: -8, width: 38, height: 80, backgroundColor: '#75BDE5', transform: [{ rotate: '-20deg' }] },
  mapRoadA: { position: 'absolute', width: 90, height: 10, backgroundColor: '#FFFFFF', transform: [{ rotate: '42deg' }] },
  mapRoadB: { position: 'absolute', width: 85, height: 5, backgroundColor: '#F4C35D', transform: [{ rotate: '-24deg' }] },
  mapPin: { width: 18, height: 18, borderRadius: 10, backgroundColor: '#E5534F', borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  mapPinDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#FFFFFF' },
  homeIndicator: { position: 'absolute', bottom: 7, width: 92, height: 4, borderRadius: 3, backgroundColor: '#17171B', alignSelf: 'center' },
  appHeader: { width: '100%', height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 11, backgroundColor: '#FFFFFF', zIndex: 3 },
  cameraHeader: { backgroundColor: '#111116' },
  backButton: { color: '#1477D4', fontSize: 15, fontWeight: '900', textTransform: 'uppercase' },
  appHeaderTitle: { color: '#17171B', fontSize: 15, fontWeight: '700' },
  liveMap: { width: '100%', height: 205, backgroundColor: '#EAE6D9', overflow: 'hidden' },
  parkA: { position: 'absolute', width: 93, height: 78, borderRadius: 35, backgroundColor: '#A9D69E', left: -12, top: 9 },
  parkB: { position: 'absolute', width: 84, height: 63, borderRadius: 30, backgroundColor: '#B8DCA7', right: -15, bottom: 9 },
  river: { position: 'absolute', width: 270, height: 37, backgroundColor: '#88C9E5', top: 82, left: -9, transform: [{ rotate: '13deg' }] },
  road: { position: 'absolute', width: 285, height: 15, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#D5D0C5' },
  roadThin: { position: 'absolute', width: 170, height: 8, backgroundColor: '#FFFFFF' },
  locationPin: { position: 'absolute', left: 112, top: 82, width: 27, height: 27, borderRadius: 15, backgroundColor: '#1477D4', borderWidth: 4, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  locationCore: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FFFFFF' },
  streetA: { position: 'absolute', top: 45, left: 84, color: '#6D6A65', fontSize: 9, transform: [{ rotate: '17deg' }] },
  streetB: { position: 'absolute', bottom: 31, right: 67, color: '#6D6A65', fontSize: 9, transform: [{ rotate: '-20deg' }] },
  phoneInfo: { flex: 1, width: '100%', backgroundColor: '#FFFFFF', padding: 13, justifyContent: 'center' },
  phoneInfoTitle: { color: '#6D57D9', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  phoneInfoBody: { color: '#24242A', fontSize: 12, lineHeight: 16 },
  cameraPreview: { width: '100%', height: 205, backgroundColor: '#25252B', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  permissionFallback: { alignItems: 'center', padding: 15 },
  permissionText: { color: '#FFFFFF', fontSize: 12, textAlign: 'center', marginBottom: 10 },
  permissionButton: { backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15 },
  permissionButtonText: { color: '#17171B', fontSize: 12, fontWeight: '600' },
  focusSquare: { position: 'absolute', width: 72, height: 72, borderWidth: 1, borderColor: '#F3D45F', borderRadius: 4 },
  board: { width: '100%', height: 235, backgroundColor: '#275D4E', overflow: 'hidden' },
  bigChip: { position: 'absolute', width: 91, height: 91, left: 78, top: 66, backgroundColor: '#24242A', borderWidth: 3, borderColor: '#A4A5A8', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  chipText: { color: '#DADADD', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  trace: { position: 'absolute', height: 3, backgroundColor: '#D9B64E' },
  component: { position: 'absolute', width: 13, height: 24, borderRadius: 3, borderWidth: 1, borderColor: '#432F28' },
  smallChip: { position: 'absolute', width: 46, height: 34, left: 15, bottom: 19, backgroundColor: '#222228', borderWidth: 2, borderColor: '#A4A5A8' },
  coil: { position: 'absolute', width: 38, height: 38, borderRadius: 20, right: 14, top: 24, borderWidth: 6, borderColor: '#AAB1B6' },
  instruction: { color: colors.ink, fontFamily: fonts.body, fontSize: 20, textAlign: 'center', marginTop: 20 },
  sideTool: { position: 'absolute', right: -20, top: 270, zIndex: 8 },
  toolInstruction: { color: colors.ink, fontFamily: fonts.body, fontSize: 21, lineHeight: 27, textAlign: 'center', paddingHorizontal: 22, marginTop: 18 },
  screwdriverTouch: { width: 152, height: 154, alignItems: 'center', justifyContent: 'center' },
  screwdriverSprite: { width: 140, height: 148, transform: [{ rotate: '53deg' }] },
  done: { color: colors.green, fontFamily: fonts.display, fontSize: 22, textAlign: 'center', marginTop: 24 },
});
