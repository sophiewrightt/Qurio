# Lesson polish, September 28

This supersedes earlier presentation notes where they conflict.

## World 1

- Lesson 1 has a compact opening, no scrolling progress meter, and reveals the next scale only after the current magnifier is used. All six inspections precede the elementary-particle reveal.
- The double-slit lesson (screen 3) reveals waves only after the basketball prediction is correct, then electrons only after the wave prediction is correct. Wrong answers remain retryable. Arrival wording explicitly refers to the wall.
- Lesson 5 uses a static curtain/shy-electron illustration first, then the dance/person-entry/shyness loop without a curtain. The simplified-pattern caption is removed.
- Empty electron experiments no longer say “A fresh screen. What will appear?”. Lesson 7 omits the Heisenberg history aside while retaining the scientific definition.
- World 1's final quiz (screen 9) question 5 now answers “It interacts with the electron to detect which slit it uses”. The explanation and passing threshold are unchanged.
- Remove the World 2 teaser sentence and the shared reward packet's hand-drawn-looks paragraph.

## World 2

- Quantised-word scratching emits a one-time reveal event. Explanations, terminology and quiz entry wait for it, including the accessibility reveal path.
- Remove the energy-level title pep talk; “Just to clarify” uses body styling. The electromagnetic-spectrum definition has extra space below.
- Mystery #3 in the path/superposition activity uses the shared mystery question-mark artwork.
- The coin uses one continuous, linear squash-to-edge spin, explicitly JS-driven on web. Holding stops it face-on and records one random result once.
- Cat and tape drags lock lesson scrolling, release on cancellation/end/unmount, and stop competing return animations. Tape settles at its responsive track endpoint before showing the sealed box; repeated gestures cannot interrupt that completion.

## World 4

- Shared electron/photon chair movement takes 1.6/1.9 seconds with linear timing, preserving all original outcomes and one-time completion gates.
- Periodic-column highlighting keeps cycling after the first complete cycle unlocks subsequent information; regression tests cover multiple cycles and timer cleanup.
- The party caption is plain text below the photon office, outside its canvas.
- The finale uses the unchanged supplied scan at `assets/module-4/celebrating-charm.jpg`, registered in preloads. `WorldCelebration.sourceFrame` frames its padded canvas; `FramedSprite.paper` blends the scan into the cream background without modifying source pixels.

## Verification

`tests/lesson-polish.cjs` covers sequential magnifier/prediction gates, scratch completion, tape release/cancellation/settling, coin repeat protection, column-loop persistence, and the celebration asset. Existing expectations were updated for the requested curtain and reward-copy changes.

Full CJS suite and TypeScript passed. Phone-sized web checks confirmed the first magnifier unlock, wrong/correct slit prediction gates, tape sealing, and framed Charm appearance. Web/iOS export is the build check, not physical-device validation.
