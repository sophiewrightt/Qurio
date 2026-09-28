# World 4 Lesson 4: Fermions firm in chemistry

## Implementation and intentional corrections

- Screen 29 follows 28. Home and Continue include four available World 4 lessons, without implying that the unfinished world is complete. Shared quiz, terminology art, completion actions and one-time XP are retained.
- The supplied chair replaces the code chair in Lesson 3. Lesson 4 reuses the same animation with an explicit imaginary rule change. Two overlapping electron sprites remain two particles.
- Minimum energy is stated with energy release and allowed changes, not a universal claim that every system spontaneously reaches its ground state. The ground state belongs to the whole system.
- Shell capacities 2, 8, 18 include spin. They are not literal chairs or spatial trajectories, nor a rigid filling order. A fourth-shell state can fill before the third shell is full.
- Removing Pauli is a counterfactual illustration, not a consistent alternate fundamental theory or many-body calculation. It removes the usual exclusion-based filling constraint. The animated electrons approach a shared extended orbital, never enter the nucleus or collapse to a point. Coulomb interactions and uncertainty are not switched off. Alex's dissolution symbolises the loss of familiar chemistry, not a physical simulation. Atom and Alex are adjacent so both are visible during playback.
- The conflicting “up to 10 protons” and eleven named elements are implemented as ten additions through eleven stops: 1, 2, 10, 11, 13, 19, 20, 33, 79, 88, 118. Aluminium precedes potassium. Each button shows the exact gap.
- The explorer updates neutral electron totals and example isotope neutron counts. All nucleon/electron sprites are counted, but their sizes, positions and shell radii are schematic. Changing an element is not equivalent to simply clicking extra protons into a real nucleus.
- Foods/salt contain ions or compounds, not chunks of elemental sodium, potassium or calcium. The colourful neon sign is qualified: pure neon's emission is red-orange.
- Oganesson is a laboratory-made, very short-lived element, formed using calcium and californium nuclei, not just a proton beam. Its shell diagram is an illustrative neutral configuration, not an observation of an individual atom's paths.
- Main-group columns are highlighted sequentially. Helium's full shell has 2 electrons rather than 8; the central transition-metal block is explicitly more complicated. Similar properties do not mean identical ones. Bonding can involve sharing or transferring electrons.

## Artwork

All 28 supplied chemistry scans plus the previously supplied chair are retained untouched in `assets/module-4/lesson-4/source/`. `scripts/prepare-world-four-chemistry.cjs` imports only missing originals, then reproducibly crops, removes exterior paper and resizes the outputs. The balloons share source coordinates. White carton/glass/bottle interiors are retained; the chair's four open regions are transparent.

The supplied unlabelled periodic-table scan contains one surplus transition column and two surplus cells per detached row. The derived image splices those blank cells out, retaining the user's coloured strokes and original scan, to display 18 main columns and 14 f-block cells. Overlay coordinates refer to this corrected 831:465 canvas.

No jewellery sprite was supplied. The gold necklace/ring are small native shapes with animated sparkles; all supplied element tiles and material sprites are used directly. Spare milk-glass artwork is retained and preloaded alongside the requested carton.

## Science references

- [OpenStax Chemistry 2e, electron configurations](https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms-electron-configurations): Aufbau, exclusion, ground-state configurations, valence patterns and exceptions.
- [Feynman Lectures III, chapter 19](https://www.feynmanlectures.caltech.edu/III_19.html): extended hydrogen ground state, shell states and periodic-table structure.
- [Feynman Lectures III, chapter 2](https://www.feynmanlectures.caltech.edu/III_02.html): uncertainty, localisation and kinetic-energy cost.
- [Royal Society of Chemistry, oganesson](https://periodic-table.rsc.org/element/118/oganesson): atomic number 118, isotope 294, configuration and research-only context.
- [Lawrence Livermore National Laboratory, element 118 discovery](https://www.llnl.gov/article/30421/livermore-scientists-team-russia-discover-element-118): calcium ions bombarding a californium target.

## Verification

`tests/fermion-chemistry.cjs` checks progressive gates, ten batch additions, exact neutral electron counts, duplicate taps, replay, cancellation, eight-column completion, shared chair use, quiz isolation, navigation, duplicate XP and asset inclusion. Run it with the full CJS suite and TypeScript check. Web phone-size inspection and the iOS export supplement these logic-only tests.
