# Store release checklist

Go through this list for every release that goes to a browser store. Sections 1 to 3 are the checks and the rules all stores share, condensed from their official policies (links at the bottom). Sections 4 to 6 are the upload steps, store by store, as done for 2027.0.1 on 2026-10-27. Every field's text is in [STORE-LISTINGS.md](STORE-LISTINGS.md). Recheck the policies once a quarter, because the stores change them without much notice.

## 1. Build and package

- [ ] Version bumped in the root `package.json` only, and higher than the version live in every store (stores reject a version they have already seen).
- [ ] `npm run lint`, `npm run build` and `npm test` pass.
- [ ] `manifest.json` description is 132 characters or fewer.
- [ ] `npm run package` made the three zips in `release/` (`-chromium.zip` for Edge, Opera and Chrome, `-firefox.zip`, `-source.zip`) and one folder per store in `release/upload/` with that store's zip and images.
- [ ] The release is tagged and on GitHub with the zips attached, so the source and license links in the listings resolve.
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

## 4. Microsoft Edge Add-ons

Folder: `release/upload/edge/`. Dashboard: https://partner.microsoft.com/dashboard/microsoftedge/overview, then MeterX.

- [ ] Packages: upload the Chromium zip and wait for its check to pass.
- [ ] Properties: website, support contact and category as in STORE-LISTINGS. Mature content unchecked.
- [ ] Privacy: single purpose and one justification per permission (storage, alarms, notifications, sidePanel, host). Remote code: No. Data usage: nothing ticked. Privacy policy URL. All three certifications ticked.
- [ ] Store listings, Edit details: description, logo, small and large promotional tiles, five screenshots, seven search terms. No search term or sentence may name another browser (policy 1.1.2); "chrome speed meter" was in the old list.
- [ ] Publish. "Does a tester need credentials?": No. Notes for certification are required every time: section 8 plus a line on what changed.
- [ ] Status shows "In review". Microsoft answers within 7 business days.

## 5. Opera Add-ons

Folder: `release/upload/opera/`. Dashboard: https://addons.opera.com/developer/

- [ ] Update the existing entry (slug `meterx-by-ajithakdev-2`); never create a second one, since Opera rejects duplicates.
- [ ] Versions tab: copy metadata from the newest version, upload the Chromium zip, open the new version.
- [ ] Translations tab: summary, description, changelog, each saved with its own button. The description save can return a 500 error; save again, or use the shorter text in STORE-LISTINGS.
- [ ] Media tab: the 64x64 icon and the five 800x500 screenshots (Opera caps screenshots at 800x600). Remove old ones.
- [ ] General tab: service website, support, source URLs, build instructions, license URL and privacy policy URL. Then Submit changes.
- [ ] Promotional Image tab: `promo-300x188.png` (exactly 300x188).
- [ ] Versions tab shows the green "submitted for moderation". Post the Conversation message if an older version is still queued.
- [ ] Opera has no side panel API, so the side panel button falls back; check it once in Opera.

## 6. Firefox Add-ons (AMO)

Folder: `release/upload/firefox/`. Dashboard: https://addons.mozilla.org/developers/addon/meterx-by-ajithakdev/versions/submit/

- [ ] Upload the Firefox zip. Expect 0 errors and about 20 warnings; the `innerHTML` one is explained in the reviewer notes.
- [ ] Compatible with Firefox only. Firefox for Android stays unticked until it is tested.
- [ ] "Do you need to submit source code?": Yes (esbuild combines files). Upload the source zip.
- [ ] Release notes and notes to reviewer from STORE-LISTINGS, then Submit Version. Approval can take minutes (2027.0.1) or days for a manual review.
- [ ] Manage Listing: summary, description, homepage, support site, categories, tags, developer comments, icon, screenshots, privacy policy. Categories and tags must describe MeterX: no VPN, search, social media or torrent.
- [ ] `data_collection_permissions` says `none`. That is true only while MeterX sends nothing beyond test traffic. If a feature ever sends data, change the manifest and add an opt-in first.
- [ ] A fix after a rejection contains only that fix (AMO policy 3: no unrelated changes).
- [ ] Private windows: Firefox policy says data from private browsing must not be stored. Issue #97 tracks skipping history in private windows.

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

To test: click the toolbar icon and press Run test. The test takes about 20 seconds and
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

- [ ] Open each public listing and check the name, version, icon, screenshots, tags and links. Old listings keep fields from earlier versions until you change them.
- [ ] Install from each store on a clean profile and run one test.
- [ ] Update the store links and versions in the README, `RESOURCES-AND-GUIDE.md` and `apps/site/src/stores.ts` if any changed.
- [ ] Add a line to `docs/STATE.md`, and post in the launch log (`~/.claude/launch-log.md`) if the release is announced.

## Sources

- Firefox: [Add-on policies](https://extensionworkshop.com/documentation/publish/add-on-policies/), [Source code submission](https://extensionworkshop.com/documentation/publish/source-code-submission/)
- Edge: [Developer policies for Microsoft Edge Add-ons](https://learn.microsoft.com/en-us/legal/microsoft-edge/extensions/developer-policies)
- Opera: [Acceptance criteria](https://help.opera.com/en/extensions/acceptance-criteria/)
- Chrome: [Program policies](https://developer.chrome.com/docs/webstore/program-policies/policies)

Last checked against these pages: 2026-10-27.
