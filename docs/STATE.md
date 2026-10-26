# MeterX working state

Last updated: 2026-10-27, on `main` after the 2027.0.1 release and store submissions.

Update this file at the end of each work session. Keep it short. Delete entries once they are done and merged.

## In progress (2026-10-27)

2027.0.1 is released and on every free store: Firefox live, Edge in review, Opera awaiting moderation (new entry, slug `meterx-by-ajithakdev-2`). Store steps and every field's text are in `docs/STORE-CHECKLIST.md` and `docs/STORE-LISTINGS.md`; `npm run package` builds `release/upload/<store>/`. Main has a `protect-main` ruleset, so merges need the owner's admin bypass. PR #100 (worker CPU under the free plan limit, measured on preview versions) waits for Sunday. MeterX has never been promoted; a launch plan (dev.to article, Reddit, AlternativeTo, awesome-selfhosted, the video, a rating prompt) was proposed on 2026-10-27 and not started.

Next:
1. Store reviews: Edge and Opera 2027.0.1 submitted 2026-10-27 (Firefox approved the same day). Delete the old never-published Opera entry (slug `meterx-by-ajithakdev`) if it still exists. Chrome Web Store needs a paid developer fee, so it waits for the owner's call.
2. Opera listing link into `apps/site/src/stores.ts` and the README once it is public.
3. SEO one-time setup in `docs/SEO.md` (Search Console sitemap, Bing), portfolio entry.
4. Milestone 2027.1.0 (Sunday): #97 private-window history, #99 Firefox for Android, #68 settings URL, #21 shortcut, PR #100 worker CPU (closes #86). In the same release, add "appearance" to the settings list on the site privacy page (`apps/site/static/privacy/index.html`) and bump its date; the AMO copy already has it.
5. Issues triaged 2026-10-27: the scan's 31 fixed bugs and 7 shipped features are closed with evidence; 48 open, status comments on the partial ones (#13, #19, #54, #95).

## Releases

Weekly on Sunday, like toolglass (decided 2026-10-24): patch for fixes only, minor if a feature landed; same-day patch for a broken test or security issue. Nothing deploys on merge: the worker deploys with `wrangler deploy`, the site with `npm run deploy -w @meterx/site` (Pages direct upload, not git-connected), and the stores take manual uploads. So docs, CI and code merges are only merges; a release is the tag, the CHANGELOG section, the GitHub release, then the worker, site and store uploads.

## Open pull requests

- #100 fix(worker): CPU per request under the free plan limit. Merges and deploys with the 2027.1.0 release.

Refresh with `gh pr list` and `gh issue list`.

## Known issues

See `docs/KNOWN-ISSUES.md`.
