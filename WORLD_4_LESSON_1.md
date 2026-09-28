# World 4: Better together

Lesson 1 is screen 26. Only this lesson is available: seven supplied badges are stored, not a promise of seven released lessons. The final lesson count and World 4 reward finale are intentionally not set yet.

## Implementation

- `components/TunnellingLesson.tsx`: basketball/classical electron bounces, progressive wave sketch, independent barrier switches, fresh detections, retry question, two-stage fusion swipe, mystery resolution.
- `data/moduleFour.ts`: four explained quiz questions; rectangular-barrier transmission calculation.
- `screens/ModuleFourLessonOneScreen.tsx`: lesson/quiz boundary and scroll lock.
- `scripts/prepare-world-four.cjs`: original scans retained under `assets/module-4/source/`; exterior-paper removal preserves enclosed white numerals, shared 256px badge canvas. Runtime artwork never depends on Desktop files.
- App completion uses the existing duplicate-XP guard. World 3's first completion introduces World 4. There is no nonexistent Next Lesson after screen 26 and no premature World 4 reward packet.

## Scientific choices

The purple curve is a qualitative sketch of a wavefunction, not probability density, a physical path, or a numerical time-dependent solver. Its decaying amplitude illustrates barrier penetration. The playback slowdown is labelled as illustrative and makes no assertion about tunnelling time. Reflection remains the more likely outcome; a detector records one entire electron.

For the original thin barrier, independent simulated detections use the exact rectangular-barrier transmission formula:

`T = 1 / (1 + U² sinh²(L sqrt(U-E)) / (4 E (U-E)))`

Dimensionless units have E=1 and hbar²/(2m)=1. Lower/higher U=2/4; thin/thick L=1.5/3. Thus the original setup predicts approximately 18% transmission. The detector explicitly uses that original setup, independently of the exploration switches. No particular material, experimental calibration, or decreasing-error sample quota is claimed. The schematic curve is not a boundary-matched numerical wavefunction. Energy and wave amplitude are explicitly different scales. Tunnelling through this static barrier does not borrow or dissipate energy.

The Sun's core is plasma; positively charged hydrogen nuclei, rather than neutral atoms, repel. Thermal motion plus tunnelling permits fusion below the classical Coulomb barrier. The first swipe illustrates repulsion. The second represents a selected successful example: a heavier hydrogen nucleus starts the chain, then several reactions lead to helium. Four hydrogen nuclei are the net fuel for one helium nucleus, with other particles and energy also released. The photon stands for some of the energy, not an instantaneous journey from the core to Earth. Ordinary charge symbols are deliberately absent from the electron's schematic energy barrier.

## Primary references

- [OpenStax: Quantum tunnelling through potential barriers](https://openstax.org/books/university-physics-volume-3/pages/7-6-the-quantum-tunneling-of-particles-through-potential-barriers): rectangular-barrier transmission, width/height/energy dependence.
- [MIT OpenCourseWare: Nuclear Physics, Fusion](https://ocw.mit.edu/courses/8-701-introduction-to-nuclear-and-particle-physics-fall-2020/75c5b6374f91621257ddf60f559ff9f3_wB5BYYEOPVA.pdf): tunnelling and the proton-proton cycle.
- [Nobel Prize: How the Sun shines](https://www.nobelprize.org/prizes/themes/how-the-sun-shines/): net four protons to helium and energy release.
- [US Department of Energy: Proton-proton fusion](https://www.energy.gov/science/np/articles/proton-proton-fusion-powering-sun): electrostatic repulsion and weak interaction in the first fusion step.

## Verification

`tests/module-four.cjs` covers staged unlocks, animation guards and cancellation, repeatable independent detections (including progressing after reflection), both switches, swipe threshold and scroll release, retry-only prediction, full fusion before quiz, quiz replacement, no nonexistent lesson navigation, duplicate XP, badge dimensions/white numeral retention, preload registration and probability monotonicity. Run all repository CJS checks and typecheck, plus Expo iOS and web exports. Phone-sized web checks supplement, not replace, native-device gesture testing.
