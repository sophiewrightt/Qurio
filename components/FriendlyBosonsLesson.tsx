import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { QuantumChairs } from './ParticleFamiliesLesson';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';

const photon = require('../assets/lesson-9/photon-default-transparent.png');
const office = require('../assets/module-4/refinements/photon_+_co.png');
const snowflake = require('../assets/lesson-6/interactions/snowflake-transparent.png');
const friendly = require('../assets/module-4/refinements/friendly_photon.png');
const unfriendly = require('../assets/module-4/refinements/unfriendly_electron.png');
const einstein = require('../assets/module-4/lesson-5/einstein_happy_face.png');

// One cancellable playback per action; replays never award completion twice.
function usePlayback(onComplete: () => void) {
  const progress = useRef(new Animated.Value(0)).current;
  const [running, setRunning] = useState(false);
  const busy = useRef(false), alive = useRef(true), callback = useRef(onComplete);
  callback.current = onComplete;
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; progress.stopAnimation(); };
  }, [progress]);
  return { progress, running, play(duration: number) {
    if (busy.current) return;
    busy.current = true; setRunning(true); progress.setValue(0);
    Animated.timing(progress, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }).start(({ finished }) => {
      if (!alive.current) return;
      busy.current = false; setRunning(false);
      if (finished) callback.current();
    });
  } };
}

function Blizzard({ active }: { active: boolean }) {
  const wind = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) return;
    wind.setValue(0);
    const loop = Animated.loop(Animated.timing(wind, { toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web' }));
    loop.start(); return () => { loop.stop(); wind.stopAnimation(); };
  }, [active, wind]);
  if (!active) return null;
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {Array.from({ length: 22 }, (_, i) => <Animated.Image key={i} accessible={false} source={snowflake} resizeMode="contain" style={{ position: 'absolute', width: 15+i%3*7, height: 15+i%3*7, left: (i*67)%440-110, top: (i*47)%365,
      opacity: .4+i%3*.2, transform: [{ translateX: wind.interpolate({inputRange:[0,1],outputRange:[-160,200]}) }, { translateY: wind.interpolate({inputRange:[0,1],outputRange:[-45,70]}) }, { rotate: wind.interpolate({inputRange:[0,1],outputRange:['0deg','160deg']}) }] }} />)}
  </View>;
}

export function PhotonOffice({ onComplete }: { onComplete: () => void }) {
  const [phase,setPhase] = useState<'high'|'lower'|'cold'>('high');
  const [scale,setScale] = useState(1);
  const stage = useRef<'drop'|'cool'>('drop'), notified = useRef(false);
  const bounce=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    const loop=Animated.loop(Animated.sequence([
      Animated.timing(bounce,{toValue:1,duration:1300,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
      Animated.timing(bounce,{toValue:0,duration:1300,easing:Easing.inOut(Easing.sin),useNativeDriver:true}),
    ])); loop.start();return()=>{loop.stop();bounce.stopAnimation();};
  },[bounce]);
  const {progress,running,play} = usePlayback(() => {
    if(stage.current==='drop') setPhase('lower');
    else { setPhase('cold'); if(!notified.current){notified.current=true;onComplete();} }
  });
  const cooling=stage.current==='cool'&&(running||phase==='cold');
  const start=()=>{
    if(running||phase==='cold')return;
    stage.current=phase==='high'?'drop':'cool';
    play(stage.current==='drop'?3600:4800);
  };
  return <View style={s.section}>
    <Text style={s.body}>Let’s pretend we have photons in an office building. Each floor stands for one allowed quantum state with a different energy.</Text>
    <View testID="photon-office" onLayout={e=>setScale(Math.min(1,e.nativeEvent.layout.width/360))} style={s.officeFrame}>
      <View style={[s.officeCanvas,{transform:[{scale}]}]}>
        <Image accessible={false} source={office} resizeMode="contain" style={s.officeArt}/>
        <Text style={s.highEnergy}>Highest{`\n`}energy</Text>
        <Text style={s.lowEnergy}>Lowest{`\n`}energy</Text>
        {cooling && <View pointerEvents="none" style={s.frost}/>}
        {Array.from({length:10},(_,i)=>{
          const highY=129+(i%4)*50, lowY=i<7?279:229;
          const fromX=stage.current==='cool'?123+i%3*32:123+Math.floor(i/4)*32;
          const toX=stage.current==='cool'?166+i%3*2:123+i%3*32;
          return <Animated.View key={i} style={{position:'absolute',left:0,top:0,transform:[
            {translateX:progress.interpolate({inputRange:[0,.1+i*.03,.65+i*.03,1],outputRange:[fromX,fromX,toX,toX]})},
            {translateY:progress.interpolate({inputRange:[0,.1+i*.03,.65+i*.03,1],outputRange:[stage.current==='cool'?lowY:highY,stage.current==='cool'?lowY:highY,stage.current==='cool'?279:lowY,stage.current==='cool'?279:lowY]})},
          ]}}>
            <Animated.Image accessible={false} source={photon} resizeMode="contain" style={[s.officePhoton,{opacity:phase==='cold'?.55:1,transform:[
              {translateX:cooling?0:bounce.interpolate({inputRange:[0,1],outputRange:i%2?[-9,9]:[9,-9]})},
              {translateY:cooling?0:bounce.interpolate({inputRange:[0,.5,1],outputRange:phase==='lower'?[0,-13,0]:[0,-2,0]})},
              {scale:phase==='cold'?1.25:1},
            ]}]}/>
          </Animated.View>;
        })}
        <Blizzard active={cooling && running}/>
      </View>
    </View>
    {phase==='lower'&&!running && <Text style={s.partyText}>♪ PARTY ON THE GROUND FLOOR! ♫</Text>}
    {phase==='high' && <PrimaryButton label={running?'Photons on the move…':'Let the photons lose energy'} disabled={running} onPress={start}/>}
    {phase!=='high' && <>
      <Text style={s.body}>As energy passes to the surroundings, lower-energy states become more populated. Bosons don’t mind sharing a floor!</Text>
      <Text style={s.body}>They share the same floors, nothing happens…</Text>
      <Text style={s.body}>What if these photons are cooled to an extremely low temperature? A blizzard is expected across the land where Photon & Co is. Let’s see what happens.</Text>
      <Text style={s.hint}>The blizzard is our cooling metaphor; real photon condensates need a suitable light trap and energy exchange.</Text>
      {phase==='lower' && <PrimaryButton label={running?'Cooling Photon & Co…':'Send in the blizzard'} disabled={running} onPress={start}/>}
    </>}
    {phase==='cold' && <View style={s.newSection}>
      <Text style={s.body}>With enough bosons and the right conditions, a large fraction can occupy the lowest quantum state. Quantum behaviour can then show up across the whole collection!</Text>
    </View>}
  </View>;
}

export function FriendlyComparison({ family }: { family:'fermion'|'boson' }) {
  const isBoson=family==='boson';
  return <View style={s.section}>
    <Text style={s.heading}>{isBoson?'Friendly bosons':'Unfriendly fermions'}</Text>
    <Text style={s.body}>{isBoson?'Bosons encourage sharing a quantum state.':'Identical fermions cannot share the same complete quantum state.'}</Text>
    <Image accessibilityLabel={isBoson?'Two friendly photons: Come over here!':'Two unfriendly electrons: This spot’s taken…'} source={isBoson?friendly:unfriendly} resizeMode="contain" style={s.comparison}/>
  </View>;
}

export function FriendlyBosonsLesson({onComplete}:{onComplete:()=>void}) {
  const [seated,setSeated]=useState(false),[condensed,setCondensed]=useState(false);
  return <View style={s.section}>
    <Text accessibilityRole="header" style={s.title}>Happy, friendly bosons</Text>
    <Text style={s.body}>Identical fermions are not willing to share the same complete quantum state (thankfully), but bosons are happy to.</Text>
    <QuantumChairs family="boson" onComplete={()=>setSeated(true)}/>
    {seated && <PhotonOffice onComplete={()=>setCondensed(true)}/>}
    {condensed && <>
      <Text style={s.body}>Interactions with the environment can hide collective quantum effects. But interactions do not always destroy them: controlled energy exchange can help a system settle into a collective state.</Text>
      <Text style={s.heading}>And what’s this called?</Text>
      <Text accessibilityRole="header" accessibilityLabel="A Bose-Einstein condensate!" style={s.rainbow}>{'A Bose-Einstein condensate!'.split('').map((c,i)=><Text key={i} style={{color:['#B63D6F','#B76320','#927209','#347750','#237C9E','#8553A0'][i%6]}}>{c}</Text>)}</Text>
      <Image accessibilityLabel="Happy Einstein" source={einstein} resizeMode="contain" style={s.einstein}/>
      <Text style={s.hint}>Named for Satyendra Nath Bose and Albert Einstein.</Text>
      <TerminologyCard term="Bose-Einstein condensate" definition="A collective state in which a large fraction of identical bosons occupies the same lowest-energy quantum state."/>
      <Text style={s.body}>This makes some quantum effects easier to see at a larger scale, such as interference between whole clouds of atoms.</Text>
      <Text accessibilityRole="header" style={s.heading}>Friendly bosons</Text>
      <Text style={s.body}>If fermions seem unfriendly about sharing a state, bosons are quite the opposite. They actually <Text style={{fontWeight:'bold'}}>encourage</Text> each other!</Text>
      <FriendlyComparison family="fermion"/>
      <FriendlyComparison family="boson"/>
      <TerminologyCard term="Bose enhancement" definition="For an allowed transition, occupation of a state by identical bosons increases the rate of another boson entering that state."/>
      <Text style={s.body}>An energy-changing transition still needs a way to exchange energy. “Friendly” means enhanced sharing, not attraction or a promise that every boson will join.</Text>
      <Text style={s.body}>Bosons can share states. Under the right conditions, that opens the door to quantum behaviour on a much bigger scale.</Text>
      <PrimaryButton label="Start the quiz" onPress={onComplete}/>
    </>}
  </View>;
}

const s=StyleSheet.create({
  section:{gap:16},title:{fontFamily:fonts.display,fontSize:36,lineHeight:42,textAlign:'center',color:colors.ink,marginVertical:20},
  heading:{fontFamily:fonts.display,fontSize:29,lineHeight:35,textAlign:'center',color:colors.ink,marginTop:22},
  body:{fontFamily:fonts.body,fontSize:23,lineHeight:31,color:colors.ink},hint:{fontFamily:fonts.body,fontSize:18,lineHeight:24,textAlign:'center',color:colors.muted},
  officeFrame:{width:'100%',maxWidth:360,aspectRatio:360/390,alignSelf:'center',overflow:'hidden'},
  officeCanvas:{position:'absolute',left:'50%',top:'50%',marginLeft:-180,marginTop:-195,width:360,height:390},
  officeArt:{position:'absolute',width:260,height:290,left:48,top:36},
  officePhoton:{width:32,height:32},
  frost:{position:'absolute',left:113,top:110,width:125,height:205,backgroundColor:'#CFEFFF',opacity:.24,borderColor:'#6DB5D0',borderWidth:3,borderRadius:4},
  rainbow:{fontFamily:fonts.display,fontSize:35,lineHeight:43,textAlign:'center',marginTop:10},einstein:{width:190,height:160,alignSelf:'center'},
  comparison:{height:245,width:'100%',maxWidth:420,alignSelf:'center'},
  highEnergy:{position:'absolute',left:310,top:123,fontFamily:fonts.body,fontSize:15,color:colors.ink},lowEnergy:{position:'absolute',left:310,top:280,fontFamily:fonts.body,fontSize:15,color:colors.ink},
  partyText:{fontFamily:fonts.display,fontSize:22,color:'#8D4482',textAlign:'center'},newSection:{borderTopWidth:2,borderColor:'#D8BBA7',paddingTop:22},
});
