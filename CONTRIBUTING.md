# Contributing to MeterX

Bug reports, test reports from other browsers and fixes are all welcome. Start with a [good first issue](https://github.com/ajithakdev/meterx/labels/good%20first%20issue), or ask in [Discussions](https://github.com/ajithakdev/meterx/discussions) before a large change.

## Setup

You need Node 22 or newer and npm.

```bash
git clone https://github.com/ajithakdev/meterx.git
cd meterx
npm install
npm run dev:ext    # builds the extension, runs a local test server on http://localhost:8787
```

`npm run dev:site` builds and serves the website on http://localhost:8788 instead.

## Load the extension

- Chromium (Chrome, Edge, Opera, Brave): open `chrome://extensions`, turn on Developer mode, choose Load unpacked and pick `apps/extension/dist/`.
- Firefox: run `npm run package`, then open `about:debugging`, choose This Firefox, Load Temporary Add-on, and pick `release/meterx-<version>-firefox.zip`. `dist/` has the Chromium manifest, so Firefox needs the packaged zip.

To test against your local server, set Custom server to `http://localhost:8787` in MeterX settings. After a change, run `npm run build -w @meterx/extension` and reload the extension.

## Project layout

```text
apps/extension     the extension (TypeScript, Manifest V3, esbuild)
apps/site          meterx.ajithakdev.com
services/worker    Cloudflare Worker, the default test server
services/server    Express server with the same API, for self-hosting
packages/shared    types, API constants and rules every part shares
packages/reports   PDF, CSV and JSON builders
```

Every file is listed in [docs/CODEMAP.md](docs/CODEMAP.md). The worker and the server share one API; change both together.

## Commands

| Command | What it does |
| --- | --- |
| `npm run build` | Build the extension, site and server |
| `npm test` | Every workspace's tests, the scripts' tests and the docs check |
| `npm run lint` | ESLint for TypeScript, CSS and Markdown |
| `npm run check:docs` | Docs rules only: sections, links, spelling, headings |
| `npm run package` | Store zips in `release/` |
| `npm start` | Self-host server on port 3000 (after a build) |

## Code style

- TypeScript, strict. No `any` unless there is no other way.
- Keep pages thin: they send `chrome.runtime` messages, and measurement stays in `apps/extension/src/background/`.
- New logic gets a test next to it (`*.test.ts`).
- Prefix unused parameters with `_`.

## Pull requests

1. Branch from `main`.
2. Run `npm run lint && npm run build && npm test`. All three must pass.
3. Write commit messages with a conventional prefix (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
4. Add a line under `## [Unreleased]` in [CHANGELOG.md](CHANGELOG.md) for anything a user would notice.
5. Open the pull request with what changed and why, and how you tested it. Include a screenshot for UI changes.

## Reporting bugs

Use the [bug report form](https://github.com/ajithakdev/meterx/issues/new?template=bug_report.yml). It asks for your browser, versions and any console errors. Security problems go through [SECURITY.md](SECURITY.md).
