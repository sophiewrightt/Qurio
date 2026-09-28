import { createContext, forwardRef, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { fonts } from '../constants/theme';
import { tourStep, type TourId, type TourState } from '../data/onboarding';

type Rect = { x: number; y: number; width: number; height: number };
type TourContextValue = { state: TourState; screen: number; enabled: boolean; event: (event: string, expected?: TourId) => void; rect?: Rect; target?: string; setTarget: (id: string, rect?: Rect) => void };
const idle: TourContextValue = { state: { step: 'done', gift: 0, trialUsed: false, fourthComplete: false }, screen: 0, enabled: false, event: () => {}, setTarget: () => {} };
const Context = createContext(idle);
export function useTour() { return useContext(Context); }
export function OnboardingProvider({ state, screen, enabled, event, children }: Omit<TourContextValue, 'setTarget'> & { children: ReactNode }) {
  const [targetRect, setRect] = useState<{ target: string; rect?: Rect }>();
  const setTarget = useCallback((target: string, rect?: Rect) => setRect(previous => {
    if (previous?.target === target && JSON.stringify(previous.rect) === JSON.stringify(rect)) return previous;
    return { target, rect };
  }), []);
  return <Context.Provider value={{ state, screen, enabled, event, setTarget, ...targetRect }}>{children}</Context.Provider>;
}
type Scroller = { reveal: (rect: Rect) => void };
const ScrollContext = createContext<Scroller | undefined>(undefined);
// Anchor measurements use window coordinates; scrolling is delegated to their own scroll container.
export const TourScrollView = forwardRef<ScrollView, ScrollViewProps>(function TourScrollView(props, forwarded) {
  const ref = useRef<ScrollView>(null), offset = useRef(0);
  const { height } = useWindowDimensions();
  const reveal = useCallback((rect: Rect) => {
    ref.current?.getNativeScrollRef()?.measureInWindow((_x, y, _w, h) => {
      const desired = y + Math.min(120, h * 0.18);
      if (rect.y < y + 20 || rect.y + rect.height > Math.min(y + h, height) - 280)
        ref.current?.scrollTo({ y: Math.max(0, offset.current + rect.y - desired), animated: false });
    });
  }, [height]);
  return <ScrollContext.Provider value={{ reveal }}><ScrollView {...props} ref={node => {
    ref.current = node;
    if (typeof forwarded === 'function') forwarded(node); else if (forwarded) forwarded.current = node;
  }} onScroll={event => { offset.current = event.nativeEvent.contentOffset.y; props.onScroll?.(event); }} scrollEventThrottle={32} /></ScrollContext.Provider>;
});
export function TourAnchor({ id, children, style }: { id: string; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const tour = useTour(), scroller = useContext(ScrollContext), ref = useRef<View>(null);
  const definition = tourStep(tour.state);
  const active = tour.enabled && definition?.screen === tour.screen && definition.target === id;
  useEffect(() => {
    if (!active) return;
    let alive = true, revealed = false;
    const measure = () => ref.current?.measureInWindow((x, y, width, height) => {
      if (!alive || !width || !height) return;
      const rect = { x, y, width, height };
      if (!revealed) { revealed = true; if (!definition?.keepScroll) scroller?.reveal(rect); }
      tour.setTarget(id, rect);
    });
    measure(); const timer = setInterval(measure, 150);
    return () => { alive = false; clearInterval(timer); tour.setTarget(id, undefined); };
  }, [active, id, tour.state.step, tour.setTarget]);
  return <View ref={ref} collapsable={false} style={style}>{children}</View>;
}
export function TourWhenVisible({ children }: { children: ReactNode }) {
  const tour = useTour(), ref = useRef<View>(null), { height } = useWindowDimensions();
  useEffect(() => {
    if (!tour.enabled || tour.state.step !== 'exploring' || tour.screen !== 1) return;
    let alive = true;
    const timer = setInterval(() => ref.current?.measureInWindow((_x, y, w, h) => {
      if (alive && w > 0 && h > 0 && y >= 0 && y + h <= height) tour.event('quiz-visible', 'exploring');
    }), 250);
    return () => { alive = false; clearInterval(timer); };
  }, [tour.enabled, tour.state.step, tour.screen, height]);
  return <View ref={ref} collapsable={false}>{children}</View>;
}
export function TourOverlay({ host }: { host?: 'dictionary' | 'packet' | 'shop' }) {
  const tour = useTour(), step = tourStep(tour.state);
  const { width, height } = useWindowDimensions();
  const root = useRef<View>(null), fade = useRef(new Animated.Value(0)).current;
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [bubbleHeight, setBubbleHeight] = useState(240);
  const visible = tour.enabled && step?.screen === tour.screen && step.host === host;
  useEffect(() => {
    if (!visible || !step?.delay) return;
    const timer = setTimeout(() => tour.event('pause-ended', tour.state.step), step.delay);
    return () => clearTimeout(timer);
  }, [visible, tour.state.step]);
  useEffect(() => {
    if (!visible || !step) return;
    fade.setValue(0);
    const animation = Animated.timing(fade, { toValue: 1, duration: 380, useNativeDriver: Platform.OS !== 'web' });
    animation.start(); if (step.text) AccessibilityInfo.announceForAccessibility(step.text);
    return () => animation.stop();
  }, [visible, tour.state.step, fade]);
  if (!visible || !step) return null;
  const advance = () => { if (!step.action && !step.delay) tour.event('continue', tour.state.step); };
  const r = step.target === tour.target ? tour.rect : undefined;
  const left = r ? Math.max(0, r.x - origin.x - 5) : 0;
  const top = r ? Math.max(0, r.y - origin.y - 5) : 0;
  const right = r ? Math.min(width, r.x - origin.x + r.width + 5) : 0;
  const bottom = r ? Math.min(height, r.y - origin.y + r.height + 5) : 0;
  const hasHole = !!r && bottom > top && right > left;
  const below = bottom + 16;
  const bubbleTop = !hasHole ? Math.max(18, (height - bubbleHeight) / 2)
    : host === 'shop' ? Math.max(12, top - bubbleHeight - 16)
    : below + bubbleHeight < height - 12 ? below : Math.max(12, top - bubbleHeight - 16);
  const block = (style: ViewStyle, key: string) => <Pressable accessible={false} key={key} style={[s.shade, step.clear && { backgroundColor: 'transparent' }, style]} onPress={advance} />;
  return <View ref={root} onLayout={() => root.current?.measureInWindow((x, y) => setOrigin({ x, y }))} pointerEvents="box-none" style={s.overlay}>
    {hasHole ? <>
      {block({ left: 0, top: 0, width, height: top }, 'top')}
      {block({ left: 0, top, width: left, height: bottom - top }, 'left')}
      {block({ left: right, top, right: 0, height: bottom - top }, 'right')}
      {block({ left: 0, top: bottom, width, bottom: 0 }, 'bottom')}
      <View pointerEvents="none" style={[s.outline, { left, top, width: right - left, height: bottom - top }]} />
      {!step.action && <Pressable accessible={false} style={{ position: 'absolute', left, top, width: right - left, height: bottom - top }} onPress={advance} />}
    </> : block({ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }, 'all')}
    {!step.delay && <Animated.View onLayout={event => setBubbleHeight(event.nativeEvent.layout.height)} style={[s.bubble, { top: bubbleTop, width: Math.min(width - 28, 410), left: Math.max(14, (width - 410) / 2), opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }], maxHeight: height - 28 }]}>
      <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={advance} />
      <ScrollView><Pressable accessibilityRole={!step.action ? "button" : undefined} accessibilityLabel={!step.action ? "Tap anywhere to continue introduction" : undefined} onPress={advance}><Text style={s.eyebrow}>A LITTLE GUIDED TOUR</Text><Text accessibilityLiveRegion="polite" style={s.copy}>{step.text.split(/(knowledge)/i).map((part, index) => <Text key={index} style={part.toLowerCase() === 'knowledge' ? s.gold : undefined}>{part}</Text>)}</Text>
      {!step.action && <View style={s.next}><Text style={s.nextText}>tap anywhere to continue →</Text></View>}
      </Pressable></ScrollView>
    </Animated.View>}
  </View>;
}
const s = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: 1000, elevation: 50 }, shade: { position: 'absolute', backgroundColor: '#242031B3' },
  outline: { position: 'absolute', borderWidth: 2, borderColor: '#FFE39B', borderRadius: 16 },
  bubble: { position: 'absolute', backgroundColor: '#FFF9E9', borderWidth: 2, borderColor: '#77654C', borderTopLeftRadius: 27, borderTopRightRadius: 34, borderBottomRightRadius: 23, borderBottomLeftRadius: 32, padding: 20, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 2, height: 5 } },
  eyebrow: { fontFamily: fonts.body, fontSize: 12, letterSpacing: 1.5, color: '#827259', marginBottom: 10 },
  copy: { fontFamily: fonts.body, fontSize: 21, lineHeight: 27, color: '#3A3340' }, gold: { fontWeight: '900', color: '#9A6B08' },
  hint: { fontFamily: fonts.body, fontSize: 16, color: '#765D38', marginTop: 16 }, next: { minHeight: 46, justifyContent: 'center', marginTop: 8 }, nextText: { fontFamily: fonts.display, fontSize: 19, color: '#614399', textAlign: 'right' },
});
