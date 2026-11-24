import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WORKER_H3_URL, WORKER_URL } from '@meterx/shared';
import { CancelledError, runTest } from './runner';

// Fake clock and fetch: every request settles after a fake delay, so a whole test runs in milliseconds.
type UploadDelay = (h3: boolean, n: number) => number | 'hang' | 429;

function mockServer(uploadDelay: UploadDelay) {
    const uploads = { h3: 0, h2: 0 };
    vi.stubGlobal('fetch', vi.fn((url: string, init: RequestInit = {}) => {
        let ms = 50;
        let status = 200;
        let body: BodyInit | null = null;
        if (url.includes('/upload')) {
            const h3 = url.startsWith(WORKER_H3_URL);
            const d = uploadDelay(h3, h3 ? ++uploads.h3 : ++uploads.h2);
            if (d === 429) status = 429;
            else ms = d === 'hang' ? -1 : d;
        } else if (url.includes('/test-file')) body = new Uint8Array(64 * 1024);
        else if (url.includes('/ip')) body = '{}';
        const signal = init.signal;
        return new Promise<Response>((resolve, reject) => {
            if (signal?.aborted) return reject(signal.reason);
            const abort = () => { clearTimeout(t); reject(signal!.reason); };
            const t = ms < 0 ? undefined : setTimeout(() => {
                signal?.removeEventListener('abort', abort);
                resolve(new Response(body, { status }));
            }, ms);
            signal?.addEventListener('abort', abort, { once: true });
        });
    }));
    return uploads;
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(performance, 'now').mockImplementation(() => Date.now());
    vi.spyOn(AbortSignal, 'timeout').mockImplementation(ms => {
        const c = new AbortController();
        setTimeout(() => c.abort(new DOMException('timed out', 'TimeoutError')), ms);
        return c.signal;
    });
});

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

async function run(signal = new AbortController().signal) {
    const result = runTest(WORKER_URL, signal, () => {});
    result.catch(() => {}); // awaited below; stops an unhandled-rejection warning while time advances
    await vi.advanceTimersByTimeAsync(40_000);
    return result;
}

describe('upload over HTTP/3 with HTTP/2 fallback (#104)', () => {
    it('falls back to the HTTP/2 address when the first HTTP/3 body stalls', async () => {
        const uploads = mockServer(h3 => (h3 ? 'hang' : 200));
        const r = await run();
        expect(uploads.h2).toBeGreaterThan(0);
        expect(r.uploadSpeed).toBeGreaterThan(0);
    });

    it('stays on HTTP/3 when a later request is slow', async () => {
        const uploads = mockServer((h3, n) => (h3 && n > 3 ? 5000 : 200));
        const r = await run();
        expect(uploads.h2).toBe(0);
        expect(r.uploadSpeed).toBeGreaterThan(0);
    });

    it('falls back when HTTP/3 answers with an error', async () => {
        const uploads = mockServer(h3 => (h3 ? 429 : 200));
        const r = await run();
        expect(uploads.h2).toBeGreaterThan(0);
        expect(r.uploadSpeed).toBeGreaterThan(0);
    });

    it('a cancel during the HTTP/3 attempt does not fall back', async () => {
        const ctrl = new AbortController();
        const uploads = mockServer(h3 => {
            if (h3) setTimeout(() => ctrl.abort(), 500);
            return h3 ? 'hang' : 200;
        });
        await expect(run(ctrl.signal)).rejects.toBeInstanceOf(CancelledError);
        expect(uploads.h2).toBe(0);
    });
});
