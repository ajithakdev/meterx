# MeterX known issues

Open bugs and gaps, by area. Each row has a GitHub issue with the details. Remove a row when its fix is merged.

The 33 issues from the 2026-10-22 code scan were checked against `main` on 2026-10-27: 31 were fixed by 2027.0.0 and are closed with evidence, and the two below are partly fixed.

## Extension

| Issue | Severity | Summary |
| --- | --- | --- |
| #104 | Low | Chrome uploads over HTTP/2 read about half of a fast line. Fixed for the default server by uploading over HTTP/3 first (PR #105); still applies after a fallback and to custom servers |
| #68 | Low | The settings page's Test button and Save don't normalize a custom server URL with a trailing slash |
| #21 | Low | The background listens for a `run-test` shortcut, but the manifest declares no `commands` |

## Backends

| Issue | Severity | Summary |
| --- | --- | --- |
| #100 (PR) | Med | Worker CPU per request is above the Cloudflare free plan's 10 ms at the 90th percentile; the PR brings it to about 7 ms |

## Tests and CI

| Issue | Severity | Summary |
| --- | --- | --- |
