/**
 * Theme override from settings. Unset follows prefers-color-scheme, which some browsers
 * (Firefox among them) take from the OS rather than the browser's own theme.
 */

/// <reference types="chrome" />

export const THEME_KEY = 'theme';
export type Theme = 'system' | 'light' | 'dark';

function setTheme(theme: unknown): void {
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
}

/** Applies the saved theme now and whenever it changes. Pages with charts redraw on that change themselves. */
export async function applyTheme(): Promise<void> {
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync' && THEME_KEY in changes) setTheme(changes[THEME_KEY].newValue);
    });
    setTheme((await chrome.storage.sync.get(THEME_KEY))[THEME_KEY]);
}
