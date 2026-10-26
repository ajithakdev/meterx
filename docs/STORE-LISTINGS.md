# Store listings

The text for every store field, ready to paste. Update it here first when a feature changes, then paste it into each store. The rules behind it are in [STORE-CHECKLIST.md](STORE-CHECKLIST.md). Images come from `brand/png/store/` (made by `brand/build.mjs`).

## Shared fields

| Field | Value |
| --- | --- |
| Name | MeterX by ajithakdev (comes from the manifest) |
| Website | `https://meterx.ajithakdev.com` |
| Privacy policy | `https://meterx.ajithakdev.com/privacy/` |
| Support | `https://github.com/ajithakdev/meterx/issues` |
| Source | `https://github.com/ajithakdev/meterx` |
| License | AGPL-3.0 |
| Category | Productivity |

## Description

Paste this into Edge, Opera and Firefox. It names no browser, as Edge requires.

```text
MeterX tests your internet connection from the toolbar and tells you what the result means.

Click the MeterX icon and press Run test. In about 20 seconds you get:
- Download and upload speed, measured with several parallel streams for a fixed time
- Ping, jitter and packet loss
- Latency under load (bufferbloat), graded A to F. This is why video calls stutter while something else downloads
- A plain answer for video calls, 4K streaming, gaming and uploads

In the side panel:
- History of up to 200 results, with averages and a trend chart
- How much of your ISP plan's speed actually arrives
- A PDF report, or CSV and JSON exports
- Share links that carry the result inside the link

In settings:
- Scheduled tests every 30 minutes, every 2 hours or once a day, with an optional notice when quality drops to Poor
- Light, dark or match-system appearance
- Your own self-hosted MeterX test server instead of the default

Privacy: no account, no ads and no analytics. Results are stored in your browser. Tests run against MeterX's test server on Cloudflare's network, which streams test data and stores nothing.

Free and open source (AGPL-3.0): https://github.com/ajithakdev/meterx
Website: https://meterx.ajithakdev.com
```

## Short summary

For Opera's summary and Firefox's summary (250 characters at most):

```text
A free, open-source speed test in your toolbar. Measures download, upload, ping, jitter, packet loss and latency under load, and says what your connection is good enough for. No account, no tracking.
```

## Release notes for 2027.0.1

```text
A full redesign: new look, live test view, latency under load graded A to F, a PDF report with a report ID, CSV and JSON exports, a light or dark appearance setting, and a new logo. Library updates with security fixes.
```

## Microsoft Edge (Partner Center)

Dashboard: https://partner.microsoft.com/dashboard/microsoftedge/overview

Package: `release/meterx-<version>-chromium.zip`.

Properties: category Productivity, website and support as above, mature content unchecked.

Store listing images: logo `edge-logo-300.png`, small promotional tile `promo-440x280.png`, screenshots `screenshot-1` to `screenshot-5` (1280x800), large promotional tile `marquee-1400x560.png`. No YouTube URL.

Search terms (7 terms, 20 words, none names a browser):

```text
internet speed test
speed test
bufferbloat test
ping and jitter test
network speed checker
wifi speed test
upload speed test
```

Privacy tab:

| Field | Paste |
| --- | --- |
| Single purpose | MeterX measures the speed and quality of your internet connection (download, upload, ping, jitter, packet loss and latency under load) and keeps the results in the browser. |
| storage | Saves your settings (test server, ISP plan, schedule, appearance) and the history of past results, up to 200, in the browser. Nothing is sent anywhere else. |
| alarms | Runs scheduled tests every 30 minutes, every 2 hours or once a day, only if you turn a schedule on in settings. Off by default. |
| notifications | Shows a notice when a scheduled test finds that connection quality has dropped to Poor, only if you turn it on in settings. Off by default. |
| sidePanel | Opens the history view (past results, trend chart, plan comparison and exports) in the side panel. |
| Host permission | `https://meterx-speedtest.meterx-ajithakdev.workers.dev/*` is MeterX's own test server: the extension downloads and uploads test data to it to measure speed, and reads its timing headers. The optional `https://*/*`, localhost, 127.0.0.1 and `.local` patterns are requested at runtime only when you enter your own test server in settings, and only for that one server. |
| Remote code | No, I am not using remote code. Leave the justification empty. |
| Data usage | Tick nothing. MeterX collects none of the listed data: results stay in the browser, and the test server stores nothing. |
| Privacy policy URL | `https://meterx.ajithakdev.com/privacy/` |
| Certifications | Tick all three. |

Notes for certification: the reviewer notes in [STORE-CHECKLIST.md](STORE-CHECKLIST.md#8-notes-for-reviewers-paste-into-every-store).

## Opera Add-ons

Dashboard: https://addons.opera.com/developer/

Package: the same `-chromium.zip`, uploaded with Upgrade on the existing MeterX entry. Summary and description from above. Screenshots: the five 1280x800 files. Keep "Opera" out of the name, text and images.

## Firefox Add-ons

Dashboard: https://addons.mozilla.org/developers/addon/meterx-by-ajithakdev/versions/submit/

Package: `release/meterx-<version>-firefox.zip`. When asked whether the code is minified or bundled, answer yes and upload `release/meterx-<version>-source.zip`. Summary, description and release notes from above.

Notes to reviewer: the reviewer notes in [STORE-CHECKLIST.md](STORE-CHECKLIST.md#8-notes-for-reviewers-paste-into-every-store), plus:

```text
Build: Node 24 and npm 11 on Linux. Run `npm ci && npm run package`; the output is release/meterx-<version>-firefox.zip. All dependencies install from npm through package-lock.json.
```
