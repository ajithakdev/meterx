import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applyTheme } from './theme';

function stub(stored: Record<string, unknown>) {
    const root = { dataset: {} as Record<string, string> };
    const listeners: ((c: Record<string, unknown>, area: string) => void)[] = [];
    vi.stubGlobal('document', { documentElement: root });
    vi.stubGlobal('chrome', {
        storage: { sync: { get: async () => stored }, onChanged: { addListener: (f: (typeof listeners)[number]) => listeners.push(f) } },
    });
    return { root, listeners };
}

describe('applyTheme', () => {
    beforeEach(() => vi.unstubAllGlobals());

    it.each(['light', 'dark'])('sets data-theme to %s', async (theme) => {
        const { root } = stub({ theme });
        await applyTheme();
        expect(root.dataset.theme).toBe(theme);
    });

    it('leaves the system setting in charge when unset or unknown', async () => {
        for (const stored of [{}, { theme: 'purple' }]) {
            const { root } = stub(stored);
            await applyTheme();
            expect(root.dataset.theme).toBeUndefined();
        }
    });

    it('follows later changes in sync storage only', async () => {
        const { root, listeners } = stub({});
        await applyTheme();
        listeners[0]({ theme: { newValue: 'dark' } }, 'local');
        expect(root.dataset.theme).toBeUndefined();
        listeners[0]({ theme: { newValue: 'dark' } }, 'sync');
        expect(root.dataset.theme).toBe('dark');
        listeners[0]({ theme: { oldValue: 'dark' } }, 'sync');
        expect(root.dataset.theme).toBeUndefined();
    });
});
