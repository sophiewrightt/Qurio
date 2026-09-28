# Your avatar’s greeting library

Edit **`data/greetings.ts`**, inside `greetingMessages`, to add, remove or change messages. Put each message in quotes followed by a comma. The lists are `morning`, `anytime`, `birthday`, `easter`, and `christmas`. `GREETING_DURATION_MS` controls how long the greeting stays (currently 5,000 milliseconds).

Before noon, both morning and anytime messages are eligible. From noon onwards, only anytime messages are eligible. Every eligible message has an equal chance; each Home visit is a fresh random draw, so occasional repeats are normal. The device’s local date and time are used.

Special messages replace the normal pool for that date. Priority on overlapping dates is birthday, Christmas Day, then Gregorian Easter Sunday. Easter is calculated each year, not hard-coded. February 29 birthdays match February 29 only. The Easter tests include 5 April 2026 and 28 March 2027, as listed by the [NSW Government](https://www.nsw.gov.au/about-nsw/public-holidays).

The username button opens the right-side settings drawer; Profile & birthday opens an optional day/month birthday field. No birth year is collected. The wardrobe remains available via the avatar’s coat hanger. Birthday state lives in `App.tsx`, and like the existing avatar/progress state lasts only for the current prototype session. There is no authentication or saved-account system yet; when one is added, restore the birthday and avatar unlock before making Home ready.

`AvatarGreeting` greets once per Home mount after loading, world-unlock and Knowledge overlays clear, provided an avatar is unlocked. Returning from a lesson creates a new Home visit. Rerenders, avatar renaming and opening/closing settings do not reroll it. The timer and animations are cleaned up on leaving Home. The speech-bubble scan is no longer rendered for greetings. A small code-drawn curved dash leads from the particle towards the unboxed greeting text. The avatar is centred independently in the Home hero. A compact (at most 132px) greeting floats at its upper right without taking up a row slot or moving the avatar. It fades in over 400ms and fades out during the final 500ms of the five-second visit greeting; expiry never changes layout.

The top-right settings entry displays the local Guest / Tester username, bold purple level and “tap to see settings”. It opens a right-side drawer with Profile & birthday and Leave this session. Profile & birthday opens the existing birthday modal. Never substitute the companion name. Normal avatar greetings wait while an onboarding bubble is active; see `ONBOARDING.md`. The local name and mode are not real authentication.

Verification: `node tests/avatar-greetings.cjs`, the full CJS suite, TypeScript, and phone-sized browser checks. Tests cover random-pool reachability, the noon boundary, moving Easter, date collisions, birthday validation, delayed readiness, rerender stability, timeout/unmount cleanup and return navigation.
