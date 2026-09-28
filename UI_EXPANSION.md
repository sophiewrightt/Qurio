# Realm, chapter and quiz UI

The four existing worlds are now learner-facing **chapters**, grouped as **Realm 1**. `data/curriculum.ts` records stable realm/chapter IDs, titles and lesson screen IDs. `data/lessonEntry.ts` derives sequential admission and lesson labels from that catalogue. Existing component names, asset directories and achievement IDs remain compatible; ordinary scientific uses of “world” are unchanged. Additional realm routing and content are not yet implemented.

Tester sessions start with the introduction done through `tourForProfile`, including all three introduced feature gates. Guest sessions still start at Welcome. Done tours ignore subsequent lesson events and never receive tutorial Quanta. Unlimited tester energy and isolated creator preview are unchanged.

Home has one horizontal Achievements / Dictionary shortcut row with the supplied artwork and no unlocked helper sentences. Locked shortcuts retain “Keep playing levels to unlock!”, and each keeps its independent tutorial anchor. Realm 1 is labelled above the chapter paths.

`QuizCompanionProvider` supplies the real selected particle and equipped accessory IDs to the shared `LessonQuiz`. It is hidden until the companion is unlocked, and always hidden in Chapter 1 Lesson 1. Correct answers use existing happy electron (`electron-content.png`), photon and gluon art and jump once. Incorrect answers keep the normal pose. A new question resets the pose; unmount stops animation; reduced-motion preference suppresses jumping. Optical scaling affects only the base sprite, never individual accessory overlays. All happy art is preloaded for every chapter.

Special sealed/torn Q packets keep the original JPG scans. The renderer blends their white paper into the host surface (white offer cards, cream reward modal), rather than changing the drawings. These are runtime background fixes, not alpha-channel PNGs. `PacketArtwork.paper` must match any new host surface.

Verified with TypeScript, the full CJS suite including `tests/ui-expansion.cjs`, and an isolated 390px browser preview of Home, equipped quiz poses and all six special packet states. No authentication, persisted account state or paid purchases have been changed.
