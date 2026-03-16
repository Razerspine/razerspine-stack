/**
 * Represents the available UI themes.
 */
export type Theme = 'dark' | 'light';

/**
 * An abstraction for storage mechanisms (like localStorage or sessionStorage).
 * Useful for mocking in tests or providing fallback storage in SSR (Server-Side Rendering) environments.
 */
export interface StorageLike {
    /** Retrieves a value by its key. */
    getItem(key: string): string | null;

    /** Stores a value under a specific key. */
    setItem(key: string, value: string): void;

    /** Removes a specific key from storage (optional). */
    removeItem?(key: string): void;
}

/**
 * Configuration options for initializing the ThemeService.
 */
export interface ThemeServiceOptions {
    /** * The key used to save the theme in storage.
     * @default 'theme'
     */
    storageKey?: string;

    /** * Storage implementation to use. Pass `null` to disable persistence.
     * @default localStorage (if available)
     */
    storage?: StorageLike | null;

    /** * Whether to automatically apply the theme to the DOM (HTML element).
     * @default true
     */
    autoApply?: boolean;

    /** * The data attribute used on the HTML element to reflect the current theme.
     * @default 'data-theme'
     */
    dataAttribute?: string;

    /** * The fallback theme if neither stored theme nor system preference is found.
     * @default 'light'
     */
    fallback?: Theme;
}

/**
 * Internal options controlling how a theme is applied.
 */
export interface ApplyOptions {
    /** Whether to save the theme to storage. */
    persist?: boolean;

    /** Whether to notify subscribed listeners about the theme change. */
    notify?: boolean;

    /** Whether to update the DOM attribute. */
    applyToDom?: boolean;
}
