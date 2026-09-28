# World finale polish

- The four finale quiz entries have the same small refresher reminder immediately below the quiz artwork button. The terminology dictionary is a future feature, so the reminder has no link or extra control.
- Worlds 1, 3 and 4 use the icon-and-text layout from World 2 via `components/WorldQuizRecap.tsx`. World 2 retains its six existing rules and gains a floating photon. World 4 uses floating Charm, interpreting the requested “charm strange” as the World 4 Charm character.
- World 1 covers the quantum limit, wave-particle duality, decoherence, uncertainty and everyday applications. World 3 covers spin, entanglement, superposition and Schrödinger’s cat, with the requested crossed-out socks. The cat is a callback to World 2, not a new World 3 quiz topic.
- Small scientific corrections preserve intrinsic position/momentum uncertainty, a joint state for entanglement, identical species without identical states, proton number as elemental identity and the correct Bose-Einstein condensate definition. A condensate needs suitable conditions, not simply an exemption from Pauli’s rule.
- World 4’s new Lesson 6, “Putting it all together”, uses screen `32` and `worldFourFinalQuestions` in `data/moduleFour.ts`. Seven questions test the five available theory lessons using examples, with explanations after either answer. Recap copy disappears during the quiz. The finale has a Charm/confetti celebration and the shared random cosmetic packet, then returns Home. XP follows `20 + correct * 5` with the existing duplicate-completion guard.
- World 4 Home now matches the other worlds with a simple completion count, six lesson rows, and no availability caption. Lesson 5’s Next action and the global Continue sequence reach Lesson 6.
- Existing crayon sprites are reused. The phone, wall, bands and up arrow are small code-native icons; the socks cross, symbolic quark link and overlapping photon cluster are composed without editing the original artwork. Cross-world cat artwork and the Home Lesson 6 badge are included in the appropriate preload lists.

## Science references

Existing lesson references remain authoritative. For the concise recap corrections, see the [Nobel Prize 2022 entanglement background](https://www.nobelprize.org/prizes/physics/2022/popular-information/) and [Nobel Prize 2001 condensate background](https://www.nobelprize.org/prizes/physics/2001/9860-the-nobel-prize-in-physics-2001-2001-6/).

## Verification

`tests/world-quiz-recaps.cjs` covers the four entry pages, item counts, future-dictionary text, quiz isolation, seven explained questions, duplicate score/XP protection, reward/celebration integration, navigation and asset availability. The existing boson navigation test now expects Lesson 6 after Lesson 5. Run all CJS suites, TypeScript and Expo web/iOS exports; supplement with phone-sized browser testing.
