import {ApplyOptions, StorageLike, Theme, ThemeServiceOptions} from './theme.types';

/**
 * Service responsible for managing the application's visual theme (light/dark mode).
 * Handles state, DOM updates, system preference detection, and persistence.
 */
export class ThemeService {
    private readonly storageKey: string;
    private readonly storage: StorageLike | null;
    private readonly autoApply: boolean;
    private readonly dataAttribute: string;
    private readonly fallback: Theme;

    /** The currently active theme. */
    private current: Theme | null = null;

    /** Collection of active theme change listeners. */
    private _listeners: Set<(theme: Theme) => void> = new Set();

    /**
     * Creates an instance of ThemeService.
     * @param options - Configuration options for the service.
     */
    constructor(options: ThemeServiceOptions = {}) {
        const {
            storageKey = 'theme',
            storage = typeof localStorage !== 'undefined'
                ? (localStorage as StorageLike)
                : null,
            autoApply = true,
            dataAttribute = 'data-theme',
            fallback = 'light',
        } = options;

        this.storageKey = storageKey;
        this.storage = storage;
        this.autoApply = Boolean(autoApply);
        this.dataAttribute = dataAttribute;
        // Ensure the fallback is strictly 'dark' or 'light'
        this.fallback = fallback === 'dark' ? 'dark' : 'light';
    }

    /**
     * Initializes the service by resolving the initial theme.
     * The resolution order is: Stored theme -> System preference -> Fallback theme.
     */
    public init(): void {
        const initial =
            this._getStoredTheme() || this._detectSystemTheme() || this.fallback;

        this._apply(initial, {
            persist: false, // Don't persist on init if it's just a fallback/system match
            notify: true,
            applyToDom: this.autoApply,
        });
    }

    /**
     * Gets the currently active theme.
     * @returns The current theme ('dark' | 'light'), or null if not initialized.
     */
    public getTheme(): Theme | null {
        return this.current;
    }

    /**
     * Programmatically sets a new theme.
     * Updates the state, persists the choice, and updates the DOM (if autoApply is enabled).
     * @param theme - The new theme to apply ('dark' or 'light').
     */
    public setTheme(theme: Theme): void {
        if (theme !== 'dark' && theme !== 'light') return;

        this._apply(theme, {
            persist: true,
            notify: true,
            applyToDom: this.autoApply,
        });
    }

    /**
     * Subscribes to theme change events.
     * @param cb - Callback function executed when the theme changes.
     * @returns A cleanup function to unsubscribe the listener.
     */
    public onChange(cb: (theme: Theme) => void): () => void {
        if (typeof cb !== 'function') return () => {
        };

        this._listeners.add(cb);
        return () => this._listeners.delete(cb);
    }

    /**
     * Cleans up the service by removing all listeners and resetting the state.
     * Useful for preventing memory leaks when a component/service is destroyed.
     */
    public destroy(): void {
        this._listeners.clear();
        this.current = null;
    }

    /**
     * Internal method to apply the theme state, handle persistence, notify listeners, and update the DOM.
     * @param theme - The theme to apply.
     * @param options - Options dictating which side-effects to execute.
     */
    private _apply(
        theme: Theme,
        {persist = true, notify = true, applyToDom = true}: ApplyOptions = {},
    ): void {
        if (!theme || (theme !== 'dark' && theme !== 'light')) return;

        // Update current internal state
        this.current = theme;

        if (persist) this._saveTheme(theme);

        if (
            applyToDom &&
            typeof document !== 'undefined' &&
            document.documentElement
        ) {
            try {
                // Example: <html data-theme="dark">
                document.documentElement.setAttribute(this.dataAttribute, theme);
            } catch {
                // Ignore DOM errors (e.g., in edge-case environments)
            }
        }

        if (notify) {
            for (const cb of Array.from(this._listeners)) {
                try {
                    cb(theme);
                } catch {
                    // Prevent one failing listener from breaking the rest
                }
            }
        }
    }

    /**
     * Safely reads the stored theme from the storage mechanism.
     * @returns The stored theme, or null if missing/invalid/unavailable.
     */
    private _getStoredTheme(): Theme | null {
        if (!this.storage) return null;

        try {
            const v = this.storage.getItem(this.storageKey);
            return v === 'dark' || v === 'light' ? (v as Theme) : null;
        } catch {
            return null;
        }
    }

    /**
     * Safely persists the given theme to the storage mechanism.
     * @param theme - The theme to save.
     */
    private _saveTheme(theme: Theme): void {
        if (!this.storage) return;

        try {
            this.storage.setItem(this.storageKey, theme);
        } catch {
            // Ignore storage errors (e.g., Safari private mode QuotaExceededError)
        }
    }

    /**
     * Detects the OS/browser system preference for dark mode using matchMedia.
     * @returns 'dark' or 'light' based on preference, or null if detection fails.
     */
    private _detectSystemTheme(): Theme | null {
        try {
            if (
                typeof window !== 'undefined' &&
                typeof window.matchMedia === 'function'
            ) {
                return window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
            }
        } catch {
            // Ignore environment errors
        }
        return null;
    }
}
