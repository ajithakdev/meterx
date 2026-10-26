# Store listings

The text for every store field, ready to paste. Update it here first when a feature changes, then paste it into each store. The steps and rules are in [STORE-CHECKLIST.md](STORE-CHECKLIST.md). `npm run package` puts each store's zip and images in `release/upload/<store>/`; the images come from `brand/png/` (made by `brand/build.mjs`, plus the Opera sizes below).

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

Short form, for Edge's certification notes and Opera's changelog:

```text
A full redesign: new look, live test view, latency under load graded A to F, a PDF report with a report ID, CSV and JSON exports, a light or dark appearance setting, and a new logo. Library updates with security fixes.
```

Long form, for Firefox's release notes (shown on the listing):

```text
MeterX has been rebuilt from the ground up.

- A new look, with light and dark themes (or follow your system)
- Watch the test live as it runs
- Latency under load, graded A to F, so you can see why calls stutter while something downloads
- A PDF report you can hand to your ISP, plus CSV and JSON exports
- Sidebar history with a trend chart and a check against your ISP plan
- A new logo
- Library updates with security fixes
```

## Shorter description

If a store's form errors on the full description (Opera did once), use this one; it has no links:

```text
MeterX tests your internet connection from the toolbar and tells you what the result means.

Click the MeterX icon and press Run test. In about 20 seconds you get download and upload speed, ping, jitter and packet loss, plus latency under load (bufferbloat) graded A to F. That busy-line ping is why video calls stutter while something else downloads. MeterX also says in plain words whether your connection is good enough for video calls, 4K streaming, gaming and uploads.

The side panel keeps up to 200 results with averages and a trend chart, shows how much of your ISP plan's speed arrives, and exports a PDF report, CSV or JSON. Share links carry the result inside the link.

In settings you can schedule tests every 30 minutes, every 2 hours or once a day, get a notice when quality drops to Poor, pick a light or dark look, or use your own self-hosted test server.

No account, no ads and no analytics. Results are stored in your browser. MeterX is free and open source under the AGPL-3.0 license.
```

## Microsoft Edge (Partner Center)

Dashboard: https://partner.microsoft.com/dashboard/microsoftedge/overview

Package: `release/upload/edge/` (the Chromium zip and every image below).

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

Submit page: "Does a tester need credentials?" No. Notes for certification: the reviewer notes in [STORE-CHECKLIST.md](STORE-CHECKLIST.md#8-notes-for-reviewers-paste-into-every-store), plus the short release notes.

## Opera Add-ons

Dashboard: https://addons.opera.com/developer/. MeterX is slug `meterx-by-ajithakdev-2`, ID `nmahjcepencimnpdgkaflobfcpdmkmnf`, submitted 2026-10-27. An older entry (slug `meterx-by-ajithakdev`, ID `oajjobbjfpknebicnnneloildijibgdk`) sat unreviewed from March 2026; delete it if it is still there, since Opera rejects duplicates.

Update the existing entry, never a new one: Opera rejects duplicates, and the ID stays the same. Versions tab, "Copy metadata from version" set to the newest one, then upload `release/meterx-<version>-chromium.zip`, open the new version, edit its listing and submit it for moderation.

Files: `release/upload/opera/`. The images live in `brand/png/store/opera/`, because Opera caps screenshots at 800x600 (612x408 preferred) and wants the promotional image at exactly 300x188, non-interlaced PNG. Remake them after `brand/build.mjs` changes the store images:

```sh
cd brand/png/store
for i in 1 2 3 4 5; do ffmpeg -y -i screenshot-$i-1280x800.png -vf "scale=800:500:flags=lanczos" -pix_fmt rgb24 opera/screenshot-$i-800x500.png; done
ffmpeg -y -i promo-440x280.png -vf "scale=300:191:flags=lanczos,crop=300:188" -pix_fmt rgb24 opera/promo-300x188.png
```

| Field | Value |
| --- | --- |
| Name (General tab, editable only until first publication) | MeterX by ajithakdev |
| Category | Productivity |
| Summary | The short summary above |
| Description | The description above |
| Screenshots | `opera/screenshot-1` to `-5` (800x500) |
| Promotional image tab | `opera/promo-300x188.png` |
| Icon (64x64 required, Media tab) | `opera/icon-64.png`, scaled from `icons/icon-128.png` with `ffmpeg -i ../icons/icon-128.png -vf scale=64:64:flags=lanczos -pix_fmt rgba opera/icon-64.png` |
| License | AGPL-3.0 if listed; otherwise point the license URL at `https://github.com/ajithakdev/meterx/blob/main/LICENSE` |
| Homepage and support | Website and support from the shared fields |

Keep "Opera" out of the name, text and images.

Opera's description field returned a 500 error on the first save on 2026-10-27; saving again or using a shorter text without links got past it.

General tab of each version:

| Field | Value |
| --- | --- |
| Service website URL | `https://meterx.ajithakdev.com` |
| Extension support page URL | `https://github.com/ajithakdev/meterx/issues` |
| Source code URL (public) | `https://github.com/ajithakdev/meterx/tree/v<version>` |
| Source code URL (for moderators) | `https://github.com/ajithakdev/meterx/releases/download/v<version>/meterx-<version>-source.zip` |
| Build instructions | Linux, Node 24 and npm 11; `npm ci` then `npm run package`; the output is `release/meterx-<version>-chromium.zip`, bundled with esbuild and not minified |
| License URL | `https://github.com/ajithakdev/meterx/blob/v<version>/LICENSE` |
| Privacy policy URL | `https://meterx.ajithakdev.com/privacy/` |

Message for the Conversation tab when a version replaces one still in the queue:

```text
Hello, version 2027.0.1 replaces 2026.3.20.1, which is still waiting for moderation. Please review 2027.0.1 instead. It is a full redesign of the same extension: a speed test that measures download, upload, ping, jitter, packet loss and latency under load against our own test server. No account is needed to test it. The code is not minified, and the source is at https://github.com/ajithakdev/meterx. Thank you.
```

## Firefox Add-ons

Dashboard: https://addons.mozilla.org/developers/addon/meterx-by-ajithakdev/versions/submit/

Files: `release/upload/firefox/` (Firefox zip, source zip, 128px icon, screenshots). Summary, description and the long release notes from above.

Compatibility: Firefox only. Leave Firefox for Android unticked until it is tested; Android has no sidebar.

"Do you need to submit source code?": Yes (esbuild combines files), then upload the source zip.

Notes to reviewer (used for 2027.0.1):

```text
No account needed. Click the toolbar icon and press Run test; it takes about 20 seconds. Tests run against our own server (meterx-speedtest.meterx-ajithakdev.workers.dev), which streams test data and stores nothing. The sidebar, opened from the popup, shows history and exports.

Build: Linux, Node 24, npm 11. From the root of the source zip, run "npm ci && npm run package". It writes release/meterx-<version>-firefox.zip, identical to this upload. All dependencies come from npm via package-lock.json. The code is bundled with esbuild, not minified.

innerHTML: our own uses (src/lib/ui.ts and src/pages/sidepanel.ts) only insert fixed labels and numbers we format. The logo is a constant SVG. User text such as the ISP name goes through textContent. The other flagged uses are inside jsPDF, unmodified.

No data is collected (data_collection_permissions: none). Source: https://github.com/ajithakdev/meterx, tag v<version>.
```

Manage Listing, after submitting:

| Field | Value |
| --- | --- |
| Summary, description | From above |
| Categories | Web Development, Alerts & Updates |
| Tags | download, privacy, streaming |
| Homepage | `https://meterx.ajithakdev.com` |
| Support website | `https://github.com/ajithakdev/meterx/issues` |
| Icon | `icon-128.png` |
| Screenshots | The five 1280x800 files |
| License | GNU Affero General Public License v3.0 only |
| Developer comments | Found a bug or have an idea? Open an issue at https://github.com/ajithakdev/meterx/issues. MeterX is open source, so you can read exactly what it does. |
| Privacy policy | The text below |

Privacy policy text for AMO (the site's policy without the side panel, which the Firefox build does not use). Keep it in step with `apps/site/static/privacy/index.html`:

```markdown
MeterX collects no personal data. Your results stay in your browser.

Last updated 27 October 2026. Applies to MeterX 2027.0.0 and later. The current version is always at https://meterx.ajithakdev.com/privacy/

## What the extension stores

- Your test results (download, upload, ping, jitter, packet loss, latency under load, the Cloudflare location and the network name the server reports), up to 200 of them, in your browser's local extension storage.
- Your settings: the test server address, your ISP plan if you enter one, the schedule for automatic tests, whether to notify you, and the appearance. These are in your browser's synced extension storage, so they follow your browser account if you use sync.

Nothing is sent to MeterX or anyone else. Uninstalling the extension, or clearing its storage, deletes all of it.

## What a test sends

A test exchanges data with the test server: it downloads test bytes, uploads test bytes that the server throws away, and sends small ping requests. As with any web request, the server sees your IP address. The default server is a Cloudflare Worker that:

- keeps no request logs and no database, and stores nothing about you;
- returns your IP address, its type (IPv4 or IPv6), the network name, city, country and Cloudflare location, so the extension can show them. These come from Cloudflare's own lookup of your IP and are not kept by the worker.

Cloudflare runs the network the worker is on, and its handling of traffic is covered by Cloudflare's privacy policy. If you set a custom server, your tests go to that server instead, and its owner's policy applies.

## Permissions and why

- Storage: to keep your results and settings.
- Alarms: to run tests on the schedule you choose. Off by default.
- Notifications: to tell you when a scheduled test finds that quality has dropped, if you turn it on.
- Access to the test server's address: to run tests. Access to a custom server is asked for only when you add one.

## Share links and reports

A share link carries the result inside the link itself, after the # sign, which browsers never send to a server. The MeterX website reads it in your browser to show the result. PDF, CSV and JSON reports are made on your device and saved where you choose.

## Children

MeterX is not aimed at children and collects no personal data from anyone.

## Changes and contact

Changes to this policy are listed in the repository's history (https://github.com/ajithakdev/meterx), and the date above is updated. Questions go to https://github.com/ajithakdev/meterx/issues or ajithkumarks2579@gmail.com.
```
