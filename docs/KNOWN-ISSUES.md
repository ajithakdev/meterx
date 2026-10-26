# MeterX known issues

Open bugs and gaps, by area. Each row has a GitHub issue with the details. Remove a row when its fix is merged.

The 33 issues from the 2026-10-22 code scan were checked against `main` on 2026-10-27: 31 were fixed by 2027.0.0 and are closed with evidence, and the two below are partly fixed.

## Extension

| Issue | Severity | Summary |
| --- | --- | --- |
| #97 | Med | Results from private windows are saved to history (Firefox policy: must not store private-browsing data) |
| #68 | Low | The settings page's Test button and Save don't normalize a custom server URL with a trailing slash |
| #21 | Low | The background listens for a `run-test` shortcut, but the manifest declares no `commands` |

## Backends

| Issue | Severity | Summary |
| --- | --- | --- |
| #100 (PR) | Med | Worker CPU per request is above the Cloudflare free plan's 10 ms at the 90th percentile; the PR brings it to about 7 ms |

## Tests and CI

| Issue | Severity | Summary |
| --- | --- | --- |
| #86 | Low | CI doesn't lint or type-check the worker and packages; closes with #100 |
