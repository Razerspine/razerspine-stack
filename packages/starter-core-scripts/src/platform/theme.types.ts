export type Theme = 'dark' | 'light';

export interface StorageLike {
    getItem(key: string): string | null;

    setItem(key: string, value: string): void;

    removeItem?(key: string): void;
}

export interface ThemeServiceOptions {
    storageKey?: string;
    storage?: StorageLike | null;
    autoApply?: boolean;
    dataAttribute?: string;
    fallback?: Theme;
}

export interface ApplyOptions {
    persist?: boolean;
    notify?: boolean;
    applyToDom?: boolean;
}
