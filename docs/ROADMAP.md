# Qurio realm roadmap

Recorded 28 September 2026. Product direction, not an implemented expansion.

## Agreed direction

The existing four chapters form the beginner quantum-foundations realm. Every learner must complete this foundation before entering deeper subject streams. Advanced streams should not accidentally become one long compulsory sequence simply because they share a catalogue.

Tentative future realms, with lesson plans still to be authored:

- Quantum computing
- History of quantum physics
- Quantum technology
- Quantum universe (quantum ideas in space)
- Particle physics
- Philosophy of quantum mechanics
- Maths of quantum physics
- Computational quantum physics
- Deeper quantum physics

Names, ordering, chapter counts, additional prerequisites, rewards and release dates are not settled. Do not invent or publish their lesson contents from this list alone.

## Existing foundation

`data/curriculum.ts` is the current catalogue: Realm 1, four chapters, 31 lessons. Navigation IDs stay stable: Chapter 1 uses 1–9; Chapter 2 uses 11–18; Chapter 3 uses 19–25 then 31; Chapter 4 uses 26–30 then 32. Screens 10/33/34 are wardrobe/achievements/shop, not lessons.

Guest progression currently gates one contiguous local path. The catalogue is a useful foundation, but App/Home/preload routing still contain manual chapter-specific wiring. Adding a realm entry alone does not create a working realm. Authentication, persistent completion and secure prerequisite checks are not implemented.

## Before implementing the first advanced realm

1. Agree its learner outcome, assumed maths, chapter outline and any prerequisites beyond Realm 1.
2. Define a stable realm/chapter/lesson identity separately from display numbering and navigation screen IDs. Preserve old identities and saved-state compatibility when persistence arrives.
3. Introduce realm selection plus explicit prerequisite checks. Proposed learner policy: all required beginner lessons completed, including passing its chapter finales; confirm the precise completion rule before coding. Preserve authorised tester preview separately.
4. Scope Continue/progression to the selected eligible realm, rather than flattening all advanced streams into the existing linear path.
5. Extend routing, Home, preloads, recaps, dictionary, rewards and tests. Use the lesson brief and recipes in `LESSON_AUTHORING.md`.
6. Enforce progression and rewards on the server before relying on them for real accounts or purchases; local locks are only prototype UX.

Build one approved lesson end-to-end first, then reuse what proves useful. Do not turn every bespoke science interaction into a universal framework prematurely.
