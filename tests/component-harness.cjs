const fs = require('node:fs');
const ts = require('typescript');

// Logic checks only; this does not replace rendering/touch tests on a device.
exports.createHarness = function createHarness(path, props = {}, exportName) {
  const rewards = [];
  const state = [], effects = [], flights = [], intervals = new Map(), timeouts = new Map();
  let cursor = 0, nextTimer = 0, pendingEffects = [];
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children: children.flat() }),
    useState: initial => {
      const i = cursor++;
      if (!(i in state)) state[i] = typeof initial === 'function' ? initial() : initial;
      return [state[i], v => { state[i] = typeof v === 'function' ? v(state[i]) : v; }];
    },
    useRef: initial => { const i = cursor++; return state[i] ||= { current: initial }; },
    useCallback: callback => callback,
    createContext: value => ({ _value: value, Provider: 'ContextProvider' }),
    forwardRef: component => component,
    useContext: context => props.companionContext ?? props.tourContext ?? context?._value,
    useEffect: (effect, deps) => {
      const i = cursor++, previous = effects[i];
      if (!previous || !deps || deps.some((value, j) => !Object.is(value, previous.deps[j]))) {
        pendingEffects.push(() => { previous?.cleanup?.(); effects[i] = { deps, cleanup: effect() }; });
      }
    },
  };
  class Value {
    constructor(value) { this.value = value; }
    setValue(value) { this.value = value; }
    stopAnimation(callback) { if (callback) callback(0.5); }
    interpolate(config) { return config; }
  }
  class ValueXY {
    constructor() { this.x = new Value(0); this.y = new Value(0); }
    setValue(value) { this.x.setValue(value.x); this.y.setValue(value.y); }
    stopAnimation() { this.x.stopAnimation(); this.y.stopAnimation(); }
    getTranslateTransform() { return [{ translateX: this.x }, { translateY: this.y }]; }
  }
  const inert = () => ({ start() {}, stop() {} });
  const native = { BackHandler: { addEventListener: () => ({ remove() {} }) }, PanResponder: { create: handlers => ({ panHandlers: handlers }) }, StyleSheet: { create: x => x, absoluteFill: {}, absoluteFillObject: {} }, Easing: { linear: x => x, sin: x => x, cubic: x => x, inOut: x => x, out: x => x, in: x => x, back: () => x => x }, Animated: {
    Value, ValueXY, Image: 'AnimatedImage', View: 'AnimatedView', Text: 'AnimatedText', loop: inert, delay: inert, parallel: () => ({ start: callback => { if (callback) flights.push(callback); }, stop() {} }), event: () => () => {},
    sequence: () => ({ start: callback => { if (callback) flights.push(callback); }, stop() {} }),
    timing: () => ({ start: callback => { if (callback) flights.push(callback); }, stop() {} }), spring: inert,
  } };
  for (const name of ['SafeAreaView', 'ScrollView', 'Text', 'TextInput', 'View', 'Pressable', 'Image', 'Switch', 'Modal']) native[name] = name;
  native.Platform = { OS: 'web' };
  native.useWindowDimensions = () => ({ width: 390, height: 844 });
  native.AccessibilityInfo = { announceForAccessibility() {}, isReduceMotionEnabled: () => Promise.resolve(false) };
  const exported = {};
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText;
  new Function('require', 'exports', 'React', 'setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', code)(name => {
    if (name === 'react') return React;
    if (name === 'react-native') return native;
    if (name === 'expo-font') return { useFonts: () => [true] };
    if (name === 'expo-camera') return { CameraView: 'CameraView', useCameraPermissions: () => [{ granted: true }, () => Promise.resolve({ granted: true })] };
    if (name.includes('@expo-google-fonts')) return {};
    if (name.endsWith('/curriculum') || name.endsWith('/loading') || name.endsWith('/onboarding') || name.endsWith('/accessoryPreview') || name.endsWith('/shop') || name.endsWith('/lessonEntry') || name.endsWith('/achievements') || name.endsWith('/knowledge') || name.endsWith('/dictionary') || name.endsWith('/experimentSampling') || name.endsWith('/moduleFour') || name.endsWith('/moduleThree') || name.endsWith('/moduleTwo') || name.endsWith('/lessonOne') || name.endsWith('/lessonNine') || name.endsWith('/greetings') || name.endsWith('/learnerRules')) {
      const sampling = {};
      new Function('exports', 'require', ts.transpileModule(fs.readFileSync(`data/${name.split('/').pop()}.ts`, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(sampling, name => {
        if (name === './curriculum') {
          const curriculum = {};
          new Function('exports', ts.transpileModule(fs.readFileSync('data/curriculum.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(curriculum);
          return curriculum;
        }
        return name;
      });
      return sampling;
    }
    if (name.endsWith('/preloadAssets')) return { preloadAssets: [], preloadAssetsByWorld: { 1: [], 2: [], 3: [], 4: [] } };
    if (name.endsWith('/QuizCompanion')) return { QuizCompanion: 'QuizCompanion', QuizCompanionProvider: 'QuizCompanionProvider' };
    if (name.endsWith('/KnowledgeContext')) return { KnowledgeProvider: 'KnowledgeProvider', useKnowledge: () => key => rewards.push(key) };
    if (name.endsWith('/DictionaryContext')) return { DictionaryProvider: 'DictionaryProvider' };
    if (name.endsWith('/Onboarding')) return { OnboardingProvider: 'OnboardingProvider', TourAnchor: 'TourAnchor', TourOverlay: 'TourOverlay', TourScrollView: 'ScrollView', TourWhenVisible: 'TourWhenVisible', useTour: () => ({ state: props.tourState ?? { step: 'done' }, enabled: true, event: props.onTourEvent ?? (() => {}) }) };
    if (name.endsWith('/DictionaryModal')) return { DictionaryIcon: 'DictionaryIcon', DictionaryModal: 'DictionaryModal' };
    if (name.endsWith('/LessonFinishActions')) return { LessonFinishActions: 'LessonFinishActions', LessonNavigationProvider: 'LessonNavigationProvider' };
    if (name.endsWith('/WorldQuizRecap')) return { WorldQuizRecap: 'WorldQuizRecap', QuizRefresherNote: 'QuizRefresherNote', FloatingRecapParticle: 'FloatingRecapParticle' };
    if (name.endsWith('/ParticleFamiliesLesson')) return { ParticleFamiliesLesson: 'ParticleFamiliesLesson', QuantumChairs: 'QuantumChairs' };
    if (name.endsWith('/customisation')) {
      const accessoryCatalog = [
        { id: 'red-spectacles', name: 'Red spectacles', category: 'eyes', source: 'red-spectacles.png' },
        { id: 'curly-moustache', name: 'Curly moustache', category: 'face', source: 'curly-moustache.png' },
        { id: 'fedora', name: 'Explorer fedora', category: 'head', source: 'fedora.png' },
        { id: 'lips', name: 'Big lips', category: 'face', source: 'lips.png' },
        { id: 'deal-with-it-glasses', name: 'Deal-with-it glasses', category: 'eyes', source: 'deal.png' },
      ];
      const particleCatalog = [
        { id: 'electron', name: 'Electron', description: 'Fundamental particle', source: 'electron.png' },
        { id: 'photon', name: 'Photon', description: 'Particle of light', source: 'photon.png' },
        { id: 'gluon', name: 'Gluon', description: 'Carrier of the strong interaction', source: 'gluon.png' },
      ];
      return { accessoryCatalog, particleCatalog, starterAccessories: accessoryCatalog.map(item => item.id), accessoryById: id => accessoryCatalog.find(item => item.id === id) };
    }
    if (name.endsWith('theme')) return { colors: {}, fonts: {}, spacing: {}, radii: {}, type: {}, shadow: {} };
    if (name.endsWith('/boutique')) return { boutique: {} };
    if (name.endsWith('/ShopArtwork')) return { ShopIcon: 'ShopIcon', PacketArtwork: 'PacketArtwork', QuantaArtwork: 'QuantaArtwork', AchievementEntryArtwork: 'AchievementEntryArtwork' };
    if (/\.(png|jpg)$/.test(name)) return name;
    const key = name.split('/').pop(); return { [key]: key };
  }, exported, React, callback => { const id = ++nextTimer; intervals.set(id, callback); return id; }, id => intervals.delete(id), (callback, duration) => { const id = ++nextTimer; timeouts.set(id, { callback, duration }); return id; }, id => timeouts.delete(id));
  const Component = exported[exportName || path.split('/').pop().replace('.tsx', '')] || exported.default;
  const all = tree => Array.isArray(tree) ? tree.flatMap(all) : !tree || typeof tree !== 'object' ? [] : [tree, ...all(tree.children || [])];
  const render = () => { cursor = 0; const result = Component(props); pendingEffects.splice(0).forEach(run => run()); return result; };
  return { render, exported, rewards, all, nodes: type => all(render()).filter(n => n.type === type),
    flight: (finished = true) => { const callback = flights.shift(); if (!callback) throw Error('No pending flight'); callback({ finished }); },
    peekFlight: () => flights[0], tick: () => [...intervals.values()].forEach(fn => fn()),
    timeout: () => { const entry = timeouts.entries().next().value; if (!entry) throw Error('No pending timeout'); timeouts.delete(entry[0]); entry[1].callback(); }, pendingTimeouts: () => [...timeouts.values()].map(t => t.duration),
    unmount: () => effects.forEach(effect => effect?.cleanup?.()), activeTimers: () => intervals.size,
  };
};
