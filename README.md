# Qurio

A hand-drawn quantum learning prototype built with Expo / React Native and TypeScript. Realm 1 contains 31 lessons across four chapters: introductory quantum physics, quantum rules, quantum connections and particles together.

## Run locally

```sh
npm ci
npm run web
# or: npm start
```

Use the SDK versions in `package.json` and `package-lock.json` (currently Expo 57), not older historical setup notes. Native preview requires a compatible Expo client/development build.

## Current state

Guest/Tester usernames open local sessions, not authenticated accounts. Progress, Knowledge, Quanta, dictionary, cosmetics and achievements reset with the session. Tester skips onboarding and has unrestricted preview access. Guest follows local progression and the guided introduction. Supabase connectivity is prepared but account persistence, secure rewards and daily energy debits are not deployed. Real-money purchases remain disabled.

The four existing chapters form the beginner realm. Further subject realms are planned, not implemented.

## Where to start

- [Compact project context](AGENTS.md): current constraints and topic routing.
- [Lesson playbook](docs/LESSON_AUTHORING.md): reusable patterns, components, integration and testing.
- [Lesson brief](docs/LESSON_BRIEF.md): reusable planning template.
- [Realm roadmap](docs/ROADMAP.md): future streams and prerequisite direction.
- [GitHub backup](docs/BACKUP.md): repository and safe backup boundaries.

`App.tsx` owns navigation/session state. `data/curriculum.ts` owns lesson order metadata; `screens/` wires lessons; `components/` contains shared UI and interactions; `constants/theme.ts` defines visual tokens; `assets/` contains bundled supplied artwork; `tests/` contains CJS flow/state regressions.

## Verify

```sh
npm run typecheck
for test in tests/*.cjs; do
  [ "$test" = tests/component-harness.cjs ] || node "$test" || exit 1
done
```

Phone-width visual and native gesture checks complement these tests. See the playbook for exports and interaction checklists.

## Configuration and privacy

Copy the placeholder names in `.env.example` into a local environment file only if using the optional Supabase connectivity check. Never commit `.env.local`, secrets or service-role keys. See `SUPABASE_SETUP.md` and `ACCOUNT_IMPLEMENTATION.md` before backend work.

Supplied drawings and lesson content are retained; this repository does not grant a new public licence to them. Generated builds, dependencies and caches are excluded from version control. Historical context is preserved under `docs/archive/`, including the original early-prototype README.
