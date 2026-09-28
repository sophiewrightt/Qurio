# World 4 Lesson 3: Two households, both unlike in dignity

Screen 28, `components/ParticleFamiliesLesson.tsx`, `screens/ModuleFourLessonThreeScreen.tsx`, `familyQuestions` in `data/moduleFour.ts`, and `tests/particle-families.cjs`.

## Flow

- Individually scratch or tap to reveal 12 fermions, then five boson panels. Known electron, charm and strange come first; Photon is the known boson. Other names remain question marks. These reveals do not award wardrobe skins.
- The boson gallery includes supplied Z artwork as well as photon, Higgs, W and gluon. W represents both charges; gluon represents its eight colour states. These are grouped types, not a count of every state or antiparticle.
- Scratch strokes remove a 6-by-6 mask and finish after 14 cells are erased. Scroll locks during a stroke, releases on completion of the gesture or cancellation, and unlocks on unmount. Tap alternatives have at least 44 px height.
- Both family galleries precede the differences. The electron chair demonstration precedes shared Pauli terminology and the boson explanation. Eight photons then converge on one state. All activities gate the five-question quiz; notes are replaced by the quiz.
- Chair animations are replayable, ignore duplicate starts, cancel on unmount and notify completion once. Completion XP follows the existing one-time reward system. Home and Continue include screen 28; no next lesson or World 4 finale is fabricated.

## Scientific limits

- Pauli applies to identical fermions sharing a complete single-particle state, including spin. An orbital alone is not that complete state. Chairs are symbolic, not literal positions; the bounce does not depict a new repulsive force.
- Overlapping photons are still eight photons, not fusion. A light mode can have multiple photons.
- The strange pyramid is explicitly nonliteral. Everyday nuclei contain up/down quarks, not stacks of strange quarks.
- Gauge bosons mediate interactions; not all bosons are ordinary force carriers. Higgs is associated with the Higgs field. “Photon glue” is an analogy for electromagnetic binding, not a literal substance or a claim all interactions attract.

Sources: [CERN Standard Model](https://home.web.cern.ch/science/physics/standard-model/) for the families and interaction carriers; [Feynman Lectures III, chapter 4](https://www.feynmanlectures.caltech.edu/III_04.html) for identical particles, exclusion and shared boson states.

## Artwork

Sources are preserved in `assets/module-4/source`; centred, cropped PNGs live in `assets/module-4/lesson-3`. `node scripts/prepare-world-four.cjs --lesson-three` reproduces them without reprocessing earlier lessons. The pale electron-neutrino face is protected from exterior-white removal. Supplied Tau pixelation is retained.

The pink `tau_neutrino_default 1` image is provisionally used for the unnamed muon-neutrino slot, pending confirmation: both source filenames say tau-neutrino. No names are inferred from sprite colours.

## Related bug fix

The first tap on Charm's actual ID in Lesson 2 now calls the introduction callback directly, revealing Charm and the rest of the lesson below. Subsequent taps can enlarge the ID. Tests exercise the actual ID-card Pressable, not only the separate meet control.

## Verification

TypeScript checks, all CJS suites, Expo iOS/web exports, and phone-sized web inspection. The harness covers scratch and tap paths, duplicate reveals, scroll release, all progression gates, animation replay/cancellation, explained quiz questions, navigation and duplicate XP prevention. Browser testing is not a physical iOS-device test.
