# World 4 Lesson 5: Happy, friendly bosons

Screen 30 follows 29. Five World 4 lessons are available; the world is not finished and no world reward packet is triggered here. The shared quiz and deduplicated completion XP remain in use.

## Interaction sequence

`components/FriendlyBosonsLesson.tsx` reuses the shared eight-photon chair. Its completion reveals `PhotonOffice`: first release energy, then trigger the blizzard. The second finished animation reveals the rainbow Bose-Einstein name, Einstein artwork, shared terminology card and the two sequential `FriendlyComparison` encounters. Both encounters must finish before quiz entry appears. The quiz replaces the lesson.

Animations use synchronous busy refs, guarded completion callbacks and unmount cleanup. Office replay starts from the high-energy illustration; completion gates stay earned. Blizzard loops stop after cooling. The collective-state glow stops on unmount. Starting a new lesson instance resets all gates.

## Science and analogy boundaries

- Correct name: **Bose-Einstein condensate**, named for Satyendra Nath Bose and Albert Einstein, not “Boson-Einstein”.
- A chair is a complete single-particle state, including spin/polarisation. Sharing never fuses particles. The ten office icons symbolise a much larger population; a large fraction, not necessarily every particle, occupies the lowest state.
- Office floors are schematic energy states, not physical positions or gravitational motion. Dropping floors requires energy transfer to the surroundings. The cartoon is not a trajectory simulation or population calculation.
- A blizzard is explicitly a cooling metaphor. Cold alone does not condense ordinary free-space photons. Real photon condensates use suitable confinement and thermalisation, e.g. repeated absorption/re-emission by dye between mirrors; pumping replaces losses. Such experiments can operate at room temperature. Dilute atomic condensates often require temperatures close to absolute zero, far below weather temperatures.
- The office first shows sharing at several energies, then substantial lowest-state occupation and one common symbolic wave/glow. It does not claim that crowding a room is condensation, or that bosons become identical only after cooling.
- Environmental interactions can obscure coherence, but controlled interactions can also thermalise a system and support collective phenomena. Do not claim that interactions always destroy quantum behaviour.
- Bose enhancement concerns an increased **transition rate** into an occupied final state for identical bosons, not an attractive force. A suitable transition mechanism and energy conservation remain necessary. The friendly encounter is one illustrative allowed outcome, explicitly not a guaranteed random experiment. No fake probability sampling is used.

## Artwork

The five original JPGs are retained unmodified in `assets/module-4/lesson-5/source/`. `scripts/prepare-friendly-bosons.cjs` imports missing sources only, mechanically crops/resizes and removes exterior white paper while retaining the interiors of speech bubbles and Einstein's face. The friendly/unfriendly character glows are unmatted from exterior white to blend into the cream page. Existing chair, photon and snowflake sprites are reused. Runtime assets are preloaded.

The supplied `electron_shells_with_seats` reference is preserved and cropped but not used in this boson lesson. Its circles would suggest fermion seat limits and its 2/4/6 pattern is not the 2/8/18 capacity of full atomic shells. Lesson 4's existing shell explanation remains unchanged.

## References

- [University of Bonn quantum optics, photon condensation](https://www.qo.uni-bonn.de/en/research/bose-einstein-condensate): room-temperature dye-microresonator photon condensates.
- [Klaers et al., Bose-Einstein condensation of photons in an optical microcavity](https://arxiv.org/abs/1007.4088): confinement, dye thermalisation and macroscopic ground-state population.
- [Nobel Prize 2001, advanced information](https://www.nobelprize.org/uploads/2018/06/advanced-physicsprize2001.pdf): atomic BEC and collective quantum behaviour.
- [Feynman Lectures III, chapter 4](https://www.feynmanlectures.caltech.edu/III_04.html): identical bosons, enhancement by final occupation plus one, and exclusion for fermions.

## Verification

`tests/friendly-bosons.cjs` covers gates, ten office icons, delayed completion, duplicate presses, replay, unmount cancellation, encounter trajectories, quiz isolation, navigation, XP and preloads. Supplement with TypeScript, the full CJS suite, iOS export and phone-sized visual testing.
