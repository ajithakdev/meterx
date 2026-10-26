# MeterX working state

Last updated: 2026-10-24, on `release/v2027.0.0`, PR open for review (see below).

Update this file at the end of each work session. Keep it short. Delete entries once they are done and merged.

## In progress (2026-10-27)

2027.0.1 is released: merged as #98, tagged `v2027.0.1` with a GitHub release (store zips attached), site redeployed. The worker is unchanged since 2027.0.0. Main has a `protect-main` ruleset, so merges need the owner's admin bypass. Store uploads follow `docs/STORE-CHECKLIST.md`.

Next:
1. Store uploads of 2027.0.1 (owner, 2026-10-27): Edge and Opera with `-chromium.zip`, then Firefox with `-firefox.zip` and `-source.zip`. Chrome Web Store needs a paid developer fee, so it waits for the owner's call.
2. Opera listing link into `apps/site/src/stores.ts` and the README once it is public.
3. SEO one-time setup in `docs/SEO.md` (Search Console sitemap, Bing), portfolio entry.
4. #97: skip history for private-window tests (next patch).
5. Verify and close the scan's issues (#60, #64 to #70, #73, #76 to #79, #81, #82, #85); check #61 to #63, #80, #87.

## Releases

Weekly on Sunday, like toolglass (decided 2026-10-24): patch for fixes only, minor if a feature landed; same-day patch for a broken test or security issue. Nothing deploys on merge: the worker deploys with `wrangler deploy`, the site with `npm run deploy -w @meterx/site` (Pages direct upload, not git-connected), and the stores take manual uploads. So docs, CI and code merges are only merges; a release is the tag, the CHANGELOG section, the GitHub release, then the worker, site and store uploads.

## Open pull requests

None. Refresh with `gh pr list` and `gh issue list`.

## Known issues

See `docs/KNOWN-ISSUES.md`.
