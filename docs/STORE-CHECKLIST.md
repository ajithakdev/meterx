# Store release checklist

Go through this list for every release that goes to a browser store. It condenses the official policies of Firefox Add-ons (AMO), Microsoft Edge Add-ons, Opera Add-ons and the Chrome Web Store, and shows where MeterX already meets each rule. Links to the policies are at the bottom. Check them once a quarter, because the stores change their rules without much notice.

## 1. Build and package

- [ ] Version bumped in the root `package.json` only, and higher than the version live in every store (stores reject a version they have already seen).
- [ ] `npm run lint`, `npm run build` and `npm test` pass.
- [ ] `manifest.json` description is 132 characters or fewer.
- [ ] `npm run package` made three files in `release/`: `-chromium.zip` (Edge, Opera, Chrome), `-firefox.zip` and `-source.zip`.
- [ ] Mozilla's linter shows 0 errors on the Firefox zip:
  ```sh
  mkdir -p /tmp/ff && cd /tmp/ff && unzip -oq ~/projects/meterx-server/release/meterx-<version>-firefox.zip && npx web-ext@8 lint --source-dir .
  ```
  Warnings that are expected and fine: `sidePanel.open` unsupported (guarded in `apps/extension/src/lib/browser.ts`), `innerHTML` in `vendor/charts.js` and the page bundles, and the `data_collection_permissions` keys being newer than `strict_min_version`.
- [ ] The source zip rebuilds into an identical Firefox zip. Mozilla reviewers rebuild it and reject any difference:
  ```sh
  D=/tmp/repro && rm -rf $D && mkdir -p $D/src $D/a $D/b && cd $D/src \
    && unzip -q ~/projects/meterx-server/release/meterx-<version>-source.zip \
    && npm ci && npm run package \
    && (cd $D/a && unzip -q $D/src/release/meterx-<version>-firefox.zip) \
    && (cd $D/b && unzip -q ~/projects/meterx-server/release/meterx-<version>-firefox.zip) \
    && diff -r $D/a $D/b && echo IDENTICAL
  ```
- [ ] Nothing in the zips that the extension does not use: no source maps, no test files, no `.DS_Store`. List them with `unzip -l`.
- [ ] The bundles are not minified (`minify: false` in `apps/extension/build.mjs`). Opera rejects minified first-party code, and Mozilla and Edge both reject obfuscated code.

## 2. Test on real browsers

The Chromium zip is the same for Chrome, Edge and Opera, so one Chromium browser covers the code. Firefox runs a converted manifest (background script instead of a service worker, its own sidebar), so it always gets its own pass.

Load the build unpacked: `chrome://extensions` or `edge://extensions` with Developer mode on, then Load unpacked on `apps/extension/dist/`; in Firefox, `about:debugging`, This Firefox, Load Temporary Add-on, and pick the Firefox zip.

In each browser:

- [ ] Toolbar icon opens the popup. A test finishes in about 20 seconds with download, upload, ping, jitter, packet loss and the bufferbloat grade.
- [ ] The side panel (Firefox: sidebar) opens from the popup and shows history and the chart.
- [ ] PDF, CSV and JSON exports download and open.
- [ ] A share link opens the result on `meterx.ajithakdev.com/r/`.
- [ ] Settings: a schedule and an ISP plan save and are still there after closing and reopening.
- [ ] Custom server `http://localhost:8787` (with `npm run dev:ext` running) asks for permission, then a test runs against it.
- [ ] A scheduled test runs, and a drop in quality shows a notification. Turning notifications off in the OS does not break anything (Edge policy 1.9).
- [ ] The extension console (Firefox: Inspect on `about:debugging`; Chromium: "service worker" link) shows no red errors.
- [ ] Appearance: Light, Dark and Match system each apply to the popup, side panel and settings without reopening them, and the popup has no horizontal scroll (Opera checks this).

## 3. Rules every store shares

| Rule | How MeterX meets it | Check each release |
| --- | --- | --- |
| One clear purpose | Internet speed and quality test, nothing else | No unrelated feature crept in |
| Only the permissions it needs | `storage` (settings, history), `alarms` (scheduled tests), `notifications` (quality drop notice), `sidePanel` (Chromium side panel), host access to the default worker only. Other servers are optional and asked for at runtime | A new permission has a feature that uses it today, and the listing says why |
| No remote code | Everything runs from the package. CSP is `script-src 'self'`. Network calls only move test bytes and read `/ip` from the test server | No `eval`, no script loaded from the web |
| Secure transport | Default server is https. Plain http only for localhost, 127.0.0.1 and `.local` | `validateServerUrl` unchanged or still tested |
| Data and privacy | No personal data collected. Results stay in browser storage. The test server sees the IP address, as any server does, and keeps no logs. Shares put the result in the link itself | Privacy policy at `https://meterx.ajithakdev.com/privacy/` still matches what the code does |
| Listing is accurate | Description lists every feature, including scheduled tests and notifications | Screenshots show the current UI, not an old version |
| Works for the reviewer | No account needed. The worker must be up | `curl https://meterx-speedtest.meterx-ajithakdev.workers.dev/health` returns the new version |
| Name and trademarks | "MeterX by ajithakdev". No store or browser name in the extension name | Never add "for Chrome", "Opera" or "Edge" to the name |

## 4. Firefox Add-ons (AMO)

- [ ] Upload `-firefox.zip`. When AMO asks whether the code is bundled, say yes and upload `-source.zip`.
- [ ] Notes for reviewers: paste the text from section 8, plus "Build: Node 24, npm 11, run `npm ci && npm run package`; output is `release/meterx-<version>-firefox.zip`. No private dependencies; everything installs from npm through `package-lock.json`."
- [ ] `data_collection_permissions` says `none`. That is true only while MeterX sends nothing beyond test traffic. If a feature ever sends data, change the manifest and add an opt-in first.
- [ ] A fix after a rejection contains only that fix (AMO policy 3: no unrelated changes).
- [ ] Private windows: Firefox policy says data from private browsing must not be stored. Open issue #97 tracks skipping history in private windows; until it ships, keep the add-on's private-window setting at its default (off).
- [ ] Listing: website `https://meterx.ajithakdev.com`, support site the GitHub issues page, privacy policy URL as above, license AGPL-3.0.

## 5. Microsoft Edge Add-ons (Partner Center)

- [ ] Upload `-chromium.zip`.
- [ ] Search terms: at most 7, all relevant (for example: speed test, internet speed, bufferbloat, ping, latency, wifi test, bandwidth).
- [ ] Notes for certification: the text from section 8.
- [ ] Images from `brand/png/store/`: `edge-logo-300.png`, `promo-440x280.png`, `marquee-1400x560.png`, screenshots at 1280x800. Not stretched or blurry.
- [ ] The description must not mention other browsers (Edge policy 1.1.2). Write "your browser" or "Edge".
- [ ] Privacy policy URL set. Edge prefers a policy that talks about Edge rather than other browsers; ours names no browser, which is fine.
- [ ] Mature content: answer no.

## 6. Opera Add-ons

- [ ] Upload `-chromium.zip`.
- [ ] Summary in full, grammatical sentences that say what it does. Description says how to use it and what it looks like.
- [ ] Nothing in the name or images says "Opera" or suggests Opera made it.
- [ ] Icons at every size share one style and are not just a word on a color.
- [ ] Screenshots are PNG, not interlaced, and the popup screenshot matches the popup's real size.
- [ ] Third-party libraries (`vendor/charts.js`, jsPDF in the bundles) are unmodified releases without known vulnerabilities. Run `npm audit --omit=dev`.
- [ ] Once the listing is public, put its link in `apps/site/src/stores.ts` and the README.

## 7. Chrome Web Store (when the developer fee is approved)

- [ ] Single purpose field: "Measures internet speed and connection quality (download, upload, ping, jitter, packet loss and latency under load) from the browser toolbar."
- [ ] Permission justification for each permission, using the table in section 3.
- [ ] Remote code: answer no.
- [ ] Data usage form: no data collected. It must match the privacy policy.
- [ ] Add a Limited Use statement to the privacy page before submitting: "MeterX's use of information follows the Chrome Web Store User Data Policy, including the Limited Use requirements."
- [ ] No keyword stuffing: no word repeated more than 5 times in the description, no lists of places or brands.

## 8. Notes for reviewers (paste into every store)

```text
MeterX is an internet speed test. No account or login is needed.

To test: click the toolbar icon and press Start. The test takes about 20 seconds and
measures download, upload, ping, jitter, packet loss and latency under load against
our test server (https://meterx-speedtest.meterx-ajithakdev.workers.dev), which
streams bytes and stores nothing. Open the side panel from the popup to see history
and exports (PDF, CSV, JSON).

Permissions: storage (settings and local history), alarms (optional scheduled tests),
notifications (optional notice when quality drops), sidePanel (history view). The
optional host permission is only requested if the user enters their own test server
in settings.

No personal data is collected or sent anywhere. Source code:
https://github.com/ajithakdev/meterx (AGPL-3.0).
```

## 9. After approval

- [ ] Install from each store on a clean profile and run one test.
- [ ] Update the store links and versions in the README, `RESOURCES-AND-GUIDE.md` and `apps/site/src/stores.ts` if any changed.
- [ ] Add a line to `docs/STATE.md`, and post in the launch log (`~/.claude/launch-log.md`) if the release is announced.

## Sources

- Firefox: [Add-on policies](https://extensionworkshop.com/documentation/publish/add-on-policies/), [Source code submission](https://extensionworkshop.com/documentation/publish/source-code-submission/)
- Edge: [Developer policies for Microsoft Edge Add-ons](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies)
- Opera: [Acceptance criteria](https://help.opera.com/en/extensions/acceptance-criteria/)
- Chrome: [Program policies](https://developer.chrome.com/docs/webstore/program-policies/policies)

Last checked against these pages: 2026-10-27.
