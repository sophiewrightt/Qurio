export type PrototypeProfile = { username: string; mode: 'guest' | 'tester' };
export type TourStep = { screen: number; text: string; target?: string; action?: string; host?: 'dictionary' | 'packet' | 'shop'; delay?: number; clear?: boolean; keepScroll?: boolean };
export const tourSteps = {
  welcome: { screen: 0, text: 'Welcome to Qurio. Happy to have you here! Before we get stuck in, let me show you a few things you need to know.' },
  home: { screen: 0, text: 'This is your Home Screen.' },
  profile: { screen: 0, target: 'profile', text: 'If you click here, a side bar will pop up to give you more options like settings, profile… *yawn. Some of the boring stuff.' },
  streak: { screen: 0, target: 'streak', text: 'Every day you log on, your streak will continue! Be sure to keep your streak to unlock benefits!' },
  energy: { screen: 0, target: 'energy', text: 'This is your energy. You get 3 a day, and you can use one up to play a lesson. You can use them to replay lessons too.' },
  quanta: { screen: 0, target: 'quanta', text: 'This is quanta, the currency we use in the quantum world. You can earn it by unlocking achievements, and use it to unlock customisations for your friend…' },
  friendPause: { screen: 0, text: '', delay: 1000, clear: true },
  friend: { screen: 0, text: 'Friend…. We haven’t unlocked one yet! Let’s play our first lesson to discover one. And don’t worry, this one won’t cost any energy.' },
  firstLesson: { screen: 0, target: 'lesson-1', action: 'start-first', text: 'Click on the first lesson to play!' },
  lessonWelcome: { screen: 1, text: 'Welcome to your first lesson. Don’t worry, I’ll go away in a sec.' },
  lessonScroll: { screen: 1, text: 'Navigate by scrolling, and complete the interactives.' },
  lessonBye: { screen: 1, text: 'Ok! That’s all from me! Bye for now.' },
  quizIntro: { screen: 1, text: 'At the end of some lessons, there will be a quiz.' },
  quizKnowledge: { screen: 1, text: 'Don’t worry if you get questions wrong, nothing bad will happen. But this is a good chance to gain knowledge, which allows you to level up and unlock customisations. Give your first quiz a try.' },
  knowledge: { screen: 0, target: 'knowledge', text: 'I’m back… Wow! Looks like you’ve gained some knowledge.' },
  finalThings: { screen: 0, text: 'Now a few final things, and then I’ll get out of your hair.' },
  name: { screen: 0, target: 'name', action: 'name-focused', text: 'You’ve unlocked your electron friend! Click here to name it.' },
  exploreMessage: { screen: 0, text: 'Feel free to explore around, but I’ll come back to you later to show you some more things when you’re ready.' },
  dictionary: { screen: 0, target: 'dictionary', action: 'dictionary-open', text: 'It looks like you came across some new terminology in that lesson. Let’s go to the dictionary.' },
  dictionaryExplain: { screen: 0, host: 'dictionary', text: 'Whenever you unlock a new terminology card, the definition will be in your trusty dictionary, which you can look back at any time!' },
  achievements: { screen: 0, target: 'achievements', action: 'achievements-open', text: 'Looks like you also got an achievement! Let’s check your achievements.' },
  claim: { screen: 33, target: 'first-reward', clear: true, action: 'achievement-claimed', text: 'Click on the quanta next to the achievement to collect it.' },
  claimPause: { screen: 33, text: '', delay: 1000, clear: true },
  achievementsHome: { screen: 33, target: 'achievements-home', action: 'achievements-home', text: 'Nicely done! Let’s go back to Home.' },
  wardrobe: { screen: 0, target: 'wardrobe', action: 'wardrobe-open', text: 'We can spend our well earnt quanta on some accessories!' },
  wardrobeWelcome: { screen: 10, text: 'This is the wardrobe, where you can dress your particle with the accessories you unlock.' },
  market: { screen: 10, target: 'market', action: 'market-open', text: 'To unlock some new goodies, let’s visit the Q-market…..' },
  shopPause: { screen: 34, host: 'shop', text: '', delay: 1000, clear: true },
  packets: { screen: 34, host: 'shop', keepScroll: true, text: 'You can buy Q accessory packets here. You can also get accessory packets by finishing chapters!' },
  gift: { screen: 34, host: 'shop', keepScroll: true, text: 'Let’s buy one. I’ll give you 100 quanta!' },
  buy: { screen: 34, host: 'shop', keepScroll: true, target: 'buy-packet', action: 'packet-bought', text: 'Your 100 quanta are ready. Tap Buy for 100 Quanta to get your packet.' },
  packetPause: { screen: 34, host: 'packet', text: '', delay: 1000, clear: true },
  rip: { screen: 34, host: 'packet', target: 'rip-packet', action: 'packet-ripped', text: 'Tear open your packet to discover your customisations!' },
  otherMarket: { screen: 34, text: 'There are also some other things you can buy in the Q-market to check out later.' },
  backWardrobe: { screen: 34, target: 'shop-back', action: 'shop-back', text: 'For now, let’s go back to the wardrobe.' },
  dressUp: { screen: 10, target: 'drawers', text: 'You can put on the head wear, eye wear and facial wear you’ve unlocked here. You can also change your elementary particle once you’ve unlocked them as you go.' },
  goodbye: { screen: 10, text: 'That’s all for now. Bye!' },
} satisfies Record<string, TourStep>;
export type TourId = keyof typeof tourSteps | 'naming' | 'dictionaryBrowse' | 'exploring' | 'quiz' | 'waiting-four' | 'revealed' | 'done';
export type TourFeature = 'dictionary' | 'achievements' | 'wardrobe';
export type TourState = { step: TourId; gift: number; trialUsed: boolean; fourthComplete: boolean; noKnowledge?: boolean; noWord?: boolean; introduced?: TourFeature[] };
export function featureAvailable(state: TourState, feature: TourFeature) {
  return state.step === 'done' || state.introduced?.includes(feature) || state.step === feature;
}
export const initialTour: TourState = { step: 'welcome', gift: 0, trialUsed: false, fourthComplete: false };
export function tourForProfile(profile?: PrototypeProfile): TourState {
  return profile?.mode === 'guest' ? { ...initialTour } : { ...initialTour, step: 'done' };
}
const next: Partial<Record<TourId, TourId>> = {
  welcome: 'home', home: 'profile', profile: 'streak', streak: 'energy', energy: 'quanta', quanta: 'friendPause', friendPause: 'friend', friend: 'firstLesson',
  firstLesson: 'lessonWelcome', lessonWelcome: 'lessonScroll', lessonScroll: 'lessonBye', lessonBye: 'exploring',
  quizIntro: 'quizKnowledge', quizKnowledge: 'quiz', knowledge: 'finalThings', finalThings: 'name', name: 'naming', exploreMessage: 'waiting-four',
  dictionary: 'dictionaryExplain', dictionaryExplain: 'dictionaryBrowse', achievements: 'claim', claim: 'claimPause', claimPause: 'achievementsHome', achievementsHome: 'wardrobe', wardrobe: 'wardrobeWelcome', wardrobeWelcome: 'market', market: 'shopPause', shopPause: 'packets', packets: 'gift', gift: 'buy', buy: 'packetPause', packetPause: 'rip', rip: 'revealed', revealed: 'otherMarket', otherMarket: 'backWardrobe', backWardrobe: 'dressUp', dressUp: 'goodbye', goodbye: 'done',
};
export function tourStep(state: TourState): TourStep | undefined {
  const step = (tourSteps as Partial<Record<TourId, TourStep>>)[state.step];
  if (state.step === 'knowledge' && state.noKnowledge) return { ...tourSteps.knowledge, text: 'I’m back… Here’s your knowledge bar. Correct quiz answers earn knowledge. You can try again whenever you like!' };
  if (state.step === 'dictionary' && state.noWord) return { ...tourSteps.dictionary, text: 'Sorry to pester you again. It looks like you unlocked an achievement! Let’s also visit your dictionary, where words are saved when you read their terminology cards.' };
  return step;
}
// Expected-step matching makes stale presses and duplicate reward callbacks inert.
export function advanceTour(state: TourState, expected: TourId, event: string, tester: boolean): TourState {
  if (state.step === 'done' || state.step !== expected) return state;
  if (event === 'finish-four' || event === 'finish-four-no-word') return { ...state, fourthComplete: true, noWord: event === 'finish-four-no-word', step: state.step === 'waiting-four' ? 'dictionary' : state.step };
  if (event === 'quiz-visible' && state.step === 'exploring') return { ...state, step: 'quizIntro' };
  if (['finish-first', 'finish-first-no-knowledge'].includes(event) && ['quiz', 'exploring'].includes(state.step)) return { ...state, step: 'knowledge', noKnowledge: event === 'finish-first-no-knowledge' };
  if (state.step === 'revealed' && event === 'packet-done') return { ...state, step: 'otherMarket' };
  if (state.step === 'naming' && event === 'name-saved') return { ...state, step: 'exploreMessage' };
  if (state.step === 'dictionaryBrowse' && event === 'dictionary-close') return { ...state, step: 'achievements' };
  const definition = tourStep(state);
  if (!definition || event !== (definition.delay ? 'pause-ended' : definition.action ?? 'continue')) return state;
  let step = next[state.step] ?? state.step;
  if (tester && step === 'energy') step = 'quanta';
  if (step === 'waiting-four' && state.fourthComplete) step = 'dictionary';
  const introduced = [...(state.introduced ?? [])];
  if (event === 'dictionary-open') introduced.push('dictionary');
  if (event === 'achievements-open') introduced.push('achievements');
  if (event === 'wardrobe-open') introduced.push('wardrobe');
  return { ...state, step, introduced: [...new Set(introduced)], gift: state.step === 'gift' ? 100 : state.gift, trialUsed: state.trialUsed || event === 'start-first' };
}
