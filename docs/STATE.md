# MeterX working state

Last updated: 2026-10-31, on `main` after the 2027.0.2 worker release.

Update this file at the end of each work session. Keep it short. Delete entries once they are done and merged.

## Decision 2026-11-21: 2-week promotion test

Feature and UI work is frozen (bug fixes only) until about 2026-12-06. The pitch becomes "log your speed and prove it to your ISP". Plan and decision rule: see the MeterX section of `~/.claude/launch-log.md`. Under about 100 active installs by then means maintenance mode.

Backend before promotion (branch `feat/static-test-files`): the free Worker plan allows 100,000 requests a day and a test makes about 150 (roughly 1 `/ip`, 35 pings, 10 to 20 downloads, 96 uploads), so about 660 tests a day for everyone. Done on the branch: `/ping` is a static asset (free, unlimited; same latency in a production A/B). Tried and rejected: downloads as static assets (about 180 ms more time to first byte per request, so lower results). Next: bigger upload chunks in `uploadChunkBytes` (about 1 s per chunk instead of 0.25 s, so about 24 upload requests), checked in a browser A/B for accuracy; then a 429 fallback to `speed.cloudflare.com/__down` and `__up`. Rejected as backends: M-Lab (4 automated tests a day, publishes IPs), Ookla, fast.com, volunteer LibreSpeed servers, Oracle Always Free (stopping idle reclaim needs Pay As You Go, which has no hard spending cap).

## In progress (2026-10-27)

2027.0.1 is released and on every free store: Firefox live, Edge in review, Opera awaiting moderation (new entry, slug `meterx-by-ajithakdev-2`). Store steps and every field's text are in `docs/STORE-CHECKLIST.md` and `docs/STORE-LISTINGS.md`; `npm run package` builds `release/upload/<store>/`. Main has a `protect-main` ruleset, so merges need the owner's admin bypass. 2027.0.2 (2026-10-31) shipped PR #100: the worker's CPU per request is under the free plan's 10 ms limit (preview p50 4.5 ms, p90 8.0 ms), deployed as worker version `f924181d`; no extension change, so stores stay on 2027.0.1. An A/B test against the old worker showed the same speeds, but ping during download about 55 ms higher (weak signal, 10 of 13 pairs on a 480 ms link); recheck the bufferbloat grades on a low-latency line. MeterX has never been promoted; a launch plan (dev.to article, Reddit, AlternativeTo, awesome-selfhosted, the video, a rating prompt) was proposed on 2026-10-27 and not started.

Next:
1. Store reviews: Edge and Opera 2027.0.1 submitted 2026-10-27 (Firefox approved the same day). Delete the old never-published Opera entry (slug `meterx-by-ajithakdev`) if it still exists. Chrome Web Store needs a paid developer fee, so it waits for the owner's call.
2. Opera listing link into `apps/site/src/stores.ts` and the README once it is public.
3. SEO one-time setup in `docs/SEO.md` (Search Console sitemap, Bing), portfolio entry.
4. Milestone 2027.1.0 (Sunday): #97 private-window history, #99 Firefox for Android, #68 settings URL, #21 shortcut. In the same release, add "appearance" to the settings list on the site privacy page (`apps/site/static/privacy/index.html`) and bump its date; the AMO copy already has it.
5. Issues triaged 2026-10-27: the scan's 31 fixed bugs and 7 shipped features are closed with evidence; 48 open, status comments on the partial ones (#13, #19, #54, #95).

## Releases

Weekly on Sunday, like toolglass (decided 2026-10-24): patch for fixes only, minor if a feature landed; same-day patch for a broken test or security issue. Nothing deploys on merge: the worker deploys with `wrangler deploy`, the site with `npm run deploy -w @meterx/site` (Pages direct upload, not git-connected), and the stores take manual uploads. So docs, CI and code merges are only merges; a release is the tag, the CHANGELOG section, the GitHub release, then the worker, site and store uploads.

## Open pull requests


Refresh with `gh pr list` and `gh issue list`.

## Known issues

See `docs/KNOWN-ISSUES.md`.
