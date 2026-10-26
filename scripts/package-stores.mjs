/**
 * Builds the extension and writes one upload per store into release/:
 *   meterx-<version>-chromium.zip  Chrome Web Store, Edge Add-ons, Opera Add-ons
 *   meterx-<version>-firefox.zip   Firefox Add-ons (sidebar instead of side panel, background script, gecko id)
 *   meterx-<version>-source.zip    the source at HEAD, which Firefox reviewers ask for with bundled code
 * and release/upload/<store>/ with that store's package and listing images (text in docs/STORE-LISTINGS.md).
 * @license AGPL-3.0
 */

import { execFileSync } from 'child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { basename, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'apps/extension/dist');
const out = resolve(root, 'release');
const { version } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const run = (cmd, args, cwd = root) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });

/** Chromium manifest to Firefox: same pages, Firefox's own sidebar and background keys, and the listing's id. */
export function toFirefox(m) {
    const f = structuredClone(m);
    f.permissions = f.permissions.filter(p => p !== 'sidePanel');
    delete f.side_panel;
    f.sidebar_action = { default_panel: 'sidepanel.html', default_title: 'MeterX', default_icon: m.icons, open_at_install: false };
    f.background = { scripts: [m.background.service_worker], type: 'module' };
    f.browser_specific_settings = {
        gecko: { id: 'meterx@ajithakdev', strict_min_version: '121.0', data_collection_permissions: { required: ['none'] } },
    };
    return f;
}

const shots = (dir, size) => [1, 2, 3, 4, 5].map(i => `${dir}/screenshot-${i}-${size}.png`);

/** What each store's upload takes: packages from release/ (by suffix), images from brand/png/ (sizes each store requires). */
export const STORE_FILES = {
    edge: ['chromium.zip', 'store/edge-logo-300.png', 'store/promo-440x280.png', 'store/marquee-1400x560.png', ...shots('store', '1280x800')],
    opera: ['chromium.zip', 'store/opera/icon-64.png', 'store/opera/promo-300x188.png', ...shots('store/opera', '800x500')],
    firefox: ['firefox.zip', 'source.zip', 'icons/icon-128.png', ...shots('store', '1280x800')],
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    run('npm', ['run', 'build', '-w', '@meterx/extension']);
    rmSync(out, { recursive: true, force: true });
    mkdirSync(out, { recursive: true });

    run('zip', ['-qr', resolve(out, `meterx-${version}-chromium.zip`), '.'], dist);

    const ff = resolve(out, 'firefox');
    cpSync(dist, ff, { recursive: true });
    const manifest = JSON.parse(readFileSync(resolve(ff, 'manifest.json'), 'utf8'));
    writeFileSync(resolve(ff, 'manifest.json'), JSON.stringify(toFirefox(manifest), null, 2) + '\n');
    run('zip', ['-qr', resolve(out, `meterx-${version}-firefox.zip`), '.'], ff);
    rmSync(ff, { recursive: true, force: true });

    run('git', ['archive', '--format=zip', '-o', resolve(out, `meterx-${version}-source.zip`), 'HEAD']);

    for (const [store, files] of Object.entries(STORE_FILES)) {
        const dir = resolve(out, 'upload', store);
        mkdirSync(dir, { recursive: true });
        for (const f of files) {
            const src = f.endsWith('.zip') ? resolve(out, `meterx-${version}-${f}`) : resolve(root, 'brand/png', f);
            cpSync(src, resolve(dir, basename(src)));
        }
    }
    console.log(`Store packages for ${version} are in release/, one folder per store in release/upload/`);
}
