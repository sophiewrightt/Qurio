import { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { chemistryElements } from '../data/moduleFour';
import { HoveringImage } from './HoveringImage';
import { QuantumChairs } from './ParticleFamiliesLesson';
import { PrimaryButton } from './PrimaryButton';
import { TerminologyCard } from './TerminologyCard';

const art: Record<string, ImageSourcePropType> = {
  hydrogen: require('../assets/module-4/lesson-4/hydrogen.png'), helium: require('../assets/module-4/lesson-4/helium.png'),
  neon_: require('../assets/module-4/lesson-4/neon_.png'), sodium: require('../assets/module-4/lesson-4/sodium.png'),
  aluminium: require('../assets/module-4/lesson-4/aluminium.png'), potassium: require('../assets/module-4/lesson-4/potassium.png'),
  calcium: require('../assets/module-4/lesson-4/calcium.png'), arsenic: require('../assets/module-4/lesson-4/arsenic.png'),
  gold: require('../assets/module-4/lesson-4/gold.png'), radium: require('../assets/module-4/lesson-4/radium.png'),
  oganesson: require('../assets/module-4/lesson-4/oganesson.png'),
  proton: require('../assets/module-4/lesson-4/proton.png'), neutron: require('../assets/module-4/lesson-4/neutron.png'),
  electron: require('../assets/module-4/lesson-4/electron_.png'), atom: require('../assets/module-4/lesson-4/Carbon.png'),
};
type ElementStop = typeof chemistryElements[number];

function AtomPicture({ element }: { element: ElementStop }) {
  const total = element.z + element.neutrons, nucleusRadius = 5 + Math.cbrt(total) * 3.1;
  return <View accessible accessibilityLabel={`${element.name} atom: ${element.z} protons, ${element.neutrons} neutrons, ${element.z} electrons. Schematic, not to scale.`} style={s.atomSmall}>
    <View style={s.cloud} />
    {element.shells.map((count, shell) => {
      const radius = 38 + shell * 4.5;
      return <View key={shell} style={StyleSheet.absoluteFill}>
        <View style={[s.ring, { width: radius*2, height: radius*2, borderRadius: radius, left: 70-radius, top: 70-radius }]} />
        {Array.from({ length: count }, (_, i) => <Image key={i} accessible={false} source={art.electron} style={{ position:'absolute', width:5, height:5, left:67.5+radius*Math.cos(i/count*Math.PI*2+shell*.4), top:67.5+radius*Math.sin(i/count*Math.PI*2+shell*.4) }} />)}
      </View>;
    })}
    {Array.from({ length: total }, (_, i) => {
      const radius = Math.sqrt(i / Math.max(1,total-1)) * nucleusRadius, angle = i * 2.39996;
      // Distribute exactly Z protons throughout the illustrated isotope, interleaved with neutrons.
      const proton = Math.floor((i+1)*element.z/total) > Math.floor(i*element.z/total);
      const size = total > 80 ? 4 : total > 20 ? 7 : 11;
      return <Image key={i} accessible={false} source={proton ? art.proton : art.neutron} style={{ position:'absolute', width:size, height:size, left:70-size/2+radius*Math.cos(angle), top:70-size/2+radius*Math.sin(angle) }} />;
    })}
  </View>;
}

function MaterialPicture({ z }: { z: number }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse,{toValue:1,duration:1300,useNativeDriver:true}),
      Animated.timing(pulse,{toValue:0,duration:1300,useNativeDriver:true}),
    ])); loop.start(); return () => loop.stop();
  }, [pulse]);
  const floating = { transform:[{translateY:pulse.interpolate({inputRange:[0,1],outputRange:[5,-7]})}] };
  if(z===1) return <Animated.View accessibilityLabel="Hydrogen molecule, H₂" style={[s.material,floating]}>
    <Image source={require('../assets/module-4/lesson-4/hydrogen_.png')} style={s.hydrogenLeft} resizeMode="contain" />
    <Image source={require('../assets/module-4/lesson-4/hydrogen_.png')} style={s.hydrogenRight} resizeMode="contain" />
    <Text style={s.moleculeLabel}>H₂</Text>
  </Animated.View>;
  if(z===2) return <Animated.View accessibilityLabel="Two floating helium balloons" style={[s.material,floating]}>
    <Image source={require('../assets/module-4/lesson-4/balloon_1.png')} style={s.balloonLeft} resizeMode="contain" />
    <Image source={require('../assets/module-4/lesson-4/balloon_2.png')} style={s.balloonRight} resizeMode="contain" />
  </Animated.View>;
  if(z===79) return <View accessibilityLabel="Gold ring and sparkling necklace" style={s.material}>
    <View style={s.necklace} /><View style={s.pendant} /><View style={s.goldRing} />
    {[0,1,2].map(i=><Animated.Text key={i} style={[s.sparkle,{left:12+i*44,top:18+(i%2)*68,opacity:pulse.interpolate({inputRange:[0,1],outputRange:[i===1?1:.2,i===1?.2:1]}),transform:[{scale:pulse.interpolate({inputRange:[0,1],outputRange:[.7,1.2]})}]}]}>✧</Animated.Text>)}
  </View>;
  if(z===118) return <View accessibilityLabel="Unknown everyday appearance" style={s.material}><Text style={[s.labOnly,{fontSize:90}]}>?</Text></View>;
  const sources: Record<number, ImageSourcePropType> = {
    10:require('../assets/module-4/lesson-4/neon_sign.png'),11:require('../assets/module-4/lesson-4/salt_shaker.png'),
    13:require('../assets/module-4/lesson-4/soda_can.png'),19:require('../assets/module-4/lesson-4/potato.png'),
    20:require('../assets/module-4/lesson-4/milk_carton.png'),33:require('../assets/module-4/lesson-4/poison_bottle.png'),
    88:require('../assets/module-4/lesson-4/radioactive_symbol.png'),
  };
  return <View style={s.material}>
    {z===10 && <Animated.Image accessible={false} source={sources[z]} resizeMode="contain" style={[s.neonShapeGlow,{opacity:pulse.interpolate({inputRange:[0,1],outputRange:[.25,.75]})}]} />}
    <Animated.Image accessibilityLabel={z===10?'Glowing sign':z===88?'Radioactivity symbol':undefined} source={sources[z]} resizeMode="contain" style={[s.materialImage,z===10 && {width:150,height:140},{transform:[{scale:pulse.interpolate({inputRange:[0,1],outputRange:[z===88?.9:1,z===88?1.06:1]})}]}]} />
    {z===11 && <Image accessible={false} source={require('../assets/module-4/lesson-4/salt_.png')} style={s.saltPile} resizeMode="contain" />}
  </View>;
}

export function ElementExplorer({ onComplete }: { onComplete: () => void }) {
  const [index,setIndex]=useState(0), [busy,setBusy]=useState(false);
  const current=useRef(0), running=useRef(false), alive=useRef(true), notified=useRef(false);
  const arrival=useRef(new Animated.Value(1)).current;
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;arrival.stopAnimation();};},[arrival]);
  const element=chemistryElements[index]!, next=chemistryElements[index+1];
  const add=()=>{
    if(running.current || current.current>=chemistryElements.length-1)return;
    running.current=true;setBusy(true);arrival.setValue(0);
    const destination=current.current+1;
    Animated.timing(arrival,{toValue:1,duration:700,useNativeDriver:true}).start(({finished})=>{
      if(!alive.current||!finished)return;
      current.current=destination;setIndex(destination);running.current=false;setBusy(false);
      if(destination===chemistryElements.length-1&&!notified.current){notified.current=true;onComplete();}
    });
  };
  return <View style={s.explorer}>
    <Text accessibilityLiveRegion="polite" style={s.elementName}>{element.name}</Text>
    <Text style={s.hint}>Discovery {index+1} of {chemistryElements.length}</Text>
    <View style={s.explorerScene}>
      <View style={s.atomColumn}>
        <AtomPicture element={element}/>
        {busy && <Animated.Image accessible={false} source={art.proton} style={[s.incoming,{opacity:arrival.interpolate({inputRange:[0,.8,1],outputRange:[1,1,0]}),transform:[{translateY:arrival.interpolate({inputRange:[0,1],outputRange:[-65,0]})}]}]}/ >}
        <Text style={s.count}>{element.z} proton{element.z===1?'':'s'}</Text>
        <Text style={s.hint}>{element.neutrons} neutrons{`\n`}{element.z} electron{element.z===1?'':'s'}</Text>
      </View>
      <View style={s.materialColumn}><Image accessibilityLabel={`${element.symbol}, atomic number ${element.z}`} source={art[element.tile]} resizeMode="contain" style={s.elementTile}/><MaterialPicture key={element.z} z={element.z}/></View>
    </View>
    <Text accessibilityLiveRegion="polite" style={s.body}>{element.text}</Text>
    {next && <Pressable accessibilityRole="button" accessibilityLabel={`Add ${next.z-element.z} proton${next.z-element.z===1?'':'s'}`} disabled={busy} onPress={add} style={[s.protonButton,busy && {opacity:.55}]}><Image accessible={false} source={art.proton} style={s.protonIcon}/><Text style={s.protonPlus}>+</Text><Text style={s.protonLabel}>{busy?'Adding protons…':`Add ${next.z-element.z} proton${next.z-element.z===1?'':'s'}`}</Text></Pressable>}
    {index>0 && <Pressable accessibilityRole="button" accessibilityLabel="Previous element" disabled={busy} onPress={()=>{if(running.current)return;current.current=Math.max(0,current.current-1);setIndex(current.current);}} style={s.smallButton}><Text style={s.link}>‹ Previous element</Text></Pressable>}
  </View>;
}

function AlexFigure() {
  return <Image accessible={false} source={require('../assets/module-4/refinements/alex_full_body.png')} resizeMode="contain" style={s.alexFigure}/>;
}

export function WithoutPauliLab({ onComplete }: { onComplete: () => void }) {
  const [phase,setPhase]=useState<'ready'|'running'|'done'>('ready');
  const [sceneWidth,setSceneWidth]=useState(272);
  const sceneScale=Math.min(.78,sceneWidth/480-.02);
  const running=useRef(false),alive=useRef(true),notified=useRef(false),progress=useRef(new Animated.Value(0)).current;
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;progress.stopAnimation();};},[progress]);
  const play=()=>{
    if(running.current)return;running.current=true;setPhase('running');progress.setValue(0);
    Animated.timing(progress,{toValue:1,duration:5200,useNativeDriver:true}).start(({finished})=>{
      if(!alive.current||!finished)return;running.current=false;setPhase('done');
      if(!notified.current){notified.current=true;onComplete();}
    });
  };
  return <View style={s.section}>
    <PrimaryButton label={phase==='ready'?'See what happens':phase==='running'?'Imagine the change…':'Replay the thought experiment'} disabled={phase==='running'} onPress={play}/>
    <View onLayout={e=>setSceneWidth(e.nativeEvent.layout.width)} style={s.consequenceScene}><View style={s.consequenceHalf}>
    <View accessibilityLabel="Imagined electron rearrangement: electrons move into a shared extended orbital around, not inside, the nucleus" style={[s.collapseScene,{transform:[{scale:sceneScale}]}]}>
      {[48,82,112].map(r=><Animated.View key={r} style={[s.ring,{width:r*2,height:r*2,borderRadius:r,left:120-r,top:120-r,opacity:progress.interpolate({inputRange:[0,.45,1],outputRange:[.7,0,0]})}]}/ >)}
      <Animated.View style={[s.lowestCloud,{opacity:progress.interpolate({inputRange:[0,.45,1],outputRange:[0,.8,.8]})}]}/>
      {Array.from({length:12},(_,i)=><Image key={i} accessible={false} source={i%2?art.proton:art.neutron} style={[s.centreNucleus,{width:8,height:8,left:116+Math.sqrt(i)*3*Math.cos(i*2.4),top:116+Math.sqrt(i)*3*Math.sin(i*2.4)}]}/>)}
      {Array.from({length:6},(_,i)=>{const angle=i*Math.PI/3, radius=i<2?48:82;return <Animated.Image key={i} accessible={false} source={art.electron} style={[s.shellElectron,{transform:[
        {translateX:progress.interpolate({inputRange:[0,.45,1],outputRange:[Math.cos(angle)*radius,Math.cos(angle)*33,Math.cos(angle)*33]})},
        {translateY:progress.interpolate({inputRange:[0,.45,1],outputRange:[Math.sin(angle)*radius,Math.sin(angle)*33,Math.sin(angle)*33]})},
      ]}]}/>;})}
    </View>
    </View><View style={s.consequenceHalf}>
    <View accessibilityLabel="Alex dissolves in a symbolic cartoon of a world without familiar chemistry" style={[s.alexScene,{transform:[{scale:sceneScale}]}]}>
      {Array.from({length:24},(_,i)=>{const x=i%4*35,y=Math.floor(i/4)*32;return <Animated.View key={i} style={{position:'absolute',left:50+x,top:y,width:35,height:32,overflow:'hidden',opacity:progress.interpolate({inputRange:[0,.55,1],outputRange:[1,1,0]}),transform:[
        {translateX:progress.interpolate({inputRange:[0,.55,1],outputRange:[0,0,(i%4-1.5)*26]})},
        {translateY:progress.interpolate({inputRange:[0,.55,1],outputRange:[0,0,24+(i%3)*12]})},
      ]}}><View style={{position:'absolute',left:-x,top:-y}}><AlexFigure/></View></Animated.View>;})}
    </View>
    </View></View>
    {phase==='done' && <Text style={s.result}>Without Pauli’s rule, the usual shell-filling pattern would disappear. Chemical bonding and ordinary matter would be radically different.</Text>}
  </View>;
}

// Shared coordinates in the 1050 × 587 cropped source keep shading on the cells.
const groups = [
  {number:1,x:24,top:18},{number:2,x:79,top:72},
  {number:13,x:692,top:72},{number:14,x:747,top:72},
  {number:15,x:803,top:72},{number:16,x:859,top:72},
  {number:17,x:915,top:72},{number:18,x:971,top:18},
];
export function PeriodicColumns({ onComplete }: { onComplete: () => void }) {
  const [index,setIndex]=useState(0), current=useRef(0), notified=useRef(false);
  const callback=useRef(onComplete); callback.current=onComplete;
  useEffect(()=>{
    const timer=setInterval(()=>{
      current.current=(current.current+1)%groups.length;
      setIndex(current.current);
      if(current.current===0&&!notified.current){notified.current=true;callback.current();}
    },1500);
    return()=>clearInterval(timer);
  },[]);
  const group=groups[index]!;
  return <View style={s.section}>
    <View accessibilityLabel={`Periodic table, group ${group.number} highlighted vertically`} style={s.table}>
      <Image accessible={false} source={require('../assets/module-4/lesson-4/periodic_table.png')} style={[StyleSheet.absoluteFill,{width:'100%',height:'100%'}]} resizeMode="contain"/>
      <View pointerEvents="none" testID="column-shading" style={{position:'absolute',left:`${group.x/1050*100}%`,top:`${group.top/587*100}%`,width:`${55/1050*100}%`,height:`${(409-group.top)/587*100}%`,borderWidth:2,borderColor:'#722C79',backgroundColor:'#8A366999',borderRadius:2}}/>
    </View>
    <Text style={s.count}>Group {group.number}</Text>
  </View>;
}

export function FermionChemistryLesson({ onComplete }: { onComplete: () => void }) {
  const [chairsDone,setChairsDone]=useState(false),[imagined,setImagined]=useState(false),[elementsDone,setElementsDone]=useState(false),[columnsDone,setColumnsDone]=useState(false);
  return <View style={s.section}>
    <Text accessibilityRole="header" style={s.title}>Fermions firm in chemistry</Text>
    <Text style={s.body}>What would happen if the Pauli exclusion principle didn’t exist?</Text>
    <Text style={s.body}>Well, two identical fermions could occupy the same complete state. Let’s imagine it.</Text>
    <QuantumChairs family="fermion" withoutPauli onComplete={()=>setChairsDone(true)}/>
    {chairsDone && <>
      <Text accessibilityRole="header" style={s.heading}>So what’s the big deal?</Text>
      <Text style={s.body}>Atoms have a nucleus, surrounded by an electron cloud.</Text>
      <HoveringImage source={art.atom!} accessibilityLabel="Carbon atom: a nucleus surrounded by an electron cloud" style={s.atomHero}/>
      <Text style={s.body}>We can organise the allowed electron states into shells. Think of limited seats: up to 2 in the first shell, 8 in the second, 18 in the third, and so on.</Text>
      <View style={s.seatCounts}>{[2,8,18].map((n,i)=><View key={n} style={s.seatCount}><Text style={s.hint}>Shell {i+1}{`\n`}maximum</Text><Text style={s.capacity}>{n}</Text></View>)}</View>
      <Text style={s.body}>Electrons fill the lowest available energy states first, which can sometimes mean moving between shells. The first shell is lowest, but it has only two seats, with different spins. Other seats fill when lower-energy seats are taken.</Text>
      <Text style={s.body}>It’s as if the lower seats are VIP seats. If they’re already filled, you have to find other seats, but you’d prefer the lowest-energy seats available.</Text>
      <HoveringImage source={require('../assets/module-2/spa-mask-transparent.png')} accessibilityLabel="Relaxed spa electron" style={s.spa}/>
      <TerminologyCard term="Principle of minimum energy" definition="The ground state is the lowest total-energy state allowed for a system. An atom can move towards it by releasing energy through allowed changes."/>
      <Text style={s.body}>So what does this mean? If we imagined removing Pauli’s rule, electrons would no longer need different quantum seats.</Text>
      <WithoutPauliLab onComplete={()=>setImagined(true)}/>
    </>}
    {imagined && <>
      <Text style={s.body}>Without the electron arrangements that govern bonding, we wouldn’t have chemistry or life as we know it. Maybe we should be grateful that fermions follow these rules for us!</Text>
      <Text accessibilityRole="header" style={s.heading}>A periodic mystery</Text>
      <Text style={s.body}>The periodic table might look scary, but you already know some of its building blocks.</Text>
      <Image accessibilityLabel="Periodic table" source={require('../assets/module-4/lesson-4/periodic_table.png')} resizeMode="contain" style={s.table}/>
      <Text style={s.body}>You’ve met the electron.</Text><HoveringImage source={require('../assets/particles/electron-content.png')} accessibilityLabel="Smiling electron" style={s.friend}/>
      <Text style={s.body}>And you’ve met the nucleus, made of protons and neutrons. This is pretty much everything that makes up each element.</Text>
      <Image source={art.atom} accessibilityLabel="Nucleus of red protons and purple neutrons, surrounded by blue electrons" resizeMode="contain" style={s.atomHero}/>
      <Text style={s.body}>What makes one element different from another? Not some secret mystery. It’s the number of protons!</Text>
      <Text style={s.body}>Add protons to explore familiar elements. We’ll jump over some numbers along the way.</Text>
      <ElementExplorer onComplete={()=>setElementsDone(true)}/>
    </>}
    {elementsDone && <>
      <Text style={s.body}>Adding just one proton changes which element an atom is. Changing only its electrons makes an ion of the same element.</Text>
      <Text accessibilityRole="header" style={s.heading}>Why is it organised in this table?</Text>
      <Text style={s.body}>Remember valence electrons? They’re the electrons in the outermost shell for the main-group atoms we’re comparing.</Text>
      <Text style={s.body}>Elements in the same main-group column have similar outer-electron arrangements. That helps give them similar properties: electrons can be shared or transferred when atoms form bonds.</Text>
      <PeriodicColumns onComplete={()=>setColumnsDone(true)}/>
    </>}
    {columnsDone && <>
      <Text accessibilityRole="header" style={s.heading}>Now you know a bit of chemistry!</Text>
      <Text style={s.body}>Protons choose the element. Electrons shape its bonding. And Pauli’s rule helps give those electrons their shell structure.</Text>
      <PrimaryButton label="Start the quiz" onPress={onComplete}/>
    </>}
  </View>;
}

const s=StyleSheet.create({
  section:{gap:18},title:{fontFamily:fonts.display,fontSize:35,lineHeight:42,color:colors.ink,textAlign:'center',marginVertical:14},
  heading:{fontFamily:fonts.display,fontSize:30,lineHeight:37,color:colors.ink,textAlign:'center',marginTop:20},body:{fontFamily:fonts.body,fontSize:23,lineHeight:31,color:colors.ink},
  hint:{fontFamily:fonts.body,fontSize:17,lineHeight:22,color:colors.muted,textAlign:'center'},underlined:{textDecorationLine:'underline'},
  atomHero:{width:'100%',height:260},friend:{width:115,height:125,alignSelf:'center'},spa:{width:150,height:160,alignSelf:'center'},
  seatCounts:{flexDirection:'row',gap:10},seatCount:{flex:1,alignItems:'center',paddingVertical:12,backgroundColor:'#F0E4EE',borderRadius:18},capacity:{fontFamily:fonts.display,fontSize:34,color:'#A14582'},
  explorer:{gap:14,paddingVertical:18,borderTopWidth:2,borderBottomWidth:2,borderColor:'#DEC2D6'},elementName:{fontFamily:fonts.display,fontSize:30,lineHeight:37,color:colors.ink,textAlign:'center'},
  explorerScene:{flexDirection:'row',alignItems:'center',justifyContent:'center',minHeight:245},atomColumn:{flex:1,alignItems:'center'},materialColumn:{flex:1,alignItems:'center'},
  atomSmall:{width:140,height:140},cloud:{position:'absolute',inset:3,borderRadius:70,backgroundColor:'#81C3F41C',borderWidth:8,borderColor:'#81C3F408'},
  ring:{position:'absolute',borderWidth:1,borderColor:'#6CAED866'},count:{fontFamily:fonts.display,fontSize:22,lineHeight:29,color:'#844374',textAlign:'center'},
  elementTile:{width:86,height:86},material:{width:140,height:140,alignItems:'center',justifyContent:'center'},materialImage:{width:108,height:126},
  incoming:{position:'absolute',width:16,height:16,left:'50%',marginLeft:-8,top:62},smallButton:{minHeight:48,justifyContent:'center',alignItems:'center'},link:{fontFamily:fonts.body,fontSize:21,color:colors.primary},
  hydrogenLeft:{position:'absolute',width:54,height:54,left:28,top:35},hydrogenRight:{position:'absolute',width:54,height:54,left:65,top:35},moleculeLabel:{position:'absolute',bottom:12,fontFamily:fonts.body,fontSize:24,color:colors.ink},
  balloonLeft:{position:'absolute',width:80,height:140,left:5},balloonRight:{position:'absolute',width:80,height:140,left:52},
  neonShapeGlow:{position:'absolute',width:162,height:152,tintColor:'#FA3869'},
  protonButton:{minHeight:68,alignSelf:'center',flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:22,paddingVertical:10,backgroundColor:'#FFE2D8',borderColor:'#BA5142',borderWidth:2,borderRadius:30,transform:[{rotate:'-2deg'}]},protonIcon:{width:40,height:40},protonPlus:{fontFamily:fonts.display,fontSize:30,color:'#B5342D'},protonLabel:{fontFamily:fonts.display,fontSize:24,color:'#7B322B'},saltPile:{position:'absolute',width:73,height:33,bottom:0,right:0},
  necklace:{position:'absolute',top:15,left:28,width:77,height:77,borderRadius:44,borderWidth:5,borderColor:'#D7A929',transform:[{rotate:'-18deg'}]},
  pendant:{position:'absolute',width:17,height:24,top:80,left:61,borderWidth:3,borderColor:'#B88616',backgroundColor:'#F5D16C',borderRadius:6,transform:[{rotate:'-12deg'}]},
  goldRing:{position:'absolute',width:38,height:45,bottom:12,right:10,borderRadius:22,borderWidth:7,borderColor:'#DCAA2A',transform:[{rotate:'25deg'}]},sparkle:{position:'absolute',fontSize:30,color:'#D5A00B'},
  labOnly:{fontFamily:fonts.display,fontSize:23,color:'#B33C87',marginBottom:8},consequenceScene:{flexDirection:'row',width:'100%',height:215},consequenceHalf:{flex:1,alignItems:'center',justifyContent:'center',overflow:'hidden'},collapseScene:{width:240,height:240,alignSelf:'center',transform:[{scale:.68}]},
  centreNucleus:{position:'absolute',width:20,height:20,top:110,left:110},shellElectron:{position:'absolute',width:12,height:12,top:114,left:114},
  lowestCloud:{position:'absolute',width:90,height:90,left:75,top:75,borderRadius:45,backgroundColor:'#7EC5EF55',borderWidth:10,borderColor:'#7EC5EF22'},
  alexScene:{width:240,height:225,alignSelf:'center',transform:[{scale:.72}]},alexFigure:{width:140,height:192},alexFace:{width:80,height:78,top:0,left:30},alexBody:{position:'absolute',left:66,top:69,width:6,height:75,borderRadius:4,backgroundColor:'#343532'},alexLimb:{position:'absolute',width:5,height:56,borderRadius:4,backgroundColor:'#343532'},
  result:{fontFamily:fonts.body,fontSize:22,lineHeight:29,color:colors.ink,padding:16,backgroundColor:'#F0E4EE',borderRadius:15},table:{width:'100%',aspectRatio:831/465},groupDetail:{gap:8,padding:16,borderRadius:14,backgroundColor:'#F0E4EE'},
});
