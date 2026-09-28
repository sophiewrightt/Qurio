import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, PanResponder, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { LessonFinishActions } from './LessonFinishActions';
import { RewardPack } from './RewardPack';
import { WorldCelebration } from './WorldCelebration';
import { TerminologyCard } from './TerminologyCard';
import { AccessoryId, accessoryCatalog } from '../data/customisation';
import { colors, fonts, radii, shadow, spacing } from '../constants/theme';

const strange = require('../assets/module-3/lesson-1/strange-default-transparent.png');
const spinUp = require('../assets/module-3/lesson-1/spin-up-quark-transparent.png');
const spinDown = require('../assets/module-3/lesson-1/spin-down-quark-transparent.png');
const questionStrange = require('../assets/module-2/lesson-3/question-mark-transparent.png');
const appleStrange = require('../assets/module-3/refinements/strange-x.png');
const bananaStrange = require('../assets/module-3/refinements/strange-a.png');
const carrotStrange = require('../assets/module-3/refinements/strange-b.png');
const entangler = require('../assets/module-3/lesson-3-all-entangled-up/entangler-transparent.png');
const spaceBackground = require('../assets/module-3/lesson-7-qkd/space-background-transparent.png');
const alexSecret = require('../assets/module-3/refinements/alex-secret.png');
const alexKey = require('../assets/module-3/lesson-7-qkd/alex-behind-computer-with-key-transparent.png');
const alexMessage = require('../assets/module-3/lesson-7-qkd/alex-behind-computer-with-message-transparent.png');
const barbComputer = require('../assets/module-3/refinements/barb-computer.png');
const barbScrambled = require('../assets/module-3/refinements/barb-scrambled.png');
const barbMessage = require('../assets/module-3/refinements/barb-message.png');
const barbKey = require('../assets/module-3/lesson-7-qkd/barb-with-key-transparent.png');
const hacker = require('../assets/module-3/refinements/hacker.png');
const hackerPuzzled = require('../assets/module-3/refinements/hacker-puzzled.png');
const hackerWithKey = require('../assets/module-3/refinements/hacker-key.png');
const hackerWithSecret = require('../assets/module-3/refinements/hacker-secret.png');
const packet = require('../assets/module-3/lesson-7-qkd/internet-packet-transparent.png');
const packetOpened = require('../assets/module-3/lesson-7-qkd/internet-packet-opened-transparent.png');
const packetOpenedKey = require('../assets/module-3/lesson-7-qkd/internet-packet-opened-key-transparent.png');
const key = require('../assets/module-3/refinements/secret-key.png');
const scrambled = require('../assets/module-3/lesson-7-qkd/scrambled-transparent.png');

type LessonStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
type PacketKind = 'plain' | 'encrypted' | 'key';

function EntanglementRecap() {
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 850, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0, duration: 850, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [glow]);
  return <View accessibilityLabel="Two distant strange quarks with a symbolic fading squiggle between them" style={styles.spaceScene}>
    <Image source={spaceBackground} resizeMode="contain" style={styles.spaceBackdrop} />
    <Image source={strange} resizeMode="contain" style={[styles.distantStrange, styles.leftStrange]} />
    <Animated.Text style={[styles.symbolicSquiggle, { opacity: glow }]}>∿∿∿</Animated.Text>
    <Image source={strange} resizeMode="contain" style={[styles.distantStrange, styles.rightStrange]} />
  </View>;
}

function OutcomeRecap() {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => setFlipped(previous => !previous), 520);
    return () => clearInterval(timer);
  }, []);
  return <View accessibilityLabel="Two strange quarks alternate between spin up and spin down, with a question mark between them" style={styles.outcomeRow}>
    <Image source={flipped ? spinUp : spinDown} resizeMode="contain" style={styles.outcomeStrange} />
    <Image source={questionStrange} resizeMode="contain" style={styles.questionStrange} />
    <Image source={flipped ? spinDown : spinUp} resizeMode="contain" style={styles.outcomeStrange} />
  </View>;
}

function TeleportationRecap() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActive(previous => (previous + 1) % 3), 650);
    return () => clearInterval(timer);
  }, []);
  return <View accessibilityLabel="Stranges X, A and B from the teleportation experiment" style={styles.produceRow}>
    {[appleStrange, bananaStrange, carrotStrange].map((source, index) => <Image key={index} source={source} resizeMode="contain" style={[styles.produceStrange, active === index && styles.activeProduce]} />)}
  </View>;
}

function MatrixRain() {
  const shift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.timing(shift, { toValue: 1, duration: 1350, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web' }));
    animation.start();
    return () => animation.stop();
  }, [shift]);
  return <View accessible={false} style={styles.matrixRain}>
    {['010110', '101001', '001101', '110010'].map((bits, index) => <Animated.Text key={bits} style={[styles.matrixColumn, { left: `${8 + index * 25}%`, opacity: shift.interpolate({ inputRange: [0, .25, .8, 1], outputRange: [.1, .75, .55, .1] }), transform: [{ translateY: shift.interpolate({ inputRange: [0, 1], outputRange: [-26 - index * 8, 66 + index * 6] }) }] }]}>{bits.split('').join('\n')}</Animated.Text>)}
  </View>;
}

export function PacketAnimation({ destination, kind, onArrive }: { destination: 'barb' | 'hacker'; kind: PacketKind; onArrive: () => void }) {
  const travel = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const alive = useRef(true);
  const delivered = useRef(false);
  const [width, setWidth] = useState(327);
  const callback = useRef(onArrive);
  callback.current = onArrive;
  useEffect(() => {
    animation.current = Animated.timing(travel, { toValue: 1, duration: 2800, easing: Easing.linear, useNativeDriver: true });
    animation.current.start(({ finished }) => {
      if (finished && alive.current && !delivered.current) {
        delivered.current = true;
        callback.current();
        animation.current = Animated.loop(Animated.sequence([
          Animated.delay(1100),
          Animated.timing(travel, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(travel, { toValue: 1, duration: 2800, easing: Easing.linear, useNativeDriver: true }),
        ]));
        animation.current.start();
      }
    });
    return () => { alive.current = false; animation.current?.stop(); };
  }, [destination, travel]);
  const middleSource = kind === 'encrypted' ? hackerPuzzled : kind === 'key' ? hackerWithKey : hackerWithSecret;
  const arrival = travel.interpolate({ inputRange: [0,.78,1], outputRange: [0,0,1] });
  const waiting = travel.interpolate({ inputRange: [0,.78,1], outputRange: [1,1,0] });
  return <View accessibilityLabel={`An internet packet is travelling from Alex to ${destination === 'barb' ? 'Barb' : 'a hacker'}`} onLayout={event => setWidth(event.nativeEvent.layout.width)} style={styles.networkScene}>
    <View style={styles.networkPeople}>
      <Image source={kind === 'key' ? alexKey : alexMessage} resizeMode="contain" style={styles.networkPerson} />
      {(destination === 'hacker' || kind === 'encrypted') && <View style={styles.hackerWrap}><MatrixRain /><Animated.Image source={hacker} resizeMode="contain" style={[styles.networkHacker, { opacity: waiting }]} /><Animated.Image source={middleSource} resizeMode="contain" style={[styles.networkHacker, styles.crossfade, { opacity: arrival }]} /></View>}
      <View style={styles.networkPerson}>
        <Animated.Image source={barbComputer} resizeMode="contain" style={[styles.fullImage, { opacity: destination === 'barb' ? waiting : 1 }]} />
        {destination === 'barb' && <Animated.Image source={kind === 'encrypted' ? barbScrambled : barbMessage} resizeMode="contain" style={[styles.fullImage, { opacity: arrival }]} />}
      </View>
    </View>
    <Animated.Image source={packet} resizeMode="contain" style={[styles.travellingPacket, { opacity: waiting, transform: [{ translateX: travel.interpolate({ inputRange: [0, 1], outputRange: [0, destination === 'barb' ? width - 120 : width / 2 - 58] }) }] }]} />
  </View>;
}

function GlowingKey() {
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [glow]);
  return <View style={styles.keyGlowWrap}><Animated.View style={[styles.keyGlow, { opacity: glow, transform: [{ scale: glow.interpolate({ inputRange: [0, 1], outputRange: [.82, 1.14] }) }] }]} /><Image accessibilityLabel="A glowing secret key" source={key} resizeMode="contain" style={styles.keyArt} /></View>;
}

const noScrollLock = (_locked: boolean) => {};

export function DecryptMessage({ onComplete, onScrollLockChange = noScrollLock }: { onComplete: () => void; onScrollLockChange?: (locked: boolean) => void }) {
  const [unlocked, setUnlocked] = useState(false);
  const x = useRef(new Animated.Value(0)).current, y = useRef(new Animated.Value(0)).current;
  const width = useRef(327), done = useRef(false), alive = useRef(true);
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const callbacks = useRef({ onComplete, onScrollLockChange });
  callbacks.current = { onComplete, onScrollLockChange };
  useEffect(() => () => { alive.current = false; animation.current?.stop(); callbacks.current.onScrollLockChange(false); }, []);
  const decrypt = () => {
    if (done.current) return;
    done.current = true;
    callbacks.current.onScrollLockChange(false);
    animation.current = Animated.parallel([
      Animated.timing(x, { toValue: width.current - 148, duration: 400, useNativeDriver: true }),
      Animated.timing(y, { toValue: -116, duration: 400, useNativeDriver: true }),
    ]);
    animation.current.start(({ finished }) => {
      if (finished && alive.current) { setUnlocked(true); callbacks.current.onComplete(); }
    });
  };
  const reset = () => { x.setValue(0); y.setValue(0); callbacks.current.onScrollLockChange(false); };
  const responder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !done.current,
    onMoveShouldSetPanResponder: () => !done.current,
    onPanResponderGrant: () => callbacks.current.onScrollLockChange(true),
    onPanResponderMove: (_, g) => { if (!done.current) { x.setValue(g.dx); y.setValue(g.dy); } },
    onPanResponderRelease: (_, g) => {
      callbacks.current.onScrollLockChange(false);
      if (done.current) return;
      const centerX = 46 + g.dx, centerY = 226 + g.dy;
      if (centerX >= width.current - 190 && centerX <= width.current && centerY >= 20 && centerY <= 205) decrypt();
      else reset();
    },
    onPanResponderTerminate: reset,
    onPanResponderTerminationRequest: () => false,
  })).current;
  return <View>
    <Text style={styles.tapHint}>{unlocked ? 'MESSAGE DECRYPTED!' : 'DRAG THE KEY TO BARB’S COMPUTER'}</Text>
    <View onLayout={event => { width.current = event.nativeEvent.layout.width; }} style={styles.decryptScene}>
      <Image accessibilityLabel={unlocked ? 'Barb reads Hello on her computer' : 'Barb’s computer shows a nonsense message'} source={unlocked ? barbMessage : barbScrambled} resizeMode="contain" style={styles.decryptComputer} />
      {!unlocked && <Animated.View accessibilityRole="button" accessibilityLabel="Drag the key to Barb to decrypt her message" accessibilityActions={[{ name: 'activate', label: 'Use the key' }]} onAccessibilityAction={decrypt} {...responder.panHandlers} style={[styles.dragKey, { transform: [{ translateX: x }, { translateY: y }] }]}>
        <Image source={key} resizeMode="contain" style={styles.fullImage} />
      </Animated.View>}
    </View>
  </View>;
}

function RainbowHeading() {
  const colours = ['#D85F57', '#E58B39', '#D5A629', '#4CA57F', '#3D87C8', '#7157B7', '#B95C9E'];
  return <View accessibilityRole="header" accessibilityLabel="Quantum key distribution" style={styles.rainbowHeading}>{'QUANTUM KEY DISTRIBUTION'.split('').map((letter, index) => <Text key={`${letter}-${index}`} style={[styles.rainbowLetter, { color: colours[index % colours.length] }]}>{letter}</Text>)}</View>;
}

function QuantumPairFactory({ many = false }: { many?: boolean }) {
  return <View accessibilityLabel={many ? 'The Entangler-2000 prepares many entangled pairs and two matching raw bit strips' : 'The Entangler-2000 prepares one entangled pair for Alex and Barb'} style={styles.factory}>
    <View style={styles.factoryInputs}>{Array.from({ length: many ? 6 : 2 }, (_, index) => <Image key={index} source={strange} resizeMode="contain" style={many ? styles.tinyStrange : styles.factoryStrange} />)}</View>
    <Text style={styles.downArrow}>↓</Text>
    <Image source={entangler} resizeMode="contain" style={styles.entangler} />
    <Text style={styles.downArrow}>↓</Text>
    {many ? <View style={styles.rawStrips}><Text style={styles.rawStrip}>ALEX’s quantum code: 10110010</Text><Text style={styles.rawStrip}>BARB’s quantum code: 10110010</Text></View> : <View style={styles.pairOutput}><View style={styles.quantumBox}><Text style={styles.boxName}>A</Text><Image source={strange} resizeMode="contain" style={styles.boxStrange} /></View><Text style={styles.pairMark}>≈</Text><View style={styles.quantumBox}><Text style={styles.boxName}>B</Text><Image source={strange} resizeMode="contain" style={styles.boxStrange} /></View></View>}
  </View>;
}

const alexBits = ['1', '0', '1', '1', '0', '0', '1', '0'];
const barbDisturbedBits = ['1', '0', '0', '1', '0', '0', '0', '0'];
const samplePositions = [2, 4, 6];

function SampleCheck({ sampled, onSample }: { sampled: number[]; onSample: (index: number) => void }) {
  return <View style={styles.sampleCard}>
    <Text style={styles.sampleTitle}>PUBLIC TEST SAMPLE</Text>
    <View style={styles.bitLabelRow}><Text style={styles.bitOwner}>ALEX</Text><View style={styles.bitRow}>{alexBits.map((bit, index) => <View key={index} style={[styles.bitCell, sampled.includes(index) && styles.sampledCell]}><Text style={styles.bit}>{bit}</Text></View>)}</View></View>
    <View style={styles.bitLabelRow}><Text style={styles.bitOwner}>BARB</Text><View style={styles.bitRow}>{barbDisturbedBits.map((bit, index) => <View key={index} style={[styles.bitCell, sampled.includes(index) && styles.sampledCell, sampled.includes(index) && bit !== alexBits[index] && styles.mismatchCell]}><Text style={styles.bit}>{sampled.includes(index) && bit !== alexBits[index] ? `${bit}!` : bit}</Text></View>)}</View></View>
    <Text style={styles.sampleHint}>Imagine these three positions were chosen at random. Tap each one. These bits will be revealed, checked and thrown away.</Text>
    <View style={styles.sampleButtons}>{samplePositions.map(index => <Pressable key={index} accessibilityRole="button" accessibilityLabel={`Compare sample position ${index + 1}`} disabled={sampled.includes(index)} onPress={() => onSample(index)} style={({ pressed }) => [styles.sampleButton, sampled.includes(index) && styles.sampleButtonDone, pressed && styles.pressed]}><Text style={styles.sampleButtonText}>{sampled.includes(index) ? '✓' : index + 1}</Text></Pressable>)}</View>
    <Text style={styles.sampleProgress}>{sampled.length} of 3 sample positions checked</Text>
  </View>;
}

export function QuantumApplicationsLesson({ onComplete, onScrollLockChange = noScrollLock }: { onComplete: () => void; onScrollLockChange?: (locked: boolean) => void }) {
  const [stage, setStage] = useState<LessonStage>(0);
  const [sampled, setSampled] = useState<number[]>([]);
  const stageRef = useRef<LessonStage>(0);
  const sampledRef = useRef<number[]>([]);
  const quizStarted = useRef(false);
  const advance = (expected: LessonStage, next: LessonStage) => {
    if (stageRef.current !== expected) return;
    stageRef.current = next;
    setStage(next);
  };
  const sample = (index: number) => {
    if (stageRef.current !== 15 || sampledRef.current.includes(index) || !samplePositions.includes(index)) return;
    sampledRef.current = [...sampledRef.current, index];
    setSampled(sampledRef.current);
    if (sampledRef.current.length === samplePositions.length) advance(15, 16);
  };
  return <View>
    <Text style={styles.body}>Okay, so now we know:</Text>
    <Text style={styles.recapLead}>Entanglement is when two or more quantum systems share a joint state, so you cannot fully describe one without describing the whole system.</Text>
    <Text style={styles.body}>These connections stay even when the particles are very far apart.</Text>
    <EntanglementRecap />
    <Text style={styles.note}>Remember, the white squiggle just means they have a shared quantum state, they’re not actually physically connected!</Text>
    <Text style={styles.body}>The results of individual measurements are unpredictable.</Text>
    <OutcomeRecap />
    <Text style={styles.body}>Then we learnt that entanglement can help teleport a quantum state!</Text>
    <TeleportationRecap />
    <Text style={styles.heading}>When is this useful?</Text>
    <Text style={styles.body}>It is not often feasible to send someone 10 million light-years away to test how cool an experiment is. But the same quantum rules can power useful tools.</Text>
    {stage === 0 && <PrimaryButton label="See where this becomes useful" onPress={() => advance(0, 1)} />}

    {stage >= 1 && <>
      <Text style={styles.encryptionHeading}>Encryption</Text>
      <Text style={styles.body}>Imagine Alex wants to tell Barb a <Text style={styles.bold}>HUGE secret</Text>, but they live in different countries.</Text>
      <Image accessibilityLabel="Alex thinks about the secret message Hello" source={alexSecret} resizeMode="contain" style={styles.heroArt} />
      <Text style={styles.body}>He can send the message inside a packet of information over the internet.</Text>
      {stage === 1 && <PrimaryButton label="Send Alex’s message" onPress={() => advance(1, 2)} />}
      {stage >= 2 && <PacketAnimation destination="barb" kind="plain" onArrive={() => advance(2, 4)} />}
    </>}

    {stage >= 3 && <>
      <Text style={styles.success}>✓ Message delivered</Text>
    </>}

    {stage >= 4 && <>
      <Text style={styles.heading}>Let’s put a hacker in the mix</Text>
      <View style={styles.hackerStage}><MatrixRain /><Image accessibilityLabel="A hacker waits on the network" source={hacker} resizeMode="contain" style={styles.hackerArt} /></View>
      <Text style={styles.body}>If Alex sends the message as it is, a hacker somewhere on the network could open the packet and read the secret.</Text>
      {stage === 4 && <PrimaryButton label="Send the unprotected message" onPress={() => advance(4, 5)} />}
      {stage >= 5 && <PacketAnimation destination="hacker" kind="plain" onArrive={() => advance(5, 7)} />}
    </>}

    {stage >= 6 && <>
      <Text style={styles.alert}>The hacker read “HELLO”!</Text>
      <Text style={styles.heading}>The solution</Text>
      <Text style={styles.body}>Before sending it, Alex can <Text style={styles.bold}>encrypt</Text> the message. A mathematical rule and a secret key scramble “HELLO” into something that looks meaningless.</Text>
    </>}

    {stage >= 7 && <>
      <Image accessibilityLabel="A key scrambles Hello into symbols and changes it back" source={scrambled} resizeMode="contain" style={styles.scrambledArt} />
      <Text style={styles.body}>Without the key, the intercepted packet should only show the scrambled message.</Text>
      {stage === 7 && <PrimaryButton label="Send the encrypted message" onPress={() => advance(7, 8)} />}
      {stage >= 8 && <PacketAnimation destination="hacker" kind="encrypted" onArrive={() => advance(8, 9)} />}
    </>}

    {stage >= 9 && <>
      <Text style={styles.body}>The hacker intercepts the packet but only sees nonsense. Now imagine Barb receives an encrypted copy. With the matching key, she can read it.</Text>
      <DecryptMessage onComplete={() => advance(9, 10)} onScrollLockChange={onScrollLockChange} />
    </>}

    {stage >= 10 && <>
      <Text style={styles.body}>Perfect. Except there is one awkward question...</Text>
      <Text style={styles.question}>How did Barb get the secret key in the first place?</Text>
      <GlowingKey />
      <Text style={styles.body}>If Alex sends the key as an ordinary packet, a hacker could copy it too.</Text>
      {stage === 10 && <PrimaryButton label="Try sending the key normally" onPress={() => advance(10, 11)} />}
      {stage >= 11 && <PacketAnimation destination="hacker" kind="key" onArrive={() => advance(11, 12)} />}
    </>}

    {stage >= 12 && <>
      <View style={styles.interceptedScene}><Image source={packetOpenedKey} resizeMode="contain" style={styles.openPacket} /><Image accessibilityLabel="The hacker has copied the secret key" source={hackerWithKey} resizeMode="contain" style={styles.interceptedHacker} /></View>
      <Text style={styles.alert}>Sending the key normally gives the hacker a copy.</Text>
      <Text style={styles.heading}>So what’s the solution?</Text>
      <RainbowHeading />
      <Text style={styles.body}>Instead of sending a finished key, Alex and Barb can use many quantum particles to <Text style={styles.bold}>generate a shared secret key</Text>.</Text>
      <Text style={styles.body}>First, the Entangler-2000 prepares a pair. One particle travels to Alex and the other travels to Barb.</Text>
      {stage === 12 && <Pressable accessibilityRole="button" accessibilityLabel="Entangle one pair of strange quarks" onPress={() => advance(12, 13)} style={({ pressed }) => [styles.entangleButton, pressed && styles.pressed]}><View style={styles.factoryInputs}><Image source={strange} resizeMode="contain" style={styles.factoryStrange} /><Image source={strange} resizeMode="contain" style={styles.factoryStrange} /></View><Image source={entangler} resizeMode="contain" style={styles.entangler} /><Text style={styles.tapHint}>TAP THE ENTANGLER</Text></Pressable>}
    </>}

    {stage >= 13 && <>
      <QuantumPairFactory />
      <Text style={styles.body}>Alex and Barb each receive one particle from the pair. When they use the same measurement setting, their recorded bits are correlated.</Text>
      <Text style={styles.body}>One pair gives only one result.</Text>
      <Text style={styles.body}>To build a key, they need many freshly prepared pairs to make a code.</Text>
      {stage === 13 && <PrimaryButton label="Prepare many entangled pairs" onPress={() => advance(13, 14)} />}
    </>}

    {stage >= 14 && <>
      <QuantumPairFactory many />
      <Text style={styles.body}>For every pair, Alex and Barb choose a measurement setting at random. Later they publicly compare <Text style={styles.bold}>which settings</Text> they used, not their secret results, and keep the compatible trials.</Text>
      <Text style={styles.body}>After many pairs, the kept results give them matching raw strings of 0s and 1s. They can process those strings into a shared key.</Text>
      <Text style={styles.keyPoint}>No finished key travelled across the internet. Alex and Barb generated matching raw key data at their own ends.</Text>
      {stage === 14 && <PrimaryButton label="Let the hacker intercept some particles" onPress={() => advance(14, 15)} />}
    </>}

    {stage >= 15 && <>
      <View style={styles.hackerStage}><MatrixRain /><Image accessibilityLabel="The hacker measures some travelling quantum particles" source={hacker} resizeMode="contain" style={styles.hackerArt} /></View>
      <Text style={styles.body}>Now imagine the hacker measures some particles before they reach Barb.</Text>
      <Text style={styles.body}>Measuring an unknown quantum signal, or trying to copy it perfectly, can disturb the correlations.</Text>
      <Text style={styles.body}>Alex and Barb reveal a small random sample of their results over an ordinary authenticated channel. They compare only that test sample, then throw those revealed bits away.</Text>
      {stage === 15 && <SampleCheck sampled={sampled} onSample={sample} />}
    </>}

    {stage >= 16 && <>
      <Text accessibilityLiveRegion="polite" style={styles.alert}>Too many unexpected differences!</Text>
      <Text style={styles.body}>The test has too many errors to use this key safely, so Alex and Barb discard it and try again. Noise can cause errors too: they check against a safety limit, not just one suspicious bit.</Text>
      <TerminologyCard term="Quantum key distribution" definition="A way to generate shared secret-key data using quantum signals, then test a public sample for disturbance before using the remaining private bits." />
      <Text style={styles.heading}>One idea to keep</Text>
      <Text style={styles.body}>Entanglement does not make messages instant. Here, it helps Alex and Barb notice suspicious disturbance while they establish a key for ordinary encrypted messages.</Text>
      <LessonFinishActions onComplete={() => { if (!quizStarted.current) { quizStarted.current = true; onComplete(); } }} />
    </>}
  </View>;
}

export function QuantumConnectionsCompletion({ correct, total = 5, ownedAccessories, onUnlockAccessories, onFinish }: { correct: number; total?: number; ownedAccessories: AccessoryId[]; onUnlockAccessories: (ids: AccessoryId[]) => void; onFinish: () => void }) {
  const [opened, setOpened] = useState(false);
  const openedRef = useRef(false);
  const finishedRef = useRef(false);
  const initialOwned = useRef([...ownedAccessories]).current;
  const hasRewards = accessoryCatalog.length > 0;
  const open = (ids: AccessoryId[]) => { if (openedRef.current) return; openedRef.current = true; setOpened(true); onUnlockAccessories(ids); };
  return <>
    <Text style={styles.heading}>Chapter 3 complete!</Text>
    <WorldCelebration source={require('../assets/module-3/refinements/strange-celebrating.png')} accessibilityLabel="Strange celebrates Chapter 3, jumping with falling confetti" />
    <Text style={styles.progress}>{correct} / {total} correct · {correct * 5} Knowledge earned in this quiz</Text>
    <Text style={styles.body}>From spin to entanglement, teleportation and secret keys. You’ve connected the dots!</Text>
    {hasRewards ? <RewardPack excludeIds={initialOwned} onOpen={open} /> : <Text style={styles.body}>You’ve already collected every available accessory. Your wardrobe is complete for now!</Text>}
    <Text style={styles.heading}>Next: quantum crowds</Text>
    <Text style={styles.body}>What happens when particles are so identical that nature cannot tell which is which? That’s where our next chapter begins.</Text>
    <LessonFinishActions next={false} homeLabel="Finish Chapter 3" disabled={hasRewards && !opened} onComplete={() => { if ((!hasRewards || openedRef.current) && !finishedRef.current) { finishedRef.current = true; onFinish(); } }} />
  </>;
}

const styles = StyleSheet.create({
  body: { fontFamily: fonts.body, color: colors.ink, fontSize: 22, lineHeight: 29, marginBottom: 18, marginTop: 10 },
  bold: { fontFamily: fonts.display },
  heading: { fontFamily: fonts.display, color: colors.ink, fontSize: 33, lineHeight: 40, marginTop: 28, marginBottom: 10 },
  question: { fontFamily: fonts.display, color: colors.ink, fontSize: 29, lineHeight: 36, marginTop: 18, marginBottom: 16 },
  progress: { fontFamily: fonts.body, color: colors.muted, fontSize: 18, marginVertical: 10 },
  recapLead: { fontFamily: fonts.display, color: colors.green, fontSize: 27, lineHeight: 35, marginBottom: 18 },
  note: { fontFamily: fonts.body, color: colors.ink, fontSize: 19, lineHeight: 25, backgroundColor: '#FFF4C9', borderRadius: radii.md, padding: 14, marginBottom: 20 },
  spaceScene: { height: 220, marginVertical: 5, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  spaceBackdrop: { position: 'absolute', width: '100%', height: '100%' },
  distantStrange: { position: 'absolute', width: 86, height: 86, top: 66 },
  leftStrange: { left: 28 }, rightStrange: { right: 28 },
  symbolicSquiggle: { color: colors.white, fontFamily: fonts.display, fontSize: 46, letterSpacing: 4, textShadowColor: '#C8B8FF', textShadowRadius: 9 },
  outcomeRow: { minHeight: 150, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, marginBottom: 14 },
  outcomeStrange: { width: 90, height: 90 }, questionStrange: { width: 62, height: 62, marginHorizontal: 8 },
  produceRow: { minHeight: 126, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 10 },
  produceStrange: { width: 84, height: 84, opacity: .65, transform: [{ translateY: 7 }, { scale: .9 }] },
  activeProduce: { opacity: 1, transform: [{ translateY: -9 }, { scale: 1.04 }] },
  encryptionHeading: { color: colors.green, fontFamily: fonts.display, fontSize: 48, lineHeight: 56, textAlign: 'center', marginTop: spacing.xxl, marginBottom: 14, transform: [{ rotate: '-1deg' }] },
  heroArt: { width: '100%', height: 305, alignSelf: 'center', marginBottom: 16 },
  resultScene: { minHeight: 180, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginVertical: 8 },
  resultArt: { width: 170, height: 164 }, smallHacker: { width: 90, height: 112 },
  success: { color: colors.green, fontFamily: fonts.display, fontSize: 25, lineHeight: 31, textAlign: 'center' },
  hackerStage: { width: 230, height: 224, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginVertical: 8 },
  hackerArt: { width: 166, height: 196, zIndex: 2 },
  matrixRain: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' },
  matrixColumn: { position: 'absolute', top: 0, color: '#47C976', fontFamily: fonts.display, fontSize: 15, lineHeight: 17, opacity: .65 },
  networkScene: { height: 220, marginVertical: 12, overflow: 'hidden' },
  networkPeople: { height: 175, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  networkPerson: { width: '31%', height: 116 },
  hackerWrap: { width: '35%', height: 140, alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
  networkHacker: { width: '100%', height: 126, zIndex: 2 },
  crossfade: { position: 'absolute', bottom: 0 }, fullImage: { position: 'absolute', width: '100%', height: '100%' },
  networkLine: { position: 'absolute', left: 48, right: 48, top: 180, height: 3, borderRadius: 2, backgroundColor: colors.green, opacity: .45 },
  travellingPacket: { position: 'absolute', left: 28, top: 45, width: 60, height: 52, zIndex: 3 },
  travellingLabel: { color: colors.ink, fontFamily: fonts.display, fontSize: 16, textAlign: 'center', marginTop: 10 },
  interceptedScene: { minHeight: 220, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 10 },
  openPacket: { width: 80, height: 88 }, interceptedHacker: { width: 185, height: 200 },
  alert: { color: colors.red, fontFamily: fonts.display, fontSize: 29, lineHeight: 35, textAlign: 'center', marginVertical: 14 },
  scrambledArt: { width: '100%', height: 150, alignSelf: 'center', marginVertical: 8 },
  keyButton: { minHeight: 225, alignItems: 'center', justifyContent: 'center', marginVertical: 5 },
  barbKeyArt: { width: 225, height: 190 }, tapHint: { color: colors.primary, fontFamily: fonts.display, fontSize: 16, letterSpacing: .8, textAlign: 'center', marginTop: 7 },
  pressed: { opacity: .7, transform: [{ scale: .985 }] },
  keyGlowWrap: { width: 220, height: 135, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  decryptScene: { height: 280, marginVertical: 12 },
  decryptComputer: { position: 'absolute', right: 5, top: 20, width: 185, height: 185 },
  dragKey: { position: 'absolute', left: 10, top: 190, width: 72, height: 72, zIndex: 2 },
  keyGlow: { position: 'absolute', width: 118, height: 78, borderRadius: 60, backgroundColor: '#FFE384' }, keyArt: { width: 170, height: 100 },
  rainbowHeading: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: spacing.xxl, marginBottom: 20, paddingHorizontal: 4 },
  rainbowLetter: { fontFamily: fonts.display, fontSize: 34, lineHeight: 41, textShadowColor: 'rgba(33,48,44,.12)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 },
  entangleButton: { minHeight: 300, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAF5EF', borderRadius: radii.lg, padding: 12, marginVertical: 12 },
  factory: { alignItems: 'center', backgroundColor: '#F1F7F3', borderRadius: radii.lg, padding: 14, marginVertical: 12 },
  factoryInputs: { minHeight: 62, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 1 },
  factoryStrange: { width: 78, height: 78 }, tinyStrange: { width: 47, height: 47 },
  entangler: { width: 180, height: 145 }, downArrow: { color: colors.green, fontFamily: fonts.display, fontSize: 30, lineHeight: 32 },
  pairOutput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  quantumBox: { width: 96, minHeight: 92, borderWidth: 3, borderColor: '#B97B48', borderRadius: 12, backgroundColor: '#E9B982', alignItems: 'center', justifyContent: 'center', ...shadow },
  boxName: { position: 'absolute', left: 8, top: 5, color: colors.ink, fontFamily: fonts.display, fontSize: 21 }, boxStrange: { width: 74, height: 74 },
  pairMark: { color: colors.green, fontFamily: fonts.display, fontSize: 32 },
  rawStrips: { width: '100%', gap: 9 }, rawStrip: { backgroundColor: '#FFFDF7', borderWidth: 2, borderStyle: 'dashed', borderColor: colors.green, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 7, color: colors.ink, fontFamily: fonts.display, fontSize: 17, textAlign: 'center' },
  keyPoint: { color: colors.ink, fontFamily: fonts.body, fontSize: 22, lineHeight: 29, backgroundColor: '#DDF1E7', borderRadius: radii.md, padding: 16, marginBottom: 18 },
  sampleCard: { backgroundColor: '#FFFDF7', borderWidth: 2, borderColor: colors.green, borderRadius: radii.lg, padding: 14, marginVertical: 12 },
  sampleTitle: { color: colors.green, fontFamily: fonts.display, fontSize: 23, textAlign: 'center', marginBottom: 12 },
  bitLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 }, bitOwner: { width: 48, color: colors.ink, fontFamily: fonts.display, fontSize: 14 },
  bitRow: { flex: 1, flexDirection: 'row', gap: 2 }, bitCell: { flex: 1, minWidth: 18, height: 32, borderRadius: 7, backgroundColor: '#E9E4D8', alignItems: 'center', justifyContent: 'center' },
  sampledCell: { backgroundColor: '#FFF0A6', borderWidth: 1, borderColor: '#D2A029' }, mismatchCell: { backgroundColor: '#FFD7D0', borderColor: colors.red }, bit: { color: colors.ink, fontFamily: fonts.display, fontSize: 18 },
  sampleHint: { color: colors.ink, fontFamily: fonts.body, fontSize: 18, lineHeight: 24, textAlign: 'center', marginTop: 10 },
  sampleButtons: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 12 }, sampleButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }, sampleButtonDone: { backgroundColor: '#BBDACB' }, sampleButtonText: { color: colors.white, fontFamily: fonts.display, fontSize: 21 }, sampleProgress: { color: colors.muted, fontFamily: fonts.body, fontSize: 17, textAlign: 'center', marginTop: 9 },
  trashScene: { height: 200, alignItems: 'center', justifyContent: 'flex-end', marginVertical: 4 }, trashLid: { width: 142, height: 13, borderRadius: 5, backgroundColor: '#68746F', marginBottom: 3, transform: [{ rotate: '-5deg' }] }, trashCan: { width: 126, height: 132, borderWidth: 4, borderColor: '#68746F', borderTopWidth: 1, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, backgroundColor: '#D7DDD9', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' }, discardedKey: { position: 'absolute', top: -12, width: 110, height: 75, transform: [{ rotate: '31deg' }] }, trashLabel: { color: colors.muted, fontFamily: fonts.display, fontSize: 19, marginBottom: 21 },
});
