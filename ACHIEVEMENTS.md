# Achievement collection

Home opens screen `33`, the achievement collection, using a dictionary-style entry with the supplied smiling default badge, “Achievements”, and “click here to see your achievements!”. The reddish unclaimed-reward message is retained. The default badge scan is preloaded and framed unchanged. `data/achievements.ts` holds all 38 definitions and pure ledger operations. `data/achievementArt.ts` maps the user's scans, preserved unchanged in `assets/achievements/`. `AchievementBadge` frames a common optical crop at render time, blends the paper into the cream background and mutes locked milestone badges. All scans are included in every world's preload set.

World achievements reveal neither badge, name nor description before earning (including accessibility labels). Streak, Unlocks and Lessons show requirements and locked badges. Claimed badges show only “Claimed”, not their former reward amount or collect control, including in accessibility labels. Tapping an earned badge claims its specified reward once; numeric rewards contribute to the same live Quanta balance shown on Home and in the wardrobe, with a measured badge-to-counter coin flight. No achievement grants Knowledge. Unknown reward amounts remain unclaimable, not free claims or invented payouts.

App guards lesson completion and normal packet opening once per lesson visit. New visits, including completed replays, increment the lesson total again; unique Home completion is unchanged. Failed final quizzes never invoke completion. Packets count when actually ripped, not on lesson finish or merely displaying a packet. Duplicate and stale callbacks cannot count twice. Unlock milestone claims create pending bonus packets; ripping one uses the shared random accessory picker, counts one more opening, and consumes that packet exactly once. Closing before ripping retains the entitlement; closing after ripping does not permit reopening it. Existing fewer-than-three/all-owned behavior remains honest.

`AchievementToast` presents a queued badge plus “Achievement earnt”, auto-dismisses after 3.5 seconds and cleans up its timer. Loading/world/level overlays defer the global toast. Bonus-packet dialogs present their own toast so an opening milestone is not lost behind the dialog. Nothing is persisted or written to Supabase. Future authenticated rewards need a server-authoritative idempotent ledger, not client-only counters.

## Confirmed rewards and deferred login tracking

- Every Lessons milestone and every Streak milestone awards 20 Quanta, claimed once per badge.
- Rainbow awards 20 Quanta. Its trigger remains World 2 Lesson 2, screen `12`; the dedicated colour lesson is screen `13`.
- “Family fun” unlocks after World 4 Lesson 3, screen `28`, and awards 30 Quanta.
- Streak milestones are listed but never earned from the decorative Home streak value. Consecutive real login tracking is deferred until accounts exist.

## Verification

`tests/achievements.cjs` covers all 38 assets, explicit lesson triggers, hidden names, replay totals, duplicate/stale event guards, claim idempotency, packet thresholds and bonus consumption, Knowledge isolation and toast cleanup. The full existing CJS suite, TypeScript and web/iOS exports also run. Phone-width browser QA covers locked and earned art, real final-quiz completion, Quanta claim flight, Home message, five replay completions/five packet openings and claiming/ripping the extra packet (six openings). Native filter/blend rendering still needs device QA.
