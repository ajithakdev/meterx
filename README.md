<p align="center">
  <img src="brand/png/lockup-on-light.png" alt="MeterX" width="420">
</p>

<p align="center">
  <b>Your internet, honestly measured.</b><br>
  A free, open-source speed test that lives in your browser toolbar.
</p>

<p align="center">
  <a href="https://meterx.ajithakdev.com">Website</a> ·
  <a href="https://meterx.ajithakdev.com/get/">Install</a> ·
  <a href="RESOURCES-AND-GUIDE.md">Links and how-tos</a> ·
  <a href="CONTRIBUTING.md">Contribute</a>
</p>

---

Speed tests give you a number. MeterX tells you what it means.

Click the icon, wait about twenty seconds, and you get download, upload, ping, jitter, packet loss and the one most tests skip: **latency under load**. That is why your video call stutters while someone else downloads a game, and MeterX grades it from A to F.

No account. No tracking. Your results never leave your browser unless you share them.

## Install

| Browser | Where |
| --- | --- |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/meterx-by-ajithakdev/) |
| Microsoft Edge | [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/glkpolbkpachomgmmhdkmjnghejbhlfc) |
| Opera | Listing link coming soon |
| Chrome, Brave, Vivaldi | Planned |

Not sure which? [meterx.ajithakdev.com/get](https://meterx.ajithakdev.com/get/) picks the right store for you.

## What you get

- **A real test, fast.** Four download and three upload streams for a fixed time, with the slow start trimmed off.
- **Bufferbloat, graded.** Ping measured while the line is busy, A to F.
- **A plain answer.** Calls, 4K streaming, gaming, big uploads: MeterX says in words what your connection can handle.
- **Memory.** Up to 200 results in the side panel, a trend chart, and how much of your ISP plan actually arrives.
- **Tests on a timer.** Every 30 minutes, 2 hours or daily, with a notice when quality drops.
- **Proof you can hand over.** A PDF report with a report ID that changes if the results are edited, or CSV and JSON with units in every column.
- **Share links with no server.** The whole result rides inside the link.
- **Your own server, if you like.** Tests run against Cloudflare's edge by default, or against one you host.

## Under the hood

```text
apps/extension     the extension: popup, side panel, settings, service worker
apps/site          meterx.ajithakdev.com, running the real extension pages on sample data
services/worker    Cloudflare Worker test server (streams bytes, stores nothing)
services/server    Express server with the same API, for self-hosting
packages/shared    the contract: types, API, version, quality rules, share links
packages/reports   PDF, CSV and JSON builders
brand/             logo and the script that makes every icon and store image
scripts/           store packaging, local dev runner, code map
```

The deep dive is in [CLAUDE.md](CLAUDE.md) and [docs/CODEMAP.md](docs/CODEMAP.md).

## Hack on it

```bash
git clone https://github.com/ajithakdev/meterx.git
cd meterx
npm install
npm run dev:ext    # build the extension, run a local test server on :8787
npm run dev:site   # build and serve the site on :8788
npm test && npm run lint
npm run package    # store uploads in release/
```

To load it, open `chrome://extensions`, turn on Developer mode, choose Load unpacked and pick `apps/extension/dist/`. In MeterX settings, set Custom server to `http://localhost:8787` to test against your local worker. After a change, run `npm run build -w @meterx/extension` and reload.

To self-host the test server, run `npm start` (port 3000) or deploy `services/worker` to your own Cloudflare account.

## Privacy

MeterX collects no personal data. Results stay in your browser and the default test server keeps no logs. Full policy: [meterx.ajithakdev.com/privacy](https://meterx.ajithakdev.com/privacy/).

## License

[AGPL-3.0](LICENSE). The name and logo have their own rules in [TRADEMARK.md](TRADEMARK.md).

Made by Ajith Kumar K ([@ajithakdev](https://github.com/ajithakdev)).
