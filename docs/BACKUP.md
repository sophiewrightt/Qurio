# Qurio backup

Requested existing destination: `https://github.com/sophiewrightt/Qurio.git`.

The destination's contents, default branch and visibility must be inspected after authentication. Do not replace its history or assume it is empty. A local Git checkpoint is not yet a GitHub backup: remote upload and verification are separate steps.

## Preparation checkpoint (28 September 2026)

Local Git initialized with `origin` set to the requested URL. Upload is pending authentication: a read-only remote-ref check could not obtain GitHub credentials. No remote history has been changed. The candidate source/artwork snapshot is approximately 109 MB, with no individual file above 2 MB. A common credential-pattern scan found no matches; this is not a comprehensive security audit. `.env.local`, caches and dependencies were verified ignored. TypeScript and all 39 regression scripts passed after the documentation consolidation; no app runtime code changed in that consolidation.

## Include

Application source, bundled artwork and source scans, fonts, package manifest and lockfile, test scripts, project documentation and reproducible asset-preparation scripts. Keep source scans: there may not be another copy on a future machine. `.env.example` contains public placeholder configuration only.

## Exclude

`.env.local` and other environment files (except the example), dependencies, Expo caches, `work/`, generated outputs/exports, logs and signing credentials. `.gitignore` captures these boundaries. Do not add production user data, tokens, passwords or service-role keys. Inspect filenames and scan for secrets before staging; don't print secret values into logs.

## Safe first remote backup

1. Authenticate through the GitHub connection or a trusted Git credential flow. Never put a token in a remote URL or ask for a password in chat.
2. Inspect remote refs, default branch and existing contents. If it already contains work, fetch and reconcile on a new backup branch or approved integration path. Do not force-push or delete remote work.
3. Review staged paths, ignored files, asset sizes and secret-scan findings. Preserve supplied artwork and package lockfile.
4. Commit with the configured user identity; push only the agreed branch/destination. Verify the remote commit ID matches the pushed local commit.
5. Report the repository link, branch and commit, or explicitly state that authentication/upload remains pending.

Source backups do not save in-app learner progress: Qurio currently uses session-only state. Future database backups and production recovery need a separate plan when persistence exists.
