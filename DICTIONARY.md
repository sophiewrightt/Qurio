# Personal dictionary

Home has a book-sprite entry immediately below Achievements. It opens `DictionaryModal`, not a navigation screen: a leather-coloured hardback border, aged parchment, grand heading, ruled text, scrollable alphabetical discoveries, and an explicit close control. Empty pages introduce no future terms. The supplied scan is preserved at `assets/ui/dictionary-source.jpg`, preloaded for every world and framed/blended at render time without changing its pixels.

The Home book is reduced to 75% of its previous size and its hint reads “click here to see the terminology you’ve unlocked”. There is no collected-curiosities subtitle or introductory illustration/copy in the modal. Empty state is only “You haven’t unlocked any words yet!”; the discovery-count/session footer appears only when entries exist.

`App.tsx` owns session-only `dictionaryEntries`. `DictionaryProvider` connects every shared `TerminologyCard` to the same discovery callback. A card's actual term/definition text must be substantially in the viewport on two 350ms samples before registration. Mounting a long lesson does not unlock offscreen terms. Loading covers, Home, wardrobe, background tabs and unmounted cards cannot register discoveries. Polling stops on discovery/unmount. Native uses `measureInWindow`; web uses its React Native Web implementation.

`data/dictionary.ts` holds the entry model, canonical IDs (case/spacing/apostrophe normalisation), immutable upsert and visibility watcher. Replays do not duplicate entries; encountering a new explanation of an existing term updates that entry to the latest encountered definition. No catalog of locked terms or completed-lesson backfill is exposed. New terminology cards join automatically.

Entries survive lesson navigation but reset with the prototype session, just like existing progress. No Supabase writes, localStorage or cross-user storage are added. Persist per authenticated user and reset on account switch when the account backend is implemented; never hydrate another learner's dictionary.

Checks: `node tests/dictionary.cjs`, all existing `tests/*.cjs`, `npm run typecheck`, Expo web export. Browser checks cover empty pages, offscreen cards staying locked, Quantised discovery before quiz completion, returning Home and displaying only that entry. Also check phone widths and popup scrolling when changing layout. Native device rendering still needs device QA.
