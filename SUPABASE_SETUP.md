# Qurio Supabase connection

Project reference: `fdmyngtmxiryvrecyqkk`

Project URL: `https://fdmyngtmxiryvrecyqkk.supabase.co`

## Configured and verified

The public project URL and publishable key are in ignored `.env.local`. `.env.example` documents the required variables without including privileged credentials. Expo embeds `EXPO_PUBLIC_*` values in the app: these must never contain account passwords, Supabase secret/service-role keys, database passwords or management tokens.

`lib/supabase.ts` prepares one lazy official Supabase client with validated HTTPS/public-key configuration. It is deliberately not wired into the existing prototype's navigation yet. Sessions are memory-only, automatic URL session detection is off, and no signup/login operation runs on import. Persistent device storage, auth callbacks and account switching must be implemented and tested as part of the account feature.

Run `npm run check:supabase` for a read-only connection check. It reads `/auth/v1/settings`, reports only relevant booleans, and never creates accounts, sends email or reads profiles. `node tests/supabase-config.cjs` checks validation and client initialization without network access. Restart Expo after changing environment configuration.

The initial live check returned HTTP 200: email login enabled, email confirmation required, **public signup enabled**. These settings were read, not changed. This verifies project/key connectivity, not database security or readiness for users.

## Before accounts go live

- Keep public registration disabled in the Supabase Authentication configuration during private setup, until signup/child consent has been designed and tested. Hiding Qurio's signup screen does not disable Supabase's signup API.
- The publishable key cannot administer the project or create database tables/policies. Database migrations need to be applied through the project's SQL Editor or an authorized migration environment. Do not put a privileged key in the app or paste it into chat.
- Australia is the confirmed initial launch country. Confirm the child/guardian consent design before collecting all-ages identity details or birth dates. Asia-Pacific hosting is intended, but the project's actual region has not been verified or changed.
- Add/test the schema, RLS policies, server-enforced roles, lesson attempts/life accounting and purchase entitlements described in `ACCOUNT_IMPLEMENTATION.md`.
- Create tester/creator access only in the correct environment, replace previously shared passwords, and configure creator MFA. No tester/creator account has been created yet.

No personal data has been sent to Supabase by this integration. Existing prototype profiles/progress remain session-only. No login, lives, unlock restrictions or saved-account feature has been silently switched on.

References: [Supabase React Native setup](https://supabase.com/docs/guides/auth/quickstarts/react-native), [public versus privileged keys](https://supabase.com/docs/guides/api/api-keys).

## Dependency check

The install-time npm audit reported 12 moderate advisories and no high or critical advisories. The reported chain involves `uuid` through the Expo build tools, not the Supabase client. npm's proposed automatic changes include incompatible Expo version changes, so no forced audit fix was applied. Recheck and resolve the affected toolchain before release; passing app tests does not establish that dependencies are vulnerability-free.
