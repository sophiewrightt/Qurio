import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { LessonBadge } from '../components/LessonBadge';
import { LessonQuiz } from '../components/LessonQuiz';
import { FriendlyBosonsLesson } from '../components/FriendlyBosonsLesson';
import { friendlyBosonQuestions } from '../data/moduleFour';
import { colors, fonts } from '../constants/theme';

export function ModuleFourLessonFiveScreen({ onHome, onComplete }: { onHome: () => void; onComplete: (correct: number) => void }) {
  const [quiz,setQuiz]=useState(false);
  if(quiz) return <SafeAreaView style={s.safe}>
    <Text style={s.module}>CHAPTER 4 · FRIENDLY BOSONS</Text>
    <LessonQuiz questions={friendlyBosonQuestions} takeaway="Bosons can share a quantum state. Bose enhancement favours allowed transitions into occupied states; suitable conditions can produce a Bose-Einstein condensate." onFinish={onComplete}/>
  </SafeAreaView>;
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content}>
    <Text accessibilityRole="button" onPress={onHome} style={s.back}>‹ Home</Text>
    <Text style={s.module}>CHAPTER 4 · BETTER TOGETHER</Text><LessonBadge number={5} world={4}/>
    <FriendlyBosonsLesson onComplete={()=>setQuiz(true)}/>
  </ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:colors.background},content:{padding:24,paddingBottom:80,maxWidth:640,width:'100%',alignSelf:'center'},back:{color:colors.primary,fontFamily:fonts.body,fontSize:20,paddingVertical:16},module:{color:'#B33C87',fontFamily:fonts.display,fontSize:14,letterSpacing:1.5,textAlign:'center',marginTop:10}});
