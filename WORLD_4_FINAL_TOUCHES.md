# World 4 final touches

This refinement supersedes the earlier interaction notes where they conflict.

- Home uses the supplied overarching questions for Worlds 1, 2 and 4, in the same body style as World 3.
- Lesson 1 keeps the initial wave sketch after playback. Exploring both barrier switches unlocks the next section; the separate sampled detection controls are removed. The whole-electron illustration includes an incoming electron and the concise reflection explanation. Fusion first shows repulsion, then a clearly introduced four-nucleus overall reaction that fades directly into helium and released energy. This remains a schematic of a multistep chain, not a four-body laboratory collision or a tunnelling-time calculation.
- Lesson 2 has a smaller dog, artwork-only ID enlargement and quiz entry after the Charm reveal. The extra entangle/measure spin lab is no longer in the lesson flow.
- Lesson 3 uses the red exclusion rule and shorter boson explanations. Shared chairs have no redundant caption or initial occupancy label. The chair is still a complete quantum-state analogy, not a claim that spatial overlap is forbidden or that particles fuse.
- Lesson 4 uses the new full-body Alex, labels above shell capacities, a separate proton-addition control, enlarged shape-following neon glow and a question mark for the unpictured oganesson material. All eight main-group columns shade in a repeating 1.5-second sequence. The quiz unlocks after one cycle; unmount clears the timer. Actual shell counts and main-group/helium qualifications remain intact.
- Lesson 5 uses the new four-floor Photon & Co building with ten moving photons, lower-floor jumping, snow, and overlapping copies of the actual photon artwork for the collective-state illustration. The completed office has no replay control. Friendly/unfriendly comparisons are now static supplied cartoons and do not introduce extra quiz gates. Keep the short cooling-metaphor note: free photons do not condense merely because weather is cold. Bose enhancement remains an increased allowed transition rate, not attraction.

## Artwork

`scripts/prepare-world-four-final-touches.cjs` retains the four JPG scans in `assets/module-4/refinements/source/`, crops the supplied subjects and removes only the exterior paper (unmatting the particle glows). The four runtime PNGs are preloaded. Alex's enclosed white face is preserved. No generated replacement artwork is used.

The requested party-on-the-ground-floor sprite was not supplied or found by filename. A small code-drawn party sign is temporary, pending the user's asset.

## Verification

Updated checks: `tests/module-four.cjs`, `tests/particle-identity.cjs`, `tests/fermion-chemistry.cjs`, `tests/friendly-bosons.cjs`, plus `tests/world-four-final-touches.cjs`. Run the complete CJS suite, TypeScript and web/iOS exports. Phone-sized browser verification supplements, but does not replace, testing on a physical phone.
