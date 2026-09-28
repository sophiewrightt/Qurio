# Qurio prototype

A focused mobile prototype for testing Qurio’s core learning loop: discover, answer, earn XP, collect an Electron, and explore the Double Slit mystery.

## Run in Expo Go

This project deliberately targets Expo SDK 54, the SDK supported by the store version of Expo Go at the time of creation.

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go. No account, backend, database, or persisted state is used.

## Structure

- `App.tsx`: tiny screen state and shared XP/collection state
- `screens/`: Home and Lessons 1–6
- `components/`: reusable buttons, progress, quiz, reward, and mystery pieces
- `constants/theme.ts`: all visual tokens
- `data/lessonOne.ts`: editable lesson beats and image mappings
- `assets/`: curated copies of the supplied Qurio artwork

The source artwork remains untouched. PNG/JPG copies are bundled; Lesson 1 frames the padded artwork at runtime.

## Quiz convention

Use a “Ready for the quiz!” button to replace lesson content with `LessonQuiz`. Do not mount lesson notes alongside the quiz. Back navigation is hidden during an attempt; Android back is intercepted until completion. Inline prediction activities remain part of the lesson, not the final quiz.

Lesson 1 has three questions and awards the Electron only after finishing and collecting it. Home has one companion slot. Progress and collection are still session-only and reset when the app restarts.

Checks: `npm run typecheck` and `node tests/lesson-one.cjs`.

## Lessons 5 and 6

Lesson 5 now uses two independent `ElectronRun` instances. The first builds an interference pattern; completing that run reveals a second, initially empty experiment with slit detectors. Both retain their arrivals. The explanation and independent Mystery #3 card follow the second run.

Lesson 6 follows the “magic of observation” plan in `Qurio.docx`: an isolated baseline with wave-like possibilities, five environmental trials (air, scattering photons, nearby interacting atoms, heat, and vibrations), a Decoherence terminology card, a basketball zoom-out, and the unlocked Mystery #3. Changing or resetting a trial remounts an empty experiment; controls lock during firing. Try all five environments, then zoom out to reach completion. Completing Lesson 5 opens Lesson 6; Lesson 6 returns home. Completion XP is awarded once per lesson per session.

Science note: the environmental examples illustrate strong disturbance, not a quantitative simulation or a rule that every interaction destroys interference. Quantum physics still applies when environmental interactions suppress interference. Vibrations can also wash out a combined pattern through fluctuating phases. Background reference: [Zurek, Decoherence, einselection, and the quantum origins of the classical](https://arxiv.org/abs/quant-ph/0105127). Diagrams and arrivals are schematic; the blue glow represents possibilities, not a measured electron trajectory.

Regression checks:

```bash
npm run typecheck
node tests/lesson-one.cjs
node tests/lesson-two.cjs
node tests/lesson-three.cjs
node tests/lesson-refinements.cjs
node tests/lesson-five.cjs
node tests/lesson-six.cjs
```

The hook-based tests cover flow and state, not native layout. On iPhone, check both Lesson 5 screens start blank, the second reveals below the first, all five Lesson 6 environments run/reset independently, the wave glow is visible, and leaving during a run stops the animation. Finish Lesson 6 and replay it to confirm XP is not awarded twice. iOS and Android production bundles were exported successfully during implementation.

## SDK 57 interaction note

React Native 0.86 removed the typed `StyleSheet.absoluteFillObject` helper previously used by Lesson 1's invisible inspection surface. The surface now uses explicit absolute edges and the responder lifecycle (`grant`, `move`, `release`, and termination), with capture enabled so the surrounding `ScrollView` cannot take an active hold. The lesson disables scrolling only while the inspection surface owns the gesture.

The shared electron-arrival diagram now samples a fading diffraction envelope: the central fringe receives the most dots, the inner pair fewer, and the outer pair fewer again. This affects the accumulating electron experiments in Lessons 3, 5, and 6. The small answer-preview pattern already faded its outer bands.

## Character animations

Lesson 5 uses transparent versions of the supplied wizard, magic hat, and surprised electron artwork. `WizardMagicScene` loops a gentle cast from the wizard toward the smiling electron. `MagicHatScene` loops smile/hover → hat poof → surprised expression, then resets. Lesson 6 uses the supplied seated electron (`electron_winking.jpg`) as the meditating pose above “A quiet little quantum world.” Sprite preparation and source mappings are recorded in `assets/lesson-5/SPRITE_NOTES.md`.
