# Qurio lesson playbook

Use this instead of reading every historical note. Read the relevant current topic note, one closest source example and its tests. Existing lesson details remain in the archive and root topic documents. Paths below are project-root-relative.

## The lesson pattern

**Familiar hook → learner action/prediction → visible result → short explanation/term → transfer check → quiz → completion/reward.**

This is a recipe, not a requirement to pad every lesson with every beat. Start with one teachable outcome. Each interaction should expose a meaningful distinction, not merely delay reading. Repeated refinements favour less filler, fewer continue buttons, shorter gaps, larger diagrams, and automatic explanation reveals after the meaningful action.

Before implementation, fill `docs/LESSON_BRIEF.md`. Resolve only consequential missing choices. Reuse approved copy and artwork; flag scientific corrections rather than silently changing their meaning.

## Choose one working screen as the starting point

| Need | Source example | Contract to preserve |
| --- | --- | --- |
| Ordinary lesson with interactive notes and shared quiz | `screens/ModuleTwoLessonFourScreen.tsx` | `lesson`/`quiz` phases; activity callback enters quiz; shared finish actions own navigation |
| Post-quiz particle unlock | `screens/ModuleTwoLessonThreeScreen.tsx` | store score, show separate unlock modal, choose/keep skin, complete once |
| Chapter finale | `screens/ModuleFourLessonSixScreen.tsx` | recap, requirement, passing quiz, celebration, packet, Home; failure never reaches rewards |
| Knowledge-aware inline answers | `components/AnswerButton.tsx`, `components/KnowledgeContext.tsx` | stable unique key; award only accepted correct answers |

Copy structure, not chapter-specific content or obsolete score formulas. Read actual callback signatures first. Numeric suffixes in Chapter 3 screen filenames do **not** match their learner-facing order: resolve through `App.tsx`, catalogue and headings.

## Reuse map

| Behaviour | Existing implementation |
| --- | --- |
| Standard quiz, answer feedback, equipped happy companion | `LessonQuiz`, `QuizQuestion`, `AnswerButton`, `QuizCompanion` |
| Quiz-entry artwork / buttons / numbered badge | `PrimaryButton`, `LessonBadge` |
| End navigation and cancelled energy prompt recovery | `LessonFinishActions`, `LessonNavigationProvider`, `LessonEntryModal` |
| Definitions collected only when actually seen | `TerminologyCard`, `DictionaryContext`, `data/dictionary.ts` |
| Scratch-to-reveal with completion event | `ScratchReveal`, `QuantisationLab`; tests `lesson-polish.cjs` |
| Touch/hold magnifier and sequential scale reveals | `LessonSection`, `screens/LessonScreen.tsx`; tests `lesson-one.cjs`, `lesson-polish.cjs` |
| Retryable predictions which withhold later content | `screens/DoubleSlitScreen.tsx`, `ClassicalCorrelationLesson` |
| Shared slit apparatus and wave comparison | `ExperimentDiagram`, `ExperimentSource`, `SlitWaveComparison` |
| Independent samples / probability-versus-count charts | `data/experimentSampling.ts`, `MeasurementLessonLabs`, `JointStateLessonLabs` |
| Dragging while owning parent scrolling | `SchrodingerCatLesson`, `QuantumConnectionsFinale` |
| Multi-stage protocol with a required early attempt | `TeleportationLesson` |
| Shared electron/photon seating | locate shared chair usage in `ParticleFamiliesLesson`, `FermionChemistryLesson`, `FriendlyBosonsLesson` |
| Repeating animation that unlocks content once | `FermionChemistryLesson`; tests `lesson-polish.cjs` |
| Framed padded artwork / floating art | `FramedSprite`, `HoveringImage`, `WorldQuizRecap` |
| Celebration and ripping rewards | `WorldCelebration`, `RewardPack`, `data/shop.ts` |
| Loading overlay | `LoadingScreen`, `data/loading.ts` (spinner, shuffled phrases, no artificial delay) |

Component names above refer to `components/<name>.tsx` unless a path is given. Search a symbol before assuming it is independently exported. Bespoke diagrams remain lesson components; do not fork shared quiz/reward/dictionary systems.

## Gate and lifecycle recipe

1. Keep notes/quiz/celebration as distinct phases. Explicitly name required interaction milestones; derive readiness from them.
2. Retry wrong formative predictions without revealing later sections unless the authored activity is intentionally participation-based. A random guess about a sampled outcome must not require luck to progress.
3. After success, reveal the result and next paragraph automatically. Show quiz entry only when required learning actions are done; optional ExploreFurther content is not a gate or assessed prerequisite.
4. Guard rapid presses synchronously with refs where state updates alone permit duplicate runs. Snapshot random results once per run, not during every render.
5. Cancel timers and animations on unmount/reset. Protect against stale completion callbacks and competing settle/return animations. Replay starts fresh interaction state without double-crediting completion.
6. During drags/holds, disable parent scrolling only while the control owns the gesture; release on end, cancellation and unmount. Use responsive measurements rather than fixed page coordinates. Provide an accessible alternative to precision gestures.
7. Check web animation-driver behaviour: earlier native-driver loops froze or disappeared on RN Web. Reuse platform-aware working loops, keep moving pieces on aligned canvases and avoid remounting them every frame. Respect reduced motion where applicable.

## App integration checklist

- Add substantial prose/questions to the relevant data module. `LessonQuestion` uses question/options/answer/explanation; the answer must exactly match an option. Supply concise explanations, particularly for finales.
- Create the focused lesson interaction and thin screen wrapper. Use theme tokens and shared controls.
- Register stable IDs/order in `data/curriculum.ts`; verify derived `data/lessonEntry.ts` admission and labels. Do not renumber old IDs.
- Wire the actual screen, next destination, completion and provider scope in `App.tsx`. Check Home cards/counts, chapter unlock conditions and manually selected preload group. Screen 31 is Chapter 3 despite its numeric position.
- Finale: use `requiredFinalAnswers` and `FinalQuizRequirement`; pass `minimumCorrect` and failure-to-Home handler. Strictly >70% currently means 5/6, 4/5, 5/7, 5/7. Do not hardcode those counts into future question sets.
- Knowledge: shared quiz awards automatically. Inline scored checks use explicit correctness + unique stable keys through Knowledge context. Green answer styling is not proof the user answered correctly. Read `KNOWLEDGE.md` before touching rewards.
- Terminology: use shared cards at the intended reveal point, not a bulk glossary unlock. Extend authored terms as necessary without bypassing visibility collection.
- Unlocks: wire optional particle access separately from naming and equipped accessories. Preserve tutorial Home-only exceptions and tester bypass.
- Chapter packet: shared `RewardPack` has a legacy `excludeIds` prop which now means ownership for duplicate labels only. It must not filter draws. Inventory changes and packet counts happen on actual rip, once.
- Add static assets to both global inventory and appropriate chapter preload groups. Register shared quiz/companion assets across all applicable chapters.
- Extend nearest regression tests and relevant cross-cutting tests. Update only the owning documentation plus the catalogue when needed.

## Artwork and layout

Keep originals and runtime assets under `assets/`; no dependency on Desktop/Downloads. Inspect existing sprites before requesting or generating replacements. Use contain sizing and judge the subject within the source canvas, not merely the canvas bounds. Phone-sized diagrams must remain legible and controls reachable.

Related animation frames need shared crop coordinates; accessories always use the electron's fixed square canvas. Optical skin scaling applies only to the base sprite, never independent accessory offsets. Reuse `ParticleAvatar` for dressed companions.

JPGs are not transparent. Existing `FramedSprite.paper` and `PacketArtwork.paper` blend scans into matching host colours; a blend is not an alpha-channel asset. Test different host surfaces. Legacy preparation scripts in `scripts/` document reproducible crops and alpha conversion; inspect their source/output paths first and follow current image-tool instructions before using them. Never overwrite supplied originals. Missing artwork is a product decision, not a reason to substitute misleading science visuals.

Typography is Schoolbell/PatrickHand through `constants/theme.ts`. Use ordinary paragraphs for theory, framed cards for definitions/results/controls, no decorative frame around everything. Avoid large empty gaps, hidden outcomes revealed too early, redundant result headings and intermediate buttons without a genuine learner choice.

## Scientific guardrails carried forward

- Distinguish predictive state, an individual recorded outcome and the distribution of many fresh preparations. Never imply looking at an old result changes the past.
- Measurement is physical interaction, not consciousness. Uncertainty is not simply detector disturbance or complementary knowledge percentages.
- Quantum state drawings are schematic, not measured particle trails. Spin is intrinsic, not literal spinning; energy levels are not positions in a probability cloud.
- Entanglement is a shared state, not a signal or physical string. One opposite-result direction does not prove entanglement. Bell/CHSH conclusions require their assumptions and combined statistics.
- Teleportation needs pre-shared entanglement and an ordinary classical message, consumes the resource and makes no spare copy. QKD needs authenticated discussion, noise/statistical limits and discarded test samples, not a key secretly sent through the depicted quantum channel.
- Tunnelling conserves energy; schematic speed is not a tunnelling-time claim. Solar fusion involves nuclei and a multistep chain. Pauli concerns identical fermions and full states; chair analogies and counterfactual overlap do not fuse particles. Bose enhancement is not attraction; photon cooling cartoons are not a literal condensate recipe.
- Preserve appropriate historical attribution. Verify new niche/scientific claims with primary sources when required; existing lesson references are starting points, not support for unrelated new claims.

## Verification and handoff

From project root:

```sh
npm run typecheck
for test in tests/*.cjs; do
  [ "$test" = tests/component-harness.cjs ] || node "$test" || exit 1
done
npx expo export --platform web --platform ios --output-dir /private/tmp/qurio-verification-export
```

`tests/component-harness.cjs` is infrastructure. Other CJS tests validate source/flow/state, not native layout. No package installation or remote Supabase check is needed for ordinary lesson edits when dependencies already exist.

Check: gates before/after wrong/right answers; rapid double taps; replay; failed/passed finale; reset/unmount mid-animation; cancelled energy confirmation; reward claim/rip idempotency; seen versus unseen terms; Guest versus Tester visibility; real equipped companion. Use isolated synthetic state instead of resetting the user's live session.

Visual checks at phone width: meaningful subject size, clipping, overlay alignment, scroll reachability, long text and image transparency. Exercise native gestures on a device when available. Report separately what passed automated tests, exports, browser checks and actual device testing.

At handoff, record the new behaviour and any remaining missing art or backend work in the relevant topic note. Avoid appending a second conflicting chronology to AGENTS.md.
